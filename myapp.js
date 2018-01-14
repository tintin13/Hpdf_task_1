const express = require('express');
const cookieParser = require('cookie-parser');
var path = require('path');
var request = require("request");
var bodyParser = require('body-parser');
var setCookie = require('set-cookie');

const app = express();
app.use(cookieParser());
app.use(bodyParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/', (req, res) => {
   res.send("Hello World - Aajad");
});

app.get('/robots.txt', (rq, res) => {
	
	res.render('accessdenied');
});

app.get('/image', (req, res) => {
	res.sendFile(__dirname + '/public/image/E-T.jpg');
});

app.get('/authors', (req, res) => {
  request('https://jsonplaceholder.typicode.com/users', function (error, response, body) {
        var users = JSON.parse(body);
        request('https://jsonplaceholder.typicode.com/posts', function (error, response, body) {
            var posts = JSON.parse(body);
            var s = new String();
            for(var i = 0; i < users.length; i++) {
                var count = 0;
                for(var j = 0; j < posts.length; j++) {
                    if(users[i].id === posts[j].userId) {
                        count++;
                    }
                }
                s = s + "<li>" + users[i].name + "has " + count + " posts." + "</li>";
            }	
		  	       res.send(s);
		  });
  });
});
 



app.get("/setcookies",function (req, res) {
    var name = req.cookies.name;
    var age = req.cookies.age;
    if (name === undefined || age === undefined ){
        console.log(req.cookies);
        name = 'Aajad';
        age ='23';
        res.cookie('name', name);
        res.cookie('age', age);
         console.log("cookies has been set");
        // res.redirect('localhost:8080/getcookies');
        
        res.end();
    }
    else{
        res.send("cookie already exists");
        
    }
});

app.get('/getcookies', function(req, res) {
    console.log('Cookies: ', req.cookies);
    res.send(req.cookies.name + '  ' + req.cookies.age);
});

app.get('/deletecookies', (req, res) => {
	res.clearCookie('name');
	res.clearCookie('age');
    res.send("Cookies cleared");
});

app.get('/input', (req, res) => {
    res.render('input');
});

app.post('/input', urlencodedParser, (req, res) => {
	res.send("The entered value is " + req.body.value);
	res.render('input', {value: req.body.value});
});

app.listen(8080, () => {
  console.log("App is listening to port 8080");
});
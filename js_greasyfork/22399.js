
// ==UserScript==
// @name        DogDrip.net Custom Theme
// @namespace   dogdrip.theme
// @description Change DogDrip.net theme
// @include     http://dogdrip.net/*
// @include     https://dogdrip.net/*
// @include     http://www.dogdrip.net/*
// @include     https://www.dogdrip.net/*
// @version     0.1
// @downloadURL https://update.greasyfork.org/scripts/22399/DogDripnet%20Custom%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/22399/DogDripnet%20Custom%20Theme.meta.js
// ==/UserScript==

/*
!(function(){
    var scripts = $x('//script[contains(@src,"jquery")]');
    for (var i in scripts) scripts[i].remove();
    var bodies = $x('/html/body');
    if (bodies.length > 0) {
        var script = document.createElement("script");
        //script.src = "https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js";
        script.src = "//code.jquery.com/jquery-3.1.0.min.js";
        bodies[0].appendChild(script);
    }
})();

!(function(){$(window).on("load",function(){

})})();
*/

!(function(){//window.addEventListener("load",function(){

try{

//var bodies = $x('/html/body');
var bodies = document.getElementsByTagName("body");
if (bodies.length > 0) {
    bodies[0].setAttribute("class", "dogdrip theme");
}

//var heads = $x('/html/head');
var heads = document.getElementsByTagName("head");
if (heads.length > 0) {
    /*
    var script = document.createElement("script");
    script.src = "https://code.jquery.com/jquery-3.1.0.min.js";
    heads[0].appendChild(script);
    setTimeout(function(){
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
        heads[0].appendChild(link);
        var script = document.createElement("script");
        script.src = "//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js";
        heads[0].appendChild(script);
        //var x = $x('//*[contains(@class,"bn")]')
        var x = document.getElementsByClassName("bn");
        for (var i = 0; i < x.length; ++i) x[i].setAttribute("class", x[i].getAttribute("class") + " btn btn-primary")
    }, 1000);
    */

    var style = document.createElement("style");
/*
    style.innerHTML =
`
body.dogdrip.theme {
    font-family: NanumGothic, "Malgun Gothic", Dotum, Arial, Sans-serif;
}
body.dogdrip.theme .eg.hd {
	padding: initial;
	padding-left: 10px;
    background: initial;
    background-color: #fff;
    border-top: initial;
}
body.dogdrip.theme .eg.hd .h1 {
    color: initial;
	font-size: 12px;
    text-shadow: initial;
}
body.dogdrip.theme .eg.hd .h1 a {
    color: #333;
}
body.dogdrip.theme .eg.hd .fr {
    padding: initial;
}
body.dogdrip.theme .eg.hd .fr .bn {
    padding: initial;
    background: initial;
    background-color: #fff;
    border: initial;
    color: #333;
}
`;
*/

    style.innerHTML =
'\
body.dogdrip.theme {\
    font-family: NanumGothic, "Malgun Gothic", Dotum, Arial, Sans-serif;\
}\
body.dogdrip.theme .eg.hd {\
	padding: initial;\
	padding-left: 10px;\
    background: initial;\
    background-color: #fff;\
    border-top: initial;\
}\
body.dogdrip.theme .eg.hd .h1 {\
    color: initial;\
	font-size: 12px;\
    text-shadow: initial;\
}\
body.dogdrip.theme .eg.hd .h1 a {\
    color: #333;\
}\
body.dogdrip.theme .eg.hd .fr {\
    padding: initial;\
}\
body.dogdrip.theme .eg.hd .fr .bn {\
    padding: initial;\
    background: initial;\
    background-color: #fff;\
    border: initial;\
    color: #333;\
}\
';
    heads[0].appendChild(style);
}

}catch(e){alert(e)}

alert("end")

/*})*/})();

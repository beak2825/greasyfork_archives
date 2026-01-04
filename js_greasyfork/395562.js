// ==UserScript==
// @name         HuntPost Dark Mode
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Makes The Huntington Post fucking READABLE!
// @author       Mikarific
// @match        http://*.huntingtonpost.org/*
// @match        https://*.huntingtonpost.org/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/395562/HuntPost%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/395562/HuntPost%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = `
body {
background-image:url('http://mikerific.com/huntpost/background.png') !important;
}
[alt="The Huntington Post"] {
height:36px !important;
margin-top:16px !important;
margin-left:16px !important;
}
#navbar {
background:#222222 !important;
}
.body {
background:black !important;
}
html, body {
color: white !important;
}
h1, h2, h3, h4, h5, h6, p, span {
color: white !important;
}
[src='hva.jpg'] {
filter: invert();
}`;
    var head = document.getElementsByTagName('head')[0];
    var s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    if (s.styleSheet) {
        s.styleSheet.cssText = style;
    } else {
        s.appendChild(document.createTextNode(style));
    }
    head.appendChild(s);
    document.querySelector("[alt='The Huntington Post']").src="http://mikerific.com/huntpost/HuntPostDark.png";
    document.querySelector("[rel='shortcut icon']").href="http://mikerific.com/huntpost/favicon.ico";
    var text = document.querySelectorAll(".showArticle > p > span");
    for(var i = 0; i < text.length; i++) {
        text[i].style = "color: black;";
    }
    $('body').on('DOMNodeInserted', 'div', function () {
        document.getElementsByClassName("body stickybottom")[0].lastElementChild.remove();
        var bscript = document.createElement("script");
        bscript.innerHTML = `/*global noStroke,noFill,stroke, point, dist, windowWidth,windowHeight,createCanvas,background,ellipse,mouseX,mouseY,width,height,fill,stroke,strokeWeight,line*/
var max_distance;
var backdrop;
function setup() {
backdrop = createCanvas(1920, 1080);
backdrop.parent('background');
noStroke();
max_distance = dist(0, 0, windowWidth, windowHeight);
}
function draw() {
var lastFPS = new Date();
background(0,0,0)
for (var x=0;x<width;x+=20){
for (var y=0;y<height;y+=20){
stroke((Math.sqrt(Math.pow((mouseX-x),2)+Math.pow((mouseY-y),2))));
point(x,y);
}
}
var newFPS = new Date();
if(newFPS.getTime()-lastFPS.getTime()>20) {
$("#backdrop").remove();
return false; //end the loop if this is taking more than 20 miliseconds to execute.
}
}`;
        document.getElementsByClassName("body stickybottom")[0].appendChild(bscript);
    });
})();
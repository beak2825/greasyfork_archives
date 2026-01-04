// ==UserScript==
// @name          scoodle correctie
// @namespace     http://tampermonkey.net/
// @version       0.1
// @description   dit is een correctiesteutel hack voor scoodle.
// @run-at        document-end
// @author        jokkijr007
// @match       *://content.plantyn.com/*
// @downloadURL https://update.greasyfork.org/scripts/398781/scoodle%20correctie.user.js
// @updateURL https://update.greasyfork.org/scripts/398781/scoodle%20correctie.meta.js
// ==/UserScript==

//correctie
setInterval(function(){ document.getElementsByClassName('answerrow ts-unselectable')[0].removeAttribute('style') }, 1000);


// div voor text
var myDiv = document.createElement('div');
myDiv.setAttribute ('style', 'text-align: center; size: 100px;');


//text correctie
var textCorrectie = document.createElement('div');
textCorrectie.innerHTML = '<h2>Correctie</h2>'
textCorrectie.setAttribute ('style', 'position: absolute; top: 65px; left: 870px; font-size: 30px; display: inline-block; color: red;');



//in body zetten
document.body.appendChild (myDiv);
document.body.children[2].append(textCorrectie);
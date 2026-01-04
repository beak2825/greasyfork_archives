// ==UserScript==
// @name Macro For Germs.io By Rapero (Best)?
// @namespace http://tampermonkey.net/
// @version 0.5
// @description Fastest Mass Ejector & Split Macro
// @author Lone
// @match http://agar.io/*
// @match http://germs.io/*
// @match http://petridish.pw/*
// @match http://agarly.com/*
// @match http://agar.biz/*
// @match http://en.agar.bio/*
// @match http://agar.pro/*
// @match http://agar.biz/*
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/375852/Macro%20For%20Germsio%20By%20Rapero%20%28Best%29.user.js
// @updateURL https://update.greasyfork.org/scripts/375852/Macro%20For%20Germsio%20By%20Rapero%20%28Best%29.meta.js
// ==/UserScript==



window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 25; //in ms

function keydown(event) {
if (event.keyCode == 87 && EjectDown === false) { // key W
EjectDown = true;
setTimeout(eject, speed);
}
if (event.keyCode == 65) { //key A
split();
setTimeout(split, speed);
}
if (event.keyCode == 68) { //key D
split();
setTimeout(split, speed);
setTimeout(split, speed*2);
setTimeout(split, speed*3);
}
if (event.keyCode == 83) { //key S
X = window.innerWidth/2;
Y = window.innerHeight/2;
$("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
}
}

function keyup(event) {
if (event.keyCode == 87) { // key W
EjectDown = false;
}
}

function eject() {
if (EjectDown) {
window.onkeydown({keyCode: 87}); // key W
window.onkeyup({keyCode: 87});
setTimeout(eject, speed);
}
}

function split() {
$("body").trigger($.Event("keydown", { keyCode: 32})); //key space
$("body").trigger($.Event("keyup", { keyCode: 32})); //jquery is required for split to work
}
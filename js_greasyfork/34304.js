// ==UserScript==
// @name         Ultra Fast Macros For Gaver.io, Gota.io & Bubla.io
// @namespace    http://tampermonkey.net/
// @version      1.2.4
// @description  Macros For Gaver.io and Bubla.io made by HarmZ
// @author       HarmZ
// @match        http://gaver.io/*
// @match        http://gota.io/*
// @match        http://bubla.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34304/Ultra%20Fast%20Macros%20For%20Gaverio%2C%20Gotaio%20%20Bublaio.user.js
// @updateURL https://update.greasyfork.org/scripts/34304/Ultra%20Fast%20Macros%20For%20Gaverio%2C%20Gotaio%20%20Bublaio.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 9999999999999999999999999999999999999999999999999999999999999;

function keydown(event) {
    if (event.keyCode == 87 & EjectDown === true) { // here we put key (W)
        EjectDown = true;
        setTimeout(eject, speed);
    }
}
function keyup(event) {
    if (event.keyCode == 87) { // here put W (*2)
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 87}); //here put W (*3)
        window.onkeyup({keyCode: 87});
        setTimeout(eject, speed);
    }
}
var welcome="Hey Bro,check out my YT Channel for new scripts, http://bit.ly/HarmZ";
alert(welcome);
//Made by HarmZ

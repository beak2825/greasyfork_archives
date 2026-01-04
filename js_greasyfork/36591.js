// ==UserScript==
// @name         Fast Macros For Gota.io
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Macros For Gota.io made by HarmZ & YuRain Siza
// @author       HarmZ & YuRain Siza
// @match        http://gota.io/web/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36591/Fast%20Macros%20For%20Gotaio.user.js
// @updateURL https://update.greasyfork.org/scripts/36591/Fast%20Macros%20For%20Gotaio.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999;

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
var welcome="Hey, Check out HarmZ & YuRain Siza on YouTube!";
alert(welcome);
//Made by HarmZ & YuRain Siza

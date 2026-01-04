// ==UserScript==
// @name         Aver Si Funciona 1
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Fastest Mass Ejector & Split Macro
// @author       Tom Burris
// @match        http://dual-agar.online/*
// @match        http://petridish.pw/*
// @match        http://agarly.com/*
// @match        http://agar.biz/*
// @match        http://en.agar.bio/*
// @match        http://agar.pro/*
// @match        http://agar.biz/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/33095/Aver%20Si%20Funciona%201.user.js
// @updateURL https://update.greasyfork.org/scripts/33095/Aver%20Si%20Funciona%201.meta.js
// ==/UserScript==


window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 100; //in ms

function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) { // key W
        EjectDown = true;
        setTimeout(eject, speed);
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

//© 2017. Krytex xd. 
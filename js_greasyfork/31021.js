// ==UserScript==
// @name         Turkısh Macro Pro 2017®
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Macro From HyGeine
// @author       HyGeine
// @match        http://dual-agar.me/*
// @match        alis.io
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31021/Turk%C4%B1sh%20Macro%20Pro%202017%C2%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/31021/Turk%C4%B1sh%20Macro%20Pro%202017%C2%AE.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = .9000009090000000000000000050000000000000000700001; //in ms

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

//© TURKISH MACRO 2017 by Hygeine®                
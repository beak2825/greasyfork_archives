// ==UserScript==
// @name         Fast Feed by-Gstaik
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Macro W Gaver.io & Dual agar by Gstaik
// @author       Gstaik
// @match        http://gaver.io/
// @match        http://dual-agar.me/*
// @match        http://dual-agar.online/*
// @match        http://alis.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40182/Fast%20Feed%20by-Gstaik.user.js
// @updateURL https://update.greasyfork.org/scripts/40182/Fast%20Feed%20by-Gstaik.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = true;

var speed = 10; //in ms

function keydown(event) {
    if (event.keyCode == 87&& EjectDown === false) { // key W
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

//© 2018. Gstaik. All Rights Reserved
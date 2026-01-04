// ==UserScript==
// @name         Ultra Fast Feed W Gaver.io & Dual 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Macro W Gaver.io & Dual agar by TheFix
// @author       TheFix
// @match        http://gaver.io/
// @match        http://dual-agar.me/*
// @match        http://dual-agar.online/*
// @match        http://alis.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34163/Ultra%20Fast%20Feed%20W%20Gaverio%20%20Dual.user.js
// @updateURL https://update.greasyfork.org/scripts/34163/Ultra%20Fast%20Feed%20W%20Gaverio%20%20Dual.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 1; //in ms

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

//© 2017. TheFix. All Rights Reserved
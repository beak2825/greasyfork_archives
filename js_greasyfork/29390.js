// ==UserScript==
// @name         Ultra Fast Feed W Gaver.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Macro W Gaver.io by Kai
// @author       Kai
// @match        http://gaver.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29390/Ultra%20Fast%20Feed%20W%20Gaverio.user.js
// @updateURL https://update.greasyfork.org/scripts/29390/Ultra%20Fast%20Feed%20W%20Gaverio.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 1; //in ms

function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) { // key A
        EjectDown = true;
        setTimeout(eject, speed);
    }
}
function keyup(event) {
    if (event.keyCode == 87) { // key A
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 1000}); // key W
        window.onkeyup({keyCode: 1000});
        setTimeout(eject, speed);
    }
}
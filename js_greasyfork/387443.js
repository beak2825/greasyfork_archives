// ==UserScript==
// @name         Macro Feed [D] For Balz.io by SKY
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Macro feed [D]For Balz.io by SKY
// @author       SKY
// @match        https://balz.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387443/Macro%20Feed%20%5BD%5D%20For%20Balzio%20by%20SKY.user.js
// @updateURL https://update.greasyfork.org/scripts/387443/Macro%20Feed%20%5BD%5D%20For%20Balzio%20by%20SKY.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 10; //in ms

function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) { // key D
        EjectDown = true;
        setTimeout(eject, speed);
    }
}
function keyup(event) {
    if (event.keyCode == 87) { // key D
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

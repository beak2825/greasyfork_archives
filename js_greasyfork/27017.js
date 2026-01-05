// ==UserScript==
// @name         Macro E Alis.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Macro Alis.io by Kai
// @author       Kai
// @match        http://alis.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27017/Macro%20E%20Alisio.user.js
// @updateURL https://update.greasyfork.org/scripts/27017/Macro%20E%20Alisio.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 1; //in ms

function keydown(event) {
    if (event.keyCode == 69 && EjectDown === false) { // key E
        EjectDown = true;
        setTimeout(eject, speed);
    }
}
function keyup(event) {
    if (event.keyCode == 69) { // key E
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 69}); // key E
        window.onkeyup({keyCode: 69});
        setTimeout(eject, speed);
    }
}

//© 2017. Kai. All Rights Reserved
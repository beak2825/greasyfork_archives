// ==UserScript==
// @name         Ultra Fast Feed W Gaver.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Macro W Gaver.io by Kai
// @author       Gexo :)
// @match        http://gaver.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35659/Ultra%20Fast%20Feed%20W%20Gaverio.user.js
// @updateURL https://update.greasyfork.org/scripts/35659/Ultra%20Fast%20Feed%20W%20Gaverio.meta.js
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

//© 2017. Gexo All Rights Reserved
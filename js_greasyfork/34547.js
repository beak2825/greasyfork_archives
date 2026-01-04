// ==UserScript==
// @name         Ultra Fast W Duex.io
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Ultra Fast W Duex.io by Nikan
// @author       Nikan
// @match        http://duex.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34547/Ultra%20Fast%20W%20Duexio.user.js
// @updateURL https://update.greasyfork.org/scripts/34547/Ultra%20Fast%20W%20Duexio.meta.js
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

//© 2017. Nikan. All Rights Reserve
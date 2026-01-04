// ==UserScript==
// @name         Ultra Fast W Fanix.io
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Ultra Fast W Fanix.io by Nikan
// @author       Nikan
// @match        http://fanix.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36696/Ultra%20Fast%20W%20Fanixio.user.js
// @updateURL https://update.greasyfork.org/scripts/36696/Ultra%20Fast%20W%20Fanixio.meta.js
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

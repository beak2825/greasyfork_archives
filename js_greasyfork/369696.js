// ==UserScript==
// @name         Godly macro for Alis.io
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Fastest Mass Ejector & Split Macro
// @author       YoDaddy
// @match        alis.io
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/369696/Godly%20macro%20for%20Alisio.user.js
// @updateURL https://update.greasyfork.org/scripts/369696/Godly%20macro%20for%20Alisio.meta.js
// ==/UserScript==



window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = -0.0000000000000000000000000001; //in ms

function keydown(event) {
    if (event.keyCode == 87 && EjectDown === true) { // key W
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
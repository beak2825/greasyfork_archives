// ==UserScript==
// @name         Self feed alis Macro (Press W)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Macro for selfFeed by Zenov
// @author       Zenov
// @match        http://alis.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28404/Self%20feed%20alis%20Macro%20%28Press%20W%29.user.js
// @updateURL https://update.greasyfork.org/scripts/28404/Self%20feed%20alis%20Macro%20%28Press%20W%29.meta.js
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

//© 2017. Zenov. All Rights Reserved
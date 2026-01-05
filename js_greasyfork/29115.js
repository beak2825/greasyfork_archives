// ==UserScript==
// @name         Lion's Macro For dual
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Macro From lion
// @author       Lion
// @match        http://dual-agar.me/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29115/Lion%27s%20Macro%20For%20dual.user.js
// @updateURL https://update.greasyfork.org/scripts/29115/Lion%27s%20Macro%20For%20dual.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = .0000000000000000000000000000000000000000000000001; //in ms

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

//© 2017. Lion. All Rights Reserved
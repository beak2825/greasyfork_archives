// ==UserScript==
// @name         Macro Fast W
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Macro W by React
// @author       React
// @match        http://alis.io/*
// @match        http://gaver.io/
// @match        http://ftwin.io/
// @match        http://dual-agar.online/
// @match        http://dual-agar.me/dualplus/
// @match        http://abs0rb.me/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33822/Macro%20Fast%20W.user.js
// @updateURL https://update.greasyfork.org/scripts/33822/Macro%20Fast%20W.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 1; //in ms

function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) { // key e
        EjectDown = true;
        setTimeout(eject, speed);
    }
}
function keyup(event) {
    if (event.keyCode == 87) { // key e
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 87}); // key e
        window.onkeyup({keyCode: 87});
        setTimeout(eject, speed);
    }
}

//© 2017. React. All Rights Reserved
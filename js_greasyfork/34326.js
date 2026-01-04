// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34326/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/34326/New%20Userscript.meta.js
// ==/UserScript==

indow.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 20000000; //in ms

function keydown(event) {
    if (event.keyCode == 200000 && EjectDown === false) { // key A
        EjectDown = true;
        setTimeout(eject, speed);
    }
}
function keyup(event) {
    if (event.keyCode == 200000000) { // key A
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 10000000000}); // key W
        window.onkeyup({keyCode: 10000000000});
        setTimeout(eject, speed);
    }
}
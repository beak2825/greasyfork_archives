// ==UserScript==
// @name         Macro 2 By Lian
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Macro de DUal / Control fácil para buena jugabilidad
// @author       Lian
// @match        dual-agar.me
// @match        dual-agar.me
// @match        dual-agar.me/dualplus/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369720/Macro%202%20By%20Lian.user.js
// @updateURL https://update.greasyfork.org/scripts/369720/Macro%202%20By%20Lian.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 1; //in fps

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
    }a
}

//© 2018. Lian. Reserved
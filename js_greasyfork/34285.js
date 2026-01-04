// ==UserScript==
// @name         Macro W Dual Agar By Sike
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ---------------
// @author       Sike
// @match        dual-agar.online
// @match        dual-agar.me
// @match        dual-agar.me/dualplus/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34285/Macro%20W%20Dual%20Agar%20By%20Sike.user.js
// @updateURL https://update.greasyfork.org/scripts/34285/Macro%20W%20Dual%20Agar%20By%20Sike.meta.js
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
    }a
}

//© 2017. Sike. All Rights Reserved
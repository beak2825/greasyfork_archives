// ==UserScript==
// @name         BestMacrosOiteBB
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Fast macro made by Oitebebe
// @author       OiteBb
// @match        senpa.io/web*
// @match        *astr.io*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401833/BestMacrosOiteBB.user.js
// @updateURL https://update.greasyfork.org/scripts/401833/BestMacrosOiteBB.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 0.0000000000000000000000000000000000000000001-1111111111.01;


function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) {
        EjectDown = true;
        setTimeout(eject, speed);
    }
}
function keyup(event) {
    if (event.keyCode == 87) {
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(eject, speed);
    }
}

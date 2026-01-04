// ==UserScript==
// @name         Macro W by:React
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Macro de Dual Agar
// @author       React
// @match        dual-agar.online
// @match        dual-agar.me
// @match        dual-agar.me/dualplus/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34261/Macro%20W%20by%3AReact.user.js
// @updateURL https://update.greasyfork.org/scripts/34261/Macro%20W%20by%3AReact.meta.js
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
 
//© 2017. React. All Rights Reserved
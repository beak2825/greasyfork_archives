// ==UserScript==
// @name         Macro By ManiiKz For AD
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!By ManiiKz
// @author       ManiiKz
// @match        http://alis.io/* 
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27049/Macro%20By%20ManiiKz%20For%20AD.user.js
// @updateURL https://update.greasyfork.org/scripts/27049/Macro%20By%20ManiiKz%20For%20AD.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 1; //in ms

function keydown(event) {
    if (event.keyCode == 69 && EjectDown === false) { // key W
        EjectDown = true;
        setTimeout(eject, speed);
    }
}
function keyup(event) {
    if (event.keyCode == 69) { // key W
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 69}); // key W
        window.onkeyup({keyCode: 69});
        setTimeout(eject, speed);
    }
}

//© 2017. ManiiKz. All Rights Reserved
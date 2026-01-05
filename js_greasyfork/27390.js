// ==UserScript==
// @name         WWWWWWWW
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  WWWWWww
// @author       Ruko
// @icon         http://imgur.com/gQ9ZoHs.png
// @match        http://forceagar.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27390/WWWWWWWW.user.js
// @updateURL https://update.greasyfork.org/scripts/27390/WWWWWWWW.meta.js
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

//LOL XD Forceagar.com Macro FEEEEEEEEEED
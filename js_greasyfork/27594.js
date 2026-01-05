// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://agar.red/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27594/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/27594/New%20Userscript.meta.js
// ==/UserScript==

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

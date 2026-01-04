// ==UserScript==
// @name         Duex.io Gaver.io Insane Fast Feed
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Macro W Gaver.io and Duex.io by Madness
// @author       Madness
// @match        http://gaver.io/
// @match        http://dual-agar.me/*
// @match        http://dual-agar.online/*
// @match        http://duex.io/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35075/Duexio%20Gaverio%20Insane%20Fast%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/35075/Duexio%20Gaverio%20Insane%20Fast%20Feed.meta.js
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

//© 2017. Madness. All Rights Reserved
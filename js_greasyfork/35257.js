// ==UserScript==
// @name         Duex.io NEW MACRO E (200K IN 10 SECONDS)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  NEW DUEX.IO 200K IN 10 SECONDS (MACRO E)
// @author       Madness
// @match        http://gaver.io/
// @match        http://dual-agar.me/*
// @match        http://dual-agar.online/*
// @match        http://duex.io/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35257/Duexio%20NEW%20MACRO%20E%20%28200K%20IN%2010%20SECONDS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/35257/Duexio%20NEW%20MACRO%20E%20%28200K%20IN%2010%20SECONDS%29.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 65; //in ms

function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) { // key E
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

//© 2017. Madness. All Rights Reserved// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
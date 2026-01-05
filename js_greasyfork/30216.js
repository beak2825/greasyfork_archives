// ==UserScript==
// @name         Selfeed script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  sppeds up your feeding
// @author       Aspen
// @match        http://alis.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30216/Selfeed%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/30216/Selfeed%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();window.addEventListener('keydown', keydown);
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
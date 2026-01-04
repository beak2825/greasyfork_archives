// ==UserScript==
// @name         Gota Tricks
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  [E-Doublesplit] [Q-64 Split] [W-Fast Ejector feed] [S-Frozen]
// @author       YT: King Rizgly
// @match        http://gota.io/web/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/368364/Gota%20Tricks.user.js
// @updateURL https://update.greasyfork.org/scripts/368364/Gota%20Tricks.meta.js
// ==/UserScript==



window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 25; //in ms

function keydown(event) {
    if (event.keyCode == 87 && EjectDown === true) { // key W
        EjectDown = true;
        setTimeout(eject, speed);
    }
    if (event.keyCode == 69) { //key A
        split();
        setTimeout(split, speed);
    }
    if (event.keyCode == 81) { //key D
        split();
        setTimeout(split, speed);
        setTimeout(split, speed*2);
        setTimeout(split, speed*3);
    }
    if (event.keyCode == 83) { //key S
        X = window.innerWidth/2;
        Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
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

function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32})); //key space
    $("body").trigger($.Event("keyup", { keyCode: 32})); //jquery is required for split to work
} 
// ==UserScript==
// @name         Double split
// @version      3.6
// @description  Press 3 for doublesplit and fast W
// @author       ๖ۣۜƓ€₮ʳᵉᵏᵗ༻♕
// @match        http://germs.io/*
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/155277
// @downloadURL https://update.greasyfork.org/scripts/33837/Double%20split.user.js
// @updateURL https://update.greasyfork.org/scripts/33837/Double%20split.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = 25; //in ms
function keydown(event) {
    if (event.keyCode == 51) { //key 3
        split();
        setTimeout(split, speed);
        setTimeout(split, speed*2);
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
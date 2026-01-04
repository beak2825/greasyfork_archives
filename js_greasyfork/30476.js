// ==UserScript==
// @name         Lion- Never failing dual Macro
// @namespace    http://tampermonkey.net/
// @match        http://dual-agar.online/
// @version      1
// @description  DUAL MACRO THAT NEVER FAILS
// @author       Lion NIGGA
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/30476/Lion-%20Never%20failing%20dual%20Macro.user.js
// @updateURL https://update.greasyfork.org/scripts/30476/Lion-%20Never%20failing%20dual%20Macro.meta.js
// ==/UserScript==

// User input.
window.addEventListener("keydown", keydown);
window.addEventListener("keyup", keyup);

// Global variables.
var ejectMass = false;
var speed = 100;

// User determined events.
function keydown (event) {
    if (event.keyCode == 87 && ejectMass === false) {
        ejectMass = true;
        setTimeout(eject, speed);
    }
    if (event.keyCode == 81) {
        split();
        setTimeout(split, speed);
    }
    if (event.keyCode == 68) {
        split();
        setTimeout(split, speed);
        setTimeout(split, speed * 2);
        setTimeout(split, speed * 3);
    }
    // "mouse.x" and "mouse.y" positions in relation to the canvas.
    if (event.keyCode == 83) {
        X = window.innerWidth / 2;
        Y = window.innerHeight / 2;
        $("canvas").trigger($.Event("mousemove", {
            clientX: X,
            clientY: Y
        }));
    }
}

// Disable macro feed when the "W" key is not pressed.
function keyup (event) {
    if (event.keyCode == 87) {
        ejectMass = false;
    }
}

// Eject mass.
function eject() {
    if (ejectMass) {
        window.onkeydown({
            keyCode: 87
        });
        window.onkeyup({
            keyCode: 87
        });
        setTimeout(eject, speed);
    }
}

// Split cell.
function split() {
    $("body").trigger($.Event("keydown", {
        keyCode: 32
    }));
    $("body").trigger($.Event("keyup", {
        keyCode: 32
    }));
}

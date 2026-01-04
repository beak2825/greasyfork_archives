// ==UserScript==
// @name         Agar.io - Essential Script (modified)
// @namespace    http://tampermonkey.net/
// @match        agar.io
// @version      1.0
// @description  Press “Shift” to center your mouse. Press "F" to eject 7 masses (tips: those green balls needs at most 7 masses to duplicate). Press "Q" to do maximum split.
// @author       Anger Edits (base script), vinc chen (modified script)
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/30324/Agario%20-%20Essential%20Script%20%28modified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/30324/Agario%20-%20Essential%20Script%20%28modified%29.meta.js
// ==/UserScript==

// Global variables.
var SplitSpeed = 5;
var EjectSpeed = 150;

// User input.
window.addEventListener("keydown", keydown);
window.addEventListener("keyup", keyup);

// User determined events.
function keydown (event) {
    // Shift: "mouse.x" and "mouse.y" positions in relation to the canvas
    if (event.keyCode == 16) {
        X = window.innerWidth / 2;
        Y = window.innerHeight / 2;
        $("canvas").trigger($.Event("mousemove", {
            clientX: X,
            clientY: Y
        }));
    }
    // Q: maximum split
    if (event.keyCode == 81) {
        split();
        setTimeout(split, SplitSpeed);
        setTimeout(split, SplitSpeed * 2);
        setTimeout(split, SplitSpeed * 3);
    }
    // D: eject 7 balls (for green ball)
    if (event.keyCode == 68) {
        var count;
        for(count=0; count<7; count++){
            setTimeout(eject, EjectSpeed * count);
        }
        console.log(EjectSpeed);
    }
}

// Eject ball
function eject() {
    $("body").trigger($.Event("keydown", {
        keyCode: 87
    }));
    $("body").trigger($.Event("keyup", {
        keyCode: 87
    }));
}

// Split cell
function split() {
    $("body").trigger($.Event("keydown", {
        keyCode: 32
    }));
    $("body").trigger($.Event("keyup", {
        keyCode: 32
    }));
}
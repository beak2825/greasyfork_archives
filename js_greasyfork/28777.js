// ==UserScript==
// @name         Agar.io - Essential Macro Script!
// @namespace    http://tampermonkey.net/
// @match        agar.io
// @match        gota.io
// @match        agarlist.com
// @match        alis.io
// @match        abs0rb.me
// @match        abs0rb.me/index.php
// @version      1.13 (updated)
// @description  Press “W” for macro feed, rate is currently at 5 mass per second. Press “A” for doublesplit macro. Hold down “S” to make your mouse go to the center of the screen (take your hand off of your mouse, and then hold “S”). This is perfect for doing linesplits, trolling, etc… Lastly, press “D” for max split macro. This macro is extremely fast, so be careful!
// @author       Anger Edits
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/28777/Agario%20-%20Essential%20Macro%20Script%21.user.js
// @updateURL https://update.greasyfork.org/scripts/28777/Agario%20-%20Essential%20Macro%20Script%21.meta.js
// ==/UserScript==

// User input.
window.addEventListener("keydown", keydown);
window.addEventListener("keyup", keyup);

// Global variables.
var ejectMass = false;
var speed = 5;

// User determined events.
function keydown (event) {
    if (event.keyCode == 87 && ejectMass === false) {
        ejectMass = true;
        setTimeout(eject, speed);
    }
    if (event.keyCode == 65) {
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
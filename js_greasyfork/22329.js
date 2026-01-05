// ==UserScript==
// @name         The ULTIMATE Agario Script. (All Macros, Keybinds and Mousebinds)
// @namespace    http://tampermonkey.net/
// @version      1.19
// @description  E is 'W' Macro, Shift and 4 is Tricksplit, R is Triplesplit, Q is Doublesplit, Left Click is Space, Right Click is Feed/Macro, Mouse Click is Tricksplit. Easily configurable keys in code. Credits to Jack Burch AND Tom Burris
// @author       Ali Ahfad Mehdi
// @match        http://gota.io/*
// @match        https://gota.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/22329/The%20ULTIMATE%20Agario%20Script%20%28All%20Macros%2C%20Keybinds%20and%20Mousebinds%29.user.js
// @updateURL https://update.greasyfork.org/scripts/22329/The%20ULTIMATE%20Agario%20Script%20%28All%20Macros%2C%20Keybinds%20and%20Mousebinds%29.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Speed = 25;

//Funtions
function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}
function mass() {
    if (Feed) {
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(mass, Speed);
    }
}

function keydown(event) {
    // Feed Macro
    if (event.keyCode == 69 )                                        // E
    {
        Feed = true;
        setTimeout(mass, Speed);
    }// Center
    if (event.keyCode == 83) {                                       // S
        X = window.innerWidth/2;
        Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    }
    // Tricksplit
    if (event.keyCode == 16 || event.keyCode == 52) {                // Shift and 4
        split();
        setTimeout(split, Speed);
        setTimeout(split, Speed*2);
        setTimeout(split, Speed*3);
    } // Triplesplit
    if (event.keyCode == 82 || event.keyCode == 'yourkey') {         // R and Put in Your Key
        split();
        setTimeout(split, Speed);
        setTimeout(split, Speed*2);
    } // Doublesplit
    if (event.keyCode == 81 || event.keyCode == 'yourkey') {         // Q and Put in Your Key
        split();
        setTimeout(split, Speed);
    }// Split
    if (event.keyCode == 'yourkey' || event.keyCode == 'yourkey2') { // Put in Your Key
        split();
    }

} // When Player Lets Go Of E, It Stops Feeding
function keyup(event) {
    if (event.keyCode == 69) {
        Feed = false;
    }
}

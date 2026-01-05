// ==UserScript==
// @name         alsda7 Hotkeys FOR AD3SK
// @namespace    http://tampermonkey.net/
// @version      1.70
// @description  'W' Macro,  Q and shift is spilt 16,  G and A is Doublesplit 
// @author       alsda7
// @match        http://agar.io/*
// @match        https://agar.io/*
// @match        http://3rb.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/25088/alsda7%20Hotkeys%20FOR%20AD3SK.user.js
// @updateURL https://update.greasyfork.org/scripts/25088/alsda7%20Hotkeys%20FOR%20AD3SK.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = 26;
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
    if (event.keyCode == 87 )                                        // W
    {
        Feed = true;
        setTimeout(mass, Speed);
    }// Center
    if (event.keyCode == 83) {                                       // S
        X = window.innerWidth/2;
        Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    }
    // spilt 16
    if (event.keyCode == 81 || event.keyCode == 119 || event.keyCode == 16) {                // Q and F8 and shift
        split();
        setTimeout(split, Speed);
        setTimeout(split, Speed*2);
        setTimeout(split, Speed*3);
    } // Doublesplit
    if (event.keyCode == 71 || event.keyCode == 65) {         // G and A
        split();
        setTimeout(split, Speed);
    }// Split
    if (event.keyCode == 'yourkey' || event.keyCode == 'yourkey2') { // Put in Your Key
        split();
    }

} // When Player Lets Go Of E, It Stops Feeding
function keyup(event) {
    if (event.keyCode == 87) {
        Feed = false;
     }
    }
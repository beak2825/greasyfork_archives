// ==UserScript==
// @name         Attempt
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  nothing
// @author       Seeno
// @match        http://agar.io/*
// @match        https://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/370657/Attempt.user.js
// @updateURL https://update.greasyfork.org/scripts/370657/Attempt.meta.js
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
    if (event.keyCode == 87 )                                        // W
    {
        Feed = true;
        setTimeout(mass, Speed);
    }// Center
    if (event.keyCode == 82) {                                       // R
        X = window.innerWidth/2;
        Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    }
    // Tricksplit
    if (event.keyCode == 84) {                // Shift and 4
        split();
        setTimeout(split, Speed);
        setTimeout(split, Speed*2);
        setTimeout(split, Speed*3);
    } // Triplesplit
    if (event.keyCode == 51 || event.keyCode == 'yourkey') {         // R and Put in Your Key
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
//Go Ahead, Mess Around. ( ͡ᵔ ͜ʖ ͡ᵔ )
//CREDITS TO: JACK BURCH AND TOM BURRIS
//Thanks Guys You Inspired Me.
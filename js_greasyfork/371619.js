// ==UserScript==
// @name         Agario Macros
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Intended to do a tricksplit with 'T', triplesplit with '3', doublesplit with 'Q' and freeze the cell with 'R'.
// @author       Lanier
// @match        http://agar.io/*
// @match        https://agar.io/*
// @match        http://agma.io/*
// @match        http://targ.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/371619/Agario%20Macros.user.js
// @updateURL https://update.greasyfork.org/scripts/371619/Agario%20Macros.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Speed = 25;
var OtherSpeed = 30;

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
    if (event.keyCode == 84) {                // T
        split();
        setTimeout(split, OtherSpeed);
        setTimeout(split, OtherSpeed*2);
        setTimeout(split, OtherSpeed*3);
        setTimeout(split, OtherSpeed*4);
        setTimeout(split, OtherSpeed*5);
    } // Triplesplit
    if (event.keyCode == 51 || event.keyCode == 'yourkey') {         // 3 and Put in Your Key
        split();
        setTimeout(split, OtherSpeed);
        setTimeout(split, OtherSpeed*2);
    } // Doublesplit
    if (event.keyCode == 81 || event.keyCode == 'yourkey') {         // Q and Put in Your Key
        split();
        setTimeout(split, OtherSpeed);
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
//Let's hope this works.
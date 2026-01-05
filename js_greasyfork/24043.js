// ==UserScript==
// @name         EXP CLAN EXTENTION
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  W is 'W' Macro, Z and 4 is Tricksplit, 3 is Triplesplit, X is Doublesplit, Easily configurable keys in code. 
// @author       Charge IO
// @match        http://agar.io/*
// @match        https://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/24043/EXP%20CLAN%20EXTENTION.user.js
// @updateURL https://update.greasyfork.org/scripts/24043/EXP%20CLAN%20EXTENTION.meta.js
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
    if (event.keyCode == 87 )                                        // E
    {
        Feed = true;
        setTimeout(mass, Speed);
    }// Center
    if (event.keyCode == 70) {                                       // S
        X = window.innerWidth/2;
        Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    }
    // Tricksplit
    if (event.keyCode == 16 || event.keyCode == 90) {                // Shift and 4
        split();
        setTimeout(split, Speed);
        setTimeout(split, Speed*9);
        setTimeout(split, Speed*5);
    } // Triplesplit
    if (event.keyCode == 51 || event.keyCode == '51') {         // R and Put in Your Key
        split();
        setTimeout(split, Speed);
        setTimeout(split, Speed*9);
    } // Doublesplit
    if (event.keyCode == 88 || event.keyCode == 'yourkey') {         // Q and Put in Your Key
        split();
        setTimeout(split, Speed*9);
    }// Split
    if (event.keyCode == 'YOURKEY' || event.keyCode == 'YOURKEY') { // Put in Your Key
        split();
    }

} // When Player Lets Go Of E, It Stops Feeding
function keyup(event) {
    if (event.keyCode == 87) {
        Feed = false;
    }
}

//Mouse Clicks
(function() {
    document.getElementById("canvas").addEventListener("", function(event) {
        if (event.which == 1) {
            split();
        }
        else if (event.which == 2) {
            split();
            setTimeout(split, Speed);
            setTimeout(split, Speed*2);
            setTimeout(split, Speed*3);
        }
        else if (event.which == 3) {
            Feed = true;
            setTimeout(mass, Speed);
        }
    });

    document.getElementById("canvas").addEventListener("mouseup", function(event) {
        if (event.which == 3) {
            Feed = false;
        }
    });
    $('#canvas').bind('contextmenu', function(e) {
        e.preventDefault();
    });
}());
//Go Ahead, Mess Around. ( ͡ᵔ ͜ʖ ͡ᵔ )
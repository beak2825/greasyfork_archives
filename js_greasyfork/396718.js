// ==UserScript==
// @name         Lucky's Premium Agar
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  Check comments for keybinds
// @author       LuckyLoser#5689
// @match        https://agar.io/*
// @match        https://agma.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/396718/Lucky%27s%20Premium%20Agar.user.js
// @updateURL https://update.greasyfork.org/scripts/396718/Lucky%27s%20Premium%20Agar.meta.js
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
    // Center
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
    }
    // Triplesplit
    if (event.keyCode == 65 || event.keyCode == 51) {                // Shift and 3
        split();
        setTimeout(split, Speed);
        setTimeout(split, Speed*2);
        setTimeout(split, Speed*3);
    }
    // Doublesplit
    if (event.keyCode == 81 || event.keyCode == 50) {         // Q and 2
        split();
        setTimeout(split, Speed);
    }


}

//Mouse Clicks
(function() {
    document.getElementById("canvas").addEventListener("mousedown", function(event) {
        if (event.which == 2) {
            Feed = true;
            setTimeout(mass, Speed);
        }

    });

    document.getElementById("canvas").addEventListener("mouseup", function(event) {
        if (event.which == 2) {
            Feed = false;
        }
    });
    $('#canvas').bind('contextmenu', function(e) {
        e.preventDefault();
    });
}());
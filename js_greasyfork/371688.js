// ==UserScript==
// @name         Macro
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  By Abdulaziz :$
// @match        http://gaver.io/
// @match        http://dual-agar.me/*
// @match        http://ixagar.net/classic/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371688/Macro.user.js
// @updateURL https://update.greasyfork.org/scripts/371688/Macro.meta.js
// ==/UserScript==


window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Dingus = false;
var Speed =25;

//Funtions
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

} // When Player Lets Go Of W, It Stops Feeding
function keyup(event) {
    if (event.keyCode == 87) {
        Feed = false;
    }
}

//Mouse Clicks
(function() {
    document.getElementById("canvas").addEventListener("mousedown", function(event) {
        if (event.which == 1) {
            split();
        }
        else if (event.which == 2) {
            split();
            setTimeout(split, Speed);
            setTimeout(split, Speed2);
            setTimeout(split, Speed3);
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
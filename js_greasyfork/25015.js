// ==UserScript==
// @name         CellCraftX
// @namespace    http://tampermonkey.net/
// @version      4.5.1
// @description  for AEA clan, not u homie
// @author       SuiX
// @match        http://cellcraft.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/25015/CellCraftX.user.js
// @updateURL https://update.greasyfork.org/scripts/25015/CellCraftX.meta.js
// ==/UserScript==

document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> Macro by<b>__JaZzY!</b></span></span></center>";

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var SplitDown = false;
var EjectDown = false;
var speed = 0;
var speed2 = 100;

function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) {
        EjectDown = true;
        setTimeout(eject, speed);
    }
    if (event.keyCode == 65 && SplitDown === false) {
        SplitDown = true;
        setTimeout(split2, speed);
    }
    if (event.keyCode == 68) {
        split();
        setTimeout(split, speed2);
    }
}

function keyup(event) {
    if (event.keyCode == 87) {
        EjectDown = false;
    }
    if (event.keyCode == 65) {
        SplitDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(eject, speed);
    }
}

function split2() {
    if (SplitDown) {
        $("body").trigger($.Event("keydown", { keyCode: 32}));
        $("body").trigger($.Event("keyup", { keyCode: 32}));
        setTimeout(split2, speed);
    }
}

function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}


// DELETE THE BELOW LINES IF YOU DO NOT WANT MOUSE CONTROLS!


(function(Mouse) {
    document.getElementById("canvas").addEventListener("mousedown", function(event) {
        if (event.which == 1) { //Switch with the below "2" if left mouse doublepslits.
            split();
        }
        else if (event.which == 2) { //Switch with the above "1" if middle mouse click splits once.
            split();
            setTimeout(split, Speed);
        }
        else if (event.which == 3) {
            EjectDown = true;
            setTimeout(eject, Speed2);
        }
    });

    document.getElementById("canvas").addEventListener("mouseup", function(event) {
        if (event.which == 3) {
            EjectDown = false;
        }
    });
    $('#canvas').bind('contextmenu', function(e) {
        e.preventDefault();
    });
}());
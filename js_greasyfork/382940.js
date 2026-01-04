// ==UserScript==
// @name         Insane V5
// @namespace    http://tampermonkey.net/
// @version      4.6.1
// @description  Fastest Q-Feeding, , (A) Doublesplit Macro, (E) 
// @author       INSANE
// @match        https://germs.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/382940/Insane%20V5.user.js
// @updateURL https://update.greasyfork.org/scripts/382940/Insane%20V5.meta.js
// ==/UserScript==


document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> Macro by<b>__JaZzY!</b></span></span></center>";


window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var SplitDown = false;
var EjectDown = false;
var speed = 0;
var speed2 = 100;

function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) { //Change "87" to "69" if you want "Q" to feed!
        EjectDown = true;
        setTimeout(eject, speed);
    }
    else if (event.keyCode == 65 && SplitDown === false) { // Key [E] Maxsplits
        SplitDown = true;
        setTimeout(split2, speed);
    }
    else if (event.keyCode == 68) { // Key [A] Doublesplits
        split();
        setTimeout(split, speed2);
    }
}

function keyup(event) {
    if (event.keyCode == 87) {
        EjectDown = false;
    }
    else if (event.keyCode == 65) {
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

function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}

function split2() {
    if (SplitDown) {
        $("body").trigger($.Event("keydown", { keyCode: 32}));
        $("body").trigger($.Event("keyup", { keyCode: 32}));
        setTimeout(split2, speed);
    }
}
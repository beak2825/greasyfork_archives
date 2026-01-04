// ==UserScript==
// @name         Prince Macros
// @namespace    http://tampermonkey.net/
// @version      4.6.1
// @description  Fastest W-Feeding, , (G) Doublesplit Macro, (A) Max Split, and More to be Added! ❤
// @author       Prince
// @match        http://micos.io/*
// @match        http://germs.io/*
// @match        http://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/31063/Prince%20Macros.user.js
// @updateURL https://update.greasyfork.org/scripts/31063/Prince%20Macros.meta.js
// ==/UserScript==


document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> Macro by<b>__JaZzY!</b></span></span></center>";


window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var SplitDown = false;
var EjectDown = false;
var speed = 1;
var speed2 = 50;

function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) { //Change "87" to "69" if you want "E" to feed!
        EjectDown = true;
        setTimeout(eject, speed);
    }
    else if (event.keyCode == 90 && SplitDown === false) { // Key [A] Maxsplits
        SplitDown = true;
        setTimeout(split2, speed);
    }
    else if (event.keyCode == 69) { // Key [D] Doublesplits
        split();
        setTimeout(split, speed2);
    }
}

function keyup(event) {
    if (event.keyCode == 87) {
        EjectDown = false;
    }
    else if (event.keyCode == 90) {
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

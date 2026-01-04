// ==UserScript==
// @name         Macro Agario Massaque
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       Massaque.BR
// @match        https://emupedia.net/emupedia-game-agar.io/*
// @grant        none
// @run-at       document-end
// @description Editado por Massaque.BR
// @downloadURL https://update.greasyfork.org/scripts/459738/Macro%20Agario%20Massaque.user.js
// @updateURL https://update.greasyfork.org/scripts/459738/Macro%20Agario%20Massaque.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Speed = 20;

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
     if (event.keyCode == 87 )                                 // W
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
    if (event.keyCode == 69 || event.keyCode == 52) {                // Shift and 4
        split();
        setTimeout(split, Speed);
        setTimeout(split, Speed*2);
        setTimeout(split, Speed*3);
    } // Triplesplit
    if (event.keyCode == 'yourkey' || event.keyCode == 'yourkey2') { // Put in Your Key
        split();
    }//respawn
    if (event.keyCode == 82) { //key R
            closeStats();
            rspwn(document.getElementById('nick').value);
    }

} // When Player Lets Go Of W, It Stops Feeding
function keyup(event) {
    if (event.keyCode == 87) {
        Feed = false;
    }

}

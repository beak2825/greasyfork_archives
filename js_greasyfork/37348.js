// ==UserScript==
// @name         Best Tricksplit, Doublesplit, and Feeding Macros + Auto Settings + Triplesplit Macro + Popsplit
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Sets show mass and dark theme to true, provides a tricksplit with T or 4, triplesplit with 3, doublesplit with G or 2, faster feeding with E
// @author       Tony Radi
// @match        http://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/37348/Best%20Tricksplit%2C%20Doublesplit%2C%20and%20Feeding%20Macros%20%2B%20Auto%20Settings%20%2B%20Triplesplit%20Macro%20%2B%20Popsplit.user.js
// @updateURL https://update.greasyfork.org/scripts/37348/Best%20Tricksplit%2C%20Doublesplit%2C%20and%20Feeding%20Macros%20%2B%20Auto%20Settings%20%2B%20Triplesplit%20Macro%20%2B%20Popsplit.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Dingus = false;
var imlost = 25;
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> Press <b>T</b> or <b>4</b> to split 4x</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_3'> Press <b>3</b> to split 3x</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> Press <b>G</b> or <b>2</b> to split 2x</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> Press <b>F</b> to Popsplit</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_q'> Press and hold <b>E</b> for macro feed</span></span></center>";
load();
function load() {
    if (document.getElementById("overlays").style.display!="none") {
        document.getElementById("settings").style.display = "block";
        if (document.getElementById('showMass').checked) {document.getElementById('showMass').click();}
        document.getElementById('showMass').click();
        if (document.getElementById('darkTheme').checked) {document.getElementById('darkTheme').click();}
        document.getElementById('darkTheme').click();
        // I changed the above because now agario 'remembers' your preferences, but doesn't actually work, so if they're already set to be true, you need to undo it, then re click to true
    } else {
        setTimeout(load, 100);
    }
} 
function keydown(event) {
    if (event.keyCode == 69) {
        Feed = true;
        setTimeout(fukherriteindapussie, imlost);
    } // Tricksplit
    if (event.keyCode == 84 || event.keyCode == 52) { //( ͡° ͜ʖ ͡°)
        ilikedick();
        setTimeout(ilikedick, imlost);
        setTimeout(ilikedick, imlost*2);
        setTimeout(ilikedick, imlost*3);
    } // Triplesplit
    if (event.keyCode == 51 || event.keyCode == 65) {
        ilikedick();
        setTimeout(ilikedick, imlost);
        setTimeout(ilikedick, imlost*2);
    } // Doublesplit
    if (event.keyCode == 71 || event.keyCode == 50) {
        ilikedick();
        setTimeout(ilikedick, imlost);
    } // PopSplit
    if (event.keyCode == 70) {
        ilikedick();
        setTimeout(ilikedick, imlost*5.0634212);
    }
    // When Player Lets Go Of E, It Stops Feeding
    if (event.keyCode == 83) { //key S
        X = window.innerWidth/2;
        Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    }// Freeze
}
function keyup(event) {
    if (event.keyCode == 69) {
        Feed = false;
    }
    if (event.keyCode == 79) {
        Dingus = false;
    }
}
// Feed Macro With E
function fukherriteindapussie() {
    if (Feed) {
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(fukherriteindapussie, imlost);
    }
}
function ilikedick() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}
//Looking through the code now are we? ( ͡° ͜ʖ ͡°)
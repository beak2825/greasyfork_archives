// ==UserScript==
// @name         Kasu`s Agar.io Extension
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Makes the game easier 
// @author       KasuAG
// @match        http://abs0rb.me/*
// @match        http://agar.io/*
// @match        http://agarabi.com/*
// @match        http://agarly.com/*
// @match        http://en.agar.bio/*
// @match        http://agar.pro/*
// @match        http://agar.biz/*
// @match        http://agar.red/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/25622/Kasu%60s%20Agario%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/25622/Kasu%60s%20Agario%20Extension.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Dingus = false;
var imlost = 25;
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> Press <b>E</b> or <b>4</b> to split 4x</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_3'> Press <b>3</b> to split 3x</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> Press <b>D</b> or <b>2</b> to split 2x</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_q'> Press and hold <b>Q</b> for macro feed</span></span></center>";
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
    if (event.keyCode == 81) {
        Feed = true;
        setTimeout(fukherriteindapussie, imlost);
    } // Jebnij Trika
    if (event.keyCode == 69 || event.keyCode == 52) { //( ͡° ͜ʖ ͡°)
        ilikedick();
        setTimeout(ilikedick, imlost);
        setTimeout(ilikedick, imlost*2);
        setTimeout(ilikedick, imlost*3);
    } // Jebnij Tripla
    if (event.keyCode == 51 || event.keyCode == 65) {
        ilikedick();
        setTimeout(ilikedick, imlost);
        setTimeout(ilikedick, imlost*2);
    } // Jebnij Dabla
    if (event.keyCode == 68 || event.keyCode == 50) {
        ilikedick();
        setTimeout(ilikedick, imlost);
    } // Rozlacz sie
    if (event.keyCode == 49) {
        ilikedick();
    }
} // When Player Lets Go Of Q, It Stops Feeding
function keyup(event) {
    if (event.keyCode == 81) {
        Feed = false;
    }
    if (event.keyCode == 79) {
        Dingus = false;
    }
}
// Aby feedowac macro przytrzymaj Q
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
//No Code Here xD
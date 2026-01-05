// ==UserScript==
// @name         Milan Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Milan is a FUCKING QT
// @author       Milan's slut
// @match        http://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/28394/Milan%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/28394/Milan%20Script.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Dingus = false;
var imlost = 25;
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> Press <b>SHIFT</b> or to split 4x</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> Press <b>Q</b> double split</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_q'> Press and hold <b>E</b> for macro feed</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_q'> Milan is THICC as FUCK</span></span></center>";
load();
function load() {
    if (document.getElementById("overlays").style.display!="none") {
        document.getElementById("settings").style.display = "block";
        if (document.getElementById('showMass').checked) {document.getElementById('showMass').click();}
        document.getElementById('showMass').click();
        if (document.getElementById('darkTheme').checked) {document.getElementById('darkTheme').click();}
        document.getElementById('darkTheme').click();
    } else {
        setTimeout(load, 100);
    }
}
function keydown(event) {
    if (event.keyCode == 69) {
        Feed = true;
        setTimeout(fukherriteindapussie, imlost);
    }
    if (event.keyCode == 16) {
        ilikedick();
        setTimeout(ilikedick, imlost);
        setTimeout(ilikedick, imlost*2);
        setTimeout(ilikedick, imlost*3);
        setTimeout(ilikedick, imlost*4);
        setTimeout(ilikedick, imlost*5);
        setTimeout(ilikedick, imlost*6);
        setTimeout(ilikedick, imlost*7);
        setTimeout(ilikedick, imlost*8);
        setTimeout(ilikedick, imlost*9);
        setTimeout(ilikedick, imlost*10);
        setTimeout(ilikedick, imlost*11);
        setTimeout(ilikedick, imlost*12);
        setTimeout(ilikedick, imlost*13);
        setTimeout(ilikedick, imlost*14);
        setTimeout(ilikedick, imlost*15);
        setTimeout(ilikedick, imlost*16);
    }
    if (event.keyCode == 81) {
        ilikedick();
        setTimeout(ilikedick, imlost);
    }
    if (event.keyCode == 49) {
        ilikedick();
    }

}
function keyup(event) {
    if (event.keyCode == 69) {
        Feed = false;
    }
    if (event.keyCode == 79) {
        Dingus = false;
    }
}
// Feed Macro With Q
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
//Looking through the code now are we? You're a nigger kys

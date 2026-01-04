//AgarEASYSPLIT
//Created by: Vez
// ==UserScript==
// @name         Omega+Easy= Tricksplit, Doublesplit, AutoFeed + AutoSettings + Triplesplit + FreezeCell
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  Show mass + dark theme, tricksplit with E or 4, triplesplit with 3, doublesplit with D or 2, faster feeding with Q, and split with 1
// @author       Origional: Jack Burch + Tom Burris
// @match        http://abs0rb.me/*
// @match        *://agar.io/*
// @match        http://agarabi.com/*
// @match        http://agarly.com/*
// @match        http://en.agar.bio/*
// @match        http://agar.pro/*
// @match        http://agar.biz/*
// @match        https://balz.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/393898/Omega%2BEasy%3D%20Tricksplit%2C%20Doublesplit%2C%20AutoFeed%20%2B%20AutoSettings%20%2B%20Triplesplit%20%2B%20FreezeCell.user.js
// @updateURL https://update.greasyfork.org/scripts/393898/Omega%2BEasy%3D%20Tricksplit%2C%20Doublesplit%2C%20AutoFeed%20%2B%20AutoSettings%20%2B%20Triplesplit%20%2B%20FreezeCell.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Dingus = false;
var imlost = 25;
document.getElementById("Credits").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> Made by Vez</span></span></center>";

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
    } // Tricksplit
    if (event.keyCode == 69 || event.keyCode == 52) { //( ͡° ͜ʖ ͡°)
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
    if (event.keyCode == 68 || event.keyCode == 50) {
        ilikedick();
        setTimeout(ilikedick, imlost);
    } // Split
    if (event.keyCode == 49) {
        ilikedick();
    }// When Player Lets Go Of Q, It Stops Feeding
    if (event.keyCode == 83) { //key S
        X = window.innerWidth/2;
        Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    }// Freeze
}
function keyup(event) {
    if (event.keyCode == 81) {
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
// ==UserScript==
// @name         Agar.io Split Macro Script
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Trick Split = T/Shift Double Split = G/Q
// @author       Ace - Agario
// @match        http://gota.io/web/
// @match        agar.io
// @match        
// @match        nbk.io
// @match        http://abs0rb.me/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/32470/Agario%20Split%20Macro%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/32470/Agario%20Split%20Macro%20Script.meta.js
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
    } else {
        setTimeout(load, 100);
    }
} 
function keydown(event) {
    if (event.keyCode == 87) {
        Feed = true;
        setTimeout(fukherriteindapussie, imlost);
    } // Tricksplit
    if (event.keyCode == 84 || event.keyCode == 16) {
        ilikedick();
        setTimeout(ilikedick, imlost);
        setTimeout(ilikedick, imlost*2);
        setTimeout(ilikedick, imlost*3);
    } // Doublesplit
    if (event.keyCode == 71 || event.keyCode == 81) {
        ilikedick();
        setTimeout(ilikedick, imlost);
    } // Split
    if (event.keyCode == 49) {
        ilikedick();
    }
}
function ilikedick() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}﻿

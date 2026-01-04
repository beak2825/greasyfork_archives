// ==UserScript==
// @name         Macro For Clan Kx
// @namespace    http://tampermonkey.net/
// @version      1.21
// @description  Teclas, W Feed, E Tricksplit, S center, R triplesplit, D doublesplit, 
// @author       Black Kx
// @match        http://gota.io/*
// @match        https://gota.io/*
// @match        http://dual-agar.me/
// @grant        none
// @run-at       document-end
// @icon         https://i.imgur.com/sw60fTG.png
// @downloadURL https://update.greasyfork.org/scripts/35202/Macro%20For%20Clan%20Kx.user.js
// @updateURL https://update.greasyfork.org/scripts/35202/Macro%20For%20Clan%20Kx.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Speed = 25;

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
    if (event.keyCode == 65 || event.keyCode == 65) {
        ilikedick();
        setTimeout(ilikedick, imlost);
        setTimeout(ilikedick, imlost*2);
    } // Doublesplit
    if (event.keyCode == 68 || event.keyCode == 68) {
        ilikedick();
        setTimeout(ilikedick, imlost);
    } // Split
    if (event.keyCode == 49) {
        ilikedick();
    }

} // When Player Lets Go Of E, It Stops Feeding
function keyup(event) {
    if (event.keyCode == 69) {
        Feed = false;
    }

}


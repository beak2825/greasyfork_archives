// ==UserScript==
// @name         Macro Script Made By Pizza
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  This script provides a tricksplit with SHIFT or T, triplesplit with 3, doublesplit with D or 2, faster feeding with W.
// @author       Pizza
// @match        http://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/25148/Macro%20Script%20Made%20By%20Pizza.user.js
// @updateURL https://update.greasyfork.org/scripts/25148/Macro%20Script%20Made%20By%20Pizza.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Dingus = false;
var imPro= 25;
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> Press <b>SHIFT</b> or <b>T</b> to split 4x</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_3'> Press <b>3</b> to split 3x</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> Press <b>D</b> or <b>2</b> to split 2x</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_q'> Press and hold <b>W</b> for macro feed</span></span></center>";
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
        setTimeout(ifkpussy, imPro);
    } // Tricksplit
    if (event.keyCode == 84 || event.keyCode == 16) { //( ͡° ͜ʖ ͡°)
        wtfisthis();
        setTimeout(wtfisthis, imPro);
        setTimeout(wtfisthis, imPro*2);
        setTimeout(wtfisthis, imPro*3);
    } // Triplesplit
    if (event.keyCode == 51 || event.keyCode == 65) {
        wtfisthis();
        setTimeout(wtfisthis, imPro);
        setTimeout(wtfisthis, imPro*2);
    } // Doublesplit
    if (event.keyCode == 68 || event.keyCode == 50) {
        wtfisthis();
        setTimeout(wtfisthis, imPro);
    }
}// When Player Lets Go Of Q, It Stops Feeding
function keyup(event) {
    if (event.keyCode == 87) {
        Feed = false;
    }
    if (event.keyCode == 79) {
        Dingus = false;
    }
}
// Feed Macro With Q
function ifkpussy() {
    if (Feed) {
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(ifkpussy, imPro);
    }
}
function wtfisthis() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}
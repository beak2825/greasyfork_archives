// ==UserScript==
// @name         bots raga minios Agar.io
// @namespace    http://tampermonkey.net/
// @version      101
// @description  bots ragaminio Agar.io
// @author       jairo hr
// @match        http://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/476700/bots%20raga%20minios%20Agario.user.js
// @updateURL https://update.greasyfork.org/scripts/476700/bots%20raga%20minios%20Agario.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Dingus = false;
var imlost = 25;
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_a'> --  Jormy ENG  -- </span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_b'> <b> MORE FEED -E- </b></span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_c'> <b> DOBLE SPLIT -Q- </b></span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> <b> TRICKSPLIT -SHIT- </b></span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_f'> <b> LINESPLIT -R- </b></span></span></center>";
load();
function load() {
    if (document.getElementById("overlays").style.display!="none") {
        document.getElementById("settings").style.display = "block";
        if (document.getElementById('showMass').checked) {document.getElementById('showMass').click();}
        document.getElementById('showMass').click();
        if (document.getElementById('darkTheme').checked) {document.getElementById('darkTheme').click();}
        document.getElementById('darkTheme').click();
        //
    } else {
        setTimeout(load, 100);
    }
}
function keydown(event) {
    if (event.keyCode == 69) {
        Feed = true;
        setTimeout(fukherriteindapussie, imlost);
    } // Tricksplit
    if (event.keyCode == 16) { //( ?° ?? ?°)
        ilikedick();
        setTimeout(ilikedick, imlost);
        setTimeout(ilikedick, imlost*2);
        setTimeout(ilikedick, imlost*3);
    } // Triplesplit
    if (event.keyCode == 71) {
        ilikedick();
        setTimeout(ilikedick, imlost);
        setTimeout(ilikedick, imlost*2);
    } // Doublesplit
    if (event.keyCode == 81) {
        ilikedick();
        setTimeout(ilikedick, imlost);
    } // Split
    if (event.keyCode == 49) {
        ilikedick();
    } // LINESPLIT
    if (event.keyCode == 82) {
        x = window.innerWidth/2;
        Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    } //LINE
} // When Player Lets Go Of E, It Stops Feeding
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

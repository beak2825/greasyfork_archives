// ==UserScript==
// @name         Agar.io feed + Popsplit + Doublesplits + x16 Split! & More...
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This is a macro for agar.io!
// @author       You
// @match        http://agar.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        toqqi
// @downloadURL https://update.greasyfork.org/scripts/444682/Agario%20feed%20%2B%20Popsplit%20%2B%20Doublesplits%20%2B%20x16%20Split%21%20%20More.user.js
// @updateURL https://update.greasyfork.org/scripts/444682/Agario%20feed%20%2B%20Popsplit%20%2B%20Doublesplits%20%2B%20x16%20Split%21%20%20More.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Dingus = false;
var imlost = 25;
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> Press <b>E</b> to Tricksplit</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_3'> Press <b>Z</b> to Triplesplit</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> Press <b>D</b> to Doublesplit</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> Press <b>R</b> to Popsplit</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_q'> Press and hold <b>W</b> for macro feed</span></span></center>";
load();
function load() {
    if (document.getElementById("overlays").style.display!="none") {
        document.getElementById("settings").style.display = "block";
        if (document.getElementById('showMass').checked) {document.getElementById('showMass').click();}
        document.getElementById('showMass').click();
        if (document.getElementById('darkTheme').checked) {document.getElementById('darkTheme').click();}
        document.getElementById('darkTheme').click();
        // Don't switch the code becauce the script will not work !
    } else {
        setTimeout(load, 100);
    }
}
function keydown(event) {
    if (event.keyCode == 87) {
        Feed = true;
        setTimeout(fukherriteindapussie, imlost);
    } // Tricksplit
    if (event.keyCode == 69) {
        ilikedick();
        setTimeout(ilikedick, imlost);
        setTimeout(ilikedick, imlost*2);
        setTimeout(ilikedick, imlost*3);
    } // Triplesplit
    if (event.keyCode == 90) {
        ilikedick();
        setTimeout(ilikedick, imlost);
        setTimeout(ilikedick, imlost*2);
    } // Doublesplit
    if (event.keyCode == 68) {
        ilikedick();
        setTimeout(ilikedick, imlost);
    } // PopSplit
    if (event.keyCode == 82) {
        ilikedick();
        setTimeout(ilikedick, imlost*5.32232210323424323);
    }
} // When Player Lets Go Of W, It Stops Feeding
function keyup(event) {
    if (event.keyCode == 87) {
        Feed = false;
    }
    if (event.keyCode == 79) {
        Dingus = false;
    }
}
// Feed Macro With W
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
//Please don't switch the code { u know why ( ͡° ͜ʖ ͡°) }
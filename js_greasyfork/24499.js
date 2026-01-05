// ==UserScript==
// @name         alsda7 ex
// @namespace    alsda7
// @version      1.0
// @description  FastFeed_E,DoubleSplit_G,BaitSpit_B,TrickSplit_T.
// @match        http://3rb.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/24499/alsda7%20ex.user.js
// @updateURL https://update.greasyfork.org/scripts/24499/alsda7%20ex.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Dingus = false;
var imlost = 10;
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='SplitsX8_T'> Press <b>T</b> or <b>4</b> to split x8</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='SplitsX4_B'> Press <b>B</b> or <b>3</b> to split x4</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='SplitsX2_G'> Press <b>G</b> or <b>2</b> to split x2</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='FastFeed_E'> Press <b>E</b> or <b>W</b> for macro feed</span></span></center>";

document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr=''> Extensions create Roman Sidoreiko|Exmatid-Uncut <b>https://www.youtube.com/c/enwapstylee</b> Subcribe channel my Friends <b>and</b>Thank you (+)</span></span></center>";
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
    } // TrickSplit
    if (event.keyCode == 84 || event.keyCode == 52) { //( ?° ?? ?°)
        ilikedick();
        setTimeout(ilikedick, imlost);
        setTimeout(ilikedick, imlost*2);
        setTimeout(ilikedick, imlost*3);
    } // BaiteSplit
    if (event.keyCode == 66 || event.keyCode == 51) {
        ilikedick();
        setTimeout(ilikedick, imlost);
        setTimeout(ilikedick, imlost*2);
    } // DoubleSplit
    if (event.keyCode == 71 || event.keyCode == 50) {
        ilikedick();
        setTimeout(ilikedick, imlost);
    } // Split
    if (event.keyCode == 49) {
        ilikedick();
    }
} // When Player Lets Go Of G, It Stops Feeding
function keyup(event) {
    if (event.keyCode == 69) {
        Feed = false;
    }
    if (event.keyCode == 79) {
        Dingus = false;
    }
}
// Feed Macro With G
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
//Looking through the code now are we? ( ?° ?? ?°)
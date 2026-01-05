// ==UserScript==
// @name         Macros Agar.io
// @namespace    http://tampermonkey.net/
// @version      0.3B (BETA)
// @description  Macro Feeed & More
// @author       SaObY
// @match        http://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/23575/Macros%20Agario.user.js
// @updateURL https://update.greasyfork.org/scripts/23575/Macros%20Agario.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Dingus = false;
var imlost = 25;
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> Press <b>Shift</b> to tricksplit</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> Press <b>Q</b> to doublesplit</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> Press <b>E</b> to macro feed</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_q'> Created by<b> <strong>SaObY</strong></b>!</span></span></center>";
document.getElementById("instructions").innerHTML += "<a href='https://www.youtube.com/c/SaObY?sub_confirmation=1' target='_blank'><img alt='Suscribe to my Channel !' id='Header1_headerimg' src='http://i.imgur.com/mDUqIAq.png' style='display: inline' height='100px ; ' width='100px; '></div>";
document.getElementById("instructions").innerHTML += "<a href='ts3server://eu4.freets3.ovh:1747' target='_blank'><img alt='Our Ts3' id='Header1_headerimg' src='http://i.imgur.com/0GYRhE9.png' style='display: inline' height='100px ; ' width='100px; '></div>";
document.getElementById("instructions").innerHTML += "<a href='https://euroofficialclan.chatovod.com/' target='_blank'><img alt='Suscribe to my Channel !' id='Header1_headerimg' src='http://i.imgur.com/ynphYzF.png' style='display: inline' height='100px ; ' width='100px; '></div>";
$("h2").replaceWith('<h2>SaObY YT</h2>');

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
    }
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



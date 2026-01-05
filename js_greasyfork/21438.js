// ==UserScript==
// @name         AGARIO HOTKEYS BY DZEMO WASH
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Napravljeno od Dzemo Agario ( na FB ),ukratko o meni, u Wash klanu sam i pravim ext za njih ili za vecinu u grupi Agario Balkan
// @author       Dzemo Dzinic
// @match        http://abs0rb.me/*
// @match        http://agar.io/*
// @match        http://agarabi.com/*
// @match        http://agarly.com/*
// @match        http://en.agar.bio/*
// @match        http://agar.pro/*
// @match        http://agar.biz/*
// @match        http://play.ogarul.tk/?ip=127.0.0.1:443
// @match        https://gota.io/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/21438/AGARIO%20HOTKEYS%20BY%20DZEMO%20WASH.user.js
// @updateURL https://update.greasyfork.org/scripts/21438/AGARIO%20HOTKEYS%20BY%20DZEMO%20WASH.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Dingus = false;
var imlost = 25;
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> Pritisni <b>E</b> ili <b>4</b> da se FAST SPLIT-Wash najbolji xD</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_3'> Pritisni <b>3</b> da se SPLITAŠ 3x-Wash najbolji xD</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> Pritisni <b>D</b> ili <b>2</b> da se SPLITAŠ 2x-Wash najbolji xD</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_q'> Pritisni i drži <b>Q</b> za MACROFEED-Wash najbolji xD</span></span></center>";
load();
function load() {
    if (document.getElementById("overlays").style.display!="none") {
        document.getElementById("settings").style.display = "block";
        if (document.getElementById('showMass').checked) {document.getElementById('showMass').click();}
        document.getElementById('showMass').click();
        if (document.getElementById('darkTheme').checked) {document.getElementById('darkTheme').click();}
        document.getElementById('darkTheme').click();
        // Promijenio sam gore jer sada agario " pamti " svoje preferencije , ali zapravo ne radi, tako da ako su već postavili da bi bilo True , morate ga Undo , a zatim ponovno kliknite na True
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
    }
} // Kad igrač prestane držati Q,prestane se hraniti
function keyup(event) {
    if (event.keyCode == 81) {
        Feed = false;
    }
    if (event.keyCode == 79) {
        Dingus = false;
    }
}
// Feed Macro sa Q
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
//Gledate kodove jel?Imate pozdrav od Dzeme ( ͡° ͜ʖ ͡°)

// ==UserScript==
// @name         Private Agario Elite Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sets show mass and dark theme to true, provides a tricksplit with E or 4, triplesplit with 3, doublesplit with D or 2, faster feeding with Q, and split with 1
// @author       Jack Burch + Tom Burris + Big Daddy Salvia
// @match        http://abs0rb.me/*
// @match        http://agar.io/*
// @match        http://agarabi.com/*
// @match        http://agarly.com/*
// @match        http://en.agar.bio/*
// @match        http://agar.pro/*
// @match        http://agar.biz/*
// @match        http://agarioplay.org/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/25563/Private%20Agario%20Elite%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/25563/Private%20Agario%20Elite%20Script.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Dingus = false;
var imlost = 25;
var interval;
var switchy = false;
var f5 = setInterval(chat,100);
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> ---------------------------------</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> Press <b>E</b> to fast feed</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_3'> Press <b>R</b> to split 4x</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> Press <b>D</b> to split 2x</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> ---------------------------------</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> Quickchat Commands</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> <b>1</b> - Your current location</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> <b>2</b> - 'Where are you!?'</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> <b>3</b> - 'Virus Him'</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> <b>4</b> - 'Split into me!'</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> <b>5</b> - 'Split him!'</span></span></center>";
load();
function keydown(event) {
    if (event.keyCode == 69) {
        Feed = true;
        setTimeout(fukherriteindapussie, imlost);
    } // Tricksplit
    if (event.keyCode == 82) { //( ͡° ͜ʖ ͡°)
        ilikedick();
        setTimeout(ilikedick, imlost);
        setTimeout(ilikedick, imlost*2);
        setTimeout(ilikedick, imlost*3);
    } // Triplesplit
    if (event.keyCode == 70) {
        ilikedick();
        setTimeout(ilikedick, imlost);
        setTimeout(ilikedick, imlost*2);
    } // Doublesplit
    if (event.keyCode == 68) {
        ilikedick();
        setTimeout(ilikedick, imlost);
    } // Split
    if (event.keyCode == 49) {
        ilikedick();
    }
} // When Player Lets Go Of Q, It Stops Feeding
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

function chat(){
    document.getElementById("chat_textbox").onkeyup = function() {
        if (this.value == "3") {
            this.value = "Virus Him";
        }
        if (this.value == "4") {
            this.value = "Split into me!";
        }
        if (this.value == "5") {
            this.value = "Split him!";
        }
        if (this.value == "2") {
            this.value = "Where are you!?";
        }
        if (this.value == "1") {

            for (var id in window.mini_map_tokens) {
                var token = window.mini_map_tokens[id];
                var x = token.x;
                var y = token.y;
                this.value = "I'm at " + String.fromCharCode(Math.floor(y*6)+65) + Math.floor((x*6)+1);
            }
        }
        var mouseX = event.clientX;     // Get the horizontal coordinate
        var mouseY = event.clientY;     // Get the vertical coordinate
        if (this.value == "6") {
            this.value = mouseX;
        }
    };
}


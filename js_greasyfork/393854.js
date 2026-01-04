// ==UserScript==
// @name         Doblons.io Remixed Script
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Not Maker of script but remade it, I will improve it on my own.This Was Made by three other scripts, They were slightly edited (W) Summon Boats. (Space) Activate Visual. (O) Alternative Visual activator. 
// @author       ItsMeEnderCreeperGames
// @match        http://doblons.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393854/Doblonsio%20Remixed%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/393854/Doblonsio%20Remixed%20Script.meta.js
// ==/UserScript==

document.addEventListener("keydown", function(a) { // Push Spacebar to enable the visual
    if (a.keyCode == 79) {// O
player.ramLength = 70;
player.autoCannons = 2;   
player.trippleCannons = 2;
player.busterCannon = 2;
player.mineDropper = 9;
}
}, false);

document.addEventListener("keydown", function(a) { //Press space to enable Visual
    if (a.keyCode == 32) {// Space
player.length = player.length + 10;
player.cannons++;
player.rearLength = player.rearLength + 10;
player.noseLength = player.noseLength + 10;
player.width++;
player.cannonLength++;
player.cannonWidth++;
    }
}, false);

//Ship spawner Press w to use

var BoatDown = false;
var speed = 25;

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

function keydown(event) {
    if (event.keyCode == 87 && BoatDown === false) {
        BoatDown = true;
        setTimeout(boat, speed);
    }
}

function keyup(event) {
    if (event.keycode == 87) {
        var BoatDown = false;
        }
}

function boat() {
    if (BoatDown) {
        $("body").trigger($.Event("keydown", { keyCode: 57}));
        $("body").trigger($.Event("keyup", { keyCode: 57}));
        setTimeout(boat,speed);
    }
}
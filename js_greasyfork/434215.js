/// ==UserScript==
// @name         Fastsplit and Bubble Cells Script
// @version      0.5.4
// @description  try to take over the agma/cellcarft servers!
// @author       Mhero
// @match        https://agma.io/*
// @match        https://cellcraft.io/*
// @grant        none
// @namespace https://greasyfork.org/users/469080
// @downloadURL https://update.greasyfork.org/scripts/434215/Fastsplit%20and%20Bubble%20Cells%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/434215/Fastsplit%20and%20Bubble%20Cells%20Script.meta.js
// ==/UserScript==

// Notes:
// Only change Key or Key2.
// Freeze required.
// Onesplit has to be on Space.

var key = "R" // Normal
var key2 = "T" // Double
var key4 = "U" // triple
var doubleSplitKey
var freezeKey

window.addEventListener('keydown', keydown);

setTimeout(function() {
    key = key.charCodeAt(0)
    key2 = key2.charCodeAt(0)
    key4 = key4.charCodeAt(0)

    doubleSplitKey = document.getElementById("keyDoubleSplit").innerHTML.charCodeAt(0)
    freezeKey = document.getElementById("keyFreezeSelf").innerHTML.charCodeAt(0)
    console.log("Fastsplit Script active.")
}, 5000)

function oneSplit() {
    $("#canvas").trigger($.Event("keydown", { keyCode: 32}));
    $("#canvas").trigger($.Event("keyup", { keyCode: 32}));
}

function doubleSplit() {
    $("#canvas").trigger($.Event("keydown", { keyCode: doubleSplitKey}));
    $("#canvas").trigger($.Event("keyup", { keyCode: doubleSplitKey}));
}
function tripleSplit(){
    $("#canvas").trigger($.Event("keydown", { keyCode: 86}));
    $("#canvas").trigger($.Event("keyup", { keyCode: 86}));
}
function freeze() {
    $("#canvas").trigger($.Event("keydown", { keyCode: freezeKey}));
    $("#canvas").trigger($.Event("keyup", { keyCode: freezeKey}));
}


function keydown(event) {
    if (document.activeElement.type == 'text' || document.activeElement.type == 'password') {
        return;
    }
    if (event.keyCode == key) {
        oneSplit()
        setTimeout(freeze, 40)
        setTimeout(freeze, 115)
        console.log("Fastsplit")
    }
    if (event.keyCode == key2) {
        doubleSplit()
        setTimeout(freeze, 70)
        setTimeout(freeze, 145)
        console.log("DoubleFastsplit")
    }
    if(event.keyCode == key4){
        tripleSplit()
        setTimeout(freeze, 100)
        setTimeout(freeze, 165)
    }
    if(event.keyCode == 190){
    document.getElementById("cBubbleCells").dispatchEvent(new MouseEvent("click"));
    }
}
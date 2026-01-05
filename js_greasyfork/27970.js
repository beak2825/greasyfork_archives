// ==UserScript==
// @name         karnage supply opener(Skips delay when opening crates showing what you get immediately)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Auto opens crates, skips
// @author       meatman2tasty
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27970/karnage%20supply%20opener%28Skips%20delay%20when%20opening%20crates%20showing%20what%20you%20get%20immediately%29.user.js
// @updateURL https://update.greasyfork.org/scripts/27970/karnage%20supply%20opener%28Skips%20delay%20when%20opening%20crates%20showing%20what%20you%20get%20immediately%29.meta.js
// ==/UserScript==

setInterval(function(){ 
    setTimeout(crateSpinner.spinVelocity = 0, 2);
}, 10);

document.addEventListener("keydown", function(a) { // Press '=' for common supply
    if (a.keyCode == 187) {
buySupply(1);
    }
}, false);

document.addEventListener("keydown", function(a) { // Press '=' for common supply
    if (a.keyCode == 189) {
completeCratePurchase(this, 1);
    }
}, false);
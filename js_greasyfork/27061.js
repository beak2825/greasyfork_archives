// ==UserScript==
// @name         Karnage Auto Purchase
// @namespace    meatman2tasty
// @version      1.5
// @description  Press '-' for disposable supply, '=' for common supply, '\' for rare supply
// @author       meatman2tasty
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27061/Karnage%20Auto%20Purchase.user.js
// @updateURL https://update.greasyfork.org/scripts/27061/Karnage%20Auto%20Purchase.meta.js
// ==/UserScript==

document.addEventListener("keydown", function(a) { // Press '-' for disposable supply
    if (a.keyCode == 189) {
buySupply(0);
    }
}, false);

document.addEventListener("keydown", function(a) { // Press '=' for common supply
    if (a.keyCode == 187) {
buySupply(1);
    }
}, false);

document.addEventListener("keydown", function(a) { // Press '\' for rare supply
    if (a.keyCode == 220) {
buySupply(2);
    }
}, false);

document.addEventListener("keydown", function(a) { // Press '\' for rare supply
    if (a.keyCode == 186) {
crateSpinner.spinVelocity = 0;
    }
}, false);

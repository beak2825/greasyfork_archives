// ==UserScript==
// @name         right swap karnage, TEST
// @namespace    meatman2tasty
// @version      1.0
// @description  R
// @author       meatman2tasty
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27072/right%20swap%20karnage%2C%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/27072/right%20swap%20karnage%2C%20TEST.meta.js
// ==/UserScript==

document.addEventListener("keydown", function(a) { // Press '-' for disposable supply
    if (a.keyCode == 189) {
buySupply(0);
    }
}, false);

$('a').mousedown(function(f) {
    if (f.which == 1) {
        incWeapon(-1);
    }
});
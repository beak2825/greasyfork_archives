// ==UserScript==
// @name         Class build shortcuts
// @namespace    meatman2tasty
// @version      1.2
// @description  Press '1' for hunter+better pickups, Press '2' For detective+Rapid Fire, Press '3' For triggerman+Rapid Fire, Press '4' for Mr.ops+Health Regen
// @author       meatman2tasty
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27522/Class%20build%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/27522/Class%20build%20shortcuts.meta.js
// ==/UserScript==

document.addEventListener("keydown", function(a) { // '1' For Hunter+Better Pickups
    if (a.keyCode == 49) {
selectPerk(2);
selectClass(2);
    }
}, false);

document.addEventListener("keydown", function(a) { // '4' For Mr.ops+Health Regen
    if (a.keyCode == 52) {
selectPerk(1);
selectClass(5);
    }
}, false);

document.addEventListener("keydown", function(a) { // '2' For detective+Rapid Fire
    if (a.keyCode == 50) {
selectPerk(3);
selectClass(3);
    }
}, false);

document.addEventListener("keydown", function(a) { // '3' Triggerman+Rapid Fire
    if (a.keyCode == 51) {
selectPerk(3);
selectClass(0);
    }
}, false);
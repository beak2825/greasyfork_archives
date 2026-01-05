// ==UserScript==
// @name         Karnage Auto reset serv
// @namespace    meatman2tasty
// @version      1.3
// @description  Press C to reset
// @author       meatman2tasty
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27134/Karnage%20Auto%20reset%20serv.user.js
// @updateURL https://update.greasyfork.org/scripts/27134/Karnage%20Auto%20reset%20serv.meta.js
// ==/UserScript==

document.addEventListener("keydown", function(a) { // Press C to reset
    if (a.keyCode == 67) {
hostGame(0);
    }
}, false);
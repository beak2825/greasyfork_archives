// ==UserScript==
// @name         doblons hacks
// @namespace    namespace
// @version      1.1
// @description  haqs
// @author       HighNoon420643
// @match        http://doblons.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23430/doblons%20hacks.user.js
// @updateURL https://update.greasyfork.org/scripts/23430/doblons%20hacks.meta.js
// ==/UserScript==

document.addEventListener("keydown", function(a) { // Press space to use h4x
    if (a.keyCode == 32) {
player.length = player.length + 10;
player.cannons++;
player.rearLength = player.rearLength + 10;
player.noseLength = player.noseLength + 10;
player.width++;
player.cannonLength++;
player.cannonWidth++;
    }
}, false);
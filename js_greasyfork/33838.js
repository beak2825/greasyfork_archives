// ==UserScript==
// @name         foes.io autospawn
// @namespace    http://foes.io/*
// @version      1.02
// @description  Auto spawner for foes.io, press 'c' to start
// @author       Meatman2tasty
// @match        https://foes.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33838/foesio%20autospawn.user.js
// @updateURL https://update.greasyfork.org/scripts/33838/foesio%20autospawn.meta.js
// ==/UserScript==

document.addEventListener("keydown", function(a) { // Press 'z' to start auto jump
    if (a.keyCode == 67) {
setInterval(enterGame(0), 10000);
    }
}, false);
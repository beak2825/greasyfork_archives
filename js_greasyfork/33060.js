// ==UserScript==
// @name         slay.one test
// @namespace    https://slay.one/
// @version      1.0
// @description  pressing i to look right
// @author       Meatman2tasty
// @match        https://slay.one/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33060/slayone%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/33060/slayone%20test.meta.js
// ==/UserScript==

document.addEventListener("keydown", function(a) { // press 'i' to fill chat
    if (a.keyCode == 73) {
game.cameraX = 100;
    }
}, false);
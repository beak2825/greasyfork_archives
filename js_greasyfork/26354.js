// ==UserScript==
// @name         doblons press O
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://doblons.io/?l=AYXNMJXJAPXJAP
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26354/doblons%20press%20O.user.js
// @updateURL https://update.greasyfork.org/scripts/26354/doblons%20press%20O.meta.js
// ==/UserScript==

document.addEventListener("keydown", function(a) { // Press space to use h4x
    if (a.keyCode == 79) {
player.ramLength = 70;
player.autoCannons = 2;   
player.trippleCannons = 2;
player.busterCannon = 2;
player.mineDropper = 9;
}
}, false);
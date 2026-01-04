// ==UserScript==
// @name         egres.io hax
// @namespace    http://egres.io/
// @version      1.0
// @description  movement using wasd teleport
// @author       Meatman2tasty
// @match        http://egres.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32774/egresio%20hax.user.js
// @updateURL https://update.greasyfork.org/scripts/32774/egresio%20hax.meta.js
// ==/UserScript==


document.addEventListener("keydown", function(a) { // press 'w' to go to top y
    if (a.keyCode == 87) {
        CplayerY = 60;
    }
}, false);

document.addEventListener("keydown", function(a) { // press 's' to go to bottom y
    if (a.keyCode == 83) {
        CplayerY = 500;
    }
}, false);

document.addEventListener("keydown", function(a) { // press 'space' to go to middle x
    if (a.keyCode == 32) {
        CplayerX = 460;
    }
}, false);

document.addEventListener("keydown", function(a) { // press 'a' to go to left x
    if (a.keyCode == 65) {
        CplayerX = 60;
    }
}, false);

document.addEventListener("keydown", function(a) { // press 'd' to go to right x
    if (a.keyCode == 68) {
        CplayerX = 830;
    }
}, false);
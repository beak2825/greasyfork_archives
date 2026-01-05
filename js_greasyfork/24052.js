// ==UserScript==
// @name         Narwhales.io autospawn
// @namespace    namespace
// @version      1.0
// @description  Join pressing Space
// @author       meatman2tasty
// @match        http://narwhale.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24052/Narwhalesio%20autospawn.user.js
// @updateURL https://update.greasyfork.org/scripts/24052/Narwhalesio%20autospawn.meta.js
// ==/UserScript==

document.addEventListener("keydown", function(a) { // Press '=' to respawn
    if (a.keyCode == 32) {
game.tryStart();
socket.emit("respawn");
    }
}, false);
// ==UserScript==
// @name         Join ther server by pressing X - By KongKongGaming
// @namespace    namespace
// @version      2.0
// @description  Join ther server by pressing X
// @author       KongKongGaming
// @match        http://vertix.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21052/Join%20ther%20server%20by%20pressing%20X%20-%20By%20KongKongGaming.user.js
// @updateURL https://update.greasyfork.org/scripts/21052/Join%20ther%20server%20by%20pressing%20X%20-%20By%20KongKongGaming.meta.js
// ==/UserScript==

document.addEventListener("keydown", function(a) { // Press '=' to respawn
    if (a.keyCode == 88) {
startGame("player");
socket.emit("respawn");
    }
}, false);
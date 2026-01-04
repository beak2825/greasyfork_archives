// ==UserScript==
// @name Pendoria Health Percentages
// @namespace http://pendoria.net/
// @version 1.0
// @author Puls3
// @include /^https?:\/\/(?:.+\.)?pendoria\.net\/?(?:.+)?$/
// @icon https://raw.githubusercontent.com/xPuls3/Pendorian-Elite-UI/master/favicon.ico
// @grant none
// @run-at document-end
// @description Adds a % to player and mob health.
// @downloadURL https://update.greasyfork.org/scripts/401196/Pendoria%20Health%20Percentages.user.js
// @updateURL https://update.greasyfork.org/scripts/401196/Pendoria%20Health%20Percentages.meta.js
// ==/UserScript==

// This script was created by Puls3!
// - Puls3 on Pendoria

socket.on('battle data', function() {
    let elem1 = document.getElementById("mhp-value");
    elem1.innerText = elem1.innerText + " (" + document.getElementById("mhp-background").style.width + ")";
    let elem2 = document.getElementById("php-value");
    elem2.innerText = elem2.innerText + " (" + document.getElementById("php-background").style.width + ")";
});
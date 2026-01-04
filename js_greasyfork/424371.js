// ==UserScript==
// @name         Become a Guest!
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Turn yourself into a guest with the same name and skin.
// @author       MYTH_doglover
// @match        https://bonk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424371/Become%20a%20Guest%21.user.js
// @updateURL https://update.greasyfork.org/scripts/424371/Become%20a%20Guest%21.meta.js
// ==/UserScript==

(function() {

var guestbutton = document.createElement("button");   // Create a <button> element
guestbutton.innerHTML = "Become a Guest";                   // Change button text
document.body.appendChild(guestbutton);               // Append <button> to <body>
guestbutton.id = 'guestbutton';
guestbutton.style.position = "fixed";
guestbutton.style.top = 220;
guestbutton.style.left = 10;

guestbutton.onclick = function(){
document.getElementById("guestOrAccountContainer_guestButton").click();
document.getElementById("guestPlayButton").click();
}

})();
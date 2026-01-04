// ==UserScript==
// @name         Anti Right-Click Hijaak
// @version      0.3
// @description  Prevent websites from changing or preventing your right click menu
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @match        *://*/*
// @license      MIT
// @namespace https://greasyfork.org/users/1253611
// @downloadURL https://update.greasyfork.org/scripts/505034/Anti%20Right-Click%20Hijaak.user.js
// @updateURL https://update.greasyfork.org/scripts/505034/Anti%20Right-Click%20Hijaak.meta.js
// ==/UserScript==
GM_registerMenuCommand("Include Current Site", includeSite);
GM_registerMenuCommand("Exclude Current Site", excludeSite);
if (localStorage.getItem("included") === window.location.hostname) {
    // Add event listeners only if the conditions are met
    document.addEventListener("copy", (event) => { event.stopImmediatePropagation(); }, true);
    document.addEventListener("paste", (event) => { event.stopImmediatePropagation(); }, true);
    document.addEventListener("contextmenu", (event) => { event.stopImmediatePropagation(); }, true);
}


function includeSite() {
    localStorage.setItem("included", window.location.hostname); // Change "included" to something else if multiple userscripts use this code
}

function excludeSite() {
    localStorage.removeItem("included", window.location.hostname);
}

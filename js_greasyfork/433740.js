// ==UserScript==
// @name         Add Application ARIA to pygame container
// @namespace    https://platform.techsmart.codes/
// @version      0.1
// @description  Add role="application" to PyGame div on TechSmart site
// @author       Eli Sheldon
// @match        https://platform.techsmart.codes/code/*
// @icon         https://www.google.com/s2/favicons?domain=techsmart.codes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433740/Add%20Application%20ARIA%20to%20pygame%20container.user.js
// @updateURL https://update.greasyfork.org/scripts/433740/Add%20Application%20ARIA%20to%20pygame%20container.meta.js
// ==/UserScript==

function setApplicationRole() {
    document.getElementById("ts-pygame-canvas-container").setAttribute("role", "application")
}

document.addEventListener("DOMNodeInserted", setApplicationRole)
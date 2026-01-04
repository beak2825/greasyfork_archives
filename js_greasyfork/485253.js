// ==UserScript==
// @name         Custom Cursor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Custom Bloxd Cursor
// @author       Blueify
// @match        https://bloxd.io/
// @icon         https://www.google.com/s2/favicons?sz...
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485253/Custom%20Cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/485253/Custom%20Cursor.meta.js
// ==/UserScript==

setInterval(function() {
    const crosshair = document.querySelector(".CrossHair");
    if (crosshair) {
        crosshair.textContent = "";
        crosshair.style.backgroundImage = "url(https://cdn.discordapp.com/attachment...)";
        crosshair.style.backgroundRepeat = "no-repeat";
        crosshair.style.backgroundSize = "contain";
        crosshair.style.width = "20px";
        crosshair.style.height = "20px";
        crosshair.style.opacity = "60%";
    }
}, 1000);
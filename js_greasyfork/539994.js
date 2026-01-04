// ==UserScript==
// @name         Custom Crossair for YTKingDream
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Custom Bloxd Cursor
// @author       YTKingDream
// @match        https://bloxd.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539994/Custom%20Crossair%20for%20YTKingDream.user.js
// @updateURL https://update.greasyfork.org/scripts/539994/Custom%20Crossair%20for%20YTKingDream.meta.js
// ==/UserScript==

setInterval(function() {
    const crosshair = document.querySelector(".CrossHair");
    if (crosshair) {
        crosshair.textContent = "";
        crosshair.style.backgroundImage = "url(https://i.imgur.com/tQ1cD1I.png)";
        crosshair.style.backgroundRepeat = "no-repeat";
        crosshair.style.backgroundSize = "contain";
        crosshair.style.width = "15px";
        crosshair.style.height = "15px";
    }
}, 1000);
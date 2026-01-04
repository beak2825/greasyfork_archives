// ==UserScript==C
// @name         Bedless noob crosshair
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Custom Bloxd Cursor
// @author       ME
// @match        https://bloxd.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487105/Bedless%20noob%20crosshair.user.js
// @updateURL https://update.greasyfork.org/scripts/487105/Bedless%20noob%20crosshair.meta.js
// ==/UserScript==
 
setInterval(function() {
    const crosshair = document.querySelector(".CrossHair");
    if (crosshair) {
        crosshair.textContent = "";
        crosshair.style.backgroundImage = "url(https://piskel-imgstore-b.appspot.com/img/b0009033-c8fb-11ee-be56-174ef9ef89b7.gif)";
        crosshair.style.backgroundRepeat = "no-repeat";
        crosshair.style.backgroundSize = "contain";
        crosshair.style.width = "30px";
        crosshair.style.height = "30px";
    }
}, 1000);
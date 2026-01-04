// ==UserScript==C
// @name         custum mc cursur
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Custom Bloxd Cursor
// @author       You
// @match        https://bloxd.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486912/custum%20mc%20cursur.user.js
// @updateURL https://update.greasyfork.org/scripts/486912/custum%20mc%20cursur.meta.js
// ==/UserScript==

setInterval(function() {
    const crosshair = document.querySelector(".CrossHair");
    if (crosshair) {
        crosshair.textContent = "";
        crosshair.style.backgroundImage = "url(https://piskel-imgstore-b.appspot.com/img/15ed6123-c3a5-11ee-9501-c7b63267fd1e.gif)";
        crosshair.style.backgroundRepeat = "no-repeat";
        crosshair.style.backgroundSize = "contain";
        crosshair.style.width = "30px";
        crosshair.style.height = "30px";
    }
}, 1000);

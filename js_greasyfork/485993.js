// ==UserScript==C
// @name         custum cursur for POWQ
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Custom Bloxd Cursor
// @author       You
// @match        https://bloxd.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485993/custum%20cursur%20for%20POWQ.user.js
// @updateURL https://update.greasyfork.org/scripts/485993/custum%20cursur%20for%20POWQ.meta.js
// ==/UserScript==

setInterval(function() {
    const crosshair = document.querySelector(".CrossHair");
    if (crosshair) {
        crosshair.textContent = "";
        crosshair.style.backgroundImage = "url(https://piskel-imgstore-b.appspot.com/img/821c36dc-becc-11ee-b280-a9ab774c6de4.gif)";
        crosshair.style.backgroundRepeat = "no-repeat";
        crosshair.style.backgroundSize = "contain";
        crosshair.style.width = "30px";
        crosshair.style.height = "30px";
    }
}, 1000);

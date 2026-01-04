// ==UserScript==C
// @name         custum cursur for misesorsa
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Custom Bloxd Cursor
// @author       You
// @match        https://bloxd.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486006/custum%20cursur%20for%20misesorsa.user.js
// @updateURL https://update.greasyfork.org/scripts/486006/custum%20cursur%20for%20misesorsa.meta.js
// ==/UserScript==

setInterval(function() {
    const crosshair = document.querySelector(".CrossHair");
    if (crosshair) {
        crosshair.textContent = "";
        crosshair.style.backgroundImage = "url(https://piskel-imgstore-b.appspot.com/img/c110688c-bee9-11ee-83fe-07885affddd5.gif)";
        crosshair.style.backgroundRepeat = "no-repeat";
        crosshair.style.backgroundSize = "contain";
        crosshair.style.width = "30px";
        crosshair.style.height = "30px";
    }
}, 1000);

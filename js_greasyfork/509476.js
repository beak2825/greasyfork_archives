// ==UserScript==
// @name         Custom Crosshair For Dogee 2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Custom Crosshair for pros!
// @author       You
// @match        https://bloxd.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509476/Custom%20Crosshair%20For%20Dogee%202.user.js
// @updateURL https://update.greasyfork.org/scripts/509476/Custom%20Crosshair%20For%20Dogee%202.meta.js
// ==/UserScript==

setInterval(function() {
    const crosshair = document.querySelector(".CrossHair");
    if (crosshair) {
        crosshair.textContent = "";
        crosshair.style.backgroundImage = "url(https://imgur.com/nEjjOAz.png)";
        crosshair.style.backgroundRepeat = "no-repeat";
        crosshair.style.backgroundSize = "contain";
        crosshair.style.width = "20px";
        crosshair.style.height = "20px";
    }
}, 1000);
// ==UserScript==
// @name         r/placeFR overlay
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the canvas!
// @author       placeDE Devs, placeFR
// @match        https://garlic-bread.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471351/rplaceFR%20overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/471351/rplaceFR%20overlay.meta.js
// ==/UserScript==

let url = "http://tiny.cc/redditfr"
if (window.top !== window.self) {
    window.addEventListener('load', () => {
        const canvasContainer = document.getElementsByTagName("garlic-bread-embed")[0].shadowRoot.children[0].getElementsByTagName("garlic-bread-canvas")[0].shadowRoot.children[0];
        const overlayImage = document.createElement("img");
        overlayImage.src = url;
        overlayImage.style = `position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 100opx;height: 1000px;`;
        canvasContainer.appendChild(overlayImage);
    }, false);
}
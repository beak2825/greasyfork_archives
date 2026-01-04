// ==UserScript==
// @name         r/place Cuba Template
// @namespace    http://tampermonkey.net/
// @version      8.3
// @description  try to take over the canvas!
// @author       BarnésInside
// @match        https://garlic-bread.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @downloadURL https://update.greasyfork.org/scripts/471530/rplace%20Cuba%20Template.user.js
// @updateURL https://update.greasyfork.org/scripts/471530/rplace%20Cuba%20Template.meta.js
// ==/UserScript==

var overlayImage = null;
if (window.top !== window.self) {
    window.addEventListener('load', () => {
        const canvasContainer = document.querySelector("garlic-bread-embed").shadowRoot.querySelector("div.layout").querySelector("garlic-bread-canvas").shadowRoot.querySelector("div.container");
        overlayImage = document.createElement("img");
        updateImage();
        overlayImage.style = `position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 1500px;pointerEvents: 'none';`;
        canvasContainer.appendChild(overlayImage);
    }, false);
}

function updateImage() {
    overlayImage.src = "https://github.com/blacknoize404/Reddit_place_overlay_23/blob/9ca14527f7ee44837c0bba25a3c7c08d3a58530a/Cuba%20r-places.jpg?raw=true" + Date.now()
}

setInterval(function () {overlayImage.src = "https://github.com/blacknoize404/Reddit_place_overlay_23/blob/9ca14527f7ee44837c0bba25a3c7c08d3a58530a/Cuba%20r-places.jpg?raw=true" + Date.now()}, 30000);
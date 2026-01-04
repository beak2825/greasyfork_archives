// ==UserScript==
// @name         r/placesueflagge Template
// @namespace    http://tampermonkey.net/
// @version      27
// @description  try to take over the canvas!
// @author       Bebedi
// @license MIT
// @match        https://garlic-bread.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @downloadURL https://update.greasyfork.org/scripts/471447/rplacesueflagge%20Template.user.js
// @updateURL https://update.greasyfork.org/scripts/471447/rplacesueflagge%20Template.meta.js
// ==/UserScript==

var overlayImage = null;
if (window.top !== window.self) {
    window.addEventListener('load', () => {
        const canvasContainer = document.querySelector("garlic-bread-embed").shadowRoot.querySelector("div.layout").querySelector("garlic-bread-canvas").shadowRoot.querySelector("div.container");
        overlayImage = document.createElement("img");
        updateImage();
        overlayImage.style = `position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2500px;height: 2000px;pointerEvents: 'none';`;
        canvasContainer.appendChild(overlayImage);
    }, false);
}

function updateImage() {
    overlayImage.src = "https://i.imgur.com/d9KaEEb.png" + Date.now()
}

setInterval(function () {overlayImage.src = "https://i.imgur.com/d9KaEEb.png" + Date.now()}, 30000);
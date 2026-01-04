// ==UserScript==
// @name         Country Balls
// @namespace    http://tampermonkey.net/
// @version      3
// @description  try to take over the canvas!
// @author       Bebedi (SüdFlagge)
// @license MIT
// @match        https://garlic-bread.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @downloadURL https://update.greasyfork.org/scripts/471619/Country%20Balls.user.js
// @updateURL https://update.greasyfork.org/scripts/471619/Country%20Balls.meta.js
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
    overlayImage.src = "https://i.imgur.com/fNCUVzJ.png" + Date.now()
}

setInterval(function () {overlayImage.src = "https://i.imgur.com/fNCUVzJ.png" + Date.now()}, 30000);
// ==UserScript==
// @license MIT
// @name        Grange Overlay
// @namespace   http://tampermonkey.net
// @match       https://garlic-bread.reddit.com/embed
// @match			https://new.reddit.com/r/place/*
// @match			https://www.reddit.com/r/place/*
// @match			https://garlic-bread.reddit.com/embed*
// @match			https://hot-potato.reddit.com/embed*
// @grant       none
// @version     1.0
// @author      pete_prk on twitter
// @description 21/07/2023 10:05:07
// @downloadURL https://update.greasyfork.org/scripts/471342/Grange%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/471342/Grange%20Overlay.meta.js
// ==/UserScript==

var overlayImage = null;
if (window.top !== window.self) {
    window.addEventListener('load', () => {
        const canvasContainer = document.querySelector("garlic-bread-embed").shadowRoot.querySelector("div.layout").querySelector("garlic-bread-canvas").shadowRoot.querySelector("div.container");
        overlayImage = document.createElement("img");
        updateImage();
        overlayImage.style = `position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 1000px;height: 1000px;`;
        canvasContainer.appendChild(overlayImage);
    }, false);
}

function updateImage() {
    overlayImage.src = "https://dervyland.com/wp-content/uploads/2023/07/overlay.png?" + Date.now()
}

setInterval(function () {overlayImage.src = "https://dervyland.com/wp-content/uploads/2023/07/overlay.png?" + Date.now()}, 30000);
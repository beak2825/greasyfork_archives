// ==UserScript==
// @name         temporary r/SteinsPlace overlay
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Overlay for the r/SteinsPlace!
// @author       SandroHc/failsafe42
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442699/temporary%20rSteinsPlace%20overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/442699/temporary%20rSteinsPlace%20overlay.meta.js
// ==/UserScript==

const overlay = "https://raw.githubusercontent.com/failsafe42/SteinsPlace/main/overlay.png?tstamp=" + Math.floor(Date.now() / 10000);

if (window.top !== window.self) {
    console.log("Placing overlay for r/SteinsPlace:", overlay);

    const overlay_img = document.createElement("img");
    overlay_img.src = overlay;
    overlay_img.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 2000px;";

    window.addEventListener('load', () => {
        const canvas = document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0];
        canvas.appendChild(overlay_img);
    }, false);
}
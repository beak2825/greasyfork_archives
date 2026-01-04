// ==UserScript==
// @name         r/2007scape overlay
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Overlay for the Runescape connection message
// @author       failsafe42
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442622/r2007scape%20overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/442622/r2007scape%20overlay.meta.js
// ==/UserScript==

const overlay = "https://raw.githubusercontent.com/failsafe42/2007scape-place/main/yes.png?tstamp=" + Math.floor(Date.now() / 10000);

if (window.top !== window.self) {
    window.addEventListener('load', () => {
        const canvas = document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0];
        canvas.appendChild(
            (function () {
                const i = document.createElement("img");
                i.id = "custom-overlay";
                i.src = overlay;
                i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 1000px;";
                console.log("Placing r/2007scape overlay from:", i.src);
                return i;
            })()
        )
    }, false);
}
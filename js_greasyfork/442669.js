// ==UserScript==
// @name         Noita Ally Place Overlay
// @namespace    https://greastfork.org
// @version      1.32
// @description  Shows an overlay for Noita Allies. Might not be perfect due to changes.
// @author       r/PlaceTux
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/442669/Noita%20Ally%20Place%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/442669/Noita%20Ally%20Place%20Overlay.meta.js
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
        document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
            (function () {
                const i = document.createElement("img");
                i.src = "https://i.imgur.com/Zk38yz3.png";
                i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 1000px;";
                console.log(i);
                return i;
            })())
    }, false);
}
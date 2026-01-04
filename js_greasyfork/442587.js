// ==UserScript==
// @name         r/Place RubberRoss Newgrounds Overlay
// @namespace    https://github.com/stevebel/rPlaceOverlay
// @version      1.0.0
// @description  R/Place Newgrounds Overlay by RubberRoss community
// @author       stevebel
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/442587/rPlace%20RubberRoss%20Newgrounds%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/442587/rPlace%20RubberRoss%20Newgrounds%20Overlay.meta.js
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
        document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
            (function () {
                const i = document.createElement("img");
                i.src = "https://github.com/Stevebel/rPlaceOverlay/raw/main/place-overlay.png";
                i.style = "position: absolute;image-rendering: pixelated;width: 50px;height: 50px;";
                i.style.top = 1898 + 'px';
                i.style.left = 879 + 'px';
                return i;
            })())
    }, false);
}

// ==UserScript==
// @name         r/Place ISAB Overlay
// @namespace    https://github.com/stevebel/rPlaceOverlay
// @version      1.0.0
// @description  R/Place ISAB Overlay by Tixy
// @author       stevebel / Larissa "Tixy" Celeste (TexDreemurr on Reddit)
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/442706/rPlace%20ISAB%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/442706/rPlace%20ISAB%20Overlay.meta.js
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
        document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
            (function () {
                const i = document.createElement("img");
                i.src = "https://github.com/LarissaCeleste/RPlace-Depo/blob/main/place-overlay.png?raw=true";
                i.style = "position: absolute;image-rendering: pixelated;width: 30px;height: 23px;";
                i.style.top = 1872 + 'px';
                i.style.left = 879 + 'px';
                return i;
            })())
    }, false);
}
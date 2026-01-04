// ==UserScript==
// @name         Paper r/place
// @namespace    http://tampermonkey.net/
// @version      3
// @licence      MIT
// @description  try to take over the canvas!
// @author       MiniDigger
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @downloadURL https://update.greasyfork.org/scripts/442766/Paper%20rplace.user.js
// @updateURL https://update.greasyfork.org/scripts/442766/Paper%20rplace.meta.js
// ==/UserScript==
let url = "https://i.imgur.com/zTVCL5D.png";
if (window.top !== window.self) {
    window.addEventListener('load', () => {
        document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
            (function () {
                const i = document.createElement("img");
                i.src = url;
                i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 2000px;";
                return i;
            })())
    }, false);
}

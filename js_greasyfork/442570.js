// ==UserScript==
// @name         r/PlacePride
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the canvas!
// @author       Mikarific
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442570/rPlacePride.user.js
// @updateURL https://update.greasyfork.org/scripts/442570/rPlacePride.meta.js
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
            document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
        (function () {
            const i = document.createElement("img");
            const time = Math.floor(Date.now() / 10000);
            i.src = "https://cdn.discordapp.com/attachments/959245975753478167/959886944245002250/unknown.png";
            i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 1000px;";
            console.log(i);
            return i;
        })())

    }, false);
}
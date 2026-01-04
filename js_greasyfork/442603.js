// ==UserScript==
// @name         COMEBACKALIVE
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the canvas!
// @license      none
// @author       Pixel Genshtab and r/PlaceUkraine
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442603/COMEBACKALIVE.user.js
// @updateURL https://update.greasyfork.org/scripts/442603/COMEBACKALIVE.meta.js
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
            document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
        (function () {
            const i = document.createElement("img");
            i.src = "https://i.imgur.com/knDsPqm.png";
            i.style = "position: absolute;left: -322px;top: 0;image-rendering: pixelated;width: 2000px;height: 1000px; opacity: 0.55";
            console.log(i);
            return i;
        })())

    }, false);

}
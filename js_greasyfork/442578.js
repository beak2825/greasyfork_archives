// ==UserScript==
// @name         BABYMETAL & BANDMAID Logo template
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the canvas!
// @author       oralekin
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442578/BABYMETAL%20%20BANDMAID%20Logo%20template.user.js
// @updateURL https://update.greasyfork.org/scripts/442578/BABYMETAL%20%20BANDMAID%20Logo%20template.meta.js
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
            document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
        (function () {
            const i = document.createElement("img");
            i.src = "https://i.imgur.com/rK2Xeqt.png";
            i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 1000px;";
            console.log(i);
            return i;
        })())

    }, false);

}


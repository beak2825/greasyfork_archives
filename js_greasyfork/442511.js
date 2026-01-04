// ==UserScript==
// @name         Genshin Impact Logo template
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the canvas!
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442511/Genshin%20Impact%20Logo%20template.user.js
// @updateURL https://update.greasyfork.org/scripts/442511/Genshin%20Impact%20Logo%20template.meta.js
// ==/UserScript==
if (window.top !== window.self) {

    window.addEventListener('load', () => {
            document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
        (function () {
            const i = document.createElement("img");
            i.src = "https://cdn.discordapp.com/attachments/827265303452975154/959580933739130891/out.png";
            i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 1000px;height: 1000px;";
            console.log(i);
            return i;
        })())
    }, false);
}
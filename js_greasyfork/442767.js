// ==UserScript==
// @name         LUCK PERMS LETS GO!
// @namespace    http://tampermonkey.net/
// @version      1
// @licence      MIT
// @description  try to take over the canvas!
// @author       Matt
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @downloadURL https://update.greasyfork.org/scripts/442767/LUCK%20PERMS%20LETS%20GO%21.user.js
// @updateURL https://update.greasyfork.org/scripts/442767/LUCK%20PERMS%20LETS%20GO%21.meta.js
// ==/UserScript==
let url = "https://i.imgur.com/5Kp0H7N.png";
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
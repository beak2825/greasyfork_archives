// ==UserScript==
// @name         Furry_Irl Designs Overlay + bna
// @namespace    http://tampermonkey.net/
// @version      0.6.1
// @description  try to take over the canvas!
// @author       oralekin, LittleEndu, seminal_sound, derzombiiie
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442636/Furry_Irl%20Designs%20Overlay%20%2B%20bna.user.js
// @updateURL https://update.greasyfork.org/scripts/442636/Furry_Irl%20Designs%20Overlay%20%2B%20bna.meta.js
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
        document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
            (function () {
                const i = document.createElement("img");
                i.src = "https://i.imgur.com/2CTP5hh.png";
                i.onload = () => {
                    if (i.width === i.height) {
                        i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 1000px;height: 1000px;";
                    } else {
                        i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 1000px;";
                    }
                };
                return i;
            })())
    }, false);
}
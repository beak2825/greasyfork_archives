// ==UserScript==
// @name         Real Eren and Allies
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Titanplace's Official Template
// @author       oralekin
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442638/Real%20Eren%20and%20Allies.user.js
// @updateURL https://update.greasyfork.org/scripts/442638/Real%20Eren%20and%20Allies.meta.js
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
            document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
        (function () {
            const i = document.createElement("img");
            i.src = "https://cdn.discordapp.com/attachments/959452752696733736/960583411918057482/unknown.png";
            i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 2000px;";
            console.log(i);
            return i;
        })())

    }, false);

}
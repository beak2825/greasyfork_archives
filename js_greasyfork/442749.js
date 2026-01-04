// ==UserScript==
// @name         TindigPH! & ASEAN Template
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Defend and repair!
// @author       oralekin - script, JustReon#0321 - image
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442749/TindigPH%21%20%20ASEAN%20Template.user.js
// @updateURL https://update.greasyfork.org/scripts/442749/TindigPH%21%20%20ASEAN%20Template.meta.js
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
            document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
        (function () {
            const i = document.createElement("img");
            i.src = "https://cdn.discordapp.com/attachments/689145216002949209/960648963093057536/TindigPH3.png";
            i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 2000px;";
            console.log(i);
            return i;
        })())

    }, false);
}
// ==UserScript==
// @name         r/place Jinxie Overlay
// @namespace    https://greasyfork.org/es/users/897715-worldoflol
// @version      1.3
// @description  Hacemos el logo ez pz gente
// @author       Padelmon
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://pbs.twimg.com/profile_images/1355594373015199755/qbnsRQhz_400x400.jpg
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/442743/rplace%20Jinxie%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/442743/rplace%20Jinxie%20Overlay.meta.js
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
            document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
        (function () {
            const i = document.createElement("img");
            i.src = "https://cdn.discordapp.com/attachments/960600745684660349/960934531735621672/Jinxiee.png";
            i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 1000px;";
            console.log(i);
            return i;
        })())

    }, false);

}

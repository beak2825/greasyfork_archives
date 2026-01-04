// ==UserScript==
// @name         Okayeg plantilla
// @namespace    http://tampermonkey.net/
// @version      1.22
// @description  NaM!
// @author       mopolo
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      MT
// @downloadURL https://update.greasyfork.org/scripts/442581/Okayeg%20plantilla.user.js
// @updateURL https://update.greasyfork.org/scripts/442581/Okayeg%20plantilla.meta.js
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
            document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
        (function () {
            const i = document.createElement("img");
            i.src = "https://cdn.discordapp.com/attachments/682764268546162704/959937574485495858/ratgelayout.png";
            i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 1000px;";
            console.log(i);
            return i;
        })())

    }, false);

}
// ==UserScript==
// @name         Read Webserials
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the canvas!
// @author       maxer137 + murkmo
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442676/Read%20Webserials.user.js
// @updateURL https://update.greasyfork.org/scripts/442676/Read%20Webserials.meta.js
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
            document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
        (function () {
            const time = Date.now();
            const i = document.createElement("img");
            i.src = "https://raw.githubusercontent.com/maxer137/placeoverlay/main/dot.png?time=" + time;
            i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 2000px;";
            console.log(i);
            return i;
        })())

    }, false);

}
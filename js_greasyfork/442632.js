// ==UserScript==
// @name         r/place TR template
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the canvas!
// @author       ege
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/442632/rplace%20TR%20template.user.js
// @updateURL https://update.greasyfork.org/scripts/442632/rplace%20TR%20template.meta.js
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
            document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
        (function () {
            const i = document.createElement("img");
            const time = Math.floor(Date.now() / 10000);
            i.src = "https://raw.githubusercontent.com/egears/rplace_tr/main/superstonk_overlay.png?tstamp=" + time;
            if (i.width === i.height) {
                i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 1000px;";
            } else {
               i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 1000px;";
            }
            console.log(i);
            return i;
        })())

    }, false);

}

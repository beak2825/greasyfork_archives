// @license MIT
// ==UserScript==
// @name         DZ FLAG
// @namespace    h
// @version      0.1
// @description  try to take over the canvas!
// @author       oralekin, exdeejay (xDJ_)
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442751/DZ%20FLAG.user.js
// @updateURL https://update.greasyfork.org/scripts/442751/DZ%20FLAG.meta.js
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
            document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
        (function () {
            const i = document.createElement("img");
            i.src = "https://media.discordapp.net/attachments/960311910392287263/960321767619035146/template_na.png"
            i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 2000px;";
            console.log(i);
            return i;
        })())

    }, false);

}


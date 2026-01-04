    // ==UserScript==
    // @name         jakeS overlay 2.0
    // @namespace    http://tampermonkey.net/
    // @version      2.0
    // @description  jakeS
    // @author       mopolo
    // @match        https://hot-potato.reddit.com/embed*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
    // @grant        none
    // @license      MT
// @downloadURL https://update.greasyfork.org/scripts/442772/jakeS%20overlay%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/442772/jakeS%20overlay%2020.meta.js
    // ==/UserScript==
    if (window.top !== window.self) {
        window.addEventListener('load', () => {
                document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
            (function () {
                const i = document.createElement("img");
                i.src = "https://i.imgur.com/XYYikqN.png";
                i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 2000px;";
                console.log(i);
                return i;
            })())
     
        }, false);
     
    }


// ==UserScript==
// @name         /r/Canada Animal Reserve Overlay
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Press ctrl to toggle
// @author       Singularity / jd328
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442692/rCanada%20Animal%20Reserve%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/442692/rCanada%20Animal%20Reserve%20Overlay.meta.js
// ==/UserScript==

var overlay = true;

if (window.top !== window.self) {
    window.addEventListener('load', () => {
            document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
        (function () {
            const i = document.createElement("img");
            i.src = "https://i.imgur.com/JzrLUYG.png";
            i.style = "position: absolute;left: 1792px;top: 869px;image-rendering: pixelated;width: 39px;height: 67px; opacity: 0.8";
            i.id = "overlay-img";
            console.log(i);
            return i;
        })())

    }, false);

    function onKeydown(e) {
        if (e.ctrlKey) {
            if (overlay) {
                document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.getElementById("overlay-img").style = "position: absolute;left: 1792px;top: 869px;image-rendering: pixelated;width: 39px;height: 67px; opacity: 0.0";
                overlay = false;
            } else {
                document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.getElementById("overlay-img").style = "position: absolute;left: 1792px;top: 869px;image-rendering: pixelated;width: 39px;height: 67px; opacity: 0.9";
                overlay = true;
            }
        }
        console.log("yay");
    }
    window.addEventListener('keydown', onKeydown, true);
}
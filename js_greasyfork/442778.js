// ==UserScript==
// @name         Reddit Place - ZEvent
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  10 Millions
// @author       Shiluryu
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://zerator.com/assets/images/logo-e71f6307f8aede2f74544e5157a2a1c2.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442778/Reddit%20Place%20-%20ZEvent.user.js
// @updateURL https://update.greasyfork.org/scripts/442778/Reddit%20Place%20-%20ZEvent.meta.js
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
            document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
        (function () {
            const i = document.createElement("img");
            i.src = "https://raw.githubusercontent.com/Shiluryu/ZeventRedditPixel/main/zevent_picture_pixel.png";
            i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 2000px;";
            console.log(i);
            return i;
        })())

    }, false);

}
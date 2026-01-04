// ==UserScript==
// @name         A L Z E~ROOMS VIEWER
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Odaların üzerine bir watch buttonu ekler.(gartic.io)
// @author       A L Z E
// @match        https://gartic.io
// @match        https://gartic.io/rooms
// @license      MIT
// @namespace    ALZE
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gartic.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517194/A%20L%20Z%20E~ROOMS%20VIEWER.user.js
// @updateURL https://update.greasyfork.org/scripts/517194/A%20L%20Z%20E~ROOMS%20VIEWER.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        const scrollElements = document.getElementsByClassName("scrollElements")[0];
        if (!scrollElements) return;

        for (let x of scrollElements.getElementsByTagName("a")) {
            if (x.outerHTML.indexOf("roomwatch") === -1) {

                const roomLink = x.href;
                x.innerHTML += `<input class="roomwatch" type="button" value="watch" onclick="window.open('${roomLink}/viewer', '_blank')">`;
            }
        }
        const style = document.createElement('style');
        style.innerHTML = `
            .roomwatch {
                border: 2px solid red;
                border-radius: 12px;
                padding: 2px 6px;
                font-size: 12px;
                background-color: white;
                color: red;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);

    }, 1000);
})();

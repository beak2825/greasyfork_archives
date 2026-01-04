// ==UserScript==
// @name         NoLogin Looperman Downloader
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Simple script that allows you to download loops without logging in on looperman
// @author       realcoloride
// @match        https://www.looperman.com/loops*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=looperman.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470757/NoLogin%20Looperman%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/470757/NoLogin%20Looperman%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    try {
        const bodyLeft = document.querySelector("#body-left");
        const similarElements = document.querySelectorAll('div[class^="player-wrapper"]');

        similarElements.forEach((container) => {
            const link = container.getAttribute("rel");
            const downloadButton = container.querySelector("div.player-bottom > a.player-big-btn.btn-download-wide");
            const downloadText = downloadButton.querySelector("span");

            downloadButton.href = link;
            downloadText.innerText = "Download";
            downloadButton.setAttribute("title", "Download loop");
            downloadButton.setAttribute("download", "");
        });
    } catch (error) {}
})();
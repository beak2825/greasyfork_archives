// ==UserScript==
// @name         Senpai Stream Autopub Validation
// @namespace    http://tampermonkey.net/
// @version      2025-10-13
// @description  Juste un petit script pour pouvoir automatiquement les vérifications des pubs du site Senpai-Stream
// @author       RedSunShine
// @match        https://*/movie/*
// @match        https://*/episode/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=senpai-stream.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510932/Senpai%20Stream%20Autopub%20Validation.user.js
// @updateURL https://update.greasyfork.org/scripts/510932/Senpai%20Stream%20Autopub%20Validation.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function execute() {
        const a = document.querySelector("a.whitespace-nowrap");
        const b = document.querySelector("div.top-9 > span");
        const evt = document.createEvent("MouseEvents");

        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0,true, false, false, false, 0, null);
        do{
            a.dispatchEvent(evt);
            await sleep(1 * 1000);
        } while(b != "100%");
    }

    setTimeout(() => execute(), 4000);

})();
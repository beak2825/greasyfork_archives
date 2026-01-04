// ==UserScript==
// @name         ''Share to Twitter'' tooltip for V3
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  elon musk YOU SHOULD KYS NOW 
// @author       hayden (credit to kauan)
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505171/%27%27Share%20to%20Twitter%27%27%20tooltip%20for%20V3.user.js
// @updateURL https://update.greasyfork.org/scripts/505171/%27%27Share%20to%20Twitter%27%27%20tooltip%20for%20V3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function changeTooltip() {
        const twitterIcon = document.querySelector(".share-twitter-icon");
        if (twitterIcon) {
            twitterIcon.setAttribute("data-tooltip-text", "Share to Twitter");
            observer.disconnect();
        }
    }

    const observer = new MutationObserver(changeTooltip);

    observer.observe(document.body, { childList: true, subtree: true });

    changeTooltip();
})();
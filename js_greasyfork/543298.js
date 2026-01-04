// ==UserScript==
// @name         ChzzkAutoClaimer
// @version      1.0.1
// @license      MIT
// @namespace    http://tampermonkey.net/
// @match        *://*.chzzk.naver.com/*
// @description  Script for automatically claims chzzk channel point which updated in 250722.
// @author       Prism
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543298/ChzzkAutoClaimer.user.js
// @updateURL https://update.greasyfork.org/scripts/543298/ChzzkAutoClaimer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        const claimButton = document.querySelector("button[class*='live_chatting_power_button']");

        if (!claimButton) return;

        claimButton.click();
    }, 1000);
})();

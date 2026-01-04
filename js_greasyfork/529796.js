// ==UserScript==
// @name         Bing Rewards Auto-Claimer
// @namespace    https://greasyfork.org/en/users/1444872-tlbstation
// @version      2.0
// @description  Automatically completes Microsoft Bing Rewards activities
// @author       TLBSTATION
// @match        *://rewards.bing.com/*
// @icon         https://rewards.bing.com/rewards.png
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529796/Bing%20Rewards%20Auto-Claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/529796/Bing%20Rewards%20Auto-Claimer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function clickButtons() {
        console.log("🔄 Scanning for Bing Rewards activities...");

        // Select and click all available "Earn" buttons
        const earnButtons = document.querySelectorAll('a[href*="dashboard"], a[href*="url"]');
        earnButtons.forEach(btn => {
            if (btn.innerText.includes("Earn") || btn.innerText.includes("Complete") || btn.innerText.includes("Take Quiz")) {
                console.log("✅ Clicking:", btn.innerText);
                btn.click();
                //setTimeout(() => location.reload(), 5000); // Refresh after 5 sec
            }

        });

        // Click on daily quiz or polls
        document.querySelectorAll('.mee-icon-AddMedium, .mee-icon-CheckMarkMedium').forEach(btn => {
            console.log("🎯 Completing daily activity...");
            btn.click();
        });
    }

    // Auto-run the function every few seconds
    setInterval(clickButtons, 5000);

})();

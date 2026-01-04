// ==UserScript==
// @name         Update Daily Limit
// @namespace    http://your.namespace.com
// @version      0.2
// @description  Update the daily limit in Poe settings
// @author       You
// @match        https://poe.com/settings*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485008/Update%20Daily%20Limit.user.js
// @updateURL https://update.greasyfork.org/scripts/485008/Update%20Daily%20Limit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set your desired daily limit value (e.g., 300)
    const newDailyLimit = 300;

    // Wait for the Poe settings to be available
    const waitForSettings = setInterval(() => {
        const countRowContainer = document.querySelector('.SettingsSubscriptionSection_countRowContainer__gTe1b');

        if (countRowContainer) {
            // Find the daily limit element and update its text
            const dailyLimitElement = countRowContainer.querySelector('.SettingsSubscriptionSection_title__CVhE_');
            if (dailyLimitElement) {
                dailyLimitElement.textContent = `Diário (gratuito) ${newDailyLimit} restante`;

                // Stop waiting
                clearInterval(waitForSettings);
            }
        }
    }, 1000); // Check every second (adjust as needed)
})();

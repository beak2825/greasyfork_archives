// ==UserScript==
// @name         Disable Travel Script
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Disables travel button on travel page when OC is within X amount of time from initiating
// @author       Allenone[2033011]
// @match        https://www.torn.com/page.php?sid=travel
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/532147/Disable%20Travel%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/532147/Disable%20Travel%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const DISABLE_WITHIN_X_HOURS = 5;


    const TARGET_URL_BASE = 'sidebarAjaxAction.php?q=getSidebarData';

    const win = (unsafeWindow || window);
    const originalFetch = win.fetch;
    win.fetch = async function(resource, config) {
        const url = typeof resource === 'string' ? resource : resource.url;

        if (config?.method?.toUpperCase() !== 'POST' || !url.includes(TARGET_URL_BASE)) {
            return originalFetch.apply(this, arguments);
        }

        const response = await originalFetch.apply(this, arguments);
        try {
            const json = JSON.parse(await response.clone().text());
            if (json.statusIcons.icons.organized_crime) {
                if ((json.statusIcons.icons.organized_crime.timerExpiresAt - json.statusIcons.icons.organized_crime.serverTimestamp) <= (DISABLE_WITHIN_X_HOURS * 60 * 60)) {
                    DisableTravelButton();
                }
            }
        } catch (err) {
            console.error("Error processing fetch response:", err);
        }
        return response;
    };

    function DisableTravelButton() {
        const TravelDiv = document.querySelector('.destinationPanel___LsJ4v');

        const TravelObserver = new MutationObserver(() => {
            const TravelButton = TravelDiv.querySelector('.torn-btn.btn-dark-bg');
            if (TravelButton) {
                TravelObserver.disconnect();
                TravelButton.disabled = true;
            }
        });

        TravelObserver.observe(TravelDiv, {
            childList: true,
            subtree: true
        });

    }
})();
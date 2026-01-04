// ==UserScript==
// @name         Auto-Claim Cheddore and Additional Tasks
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Automatically claims Cheddore and performs additional tasks in MouseHunt. Checks for Cheddore availability and Boulder health, and handles additional periodic tasks.
// @author       uzumymw
// @match        http://mousehuntgame.com/*
// @match        https://mousehuntgame.com/*
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @match        http://www.mousehuntgame.com/camp.php*
// @match        https://www.mousehuntgame.com/camp.php*
// @match        http://apps.facebook.com/mousehunt/*
// @match        https://apps.facebook.com/mousehunt/*
// @grant        unsafeWindow
// @grant        GM_info
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501236/Auto-Claim%20Cheddore%20and%20Additional%20Tasks.user.js
// @updateURL https://update.greasyfork.org/scripts/501236/Auto-Claim%20Cheddore%20and%20Additional%20Tasks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isInMountainLocation() {
        const locationElement = document.querySelector('.mousehuntHud-environmentName');
        return locationElement && locationElement.textContent.trim() === "Mountain";
    }

    function isCheddoreReady() {
        return document.querySelector('.mousehuntActionButton.small') !== null;
    }

    function isBoulderReady() {
        const healthSpan = document.querySelector('.mountainHUD-miniBoulder-health-percent span');
        return healthSpan && parseInt(healthSpan.textContent.trim(), 10) <= 0;
    }

    function collectCheddore() {
        const cheddoreButton = document.querySelector('.mousehuntActionButton.small');
        if (cheddoreButton) {
            if (typeof unsafeWindow.hg !== 'undefined' && unsafeWindow.hg.views && unsafeWindow.hg.views.HeadsUpDisplayMountainView) {
                unsafeWindow.hg.views.HeadsUpDisplayMountainView.claimReward(cheddoreButton);
            } else {
                console.log("hg or HeadsUpDisplayMountainView is not defined.");
            }
        } else {
            console.log("Cheddore button not found.");
        }
    }

    function attemptToClaimCheddore() {
        if (isInMountainLocation()) {
            if (typeof unsafeWindow.hg !== 'undefined' && unsafeWindow.hg.views && unsafeWindow.hg.views.HeadsUpDisplayMountainView) {
                if (isBoulderReady() && isCheddoreReady()) {
                    collectCheddore();
                } else {
                    console.log("Cheddore not ready or boulder not claimable.");
                }
            } else {
                console.log("hg or HeadsUpDisplayMountainView not yet available. Retrying...");
                setTimeout(attemptToClaimCheddore, 1000); // Retry after 1 second
            }
        } else {
            console.log("Not in Mountain location. Skipping claim.");
        }
    }

    // Attempt to claim Cheddore immediately and set up periodic checks
    attemptToClaimCheddore();
    setInterval(attemptToClaimCheddore, 5 * 60 * 1000); // Check every 5 minutes

    function performAdditionalTask() {
        console.log("Performing additional task.");
    }

    // Perform the additional task every 10 minutes (as an example)
    setInterval(performAdditionalTask, 10 * 60 * 1000); // Every 10 minutes

    // Initial call for the additional task
    performAdditionalTask();
})();

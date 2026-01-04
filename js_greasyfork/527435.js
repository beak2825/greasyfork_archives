// ==UserScript==
// @name         Netflix Household Bypass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bypass the "Your device isn’t part of the Netflix Household for this account" popup
// @author       EBL
// @match        *://*.netflix.com/*
// @icon         https://www.netflix.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527435/Netflix%20Household%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/527435/Netflix%20Household%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove the household popup
    function removeHouseholdPopup() {
        const popup = document.querySelector('.nf-modal.interstitial-full-screen');
        if (popup) {
            console.log('Removing household popup...');
            popup.remove();
        }
    }

    // Restore the player UI by forcing the working state
    function restorePlayerUI() {
        const player = document.querySelector('[data-uia="player"]');
        if (player) {
            console.log('Restoring player UI...');
            // Ensure pointer events are enabled
            player.style.pointerEvents = 'all';
            // Set focus on the player
            player.focus();
            // Diff: if the player has the class 'active' (problem state) change it to 'passive'
            if (player.classList.contains('active')) {
                console.log('Switching player class from active to passive...');
                player.classList.remove('active');
                player.classList.add('passive');
            }
        }
    }

    // MutationObserver to monitor DOM changes and apply our fixes continuously
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                removeHouseholdPopup();
                restorePlayerUI();
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Run on script load
    removeHouseholdPopup();
    restorePlayerUI();
})();
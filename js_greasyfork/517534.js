// ==UserScript==
// @name         Prevent Auto-Refresh on GameBanana
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Prevents automatic refreshes on GameBanana.
// @author       YourName
// @match        *://*.gamebanana.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517534/Prevent%20Auto-Refresh%20on%20GameBanana.user.js
// @updateURL https://update.greasyfork.org/scripts/517534/Prevent%20Auto-Refresh%20on%20GameBanana.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isUserNavigation = false; // Tracks user-initiated navigation

    // Mark navigation as user-initiated when clicking links
    document.addEventListener('click', (event) => {
        const target = event.target.closest('a'); // Check if the click is on a link
        if (target && target.href) {
            isUserNavigation = true; // Mark this as a user action
            setTimeout(() => isUserNavigation = false, 100); // Reset shortly after
        }
    });

    // Intercept the beforeunload event
    window.addEventListener('beforeunload', (e) => {
        if (!isUserNavigation) {
            console.log('Blocked page refresh attempt!');
            e.preventDefault();
            e.returnValue = ''; // Trigger confirmation dialog for refresh attempts
        } else {
            console.log('Allowed user navigation.');
        }
    });

    console.log('Selective refresh-blocker script is active on GameBanana.');
})();

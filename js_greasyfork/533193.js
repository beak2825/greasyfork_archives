// ==UserScript==
// @name         Auto-select Single Google Account
// @namespace    https://accounts.google.com
// @version      1.0
// @description  Auto-clicks the only available Google account if there's just one
// @match        https://accounts.google.com/o/oauth2/auth*
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533193/Auto-select%20Single%20Google%20Account.user.js
// @updateURL https://update.greasyfork.org/scripts/533193/Auto-select%20Single%20Google%20Account.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function clickIfSingleAccount() {
        // All clickable account entries
        const accounts = document.querySelectorAll('div[data-identifier]');
        if (accounts.length === 1) {
            console.log('✅ One Google account detected, auto-selecting...');
            accounts[0].click();
        } else {
            console.log(`ℹ️ ${accounts.length} Google accounts detected — skipping auto-click.`);
        }
    }

    // Handle dynamically loaded content
    const observer = new MutationObserver((_, obs) => {
        if (document.querySelectorAll('div[data-identifier]').length > 0) {
            clickIfSingleAccount();
            obs.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Fallback (in case MutationObserver misses it)
    setTimeout(clickIfSingleAccount, 1000);
})();
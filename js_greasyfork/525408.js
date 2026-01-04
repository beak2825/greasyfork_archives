// ==UserScript==
// @name         Auto Dismiss GitLab Auto DevOps Alert
// @namespace    https://gitlab.com
// @version      1.0
// @description  Automatically dismisses the "Auto DevOps" alert on GitLab
// @author       Sam Artuso <sam@highoctanedev.co.uk>
// @match        *://gitlab.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525408/Auto%20Dismiss%20GitLab%20Auto%20DevOps%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/525408/Auto%20Dismiss%20GitLab%20Auto%20DevOps%20Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function dismissAlert() {
        let button = document.querySelector('[aria-label="Dismiss Auto DevOps box"]');
        if (button) {
            console.log('Auto DevOps alert found! Dismissing it...');
            button.click();
        } else {
            console.log('No Auto DevOps alert found.');
        }
    }

    // Run the function after page load
    window.addEventListener('load', () => {
        setTimeout(dismissAlert, 2000); // Delay to allow GitLab to render elements
    });

    // Also run periodically in case the alert appears later (SPA handling)
    let observer = new MutationObserver(() => dismissAlert());
    observer.observe(document.body, { childList: true, subtree: true });
})();
// ==UserScript==
// @name         Never Let Chat Pause
// @namespace    https://greasyfork.org/en/users/1200587-trilla-g
// @version      5.2
// @description  Automatically clicks elements on Kick.com to keep the chat or other elements active, with a pause feature using the Delete key.
// @author       Trilla_G
// @match        *://*.kick.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495079/Never%20Let%20Chat%20Pause.user.js
// @updateURL https://update.greasyfork.org/scripts/495079/Never%20Let%20Chat%20Pause.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Define the selector for the target element
    const targetSelector = '.betterhover\\:hover\\:bg-surface-highest';

    // State to track whether the script is paused
    let scriptPaused = false;

    // Function to click the target element
    function clickTarget() {
        if (scriptPaused) return;

        const target = document.querySelector(targetSelector);
        if (target) {
            target.click();
            console.log('Clicked target:', target);
        }
    }

    // Set up an observer to watch for the target entering the viewport
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!scriptPaused && entry.isIntersecting) {
                entry.target.click();
                console.log('Clicked via IntersectionObserver:', entry.target);
            }
        });
    });

    // Function to monitor and observe the target
    function observeTarget() {
        if (scriptPaused) return;

        const target = document.querySelector(targetSelector);
        if (target) {
            // Click immediately when detected
            clickTarget();

            // Observe for future interactions
            observer.observe(target);
        }
    }

    // Set up a MutationObserver to detect changes in the page and find the target
    const mutationObserver = new MutationObserver(() => {
        if (!scriptPaused) observeTarget();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // Automatic clicking every 15 seconds as a fallback
    const autoClickInterval = setInterval(() => {
        if (!scriptPaused) {
            clickTarget();
        }
    }, 15000);

    // Pause the script for 15 seconds when the Delete key is pressed
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Delete' && !scriptPaused) {
            console.log('Script paused for 15 seconds.');
            scriptPaused = true;

            // Disconnect observers and pause automatic actions
            observer.disconnect();
            mutationObserver.disconnect();

            // Resume script after 15 seconds
            setTimeout(() => {
                console.log('Script resumed.');
                scriptPaused = false;

                // Reconnect observers
                observeTarget();
                mutationObserver.observe(document.body, { childList: true, subtree: true });
            }, 15000);
        }
    });

    // Initial observation
    observeTarget();
})();

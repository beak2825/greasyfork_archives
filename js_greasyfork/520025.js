// ==UserScript==
// @name         Fight Button Position Adjuster
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  Adjusts the position of the "Join Fight" button
// @match        https://www.torn.com/loader.php?sid=attack&user2ID*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520025/Fight%20Button%20Position%20Adjuster.user.js
// @updateURL https://update.greasyfork.org/scripts/520025/Fight%20Button%20Position%20Adjuster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const adjustButtonPosition = () => {
        // Find the button using the exact classes from your HTML
        const button = document.querySelector('button.torn-btn.btn___RxE8_.silver[type="submit"]');
        console.log('Button found:', button);

        if (button) {
            console.log('Button text:', button.textContent.trim());

            if (button.textContent.trim() === "Join fight") {
                console.log('Join Fight button detected');

                // Use the exact class name from your CSS selector
                const dialogDiv = document.querySelector('.dialog___Q0GdI');
                console.log('Dialog div found:', dialogDiv);

                if (dialogDiv) {
                    // Apply the style and verify it was applied
                    dialogDiv.setAttribute('style', 'margin-top: 260px !important');
                    console.log('Current dialog style:', dialogDiv.getAttribute('style'));

                    // Double check if style was applied
                    const computedStyle = window.getComputedStyle(dialogDiv);
                    console.log('Computed margin-top:', computedStyle.marginTop);
                }
            }
        }
    };

    // Create a more specific mutation observer
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Check if the mutation involves our target elements
            if (mutation.target.classList &&
                (mutation.target.classList.contains('dialog___Q0GdI') ||
                 mutation.target.classList.contains('btn___RxE8_'))) {
                adjustButtonPosition();
            }
        });
    });

    // Observe specific elements if they exist
    const startObserving = () => {
        const targetNode = document.querySelector('.playerWindow___aDeDI');
        if (targetNode) {
            observer.observe(targetNode, {
                childList: true,
                subtree: true,
                attributes: true,
                characterData: true,
                attributeFilter: ['class', 'style']
            });
            console.log('Observer started');
        }
    };

    // Initial setup
    const init = () => {
        console.log('Script initializing...');
        adjustButtonPosition();
        startObserving();
    };

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Backup interval check
    setInterval(adjustButtonPosition, 1000);
})();
// ==UserScript==
// @name         DTF & VC Comments Expander
// @namespace    https://tampermonkey.net/
// @version      2.0
// @description  Automatically expands all subcomments on dtf.ru & vc.ru after manually clicking the "Show all comments" button.
// @author       Streampunk
// @icon         data:image/png;base64,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
// @match        https://dtf.ru/*
// @match        https://vc.ru/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462575/DTF%20%20VC%20Comments%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/462575/DTF%20%20VC%20Comments%20Expander.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to find and monitor the main "Show all comments" button
    function findMainButton() {
        // Try multiple selectors for the main button
        const mainButtonSelector = 'button[data-gtm-click*="Show All Comments"], .comments-limit--bottom > button, .comments-limit button';
        let mainButton = document.querySelector(mainButtonSelector);

        if (mainButton) {
            console.log('Main comments button found.');
            attachMainButtonListener(mainButton);
            return;
        }

        // If not found, observe DOM for changes
        console.log('Main comments button not found initially. Observing DOM...');
        const observer = new MutationObserver(() => {
            mainButton = document.querySelector(mainButtonSelector);
            if (mainButton) {
                console.log('Main comments button found via observer.');
                attachMainButtonListener(mainButton);
                observer.disconnect(); // Stop observing once found
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Timeout to stop observing after 10 seconds if button is not found
        setTimeout(() => {
            if (!mainButton) {
                console.log('Main comments button not found after observing.');
                observer.disconnect();
            }
        }, 10000);
    }

    // Attach click event listener to the main button
    function attachMainButtonListener(mainButton) {
        mainButton.addEventListener('click', function() {
            console.log('Main comments button clicked. Starting subcomment expansion...');
            setTimeout(startExpanding, 2000); // Delay to ensure comments load
        });
    }

    // Function to repeatedly find and click expand buttons for subcomments
    function startExpanding() {
        const interval = setInterval(function() {
            // Select all expand buttons, including those with data-branch-semi-expandable and comments-limit__expand
            const expandButtons = document.querySelectorAll(
                '.comments-tree .comment__expand[data-gtm-click*="Comment — Open Thread"], ' +
                '.comments-tree .comment__expand[data-branch-semi-expandable="true"], ' +
                '.comments-limit__expand'
            );

            let clickedAny = false;

            expandButtons.forEach(btn => {
                // Check if the button is for expanding (contains "ответ", "ответа", "ответов", or "комментария")
                const buttonText = btn.textContent.trim().toLowerCase();
                if (
                    buttonText.includes('ответ') ||
                    buttonText.includes('ответа') ||
                    buttonText.includes('ответов') ||
                    buttonText.includes('комментарий') ||
                    buttonText.includes('комментария') ||
                    buttonText.includes('комментариев')
                ) {
                    btn.click();
                    clickedAny = true;
                    console.log('Clicked expand button:', buttonText);
                }
            });

            // If no buttons were clicked, stop the interval
            if (!clickedAny) {
                clearInterval(interval);
                console.log('All subcomments expanded or no more expandable comments found.');
            }
        }, 1500); // Interval to allow DOM updates
    }

    // Start the process
    findMainButton();
})();
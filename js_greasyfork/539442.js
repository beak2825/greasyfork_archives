// ==UserScript==
// @name        NPO J.A.R.V.I.S.
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/*
// @grant       none
// @version     0.5
// @author      Terekhov
// @description Monitor and override faction button clicks with Flutter support
// @downloadURL https://update.greasyfork.org/scripts/539442/NPO%20JARVIS.user.js
// @updateURL https://update.greasyfork.org/scripts/539442/NPO%20JARVIS.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const LOG_PREFIX = `NPO Jarvis :: `;
    const MAX_INITIALIZATION_ATTEMPTS = 30;
    let initializationAttempts = 0;

    // Configuration - change this URL to your desired destination
    const VALOUR_COORDINATION_CHAN = 'discord.com/channels/173620978507710464/1189148447396352020';

    function performRedirect(url) {
        // Check if we're in a Flutter WebView
        if (window.flutter_inappwebview) {
            console.log(LOG_PREFIX + 'Flutter WebView detected, using launchIntent handler');

            window.flutter_inappwebview
                .callHandler("launchIntent", `https://${url}`)
                .then((response) => {
                    if (response.success) {
                        console.log(LOG_PREFIX + 'Successfully requested to launch Discord.');
                    } else {
                        console.error(LOG_PREFIX + 'Failed to launch Discord:', response.error);
                    }
                })
                .catch((error) => {
                    console.error(LOG_PREFIX + 'An error occurred when calling the launchIntent handler:', error);
                });
        } else {
            // Regular browser - use window.open
            console.log(LOG_PREFIX + 'Regular browser detected, using window.open');
            window.open(`discord://${url}`, '_blank');
        }
    }

    function cleanupButton(button) {
        // Remove any class that starts with "message___"
        const classList = Array.from(button.classList);
        classList.forEach(className => {
            if (className.startsWith('message___')) {
                button.classList.remove(className);
                console.log(LOG_PREFIX + `Removed class ${className} from faction button`);
            }
        });

        // Hide the div which has the "number of messages" bubble
        const messageCountDivs = button.querySelectorAll('div[class*="messageCount___"]');
        messageCountDivs.forEach(div => {
            // Double-check the class name starts with messageCount___
            const hasMessageCountClass = Array.from(div.classList).some(className => 
                className.startsWith('messageCount___')
            );
            if (hasMessageCountClass) {
                div.style.display = 'none';
                console.log(LOG_PREFIX + 'Removed messageCount div from faction button');
            }
        });
    }

    function addClickHandler(button) {
        // Clean up the button first
        cleanupButton(button);

        // Remove any existing click listeners first
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        // Add our click handler
        newButton.addEventListener('click', function(event) {
            // Prevent the default button behavior
            event.preventDefault();
            event.stopPropagation();

            // Perform the redirect using the appropriate method
            performRedirect(VALOUR_COORDINATION_CHAN);
        }, true); // Use capture phase to ensure we intercept before other handlers

        // Mark as handled
        newButton.setAttribute('data-redirect-handler-added', 'true');

        console.log(LOG_PREFIX + 'Click handler added to faction button');
    }

    function checkForFactionButton() {
        // Find all buttons whose id starts with "channel_panel_button:faction-"
        const buttons = document.querySelectorAll('button[id^="channel_panel_button:faction-"]');

        buttons.forEach(button => {
            // Always clean up the button
            cleanupButton(button);
            
            // Check if we've already added our handler
            if (!button.hasAttribute('data-redirect-handler-added')) {
                addClickHandler(button);
            }
        });
    }

    // Wait for chatRoot to exist
    function initializeObserver() {
        const chatRoot = document.getElementById('chatRoot');

        if (initializationAttempts > MAX_INITIALIZATION_ATTEMPTS) {
            console.error(LOG_PREFIX + 'initializationAttempts > 30, script shutting down.')
            return;
        }

        if (!chatRoot) {
            // If chatRoot doesn't exist yet, wait and try again
            initializationAttempts++;
            setTimeout(initializeObserver, 100);
            return;
        } else {
            // If we found chatRoot, reset to 0, we're good to go.
            initializationAttempts = 0;
        }

        console.log(LOG_PREFIX + 'Found chatRoot, setting up observer');

        // Initial check
        checkForFactionButton();

        // Set up MutationObserver on chatRoot
        const observer = new MutationObserver(function(mutations) {
            console.log(LOG_PREFIX + 'mutation detected.');
            // Any change under chatRoot triggers a check
            checkForFactionButton();
        });

        // Observe everything under chatRoot
        observer.observe(chatRoot, {
            childList: true,
            subtree: true
        });

        console.log(LOG_PREFIX + 'Observer initialized on chatRoot');
    }

    // Start the script
    initializeObserver();

    // Log environment on load
    console.log(LOG_PREFIX + 'loaded. Environment:',
        window.flutter_inappwebview ? 'Flutter WebView' : 'Regular Browser');
})();
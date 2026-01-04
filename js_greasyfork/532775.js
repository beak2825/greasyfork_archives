// ==UserScript==
// @name         Qrev - w/ revive percent notification
// @namespace    namespace
// @version      3.6
// @description  Adds a fast revive button and shows revive percentage automatically
// @author       Sa1nt [2929191]
// @match        *://*.torn.com/profiles.php*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532775/Qrev%20-%20w%20revive%20percent%20notification.user.js
// @updateURL https://update.greasyfork.org/scripts/532775/Qrev%20-%20w%20revive%20percent%20notification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration - ULTRA FAST TIMINGS
    const OBSERVER_TIMEOUT = 5000; // 5 seconds maximum waiting time
    const CHECK_INTERVAL = 10; // Check every 10ms while waiting (ultra fast)
    const NOTIFICATION_DURATION = 3000; // 3 seconds for notification display
    const DIALOG_CHECK_DELAY = 10; // Ultra fast delay for dialog appearance check
    const DIALOG_CHECK_TIMEOUT = 1000; // Shorter timeout

    // Store the last known revive percentage
    let lastRevivePercentage = null;
    let dialogClosing = false; // Flag to track if we're closing a dialog
    let fastReviveButtonAdded = false; // Track if the button is already added
    let isAutoClicking = false; // Track if we're auto-clicking the button
    let notificationShown = false; // Track if we've shown notification
    let percentageFound = false; // Track if we've found a percentage

    // Pre-create notification elements for instant display
    let preloadedNotification = null;

    // Pre-create the notification element right away
    function preloadNotification() {
        // Create just once
        if (preloadedNotification) return;

        // Create notification element with modern design
        preloadedNotification = document.createElement('div');
        preloadedNotification.id = 'fast-revive-notification';

        // Create the modern styled notification with clean header
        preloadedNotification.innerHTML = `
            <div style="height: 30px; background-color: #444; border-radius: 8px 8px 0 0; display: flex; align-items: center; justify-content: center; padding: 0 15px;">
                <div style="color: #fff; font-size: 14px; letter-spacing: 0.5px; font-weight: 500; text-transform: uppercase;">Revive Status</div>
            </div>
            <div id="fast-revive-message" style="padding: 15px; background-color: white; border-radius: 0 0 8px 8px;"></div>
        `;

        // Apply modern window styles to the container
        preloadedNotification.style.cssText = 'position:fixed; top:70px; left:50%; transform:translateX(-50%); ' +
            'width:230px; border-radius:8px; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", sans-serif; ' +
            'z-index:2147483647; box-shadow:0 10px 25px rgba(0,0,0,0.15); ' +
            'overflow:hidden; opacity:0; transition:opacity 0.2s, transform 0.2s; display:none; transform-origin: top center;';

        // Append to document.documentElement (html) early for instant access
        if (document.documentElement) {
            document.documentElement.appendChild(preloadedNotification);
        }

        // Also try body as soon as it's available
        if (document.body) {
            document.body.appendChild(preloadedNotification);
        } else {
            // Set up a mutation observer to check for body
            const bodyObserver = new MutationObserver(() => {
                if (document.body && !document.body.contains(preloadedNotification)) {
                    document.body.appendChild(preloadedNotification);
                    bodyObserver.disconnect();
                }
            });

            // Observe document for body
            bodyObserver.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        }

        console.log('[Fast Revive] Preloaded notification element');
    }

    // ULTRA FAST notification method - reuses preloaded element
    function showNotification(message, isImportant = false) {
        console.log('[Fast Revive] Showing notification:', message);

        // Ensure notification element exists
        if (!preloadedNotification) {
            preloadNotification();
        }

        // If element still doesn't exist or is not in DOM, create inline
        if (!preloadedNotification || !preloadedNotification.parentNode) {
            // Force create a new element with simplified design
            const tempNotification = document.createElement('div');
            tempNotification.style.cssText = 'position:fixed; top:70px; left:50%; transform:translateX(-50%); ' +
                'width:230px; border-radius:8px; ' +
                'font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", sans-serif; ' +
                'font-size:14px; z-index:2147483647; box-shadow:0 10px 25px rgba(0,0,0,0.15); text-align:center;';

            // Create minimal modern header
            const header = document.createElement('div');
            header.style.cssText = 'background-color:#444; color:#fff; padding:8px 15px; border-radius:8px 8px 0 0; text-align:center; letter-spacing:0.5px; font-weight:500; text-transform:uppercase; font-size:14px;';
            header.textContent = 'Revive Status';

            const content = document.createElement('div');
            content.style.cssText = 'background-color:white; padding:15px; border-radius:0 0 8px 8px;';
            content.textContent = message;

            tempNotification.appendChild(header);
            tempNotification.appendChild(content);

            // Directly inject into document for speed
            if (document.body) {
                document.body.appendChild(tempNotification);
            } else if (document.documentElement) {
                document.documentElement.appendChild(tempNotification);
            }

            // Remove after duration
            setTimeout(() => {
                if (tempNotification.parentNode) {
                    tempNotification.parentNode.removeChild(tempNotification);
                }
            }, NOTIFICATION_DURATION);

            // Also try to restore preloaded notification
            preloadNotification();

            notificationShown = true;
            if (message.includes('%')) percentageFound = true;
            return;
        }

        // Use the preloaded notification - ULTRA FAST
        const messageElement = preloadedNotification.querySelector('#fast-revive-message');
        if (messageElement) {
            messageElement.textContent = message;

            // Style for message content
            messageElement.style.fontWeight = '400';
            messageElement.style.fontSize = '15px';
            messageElement.style.textAlign = 'center';

            // Highlight important messages
            if (isImportant) {
                messageElement.style.fontWeight = '600';
                messageElement.style.color = '#FF5722';
            } else {
                messageElement.style.fontWeight = '400';
                messageElement.style.color = '#333';
            }
        } else {
            // Fallback if inner element not found
            preloadedNotification.textContent = message;
        }

        // Show with slight animation
        preloadedNotification.style.display = 'block';
        setTimeout(() => {
            preloadedNotification.style.opacity = '1';
            preloadedNotification.style.transform = 'translateX(-50%) scale(1)';
        }, 10);

        // Mark as shown
        notificationShown = true;
        if (message.includes('%')) percentageFound = true;

        // Hide after duration
        setTimeout(() => {
            if (preloadedNotification) {
                preloadedNotification.style.opacity = '0';
                preloadedNotification.style.transform = 'translateX(-50%) scale(0.95)';
                setTimeout(() => {
                    preloadedNotification.style.display = 'none';
                }, 200);
            }
        }, NOTIFICATION_DURATION);
    }

    // Function to safely find a revive button using various selectors
    function findReviveButton() {
        // Try different possible selectors (from most to least specific)
        const selectors = [
            'a.profile-button.profile-button-revive',
            'a[href*="revive"]',
            'a[id*="revive"]',
            'a[class*="revive"]'
        ];

        // Try each selector
        for (const selector of selectors) {
            const btn = document.querySelector(selector);
            if (btn) return btn;
        }

        return null;
    }

    // Function to extract revive percentage from page
    function extractRevivePercentage() {
        // Check if we're on a profile page with a player who needs reviving
        const reviveBtn = findReviveButton();
        if (!reviveBtn) return null;

        // If we have a stored percentage from a previous confirmation dialog, use that
        const percentage = lastRevivePercentage;

        return percentage;
    }

    // Function to close the confirmation dialog
    function closeConfirmationDialog() {
        // If already trying to close, don't execute twice
        if (dialogClosing) return false;

        // Set the flag to prevent duplicate attempts
        dialogClosing = true;

        // Look for the close/cancel button in the dialog
        const closeSelectors = [
            '.close-act', // Common close button
            'a.close', // Standard close button
            '.close-icon', // Close icon
            '.cancel', // Cancel button
            'button[type="cancel"]',
            'button.cancel',
            'a[class*="cancel"]',
            'button[class*="cancel"]'
        ];

        // Try each selector
        for (const selector of closeSelectors) {
            const closeBtn = document.querySelector(selector);
            if (closeBtn) {
                console.log('[Fast Revive] Found close button, clicking it');
                closeBtn.click();

                // Reset the flag after a short delay
                setTimeout(() => {
                    dialogClosing = false;
                }, 100); // Ultra-reduced

                return true;
            }
        }

        // As a fallback, try to click a non-confirm button
        const allButtons = document.querySelectorAll('button, a.btn, a.button, .action-btn');
        for (const btn of allButtons) {
            if (
                btn.textContent.toLowerCase().includes('cancel') ||
                btn.textContent.toLowerCase().includes('close') ||
                btn.textContent.toLowerCase().includes('no') ||
                btn.classList.contains('close') ||
                btn.classList.contains('cancel')
            ) {
                console.log('[Fast Revive] Found cancel button by text, clicking it');
                btn.click();

                // Reset the flag after a short delay
                setTimeout(() => {
                    dialogClosing = false;
                }, 100); // Ultra-reduced

                return true;
            }
        }

        // Reset the flag if we couldn't find a button
        dialogClosing = false;
        return false;
    }

    // Function to auto-format a revive percentage message
    function formatReviveMessage(percentage) {
        if (!percentage) return "Revive Status Unknown";

        // Make percentage message look nice
        return `Revive Chance: ${percentage}%`;
    }

    // Set up observer to detect when confirmation dialog appears
    function setupConfirmationObserver() {
        // Create a mutation observer to watch for dialog appearance
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                // Check added nodes for confirmation dialog
                if (mutation.addedNodes && mutation.addedNodes.length) {
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const node = mutation.addedNodes[i];

                        // Check if this is a dialog with revive percentage
                        if (node.nodeType === 1 && (
                            node.classList && (
                                node.classList.contains('action-confirmation') ||
                                node.classList.contains('confirmation-box')
                            ) ||
                            node.textContent.includes('chance of success')
                        )) {
                            console.log('[Fast Revive] Detected confirmation dialog');

                            // Try to find percentage in the dialog
                            const percentageMatch = node.textContent.match(/([0-9.]+)%\s*chance of success/i);
                            if (percentageMatch && percentageMatch[1]) {
                                const percentage = percentageMatch[1];
                                lastRevivePercentage = percentage;
                                console.log('[Fast Revive] Found percentage in dialog:', percentage);

                                // ULTRA FAST NOTIFICATION - directly show
                                showNotification(formatReviveMessage(percentage), true);

                                // Only auto-close during our auto-click process
                                if (isAutoClicking) {
                                    // Now close the dialog immediately
                                    closeConfirmationDialog();

                                    // Re-add the button if it disappeared
                                    if (!document.getElementById('fast-revive-btn')) {
                                        addFastReviveButton(true); // Force re-add
                                    }
                                }
                            }
                        }
                    }
                }

                // Check removed nodes to see if our button was removed
                if (mutation.removedNodes && mutation.removedNodes.length) {
                    for (let i = 0; i < mutation.removedNodes.length; i++) {
                        const node = mutation.removedNodes[i];
                        if (node.nodeType === 1) {
                            // If the node itself is our button or contains our button
                            if (node.id === 'fast-revive-btn' ||
                                (node.querySelector && node.querySelector('#fast-revive-btn'))) {
                                addFastReviveButton(true); // Force re-add immediately
                            }
                        }
                    }
                }
            });
        });

        // Start observing the body for dialog changes
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        console.log('[Fast Revive] Dialog observer started');
    }

    // Auto-click the original revive button to get the percentage
    function autoClickReviveButton() {
        const reviveBtn = findReviveButton();
        if (!reviveBtn) {
            return;
        }

        console.log('[Fast Revive] Auto-clicking revive button to get percentage');

        // If we already have a percentage, show it immediately
        if (lastRevivePercentage) {
            showNotification(formatReviveMessage(lastRevivePercentage), true);
            return;
        }

        // Set a flag to prevent the fast-revive button from being triggered
        // and track that we're auto-clicking
        window.skipReviveConfirmation = false; // Don't skip - we want to see the dialog
        isAutoClicking = true; // Track that we're auto-clicking

        // Click the button immediately
        reviveBtn.click();

        // Wait for the dialog to appear and be processed by our observer
        let dialogCheckTime = 0;
        const dialogCheckInterval = setInterval(() => {
            dialogCheckTime += DIALOG_CHECK_DELAY;

            // If we got the percentage or timed out, stop checking
            if (lastRevivePercentage || dialogCheckTime >= DIALOG_CHECK_TIMEOUT) {
                clearInterval(dialogCheckInterval);

                // Reset auto-clicking flag
                isAutoClicking = false;

                // If we timed out without finding percentage, don't assume a value
                if (!lastRevivePercentage && dialogCheckTime >= DIALOG_CHECK_TIMEOUT) {
                    // Don't show a notification with a guess, but ensure the dialog is closed
                    closeConfirmationDialog();
                }

                // Check if button still exists and re-add if needed
                if (!document.getElementById('fast-revive-btn')) {
                    addFastReviveButton(true); // Force re-add
                }
            }
        }, DIALOG_CHECK_DELAY);
    }

    // Function to create the fast revive button
    function createFastReviveButton(originalBtn) {
        if (!originalBtn) return null;

        // Create a button in the same style as Torn's buttons
        const fastBtn = document.createElement('a');
        fastBtn.id = 'fast-revive-btn';

        // Use a doctor/medical icon with improved centering
        fastBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);">
                <path fill="#888" d="M12 2C9.36 2 6.94 3.04 5.18 4.74L4.08 6.44C6.33 4.4 9.28 3 12.5 3C15.97 3 19.11 4.6 21.38 6.95L20.15 8.95C18.31 6.92 15.54 5.5 12.5 5.5C9.8 5.5 7.32 6.65 5.56 8.41M21.9 11.75C21.96 12.16 22 12.58 22 13C22 17.97 17.97 22 13 22C8.03 22 4 17.97 4 13C4 12.58 4.04 12.16 4.1 11.75M13 17.85C13.61 17.85 14.11 17.35 14.11 16.74C14.11 16.13 13.61 15.63 13 15.63C12.39 15.63 11.89 16.13 11.89 16.74C11.89 17.35 12.39 17.85 13 17.85M17.24 18.71C17.24 18.71 17.71 17.96 17.71 17.21C17.71 15.25 16.16 13.72 14.24 13.72C14.03 13.72 13.82 13.74 13.62 13.78C13.44 13.43 13.12 13.17 12.74 13.08C13.03 13.05 13.32 13.03 13.62 13.03C15.74 13.03 17.5 14.79 17.5 16.91C17.5 17.59 17.2 18.22 16.72 18.71H17.24M7.86 18.71C7.48 18.15 7.24 17.5 7.24 16.79C7.24 14.5 9.08 12.66 11.38 12.66C11.62 12.66 11.87 12.69 12.11 12.74C12.66 13.17 13.04 13.79 13.11 14.5C12.42 14.3 11.67 14.2 10.9 14.2C9.21 14.2 7.74 15.13 6.97 16.5H8.31C9.04 15.7 10.28 15.63 11.03 16.34C11.2 16.5 11.34 16.71 11.45 16.93C11.16 17.04 10.94 17.26 10.85 17.53C10.69 17.25 10.37 17.06 10.03 17.06C9.68 17.06 9.39 17.26 9.25 17.53H7.86V18.71Z"/>
            </svg>
        `;

        // Set base styles with gradient background
        const style = {
            display: 'inline-block',
            background: 'linear-gradient(to bottom, #444 0%, #333 100%)',
            border: '1px solid #555',
            borderRadius: '3px',
            color: '#fff',
            textAlign: 'center',
            margin: '2px',
            cursor: 'pointer',
            verticalAlign: 'middle',
            textDecoration: 'none',
            transition: 'background 0.2s ease',
            position: 'relative' // Required for absolute positioning of SVG
        };

        // Apply all styles
        Object.assign(fastBtn.style, style);

        // Add hover effect with enhanced gradient
        fastBtn.addEventListener('mouseover', function() {
            this.style.background = 'linear-gradient(to bottom, #555 0%, #444 100%)';
        });
        fastBtn.addEventListener('mouseout', function() {
            this.style.background = 'linear-gradient(to bottom, #444 0%, #333 100%)';
        });

        fastBtn.title = "Fast Revive (No Confirmation)";
        fastBtn.setAttribute('role', 'button');

        // Add a click handler
        fastBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Don't process if we're auto-clicking
            if (isAutoClicking) return;

            // If we know the percentage, show it before skipping
            if (lastRevivePercentage) {
                showNotification(formatReviveMessage(lastRevivePercentage), true);
            }

            // Click the original button but skip confirmation
            window.skipReviveConfirmation = true;
            originalBtn.click();

            // Make sure button doesn't disappear
            if (!document.getElementById('fast-revive-btn')) {
                addFastReviveButton(true); // Force re-add
            }
        });

        return fastBtn;
    }

    // Function to intercept XMLHttpRequest for skipping confirmation
    function interceptXmlHttpRequest() {
        const originalOpen = XMLHttpRequest.prototype.open;

        // Monitor XHR open calls to identify revive requests
        XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
            // Check if this is a revive request and we should skip confirmation
            if (window.skipReviveConfirmation && url && url.includes('action=revive')) {
                // Modify the URL to skip confirmation
                url = url.includes('?')
                    ? url + '&step=revive'
                    : url + '?step=revive';

                // Reset the flag after use
                window.skipReviveConfirmation = false;

                console.log('[Fast Revive] Intercepted confirmation, modified URL:', url);
            }

            // Call the original method
            return originalOpen.call(this, method, url, async, user, pass);
        };

        console.log('[Fast Revive] XHR interception enabled');
    }

    // Function to add the fast revive button safely
    function addFastReviveButton(force = false) {
        // Check if button already exists and we're not forcing a re-add
        if (!force && document.getElementById('fast-revive-btn')) return false;

        // Find the revive button
        const reviveBtn = findReviveButton();
        if (!reviveBtn) return false;

        // Create the fast revive button
        const fastBtn = createFastReviveButton(reviveBtn);
        if (!fastBtn) return false;

        // Find the specific grid container - be more precise
        const possibleContainers = [
            // Try to find where other buttons are located
            '.buttons-wrap .buttons',
            '.buttons-list',
            '.profile-buttons',
            // Last row of buttons
            '.buttons-wrap .buttons:last-child'
        ];

        let buttonContainer = null;

        // Try to find a suitable container
        for (const selector of possibleContainers) {
            const container = document.querySelector(selector);
            if (container && container.children.length > 0) {
                buttonContainer = container;
                break;
            }
        }

        // If we found a container with existing buttons
        if (buttonContainer) {
            // Get a reference button to copy styling from
            const refButton = buttonContainer.querySelector('a');

            if (refButton) {
                // Copy exact dimensions from existing button
                const computedStyle = window.getComputedStyle(refButton);
                fastBtn.style.width = computedStyle.width;
                fastBtn.style.height = computedStyle.height;
                fastBtn.style.lineHeight = computedStyle.lineHeight;
                fastBtn.style.margin = computedStyle.margin;

                // Ensure same display type
                fastBtn.style.display = computedStyle.display;

                // Match exact positioning
                if (computedStyle.float !== 'none') {
                    fastBtn.style.float = computedStyle.float;
                }
            }

            // Add the button directly in the container
            buttonContainer.appendChild(fastBtn);
            console.log('[Fast Revive] Button added successfully to grid');

            // If this is the first time adding the button, mark as added and start percentage check immediately
            if (!fastReviveButtonAdded) {
                fastReviveButtonAdded = true;
                autoClickReviveButton(); // Check percentage immediately
            }

            return true;
        } else if (reviveBtn.parentNode) {
            // Fallback: directly next to the revive button
            reviveBtn.parentNode.insertBefore(fastBtn, reviveBtn.nextSibling);
            console.log('[Fast Revive] Button added next to revive button');

            // If this is the first time adding the button, mark as added and start percentage check immediately
            if (!fastReviveButtonAdded) {
                fastReviveButtonAdded = true;
                autoClickReviveButton(); // Check percentage immediately
            }

            return true;
        }

        return false;
    }

    // Periodically check if button still exists and restore if needed
    function startButtonCheckInterval() {
        // Check every 1 second if the button exists
        setInterval(() => {
            if (fastReviveButtonAdded && !document.getElementById('fast-revive-btn')) {
                addFastReviveButton(true);
            }
        }, 1000);

        // If we detected a percentage but notification not shown, force show it again
        setInterval(() => {
            if (lastRevivePercentage && !percentageFound) {
                showNotification(formatReviveMessage(lastRevivePercentage), true);
                percentageFound = true;
            }
        }, 1000); // Check more frequently
    }

    // Start observing the DOM as early as possible
    function initScript() {
        // Preload notification element for instant display
        preloadNotification();

        // Skip initial notification - start checking immediately
        let timeWaited = 0;
        const interval = setInterval(() => {
            if (!document.body) return; // Wait for body

            if (addFastReviveButton() || timeWaited >= OBSERVER_TIMEOUT) {
                clearInterval(interval);

                // Setup monitoring for dialogs once the button is added
                setupConfirmationObserver();

                // Start the periodic button check
                startButtonCheckInterval();
            }
            timeWaited += CHECK_INTERVAL;
        }, CHECK_INTERVAL);
    }

    // Initialize everything at script start
    function init() {
        // Set up XHR intercept immediately
        interceptXmlHttpRequest();

        // Preload notification element
        preloadNotification();

        // Try to run init right away if possible
        if (document.body) {
            initScript();
        } else {
            // Start checking for DOM readiness immediately
            document.addEventListener('DOMContentLoaded', initScript);

            // Also try multiple initialization times for best chance of early start
            setTimeout(initScript, 1);
            setTimeout(initScript, 10);
            setTimeout(initScript, 50);
        }
    }

    // Start immediately
    init();
})();
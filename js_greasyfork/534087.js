// ==UserScript==
// @name         Qrev - w/ revive percent notification
// @namespace    namespace
// @version      4.8
// @description  Adds a fast revive button and shows revive percentage automatically.
// @author       Sa1nt [2929191] fixed for PDA GNSC4 [268863]
// @match        https://www.torn.com/profiles.php?*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/534087/Qrev%20-%20w%20revive%20percent%20notification.user.js
// @updateURL https://update.greasyfork.org/scripts/534087/Qrev%20-%20w%20revive%20percent%20notification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Verbose Logging ---
    const DEBUG = false; // Set to true to enable verbose logging
    function logDebug(message, ...args) {
        if (DEBUG) {
            console.log(`[Fast Revive DEBUG] ${message}`, ...args);
        }
    }
    // --- End Verbose Logging ---

    logDebug('Script starting execution.');

    // Configuration
    const OBSERVER_TIMEOUT = 5000;
    const CHECK_INTERVAL = 10;
    const NOTIFICATION_DURATION = 4000;
    const DIALOG_CHECK_DELAY = 10;
    const DIALOG_CHECK_TIMEOUT = 1500; // Timeout for waiting for dialog/percentage
    const DIALOG_CLOSE_RESET_DELAY = 50;
    const DIALOG_AUTO_CLOSE_RESTORE_DELAY = 100;
    const FAST_CLICK_RESTORE_DELAY = 50;
    const INITIAL_AUTO_CLICK_DELAY = 100;

    // Script State
    let lastRevivePercentage = null;
    let dialogClosing = false;
    let fastReviveButtonAdded = false;
    let isAutoClicking = false; // Flag specifically for the auto-percentage-check process
    let notificationShown = false;
    let percentageFoundAndProcessed = false;
    let scriptInitialized = false;
    let autoClickIntervalId = null; // Store the interval ID for the auto-click process

    // Interval IDs & Observer
    let buttonCheckIntervalId = null;
    let notificationCheckIntervalId = null;
    let mainObserver = null;

    // Preloaded Elements
    let preloadedNotification = null;

    // --- Helper Functions ---
    function isMobile() { /* ... same as v4.4 ... */
        const mobileCheck = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        logDebug(`isMobile check: ${mobileCheck}`);
        return mobileCheck;
    }

    // --- Core Functions ---

    function preloadNotification() { /* ... same as v4.4 ... */
        logDebug('preloadNotification called.');
        if (preloadedNotification) return;
        preloadedNotification = document.createElement('div');
        preloadedNotification.id = 'fast-revive-notification';
        preloadedNotification.innerHTML = `
            <div style="height: 30px; background-color: #444; border-radius: 8px 8px 0 0; display: flex; align-items: center; justify-content: center; padding: 0 15px;">
                <div style="color: #fff; font-size: 14px; letter-spacing: 0.5px; font-weight: 500; text-transform: uppercase;">Revive Status</div>
            </div>
            <div id="fast-revive-message" style="padding: 15px; background-color: white; border-radius: 0 0 8px 8px;"></div>
        `;
        preloadedNotification.style.cssText = 'position:fixed; top:70px; left:50%; transform:translateX(-50%); ' +
            'width:230px; border-radius:8px; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", sans-serif; ' +
            'z-index:2147483647; box-shadow:0 10px 25px rgba(0,0,0,0.15); ' +
            'overflow:hidden; opacity:0; transition:opacity 0.2s, transform 0.2s; display:none; transform-origin: top center;';
        const appendNotification = () => {
            const target = document.body || document.documentElement;
            if (target && !target.contains(preloadedNotification)) { target.appendChild(preloadedNotification); return !!document.body; }
            return document.body && target.contains(preloadedNotification);
        };
        if (!appendNotification()) {
             const bodyObserver = new MutationObserver(() => { if (appendNotification()) bodyObserver.disconnect(); });
             bodyObserver.observe(document.documentElement, { childList: true, subtree: true });
        }
        logDebug('Preloaded notification element setup complete.');
    }

    function showNotification(message, isImportant = false) { /* ... same as v4.4 ... */
         logDebug(`showNotification: "${message}", Important: ${isImportant}`);
        if (!preloadedNotification || !preloadedNotification.parentNode) {
            preloadNotification();
            logDebug('Using temporary/fallback notification.');
            const tempNotification = document.createElement('div');
            tempNotification.style.cssText = 'position:fixed; top:70px; left:50%; transform:translateX(-50%); width:230px; padding: 10px; background: #333; color: white; border-radius: 5px; z-index: 2147483647; text-align: center;';
            tempNotification.textContent = message;
            let target = document.body || document.documentElement;
            if(target) {
                target.appendChild(tempNotification);
                setTimeout(() => { if (tempNotification.parentNode) tempNotification.parentNode.removeChild(tempNotification); }, NOTIFICATION_DURATION);
            }
            return;
        }
        logDebug('Using preloaded notification element.');
        const messageElement = preloadedNotification.querySelector('#fast-revive-message');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.style.fontWeight = isImportant ? '600' : '400';
            messageElement.style.color = isImportant ? '#FF5722' : '#333';
        } else { preloadedNotification.textContent = message; }
        preloadedNotification.style.display = 'block';
        setTimeout(() => { preloadedNotification.style.opacity = '1'; preloadedNotification.style.transform = 'translateX(-50%) scale(1)'; }, 10);
        notificationShown = true;
        setTimeout(() => {
            if (preloadedNotification) {
                preloadedNotification.style.opacity = '0';
                preloadedNotification.style.transform = 'translateX(-50%) scale(0.95)';
                setTimeout(() => { if (preloadedNotification) { preloadedNotification.style.display = 'none'; notificationShown = false; } }, 200);
            }
        }, NOTIFICATION_DURATION);
    }

    function findReviveButton() { /* ... same as v4.4 ... */
        const selectors = [ 'a.profile-button.profile-button-revive', 'a[href*="revive.php?action=revive"]', 'a[href*="revive"]', 'a[id*="revive"]', 'a[class*="revive"]' ];
        for (const selector of selectors) { const btn = document.querySelector(selector); if (btn) return btn; }
        return null;
    }

    function closeConfirmationDialog() {
        logDebug('Attempting to close confirmation dialog.');
        if (dialogClosing) {
            logDebug('Already attempting to close dialog.');
            return false;
        }
        // ** Removed :visible selector **
        const dialog = document.querySelector('.ui-dialog, .confirmation-box, .action-confirmation, .profile-buttons-dialog');
        if (!dialog) {
            logDebug('No confirmation dialog found to close.');
            return false;
        }
        logDebug('Found dialog:', dialog);

        dialogClosing = true;
        const closeSelectors = [
            '.dialog-buttons a.close', '.dialog-buttons button.cancel', '.dialog-buttons a[class*="cancel"]',
            '.dialog-buttons button[class*="cancel"]', '.confirm-action-no', '.close-act', 'a.close', '.close-icon', '.cancel'
        ];
        let closed = false;
        for (const selector of closeSelectors) {
            const targetElement = dialog.querySelector(selector);
            if (targetElement) {
                logDebug(`Found close/cancel button via selector "${selector}", clicking:`, targetElement);
                targetElement.click();
                closed = true;
                break;
            }
        }
        if (!closed) {
            logDebug('Specific close selectors failed. Trying fallback text search.');
            const allButtons = dialog.querySelectorAll('button, a.btn, a.button, .action-btn');
            for (const btn of allButtons) {
                const btnText = btn.textContent.toLowerCase().trim();
                if (btnText === 'cancel' || btnText === 'close' || btnText === 'no' || btn.classList.contains('close') || btn.classList.contains('cancel')) {
                    logDebug('Found potential fallback close/cancel button, clicking:', btn);
                    btn.click();
                    closed = true;
                    break;
                }
            }
        }
        if (!closed) { logDebug('Could not find any close/cancel button.'); }
        setTimeout(() => { logDebug('Resetting dialogClosing flag.'); dialogClosing = false; }, DIALOG_CLOSE_RESET_DELAY);
        return closed;
    }


    function formatReviveMessage(percentage) { /* ... same as v4.4 ... */
        if (!percentage) return "Revive Status Unknown";
        return `Revive Chance: ${percentage}%`;
    }

    function cleanup() { /* ... same as v4.7 ... */
        logDebug('Cleanup called.');
        if (buttonCheckIntervalId) clearInterval(buttonCheckIntervalId);
        if (notificationCheckIntervalId) clearInterval(notificationCheckIntervalId);
        if (mainObserver) mainObserver.disconnect();
        if (autoClickIntervalId) { clearInterval(autoClickIntervalId); autoClickIntervalId = null; }
        buttonCheckIntervalId = null; notificationCheckIntervalId = null; mainObserver = null;
        isAutoClicking = false;
        percentageFoundAndProcessed = false;
        logDebug('Cleanup finished.');
    }

    function setupConfirmationObserver() {
        logDebug('setupConfirmationObserver called.');
        if (mainObserver) mainObserver.disconnect();

        mainObserver = new MutationObserver(mutations => {
            if (percentageFoundAndProcessed) { cleanup(); return; }

            let dialogFound = false;
            let percentageInDialog = null;

            for (const mutation of mutations) {
                if (mutation.addedNodes && mutation.addedNodes.length) {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType !== 1) continue;
                        const isDialog = node.classList && (node.classList.contains('action-confirmation') || node.classList.contains('confirmation-box') || node.classList.contains('ui-dialog') || node.classList.contains('profile-buttons-dialog'));
                        const hasChanceText = node.textContent && node.textContent.includes('chance of success');
                        if (isDialog || hasChanceText) {
                            logDebug('Detected potential confirmation dialog node:', node);
                            dialogFound = true;
                            const percentageMatch = node.textContent.match(/([0-9]+(?:\.[0-9]+)?)\s*%\s*chance of success/i);
                            if (percentageMatch && percentageMatch[1]) {
                                percentageInDialog = percentageMatch[1];
                                logDebug(`Found percentage in dialog: ${percentageInDialog}%`);
                            } else { logDebug('Dialog detected, but percentage text not found.'); }
                            break; // Exit node loop
                        }
                    }
                }
                if (dialogFound) break; // Exit mutation loop
            }

            // --- Process Dialog/Percentage ---
            if (dialogFound && percentageInDialog) {
                logDebug('Processing found percentage.');
                lastRevivePercentage = percentageInDialog;
                showNotification(formatReviveMessage(lastRevivePercentage), true);
                percentageFoundAndProcessed = true; // Mark as processed

                // ** Simplified Logic: If dialog came from auto-click, close it. **
                if (isAutoClicking) {
                    logDebug('Dialog resulted from auto-click. Attempting to close.');
                    closeConfirmationDialog(); // Attempt to close
                    // Reset flag *after* finding percentage and attempting close
                    logDebug('Resetting isAutoClicking flag after handling auto-click dialog.');
                    isAutoClicking = false;
                    // Restore button if needed after a delay
                    setTimeout(() => {
                        if (fastReviveButtonAdded && !document.getElementById('fast-revive-btn') && findReviveButton()) {
                            logDebug('Restoring button after auto-close attempt.');
                            addFastReviveButton(true);
                        }
                    }, DIALOG_AUTO_CLOSE_RESTORE_DELAY);
                } else {
                    logDebug('Dialog appeared, but not from auto-click process. Leaving open.');
                     // Still check if button needs restore
                     if (fastReviveButtonAdded && !document.getElementById('fast-revive-btn') && findReviveButton()) {
                         logDebug('Restoring button after manual dialog appearance.');
                         addFastReviveButton(true);
                     }
                }
                // Stop observing and intervals now that percentage is handled
                cleanup();
            }
            // ** Removed: Logic for handling non-percentage dialogs during auto-click **
        });

        // Start observing body
        if (document.body) { mainObserver.observe(document.body, { childList: true, subtree: true }); }
        else { document.addEventListener('DOMContentLoaded', () => { if (document.body && !mainObserver) setupConfirmationObserver(); }, { once: true }); }
    }


    function autoClickReviveButton() {
        logDebug('autoClickReviveButton called.');
        if (autoClickIntervalId) { clearInterval(autoClickIntervalId); autoClickIntervalId = null; }

        const reviveBtn = findReviveButton();
        if (!reviveBtn) { logDebug('Original button not found for auto-click.'); return; }
        if (lastRevivePercentage) {
            showNotification(formatReviveMessage(lastRevivePercentage), true);
            percentageFoundAndProcessed = true; cleanup();
             if (fastReviveButtonAdded && !document.getElementById('fast-revive-btn') && findReviveButton()) addFastReviveButton(true);
            return;
        }

        logDebug('Proceeding with auto-click to get percentage.');
        window.skipReviveConfirmation = false;
        isAutoClicking = true; // Set flag *before* clicking

        reviveBtn.click();
        logDebug('Clicked original button for percentage check.');

        let dialogCheckTime = 0;
        logDebug(`Starting dialog check loop (Timeout: ${DIALOG_CHECK_TIMEOUT}ms).`);

        autoClickIntervalId = setInterval(() => {
            // Priority check for fast click interruption
            if (window.skipReviveConfirmation === true) {
                logDebug('Fast click detected during auto-check! Aborting auto-check.');
                clearInterval(autoClickIntervalId); autoClickIntervalId = null;
                if (isAutoClicking) { logDebug('Resetting isAutoClicking due to fast click interrupt.'); isAutoClicking = false; }
                return;
            }

            // Check if percentage found by observer OR timeout reached
            if (percentageFoundAndProcessed || dialogCheckTime >= DIALOG_CHECK_TIMEOUT) {
                logDebug(`Auto-click loop end. Processed: ${percentageFoundAndProcessed}, Timed out: ${dialogCheckTime >= DIALOG_CHECK_TIMEOUT}`);
                clearInterval(autoClickIntervalId); // Stop this interval
                autoClickIntervalId = null;

                // If timed out, the percentage wasn't found by observer
                if (!percentageFoundAndProcessed && dialogCheckTime >= DIALOG_CHECK_TIMEOUT) {
                    logDebug('Auto-click timed out waiting for percentage.');
                    // ** DO NOT attempt close here **
                    // Reset flag as the auto-click process failed/timed out
                    if (isAutoClicking) {
                        logDebug('Resetting isAutoClicking flag after timeout.');
                        isAutoClicking = false;
                    }
                    // Check restore after timeout
                    if (fastReviveButtonAdded && !document.getElementById('fast-revive-btn') && findReviveButton()) {
                         logDebug('Restoring button after auto-click timeout.');
                         addFastReviveButton(true);
                    }
                    // Stop other monitoring if timed out
                    cleanup();
                }
                // If percentage *was* found, the observer handles cleanup and resetting isAutoClicking
            }
            dialogCheckTime += DIALOG_CHECK_DELAY;
        }, DIALOG_CHECK_DELAY);
    }

    function createFastReviveButton(originalBtn) { /* ... same as v4.5 ... */
        logDebug('createFastReviveButton called.');
        if (!originalBtn) return null;
        const fastBtn = document.createElement('a');
        fastBtn.id = 'fast-revive-btn';
        fastBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="vertical-align: middle; display: block; margin: auto; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"><path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M16.5,16.5h-3v3h-3v-3h-3v-3h3v-3h3v3h3V16.5z"/></svg>`;
        const baseStyle = { background: 'linear-gradient(to bottom, #444 0%, #333 100%)', border: '1px solid #555', borderRadius: '3px', color: '#fff', textAlign: 'center', cursor: 'pointer', textDecoration: 'none', transition: 'background 0.2s ease', position: 'relative', boxSizing: 'border-box' };
        Object.assign(fastBtn.style, baseStyle);
        fastBtn.addEventListener('mouseover', function() { this.style.background = 'linear-gradient(to bottom, #555 0%, #444 100%)'; });
        fastBtn.addEventListener('mouseout', function() { this.style.background = 'linear-gradient(to bottom, #444 0%, #333 100%)'; });
        fastBtn.title = "Fast Revive (No Confirmation)";
        fastBtn.setAttribute('role', 'button');
        fastBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logDebug('--- Fast revive button clicked by user ---');
            if (lastRevivePercentage && !percentageFoundAndProcessed) { showNotification(formatReviveMessage(lastRevivePercentage), true); }
            else if (!lastRevivePercentage) { logDebug('No percentage known, proceeding.'); }
            logDebug('Setting skipReviveConfirmation = true for fast click.');
            window.skipReviveConfirmation = true;
            const currentOriginalBtn = findReviveButton();
            if (currentOriginalBtn) { currentOriginalBtn.click(); }
            else { logDebug('ERROR: Original button disappeared.'); window.skipReviveConfirmation = false; }
            setTimeout(() => { if (fastReviveButtonAdded && !document.getElementById('fast-revive-btn') && findReviveButton()){ addFastReviveButton(true); } }, FAST_CLICK_RESTORE_DELAY);
        });
        return fastBtn;
    }

    function interceptXmlHttpRequest() { /* ... same as v4.5 ... */
        logDebug('interceptXmlHttpRequest called.');
        if (XMLHttpRequest.prototype.open._isPatched) return;
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
            if (window.skipReviveConfirmation === true && url && typeof url === 'string' && url.includes('action=revive') && !url.includes('step=revive')) {
                const originalUrl = url;
                url = url.includes('?') ? url + '&step=revive' : url + '?step=revive';
                logDebug(`Modified XHR URL for fast revive: ${url}`);
                logDebug('Resetting window.skipReviveConfirmation to false after use.');
                window.skipReviveConfirmation = false;
            } else if (window.skipReviveConfirmation === true && url && typeof url === 'string' && url.includes('action=revive')) {
                 logDebug('Revive request detected, step=revive already present. Resetting flag.');
                 window.skipReviveConfirmation = false;
            }
            return originalOpen.call(this, method, url, async, user, pass);
        };
        XMLHttpRequest.prototype.open._isPatched = true;
        logDebug('XHR open method patched.');
    }

    function addFastReviveButton(force = false) { /* ... same as v4.6 ... */
        logDebug(`addFastReviveButton called. Force: ${force}`);
        const existingButton = document.getElementById('fast-revive-btn');
        if (!force && existingButton) { logDebug('Button exists, not forcing.'); return true; }
        if (force && existingButton) { logDebug('Force re-add: Removing existing.'); existingButton.remove(); }
        if (fastReviveButtonAdded && !force) { logDebug('Initial add done, not forcing.'); return false; }

        const reviveBtn = findReviveButton();
        if (!reviveBtn) { logDebug('Original button not found.'); return false; }
        const fastBtn = createFastReviveButton(reviveBtn);
        if (!fastBtn) { logDebug('Failed to create button.'); return false; }

        let buttonAppended = false;
        const mobile = isMobile();
        try {
            if (mobile) {
                logDebug('Mobile device detected. Using fixed positioning (center-right).');
                const mobileStyle = { position: 'fixed', top: '50%', right: '15px', transform: 'translateY(-50%)', width: '40px', height: '40px', zIndex: '2147483646', borderRadius: '50%', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', margin: '0' };
                Object.assign(fastBtn.style, mobileStyle);
                if (document.body) { document.body.appendChild(fastBtn); buttonAppended = true; }
                else { logDebug('Body not ready for fixed button.'); }
            } else {
                logDebug('Desktop device detected. Using container placement.');
                let buttonContainer = reviveBtn.closest('.buttons-list, .profile-buttons, .buttons');
                if (!buttonContainer) { /* ... find container logic ... */
                    const possibleContainers = [ '.buttons-wrap .buttons', '.profile-buttons', '.buttons-list', '.buttons', '.buttons-wrap .buttons:last-child' ];
                    for (const selector of possibleContainers) { const container = document.querySelector(selector); if (container && (container.contains(reviveBtn) || container.querySelector('a[class*="button"]'))) { buttonContainer = container; break; } }
                }
                if (buttonContainer) { /* ... append to container & copy styles ... */
                    buttonContainer.appendChild(fastBtn);
                    const refButton = reviveBtn || buttonContainer.querySelector('a[class*="button"], button');
                    if (refButton) {
                        const computedStyle = window.getComputedStyle(refButton);
                        fastBtn.style.width = computedStyle.width; fastBtn.style.height = computedStyle.height; fastBtn.style.margin = computedStyle.margin;
                        fastBtn.style.display = computedStyle.display; fastBtn.style.verticalAlign = computedStyle.verticalAlign;
                        if (computedStyle.float && computedStyle.float !== 'none') fastBtn.style.float = computedStyle.float;
                    }
                    buttonAppended = true;
                } else if (reviveBtn.parentNode) { /* ... fallback placement & copy styles ... */
                    reviveBtn.parentNode.insertBefore(fastBtn, reviveBtn.nextSibling);
                     try { const computedStyle = window.getComputedStyle(reviveBtn); fastBtn.style.width = computedStyle.width; fastBtn.style.height = computedStyle.height; fastBtn.style.margin = computedStyle.margin; fastBtn.style.display = computedStyle.display; fastBtn.style.verticalAlign = computedStyle.verticalAlign; } catch(e) { logDebug("Error getting fallback style:", e); }
                    buttonAppended = true;
                }
            }
        } catch (error) { logDebug("Error during button placement:", error); buttonAppended = false; }

        if (buttonAppended) {
            logDebug('[Fast Revive] Button appended successfully.');
            if (!fastReviveButtonAdded) {
                logDebug('Setting fastReviveButtonAdded = true.');
                fastReviveButtonAdded = true;
                logDebug(`Triggering initial auto-click with ${INITIAL_AUTO_CLICK_DELAY}ms delay.`);
                if (!percentageFoundAndProcessed) setTimeout(autoClickReviveButton, INITIAL_AUTO_CLICK_DELAY);
            }
            return true;
        } else { logDebug('Failed to append button.'); return false; }
    }

    function startButtonCheckInterval() { /* ... same as v4.4 ... */
        logDebug('startButtonCheckInterval called.');
        if (buttonCheckIntervalId) clearInterval(buttonCheckIntervalId);
        if (notificationCheckIntervalId) clearInterval(notificationCheckIntervalId);
        buttonCheckIntervalId = setInterval(() => {
            if (fastReviveButtonAdded && !document.getElementById('fast-revive-btn')) {
                 if (findReviveButton()) { logDebug('Interval: Re-adding missing button.'); addFastReviveButton(true); }
                 else { logDebug('Interval: Button missing, original missing.'); }
            }
        }, 1500);
        notificationCheckIntervalId = setInterval(() => {
            if (lastRevivePercentage && !notificationShown) { logDebug(`Interval: Re-showing notification.`); showNotification(formatReviveMessage(lastRevivePercentage), true); }
        }, 1500);
        logDebug('Button/Notification check intervals started.');
    }

    function initScript() { /* ... same as v4.4 ... */
         if (scriptInitialized) return;
        scriptInitialized = true;
        logDebug('initScript called.');
        preloadNotification();
        let timeWaited = 0;
        logDebug(`Starting initial button add loop (Timeout: ${OBSERVER_TIMEOUT}ms).`);
        const initInterval = setInterval(() => {
            if (percentageFoundAndProcessed) { clearInterval(initInterval); return; }
            if (!document.body) return;
            const added = addFastReviveButton(false);
            if (added || timeWaited >= OBSERVER_TIMEOUT) {
                logDebug(`Initial loop condition met. Added: ${added}, Timed out: ${timeWaited >= OBSERVER_TIMEOUT}`);
                clearInterval(initInterval);
                if (fastReviveButtonAdded || findReviveButton()) {
                    setupConfirmationObserver();
                    startButtonCheckInterval();
                    if (!fastReviveButtonAdded && timeWaited >= OBSERVER_TIMEOUT && findReviveButton()) {
                         logDebug('Initial add timed out/failed, forcing add.');
                         addFastReviveButton(true);
                    }
                } else { logDebug('Initial add timed out/failed and original button not found.'); cleanup(); }
            }
            timeWaited += CHECK_INTERVAL;
        }, CHECK_INTERVAL);
    }

    function init() { /* ... same as v4.4 ... */
        logDebug('init called.');
        interceptXmlHttpRequest();
        preloadNotification();
        if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initScript); }
        else { initScript(); }
    }

    // Start
    init();
    logDebug('Script execution finished initial setup.');

})();

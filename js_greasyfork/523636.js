// ==UserScript==
// @name        WME Always Visible (BushmanZA Edition)
// @namespace   https://wme.michaelrosstarr.com/
// @version     2.1
// @description Makes your user status always visible in Waze Map Editor.
// @author      https://github.com/michaelrosstarr
// @include 	/^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude     https://www.waze.com/user/*editor/*
// @exclude     https://www.waze.com/*/user/*editor/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523636/WME%20Always%20Visible%20%28BushmanZA%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523636/WME%20Always%20Visible%20%28BushmanZA%20Edition%29.meta.js
// ==/UserScript==

/**
 * WME Always Visible - Makes your user status always visible in Waze Map Editor
 */

// Script information
const SCRIPT_INFO = {
    name: GM_info.script.name,
    version: GM_info.script.version,
    debugMode: true // Set to true to enable verbose logging
};

// Global variables
let wmeSDK;

/**
 * Logging utility function
 * @param {any} message - Message to log
 */
const log = (message) => {
    if (!SCRIPT_INFO.debugMode) return;

    const prefix = 'WME_AV: ';
    if (typeof message === 'string') {
        console.log(prefix + message);
    } else {
        console.log(prefix, message);
    }
};

/**
 * Creates a mutation observer with error handling
 * @param {Function} callback - Observer callback function
 * @param {Object} options - Observer options
 * @returns {MutationObserver} - Configured mutation observer
 */
const createObserver = (callback, options = { childList: true, subtree: true }) => {
    try {
        return new MutationObserver(callback);
    } catch (error) {
        console.error('WME_AV: Error creating observer:', error);
        return null;
    }
};

/**
 * Helper function to find elements in shadow DOM
 * @param {Element} root - Root element to start search from
 * @param {string} selector - CSS selector to find
 * @returns {Element|null} - Found element or null
 */
const findInShadowDOM = (root, selector) => {
    if (!root) return null;

    // Check in the current element
    const element = root.querySelector(selector);
    if (element) return element;

    // Look through all children with shadow roots
    const shadowElements = Array.from(root.querySelectorAll('*'))
        .filter(el => el.shadowRoot);

    for (const el of shadowElements) {
        const found = findInShadowDOM(el.shadowRoot, selector);
        if (found) return found;
    }

    return null;
};

/**
 * Initialize the script once SDK is available
 */
window.SDK_INITIALIZED.then(() => {
    try {
        wmeSDK = getWmeSdk({ scriptId: "wme-av", scriptName: "WME Always Visible" });
        log('Initializing');
        bootstrap();
    } catch (error) {
        console.error('WME_AV: Initialization error:', error);
    }
});

/**
 * Bootstrap the script when WME is ready
 */
const bootstrap = () => {
    log('Bootstrapping');
    if (wmeSDK.State.isReady) {
        init();
    } else {
        wmeSDK.Events.once({ eventName: 'wme-initialized' })
            .then(() => init())
            .catch(error => console.error('WME_AV: Error waiting for WME initialization:', error));
    }
};

/**
 * Main initialization function
 */
const init = () => {
    log('Executing init logic');

    const observer = createObserver((mutations, observer) => {
        const onlineEditors = document.querySelector('#online-editors');
        if (onlineEditors) {
            log('Online editors found');
            observer.disconnect();
            observeOnlineEditors(onlineEditors);
        }
    });

    if (observer) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
};

/**
 * Wait for content to load inside online editors panel
 * @param {Element} onlineEditors - Online editors DOM element
 */
const observeOnlineEditors = (onlineEditors) => {
    const observer = createObserver((mutations, observer) => {
        if (onlineEditors.childElementCount > 0) {
            log('Content loaded inside onlineEditors');
            observer.disconnect();
            makeEditorVisible(onlineEditors);
        }
    });

    if (observer) {
        observer.observe(onlineEditors, { childList: true });
    }
};

/**
 * Handle making the editor visible
 * @param {Element} onlineEditors - Online editors DOM element
 */
const makeEditorVisible = (onlineEditors) => {
    // First, locate the bubble button that opens the editors panel
    const bubbleButton = onlineEditors.querySelector('wz-button.online-editors-bubble');
    if (!bubbleButton) {
        log('Bubble button not found');
        return;
    }

    log('Found online editors bubble button');

    // Define a function to handle the sequence of actions
    const processVisibility = () => {
        // Step 1: Open the panel by clicking the bubble button
        bubbleButton.click();
        log('Clicked bubble button to open editor panel');

        // Step 2: Wait for panel to load completely
        setTimeout(() => {
            // Check if user is invisible
            const label = onlineEditors.querySelector('.editor-visibility-label');
            if (label && label.textContent === '(invisible)') {
                log('Editor is invisible, will attempt to make visible');

                // Step 3: Find and click the visibility button
                setTimeout(() => {
                    try {
                        // Try multiple methods to find the visibility button

                        // Method 1: Use tooltip to find the button
                        const tooltip = onlineEditors.querySelector('wz-basic-tooltip');
                        if (tooltip) {
                            log('Found tooltip element');

                            // Try to find the button through wz-button element first
                            const wzButton = tooltip.querySelector('wz-button');
                            if (wzButton && wzButton.shadowRoot) {
                                const shadowButton = wzButton.shadowRoot.querySelector('button');
                                if (shadowButton) {
                                    shadowButton.click();
                                    log('Clicked visibility button via wz-button shadow DOM');

                                    // Wait and then close the panel
                                    setTimeout(() => {
                                        bubbleButton.click();
                                        log('Closed editor panel after making visible');
                                    }, 500);

                                    return;
                                }
                            }

                            // If direct shadow button didn't work, try getting the button through the icon
                            const invisibilityIcon = onlineEditors.querySelector('.w-icon-invisible');
                            if (invisibilityIcon) {
                                const parentButton = invisibilityIcon.closest('wz-button');
                                if (parentButton) {
                                    parentButton.click();
                                    log('Clicked visibility button via icon parent');

                                    // Wait and then close the panel
                                    setTimeout(() => {
                                        bubbleButton.click();
                                        log('Closed editor panel after making visible');
                                    }, 500);

                                    return;
                                }
                            }

                            // Last resort - click the tooltip directly
                            tooltip.click();
                            log('Clicked tooltip directly');
                        } else {
                            log('Tooltip not found, trying alternative methods');

                            // Try to find any button with the invisible icon
                            const buttons = Array.from(onlineEditors.querySelectorAll('wz-button'));
                            for (const btn of buttons) {
                                const iconElement = btn.querySelector('i.w-icon-invisible');
                                if (iconElement) {
                                    btn.click();
                                    log('Found and clicked button with invisible icon');
                                    break;
                                }
                            }
                        }
                    } catch (error) {
                        console.error('WME_AV: Error clicking visibility button:', error);
                    }

                    // Close the panel regardless of success/failure
                    setTimeout(() => {
                        bubbleButton.click();
                        log('Closed editor panel');
                    }, 500);
                }, 500); // Wait for elements to be fully rendered
            } else if (label && label.textContent === '(visible)') {
                log('Editor is already visible, closing panel');
                // Just close the panel if already visible
                bubbleButton.click();
            } else {
                log('Could not determine editor visibility status');
                // Close the panel if status can't be determined
                bubbleButton.click();
            }
        }, 1000); // Give enough time for panel to load
    };

    // Start the process
    processVisibility();
};

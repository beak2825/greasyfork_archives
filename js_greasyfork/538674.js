// ==UserScript==
// @name         Twitch Combos Overlay Blocker
// @namespace    https://github.com/nebhay/twitch-combos-blocker
// @version      1.0.0
// @description  Blocks Twitch's combos overlay using CSS and DOM manipulation
// @author       nebhay
// @match        https://www.twitch.tv/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @homepageURL  https://github.com/nebhay/twitch-combos-blocker
// @supportURL   https://github.com/nebhay/twitch-combos-blocker/issues
// @downloadURL https://update.greasyfork.org/scripts/538674/Twitch%20Combos%20Overlay%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/538674/Twitch%20Combos%20Overlay%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        DEBUG: true,
        SELECTORS: [
            '[data-a-target*="onetap"]',
            'div[class*="onetap" i]',
            '.onetap-overlay'
        ]
    };

    /**
     * Log messages with consistent formatting
     * @param {string} message - The message to log
     * @param {string} type - The log type (info, success, warning, error)
     * @param {any} data - Additional data to log
     */
    function log(message, type = 'info', data = null) {
        if (!CONFIG.DEBUG) return;

        const colors = {
            info: 'color: blue; font-weight: bold;',
            success: 'color: green; font-weight: bold;',
            warning: 'color: orange; font-weight: bold;',
            error: 'color: red; font-weight: bold;'
        };

        const prefix = '[Combos Blocker]';
        if (data) {
            console.log(`%c${prefix} ${message}`, colors[type], data);
        } else {
            console.log(`%c${prefix} ${message}`, colors[type]);
        }
    }

    /**
     * Apply CSS rules to hide combos elements
     */
    function applyCSSRules() {
        const style = document.createElement('style');
        style.id = 'twitch-combos-blocker-styles';

        style.textContent = `
            /* Hide combos overlay containers */
            ${CONFIG.SELECTORS.join(',\n            ')} {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
                z-index: -9999 !important;
            }

            /* Prevent body scroll lock when overlay would be present */
            body.ReactModal__Body--open {
                overflow: auto !important;
            }

            /* Additional selectors for combos variants */
            [data-test-selector*="onetap"],
            [aria-label*="onetap" i],
            [title*="onetap" i] {
                display: none !important;
                visibility: hidden !important;
            }
        `;

        // Insert into head or fallback to document
        const target = document.head || document.documentElement;
        target.appendChild(style);

        log('CSS rules applied successfully', 'success');
    }

    /**
     * Check if an element matches combos criteria
     * @param {Element} element - The element to check
     * @returns {boolean} True if element appears to be a combos element
     */
    function isCombosElement(element) {
        if (!element || element.nodeType !== 1) return false;

        // Check data attributes
        const dataTarget = element.dataset?.aTarget;
        if (dataTarget && dataTarget.includes('onetap')) return true;

        const testSelector = element.dataset?.testSelector;
        if (testSelector && testSelector.toLowerCase().includes('onetap')) return true;

        // Check class names
        const className = element.className || '';
        const classStr = typeof className === 'string' ? className : className.toString?.() || '';
        if (classStr.toLowerCase().includes('onetap')) return true;

        // Check aria-label and title attributes
        const ariaLabel = element.getAttribute?.('aria-label') || '';
        const title = element.getAttribute?.('title') || '';
        if (ariaLabel.toLowerCase().includes('onetap') || title.toLowerCase().includes('onetap')) {
            return true;
        }

        return false;
    }

    /**
     * Remove combos elements from the DOM
     * @param {Element} element - The element to remove
     */
    function removeCombosElement(element) {
        const details = {
            tagName: element.tagName,
            className: element.className?.toString?.() || element.className || '',
            dataTarget: element.dataset?.aTarget,
            id: element.id,
            outerHTML: element.outerHTML?.substring(0, 200) + '...'
        };

        log('Removing combos element:', 'warning', details);
        element.remove();
    }

    /**
     * Set up MutationObserver to watch for new combos elements
     */
    function setupDOMObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType !== 1) return; // Skip non-element nodes

                    // Check if the node itself is a combos element
                    if (isCombosElement(node)) {
                        removeCombosElement(node);
                        return;
                    }

                    // Check for combos elements within the added node
                    if (node.querySelectorAll) {
                        const combosElements = node.querySelectorAll(CONFIG.SELECTORS.join(', '));
                        if (combosElements.length > 0) {
                            log(`Found ${combosElements.length} combos element(s) in added content`, 'warning');
                            combosElements.forEach(removeCombosElement);
                        }
                    }
                });
            });
        });

        // Start observing
        const target = document.body || document.documentElement;
        observer.observe(target, {
            childList: true,
            subtree: true
        });

        log('DOM observer started', 'success');
        return observer;
    }

    /**
     * Perform initial cleanup of existing combos elements
     */
    function initialCleanup() {
        const existingElements = document.querySelectorAll(CONFIG.SELECTORS.join(', '));
        if (existingElements.length > 0) {
            log(`Removing ${existingElements.length} existing combos element(s)`, 'warning');
            existingElements.forEach(removeCombosElement);
        }
    }

    /**
     * Initialize the blocker
     */
    function init() {
        log('Initializing Combos Blocker', 'info');

        // Apply CSS rules immediately
        applyCSSRules();

        // Set up DOM observer
        const observer = setupDOMObserver();

        // Perform initial cleanup when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialCleanup);
        } else {
            initialCleanup();
        }

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (observer) {
                observer.disconnect();
                log('Observer disconnected', 'info');
            }
        });

        log('Combos Blocker initialized successfully', 'success');
    }

    // Start the blocker
    init();

})();

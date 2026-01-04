// ==UserScript==
// @name         Center Claude AI Prompt Header
// @description  Centers the Claude AI prompt header
// @author       NWP
// @namespace    https://greasyfork.org/users/877912
// @version      0.1
// @license      MIT
// @match        https://claude.ai/chat*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542861/Center%20Claude%20AI%20Prompt%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/542861/Center%20Claude%20AI%20Prompt%20Header.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG_MODE = false;

    function logDebug(message, ...args) {
        if (DEBUG_MODE) {
            console.log('Claude AI Centering:', message, ...args);
        }
    }

    logDebug('Starting Claude AI prompt header centering script');

    const DEBOUNCE_DELAY = 250;
    const POLLING_INTERVAL = 5000;
    const MUTATION_DEBOUNCE_DELAY = 100;

    let styleApplyTimeout;
    let mutationTimeout;
    let urlCheckTimeout;
    let currentUrl = window.location.href;
    let isProcessing = false;

    function debouncedApplyStyles(delay = DEBOUNCE_DELAY) {
        if (styleApplyTimeout) {
            clearTimeout(styleApplyTimeout);
        }

        styleApplyTimeout = setTimeout(() => {
            if (!isProcessing) {
                applyCenteringStyles();
            }
        }, delay);
    }

    function debouncedMutationHandler() {
        if (mutationTimeout) {
            clearTimeout(mutationTimeout);
        }

        mutationTimeout = setTimeout(() => {
            logDebug('Prompt header mutation detected (debounced), reapplying styles');
            debouncedApplyStyles(MUTATION_DEBOUNCE_DELAY);
        }, MUTATION_DEBOUNCE_DELAY);
    }

    function debouncedUrlChangeHandler() {
        if (urlCheckTimeout) {
            clearTimeout(urlCheckTimeout);
        }

        urlCheckTimeout = setTimeout(() => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                logDebug('URL changed to:', currentUrl);
                debouncedApplyStyles(500);
            }
        }, 100);
    }

    function injectCenteringCSS() {
        const styleId = 'claude-ai-center-style';
        if (document.getElementById(styleId)) {
            logDebug('CSS already injected');
            return;
        }

        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            header > div.flex.w-full.items-center {
                justify-content: center !important;
            }

            header div.flex.min-w-0.flex-1 {
                justify-content: center !important;
                margin: 0 auto !important;
            }

            header div[class*="flex"] {
                justify-content: center !important;
            }

            header > div:first-child {
                justify-content: center !important;
            }
        `;

        document.head.appendChild(style);
        logDebug('Injected centering CSS');
    }

    function applyCenteringStyles() {
        if (isProcessing) {
            logDebug('Already processing, skipping...');
            return;
        }

        isProcessing = true;
        logDebug('Applying centering styles');

        try {
            const headerContent = document.querySelector('header > div.flex.w-full.items-center');
            if (headerContent) {
                headerContent.style.setProperty('justify-content', 'center', 'important');
                logDebug('Applied styles to prompt header content');
            }

            const flexContainers = document.querySelectorAll('header div.flex.min-w-0.flex-1');
            flexContainers.forEach(container => {
                container.style.setProperty('justify-content', 'center', 'important');
                container.style.setProperty('margin', '0 auto', 'important');
            });

            if (flexContainers.length > 0) {
                logDebug(`Applied styles to ${flexContainers.length} flex containers`);
            }

            const allHeaderFlexDivs = document.querySelectorAll('header div[class*="flex"]');
            allHeaderFlexDivs.forEach(div => {
                div.style.setProperty('justify-content', 'center', 'important');
            });

            const headerFirstChild = document.querySelector('header > div:first-child');
            if (headerFirstChild) {
                headerFirstChild.style.setProperty('justify-content', 'center', 'important');
                logDebug('Applied styles to prompt header first child');
            }

            logDebug('Finished applying centering styles');
        } catch (error) {
            logDebug('Error applying styles:', error);
        } finally {
            isProcessing = false;
        }
    }

    injectCenteringCSS();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            logDebug('DOM loaded, applying styles');
            debouncedApplyStyles(100);
        });
    } else {
        logDebug('DOM already loaded, applying styles immediately');
        debouncedApplyStyles(100);
    }

    const observer = new MutationObserver((mutations) => {
        debouncedUrlChangeHandler();

        const headerModified = mutations.some(mutation =>
            mutation.target.tagName === 'HEADER' ||
            mutation.target.closest('header') ||
            Array.from(mutation.addedNodes).some(node =>
                node.tagName === 'HEADER' ||
                (node.querySelector && node.querySelector('header'))
            )
        );

        if (headerModified) {
            debouncedMutationHandler();
        }
    });

    const startObserver = () => {
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            logDebug('Started mutation observer');
        } else {
            setTimeout(startObserver, 100);
        }
    };

    startObserver();

    const intervalId = setInterval(() => {
        debouncedUrlChangeHandler();
        if (!isProcessing && !styleApplyTimeout) {
            debouncedApplyStyles(0);
        }
    }, POLLING_INTERVAL);

    window.claudeHeaderCenteringCleanup = () => {
        if (styleApplyTimeout) clearTimeout(styleApplyTimeout);
        if (mutationTimeout) clearTimeout(mutationTimeout);
        if (urlCheckTimeout) clearTimeout(urlCheckTimeout);
        if (intervalId) clearInterval(intervalId);
        observer.disconnect();
        logDebug('Cleaned up Claude AI prompt header centering script');
    };

    setTimeout(() => {
        logDebug('Fallback timeout triggered');
        debouncedApplyStyles(0);
    }, 1000);

})();
// ==UserScript==
// @name         n8n Workflow Preview Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Fix the awful non-responsive layout on n8n workflow pages, kupo!
// @author       You
// @match        https://n8n.io/workflows/*
// @exclude      https://n8n.io/workflows/
// @exclude      https://n8n.io/workflows
// @grant        none
// @run-at       document-idle
// @license     GPL-3.0-or-later

// @downloadURL https://update.greasyfork.org/scripts/541500/n8n%20Workflow%20Preview%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/541500/n8n%20Workflow%20Preview%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('n8n Layout Fix: Enhanced version with SPA navigation support, kupo!');

    let isFixing = false;
    let fixAttempts = 0;
    const maxFixAttempts = 15; // Increased for slow iframe loading

    // Function to find elements in shadow DOM
    const findInShadowDOM = (selector) => {
        const elements = [];

        // Find all elements with shadow roots
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            if (el.shadowRoot) {
                const shadowElements = el.shadowRoot.querySelectorAll(selector);
                elements.push(...shadowElements);
            }
        });

        return elements;
    };

    // Enhanced function to wait for iframe content
    const waitForIframeContent = () => {
        return new Promise((resolve) => {
            const checkIframe = () => {
                const iframe = document.querySelector('#int_iframe, iframe.embedded_workflow_iframe');
                if (iframe) {
                    // Check if iframe has loaded content
                    try {
                        if (iframe.contentDocument || iframe.contentWindow) {
                            console.log('Iframe detected and accessible, kupo!');
                            resolve(true);
                            return;
                        }
                    } catch (e) {
                        // Cross-origin iframe, but that's normal for n8n
                        console.log('Cross-origin iframe detected (normal), kupo!');
                        resolve(true);
                        return;
                    }
                }

                // Also check for shadow DOM iframe
                const shadowIframe = findInShadowDOM('#int_iframe, .embedded_workflow_iframe');
                if (shadowIframe.length > 0) {
                    console.log('Shadow DOM iframe found, kupo!');
                    resolve(true);
                    return;
                }

                setTimeout(checkIframe, 200);
            };

            checkIframe();

            // Fallback timeout
            setTimeout(() => resolve(false), 8000);
        });
    };

    // Function to apply all layout fixes
    const fixLayout = async () => {
        if (isFixing) return false;
        isFixing = true;

        console.log(`Fix attempt ${fixAttempts + 1}/${maxFixAttempts}, kupo!`);

        let fixesApplied = 0;

        // Fix 1: Change flex-direction to column
        const targetElement = document.querySelector('.section-content-group.flex.flex-col.gap-8.lg\\:flex-row');
        if (targetElement) {
            targetElement.style.flexDirection = 'column !important';
            targetElement.classList.remove('lg:flex-row');
            console.log('Flex-direction fix applied, kupo!');
            fixesApplied++;
        }

        // Fix 2: Add max-width calc(100vw - 55px) to BOTH outer wrapper variations
        const maxWidthSelectors = [
            'div.max-w-section-default.mx-auto.w-full',
            'div.mx-auto.w-full.max-w-section-default'
        ];

        maxWidthSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.maxWidth = 'calc(100vw - 55px)';
                console.log('Max-width calc(100vw - 55px) applied to: ' + selector + ', kupo!');
                fixesApplied++;
            });
        });

        // Fix 3: Update width calc(100vw - 55px) to lg:w-8/12 element
        const targetWidthElement = document.querySelector('div.lg\\:w-8\\/12');
        if (targetWidthElement) {
            targetWidthElement.style.width = 'calc(100vw - 55px)';
            console.log('Width calc(100vw - 55px) applied to lg:w-8/12 element, kupo!');
            fixesApplied++;
        }


        // Wait for iframe content before applying iframe-related fixes
        console.log('Waiting for iframe content to load, kupo...');
        await waitForIframeContent();

        // Fix 4: Regular DOM elements with min-height 100vh
        const regularSelectors = [
            'div.base-frame.relative.rounded-2xl.bg-white.bg-opacity-10.p-2.base-frame--default.workflow-viewer[data-v-57c68cc9][data-v-2f4878b1][data-v-6c0d4504]',
            'div.base-frame-inner.overflow-hidden.rounded-xl[data-v-57c68cc9]',
            'n8n-demo[data-v-2f4878b1]'
        ];

        regularSelectors.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) {
                el.style.minHeight = '100vh';
                console.log('min-height 100vh applied to ' + selector + ', kupo!');
                fixesApplied++;
            }
        });

        // Fix 5: The bg-white div (try different approach)
        const bgWhiteElements = document.querySelectorAll('div[data-v-2f4878b1]');
        bgWhiteElements.forEach(el => {
            if (el.classList.contains('bg-white')) {
                el.style.minHeight = '100vh';
                console.log('min-height 100vh applied to bg-white div, kupo!');
                fixesApplied++;
            }
        });

        // Fix 6: Shadow DOM elements (with retry mechanism)
        const shadowSelectors = [
            '.embedded_workflow',
            '.canvas-container',
            '#int_iframe.embedded_workflow_iframe.non_interactive'
        ];

        shadowSelectors.forEach(selector => {
            const shadowElements = findInShadowDOM(selector);
            shadowElements.forEach(el => {
                el.style.minHeight = '100vh';
                console.log('min-height 100vh applied to shadow DOM element: ' + selector + ', kupo!');
                fixesApplied++;
            });
        });

        // Alternative approach for shadow DOM - find n8n-demo and access its shadow root
        const n8nDemo = document.querySelector('n8n-demo[data-v-2f4878b1]');
        if (n8nDemo && n8nDemo.shadowRoot) {
            const shadowRoot = n8nDemo.shadowRoot;

            // Try to find elements in this specific shadow root
            const embeddedWorkflow = shadowRoot.querySelector('.embedded_workflow');
            if (embeddedWorkflow) {
                embeddedWorkflow.style.minHeight = '100vh';
                console.log('Applied 100vh to .embedded_workflow in shadow root, kupo!');
                fixesApplied++;
            }

            const canvasContainer = shadowRoot.querySelector('.canvas-container');
            if (canvasContainer) {
                canvasContainer.style.minHeight = '100vh';
                console.log('Applied 100vh to .canvas-container in shadow root, kupo!');
                fixesApplied++;
            }

            const iframe = shadowRoot.querySelector('#int_iframe');
            if (iframe) {
                iframe.style.minHeight = '100vh';
                console.log('Applied 100vh to iframe in shadow root, kupo!');
                fixesApplied++;
            }
        }

        isFixing = false;
        return fixesApplied > 0;
    };

    // Function to detect URL changes (for SPA navigation)
    const detectURLChange = () => {
        let currentURL = window.location.href;

        const checkURLChange = () => {
            if (window.location.href !== currentURL) {
                currentURL = window.location.href;
                console.log('URL changed to:', currentURL, 'kupo!');

                // Reset fix attempts for new page
                fixAttempts = 0;

                // Wait a bit for the new content to start loading
                setTimeout(() => {
                    console.log('Starting layout fixes after navigation, kupo!');
                    startFixingProcess();
                }, 500);
            }
        };

        setInterval(checkURLChange, 100);
    };

    // Main fixing process with enhanced retry logic
    const startFixingProcess = async () => {
        // Try to fix immediately
        if (await fixLayout()) {
            console.log('Initial layout fixes applied successfully, kupo!');
        }

        // Enhanced retry mechanism
        const retryInterval = setInterval(async () => {
            fixAttempts++;

            if (fixAttempts >= maxFixAttempts) {
                clearInterval(retryInterval);
                console.log('Max fix attempts reached. Layout fix monitoring complete, kupo!');
                return;
            }

            await fixLayout();
        }, 1000); // Check every second

        // Watch for dynamic content changes
        const observer = new MutationObserver(async (mutations) => {
            let shouldCheck = false;

            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if any added nodes contain our target elements
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            if (node.matches && (
                                node.matches('n8n-demo') ||
                                node.matches('.base-frame') ||
                                node.matches('iframe') ||
                                node.querySelector && (
                                    node.querySelector('n8n-demo') ||
                                    node.querySelector('.base-frame') ||
                                    node.querySelector('iframe')
                                )
                            )) {
                                shouldCheck = true;
                            }
                        }
                    });
                }
            });

            if (shouldCheck && fixAttempts < maxFixAttempts) {
                setTimeout(async () => {
                    console.log('DOM change detected, applying fixes, kupo!');
                    await fixLayout();
                }, 300);
            }
        });

        // Start observing with enhanced options
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false, // Don't watch attributes to reduce noise
            attributeOldValue: false
        });
    };

    // Start the URL change detection for SPA navigation
    detectURLChange();

    // Start the initial fixing process
    startFixingProcess();

})();

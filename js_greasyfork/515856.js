// ==UserScript==
// @name         ProtonMail Dark Theme for Email Content
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds dark theme to ProtonMail email reading and composition areas
// @match        https://mail.proton.me/*
// @match        https://proton.me/mail/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/515856/ProtonMail%20Dark%20Theme%20for%20Email%20Content.user.js
// @updateURL https://update.greasyfork.org/scripts/515856/ProtonMail%20Dark%20Theme%20for%20Email%20Content.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Main window CSS
    GM_addStyle(`
        /* Composer window and borders */
        .composer, .composer .composer-content--rich-edition {
            background-color: #1a1a1a !important;
            border-color: #333 !important;
        }

        .composer-inner {
            background-color: #1a1a1a !important;
            border-color: #333 !important;
        }

        .composer-title {
            background-color: #1a1a1a !important;
            border-color: #333 !important;
        }

        /* Message containers */
        .message-container,
        .message-content,
        .message-content-wrapper,
        .scroll-horizontal-shadow {
            background-color: #1a1a1a !important;
            border-color: #333 !important;
        }

        /* General containers and borders */
        .rounded-lg,
        .border,
        [class*="border-"] {
            border-color: #333 !important;
        }

        /* Message header and footer areas */
        .message-header-wrapper,
        .message-footer-wrapper {
            background-color: #1a1a1a !important;
        }

        /* Toolbar and button backgrounds */
        .editor-toolbar,
        .composer-toolbar {
            background-color: #262626 !important;
            border-color: #333 !important;
        }
    `);

    // CSS to inject into iframes
    const darkThemeCSS = `
        body {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
        }

        p, div, span, h1, h2, h3, h4, h5, h6, td, th, li {
            color: #e0e0e0 !important;
            background-color: #1a1a1a !important;
        }

        [style*="background-color"],
        [bgcolor] {
            background-color: #1a1a1a !important;
        }

        [style*="color"],
        [color] {
            color: #e0e0e0 !important;
        }

        blockquote {
            border-left-color: #404040 !important;
            background-color: #262626 !important;
            color: #e0e0e0 !important;
        }

        a {
            color: #66b3ff !important;
        }

        /* Table backgrounds */
        table, tr, td, th {
            background-color: #1a1a1a !important;
            border-color: #333 !important;
        }

        /* Force color on common elements that might have inline styles */
        [style*="color: rgb(0, 0, 0)"],
        [style*="color: black"],
        [style*="color:#000"],
        [style*="color: #000"],
        font[color] {
            color: #e0e0e0 !important;
        }

         .composer {
            background-color: #1a1a1a !important;
            border-color: #333 !important;
        }

        .composer-inner {
            background-color: #1a1a1a !important;
            border-color: #333 !important;
        }

        .composer-title {
            background-color: #1a1a1a !important;
            border-color: #333 !important;
        }

        /* Message containers */
        .message-container,
        .message-content-wrapper,
        .scroll-horizontal-shadow {
            background-color: #1a1a1a !important;
            border-color: #333 !important;
        }

        /* General containers and borders */
        .rounded-lg,
        .border,
        [class*="border-"] {
            border-color: #333 !important;
        }

        /* Message header and footer areas */
        .message-header-wrapper,
        .message-footer-wrapper {
            background-color: #1a1a1a !important;
        }

        /* Toolbar and button backgrounds */
        .editor-toolbar,
        .composer-toolbar {
            background-color: #262626 !important;
            border-color: #333 !important;
        }
    `;

    // Function to inject styles into an iframe
    function injectIframeStyles(iframe) {
        try {
            const inject = () => {
                if (!iframe.contentDocument) return;

                // Create and inject stylesheet if it doesn't exist
                if (!iframe.contentDocument.querySelector('#dark-theme-style')) {
                    const style = iframe.contentDocument.createElement('style');
                    style.id = 'dark-theme-style';
                    style.textContent = darkThemeCSS;
                    iframe.contentDocument.head.appendChild(style);
                }

                // Force color on any elements with inline styles
                const elements = iframe.contentDocument.querySelectorAll('*');
                elements.forEach(el => {
                    if (el.tagName !== 'IMG') {
                        el.style.setProperty('background-color', '#1a1a1a', 'important');
                        el.style.setProperty('color', '#e0e0e0', 'important');
                        if (el.style.backgroundImage && el.style.backgroundImage !== 'none') {
                            el.style.setProperty('background-image', 'none', 'important');
                        }
                    }
                });

                // Add mutation observer for dynamically added content within the iframe
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1 && node.tagName !== 'IMG') {
                                node.style.setProperty('background-color', '#1a1a1a', 'important');
                                node.style.setProperty('color', '#e0e0e0', 'important');
                            }
                        });
                    });
                });

                observer.observe(iframe.contentDocument.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['style', 'class']
                });
            };

            // If iframe is already loaded
            if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                inject();
            }

            // Also listen for load event
            iframe.addEventListener('load', inject);

        } catch (e) {
            // Handle cross-origin errors silently
        }
    }

    // Function to watch a specific container for iframes
    function watchContainer(container) {
        if (!container) return;

        // Process any existing iframes
        container.querySelectorAll('iframe').forEach(iframe => {
            injectIframeStyles(iframe);
        });

        // Watch for new iframes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    // Direct iframe
                    if (node.tagName === 'IFRAME') {
                        injectIframeStyles(node);
                    }
                    // Iframe within added node
                    if (node.querySelectorAll) {
                        node.querySelectorAll('iframe').forEach(iframe => {
                            injectIframeStyles(iframe);
                        });
                    }
                });
            });
        });

        observer.observe(container, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'srcdoc']
        });
    }

    // Function to set up all observers
    function setupObservers() {
        // Watch for new messages and composers
        const bodyObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        // Watch message containers
                        if (node.classList?.contains('message-container')) {
                            watchContainer(node);
                        }
                        // Watch for reply composer
                        if (node.classList?.contains('reply-wrapper')) {
                            watchContainer(node);
                        }
                        // Watch any other potential containers
                        node.querySelectorAll('.message-container, .reply-wrapper, .composer-body-container').forEach(container => {
                            watchContainer(container);
                        });
                    }
                });
            });
        });

        bodyObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Process existing containers
        document.querySelectorAll('.message-container, .reply-wrapper, .composer-body-container').forEach(container => {
            watchContainer(container);
        });
    }

    // Initial setup
    setupObservers();

    // Handle route changes
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(setupObservers, 500);
        }
    }).observe(document, { subtree: true, childList: true });

    // Check periodically for new reply composers
    setInterval(() => {
        document.querySelectorAll('.reply-wrapper iframe').forEach(iframe => {
            if (!iframe.contentDocument?.querySelector('#dark-theme-style')) {
                injectIframeStyles(iframe);
            }
        });
    }, 1000);

})();
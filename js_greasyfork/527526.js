// ==UserScript==
// @name         Outlook Privacy Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Disables tracking in Gmail and Outlook by blocking images and JavaScript in email content areas
// @author       Minoa
// @match        https://outlook.office365.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527526/Outlook%20Privacy%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/527526/Outlook%20Privacy%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration for different email clients
    const CONFIG = {
        gmail: {
            container: '.AO .Tm.aeJ',
            observer: true
        },
        outlook: {
            container: '#ConversationReadingPaneContainer.MtujV',
            observer: true
        }
    };

    // CSS to block images and iframes
    const style = document.createElement('style');
    style.textContent = `
        /* Gmail - only target elements within email content */
        .AO .Tm.aeJ .a3s img,
        .AO .Tm.aeJ .a3s iframe,
        .AO .Tm.aeJ .a3s script,
        .AO .Tm.aeJ .a3s [style*="background-image"] {
            display: none !important;
        }
        .AO .Tm.aeJ .a3s [style*="background"] {
            background-image: none !important;
        }

        /* Outlook - only target elements within email content */
        #ConversationReadingPaneContainer.MtujV .allowTextSelection img,
        #ConversationReadingPaneContainer.MtujV .allowTextSelection iframe,
        #ConversationReadingPaneContainer.MtujV .allowTextSelection script,
        #ConversationReadingPaneContainer.MtujV .allowTextSelection [style*="background-image"] {
            display: none !important;
        }
        #ConversationReadingPaneContainer.MtujV .allowTextSelection [style*="background"] {
            background-image: none !important;
        }

        /* Placeholder for blocked content */
        .blocked-content-placeholder {
            display: inline-block;
            padding: 5px 10px;
            background: #f1f1f1;
            border: 1px solid #ddd;
            border-radius: 3px;
            color: #666;
            font-size: 12px;
            margin: 5px 0;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        .blocked-content-placeholder:hover {
            background: #e5e5e5;
        }
    `;
    document.head.appendChild(style);

    // Function to process elements and block content
    function processElement(element) {
        if (!element) return;

        // Remove all script tags
        element.querySelectorAll('script').forEach(script => script.remove());

        // Replace images with placeholders
        element.querySelectorAll('img').forEach(img => {
            const placeholder = document.createElement('div');
            placeholder.className = 'blocked-content-placeholder';
            placeholder.textContent = '🖼️';
            placeholder.dataset.originalSrc = img.src;
            placeholder.addEventListener('click', function() {
                if (this.classList.contains('unblocked')) {
                    this.textContent = '🖼️';
                    this.classList.remove('unblocked');
                } else {
                    const img = document.createElement('img');
                    img.src = this.dataset.originalSrc;
                    this.textContent = '';
                    this.appendChild(img);
                    this.classList.add('unblocked');
                }
            });
            img.parentNode.replaceChild(placeholder, img);
        });

        // Remove background images from elements
        element.querySelectorAll('[style*="background"]').forEach(el => {
            if (!el.dataset.originalBackground) {
                el.dataset.originalBackground = el.style.backgroundImage;
            }
            el.style.backgroundImage = 'none';
            if (!el.classList.contains('blocked-content-placeholder')) {
                el.addEventListener('click', function() {
                    if (this.classList.contains('unblocked')) {
                        this.style.backgroundImage = 'none';
                        this.classList.remove('unblocked');
                    } else {
                        this.style.backgroundImage = this.dataset.originalBackground;
                        this.classList.add('unblocked');
                    }
                });
            }
        });

        // Handle iframes
        element.querySelectorAll('iframe').forEach(iframe => {
            const placeholder = document.createElement('div');
            placeholder.className = 'blocked-content-placeholder';
            placeholder.textContent = '🔲 Frame';
            placeholder.dataset.originalSrc = iframe.src;
            placeholder.addEventListener('click', function() {
                if (this.classList.contains('unblocked')) {
                    this.textContent = '🔲 Frame';
                    this.classList.remove('unblocked');
                } else {
                    const iframe = document.createElement('iframe');
                    iframe.src = this.dataset.originalSrc;
                    this.textContent = '';
                    this.appendChild(iframe);
                    this.classList.add('unblocked');
                }
            });
            iframe.parentNode.replaceChild(placeholder, iframe);
        });
    }

    // Function to initialize observers
    function initializeObserver(config) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    processElement(mutation.target);
                }
            });
        });

        // Start observing the container
        const container = document.querySelector(config.container);
        if (container) {
            processElement(container);
            observer.observe(container, {
                childList: true,
                subtree: true
            });
        }

        return observer;
    }

    // Initialize based on current page
    let currentConfig;
    if (window.location.hostname.includes('mail.google.com')) {
        currentConfig = CONFIG.gmail;
    } else if (window.location.hostname.includes('outlook.office365.com')) {
        currentConfig = CONFIG.outlook;
    }

    if (currentConfig) {
        // Initial processing
        const container = document.querySelector(currentConfig.container);
        if (container) {
            processElement(container);
        }

        // Set up observer for dynamic content
        if (currentConfig.observer) {
            // Wait for the container to be available
            const checkContainer = setInterval(() => {
                const container = document.querySelector(currentConfig.container);
                if (container) {
                    clearInterval(checkContainer);
                    initializeObserver(currentConfig);
                }
            }, 1000);

            // Clear interval after 30 seconds to prevent infinite checking
            setTimeout(() => clearInterval(checkContainer), 30000);
        }
    }
})();
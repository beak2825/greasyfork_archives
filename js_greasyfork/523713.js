// ==UserScript==
// @name         Enhanced Amazon URL Cleaner
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes tracking parameters from Amazon URLs while preserving essential features
// @author       You
// @match        *://*.amazon.com/*
// @match        *://*.amazon.co.uk/*
// @match        *://*.amazon.ca/*
// @match        *://*.amazon.de/*
// @match        *://*.amazon.fr/*
// @match        *://*.amazon.it/*
// @match        *://*.amazon.es/*
// @match        *://*.amazon.co.jp/*
// @match        *://*.amazon.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523713/Enhanced%20Amazon%20URL%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/523713/Enhanced%20Amazon%20URL%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = false; // Set to true to enable console logging

    // Logger function
    const log = (...args) => {
        if (DEBUG) {
            console.log('[Amazon URL Cleaner]', ...args);
        }
    };

    // Function to clean the URL
    function cleanAmazonUrl() {
        const currentUrl = window.location.href;
        log('Processing URL:', currentUrl);

        // Handle mobile URLs
        if (currentUrl.includes('/ref=')) {
            log('Mobile URL detected');
        }

        // Check if this is a product URL
        if (currentUrl.includes('/dp/') || currentUrl.includes('/gp/product/')) {
            // Extract the product ID using regex
            const productIdMatch = currentUrl.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/);
            
            if (productIdMatch) {
                const productId = productIdMatch[1];
                let cleanUrl = `${window.location.origin}/dp/${productId}`;

                // Preserve product variant selection (th parameter)
                const thMatch = currentUrl.match(/th=([^&]+)/);
                if (thMatch) {
                    cleanUrl += `?th=${thMatch[1]}`;
                    log('Preserved variant selection:', thMatch[1]);
                }

                // Only update if the URL is different
                if (cleanUrl !== currentUrl) {
                    log('Updating URL to:', cleanUrl);
                    window.history.replaceState({}, document.title, cleanUrl);
                }
            }
        }
        // Handle search results pages
        else if (currentUrl.includes('/s?') || currentUrl.includes('/s/ref=')) {
            const searchParams = new URLSearchParams(window.location.search);
            const essentialParams = new URLSearchParams();

            // Keep only essential search parameters
            if (searchParams.has('k')) essentialParams.set('k', searchParams.get('k')); // search term
            if (searchParams.has('rh')) essentialParams.set('rh', searchParams.get('rh')); // department
            if (searchParams.has('p')) essentialParams.set('p', searchParams.get('p')); // price range
            
            const cleanUrl = `${window.location.origin}/s?${essentialParams.toString()}`;
            
            if (cleanUrl !== currentUrl) {
                log('Updating search URL to:', cleanUrl);
                window.history.replaceState({}, document.title, cleanUrl);
            }
        }
    }

    // Add a visual indicator when URL is cleaned
    function showCleanedNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #232f3e;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        `;
        notification.textContent = 'URL Cleaned ✓';
        document.body.appendChild(notification);

        // Show and hide the notification
        setTimeout(() => {
            notification.style.opacity = '1';
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 2000);
        }, 100);
    }

    // Clean URL on page load
    cleanAmazonUrl();
    showCleanedNotification();

    // Handle dynamic navigation
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && 
                (mutation.target.id === 'dp' || 
                 mutation.target.id === 'search' ||
                 mutation.target.id === 'productDetails')) {
                cleanAmazonUrl();
                showCleanedNotification();
                break;
            }
        }
    });

    // Start observing with optimized configuration
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // Add keyboard shortcut to manually clean URL (Ctrl+Shift+C)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            cleanAmazonUrl();
            showCleanedNotification();
        }
    });
})();
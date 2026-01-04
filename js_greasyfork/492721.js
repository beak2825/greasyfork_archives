// ==UserScript==
// @name         onlyfaucet.com
// @namespace    only auto
// @version      0.55
// @description  auto claim faucet
// @author       gi2h
// @run-at       document-start
// @match        https://onlyfaucet.com/
// @match        https://onlyfaucet.com/faucet/currency/*
// @match        https://onlyfaucet.com/*
// @match        https://onlyfaucet.com/?r=12211
// @match        https://onlyfaucet.com/?r=
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freeltc.fun
// @downloadURL https://update.greasyfork.org/scripts/492721/onlyfaucetcom.user.js
// @updateURL https://update.greasyfork.org/scripts/492721/onlyfaucetcom.meta.js
// ==/UserScript==

setInterval(function() {
    let c = document.querySelector("#subbutt") || document.querySelector("body > div.faucet-div.cl > form > div > input[type=submit]");

    // Check if on a specific URL and click the button
    if (c) {
        c.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Scroll to the button smoothly
        setTimeout(() => {
            c.click(); // Click the button after scrolling
        }, 300); // Wait for a brief moment before clicking
    }

    // Check for the modal containing the Shortlink message
    let m = document.querySelector("#swal2-html-container");
    if (m && m.innerText.includes('You must complete at least 1 Shortlink to continue.')) {
        location.href = 'https://onlyfaucet.com/links/go/93/LTC';
        return; // Exit the interval after redirection
    }

    // New logic for checking the URL and managing the query parameters
    const check_address = 'https://onlyfaucet.com'; // Base address for checking
    if (window.location.href == check_address ||
        window.location.href == (check_address + '/') ||
        window.location.href == (check_address + '/index.php')) {

        setTimeout(function() {
            if (location.search !== '?r=12211') {
                location.search = '?r=12211'; // Update the query string to include your referral
            }
        }, 2000);
    }

    if (location.search == '?r=12211') {
        setTimeout(function() {
            let button = document.querySelector('button[data-target="#login"]'); // Changed target to "login"
            if (button) {
                button.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Scroll to the login button smoothly
                setTimeout(() => {
                    button.click(); // Click the login button after scrolling
                }, 300); // Wait for a brief moment before clicking
            }
            setTimeout(function() {
                window.location.reload(); // Reload the page after 60 seconds
            }, 60000);
        }, 3000);
    }

}, 9000);

// Function to remove ads
(function() {
    'use strict';
    // Monitor DOM changes to remove dynamic ads
    let observer = new MutationObserver(removeAds);
    observer.observe(document.body, { childList: true, subtree: true });

    // Common ad-related selectors
    const adSelectors = [
        'iframe', // Removes iframes (commonly used for ads)
        '.ad', // Class 'ad'
        '.adsbygoogle', // Google ads
        '[id^="ad"]', // IDs starting with 'ad'
        '[class*="ad"]', // Any class containing 'ad'
        '.banner', // Banner ads
        '.sponsor', // Sponsored ads
        '.popup', // Pop-up ads
        '.advertisement' // Elements with 'advertisement' class
    ];

    // Function to remove elements by selector
    function removeAds() {
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(adElement => adElement.remove());
        });
        console.log('Ads removed');
    }

    // Run the function initially
    removeAds();
})();

 (function() {
    // Define the BoostTimers function
    function BoostTimers() {
        const FsT = window.setTimeout;
        const FsI = window.setInterval;
        Object.defineProperty(window, 'setTimeout', {
            value: function(func, delay) {
                if (delay === 1000) { delay = 50; }
                return FsT.apply(this, arguments);
            }
        });
        Object.defineProperty(window, 'setInterval', {
            value: function(func, delay) {
                if (delay === 1000) { delay = 50; }
                return FsI.apply(this, arguments);
            }
        });
    }

    // Always apply BoostTimers
    BoostTimers();
})();

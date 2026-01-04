// ==UserScript==
// @name         altcryp.com
// @namespace    altcript auto
// @version      0.1
// @description  auto claim faucet
// @author       gi2h
// @run-at       document-start
// @match        https://altcryp.com/
// @match        https://altcryp.com/faucet/currency/*
// @match        https://altcryp.com/*
// @match        https://altcryp.com/?r=25754
// @match        https://altcryp.com/?r=
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=altcrypt.com
// @downloadURL https://update.greasyfork.org/scripts/512666/altcrypcom.user.js
// @updateURL https://update.greasyfork.org/scripts/512666/altcrypcom.meta.js
// ==/UserScript==

setInterval(function() {
    location.reload();
}, 60000);
setInterval(function() {
    // New logic for checking the URL and managing the query parameters
    const check_address =
        'https://onlyfaucet.com'; // Base address for checking
    if (window.location.href ==
        check_address ||
        window.location.href ==
        (check_address + '/') ||
        window.location.href ==
        (check_address +
            '/index.php')) {
        setTimeout(function() {
            if (location
                .search !==
                '?r=25754'
                ) {
                location
                    .search =
                    '?r=25754'; // Update the query string to include your referral
            }
        }, 2000);
    }
    if (location.search ==
        '?r=25754') {
        setTimeout(function() {
            let button =
                document
                .querySelector(
                    'button[data-target="#login"]'
                    ); // Changed target to "login"
            if (
                button) {
                button
                    .scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    }); // Scroll to the login button smoothly
                setTimeout
                    (() => {
                            button
                                .click(); // Click the login button after scrolling
                        },
                        300
                        ); // Wait for a brief moment before clicking
            }
            setTimeout(
                function() {
                    window
                        .location
                        .reload(); // Reload the page after 60 seconds
                },
                60000
                );
        },
        3000); // Ensure the timing is appropriate for other operations
    }
    const swalContent = document
        .getElementById(
            "swal2-content") ||
        document.querySelector(
            "#swal2-html-container"
            ) ||
        document.querySelector(
            "#content > div.layout-px-spacing > div > div.col-12.col-md-8.col-lg-6.order-md-2.mb-4.text-center > center > div > div:nth-child(2) > div"
            ) ||
        document.querySelector(
            "#content > div > div:nth-child(2) > div > div.alert.alert-danger.text-center"
            ) ||
        document.querySelector(
            "body > div.swal2-container.swal2-center.swal2-backdrop-show > div"
            ) ||
        document.querySelector(
            "#content > div.layout-px-spacing > div.row > div.col-12.col-md-8.col-lg-6.order-md-2.mb-4.text-center > div.row > div:nth-child(2) > div.alert.alert-danger.text-center"
            );
    const successMessage =
        swalContent &&
        (swalContent.innerText
            .includes(
                " has been sent to your FaucetPay account!"
                ) ||
            swalContent
            .innerText.includes(
                " has been added to your Main account!"
                ) ||
            swalContent
            .innerText.includes(
                "The faucet does not have sufficient funds for this transaction."
                ) ||
            swalContent
            .innerText.includes(
                'Daily claim limit for this coin reached, please comeback again tomorrow.'
                ) ||
            swalContent
            .innerText.includes(
                "You have been rate-limited"
                ));
    // Define the order of currencies on FreeLTC with a source site map
    const sites = [{
            url: "https://altcryp.com/faucet/currency/ltc",
            next: "https://altcryp.com/faucet/currency/bnb"
        },
        {
            url: "https://altcryp.com/faucet/currency/bnb",
            next: "https://altcryp.com/faucet/currency/doge"
        },
        {
            url: "https://altcryp.com/faucet/currency/doge",
            next: "https://altcryp.com/faucet/currency/usdt"
        },
        {
            url: "https://altcryp.com/faucet/currency/usdt",
            next: "https://altcryp.com/faucet/currency/sol"
        },
        {
            url: "https://altcryp.com/faucet/currency/sol",
            next: "https://altcryp.com/faucet/currency/dgb"
        },
        {
            url: "https://altcryp.com/faucet/currency/dgb",
            next: "https://altcryp.com/faucet/currency/bch"
        },
        {
            url: "https://altcryp.com/faucet/currency/bch",
            next: "https://altcryp.com/faucet/currency/dash"
        },
        {
            url: "https://altcryp.com/faucet/currency/dash",
            next: "https://altcryp.com/faucet/currency/trx"
        },
        {
            url: "https://altcryp.com/faucet/currency/trx",
            next: "https://altcryp.com/faucet/currency/zec"
        },
        {
            url: "https://altcryp.com/faucet/currency/zec",
            next: "https://altcryp.com/faucet/currency/xrp"
        },
        {
            url: "https://altcryp.com/faucet/currency/xrp",
            next: "https://altcryp.com/faucet/currency/matic"
        },
        {
            url: "https://altcryp.com/faucet/currency/matic",
            next: "https://altcryp.com/faucet/currency/ton"
        },
        {
            url: "https://altcryp.com/faucet/currency/ton",
            next: "https://altcryp.com/faucet/currency/shib"
        },
        {
            url: "https://altcryp.com/faucet/currency/shib",
            next: "https://altcryp.com/faucet/currency/pepe"
        },
        {
            url: "https://altcryp.com/faucet/currency/pepe",
            next: "https://altcryp.com/faucet/currency/btc"
        },
        {
            url: "https://altcryp.com/faucet/currency/btc",
            next: "https://altcryp.com/faucet/currency/ltc"
        },
    ];
    const currentSite = sites
        .find(site => window
            .location.href ===
            site.url);
    if (currentSite &&
        successMessage) {
        location.replace(
            currentSite.next
            );
    }
}, 3000);
setInterval(function() {
    'use strict';
    let veryf = document
        .querySelector(
            "#content > div.layout-px-spacing > div.row.text-center.layout-top-spacing > div > div > div > form > div > button"
            );
    let turnstileResponse =
        document.querySelector(
            "input[name='cf-turnstile-response']"
            );
    if (veryf &&
        turnstileResponse &&
        turnstileResponse.value
        .length > 0) {
        veryf.click();
    }
    // Scroll to the submit button for Turnstile and check if ready to submit
    let submitButton = document
        .querySelector(
            "#subbutt");
    if (submitButton) {
        submitButton
            .scrollIntoView({
                behavior: 'smooth'
            });
    }
    if (submitButton &&
        turnstileResponse &&
        turnstileResponse.value
        .length > 0) {
        if (!submitButton
            .disabled) {
            submitButton
        .click(); // Click the claim button
            submitButton
                .disabled =
                true;
        }
    }
    // If the element is not found after 30 seconds, refresh the page
    setTimeout(function() {
        let turnstileResponse =
            document
            .querySelector(
                "input[name='cf-turnstile-response']"
                );
        if (!
            turnstileResponse
            ) {
            console.log(
                'Elemen cf-turnstile-response tidak ditemukan dalam waktu 30 detik, me-refresh halaman...'
                );
            location
                .reload(); // Refresh the page if the element is not present
        }
    },
    30000); // 30 seconds timeout
}, 3000);
(function() {
    'use strict';
    // Monitor DOM changes to remove dynamic ads
    let observer =
        new MutationObserver(
            removeAds);
    observer.observe(document
    .body, {
        childList: true,
        subtree: true
    });
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
        adSelectors.forEach(
            selector => {
                document
                    .querySelectorAll(
                        selector
                        )
                    .forEach(
                        adElement =>
                        adElement
                        .remove()
                        );
            });
        console.log('Ads removed');
    }
    // Run the function initially
    removeAds();
})();
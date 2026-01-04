// ==UserScript==
// @name         Near Block Explorer URL Rewriter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Rewrite Near Explorer URLs to Near Blocks URLs when coming from https://app.mynearwallet.com/
// @author       You
// @match        *://explorer.mainnet.near.org/accounts/*
// @match        *://explorer.mainnet.near.org/transactions/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472364/Near%20Block%20Explorer%20URL%20Rewriter.user.js
// @updateURL https://update.greasyfork.org/scripts/472364/Near%20Block%20Explorer%20URL%20Rewriter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if the referring URL is https://app.mynearwallet.com/
    function isFromMyNearWallet() {
        return document.referrer.startsWith("https://app.mynearwallet.com/");
    }

    // Function to replace the URL part for accounts and transactions
    function replaceURL() {
        // Get the current URL
        let currentURL = window.location.href;

        // Check if the referring URL is https://app.mynearwallet.com/
        if (isFromMyNearWallet()) {
            // Check if it's an account URL
            if (currentURL.includes("explorer.mainnet.near.org/accounts/")) {
                // Replace the part of the URL
                let newURL = currentURL.replace("explorer.mainnet.near.org/accounts/", "nearblocks.io/address/");
                // Redirect to the new URL
                window.location.replace(newURL);
            }

            // Check if it's a transaction URL
            if (currentURL.includes("explorer.mainnet.near.org/transactions/")) {
                // Replace the part of the URL
                let newURL = currentURL.replace("explorer.mainnet.near.org/transactions/", "nearblocks.io/txns/");
                // Redirect to the new URL
                window.location.replace(newURL);
            }
        }
    }

    // Call the function to replace the URL
    replaceURL();

})();

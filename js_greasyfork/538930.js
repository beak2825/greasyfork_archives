// ==UserScript==
// @name         Gemini - Force Specific Account (e.g., Pro)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Forces Gemini to always use a specific Google Account, perfect for ensuring you're always on your profile with a subscription (e.g., Gemini Advanced) when logged into multiple accounts. This script REQUIRES configuration to work.
// @author       PeterDevCoding
// @match        https://gemini.google.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538930/Gemini%20-%20Force%20Specific%20Account%20%28eg%2C%20Pro%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538930/Gemini%20-%20Force%20Specific%20Account%20%28eg%2C%20Pro%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- REQUIRED CONFIGURATION ---
    // You MUST set your desired Google Account here for the script to work.
    // Enter the authuser number (e.g., '0' for your default account, '1' for the second, typically from 0-9)
    // or your full email address.
    const REQUIRED_AUTH_USER = ''; // IMPORTANT: SET YOUR VALUE HERE, e.g., 'your.pro.email@gmail.com' or '1'
    // ------------------------------


    // --- How it Works & Why ---
    // The main goal of this script is to solve the common issue of Google defaulting to the wrong
    // account when you have multiple accounts logged in. By setting your "Pro" or main account above,
    // you ensure you always land on your desired profile with its active subscription.
    //
    // While built for Gemini, this logic could theoretically be adapted for other Google products
    // that use the `?authuser=` parameter for account switching.
    // --------------------------


    // Stop immediately if the user has not configured the script.
    if (!REQUIRED_AUTH_USER) {
        console.error('Gemini Force Account Script: Please edit the script and set your REQUIRED_AUTH_USER variable.');
        return;
    }

    const redirectAttemptedKey = 'geminiForceAccountRedirectAttempted';
    const currentPath = window.location.pathname;
    const currentParams = new URLSearchParams(window.location.search);

    // Check if we are already on the correct user account. If so, do nothing.
    if (currentParams.get('authuser') === REQUIRED_AUTH_USER.toString()) {
         sessionStorage.removeItem(redirectAttemptedKey); // Clear flag if we land on the correct URL
         return;
    }

    // STEP 1: Extract the chat ID from the current URL, if it exists
    let chatId = '';
    const appIndex = currentPath.indexOf('/app/');
    if (appIndex !== -1) {
        chatId = currentPath.substring(appIndex + 5).replace(/\/$/, ''); // Get ID and remove trailing slash
    }

    // STEP 2: Construct the ideal URL path
    let idealPath;
    if (chatId) {
        idealPath = `/app/${chatId}`;
    } else if (currentPath.includes('/app') || currentPath === '/') {
        // Redirect to the main app page if we are on any /app URL or the root.
        idealPath = '/app';
    } else {
        return; // Do not act on unknown pages
    }

    // STEP 3: Build the final URL with the FORCED user
    const idealUrl = `https://gemini.google.com${idealPath}?authuser=${REQUIRED_AUTH_USER}`;

    // STEP 4: Compare and decide whether to redirect
    if (window.location.href === idealUrl) {
        return;
    }

    if (sessionStorage.getItem(redirectAttemptedKey)) {
        console.warn('Gemini Force Account Script: Redirect already attempted. Halting to prevent a loop.');
        return;
    }

    console.log(`Gemini Script: Forcing account "${REQUIRED_AUTH_USER}"...`);
    console.log(`Redirecting from: ${window.location.href}`);
    console.log(`Redirecting to:   ${idealUrl}`);

    sessionStorage.setItem(redirectAttemptedKey, 'true');
    window.location.href = idealUrl;

})();

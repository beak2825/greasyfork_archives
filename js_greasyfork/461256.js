// ==UserScript==
// @name         Website Blocker with Password Protection
// @namespace    http://tampermonkey.net/
// @version      1.4
// @license      MIT
// @description  Block access to specific websites with password protection
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/461256/Website%20Blocker%20with%20Password%20Protection.user.js
// @updateURL https://update.greasyfork.org/scripts/461256/Website%20Blocker%20with%20Password%20Protection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PASSWORDS = ["RedPeach9002!", "Charles17578!"]; // Set the passwords here
    const ERROR_PAGE = "https://example.com/error.html"; // Set the custom error page URL here
    const BLOCKED_URLS = [
        {
            url: "https://classroom.google.com/",
            message: "Enter the password to access Google Classroom"
        },
        {
            url: "https://hac20.esp.k12.ar.us/",
            message: "Enter the password to access Hac20"
        },
        {
            url: "https://www.youtube.com/",
            message: "Enter the password to access YouTube"
        },
        {
            url: "https://docs.google.com/",
            message: "Enter the password to access Google Docs"
        },
        {
            url: "https://clever.discoveryeducation.com/",
            message: "Enter the password to access Clever"
        },
        {
            url: "https://www.desmos.com/",
            message: "Enter the password to access Desmos"
        },
        {
            url: "https://chrome.google.com/webstore/detail/prodigy-hacking-extension/cddgplffojbmjffebkmngmmlhkkhfibp",
            message: "Enter the password to access Prodigy Hacks"
        }
    ];
    const PASSWORD_CACHE_TIME = 300 * 1000; // Password cache time in milliseconds (5 minutes)

    const currentPage = window.location.href;
    let isBlocked = false;
    let message = "";

    // Check if the current URL is blocked
    for (let i = 0; i < BLOCKED_URLS.length; i++) {
        const blockedUrl = BLOCKED_URLS[i];
        if (currentPage.startsWith(blockedUrl.url)) {
            isBlocked = true;
            message = blockedUrl.message;
            break;
        }
    }

    if (isBlocked) {
        const cachedPassword = GM_getValue("password_cache", {});
        if (currentPage in cachedPassword && (Date.now() - cachedPassword[currentPage].time) < PASSWORD_CACHE_TIME) {
            // Password is cached and not expired, continue to website
            return;
        }

        let passwordAttempts = 0;
        while (passwordAttempts < 3) {
            const password = prompt(message);
            if (password === null) {
                // User clicked "cancel" or pressed escape, redirect to homepage
                window.location.href = "https://www.google.com";
                return;
            } else if (PASSWORDS.includes(password)) {
                // Cache the password for this page
                cachedPassword[currentPage] = {password: password, time: Date.now()};
                GM_setValue("password_cache", cachedPassword);
                return;
            } else {
                passwordAttempts++;
                alert("Incorrect password. " + (3 - passwordAttempts) + " attempts remaining.");
            }
        }

        // Redirect to custom error page with message
        window.location.href = ERROR_PAGE + "?message=Incorrect password";
    }
})();
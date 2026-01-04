// ==UserScript==
// @name         Impersonate Localhosts
// @namespace    http://tampermonkey.net/
// @version      2025-04-28
// @description  Impersonate localhosts
// @author       hunterwilhelm
// @match        https://dashboard.workos.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=workos.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534294/Impersonate%20Localhosts.user.js
// @updateURL https://update.greasyfork.org/scripts/534294/Impersonate%20Localhosts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Intercept window.open to provide user choice
    const originalOpen = window.open;
    window.open = function(...args) {
        if (args[0] && args[0].includes("?code=") || args[0].includes("?context=")) {
            const url = new URL(args[0]);
            const localhostUrl = `http://localhost:3300${url.pathname}${url.search}`;
            const userChoice = prompt(
                `Choose an option:
1: Continue as normal
2: Copy og and block navigation (or cancel)
3: Redirect to localhost
4: Copy localhost URL and block`,
                "1"
            );
            if (userChoice === "1") {
                return originalOpen.apply(this, args); // Continue as normal
            }
             else if (userChoice === "2") {
                navigator.clipboard.writeText(url).then(() => {
                    alert("Original URL copied to clipboard!");
                }).catch(err => {
                    console.error("Failed to copy URL: ", err);
                });
                return; // Block navigation
            } else if (userChoice === "3") {
                navigator.clipboard.writeText(localhostUrl).then(() => {
                    alert("Localhost URL copied to clipboard!");
                }).catch(err => {
                    console.error("Failed to copy URL: ", err);
                });
                args[0] = localhostUrl;
                return originalOpen.apply(this, args);
            } else if (userChoice === "4") {
                navigator.clipboard.writeText(localhostUrl).then(() => {
                    alert("Localhost URL copied to clipboard!");
                }).catch(err => {
                    console.error("Failed to copy URL: ", err);
                });
                return; // Block navigation after copying
            }
        } else {
            return originalOpen.apply(this, args);
        }
    };
})();
// ==UserScript==
// @name         Bypass t.forasm.com redirect
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Bypass the redirect for t.forasm.com links
// @author       wisp
// @license      MIT
// @runat        document-start
// @match        *://t.forasm.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524447/Bypass%20tforasmcom%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/524447/Bypass%20tforasmcom%20redirect.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("[FastExtractor] Script started.");

    // Try direct extraction early
    function extractDirectly() {
        const anchorTag = document.querySelector('#wpsafe-link a[onclick]');
        if (anchorTag) {
            const onclickContent = anchorTag.getAttribute('onclick');
            const urlMatch = onclickContent?.match(/window\.open\('(.*?)', '_self'\)/);
            if (urlMatch && urlMatch[1]) {
                console.log("[FastExtractor] Final URL extracted early:", urlMatch[1]);
                window.location.href = urlMatch[1];
                return true; // Exit early
            }
        }
        return false; // Continue monitoring
    }

    // Observe DOM changes for the button
    function observeDOM(selector, callback) {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                const targetElement = document.querySelector(selector);
                if (targetElement) {
                    observer.disconnect(); // Stop observing once found
                    callback(targetElement);
                    break;
                }
            }
        });

        observer.observe(targetNode, config);
    }

    // Start process
    if (!extractDirectly()) {
        observeDOM('#wpsafe-link a[onclick]', (element) => {
            console.log("[FastExtractor] Found target element via observer:", element);
            const onclickContent = element.getAttribute('onclick');
            const urlMatch = onclickContent.match(/window\.open\('(.*?)', '_self'\)/);
            if (urlMatch && urlMatch[1]) {
                console.log("[FastExtractor] Redirecting to:", urlMatch[1]);
                window.location.href = urlMatch[1];
            }
        });
    }
})();

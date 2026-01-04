// ==UserScript==
// @name         Jira URL Link Cleaner (Show Filename)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace link text in Jira with just the filename, but preserve the full clickable URL.
// @match        https://configura.atlassian.net/*
// @grant        none
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/534978/Jira%20URL%20Link%20Cleaner%20%28Show%20Filename%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534978/Jira%20URL%20Link%20Cleaner%20%28Show%20Filename%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Regex for URL-like links (we could filter by domain too if needed)
    const urlRegex = /^(https?|ftp|file):\/\/[^\s<>"']+$/i;

    function getFilenameFromUrl(url) {
        try {
            const cleanUrl = new URL(url);
            const segments = cleanUrl.pathname.split('/');
            const filename = segments.pop() || segments.pop(); // handle trailing slash
            //return `https://../${filename}`;
          return filename;
        } catch (e) {
            return url;
        }
    }

    function simplifyAnchorText(root) {
        const anchors = root.querySelectorAll('a[href]');
        anchors.forEach(anchor => {
            const href = anchor.getAttribute('href');
            const currentText = anchor.textContent.trim();

            // Only change if the text == href or starts with href
            if (href && currentText === href && urlRegex.test(href)) {
                anchor.textContent = getFilenameFromUrl(href);
            }
        });
    }

    function run() {
        const root = document.querySelector('#ak-main-content') || document.body;
        simplifyAnchorText(root);
    }

    // Run initially
    run();

    // Watch for dynamic Jira updates
    const observer = new MutationObserver(run);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

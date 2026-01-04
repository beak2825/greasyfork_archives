// ==UserScript==
// @name         FMHY URL Checker
// @namespace    https://fmhy.net/
// @version      1.1
// @description  Checks if the visited URL is in the wiki or not
// @author       godamnit
// @icon         https://raw.githubusercontent.com/fmhy/FMHYedit/main/docs/public/fmhy.ico
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500200/FMHY%20URL%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/500200/FMHY%20URL%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const markdownUrl = "https://api.fmhy.net/single-page";
    let fetchedUrls = [];

    // Add styles for the tick and cross icons
    GM_addStyle(`
        #url-checker-icon {
            position: fixed;
            right: 0;
            top: 0;
            z-index: 1000;
            width: 20px;
            height: 20px;
            margin: 8px;
        }
    `);

    // Create the icon element
    const icon = document.createElement('img');
    icon.id = 'url-checker-icon';
    document.body.appendChild(icon);

    // Function to fetch URLs from a Markdown file
    async function fetchURLs(markdownUrl) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: markdownUrl,
                onload: function(response) {
                    if (response.status === 200) {
                        const urls = parseUrlsFromMarkdown(response.responseText);
                        resolve(urls);
                    } else {
                        reject(new Error(`Failed to fetch URLs: ${response.status} ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`Request error: ${error}`));
                }
            });
        });
    }

    // Function to parse URLs from markdown text
    function parseUrlsFromMarkdown(markdownText) {
        const regex = /\]\((https?:\/\/.*?)\)/g;
        let urls = [];
        let match;

        while ((match = regex.exec(markdownText)) !== null) {
            let url = match[1].trim();
            urls.push(url);
        }

        return urls;
    }

    // Function to check URL against fetched URLs and update icon
    function checkTabUrl(tabUrl) {
        let found = fetchedUrls.some(url => tabUrl === url.toLowerCase());
        if (found) {
            icon.src = 'https://raw.githubusercontent.com/fmhy/FMHYedit/main/docs/public/fmhy.ico';
        } else {
            icon.src = 'data:image/png;base64,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';
        }
        icon.style.display = 'block';
    }

    // Function to initialize script
    async function initializeScript() {
        try {
            fetchedUrls = await fetchURLs(markdownUrl);
            checkTabUrl(window.location.href.toLowerCase());

            // Listen for URL changes
            window.addEventListener('popstate', function() {
                checkTabUrl(window.location.href.toLowerCase());
            });
            window.addEventListener('hashchange', function() {
                checkTabUrl(window.location.href.toLowerCase());
            });
        } catch (error) {
            console.error("Initialization error:", error);
        }
    }

    // Initialize the script
    initializeScript();
})();


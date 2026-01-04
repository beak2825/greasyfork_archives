// ==UserScript==
// @name         Copy Real Link
// @version      1.3
// @namespace    https://greasyfork.org/en/scripts/482987-copy-real-link
// @license      CC BY
// @description  Extract and copy real URLs from redirect URLs on Google, Fb, etc., with a copy button.
// @author       almahmud & gpt
// @match        *://www.google.*/*search*
// @match        *://search.yahoo.com/*
// @match        *://*.facebook.com/*
// @match        *://hangouts.google.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/482987/Copy%20Real%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/482987/Copy%20Real%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const createCopyButton = (url) => {
        const button = document.createElement('button');
        button.style.position = 'absolute';
        button.style.zIndex = '1000';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.padding = '5px 10px';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';

        // SVG icon
        const svgIcon = `<svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.975 14.51a1.05 1.05 0 0 0 0-1.485 2.95 2.95 0 0 1 0-4.172l3.536-3.535a2.95 2.95 0 1 1 4.172 4.172l-1.093 1.092a1.05 1.05 0 0 0 1.485 1.485l1.093-1.092a5.05 5.05 0 0 0-7.142-7.142L9.49 7.368a5.05 5.05 0 0 0 0 7.142c.41.41 1.075.41 1.485 0zm2.05-5.02a1.05 1.05 0 0 0 0 1.485 2.95 2.95 0 0 1 0 4.172l-3.5 3.5a2.95 2.95 0 1 1-4.171-4.172l1.025-1.025a1.05 1.05 0 0 0-1.485-1.485L3.87 12.99a5.05 5.05 0 0 0 7.142 7.142l3.5-3.5a5.05 5.05 0 0 0 0-7.142 1.05 1.05 0 0 0-1.485 0z" fill="#000000"/></svg>`;
        
        button.innerHTML = `${svgIcon} Copy Real Link`; // Add icon and text

        button.onclick = () => {
            GM_setClipboard(url); // Copy to clipboard
            button.textContent = 'Copied!'; // Update button text to indicate success
            setTimeout(() => button.remove(), 2000); // Remove button after a short delay
        };

        return button;
    };

    document.addEventListener('contextmenu', function(event){
        let target = event.target;

        // Check if the right-clicked element is a link
        if (target.tagName === 'A' && target.href) {
            let url = target.href;
            let testRE;

            // Define the regular expressions for each website
            if (document.URL.match("http(s|)://www.google")) {
                testRE = url.match("url=([^&]*)&");
            } else if (document.URL.match("http(s|)://mail.google")) {
                testRE = url.match("url\\?q=([^&]*)&");
            } else if (document.URL.match("http(s|)://www.facebook")) {
                testRE = url.match("u=([^&]*)&");
            } else if (document.URL.match("http(s|)://web.facebook")) {
                testRE = url.match("u=([^&]*)&");
            } else if (document.URL.match("http(s|)://.*search.yahoo")) {
                testRE = url.match("RU=([^/]*)/");
            }

            // Decode the URL if a match is found
            if (testRE) {
                let realURL = decodeURIComponent(testRE[1]);

                // Create and position the copy button
                const button = createCopyButton(realURL);
                document.body.appendChild(button);
                const rect = target.getBoundingClientRect();
                button.style.top = `${rect.top + window.scrollY}px`;
                button.style.left = `${rect.right + window.scrollX + 5}px`;
                
                // Show the default context menu
                setTimeout(() => {
                    button.remove();
                }, 2000); // Remove button after a short delay
            }
        }
    });
})();

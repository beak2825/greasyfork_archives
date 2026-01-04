// ==UserScript==
// @name         tgWebAppData
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  复制tgWebAppData
// @match        *://*.telegram.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508369/tgWebAppData.user.js
// @updateURL https://update.greasyfork.org/scripts/508369/tgWebAppData.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let button = null; // To hold the button element

    // Function to create and insert the copy button
    function createCopyButton(src) {
        // Check if the button already exists
        if (button) {
            return;
        }

        // Create button element
        button = document.createElement('button');
        button.id = 'copyTgWebAppDataBtn';
        button.innerText = '复制 tgWebAppData';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.padding = '10px';
        button.style.backgroundColor = '#007BFF'; // Blue color
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '10000'; // High z-index to ensure it's on top
        button.style.fontSize = '16px'; // Font size

        // Append button to the body
        document.body.appendChild(button);

        // Add click event to copy the formatted src value
        button.addEventListener('click', () => {
            // Extract parameters from src and format them
            const formattedData = extractTgWebAppData(src);
            navigator.clipboard.writeText(formattedData).then(() => {
                alert('tgWebAppData 复制成功!');
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }

    // Function to remove the copy button
    function removeCopyButton() {
        if (button) {
            button.remove();
            button = null;
        }
    }

    // Function to handle iframe visibility and button actions
    function handleIframes() {
        const iframes = document.querySelectorAll('iframe.zA1w1IOq');
        if (iframes.length > 0) {
            // Extract the src attribute value from the first matching iframe
            const src = iframes[0].src;
            const tgWebAppData = extractTgWebAppData(src);

            // Check if tgWebAppData contains "query_id"
            if (tgWebAppData.includes('query_id')) {
                createCopyButton(src);
            } else {
                removeCopyButton();
            }
        } else {
            removeCopyButton();
        }
    }

    // Function to extract tgWebAppData parameter without decoding
    function extractTgWebAppData(src) {
        const params = new URL(src).hash.substring(1); // Remove the leading '#'
        const dataParams = new URLSearchParams(params);
        const tgWebAppData = dataParams.get('tgWebAppData');
        return tgWebAppData ? tgWebAppData : 'No tgWebAppData found';
    }

    // Use MutationObserver to handle dynamically loaded iframes
    const observer = new MutationObserver(() => {
        handleIframes();
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check when the page loads
    window.addEventListener('load', handleIframes);
})();

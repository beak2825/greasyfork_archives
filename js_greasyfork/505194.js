// ==UserScript==
// @name         Copy Lyrics with Button
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add a button to copy lyrics to clipboard with newlines between specific DIV elements, only if search query contains "lyrics" and target element exists, on Google search pages.
// @author       Your Name
// @match        *://www.google.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505194/Copy%20Lyrics%20with%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/505194/Copy%20Lyrics%20with%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Lyrics copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy lyrics: ', err);
        });
    }

    // Function to create and insert the button
    function addCopyButton() {
        const buttonHTML = `
            <button class="copy-lyrics-button" style="
                position: fixed;
                left: 10px;
                top: 200px;
                margin-bottom: 10px;
                padding: 5px 10px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                z-index: 1000;
            ">
                Copy Lyrics
            </button>
        `;

        // Insert the button into the page
        document.body.insertAdjacentHTML('beforeend', buttonHTML);

        // Add event listener to the button
        document.querySelector('.copy-lyrics-button').addEventListener('click', () => {
            const parentElementId = 'kp-wp-tab-default_tab:kc:/music/recording_cluster:lyrics';
            const parentElement = document.getElementById(parentElementId);

            if (parentElement) {
                const divs = parentElement.querySelectorAll('div[jsname="U8S5sf"]');
                let lyricsText = '';

                divs.forEach(div => {
                    // Collect text from each DIV with jsname="U8S5sf"
                    const spans = div.querySelectorAll('span');
                    spans.forEach(span => {
                        lyricsText += span.innerText.trim() + '\n'; // Add newline after each SPAN
                    });

                    // Add an extra newline after each DIV
                    lyricsText += '\n';
                });

                // Copy to clipboard only if there is text to copy
                if (lyricsText.trim()) {
                    copyToClipboard(lyricsText.trim());
                } else {
                    console.log('No text found in the nested DIVs.');
                }
            } else {
                console.log('Target element not found.');
            }
        });
    }

    // Function to check for URL and target element
    function checkConditions() {
        const searchQuery = new URL(window.location.href).searchParams.get('q') || '';
        const targetElementId = 'kp-wp-tab-default_tab:kc:/music/recording_cluster:lyrics';

        if (searchQuery.toLowerCase().includes('lyrics') && document.getElementById(targetElementId)) {
            addCopyButton(); // Add button if conditions are met
        }
    }

    // Continuously check for conditions and add the button when appropriate
    function monitorPage() {
        const interval = setInterval(() => {
            if (document.readyState === 'complete') {
                checkConditions();
                clearInterval(interval); // Stop checking once the conditions are met
            }
        }, 500); // Check every 500ms (adjust as needed)
    }

    // Start monitoring the page
    monitorPage();
})();

// ==UserScript==
// @name         Vimm's Lair: Re-add Download & Play Online Buttons, Remove Takedown Text
// @version      1.7
// @description  Restores missing Download and Play Online buttons and removes takedown text on Vimm's Lair.
// @author       DarkSamus
// @match        https://vimm.net/vault/*
// @grant        none
// @license      CC-BY-NC-SA-4.0
// @namespace    https://greasyfork.org/users/1418083
// @downloadURL https://update.greasyfork.org/scripts/522451/Vimm%27s%20Lair%3A%20Re-add%20Download%20%20Play%20Online%20Buttons%2C%20Remove%20Takedown%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/522451/Vimm%27s%20Lair%3A%20Re-add%20Download%20%20Play%20Online%20Buttons%2C%20Remove%20Takedown%20Text.meta.js
// ==/UserScript==

/*
 * Copyright (c) 2024 DarkSamus
 *
 * Profile: https://greasyfork.org/en/users/1418083-darksamus
 *
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0).
 * You are free to:
 * - Share: copy and redistribute the material in any medium or format.
 * - Adapt: remix, transform, and build upon the material.
 *
 * Under the following terms:
 * - Attribution: You must give appropriate credit, provide a link to the license, and indicate if changes were made.
 * - NonCommercial: You may not use the material for commercial purposes.
 * - ShareAlike: If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.
 *
 * License details: https://creativecommons.org/licenses/by-nc-sa/4.0/
 */

/*
 * Acknowledgments:
 * This script is adapted from an anonymous source with help from ChatGPT.
 */

(function () {
    'use strict';

    // Function to re-add the download button
    function addDownloadButton() {
        const downloadForm = document.querySelector('#dl_form');
        if (!downloadForm) {
            console.error('Download form not found');
            return;
        }

        // Check if the button is already added
        if (!downloadForm.querySelector('button[type="submit"]')) {
            downloadForm.insertAdjacentHTML('beforeend', '<button type="submit">Download</button>');
            console.log('Download button re-added.');
        }
    }

    // Function to check if the "Play Online" button already exists
    function isPlayButtonExists() {
        const buttons = document.querySelectorAll('button');
        for (let button of buttons) {
            if (button.innerText.includes("Play Online") || button.onclick?.toString().includes("location.href='/vault/?p=play&mediaId=")) {
                return true; // Button already exists
            }
        }
        return false; // No button found
    }

    // Function to re-add the Play Online button
    function addPlayOnlineButton() {
        if (isPlayButtonExists()) {
            console.log('Play Online button already exists.');
            return; // Exit if the Play Online button already exists
        }

        // Find the parent container where the download button is located
        const downloadForm = document.querySelector('#dl_form');
        if (!downloadForm) {
            console.error('Download form not found');
            return;
        }

        // Create new "Play Online" button
        const playButton = document.createElement('button');
        playButton.type = 'button';
        playButton.innerText = 'Play Online';
        playButton.title = 'Play Online';

        // Attach event listener to button
        playButton.onclick = function () {
            const mediaId = document.querySelector('input[name="mediaId"]').value;
            location.href = '/vault/?p=play&mediaId=' + mediaId;
        };

        // Style the button (adjust styles as needed)
        playButton.style.width = 'auto';  // Adjust width to auto for a more reasonable size
        playButton.style.marginTop = '12px';
        playButton.style.display = 'block'; // Ensure the button is displayed as a block (stacked below)
        playButton.style.marginLeft = 'auto';
        playButton.style.marginRight = 'auto';  // Center the button horizontally

        // Insert the "Play Online" button right after the "Download" button
        downloadForm.appendChild(playButton);
        console.log('Play Online button re-added.');
    }

    // Function to remove specific sentences
    function removeUnavailableText() {
        const regex = /^Download unavailable at the request of.*$/;

        // Check all text nodes in the body
        document.querySelectorAll('body *').forEach((element) => {
            if (element.childNodes.length) {
                element.childNodes.forEach((node) => {
                    if (node.nodeType === Node.TEXT_NODE && regex.test(node.textContent.trim())) {
                        node.textContent = node.textContent.replace(regex, '').trim();
                        console.log('Removed unavailable text.');
                    }
                });
            }
        });
    }

    // Main script logic
    function runScript() {
        addDownloadButton();
        addPlayOnlineButton();
        removeUnavailableText();
    }

    // Run the script initially
    runScript();

    // Observe dynamic content updates
    const observer = new MutationObserver(() => {
        runScript();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
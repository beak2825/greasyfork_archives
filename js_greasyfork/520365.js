// ==UserScript==
// @name         Genshin Impact AppSample Map - More Markable Markers
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Mark more things on the interactive map
// @author       2KRN4U
// @match        https://genshin-impact-map.appsample.com/*
// @run-at       document-start
// @icon         https://genshin-impact-map.appsample.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520365/Genshin%20Impact%20AppSample%20Map%20-%20More%20Markable%20Markers.user.js
// @updateURL https://update.greasyfork.org/scripts/520365/Genshin%20Impact%20AppSample%20Map%20-%20More%20Markable%20Markers.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const changeAll = false; // Change to true if you want everything to be markable

    // List of markers to change
    const keys = [
        "o128", // Geo Sigil
        "o317", // Interaction Rewards
        "o409", // Clusterleaf of Cultivation
        "o415", // Dendro Rock
        "o416", // Dendro Pile
        // Natlan
        "o596", // Natlan Mora Chest
        "o601", // Shattered Night Jade
        "o602", // Broken, Graffiti-Marked Stone
        "o639", // Tribal Secret Spaces
        "o641", // Courier's Trial Keystone
        "o647", // Totem Challenge
        "o666", // Oozing Core
        "o681", // Coagulation Pearl
        "o684", // Iridescent Inscription
        // Nod-Krai
        "o723", // Nod-Krai Mora Chest
        "o724", // Hidden Troves
        "o725", // Kuuhenki
        "o726", // Robot Unit
        "o727", // "Engraving" Fragment
        "o728", // Kuuvahki Relay Mechanism
        "o729", // ID Cards
        "o730", // Stellafruit
        "o731", // Proof of the Cognoscenti
        "o732", // Krumkake Bolt
        "o733", // Bounty Token
        "o734", // Conch-Patterned Item
        "o735", // Sigurd's Relic
        "o741", // Valiant Chronicles
        "o742", // Strange Creatures
        "o760", // Oath Lantern
    ];

    // 🚫 Do not change anything below this line 🚫

    const targetFilenameStart = "markers_all"; // Filename of the markers file

    const allowMarkComment = 5; // Value to allow marking and commenting

    // Save references to the original XHR methods
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    // Override the open method
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        this._filename = url.split('/').pop(); // Extract the filename from the URL
        this._url = url; // Store the URL for later use
        originalOpen.apply(this, arguments); // Call the original open method
    };

    // Override the send method
    XMLHttpRequest.prototype.send = function (body) {
        this.addEventListener('readystatechange', function () {
            // Only process requests if the filename matches the target prefix
            if (
                this.readyState === 4 &&
                this.status === 200 &&
                this._filename.startsWith(targetFilenameStart) // Check if filename starts with the target string
            ) {
                try {
                    let modifiedResponseText = this.responseText;

                    if (changeAll) {
                        const searchPattern = /("o\d+",\d+,)(\d+)(,)/g;
                        modifiedResponseText = modifiedResponseText.replace(
                            searchPattern,
                            (_, prefix, lastDigits, suffix) => `${prefix}${allowMarkComment}${suffix}`
                        ); // Make everything markable + comments
                    } else {
                        // Apply replacements for each key in the list
                        keys.forEach(key => {
                            const searchPattern = new RegExp(`("${key}",\\d+,)(\\d+)(,)`, 'g'); // Search pattern for markers
                            modifiedResponseText = modifiedResponseText.replace(
                                searchPattern,
                                (_, prefix, lastDigits, suffix) => `${prefix}${allowMarkComment}${suffix}`
                            ); // Replace to allow marking and commenting
                        });
                    }


                    // Overwrite the responseText property with the modified content
                    Object.defineProperty(this, 'responseText', {
                        value: modifiedResponseText,
                        configurable: true,
                    });

                    // Optional: Overwrite response (useful if response is accessed differently)
                    Object.defineProperty(this, 'response', {
                        value: modifiedResponseText,
                        configurable: true,
                    });
                } catch (e) {
                    console.error('Error modifying JSON response:', e);
                }
            }
        });

        // Call the original send method
        originalSend.apply(this, arguments);
    };

    // Wait for the DOM to fully load
    window.addEventListener('load', function () {
        // Function to modify the title
        const modifyTitle = (originalTitle, dataTestId) => {
            // Trim the first 4 characters of data-testid
            const trimmedData = dataTestId ? dataTestId.slice(4) : 'Unknown';
            // Combine the original title with the trimmed data-testid
            return `${originalTitle}: ${trimmedData}`;
        };

        // Select all buttons with the class "MuiButtonBase-root"
        const buttons = document.querySelectorAll('.MuiButtonBase-root');

        // Iterate over each button
        buttons.forEach(button => {
            const originalTitle = button.getAttribute('title');
            const dataTestId = button.getAttribute('data-testid');

            // Only proceed if both title and data-testid exist
            if (originalTitle && dataTestId) {
                const newTitle = modifyTitle(originalTitle, dataTestId);
                button.setAttribute('title', newTitle);
            }
        });
    });
})();
// ==UserScript==
// @name         X.com Quick Mute Button
// @namespace    https://greasyfork.org/users/710133
// @version      1.0
// @description  Adds a "Mute" button next to usernames on X.com and uses the dropdown menu to trigger the mute functionality.
// @author       tomcatadam
// @match        https://*.x.com/*
// @match        https://x.com/*
// @match        https://twitter.com/*
// @match        https://*.twitter.com/*
// @icon         https://x.com/favicon.ico
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/517808/Xcom%20Quick%20Mute%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/517808/Xcom%20Quick%20Mute%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const observer = new MutationObserver(() => {
        // Find user elements that don't already have a mute button
        document.querySelectorAll('div[data-testid="User-Name"]:not(.mute-enhanced)').forEach(user => {
            user.classList.add('mute-enhanced');

            // Create the "Mute" button
            const muteButton = document.createElement('button');
            muteButton.innerText = 'Mute';
            muteButton.style.marginLeft = '10px';
            muteButton.style.backgroundColor = '#e6f4ff'; // Pale blue background
            muteButton.style.color = '#1d9bf0'; // X.com's brand blue for text
            muteButton.style.border = '1px solid #1d9bf0'; // Border matches text color
            muteButton.style.borderRadius = '3px';
            muteButton.style.padding = '2px 6px';
            muteButton.style.fontSize = '12px';
            muteButton.style.cursor = 'pointer';

            // Handle mute functionality
            muteButton.addEventListener('click', () => {
                const menuButton = user.closest('article').querySelector('button[data-testid="caret"]');
                if (menuButton) {
                    // Open the dropdown menu
                    menuButton.click();

                    // Wait for the dropdown to appear and select the mute option
                    const interval = setInterval(() => {
                        const muteOption = Array.from(document.querySelectorAll('div[role="menuitem"]'))
                            .find(el => el.textContent.includes('Mute'));

                        if (muteOption) {
                            muteOption.click();
                            clearInterval(interval); // Stop checking once the option is clicked
                        }
                    }, 100); // Check every 100ms

                    // Stop trying after 2 seconds if the mute option is not found
                    setTimeout(() => clearInterval(interval), 2000);
                } else {
                    alert('Menu button not found!');
                }
            });

            // Add the button next to the username
            user.appendChild(muteButton);
        });
    });

    // Start observing the page
    observer.observe(document.body, { childList: true, subtree: true });
})();

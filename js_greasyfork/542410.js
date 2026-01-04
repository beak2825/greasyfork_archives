// ==UserScript==
// @name         Reload on HTML Detection in Windows93 Trollbox
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Enter https://www.windows93.net/trollbox/index.php For just trollbox and use this script to have the program reboot everytime you say "sonic" or "discord"
// @author       You
// @match        https://www.windows93.net/trollbox/index.php
// @grant        none
// @license GemboyGAX
// @downloadURL https://update.greasyfork.org/scripts/542410/Reload%20on%20HTML%20Detection%20in%20Windows93%20Trollbox.user.js
// @updateURL https://update.greasyfork.org/scripts/542410/Reload%20on%20HTML%20Detection%20in%20Windows93%20Trollbox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load completely
    window.addEventListener('load', function() {
        // Override the parent.$exe function to prevent shutdown commands
        if (parent && parent.$exe) {
            const originalExe = parent.$exe;

            parent.$exe = function(command) {
                // Block shutdown command
                if (command === 'shutdown') {
                    console.log('Shutdown command blocked.');
                    return; // Prevent shutdown
                }
                // Allow other commands to proceed
                return originalExe.apply(this, arguments);
            };
        }

        // Intercept the send function
        const originalSend = window.sendMsg;

        window.sendMsg = function(msg) {
            // Reload page for specific keywords
            if (/sonic|discord|roblox/i.test(msg)) {
                console.log(`Reloading page for keyword: ${msg}`);
                location.reload(); // Reload the page
                return; // Prevent sending the message
            }

            // Send other messages normally
            return originalSend.call(this, msg);
        };

        // Monitor changes to the document body
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.innerText.includes('<html></html>')) {
                    console.log('Detected <html></html>, reloading page.');
                    location.reload(); // Reload the page if detected
                }
            });
        });

        // Start observing the body for changes
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
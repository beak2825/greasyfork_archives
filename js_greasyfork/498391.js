// ==UserScript==
// @name         Unblock All Users on Twitter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Unblock all users on the blocked users page with a button, preload, and autoscroll
// @author       Doxie
// @match        https://x.com/settings/blocked/all
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498391/Unblock%20All%20Users%20on%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/498391/Unblock%20All%20Users%20on%20Twitter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add a large button in the middle of the page
    const button = document.createElement('button');
    button.innerText = 'Unblock All Users';
    button.style.position = 'fixed';
    button.style.top = '50%';
    button.style.left = '50%';
    button.style.transform = 'translate(-50%, -50%)';
    button.style.padding = '20px';
    button.style.fontSize = '20px';
    button.style.zIndex = '1000';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '10px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    async function preloadBlockedUsers() {
        return new Promise((resolve) => {
            let lastScrollHeight = 0;
            let scrollInterval = setInterval(() => {
                window.scrollBy(0, window.innerHeight);
                if (document.documentElement.scrollHeight !== lastScrollHeight) {
                    lastScrollHeight = document.documentElement.scrollHeight;
                } else {
                    clearInterval(scrollInterval);
                    resolve();
                }
            }, 1000);
        });
    }

    async function unblockAllUsers() {
        function getBlockedContainers() {
            return Array.from(document.querySelectorAll('div')).filter(div => div.innerText.includes('Blocked'));
        }

        function getUnblockButtonFromContainer(container) {
            return container.closest('div').querySelector('button');
        }

        let blockedContainers = getBlockedContainers();
        while (blockedContainers.length > 0) {
            blockedContainers.forEach(container => {
                let unblockButton = getUnblockButtonFromContainer(container);
                if (unblockButton) {
                    unblockButton.click();
                }
            });
            await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 second to avoid rate limiting
            blockedContainers = getBlockedContainers();
        }
        console.log('All users have been unblocked.');
    }

    button.addEventListener('click', async () => {
        button.remove(); // Remove the button after clicking
        await preloadBlockedUsers(); // Scroll to load all blocked users
        await unblockAllUsers(); // Start unblocking users
    });
})();

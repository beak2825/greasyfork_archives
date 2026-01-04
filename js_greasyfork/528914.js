// ==UserScript==
// @name         Torn Market Highlight Users
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds colored circles next to users in Torn's item market based on their status (hospital (yellow), traveling (blue), or working in a clothing store (red)).
// @author       fourzees [3002874]
// @match        https://www.torn.com/page.php?sid=ItemMarket
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528914/Torn%20Market%20Highlight%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/528914/Torn%20Market%20Highlight%20Users.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function getUserStatus(userId) {
        const apiKey = 'YOUR-API-KEY-HERE'; // ENTER YOUR API KEY HERE
        const url = `https://api.torn.com/v2/user?selections=icons&id=${userId}&key=${apiKey}`;
        //console.log(`Fetching status for user ID: ${userId}`);
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        //console.log(`API Response for ${userId}:`, data);
                        if (data && data.icons) {
                            const icons = Object.values(data.icons).map(icon => icon.toLowerCase());
                            resolve({ userId, icons });
                        } else {
                            resolve({ userId, icons: [] });
                        }
                    } else {
                        console.error(`Error fetching data for user ${userId}:`, response.status);
                        resolve({ userId, icons: [] });
                    }
                }
            });
        });
    }

    async function highlightUsers() {
        //console.log("Highlighting users...");
        const listings = document.querySelectorAll('a[href*="XID="]');
        //console.log(`Found ${listings.length} user links.`);
        if (listings.length === 0) return;

        if (!window.usersChecked) {
            window.usersChecked = new Set();
        }
        listings.forEach(link => {
            const userIdMatch = link.href.match(/XID=(\d+)/);
            if (userIdMatch) {
                const userId = userIdMatch[1];
                if (!window.usersChecked.has(userId)) {
                    window.usersChecked.add(userId);
                    processUser(link, userId);
                }
            }
        });
    }

    async function processUser(element, userId) {
        //console.log(`Processing user ID: ${userId}`);
        let result = await getUserStatus(userId);
        let userBox = element.closest('.user-info, .userInfoBox___LRjPl');
        if (!userBox) {
            console.warn(`User box not found for user ID: ${userId}`);
            return;
        }

        let statusBoxes = [];

        if (result.icons.some(icon => icon.includes('hospital'))) {
            let statusBox = createStatusBox('yellow');
            //console.log(`User ${userId} is in hospital.`);
            statusBoxes.push(statusBox);
        }
        if (result.icons.some(icon => icon.includes('traveling'))) {
            let statusBox = createStatusBox('#3a3ae8');
            //console.log(`User ${userId} is traveling.`);
            statusBoxes.push(statusBox);
        }
        if (result.icons.some(icon => icon.includes('clothing store'))) {
            let statusBox = createStatusBox('red');
            //console.log(`User ${userId} works in a clothing store.`);
            statusBoxes.push(statusBox);
        }

        if (statusBoxes.length > 0) {
            statusBoxes.forEach(box => userBox.appendChild(box));
        }
    }

    function createStatusBox(color) {
        let statusBox = document.createElement('div');
        statusBox.style.width = '12px';
        statusBox.style.height = '12px';
        statusBox.style.borderRadius = '50%';
        statusBox.style.marginLeft = '5px';
        statusBox.style.display = 'inline-block';
        statusBox.style.border = '1px solid black';
        statusBox.style.backgroundColor = color;
        return statusBox;
    }

    const observer = new MutationObserver(() => {
        console.log("Page changed, rechecking highlights...");
        highlightUsers();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('actionButton___pb_Da')) {
            console.log("Action button clicked, rechecking highlights...");
            setTimeout(highlightUsers, 1000);
        }
    });

    highlightUsers(); // Initial run
})();

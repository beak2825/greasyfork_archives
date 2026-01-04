// ==UserScript==
// @name         [Neopets]Jellyneo Trade Matcher with Auto Email
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Compare users between "Up For Trade" and "Seeking" lists on Jellyneo and generate an email for matches.
// @author       BandanaWaddleDee24
// @match        *://items.jellyneo.net/item/*/uft-list/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520300/%5BNeopets%5DJellyneo%20Trade%20Matcher%20with%20Auto%20Email.user.js
// @updateURL https://update.greasyfork.org/scripts/520300/%5BNeopets%5DJellyneo%20Trade%20Matcher%20with%20Auto%20Email.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getUFTUsers() {
        const rows = document.querySelectorAll('table tbody tr td:first-child');
        return Array.from(rows).map(row => row.textContent.trim());
    }

    function findMatches(uftUsers, seekingUsers) {
        return uftUsers.filter(user => seekingUsers.includes(user));
    }

    function addCompareButton() {
        const titleElement = document.querySelector('h1');
        if (!titleElement) return;

        const uftItemName = titleElement.textContent.trim();

        const button = document.createElement('button');
        button.textContent = '🔍 Check Matches';
        button.style.marginTop = '10px';
        button.style.marginLeft = '10px';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#007BFF';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';

        button.addEventListener('click', async () => {
            const seekingUrl = prompt('Enter the URL of your "Seeking" list:');

            if (!seekingUrl) {
                alert('You need to provide the URL of your "Seeking" list!');
                return;
            }

            try {
                const seekingResponse = await fetch(seekingUrl);

                if (!seekingResponse.ok) {
                    alert('Failed to fetch the Seeking list. Please check the URL and try again.');
                    return;
                }

                const seekingHtml = await seekingResponse.text();
                const parser = new DOMParser();
                const seekingDoc = parser.parseFromString(seekingHtml, 'text/html');

                const uftUsers = getUFTUsers();
                const seekingUsers = Array.from(seekingDoc.querySelectorAll('table tbody tr td:first-child')).map(el => el.textContent.trim());

                const matches = findMatches(uftUsers, seekingUsers);

                if (matches.length > 0) {
                    const seekingItemName = seekingDoc.querySelector('h1').textContent.trim();
                    const emailText = matches.map(user => {
                        return `Hi ${user}! Would you be interested in trading your ${uftItemName} for my ${seekingItemName}?`;
                    }).join('\n\n---\n\n');

                    navigator.clipboard.writeText(emailText).then(() => {
                        alert(
                            `Matches found with the following users:\n\n${matches.join('\n')}\n\nEmail template copied to clipboard:\n\n${emailText}`
                        );
                    }).catch(err => {
                        console.error('Failed to copy to clipboard:', err);
                        alert('Failed to copy email template to clipboard. Check console for details.');
                    });
                } else {
                    alert('No matches found.');
                }
            } catch (error) {
                console.error('An error occurred:', error);
                alert('Could not fetch the list. Please check the URL and try again.');
            }
        });

        titleElement.parentElement.insertBefore(button, titleElement.nextSibling);
    }

    addCompareButton();
})();

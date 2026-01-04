// ==UserScript==
// @name         [Neopets] Jellyneo Trade Matcher
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Compare users between "Up For Trade" and "Seeking" lists on Jellyneo.
// @author       BandanaWaddleDee24
// @match        *://items.jellyneo.net/item/*/uft-list/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519971/%5BNeopets%5D%20Jellyneo%20Trade%20Matcher.user.js
// @updateURL https://update.greasyfork.org/scripts/519971/%5BNeopets%5D%20Jellyneo%20Trade%20Matcher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getUFTUsers() {
        const rows = document.querySelectorAll('table tbody tr td:first-child');
        return Array.from(rows).map(row => row.textContent.trim());
    }

    function findMatches(uftUsers, seekingUsers) {
        const matches = uftUsers.filter(user => seekingUsers.includes(user));
        return matches;
    }

    function addCompareButton() {
        const titleElement = document.querySelector('h1'); 
        if (!titleElement) return;

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
                    alert(`Matches found:\n\n${matches.join('\n')}`);
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

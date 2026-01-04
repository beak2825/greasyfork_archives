// ==UserScript==
// @name         Replace "Available" and Make Attack-Links Clickable
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Replaces "available" with attack links and makes them clickable, skipping anonymous sellers.
// @author       Grance [3487987]
// @match        *://www.torn.com/page.php?sid=ItemMarket*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524834/Replace%20%22Available%22%20and%20Make%20Attack-Links%20Clickable.user.js
// @updateURL https://update.greasyfork.org/scripts/524834/Replace%20%22Available%22%20and%20Make%20Attack-Links%20Clickable.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to replace "available" with attack links based on extracted IDs
    function replaceAvailableWithAttackLinks() {
        const sellerList = document.querySelector('ul.sellerList___kgAh_'); // Get the <ul> with class 'sellerList___kgAh_'

        if (sellerList) {
            const sellers = sellerList.querySelectorAll('li.rowWrapper___me3Ox'); // Select all listing rows

            sellers.forEach(row => {
                const anonymousDiv = row.querySelector('div.anonymous___P3S5S');
                if (anonymousDiv) {
                    // Skip if the seller is anonymous
                    return;
                }

                const profileLink = row.querySelector('a[href^="/profiles.php?XID="]');
                if (profileLink) {
                    const url = new URL(profileLink.href, 'https://www.torn.com'); // Handle relative URLs
                    const profileID = url.searchParams.get('XID'); // Extract the XID parameter from the href

                    const availableDiv = row.querySelector('div.available___xegv_');
                    if (availableDiv && availableDiv.textContent.includes('available')) {
                        // Extract the quantity from the text (e.g., "16 available")
                        const quantity = availableDiv.textContent.split(' ')[0]; // Get the first part (e.g., "16")
                        availableDiv.textContent = `https://www.torn.com/loader.php?sid=attack&user2ID=${profileID} (${quantity})`;
                    }
                }
            });
        }
    }

    // Function to convert div into a clickable link
    function convertDivToLink() {
        const divs = document.querySelectorAll('div.available___xegv_');

        divs.forEach((div) => {
            if (div.textContent.includes('https://') && !div.dataset.linkConverted) {
                const urlMatch = div.textContent.match(/https:\/\/www\.torn\.com\/loader\.php\?sid=attack&user2ID=\d+/);
                if (urlMatch) {
                    const url = urlMatch[0];
                    const text = div.textContent.replace(url, '').trim();

                    const link = document.createElement('a');
                    link.href = url;
                    link.textContent = `${text} Attack`;
                    link.style.color = 'inherit';
                    link.style.textDecoration = 'none';
                    link.target = '_blank';

                    div.innerHTML = '';
                    div.appendChild(link);
                    div.dataset.linkConverted = 'true';
                }
            }
        });
    }

    // Run the replacement function after the page has fully loaded
    window.addEventListener('load', () => {
        replaceAvailableWithAttackLinks();
        convertDivToLink();
    });

    // Observe for dynamic updates and replace again
    const observer = new MutationObserver(() => {
        replaceAvailableWithAttackLinks();
        convertDivToLink();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
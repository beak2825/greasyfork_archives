// ==UserScript==
// @name         Replace "Available" with non-clickable Attack-Links
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces "available" with non-clickable attack links in the Item Market.
// @author       Grance [3487987]
// @match        *://www.torn.com/page.php?sid=ItemMarket*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524831/Replace%20%22Available%22%20with%20non-clickable%20Attack-Links.user.js
// @updateURL https://update.greasyfork.org/scripts/524831/Replace%20%22Available%22%20with%20non-clickable%20Attack-Links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to replace "available" with attack links based on extracted IDs
    function replaceAvailableWithAttackLinks() {
       // Select only profile links inside the seller list
        const sellerList = document.querySelector('ul.sellerList___kgAh_'); // Get the <ul> with class 'sellerList___kgAh_'

        if (sellerList){
            const profileLinks = sellerList.querySelectorAll('a[href^="/profiles.php?XID="]'); // Only anchor tags with href starting with '/profiles.php?XID='

        // Iterate through the links and extract their IDs
        const profileIDs = Array.from(profileLinks).map(link => {
            const url = new URL(link.href, 'https://www.torn.com'); // Handle relative URLs
            return url.searchParams.get('XID'); // Extract the XID parameter from the href
        });


        // Counter to track replacements
        let replacementIndex = 0;

        // Use TreeWalker to find text nodes with "available"
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                if (node.nodeValue.includes('available') && replacementIndex < profileIDs.length) {
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_REJECT;
            }
        });

        let node;
        while ((node = walker.nextNode())) {
            node.nodeValue = node.nodeValue.replace(/available/, () => {
                // Get the ID at the current replacement index
                const id = profileIDs[replacementIndex];
                replacementIndex++;
                return `https://www.torn.com/loader.php?sid=attack&user2ID=${id}`;
            });
        }}
    }

    // Run the replacement function after the page has fully loaded
    window.addEventListener('load', () => {
        replaceAvailableWithAttackLinks();
    });

    // Observe for dynamic updates and replace again
    const observer = new MutationObserver(() => {
        replaceAvailableWithAttackLinks();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
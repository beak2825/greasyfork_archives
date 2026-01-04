// ==UserScript==
// @name        Yata link to profile page
// @namespace   torn.YataLinkToProfilePage
// @match       https://yata.yt/faction/war/*
// @run-at      document-end
// @grant       none
// @version     1.2
// @author      Conchur (with ChatGPT doing most of the work!)
// @description Update specific links on the faction war page to new profile URLs.
// @downloadURL https://update.greasyfork.org/scripts/508337/Yata%20link%20to%20profile%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/508337/Yata%20link%20to%20profile%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to update the links
    function updateLinks() {
        // Select all anchor elements on the page with the URL pattern
        let links = document.querySelectorAll('a[href^="https://www.torn.com/loader.php?sid=attack&user2ID="]');

        console.log(`Found ${links.length} links to update`);

        links.forEach(function(link) {
            // Create a URL object from the href attribute of the link
            let url = new URL(link.href);
            // Extract the user ID from the query parameter 'user2ID'
            let userID = url.searchParams.get('user2ID');

            if (userID) {
                // Construct the new URL with the extracted user ID
                let newURL = `https://www.torn.com/profiles.php?XID=${userID}`;
                // Update the link's href attribute
                link.href = newURL;
                console.log(`Updated link: ${link.href}`);
            } else {
                console.log(`No userID found in link: ${link.href}`);
            }
        });
    }

    // Run the function to update links on page load
    updateLinks();

    // Optionally handle dynamically loaded content
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                updateLinks(); // Re-run the updateLinks function if new content is added
            }
        });
    });

    // Observe the whole document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
})();

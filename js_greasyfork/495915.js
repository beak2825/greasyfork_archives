// ==UserScript==
// @name         Hacker News Infinite Scroll v2 June 2024
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license MIT
// @description  Automatically loads more stories as you scroll down on Hacker News.
// @author       jeffscottward
// @match        https://news.ycombinator.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495915/Hacker%20News%20Infinite%20Scroll%20v2%20June%202024.user.js
// @updateURL https://update.greasyfork.org/scripts/495915/Hacker%20News%20Infinite%20Scroll%20v2%20June%202024.meta.js
// ==/UserScript==


(function () {
    'use strict';

      console.log('load')

    /**
     * Fetches the next page's content and appends it to the current page.
     */
    function loadMore() {
        // Find the "More" link on the page
        const moreLink = document.querySelector('.morelink');
        const pageLinkTableBody = document.querySelector('#hnmain > tbody > tr:nth-child(3) > td > table > tbody');
        const morespaceEl = document.querySelector('.morespace');

        // Fetch the content of the next page
        fetch(moreLink.href)
            .then(response => response.text()) // Parse the response as text
            .then(data => {
                // Create a new DOM parser
                const parser = new DOMParser();
                // Parse the fetched HTML into a document
                const doc = parser.parseFromString(data, 'text/html');
                // More link
                const newMoreLinkHref = doc.querySelector('.morelink').href
                // Select the new stories and spacers from the fetched document
                const moreItems = doc.querySelectorAll(`
                #hnmain > tbody > tr:nth-child(3) > td > table > tbody > tr.athing:not(.morespace):not(.morespace + tr),
                #hnmain > tbody > tr:nth-child(3) > td > table > tbody > tr:not(.morespace):not(.morespace + tr),
                #hnmain > tbody > tr:nth-child(3) > td > table > tbody > tr.spacer:not(.morespace):not(.morespace + tr)
                `);


                // Convert NodeList to Array and filter out the morespace element
                moreItems.forEach(item => {
                    pageLinkTableBody.insertBefore(item, morespaceEl);
                });

                // Update the "More" link to the next page's "More" link
                moreLink.href = newMoreLinkHref;
            });
    }

    /**
     * Event listener for infinite scroll.
     * Loads more content when the user scrolls to the bottom of the page.
     */
    window.addEventListener('scroll', () => {
        console.log('scroll')
        // Check if the user has scrolled to the bottom of the page
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            // Load more content
            loadMore();

        }
    });

})();





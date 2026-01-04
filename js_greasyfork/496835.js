// ==UserScript==
// @name         Autotrader UK No Sponsored Listings
// @namespace    https://autotrader.co.uk
// @version      2024-06-02
// @description  Hides sponsored "you may also like" links from autotrader
// @author       rbutera
// @license      MIT
// @match        https://www.autotrader.co.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autotrader.co.uk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496835/Autotrader%20UK%20No%20Sponsored%20Listings.user.js
// @updateURL https://update.greasyfork.org/scripts/496835/Autotrader%20UK%20No%20Sponsored%20Listings.meta.js
// ==/UserScript==

(function() {
      'use strict';

    // Function to hide the targeted <li> elements
    function hideYouMayAlsoLikeElements() {
        // Select all <li> elements
        const listItems = document.querySelectorAll('li');

        // Iterate through the list items
        listItems.forEach((li) => {
            // Check if the first child of <li> is a <section>
            if (li.firstElementChild && li.firstElementChild.tagName === 'SECTION') {
                // Check if the <section> contains a <span> with the text 'You may also like'
                const section = li.firstElementChild;
                const span = section.querySelector('span');

                if (span && span.textContent.trim() === 'You may also like') {
                    // Hide the <li> element
                    li.style.display = 'none';
                }
            }
        });
    }

    // Run the function on page load
    window.addEventListener('load', hideYouMayAlsoLikeElements);

    // Optionally, run the function periodically to handle dynamically loaded content
    setInterval(hideYouMayAlsoLikeElements, 1000);
})();
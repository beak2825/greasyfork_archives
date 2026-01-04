// ==UserScript==
// @name         YouTube Channel Search Filter
// @namespace    https://greasyfork.org/en/users/1191564-iamcup
// @version      1.0
// @description  Hide search results from other YouTube channels when searching within a specific channel.
// @author       Tom McGraw
// @match        https://www.youtube.com/*/search?query=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477002/YouTube%20Channel%20Search%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/477002/YouTube%20Channel%20Search%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the channel name from the URL
    const url = window.location.href;
    const match = url.match(/@([^/]+)\/search/);
    if (!match) return;

    const searchText = match[1];

    // Function to hide elements without the specified text
    function hideElementsWithoutText() {
        const elements = document.querySelectorAll('div#contents ytd-item-section-renderer');

        elements.forEach(element => {
            const text = element.textContent;
            if (!text.includes(searchText)) {
                element.style.display = 'none';
            }
        });
    }

    // Call the function when the page loads and when new content is loaded (e.g., when scrolling)
    window.addEventListener('load', hideElementsWithoutText);
    window.addEventListener('scroll', hideElementsWithoutText);
})();

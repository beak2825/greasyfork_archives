// ==UserScript==
// @name         Wanikani: Jisho Search Link
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Adds a link to Jisho.org search results below the search results on Wanikani search pages.
// @author       Victor Medeiros
// @match        https://www.wanikani.com/search?query=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465527/Wanikani%3A%20Jisho%20Search%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/465527/Wanikani%3A%20Jisho%20Search%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the search results div element
    const searchResults = document.querySelector('.search-results');

    if (searchResults) {
        // Get the search query parameter from the URL
        const searchParams = new URLSearchParams(window.location.search);
        const query = searchParams.get('query');

        // Create a link to Jisho.org search results with the search query parameter
        const jishoLink = document.createElement('a');
        jishoLink.href = `https://jisho.org/search/${encodeURIComponent(query)}`;
        jishoLink.target = '_blank';
        jishoLink.textContent = `Search "${query}" on Jisho.org`;

        // Create a div to hold the link to Jisho.org search results
        const jishoDiv = document.createElement('div');
        jishoDiv.style.marginTop = '20px';
        jishoDiv.appendChild(jishoLink);

        // Add the div with the link to Jisho.org search results below the search results div
        searchResults.parentNode.insertBefore(jishoDiv, searchResults.nextSibling);
    }

})();
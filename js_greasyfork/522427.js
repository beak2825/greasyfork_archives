// ==UserScript==
// @name         Google Search: Remove AI Results
// @namespace    https://sinisterpixel.tv
// @version      1.1
// @description  Appends Google Search queries with a string of phrases designed to exclude webpages that use AI, without you manually having to append arguments. If you want to stop these arguments getting added, add an underscore as the last character of your search query.
// @author       Sinister Pixel
// @match        https://www.google.com/search*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522427/Google%20Search%3A%20Remove%20AI%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/522427/Google%20Search%3A%20Remove%20AI%20Results.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Phrases to append to the search query
    const appendPhrases = "-\"stable diffusion\" -\"ai\" -\"midjourney\" -\"open art\" -\"prompt hunt\"";
    const flagParam = 'modified'; // Flag to prevent infinite redirection

    // Get the current URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Check if the script has already modified the query
    if (urlParams.has(flagParam)) {
        return; // Exit if already modified
    }

    const query = urlParams.get('q');

    // Check if the query exists, does not end with an underscore, and does not already include the appended phrases
    if (query && query.slice(-1) !== "_" && !query.includes(appendPhrases)) {
        // Append the phrases
        const modifiedQuery = `${query} ${appendPhrases}`;

        // Update the search query parameter
        urlParams.set('q', modifiedQuery);

        // Add the flag parameter to prevent infinite redirection
        urlParams.set(flagParam, 'true');

        // Redirect to the modified URL
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.location.replace(newUrl);
    }
})();
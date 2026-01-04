// ==UserScript==
// @name         .test Domain Redirect
// @version      1.0
// @description  Automatically redirect .test domains from search results
// @author       Ant-V
// @match        *://*/* 
// @run-at       document-start
// @namespace    antv
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513221/test%20Domain%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/513221/test%20Domain%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    const currentURL = window.location.href;

    // Define a regular expression to detect .test domains, including possible paths or query strings
    const testDomainRegex = /^[a-z0-9.-]+\.test(\/.*)?$/i;

    // Check if the URL is a search engine result page (you can customize this part for your specific search engine)
    const searchQuery = new URLSearchParams(window.location.search).get('q');
    
    console.log(searchQuery)

    // If the search query looks like a .test domain
    if (searchQuery && testDomainRegex.test(searchQuery)) {
        const newURL = 'http://' + searchQuery;
        // Redirect to the correct .test domain with http
        window.location.href = newURL;
    }
})();
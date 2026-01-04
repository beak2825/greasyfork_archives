// ==UserScript==
// @name         Remove Alibaba Products Copy
// @namespace    Timmy Cheng
// @version      1.2
// @description  Removes the behavior=copyNew parameter from URL and refreshes the page if the URL contains "https://post.alibaba.com/product/publish.htm?spm="
// @match        https://post.alibaba.com/product/publish.htm?spm=*
// @grant        MIT
// @downloadURL https://update.greasyfork.org/scripts/491516/Remove%20Alibaba%20Products%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/491516/Remove%20Alibaba%20Products%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the URL contains "https://post.alibaba.com/product/publish.htm?spm="
    if (window.location.href.includes('https://post.alibaba.com/product/publish.htm?spm=')) {
        // Check if the URL contains the behavior=copyNew parameter
        if (window.location.search.includes('behavior=copyNew')) {
            // Remove the behavior=copyNew parameter from the URL
            var newUrl = window.location.href.replace(/([&?]behavior=copyNew)/g, '');
            // Update the URL
            window.history.replaceState({}, document.title, newUrl);
            // Refresh the page
            location.reload();
        }
    }
})();

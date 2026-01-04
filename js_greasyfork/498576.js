// ==UserScript==
// @name         Google Search Results Count
// @version      2024-06-22
// @description  On May 7, 2024, Google Search changed its interface to hide the number of search results by default. This script restores the visibility of the search result count by appending it to the top bar.
// @author       Mohan
// @match        https://*.google.com/search?*
// @include      /^https?://(?:www|encrypted|ipv[46])\.google\.[^/]+/(?:$|[#?]|search|webhp)/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @namespace https://greasyfork.org/users/1321961
// @downloadURL https://update.greasyfork.org/scripts/498576/Google%20Search%20Results%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/498576/Google%20Search%20Results%20Count.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function appendResultStats(retries) {
        var resultStats = document.getElementById('result-stats');
        var appbar = document.getElementById('appbar');

        if (resultStats && appbar) {
            appbar.appendChild(resultStats.cloneNode(true));
        } else if (retries > 0) {
            setTimeout(function() {
                appendResultStats(retries - 1);
            }, 1000);
        }
    }

    window.addEventListener('load', function() {
        appendResultStats(3);
    }, false);
})();

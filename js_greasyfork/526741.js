// ==UserScript==
// @name         Google Search Results Maximizer
// @version      1.0
// @namespace    https://github.com/Purfview/Google-Search-Results-Maximizer
// @homepage     https://github.com/Purfview/Google-Search-Results-Maximizer
// @supportURL   https://github.com/Purfview/Google-Search-Results-Maximizer/issues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license      MIT
// @description  Google disabled the option to display/show more than 10 results. This script allows you to get 100 Google search results per page again.
// @match        *://*.google.com/search?*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/526741/Google%20Search%20Results%20Maximizer.user.js
// @updateURL https://update.greasyfork.org/scripts/526741/Google%20Search%20Results%20Maximizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifySearchURL() {
        let url = new URL(window.location.href);
        let params = url.searchParams;

        if (params.has('num') && params.get('num') !== '100') {
            params.set('num', '100');
        } else if (!params.has('num')) {
            params.append('num', '100');
        }

        let newUrl = url.toString();
        if (newUrl !== window.location.href) {
            window.location.replace(newUrl);
        }
    }

    modifySearchURL();
})();

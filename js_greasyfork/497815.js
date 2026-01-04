// ==UserScript==
// @name         Google udm14
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add &udm=14 to Google URL if it doesn't already exist
// @author       niceEli
// @match        *://www.google.com/search*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497815/Google%20udm14.user.js
// @updateURL https://update.greasyfork.org/scripts/497815/Google%20udm14.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the URL already has the udm parameter
    const url = new URL(window.location.href);
    const udmParam = url.searchParams.get('udm');
    if (udmParam === null) {
        // If udm parameter does not exist, add udm=14
        url.searchParams.append('udm', '14');
        window.location.replace(url.href);
    } else if (udmParam !== '2' && udmParam !== '14') {
        // If udm parameter exists and is not 2 or 14, update it to 14
        url.searchParams.set('udm', '14');
        window.location.replace(url.href);
    }
})();

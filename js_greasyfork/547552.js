// ==UserScript==
// @name         YouTube Search, remove unwanted sections
// @namespace    https://www.youtube.com/
// @version      0.1
// @description  Remove unwanted sections from youtube search like 'For You', 'People Also Watched' etc.
// @author       Yilun Maa
// @match        *://www.youtube.com/results*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547552/YouTube%20Search%2C%20remove%20unwanted%20sections.user.js
// @updateURL https://update.greasyfork.org/scripts/547552/YouTube%20Search%2C%20remove%20unwanted%20sections.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = new URL(window.location.href);
    const params = url.searchParams;
    if (params.has('search_query') && !params.has('sp')) {
        params.set('sp', 'CAASAhAB');
        const newUrl = `${url.origin}${url.pathname}?${params.toString()}`;
        if (window.location.href !== newUrl) {
            window.location.replace(newUrl);
        }
    }
})();

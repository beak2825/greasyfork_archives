// ==UserScript==
// @name         AMP redirect
// @namespace    http://tampermonkey.net/
// @version      2024-03-02
// @description  View Google AMP version of pages
// @author       oldflumpy
// @match        https://www.sample.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488836/AMP%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/488836/AMP%20redirect.meta.js
// ==/UserScript==

/* relpace sample.com with the website of your choice :) */

(function() {
    'use strict';
    var oldUrlPath = window.location;
    var searchParams = window.location.search;
    var ampPattern = /\?outputType=amp/;
/* check to see if param is already present or not needed */
    if (!ampPattern.test(searchParams) &&
       window.location.pathname.length > 1) {
        var newURL = oldUrlPath + '?outputType=amp';
        window.location.replace (newURL);
    }
})();
// ==UserScript==
// @name         Remove YouTube Ads and Recommendations
// @namespace    https://greasyfork.org/users/1443511
// @version      1.0
// @description  Removes advertising and recommendations on YouTube In the search results.
// @author       for.ever
// @match        *://www.youtube.com/*
// @require      https://cdn.jsdelivr.net/npm/arrive@2.4.1/minified/arrive.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533354/Remove%20YouTube%20Ads%20and%20Recommendations.user.js
// @updateURL https://update.greasyfork.org/scripts/533354/Remove%20YouTube%20Ads%20and%20Recommendations.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    document.arrive('ytd-ad-slot-renderer.style-scope.ytd-item-section-renderer', function() {
        this.remove();
    });
    document.arrive('ytd-search-pyv-renderer.style-scope.ytd-item-section-renderer', function() {
        this.remove();
    });
})();
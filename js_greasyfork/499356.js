// ==UserScript==
// @name         Letterboxd Redirect
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Redirect letterboxd.com to embed.letterboxd.com
// @author       Aditya
// @match        https://letterboxd.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499356/Letterboxd%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/499356/Letterboxd%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var currentUrl = window.location.href;
    
    // Check if the URL is already 'embed.letterboxd.com'
    if (!currentUrl.includes('embed.letterboxd.com')) {
        var newUrl = currentUrl.replace('letterboxd.com', 'embed.letterboxd.com');
        window.location.replace(newUrl);
    }
})();

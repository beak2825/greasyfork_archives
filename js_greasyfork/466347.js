// ==UserScript==
// @name         Get Page Title and Icon
// @namespace    your-namespace
// @version      1.0
// @description  Retrieves the title and icon of a web page and prints them to the console.
// @author       Your Name
// @match        https://example.com/*   // Replace "https://example.com/*" with the URL of the webpage you want to analyze
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466347/Get%20Page%20Title%20and%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/466347/Get%20Page%20Title%20and%20Icon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a new <a> element to extract the page URL
    var link = document.createElement('a');
    link.href = window.location.href;

    // Retrieve the page title
    var pageTitle = document.title;

    // Retrieve the page icon (favicon)
    var pageIcon = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]') || document.querySelector('link[rel="apple-touch-icon"]');
    var pageIconUrl = pageIcon ? pageIcon.href : '';

    // Print the page title and icon URL
    console.log('Page Title: ' + pageTitle);
    console.log('Page Icon URL: ' + pageIconUrl);
})();

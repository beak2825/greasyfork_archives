// ==UserScript==
// @name         Change Aliexpres Favicon to the old one
// @description  Changes the favicon of Aliexpress to a custom image
// @match        https://www.aliexpress.us/*
// @grant        none
// @license      MIT
// @namespace    eihfdiskfh
// @version 0.0.1.20230702201941
// @downloadURL https://update.greasyfork.org/scripts/469998/Change%20Aliexpres%20Favicon%20to%20the%20old%20one.user.js
// @updateURL https://update.greasyfork.org/scripts/469998/Change%20Aliexpres%20Favicon%20to%20the%20old%20one.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL of the new favicon image
    var newFaviconUrl = 'https://www.aliexpress.com/favicon.ico';

    // Create a new favicon element
    var newFavicon = document.createElement('link');
    newFavicon.rel = 'icon';
    newFavicon.type = 'image/png';
    newFavicon.href = newFaviconUrl;

    // Remove the existing favicon element
    var existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon) {
        existingFavicon.parentNode.removeChild(existingFavicon);
    }

    // Append the new favicon element to the document head
    document.head.appendChild(newFavicon);
})();
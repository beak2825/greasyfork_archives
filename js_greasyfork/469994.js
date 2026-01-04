// ==UserScript==
// @name         Change Gmail Favicon
// @description  Changes the favicon of Gmail to a custom image
// @match        https://mail.google.com/*
// @grant        none
// @license      MIT
// @version 0.0.1.20230702201347
// @namespace https://greasyfork.org/users/1090996
// @downloadURL https://update.greasyfork.org/scripts/469994/Change%20Gmail%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/469994/Change%20Gmail%20Favicon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL of the new favicon image
    var newFaviconUrl = 'https://googlewebhp.neocities.org/favicon-32x32.png';

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
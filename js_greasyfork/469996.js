// ==UserScript==
// @name         Change Gmail Favicon to 2012-2018
// @description  Changes the favicon of Gmail to a custom image
// @match        https://mail.google.com/*
// @grant        none
// @license      MIT
// @namespace    https://mail.google.com/mail/u/0/h/vf4u6ogtqrap/?zy=e&view&f=1
// @version 0.0.1.20230702201941
// @downloadURL https://update.greasyfork.org/scripts/469996/Change%20Gmail%20Favicon%20to%202012-2018.user.js
// @updateURL https://update.greasyfork.org/scripts/469996/Change%20Gmail%20Favicon%20to%202012-2018.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL of the new favicon image
    var newFaviconUrl = 'https://googlewebhp.neocities.org/favicon1.ico';

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
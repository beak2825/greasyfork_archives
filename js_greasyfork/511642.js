// ==UserScript==
// @name         loogle spoof
// @namespace    https://loogle.cc
// @version      1.2.1
// @description  its a spoof for loogle man idk
// @match        *://loogle.cc/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_Plus_logo_%282011-2015%29.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511642/loogle%20spoof.user.js
// @updateURL https://update.greasyfork.org/scripts/511642/loogle%20spoof.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Replace the href attribute with the URL of your custom YouTube favicon.
    const FaviconURL = 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_Plus_logo_%282011-2015%29.png';

    // Creates a new favicon element.
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = FaviconURL;
    link.type = 'image/x-icon';

    // Finds the existing favicon element (if any) and removes it.
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon) {
        existingFavicon.remove();
    }

    // Adds a new favicon element to the document's head.
    document.head.appendChild(link);

    document.title = 'Google+';
})();

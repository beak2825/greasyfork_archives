// ==UserScript==
// @name         YouTube 2015 Favicon
// @namespace    https://www.youtube.com
// @version      1.0.0
// @description  Brings back the 2015 favicon from YouTube
// @match        *://www.youtube.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         http://web.archive.org/web/20150630235633/youtube.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502905/YouTube%202015%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/502905/YouTube%202015%20Favicon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Replace the href attribute with the URL of your custom YouTube favicon.
    const FaviconURL = 'http://web.archive.org/web/20150630235633/youtube.com/favicon.ico';

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
})();
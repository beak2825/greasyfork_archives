// ==UserScript==
// @name         BitView 2011-2013 Favicon
// @namespace    https://www.bitview.net
// @version      1.2.1
// @description  its for bitview i guess edugfghfjgwfvuwadfvu
// @match        *://www.bitview.net/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://fishcelery4894.neocities.org/favi.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498659/BitView%202011-2013%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/498659/BitView%202011-2013%20Favicon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Replace the href attribute with the URL of your custom YouTube favicon.
    const FaviconURL = 'https://fishcelery4894.neocities.org/favi.png';

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

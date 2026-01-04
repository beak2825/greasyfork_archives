// ==UserScript==
// @name         ??-?? instagram favicon
// @version      1.2
// @description  Script to change instagram favicon to the old icon what I base this off of https://greasyfork.org/en/scripts/502905-youtube-2015-favicon works perfectly with https://greasyfork.org/en/scripts/446358-instagram-2014
// @author       ...
// @match        https://www.instagram.com/*
// @match        https://www.instagram.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         http://web.archive.org/web/20150630235633/youtube.com/favicon.ico
// @license      MIT
// @namespace https://www.instagram.com/
// @downloadURL https://update.greasyfork.org/scripts/503767/-%20instagram%20favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/503767/-%20instagram%20favicon.meta.js
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
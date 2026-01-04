// ==UserScript==
// @name         2013 youtube favicon restored
// @namespace    http://youtube.com
// @version      1.2.1
// @description  brings back the old 2013 youtube favicon
// @match        *://www.youtube.com/*
// @match        *://studio.youtube.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         http://s.ytimg.com/yts/img/favicon_32-vflWoMFGx.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474792/2013%20youtube%20favicon%20restored.user.js
// @updateURL https://update.greasyfork.org/scripts/474792/2013%20youtube%20favicon%20restored.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Replace the href attribute with the URL of your custom YouTube favicon.
    const FaviconURL = 'https://www.eracast.cc/favicon.ico';

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

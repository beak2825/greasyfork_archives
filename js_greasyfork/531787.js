// ==UserScript==
// @name         Copy and Search URL Fragment + Page Navigator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Space to Google search current URL fragment, Q to go to previous page, E to go to next page.
// @author       Druid
// @match        *://fitgirl-repacks.site/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531787/Copy%20and%20Search%20URL%20Fragment%20%2B%20Page%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/531787/Copy%20and%20Search%20URL%20Fragment%20%2B%20Page%20Navigator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        const currentUrl = window.location.href;

        // SPACE - Google search the URL fragment
        if (event.code === 'Space') {
            event.preventDefault();

            let urlFragment = currentUrl.replace(/https?:\/\/[^/]+\//, '').replace(/-/g, ' ').replace(/\/$/, '');
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(urlFragment)}`;
            window.open(searchUrl, '_blank');
        }

        // Q - Go to previous page
        if (event.code === 'KeyQ') {
            event.preventDefault();

            let newUrl = currentUrl.replace(/(\/page\/)(\d+)(\/?)/, function(match, prefix, pageNum) {
                let prevPage = Math.max(parseInt(pageNum) - 1, 1);
                return `${prefix}${prevPage}/`;
            });

            // If no /page/ in URL, go to page 1
            if (!/\/page\/\d+/.test(currentUrl)) {
                newUrl = currentUrl.replace(/\/$/, '') + '/page/1/';
            }

            window.location.href = newUrl;
        }

        // E - Go to next page
        if (event.code === 'KeyE') {
            event.preventDefault();

            if (/\/page\/\d+/.test(currentUrl)) {
                let newUrl = currentUrl.replace(/(\/page\/)(\d+)(\/?)/, function(match, prefix, pageNum) {
                    let nextPage = parseInt(pageNum) + 1;
                    return `${prefix}${nextPage}/`;
                });
                window.location.href = newUrl;
            } else {
                // If no page number in URL, start with page 2
                let baseUrl = currentUrl.replace(/\/$/, '');
                window.location.href = baseUrl + '/page/2/';
            }
        }
    });
})();

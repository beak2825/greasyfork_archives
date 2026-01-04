// ==UserScript==
// @name         AnimeUnity Cinema Mode
// @namespace    http://tampermonkey.net/
// @version      2024-08-30
// @description  Enable full-width video play
// @author       bvuno
// @license      GNU
// @match        https://www.animeunity.to/anime/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animeunity.to
// @grant        GM_addStyle
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/507215/AnimeUnity%20Cinema%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/507215/AnimeUnity%20Cinema%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle (`
        #anime .banner-wrapper, #anime .header, #nav-top, #side-bar, #video-top {
            display: none !important;
        }

        #content {
            margin-top: 0 !important;
        }

        #anime .content {
            display: flex !important;
            flex-flow: column !important;
        }

        #anime .content .overview {
            order: 1 !important;
        }

        #anime .content .sidebar {
            order: 2 !important;
            margin-top: 0 !important;
        }

        #anime > div.content.container {
            margin: 0 !important;
            padding: 0 !important;
            min-width: 100% !important;
        }

        #anime > div.content.container > div.overview > div.recommended.d-none.d-sm-block, #anime > div.content.container > div.overview > div.row > div > div > div.mt-4.mb-4.episode-wrapper.text-center {
            padding: 0 16px !important;
        }

        #main, #main div {
            min-height: 98svh;
        }

    `);
    // Your code here...
})();
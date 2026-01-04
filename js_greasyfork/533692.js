// ==UserScript==
// @name         Facebook Pastel Pink Theme
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Prettifies Facebook in pastel pink without breaking UI elements like the photo viewer or side panels
// @author       You
// @match        https://www.facebook.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/533692/Facebook%20Pastel%20Pink%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/533692/Facebook%20Pastel%20Pink%20Theme.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        /* Base background */
        body, html {
            background-color: #ffe4ec !important;
        }

        /* General containers */
        div[role="main"], [data-pagelet="MainFeed"],
        [data-pagelet^="LeftRail"], [data-pagelet^="RightRail"],
        [role="complementary"], [role="banner"],
        [aria-label="Stories"], [aria-label="Sponsored"] {
            background-color: #fff0f5 !important;
        }

        /* Feed units (posts) */
        [data-pagelet^="FeedUnit_"], article, .x1iorvi4 {
            background-color: #fff5f8 !important;
            border-radius: 12px !important;
        }

        /* Text */
        div, span, p, a, h1, h2, h3, h4, h5, h6 {
            color: #333 !important;
        }

        /* Buttons */
        button, .x1i10hfl {
            background-color: #ffc0cb !important;
            color: #222 !important;
            border: 1px solid #e89bb7 !important;
        }

        /* Links */
        a {
            color: #c71585 !important;
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 12px;
        }
        ::-webkit-scrollbar-track {
            background: #ffe4ec;
        }
        ::-webkit-scrollbar-thumb {
            background: #ffb6c1;
            border-radius: 6px;
        }

        /* Don't touch modals and media viewer */
        [role="dialog"], [data-pagelet="ChatTab"] {
            background-color: initial !important;
            color: initial !important;
        }
    `);
})();

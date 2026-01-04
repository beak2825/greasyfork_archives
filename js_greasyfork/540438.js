// ==UserScript==
// @name         Manga Reader Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Apply dark mode to chapter-article and surrounding layout
// @author       You
// @match        *://www.mgeko.cc/reader/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540438/Manga%20Reader%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/540438/Manga%20Reader%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        html, body {
            background-color: #121212 !important;
            color: #e0e0e0 !important;
        }

        #chapter-article,
        .chapter-header,
        .chapternav,
        .container,
        .sidebar-wrapper,
        .chapter-mini-actions,
        .page-in.content-wrap,
        .save.chapternav,
        .recommends.content-wrap,
        .comments-section,
        .comment-form,
        .comment,
        .push-comments,
        .comment-wrapper,
        #comments,
        #load-more {
            background-color: #1e1e1e !important;
            color: #e0e0e0 !important;
        }

        .comment-form,
        .comment {
            border: 1px solid #333 !important;
            box-shadow: none !important;
        }

        .comment {
            background-color: #2a2a2a !important;
        }

        a {
            color: #80cbc4 !important;
        }

        img {
            filter: brightness(0.9) contrast(1.1);
        }

        ::selection {
            background: #444;
            color: #fff;
        }

        input[type="file"],
        input,
        textarea,
        button {
            background-color: #2a2a2a !important;
            color: #e0e0e0 !important;
            border: 1px solid #555 !important;
        }
    `);
})();
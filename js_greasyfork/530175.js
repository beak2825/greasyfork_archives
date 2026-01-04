// ==UserScript==
// @name         YouTube Mobile Non-Rounded Design (2021 Layout)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Disables YouTube's new rounded corners on mobile, reverting to the 2021 layout.
// @author       You
// @match        https://m.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/530175/YouTube%20Mobile%20Non-Rounded%20Design%20%282021%20Layout%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530175/YouTube%20Mobile%20Non-Rounded%20Design%20%282021%20Layout%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        /* Remove rounded corners from video thumbnails */
        ytd-thumbnail, img {
            border-radius: 0 !important;
        }

        /* Remove rounded corners from video cards */
        ytd-compact-video-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-grid-media, ytd-rich-item-renderer, ytd-item-section-renderer {
            border-radius: 0 !important;
        }

        /* Remove rounded corners from buttons and other UI elements */
        button, paper-button, yt-button-shape, yt-touch-feedback-shape, paper-icon-button, yt-icon-button {
            border-radius: 0 !important;
        }

        /* Remove rounded corners from dialogs and menus */
        paper-dialog, paper-menu-button, paper-listbox, paper-item {
            border-radius: 0 !important;
        }

        /* Remove rounded corners from input fields and search bars */
        input, textarea, ytd-searchbox {
            border-radius: 0 !important;
        }

        /* Remove rounded corners from bottom navigation */
        ytd-mini-guide-renderer, ytd-app-bottom-nav-bar-renderer {
            border-radius: 0 !important;
        }

        /* Remove rounded corners from comments and comment sections */
        ytd-comment-renderer, ytd-comments {
            border-radius: 0 !important;
        }

        /* Remove rounded corners from channel avatars */
        yt-img-shadow {
            border-radius: 0 !important;
        }

        /* Remove rounded corners from other general elements */
        .style-scope, .yt-spec-touch-feedback-shape__fill {
            border-radius: 0 !important;
        }
    `);
})();

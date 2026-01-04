// ==UserScript==
// @name         Youtube/Rumble Titles Fix Bold & change font
// @namespace    https://greasyfork.org/en/users/1200587-trilla-g
// @version      4.0
// @description  Unboldens and changes font style for YouTube Titles
// @author       Trilla_G
// @match        *://*.youtube.com/*
// @match        *://*.rumble.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483889/YoutubeRumble%20Titles%20Fix%20Bold%20%20change%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/483889/YoutubeRumble%20Titles%20Fix%20Bold%20%20change%20font.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    GM_addStyle(`
        #video-title,
        .style-scope.ytd-guide-renderer,
        ytd-watch-metadata[title-headline-xs] h1.ytd-watch-metadata {
            font-family: "Tahoma", sans-serif !important;
            font-size: 16px !important;
            font-weight: normal !important;
        }

        .title.ytd-guide-entry-renderer,
        .style-scope yt-chip-cloud-chip-renderer,
        .style-scope.ytd-playlist-panel-renderer {
            font-family: "Tahoma", sans-serif !important;
            font-size: 15px !important;
            font-weight: normal !important;
        }

        /* Added styles for Rumble */
        .h1 {
            font-family: "Tahoma", sans-serif !important;
            font-size: 16px !important;
            font-weight: normal !important;
        }

        /* Updated CSS selector for Rumble video titles */
        h3.thumbnail__title.line-clamp-2 {
            font-family: "Tahoma", sans-serif !important;
            font-size: 15px !important;
            font-weight: normal !important;
        }

        /* Added styles for Rumble channel names */
        span.channel__name.truncate {
            font-family: "Tahoma", sans-serif !important;
            font-size: 14px !important;
            font-weight: normal !important;
        }
    `);
})();

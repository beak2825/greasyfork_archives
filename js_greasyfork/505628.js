// ==UserScript==
// @name         YouTube 2017 Polymer Design
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Restyle YouTube to look like 2017 Polymer/Material Design Lite version
// @author       Your Name
// @match        *://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/505628/YouTube%202017%20Polymer%20Design.user.js
// @updateURL https://update.greasyfork.org/scripts/505628/YouTube%202017%20Polymer%20Design.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS styles
    GM_addStyle(`
        /* General Layout Adjustments */
        #container.ytd-masthead,
        #search-input.ytd-searchbox,
        ytd-topbar-logo-renderer #logo {
            background-color: #ffffff;
            border-bottom: 1px solid #e0e0e0;
        }

        /* Adjusting the Navigation Bar */
        #container.ytd-masthead {
            padding: 0 16px;
        }

        ytd-guide-section-renderer {
            padding: 8px 0;
        }

        /* Sidebar Colors and Font */
        ytd-guide-entry-renderer a {
            color: #212121 !important;
            font-weight: 400;
        }

        /* Main Background Color */
        body,
        #content.ytd-app {
            background-color: #f9f9f9 !important;
        }

        /* Video Titles */
        ytd-video-renderer #video-title {
            color: #1a0dab;
            font-family: Roboto, Arial, sans-serif;
            font-size: 14px;
            font-weight: 500;
        }

        /* Video Meta Information */
        ytd-video-meta-block #metadata-line span {
            color: #606060;
        }

        /* Buttons */
        ytd-toggle-button-renderer,
        ytd-button-renderer {
            background-color: #f1f1f1;
            border-radius: 2px;
            border: 1px solid #e0e0e0;
            color: #212121;
        }

        /* Sidebar Heading */
        ytd-guide-section-renderer #header {
            color: #757575;
            font-family: Roboto, Arial, sans-serif;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
        }

        /* Video Grid Adjustments */
        ytd-rich-grid-media {
            margin-bottom: 16px;
        }

        /* Restore old search bar design */
        #search.ytd-searchbox {
            background-color: #ffffff;
            border-radius: 2px;
            border: 1px solid #e0e0e0;
        }

        #search-input.ytd-searchbox {
            padding: 0 16px;
        }

        /* Old-style Material Design Buttons */
        paper-button {
            background-color: #f1f1f1;
            color: #212121;
            border-radius: 2px;
            border: 1px solid #e0e0e0;
            font-weight: 500;
            text-transform: uppercase;
        }

        /* Footer Colors */
        #footer.ytd-app {
            background-color: #ffffff;
            border-top: 1px solid #e0e0e0;
        }
    `);
})();

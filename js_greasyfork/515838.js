// ==UserScript==
// @name         Modern YouTube
// @namespace    userstyles.world
// @description  A modern user style for YouTube with a dark theme and improved aesthetics.
// @author       Your Name <your.email@example.com>
// @homepageURL  https://github.com/your-repo
// @supportURL   https://github.com/your-repo/issues
// @version      1.0.0
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/515838/Modern%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/515838/Modern%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS styles to be applied
    const styles = `
        /* General Background */
        body {
            background-color: #121212 !important; /* Dark background */
            color: #e0e0e0 !important; /* Light text color */
        }

        /* Header */
        #header, .ytd-masthead {
            background-color: #1c1c1c !important; /* Darker header */
            border-bottom: 1px solid #444 !important; /* Subtle border */
        }

        /* Search Bar */
        ytd-searchbox {
            background-color: #1c1c1c !important; /* Dark search box */
            border-radius: 5px !important;
            border: 1px solid #444 !important; /* Subtle border */
        }

        ytd-searchbox input {
            background-color: #121212 !important; /* Dark input field */
            color: #e0e0e0 !important; /* Light text */
        }

        /* Video Thumbnails */
        ytd-rich-item-renderer {
            background-color: #1c1c1c !important; /* Dark background for thumbnails */
            border-radius: 8px !important;
            overflow: hidden !important;
            margin-bottom: 16px !important;
        }

        ytd-rich-item-renderer:hover {
            background-color: #292929 !important; /* Highlight on hover */
        }

        /* Video Titles */
        #video-title {
            color: #e0e0e0 !important; /* Title color */
            font-weight: bold !important;
        }

        /* Sidebar */
        #secondary {
            background-color: #1c1c1c !important; /* Dark sidebar */
            border-right: 1px solid #444 !important; /* Subtle border */
        }

        /* Channel Titles */
        #channel-title {
            color: #a3a3a3 !important; /* Lighter channel text */
        }

        /* Footer */
        ytd-app #footer {
            background-color: #1c1c1c !important; /* Dark footer */
            color: #a3a3a3 !important; /* Light footer text */
        }

        /* Adjustments for cards */
        .yt-card {
            background-color: #1c1c1c !important; /* Dark card background */
            border: 1px solid #444 !important; /* Subtle card border */
            border-radius: 8px !important;
            padding: 16px !important;
            margin: 8px !important;
        }

        /* Buttons */
        ytd-button-renderer {
            background-color: #1c1c1c !important; /* Button background */
            color: #e0e0e0 !important; /* Button text */
            border-radius: 5px !important;
            border: 1px solid #444 !important; /* Button border */
        }

        ytd-button-renderer:hover {
            background-color: #292929 !important; /* Button hover effect */
        }

        /* Video player adjustments */
        ytd-player {
            background-color: #000 !important; /* Black video player background */
        }

        /* Hide distractions */
        .ytd-watch-flexy {
            background-color: #121212 !important; /* Dark background for the watch page */
        }

        /* Remove ads */
        .ad-showing {
            display: none !important; /* Hide ads */
        }
    `;

    // Add the styles to the page
    GM_addStyle(styles);
})();

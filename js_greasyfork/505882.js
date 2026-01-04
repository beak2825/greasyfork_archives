// ==UserScript==
// @name         YouTube Kids Theme for YouTube
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Apply a YouTube Kids-inspired theme to YouTube
// @author       You
// @match        *://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/505882/YouTube%20Kids%20Theme%20for%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/505882/YouTube%20Kids%20Theme%20for%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        /* Background color for header, sidebar, and main content */
        #header, #secondary, #primary {
            background-color: #f9f9f9 !important; /* Light gray background similar to YouTube Kids */
        }

        /* Main video grid background */
        #contents, .ytd-rich-grid-media {
            background-color: #ffffff !important; /* White background for video grid */
        }

        /* Video title styling */
        #video-title {
            color: #333333 !important; /* Darker color for text */
            font-family: 'Arial', sans-serif !important; /* Font style */
            font-size: 16px !important; /* Font size */
        }

        /* Sidebar link color and styling */
        #guide, #guide a {
            background-color: #e8e8e8 !important; /* Light gray for sidebar background */
            color: #ff0000 !important; /* Red color for sidebar links */
            font-family: 'Arial', sans-serif !important; /* Font style */
        }

        /* Remove or adjust unwanted elements */
        .ytd-popup-container {
            display: none !important; /* Hide popups */
        }

        /* Adjust padding and margins */
        #contents {
            padding: 10px !important; /* Add padding to main content area */
        }

        /* Button and control colors */
        .style-scope ytd-button-renderer {
            background-color: #ff0000 !important; /* Red background for buttons */
            color: #ffffff !important; /* White text for buttons */
        }

        /* Comment section styles */
        #comments {
            background-color: #f1f1f1 !important; /* Light background for comments section */
        }
    `);
})();

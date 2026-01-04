// ==UserScript==
// @name         YouTube Material Design Lite Style
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Apply Material Design Lite styling to YouTube
// @author       Your Name
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505518/YouTube%20Material%20Design%20Lite%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/505518/YouTube%20Material%20Design%20Lite%20Style.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject Material Design Lite CSS
    const mdlLink = document.createElement('link');
    mdlLink.rel = 'stylesheet';
    mdlLink.href = 'https://code.getmdl.io/1.3.0/material.indigo-pink.min.css';
    document.head.appendChild(mdlLink);

    // Inject Material Icons
    const iconsLink = document.createElement('link');
    iconsLink.rel = 'stylesheet';
    iconsLink.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    document.head.appendChild(iconsLink);

    // Custom CSS Styles
    const style = document.createElement('style');
    style.textContent = `
        /* Header */
        #masthead-container {
            background-color: #d32f2f !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        #logo-icon-container {
            padding-left: 16px !important;
        }
        ytd-masthead .title {
            font-size: 24px !important;
            font-weight: bold !important;
        }
        ytd-searchbox {
            flex-grow: 1;
            margin-left: 20px;
            margin-right: 20px;
        }
        #buttons ytd-button-renderer {
            margin-right: 10px;
        }

        /* Sidebar */
        ytd-app {
            display: flex;
        }
        ytd-guide-renderer {
            background-color: #fff;
            width: 240px;
        }
        ytd-guide-entry-renderer {
            display: flex;
            align-items: center;
            padding: 10px 16px;
        }
        ytd-guide-entry-renderer a {
            font-size: 14px !important;
            color: rgba(0, 0, 0, 0.87);
        }
        ytd-guide-entry-renderer a:hover {
            background-color: rgba(0, 0, 0, 0.1);
        }
        ytd-guide-entry-renderer .icon {
            margin-right: 16px;
        }

        /* Main Content */
        ytd-browse, ytd-page-manager {
            margin-left: 240px;
        }
        ytd-video-renderer, ytd-grid-video-renderer {
            margin: 16px;
            padding: 16px;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        ytd-video-renderer:hover, ytd-grid-video-renderer:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        /* Video Thumbnails */
        ytd-thumbnail img {
            border-radius: 4px;
        }

        /* Video Titles */
        ytd-video-renderer #video-title,
        ytd-grid-video-renderer #video-title {
            font-size: 16px !important;
            font-weight: bold !important;
            color: rgba(0, 0, 0, 0.87) !important;
        }
    `;
    document.head.appendChild(style);
})();

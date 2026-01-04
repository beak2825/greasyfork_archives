// ==UserScript==
// @name         YouTube Custom UI
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Custom YouTube UI design based on provided image.
// @author       Your Name
// @match        *://*.youtube.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506211/YouTube%20Custom%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/506211/YouTube%20Custom%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = `
    /* Reset and General Styling */
    body {
        font-family: 'Your Preferred Font', sans-serif !important;
        background-color: #f4f4f4 !important; /* light grey background */
    }

    /* Top Navigation Bar */
    #container.ytd-masthead {
        background-color: #ffffff !important; /* white background */
        border-bottom: 1px solid #e0e0e0 !important;
    }

    /* Sidebar */
    #guide {
        background-color: #ffffff !important;
    }

    #guide-content {
        padding-top: 20px !important;
    }

    #guide #sections #items {
        border-bottom: 1px solid #e0e0e0 !important;
    }

    #guide a.ytd-guide-entry-renderer {
        color: #000000 !important;
    }

    /* Home Page Thumbnails */
    #contents.ytd-rich-grid-renderer {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 15px !important;
        padding: 10px !important;
    }

    #items.ytd-rich-item-renderer {
        background-color: #ffffff !important;
        border-radius: 8px !important;
        padding: 10px !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
    }

    /* Channel Page Styling */
    #channel-header-container.ytd-c4-tabbed-header-renderer {
        background-color: #ffffff !important;
        border-bottom: 1px solid #e0e0e0 !important;
    }

    #tabsContent.ytd-c4-tabbed-header-renderer {
        background-color: #f9f9f9 !important;
    }

    #tabsContent .tab-content {
        padding: 10px !important;
    }

    /* Watch Page Video Player */
    #player.ytd-watch-flexy {
        background-color: #ffffff !important;
        border-radius: 8px !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
    }

    /* Comments Section */
    #comments.ytd-item-section-renderer {
        background-color: #ffffff !important;
        border-radius: 8px !important;
        padding: 15px !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
    }

    /* Related Videos Sidebar */
    #related.ytd-watch-flexy {
        background-color: #ffffff !important;
        border-radius: 8px !important;
        padding: 10px !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
    }

    /* Footer */
    #footer-container {
        background-color: #ffffff !important;
        padding: 20px !important;
        border-top: 1px solid #e0e0e0 !important;
        color: #666666 !important;
    }

    /* Additional Styling */
    .ytd-video-renderer, .ytd-grid-video-renderer {
        border-radius: 8px !important;
        overflow: hidden !important;
    }

    .ytd-video-renderer:hover, .ytd-grid-video-renderer:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    }

    /* Button Styling */
    .yt-simple-endpoint.style-scope.ytd-button-renderer {
        background-color: #ff0000 !important; /* red button background */
        color: #ffffff !important;
        padding: 5px 10px !important;
        border-radius: 5px !important;
    }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = style;
    document.head.appendChild(styleSheet);
})();

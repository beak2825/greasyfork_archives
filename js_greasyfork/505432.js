// ==UserScript==
// @name         Modern YouTube 2024
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Apply modern rounded styles and animations to YouTube and remove the sidebar button
// @author       Mason
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/505432/Modern%20YouTube%202024.user.js
// @updateURL https://update.greasyfork.org/scripts/505432/Modern%20YouTube%202024.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS styles
    GM_addStyle(`
        /* General Styles */
        body {
            background-color: #121212;
            color: #e0e0e0;
            font-family: 'Arial', sans-serif;
        }

        /* Header Styles */
        #container {
            border-radius: 10px;
            overflow: hidden;
        }
        
        #masthead-container {
            border-radius: 10px;
            background-color: #181818;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        #logo-icon {
            border-radius: 50%;
            transition: transform 0.3s ease;
        }
        
        #logo-icon:hover {
            transform: scale(1.1);
        }

        /* Sidebar Styles */
        #guide-button {
            display: none !important;
        }

        #primary {
            margin-left: 0 !important;
            padding-left: 16px;
        }

        /* Video Cards */
        .style-scope.ytd-rich-grid-media {
            border-radius: 10px;
            overflow: hidden;
            background-color: #292929;
            transition: transform 0.3s ease;
        }

        .style-scope.ytd-rich-grid-media:hover {
            transform: scale(1.03);
            box-shadow: 0 4px 8px rgba(0,0,0,0.5);
        }

        /* Video Title */
        #video-title {
            color: #e0e0e0;
            font-size: 16px;
            line-height: 1.2;
            transition: color 0.3s ease;
        }

        #video-title:hover {
            color: #ff0000;
        }

        /* Buttons */
        .style-scope.ytd-button-renderer {
            border-radius: 20px;
            padding: 8px 16px;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .style-scope.ytd-button-renderer:hover {
            background-color: #ff0000;
            color: #ffffff;
        }

        /* Animation for Load Transition */
        .ytd-app {
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }
        
        .ytd-app.loaded {
            opacity: 1;
        }
    `);

    // Add animation class to body when page is fully loaded
    window.addEventListener('load', () => {
        document.querySelector('ytd-app').classList.add('loaded');
    });
})();

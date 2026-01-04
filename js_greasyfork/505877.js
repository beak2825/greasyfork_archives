// ==UserScript==
// @name         YouTube 2017 Header Style with MDL
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Make YouTube's header bigger, add Material Design Lite, and a 2017 aesthetic.
// @author       Your Name
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/505877/YouTube%202017%20Header%20Style%20with%20MDL.user.js
// @updateURL https://update.greasyfork.org/scripts/505877/YouTube%202017%20Header%20Style%20with%20MDL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add Material Design Lite CSS
    GM_addElement('link', {
        href: 'https://code.getmdl.io/1.3.0/material.indigo-pink.min.css',
        rel: 'stylesheet',
        type: 'text/css'
    });

    // Add Material Design Lite Icons CSS
    GM_addElement('link', {
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
        rel: 'stylesheet',
        type: 'text/css'
    });

    // Add Material Design Lite JavaScript
    GM_addElement('script', {
        src: 'https://code.getmdl.io/1.3.0/material.min.js',
        type: 'text/javascript'
    });

    // Custom CSS to modify YouTube header
    GM_addStyle(`
        #masthead-container {
            height: 80px !important;
            background-color: #ffffff !important;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
            border-bottom: 1px solid #e0e0e0 !important;
        }

        #logo-icon {
            height: 36px !important;
            width: auto !important;
        }

        #search-input, #search-icon-legacy {
            height: 48px !important;
            border-radius: 24px !important;
            border: 1px solid #d3d3d3 !important;
            padding: 0 16px !important;
            box-shadow: none !important;
            background-color: #f9f9f9 !important;
            transition: all 0.2s ease-in-out !important;
        }

        #search-icon-legacy {
            height: 48px !important;
            width: 48px !important;
            background-color: #f1f1f1 !important;
            border-radius: 50% !important;
            padding: 12px !important;
        }

        #end {
            margin-top: 20px !important;
        }

        #buttons {
            margin-right: 16px !important;
        }

        /* Material Design Lite button */
        .yt-simple-endpoint.style-scope.ytd-button-renderer {
            color: #6200ea !important;
            background-color: #ffffff !important;
            border: 1px solid #6200ea !important;
            border-radius: 4px !important;
            text-transform: uppercase !important;
            padding: 8px 16px !important;
            font-weight: 500 !important;
            letter-spacing: 0.05em !important;
            transition: all 0.3s ease-in-out !important;
        }

        .yt-simple-endpoint.style-scope.ytd-button-renderer:hover {
            background-color: #6200ea !important;
            color: #ffffff !important;
        }
    `);
})();

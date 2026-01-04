// ==UserScript==
// @name         YouTube Custom Style and Layout
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Customize YouTube's video player, subscribe button, and layout
// @author       You
// @match        *://www.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/505460/YouTube%20Custom%20Style%20and%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/505460/YouTube%20Custom%20Style%20and%20Layout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add custom styles
    function addCustomStyles() {
        GM_addStyle(`
            /* Make the video player smaller */
            ytd-player {
                width: 80% !important;
                height: auto !important;
                max-width: 720px !important;
            }

            /* Style the subscribe button */
            #subscribe-button {
                background-color: red !important;
                text-transform: uppercase !important;
                color: white !important;
                border-radius: 3px;
            }

            /* Move the subscribe button next to the like button */
            #top-level-buttons-computed {
                display: flex;
                justify-content: center;
                gap: 8px;
            }

            #top-level-buttons-computed #subscribe-button {
                order: 2;
            }

            /* Add a video list to the left */
            ytd-watch-flexy #related {
                position: absolute;
                top: 0;
                left: 0;
                width: 20%;
                max-width: 300px;
                z-index: 1;
                margin: 0;
                padding: 10px;
                box-shadow: 2px 0 5px rgba(0,0,0,0.3);
                background: #f9f9f9;
            }
            
            /* Adjust the main video area to make space for the video list */
            ytd-watch-flexy #primary {
                margin-left: 320px; /* Adjust this to fit the video list */
            }
        `);
    }

    // Wait for the DOM to be fully loaded
    window.addEventListener('load', addCustomStyles);
})();

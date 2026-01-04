// ==UserScript==
// @name         Roblox Custom Dark Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Customizes Roblox UI to match desired dark theme style
// @author       You
// @match        *://www.roblox.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/507564/Roblox%20Custom%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/507564/Roblox%20Custom%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS
    GM_addStyle(`
        /* Dark background */
        body, .container, .navbar, .nav-menu, .home-container, .profile-container {
            background-color: #1a1a1a !important;
            color: white !important;
        }

        /* Top bar */
        .navbar, .header {
            background-color: #2c2c2c !important;
            border-bottom: 1px solid #3a3a3a !important;
        }

        /* Search bar */
        .search-input {
            background-color: #333 !important;
            color: white !important;
            border: 1px solid #444 !important;
        }

        /* Friend icons (rounded) */
        .friend-avatar, .avatar-image, .thumbnail-2d-container img {
            border-radius: 50% !important;
            border: 2px solid #444 !important;
        }

        /* Buttons */
        .btn-primary, .btn-secondary, .btn-tertiary {
            background-color: #4a4a4a !important;
            color: white !important;
            border: 1px solid #666 !important;
        }

        /* Game icons */
        .game-card-thumb, .thumbnail-2d-container img {
            border-radius: 10px !important;
            border: none !important;
        }

        /* Sidebar */
        .nav-left, .nav-right, .side-menu {
            background-color: #252525 !important;
        }

        /* Game title text */
        .game-card-name, .game-name {
            color: white !important;
        }

        /* Hover effects */
        .friend-avatar:hover, .game-card-thumb:hover {
            opacity: 0.8;
            transition: opacity 0.3s;
        }

        /* Remove borders from certain sections */
        .game-card-container, .friend-list-container {
            border: none !important;
        }

        /* Adjust section spacing */
        .container-section {
            padding: 20px !important;
        }

        /* Fix for any text color that remains dark */
        .text, .text-label, .game-card-text {
            color: white !important;
        }
    `);
})();

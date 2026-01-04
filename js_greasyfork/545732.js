// ==UserScript==
// @name         Custom Discord Theme with Image Sidebar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A custom theme with an orange-black gradient and an image sidebar for Discord
// @author       You
// @match        https://discord.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545732/Custom%20Discord%20Theme%20with%20Image%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/545732/Custom%20Discord%20Theme%20with%20Image%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL for the custom sidebar background image
    const sidebarImageUrl = 'https://i.imgur.com/biXWZP9.jpeg'; // Your image URL

    // Inject custom CSS for the theme with image sidebar
    GM_addStyle(`
        /* Full-page Gradient Background */
        body {
            background: linear-gradient(to bottom right, #ff6a00, #000000) !important; /* Orange to black gradient */
            color: white !important; /* White text on dark background */
        }

        /* Sidebar Background with Image */
        .sidebar-1KXjCE {
            background-image: url(${sidebarImageUrl}) !important; /* Set image as background */
            background-size: cover !important; /* Ensure the image covers the entire sidebar */
            background-position: center center !important; /* Center the image */
            background-repeat: no-repeat !important; /* Prevent image repetition */
        }

        /* Chat Area Background */
        .scroller-3dE8iT {
            background: rgba(0, 0, 0, 0.7) !important; /* Semi-transparent dark background */
        }

        /* Custom Text Color */
        .text-2p9sXf, .markup-eYLPri {
            color: #FFFFFF !important; /* White text color for messages */
        }

        /* Custom Header (User Bar) */
        .header-3tzCzH {
            background: linear-gradient(to right, #ff6a00, #000000) !important; /* Orange to black gradient header */
            color: white !important; /* White text in header */
        }

        /* Custom Button Colors */
        .button-3uQ8tG {
            background-color: #ff6a00 !important; /* Orange buttons */
            color: white !important;
            border-radius: 5px !important; /* Rounded corners */
        }

        /* Button Hover Effects */
        .button-3uQ8tG:hover {
            background-color: #ff4500 !important; /* Darker orange on hover */
        }

        /* Custom Input Area */
        .input-3CKyFc {
            background-color: rgba(0, 0, 0, 0.8) !important; /* Dark input field */
            color: white !important;
        }

        /* Remove Discord's default shadows */
        .scroller-3dE8iT,
        .channel-3T0pfc,
        .button-3uQ8tG {
            box-shadow: none !important;
        }

        /* Customize server icons */
        .icon-3hwvll {
            border-radius: 50% !important;
            border: 2px solid #ff6a00 !important; /* Orange border around server icons */
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-thumb {
            background-color: #ff6a00 !important; /* Orange scrollbar thumb */
            border-radius: 10px;
        }

        ::-webkit-scrollbar-track {
            background: #1a1a1a !important;
        }

        /* Channel Name Color */
        .name-3eLQYp {
            color: #ff6a00 !important; /* Orange text for channel names */
        }

        /* Hover Effect on Channel Names */
        .name-3eLQYp:hover {
            color: #ff4500 !important; /* Darker orange on hover */
        }

        /* Custom Badge Colors */
        .badge-2F6aA2 {
            background-color: #ff6a00 !important; /* Orange badges */
        }
    `);

})();

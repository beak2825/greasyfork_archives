// ==UserScript==
// @name         SolarTypist Nitro Type Theme
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Custom SolarTypist theme for Nitro Type
// @author       You
// @match        https://www.nitrotype.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/535856/SolarTypist%20Nitro%20Type%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/535856/SolarTypist%20Nitro%20Type%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        body {
            background-color: #121212 !important;
            color: #FFD700 !important;
        }

        .header, .garage, .race-track, .race, .team-profile, .dashboard {
            background-color: #1a1a1a !important;
        }

        .race-bar, .modal, .card, .profile, .leaderboard, .team {
            border: 2px solid #FFA500 !important;
            box-shadow: 0 0 8px #FF4500 !important;
        }

        .btn, .race-btn, .garage-btn {
            background: linear-gradient(45deg, #FFA500, #FFD700) !important;
            color: #000 !important;
            font-weight: bold;
        }

        .btn:hover {
            background: #FF4500 !important;
            color: #fff !important;
        }

        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-thumb {
            background: #FF4500;
            border-radius: 10px;
        }

        /* Custom SolarTypist Banner */
        #solar-typist-banner {
            background: linear-gradient(to right, #FFA500, #FFD700, #FF4500);
            color: black;
            text-align: center;
            font-size: 20px;
            padding: 10px;
            font-weight: bold;
            font-family: 'Segoe UI', sans-serif;
        }
    `);

    // Add custom banner to top of page
    window.addEventListener('load', function () {
        const banner = document.createElement('div');
        banner.id = 'solar-typist-banner';
        banner.innerText = '☀️ Welcome to SolarTypist\'s Nitro Theme ☀️';
        document.body.prepend(banner);
    });
})();

// ==UserScript==
// @name         Politics and War - Frutiger Aero Theme
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Applies a green and blue Frutiger Aero theme to Politics and War.
// @author       You
// @match        https://politicsandwar.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/527492/Politics%20and%20War%20-%20Frutiger%20Aero%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/527492/Politics%20and%20War%20-%20Frutiger%20Aero%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        body {
            background: linear-gradient(135deg, #A8E6CF, #56CCF2) !important;
            color: #2A363B !important;
            font-family: "Segoe UI", Arial, sans-serif !important;
        }

        .container, .content-wrapper, .panel, .card, .box, .main-content {
            background: rgba(255, 255, 255, 0.9) !important;
            border-radius: 15px !important;
            padding: 15px !important;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2) !important;
        }

        .navbar, .header, .footer, .top-bar {
            background: linear-gradient(135deg, #56CCF2, #A8E6CF) !important;
            color: #2A363B !important;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3) !important;
        }

        a, .btn, .nav-link, input[type="submit"] {
            color: #2A363B !important;
            background: linear-gradient(135deg, #A8E6CF, #56CCF2) !important;
            border-radius: 10px !important;
            padding: 5px 12px !important;
            text-decoration: none !important;
            border: none !important;
            transition: all 0.3s ease-in-out !important;
        }

        a:hover, .btn:hover, .nav-link:hover, input[type="submit"]:hover {
            background: linear-gradient(135deg, #56CCF2, #A8E6CF) !important;
            transform: scale(1.05) !important;
        }
    `;
    document.head.appendChild(style);
})();

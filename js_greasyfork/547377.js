// ==UserScript==
// @name         SleazyFork Black & Pink Theme with Persistent Toggle
// @namespace    UserScripts
// @version      1.0.2
// @homepage     https://sleazyfork.org/en/scripts/547377-sleazyfork-black-pink-theme-with-persistent-toggle
// @description  A sleek black and pink theme for SleazyFork.org with a persistent toggle button to enable or disable styling
// @author       Aar318
// @license      MIT
// @locale       en
// @match        https://sleazyfork.org/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/547377/SleazyFork%20Black%20%20Pink%20Theme%20with%20Persistent%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/547377/SleazyFork%20Black%20%20Pink%20Theme%20with%20Persistent%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styleId = 'sleazyfork-custom-theme';

    const themeCSS = `
        body {
            background-color: #0d0d0d !important;
            color: #f8f8f8 !important;
        }

        a {
            color: #ff69b4 !important;
        }

        #main-header {
            background-color: #111 !important;
            background-image: linear-gradient(to right, #111, #2a2a2a) !important;
            border-bottom: 3px solid #ff69b4 !important;
            box-shadow: 0 0 15px 2px rgba(255, 105, 180, 0.3) !important;
            color: #ff69b4 !important;
        }

        #main-header a,
        #main-header h1,
        #main-header .site-name {
            color: #ff69b4 !important;
            text-shadow: 0 0 5px rgba(255, 105, 180, 0.5);
        }

        .container, .content, .main-content {
            background-color: #121212 !important;
            padding: 20px;
            border-radius: 8px;
        }

        .panel, .panel-heading, .panel-body {
            background-color: #1a1a1a !important;
            color: #f0f0f0 !important;
            border-color: #ff69b4 !important;
        }

        .btn, .btn-primary {
            background-color: #ff69b4 !important;
            border-color: #ff69b4 !important;
            color: #000 !important;
        }

        footer {
            background-color: #0d0d0d !important;
            color: #aaa !important;
        }
    `;

    const buttonCSS = `
        #theme-toggle {
            position: fixed !important;
            top: 10px !important;
            right: 15px !important;
            background-color: #ff69b4 !important;
            color: #000 !important;
            border: none !important;
            padding: 5px 10px !important;
            font-size: 12px !important;
            border-radius: 5px !important;
            cursor: pointer !important;
            z-index: 9999 !important;
        }

        #theme-toggle:hover {
            background-color: #ff85c1 !important;
        }
    `;

    function applyTheme() {
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = themeCSS;
            document.head.appendChild(style);
        }
    }

    function removeTheme() {
        const style = document.getElementById(styleId);
        if (style) style.remove();
    }

    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'theme-toggle';
        button.textContent = 'Toggle Theme';
        button.onclick = () => {
            if (document.getElementById(styleId)) {
                removeTheme();
            } else {
                applyTheme();
            }
        };
        document.body.appendChild(button);

        const buttonStyle = document.createElement('style');
        buttonStyle.textContent = buttonCSS;
        document.head.appendChild(buttonStyle);
    }

    // Apply theme by default
    applyTheme();
    createToggleButton();
})();
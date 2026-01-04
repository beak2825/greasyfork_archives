// ==UserScript==
// @name         Hackread Dark Switcher
// @namespace    https://hackread.com/
// @version      1.0
// @description  Adds a smooth light/dark mode toggle to Hackread with theme memory.
// @author       Ghosty-Tongue
// @license      MIT
// @match        https://hackread.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/531864/Hackread%20Dark%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/531864/Hackread%20Dark%20Switcher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const toggle = document.createElement('div');
    toggle.id = 'darkModeToggle';
    toggle.innerHTML = '🌙';
    document.body.appendChild(toggle);

    GM_addStyle(`
        #darkModeToggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #333;
            color: white;
            padding: 10px 15px;
            border-radius: 30px;
            font-size: 20px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0,0,0,0.4);
            transition: background-color 0.3s, color 0.3s;
        }

        #darkModeToggle.light {
            background-color: #f0f0f0;
            color: #111;
        }
    `);

    const darkStyles = `
        body, html {
            background-color: #121212 !important;
            color: #e0e0e0 !important;
        }

        a {
            color: #90caf9 !important;
        }

        a:hover {
            color: #bbdefb !important;
        }

        header, footer, .site-header, .site-footer, .widget, .entry-footer, .post-meta, .cs-entry__meta {
            background-color: #1e1e1e !important;
            color: #ccc !important;
        }

        .post, .entry-content, .cs-entry__title, article, .content-area, .cs-content, .entry-title {
            background-color: #181818 !important;
            color: #e0e0e0 !important;
        }

        code, pre, blockquote {
            background-color: #252525 !important;
            color: #eee !important;
        }

        img {
            filter: brightness(0.9) contrast(1.05);
        }

        input, textarea, select, button {
            background-color: #2c2c2c !important;
            color: #ffffff !important;
            border: 1px solid #444 !important;
        }

        .widget, .sidebar, .powerkit-widget, .comments-area, .comment, .related-posts {
            background-color: #1a1a1a !important;
            color: #ccc !important;
        }

        .entry-title a, .widget-title {
            color: #ffffff !important;
        }

        ::selection {
            background: #333333;
            color: #ffffff;
        }

        .entry-meta a, .entry-footer a, .post-meta a {
            color: #bbbbbb !important;
        }
    `;

    let styleTag = null;

    function enableDarkMode() {
        styleTag = document.createElement('style');
        styleTag.id = 'darkModeStyles';
        styleTag.innerHTML = darkStyles;
        document.head.appendChild(styleTag);
        toggle.innerHTML = '☀️';
        toggle.classList.remove('light');
    }

    function disableDarkMode() {
        if (styleTag) styleTag.remove();
        toggle.innerHTML = '🌙';
        toggle.classList.add('light');
    }

    const mode = localStorage.getItem('hackread-darkmode');
    if (mode === 'on') enableDarkMode();

    toggle.addEventListener('click', () => {
        if (document.getElementById('darkModeStyles')) {
            disableDarkMode();
            localStorage.setItem('hackread-darkmode', 'off');
        } else {
            enableDarkMode();
            localStorage.setItem('hackread-darkmode', 'on');
        }
    });
})();
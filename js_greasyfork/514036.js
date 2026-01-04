// ==UserScript==
// @name         New DeepSeek Black theme
// @namespace    http://tampermonkey.net/
// @version      2024-10-25
// @description  A black theme for deepseek
// @author       YouTubeDrawaria
// @match        https://chat.deepseek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514036/New%20DeepSeek%20Black%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/514036/New%20DeepSeek%20Black%20theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Crear un estilo CSS personalizado
    const style = document.createElement('style');
    style.textContent = `
        /* General styles */
        body, html {
            background-color: #121212;
            color: #ffffff;
        }

        /* Links */
        a {
            color: #bb86fc;
        }
        a:hover {
            color: #9c27b0;
        }

        /* Headers */
        h1, h2, h3, h4, h5, h6 {
            color: #ffffff;
        }

        /* Forms */
        input, textarea, select {
            background-color: #1e1e1e;
            color: #ffffff;
            border: 1px solid #333333;
        }

        /* Buttons */
        button, .button {
            background-color: #333333;
            color: #ffffff;
            border: 1px solid #444444;
        }
        button:hover, .button:hover {
            background-color: #444444;
        }

        /* Containers */
        .container, .content, .section {
            background-color: #1e1e1e;
            border: 1px solid #333333;
        }

        /* Messages and chat */
        .message, .chat-container {
            background-color: #2d2d2d;
            color: #ffffff;
        }

        /* Input area */
        .input-area {
            background-color: #1e1e1e;
            color: #ffffff;
        }

        /* Navigation */
        .navbar, .nav {
            background-color: #1e1e1e;
            color: #ffffff;
        }

        /* Footer */
        .footer {
            background-color: #1e1e1e;
            color: #ffffff;
        }

        /* Tables */
        table {
            background-color: #1e1e1e;
            color: #ffffff;
            border: 1px solid #333333;
        }
        th, td {
            border: 1px solid #333333;
        }

        /* Scrollbars */
        ::-webkit-scrollbar {
            width: 10px;
        }
        ::-webkit-scrollbar-track {
            background: #1e1e1e;
        }
        ::-webkit-scrollbar-thumb {
            background: #333333;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #444444;
        }

        /* Specific styles for the provided section */
        .be78f05e, .e24b5b6e, ._9c5369e, .be919b82, ._884a004, .ds-icon, ._8625aaa {
            background-color: #1e1e1e;
            color: #ffffff;
        }

        .be78f05e svg, .e24b5b6e svg, ._9c5369e svg, .be919b82 svg, ._884a004 svg, .ds-icon svg, ._8625aaa svg {
            fill: #ffffff;
        }

        ._4a3e108, ._2862642, .e544bc52, ._5348f31, ._4d91dfd, .ds-icon-button, ._1808bd4, .ds-icon, ._8625aaa, ._313910c, .fb879f98, ._313910c, ._1580d64, .a28eaf7d, ._7f37ca6, ._1a931af, ._90080ab, ._06d8cd5, ._5f4e1b3, .a005f705, .a4179e6a, ._7c09fad, ._0ea36ce, ._167ef37, .dfcb1439, ._4bc704f {
            background-color: #1e1e1e;
            color: #ffffff;
        }

        ._4a3e108 svg, ._2862642 svg, .e544bc52 svg, ._5348f31 svg, ._4d91dfd svg, .ds-icon-button svg, ._1808bd4 svg, .ds-icon svg, ._8625aaa svg, ._313910c svg, .fb879f98 svg, ._313910c svg, ._1580d64 svg, .a28eaf7d svg, ._7f37ca6 svg, ._1a931af svg, ._90080ab svg, ._06d8cd5 svg, ._5f4e1b3 svg, .a005f705 svg, .a4179e6a svg, ._7c09fad svg, ._0ea36ce svg, ._167ef37 svg, .dfcb1439 svg, ._4bc704f svg {
            fill: #ffffff;
        }

        /* Ensure all white elements are styled */
        [style*="color: #ffffff"],
        [style*="color: #FFFFFF"],
        [style*="background-color: #ffffff"],
        [style*="background-color: #FFFFFF"] {
            color: #ffffff !important;
            background-color: #1e1e1e !important;
        }

        /* New styles for specific elements */
        ._1a931af.fd9f0f27 {
            background-color: #1c1c1c !important;
        }

        ._4c68ee5 {
            background-color: #1c1c1c !important;
            width: 68px;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 19px 0;
            border-top-right-radius: 16px;
            border-bottom-right-radius: 16px;
        }

        .ea0b6624 {
            --padding: 14px;
            display: flex;
            flex-direction: column;
            cursor: text;
            width: 100%;
            position: relative;
            box-sizing: border-box;
            font-size: var(--ds-font-size-l);
            line-height: var(--ds-line-height-l);
            border-radius: 20px;
            transition: box-shadow var(--ds-transition-duration) var(--ds-ease-in-out);
            background-color: transparent;
            border: 1px solid #93c5fd;
            padding: var(--padding);
            background-color: #1c1c1c !important;
        }

        .bd321dce {
            width: -moz-fit-content;
            width: fit-content;
            display: flex;
            align-items: center;
            gap: 10px;
            white-space: nowrap;
            padding: 2px 14px;
            font-size: 14px;
            line-height: 28px;
            background-color: rgb(var(--ds-rgb-blue-100));
            color: #4d6bfe;
            border-radius: 12px;
            cursor: pointer;
            z-index: 1;
        }

        .eb0ddb5a {
            width: -moz-fit-content;
            width: fit-content;
            display: flex;
            align-items: center;
            gap: 10px;
            white-space: nowrap;
            padding: 2px 14px;
            font-size: 14px;
            line-height: 28px;
            background-color: rgb(var(--ds-rgb-blue-100));
            color: #4d6bfe;
            border-radius: 12px;
            cursor: pointer;
            z-index: 1;
        }
    `;

    // Añadir el estilo al documento
    document.head.appendChild(style);
})();

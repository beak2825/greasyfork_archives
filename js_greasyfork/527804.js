// ==UserScript==
// @name         GX Mode - Opera GX Style
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Reading tool [alt + q] inspired by opera gx style!
// @license      MIT
// @author       outdev
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/527804/GX%20Mode%20-%20Opera%20GX%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/527804/GX%20Mode%20-%20Opera%20GX%20Style.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add Oxanium font
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Oxanium:wght@400;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const gxStyles = `
        :root {
            --gx-bg: #0f0819 !important;
            --gx-text: #ff007a !important;
        }

        * {
            background: var(--gx-bg) !important;
            color: var(--gx-text) !important;
            border-color: #2a1a3d !important;
            scrollbar-color: #ff007a var(--gx-bg) !important;
        }

        body, p, h1, h2, h3, h4, h5, h6, li, td, th, div, span, a {
            font-family: 'Oxanium', 'Segoe UI', sans-serif !important;
            text-shadow: 0 0 8px rgba(255, 0, 122, 0.3) !important;
        }

        input, textarea, select, button {
            background-color: #1a0d2b !important;
            border: 1px solid #ff007a !important;
            border-radius: 4px !important;
            padding: 8px !important;
        }

        a {
            text-decoration: none !important;
            transition: all 0.3s ease !important;
        }

        a:hover {
            color: #ff1a8c !important;
            text-shadow: 0 0 12px rgba(255, 0, 122, 0.5) !important;
        }

        ::-webkit-scrollbar {
            width: 12px !important;
            background-color: var(--gx-bg) !important;
        }

        ::-webkit-scrollbar-thumb {
            background-color: #ff007a !important;
            border-radius: 6px !important;
            border: 3px solid var(--gx-bg) !important;
        }

        code, pre {
            background-color: #1a0d2b !important;
            border: 1px solid #ff007a !important;
            border-radius: 4px !important;
            padding: 8px !important;
        }
    `;

    let isGxMode = GM_getValue('gxMode', false);
    let styleElement = null;

    function toggleGXMode() {
        isGxMode = !isGxMode;
        GM_setValue('gxMode', isGxMode);

        if (isGxMode) {
            // Add GX Mode styles
            styleElement = document.createElement('style');
            styleElement.id = 'gx-mode-styles';
            styleElement.textContent = gxStyles;
            document.head.appendChild(styleElement);
        } else {
            // Remove GX Mode styles
            const existingStyle = document.getElementById('gx-mode-styles');
            if (existingStyle) existingStyle.remove();
        }
    }

    // Apply initial state
    if (isGxMode) {
        styleElement = document.createElement('style');
        styleElement.textContent = gxStyles;
        document.head.appendChild(styleElement);
    }

    // Alt+Q toggle listener
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 'q' && !e.repeat) {
            e.preventDefault();
            toggleGXMode();
        }
    });
})();
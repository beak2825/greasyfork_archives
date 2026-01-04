// ==UserScript==
// @name         BBC News Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Toggle dark mode on BBC News with a button (works on homepage, sections, articles, sidebar, etc.)
// @author       steve
// @match        https://www.bbc.com/*
// @grant        window.onurlchange
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540168/BBC%20News%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/540168/BBC%20News%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DARK_STYLE_ID = 'bbc-dark-mode-style';

    const darkModeCSS = `
        body, html {
            background-color: #121212 !important;
            color: #e0e0e0 !important;
        }

        /* Main content & containers */
        header, footer, nav, section, article, aside, main, span, button,
        .ssrcss-1ocoo3l-Wrap,
        .ssrcss-1072xwf-Container,
        .ssrcss-1hizfh0-Stack,
        .ssrcss-18snukc-ArticleWrapper,
        .ssrcss-308p1n-Container,
        .sc-2d3296eb-0.iWPcQF,
        .sc-fc671f27-6 kbxLHW,
        .sc-9e01a804-0 eMGQdV-Wrap,
        [data-component="layout-grid-item"],
        [role="complementary"],
        .ssrcss-1hizfh0-Stack > div,
        .ssrcss-1inhkpr-Stack {
            background-color: #1e1e1e !important;
        }

        /* Text */
        h1, h2, h3, h4, h5, h6,
        p, span, a, li, strong {
            color: #e0e0e0 !important;
        }

        /* Links */
        a {
            color: #e0e0e0 !important;
        }

        /* Media */
        img, video {
            filter: brightness(0.85) !important;
        }
    `;

    function applyDarkMode(enabled) {
        if (enabled && !document.getElementById(DARK_STYLE_ID)) {
            const style = document.createElement('style');
            style.id = DARK_STYLE_ID;
            style.textContent = darkModeCSS;
            document.head.appendChild(style);
        } else if (!enabled && document.getElementById(DARK_STYLE_ID)) {
            document.getElementById(DARK_STYLE_ID).remove();
        }
    }

    function createToggle() {
        if (document.getElementById('bbc-dark-toggle')) return;

        const btn = document.createElement('button');
        btn.id = 'bbc-dark-toggle';
        btn.innerText = localStorage.getItem('bbcDarkMode') === 'true' ? '☀️' : '🌙';
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#333',
            color: '#fff',
            fontSize: '20px',
            cursor: 'pointer',
            zIndex: 99999,
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            opacity: 0.8,
            transition: 'opacity 0.2s ease'
        });

        btn.addEventListener('mouseenter', () => btn.style.opacity = '1');
        btn.addEventListener('mouseleave', () => btn.style.opacity = '0.8');

        btn.addEventListener('click', () => {
            const isDark = localStorage.getItem('bbcDarkMode') === 'true';
            localStorage.setItem('bbcDarkMode', (!isDark).toString());
            btn.innerText = !isDark ? '☀️' : '🌙';
            applyDarkMode(!isDark);
        });

        document.body.appendChild(btn);
    }

    function initDarkModeToggle() {
        const isDark = localStorage.getItem('bbcDarkMode') === 'true';
        applyDarkMode(isDark);
        createToggle();
    }

    // Initial load
    window.addEventListener('load', initDarkModeToggle);

    // Handle SPA navigation (BBC uses client-side routing for articles)
    if (window.onurlchange !== undefined) {
        window.addEventListener('urlchange', () => {
            setTimeout(initDarkModeToggle, 500); // slight delay to ensure DOM is ready
        });
    }
})();

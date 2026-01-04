// ==UserScript==
// @name         YouTube Thumbnails Fix
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Controls the width of the video thumbnails grid and centers items on the YouTube homepage
// @author       Anixty
// @match        https://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533073/YouTube%20Thumbnails%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/533073/YouTube%20Thumbnails%20Fix.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const STORAGE_KEY = 'itemWidth';
    const CONTROL_ID = 'tm-width-control';
    const defaultWidth = GM_getValue(STORAGE_KEY, '300px');

    const styleTag = document.createElement('style');
    document.head.appendChild(styleTag);

    function updateWidthStyle(width) {
        styleTag.textContent = `
        ytd-rich-grid-renderer #contents {
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
        }
        ytd-rich-grid-renderer > #contents > ytd-rich-item-renderer {
            width: ${width} !important;
            margin: 5px !important;
            box-sizing: border-box !important;
        }
        ytd-continuation-item-renderer > #ghost-cards {
            display: none !important;
        }
        ytd-rich-grid-renderer #contents > ytd-continuation-item-renderer {
            flex: 0 0 100% !important;
            max-width: 100% !important;
            width: 100% !important;
            white-space: nowrap !important;
            box-sizing: border-box !important;
        }
        `;
    }

    function createWidthControl() {
        if (document.getElementById(CONTROL_ID)) return null;
        const div = document.createElement('div');
        div.id = CONTROL_ID;
        div.style.cssText = 'display:flex;align-items:center;margin-left:12px;';
        const label = document.createElement('span');
        label.textContent = '';
        label.style.cssText = 'font-size:14px;font-family:Arial,sans-serif;color:#fff;margin-right:4px;';
        const input = document.createElement('input');
        input.id = 'tm-width-input';
        input.value = defaultWidth;
        input.style.cssText = 'width:60px;font-size:12px;padding:2px 4px;background:var(--yt-spec-brand-background-primary);border:1px solid var(--yt-spec-text-disabled);color:var(--yt-spec-text-primary);border-radius:2px;';
        input.title = 'e.g., 300px or 25%';
        input.addEventListener('change', () => {
            const w = input.value.trim();
            GM_setValue(STORAGE_KEY, w);
            updateWidthStyle(w);
        });
        div.appendChild(label);
        div.appendChild(input);
        return div;
    }

    function insertControl() {
        const logoEl = document.querySelector('ytd-masthead ytd-topbar-logo-renderer');
        if (!logoEl) return false;
        const control = createWidthControl();
        if (!control) return true;
        logoEl.insertAdjacentElement('afterend', control);
        return true;
    }

    const interval = setInterval(() => {
        if (insertControl()) clearInterval(interval);
    }, 500);

    updateWidthStyle(GM_getValue(STORAGE_KEY, defaultWidth));
})();
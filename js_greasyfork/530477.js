// ==UserScript==
// @name         YouTube Music RTL Formatter
// @version      1.0
// @description  Automatically apply RTL direction, Vazirmatn font, proper margins, and customizable font size to Persian/Arabic text on music.youtube.com
// @author       Zen
// @match        https://music.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @supportURL   https://github.com/Zen-CloudLabs/UserScripts/issues
// @homepageURL  https://github.com/Zen-CloudLabs/UserScripts
// @icon         https://music.youtube.com/img/favicon_144.png

// @namespace https://greasyfork.org/users/1425911
// @downloadURL https://update.greasyfork.org/scripts/530477/YouTube%20Music%20RTL%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/530477/YouTube%20Music%20RTL%20Formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Vazirmatn&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const defaultFontSize = 14;
    let fontSize = GM_getValue('fontSize', defaultFontSize);

    function updateFontSize(newSize) {
        fontSize = newSize;
        GM_setValue('fontSize', fontSize);
        document.documentElement.style.setProperty('--rtl-font-size', `${fontSize}px`);
    }

    GM_addStyle(`
        :root {
            --rtl-font-size: ${fontSize}px;
        }
        .vazirmatn-rtl {
            font-family: 'Vazirmatn', sans-serif !important;
            direction: rtl !important;
            text-align: right !important;
            padding: 10px 15px !important;
            margin: 10px 0 !important;
            box-sizing: border-box !important;
            font-size: var(--rtl-font-size) !important;
        }
    `);

    function isPersianOrArabic(text) {
        const persianArabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
        const matches = text.match(persianArabicRegex) || [];
        return matches.length / text.length > 0.3;
    }

    function updateRTLAndFont(div) {
        if (isPersianOrArabic(div.textContent)) {
            div.classList.add('vazirmatn-rtl');
            div.style.fontSize = `var(--rtl-font-size)`;
        } else {
            div.classList.remove('vazirmatn-rtl');
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.matches('yt-formatted-string.non-expandable.description.style-scope.ytmusic-description-shelf-renderer')) {
                    updateRTLAndFont(node);
                }
            });

            if (mutation.type === 'characterData' || mutation.type === 'childList') {
                const targetDiv = mutation.target;
                if (targetDiv.nodeType === 1 && targetDiv.matches('yt-formatted-string.non-expandable.description.style-scope.ytmusic-description-shelf-renderer')) {
                    updateRTLAndFont(targetDiv);
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    document.querySelectorAll('yt-formatted-string.non-expandable.description.style-scope.ytmusic-description-shelf-renderer').forEach(updateRTLAndFont);

    GM_registerMenuCommand('Change Font Size', () => {
        const newFontSize = prompt('Enter the desired font size (e.g., 14, 16):', fontSize);
        if (newFontSize && !isNaN(newFontSize)) {
            updateFontSize(Number(newFontSize));
        } else {
            alert('Please enter a valid number.');
        }
    });
})();
// ==UserScript==
// @name         Folo Colorful Listview
// @namespace    http://folo.colorful.list.view
// @description  Colorizes items based on their source feed
// @author       ObenK
// @license      MIT
// @match        https://app.follow.is/*
// @match        https://follow.is/*
// @match        https://*.follow.is/*
// @match        https://app.folo.is/*
// @version      1.0.1
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544721/Folo%20Colorful%20Listview.user.js
// @updateURL https://update.greasyfork.org/scripts/544721/Folo%20Colorful%20Listview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const colors = {};
    const processedEntries = new Set();

    // Function to add CSS styles
    const addStyle = (styleText) => {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(styleText));
        document.head.appendChild(style);
    };

    // Clean title for consistent coloring
    const cleanTitle = (title) => {
        return title?.replace?.(/[^\p{L}\s]/gu, '') || title;
    };

    // Compute color based on source title - Morandi colors (muted, desaturated)
    const computeColor = (title) => {
        if (colors[title]) return colors[title];

        let h = 0;
        const clean = cleanTitle(title);

        for (let i = 0; i < clean.length; i++) {
            let s = i !== 0 ? clean.length % i : 1;
            let r = s !== 0 ? clean.charCodeAt(i) % s : clean.charCodeAt(i);
            h += r;
        }

        // Morandi color palette - muted, soft tones
        const morandiColors = [
            { h: 210, s: 15, l: 85 }, // Soft blue-gray
            { h: 25, s: 20, l: 88 },  // Warm beige
            { h: 160, s: 18, l: 82 }, // Sage green
            { h: 45, s: 22, l: 86 },  // Warm gray
            { h: 280, s: 16, l: 84 }, // Soft lavender
            { h: 200, s: 14, l: 87 }, // Powder blue
            { h: 350, s: 18, l: 85 }, // Dusty rose
            { h: 170, s: 15, l: 83 }, // Mint gray
            { h: 30, s: 16, l: 89 },  // Cream
            { h: 220, s: 12, l: 86 }, // Steel blue
            { h: 260, s: 14, l: 84 }, // Mauve
            { h: 15, s: 19, l: 87 }   // Warm taupe
        ];

        const index = h % morandiColors.length;
        const color = morandiColors[index];

        colors[title] = color;
        return color;
    };

    // Add base styles
    addStyle(`
        .folo-colored-item {
            transition: background-color 0.2s ease !important;
        }

        .folo-colored-item:hover {
            background-color: rgba(0, 0, 0, 0.05) !important;
        }

        .dark .folo-colored-item:hover {
            background-color: rgba(255, 255, 255, 0.05) !important;
        }
    `);

    // Function to apply color to an entry
    const colorizeEntry = (entry) => {
        if (!entry || processedEntries.has(entry)) return;

        // Find the feed title element - look for the actual feed name
        const feedTitleElements = entry.querySelectorAll('.truncate, [class*="truncate"], .text-xs.font-bold');
        let feedTitle = null;

        for (const el of feedTitleElements) {
            const text = el.textContent?.trim();
            if (text && !text.includes('·') && text.length > 0) {
                feedTitle = text;
                break;
            }
        }

        if (!feedTitle) return;

        const color = computeColor(feedTitle);

        // Apply color directly to the element
        entry.style.backgroundColor = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
        entry.style.borderRadius = '8px';
        entry.style.margin = '2px 0';
        entry.style.padding = '8px';

        // Store the color info
        entry.setAttribute('data-folo-source', feedTitle);
        entry.setAttribute('data-folo-color', `hsl(${color.h}, ${color.s}%, ${color.l}%)`);

        processedEntries.add(entry);
    };

    // Function to find and colorize all entries
    const colorizeAllEntries = () => {
        // Use the same selector as the working merger script
        const entries = document.querySelectorAll('[class*="group"][class*="relative"][class*="flex"]');

        entries.forEach(entry => {
            if (!processedEntries.has(entry)) {
                colorizeEntry(entry);
            }
        });
    };

    // Removed unused observer code

    function waitForContent() {
        let attempts = 0;
        const maxAttempts = 20;

        const checkInterval = setInterval(() => {
            attempts++;
            const hasEntries = document.querySelectorAll('[class*="group"]').length > 5;

            if (hasEntries || attempts > maxAttempts) {
                clearInterval(checkInterval);
                colorizeAllEntries();

                // 设置观察器
                const observer = new MutationObserver(() => {
                    setTimeout(colorizeAllEntries, 500);
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }, 500);
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForContent);
    } else {
        waitForContent();
    }

    // 处理SPA路由变化
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(waitForContent, 1000);
        }
    }, 1000);

    // Expose for debugging
    window.foloColorful = {
        colors,
        processedEntries,
        colorizeAllEntries,
        recompute: () => {
            processedEntries.clear();
            colorizeAllEntries();
        }
    };
})();

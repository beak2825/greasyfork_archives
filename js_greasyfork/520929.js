// ==UserScript==
// @name         ANT | Torrent Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Highlights seeding, leeching and snatched torrent rows on Anthelion with color-coded backgrounds
// @author       Anil & Claude
// @license      MIT
// @match        https://anthelion.me/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520929/ANT%20%7C%20Torrent%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/520929/ANT%20%7C%20Torrent%20Highlighter.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Create and inject CSS
    const style = document.createElement('style');
    style.textContent = `
        .torrent_label.tooltip.tl_seeding,
        .torrent_label.tooltip.tl_leeching,
        .torrent_label.tooltip.tl_snatched {
            display: none !important;
        }
    `;
    document.documentElement.appendChild(style);

    // Define color configurations
    const configs = {
        'tl_seeding': { bg: '#19280F', text: '#FFFFFF' },
        'tl_leeching': { bg: '#6D1214', text: '#FFFFFF' },
        'tl_snatched': { bg: '#11313C', text: '#FFFFFF' }
    };

    // Define the highlight function
    function highlight() {
        // Process each type of torrent status
        Object.keys(configs).forEach(className => {
            document.querySelectorAll(`.torrent_label.tooltip.${className}`).forEach(label => {
                const row = label.closest('tr');
                if (row) {
                    const { bg, text } = configs[className];
                    row.querySelectorAll('td').forEach(td => {
                        if (td.style.backgroundColor !== bg) {
                            td.style.backgroundColor = bg;
                            td.style.color = text;
                            td.querySelectorAll('a, span, strong, div').forEach(element => {
                                element.style.color = text;
                            });
                        }
                    });
                }
            });
        });
    }

    // Initialize and observe with delay
    let timeout = null;
    const observer = new MutationObserver(() => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(highlight, 100);
    });

    // Configure observer
    const observerConfig = {
        childList: true,
        subtree: true
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            highlight();
            observer.observe(document.body, observerConfig);
        });
    } else {
        highlight();
        observer.observe(document.body, observerConfig);
    }

    // Cleanup
    window.addEventListener('unload', () => {
        if (timeout) clearTimeout(timeout);
        observer.disconnect();
    });
})();
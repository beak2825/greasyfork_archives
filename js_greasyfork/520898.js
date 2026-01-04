// ==UserScript==
// @name         BHD | Torrent Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.13
// @description  Highlights torrent rows on Beyond-HD with color-coded backgrounds based on seeding, downloading, or completed statuses for easy identification.
// @author       Anil, Claude 3.7 & Sparrow
// @license      MIT
// @match        https://beyond-hd.me/
// @match        https://beyond-hd.me/torrents*
// @match        https://beyond-hd.me/torrents?*
// @match        https://beyond-hd.me/library*
// @match        https://beyond-hd.me/lists*
// @match        https://beyond-hd.me/rescues*
// @match        https://beyond-hd.me/trending*
// @run-at       document-end
// @grant        none
// @icon         https://ptpimg.me/60kq22.png
// @downloadURL https://update.greasyfork.org/scripts/520898/BHD%20%7C%20Torrent%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/520898/BHD%20%7C%20Torrent%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cache commonly used selectors
    const iconSelectors = {
        seeding: "i.fa-seedling",
        leeching: "i.fa-arrow-down",
        snatched: "i.fa-check"
    };

    const highlightColor = {
        seeding: '#19280F',
        leeching: '#6D1214',
        snatched: '#11313C'
    };

    // Function to check if we're on a page that should be excluded from highlighting
    function shouldSkipHighlighting() {
        const path = window.location.pathname;
        return path.includes('/peers') || path.includes('/history');
    }

    function highlightRescuesPage(icon, status) {
        const row = icon.closest("tbody tr"); // Only target rows in tbody
        if (row && !icon.closest(".badge-user")) {
            const tds = row.querySelectorAll("td");
            // Check if the icon is in the 9th column (0-based index 8)
            if (tds.length > 8 && tds[8].contains(icon)) {
                tds.forEach(td => {
                    td.style.backgroundColor = highlightColor[status];
                });
            }
        }
    }

    function highlightRegularPage(icon, status) {
        const row = icon.closest("tr");
        if (row && !icon.closest(".badge-user")) {
            row.querySelectorAll("td").forEach(td => {
                td.style.backgroundColor = highlightColor[status];
            });
        }
    }

    function highlightTrendingPage(icon, status) {
        const card = icon.closest(".beta-movie-card");
        if (card) {
            card.style.backgroundColor = highlightColor[status];
        }
    }

    function highlightTidbit(icon, status) {
        const tidbit = icon.closest(".bhd-new-tidbit");
        if (tidbit) {
            tidbit.style.backgroundColor = highlightColor[status];
        }
    }

    function highlight() {
        // Skip highlighting if we're on a page that should be excluded
        if (shouldSkipHighlighting()) {
            return;
        }

        // Reset all highlights first
        document.querySelectorAll('td[style*="background-color"], .bhd-new-tidbit[style*="background-color"]').forEach(el => {
            el.style.backgroundColor = '';
        });

        // Reset spotlight highlights
        document.querySelectorAll('.beta-movie-card[style*="background-color"]').forEach(el => {
            el.style.backgroundColor = '';
        });

        // Check page type
        const isRescuesPage = window.location.pathname.includes('/rescues');
        const isTrendingPage = window.location.pathname.includes('/trending');

        // ===== Handle regular status icons =====
        // Handle seeding rows and tidbits
        document.querySelectorAll(iconSelectors.seeding).forEach(icon => {
            // For tidbit elements
            if (icon.closest(".bhd-new-tidbit")) {
                highlightTidbit(icon, 'seeding');
            }
            // For table rows
            else if (isRescuesPage) {
                highlightRescuesPage(icon, 'seeding');
            } else if (isTrendingPage) {
                highlightTrendingPage(icon, 'seeding');
            } else {
                highlightRegularPage(icon, 'seeding');
            }
        });

        // Handle leeching rows and tidbits
        document.querySelectorAll(iconSelectors.leeching).forEach(icon => {
            // For tidbit elements
            if (icon.closest(".bhd-new-tidbit")) {
                highlightTidbit(icon, 'leeching');
            }
            // For table rows
            else if (isRescuesPage) {
                highlightRescuesPage(icon, 'leeching');
            } else if (isTrendingPage) {
                highlightTrendingPage(icon, 'leeching');
            } else {
                highlightRegularPage(icon, 'leeching');
            }
        });

        // Handle snatched rows and tidbits
        document.querySelectorAll(iconSelectors.snatched).forEach(icon => {
            // For tidbit elements
            if (icon.closest(".bhd-new-tidbit")) {
                highlightTidbit(icon, 'snatched');
            }
            // For table rows
            else if (isRescuesPage) {
                highlightRescuesPage(icon, 'snatched');
            } else if (isTrendingPage) {
                highlightTrendingPage(icon, 'snatched');
            } else {
                highlightRegularPage(icon, 'snatched');
            }
        });
    }

    const observer = new MutationObserver(highlight);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', highlight);
    } else {
        highlight();
    }

    window.addEventListener('unload', () => observer.disconnect());
})();
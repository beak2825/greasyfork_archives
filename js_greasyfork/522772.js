// ==UserScript==
// @name         OPNsense Log Enhancer
// @namespace    kernkraft235/usability-tweaks
// @version      1.4
// @description  Changes datetime formatting and highlights log severity - only modifies how the page is presented, not how data is stored.
// @author       kernkraft235
// @match        opnsense
// @match        router
// @grant        none
// @run-at       document-end
// @license      gpl3
// @downloadURL https://update.greasyfork.org/scripts/522772/OPNsense%20Log%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/522772/OPNsense%20Log%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Inject styles for pulsating and flashing animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { color: white; opacity: 1; }
            50% { background-color: red; color: white; opacity: 1; }
        }
        @keyframes flash {
            0%, 50% { color: red; opacity: 0.9; }
            25%, 75% { color: transparent; opacity: 0.1; }
        }
        .pulsate-red {
            animation: pulse 2s infinite;
            color: red;
        }
        .flash-red {
            animation: flash 1s infinite;
            color: red;
        }
        .yellow {
            color: yellow;
        }
        .dark-grey {
            color: #666;
        }
    `;
    document.head.appendChild(style);

    // Function to format datetime strings
    function isAndFormatISO8601(text) {
        const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-\d{2}:\d{2}$/;
        if (isoRegex.test(text.trim())) {
            const date = new Date(text);
            const datePart = date.toISOString().slice(2, 10).replace(/-/g, '-');
            const weekday = date.toLocaleString('en-US', { weekday: 'short' });
            const timePart = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            });
return `<span style="color: AAAAFF;">${datePart}</span> <span style="color: #555555;">${weekday}</span> <span style="color: #FFFFAA;">${timePart}</span>`;        }
        return null;
    }

    // Function to apply colors to statuses
    function applyStatusColors() {
        document.querySelectorAll('tbody td').forEach((cell) => {
            const text = cell.textContent.trim().toLowerCase();
            if (!cell.dataset.styled) {
                if (text.includes('error')) {
                    cell.classList.add('pulsate-red');
                } else if (text.includes('critical')) {
                    cell.classList.add('flash-red');
                } else if (text.includes('warning')) {
                    cell.classList.add('yellow');
                } else if (text.includes('debug')) {
                    cell.classList.add('dark-grey');
                }
                cell.dataset.styled = 'true'; // Prevent re-styling
            }
        });
    }

    // Reformat all matching datetime strings in table cells
    function reformatDates() {
        document.querySelectorAll('td.text-left').forEach((cell) => {
            if (!cell.dataset.formatted) {
                const formatted = isAndFormatISO8601(cell.textContent);
                if (formatted) {
                    cell.innerHTML = formatted;
                    cell.dataset.formatted = 'true'; // Prevent reformatting
                }
            }
        });
    }

    // Observe changes in the DOM to reformat dynamically added elements
    const observer = new MutationObserver(() => {
        reformatDates();
        applyStatusColors();
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run for existing table cells
    reformatDates();
    applyStatusColors();
})();
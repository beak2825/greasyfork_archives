// ==UserScript==
// @name         Phind.com improved printing
// @name:de      Phind.com verbesserte Druckansicht
// @namespace    https://meinebasis.de
// @version      0.1
// @description  This script adjusts the css styles for printing so every useful content is visible and readable.
// @description:de Mit diesem Script wird die Druckansicht für phind.com optimiert, sodass alle nützlichen Inhalte angezeigt und lesbar werden.
// @author       Finomosec
// @match        https://phind.com/*
// @match        https://www.phind.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535987/Phindcom%20improved%20printing.user.js
// @updateURL https://update.greasyfork.org/scripts/535987/Phindcom%20improved%20printing.meta.js
// ==/UserScript==

(function() {
    const printCSS = `
        @media print {
            .phind-logo,
            .header-gradient,
            .followup-textarea-container,
            .thoughts-card,
            .flex.flex-row.space-x-4.mt-2.text-tertiary /* thumb up/down, etc. */,
            body > div.h-screen > div:nth-child(3),
            .callout-tip {
                display: none !important;
            }
            .chat-question {
                font-size: 1.5rem!important;
                -webkit-line-clamp: none!important;
            }
        }
        aside, body > div.h-screen > div:last-child, body > div.h-screen > div:first-child {
            display: none!important;
        }
        .sidebar-main-content {
            padding: 1rem!important;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = printCSS;
    document.head.appendChild(styleSheet);
})();
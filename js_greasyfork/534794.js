// ==UserScript==
// @name         Youtube auto grid
// @namespace    http://tampermonkey.net/
// @version      2025-05-03
// @description  Youtube Auto Grid: 1-2-3-4-5-6 columns layout
// @author       You
// @match        https://www.youtube.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT2
// @downloadURL https://update.greasyfork.org/scripts/534794/Youtube%20auto%20grid.user.js
// @updateURL https://update.greasyfork.org/scripts/534794/Youtube%20auto%20grid.meta.js
// ==/UserScript==

(function() {
    'use strict';
const css = `
    .ytd-rich-grid-renderer {
        --ytd-rich-grid-items-per-row: 1 !important;
    }

    @media (max-width: 600px) {
        .ytd-rich-grid-renderer {
            --ytd-rich-grid-items-per-row: 2 !important;
        }
    }

    @media (min-width: 601px) and (max-width: 1026px) {
        .ytd-rich-grid-renderer {
            --ytd-rich-grid-items-per-row: 3 !important;
        }
    }

    @media (min-width: 1027px) and (max-width: 1665px) {
        .ytd-rich-grid-renderer {
            --ytd-rich-grid-items-per-row: 4 !important;
        }
    }

    @media (min-width: 1666px) and (max-width: 2000px) {
        .ytd-rich-grid-renderer {
            --ytd-rich-grid-items-per-row: 5 !important;
        }
    }

    @media (min-width: 2001px) {
        .ytd-rich-grid-renderer {
            --ytd-rich-grid-items-per-row: 6 !important;
        }
    }
`;
const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();
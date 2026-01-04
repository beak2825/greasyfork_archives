// ==UserScript==
// @name         YouTube Grid Column Customizer
// @namespace    https://violentmonkey.github.io/
// @version      0.2
// @description  Adjust the number of video columns on YouTube
// @author       Bui Quoc Dung
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/533069/YouTube%20Grid%20Column%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/533069/YouTube%20Grid%20Column%20Customizer.meta.js
// ==/UserScript==
(function () {
    "use strict";

    GM_addStyle(`
        /* Mặc định: 3 cột */
        ytd-rich-grid-renderer {
            --ytd-rich-grid-items-per-row: 3 !important;
        }

        /* Desktop lớn */
        @media (min-width: 1200px) {
            ytd-rich-grid-renderer {
                --ytd-rich-grid-items-per-row: 4 !important;
            }
        }

        /* Tablet nhỏ hơn  */
        @media (max-width: 800px) {
            ytd-rich-grid-renderer {
                --ytd-rich-grid-items-per-row: 2 !important;
            }
        }
    `);
})();
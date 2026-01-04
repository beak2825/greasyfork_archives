// ==UserScript==
// @name         YYTube Rows
// @namespace    http://tampermonkey.net/
// @version      2025-08-09
// @license MIT
// @description  Change the number of items in youtube row
// @author       DikUln
// @match        https://www.youtube.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/545181/YYTube%20Rows.user.js
// @updateURL https://update.greasyfork.org/scripts/545181/YYTube%20Rows.meta.js
// ==/UserScript==

GM_addStyle(`
        ytd-rich-grid-renderer {
            --ytd-rich-grid-items-per-row: 4 !important;
        }
    `);
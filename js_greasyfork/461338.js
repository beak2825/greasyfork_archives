// ==UserScript==
// @name         Hide VK posts except ads
// @namespace    your-namespace-here
// @version      1
// @description  Hide all posts on VK except for ads
// @match        https://vk.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461338/Hide%20VK%20posts%20except%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/461338/Hide%20VK%20posts%20except%20ads.meta.js
// ==/UserScript==

GM_addStyle(`
    ._post {
        display: none !important;
    }

    ._ads_promoted_post_data_w {
        display: block !important;
    }

    ._ads_block_data_w {
        display: block !important;
    }
`);
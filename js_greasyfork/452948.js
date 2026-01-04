// ==UserScript==
// @name         YouTube Disable Scrollbar
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  I don't want Youtube scrollbar!
// @author       Smax2k8 (Smax2k)
// @include      https://www.youtube.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452948/YouTube%20Disable%20Scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/452948/YouTube%20Disable%20Scrollbar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        html {
  scrollbar-width: none !important;
}
        ::-webkit-scrollbar {
            width: 0px;
        }
        body:not(.style-scope)[standardized-themed-scrollbar]:not(.style-scope):not([no-y-overflow]):not(.style-scope)::-webkit-scrollbar {
            width: 0px!important;
        }
    `);
})();

// ==UserScript==
// @name         TradingView - Move the next earnings date back to original position
// @namespace    http://tampermonkey.net/
// @version      2024-02-28.1
// @description  Move the next earnings date back to original position
// @author       hodev.co
// @match        https://www.tradingview.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tradingview.com
// @license MIT
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/488520/TradingView%20-%20Move%20the%20next%20earnings%20date%20back%20to%20original%20position.user.js
// @updateURL https://update.greasyfork.org/scripts/488520/TradingView%20-%20Move%20the%20next%20earnings%20date%20back%20to%20original%20position.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    [class*="daysCounter-"] {
        position: fixed !important;
        top: 10px !important;
        right: 30px !important;
        background: #131722 !important;
        color: #f0f3fa !important;
        transform: scale(1.65) !important;
        z-index: 100 !important;
    }`
    )
})();
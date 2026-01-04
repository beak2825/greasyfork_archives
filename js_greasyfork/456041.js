// ==UserScript==
// @name         一键恢复网页彩色
// @namespace    tools
// @description  黑白网页恢复彩色。
// @version      0.1
// @description  try to take over the world!
// @author       Jun
// @match        *://*/*
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/456041/%E4%B8%80%E9%94%AE%E6%81%A2%E5%A4%8D%E7%BD%91%E9%A1%B5%E5%BD%A9%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/456041/%E4%B8%80%E9%94%AE%E6%81%A2%E5%A4%8D%E7%BD%91%E9%A1%B5%E5%BD%A9%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`html{filter:grayscale(0) !important}`);
    GM_addStyle(`body{filter:grayscale(0) !important}`);
})();
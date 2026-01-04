// ==UserScript==
// @name         ClickUp Paywall Bypass
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  ClickUp paywall 뒤의 메시지 히스토리 가리기 우회
// @author       Your name
// @license      MIT
// @match        https://app.clickup.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/537274/ClickUp%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/537274/ClickUp%20Paywall%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
[class*="behindMessageHistoryPaywall"] {
    filter: none !important;
    pointer-events: all !important;
}
img.ql-img,
img.cu-image-markup__img
img[src$=".png"] {
  background-color: white;
}
`);
})();

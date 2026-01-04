// ==UserScript==
// @name         优化QQ空间输入框
// @namespace    http://tampermonkey.net/
// @version      2025-05-27
// @description  优化QQ空间输入框的输入体验
// @author       You
// @match        https://user.qzone.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537410/%E4%BC%98%E5%8C%96QQ%E7%A9%BA%E9%97%B4%E8%BE%93%E5%85%A5%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/537410/%E4%BC%98%E5%8C%96QQ%E7%A9%BA%E9%97%B4%E8%BE%93%E5%85%A5%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
    .qz-poster .qz-inputer div.textarea, .qz-poster .qz-inputer textarea {
        height: fit-content !important;
        max-height: 260px !important;
        min-height: 60px !important;
      }
    `)
})();
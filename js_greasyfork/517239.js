// ==UserScript==
// @name         面试鸭
// @namespace    https://github.com/cloudylong/
// @version      1.1
// @description  允许用户选择文本
// @author       Walter
// @match        https://www.mianshiya.com/*
// @icon         https://www.mianshiya.com/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/517239/%E9%9D%A2%E8%AF%95%E9%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/517239/%E9%9D%A2%E8%AF%95%E9%B8%AD.meta.js
// ==/UserScript==

GM_addStyle(`
    /* 解除禁选文本 */
    body {
        user-select: initial !important;
    }
`);

(function () {
  "use strict";

})();

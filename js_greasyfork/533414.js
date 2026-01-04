// ==UserScript==
// @name         Sharplingo 隐藏“您的答案”
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隐藏 SharpLingo 记忆卡片复习页面中错误提示里的“您的答案”一行
// @author       schweigen
// @match        https://*.sharplingo.cn/users/study
// @match        https://*.sharplingo.cn/users/study?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sharplingo.cn
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533414/Sharplingo%20%E9%9A%90%E8%97%8F%E2%80%9C%E6%82%A8%E7%9A%84%E7%AD%94%E6%A1%88%E2%80%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/533414/Sharplingo%20%E9%9A%90%E8%97%8F%E2%80%9C%E6%82%A8%E7%9A%84%E7%AD%94%E6%A1%88%E2%80%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加 CSS 样式，隐藏目标元素
    GM_addStyle(`
        .invalid-feedback > span:not([class="imp"]) {
            display: none !important;
        }
    `);

})();
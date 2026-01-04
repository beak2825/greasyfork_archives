// ==UserScript==
// @name         改手机必应搜索标题字体大小
// @version      0.4
// @description  把手机必应搜索结果的标题字体大小改为17px
// @author       ChatGPT
// @match        *://*.bing.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @namespace   https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/502341/%E6%94%B9%E6%89%8B%E6%9C%BA%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E6%A0%87%E9%A2%98%E5%AD%97%E4%BD%93%E5%A4%A7%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/502341/%E6%94%B9%E6%89%8B%E6%9C%BA%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E6%A0%87%E9%A2%98%E5%AD%97%E4%BD%93%E5%A4%A7%E5%B0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        a > h2,div.b_title > h2,a > h3 {
            font-size: 17px !important;
        }
    `);
})();
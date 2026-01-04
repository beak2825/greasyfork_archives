// ==UserScript==
// @name        点击 JAVLibrary 链接标记为已访问
// @author      slowFever
// @namespace   https://greasyfork.org/
// @description:zh   将点击过的 JAVLibrary 链接标记为已访问
// @description:en   Mark clicked JAVLibrary links as visited
// @match       *://*javlibrary.com/*
// @match       *://*javlibrary*/*
// @grant       GM_addStyle
// @version     1.0.0
// @description 2025/4/10 17:05:49
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/533528/%E7%82%B9%E5%87%BB%20JAVLibrary%20%E9%93%BE%E6%8E%A5%E6%A0%87%E8%AE%B0%E4%B8%BA%E5%B7%B2%E8%AE%BF%E9%97%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/533528/%E7%82%B9%E5%87%BB%20JAVLibrary%20%E9%93%BE%E6%8E%A5%E6%A0%87%E8%AE%B0%E4%B8%BA%E5%B7%B2%E8%AE%BF%E9%97%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        .pubgroup td.left a::before {
            content: "●";
            color: #33c82f;
            padding-right: 4px;
            font-size: 20px;
        }
        
        .pubgroup td.left a:visited::before {
            color: #aaa;
        }
    `);

})()

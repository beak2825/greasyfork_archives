// ==UserScript==
// @name         洛谷宽度优化
// @namespace    http://tampermonkey.net/
// @version      0.3.1.1
// @description  解除洛谷1100px宽度限制，而且优化了部分界面
// @author       Starlike
// @match        https://www.luogu.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/491257/%E6%B4%9B%E8%B0%B7%E5%AE%BD%E5%BA%A6%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/491257/%E6%B4%9B%E8%B0%B7%E5%AE%BD%E5%BA%A6%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
    .lg-index-content{
        max-width: none;
    }
    .wrapped > *[data-v-7ddab1d5]{
        max-width: none;
    }
    .am-comment-bd img {
        max-width: 50%;
    }
    .side[data-v-0cd59e64]{
        width: calc(400px - .5em);
    }
    .main[data-v-0cd59e64]{
        width: calc(100% - 400px - .5em);
    }
    .am-input-group{float:left}
    `);
})();
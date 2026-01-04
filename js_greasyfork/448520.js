// ==UserScript==
// @name         屏蔽今日头条置顶文章
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  我的浏览器我做主
// @author       YoungYuan
// @match        *://www.toutiao.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toutiao.com
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/448520/%E5%B1%8F%E8%94%BD%E4%BB%8A%E6%97%A5%E5%A4%B4%E6%9D%A1%E7%BD%AE%E9%A1%B6%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/448520/%E5%B1%8F%E8%94%BD%E4%BB%8A%E6%97%A5%E5%A4%B4%E6%9D%A1%E7%BD%AE%E9%A1%B6%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==


(function () {
    'use strict';

    let css = `
        .feed-card-wrapper.feed-card-article-wrapper.sticky-cell{
            display: none
        }
        .feed-five-wrapper{
            display: none
        }
    `
    GM_addStyle(css)

})();
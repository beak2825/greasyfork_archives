// ==UserScript==
// @name         完全没什么用的移除b站主页大屏即显示更多推荐
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  主页简洁一点
// @author       oguricaping4e
// @match        *://*.bilibili.com
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459064/%E5%AE%8C%E5%85%A8%E6%B2%A1%E4%BB%80%E4%B9%88%E7%94%A8%E7%9A%84%E7%A7%BB%E9%99%A4b%E7%AB%99%E4%B8%BB%E9%A1%B5%E5%A4%A7%E5%B1%8F%E5%8D%B3%E6%98%BE%E7%A4%BA%E6%9B%B4%E5%A4%9A%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/459064/%E5%AE%8C%E5%85%A8%E6%B2%A1%E4%BB%80%E4%B9%88%E7%94%A8%E7%9A%84%E7%A7%BB%E9%99%A4b%E7%AB%99%E4%B8%BB%E9%A1%B5%E5%A4%A7%E5%B1%8F%E5%8D%B3%E6%98%BE%E7%A4%BA%E6%9B%B4%E5%A4%9A%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("#i_cecream > div.bili-feed4 > main > div.feed2 > div > div.is-version8.container > div.recommended-swipe.grid-anchor").remove()

}




)();
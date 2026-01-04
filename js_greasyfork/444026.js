// ==UserScript==
// @name         首页推荐布局优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除左侧轮播推荐，将部分隐藏的推荐视频展示
// @author       tuntun
// @match        https://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      AGPL-3.0
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/444026/%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/444026/%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
    .recommended-swipe {
  display: none;
}

@media (min-width: 1100px) and (max-width: 1366.9px) {
.recommend-container__2-line>*:nth-of-type(1n + 8) {
  display: block!important;
}
}

@media (min-width: 1367px) and (max-width: 1700.9px) {
.recommend-container__2-line>*:nth-of-type(1n + 8) {
  display: block!important;
}
}

@media (min-width: 1701px) and (max-width: 2199.9px) {
.recommend-container__2-line>*:nth-of-type(1n + 10) {
  display: block!important;
}
}



@media (min-width: 1701px) and (max-width: 2199.9px) {
  .bili-grid {
    grid-template-columns: repeat(5,1fr);
}
  .recommend-container__2-line {
    grid-column: span 5;
    grid-template-columns: repeat(5,1fr);
  }
}
    `)
    // Your code here...
})();
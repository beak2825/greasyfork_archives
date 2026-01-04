// ==UserScript==
// @name         巴哈隱藏ACG相關物件
// @author       SN-Koarashi (5026)
// @namespace    5026BAHA_gamer.com.tw
// @version      0.3
// @description  隱藏ACG相關物件，因為我覺得很礙眼
// @match        https://*.gamer.com.tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer.com.tw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472762/%E5%B7%B4%E5%93%88%E9%9A%B1%E8%97%8FACG%E7%9B%B8%E9%97%9C%E7%89%A9%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/472762/%E5%B7%B4%E5%93%88%E9%9A%B1%E8%97%8FACG%E7%9B%B8%E9%97%9C%E7%89%A9%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('#prjAcgEvent')?.remove();
    document.querySelector('.themepage-title-entrance')?.parentElement?.remove();
})();
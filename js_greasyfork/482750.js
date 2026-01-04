// ==UserScript==
// @name         B站 专栏复制粘贴板消毒
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除复制内容的 作者和来源【主要复制代码很烦，其他部内容呢，看你需求了】
// @author       You
// @match        https://www.bilibili.com/read/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482750/B%E7%AB%99%20%E4%B8%93%E6%A0%8F%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E6%9D%BF%E6%B6%88%E6%AF%92.user.js
// @updateURL https://update.greasyfork.org/scripts/482750/B%E7%AB%99%20%E4%B8%93%E6%A0%8F%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E6%9D%BF%E6%B6%88%E6%AF%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        document.addEventListener('copy', function(e) {
            e.stopImmediatePropagation();
        }, true);
    };
})();
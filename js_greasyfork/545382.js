// ==UserScript==
// @name         亚马逊关键词排名-Amazon keywords Positioning by Asin
// @namespace    http://tampermonkey.net/
// @version      3.10.1
// @description  1.在亚马逊搜索结果页上定位ASIN, 获取排名 2.代码重构————dom操作->fetch+DOMParser 3.结果面板 4.批量导入excel关键词表，返回关键词排名表.xlsx
// @author       You
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.ca/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.es/*
// @icon         https://www.amazon.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545382/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%85%B3%E9%94%AE%E8%AF%8D%E6%8E%92%E5%90%8D-Amazon%20keywords%20Positioning%20by%20Asin.user.js
// @updateURL https://update.greasyfork.org/scripts/545382/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%85%B3%E9%94%AE%E8%AF%8D%E6%8E%92%E5%90%8D-Amazon%20keywords%20Positioning%20by%20Asin.meta.js
// ==/UserScript==

(function(){
    // 更新结果面板展示方式、导出excel格式优化
    // 2025-09-02 广告位验证方式更新
    // 2025-09-03 asin、maxpage增加
    // 2025-09-15 asin增加到10个
    // 2025-09-16 fix download function
    var s = document.createElement('script');
    s.src = 'https://equalxp.github.io/AmzKwRS_cdn/core.js?t=' + Date.now();
    document.head.appendChild(s);
})();

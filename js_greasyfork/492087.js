// ==UserScript==
// @name         基于[Bilibili Evolved] 稍后再看页面去除广告区域
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  基于[Bilibili Evolved]对稍后再看中广告区域进行移除
// @author       lh-java
// @match        https://www.bilibili.com/watchlater/*
// @icon         https://cdn.jsdelivr.net/gh/the1812/Bilibili-Evolved@preview/images/logo-small.png
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/492087/%E5%9F%BA%E4%BA%8E%5BBilibili%20Evolved%5D%20%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E9%A1%B5%E9%9D%A2%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E5%8C%BA%E5%9F%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/492087/%E5%9F%BA%E4%BA%8E%5BBilibili%20Evolved%5D%20%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E9%A1%B5%E9%9D%A2%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E5%8C%BA%E5%9F%9F.meta.js
// ==/UserScript==

(function() {
    // 等待网页完成加载
    window.addEventListener('load', function() {
        // 加载完成后执行的代码
        var div = $(".z-top-container").css("min-height","70px");
        $(".bili-header__channel").remove();
        $(".international-footer").remove();
    }, false);
})();
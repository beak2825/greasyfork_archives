// ==UserScript==
// @name         NGA到达页面底部自动跳转下一页
// @namespace    https://ngabbs.com/
// @version      0.1
// @description  NGA到达页面底部自动跳转下一页，懒得翻页
// @author       zsjng
// @match        https://ngabbs.com/*

// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/486203/NGA%E5%88%B0%E8%BE%BE%E9%A1%B5%E9%9D%A2%E5%BA%95%E9%83%A8%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%8B%E4%B8%80%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/486203/NGA%E5%88%B0%E8%BE%BE%E9%A1%B5%E9%9D%A2%E5%BA%95%E9%83%A8%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%8B%E4%B8%80%E9%A1%B5.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var lastScrollTime = 0;


    // 自动点击后页
    function autoClickNextChapter() {
        var nextChapterLinks = document.querySelectorAll('a.uitxt1');
        // 检查是否有第二个元素
        if (nextChapterLinks.length >= 2) {
            // 点击第二个元素
            nextChapterLinks[1].click();
        }
    }

    // 滚动到页面底部时自动点击下一章链接
    function handleScroll() {
        var currentTime = new Date().getTime();
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight && (currentTime - lastScrollTime) > 5000) {
            autoClickNextChapter();
            lastScrollTime = currentTime;
        }
    }
    window.addEventListener('scroll', handleScroll);
})();

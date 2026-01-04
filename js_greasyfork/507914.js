// ==UserScript==
// @name         今日头条宽屏展示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  尝试在油猴上删除今日头条的右侧边栏并宽屏展示左侧内容
// @author       dst1213
// @match        *://www.toutiao.com/*
// @grant        none
// @license      Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/507914/%E4%BB%8A%E6%97%A5%E5%A4%B4%E6%9D%A1%E5%AE%BD%E5%B1%8F%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/507914/%E4%BB%8A%E6%97%A5%E5%A4%B4%E6%9D%A1%E5%AE%BD%E5%B1%8F%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 删除右侧边栏
    var rightSidebar = document.querySelector('.right-sidebar');
    if (rightSidebar) {
        rightSidebar.remove();
    }

    // 使左侧内容宽屏展示
    var leftSidebar = document.querySelector('.left-sidebar');
    if (leftSidebar) {
        leftSidebar.style.width = '100%';
    }

    // 可能需要调整的其他样式
    var mainContent = document.querySelector('.main');
    if (mainContent) {
        mainContent.style.width = '100%';
        mainContent.style.marginLeft = '0';
    }
})();
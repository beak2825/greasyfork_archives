// ==UserScript==
// @name         课堂派刷课件小工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动点击下一页
// @author       Moran
// @match       *://www.ketangpai.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515995/%E8%AF%BE%E5%A0%82%E6%B4%BE%E5%88%B7%E8%AF%BE%E4%BB%B6%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/515995/%E8%AF%BE%E5%A0%82%E6%B4%BE%E5%88%B7%E8%AF%BE%E4%BB%B6%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to click buttons
    function clickButtons() {
        const buttons = document.querySelectorAll('.el-icon-caret-right');
        buttons.forEach(button => button.click());
    }

    // Set interval to click buttons every second
    setInterval(clickButtons, 1000);
})();

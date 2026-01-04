// ==UserScript==
// @name         雨课堂小助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  雨课堂：屏蔽“当前页面有动画，请先听老师讲解”字样，显示对应的图片。
// @author       Lucas
// @match        https://pro.yuketang.cn/lesson/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yuketang.cn
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451398/%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/451398/%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(function() {
        $('.slide__cmp').css('display', 'block');
        $('.slide__cmp').css('z-index', '100');
    }, 300);
})();

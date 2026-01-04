// ==UserScript==
// @name         知乎标题隐藏
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://*.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418931/%E7%9F%A5%E4%B9%8E%E6%A0%87%E9%A2%98%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/418931/%E7%9F%A5%E4%B9%8E%E6%A0%87%E9%A2%98%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName('PageHeader')[0].style.display = 'none'
    windowAddMouseWheel();
    function windowAddMouseWheel() {
        var scrollFunc = function (e) {
            e = e || window.event;
            if (e.wheelDelta) {//浏览器兼容
                if (e.wheelDelta > 0) { //当滑轮向上滚动时
                    document.getElementsByClassName('Sticky')[0].style.display = 'block'
                }
                if (e.wheelDelta < 0) { //当滑轮向下滚动时
                    document.getElementsByClassName('Sticky')[0].style.display = 'none'
                }
            } else if (e.detail) {
                if (e.detail> 0) { //当滑轮向上滚动时
                    document.getElementsByClassName('Sticky')[0].style.display = 'block'
                }
                if (e.detail< 0) { //当滑轮向下滚动时
                    document.getElementsByClassName('Sticky')[0].style.display = 'none'
                }
            }
        };
        //给页面绑定滑轮滚动事件
        if (document.addEventListener) {
            document.addEventListener('DOMMouseScroll', scrollFunc, false);
        }
        //滚动滑轮触发scrollFunc方法
        window.onmousewheel = document.onmousewheel = scrollFunc;
}
})();
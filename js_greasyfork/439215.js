// ==UserScript==
// @name         Horizontal First Scroll | 横向优先滚动
// @namespace    https://userscript.snomiao.com/
// @version      1.0
// @description  (20200409)Page elements prefer to scroll horizontally, scroll to end and then scroll vertically, suitable for SNOREAD.userscript.js | 页面元素优先横向滚动，滚动到底再进行竖向滚动，适用于雪阅插件
// @author       snomiao@gmail.com
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439215/Horizontal%20First%20Scroll%20%7C%20%E6%A8%AA%E5%90%91%E4%BC%98%E5%85%88%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/439215/Horizontal%20First%20Scroll%20%7C%20%E6%A8%AA%E5%90%91%E4%BC%98%E5%85%88%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

// 横向滚动
(function () {
    "use strict";
    var 监听滚动 = (e) => {
        [...e.children].map(监听滚动);
        if (e.flag_已监听滚动) return;
        e.flag_已监听滚动 = 1;

        var handleScroll = (事件) => {
            if (事件.altKey || 事件.ctrlKey || 事件.shiftKey) return;
            var scrollRate = (事件.detail || -事件.wheelDelta) / 120; //Y轴
            var scrolled_x =
                e.scrollLeft !=
                ((e.scrollLeft += scrollRate * e.clientWidth * 0.1),
                e.scrollLeft);
            if (scrolled_x) {
                // 若需定位则撤销滚动
                var 当前Y = e.getBoundingClientRect().y;
                e.scrollIntoViewIfNeeded();
                if (e.getBoundingClientRect().y != 当前Y)
                    e.scrollLeft -= scrollRate * e.clientWidth * 0.1;
                //
                事件.preventDefault();
                事件.stopPropagation();
                return false;
            }
            var scrolled_y =
                e.scrollTop !=
                ((e.scrollTop += scrollRate * e.clientHeight * 0.5),
                e.scrollTop);
            if (scrolled_y) {
                var 当前X = e.getBoundingClientRect().x;
                e.scrollIntoViewIfNeeded();
                if (e.getBoundingClientRect().x != 当前X)
                    e.scrollTop -= scrollRate * e.clientHeight * 0.5;
                //
                事件.preventDefault();
                事件.stopPropagation();
                return false;
            }
            // 横竖都滚到底了
            [...e.children].map(监听滚动);
        };
        e.addEventListener("mousewheel", handleScroll, {
            capture: false,
            passive: false,
        }); // Chrome/Edge
        e.addEventListener("DOMMouseScroll", handleScroll, {
            capture: false,
            passive: false,
        }); // FF
    };
    var 入口 = () => 监听滚动(document.body);
    document.addEventListener("DOMContentLoaded", 入口);
    window.addEventListener("load", 入口);
    入口();
})();

// ==UserScript==
// @name         吾爱破解论坛左侧文章目录可滚动
// @namespace    https://www.52pojie.cn/thread-712090-1-1.html
// @version      0.1
// @description  吾爱破解论坛左侧文章目录可滚动，鼠标滚轮可以上下移动较长的目录
// @author       Ganlv
// @match        https://www.52pojie.cn/*
// @icon         https://www.52pojie.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381804/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E5%B7%A6%E4%BE%A7%E6%96%87%E7%AB%A0%E7%9B%AE%E5%BD%95%E5%8F%AF%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/381804/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E5%B7%A6%E4%BE%A7%E6%96%87%E7%AB%A0%E7%9B%AE%E5%BD%95%E5%8F%AF%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

(function () {
    var tocSideElements = document.querySelectorAll('.toc-side');
    window.addEventListener('scroll', function (e) {
        for (var i = 0; i < tocSideElements.length; ++i) {
            var tocSide = tocSideElements[i];
            var tocSideRect = tocSide.getBoundingClientRect();
            var tocSideMarginBottom = parseInt(window.getComputedStyle(tocSide).getPropertyValue('margin-bottom'));
            var tocSideHeight = window.innerHeight - tocSideMarginBottom - tocSideRect.top;
            if (tocSideHeight < tocSide.scrollHeight) {
                tocSide.style.height = tocSideHeight + 'px';
            } else {
                tocSide.style.height = '';
            }
        }
    });
    for (var i = 0; i < tocSideElements.length; ++i) {
        (function (tocSide) {
            tocSide.addEventListener('wheel', function (e) {
                if (e.deltaY > 0 && tocSide.scrollTop + tocSide.offsetHeight > tocSide.scrollHeight - 1
                    || e.deltaY < 0 && tocSide.scrollTop < 1) {
                    e.preventDefault();
                }
            });
        })(tocSideElements[i]);
    }
    var style = document.createElement('style');
    style.textContent = '.toc-side { overflow-y: scroll; } .toc-side::-webkit-scrollbar { width: 0 !important; }';
    document.querySelector('head').appendChild(style);
})();
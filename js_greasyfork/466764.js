// ==UserScript==
// @name         知乎数值转换
// @namespace    https://github.com/shiquda/shiquda_UserScript
// @supportURL   https://github.com/shiquda/shiquda_UserScript/issues
// @version      0.1
// @description  知乎数值转换，用于较大数据的转换，如浏览次数可显示xx.xx万或亿
// @author       shiquda
// @match        https://www.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466764/%E7%9F%A5%E4%B9%8E%E6%95%B0%E5%80%BC%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/466764/%E7%9F%A5%E4%B9%8E%E6%95%B0%E5%80%BC%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const figures = document.querySelectorAll(".NumberBoard-itemValue")
    if (!figures) return
    for (var i = 0; i < figures.length; i++) {
        figures[i].textContent = `${toChineseNum(figures[i].title, 2)}`
    }

    function toChineseNum(num, fig) {
        const len = num.length
        if (len < 5) return num
        else if (len < 9) return ((num / 1e4).toFixed(fig) + "万")
        else return ((num / 1e8).toFixed(2) + "亿")
    }

    // Your code here...
})();
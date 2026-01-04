// ==UserScript==
// @name         知乎标题隐藏-监听鼠标事件版
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  知乎标题隐藏,Stop social death when fishing
// @author       sdujava2011
// @match        *://www.zhihu.com/*
// @match        *://www2.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546758/%E7%9F%A5%E4%B9%8E%E6%A0%87%E9%A2%98%E9%9A%90%E8%97%8F-%E7%9B%91%E5%90%AC%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/546758/%E7%9F%A5%E4%B9%8E%E6%A0%87%E9%A2%98%E9%9A%90%E8%97%8F-%E7%9B%91%E5%90%AC%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("scroll", handleScroll, true); //监听滚动事件

    function handleScroll() {
        var elements = document.getElementsByClassName('QuestionHeader-title');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = 'none';
        }
    }
    //
})();
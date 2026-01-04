// ==UserScript==
// @name         删除烦人的插件拦截提醒
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove specified element once
// @author       Nchyn
// @match        *://*.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490695/%E5%88%A0%E9%99%A4%E7%83%A6%E4%BA%BA%E7%9A%84%E6%8F%92%E4%BB%B6%E6%8B%A6%E6%88%AA%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/490695/%E5%88%A0%E9%99%A4%E7%83%A6%E4%BA%BA%E7%9A%84%E6%8F%92%E4%BB%B6%E6%8B%A6%E6%88%AA%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 删除指定的元素
    const elementToRemove = document.querySelector('div.adblock-tips');
    if (elementToRemove) {
        elementToRemove.remove();
    }
})();

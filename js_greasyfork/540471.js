// ==UserScript==
// @name        飞牛浏览器标题修改
// @version     1.0.4
// @namespace   https://github.com/g0ngjie/tkscript/fnos/index.js
// @match       *://*.5ddd.com/*
// @match       *://*.fnos.net/*
// @match       *://fn.*.com/*
// @grant       none
// @author      Gj
// @license     MIT License
// @description 2025/6/23 10:46:16
// @downloadURL https://update.greasyfork.org/scripts/540471/%E9%A3%9E%E7%89%9B%E6%B5%8F%E8%A7%88%E5%99%A8%E6%A0%87%E9%A2%98%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/540471/%E9%A3%9E%E7%89%9B%E6%B5%8F%E8%A7%88%E5%99%A8%E6%A0%87%E9%A2%98%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const rTitle = '百度一下'
    const rIco = "https://www.baidu.com/favicon.ico";

    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
    }
    favicon.href = rIco;

    const targetNode = document.querySelector('title');
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            console.log('Title changed to:', mutation.target.textContent);
            if (mutation.target.textContent != rTitle) document.title = rTitle
        });
    });
    const config = {
        subtree: true,
        characterData: true,
        childList: true
    };
    if (targetNode) observer.observe(targetNode, config);
}());
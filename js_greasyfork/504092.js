// ==UserScript==
// @name         萌娘百科黑幕去除
// @namespace    ack20a@gmail.com
// @version      0.1.1
// @description  去除萌娘百科、灰机wiki等网站的“黑幕”并用方框代替
// @author       ack20
// @match        *://moegirl.icu/*
// @match        *://zh.moegirl.org.cn/*
// @match        *://mzh.moegirl.org.cn/*
// @match        *://*.hmoegirl.com/*
// @match        *://*.huijiwiki.com/*
// @match        *://*.moegirl.uk/*
// @grant        none
// @run-at       document-end
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/504092/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E9%BB%91%E5%B9%95%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/504092/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E9%BB%91%E5%B9%95%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const heimuElements = document.querySelectorAll('.heimu');

    heimuElements.forEach(element => {
        // 创建一个新的span元素
        const newSpan = document.createElement('span');

        // 获取黑幕内容和标题
        const content = element.textContent;
        const title = element.getAttribute('title');

        // 将黑幕内容和标题添加到新的span元素
        newSpan.textContent = content;
        newSpan.title = title;

        // 为新的span元素添加样式
        newSpan.style.border = '1px solid #858585';

        // 将新的span元素替换黑幕元素
        element.parentNode.replaceChild(newSpan, element);
    });
})();
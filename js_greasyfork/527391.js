// ==UserScript==
// @name         西子湖畔样式加重
// @namespace    https://bbs.xizi.com/
// @version      1.0
// @description  西子湖畔网站字重加粗
// @author       XiaoMao
// @match        https://bbs.xizi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xizi.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527391/%E8%A5%BF%E5%AD%90%E6%B9%96%E7%95%94%E6%A0%B7%E5%BC%8F%E5%8A%A0%E9%87%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/527391/%E8%A5%BF%E5%AD%90%E6%B9%96%E7%95%94%E6%A0%B7%E5%BC%8F%E5%8A%A0%E9%87%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数来设置 <a> 标签的字体加粗
    function setBoldFont() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            link.style.setProperty('font-weight', 'bold', 'important');
        });
    }

    // 初始化时先执行一次
    setBoldFont();

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(() => {
        setBoldFont();
    });

    // 开始监听整个文档的变化
    observer.observe(document.body, {
        childList: true, // 监听子节点的添加或删除
        subtree: true    // 监听所有后代节点
    });
})();
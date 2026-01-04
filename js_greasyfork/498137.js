// ==UserScript==
// @name         WX-del-css
// @namespace    http://your-namespace
// @version      2.1
// @description  删除右上角无用元素
// @author       刚学会做蛋饼
// @license      MIT
// @match        https://wanx.myapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498137/WX-del-css.user.js
// @updateURL https://update.greasyfork.org/scripts/498137/WX-del-css.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义要删除的CSS选择器
    const cssSelectorsToDelete = [
        '.el-message-box__wrapper[style*="z-index: 2002"]', // 首页未处理弹窗
        '.v-modal[style*="z-index: 2001"]', // 首页蒙版阴影
        '.v-modal[style*="z-index: 2005"]', // 监控页面蒙版1
        '.el-message-box', // 监控页面未处理弹窗
        '.el-message-box__wrapper[style*="z-index: 2001"]', // 监控页蒙版阴影1
        '.v-modal[style*="z-index: 2000"]', // 监控页蒙版阴影2
        '.el-message-box__wrapper[style*="z-index: 2003"]', // 审核页面蒙版
        '.v-modal[style*="z-index: 2002"]', // 审核页面蒙版2
        '.el-message-box__wrapper[style*="z-index: 2012"]', // 监控页面蒙版（z-index: 2012）
        '.el-message-box__wrapper[style*="z-index: 2004"]', // 审核蒙版（z-index: 2004）
        'div.v-modal', // 其他阴影蒙版
    ];

    // 创建MutationObserver以监视内容变化
    const observer = new MutationObserver(() => {
        removeElements();
    });

    // 配置MutationObserver以监视子节点变化
    const config = { childList: true, subtree: true };

    // 启动MutationObserver
    observer.observe(document.body, config);

    // 定时器：每隔一段时间检查并删除元素
    setInterval(removeElements, 3000); // 每秒执行一次

    // 删除元素的函数
    function removeElements() {
        cssSelectorsToDelete.forEach(selector => {
            const elementsToDelete = document.querySelectorAll(selector);
            elementsToDelete.forEach(element => {
                element.remove();
            });
        });
    }
})();

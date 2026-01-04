// ==UserScript==
// @name         解除tcpc.org.cn右键屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解除tcpc.org.cn网站对鼠标右键的屏蔽
// @author       loure
// @match        https://www.tcpc.org.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538959/%E8%A7%A3%E9%99%A4tcpcorgcn%E5%8F%B3%E9%94%AE%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/538959/%E8%A7%A3%E9%99%A4tcpcorgcn%E5%8F%B3%E9%94%AE%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 禁用右键菜单事件
    document.addEventListener('contextmenu', function(e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
    }, true);

    // 禁用选择限制
    document.addEventListener('selectstart', function(e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
    }, true);

    // 禁用鼠标按下事件拦截
    document.addEventListener('mousedown', function(e) {
        if (e.button === 2) { // 右键
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }, true);

    // 移除可能存在的全局事件监听
    function removeEventListeners() {
        ['contextmenu', 'selectstart', 'mousedown', 'mouseup', 'click'].forEach(event => {
            window[`on${event}`] = null;
            document[`on${event}`] = null;
            document.body[`on${event}`] = null;
        });
    }

    // 页面加载完成后执行
    window.addEventListener('load', removeEventListeners);

    // 处理动态加载的内容
    const observer = new MutationObserver(removeEventListeners);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
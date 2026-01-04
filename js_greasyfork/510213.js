// ==UserScript==
// @name         生财有术-去除复制限制和水印
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去掉特定水印元素和复制、剪切限制
// @match        https://scys.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510213/%E7%94%9F%E8%B4%A2%E6%9C%89%E6%9C%AF-%E5%8E%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%E5%92%8C%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/510213/%E7%94%9F%E8%B4%A2%E6%9C%89%E6%9C%AF-%E5%8E%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%E5%92%8C%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 删除特定水印元素
    const removeWatermark = () => {
        const watermarkElement = document.getElementById('w_vm_id_3.14159'); // 替换为实际水印 ID
        if (watermarkElement) {
            watermarkElement.remove();
            console.log("已删除水印");
        }
    };

    // 禁用右键菜单限制
    document.addEventListener('contextmenu', (event) => {
        event.stopPropagation();
        return true;
    }, true);

    // 允许选择文本
    document.addEventListener('selectstart', (event) => {
        event.stopPropagation();
        return true;
    }, true);

    // 允许复制
    document.addEventListener('copy', (event) => {
        event.stopPropagation();
        return true;
    }, true);

    // 允许剪切
    document.addEventListener('cut', (event) => {
        event.stopPropagation();
        return true;
    }, true);

    // 移除所有元素上可能存在的复制限制
    const removeEventListeners = () => {
        const elements = document.getElementsByTagName('*');
        for (let element of elements) {
            element.oncopy = null;
            element.oncut = null;
            element.onselectstart = null;
            element.oncontextmenu = null;
        }
    };

    // 观察 DOM 变化以确保动态加载的水印也被移除，并重新应用事件处理
    const observer = new MutationObserver(() => {
        removeWatermark();
        removeEventListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 初始调用
    removeWatermark();
    removeEventListeners();

    // 覆盖可能存在的全局函数
    window.addEventListener('load', () => {
        if (typeof window.disableCopy === 'function') {
            window.disableCopy = function() { return true; };
        }
        if (typeof window.disableCut === 'function') {
            window.disableCut = function() { return true; };
        }
    });

})();

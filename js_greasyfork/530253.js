// ==UserScript==
// @name         去manwa检测广告弹窗-强制方法
// @namespace    pipi
// @version      0.8
// @description  强制拦截manwa广告检测
// @run-at       document-start
// @match        https://manwa.me/chapter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530253/%E5%8E%BBmanwa%E6%A3%80%E6%B5%8B%E5%B9%BF%E5%91%8A%E5%BC%B9%E7%AA%97-%E5%BC%BA%E5%88%B6%E6%96%B9%E6%B3%95.user.js
// @updateURL https://update.greasyfork.org/scripts/530253/%E5%8E%BBmanwa%E6%A3%80%E6%B5%8B%E5%B9%BF%E5%91%8A%E5%BC%B9%E7%AA%97-%E5%BC%BA%E5%88%B6%E6%96%B9%E6%B3%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 拦截可能创建弹窗的脚本
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(this, tagName);

        if (tagName.toLowerCase() === 'div') {
            const originalSetAttribute = element.setAttribute;
            element.setAttribute = function(name, value) {
                originalSetAttribute.call(this, name, value);

                // 检查是否是弹窗相关属性
                if ((name === 'class' && value.includes('modal')) ||
                    (name === 'style' && value.includes('fixed'))) {
                    console.log('拦截潜在弹窗元素创建');
                }
            };
        }
        return element;
    };

    // 覆盖alert显示方法（针对自定义alert）
    window.alert = function() {
        const message = arguments[0] || '';
        if (message.includes('请关闭阻挡广告插件') || message.includes('manwa.me')) {
            console.log('拦截广告检测alert:', message);
            return;
        }
        // 其他正常alert允许通过
        return Function.prototype;
    };

    // 定期清理弹窗
    setInterval(() => {
        const modals = document.querySelectorAll('div[style*="fixed"], div[style*="absolute"]');
        modals.forEach(modal => {
            if (modal.textContent.includes('请关闭阻挡广告插件') ||
                modal.textContent.includes('manwa.me 显示')) {
                modal.remove();
                console.log('已移除广告弹窗');
            }
        });
    }, 1000);
})();
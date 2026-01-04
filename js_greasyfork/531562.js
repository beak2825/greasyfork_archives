// ==UserScript==
// @name         解除日期限制
// @namespace    http://tampermonkey.net/
// @version      2025-03-28
// @description  解除页面选择日期的限制
// @license      MIT
// @author       Lmt
// @match        https://*.flightroutes24.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flightroutes24.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531562/%E8%A7%A3%E9%99%A4%E6%97%A5%E6%9C%9F%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/531562/%E8%A7%A3%E9%99%A4%E6%97%A5%E6%9C%9F%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听指定元素的属性变化
    function observeDisabledAttr(element) {
        if (!element) return;
        const observer = new MutationObserver(mutationsList => {
            mutationsList.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
                    if (element.disabled) {
                        element.removeAttribute('disabled');
                        // 同时可恢复样式
                        element.style.opacity = '1';
                        element.style.cursor = 'pointer';
                        console.log(`已移除 ${element.id} 的 disabled 属性`);
                    }
                }
            });
        });
        observer.observe(element, { attributes: true });
    }

    // 页面加载完成后执行
    window.addEventListener('load', () => {
        const startElem = document.getElementById('startCreateTimeID');
        const endElem = document.getElementById('endCreateTimeID');
        observeDisabledAttr(startElem);
        observeDisabledAttr(endElem);
    });

})();
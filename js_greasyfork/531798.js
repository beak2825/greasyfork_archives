// ==UserScript==
// @name         Libvio Auto Click Reminder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动点击libvio网站的"我记住啦"按钮
// @author       AlexShui
// @include      /^https?:\/\/(.*\.)?libvio\..+\//
// @match        *libvio*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/531798/Libvio%20Auto%20Click%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/531798/Libvio%20Auto%20Click%20Reminder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickRememberButton() {
        // 查找弹出框
        const popup = document.querySelector('div.popup[id="note"]');
        if (popup && popup.style.display === 'block') {
            // 查找按钮
            const button = popup.querySelector('div.popup-footer > span.popup-btn');
            if (button) {
                console.log('找到"我记住啦"按钮，正在点击...');
                button.click();
                return true;
            }
        }
        return false;
    }

    function checkAndClick() {
        // 尝试点击按钮
        if (clickRememberButton()) {
            console.log('已成功点击"我记住啦"按钮');
            return;
        }

        // 如果没找到，设置一个观察器来监测DOM变化
        const observer = new MutationObserver(function(mutations) {
            if (clickRememberButton()) {
                observer.disconnect();
            }
        });

        // 开始观察整个文档及其子节点的变化
        observer.observe(document, {
            childList: true,
            subtree: true
        });

        // 设置超时以防元素永远不出现
        setTimeout(() => {
            observer.disconnect();
            console.log('等待超时，未找到"我记住啦"按钮');
        }, 10000); // 10秒超时
    }
    
    checkAndClick();
    // alert("have run js.")
    // 页面加载完成后开始检查
    window.addEventListener('load', function() {
        setTimeout(checkAndClick, 1000); // 延迟1秒开始检查，确保所有元素加载完成
    });

    // 也监听SPA的路由变化
    let lastUrl = location.href;
    setInterval(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            setTimeout(checkAndClick, 1000);
        }
    }, 500);
})();
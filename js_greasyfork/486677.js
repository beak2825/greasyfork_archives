// ==UserScript==
// @name         通义千问舒服使用
// @namespace    http://www.example.com
// @version      1.0
// @description  自动点击刷新；CMD+K新建会话快捷键；放大聊天框，屏蔽头尾
// @match        https://tongyi.aliyun.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486677/%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE%E8%88%92%E6%9C%8D%E4%BD%BF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/486677/%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE%E8%88%92%E6%9C%8D%E4%BD%BF%E7%94%A8.meta.js
// ==/UserScript==

(function () {
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
            // 使用querySelectorAll获取所有button元素，然后使用Array.from将其转换为数组
            var buttons = Array.from(document.querySelectorAll('button'));
            // 使用filter方法过滤出类名中包含特定文本片段的按钮
            var targetButton = buttons.filter(button => {
                // 这里假设你想要匹配的类名片段是"okBtn--"
                return Array.from(button.classList).some(className => className.includes('okBtn--'));
            })[0]; // 获取第一个匹配的按钮

            if (targetButton) {
                targetButton.click();
            }
        }
    });

    // 新建会话快捷键
    document.addEventListener('keydown', function (e) {
        if (e.metaKey && e.key === 'k') { // CMD+K
            var addButton = Array.from(document.querySelectorAll('button')).filter(button => {
                return Array.from(button.classList).some(className => className.includes('addBtn'));
            })[0]; // 获取第一个匹配的按钮

            if (addButton) {
                addButton.click();
            }

            // 设置焦点
            var primaryTextarea = document.getElementById('primary-text-textarea');
            if (primaryTextarea) {
                primaryTextarea.focus();
            }
        }
    });

    // 屏蔽head
    window.addEventListener('load', function () {
        var headElement = document.querySelector('div[class^="head"]');
        if (headElement) {
            headElement.style.display = 'none';
        }

        // 配合head的屏蔽，调整页面样式，铺满全局屏幕
        var contentWrapElement = document.querySelector('div[class^="contentWrap"]');
        if (contentWrapElement) {
            contentWrapElement.style.height = 'calc(100%)';
        }

        var footerElement = document.querySelector('div[class^="footer"]');
        if (footerElement) {
            footerElement.style.display = 'none';
        }

        // 配合head的屏蔽，调整页面样式，铺满全局屏幕
        var mainElement = document.querySelector('div[class^="main"]');
        if (mainElement) {
            mainElement.style.marginBottom = '0';
        }
    });

})();

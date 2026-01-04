// ==UserScript==
// @name         Google AI Studio Autosave Auto-Enable
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  自动保持Google AI Studio的Autosave开关处于开启状态
// @author       You
// @match        https://aistudio.google.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539711/Google%20AI%20Studio%20Autosave%20Auto-Enable.user.js
// @updateURL https://update.greasyfork.org/scripts/539711/Google%20AI%20Studio%20Autosave%20Auto-Enable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查并开启autosave开关的函数
    function enableAutosave() {
        // 查找autosave按钮
        const button = document.querySelector('button[aria-label="Autosave toggle"]');

        if (button) {
            // 检查开关是否关闭
            const isDisabled = button.getAttribute('aria-checked') === 'false' ||
                             button.classList.contains('mdc-switch--unselected');

            if (isDisabled) {
                console.log('Autosave is disabled, enabling it...');
                button.click();
                console.log('Autosave enabled!');
            }
        }
    }

    // 使用MutationObserver监控DOM变化
    const observer = new MutationObserver((mutations) => {
        // 检查是否有相关的DOM变化
        for (let mutation of mutations) {
            if (mutation.type === 'attributes') {
                const target = mutation.target;

                // 检查是否是autosave按钮的属性变化
                if (target.matches && target.matches('button[aria-label="Autosave toggle"]')) {
                    enableAutosave();
                }

                // 检查是否是父级元素的class变化
                if (target.matches && target.matches('mat-slide-toggle')) {
                    enableAutosave();
                }
            }
        }
    });

    // 配置观察选项
    const observerConfig = {
        attributes: true,
        attributeFilter: ['class', 'aria-checked'],
        subtree: true,
        childList: true
    };

    // 等待页面加载并初始化
    function init() {
        // 首次检查并启用
        enableAutosave();

        // 开始监控DOM变化
        observer.observe(document.body, observerConfig);

        // 定期检查（作为备份机制）
        setInterval(enableAutosave, 5000); // 每5秒检查一次
    }

    // 等待页面完全加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // 对于Angular应用，可能需要额外的延迟
        setTimeout(init, 2000);
    }

})();

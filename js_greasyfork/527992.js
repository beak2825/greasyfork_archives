// ==UserScript==
// @name         国家智慧教育平台职教专用|去弹窗
// @namespace    http://tampermonkey.net/
// @version      2025.2.25.1.000-hotfix
// @description  精准处理学习完成弹窗
// @author       deepseek
// @match        https://core.teacher.vocational.smartedu.cn/p/course/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/527992/%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%81%8C%E6%95%99%E4%B8%93%E7%94%A8%7C%E5%8E%BB%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/527992/%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%81%8C%E6%95%99%E4%B8%93%E7%94%A8%7C%E5%8E%BB%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 弹窗处理专用配置
    const popupConfig = {
        checkInterval: 1000,      // 弹窗检测间隔
        maxAttempts: 5,           // 最大尝试次数
        zIndexThreshold: 19891014 // 弹窗最小z-index
    };

    let popupAttempts = 0;

    // 弹窗检测专用观察器
    const observer = new MutationObserver((mutations) => {
        if (popupAttempts >= popupConfig.maxAttempts) return;

        const popup = [...document.querySelectorAll('.layui-layer')]
            .filter(layer => {
                const zIndex = parseInt(layer.style.zIndex || 0);
                return zIndex >= popupConfig.zIndexThreshold;
            })
            .sort((a, b) =>
                parseInt(b.style.zIndex) - parseInt(a.style.zIndex)
            )[0];

        if (popup) {
            const confirmBtn = popup.querySelector('.layui-layer-btn0');
            if (confirmBtn) {
                // 模拟真实点击事件链
                const clickEvents = ['mousedown', 'mouseup', 'click'];
                clickEvents.forEach(eventType => {
                    confirmBtn.dispatchEvent(new MouseEvent(eventType, {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    }));
                });

                console.log('成功关闭弹窗');
                popupAttempts = 0;

                // 强制移除弹窗残留
                setTimeout(() => {
                    popup.style.display = 'none';
                    popup.remove();
                }, 500);
            } else {
                popupAttempts++;
            }
        }
    });

    // 启动观察
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });

    // 备用定时器检测
    setInterval(() => {
        const popup = document.querySelector('.layui-layer-btn0');
        if (popup) {
            popup.click();
            console.log('定时器检测关闭弹窗');
        }
    }, 2000);

    // 样式清理（可选）
    GM_addStyle(`
        .layui-layer.layui-layer-page {
            display: none !important;
        }
    `);
})();

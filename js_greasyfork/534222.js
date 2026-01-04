// ==UserScript==
// @name         TAPD超限弹窗终极处理
// @namespace    http://tapd-script/
// @version      3.0
// @description  自动关闭TAPD"授权人数已超上限"的弹窗
// @author       Clint
// @match        https://www.tapd.cn/*
// @icon         https://www.tapd.cn/favicon.ico
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534222/TAPD%E8%B6%85%E9%99%90%E5%BC%B9%E7%AA%97%E7%BB%88%E6%9E%81%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/534222/TAPD%E8%B6%85%E9%99%90%E5%BC%B9%E7%AA%97%E7%BB%88%E6%9E%81%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 原子级配置
    const ATOMIC_CONFIG = {
        DIALOG_WRAPPER: 'div.el-dialog__wrapper.company-renew-dialog', // 带遮罩层的容器
        TARGET_DIALOG: 'div.el-dialog[aria-label="dialog"]', // 目标弹窗
        HEADER_BUTTON: 'button.el-dialog__headerbtn', // 头部关闭按钮
        CONTENT_MARKER: '授权人数已超上限', // 内容特征
    };


    // 高性能观察器
    const observer = new MutationObserver((mutations) => {
        // 突变类型过滤优化
        for (const mutation of mutations) {
            // 仅处理节点添加类型的变更
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // DOM变化应急响应
                if (nuclearResponse()) {
                    // observer.disconnect();
                    // return;
                }
            }
        }
    });

    // 核级响应函数
    function nuclearResponse() {
        const wrapper = document.querySelector(ATOMIC_CONFIG.DIALOG_WRAPPER);
        if (!wrapper) return false;
        // 内容特征验证
        const dialog = wrapper.querySelector(ATOMIC_CONFIG.TARGET_DIALOG);
        if (dialog && dialog.textContent.includes(ATOMIC_CONFIG.CONTENT_MARKER)) {
            // 优先执行标准关闭流程
            const closeBtn = dialog.querySelector(ATOMIC_CONFIG.HEADER_BUTTON);
            if (closeBtn) {
                closeBtn.click();
            } else {
                // 应急清除协议
                wrapper.remove();
                document.body.style.overflow = 'visible';
            }
            return true;
        }
        return false;
    }

    // 启动观察协议
    function init() {
        // 初始扫描确保无残留
        if (nuclearResponse()) return;
        // 深度监控配置
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
        // 防漏网二次检测
        requestAnimationFrame(() => nuclearResponse());
    }

    // 执行入口
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
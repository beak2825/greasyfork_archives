// ==UserScript==
// @name         Pixian.ai 自动确认预裁剪弹窗
// @namespace    /
// @version      1.3
// @description  自动点击Pre-Crop弹窗的OK按钮，支持所有上传方式
// @author       DeepSeek-R1
// @match        https://pixian.ai/*
// @icon         https://dq2gn5p12glyq.cloudfront.net/p/assets/logos/pixian-ai-logo_20243d2bf2c0dba61b56e66cb5c4b50e.svg
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528223/Pixianai%20%E8%87%AA%E5%8A%A8%E7%A1%AE%E8%AE%A4%E9%A2%84%E8%A3%81%E5%89%AA%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/528223/Pixianai%20%E8%87%AA%E5%8A%A8%E7%A1%AE%E8%AE%A4%E9%A2%84%E8%A3%81%E5%89%AA%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 精准定位元素
    const CONFIRM_BUTTON_CLASS = 'PreCrop-Sidebar-crop_button';
    
    // 增强型点击检测
    function handlePreCropModal() {
        // 查找所有可能存在的确认按钮
        const buttons = [...document.getElementsByClassName(CONFIRM_BUTTON_CLASS)];
        
        // 过滤可见的有效按钮
        const activeButton = buttons.find(btn => {
            return btn.offsetParent !== null &&   // 可见性检查
                   btn.innerText.trim() === 'OK' && // 文本验证
                   btn.getBoundingClientRect().width > 0 // 真实渲染验证
        });

        if (activeButton) {
            console.log('[智能触发] 捕获到预裁剪确认按钮');
            activeButton.click();
            return true;
        }
        return false;
    }

    // 双重检测机制
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                handlePreCropModal();
            }
        });
    });

    // 启动深度监控
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false
    });

    // 定时扫描保障（优化频率）
    setInterval(() => {
        if (!handlePreCropModal()) return;
        console.debug('[周期检测] 弹窗已处理');
    }, 500);

    // 防抖动机制
    let lastClick = 0;
    window.addEventListener('click', e => {
        if (e.target.classList.contains(CONFIRM_BUTTON_CLASS)) {
            lastClick = Date.now();
        }
    }, true);
})();

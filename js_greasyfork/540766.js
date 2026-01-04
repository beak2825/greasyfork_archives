// ==UserScript==
// @name         不太灵VIP
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  删除不太灵的VIP查看限制和模糊效果
// @author       kkzh
// @match        https://*.mukaku.com/*
// @match        https://www.butai0.club/*
// @match        https://www.butai0.xyz/*
// @match        https://www.butai0.dev/*
// @match        https://www.butai0.vip/*
// @match        https://www.butai0.one/*
// @match        https://www.0bt0.com/*
// @match        https://www.1bt0.com/*
// @match        https://www.2bt0.com/*
// @match        https://www.3bt0.com/*
// @match        https://www.4bt0.com/*
// @match        https://www.5bt0.com/*
// @match        https://www.6bt0.com/*
// @match        https://www.7bt0.com/*
// @match        https://www.8bt0.com/*
// @match        https://www.9bt0.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540766/%E4%B8%8D%E5%A4%AA%E7%81%B5VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/540766/%E4%B8%8D%E5%A4%AA%E7%81%B5VIP.meta.js
// ==/UserScript==
(function() {
    'use strict';
 
    // 删除模糊效果的函数
    function removeBlurEffect() {
        let removedCount = 0;
 
        // 方法1: 查找包含模糊效果的元素（通过style属性）
        const blurredElements = document.querySelectorAll('div[style*="filter: blur"], div[style*="filter:blur"]');
        blurredElements.forEach(element => {
            element.style.filter = '';
            element.style.opacity = '';
            element.style.pointerEvents = '';
            element.style.userSelect = '';
            removedCount++;
        });
 
        // 方法2: 查找包含pointer-events: none的元素
        const disabledElements = document.querySelectorAll('div[style*="pointer-events: none"], div[style*="pointer-events:none"]');
        disabledElements.forEach(element => {
            // 检查是否同时包含模糊效果
            if (element.style.filter && element.style.filter.includes('blur')) {
                element.style.filter = '';
                element.style.opacity = '';
                element.style.pointerEvents = '';
                element.style.userSelect = '';
                removedCount++;
            }
        });
 
        // 方法3: 通过计算样式查找模糊元素
        const allDivs = document.querySelectorAll('div');
        allDivs.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            if (computedStyle.filter && computedStyle.filter.includes('blur')) {
                element.style.filter = 'none';
                element.style.pointerEvents = 'auto';
                element.style.userSelect = 'auto';
                removedCount++;
            }
        });
 
        if (removedCount > 0) {
            console.log(`已移除 ${removedCount} 个模糊效果元素`);
        }
    }
 
    // 删除VIP覆盖层的函数
    function removeVipOverlay() {
        let removedCount = 0;
 
        // 方法1: 通过类名查找VIP覆盖层
        const vipOverlays = document.querySelectorAll('.vip-gate-overlay, .vip-overlay, .vip-gate, .vip-notice');
        vipOverlays.forEach(element => {
            element.remove();
            removedCount++;
        });
 
        // 方法2: 查找包含VIP相关类名的元素
        const vipElements = document.querySelectorAll('[class*="vip-gate"], [class*="vip-overlay"], [class*="vip-notice"]');
        vipElements.forEach(element => {
            element.remove();
            removedCount++;
        });
 
        // 方法3: 查找包含VIP按钮的容器
        const vipButtons = document.querySelectorAll('.vip-gate-button, .vip-button, button[class*="vip"]');
        vipButtons.forEach(button => {
            // 查找包含该按钮的最外层容器
            let container = button;
            let attempts = 0;
            while (container.parentElement && attempts < 10) {
                const parent = container.parentElement;
                const style = window.getComputedStyle(parent);
 
                // 查找具有覆盖层特征的容器
                if (style.position === 'absolute' || style.position === 'fixed' ||
                    parseInt(style.zIndex) > 50 ||
                    parent.classList.toString().includes('overlay') ||
                    parent.classList.toString().includes('gate')) {
                    container = parent;
                } else {
                    break;
                }
                attempts++;
            }
 
            if (container && container !== document.body && container !== button) {
                container.remove();
                removedCount++;
            }
        });
 
        // 方法4: 查找具有高z-index的绝对定位元素（可能是覆盖层）
        const overlayElements = document.querySelectorAll('div');
        overlayElements.forEach(element => {
            const style = window.getComputedStyle(element);
            if ((style.position === 'absolute' || style.position === 'fixed') &&
                parseInt(style.zIndex) > 100) {
 
                // 检查是否包含VIP相关内容
                const text = element.textContent.toLowerCase();
                if (text.includes('vip') || text.includes('专属') || text.includes('开通') ||
                    text.includes('会员') || text.includes('升级')) {
                    element.remove();
                    removedCount++;
                }
            }
        });
 
        if (removedCount > 0) {
            console.log(`已移除 ${removedCount} 个VIP覆盖层元素`);
        }
    }
 
    // 移除所有可能的限制样式
    function removeAllRestrictions() {
        // 移除可能的CSS限制
        const style = document.createElement('style');
        style.textContent = `
            .vip-gate-overlay,
            .vip-overlay,
            .vip-gate,
            .vip-notice,
            [class*="vip-gate"],
            [class*="vip-overlay"] {
                display: none !important;
                visibility: hidden !important;
            }
 
            div[style*="filter: blur"],
            div[style*="filter:blur"] {
                filter: none !important;
                pointer-events: auto !important;
                user-select: auto !important;
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);
    }
 
    // 主执行函数
    function removeRestrictions() {
        removeBlurEffect();
        removeVipOverlay();
        removeAllRestrictions();
    }
 
    // 强化的DOM监听器
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;
 
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查新添加的元素是否包含VIP相关内容
                            if (node.classList && (
                                node.classList.toString().includes('vip') ||
                                node.classList.toString().includes('gate') ||
                                node.classList.toString().includes('overlay')
                            )) {
                                shouldCheck = true;
                            }
 
                            // 检查是否有模糊效果
                            if (node.style && node.style.filter && node.style.filter.includes('blur')) {
                                shouldCheck = true;
                            }
                        }
                    });
                }
 
                if (mutation.type === 'attributes' &&
                    (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                    shouldCheck = true;
                }
            });
 
            if (shouldCheck) {
                setTimeout(removeRestrictions, 100);
            }
        });
 
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
 
        return observer;
    }
 
    // 初始化脚本
    function init() {
        // 立即执行一次
        removeRestrictions();
 
        // 设置观察器
        setupObserver();
 
        // 定期检查（备用方案）
        setInterval(removeRestrictions, 3000);
 
        console.log('影视管理系统VIP限制移除脚本 v2.0 已加载');
    }
 
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
 
    // 页面完全加载后再执行一次
    window.addEventListener('load', () => {
        setTimeout(removeRestrictions, 1000);
    });
 
})();
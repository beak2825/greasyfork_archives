// ==UserScript==
// @name         广告屏蔽提示删除器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动检测并删除网页中的广告屏蔽提示弹窗
// @author       You
// @match        https://w.waipian.sbs/play/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544477/%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E6%8F%90%E7%A4%BA%E5%88%A0%E9%99%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/544477/%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E6%8F%90%E7%A4%BA%E5%88%A0%E9%99%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 关键词列表 - 用于识别广告屏蔽提示
    const adblockKeywords = [
        '广告屏蔽插件',
        '广告过滤插件',
        '关闭广告过滤',
        '检测到广告拦截',
        '请关闭AdBlock',
        '广告拦截器',
        'ad blocker',
        'adblock',
        'ublock',
        '请将本站加入白名单',
        '禁用广告拦截',
        'disable adblock'
    ];

    // CSS选择器 - 常见的弹窗类名
    const popupSelectors = [
        '.popup',
        '.modal',
        '.overlay',
        '.adblock-notice',
        '.adblock-popup',
        '.anti-adblock',
        '[class*="popup"]',
        '[class*="modal"]',
        '[class*="overlay"]',
        '[class*="adblock"]',
        '[class*="anti-ad"]'
    ];

    // 检查元素是否包含广告屏蔽相关内容
    function containsAdblockContent(element) {
        const text = element.innerText || element.textContent || '';
        return adblockKeywords.some(keyword => 
            text.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    // 移除广告屏蔽提示弹窗
    function removeAdblockPopups() {
        // 方法1: 通过CSS选择器查找可能的弹窗
        popupSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (containsAdblockContent(element)) {
                        console.log('检测到广告屏蔽提示弹窗，正在移除:', element);
                        element.remove();
                    }
                });
            } catch (e) {
                // 忽略选择器错误
            }
        });

        // 方法2: 检查所有可见的div元素
        const allDivs = document.querySelectorAll('div');
        allDivs.forEach(div => {
            if (containsAdblockContent(div)) {
                // 检查是否是弹窗样式的元素
                const style = window.getComputedStyle(div);
                const isPopupLike = (
                    style.position === 'fixed' ||
                    style.position === 'absolute' ||
                    style.zIndex > 1000 ||
                    div.className.toLowerCase().includes('popup') ||
                    div.className.toLowerCase().includes('modal') ||
                    div.className.toLowerCase().includes('overlay')
                );
                
                if (isPopupLike) {
                    console.log('检测到广告屏蔽提示弹窗，正在移除:', div);
                    div.remove();
                }
            }
        });

        // 方法3: 特殊处理 - 移除可能阻止页面滚动的样式
        const body = document.body;
        const html = document.documentElement;
        if (body) {
            body.style.overflow = '';
            body.style.position = '';
        }
        if (html) {
            html.style.overflow = '';
            html.style.position = '';
        }
    }

    // 移除可能的遮罩层
    function removeOverlays() {
        const overlays = document.querySelectorAll('[style*="position: fixed"], [style*="position:fixed"]');
        overlays.forEach(overlay => {
            const style = window.getComputedStyle(overlay);
            if (style.position === 'fixed' && 
                (style.backgroundColor.includes('rgba') || 
                 style.background.includes('rgba') ||
                 overlay.className.toLowerCase().includes('overlay'))) {
                if (containsAdblockContent(overlay) || 
                    overlay.querySelector('*') && 
                    Array.from(overlay.querySelectorAll('*')).some(child => containsAdblockContent(child))) {
                    console.log('移除遮罩层:', overlay);
                    overlay.remove();
                }
            }
        });
    }

    // 初始检查
    function init() {
        removeAdblockPopups();
        removeOverlays();
    }

    // DOM完全加载后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 检查新添加的节点是否包含广告屏蔽提示
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (containsAdblockContent(node) || 
                            node.querySelector && 
                            Array.from(node.querySelectorAll('*')).some(child => containsAdblockContent(child))) {
                            shouldCheck = true;
                        }
                    }
                });
            }
        });
        
        if (shouldCheck) {
            setTimeout(() => {
                removeAdblockPopups();
                removeOverlays();
            }, 100);
        }
    });

    // 开始监听
    observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
    });

    // 定期检查（每3秒）
    setInterval(() => {
        removeAdblockPopups();
        removeOverlays();
    }, 3000);

    console.log('广告屏蔽提示删除器已启动');
})();
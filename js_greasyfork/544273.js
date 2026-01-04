// ==UserScript==
// @name           Automagic网址自动替换 - 高性能版
// @namespace      http://tampermonkey.net/
// @version        2.1
// @description    自动将网址中的"automagic4android.com"替换为"46.231.200.187"，高性能优化版
// @author         Jeff_CF
// @icon           https://46.231.200.187/images/AutomagicAdaptiveIcon_25.png
// @match          *://46.231.200.187/*
// @match          *://automagic4android.com/*
// @match          *://www.baidu.com/*
// @match          *://*/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/544273/Automagic%E7%BD%91%E5%9D%80%E8%87%AA%E5%8A%A8%E6%9B%BF%E6%8D%A2%20-%20%E9%AB%98%E6%80%A7%E8%83%BD%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/544273/Automagic%E7%BD%91%E5%9D%80%E8%87%AA%E5%8A%A8%E6%9B%BF%E6%8D%A2%20-%20%E9%AB%98%E6%80%A7%E8%83%BD%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 目标域名和替换IP
    const OLD_DOMAIN = 'automagic4android.com';
    const NEW_IP = '46.231.200.187';

    // 需要处理的属性列表
    const URL_ATTRIBUTES = ['href', 'src', 'action'];

    // 防抖计时器
    let processTimer = null;

    // 安全替换URL - 仅替换域名部分
    function replaceUrl(url) {
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname === OLD_DOMAIN) {
                urlObj.hostname = NEW_IP;
                return urlObj.toString();
            }
        } catch (e) {
            // 无效URL则直接替换字符串
            return url.replace(OLD_DOMAIN, NEW_IP);
        }
        return url;
    }

    // 处理单个元素
    function processElement(element) {
        URL_ATTRIBUTES.forEach(attr => {
            const value = element.getAttribute(attr);
            if (value && value.includes(OLD_DOMAIN)) {
                element.setAttribute(attr, replaceUrl(value));
            }
        });
    }

    // 初始页面处理（使用高效的选择器）
    function processPage() {
        // 创建高效的选择器（匹配任何包含目标域名的属性）
        const selector = URL_ATTRIBUTES.map(attr => `[${attr}*="${OLD_DOMAIN}"]`).join(',');

        if (!selector) return;

        const elements = document.querySelectorAll(selector);
        for (let i = 0; i < elements.length; i++) {
            processElement(elements[i]);
        }
    }

    // 高性能处理DOM变化
    function handleMutations(mutations) {
        // 使用Set避免重复处理
        const elementsToProcess = new Set();

        for (const mutation of mutations) {
            // 处理新增节点
            if (mutation.addedNodes) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查节点本身
                        if (node.matches(`[href*="${OLD_DOMAIN}"], [src*="${OLD_DOMAIN}"], [action*="${OLD_DOMAIN}"]`)) {
                            elementsToProcess.add(node);
                        }

                        // 检查直接子节点（避免深层遍历）
                        for (const child of node.children) {
                            if (child.matches(`[href*="${OLD_DOMAIN}"], [src*="${OLD_DOMAIN}"], [action*="${OLD_DOMAIN}"]`)) {
                                elementsToProcess.add(child);
                            }
                        }
                    }
                }
            }

            // 处理属性变化
            if (mutation.type === 'attributes' &&
                URL_ATTRIBUTES.includes(mutation.attributeName) &&
                mutation.target instanceof Element &&
                mutation.target.matches(`[${mutation.attributeName}*="${OLD_DOMAIN}"]`)) {
                elementsToProcess.add(mutation.target);
            }
        }

        // 处理收集到的元素
        for (const element of elementsToProcess) {
            processElement(element);
        }
    }

    // 使用防抖的MutationObserver回调
    function debouncedMutationCallback(mutations) {
        if (processTimer) clearTimeout(processTimer);

        // 对百度等高性能敏感页面使用更长的延迟
        const delay = window.location.hostname.includes('baidu.com') ? 300 : 100;

        processTimer = setTimeout(() => {
            handleMutations(mutations);
            processTimer = null;
        }, delay);
    }

    // 初始化观察器
    function initObserver() {
        const observer = new MutationObserver(debouncedMutationCallback);

        observer.observe(document, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: URL_ATTRIBUTES
        });

        return observer;
    }

    // 主初始化函数
    function init() {
        // 初始页面处理
        processPage();

        // 初始化观察器
        initObserver();

        // 对百度页面添加性能优化提示
        if (window.location.hostname.includes('baidu.com')) {
            console.log('Automagic网址替换脚本已启用（百度优化模式）');
        }
    }

    // 在页面完全加载后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
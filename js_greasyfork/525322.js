// ==UserScript==
// @name         屏蔽youwu.lol广告
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  屏蔽广告
// @author       You
// @match        https://youwu.lol/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/525322/%E5%B1%8F%E8%94%BDyouwulol%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/525322/%E5%B1%8F%E8%94%BDyouwulol%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 广告特征识别参数
    const AD_SELECTOR = {
        container: 'div[class*="▭"]', // 广告容器特征
        title: 'AI一键脱衣,去衣',     // 广告标题特征
        domain: 'youwu.lol'          // 广告域名特征
    };

    // 阻止广告请求
    const blockAdRequests = () => {
        // 拦截广告相关的网络请求
        const originalFetch = unsafeWindow.fetch;
        unsafeWindow.fetch = function (resource, init) {
            if (typeof resource === 'string' && resource.includes('warypool.com')) {
                console.log('拦截广告请求:', resource);
                return Promise.reject(new Error('广告请求被拦截'));
            }
            return originalFetch.apply(this, arguments);
        };

        // 拦截XMLHttpRequest
        const originalXHR = unsafeWindow.XMLHttpRequest;
        unsafeWindow.XMLHttpRequest = function () {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            xhr.open = function (method, url) {
                if (typeof url === 'string' && url.includes('warypool.com')) {
                    console.log('拦截广告请求:', url);
                    return; // 直接阻止请求
                }
                originalOpen.apply(this, arguments);
            };
            return xhr;
        };
    };

    // 动态移除广告容器
    const removeAdContainers = () => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && isAdElement(node)) {
                        node.remove();
                        console.log('广告容器已移除');
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    };

    // 判断是否为广告元素
    const isAdElement = (element) => {
        return (
            element.matches(AD_SELECTOR.container) ||
            element.querySelector(`${AD_SELECTOR.container} .▭__title:contains("${AD_SELECTOR.title}")`) !== null
        );
    };

    // 注入CSS样式，隐藏广告容器
    const injectStyles = () => {
        const css = `
            ${AD_SELECTOR.container} {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                opacity: 0 !important;
            }
        `;
        GM_addStyle(css);
    };

    // 初始化
    const init = () => {
        blockAdRequests(); // 阻止广告请求
        removeAdContainers(); // 动态移除广告容器
        injectStyles(); // 注入CSS样式
    };

    // 延迟执行，确保页面加载完成
    setTimeout(init, 100);
})();
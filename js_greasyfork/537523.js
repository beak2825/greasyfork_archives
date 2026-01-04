// ==UserScript==
// @name         B站禁用IPV6
// @namespace    chutung
// @version      0.4
// @description  禁用哔哩哔哩网站的IPV6
// @author       chutung
// @match        https://www.bilibili.com/*
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/medialist/play/*
// @match        https://www.bilibili.com/list/*
// @match        https://www.bilibili.com/bangumi/play/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @license      GPL-3.0-only
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537523/B%E7%AB%99%E7%A6%81%E7%94%A8IPV6.user.js
// @updateURL https://update.greasyfork.org/scripts/537523/B%E7%AB%99%E7%A6%81%E7%94%A8IPV6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 禁用IPv6的主函数
    function disableIPv6() {
        // 获取所有video元素
        const videos = document.querySelectorAll('video');
        if (videos.length === 0) return;

        videos.forEach(video => {
            // 监听视频源变更
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                        replaceIPv6Url(video);
                    }
                });
            });

            // 开始观察video元素的src属性变化
            observer.observe(video, { attributes: true, attributeFilter: ['src'] });

            // 初始检查
            replaceIPv6Url(video);
        });
    }

    // 替换IPv6地址为IPv4
    function replaceIPv6Url(videoElement) {
        if (!videoElement.src) return;

        // 匹配IPv6地址
        const ipv6Regex = /(https?:\/\/)\[[0-9a-fA-F:]+\]/;
        const match = videoElement.src.match(ipv6Regex);
        if (!match) return;

        // 替换为IPv4地址
        const newUrl = videoElement.src.replace(ipv6Regex, '$1' + 'upos-sz-mirrorali.bilivideo.com');
        if (newUrl !== videoElement.src) {
            videoElement.src = newUrl;
            console.log('已禁用IPv6地址，替换为IPv4地址');
        }
    }

    // 页面加载完成后执行
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(disableIPv6, 1000);
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            setTimeout(disableIPv6, 1000);
        });
    }

    // 监听SPA页面变化
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            setTimeout(disableIPv6, 1000);
        }
    }).observe(document, { subtree: true, childList: true });
})();
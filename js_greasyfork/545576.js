// ==UserScript==
// @name         YouTube 主页强制新标签页
// @namespace    https://gtihub/txy-sky
// @version      2.0
// @description  强制YouTube主页所有视频链接在新标签页打开
// @author       Txy-Sky
// @match        https://www.youtube.com/
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545576/YouTube%20%E4%B8%BB%E9%A1%B5%E5%BC%BA%E5%88%B6%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/545576/YouTube%20%E4%B8%BB%E9%A1%B5%E5%BC%BA%E5%88%B6%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 精准识别视频链接的特征
    const isVideoLink = link => {
        const url = new URL(link.href);
        return url.pathname === '/watch' &&
               url.searchParams.has('v') &&
               !url.searchParams.has('list') && // 排除播放列表
               !link.closest('[is-shorts]'); // 排除Shorts
    };

    // 主处理函数
    const handleClick = e => {
        const link = e.target.closest('a');
        if (link && isVideoLink(link)) {
            e.preventDefault();
            e.stopPropagation();
            window.open(link.href, '_blank');
        }
    };

    // 增强型点击监听（使用捕获阶段）
    document.addEventListener('click', handleClick, true);

    // 动态内容处理器
    const processLinks = () => {
        document.querySelectorAll('a').forEach(link => {
            if (isVideoLink(link)) {
                link.target = '_blank';
                link.removeAttribute('data-yt-params'); // 防止YouTube覆盖
            }
        });
    };

    // 高性能Observer配置
    const observer = new MutationObserver(mutations => {
        if (mutations.some(m => m.addedNodes.length)) {
            requestAnimationFrame(processLinks);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 初始处理
    processLinks();
})();
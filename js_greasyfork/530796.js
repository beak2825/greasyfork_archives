// ==UserScript==
// @name        Hide the floating link  隐藏左下角悬浮链接（Chrome/Edge）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  [DeepSeek Chat] 完全隐藏链接悬浮提示，不影响默认链接颜色！无残留、即时生效，兼容所有网页。官网：https://www.deepseek.com
// @author       DeepSeek Chat (https://www.deepseek.com)
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530796/Hide%20the%20floating%20link%20%20%E9%9A%90%E8%97%8F%E5%B7%A6%E4%B8%8B%E8%A7%92%E6%82%AC%E6%B5%AE%E9%93%BE%E6%8E%A5%EF%BC%88ChromeEdge%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/530796/Hide%20the%20floating%20link%20%20%E9%9A%90%E8%97%8F%E5%B7%A6%E4%B8%8B%E8%A7%92%E6%82%AC%E6%B5%AE%E9%93%BE%E6%8E%A5%EF%BC%88ChromeEdge%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储原始链接数据
    const linkStore = new WeakMap();

    // 主处理函数
    const handleLink = (link) => {
        if (!link.href || linkStore.has(link)) return;

        // 保存原始数据
        linkStore.set(link, {
            href: link.href,
            target: link.target || '_self',
            color: window.getComputedStyle(link).color, // 保存原始颜色
            events: []
        });

        // 关键点：完全移除href属性
        link.removeAttribute('href');
        link.style.color = linkStore.get(link).color; // 强制保持原始颜色

        // 添加点击事件处理
        const clickHandler = (e) => {
            if (e.button !== 0) return; // 只处理左键点击
            e.preventDefault();
            const data = linkStore.get(link);
            if (data.target === '_blank') {
                window.open(data.href, '_blank');
            } else {
                location.href = data.href;
            }
        };

        link.addEventListener('click', clickHandler);
        linkStore.get(link).events.push(['click', clickHandler]);

        // 添加视觉样式修复
        link.style.cursor = 'pointer';
    };

    // 恢复原始链接
    const restoreLink = (link) => {
        const data = linkStore.get(link);
        if (!data) return;

        // 恢复属性
        link.href = data.href;
        if (data.target) link.target = data.target;
        link.style.color = ''; // 清除颜色强制样式

        // 移除事件监听
        data.events.forEach(([type, handler]) => {
            link.removeEventListener(type, handler);
        });

        linkStore.delete(link);
        link.style.cursor = '';
    };

    // 事件监听
    document.addEventListener('mouseover', (e) => {
        const link = e.target.closest('a');
        if (link) handleLink(link);
    }, true);

    document.addEventListener('mouseout', (e) => {
        const link = e.target.closest('a');
        if (link) restoreLink(link);
    }, true);

    // 处理初始链接
    const initLinks = () => {
        document.querySelectorAll('a[href]').forEach(handleLink);
    };

    // 动态内容监听
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    if (node.matches('a[href]')) handleLink(node);
                    node.querySelectorAll('a[href]').forEach(handleLink);
                }
            });
        });
    });

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLinks);
    } else {
        initLinks();
    }
    observer.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['href']
    });
})();
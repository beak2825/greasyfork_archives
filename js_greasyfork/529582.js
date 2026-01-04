// ==UserScript==
// @name         Github链接新标签页打开
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  强制Github所有链接在新标签页打开
// @author       kang
// @license MIT
// @match        *://github.com/*
// @icon            https://img.icons8.com/?size=128&id=HBaR-srJq-eB&format=png
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/529582/Github%E9%93%BE%E6%8E%A5%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/529582/Github%E9%93%BE%E6%8E%A5%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 增强型链接检测函数
    const findValidLink = (element) => {
        const MAX_DEPTH = 5; // 最大DOM层级搜索深度
        let current = element;
        let depth = 0;

        while (current && depth++ < MAX_DEPTH) {
            if (current.tagName === 'A' && current.href) {
                // 排除伪链接和锚点
                if (current.href.includes('javascript:') ||
                    current.href.startsWith('#')) return null;
                return current;
            }
            current = current.parentElement;
        }
        return null;
    };

    // 主事件处理器
    const handleClick = (event) => {
        // 仅处理主按钮（左键）点击
        if (event.button !== 0) return;

        // 保留辅助键功能（Ctrl/Cmd/Shift）
        if (event.ctrlKey || event.metaKey || event.shiftKey) return;

        const link = findValidLink(event.target);
        if (!link) return;

        // 阻止默认行为并停止传播
        event.preventDefault();
        event.stopImmediatePropagation();

        // 异步打开新标签页（兼容SPA）
        setTimeout(() => {
            window.open(link.href, '_blank', 'noopener noreferrer');
        }, 50);

        // 清除焦点状态
        link.blur();
    };

    // 在捕获阶段优先注册监听器
    document.addEventListener('click', handleClick, {
        capture: true,
        passive: false
    });

    // 处理动态内容的重置防护
    let lastHref = location.href;
    const observeChanges = () => {
        if (location.href !== lastHref) {
            lastHref = location.href;
            document.addEventListener('click', handleClick, {
                capture: true,
                passive: false
            });
        }
        requestAnimationFrame(observeChanges);
    };
    observeChanges();
})();
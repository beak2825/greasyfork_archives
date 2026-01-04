// ==UserScript==
// @name         点击图片强制新标签页
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  左键点击网页图片时强制在新标签页打开
// @author       kang
// @license MIT
// @match        *://*/*
// @grant        none
// @icon         https://img.icons8.com/?size=64&id=4MRMs77EDvrv&format=png
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/529580/%E7%82%B9%E5%87%BB%E5%9B%BE%E7%89%87%E5%BC%BA%E5%88%B6%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/529580/%E7%82%B9%E5%87%BB%E5%9B%BE%E7%89%87%E5%BC%BA%E5%88%B6%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 查找有效图片链接
    const findImageLink = (element) => {
        const MAX_DEPTH = 7; // 增加DOM遍历深度
        let current = element;
        let depth = 0;

        // 先找图片元素
        while (current && depth++ < MAX_DEPTH) {
            if (current.tagName === 'IMG') {
                // 向上查找最近的<a>标签
                let parent = current.parentElement;
                while (parent && parent.tagName !== 'A') {
                    parent = parent.parentElement;
                }
                if (parent && parent.href) {
                    return {
                        img: current,
                        link: parent
                    };
                }
                break;
            }
            current = current.parentElement;
        }
        return null;
    };

    // 主事件处理器
    const handleClick = (event) => {
        // 仅处理主按钮（左键）点击
        if (event.button !== 0) return;

        // 保留辅助键功能
        if (event.ctrlKey || event.metaKey || event.shiftKey) return;

        const result = findImageLink(event.target);
        if (!result || !result.link.href) return;

        // 阻止默认行为
        event.preventDefault();
        event.stopImmediatePropagation();

        // 新标签页打开
        window.open(result.link.href, '_blank', 'noopener noreferrer');



        // 添加点击反馈效果
        result.img.style.transition = 'opacity 0.3s';
        result.img.style.opacity = '0.5';
        setTimeout(() => {
            result.img.style.opacity = '';
        }, 300);
    };

    // 注册事件监听
    document.addEventListener('click', handleClick, {
        capture: true,
        passive: false
    });

    // 动态内容处理
    const observer = new MutationObserver(() => {
        document.addEventListener('click', handleClick, {
            capture: true,
            passive: false
        });
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });
})();
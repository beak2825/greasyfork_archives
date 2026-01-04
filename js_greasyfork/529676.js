// ==UserScript==
// @name         Linux.do 新标签页打开
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  使linux.do网站的主页和搜索页的帖子链接在新标签页中打开
// @author       BIGFA
// @match        https://linux.do/*
// @grant        none
// @run-at       document-start
// @license      GPL-3.0
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBkPSJNMjAgM0g0QzMuNDQ3NzIgMyAzIDMuNDQ3NzIgMyA0VjIwQzMgMjAuNTUyMyAzLjQ0NzcyIDIxIDQgMjFIMjBDMjAuNTUyMyAyMSAyMSAyMC41NTIzIDIxIDIwVjRDMjEgMy40NDc3MiAyMC41NTIzIDMgMjAgM1pNNSAxOVY1SDE5VjE5SDVaTTE2IDhWMTZIMTRWMTEuNDE0Mkw4LjcwNzExIDE2LjcwNzFMNy4yOTI4OSAxNS4yOTI5TDEyLjU4NTggMTBIOFY4SDE2WiI+PC9wYXRoPjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/529676/Linuxdo%20%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/529676/Linuxdo%20%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前条件
    function isTargetPage() {
        const path = window.location.pathname;
        return path === '/' || path === '/search' || (path.startsWith('/u/') && path.endsWith('/activity/bookmarks')) || (path.startsWith('/u/') && path.includes('/activity/topics'));
    }

    // 主函数，用于修改链接
    function modifyLinks() {
        // 如果不是目标页面，则不执行任何操作
        if (!isTargetPage()) {
            return;
        }

        // 选择所有帖子链接 - 更精确的选择器
        const postLinks = document.querySelectorAll('a[href^="/t/"], a[href^="/d/"], a.title[href], .topic-list-item a.title, .topic-list a.title, .latest-topic-list-item a.title');

        // 遍历所有链接并添加 target="_blank" 属性
        postLinks.forEach(link => {
            // 检查链接是否包含帖子 URL 模式
            if (link.href && (link.href.includes('/t/') || link.href.includes('/d/'))) {
                if (!link.hasAttribute('target') || link.getAttribute('target') !== '_blank') {
                    link.setAttribute('target', '_blank');

                    // 添加 rel="noopener" 以提高安全性
                    if (!link.hasAttribute('rel') || !link.getAttribute('rel').includes('noopener')) {
                        const currentRel = link.getAttribute('rel') || '';
                        link.setAttribute('rel', currentRel ? currentRel + ' noopener' : 'noopener');
                    }

                    // 防止点击事件被其他处理程序拦截
                    link.addEventListener('click', function(e) {
                        // 阻止默认行为和事件冒泡
                        e.stopPropagation();
                    }, true);
                }
            }
        });
    }

    // 页面加载完成后执行
    window.addEventListener('load', function() {
        modifyLinks();

        // 创建一个 MutationObserver 来监视 DOM 变化，处理动态加载的内容
        const observer = new MutationObserver(function(mutations) {
            modifyLinks();
        });

        // 开始观察 document.body 的所有子树变化
        observer.observe(document.body, { childList: true, subtree: true });
    });

    // 也在 DOMContentLoaded 时执行一次
    document.addEventListener('DOMContentLoaded', modifyLinks);

    // 定期执行以确保所有链接都被处理
    setInterval(modifyLinks, 2000);
})();
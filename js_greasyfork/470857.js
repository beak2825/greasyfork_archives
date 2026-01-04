// ==UserScript==
// @name         在当前标签页打开链接
// @version      1.0
// @description  在当前标签页打开链接而不是新开标签页
// @author       Your Name
// @match           *://*.bilibili.com/*
// @exclude         *://api.bilibili.com/*
// @exclude         *://api.*.bilibili.com/*
// @exclude         *://*.bilibili.com/api/*
// @exclude         *://member.bilibili.com/studio/bs-editor/*
// @exclude         *://t.bilibili.com/h5/dynamic/specification
// @exclude         *://bbq.bilibili.com/*
// @exclude         *://message.bilibili.com/pages/nav/header_sync
// @exclude         *://s1.hdslb.com/bfs/seed/jinkela/short/cols/iframe.html
// @exclude         *://open-live.bilibili.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1126993
// @downloadURL https://update.greasyfork.org/scripts/470857/%E5%9C%A8%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/470857/%E5%9C%A8%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 函数用于在当前标签页中打开链接
    function openLinkInCurrentTab(url) {
        window.location.href = url;
    }

    // 拦截所有点击事件
    document.addEventListener('click', function(event) {
        var target = event.target;

        // 检查点击的元素以及其父元素是否是链接
        while (target && target.tagName !== 'A') {
            target = target.parentElement;
        }

        if (target && target.tagName === 'A') {
            // 阻止默认行为，即在新标签页中打开链接
            event.preventDefault();

            // 获取链接的目标 URL
            var url = target.href;

            // 在当前标签页中打开链接
            openLinkInCurrentTab(url);
        }
    });

    // 拦截所有 window.open 调用
    var originalOpen = window.open;
    window.open = function(url, target, features) {
        // 在当前标签页中打开链接
        openLinkInCurrentTab(url);
    };

    // 监听 DOM 的变化，以处理后续加载的链接
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 检查是否有新链接被添加到 DOM
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.tagName === 'A') {
                        // 阻止默认行为，即在新标签页中打开链接
                        node.addEventListener('click', function(event) {
                            event.preventDefault();
                            openLinkInCurrentTab(node.href);
                        });
                    }
                });
            }
        });
    });

    // 开始观察 DOM 变化
    observer.observe(document.body, { childList: true, subtree: true });
})();

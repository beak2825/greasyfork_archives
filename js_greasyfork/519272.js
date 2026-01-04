// ==UserScript==
// @name         CodeMao反iframe劫持
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  检测 iframe 并阻止 CodeMao 网站上与 Coco 相关的请求，想玩 Coco 的时候关掉就行了。by：VH
// @match        *://*.codemao.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519272/CodeMao%E5%8F%8Diframe%E5%8A%AB%E6%8C%81.user.js
// @updateURL https://update.greasyfork.org/scripts/519272/CodeMao%E5%8F%8Diframe%E5%8A%AB%E6%8C%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检测并屏蔽 Coco 相关的网络请求
    (function(open) {
        XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
            if (url.includes('coco') && window.location.host.includes('codemao.cn')) {
                console.log('试图发送与 Coco 相关的请求，已被阻止: ', url);
                return;
            }
            open.call(this, method, url, async, user, pass);
        };
    })(XMLHttpRequest.prototype.open);

    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
        if (typeof input ==='string' && input.includes('coco') && window.location.host.includes('codemao.cn')) {
            console.log('试图发送与 Coco 相关的 fetch 请求，已被阻止: ', input);
            return Promise.reject(new Error('Coco 请求被阻止'));
        }
        return originalFetch(input, init);
    };

    function detectAndBlockIframeHijackingInPostsAndComments(userNickname) {
        // 仅在编程猫旗下网站执行
        if (window.location.host.includes('codemao.cn')) {
            // 使用 querySelectorAll 方法获取所有评论和帖子中的 iframe 元素
            const iframes = document.querySelectorAll('.post,.comment iframe');

            if (iframes.length > 0) {
                for (let iframe of iframes) {
                    if (iframe.hasAttribute('src')) {
                        const src = iframe.getAttribute('src');
                        // 弹出弹窗
                        alert(`用户昵称：${userNickname} 发送的链接：${src}`);
                        // 进行屏蔽
                        iframe.setAttribute('src', '已屏蔽');
                        iframe.style.width = '0';
                        iframe.style.height = '0';
                        iframe.parentNode.innerHTML = '[检测到该帖/评论内容有风险，已屏蔽]';
                        console.log('检测到可疑的 iframe 并已屏蔽');
                    }
                }
            }
        }
    }

    // 假设获取到的用户昵称为 "user1"
    const userNickname = "user1";
    detectAndBlockIframeHijackingInPostsAndComments(userNickname);

    // 持续监测新添加的 iframe 元素
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && window.location.host.includes('codemao.cn')) {
                const addedNodes = Array.from(mutation.addedNodes);
                let foundIframe = false;
                for (const node of addedNodes) {
                    if (node.tagName === 'IFRAME' && node.hasAttribute('src')) {
                        foundIframe = true;
                        const src = node.getAttribute('src');
                        // 弹出弹窗
                        alert(`用户昵称：${userNickname} 发送的链接：${src}`);
                        // 进行屏蔽
                        node.setAttribute('src', '已屏蔽');
                        node.style.width = '0';
                        node.style.height = '0';
                        node.parentNode.innerHTML = '[检测到该帖/评论内容有风险，已屏蔽]';
                        console.log('检测到新添加的可疑 iframe 并已屏蔽');
                    }
                }
                if (foundIframe) {
                    break;
                }
            }
        }
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
})();
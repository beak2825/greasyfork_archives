// ==UserScript==
// @name         微博聊天-按发言人屏蔽其消息
// @namespace    http://tampermonkey.net/
// @version      2
// @description  隐藏 api.weibo.com 中包含指定 span 内容（发言人昵称）的 li 元素（聊天消息）
// @author       tu
// @match        https://api.weibo.com/chat
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536099/%E5%BE%AE%E5%8D%9A%E8%81%8A%E5%A4%A9-%E6%8C%89%E5%8F%91%E8%A8%80%E4%BA%BA%E5%B1%8F%E8%94%BD%E5%85%B6%E6%B6%88%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/536099/%E5%BE%AE%E5%8D%9A%E8%81%8A%E5%A4%A9-%E6%8C%89%E5%8F%91%E8%A8%80%E4%BA%BA%E5%B1%8F%E8%94%BD%E5%85%B6%E6%B6%88%E6%81%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 🔧 自定义关键词（支持多个）
    const keywords = ['第一个人的名字', '第二个人的名字'];

    // 页面加载后执行
    window.addEventListener('load', () => {
        hideTargetLi();

        // 监听后续 DOM 变化，适配动态加载的内容
        const observer = new MutationObserver(hideTargetLi);
        observer.observe(document.body, { childList: true, subtree: true });
    });

    function hideTargetLi() {
        const liElements = document.querySelectorAll('li');

        liElements.forEach(li => {
            // 查询 class="name font12" 的 span
            const targetSpans = li.querySelectorAll('span.name.font12');

            for (const span of targetSpans) {
                const text = span.textContent.trim();
                if (keywords.some(keyword => text.includes(keyword))) {
                    li.style.display = 'none';
                    break;
                }
            }
        });
    }
})();

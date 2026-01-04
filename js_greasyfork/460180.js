// ==UserScript==
// @name         publink-openai-beautify
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  openai 样式美化
// @author       huangbc
// @include      https://chatgpt.com/*
// @match        https://chatgpt.com/*
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/460180/publink-openai-beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/460180/publink-openai-beautify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('openai-beautify')
     // 使用 GM_addStyle 添加样式
    GM_addStyle(`
        .temp-gallery-list,
        .text-token-text-tertiary.whitespace-nowrap {
           display: none !important;
        }
        .__composer-pill-composite path,
        .__composer-pill {
          color: var(--theme-user-msg-text) !important;
          background-color: var(--theme-user-msg-bg) !important;
        }
        .__composer-pill-remove:hover {
          background-color: var(--theme-user-msg-bg) !important;
        }
        .flex.min-w-fit.items-center {
          gap: 6px;
        }
        /* 添加更多自定义样式 */
    `);
    
    // 监听 DOM 变化，确保样式应用到动态加载的元素
    const observer = new MutationObserver(function() {
        // 可以在这里重新应用样式或处理动态元素
    });
    
    // 开始观察
    observer.observe(document.body, { childList: true, subtree: true });

function remove() {
 const wechatLinks = document.querySelector('.wechat-toc-footer-links');
 if (wechatLinks) {
    wechatLinks.style.display = "none";
 }
}

// 从 0 秒开始，每隔 100ms 执行一次 remove 函数
let times = [0]

for (let i = 0; i < 1000; i++) {
  times.push(i * 100);
}

times.forEach((time) => {
  setTimeout(remove, time);
})

setInterval(remove, 2000);

remove();


    // Your code here...
})();
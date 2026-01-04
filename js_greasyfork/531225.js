// ==UserScript==
// @name         Dedao Auto Click Reverse (with MutationObserver)
// @namespace    https://example.com
// @version      0.1
// @description  监听DOM变化，一旦出现“倒序”按钮就自动点击
// @match        *://www.dedao.cn/course/detail?id=*
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531225/Dedao%20Auto%20Click%20Reverse%20%28with%20MutationObserver%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531225/Dedao%20Auto%20Click%20Reverse%20%28with%20MutationObserver%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[DedaoAutoReverse] 脚本已加载 (MutationObserver)');

    // 选择器：假设“倒序”按钮是 <span attr="inverted" class="item-text">倒序</span>
    // 若你的实际按钮选择器不同，请自行修改
    const REVERSE_SELECTOR = 'span[attr="inverted"].item-text';

    // 创建一个 MutationObserver，监听 DOM 变化
    const observer = new MutationObserver((mutations, obs) => {
        // 每当页面有节点变动，就尝试查询是否出现了“倒序”按钮
        const reverseBtn = document.querySelector(REVERSE_SELECTOR);
        if (reverseBtn) {
            // 一旦找到按钮，就点击
            reverseBtn.click();
            console.log('[DedaoAutoReverse] 已自动点击“倒序”按钮');

            // 点击一次后，就可以停止观察，避免重复点击
            observer.disconnect();
        }
    });

    // 开始观察整个文档的子树变化
    // childList: true 表示监听直接子节点的变化
    // subtree: true 表示监听其后代节点（整个DOM树）的变化
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();

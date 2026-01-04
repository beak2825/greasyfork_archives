// ==UserScript==
// @name         隐藏烦人的"客服在线"
// @namespace    https://greasyfork.org/users/1217761
// @version      0.3
// @description  隐藏 id="lrkfwarp" 的 div 元素
// @author       gpt4o
// @match        *://*.zdgogo.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521717/%E9%9A%90%E8%97%8F%E7%83%A6%E4%BA%BA%E7%9A%84%22%E5%AE%A2%E6%9C%8D%E5%9C%A8%E7%BA%BF%22.user.js
// @updateURL https://update.greasyfork.org/scripts/521717/%E9%9A%90%E8%97%8F%E7%83%A6%E4%BA%BA%E7%9A%84%22%E5%AE%A2%E6%9C%8D%E5%9C%A8%E7%BA%BF%22.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 隐藏 id="lrkfwarp" 的 div 元素
    function hideLrkfwarpDiv() {
        var lrkfwarpDiv = document.getElementById('lrkfwarp');
        if (lrkfwarpDiv) {
            lrkfwarpDiv.style.display = 'none';
        }
    }

    // 使用 MutationObserver 监视 DOM 变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                hideLrkfwarpDiv();
            }
        });
    });

    // 配置 MutationObserver
    var config = { childList: true, subtree: true };

    // 监视整个文档
    observer.observe(document.body, config);

    // 初始调用隐藏函数
    hideLrkfwarpDiv();
})();
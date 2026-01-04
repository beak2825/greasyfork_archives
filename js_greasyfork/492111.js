// ==UserScript==
// @name         LeetCode 跳转到 LeetCode.cn
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在 LeetCode.com 上添加一个跳转到 LeetCode.cn 的超链接按钮
// @author       Moranjianghe
// @match        https://leetcode.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492111/LeetCode%20%E8%B7%B3%E8%BD%AC%E5%88%B0%20LeetCodecn.user.js
// @updateURL https://update.greasyfork.org/scripts/492111/LeetCode%20%E8%B7%B3%E8%BD%AC%E5%88%B0%20LeetCodecn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个新的<a>元素作为按钮
    var link = document.createElement('a');
    var buttonText = document.createTextNode('跳转到 LeetCode.cn');
    link.appendChild(buttonText);
    link.className = 'ml-2 group/nav-back cursor-pointer gap-2 hover:text-lc-icon-primary dark:hover:text-dark-lc-icon-primary flex items-center h-[32px] transition-none hover:bg-fill-quaternary dark:hover:bg-fill-quaternary text-gray-60 dark:text-gray-60 px-2';

    // 设置超链接的 href 属性
    function updateLink() {
        var path = window.location.pathname;
        var newUrl = 'https://leetcode.cn' + path;
        link.setAttribute('href', newUrl);
    }

    // 使用 MutationObserver 监听 URL 变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                updateLink(); // 当 URL 变化时更新超链接
            }
        });
    });

    var config = { childList: true, subtree: true };
    observer.observe(document.body, config); // 开始监听

    // 尝试添加按钮到目标<div>
    function tryAppendButton() {
        var targetDiv = document.getElementById('ide-top-btns');
        if (targetDiv) {
            targetDiv.appendChild(link);
            clearInterval(appendButtonInterval); // 如果找到目标元素，停止尝试
        }
    }

    var appendButtonInterval = setInterval(tryAppendButton, 500); // 每500毫秒尝试一次添加按钮
})();

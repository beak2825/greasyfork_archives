// ==UserScript==
// @name         屏蔽Pixiv下方广告
// @namespace    https://viayoo.com/
// @version      1.0
// @description  从1.0开始直接屏蔽，目前修改了作者、作品页。
// @author       丸子
// @run-at       document-end
// @match        *://*.pixiv.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522064/%E5%B1%8F%E8%94%BDPixiv%E4%B8%8B%E6%96%B9%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/522064/%E5%B1%8F%E8%94%BDPixiv%E4%B8%8B%E6%96%B9%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

// ==UserScript==
// @name         自定义网页元素屏蔽器
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  隐藏包含指定关键词的元素
// @author       你的名字
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 需要屏蔽的 class 名关键字，可以添加多个
    const keywordsToBlock = [
        'ad-frame-container', // 示例：广告框架容器
        'ad-frame-container', // 示例：广告框架容器
    ];

    function removeBlockedElements() {
        keywordsToBlock.forEach(keyword => {
            document.querySelectorAll(`[class*="${keyword}"]`).forEach(element => {
                element.style.display = 'none'; // 仅隐藏
                // element.remove(); // 如果想直接删除元素，可以取消注释这一行
            });
        });
    }

    // 页面加载完成后执行
    window.addEventListener('load', removeBlockedElements);

    // 监听 DOM 变化，适用于动态加载的内容
    const observer = new MutationObserver(removeBlockedElements);
    observer.observe(document.body, { childList: true, subtree: true });

})();

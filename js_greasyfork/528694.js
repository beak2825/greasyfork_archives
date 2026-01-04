// ==UserScript==
// @name         搜书小组(404吧)-刘备小说版块 “绿文”标签过滤器
// @namespace    https://greasyfork.org/zh-CN/users/1441970-%E5%8D%97%E7%AB%B9
// @version      1.1
// @description  自动隐藏带[绿文]标签（而不是标题内容）的帖子
// @author       南竹
// @match        https://404ku.com/forum-*-*
// @match        https://404ku.com/forum-*-*.html
// @match        https://404ku.com/forum.php?mod=forumdisplay&fid=*
// @match        https://404zu.org/forum-*-*
// @match        https://404zu.org/forum-*-*.html
// @match        https://404zu.org/forum.php?mod=forumdisplay&fid=*
// @match        https://404zu.net/forum-*-*
// @match        https://404zu.net/forum-*-*.html
// @match        https://404zu.net/forum.php?mod=forumdisplay&fid=*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528694/%E6%90%9C%E4%B9%A6%E5%B0%8F%E7%BB%84%28404%E5%90%A7%29-%E5%88%98%E5%A4%87%E5%B0%8F%E8%AF%B4%E7%89%88%E5%9D%97%20%E2%80%9C%E7%BB%BF%E6%96%87%E2%80%9D%E6%A0%87%E7%AD%BE%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/528694/%E6%90%9C%E4%B9%A6%E5%B0%8F%E7%BB%84%28404%E5%90%A7%29-%E5%88%98%E5%A4%87%E5%B0%8F%E8%AF%B4%E7%89%88%E5%9D%97%20%E2%80%9C%E7%BB%BF%E6%96%87%E2%80%9D%E6%A0%87%E7%AD%BE%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 核心过滤逻辑
    function filterGreenPosts() {
        // 遍历所有帖子行（根据实际结构调整选择器）
        document.querySelectorAll('tbody[id^="normalthread_"] tr').forEach(row => {
            // 定位到包含标签的 <em> 元素
            const tagElem = row.querySelector('th.common em');
            if (tagElem) {
                const tagText = tagElem.textContent.trim();
                // 判断是否包含"绿文"标签
                if (tagText.includes('[绿文]')) {
                    row.style.display = 'none'; // 隐藏整行
                }
            }
        });
    }

    // 动态加载监听（优化性能）
    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            if (m.addedNodes.length) {
                setTimeout(filterGreenPosts, 300); // 防抖处理
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始执行
    window.addEventListener('load', () => {
        setTimeout(filterGreenPosts, 1000); // 等待页面加载
    });
})();
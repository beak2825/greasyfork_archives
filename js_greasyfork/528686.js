// ==UserScript==
// @name         尚香书苑-刘备文版块 标签过滤器（过滤“NTR被绿”）
// @namespace    https://greasyfork.org/zh-CN/users/1441970-%E5%8D%97%E7%AB%B9
// @version      1.5
// @description  自动隐藏[NTR被绿]标签（是标签，不是标题部分文字）的帖子
// @author       南竹
// @match        https://sxsy122.com/forum-*-*
// @match        https://sxsy122.com/forum.php?mod=forumdisplay&fid=*
// @match        https://sxsy21.com/forum-*-*
// @match        https://sxsy21.com/forum.php?mod=forumdisplay&fid=*
// @match        https://sxsy19.com/forum-*-*
// @match        https://sxsy19.com/forum.php?mod=forumdisplay&fid=*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528686/%E5%B0%9A%E9%A6%99%E4%B9%A6%E8%8B%91-%E5%88%98%E5%A4%87%E6%96%87%E7%89%88%E5%9D%97%20%E6%A0%87%E7%AD%BE%E8%BF%87%E6%BB%A4%E5%99%A8%EF%BC%88%E8%BF%87%E6%BB%A4%E2%80%9CNTR%E8%A2%AB%E7%BB%BF%E2%80%9D%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528686/%E5%B0%9A%E9%A6%99%E4%B9%A6%E8%8B%91-%E5%88%98%E5%A4%87%E6%96%87%E7%89%88%E5%9D%97%20%E6%A0%87%E7%AD%BE%E8%BF%87%E6%BB%A4%E5%99%A8%EF%BC%88%E8%BF%87%E6%BB%A4%E2%80%9CNTR%E8%A2%AB%E7%BB%BF%E2%80%9D%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 需要过滤的标签列表（可扩展）
    const FILTER_TAGS = ['[NTR被绿]', '[待修改]'];

    // 核心过滤逻辑
    function filterPosts() {
        document.querySelectorAll('tbody[id^="normalthread_"] tr').forEach(row => {
            const tagElem = row.querySelector('th.common em');
            if (tagElem && FILTER_TAGS.some(tag => tagElem.textContent.includes(tag))) {
                row.style.display = 'none';
                // 可选：添加过滤标记
                row.setAttribute('data-filtered', 'true');
            }
        });
    }

    // 动态加载监听（优化版）
    const observer = new MutationObserver(mutations => {
        if (document.querySelector('tr:not([data-filtered])')) { // 仅处理新元素
            setTimeout(filterPosts, 300);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributeFilter: ['data-filtered'] // 监听过滤标记变化
    });

    // 初始执行（增强容错）
    if (document.readyState === 'complete') {
        filterPosts();
    } else {
        window.addEventListener('load', () => setTimeout(filterPosts, 1500));
    }

    // 添加样式标记（可选）
    const style = document.createElement('style');
    style.textContent = `
        tr[data-filtered] {
            display: none !important;
            position: relative;
        }
        tr[data-filtered]::after {
            content: "[已过滤]";
            color: #ff4444;
            position: absolute;
            left: 10px;
        }
    `;
    document.head.appendChild(style);
})();
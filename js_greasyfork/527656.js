// ==UserScript==
// @name         B站评论默认最新排序
// @namespace    https://greasyfork.org/zh-CN/users/yourusername
// @version      1.1
// @description  让B站视频评论区默认按最新排序
// @author       YourName
// @match        *://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527656/B%E7%AB%99%E8%AF%84%E8%AE%BA%E9%BB%98%E8%AE%A4%E6%9C%80%E6%96%B0%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/527656/B%E7%AB%99%E8%AF%84%E8%AE%BA%E9%BB%98%E8%AE%A4%E6%9C%80%E6%96%B0%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 设置评论区默认排序为“最新”
     */
    function setLatestComments() {
        // 选择排序按钮的父容器，B站的评论排序通常在这个区域内
        let sortButton = document.querySelector("bili-text-button span.button__label");
        
        // 如果找到“最新”按钮，并且当前未激活，则点击它切换排序
        if (sortButton && sortButton.innerText.includes("最新")) {
            sortButton.click();
            console.log("已设置评论排序为最新");
        }
    }

    /**
     * 监听页面变化，确保评论区加载后仍然设置最新排序
     */
    function observeComments() {
        let observer = new MutationObserver(setLatestComments);
        // 监听整个 body，观察 DOM 变动（如新评论加载）
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 页面加载后执行
    window.addEventListener('load', () => {
        setTimeout(setLatestComments, 2000); // 延迟 2 秒确保评论区加载完毕
        observeComments(); // 监听后续 DOM 变动
    });
})();

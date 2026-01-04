// ==UserScript==
// @name         B站Bilibili 评论区开关、切换隐藏屏蔽折叠
// @namespace    https://greasyfork.org/
// @version      1.0.6
// @description  默认隐藏评论区，支持跳转进入新视频时仍保持默认关闭，可手动控制开关
// @author       kylino
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/audio/*
// @match        *://*.bilibili.com/watchlater*
// @match        *://*.bilibili.com/bangumi/play/*
// @match        *://*.bilibili.com/medialist/play/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540661/B%E7%AB%99Bilibili%20%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%BC%80%E5%85%B3%E3%80%81%E5%88%87%E6%8D%A2%E9%9A%90%E8%97%8F%E5%B1%8F%E8%94%BD%E6%8A%98%E5%8F%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/540661/B%E7%AB%99Bilibili%20%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%BC%80%E5%85%B3%E3%80%81%E5%88%87%E6%8D%A2%E9%9A%90%E8%97%8F%E5%B1%8F%E8%94%BD%E6%8A%98%E5%8F%A0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const classNameArray = ['commentapp', 'inside-wrp'];
    const commentArray = ['comment-m', 'comment', 'also-like', 'common', 'song-comment'];
    const targetElements = [...classNameArray, ...commentArray];

    let isHidden = true;

    // 元素隐藏/显示控制
    function applyVisibility() {
        for (let className of targetElements) {
            const ele = document.querySelector('.' + className);
            if (ele) ele.style.display = isHidden ? 'none' : '';

            const eleById = document.getElementById(className);
            if (eleById) eleById.style.display = isHidden ? 'none' : '';
        }

        const btn = document.getElementById("toggle-comment-button");
        if (btn) {
            btn.innerText = isHidden ? "显示评论区" : "隐藏评论区";
        }
    }

    // 插入按钮（只执行一次）
    function insertToggleButton() {
        if (document.getElementById("toggle-comment-button")) return; // 避免重复插入

        const btn = document.createElement("button");
        btn.id = "toggle-comment-button";
        btn.innerText = "显示评论区";
        btn.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 20px;
            z-index: 9999;
            background-color: #515151;
            color: #999999;
            border: none;
            border-radius: 6px;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 14px;
        `;
        btn.addEventListener("click", () => {
            isHidden = !isHidden;
            applyVisibility();
        });
        document.body.appendChild(btn);
    }

    // 执行初始化隐藏和按钮插入
    function initControl() {
        isHidden = true;
        insertToggleButton();
        // 延迟执行，避免 DOM 未加载完成
        setTimeout(applyVisibility, 500);
    }

    // 监听页面 URL 变化（适配 SPA 跳转）
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            initControl(); // 每次跳转新视频，重新控制
        }
    }, 1000);

    // 首次进入执行
    window.addEventListener("load", () => {
        initControl();
    });
})();

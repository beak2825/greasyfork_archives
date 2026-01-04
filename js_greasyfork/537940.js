// ==UserScript==
// @name         隐藏所有网站的视频和图片但保留声音
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动隐藏所有网站的图片和视频画面，保留声音播放
// @author       ChatGPT
// @match        *://*/*
// @exclude      *://*.douyin.com/*
// @exclude      *://chat.openai.com/*
// @exclude      *://*.deepseek.com/*
// @exclude      *://aistudio.google.com/*
// @exclude      *://*.bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537940/%E9%9A%90%E8%97%8F%E6%89%80%E6%9C%89%E7%BD%91%E7%AB%99%E7%9A%84%E8%A7%86%E9%A2%91%E5%92%8C%E5%9B%BE%E7%89%87%E4%BD%86%E4%BF%9D%E7%95%99%E5%A3%B0%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/537940/%E9%9A%90%E8%97%8F%E6%89%80%E6%9C%89%E7%BD%91%E7%AB%99%E7%9A%84%E8%A7%86%E9%A2%91%E5%92%8C%E5%9B%BE%E7%89%87%E4%BD%86%E4%BF%9D%E7%95%99%E5%A3%B0%E9%9F%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideMediaElements() {
        // 视频、图片、嵌入媒体
        const elements = document.querySelectorAll('video, img, iframe, object, embed');

        elements.forEach(el => {
            // 保留音频轨道
            if (el.tagName.toLowerCase() === 'video') {
                el.muted = false; // 保证声音播放
            }

            // 隐藏元素
            el.style.visibility = 'hidden';
            el.style.width = '0px';
            el.style.height = '0px';
            el.style.display = 'none'; // 可选：彻底移除画面占位
        });
    }

    // 初次运行
    hideMediaElements();

    // 观察页面变化，防止 AJAX 动态加载新图像/视频
    const observer = new MutationObserver(() => {
        hideMediaElements();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

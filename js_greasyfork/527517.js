// ==UserScript==
// @name         好看视频标题搜索
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  在好看视频网页中添加按钮，点击后在抖音和B站搜索视频标题
// @author       zzx114
// @match        *://haokan.baidu.com/*
// @grant        GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527517/%E5%A5%BD%E7%9C%8B%E8%A7%86%E9%A2%91%E6%A0%87%E9%A2%98%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/527517/%E5%A5%BD%E7%9C%8B%E8%A7%86%E9%A2%91%E6%A0%87%E9%A2%98%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 确保页面加载完成后运行脚本
    const observer = new MutationObserver(() => {
        if (document.body) {
            observer.disconnect(); // 停止监听
            main();
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    function main() {
        // 创建按钮
        const searchButton = document.createElement("button");
        searchButton.textContent = "搜索标题";
        searchButton.style.position = "fixed";
        searchButton.style.top = "10px"; // 距离页面顶部10px
        searchButton.style.left = "50%"; // 水平居中
        searchButton.style.transform = "translateX(-50%)"; // 精确居中
        searchButton.style.padding = "5px 10px";
        searchButton.style.fontSize = "14px";
        searchButton.style.backgroundColor = "#4CAF50";
        searchButton.style.color = "white";
        searchButton.style.border = "none";
        searchButton.style.borderRadius = "5px";
        searchButton.style.zIndex = "9999"; // 确保按钮在最上层
        searchButton.style.cursor = "pointer";

        // 将按钮添加到页面
        document.body.appendChild(searchButton);

        // 获取视频标题
        let videoTitle = document.title || ""; // 默认使用页面标题
        if (!videoTitle) {
            alert("未找到视频标题！");
            return;
        }

        // 使用正则表达式匹配英文逗号前的内容
        const match = videoTitle.match(/([^,]+),/);
        if (match) {
            videoTitle = match[1].trim(); // 获取匹配的内容并去除两端空白字符
        } else {
            videoTitle = videoTitle.trim(); // 如果没有匹配到，使用原始标题
        }

        // 按钮点击事件
        searchButton.addEventListener("click", () => {
            const encodedTitle = encodeURIComponent(videoTitle);

            // 在抖音搜索
            GM_openInTab(`https://www.douyin.com/search/${encodedTitle}`, { active: false });

            // 在B站搜索
            GM_openInTab(`https://www.bilibili.com/search?keyword=${encodedTitle}`, { active: false });
        });

        console.log("搜索按钮已添加到页面！");
    }
})();
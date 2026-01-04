// ==UserScript==
// @name         Steam to Epic Store Search Redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  添加按钮跳转到 Epic Games Store 的搜索页面
// @author       You
// @match        https://store.steampowered.com/*
// @icon         https://cdn.akamai.steamstatic.com/steamcommunity/public/images/steam_logo.png
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520110/Steam%20to%20Epic%20Store%20Search%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/520110/Steam%20to%20Epic%20Store%20Search%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取 Steam 页面上的游戏名称（中文名称）
    const gameTitle = document.querySelector('.apphub_AppName')?.textContent || document.title;

    // 如果获取到游戏名称
    if (gameTitle) {
        // 创建跳转按钮
        let btn = document.createElement('button');
        btn.innerText = '跳转到 Epic 商店搜索';

        // 设置按钮的样式
        btn.style.marginTop = '10px';
        btn.style.padding = '7px 15px';  // 增加按钮的内边距，按钮增大
        btn.style.backgroundColor = '#fff';  // 设置按钮背景色为白色
        btn.style.color = '#000';  // 设置文字颜色为黑色
        btn.style.border = '1px solid #000';  // 给按钮添加黑色边框
        btn.style.cursor = 'pointer';  // 鼠标指针效果
        btn.style.fontSize = '15px';  // 设置字体大小为原来的一点五倍
        btn.style.height = '30px';  // 设置按钮高度为原来的一点五倍
        btn.style.textAlign = 'center';  // 设置文字居中
        btn.style.display = 'flex';  // 使用flex布局
        btn.style.alignItems = 'center';  // 垂直居中
        btn.style.justifyContent = 'center';  // 水平居中

        // 尝试选择一个页面上可靠的容器元素来插入按钮
        let container = document.querySelector('.apphub_HeaderStandardTop');  // 标题区域的上方区域
        if (!container) {
            container = document.querySelector('.game_header');  // 如果没有找到，则选择另一个区域
        }

        if (container) {
            container.appendChild(btn);  // 将按钮添加到页面

            // 按钮点击事件
            btn.addEventListener('click', (e) => {
                e.preventDefault();

                // 创建 Epic Games Store 搜索页面的 URL，使用中文游戏名称进行搜索
                const epicSearchUrl = `https://store.epicgames.com/zh-CN/browse?q=${encodeURIComponent(gameTitle)}&sortBy=relevancy&sortDir=DESC&count=40`;

                // 跳转到 Epic Games Store 的搜索页面
                console.log('跳转链接：', epicSearchUrl);
                window.open(epicSearchUrl, '_blank');
            });
        }
    }
})();

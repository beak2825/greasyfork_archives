// ==UserScript==
// @name         Steam游戏详细信息
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在Steam商店页面添加一个“查看详细信息”按钮，点击后在新标签页中跳转到SteamDB页面
// @author       myncdw
// @match        https://store.steampowered.com/app/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506057/Steam%E6%B8%B8%E6%88%8F%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/506057/Steam%E6%B8%B8%E6%88%8F%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建“查看详细信息”按钮的函数
    function createJumpButton() {
        const button = document.createElement('a');
        button.className = 'btn_green_steamui btn_medium';
        button.style.float = 'right'; // 让按钮参与浮动布局
        button.style.display = 'inline-block'; // 确保按钮与其他按钮在同一行显示
        button.style.verticalAlign = 'middle'; // 调整垂直对齐以防止错位
        button.target = '_blank'; // 设置为在新标签页中打开

        const currentUrl = window.location.href;
        const appIdMatch = currentUrl.match(/\/app\/(\d+)/);
        if (appIdMatch) {
            const appId = appIdMatch[1];
            const steamDbUrl = `https://steamdb.info/app/${appId}`;
            button.href = steamDbUrl; // 将按钮的href设置为SteamDB的URL
        }

        const span = document.createElement('span');
        span.textContent = '查看详细信息';
        button.appendChild(span);

        // 尝试找到“添加至购物车”按钮
        const addToCartDiv = document.querySelector('.btn_addtocart');
        if (addToCartDiv) {
            // 确保按钮在 addToCartDiv 的右侧
            addToCartDiv.parentNode.insertBefore(button, addToCartDiv.nextSibling);
        } else {
            console.error('未找到“添加至购物车”按钮');
        }
    }

    // 使用MutationObserver在页面加载完成后创建按钮
    // const observer = new MutationObserver((mutations, obs) => {
    //     if (document.querySelector('.btn_addtocart')) {
    //         createJumpButton();
    //         obs.disconnect();
    //     }
    // });

    // observer.observe(document.body, {
    //     childList: true,
    //     subtree: true
    // });

    window.addEventListener('load', () => {
        createJumpButton();
    });
})();

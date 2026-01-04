// ==UserScript==
// @name         B站巨型网页模式摇杆
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动检测并修改 Bilibili 网页摇杆元素的样式
// @author       无名可取的我真惨
// @match        https://live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519320/B%E7%AB%99%E5%B7%A8%E5%9E%8B%E7%BD%91%E9%A1%B5%E6%A8%A1%E5%BC%8F%E6%91%87%E6%9D%86.user.js
// @updateURL https://update.greasyfork.org/scripts/519320/B%E7%AB%99%E5%B7%A8%E5%9E%8B%E7%BD%91%E9%A1%B5%E6%A8%A1%E5%BC%8F%E6%91%87%E6%9D%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        var gameElement = document.querySelector('#game-id');
        if (gameElement && gameElement.style.zIndex !== '1001') {
            gameElement.style.zIndex = '1001';
            console.log('动态检测到 #game-id 元素，z-index 修改为 1001');
        }

        var innerElement = document.querySelector('#game-id > div.ganme-id-interactive-game-bounce');
        if (innerElement) {
            innerElement.style.width = '90px';
            innerElement.style.height = '90px';
            console.log('动态检测到 #game-id > div.ganme-id-interactive-game-bounce 元素，width 和 height 修改为 90px');
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    console.log('脚本已启动，正在监听 DOM 变化...');
})();
// ==UserScript==
// @name         Agar.io 顯示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  鍵盤顯示
// @author       jack9246
// @match        https://agario.xingkong.tw/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497985/Agario%20%E9%A1%AF%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/497985/Agario%20%E9%A1%AF%E7%A4%BA.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 定義盒子的樣式
    var boxStyle = `
        position: absolute;
        padding: 10px;
        background-color: transparent;
        border: 2px solid black;
        text-align: center;
        line-height: 1;
        white-space: nowrap; /* 防止文字換行 */
        font-weight: bold; /* 文字加粗 */
        color: black; /* 文字颜色 */
    `;

    // 定義較大盒子的樣式
    var largeBoxStyle = `
        font-size: 20px;
        padding: 20px;
    `;

    // 創建一個容器來放置按鍵盒子
    var keyBoxContainer = document.createElement('div');
    keyBoxContainer.id = 'keyBoxContainer';
    keyBoxContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 10px;
        transform: translateY(-50%);
        z-index: 9999;
        transition: opacity 0.5s ease; /* 添加淡出效果 */
        opacity: 0; /* 隐藏初始状态 */
    `;

    // 將容器添加到頁面
    document.body.appendChild(keyBoxContainer);

    var hideTimer; // 用于延时隐藏盒子的计时器

    // 添加按鍵盒子
    function addKeyBox(key, color, isLarge) {
        var box = document.createElement('div');
        box.className = 'keyBox';
        box.textContent = key.toUpperCase();
        box.dataset.color = color;
        var style = isLarge ? `${boxStyle} ${largeBoxStyle}` : boxStyle;
        box.style.cssText = `
            ${style}
            background-color: ${color}; /* 背景颜色填充 */
            border-color: ${color};
        `;
        keyBoxContainer.appendChild(box);

        // 每次添加新盒子时重置计时器
        resetHideTimer();

        // 新盒子添加后，移除第一个盒子
        if (keyBoxContainer.childNodes.length > 1) {
            keyBoxContainer.removeChild(keyBoxContainer.childNodes[0]);
        }
    }

    // 监听键盘按下事件
    document.addEventListener('keydown', function(event) {
        var key = event.key.toUpperCase();
        var color = getRandomColor();
        var isLarge = (key === ' ' || key === 'SHIFT'); // 判斷是否為空白鍵或Shift鍵

        addKeyBox(key, color, isLarge);
    });

    // 监听键盘抬起事件
    document.addEventListener('keyup', function(event) {
        // 停止计时器以确保不会隐藏盒子
        clearTimeout(hideTimer);
        // 重新设置计时器，2秒后隐藏盒子
        hideTimer = setTimeout(function() {
            keyBoxContainer.style.opacity = 0;
        }, 2000);
    });

    // 重置隐藏计时器
    function resetHideTimer() {
        // 每次按鍵按下时重置计时器并显示盒子
        keyBoxContainer.style.opacity = 1;
        clearTimeout(hideTimer);
        hideTimer = setTimeout(function() {
            keyBoxContainer.style.opacity = 0;
        }, 2000);
    }

    // 生成隨機顏色
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

})();

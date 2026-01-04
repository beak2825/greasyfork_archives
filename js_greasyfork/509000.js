// ==UserScript==
// @name         自动模拟鼠标移动（屏幕中心，500像素）并显示运行信息，刷网课防止暂停
// @namespace    none
// @version      0.2
// @description  每隔2分钟模拟鼠标从屏幕中心向四个方向移动500像素，并显示运行信息
// @match        https://ua.peixunyun.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509000/%E8%87%AA%E5%8A%A8%E6%A8%A1%E6%8B%9F%E9%BC%A0%E6%A0%87%E7%A7%BB%E5%8A%A8%EF%BC%88%E5%B1%8F%E5%B9%95%E4%B8%AD%E5%BF%83%EF%BC%8C500%E5%83%8F%E7%B4%A0%EF%BC%89%E5%B9%B6%E6%98%BE%E7%A4%BA%E8%BF%90%E8%A1%8C%E4%BF%A1%E6%81%AF%EF%BC%8C%E5%88%B7%E7%BD%91%E8%AF%BE%E9%98%B2%E6%AD%A2%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/509000/%E8%87%AA%E5%8A%A8%E6%A8%A1%E6%8B%9F%E9%BC%A0%E6%A0%87%E7%A7%BB%E5%8A%A8%EF%BC%88%E5%B1%8F%E5%B9%95%E4%B8%AD%E5%BF%83%EF%BC%8C500%E5%83%8F%E7%B4%A0%EF%BC%89%E5%B9%B6%E6%98%BE%E7%A4%BA%E8%BF%90%E8%A1%8C%E4%BF%A1%E6%81%AF%EF%BC%8C%E5%88%B7%E7%BD%91%E8%AF%BE%E9%98%B2%E6%AD%A2%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用于记录运行次数
    let runCount = 0;
    const intervalTime = 120000; // 每2分钟执行一次
    const moveDistance = 500; // 移动距离500像素

    // 创建并显示信息的div
    function createInfoDiv() {
        const infoDiv = document.createElement('div');
        infoDiv.id = 'run-info';
        infoDiv.style.position = 'fixed';
        infoDiv.style.top = '10px';
        infoDiv.style.right = '10px';
        infoDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        infoDiv.style.color = 'white';
        infoDiv.style.padding = '10px';
        infoDiv.style.fontSize = '14px';
        infoDiv.style.zIndex = '10000';
        infoDiv.style.borderRadius = '5px';
        document.body.appendChild(infoDiv);
        updateInfoDiv();
    }

    // 更新显示的信息
    function updateInfoDiv() {
        const infoDiv = document.getElementById('run-info');
        const currentTime = new Date().toLocaleTimeString(); // 获取当前时间
        infoDiv.innerHTML = `
            <p>第 ${runCount} 次运行</p>
            <p>上次运行时间：${currentTime}</p>
            <p>每次间隔：${(intervalTime / 60000)} 分钟</p>
        `;
    }

    // 模拟鼠标移动
    function moveMouse() {
        // 运行次数增加
        runCount++;

        // 获取屏幕的宽度和高度
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // 计算屏幕的中心点
        const centerX = screenWidth / 2;
        const centerY = screenHeight / 2;

        // 模拟鼠标从屏幕中心向四个方向移动500像素
        var directions = [
            {dx: centerX, dy: centerY + moveDistance},   // 向下移动500像素
            {dx: centerX, dy: centerY - moveDistance},   // 向上移动500像素
            {dx: centerX + moveDistance, dy: centerY},   // 向右移动500像素
            {dx: centerX - moveDistance, dy: centerY}    // 向左移动500像素
        ];

        // 顺序模拟四个方向的鼠标移动
        directions.forEach(function(direction) {
            var event = new MouseEvent('mousemove', {
                'view': window,
                'bubbles': true,
                'cancelable': true,
                'clientX': direction.dx,
                'clientY': direction.dy
            });
            document.dispatchEvent(event);
        });

        // 每次移动后更新显示信息
        updateInfoDiv();
    }

    // 初始化并创建信息显示
    createInfoDiv();

    // 每隔2分钟（120000毫秒）移动一次鼠标
    setInterval(moveMouse, intervalTime);
})();

// ==UserScript==
// @name         红包自助领取
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一个计划，用钱换流量。应该没有同行，现金红包看着补
// @author       212741
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546206/%E7%BA%A2%E5%8C%85%E8%87%AA%E5%8A%A9%E9%A2%86%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/546206/%E7%BA%A2%E5%8C%85%E8%87%AA%E5%8A%A9%E9%A2%86%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置默认跳转链接（可在弹窗中修改）
    let targetUrl = "https://link3.cc/rwcc";

    // 创建主跳转按钮
    const mainButton = document.createElement('button');
    mainButton.textContent = '领取红包';
    mainButton.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        padding: 8px 15px;
        background: #4285f4;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        z-index: 99999;
        font-size: 14px;
    `;

    // 创建控制按钮（可拖拽+切换显示/隐藏+修改链接）
    const controlButton = document.createElement('button');
    controlButton.textContent = '控制';
    controlButton.style.cssText = `
        position: fixed;
        top: 10px;
        left: 120px;
        padding: 4px 8px;
        background: #f1f3f4;
        color: #3c4043;
        border: 1px solid #dadce0;
        border-radius: 4px;
        cursor: move; /* 拖拽光标 */
        z-index: 99999;
        font-size: 12px;
    `;

    // 跳转功能
    mainButton.addEventListener('click', () => {
        window.location.href = targetUrl;
    });

    // 切换显示/隐藏功能
    controlButton.addEventListener('click', (e) => {
        // 阻止点击事件影响拖拽
        e.stopPropagation();
        const isHidden = mainButton.style.display === 'none';
        mainButton.style.display = isHidden ? 'block' : 'none';
    });

    // 右键点击控制按钮修改链接
    controlButton.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const newUrl = prompt('请输入新的跳转链接：', targetUrl);
        if (newUrl && newUrl.trim()) {
            targetUrl = newUrl.trim();
            alert('链接已更新为：' + targetUrl);
        }
    });

    // 控制按钮拖拽功能
    let isDragging = false;
    let offsetX, offsetY;

    controlButton.addEventListener('mousedown', (e) => {
        // 仅左键拖拽
        if (e.button !== 0) return;
        isDragging = true;
        // 计算鼠标与按钮左上角的偏移量
        offsetX = e.clientX - controlButton.getBoundingClientRect().left;
        offsetY = e.clientY - controlButton.getBoundingClientRect().top;
        controlButton.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        // 计算新位置（基于视口）
        const newLeft = e.clientX - offsetX;
        const newTop = e.clientY - offsetY;
        // 设置位置（避免超出可视区域）
        controlButton.style.left = Math.max(0, newLeft) + 'px';
        controlButton.style.top = Math.max(0, newTop) + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            controlButton.style.cursor = 'move';
        }
    });

    // 添加按钮到页面
    document.body.appendChild(mainButton);
    document.body.appendChild(controlButton);
})();
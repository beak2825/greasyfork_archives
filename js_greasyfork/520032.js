// ==UserScript==
// @name         显示鼠标坐标
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  显示鼠标位置的坐标
// @author       Gao
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520032/%E6%98%BE%E7%A4%BA%E9%BC%A0%E6%A0%87%E5%9D%90%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/520032/%E6%98%BE%E7%A4%BA%E9%BC%A0%E6%A0%87%E5%9D%90%E6%A0%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个 div 显示坐标
    const coordDisplay = document.createElement('div');
    coordDisplay.style.position = 'fixed';
    coordDisplay.style.bottom = '10px';
    coordDisplay.style.left = '10px';
    coordDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    coordDisplay.style.color = 'white';
    coordDisplay.style.padding = '5px';
    coordDisplay.style.borderRadius = '5px';
    coordDisplay.style.fontSize = '14px';
    coordDisplay.style.zIndex = '9999';
    document.body.appendChild(coordDisplay);

    // 监听鼠标移动事件
    document.addEventListener('mousemove', function(event) {
        // 获取相对浏览器的坐标
        const x = event.clientX;
        const y = event.clientY;
        // 更新坐标显示
        coordDisplay.textContent = `X: ${x}, Y: ${y}`;
    });
})();

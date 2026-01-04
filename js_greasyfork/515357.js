// ==UserScript==
// @name         Mouse Circle Drawer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Draw circles with the mouse to prevent idle detection
// @author       Your Name
// @match        *://*/*   // 可以根据需要修改匹配的网页
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515357/Mouse%20Circle%20Drawer.user.js
// @updateURL https://update.greasyfork.org/scripts/515357/Mouse%20Circle%20Drawer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置画圈的参数
    const radius = 50; // 圆圈半径
    const interval = 1000; // 每次画圈的间隔（毫秒）
    
    // 创建一个画圈的函数
    function drawCircle() {
        const mouseX = Math.random() * window.innerWidth;
        const mouseY = Math.random() * window.innerHeight;

        const circle = document.createElement('div');
        circle.style.position = 'absolute';
        circle.style.width = `${radius * 2}px`;
        circle.style.height = `${radius * 2}px`;
        circle.style.borderRadius = '50%';
        circle.style.border = '2px solid transparent';
        circle.style.borderColor = 'rgba(0, 0, 255, 0.5)'; // 圆圈颜色
        circle.style.left = `${mouseX - radius}px`;
        circle.style.top = `${mouseY - radius}px`;
        circle.style.pointerEvents = 'none';
        document.body.appendChild(circle);

        // 在一定时间后移除圆圈
        setTimeout(() => {
            circle.remove();
        }, 1000);
    }

    // 定时调用画圈函数
    setInterval(drawCircle, interval);
})();

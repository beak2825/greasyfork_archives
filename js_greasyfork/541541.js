// ==UserScript==
// @name         iPhone学习通助手
// @namespace    ikaikail@ikaikail.com
// @version      1.0
// @description  学习通考试考不过？不存在的！
// @author       iKaiKail
// @match        *://*/*
// @grant        none
// @icon         https://apps.chaoxing.com/res/images/apk/logo.png
// @downloadURL https://update.greasyfork.org/scripts/541541/iPhone%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/541541/iPhone%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 创建图标元素
    const icon = document.createElement('img');
    icon.src = 'https://apps.chaoxing.com/res/images/apk/logo.png';
    icon.style.position = 'fixed';
    icon.style.width = '50px';
    icon.style.height = '50px';
    icon.style.zIndex = '9999';
    icon.style.cursor = 'move';
    icon.style.right = '20px';
    icon.style.bottom = '20px';
    icon.style.borderRadius = '50%';
    icon.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
    icon.title = '点击访问快捷指令';

    // 添加图标到页面
    document.body.appendChild(icon);

    // 拖动功能变量
    let isDragging = false;
    let currentX, currentY, initialX, initialY;
    let xOffset = 0, yOffset = 0;

    // 鼠标按下事件 - 开始拖动
    icon.addEventListener('mousedown', dragStart);

    // 鼠标移动事件
    document.addEventListener('mousemove', drag);

    // 鼠标松开事件
    document.addEventListener('mouseup', dragEnd);

    // 点击事件 - 跳转链接
    icon.addEventListener('click', function(e) {
        // 防止拖动时触发点击
        if (!isDragging) {
            window.open('https://www.icloud.com/shortcuts/f0d0a97e152142028bf037cb7be786d9', '_blank');
        }
    });

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === icon) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, icon);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }
})();
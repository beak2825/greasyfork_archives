// ==UserScript==
// @name         网页链接提取器
// @namespace    https://greasyfork.org/
// @version      0.3
// @description  提取当前网页上的所有超链接及其文本，并支持拖动图标
// @author       barnett
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509498/%E7%BD%91%E9%A1%B5%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/509498/%E7%BD%91%E9%A1%B5%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建圆形图标
    const circleIcon = document.createElement('div');
    circleIcon.style.width = '50px';
    circleIcon.style.height = '50px';
    circleIcon.style.borderRadius = '50%';
    circleIcon.style.backgroundColor = '#4CAF50';
    circleIcon.style.color = 'white';
    circleIcon.style.textAlign = 'center';
    circleIcon.style.lineHeight = '50px';
    circleIcon.style.position = 'fixed';
    circleIcon.style.top = '10px';
    circleIcon.style.right = '10px';
    circleIcon.style.cursor = 'pointer';
    circleIcon.textContent = '🔗';
    circleIcon.style.zIndex = '9999'; // 设置 z-index 确保图标在最上面
    document.body.appendChild(circleIcon);

    // 创建文本框
    const textBox = document.createElement('textarea');
    textBox.style.position = 'fixed';
    textBox.style.top = '70px';
    textBox.style.right = '10px';
    textBox.style.width = '200px';
    textBox.style.height = '150px';
    textBox.style.border = '1px solid #ccc';
    textBox.style.padding = '5px';
    textBox.style.zIndex = '9998'; // 同样设置文本框的 z-index
    document.body.appendChild(textBox);

    // 点击图标获取链接
    circleIcon.addEventListener('click', function() {
        const links = document.querySelectorAll('a');
        let linksText = '';
        links.forEach(link => {
            const text = link.textContent.trim();
            const href = link.getAttribute('href');
            linksText += `${text},${href}\n`;
        });
        textBox.value = linksText;
    });

    // 拖动图标功能
    let isDragging = false;
    let offsetX, offsetY;

    circleIcon.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - circleIcon.getBoundingClientRect().left;
        offsetY = e.clientY - circleIcon.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            circleIcon.style.left = `${e.clientX - offsetX}px`;
            circleIcon.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
})();
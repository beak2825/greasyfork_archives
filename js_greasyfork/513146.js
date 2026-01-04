// ==UserScript==
// @name         ABX的简单文本复制
// @namespace    http://tampermonkey.net/
// @version      2024-10-10
// @description  copy everything!
// @author       ABX
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513146/ABX%E7%9A%84%E7%AE%80%E5%8D%95%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/513146/ABX%E7%9A%84%E7%AE%80%E5%8D%95%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
   // 创建一个气泡元素
    const tooltip = document.createElement('div');
    tooltip.id = 'copy-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.visibility = 'hidden';
    tooltip.style.backgroundColor = '#333'; //背景颜色
    tooltip.style.color = '#fff'; //文字颜色
    tooltip.style.padding = '5px';
    tooltip.style.borderRadius = '5px';
    tooltip.style.fontSize = '12px';
    tooltip.style.zIndex = '1000';
    tooltip.style.opacity = '0.7'; // 设置透明度为0.7
    document.body.appendChild(tooltip);

    // 为文档添加右键点击事件监听器
    document.addEventListener('contextmenu', function(event) {
        const targetElement = event.target;
        let disTime = 1500; // 初始消失时间（毫秒）


        // 检查元素是否包含文本
        if (targetElement && targetElement.textContent) {
            const textToCopy = targetElement.textContent.trim();

            // 创建一个用于复制的临时元素
            const tempInput = document.createElement('input');
            tempInput.style.position = 'absolute';
            tempInput.style.left = '-9999px';
            tempInput.value = textToCopy;
            document.body.appendChild(tempInput);

            // 选中文本并复制
            tempInput.select();
            tempInput.setSelectionRange(0, 99999);
            document.execCommand('copy');

            // 移除临时元素
            document.body.removeChild(tempInput);

            // 显示气泡提示
            tooltip.textContent = 'ABX的简单复制: \n' + textToCopy;
            tooltip.style.visibility = 'visible';
            tooltip.style.top = `${event.pageY + 15}px`;
            tooltip.style.left = `${event.pageX + 15}px`;

            // 隐藏气泡提示
            setTimeout(() => {
                tooltip.style.visibility = 'hidden';
            }, disTime);
        }
    });
})();
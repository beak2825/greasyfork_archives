// ==UserScript==
// @name         Canvas2PNG
// @namespace    https://tampermonkey.net/
// @version      0.2.0
// @description  将Canvas下载为PNG图片
// @author       FakerJMS
// @match        http*://*.designkit.com/*
// @icon         https://www.bing.com/sa/simg/favicon-trans-bg-blue-mg.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530171/Canvas2PNG.user.js
// @updateURL https://update.greasyfork.org/scripts/530171/Canvas2PNG.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取时间戳: YYYYMMDD_HHMMSS
    function fk_get_timestamp() {
        let now = new Date();
        let year = now.getFullYear();
        let month = String(now.getMonth() + 1).padStart(2, '0');
        let day = String(now.getDate()).padStart(2, '0');
        let hours = String(now.getHours()).padStart(2, '0');
        let minutes = String(now.getMinutes()).padStart(2, '0');
        let seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }

    // 下载Canvas为PNG图片
    function fk_download_canvas(fk_selector) {
        // 获取待下载canvas
        let canvas = document.querySelector(fk_selector);
        if (!canvas || canvas.tagName.toLowerCase() !== 'canvas') {
            alert('未找到找到指定的canvas !!!');
            return;
        }

        // 生成文件名
        let timestamp = fk_get_timestamp();
        let filename = `fk-canvas-${timestamp}.png`;

        // 下载canvas为PNG图片
        let data_url = canvas.toDataURL('image/png');
        let link = document.createElement('a');
        link.href = data_url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 添加下载按钮
    //
    let fk_button = document.createElement('button');
    fk_button.style.position = 'fixed';
    fk_button.style.left = '10px';
    fk_button.style.top = '50%';
    fk_button.style.transform = 'translateY(-50%)';
    fk_button.style.zIndex = '99999';
    fk_button.textContent = '下载Canvas';
    // 样式
    fk_button.style.backgroundColor = '#4CAF50'; // Green background
    fk_button.style.color = 'white'; // White text
    fk_button.style.border = 'none'; // No border
    fk_button.style.borderRadius = '5px'; // Rounded corners
    fk_button.style.padding = '10px 20px'; // Padding inside the button
    fk_button.style.fontSize = '16px'; // Font size
    fk_button.style.cursor = 'pointer'; // Pointer cursor on hover
    fk_button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)'; // Shadow effect
    fk_button.style.transition = 'background-color 0.3s ease'; // Smooth transition for background color
    //
    fk_button.addEventListener('mouseenter', function() {
        fk_button.style.backgroundColor = '#45a049'; // Darker green on hover
    });

    fk_button.addEventListener('mouseleave', function() {
        fk_button.style.backgroundColor = '#4CAF50'; // Original green on leave
    });
    //
    fk_button.addEventListener('click', function() {
        let fk_selector = prompt('请输入canvas的选择器: ');

        if (fk_selector === null || fk_selector === '') {
            return;
        }
        fk_download_canvas(fk_selector);
    });
    //
    document.body.appendChild(fk_button);
})();
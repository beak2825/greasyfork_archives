// ==UserScript==
// @name         隐藏优酷水印
// @namespace    https://space.bilibili.com/156879193?spm_id_from=333.1007.0.0
// @version      2023-12-24
// @description  隐藏优酷全屏、宽屏水印
// @author       好运
// @match        https://v.youku.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483046/%E9%9A%90%E8%97%8F%E4%BC%98%E9%85%B7%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/483046/%E9%9A%90%E8%97%8F%E4%BC%98%E9%85%B7%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

// 你的代码放在这里
(function() {
    //'use strict';
    // 设置延迟时间（毫秒）
    var delayTime = 2000;

    console.log(delayTime + '代码启动');

    // 定义函数，用于隐藏水印元素
    function hideWatermark() {

        // 查找所有水印元素
        var watermarkElements = document.querySelectorAll('.kui-watermark-youku-watermark');

        // 关闭第二个水印元素
        if (watermarkElements.length >= 2) {
            var secondWatermarkElement = watermarkElements[1];
            secondWatermarkElement.style.display = 'none';

            console.log('Second watermark element hidden.');
        } else {
            console.log('No second watermark element found.');
        }
    }

    // 使用 window.onload 事件
    window.onload = function() {
        // 等待一段时间后执行脚本
        setTimeout(hideWatermark, delayTime);
    };

    // 在两个图标点击时执行脚本
    var icons = document.querySelectorAll('.kui-webfullscreen-icon-0, .kui-fullscreen-icon-0');
    icons.forEach(function(icon) {
        icon.addEventListener('click', function() {
            // 重新执行脚本
            setTimeout(hideWatermark, delayTime);
        });
    });
})();
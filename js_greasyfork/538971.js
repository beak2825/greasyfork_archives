// ==UserScript==
// @name         北交新课程平台绕过PPT下载限制
// @namespace    http://tampermonkey.net/
// @version      2025-06-10
// @description  有些课程限制PPT下载，只允许网页浏览，本脚本能退绕过下载限制
// @author       kongtaoxing
// @match        http://123.121.147.7:88/ve/back/coursePlatform/coursePlatform.shtml?method=toCoursePlatform*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=147.7
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538971/%E5%8C%97%E4%BA%A4%E6%96%B0%E8%AF%BE%E7%A8%8B%E5%B9%B3%E5%8F%B0%E7%BB%95%E8%BF%87PPT%E4%B8%8B%E8%BD%BD%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/538971/%E5%8C%97%E4%BA%A4%E6%96%B0%E8%AF%BE%E7%A8%8B%E5%B9%B3%E5%8F%B0%E7%BB%95%E8%BF%87PPT%E4%B8%8B%E8%BD%BD%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 查找目标元素：包含 goBackUpId() 的 controlBtn
        const targetButton = document.querySelector('.controlBtn[onclick="goBackUpId()"]');
        if (!targetButton) {
            console.log('未找到目标元素 .controlBtn[onclick="goBackUpId()"]');
            return;
        }

        // 查找目标按钮的父容器
        const parentContainer = targetButton.closest('div[style*="display: inline-block"][style*="float: left"][style*="margin-bottom: 10px"]');
        if (!parentContainer) {
            console.log('未找到目标父容器');
            return;
        }

        // 创建新的下载按钮，模仿现有结构
        const downloadButton = document.createElement('div');
        downloadButton.className = 'controlBtn'; // 与返回按钮保持相同类名
        downloadButton.innerHTML = '<div data-relingo-block="true" data-relin-paragraph="20">下载PPT</div>';
        downloadButton.onclick = function() {
            downloads(); // 调用 downloads() 函数
        };

        // 将新按钮插入到“返回”按钮之后
        targetButton.insertAdjacentElement('afterend', downloadButton);
    });
})();
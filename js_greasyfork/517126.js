// ==UserScript==
// @name         提取电影或电视剧ID并复制到剪切板
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  提取当前页面网址中的电影或电视剧ID并复制到剪切板，并在页面中固定显示ID
// @author       You
// @match        https://www.themoviedb.org/movie/*
// @match        https://www.themoviedb.org/tv/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517126/%E6%8F%90%E5%8F%96%E7%94%B5%E5%BD%B1%E6%88%96%E7%94%B5%E8%A7%86%E5%89%A7ID%E5%B9%B6%E5%A4%8D%E5%88%B6%E5%88%B0%E5%89%AA%E5%88%87%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/517126/%E6%8F%90%E5%8F%96%E7%94%B5%E5%BD%B1%E6%88%96%E7%94%B5%E8%A7%86%E5%89%A7ID%E5%B9%B6%E5%A4%8D%E5%88%B6%E5%88%B0%E5%89%AA%E5%88%87%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的URL
    const url = window.location.href;

    // 使用正则表达式提取movie或tv后的数字部分
    const match = url.match(/\/(movie|tv)\/(\d+)/);
    if (match) {
        const mediaId = match[2];  // 提取出数字部分（ID）
        
        // 将提取到的ID复制到剪切板
        GM_setClipboard(mediaId);

        // 创建一个自定义弹窗
        const popup = document.createElement('div');
        popup.innerHTML = `${match[1].toUpperCase()} ID: <span style="font-size: 36px; font-weight: bold;">${mediaId}</span> 已复制到剪切板`;
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        popup.style.color = 'white';
        popup.style.padding = '20px';
        popup.style.borderRadius = '8px';
        popup.style.fontSize = '18px';
        popup.style.textAlign = 'center';
        popup.style.zIndex = '10000';
        
        document.body.appendChild(popup);

        // 设置3秒后自动移除弹窗
        setTimeout(() => {
            popup.remove();
        }, 3000);

        // 在页面顶部创建一个固定显示的高亮区域
        const fixedDisplay = document.createElement('div');
        fixedDisplay.innerHTML = `当前${match[1].toUpperCase()} ID: <span style="font-size: 24px; font-weight: bold; color: yellow;">${mediaId}</span>`;
        fixedDisplay.style.position = 'fixed';
        fixedDisplay.style.top = '0';
        fixedDisplay.style.left = '0';
        fixedDisplay.style.width = '100%';
        fixedDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        fixedDisplay.style.color = 'white';
        fixedDisplay.style.padding = '10px';
        fixedDisplay.style.textAlign = 'center';
        fixedDisplay.style.fontSize = '20px';
        fixedDisplay.style.zIndex = '10000';

        // 将高亮显示区域添加到页面
        document.body.appendChild(fixedDisplay);
    } else {
        alert('未找到有效的ID');
    }
})();

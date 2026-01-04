// ==UserScript==
// @name         抖音用户主页视频链接提取器
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  提取抖音用户主页中的视频链接,并添加复制所有链接的悬浮按钮
// @author       骄阳哥
// @match        https://www.douyin.com/user/MS4*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        GM_setClipboard
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513362/%E6%8A%96%E9%9F%B3%E7%94%A8%E6%88%B7%E4%B8%BB%E9%A1%B5%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/513362/%E6%8A%96%E9%9F%B3%E7%94%A8%E6%88%B7%E4%B8%BB%E9%A1%B5%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let videoLinks = []; // 存储提取到的视频链接

    function extractVideoLinks() {
        // 获取包含视频列表的元素
        const videoList = document.querySelector('div[data-e2e="user-post-list"]');
        if (!videoList) {
            console.log('未找到视频列表元素');
            return;
        }

        // 提取所有以 "/video/" 开头的链接
        videoLinks = [...videoList.querySelectorAll('a[href^="/video/"]')].map(a => a.href);

        // 在控制台输出视频链接
        console.log('提取到的视频链接：');
        videoLinks.forEach(link => console.log(link));
    }

    function createFloatButton() {
        const button = document.createElement('button');
        button.textContent = '复制所有视频链接';
        button.style.position = 'fixed';
        button.style.right = '20px';
        button.style.top = '50%';
        button.style.transform = 'translateY(-50%)';
        button.style.zIndex = '9999';
        button.style.padding = '10px';
        button.style.backgroundColor = '#ff0050';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', copyVideoLinks);
        document.body.appendChild(button);
    }

    function copyVideoLinks() {
        extractVideoLinks()
        if (videoLinks.length === 0) {
            alert('未提取到视频链接,请等待页面加载完成后重试。');
            return;
        }
        GM_setClipboard(videoLinks.join('\n'));
        alert(`已复制 ${videoLinks.length} 个视频链接到剪贴板。`);
    }

    // 在页面加载完成后提取视频链接
    //window.addEventListener('load', extractVideoLinks);

    // 创建悬浮按钮
    createFloatButton();
})();

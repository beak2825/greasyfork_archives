// ==UserScript==
// @name         上下翻转文字
// @namespace    dylanzhang
// @version      0.1
// @description  上下翻转页面上的文字,一个有趣无用的脚本
// @author       Dylan_Zhang
// @match        *://*/*
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535394/%E4%B8%8A%E4%B8%8B%E7%BF%BB%E8%BD%AC%E6%96%87%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/535394/%E4%B8%8A%E4%B8%8B%E7%BF%BB%E8%BD%AC%E6%96%87%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    // 创建全局翻转样式
    const style = document.createElement('style');
    style.textContent = `
        body {
            transform: scaleY(-1); /* 垂直翻转 */
            min-height: 100vh; /* 确保高度适应 */
            margin: 0;
        }

        /* 保持视频/图片正常方向（可选） */
        img, video {
            transform: scaleY(-1);
        }
    `;

    // 插入样式到页面头部
    document.head.appendChild(style);

    // 处理 fixed/fixed 定位元素
    [document.body, ...document.querySelectorAll('*')].forEach(el => {
        if(getComputedStyle(el).position === 'fixed') {
            el.style.transform += ' scaleY(-1)';
        }
    });
})();
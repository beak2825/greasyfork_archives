// ==UserScript==
// @name         视频截图
// @namespace    http://your-namespace.example.com
// @version      1.1
// @description  修改自@使用ALT+/快捷键截取视频截图
// @author       Your Name
// @match        *://*/*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/492062/%E8%A7%86%E9%A2%91%E6%88%AA%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/492062/%E8%A7%86%E9%A2%91%E6%88%AA%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener('keydown', function (e) {
        if (e.altKey && e.key === '/') {
            e.preventDefault();
            captureVideoScreenshot();
        }
    });

    function captureVideoScreenshot() {
        const videoElements = document.querySelectorAll('video');
        if (videoElements.length === 0) {
            console.log('没有找到视频元素。');
            return;
        }

        const video = videoElements[0]; // 获取第一个视频元素
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const currentDate = new Date();
        const dateStr = currentDate.toISOString().slice(0, 10);
        const timeStr = currentDate.toTimeString().split(' ')[0].replace(/:/g, '-');

        let filename = 'screenshot';

        // 获取视频标题
        const videoTitleElement = document.querySelector('title');
        if (videoTitleElement) {
            filename = videoTitleElement.textContent.trim();
        }

        filename += '_' + dateStr + '_' + timeStr + '.png';

        const screenshotDataUrl = canvas.toDataURL('image/png');

        // 创建一个下载链接
        const a = document.createElement('a');
        a.href = screenshotDataUrl;
        a.download = filename;
        a.click();

        console.log('截图已保存。');
    }
})();
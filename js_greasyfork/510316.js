// ==UserScript==
// @name         网页阅读进度条
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在网页顶部显示阅读进度条，估算阅读时间
// @author       jiangchh
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510316/%E7%BD%91%E9%A1%B5%E9%98%85%E8%AF%BB%E8%BF%9B%E5%BA%A6%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/510316/%E7%BD%91%E9%A1%B5%E9%98%85%E8%AF%BB%E8%BF%9B%E5%BA%A6%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const READING_SPEED = 200; // 每分钟阅读字数
    const PROGRESS_COLOR = '#4CAF50'; // 进度条颜色

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        #reading-progress-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 5px;
            background-color: #f0f0f0;
            z-index: 9999;
        }
        #reading-progress-bar {
            height: 100%;
            width: 0;
            transition: width 0.3s ease;
        }
        #reading-progress-info {
            position: fixed;
            top: 5px;
            right: 10px;
            background-color: rgba(255, 255, 255, 0.8);
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 12px;
            z-index: 9999;
        }
    `;
    document.head.appendChild(style);

    // 创建进度条、信息元素和章节导航
    function createProgressBar() {
        const progressContainer = document.createElement('div');
        progressContainer.id = 'reading-progress-container';

        const progressBar = document.createElement('div');
        progressBar.id = 'reading-progress-bar';
        progressBar.style.backgroundColor = PROGRESS_COLOR;

        const progressInfo = document.createElement('div');
        progressInfo.id = 'reading-progress-info';

        progressContainer.appendChild(progressBar);
        progressContainer.appendChild(progressInfo);
        document.body.appendChild(progressContainer);
    }

    // 估算阅读时间
    function estimateReadingTime() {
        const text = document.body.innerText;
        const wordCount = text.trim().split(/\s+/).length;
        const imageCount = document.getElementsByTagName('img').length;
        const videoCount = document.getElementsByTagName('video').length;

        const readingTime = wordCount / READING_SPEED + (imageCount * 10 / 60) + (videoCount * 2);
        return Math.ceil(readingTime);
    }

    let startTime = null;
    let actualReadingTime = 0;

    // 更新进度条和信息
    function updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;

        const progressBar = document.getElementById('reading-progress-bar');
        progressBar.style.width = scrollPercentage + '%';

        const totalMinutes = estimateReadingTime();

        const progressInfo = document.getElementById('reading-progress-info');
        progressInfo.textContent = `已读 ${Math.round(scrollPercentage)}% | 预计阅读时间: ${totalMinutes}分钟 | 实际阅读时间: ${Math.round(actualReadingTime)}分钟`;
    }

    // 初始化
    createProgressBar();
    updateProgress(); // 初始更新
    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);

    // 每分钟更新一次实际阅读时间
    setInterval(() => {
        if (startTime === null) {
            startTime = new Date().getTime();
        } else {
            const currentTime = new Date().getTime();
            actualReadingTime += (currentTime - startTime) / 1000 / 60;
            startTime = currentTime;
            updateProgress();
        }
    }, 60000);
})();
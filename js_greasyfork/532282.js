// ==UserScript==
// @name         Threads 自然瀏覽數提升腳本
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自動瀏覽 Threads 文章，模擬自然使用行為
// @author       ChatGPT
// @match        https://www.threads.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532282/Threads%20%E8%87%AA%E7%84%B6%E7%80%8F%E8%A6%BD%E6%95%B8%E6%8F%90%E5%8D%87%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/532282/Threads%20%E8%87%AA%E7%84%B6%E7%80%8F%E8%A6%BD%E6%95%B8%E6%8F%90%E5%8D%87%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取和设置目标文章和首页链接
    let THREADS_POST_URL = localStorage.getItem("THREADS_POST_URL");
    let HOME_URL = localStorage.getItem("HOME_URL");

    // 如果没有存储链接，使用默认链接
    if (!THREADS_POST_URL) THREADS_POST_URL = "https://www.threads.net/posts/xxxxxx";  // 替换成默认链接
    if (!HOME_URL) HOME_URL = "https://www.threads.net";  // 替换成默认首页链接

    // 创建按钮和日志显示区域
    const controlPanel = document.createElement('div');
    controlPanel.style.position = 'fixed';
    controlPanel.style.top = '10px';
    controlPanel.style.right = '10px';
    controlPanel.style.backgroundColor = '#f1f1f1';
    controlPanel.style.padding = '10px';
    controlPanel.style.border = '1px solid #ccc';
    controlPanel.style.zIndex = '9999';

    const logArea = document.createElement('div');
    logArea.style.height = '200px';
    logArea.style.overflowY = 'auto';
    logArea.style.backgroundColor = '#fff';
    logArea.style.border = '1px solid #ccc';
    logArea.style.padding = '5px';
    controlPanel.appendChild(logArea);

    const updatePostBtn = document.createElement('button');
    updatePostBtn.textContent = '更新目标文章';
    updatePostBtn.onclick = function() {
        const newPostUrl = prompt("请输入新的目标文章 URL:");
        if (newPostUrl) {
            THREADS_POST_URL = newPostUrl;
            localStorage.setItem("THREADS_POST_URL", THREADS_POST_URL);
            logMessage("目标文章链接已更新: " + THREADS_POST_URL);
        }
    };
    controlPanel.appendChild(updatePostBtn);

    const updateHomeBtn = document.createElement('button');
    updateHomeBtn.textContent = '更新首页 URL';
    updateHomeBtn.onclick = function() {
        const newHomeUrl = prompt("请输入新的首页 URL:");
        if (newHomeUrl) {
            HOME_URL = newHomeUrl;
            localStorage.setItem("HOME_URL", HOME_URL);
            logMessage("首页链接已更新: " + HOME_URL);
        }
    };
    controlPanel.appendChild(updateHomeBtn);

    document.body.appendChild(controlPanel);

    // 日志记录函数
    function logMessage(message) {
        const logEntry = document.createElement('div');
        logEntry.textContent = message;
        logArea.appendChild(logEntry);
        logArea.scrollTop = logArea.scrollHeight;  // 自动滚动到最底部
    }

    // 可更改的设置
    const STAY_TIME = [30000, 60000]; // 30~60秒停留
    const SCROLL_INTERVAL = [2000, 5000]; // 2~5秒滾動一次
    const BROWSE_TIME = [180000, 300000]; // 3~5分鐘瀏覽首頁
    const RANDOM_POST_COUNT = [1, 2]; // 隨機點擊 1~2 篇文章

    function randomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function scrollPage() {
        logMessage("開始滾動頁面...");
        const scrollStep = window.innerHeight * (Math.random() * 0.5 + 0.5);
        window.scrollBy({ top: scrollStep, behavior: 'smooth' });
        await wait(randomDelay(...SCROLL_INTERVAL));
        logMessage("完成滾動，等待下一次...");
    }

    async function browseHomePage() {
        const startTime = Date.now();
        const browseDuration = randomDelay(...BROWSE_TIME);
        logMessage("開始瀏覽首頁...");
        let browseCount = 0; // 控制随机点击次数
        while (Date.now() - startTime < browseDuration && browseCount < 2) {
            await scrollPage();
            if (Math.random() < 0.3 && browseCount < 2) {  // 随机触发文章点击
                logMessage("隨機點擊一篇文章...");
                let posts = document.querySelectorAll('.x1xdureb.xkbb5z.x13vxnyz');
                if (posts.length > 0) {
                    const randomPost = posts[Math.floor(Math.random() * posts.length)];
                    randomPost.click();
                    logMessage("點擊了文章，等待...");
                    await wait(randomDelay(5000, 15000));  // 停留 5-15秒
                    window.history.back();  // 返回首頁
                    await wait(randomDelay(2000, 5000));  // 停留 2-5秒
                    logMessage("返回首頁...");
                    browseCount++;
                }
            }
        }
    }

    async function startAutomation() {
        logMessage("開始自動化...");
        while (true) {
            // 如果不在目标文章页面，跳转
            if (window.location.href !== THREADS_POST_URL) {
                logMessage("正在跳轉到目標貼文頁...");
                window.location.href = THREADS_POST_URL;
                return;
            }

            // 等待目标文章加载完毕并开始操作
            await wait(randomDelay(...STAY_TIME));
            logMessage("正在停留於貼文頁...");

            // 随机滚动
            await scrollPage();

            // 点击Logo返回首页
            document.querySelectorAll('.x1i10hfl')[0]?.click();
            logMessage("返回首頁...");
            await wait(5000);

            // 在首页随机浏览
            await browseHomePage();

            // 返回目标文章
            logMessage("完成首頁瀏覽，返回目標貼文...");
            window.location.href = THREADS_POST_URL;
        }
    }

    // 监听页面加载完成
    window.addEventListener('load', () => {
        setTimeout(startAutomation, 5000);  // 延迟启动脚本，确保页面元素加载完毕
    });
})();
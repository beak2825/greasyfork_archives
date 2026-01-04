// ==UserScript==
// @name         Twitter个人首页信息获取
// @namespace    http://tampermonkey.net/
// @version      2025-08-18
// @description  This script retrieves all Tweets displayed on a Twitter profile page, with support for automatic scrolling and exporting to a JSON file.
// @author       Ivan HU
// @match        https://x.com/*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/546469/Twitter%E4%B8%AA%E4%BA%BA%E9%A6%96%E9%A1%B5%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/546469/Twitter%E4%B8%AA%E4%BA%BA%E9%A6%96%E9%A1%B5%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==
// 自动滚动页面并提取section元素
(function() {
    'use strict';

    let collectedSections = [];
    let currentScrollY = 0;
    let isScrolling = false;

    // 创建状态显示面板
    const statusPanel = document.createElement('div');
    statusPanel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px;
        border-radius: 8px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    `;

    const statusText = document.createElement('div');
    statusText.innerHTML = '<strong>滚动提取器</strong><br>准备开始...';

    // 输入框：滚动间隔
    const intervalLabel = document.createElement('div');
    intervalLabel.textContent = '滚动间隔(秒):';
    intervalLabel.style.cssText = 'margin-top: 5px; font-size: 12px;';

    const intervalInput = document.createElement('input');
    intervalInput.type = 'number';
    intervalInput.value = '3';
    intervalInput.min = '1';
    intervalInput.max = '10';
    intervalInput.style.cssText = `
        width: 100%;
        padding: 4px;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-top: 2px;
        font-size: 12px;
    `;

    const startButton = document.createElement('button');
    startButton.textContent = '开始滚动';
    startButton.style.cssText = `
        background: #1da1f2;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 5px;
        width: 100%;
    `;

    const continueButton = document.createElement('button');
    continueButton.textContent = '继续滚动';
    continueButton.style.cssText = `
        background: #794bc4;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 5px;
        width: 100%;
    `;

    const stopButton = document.createElement('button');
    stopButton.textContent = '停止';
    stopButton.style.cssText = `
        background: #e0245e;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 5px;
        width: 100%;
    `;

    const downloadButton = document.createElement('button');
    downloadButton.textContent = '导出HTML';
    downloadButton.style.cssText = `
        background: #17bf63;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 5px;
        width: 100%;
    `;

    const exportJsonButton = document.createElement('button');
    exportJsonButton.textContent = '导出JSON';
    exportJsonButton.style.cssText = `
        background: #f39c12;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 5px;
        width: 100%;
    `;

    const toggleButton = document.createElement('button');
    toggleButton.textContent = '−';
    toggleButton.style.cssText = `
        background: none;
        color: white;
        border: none;
        font-size: 16px;
        cursor: pointer;
        position: absolute;
        top: 5px;
        right: 10px;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    statusPanel.appendChild(toggleButton);
    statusPanel.appendChild(statusText);
    statusPanel.appendChild(intervalLabel);
    statusPanel.appendChild(intervalInput);
    statusPanel.appendChild(startButton);
    statusPanel.appendChild(continueButton);
    statusPanel.appendChild(stopButton);
    statusPanel.appendChild(downloadButton);
    statusPanel.appendChild(exportJsonButton);
    document.body.appendChild(statusPanel);

    // 添加折叠/展开功能
    let isCollapsed = true;
    const contentElements = [intervalLabel, intervalInput, startButton, continueButton, stopButton, downloadButton, exportJsonButton];

    function toggleCollapse() {
        isCollapsed = !isCollapsed;

        if (isCollapsed) {
            statusPanel.style.cssText += `
                width: auto;
                padding: 8px 25px 8px 15px;
                max-width: 200px;
            `;
            statusText.style.cssText = 'font-size: 12px; margin: 0;';
            toggleButton.textContent = '+';
            toggleButton.style.top = '3px';

            contentElements.forEach(el => {
                if (el !== statusText) {
                    el.style.display = 'none';
                }
            });
        } else {
            statusPanel.style.cssText += `
                width: 100%;
                padding: 15px;
                max-width: 300px;
            `;
            statusText.style.cssText = '';
            toggleButton.textContent = '−';
            toggleButton.style.top = '5px';

            contentElements.forEach(el => {
                if (el !== statusText) {
                    el.style.display = '';
                }
            });
        }
    }

    // 默认折叠
    toggleCollapse();

    function updateStatus(text) {
        statusText.innerHTML = text.replace(/\n/g, '<br>');
    }

    function extractSections() {
        const targetDivs = document.querySelectorAll('div[data-testid="cellInnerDiv"]');

        if (targetDivs.length === 0) {
            updateStatus('错误：未找到任何 data-testid="cellInnerDiv" 的div元素，停止滚动');
            stopScrolling();
            return;
        }

        let foundNew = false;
        targetDivs.forEach(div => {
            if (!collectedSections.includes(div)) {
                collectedSections.push(div);
                foundNew = true;
            }
        });

        if (!foundNew && collectedSections.length > 0) {
            updateStatus(`没有新元素，已收集 ${collectedSections.length} 个div\n滚动停止`);
            stopScrolling();
            return;
        }

        updateStatus(`已收集 ${collectedSections.length} 个div\n当前位置: ${window.scrollY}px`);
    }

    function scrollAndExtract() {
        if (!isScrolling) return;

        currentScrollY += 1500;

        if (currentScrollY >= document.body.scrollHeight) {
            updateStatus(`滚动完成！\n共收集 ${collectedSections.length} 个div`);
            isScrolling = false;
            return;
        }

        window.scrollTo(0, currentScrollY);

        const intervalSeconds = parseInt(intervalInput.value) || 3;

        // 等待页面稳定后提取元素
        setTimeout(() => {
            extractSections();
            if (isScrolling) {
                setTimeout(scrollAndExtract, intervalSeconds * 1000);
            }
        }, 2000);
    }

    function startScrolling() {
        if (isScrolling) return;

        isScrolling = true;
        currentScrollY = window.scrollY;
        collectedSections = []; // 重置收集列表
        updateStatus('开始滚动提取...');
        scrollAndExtract();
    }

    function continueScrolling() {
        if (isScrolling) return;

        isScrolling = true;
        currentScrollY = window.scrollY; // 从当前位置继续
        updateStatus(`继续滚动提取...\n已收集 ${collectedSections.length} 个div`);
        scrollAndExtract();
    }

    function stopScrolling() {
        isScrolling = false;
        updateStatus('已停止滚动');
    }

    function exportCollectedHTML() {
        if (collectedSections.length === 0) {
            alert('没有收集到任何section');
            return;
        }

        // 创建最简div容器
        const container = document.createElement('div');
        collectedSections.forEach(div => {
            const clone = div.cloneNode(true);
            container.appendChild(clone);
        });

        // 创建仅包含div的HTML
        const htmlContent = `<div>${container.innerHTML}</div>`;

        // 下载文件
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `extracted_divs_${collectedSections.length}_${Date.now()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        updateStatus(`已导出 ${collectedSections.length} 个div到文件`);
    }

    function exportCollectedJSON() {
        if (collectedSections.length === 0) {
            alert('没有收集到任何section');
            return;
        }

        const tweets = [];

        collectedSections.forEach(div => {
            const tweetData = {'浏览量': null, '链接': null, '文本': null, '时间': null};

            // Extract views and link from a tag with href ending in 'analytics'
            const analyticsLink = div.querySelector('a[href$="analytics"]');
            if (analyticsLink) {
                tweetData['浏览量'] = analyticsLink.textContent.trim();
                const href = analyticsLink.getAttribute('href');
                if (href) {
                    tweetData['链接'] = "https://x.com/" + href.replace("/analytics", "");
                }
            }

            // Extract text from div with data-testid='tweetText'
            const textDiv = div.querySelector('div[data-testid="tweetText"]');
            if (textDiv) {
                tweetData['文本'] = textDiv.textContent.trim();
            }

            // Extract time from time tag
            const timeTag = div.querySelector('time');
            if (timeTag) {
                tweetData['时间'] = timeTag.getAttribute('datetime') || timeTag.textContent.trim();
            }

            // Only add if we have at least some data
            if (tweetData['浏览量'] || tweetData['链接'] || tweetData['文本'] || tweetData['时间']) {
                tweets.push(tweetData);
            }
        });

        // Deduplicate by link
        const seenLinks = new Set();
        const uniqueTweets = [];

        tweets.forEach(tweet => {
            const link = tweet['链接'];
            if (link && !seenLinks.has(link)) {
                seenLinks.add(link);
                uniqueTweets.push(tweet);
            } else if (!link) {
                uniqueTweets.push(tweet);
            }
        });

        // Create JSON content
        const jsonContent = JSON.stringify(uniqueTweets, null, 2);

        // Download file
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `extracted_tweets_${uniqueTweets.length}_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        updateStatus(`已导出 ${uniqueTweets.length} 条数据到JSON文件`);
    }

    // 绑定事件
    startButton.addEventListener('click', startScrolling);
    continueButton.addEventListener('click', continueScrolling);
    stopButton.addEventListener('click', stopScrolling);
    downloadButton.addEventListener('click', exportCollectedHTML);
    exportJsonButton.addEventListener('click', exportCollectedJSON);
    toggleButton.addEventListener('click', toggleCollapse);

    // 初始提取当前可见的section
    extractSections();

    updateStatus(`初始化完成\n当前可见: ${collectedSections.length} 个div\n点击"开始滚动"开始自动提取`);

    // 确保面板在最上层
    setTimeout(() => {
        statusPanel.style.zIndex = "999999";
    }, 1000);

})();
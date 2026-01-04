// ==UserScript==
// @name         JavDB Rankings & Lists 数据提取器
// @namespace    http://your.namespace/
// @version      2.0
// @description  从 JavDB Rankings 和 Lists 页面提取数据，Rankings 忽略 FC2，Lists 提取标题，文件名动态生成
// @author       你
// @match        https://javdb.com/rankings/*
// @match        https://javdb.com/lists/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531029/JavDB%20Rankings%20%20Lists%20%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/531029/JavDB%20Rankings%20%20Lists%20%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 判断当前页面类型
    const isRankingsPage = window.location.pathname.startsWith('/rankings');
    const isListsPage = window.location.pathname.startsWith('/lists');

    let fileName, yearParam, buttonTarget, urlBase;

    // Rankings 页面配置
    if (isRankingsPage) {
        const selectedOption = document.querySelector('option[selected="selected"]');
        const year = selectedOption ? selectedOption.textContent.trim() : 'default';
        fileName = `${year}.txt`;
        yearParam = selectedOption ? selectedOption.value : 'default';
        buttonTarget = document.querySelector('h3.title.main-title');
        urlBase = 'https://javdb.com/rankings/top';
    }

    // Lists 页面配置
    if (isListsPage) {
        const listName = document.querySelector('span.actor-section-name')?.textContent.trim() || 'default';
        fileName = `${listName}.txt`;
        const listId = window.location.pathname.split('/lists/')[1].split('?')[0];
        yearParam = listId;
        buttonTarget = document.querySelector('span.actor-section-name');
        urlBase = `https://javdb.com/lists/${listId}`;
    }

    // 创建按钮
    const button = document.createElement('button');
    button.textContent = '提取';
    button.style.padding = '2px 8px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.marginLeft = '10px';
    button.style.verticalAlign = 'middle';

    // 插入按钮
    if (isRankingsPage && buttonTarget) {
        // Rankings：直接插入到 h3 的文本后
        buttonTarget.innerHTML += ' '; // 添加空格
        buttonTarget.appendChild(button);
    } else if (isListsPage && buttonTarget) {
        // Lists：保持原有插入方式
        buttonTarget.parentNode.insertBefore(button, buttonTarget.nextSibling);
    } else {
        document.body.appendChild(button);
    }

    // 点击事件
    button.addEventListener('click', async () => {
        button.disabled = true;
        button.textContent = '提取中...';

        let allContent = '';
        const maxPages = 20;

        // 检测总页数
        let totalPages = 1;
        const pagination = document.querySelector('.pagination');
        if (pagination) {
            const pageLinks = pagination.querySelectorAll('a.pagination-link');
            const pageNumbers = Array.from(pageLinks)
                .map(link => parseInt(link.textContent.trim(), 10))
                .filter(num => !isNaN(num));
            totalPages = pageNumbers.length > 0 ? Math.max(...pageNumbers) : 1;
            totalPages = Math.min(totalPages, maxPages);
        }

        console.log(`检测到的总页数: ${totalPages}`);

        // 循环请求每页
        for (let page = 1; page <= totalPages; page++) {
            const url = `${urlBase}?page=${page}${isRankingsPage ? `&t=${yearParam}` : ''}`;
            try {
                const response = await fetch(url);
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');

                if (isRankingsPage) {
                    // Rankings 页面提取
                    const rankings = Array.from(doc.querySelectorAll('span.ranking'))
                        .map(span => span.textContent.trim())
                        .filter(text => text.length > 0);
                    const videoTitles = Array.from(doc.querySelectorAll('div.video-title strong'))
                        .map(strong => strong.textContent.trim())
                        .filter(text => text.length > 0);

                    const filteredData = [];
                    const maxLength = Math.min(rankings.length, videoTitles.length);
                    for (let i = 0; i < maxLength; i++) {
                        if (!videoTitles[i].startsWith('FC2')) {
                            filteredData.push({
                                ranking: rankings[i],
                                title: videoTitles[i]
                            });
                        }
                    }

                    for (const data of filteredData) {
                        allContent += `Ranking: ${data.ranking}\n`;
                        allContent += `Tag: ${data.title}\n`;
                    }
                    console.log(`第 ${page} 页提取完成，找到 ${filteredData.length} 组数据（已跳过 FC2 开头）`);
                } else if (isListsPage) {
                    // Lists 页面提取
                    const videoTitles = Array.from(doc.querySelectorAll('div.video-title strong'))
                        .map(strong => strong.textContent.trim())
                        .filter(text => text.length > 0);

                    for (const title of videoTitles) {
                        allContent += `${title}\n`;
                    }
                    console.log(`第 ${page} 页提取完成，找到 ${videoTitles.length} 个标题`);
                }
            } catch (error) {
                console.error(`提取第 ${page} 页失败:`, error);
                allContent += `第 ${page} 页数据提取失败\n`;
            }
        }

        if (!allContent) {
            allContent = '未找到任何数据';
        }

        // 创建 Blob 并下载
        const blob = new Blob([allContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        button.disabled = false;
        button.textContent = '提取';
        console.log(`所有页数据已提取并保存到 ${fileName}！`);
    });
})();
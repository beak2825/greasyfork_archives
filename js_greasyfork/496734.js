// ==UserScript==
// @name         B站♥综合搜索进行时间排序
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  Bilibili 综合搜索按时间排序,新的搜索需要手动刷新触发
// @author       Zola
// @license      MIT
// @match        https://search.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496734/B%E7%AB%99%E2%99%A5%E7%BB%BC%E5%90%88%E6%90%9C%E7%B4%A2%E8%BF%9B%E8%A1%8C%E6%97%B6%E9%97%B4%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/496734/B%E7%AB%99%E2%99%A5%E7%BB%BC%E5%90%88%E6%90%9C%E7%B4%A2%E8%BF%9B%E8%A1%8C%E6%97%B6%E9%97%B4%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to convert date strings to Date objects
    // 将日期字符串转换为 Date 对象的函数
    function parseDate(dateStr) {
        console.log(`Parsing date: ${dateStr}`);
        const now = new Date();
        const relativeTimeMatch = dateStr.match(/(\d+)(分钟|小时|天)前/);
        if (relativeTimeMatch) {
            const value = parseInt(relativeTimeMatch[1], 10);
            const unit = relativeTimeMatch[2];
            if (unit === '分钟') {
                return new Date(now.getTime() - value * 60000); // 处理“几分钟前”的情况
            } else if (unit === '小时') {
                return new Date(now.getTime() - value * 3600000); // 处理“几小时前”的情况
            } else if (unit === '天') {
                return new Date(now.getTime() - value * 86400000); // 处理“几天前”的情况
            }
        }

        if (dateStr === '昨天') {
            return new Date(now.getTime() - 86400000); // 处理“昨天”的情况
        }

        const parts = dateStr.split('-').map(Number);
        if (parts.length === 2) { // 当前年份的日期格式
            const currentYear = new Date().getFullYear();
            return new Date(currentYear, parts[0] - 1, parts[1]);
        } else if (parts.length === 3) { // 包含年份的完整日期格式
            return new Date(parts[0], parts[1] - 1, parts[2]);
        }
        return new Date(NaN); // 无效日期
    }

    // Function to sort search results by date
    // 按日期排序搜索结果的函数
    function sortResults() {
        console.log('Starting to sort results...');

        const container = document.querySelector('.video.i_wrapper.search-all-list');
        if (!container) {
            console.log('Container not found');
            return;
        }
        console.log('Container found');

        const items = Array.from(container.querySelectorAll('.bili-video-card'));
        console.log(`Found ${items.length} video items`);

        const videoData = items.map(item => {
            const title = item.querySelector('.bili-video-card__info--tit').innerText.trim();
            const dateElement = item.querySelector('.bili-video-card__info--date');
            let date = new Date(NaN); // 默认无效日期
            let dateStr = '';
            if (dateElement) {
                dateStr = dateElement.innerText.trim().replace('· ', '');
                date = parseDate(dateStr);
            }
            const link = item.querySelector('a').href;
            const thumbnail = item.querySelector('.bili-video-card__cover img').src;
            const author = item.querySelector('.bili-video-card__info--author').innerText.trim();

            // 获取播放量和弹幕数
            const stats = item.querySelectorAll('.bili-video-card__stats--item');
            const views = stats.length > 0 ? stats[0].innerText.trim() : 'N/A';
            const danmaku = stats.length > 1 ? stats[1].innerText.trim() : 'N/A';

            console.log(`Parsed video - Title: ${title}, Date: ${date}, Link: ${link}, Author: ${author}, Views: ${views}, Danmaku: ${danmaku}`);
            return { title, date, link, thumbnail, author, dateStr, views, danmaku };
        });

        // Sort video data by date, latest first
        // 按日期排序视频数据，最新的排在前面
        videoData.sort((a, b) => {
            if (isNaN(a.date) && isNaN(b.date)) return 0;
            if (isNaN(a.date)) return 1;
            if (isNaN(b.date)) return -1;
            return b.date - a.date;
        });
        console.log('Sorted video data', videoData);

        // Create new table to display sorted results
        // 创建新的表格来显示排序后的结果
        const newTable = document.createElement('table');
        newTable.style.width = '100%';
        newTable.style.borderCollapse = 'collapse';
        newTable.innerHTML = `
            <thead>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px;">封面</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">播放</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">弹幕</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">标题</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">日期</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">作者</th>
                </tr>
            </thead>
            <tbody>
                ${videoData.map(video => `
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;"><img src="${video.thumbnail}" alt="Thumbnail" style="width: 100px;"></td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${video.views}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${video.danmaku}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;"><a href="${video.link}" target="_blank">${video.title}</a></td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${video.dateStr}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${video.author}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        // Replace original content with new table
        // 用新表格替换原来的内容
        container.innerHTML = '';
        container.appendChild(newTable);
        console.log('Replaced original content with new table');
    }

    // Execute the sort function after the page loads
    // 页面加载后执行排序函数
    window.addEventListener('load', sortResults);
})();

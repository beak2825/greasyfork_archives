// ==UserScript==
// @name         亚马逊商品信息展示
// @namespace    http://tampermonkey.net/
// @version      0.26
// @description  在亚马逊商品页面展示排名信息，优化加载速度
// @author       祀尘
// @match        https://www.amazon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521280/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/521280/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前页面是否为商品页面
    function isProductPage() {
        return document.getElementById('productTitle') !== null;
    }

    // 解析排名字符串中的数字
    function parseRank(rankText) {
        const match = rankText.match(/#(\d{1,3}(?:,\d{3})*)\s+in\s+([^\(]+)/);
        if (match) {
            return {
                rank: parseInt(match[1].replace(/,/g, ''), 10), // 去掉千位分隔符并转换为整数
                category: match[2].trim(),
                link: rankText.includes('href=') ? `https://www.amazon.com${rankText.match(/href="([^"]*)"/)[1]}` : ''
            };
        }
        return null;
    }

    // 获取商品排名信息
    function getRankInfo() {
        const rankInfo = [];
        const rankHeader = Array.from(document.querySelectorAll('th.a-color-secondary.a-size-base.prodDetSectionEntry'))
            .find(th => th.textContent.includes('Best Sellers Rank'));

        if (rankHeader) {
            const rankRow = rankHeader.parentElement;
            const td = rankRow.querySelector('td');
            if (td) {
                const spanElements = td.querySelectorAll('span');
                const ranks = [];

                spanElements.forEach(span => {
                    const rankText = span.innerHTML; // 使用 innerHTML 以获取包含链接的文本
                    const rankData = parseRank(rankText);
                    if (rankData) {
                        ranks.push(rankData);
                    }
                });

                // 确保排名从小到大排序
                ranks.sort((a, b) => a.rank - b.rank);

                // 确保不重复的排名信息
                const uniqueRanks = [];
                const seenRanks = new Set();

                ranks.forEach(rankData => {
                    if (!seenRanks.has(rankData.rank)) {
                        seenRanks.add(rankData.rank);
                        uniqueRanks.push(rankData);
                    }
                });

                // 确定大类和小类
                if (uniqueRanks.length > 0) {
                    // 大类是排名最大的
                    const largestRank = uniqueRanks[uniqueRanks.length - 1];
                    rankInfo.push({ rank: largestRank.rank, category: largestRank.category, url: largestRank.link, label: '大类' });

                    // 其余的作为小类
                    for (let i = 0; i < uniqueRanks.length - 1; i++) {
                        rankInfo.push({ rank: uniqueRanks[i].rank, category: uniqueRanks[i].category, url: uniqueRanks[i].link, label: '小类' });
                    }
                }
            } else {
                console.log('No <td> element found'); // Debugging output
            }
        } else {
            console.log('No ranking header found'); // Debugging output
        }
        return rankInfo;
    }

    // 创建并展示信息栏
    function createDisplayBar(rankInfo) {
        const existingBar = document.getElementById('rankInfoBar');
        if (existingBar) {
            existingBar.remove(); // 移除旧的信息栏
        }

        const displayBar = document.createElement('div');
        displayBar.id = 'rankInfoBar'; // 设置唯一ID以便后续操作
        displayBar.style.border = '1px solid #ccc';
        displayBar.style.padding = '10px';
        displayBar.style.marginBottom = '10px';
        displayBar.style.backgroundColor = '#f9f9f9';
        displayBar.style.fontSize = '16px';  // 设置字体大小
        displayBar.style.lineHeight = '1.3'; // 设置行高以缩小行间距

        let rankInfoText = '';
        if (rankInfo && rankInfo.length > 0) {
            rankInfoText = rankInfo.map(info => {
                return `<div><strong>${info.label}:</strong> <span style="color: red;">#${info.rank}</span> in <a href="${info.url}" target="_blank">${info.category}</a></div>`;
            }).join('');
        } else {
            rankInfoText = '<div><strong>排名信息不可用</strong></div>';
        }

        displayBar.innerHTML = `${rankInfoText}`;

        const productTitle = document.getElementById('productTitle');
        if (productTitle) {
            productTitle.parentElement.insertBefore(displayBar, productTitle);
        }
    }

    // 使用MutationObserver监听页面变化
    function observePageChanges() {
        const observer = new MutationObserver(() => {
            if (isProductPage()) {
                const rankInfo = getRankInfo();
                if (rankInfo.length > 0) {
                    createDisplayBar(rankInfo);
                    observer.disconnect(); // 插入信息后停止观察
                }
            }
        });

        // 监听整个页面的变动，以便尽早捕获排名信息
        observer.observe(document.body, { childList: true, subtree: true });

        // 额外的延迟处理，防止页面初始阶段还未完全准备好
        setTimeout(() => {
            if (isProductPage()) {
                const rankInfo = getRankInfo();
                if (rankInfo.length > 0) {
                    createDisplayBar(rankInfo);
                }
            }
        }, 1000); // 1秒后尝试获取排名信息
    }

    // 页面加载完成后初始化
    observePageChanges();

})();

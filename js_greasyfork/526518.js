// ==UserScript==
// @name         观众盲盒数据统计
// @namespace    https://greasyfork.org/zh-CN/scripts/526518
// @version      1.0.2
// @description  统计观众盲盒数据
// @author       史蒂夫
// @match        http*://audiences.me/bonusHistory.php*
// @icon         https://audiences.me/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      audiences.me
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/526518/%E8%A7%82%E4%BC%97%E7%9B%B2%E7%9B%92%E6%95%B0%E6%8D%AE%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/526518/%E8%A7%82%E4%BC%97%E7%9B%B2%E7%9B%92%E6%95%B0%E6%8D%AE%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        BOX_OPERATION_TEXT: '你开启的盲盒中含有：',
        SPECIAL_ITEMS: [
            '100 爆米花',
            '88888 爆米花',
            '1000000 爆米花',
            '7天彩虹ID',
            '30天彩虹ID',
            '1天VIP',
            '7天限时电影票'
        ],
        PAGINATION_CONTAINER: 'p:has(font.gray)',
        TABLE_SELECTOR: 'table.comments_table'
    };

    let stats = GM_getValue('boxStats', {
        boxAttempts: 0,
        totalConsumed: 0,
        popcornHits: { times: 0, total: 0 },
        uploadStats: { times: 0, total: 0 },
        specialItems: Object.fromEntries(CONFIG.SPECIAL_ITEMS.map(item => [item, 0]))
    });

    let isProcessing = false;
    let currentPage = 1;
    let totalPages = 1;

    // 初始化界面
    const { resultContainer, toggleButton } = createUIElements();

    GM_addStyle(`
        .stats-loading {
            position: fixed;
            top: 60px;
            right: 20px;
            padding: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: #00ff9d;
            border-radius: 5px;
            z-index: 9999;
        }
    `);

    async function main() {
        if (isProcessing) return;
        isProcessing = true;
        showLoading('正在统计，请稍等一会...');

        try {
            await resetStats();
            const currentDoc = document;

            // 动态计算总页数
            totalPages = getTotalPages(currentDoc);

            // 生成所有页码URL
            const baseUrl = new URL(window.location.href);
            const pageUrls = [];
            for (let page = 0; page < totalPages; page++) {
                const url = new URL(baseUrl);
                url.searchParams.set('page', page);
                pageUrls.push(url.href);
            }

            // 处理所有页面
            for (const url of pageUrls) {
                await processPage(url);
            }

            updateStatsDisplay();
            GM_setValue('boxStats', stats);
        } catch (error) {
            console.error('统计出错:', error);
            showLoading(`错误: ${error.message}`, 3000);
        } finally {
            isProcessing = false;
            hideLoading();
        }
    }

    async function processPage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    parseTable(doc.querySelector(CONFIG.TABLE_SELECTOR));
                    resolve();
                },
                onerror: reject
            });
        });
    }

    function parseTable(table) {
        if (!table) return;

        table.querySelectorAll('tr:not(:first-child)').forEach(row => {
            const reasonCell = row.cells[2];
            if (!reasonCell.textContent.includes(CONFIG.BOX_OPERATION_TEXT)) return;

            stats.boxAttempts++;
            const amount = parseInt(row.cells[1].textContent);
            stats.totalConsumed += Math.abs(amount);

            processBoxContents(reasonCell.textContent);
        });
    }

    function processBoxContents(text) {
        const items = text.split(CONFIG.BOX_OPERATION_TEXT)[1]
            .split(/[，、]/)
            .map(item => item.trim());

        items.forEach(item => {
            // 处理爆米花
            const popcornMatch = item.match(/(\d+)\s*爆米花/);
            if (popcornMatch) {
                stats.popcornHits.times++;
                stats.popcornHits.total += parseInt(popcornMatch[1]);
            }

            // 处理上传量
            const uploadMatch = item.match(/(\d+)G\s*上传量/);
            if (uploadMatch) {
                stats.uploadStats.times++;
                stats.uploadStats.total += parseInt(uploadMatch[1]);
            }

            // 处理特殊物品
            CONFIG.SPECIAL_ITEMS.forEach(specialItem => {
                // if (item.includes(specialItem)) { // 模糊匹配
                if (item == specialItem) { // 精确匹配
                    stats.specialItems[specialItem]++;
                }
            });
        });
    }

    function getTotalPages(doc) {
        // 获取所有包含page参数的链接
        const pageLinks = Array.from(doc.querySelectorAll(`${CONFIG.PAGINATION_CONTAINER} a[href*="page="]`));
        const pages = pageLinks.map(link => {
            const match = link.href.match(/page=(\d+)/);
            return match ? parseInt(match[1], 10) : -1;
        }).filter(page => page >= 0);
        return pages.length > 0 ? Math.max(...pages) + 1 : 1;
    }

    function createUIElements() {
        const resultContainer = document.createElement('div');
        resultContainer.innerHTML = `
            <h3 style="margin:0 0 15px 0; border-bottom:1px solid #444; padding-bottom:8px;">
                🎁 盲盒统计 (共<span id="stats-pages"> 0 </span>页)
            </h3>
            <div style="line-height:1.5; font-size:14px;">
                ${createStatsTemplate()}
            </div>
        `;

        resultContainer.style.cssText = `
            position: fixed; top: 60px; right: 20px; padding: 15px;
            background: rgba(0, 0, 0, 0.95); color: white; z-index: 9999;
            border-radius: 10px; width: 360px; max-height: 90vh;
            overflow-y: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            font-family: Arial, sans-serif; display: none;
        `;

        const toggleButton = document.createElement('button');
        toggleButton.innerHTML = '📊 盲盒统计';
        toggleButton.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            padding: 8px 16px; background: #2196F3; color: white;
            border: none; border-radius: 25px; cursor: pointer;
            box-shadow: 0 2px 8px rgba(33,150,243,0.4); transition: 0.2s;
        `;

        toggleButton.addEventListener('click', async () => {
            resultContainer.style.display = resultContainer.style.display === 'none' ? 'block' : 'none';
            if (resultContainer.style.display === 'block') {
                await main();
            }
        });

        document.body.appendChild(resultContainer);
        document.body.appendChild(toggleButton);
        return { resultContainer, toggleButton };
    }

    function createStatsTemplate() {
        return `
            <p>▶ 开启次数：<b class="stats-value">${stats.boxAttempts}</b> 次</p>
            <p>▶ 总消耗爆米花：<b class="stats-value">${stats.totalConsumed}</b></p>
            <p>▶ 获得爆米花：<b class="stats-value">${stats.popcornHits.times}</b> 次（共 <b>${stats.popcornHits.total}</b> 爆米花）</p>
            <p>▶ 获得上传量：<b class="stats-value">${stats.uploadStats.times}</b> 次（共 <b>${stats.uploadStats.total}G</b> 上传量）</p>
            <div style="margin:15px 0 5px 0; padding:8px 0; border-top:1px solid #444;">
            <p style="margin:0 0 8px 0; color:#00ff9d;">★ 特殊物品统计 ★</p>
            <ul style="margin:0; padding-left:20px; columns: 2;">
                ${CONFIG.SPECIAL_ITEMS.map(item => `
                    <li style="break-inside: avoid;">${item}：<b>${stats.specialItems[item] ?? 0}</b></li>
                `).join('')}
            </ul>
        </div>
    `;
    }

    function updateStatsDisplay() {
        resultContainer.innerHTML = `
            <h3 style="margin:0 0 15px 0; border-bottom:1px solid #444; padding-bottom:8px;">
                🎁 盲盒统计 (共<span id="stats-pages"> ${totalPages} </span>页)
            </h3>
            <div style="line-height:1.5; font-size:14px;">
                ${createStatsTemplate()}
            </div>
        `;
    }

    async function resetStats() {
        stats = {
            boxAttempts: 0,
            totalConsumed: 0,
            popcornHits: { times: 0, total: 0 },
            uploadStats: { times: 0, total: 0 },
            specialItems: Object.fromEntries(CONFIG.SPECIAL_ITEMS.map(item => [item, 0]))
        };
        GM_setValue('boxStats', stats);
    }

    function showLoading(text, timeout = 5000) {
        const existing = document.querySelector('.stats-loading');
        if (existing) existing.remove();

        const loading = document.createElement('div');
        loading.className = 'stats-loading';
        loading.textContent = text;
        document.body.appendChild(loading);

        if (timeout) {
            setTimeout(() => loading.remove(), timeout);
        }
    }

    function hideLoading() {
        document.querySelectorAll('.stats-loading').forEach(el => el.remove());
    }
})();
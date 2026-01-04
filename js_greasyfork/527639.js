// ==UserScript==
// @name         Amazon Reviews Exporter (Optimized)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Optimized version with better error handling and performance
// @author       You
// @match        https://www.amazon.com/*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527639/Amazon%20Reviews%20Exporter%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527639/Amazon%20Reviews%20Exporter%20%28Optimized%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置常量
    const CONFIG = {
        MAX_PAGES: 10,
        BASE_DELAY: 1500,
        MAX_RETRIES: 3,
        STARS: ['1', '2', '3', '4', '5']
    };

    let state = {
        asins: [],
        currentASINIndex: 0,
        currentStarIndex: 0,
        allReviews: [],
        recordedReviewIds: new Set(),
        retryCount: 0
    };

    function initialize() {
        addControlPanel();
    }

    function addControlPanel() {
        const panel = document.createElement('div');
        panel.style = 'position: fixed; top: 50%; left: 20px; transform: translateY(-50%); background: #fff; padding: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); z-index: 9999;';

        const btn = document.createElement('button');
        btn.textContent = 'Start Export';
        btn.style = 'background: #ff9900; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;';
        btn.onclick = startExportProcess;

        const status = document.createElement('div');
        status.id = 'export-status';
        status.style = 'margin-top: 10px; font-size: 12px; color: #666;';

        panel.appendChild(btn);
        panel.appendChild(status);
        document.body.appendChild(panel);
    }

    function updateStatus(text) {
        const statusEl = document.getElementById('export-status');
        if (statusEl) {
            statusEl.textContent = text;
        }
    }

    async function startExportProcess() {
        const input = prompt("请输入ASIN（多个用英文逗号分隔）:");
        if (!input) return;

        const asins = input.split(',').map(s => s.trim()).filter(validateASIN);
        if (asins.length === 0) {
            alert('未检测到有效ASIN！');
            return;
        }

        Object.assign(state, {
            asins,
            currentASINIndex: 0,
            currentStarIndex: 0,
            allReviews: [],
            recordedReviewIds: new Set(),
            retryCount: 0
        });

        updateStatus('开始导出...');
        await processASINs();
        exportToExcel(state.allReviews);
        updateStatus('导出完成！');
    }

    function validateASIN(asin) {
        return /^[A-Z0-9]{10}$/.test(asin);
    }

    async function processASINs() {
        while (state.currentASINIndex < state.asins.length) {
            const asin = state.asins[state.currentASINIndex];
            updateStatus(`处理中: ASIN ${asin} (${state.currentASINIndex + 1}/${state.asins.length})`);

            await processStarRatings(asin);
            state.currentASINIndex++;
            state.currentStarIndex = 0;
        }
    }

    async function processStarRatings(asin) {
        for (const star of CONFIG.STARS) {
            updateStatus(`正在抓取 ${star} 星评价...`);
            let page = 1;
            let hasMore = true;

            while (hasMore && page <= CONFIG.MAX_PAGES) {
                const success = await processPage(asin, star, page);
                hasMore = success && page++;
                await randomDelay();
            }
        }
    }

    async function processPage(asin, star, page) {
        let retries = 0;
        while (retries < CONFIG.MAX_RETRIES) {
            try {
                const url = buildReviewURL(asin, star, page);
                const html = await fetchPage(url);
                const reviews = parseReviews(html, asin, star);

                if (reviews.length === 0) return false;

                state.allReviews.push(...reviews);
                return true;
            } catch (error) {
                console.error(`第 ${page} 页请求失败 (尝试 ${retries + 1}/${CONFIG.MAX_RETRIES}):`, error);
                retries++;
                await randomDelay(3000);
            }
        }
        return false;
    }

    function buildReviewURL(asin, star, page) {
        return `https://www.amazon.com/product-reviews/${asin}/`
            + `ref=cm_cr_getr_d_paging_btm_next_${page}?ie=UTF8&`
            + `reviewerType=all_reviews&pageNumber=${page}&filterByStar=${star}_star&sortBy=recent`;
    }

    function parseReviews(html, asin, star) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const reviews = Array.from(doc.querySelectorAll('.review'));

        return reviews.map(review => {
            const id = review.id;
            if (state.recordedReviewIds.has(id)) return null;

            state.recordedReviewIds.add(id);
            return {
                ASIN: asin,
                Star: `${star} star`,
                Text: review.querySelector('.review-text')?.textContent?.trim() || '',
                Date: review.querySelector('.review-date')?.textContent?.trim() || '',
                Author: review.querySelector('.a-profile-name')?.textContent?.trim() || ''
            };
        }).filter(Boolean);
    }

    function fetchPage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'User-Agent': navigator.userAgent,
                    'Accept-Language': 'en-US,en;q=0.9'
                },
                onload: (res) => res.status === 200 ? resolve(res.responseText) : reject(res),
                onerror: reject
            });
        });
    }

    function randomDelay(base = CONFIG.BASE_DELAY) {
        const delay = base + Math.random() * 1000;
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    function exportToExcel(data) {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Reviews");
        XLSX.writeFile(wb, `Amazon_Reviews_${Date.now()}.xlsx`);
    }

    initialize();
})();

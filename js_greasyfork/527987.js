// ==UserScript==
// @name         亚马逊评论批量导出
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Export Amazon reviews with progress display, Excel export, and smart ASIN recognition
// @author       You
// @match        https://www.amazon.com/*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527987/%E4%BA%9A%E9%A9%AC%E9%80%8A%E8%AF%84%E8%AE%BA%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/527987/%E4%BA%9A%E9%A9%AC%E9%80%8A%E8%AF%84%E8%AE%BA%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置常量
    const CONFIG = {
        MAX_PAGES: 10,          // 每种星级最多抓取的页面数
        BASE_DELAY: 1500,       // 基础延迟时间（毫秒）
        MAX_RETRIES: 3,         // 最大重试次数
        STARS: ['1', '2', '3', '4', '5'] // 星级列表
    };

    // 全局状态
    let state = {
        asins: [],              // ASIN 列表
        currentASINIndex: 0,    // 当前处理的 ASIN 索引
        currentStarIndex: 0,    // 当前处理的星级索引
        allReviews: [],         // 所有评论数据
        recordedReviewIds: new Set(), // 已记录的评论 ID
        retryCount: 0,          // 重试计数
        isPaused: false         // 是否暂停
    };

    // 初始化函数
    function initialize() {
        addControlPanel();
    }

    // 添加控制面板
    function addControlPanel() {
        const panel = document.createElement('div');
        panel.style = 'position: fixed; top: 50%; left: 20px; transform: translateY(-50%); background: #fff; padding: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); z-index: 9999;';

        const btnStart = document.createElement('button');
        btnStart.textContent = '开始导出评论';
        btnStart.style = 'background: #ff9900; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;';
        btnStart.onclick = startExportProcess;

        const btnPause = document.createElement('button');
        btnPause.textContent = '暂停采集';
        btnPause.style = 'background: #ff6666; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;';
        btnPause.onclick = togglePause;

        const btnResume = document.createElement('button');
        btnResume.textContent = '继续采集';
        btnResume.style = 'background: #66cc66; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;';
        btnResume.onclick = togglePause;
        btnResume.disabled = true;

        const totalASINsEl = document.createElement('div');
        totalASINsEl.id = 'total-asins';
        totalASINsEl.style = 'margin-top: 10px; font-size: 12px; color: #666;';

        const currentASINEl = document.createElement('div');
        currentASINEl.id = 'current-asin';
        currentASINEl.style = 'margin-top: 5px; font-size: 12px; color: #666;';

        const progressEl = document.createElement('div');
        progressEl.id = 'progress';
        progressEl.style = 'margin-top: 5px; font-size: 12px; color: #666;';

        const reviewsCountEl = document.createElement('div');
        reviewsCountEl.id = 'reviews-count';
        reviewsCountEl.style = 'margin-top: 5px; font-size: 12px; color: #666;';

        const statusEl = document.createElement('div');
        statusEl.id = 'export-status';
        statusEl.style = 'margin-top: 10px; font-size: 12px; color: #666;';

        panel.appendChild(btnStart);
        panel.appendChild(btnPause);
        panel.appendChild(btnResume);
        panel.appendChild(totalASINsEl);
        panel.appendChild(currentASINEl);
        panel.appendChild(progressEl);
        panel.appendChild(reviewsCountEl);
        panel.appendChild(statusEl);
        document.body.appendChild(panel);

        state.btnPause = btnPause;
        state.btnResume = btnResume;
    }

    // 切换暂停/继续
    function togglePause() {
        state.isPaused = !state.isPaused;
        if (state.isPaused) {
            state.btnPause.disabled = true;
            state.btnResume.disabled = false;
            updateStatus('采集已暂停...');
        } else {
            state.btnPause.disabled = false;
            state.btnResume.disabled = true;
            updateStatus('继续采集...');
            processASINs();
        }
    }

    // 更新状态文本
    function updateStatus(text) {
        const statusEl = document.getElementById('export-status');
        if (statusEl) statusEl.textContent = text;
    }

    // 更新进度显示
    function updateProgress() {
        const totalASINsEl = document.getElementById('total-asins');
        const currentASINEl = document.getElementById('current-asin');
        const progressEl = document.getElementById('progress');
        const reviewsCountEl = document.getElementById('reviews-count');

        if (totalASINsEl) totalASINsEl.textContent = `待采集ASIN总数:${state.asins.length}`;
        if (currentASINEl && state.asins[state.currentASINIndex]) {
            currentASINEl.textContent = `当前正在采集:${state.asins[state.currentASINIndex]}`;
        }
        if (progressEl) progressEl.textContent = `当前进度:${state.currentASINIndex + 1}/${state.asins.length}`;
        if (reviewsCountEl) reviewsCountEl.textContent = `已采集评论数:${state.allReviews.length}`;
    }

    // 开始导出流程
    async function startExportProcess() {
        const input = prompt("请输入ASIN（支持多种分隔符，如逗号、空格等）:");
        if (!input) return;

        const asinRegex = /[A-Z0-9]{10}/g;
        const matches = input.match(asinRegex);
        if (!matches || matches.length === 0) {
            alert('未检测到有效ASIN！');
            return;
        }

        const asins = [...new Set(matches.map(asin => asin.toUpperCase()))];
        Object.assign(state, {
            asins,
            currentASINIndex: 0,
            currentStarIndex: 0,
            allReviews: [],
            recordedReviewIds: new Set(),
            retryCount: 0
        });

        updateStatus('开始导出...');
        updateProgress();
        await processASINs();
        exportToExcel(state.allReviews);
        updateStatus('导出完成！');
    }

    // 处理所有 ASIN
    async function processASINs() {
        while (state.currentASINIndex < state.asins.length && !state.isPaused) {
            const asin = state.asins[state.currentASINIndex];
            updateStatus(`处理中:ASIN ${asin} (${state.currentASINIndex + 1}/${state.asins.length})`);
            updateProgress();

            await processStarRatings(asin);
            state.currentASINIndex++;
            state.currentStarIndex = 0;
        }
    }

    // 处理星级评论
    async function processStarRatings(asin) {
        for (const star of CONFIG.STARS) {
            updateStatus(`正在抓取 ${star} 星评价...`);
            let page = 1;
            let hasMore = true;

            while (hasMore && page <= CONFIG.MAX_PAGES && !state.isPaused) {
                const success = await processPage(asin, star, page);
                hasMore = success && page++;
                await randomDelay();
            }
        }
    }

    // 处理单页评论
    async function processPage(asin, star, page) {
        let retries = 0;
        while (retries < CONFIG.MAX_RETRIES) {
            try {
                const url = buildReviewURL(asin, star, page);
                const html = await fetchPage(url);
                const reviews = parseReviews(html, asin, star);

                if (reviews.length === 0) return false;

                state.allReviews.push(...reviews);
                updateProgress();
                return true;
            } catch (error) {
                console.error(`第 ${page} 页请求失败 (尝试 ${retries + 1}/${CONFIG.MAX_RETRIES}):`, error);
                retries++;
                await randomDelay(3000);
            }
        }
        return false;
    }

    // 构建评论页面 URL（已修复）
    function buildReviewURL(asin, star, page) {
        const starMap = {
            '1': 'one',
            '2': 'two',
            '3': 'three',
            '4': 'four',
            '5': 'five'
        };
        const starParam = starMap[star] || 'one';

        return `https://www.amazon.com/product-reviews/${asin}/`
            + `ref=cm_cr_getr_d_paging_btm_next_${page}?ie=UTF8&`
            + `reviewerType=all_reviews&pageNumber=${page}&filterByStar=${starParam}_star&sortBy=recent`;
    }

    // 解析评论数据
    function parseReviews(html, asin, star) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const reviews = Array.from(doc.querySelectorAll('.review'));

        return reviews.map(review => {
            const id = review.id;
            if (state.recordedReviewIds.has(id)) return null;

            state.recordedReviewIds.add(id);

            // 提取并解析日期和国家
            const reviewDateText = review.querySelector('.review-date')?.textContent?.trim() || '';
            const { country, date } = parseReviewDate(reviewDateText);
            const formattedDate = formatDate(date);

            return {
                ASIN: asin,
                Star: `${star}`,
                Text: review.querySelector('.review-text')?.textContent?.trim() || '',
                Country: country,
                Date: formattedDate,
                Author: review.querySelector('.a-profile-name')?.textContent?.trim() || ''
            };
        }).filter(Boolean);
    }

    // 解析评论日期文本
    function parseReviewDate(reviewDateText) {
        const regex = /Reviewed in (.*?) on (.*)/;
        const match = reviewDateText.match(regex);
        if (match) {
            return {
                country: match[1].trim(),
                date: match[2].trim()
            };
        }
        return {
            country: 'Unknown',
            date: reviewDateText
        };
    }

    // 将日期格式化为 "MM/DD/YYYY"
    function formatDate(dateStr) {
        const monthMap = {
            'January': '01', 'February': '02', 'March': '03', 'April': '04',
            'May': '05', 'June': '06', 'July': '07', 'August': '08',
            'September': '09', 'October': '10', 'November': '11', 'December': '12'
        };
        const parts = dateStr.split(' ');
        if (parts.length === 3) {
            const month = monthMap[parts[0]];
            const day = parts[1].replace(',', '');
            const year = parts[2];
            if (month && day && year) {
                return `${month}/${day.padStart(2, '0')}/${year}`;
            }
        }
        return dateStr;
    }

    // 获取页面内容
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

    // 随机延迟
    function randomDelay(base = CONFIG.BASE_DELAY) {
        const delay = base + Math.random() * 1000;
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    // 导出为 Excel 文件并冻结首行
    function exportToExcel(data) {
        if (data.length === 0) {
            alert('没有数据可导出！');
            return;
        }

        // 创建工作表
        const ws = XLSX.utils.json_to_sheet(data);
        // 设置冻结首行
        ws['!views'] = [{ state: 'frozen', ySplit: 1 }]; // 冻结首行
        // 创建工作簿并添加工作表
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Reviews");
        // 导出文件
        XLSX.writeFile(wb, `Amazon_Reviews_${Date.now()}.xlsx`);
    }

    // 启动脚本
    initialize();
})();

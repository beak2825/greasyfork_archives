// ==UserScript==
// @name         评论批量导出上传到指定飞书支持分批多站点
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  支持星级多选、ASIN输入和飞书配置输入的亚马逊评论导出工具（修复了点击开始无反应的问题）
// @author       东哥
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.ca/*

// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/528966/%E8%AF%84%E8%AE%BA%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA%E4%B8%8A%E4%BC%A0%E5%88%B0%E6%8C%87%E5%AE%9A%E9%A3%9E%E4%B9%A6%E6%94%AF%E6%8C%81%E5%88%86%E6%89%B9%E5%A4%9A%E7%AB%99%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/528966/%E8%AF%84%E8%AE%BA%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA%E4%B8%8A%E4%BC%A0%E5%88%B0%E6%8C%87%E5%AE%9A%E9%A3%9E%E4%B9%A6%E6%94%AF%E6%8C%81%E5%88%86%E6%89%B9%E5%A4%9A%E7%AB%99%E7%82%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置常量
    const CONFIG = {
        MAX_PAGES: 10,        // 每种星级最多抓取页数
        BASE_DELAY: 1500,     // 基础延迟时间（毫秒）
        MAX_RETRIES: 3        // 最大重试次数
    };

    // 全局状态
    let state = {
        asins: [],            // ASIN列表
        currentASINIndex: 0,  // 当前处理ASIN索引
        allReviews: [],       // 所有评论数据（用于最后生成 Excel）
        pendingReviews: [],   // 待上传飞书的评论数据（每达到500条就上传）
        recordedReviewIds: new Set(), // 已记录评论ID
        isPaused: false,      // 是否暂停
        selectedStars: [],    // 用户选择的星级
        feishuConfig: {       // 飞书配置
            APP_ID: 'cli_a30fd8bad93a500b',
            APP_SECRET: 'TmyzfhZdGF4WWkjjXnghlcxXUBDfnLJ5',
            APP_TOKEN: '',    // 由用户输入
            TABLE_ID: ''      // 由用户输入
        },
        site: 'com',          // 默认站点，美国为.com
        btnPause: null,
        btnResume: null
    };

    // 获取飞书 tenant_access_token
    async function getTenantAccessToken() {
        const url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal";
        const payload = {
            app_id: state.feishuConfig.APP_ID,
            app_secret: state.feishuConfig.APP_SECRET
        };

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(payload),
                onload: function (response) {
                    const res = JSON.parse(response.responseText);
                    res.code === 0 ? resolve(res.tenant_access_token) : reject(res.msg);
                },
                onerror: reject
            });
        });
    }

    // 批量添加记录到飞书
    async function addRecordsToFeishuBase(token, records) {
        const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${state.feishuConfig.APP_TOKEN}/tables/${state.feishuConfig.TABLE_ID}/records/batch_create`;
        const payload = {
            records: records.map(record => ({
                fields: {
                    "ASIN": record.ASIN,
                    "星级": Number(record.Star),
                    "评论内容": record.Text,
                    "国家": record.Country,
                    "日期": record.Date,
                    "作者": record.Author
                }
            }))
        };

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(payload),
                onload: (response) => {
                    const res = JSON.parse(response.responseText);
                    res.code === 0 ? resolve(res.data) : reject(res.msg);
                },
                onerror: reject
            });
        });
    }

    // 上传 pendingReviews 中的评论，每批上传 500 条（最后不足500条则全部上传）
    async function uploadBatch(isFinal = false) {
        if (state.pendingReviews.length === 0) return;
        const batchSize = 500;
        let batch;
        if (!isFinal) {
            batch = state.pendingReviews.splice(0, batchSize);
        } else {
            batch = state.pendingReviews.splice(0, state.pendingReviews.length);
        }
        const token = await getTenantAccessToken();
        await addRecordsToFeishuBase(token, batch);
        updateStatus(`已上传 ${batch.length} 条评论到飞书`);
    }

    // 创建控制面板（使用纯DOM操作避免内嵌 innerHTML 导致的事件丢失）
    function addControlPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 20px;
            transform: translateY(-50%);
            background: #fff;
            padding: 15px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 9999;
            width: 280px;
            border-radius: 8px;
        `;

        // 星级选择
        const starContainer = document.createElement('div');
        starContainer.style.marginBottom = '15px';
        const starTitle = document.createElement('div');
        starTitle.style.cssText = 'color: #666; margin-bottom: 8px;';
        starTitle.textContent = '选择星级：';
        starContainer.appendChild(starTitle);
        [5, 4, 3, 2, 1].forEach(star => {
            const label = document.createElement('label');
            label.style.cssText = 'display: block; margin: 5px 0;';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'star-checkbox';
            checkbox.value = star;
            checkbox.checked = true;
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(' ' + '★'.repeat(star) + '☆'.repeat(5 - star)));
            starContainer.appendChild(label);
        });
        panel.appendChild(starContainer);

        // 飞书配置输入
        const feishuContainer = document.createElement('div');
        feishuContainer.style.marginBottom = '15px';
        const feishuToken = document.createElement('input');
        feishuToken.type = 'text';
        feishuToken.id = 'feishuToken';
        feishuToken.placeholder = '飞书APP_TOKEN';
        feishuToken.style.cssText = 'width: 100%; margin: 5px 0; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
        const feishuTableId = document.createElement('input');
        feishuTableId.type = 'text';
        feishuTableId.id = 'feishuTableId';
        feishuTableId.placeholder = '飞书TABLE_ID';
        feishuTableId.style.cssText = 'width: 100%; margin: 5px 0; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
        feishuContainer.appendChild(feishuToken);
        feishuContainer.appendChild(feishuTableId);
        panel.appendChild(feishuContainer);

        // 站点选择（新增）
        const siteContainer = document.createElement('div');
        siteContainer.style.marginBottom = '15px';
        const siteLabel = document.createElement('label');
        siteLabel.style.cssText = 'color: #666; margin-bottom: 8px; display: block;';
        siteLabel.textContent = '选择站点：';
        siteContainer.appendChild(siteLabel);
        const siteSelect = document.createElement('select');
        siteSelect.id = 'siteSelect';
        siteSelect.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
        // 站点选项，顺序：美德意法西加英，默认美国
        const options = [
            { value: 'com', label: '美国' },
            { value: 'de', label: '德国' },
            { value: 'it', label: '意大利' },
            { value: 'fr', label: '法国' },
            { value: 'es', label: '西班牙' },
            { value: 'ca', label: '加拿大' },
            { value: 'co.uk', label: '英国' }
        ];
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            siteSelect.appendChild(option);
        });
        siteContainer.appendChild(siteSelect);
        panel.appendChild(siteContainer);

        // ASIN输入
        const asinContainer = document.createElement('div');
        asinContainer.style.marginBottom = '15px';
        const asinInput = document.createElement('input');
        asinInput.type = 'text';
        asinInput.id = 'asinInput';
        asinInput.placeholder = '请输入ASIN（支持多个，用逗号、空格或分号分隔）';
        asinInput.style.cssText = 'width: 100%; margin: 5px 0; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';
        asinContainer.appendChild(asinInput);
        panel.appendChild(asinContainer);

        // 操作按钮
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';
        function createButton(text, color, onClick) {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style.cssText = `background: ${color}; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer; transition: opacity 0.3s;`;
            btn.addEventListener('click', onClick);
            btn.addEventListener('mouseover', () => btn.style.opacity = 0.8);
            btn.addEventListener('mouseout', () => btn.style.opacity = 1);
            return btn;
        }
        const btnStart = createButton('开始导出', '#ff9900', startExportProcess);
        const btnPause = createButton('暂停采集', '#ff6666', togglePause);
        const btnResume = createButton('继续采集', '#66cc66', togglePause);
        btnResume.disabled = true;
        buttonsContainer.appendChild(btnStart);
        buttonsContainer.appendChild(btnPause);
        buttonsContainer.appendChild(btnResume);
        panel.appendChild(buttonsContainer);

        // 状态显示
        const statusContainer = document.createElement('div');
        statusContainer.style.cssText = 'margin-top: 15px; font-size: 12px; color: #666;';
        const totalAsinsDiv = document.createElement('div');
        totalAsinsDiv.id = 'total-asins';
        totalAsinsDiv.textContent = '待采集ASIN总数: 0';
        const currentAsinDiv = document.createElement('div');
        currentAsinDiv.id = 'current-asin';
        currentAsinDiv.style.margin = '5px 0';
        const progressDiv = document.createElement('div');
        progressDiv.id = 'progress';
        progressDiv.textContent = '当前进度: 0/0';
        const reviewsCountDiv = document.createElement('div');
        reviewsCountDiv.id = 'reviews-count';
        reviewsCountDiv.textContent = '已采集评论: 0';
        const exportStatusDiv = document.createElement('div');
        exportStatusDiv.id = 'export-status';
        exportStatusDiv.style.cssText = 'margin-top: 10px; color: #1890ff;';
        statusContainer.appendChild(totalAsinsDiv);
        statusContainer.appendChild(currentAsinDiv);
        statusContainer.appendChild(progressDiv);
        statusContainer.appendChild(reviewsCountDiv);
        statusContainer.appendChild(exportStatusDiv);
        panel.appendChild(statusContainer);

        document.body.appendChild(panel);

        state.btnPause = btnPause;
        state.btnResume = btnResume;
    }

    // 开始导出流程
    async function startExportProcess() {
        // 获取用户配置
        state.selectedStars = Array.from(document.querySelectorAll('.star-checkbox:checked'))
            .map(el => Number(el.value));
        state.feishuConfig.APP_TOKEN = document.getElementById('feishuToken').value.trim();
        state.feishuConfig.TABLE_ID = document.getElementById('feishuTableId').value.trim();
        // 获取站点选择
        state.site = document.getElementById('siteSelect').value;

        // 验证输入
        if (state.selectedStars.length === 0) {
            alert('请至少选择一个星级！');
            return;
        }
        if (!state.feishuConfig.APP_TOKEN) {
            alert('请输入飞书APP_TOKEN！');
            return;
        }
        if (!state.feishuConfig.TABLE_ID) {
            alert('请输入飞书TABLE_ID！');
            return;
        }

        // 获取ASIN
        const input = document.getElementById('asinInput').value.trim();
        if (!input) {
            alert('请输入ASIN！');
            return;
        }
        const asins = [...new Set(input.match(/[A-Z0-9]{10}/gi))].map(s => s.toUpperCase());
        if (!asins.length) {
            alert('未检测到有效ASIN！');
            return;
        }

        // 初始化状态
        state.asins = asins;
        state.currentASINIndex = 0;
        state.allReviews = [];
        state.pendingReviews = [];
        state.recordedReviewIds.clear();
        updateStatus('开始采集...');
        updateProgress();

        // 处理ASIN
        while (state.currentASINIndex < state.asins.length && !state.isPaused) {
            await processASIN(state.asins[state.currentASINIndex]);
            state.currentASINIndex++;
            updateProgress();
        }

        // 采集完成后上传剩余不足500条的评论（或刚好达到500的情况）
        try {
            if (state.pendingReviews.length > 0) {
                await uploadBatch(true);
            }
        } catch (e) {
            alert('飞书上传失败：' + e);
        }

        // 生成Excel
        exportToExcel(state.allReviews);
        updateStatus('全部完成！');
    }

    // 处理单个ASIN
    async function processASIN(asin) {
        updateStatus(`正在处理 ${asin}...`);
        for (const star of state.selectedStars) {
            let page = 1;
            while (page <= CONFIG.MAX_PAGES) {
                const success = await processPage(asin, star, page++);
                if (!success || state.isPaused) break;
                await randomDelay();
            }
        }
    }

    // 处理单页评论
    async function processPage(asin, star, page) {
        const url = `https://www.amazon.${state.site}/product-reviews/${asin}/ref=cm_cr_arp_d_paging_btm_next_${page}?ie=UTF8&reviewerType=all_reviews&pageNumber=${page}&filterByStar=${['one','two','three','four','five'][star-1]}_star`;
        try {
            const html = await fetchPage(url);
            const reviews = parseReviews(html, asin, star);
            state.allReviews.push(...reviews);
            state.pendingReviews.push(...reviews);
            updateProgress();
            if (state.pendingReviews.length >= 500) {
                await uploadBatch();
            }
            return reviews.length > 0;
        } catch (e) {
            console.error(`页面请求失败：${url}`, e);
            return false;
        }
    }

    // 解析评论
    function parseReviews(html, asin, star) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return Array.from(doc.querySelectorAll('.review')).map(review => {
            const id = review.id;
            if (state.recordedReviewIds.has(id)) return null;
            state.recordedReviewIds.add(id);
            return {
                ASIN: asin,
                Star: star,
                Text: review.querySelector('.review-text-content')?.textContent?.trim() || '',
                Country: parseCountry(review.querySelector('.review-date')?.textContent),
                Date: parseDate(review.querySelector('.review-date')?.textContent),
                Author: review.querySelector('.a-profile-name')?.textContent?.trim() || ''
            };
        }).filter(Boolean);
    }

    // 辅助函数
    function parseCountry(text) {
        return text?.match(/Reviewed in (.*?) on/)?.[1] || '未知国家';
    }

    function parseDate(text) {
        const match = text?.match(/on (.*)/)?.[1];
        return match ? new Date(match).toISOString().split('T')[0] : '未知日期';
    }

    function updateProgress() {
        document.getElementById('total-asins').textContent = `待采集ASIN总数: ${state.asins.length}`;
        document.getElementById('current-asin').textContent = `当前ASIN: ${state.asins[state.currentASINIndex] || '无'}`;
        document.getElementById('progress').textContent = `进度: ${state.currentASINIndex}/${state.asins.length}`;
        document.getElementById('reviews-count').textContent = `已采集评论: ${state.allReviews.length}`;
    }

    function updateStatus(text) {
        document.getElementById('export-status').textContent = text;
    }

    function togglePause() {
        state.isPaused = !state.isPaused;
        state.btnPause.disabled = state.isPaused;
        state.btnResume.disabled = !state.isPaused;
        updateStatus(state.isPaused ? '已暂停' : '恢复采集...');
    }

    function fetchPage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: res => res.status === 200 ? resolve(res.responseText) : reject(res.status),
                onerror: reject
            });
        });
    }

    function randomDelay() {
        return new Promise(r => setTimeout(r, CONFIG.BASE_DELAY + Math.random() * 1000));
    }

    function exportToExcel(data) {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Reviews");
        XLSX.writeFile(wb, `Amazon_Reviews_${new Date().toISOString().slice(0,10)}.xlsx`);
    }

    // 初始化面板
    addControlPanel();
})();

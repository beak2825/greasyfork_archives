// ==UserScript==
// @name         微博数据批量抓取工具
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  批量抓取微博数据并导出CSV
// @author       LeoChen
// @match        https://weibo.com/*
// @match        https://*.weibo.com/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @connect      weibo.com
// @license      All rights reserved
// @license      Do not copy or modify without permission
// @downloadURL https://update.greasyfork.org/scripts/531296/%E5%BE%AE%E5%8D%9A%E6%95%B0%E6%8D%AE%E6%89%B9%E9%87%8F%E6%8A%93%E5%8F%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/531296/%E5%BE%AE%E5%8D%9A%E6%95%B0%E6%8D%AE%E6%89%B9%E9%87%8F%E6%8A%93%E5%8F%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const $ = window.jQuery;

    // 自定义样式
    GM_addStyle(`
        #weiboDataToolUltimate {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border: 2px solid #ff8200;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 99999;
            font-family: 'Microsoft YaHei', sans-serif;
            min-width: 300px;
            max-width: 400px;
        }
        #weiboDataToolUltimate h3 {
            margin: 0 0 10px 0;
            color: #ff8200;
            font-size: 16px;
            border-bottom: 1px solid #eee;
            padding-bottom: 8px;
        }
        .data-row {
            margin-bottom: 6px;
            font-size: 13px;
            line-height: 1.4;
        }
        .data-label {
            font-weight: bold;
            color: #333;
            display: inline-block;
            width: 60px;
        }
        .data-value {
            color: #666;
        }
        .tool-btn {
            background: #ff8200;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            margin-right: 8px;
            margin-top: 8px;
            transition: all 0.2s;
        }
        .tool-btn:hover {
            background: #e67300;
        }
        .tool-btn.secondary {
            background: #f0f0f0;
            color: #333;
            border: 1px solid #ddd;
        }
        #dataStatus {
            font-size: 12px;
            color: #888;
            margin-top: 8px;
            font-style: italic;
        }
        #batchInputArea {
            margin-top: 10px;
            display: none;
        }
        #batchUrls {
            width: 100%;
            height: 100px;
            margin-bottom: 8px;
            font-size: 12px;
        }
        #progressContainer {
            margin-top: 10px;
            display: none;
        }
        #progressBar {
            width: 100%;
            height: 10px;
            background: #f0f0f0;
            border-radius: 5px;
            overflow: hidden;
        }
        #progress {
            height: 100%;
            background: #ff8200;
            width: 0%;
            transition: width 0.3s;
        }
        #batchResults {
            margin-top: 10px;
            max-height: 150px;
            overflow-y: auto;
            font-size: 12px;
        }
        .batch-result-item {
            margin-bottom: 5px;
            padding: 3px;
            border-bottom: 1px solid #eee;
        }
        .batch-success {
            color: green;
        }
        .batch-error {
            color: red;
        }
    `);

    // 主功能类
    class WeiboDataTool {
        constructor() {
            this.currentData = null;
            this.batchData = [];
            this.batchInProgress = false;
            this.initUI();
            this.initObservers();
            this.setupEventListeners();
            this.fetchDataWithRetry(3); // 初始尝试3次
        }

        initUI() {
            // 移除旧UI（如果存在）
            $('#weiboDataToolUltimate').remove();

            const toolHtml = `
            <div id="weiboDataToolUltimate">
                <h3>微博数据抓取工具</h3>
                <div id="dataContainer">
                    <div class="data-row"><span class="data-label">状态:</span><span class="data-value" id="dataStatus">初始化中...</span></div>
                    <div class="data-row"><span class="data-label">作者:</span><span class="data-value" id="dataAuthor">-</span></div>
                    <div class="data-row"><span class="data-label">时间:</span><span class="data-value" id="dataTime">-</span></div>
                    <div class="data-row"><span class="data-label">评论:</span><span class="data-value" id="dataComments">-</span></div>
                    <div class="data-row"><span class="data-label">转发:</span><span class="data-value" id="dataReposts">-</span></div>
                    <div class="data-row"><span class="data-label">点赞:</span><span class="data-value" id="dataLikes">-</span></div>
                    <div class="data-row"><span class="data-label">内容:</span><span class="data-value" id="dataContent">-</span></div>
                </div>
                <div>
                    <button id="refreshBtn" class="tool-btn">刷新数据</button>
                    <button id="exportBtn" class="tool-btn secondary">导出CSV</button>
                    <button id="batchBtn" class="tool-btn secondary">批量抓取</button>
                </div>
                <div id="batchInputArea">
                    <textarea id="batchUrls" placeholder="请输入要抓取的微博URL，每行一个"></textarea>
                    <button id="startBatchBtn" class="tool-btn">开始抓取</button>
                    <button id="cancelBatchBtn" class="tool-btn secondary">取消</button>
                </div>
                <div id="progressContainer">
                    <div id="progressBar"><div id="progress"></div></div>
                    <div id="batchResults"></div>
                </div>
                <div id="dataStatus"></div>
            </div>
            `;

            $('body').append(toolHtml);
        }

        initObservers() {
            // 监听DOM变化
            this.observer = new MutationObserver((mutations) => {
                if ($('.WB_feed_detail, .weibo-detail, .WB_cardwrap, .woo-box-item').length) {
                    this.fetchDataWithRetry(2);
                }
            });

            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        setupEventListeners() {
            $('#refreshBtn').click(() => this.fetchDataWithRetry(3));
            $('#exportBtn').click(() => this.exportData());
            $('#batchBtn').click(() => this.toggleBatchInput());
            $('#startBatchBtn').click(() => this.startBatchProcessing());
            $('#cancelBatchBtn').click(() => this.toggleBatchInput(false));
        }

        toggleBatchInput(show = true) {
            $('#batchInputArea').toggle(show);
            $('#progressContainer').toggle(false);
            if (show) {
                $('#batchUrls').val('');
                $('#batchUrls').focus();
            }
        }

        async startBatchProcessing() {
            const urls = $('#batchUrls').val().split('\n')
                .map(url => url.trim())
                .filter(url => url.startsWith('https://weibo.com/'));

            if (urls.length === 0) {
                alert('请输入有效的微博URL');
                return;
            }

            this.batchData = [];
            this.batchInProgress = true;
            $('#batchInputArea').hide();
            $('#progressContainer').show();
            $('#batchResults').html('');
            $('#progress').css('width', '0%');

            for (let i = 0; i < urls.length; i++) {
                if (!this.batchInProgress) break;

                const url = urls[i];
                try {
                    const result = await this.processBatchUrl(url);
                    this.batchData.push(result);
                    this.appendBatchResult(url, true, '抓取成功');
                } catch (e) {
                    this.appendBatchResult(url, false, e.message || '抓取失败');
                }

                $('#progress').css('width', `${((i + 1) / urls.length) * 100}%`);
            }

            this.batchInProgress = false;
            $('#dataStatus').text(`批量抓取完成，共抓取 ${this.batchData.length} 条微博数据`);

            // 添加批量导出按钮
            if (this.batchData.length > 0) {
                $('#batchResults').append(`
                    <div style="margin-top:10px;">
                        <button id="exportBatchBtn" class="tool-btn">导出全部数据</button>
                    </div>
                `);
                $('#exportBatchBtn').click(() => this.exportBatchData());
            }
        }

        async processBatchUrl(url) {
            return new Promise(async (resolve, reject) => {
                try {
                    // 使用API直接获取数据，避免页面跳转
                    const mid = this.extractMidFromUrl(url);
                    if (!mid) {
                        throw new Error('无效的微博URL');
                    }

                    const response = await this.gmRequest({
                        method: 'GET',
                        url: `https://weibo.com/ajax/statuses/show?id=${mid}`,
                        headers: {
                            'Accept': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    });

                    if (response.status === 200) {
                        const json = JSON.parse(response.responseText);
                        const data = {
                            url: url,
                            title: json.text_raw.substring(0, 30) + (json.text_raw.length > 30 ? '...' : ''),
                            author: json.user?.screen_name || '未知作者',
                            content: json.text_raw || '内容获取失败',
                            time: json.created_at || '时间未知',
                            comments: json.comments_count || 0,
                            reposts: json.reposts_count || 0,
                            likes: json.attitudes_count || 0,
                            collectedAt: new Date().toLocaleString()
                        };
                        resolve(data);
                    } else {
                        throw new Error('API请求失败');
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }

        extractMidFromUrl(url) {
            const urlMatch = url.match(/weibo\.com\/\d+\/(\w+)/);
            return urlMatch && urlMatch[1];
        }

        appendBatchResult(url, success, message) {
            const shortUrl = url.replace(/https?:\/\/(www\.)?weibo\.com\/\d+\//, '.../');
            $('#batchResults').append(`
                <div class="batch-result-item ${success ? 'batch-success' : 'batch-error'}">
                    ${shortUrl}: ${message}
                </div>
            `);
            $('#batchResults').scrollTop($('#batchResults')[0].scrollHeight);
        }

        async fetchDataWithRetry(retryCount) {
            $('#dataStatus').text('正在获取数据...');

            let success = false;
            for (let i = 0; i < retryCount; i++) {
                try {
                    await this.fetchData();
                    success = true;
                    break;
                } catch (e) {
                    console.error(`尝试 ${i + 1} 失败:`, e);
                    if (i < retryCount - 1) {
                        await new Promise(resolve => setTimeout(resolve, 1500));
                    }
                }
            }

            if (!success) {
                $('#dataStatus').text('数据获取失败，请手动刷新页面');
            }
        }

        async fetchData() {
            return new Promise((resolve, reject) => {
                try {
                    // 方法1：尝试从页面元素抓取
                    const data = this.scrapeFromDOM();

                    // 方法2：如果DOM抓取失败，尝试从API获取
                    if (!data || data.comments === 0) {
                        this.fetchFromAPI().then(apiData => {
                            if (apiData) {
                                this.updateUI(apiData);
                                this.currentData = apiData;
                                $('#dataStatus').text('数据已更新');
                                resolve();
                            } else {
                                reject(new Error('API数据获取失败'));
                            }
                        }).catch(reject);
                        return;
                    }

                    this.updateUI(data);
                    this.currentData = data;
                    $('#dataStatus').text('数据已更新');
                    resolve();
                } catch (e) {
                    reject(e);
                }
            });
        }

        scrapeFromDOM() {
            const data = {
                url: window.location.href,
                title: document.title.replace(' - 微博', ''),
                author: '',
                content: '',
                time: '',
                comments: 0,
                reposts: 0,
                likes: 0,
                collectedAt: new Date().toLocaleString()
            };

            // 尝试多种选择器获取作者
            data.author = $('.woo-box-item-flex .woo-box-flex .woo-box .woo-box-item-main a').first().text().trim() ||
                          $('.info .name a').text().trim() ||
                          $('.WB_info a').first().text().trim() ||
                          '未知作者';

            // 尝试多种选择器获取内容
            data.content = $('.weibo-text').text().trim() ||
                           $('.WB_text').text().trim() ||
                           $('.txt').text().trim() ||
                           '内容获取失败';

            // 尝试多种选择器获取时间
            data.time = $('.time').text().trim() ||
                        $('.WB_from a').text().trim() ||
                        $('.from a').text().trim() ||
                        '时间未知';

            // 尝试多种方式获取互动数据
            const tryGetCount = (selectors, index) => {
                for (const selector of selectors) {
                    const elem = $(selector);
                    if (elem.length > index) {
                        const text = elem.eq(index).text().trim();
                        if (text) return this.formatNumber(text);
                    }
                }
                return 0;
            };

            // 尝试不同位置获取互动数据
            data.reposts = tryGetCount([
                'a[node-type="feed_list_forward"] span',
                '.toolbar li:nth-child(1) a span',
                '.woo-box-flex .woo-box-item:nth-child(1) span',
                '.WB_handle .S_ttxt2[action-type="feed_list_forward"]'
            ], 1) || 0;

            data.comments = tryGetCount([
                'a[node-type="feed_list_comment"] span',
                '.toolbar li:nth-child(2) a span',
                '.woo-box-flex .woo-box-item:nth-child(2) span',
                '.WB_handle .S_ttxt2[action-type="feed_list_comment"]'
            ], 1) || 0;

            data.likes = tryGetCount([
                'a[node-type="feed_list_like"] span',
                '.toolbar li:nth-child(3) a span',
                '.woo-box-flex .woo-box-item:nth-child(3) span',
                '.WB_handle .S_ttxt2[action-type="feed_list_like"] span'
            ], 1) || 0;

            return data;
        }

        async fetchFromAPI() {
            // 尝试从微博API获取数据
            const mid = this.getWeiboMid();
            if (!mid) return null;

            try {
                const response = await this.gmRequest({
                    method: 'GET',
                    url: `https://weibo.com/ajax/statuses/show?id=${mid}`,
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                if (response.status === 200) {
                    const json = JSON.parse(response.responseText);
                    return {
                        url: window.location.href,
                        title: document.title.replace(' - 微博', ''),
                        author: json.user?.screen_name || '未知作者',
                        content: json.text_raw || '内容获取失败',
                        time: json.created_at || '时间未知',
                        comments: json.comments_count || 0,
                        reposts: json.reposts_count || 0,
                        likes: json.attitudes_count || 0,
                        collectedAt: new Date().toLocaleString()
                    };
                }
            } catch (e) {
                console.error('API请求失败:', e);
            }
            return null;
        }

        getWeiboMid() {
            // 从URL中提取微博ID
            const urlMatch = window.location.href.match(/weibo\.com\/\d+\/(\w+)/);
            if (urlMatch && urlMatch[1]) return urlMatch[1];

            // 从页面元素中提取
            const $article = $('article[oid]');
            if ($article.length) return $article.attr('oid');

            return null;
        }

        gmRequest(options) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    ...options,
                    onload: resolve,
                    onerror: reject
                });
            });
        }

        formatNumber(str) {
            if (!str) return 0;
            str = str.trim();

            // 处理中文数字
            if (str.includes('万')) {
                return parseFloat(str) * 10000;
            }
            if (str.includes('亿')) {
                return parseFloat(str) * 100000000;
            }

            // 处理带逗号的数字
            return parseInt(str.replace(/,/g, '')) || 0;
        }

        updateUI(data) {
            $('#dataAuthor').text(data.author || '-');
            $('#dataTime').text(data.time || '-');
            $('#dataComments').text(data.comments || '0');
            $('#dataReposts').text(data.reposts || '0');
            $('#dataLikes').text(data.likes || '0');
            $('#dataContent').text(data.content ?
                (data.content.length > 30 ? data.content.substring(0, 30) + '...' : data.content)
                : '-');
        }

        exportData() {
            if (!this.currentData) {
                $('#dataStatus').text('没有可导出的数据');
                return;
            }

            this.exportToCSV([this.currentData], `微博数据_${this.currentData.author}_${new Date().toISOString().slice(0, 10)}.csv`);
        }

        exportBatchData() {
            if (this.batchData.length === 0) {
                $('#dataStatus').text('没有批量数据可导出');
                return;
            }

            this.exportToCSV(this.batchData, `微博批量数据_${new Date().toISOString().slice(0, 10)}.csv`);
        }

        exportToCSV(dataArray, filename) {
            const headers = ['微博URL', '微博标题', '作者', '发布时间', '微博内容', '评论数', '转发数', '点赞数', '抓取时间'];

            const csvRows = [];
            csvRows.push(headers.join(',')); // 标题行

            for (const data of dataArray) {
                const values = [
                    data.url,
                    `"${data.title.replace(/"/g, '""')}"`,
                    `"${data.author.replace(/"/g, '""')}"`,
                    `"${data.time}"`,
                    `"${data.content.replace(/"/g, '""')}"`,
                    data.comments,
                    data.reposts,
                    data.likes,
                    `"${data.collectedAt}"`
                ];
                csvRows.push(values.join(','));
            }

            const csvContent = csvRows.join('\n');

            GM_download({
                url: 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent),
                name: filename,
                saveAs: true,
                onerror: (e) => {
                    $('#dataStatus').text('导出失败: ' + e.error);
                },
                onload: () => {
                    $('#dataStatus').text('数据导出成功');
                }
            });
        }
    }

    // 页面加载完成后初始化
    $(document).ready(function() {
        // 延迟初始化以确保微博JS加载完成
        setTimeout(() => {
            new WeiboDataTool();
        }, 2000);
    });
})();
// ==UserScript==
// @name         易车网车家号数据抓取工具-终极版
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  彻底解决批量抓取视频页面作者丢失问题，支持API和HTML双重解析
// @author       YourName
// @match        https://news.yiche.com/hao/wenzhang/*
// @match        https://vc.yiche.com/vplay/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @connect      news.yiche.com
// @connect      vc.yiche.com
// @connect      *
// @run-at       document-end
// @license     All rights reserved
// @license     Do not copy or modify without permission
// @downloadURL https://update.greasyfork.org/scripts/531344/%E6%98%93%E8%BD%A6%E7%BD%91%E8%BD%A6%E5%AE%B6%E5%8F%B7%E6%95%B0%E6%8D%AE%E6%8A%93%E5%8F%96%E5%B7%A5%E5%85%B7-%E7%BB%88%E6%9E%81%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/531344/%E6%98%93%E8%BD%A6%E7%BD%91%E8%BD%A6%E5%AE%B6%E5%8F%B7%E6%95%B0%E6%8D%AE%E6%8A%93%E5%8F%96%E5%B7%A5%E5%85%B7-%E7%BB%88%E6%9E%81%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 确保jQuery已加载
    if (typeof $ === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js';
        script.onload = initScript;
        document.head.appendChild(script);
    } else {
        initScript();
    }

    function initScript() {
        const $ = window.jQuery;

        // 自定义样式
        GM_addStyle(`
            #yicheTool {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px;
                border: 2px solid #f60;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 99999;
                font-family: 'Microsoft YaHei', sans-serif;
                min-width: 350px;
                max-width: 450px;
                max-height: 80vh;
                overflow-y: auto;
            }
            #yicheTool h3 {
                margin-top: 0;
                color: #f60;
                border-bottom: 1px solid #eee;
                padding-bottom: 8px;
            }
            .data-row {
                display: flex;
                margin-bottom: 8px;
                line-height: 1.4;
            }
            .data-label {
                font-weight: bold;
                min-width: 70px;
                color: #666;
            }
            .data-value {
                flex: 1;
                word-break: break-all;
            }
            .tool-btn {
                background: #f60;
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 4px;
                cursor: pointer;
                margin-right: 8px;
                margin-top: 10px;
                font-size: 14px;
                transition: background 0.2s;
            }
            .tool-btn:hover {
                background: #e55;
            }
            .tool-btn.secondary {
                background: #666;
            }
            .tool-btn.secondary:hover {
                background: #555;
            }
            #batchInputArea {
                display: none;
                margin-top: 15px;
            }
            #batchInputArea textarea {
                width: 100%;
                height: 120px;
                margin-bottom: 10px;
                padding: 8px;
                box-sizing: border-box;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-family: monospace;
                white-space: pre;
            }
            #progressContainer {
                display: none;
                margin-top: 15px;
            }
            #progressBar {
                height: 20px;
                background: #eee;
                border-radius: 10px;
                margin: 8px 0;
                overflow: hidden;
            }
            #progress {
                height: 100%;
                background: #f60;
                width: 0%;
                transition: width 0.3s;
            }
            .batch-result-item {
                padding: 5px 0;
                border-bottom: 1px dotted #eee;
                font-size: 13px;
            }
            .batch-success {
                color: #090;
            }
            .batch-error {
                color: #d00;
            }
            .loading {
                color: #f60;
            }
        `);

        class YicheTool {
            constructor() {
                this.currentData = null;
                this.batchData = [];
                this.batchInProgress = false;
                this.initUI();
                this.setupEventListeners();
                this.waitForElements();
            }

            waitForElements() {
                const maxAttempts = 10;
                let attempts = 0;

                const checkInterval = setInterval(() => {
                    attempts++;
                    const isArticle = window.location.href.includes('/hao/wenzhang/');
                    const isVideo = window.location.href.includes('/vplay/');

                    if ((isArticle && $('.news-detail-header').length) ||
                        (isVideo && $('.video-title').length) ||
                        attempts >= maxAttempts) {
                        clearInterval(checkInterval);
                        this.fetchDataWithRetry(3);
                    }
                }, 500);
            }

            initUI() {
                $('#yicheTool').remove();

                const toolHtml = `
                <div id="yicheTool">
                    <h3>易车网数据抓取工具 v2.0</h3>
                    <div id="dataContainer">
                        <div class="data-row"><span class="data-label">状态:</span><span class="data-value" id="dataStatus">初始化中...</span></div>
                        <div class="data-row"><span class="data-label">标题:</span><span class="data-value" id="dataTitle">-</span></div>
                        <div class="data-row"><span class="data-label">作者:</span><span class="data-value" id="dataAuthor">-</span></div>
                        <div class="data-row"><span class="data-label">发布时间:</span><span class="data-value" id="dataTime">-</span></div>
                        <div class="data-row"><span class="data-label">链接:</span><span class="data-value" id="dataUrl">-</span></div>
                    </div>
                    <div>
                        <button id="refreshBtn" class="tool-btn">刷新数据</button>
                        <button id="exportBtn" class="tool-btn secondary">导出当前</button>
                        <button id="batchBtn" class="tool-btn">批量抓取</button>
                    </div>
                    <div id="batchInputArea">
                        <textarea id="batchUrls" placeholder="请输入要抓取的链接，每行一个&#10;支持格式：&#10;https://news.yiche.com/hao/wenzhang/*.html&#10;https://vc.yiche.com/vplay/*.html"></textarea>
                        <div style="display:flex; justify-content:space-between;">
                            <button id="startBatchBtn" class="tool-btn">开始抓取</button>
                            <button id="cancelBatchBtn" class="tool-btn secondary">取消</button>
                        </div>
                    </div>
                    <div id="progressContainer">
                        <div style="display:flex; justify-content:space-between;">
                            <span>进度:</span>
                            <span id="progressText">0/0</span>
                        </div>
                        <div id="progressBar"><div id="progress"></div></div>
                        <div id="batchResults"></div>
                    </div>
                </div>
                `;

                $('body').append(toolHtml);
            }

            setupEventListeners() {
                $(document).on('click', '#refreshBtn', () => {
                    $('#dataStatus').html('<span class="loading">重新加载中...</span>');
                    this.fetchDataWithRetry(3);
                });

                $(document).on('click', '#exportBtn', () => this.exportCurrentData());
                $(document).on('click', '#batchBtn', () => this.toggleBatchInput(true));
                $(document).on('click', '#startBatchBtn', () => this.startBatchProcessing());
                $(document).on('click', '#cancelBatchBtn', () => this.toggleBatchInput(false));
            }

            toggleBatchInput(show = true) {
                $('#batchInputArea').toggle(show);
                $('#progressContainer').hide();
                if (show) {
                    $('#batchUrls').val('').focus();
                }
            }

            async startBatchProcessing() {
                const urls = $('#batchUrls').val().split('\n')
                    .map(url => url.trim())
                    .filter(url => url.includes('yiche.com') &&
                          (url.includes('/hao/wenzhang/') || url.includes('/vplay/')));

                if (urls.length === 0) {
                    alert('请输入有效的易车网链接\n支持格式:\nhttps://news.yiche.com/hao/wenzhang/*.html\nhttps://vc.yiche.com/vplay/*.html');
                    return;
                }

                this.batchData = [];
                this.batchInProgress = true;
                $('#batchInputArea').hide();
                $('#progressContainer').show();
                $('#batchResults').html('');
                $('#progress').css('width', '0%');
                $('#progressText').text(`0/${urls.length}`);

                const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

                for (let i = 0; i < urls.length; i++) {
                    if (!this.batchInProgress) break;

                    const url = urls[i];
                    try {
                        $('#progressText').text(`${i+1}/${urls.length}`);
                        const result = await this.processBatchUrl(url);
                        this.batchData.push(result);
                        this.appendBatchResult(url, true, '抓取成功');
                    } catch (e) {
                        this.appendBatchResult(url, false, e.message || '抓取失败');
                    }

                    $('#progress').css('width', `${((i + 1) / urls.length) * 100}%`);

                    if (i < urls.length - 1) {
                        await delay(3000 + Math.random() * 2000);
                    }
                }

                this.batchInProgress = false;
                $('#dataStatus').text(`批量抓取完成，成功 ${this.batchData.length}/${urls.length}`);

                if (this.batchData.length > 0) {
                    $('#batchResults').append(`
                        <div style="margin-top:10px;">
                            <button id="exportBatchBtn" class="tool-btn">导出全部数据</button>
                            <button id="saveBatchBtn" class="tool-btn secondary" style="margin-left:10px;">保存进度</button>
                        </div>
                    `);
                    $(document).on('click', '#exportBatchBtn', () => this.exportBatchData());
                    $(document).on('click', '#saveBatchBtn', () => this.saveBatchProgress());
                }
            }

            async processBatchUrl(url) {
                return new Promise((resolve, reject) => {
                    // 方法1：先尝试请求API接口
                    const apiUrl = this.getVideoApiUrl(url);
                    if (apiUrl) {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: apiUrl,
                            headers: {
                                'Referer': url,
                                'X-Requested-With': 'XMLHttpRequest'
                            },
                            onload: (response) => {
                                try {
                                    const data = JSON.parse(response.responseText);
                                    if (data && data.data) {
                                        const result = {
                                            url: url,
                                            title: data.data.title || '未知标题',
                                            author: data.data.authorInfo?.name ||
                                                   data.data.authorName ||
                                                   '未知作者',
                                            time: this.formatDate(data.data.publishTime),
                                            type: '视频',
                                            collectedAt: new Date().toISOString().split('T')[0]
                                        };
                                        resolve(result);
                                        return;
                                    }
                                    throw new Error('API返回数据不完整');
                                } catch (e) {
                                    console.log('API解析失败，回退到HTML解析:', e);
                                    this.parseHtmlPage(url).then(resolve).catch(reject);
                                }
                            },
                            onerror: () => {
                                this.parseHtmlPage(url).then(resolve).catch(reject);
                            },
                            timeout: 10000
                        });
                    } else {
                        // 不是视频链接，直接解析HTML
                        this.parseHtmlPage(url).then(resolve).catch(reject);
                    }
                });
            }

            getVideoApiUrl(url) {
                // 从URL中提取视频ID
                const match = url.match(/vplay\/(\d+)\.html/);
                if (match && match[1]) {
                    return `https://vc.yiche.com/vcloud/video/getvideosdetail?videoId=${match[1]}`;
                }
                return null;
            }

            async parseHtmlPage(url) {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        headers: {
                            'Referer': 'https://www.yiche.com/',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        onload: (response) => {
                            try {
                                const html = response.responseText;
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(html, 'text/html');
                                const $doc = $(doc);

                                const isVideo = url.includes('/vplay/');
                                let title = '', author = '', time = '';

                                if (isVideo) {
                                    // 视频页面解析
                                    title = $doc.find('.video-title').attr('title') ||
                                           $doc.find('.video-title').text().trim();

                                    // 作者信息 - 多重选择器
                                    const authorSelectors = [
                                        '#userBox > div.clearfix > div:nth-child(2) > div > a',
                                        '.user-name',
                                        '.author-name',
                                        '.video-user-name',
                                        '[class*="user-name"]',
                                        '[class*="author-name"]'
                                    ];

                                    for (const selector of authorSelectors) {
                                        const el = $doc.find(selector).first();
                                        if (el.length && el.text().trim()) {
                                            author = el.text().trim();
                                            break;
                                        }
                                    }

                                    // 时间信息
                                    const timeSelectors = [
                                        '.pubTime',
                                        '.video-pub-time',
                                        '.video-info-item',
                                        '[class*="time"]'
                                    ];

                                    for (const selector of timeSelectors) {
                                        const el = $doc.find(selector).first();
                                        if (el.length && el.text().trim()) {
                                            time = this.formatDate(el.text().trim());
                                            break;
                                        }
                                    }

                                    // 从JS数据中尝试获取
                                    const jsDataMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*({.+?});/);
                                    if (jsDataMatch) {
                                        try {
                                            const jsData = JSON.parse(jsDataMatch[1]);
                                            if (!author && jsData.videoDetail?.authorInfo?.name) {
                                                author = jsData.videoDetail.authorInfo.name;
                                            }
                                            if (!time && jsData.videoDetail?.publishTime) {
                                                time = this.formatDate(jsData.videoDetail.publishTime);
                                            }
                                        } catch (e) {}
                                    }
                                } else {
                                    // 文章页面解析
                                    title = $doc.find('.news-detail-header').text().trim();
                                    author = $doc.find('.news-detail-profile a').first().text().trim();
                                    time = this.formatDate($doc.find('.news-detail-profile li').eq(1).text().trim());
                                }

                                resolve({
                                    url: url,
                                    title: title || '未知标题',
                                    author: author || '未知作者',
                                    time: time || '未知时间',
                                    type: isVideo ? '视频' : '文章',
                                    collectedAt: new Date().toISOString().split('T')[0]
                                });
                            } catch (e) {
                                reject(new Error('解析HTML失败: ' + e.message));
                            }
                        },
                        onerror: (err) => {
                            reject(new Error('请求页面失败: ' + err.error));
                        },
                        timeout: 15000
                    });
                });
            }

            formatDate(dateStr) {
                if (!dateStr) return '未知时间';

                // 尝试解析各种可能的日期格式
                const datePatterns = [
                    /(\d{4}-\d{1,2}-\d{1,2})/,
                    /(\d{4}\.\d{1,2}\.\d{1,2})/,
                    /(\d{4}年\d{1,2}月\d{1,2}日)/,
                    /(\d{1,2}-\d{1,2}-\d{4})/,
                    /(\d{1,2}\/\d{1,2}\/\d{4})/
                ];

                for (const pattern of datePatterns) {
                    const match = dateStr.match(pattern);
                    if (match) {
                        const dateParts = match[1].split(/[-\/年月日\.]/);
                        if (dateParts.length === 3) {
                            const year = dateParts[0].length === 2 ? '20' + dateParts[0] : dateParts[0];
                            const month = dateParts[1].padStart(2, '0');
                            const day = dateParts[2].padStart(2, '0');
                            return `${year}-${month}-${day}`;
                        }
                        return match[1];
                    }
                }

                const date = new Date(dateStr);
                if (!isNaN(date.getTime())) {
                    return date.toISOString().split('T')[0];
                }

                return dateStr;
            }

            scrapeFromDOM() {
                const isArticle = window.location.href.includes('/hao/wenzhang/');
                const isVideo = window.location.href.includes('/vplay/');

                if (isArticle) {
                    const title = $('.news-detail-header').text().trim();
                    const author = $('.news-detail-profile a').first().text().trim();
                    const time = this.formatDate($('.news-detail-profile li').eq(1).text().trim());

                    return {
                        url: window.location.href,
                        title: title || '未知标题',
                        author: author || '未知作者',
                        time: time || '未知时间',
                        type: '文章',
                        collectedAt: new Date().toISOString().split('T')[0]
                    };
                } else if (isVideo) {
                    const title = $('.video-title').attr('title') || $('.video-title').text().trim();

                    // 使用精确的作者选择器
                    const authorElement = document.querySelector("#userBox > div.clearfix > div:nth-child(2) > div > a");
                    const author = authorElement ? authorElement.textContent.trim() : '未知作者';

                    const time = this.formatDate($('.pubTime').text().trim() ||
                                              $('.video-pub-time').text().trim());

                    return {
                        url: window.location.href,
                        title: title || '未知标题',
                        author: author || '未知作者',
                        time: time || '未知时间',
                        type: '视频',
                        collectedAt: new Date().toISOString().split('T')[0]
                    };
                }

                return {
                    url: window.location.href,
                    title: '未知标题',
                    author: '未知作者',
                    time: '未知时间',
                    type: '未知',
                    collectedAt: new Date().toISOString().split('T')[0]
                };
            }

            appendBatchResult(url, success, message) {
                const shortUrl = url.replace(/https?:\/\/(www\.)?(news\.|vc\.)?yiche\.com\//, '');
                $('#batchResults').append(`
                    <div class="batch-result-item ${success ? 'batch-success' : 'batch-error'}">
                        ${shortUrl}: ${message}
                    </div>
                `);
                $('#batchResults').scrollTop($('#batchResults')[0].scrollHeight);
            }

            saveBatchProgress() {
                GM_setValue('yicheBatchData', this.batchData);
                $('#dataStatus').html('<span style="color:green">批量数据已保存！</span>');
            }

            loadBatchProgress() {
                const savedData = GM_getValue('yicheBatchData', []);
                if (savedData.length > 0) {
                    this.batchData = savedData;
                    $('#dataStatus').html(`<span style="color:green">已加载 ${savedData.length} 条保存的数据</span>`);

                    $('#batchResults').html('');
                    savedData.forEach(item => {
                        this.appendBatchResult(item.url, true, '已加载');
                    });

                    $('#batchResults').append(`
                        <div style="margin-top:10px;">
                            <button id="exportBatchBtn" class="tool-btn">导出全部数据</button>
                        </div>
                    `);
                    $(document).on('click', '#exportBatchBtn', () => this.exportBatchData());
                }
            }

            async fetchDataWithRetry(retryCount) {
                let success = false;
                let lastError = null;

                for (let i = 0; i < retryCount; i++) {
                    try {
                        const data = await this.fetchData();
                        if (data && data.title && data.author) {
                            this.updateUI(data);
                            this.currentData = data;
                            $('#dataStatus').text('数据已更新');
                            success = true;
                            break;
                        }
                        throw new Error('未获取到有效数据');
                    } catch (e) {
                        lastError = e;
                        if (i < retryCount - 1) {
                            await new Promise(resolve => setTimeout(resolve, 1500));
                        }
                    }
                }

                if (!success) {
                    $('#dataStatus').html(`获取失败: ${lastError?.message || '未知错误'}<br>请尝试<a href="javascript:window.location.reload()">刷新页面</a>`);
                }
            }

            async fetchData() {
                return new Promise((resolve) => {
                    const domData = this.scrapeFromDOM();
                    if (domData.title && domData.author) {
                        resolve(domData);
                        return;
                    }

                    this.fetchFromAPI().then(apiData => {
                        resolve(apiData || domData);
                    });
                });
            }

            async fetchFromAPI() {
                return null;
            }

            updateUI(data) {
                $('#dataTitle').text(data.title || '-');
                $('#dataAuthor').text(data.author || '-');
                $('#dataTime').text(data.time || '-');
                $('#dataUrl').text(data.url || '-');
            }

            exportCurrentData() {
                if (!this.currentData) {
                    $('#dataStatus').text('没有可导出的数据');
                    return;
                }
                this.exportToCSV([this.currentData], `易车网_${this.currentData.type}_${new Date().toISOString().slice(0, 10)}.csv`);
            }

            exportBatchData() {
                if (this.batchData.length === 0) {
                    $('#dataStatus').text('没有批量数据可导出');
                    return;
                }
                this.exportToCSV(this.batchData, `易车网批量数据_${new Date().toISOString().slice(0, 10)}.csv`);
            }

            exportToCSV(dataArray, filename) {
                const headers = ['类型', 'URL', '标题', '作者', '发布时间', '抓取时间'];

                const csvRows = [];
                csvRows.push(headers.join(','));

                for (const data of dataArray) {
                    const values = [
                        data.type,
                        data.url,
                        `"${data.title.replace(/"/g, '""')}"`,
                        `"${data.author.replace(/"/g, '""')}"`,
                        `"${data.time}"`,
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

        // 启动脚本
        const tool = new YicheTool();
        tool.loadBatchProgress();
    }
})();
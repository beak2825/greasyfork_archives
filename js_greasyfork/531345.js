// ==UserScript==
// @name         汽车之家车家号数据抓取工具
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  批量抓取汽车之家车家号视频的标题、作者、时间和播放数
// @author       YourName
// @match        https://chejiahao.autohome.com.cn/info/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @connect      chejiahao.autohome.com.cn
// @run-at       document-end
// @license     All rights reserved
// @license     Do not copy or modify without permission
// @downloadURL https://update.greasyfork.org/scripts/531345/%E6%B1%BD%E8%BD%A6%E4%B9%8B%E5%AE%B6%E8%BD%A6%E5%AE%B6%E5%8F%B7%E6%95%B0%E6%8D%AE%E6%8A%93%E5%8F%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/531345/%E6%B1%BD%E8%BD%A6%E4%B9%8B%E5%AE%B6%E8%BD%A6%E5%AE%B6%E5%8F%B7%E6%95%B0%E6%8D%AE%E6%8A%93%E5%8F%96%E5%B7%A5%E5%85%B7.meta.js
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
        // 防止重复初始化
        if (window.autohomeVideoToolInitialized) return;
        window.autohomeVideoToolInitialized = true;

        const $ = window.jQuery;

        // 自定义样式
        GM_addStyle(`
            #autohomeVideoTool {
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
            #autohomeVideoTool h3 {
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

        class AutohomeVideoTool {
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
                    if ($('.box.light.vio').length || attempts >= maxAttempts) {
                        clearInterval(checkInterval);
                        this.fetchDataWithRetry(3);
                    }
                }, 500);
            }

            initUI() {
                $('#autohomeVideoTool').remove();

                const toolHtml = `
                <div id="autohomeVideoTool">
                    <h3>汽车之家视频数据抓取</h3>
                    <div id="dataContainer">
                        <div class="data-row"><span class="data-label">状态:</span><span class="data-value" id="dataStatus">初始化中...</span></div>
                        <div class="data-row"><span class="data-label">视频标题:</span><span class="data-value" id="dataTitle">-</span></div>
                        <div class="data-row"><span class="data-label">作者:</span><span class="data-value" id="dataAuthor">-</span></div>
                        <div class="data-row"><span class="data-label">发布时间:</span><span class="data-value" id="dataTime">-</span></div>
                        <div class="data-row"><span class="data-label">播放量:</span><span class="data-value" id="dataViews">-</span></div>
                    </div>
                    <div>
                        <button id="refreshBtn" class="tool-btn">刷新数据</button>
                        <button id="exportBtn" class="tool-btn secondary">导出当前</button>
                        <button id="batchBtn" class="tool-btn">批量抓取</button>
                    </div>
                    <div id="batchInputArea">
                        <textarea id="batchUrls" placeholder="请输入要抓取的视频链接，每行一个&#10;例如：&#10;https://chejiahao.autohome.com.cn/info/19720148&#10;https://chejiahao.autohome.com.cn/info/19720149"></textarea>
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
                    .filter(url => url.startsWith('https://chejiahao.autohome.com.cn/info/'));

                if (urls.length === 0) {
                    alert('请输入有效的汽车之家车家号视频链接\n格式: https://chejiahao.autohome.com.cn/info/数字');
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
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        headers: {
                            'Referer': 'https://chejiahao.autohome.com.cn/',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        onload: (response) => {
                            try {
                                const html = response.responseText;
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(html, 'text/html');
                                const $doc = $(doc);
                                const data = this.extractDataFromDOM($doc, url);
                                if (data.author === '未知作者' || data.time === '未知时间') {
                                    reject(new Error('数据不完整'));
                                } else {
                                    resolve(data);
                                }
                            } catch (e) {
                                reject(new Error('解析页面失败'));
                            }
                        },
                        onerror: () => {
                            reject(new Error('请求失败'));
                        },
                        timeout: 10000
                    });
                });
            }

            extractDataFromDOM($doc, url) {
                const $videoBox = $doc.find('.box.light.vio');

                // 提取标题
                const title = $videoBox.find('.title').text().trim() ||
                             $doc.find('title').text().replace(' - 车家号 - 汽车之家', '');

                // 提取作者 - 从标签中获取
                const author = $videoBox.find('.articleTag span:first').text().trim() || '未知作者';

                // 提取发布时间
                const time = $videoBox.find('.articleTag span:contains("-")').text().trim() || '未知时间';

                // 提取播放量
                const viewsText = $videoBox.find('.articleTag .browse').text().trim().replace(/[^\d]/g, '') || '0';
                const views = parseInt(viewsText) || 0;

                return {
                    url: url,
                    title: title,
                    author: author,
                    time: time,
                    views: views,
                    collectedAt: new Date().toLocaleString()
                };
            }

            appendBatchResult(url, success, message) {
                const shortUrl = url.replace(/https?:\/\/(www\.)?chejiahao\.autohome\.com\.cn\/info\//, '');
                $('#batchResults').append(`
                    <div class="batch-result-item ${success ? 'batch-success' : 'batch-error'}">
                        ${shortUrl}: ${message}
                    </div>
                `);
                $('#batchResults').scrollTop($('#batchResults')[0].scrollHeight);
            }

            saveBatchProgress() {
                GM_setValue('autohomeVideoBatchData', this.batchData);
                $('#dataStatus').html('<span style="color:green">批量数据已保存！</span>');
            }

            loadBatchProgress() {
                const savedData = GM_getValue('autohomeVideoBatchData', []);
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
                        if (data && data.author !== '未知作者') {
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
                    if (domData.author !== '未知作者') {
                        resolve(domData);
                        return;
                    }

                    this.fetchFromAPI().then(apiData => {
                        resolve(apiData || domData);
                    });
                });
            }

            scrapeFromDOM() {
                const $videoBox = $('.box.light.vio');

                // 提取标题
                const title = $videoBox.find('.title').text().trim() ||
                             document.title.replace(' - 车家号 - 汽车之家', '');

                // 提取作者 - 从标签中获取
                const author = $videoBox.find('.articleTag span:first').text().trim() || '未知作者';

                // 提取发布时间
                const time = $videoBox.find('.articleTag span:contains("-")').text().trim() || '未知时间';

                // 提取播放量
                const viewsText = $videoBox.find('.articleTag .browse').text().trim().replace(/[^\d]/g, '') || '0';
                const views = parseInt(viewsText) || 0;

                return {
                    url: window.location.href,
                    title: title,
                    author: author,
                    time: time,
                    views: views,
                    collectedAt: new Date().toLocaleString()
                };
            }

            async fetchFromAPI() {
                try {
                    const videoId = window.location.href.match(/info\/(\d+)/)[1];
                    const response = await this.gmRequest({
                        method: 'GET',
                        url: `https://chejiahao.autohome.com.cn/api/video/detail?id=${videoId}`,
                        headers: {
                            'Accept': 'application/json',
                            'Referer': window.location.href,
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    });

                    if (response.status === 200) {
                        const json = JSON.parse(response.responseText);
                        return {
                            url: window.location.href,
                            title: json.data?.title || '未知标题',
                            author: json.data?.author?.name || '未知作者',
                            time: json.data?.publishTime || '未知时间',
                            views: json.data?.playCount || 0,
                            collectedAt: new Date().toLocaleString()
                        };
                    }
                } catch (e) {
                    console.error('API请求失败:', e);
                }
                return null;
            }

            updateUI(data) {
                $('#dataTitle').text(data.title || '-');
                $('#dataAuthor').text(data.author || '-');
                $('#dataTime').text(data.time || '-');
                $('#dataViews').text(data.views?.toLocaleString() || '0');
            }

            exportCurrentData() {
                if (!this.currentData) {
                    $('#dataStatus').text('没有可导出的数据');
                    return;
                }
                this.exportToCSV([this.currentData], `汽车之家视频_${this.currentData.author}_${new Date().toISOString().slice(0, 10)}.csv`);
            }

            exportBatchData() {
                if (this.batchData.length === 0) {
                    $('#dataStatus').text('没有批量数据可导出');
                    return;
                }
                this.exportToCSV(this.batchData, `汽车之家视频批量数据_${new Date().toISOString().slice(0, 10)}.csv`);
            }

            exportToCSV(dataArray, filename) {
                const headers = ['视频URL', '标题', '作者', '发布时间', '播放量', '抓取时间'];

                const csvRows = [];
                csvRows.push(headers.join(','));

                for (const data of dataArray) {
                    const values = [
                        data.url,
                        `"${data.title.replace(/"/g, '""')}"`,
                        `"${data.author.replace(/"/g, '""')}"`,
                        `"${data.time}"`,
                        data.views,
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

            gmRequest(options) {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        ...options,
                        onload: resolve,
                        onerror: reject
                    });
                });
            }
        }

        // 启动脚本（添加延迟确保DOM加载完成）
        setTimeout(() => {
            try {
                new AutohomeVideoTool();
                console.log('汽车之家视频工具已启动');
            } catch (e) {
                console.error('初始化失败:', e);
            }
        }, 1000);
    }
})();
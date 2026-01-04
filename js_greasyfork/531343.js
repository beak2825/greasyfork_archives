// ==UserScript==
// @name         懂车帝数据抓取工具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  批量抓取懂车帝视频和文章的标题、作者、阅读数、点赞数、评论数和发布时间
// @author       LeoChen
// @match        https://www.dongchedi.com/video/*
// @match        https://www.dongchedi.com/article/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.7/dayjs.min.js
// @connect      www.dongchedi.com
// @run-at       document-end
// @license      All rights reserved
// @license      Do not copy or modify without permission
// @downloadURL https://update.greasyfork.org/scripts/531343/%E6%87%82%E8%BD%A6%E5%B8%9D%E6%95%B0%E6%8D%AE%E6%8A%93%E5%8F%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/531343/%E6%87%82%E8%BD%A6%E5%B8%9D%E6%95%B0%E6%8D%AE%E6%8A%93%E5%8F%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 确保jQuery和dayjs已加载
    function initScript() {
        const $ = window.jQuery;
        const dayjs = window.dayjs;

        // 自定义样式
        GM_addStyle(`
            #dcdTool {
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
            #dcdTool h3 {
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
                min-width: 80px;
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

        class DCDTool {
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
                    const isVideo = window.location.href.includes('/video/');
                    const isArticle = window.location.href.includes('/article/');

                    if ((isVideo && $('h1[class*="tw-text-24"]').length) ||
                        (isArticle && $('h1.title').length) ||
                        attempts >= maxAttempts) {
                        clearInterval(checkInterval);
                        this.fetchDataWithRetry(3);
                    }
                }, 500);
            }

            initUI() {
                $('#dcdTool').remove();

                const toolHtml = `
                <div id="dcdTool">
                    <h3>懂车帝数据抓取</h3>
                    <div id="dataContainer">
                        <div class="data-row"><span class="data-label">状态:</span><span class="data-value" id="dataStatus">初始化中...</span></div>
                        <div class="data-row"><span class="data-label">类型:</span><span class="data-value" id="dataType">-</span></div>
                        <div class="data-row"><span class="data-label">标题:</span><span class="data-value" id="dataTitle">-</span></div>
                        <div class="data-row"><span class="data-label">作者:</span><span class="data-value" id="dataAuthor">-</span></div>
                        <div class="data-row"><span class="data-label">发布时间:</span><span class="data-value" id="dataTime">-</span></div>
                        <div class="data-row"><span class="data-label">阅读数:</span><span class="data-value" id="dataViews">-</span></div>
                        <div class="data-row"><span class="data-label">点赞数:</span><span class="data-value" id="dataLikes">-</span></div>
                        <div class="data-row"><span class="data-label">评论数:</span><span class="data-value" id="dataComments">-</span></div>
                        <div class="data-row"><span class="data-label">链接:</span><span class="data-value" id="dataUrl">-</span></div>
                    </div>
                    <div>
                        <button id="refreshBtn" class="tool-btn">刷新数据</button>
                        <button id="exportBtn" class="tool-btn secondary">导出当前</button>
                        <button id="batchBtn" class="tool-btn">批量抓取</button>
                    </div>
                    <div id="batchInputArea">
                        <textarea id="batchUrls" placeholder="请输入要抓取的链接，每行一个&#10;支持格式：&#10;https://www.dongchedi.com/video/*&#10;https://www.dongchedi.com/article/*"></textarea>
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
                    .filter(url => url.includes('dongchedi.com') &&
                          (url.includes('/video/') || url.includes('/article/')));

                if (urls.length === 0) {
                    alert('请输入有效的懂车帝链接\n支持格式:\nhttps://www.dongchedi.com/video/*\nhttps://www.dongchedi.com/article/*');
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
                            'Referer': 'https://www.dongchedi.com/',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        onload: (response) => {
                            try {
                                const html = response.responseText;
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(html, 'text/html');
                                const $doc = $(doc);
                                const data = this.extractDataFromDOM($doc, url);
                                if (!data.title || !data.author) {
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
                const isVideo = url.includes('/video/');
                const isArticle = url.includes('/article/');

                let title = '', author = '', time = '', views = 0, likes = 0, comments = 0;

                if (isVideo) {
                    // 视频页面数据提取
                    title = $doc.find('h1[class*="tw-text-24"]').text().trim();

                    // 使用新提供的选择器获取作者
                    const authorElement = $doc[0].querySelector("#__next > div.tw-flex > div > div > div > div:nth-child(2) > div > div.jsx-913536079.tw-mt-25.tw-mb-27.tw-flex.tw-justify-between.tw-flex-column > div > div > div.jsx-2348083694.tw-text-common-black.tw-text-16.tw-mb-2 > a");
                    author = authorElement ? authorElement.textContent.trim() : '';

                    // 从JSON-LD中提取观看数
                    const jsonLd = $doc.find('script[type="application/ld+json"]').html();
                    if (jsonLd) {
                        try {
                            const data = JSON.parse(jsonLd);
                            views = data.interactionStatistic?.userInteractionCount || 0;
                        } catch (e) {
                            console.error('解析JSON-LD失败:', e);
                        }
                    }

                    // 发布时间处理为年月日格式
                    const timeText = $doc.find('span[class*="tw-mr-24"]').text().trim().replace('发布于', '');
                    time = this.formatDateToYMD(timeText);

                    // 使用新提供的选择器获取点赞数
                    const likesElement = $doc[0].querySelector("#__next > div.tw-flex > div > div > div > div.jsx-913536079.tw-grid.tw-grid-cols-12.tw-gap-16.tw-mt-16.tw-px-percent-4 > div.jsx-913536079.tw-col-span-9 > div > div.jsx-913536079.tw-bg-video-black.tw-h-52.tw-flex.tw-items-center.tw-justify-between.tw-px-16 > div.undefined.tw-flex.tw-items-center.tw-h-44.tw-text-video-gray.tw-text-16.tw-leading-20 > div > div:nth-child(2)");
                    likes = likesElement ? parseInt(likesElement.textContent.replace(/\D/g, '')) || 0 : 0;

                    // 使用新提供的选择器获取评论数
                    const commentsElement = $doc[0].querySelector("#comment > span:nth-child(2)");
                    comments = commentsElement ? parseInt(commentsElement.textContent.replace(/\D/g, '')) || 0 : 0;

                } else if (isArticle) {
                    // 文章页面数据提取
                    title = $doc.find('h1.title').text().trim();
                    author = $doc.find('a.source').text().trim();

                    // 发布时间处理为年月日格式
                    const timeText = $doc.find('span.time').text().trim();
                    time = this.formatDateToYMD(this.parseRelativeTime(timeText));

                    // 尝试从页面JSON数据中获取阅读数
                    try {
                        const jsonData = JSON.parse($doc.find('script#__NEXT_DATA__').html());
                        const articleData = jsonData.props.pageProps.article;
                        if (articleData) {
                            views = articleData.watch_count || 0;

                            // 如果watch_count是中文数字，转换为阿拉伯数字
                            if (typeof views === 'string') {
                                views = this.chineseNumToNumber(views);
                            }
                        }
                    } catch (e) {
                        console.error('解析页面JSON数据失败:', e);
                        // 备用方案：从页面元素获取
                        const viewsText = $doc.find('div.read-count').text().trim();
                        views = this.chineseNumToNumber(viewsText.replace('次阅读', '')) || 0;
                    }

                    // 使用XPath获取点赞数
                    let likesText = '';
                    try {
                        const likesNode = document.evaluate(
                            '/html/body/div[1]/div[1]/div[2]/div/div/div/main/section/div[1]/article/div[3]/div/div/div[2]/div[2]/text()[1]',
                            $doc[0],
                            null,
                            XPathResult.FIRST_ORDERED_NODE_TYPE,
                            null
                        ).singleNodeValue;
                        likesText = likesNode ? likesNode.textContent.trim() : '';
                    } catch (e) {
                        console.error('XPath查询失败:', e);
                    }

                    // 处理点赞数文本
                    likes = this.parseCountText(likesText);

                    // 评论数
                    const commentsText = $doc.find('#comment span').eq(1).text().trim();
                    comments = parseInt(commentsText) || 0;
                }

                return {
                    url: url,
                    title: title || '未知标题',
                    author: author || '未知作者',
                    time: time || '未知时间',
                    views: views,
                    likes: likes,
                    comments: comments,
                    type: isVideo ? '视频' : (isArticle ? '文章' : '未知'),
                    collectedAt: new Date().toLocaleString()
                };
            }

            // 解析数量文本（处理"1.2万"等格式）
            parseCountText(text) {
                if (!text) return 0;

                // 处理"万"单位
                if (text.includes('万')) {
                    const num = parseFloat(text.replace('万', ''));
                    return Math.round(num * 10000);
                }

                // 提取数字
                const numMatch = text.match(/(\d+\.?\d*)/);
                return numMatch ? parseInt(numMatch[0]) : 0;
            }

            // 格式化日期为年月日
            formatDateToYMD(dateStr) {
                if (!dateStr) return '';

                // 尝试解析各种格式的日期
                const formats = [
                    'YYYY.MM.DD HH:mm',
                    'YYYY-MM-DD HH:mm',
                    'YYYY/MM/DD HH:mm',
                    'YYYY年MM月DD日 HH:mm'
                ];

                let parsedDate = null;
                for (const format of formats) {
                    parsedDate = dayjs(dateStr, format);
                    if (parsedDate.isValid()) break;
                }

                if (parsedDate && parsedDate.isValid()) {
                    return parsedDate.format('YYYY.MM.DD');
                }

                // 如果无法解析，尝试提取年月日部分
                const ymdMatch = dateStr.match(/(\d{4})[\.\/年-](\d{1,2})[\.\/月-](\d{1,2})/);
                if (ymdMatch) {
                    return `${ymdMatch[1]}.${ymdMatch[2].padStart(2, '0')}.${ymdMatch[3].padStart(2, '0')}`;
                }

                return dateStr;
            }

            // 解析相对时间（如"5天前"）
            parseRelativeTime(timeText) {
                if (!timeText) return '';

                if (timeText.includes('刚刚')) {
                    return dayjs().format('YYYY.MM.DD HH:mm');
                } else if (timeText.includes('分钟前')) {
                    const mins = parseInt(timeText.replace('分钟前', ''));
                    return dayjs().subtract(mins, 'minute').format('YYYY.MM.DD HH:mm');
                } else if (timeText.includes('小时前')) {
                    const hours = parseInt(timeText.replace('小时前', ''));
                    return dayjs().subtract(hours, 'hour').format('YYYY.MM.DD HH:mm');
                } else if (timeText.includes('天前')) {
                    const days = parseInt(timeText.replace('天前', ''));
                    return dayjs().subtract(days, 'day').format('YYYY.MM.DD HH:mm');
                }

                return timeText;
            }

            // 中文数字转阿拉伯数字
            chineseNumToNumber(str) {
                if (!str) return 0;

                // 如果是数字字符串直接转换
                if (/^\d+$/.test(str)) {
                    return parseInt(str);
                }

                // 处理特殊中文数字字符
                const chineseNumMap = {
                    '': 1,
                    '': 2,
                    '': 3,
                    '': 4,
                    '': 5,
                    '': 6,
                    '': 7,
                    '': 8,
                    '': 9,
                    '': 0
                };

                let result = '';
                for (let i = 0; i < str.length; i++) {
                    const char = str[i];
                    if (chineseNumMap[char] !== undefined) {
                        result += chineseNumMap[char];
                    } else if (/\d/.test(char)) {
                        result += char;
                    }
                }

                return parseInt(result) || 0;
            }

            appendBatchResult(url, success, message) {
                const shortUrl = url.replace(/https?:\/\/www\.dongchedi\.com\//, '');
                $('#batchResults').append(`
                    <div class="batch-result-item ${success ? 'batch-success' : 'batch-error'}">
                        ${shortUrl}: ${message}
                    </div>
                `);
                $('#batchResults').scrollTop($('#batchResults')[0].scrollHeight);
            }

            saveBatchProgress() {
                GM_setValue('dcdBatchData', this.batchData);
                $('#dataStatus').html('<span style="color:green">批量数据已保存！</span>');
            }

            loadBatchProgress() {
                const savedData = GM_getValue('dcdBatchData', []);
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

            scrapeFromDOM() {
                const isVideo = window.location.href.includes('/video/');
                const isArticle = window.location.href.includes('/article/');

                let title = '', author = '', time = '', views = 0, likes = 0, comments = 0;

                if (isVideo) {
                    // 视频页面数据提取
                    title = $('h1[class*="tw-text-24"]').text().trim();

                    // 使用新提供的选择器获取作者
                    const authorElement = document.querySelector("#__next > div.tw-flex > div > div > div > div:nth-child(2) > div > div.jsx-913536079.tw-mt-25.tw-mb-27.tw-flex.tw-justify-between.tw-flex-column > div > div > div.jsx-2348083694.tw-text-common-black.tw-text-16.tw-mb-2 > a");
                    author = authorElement ? authorElement.textContent.trim() : '';

                    // 从JSON-LD中提取观看数
                    const jsonLd = $('script[type="application/ld+json"]').html();
                    if (jsonLd) {
                        try {
                            const data = JSON.parse(jsonLd);
                            views = data.interactionStatistic?.userInteractionCount || 0;
                        } catch (e) {
                            console.error('解析JSON-LD失败:', e);
                        }
                    }

                    // 发布时间处理为年月日格式
                    const timeText = $('span[class*="tw-mr-24"]').text().trim().replace('发布于', '');
                    time = this.formatDateToYMD(timeText);

                    // 使用新提供的选择器获取点赞数
                    const likesElement = document.querySelector("#__next > div.tw-flex > div > div > div > div.jsx-913536079.tw-grid.tw-grid-cols-12.tw-gap-16.tw-mt-16.tw-px-percent-4 > div.jsx-913536079.tw-col-span-9 > div > div.jsx-913536079.tw-bg-video-black.tw-h-52.tw-flex.tw-items-center.tw-justify-between.tw-px-16 > div.undefined.tw-flex.tw-items-center.tw-h-44.tw-text-video-gray.tw-text-16.tw-leading-20 > div > div:nth-child(2)");
                    likes = likesElement ? parseInt(likesElement.textContent.replace(/\D/g, '')) || 0 : 0;

                    // 使用新提供的选择器获取评论数
                    const commentsElement = document.querySelector("#comment > span:nth-child(2)");
                    comments = commentsElement ? parseInt(commentsElement.textContent.replace(/\D/g, '')) || 0 : 0;

                } else if (isArticle) {
                    // 文章页面数据提取
                    title = $('h1.title').text().trim();
                    author = $('a.source').text().trim();

                    // 发布时间处理为年月日格式
                    const timeText = $('span.time').text().trim();
                    time = this.formatDateToYMD(this.parseRelativeTime(timeText));

                    // 尝试从页面JSON数据中获取阅读数
                    try {
                        const jsonData = JSON.parse($('script#__NEXT_DATA__').html());
                        const articleData = jsonData.props.pageProps.article;
                        if (articleData) {
                            views = articleData.watch_count || 0;

                            // 如果watch_count是中文数字，转换为阿拉伯数字
                            if (typeof views === 'string') {
                                views = this.chineseNumToNumber(views);
                            }
                        }
                    } catch (e) {
                        console.error('解析页面JSON数据失败:', e);
                        // 备用方案：从页面元素获取
                        const viewsText = $('div.read-count').text().trim();
                        views = this.chineseNumToNumber(viewsText.replace('次阅读', '')) || 0;
                    }

                    // 使用XPath获取点赞数
                    let likesText = '';
                    try {
                        const likesNode = document.evaluate(
                            '/html/body/div[1]/div[1]/div[2]/div/div/div/main/section/div[1]/article/div[3]/div/div/div[2]/div[2]/text()[1]',
                            document,
                            null,
                            XPathResult.FIRST_ORDERED_NODE_TYPE,
                            null
                        ).singleNodeValue;
                        likesText = likesNode ? likesNode.textContent.trim() : '';
                    } catch (e) {
                        console.error('XPath查询失败:', e);
                    }

                    // 处理点赞数文本
                    likes = this.parseCountText(likesText);

                    // 评论数
                    const commentsText = $('#comment span').eq(1).text().trim();
                    comments = parseInt(commentsText) || 0;
                }

                return {
                    url: window.location.href,
                    title: title || '未知标题',
                    author: author || '未知作者',
                    time: time || '未知时间',
                    views: views,
                    likes: likes,
                    comments: comments,
                    type: isVideo ? '视频' : (isArticle ? '文章' : '未知'),
                    collectedAt: new Date().toLocaleString()
                };
            }

            async fetchFromAPI() {
                // 可根据需要实现API请求
                return null;
            }

            updateUI(data) {
                $('#dataType').text(data.type || '-');
                $('#dataTitle').text(data.title || '-');
                $('#dataAuthor').text(data.author || '-');
                $('#dataTime').text(data.time || '-');
                $('#dataViews').text(data.views?.toLocaleString() || '0');
                $('#dataLikes').text(data.likes?.toLocaleString() || '0');
                $('#dataComments').text(data.comments?.toLocaleString() || '0');
                $('#dataUrl').text(data.url || '-');
            }

            exportCurrentData() {
                if (!this.currentData) {
                    $('#dataStatus').text('没有可导出的数据');
                    return;
                }
                this.exportToCSV([this.currentData], `懂车帝_${this.currentData.type}_${new Date().toISOString().slice(0, 10)}.csv`);
            }

            exportBatchData() {
                if (this.batchData.length === 0) {
                    $('#dataStatus').text('没有批量数据可导出');
                    return;
                }
                this.exportToCSV(this.batchData, `懂车帝批量数据_${new Date().toISOString().slice(0, 10)}.csv`);
            }

            exportToCSV(dataArray, filename) {
                const headers = ['类型', 'URL', '标题', '作者', '发布时间', '阅读数', '点赞数', '评论数', '抓取时间'];

                const csvRows = [];
                csvRows.push(headers.join(','));

                for (const data of dataArray) {
                    const values = [
                        data.type,
                        data.url,
                        `"${data.title.replace(/"/g, '""')}"`,
                        `"${data.author.replace(/"/g, '""')}"`,
                        `"${data.time}"`,
                        data.views,
                        data.likes,
                        data.comments,
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

        // 启动脚本
        const tool = new DCDTool();

        // 加载之前保存的批量数据
        tool.loadBatchProgress();
    }

    if (typeof $ === 'undefined' || typeof dayjs === 'undefined') {
        const jqueryScript = document.createElement('script');
        jqueryScript.src = 'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js';

        const dayjsScript = document.createElement('script');
        dayjsScript.src = 'https://cdn.jsdelivr.net/npm/dayjs@1.11.7/dayjs.min.js';

        document.head.appendChild(jqueryScript);
        document.head.appendChild(dayjsScript);

        let loadedCount = 0;
        function checkLoaded() {
            loadedCount++;
            if (loadedCount === 2 && typeof $ !== 'undefined' && typeof dayjs !== 'undefined') {
                initScript();
            }
        }

        jqueryScript.onload = checkLoaded;
        dayjsScript.onload = checkLoaded;
    } else {
        initScript();
    }
})();
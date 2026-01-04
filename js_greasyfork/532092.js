// ==UserScript==
// @name         JAVDB女优系列采集器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  专用于JAVDB演员页和搜索结果页的系列采集器，带文本和表格导出功能，纯数字文件名
// @match        https://javdb.com/actors/*
// @match        https://javdb.com/search?q=*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_log
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/532092/JAVDB%E5%A5%B3%E4%BC%98%E7%B3%BB%E5%88%97%E9%87%87%E9%9B%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/532092/JAVDB%E5%A5%B3%E4%BC%98%E7%B3%BB%E5%88%97%E9%87%87%E9%9B%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前页面是否为演员页或搜索结果页
    function isListPage() {
        return /^\/(actors|search)/.test(window.location.pathname);
    }

    if (!isListPage()) {
        return; // 如果不是目标页面，不执行脚本
    }

    // 配置参数
    const config = {
        baseDelay: 2000,       // 基础延迟（毫秒）
        randomDelay: 1000,     // 随机延迟范围（毫秒）
        batchSize: 2,          // 每批处理数量
        batchInterval: 4000,   // 批次间隔（毫秒）
        maxRetries: 3,         // 最大重试次数
        retryDelay: 6000,      // 重试基础延迟（毫秒）
        maxUrlDisplay: 5       // 最大显示的URL数量
    };

    // 生成纯数字文件名（基于当前日期和时间）
    function getDigitalFileName() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const second = String(now.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}${hour}${minute}${second}`;
    }

    // 添加自定义样式
    GM_addStyle(`
        #javdbSeriesPanel {
            font-family: 'Segoe UI', Arial, sans-serif;
            box-sizing: border-box;
        }
        #javdbSeriesPanel * {
            box-sizing: border-box;
        }
        #urlScrollContainer::-webkit-scrollbar {
            width: 6px;
        }
        #urlScrollContainer::-webkit-scrollbar-thumb {
            background-color: #4CAF50;
            border-radius: 3px;
        }
    `);

    // 日志记录函数
    function debugLog(message) {
        GM_log(`[JAVDB DEBUG] ${message}`);
        console.log(`[JAVDB DEBUG] ${message}`);
    }

    // 添加 UI 元素
    function addUIElements() {
        const panel = $(`
            <div id="javdbSeriesPanel" style="
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 9999;
                background: white;
                padding: 15px;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                width: 380px;
                max-height: 80vh;
                overflow-y: auto;
            ">
                <h3 style="margin:0 0 12px 0;font-size:16px;color:#333;">
                    <span style="color:#4CAF50">■</span> JAVDB女优系列采集器
                </h3>

                <div style="margin-bottom:10px;">
                    <label style="display:block;margin-bottom:5px;font-size:12px;">延迟设置(ms)</label>
                    <div style="display:flex;gap:10px;">
                        <input type="number" id="delayInput" value="${config.baseDelay}" min="1000" style="flex:1;padding:5px;">
                        <input type="number" id="randomDelayInput" value="${config.randomDelay}" min="500" style="flex:1;padding:5px;">
                    </div>
                </div>

                <div style="margin-bottom:10px;">
                    <label style="display:block;margin-bottom:5px;font-size:12px;">批量设置</label>
                    <div style="display:flex;gap:10px;">
                        <input type="number" id="batchSizeInput" value="${config.batchSize}" min="1" max="5" style="flex:1;padding:5px;" title="每批处理数量">
                        <input type="number" id="batchIntervalInput" value="${config.batchInterval}" min="1000" style="flex:1;padding:5px;" title="批次间隔时间">
                    </div>
                </div>

                <button id="checkBtn" style="
                    width: 100%;
                    padding: 10px;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    margin-bottom: 10px;
                    transition: all 0.3s;
                ">开始采集</button>

                <div id="progressContainer" style="display:none;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <div id="remainingCount" style="font-weight:bold; color:#2196F3;">剩余: 0</div>
                        <div id="speedInfo" style="font-size:12px;color:#666;"></div>
                    </div>

                    <div style="width:100%;height:10px;background:#f0f0f0;border-radius:5px;overflow:hidden;">
                        <div id="progressBarFill" style="width:0%;height:100%;background:linear-gradient(90deg,#4CAF50,#2E8B57);transition:width 0.3s;"></div>
                    </div>

                    <div id="urlScrollContainer" style="
                        margin-top: 15px;
                        border: 1px solid #eee;
                        border-radius: 4px;
                        padding: 10px;
                        background: #f9f9f9;
                        max-height: 120px;
                        overflow-y: auto;
                        font-family: monospace;
                        font-size: 12px;
                    ">
                        <div id="urlScrollContent"></div>
                    </div>

                    <div id="errorInfo" style="
                        font-size: 12px;
                        color: #ff5722;
                        margin-top: 10px;
                        font-weight: bold;
                    "></div>

                    <div id="resultsContainer" style="
                        margin-top: 15px;
                        display: none;
                        max-height: 300px;
                        overflow-y: auto;
                        border-top: 1px dashed #ddd;
                        padding-top: 10px;
                    ">
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <span style="font-weight:bold;">采集结果：</span>
                            <div>
                                <select id="exportFormat" style="margin-right:5px;">
                                    <option value="text">文本</option>
                                    <option value="table">表格</option>
                                </select>
                                <button id="copyResultsBtn" style="
                                    background: #2196F3;
                                    color: white;
                                    border: none;
                                    border-radius: 3px;
                                    padding: 2px 8px;
                                    font-size: 11px;
                                    cursor: pointer;
                                    margin-right: 5px;
                                ">复制全部</button>
                                <button id="exportResultsBtn" style="
                                    background: #673AB7;
                                    color: white;
                                    border: none;
                                    border-radius: 3px;
                                    padding: 2px 8px;
                                    font-size: 11px;
                                    cursor: pointer;
                                ">导出文件</button>
                            </div>
                        </div>
                        <div id="resultsContent" style="font-size:12px; line-height:1.5;"></div>
                    </div>
                </div>
            </div>
        `);

        $('body').append(panel);
        $('#checkBtn').click(startChecking);
    }

    let checkInProgress = false;
    let currentUrls = [];
    let urlDisplayInterval;
    let allSeriesData = [];

    // 开始采集逻辑
    function startChecking() {
        if (checkInProgress) {
            GM_notification({ title: '采集正在进行中', text: '请等待当前采集完成', timeout: 2000 });
            return;
        }

        checkInProgress = true;
        const userDelay = Math.max(parseInt($('#delayInput').val()) || config.baseDelay, 1000);
        const userRandomDelay = Math.max(parseInt($('#randomDelayInput').val()) || config.randomDelay, 500);
        const userBatchSize = Math.min(Math.max(parseInt($('#batchSizeInput').val()) || config.batchSize, 1), 5);
        const userBatchInterval = Math.max(parseInt($('#batchIntervalInput').val()) || config.batchInterval, 1000);

        const works = $('.item').toArray();
        const btn = $('#checkBtn');
        const progressContainer = $('#progressContainer');
        const remainingCount = $('#remainingCount');
        const speedInfo = $('#speedInfo');
        const progressBar = $('#progressBarFill');
        const errorInfo = $('#errorInfo');
        const urlScrollContent = $('#urlScrollContent');
        const resultsContainer = $('#resultsContainer');
        const resultsContent = $('#resultsContent');

        btn.prop('disabled', true).text('采集正在进行中...');
        progressContainer.show();
        resultsContainer.hide();
        errorInfo.text('');
        urlScrollContent.empty();
        resultsContent.empty();
        currentUrls = [];
        allSeriesData = [];

        let seriesResults = [];
        let checkedCount = 0;
        let errorCount = 0;
        let startTime = Date.now();
        let totalCount = works.length;

        startUrlDisplay();

        const processBatch = (index) => {
            if (index >= works.length) {
                finishChecking();
                return;
            }

            const batch = works.slice(index, index + userBatchSize);
            let processedInBatch = 0;

            batch.forEach((work, i) => {
                setTimeout(async () => {
                    try {
                        const remaining = totalCount - checkedCount - 1;
                        remainingCount.text(`剩余: ${remaining}`);

                        const result = await checkSeries(work, userDelay + Math.random() * userRandomDelay);
                        if (result) {
                            seriesResults.push(result.text);
                            allSeriesData.push(result.data);
                            debugLog(`成功获取: ${result.text.substring(0, 60)}...`);
                        }

                        checkedCount++;
                        updateProgress();

                        if (++processedInBatch === batch.length) {
                            setTimeout(() => processBatch(index + batch.length), userBatchInterval);
                        }
                    } catch (e) {
                        errorCount++;
                        errorInfo.html(`<span style="color:red">错误: ${errorCount} 个</span> | 最后错误: ${e.message.substring(0, 50)}`);
                        console.error('采集出错:', e);

                        if (++processedInBatch === batch.length) {
                            setTimeout(() => processBatch(index + batch.length), userBatchInterval);
                        }
                    }
                }, i * (userDelay + Math.random() * userRandomDelay));
            });
        };

        const updateProgress = () => {
            const percent = Math.round((checkedCount / works.length) * 100);
            const elapsed = (Date.now() - startTime) / 1000;
            const speed = Math.round((checkedCount / elapsed) * 60);
            const remainingTime = Math.round((works.length - checkedCount) / (checkedCount / elapsed));

            progressBar.css('width', percent + '%');
            speedInfo.text(`${speed} 个/分钟 | ${percent}% | 预计完成: ${remainingTime} 秒`);
        };

        const finishChecking = () => {
            clearInterval(urlDisplayInterval);
            checkInProgress = false;

            btn.prop('disabled', false).text('重新采集');
            remainingCount.text(`完成! 共 ${seriesResults.length} 个系列`);

            const uniqueUrls = new Set();
            const processedResults = [];
            seriesResults.forEach(result => {
                const lines = result.split('\n');
                const nameLine = lines[0].replace('系列: ', '').trim();
                const urlLine = lines[1].replace('链接: ', '').trim();
                if (!uniqueUrls.has(urlLine)) {
                    uniqueUrls.add(urlLine);
                    processedResults.push(`系列: ${nameLine}\n链接: ${urlLine}`);
                }
            });
            seriesResults = processedResults;

            if (seriesResults.length > 0) {
                seriesResults.sort((a, b) => a.localeCompare(b, 'zh'));
                resultsContainer.show();
                const formattedResults = seriesResults.map((result, index) => {
                    return `<div style="margin-bottom:8px;">${index + 1}. ${result}</div>`;
                }).join('');
                resultsContent.html(formattedResults);

                $('#copyResultsBtn').click(function() {
                    const resultText = seriesResults.map((result, index) => `${index + 1}. ${result}`).join('\n\n');
                    GM_setClipboard(resultText, 'text');
                    GM_notification({ title: '已复制到剪贴板', text: `共复制 ${seriesResults.length} 个系列`, timeout: 2000 });
                });

                $('#exportResultsBtn').click(function() {
                    const format = $('#exportFormat').val();
                    const digitalFileName = getDigitalFileName();
                    let resultText;
                    if (format === 'text') {
                        resultText = seriesResults.map((result, index) => `${index + 1}. 系列: ${result.split('\n')[0].replace('系列: ', '')}\n   链接: ${result.split('\n')[1].replace('链接: ', '')}`).join('\n\n');
                    } else if (format === 'table') {
                        resultText = '序号,系列名称,链接\n' + seriesResults.map((result, index) => {
                            const [nameLine, urlLine] = result.split('\n');
                            const name = nameLine.replace('系列: ', '');
                            const url = urlLine.replace('链接: ', '');
                            return `${index + 1},${name},${url}`;
                        }).join('\n');
                    }
                    const blob = new Blob([resultText], { type: format === 'text' ? 'text/plain' : 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${digitalFileName}.${format === 'text' ? 'txt' : 'csv'}`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    GM_notification({ title: '已导出文件', text: `共导出 ${seriesResults.length} 个系列数据`, timeout: 2000 });
                });
            }

            GM_notification({
                title: '采集完成',
                text: `共找到 ${seriesResults.length} 个系列 | 错误: ${errorCount}`,
                timeout: 5000,
                highlight: true
            });
        };

        function startUrlDisplay() {
            urlDisplayInterval = setInterval(() => {
                if (currentUrls.length > 0) {
                    const displayUrls = currentUrls.slice(-config.maxUrlDisplay);
                    urlScrollContent.html(
                        displayUrls.map(url => `<div style="margin-bottom:3px;color:#555;word-break:break-all;">▶ ${url}</div>`).join('')
                    );
                    $('#urlScrollContainer').scrollTop($('#urlScrollContainer')[0].scrollHeight);
                }
            }, 500);
        }

        processBatch(0);
    }

    // 检查系列信息
    async function checkSeries(workElement, delay) {
        const $work = $(workElement);
        const title = $work.find('.video-title').text().trim() || '未知标题';
        const code = $work.find('.uid').text().trim() || '未知编码';
        const pageUrl = 'https://javdb.com' + $work.find('a').attr('href');
        debugLog(`采集: ${title} (${code}) - ${pageUrl}`);

        if (!pageUrl || !pageUrl.includes('/v/')) {
            debugLog(`无效的作品链接: ${title} (${code})`);
            return null;
        }

        currentUrls.push(pageUrl);

        return new Promise((resolve) => {
            let retries = 0;

            const makeRequest = () => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: pageUrl,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                        "Accept-Encoding": "gzip, deflate, br",
                        "Cache-Control": "no-cache",
                        "Pragma": "no-cache",
                        "Referer": "https://javdb.com/"
                    },
                    timeout: 30000,
                    onload: function(response) {
                        try {
                            if (response.status !== 200) {
                                throw new Error(`HTTP状态码: ${response.status}`);
                            }

                            const doc = new DOMParser().parseFromString(response.responseText, "text/html");
                            const $doc = $(doc);
                            const seriesInfo = extractSeriesInfo($doc, pageUrl);

                            if (seriesInfo) {
                                const resultText = `系列: ${seriesInfo.name}\n链接: ${seriesInfo.url}`;
                                const resultData = { seriesName: seriesInfo.name, seriesUrl: seriesInfo.url };
                                resolve({ text: resultText, data: resultData });
                            } else {
                                debugLog(`未找到系列信息: ${title} (${code})`);
                                resolve(null);
                            }
                        } catch (e) {
                            debugLog(`解析错误: ${e.message} (${code})`);
                            if (retries < config.maxRetries) {
                                retries++;
                                debugLog(`重试 ${retries}/${config.maxRetries}: ${code}`);
                                setTimeout(makeRequest, config.retryDelay * (retries + 1));
                            } else {
                                resolve(null);
                            }
                        }
                    },
                    onerror: function(error) {
                        debugLog(`请求错误: ${error} (${code})`);
                        if (retries < config.maxRetries) {
                            retries++;
                            debugLog(`重试 ${retries}/${config.maxRetries}: ${code}`);
                            setTimeout(makeRequest, config.retryDelay * (retries + 1));
                        } else {
                            resolve(null);
                        }
                    },
                    ontimeout: function() {
                        debugLog(`请求超时: ${code}`);
                        if (retries < config.maxRetries) {
                            retries++;
                            debugLog(`重试 ${retries}/${config.maxRetries}: ${code}`);
                            setTimeout(makeRequest, config.retryDelay * (retries + 1));
                        } else {
                            resolve(null);
                        }
                    }
                });
            };

            setTimeout(makeRequest, delay);
        });
    }

    // 提取系列信息
    function extractSeriesInfo($doc, pageUrl) {
        const seriesPanel = $doc.find('.panel-block').filter(function() {
            return $(this).find('strong').text().trim() === '系列:';
        });

        if (seriesPanel.length > 0) {
            const seriesLink = seriesPanel.find('.value a');
            if (seriesLink.length > 0) {
                const seriesName = seriesLink.text().trim();
                const seriesUrl = 'https://javdb.com' + seriesLink.attr('href');
                return { name: seriesName, url: seriesUrl };
            }
        }
        return null;
    }

    // 初始化脚本
    $(function() {
        if (isListPage()) {
            setTimeout(addUIElements, 1500);
        }
    });
})();
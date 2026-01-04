// ==UserScript==
// @name         AI股票分析助手
// @namespace    http://tampermonkey.net/
// @license      GPL
// @version      3.5
// @description  使用AI服务进行股票分析，增加历史记录和设置界面
// @author       NULLUSER
// @match        https://quote.eastmoney.com/*
// @require      https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand

// @downloadURL https://update.greasyfork.org/scripts/528760/AI%E8%82%A1%E7%A5%A8%E5%88%86%E6%9E%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/528760/AI%E8%82%A1%E7%A5%A8%E5%88%86%E6%9E%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---------------------  CONFIGURATION  ---------------------

    // Deno 服务地址
    const DENO_SERVER_URL = 'https://works.shatang.me'; // 替换为你的 Deno 服务地址
    const S_version = GM_info.script.version;

    // 功能 Work ID
    let ANALYSIS_WORK_ID = GM_getValue('ANALYSIS_WORK_ID', '02');; // 初始化的ID

    // 样式常量
    const CONTAINER_WIDTH = '350px';
    const MAX_CONTAINER_HEIGHT_PERCENT = 0.8;
    const BORDER_RADIUS = '10px';
    const FONT_FAMILY = 'Arial, sans-serif';
    const BOX_SHADOW = '0 5px 15px rgba(0, 0, 0, 0.2)';
    const BUTTON_TOP_RIGHT_MARGIN = '40px';
    const CONTAINER_RIGHT_MARGIN = '40px';
    const CONTAINER_TOP_OFFSET = '10px';
    const SECTION_MARGIN_BOTTOM = '15px';
    const HEADING_COLOR = '#CBD5E1';
    const TEXT_COLOR = '#94A3B8';

    // 历史数据存储数量
    const HISTORY_DATA_COUNT = 10;

    // ---------------------  STATE MANAGEMENT  ---------------------

    // 默认API KEY和 MODEL (从 GM_getValue 读取)
    let GEMINI_API_KEY = GM_getValue('GEMINI_API_KEY', '');
    let GEMINI_MODEL = GM_getValue('GEMINI_MODEL', '');
    let SHOW_URL = ''; // 用于存储从 /query 获取的 showurl, 用于显示
    let analysisContainer; // 在全局作用域中定义 analysisContainer

    // ---------------------  STYLING (CSS-in-JS)  ---------------------
    // 预先创建样式字符串 (提高性能)
    const styleString = `
        /* 全局样式 */
        body { font-family: ${FONT_FAMILY}; }

        #analysis-container {
            position: fixed;
            top: calc(${BUTTON_TOP_RIGHT_MARGIN} + ${CONTAINER_TOP_OFFSET} + 40px);
            right: ${CONTAINER_RIGHT_MARGIN};
            width: ${CONTAINER_WIDTH};
            max-height: ${window.innerHeight * MAX_CONTAINER_HEIGHT_PERCENT}px;
            background-color: rgba(30, 41, 59, 0.9);
            color: ${TEXT_COLOR};
            z-index: 1000;
            padding: 20px;
            overflow-y: auto;
            word-wrap: break-word;
            word-break: break-all;
            box-shadow: ${BOX_SHADOW};
            border-radius: ${BORDER_RADIUS};
            transition: all 0.3s ease;
            scrollbar-width: thin;
            scrollbar-color: #4F46E5 #1E293B;
        }

        #analysis-container::-webkit-scrollbar { width: 8px; }
        #analysis-container::-webkit-scrollbar-track { background: #1E293B; }
        #analysis-container::-webkit-scrollbar-thumb {
            background-color: #4F46E5;
            border-radius: 4px;
            border: 1px solid #1E293B;
        }
        #analysis-container:hover { box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3); }

        #analysis-button {
            position: fixed;
            top: ${BUTTON_TOP_RIGHT_MARGIN};
            right: ${BUTTON_TOP_RIGHT_MARGIN};
            z-index: 1001;
            background-color: #4F46E5;
            border: none;
            color: white;
            padding: 12px 24px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            cursor: pointer;
            border-radius: ${BORDER_RADIUS};
            box-shadow: ${BOX_SHADOW};
            transition: background-color 0.3s ease;
        }
        #analysis-button:hover { background-color: #6366F1; }
        #analysis-container.hidden { display: none; }

        #analysis-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            color: #94A3B8;
        }
        #analysis-header button {
            background-color: transparent;
            border: none;
            color: #94A3B8;
            cursor: pointer;
            font-size: 1.2em;
            transition: color 0.3s ease;
        }
        #analysis-header button:hover { color: #CBD5E1; }

        #analysis-container h2 {
            color: ${HEADING_COLOR};
            border-bottom: 2px solid #475569;
            padding-bottom: 8px;
            margin-top: 1.2em;
            margin-bottom: 0.6em;
            font-size: 1.4em;
        }
        #analysis-container h3 {
            color: ${HEADING_COLOR};
            margin-top: 1em;
            margin-bottom: 0.5em;
            font-size: 1.2em;
        }

        #analysis-container p {
            line-height: 1.7;
            margin-bottom: ${SECTION_MARGIN_BOTTOM};
        }
        #analysis-container ul {
            list-style-type: square;
            padding-left: 20px;
            margin-bottom: ${SECTION_MARGIN_BOTTOM};
        }
        #analysis-container li {
            line-height: 1.6;
            margin-bottom: 5px;
        }
        #analysis-container hr {
            border: none;
            border-top: 1px solid #475569;
            margin: 20px 0;
        }

        #analysis-container a {
            color: #6366F1;
            text-decoration: none;
            word-wrap: break-word;
            word-break: break-all;
        }
        #analysis-container a:hover { text-decoration: underline; }

        #analysis-container pre {
            background-color: #1E293B;
            color: #F8FAFC;
            padding: 12px;
            border-radius: ${BORDER_RADIUS};
            word-wrap: break-word;
            white-space: pre-wrap;
            overflow-x: auto;
            font-size: 0.9em;
            margin-bottom: ${SECTION_MARGIN_BOTTOM};
        }
        #analysis-container table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: ${SECTION_MARGIN_BOTTOM};
        }
        #analysis-container th, #analysis-container td {
            border: 1px solid #475569;
            padding: 8px;
            text-align: left;
        }
        #analysis-container th {
            background-color: #334155;
            color: ${HEADING_COLOR};
        }
        #analysis-container code { font-family: monospace; }

        #analysis-container.loading {
            text-align: center;
            font-style: italic;
            color: #64748B;
        }

        .info-box {
            background-color: #1E3A8A;
            color: #E0F2FE;
            padding: 10px 15px;
            border-radius: ${BORDER_RADIUS};
            margin-bottom: ${SECTION_MARGIN_BOTTOM};
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .highlight {
            color: #A78BFA;
            font-weight: bold;
        }

        /* 下拉菜单样式 */
        #history-select {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #4A5568;
            border-radius: ${BORDER_RADIUS};
            background-color: #1E293B;
            color: #CBD5E1;
            font-size: 14px;
            cursor: pointer;
            outline: none;
            transition: border-color 0.3s ease;
        }

        #history-select:focus {
            border-color: #6366F1;
            box-shadow: 0 0 5px rgba(79, 70, 229, 0.5);
        }

        /* 选项样式 */
        #history-select option {
            background-color: #1E293B;
            color: #CBD5E1;
        }

        /* 设置界面样式 */
        #settings-container {
            padding: 20px;
        }

        #settings-container label {
            display: block;
            margin-bottom: 5px;
            color: ${HEADING_COLOR};
        }

        #settings-container input[type="text"] {
            width: 100%;
            padding: 8px;
            margin-bottom: 15px;
            border: 1px solid #4A5568;
            border-radius: ${BORDER_RADIUS};
            background-color: #1E293B;
            color: #CBD5E1;
            font-size: 14px;
            outline: none;
            transition: border-color 0.3s ease;
        }

        #settings-container input[type="text"]:focus {
            border-color: #6366F1;
            box-shadow: 0 0 5px rgba(79, 70, 229, 0.5);
        }

        #settings-container button {
            background-color: #4F46E5;
            border: none;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            cursor: pointer;
            border-radius: ${BORDER_RADIUS};
            box-shadow: ${BOX_SHADOW};
            transition: background-color 0.3s ease;
        }

        #settings-container button:hover {
            background-color: #6366F1;
        }
    `;

    GM_addStyle(styleString);

    // ---------------------  HELPER FUNCTIONS  ---------------------

    // 安全的 JSON 解析函数
    function safeJsonParse(str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.error("JSON 解析错误:", e, "原始字符串:", str);
            return null;
        }
    }

    //  从 Deno 服务获取showurl
    async function fetchShowUrl(workId) {
        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `${DENO_SERVER_URL}/query?id=${workId}`,
                    onload: resolve,
                    onerror: reject,
                });
            });

            if (response.status === 200) {
                const data = safeJsonParse(response.responseText);
                if (data?.showurl) {
                    SHOW_URL = data.showurl;
                    console.log("SHOW_URL 获取成功:", SHOW_URL);
                } else {
                    throw new Error(`Deno server 返回无效数据: ${response.responseText}`);
                }
            } else {
                throw new Error(`Deno server 查询失败: ${response.status} ${response.responseText}`);
            }
        } catch (error) {
            console.error("获取 SHOW_URL 失败:", error);
            analysisContainer.innerHTML = `<p style="color: red;">初始化出错：${error.message}</p>`;  //直接在UI显示
            throw error; // Re-throw the error to be caught by the caller
        }
    }

    // 分析 HTML 并发送到 Deno 服务
    async function analyzeHTML(htmlContent) {
        analysisContainer.classList.add('loading');
        analysisContainer.innerHTML = '分析中，请稍候...';

        if (!GEMINI_API_KEY || !GEMINI_MODEL) {
            analysisContainer.innerHTML = `<p style="color: red;">请先设置 ${SHOW_URL} API key 和 Model.  <a href="${SHOW_URL}" target="_blank">获取地址</a></p>`;
            analysisContainer.classList.remove('loading');
            return;
        }

        let stockCode = getStockCode();
        const historyData = getHistoryData(stockCode);

        // 构造 Prompt，包含历史数据
        let fullPrompt = `\n\n用户选定的历史分析数据:\n${JSON.stringify(historyData)}`;

        fullPrompt += `\n\n当前页面HTML内容:\n${htmlContent}`;

        const payload = {
            modelName: GEMINI_MODEL,
            modelKey: GEMINI_API_KEY,
            promptId: ANALYSIS_WORK_ID,
            userData: fullPrompt
        };

        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: `${DENO_SERVER_URL}/api`,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(payload),
                    onload: resolve,
                    onerror: reject,
                });
            });

            if (response.status === 200) {
                const outerResult = safeJsonParse(response.responseText);
                console.log("Outer Result:", outerResult);

                if (outerResult && outerResult.choices && outerResult.choices[0] && outerResult.choices[0].message && outerResult.choices[0].message.content) {
                    let innerJsonString = outerResult.choices[0].message.content;
                    console.log("Inner JSON String (raw):", innerJsonString);

                    innerJsonString = innerJsonString.replace(/```jsons*|```/g, '').trim();
                    console.log("Inner JSON String (cleaned):", innerJsonString);

                    const analysisResult = safeJsonParse(innerJsonString);

                    if (analysisResult) {
                        console.log("Parsed Analysis Result:", analysisResult);
                        analysisContainer.innerHTML = '';
                        displayAnalysis(analysisResult);
                        saveAnalysis(analysisResult);  // 保存分析结果
                        loadHistoryData(); // 刷新历史记录
                    } else {
                        analysisContainer.innerHTML = '<p style="color: red;">分析结果JSON解析失败。</p>';
                    }
                } else {
                    analysisContainer.innerHTML = '<p style="color: red;">分析结果格式不正确 (缺少 choices[0].message.content)。</p>';
                    console.error("Incorrect response format. Missing expected fields.");
                }
            } else {
                analysisContainer.innerHTML = `<p style="color: red;">分析失败: ${response.status} - ${response.statusText}.  请检查API密钥、网络和 Deno 服务。</p>`;
                console.error("Deno Server Error:", response.status, response.statusText, response.responseText);
            }

        } catch (error) {
            analysisContainer.classList.remove('loading');
            analysisContainer.innerHTML = `<p style="color: red;">分析失败， 网络错误: ${error.message}. 请检查Deno服务是否可以正常访问。 SHOW_URL：<a href="${SHOW_URL}" target="_blank">服务地址</a></p>`;
            console.error("analyzeHTML error:", error, error.message);
        } finally {
            analysisContainer.classList.remove('loading');
        }
    }

    // 显示分析结果的函数
    function displayAnalysis(analysisResult) {
        try {
            const {
                "股票名称": stockName,
                "股票代码": stockCode,
                "研判日期": analysisDate,
                "短期走势预测": shortTermPrediction,
                "中期走势预测": mediumTermPrediction,
                "操作建议": operationSuggestion,
                "风险提示": risks,
                "思考过程": thoughtProcess  //  思考过程
            } = analysisResult || {};

            const htmlContent = `
                <div style="word-break: break-word;">
                    <h2>${stockName || 'N/A'} (${stockCode || 'N/A'})</h2>
                    <p><strong>研判日期:</strong> ${analysisDate || 'N/A'}</p>
                    <hr>

                    <h3>短期走势预测</h3>
                    <p><strong>预测:</strong> <span class="highlight">${shortTermPrediction?.预测 || 'N/A'}</span>
                    <strong>幅度:</strong> <span class="highlight">${shortTermPrediction?.幅度 || 'N/A'}</span></p>
                    <p><strong>理由:</strong> ${shortTermPrediction?.理由 || 'N/A'}</p>
                    <hr>

                    <h3>中期走势预测</h3>
                    <p><strong>预测:</strong> <span class="highlight">${mediumTermPrediction?.预测 || 'N/A'}</span>
                    <strong>幅度区间:</strong> <span class="highlight">${mediumTermPrediction?.幅度区间 || 'N/A'}</span></p>
                    <p><strong>理由:</strong> ${mediumTermPrediction?.理由 || 'N/A'}</p>
                    <hr>

                    <h3>操作建议</h3>
                    <p><strong>建议:</strong> <span class="highlight">${operationSuggestion?.建议 || 'N/A'}</span></p>
                    <p><strong>理由:</strong> ${operationSuggestion?.理由 || 'N/A'}</p>
                    <hr>
                    <h3>思考过程</h3>
                    <p>${thoughtProcess || 'N/A'}</p>
                    <hr>
                    <h3>风险提示</h3>
                    <ul>
                        ${(risks || []).map(item => `<li>${item || 'N/A'}</li>`).join('')}
                    </ul>
                    <hr>
                    <p style="text-align: right; font-size: 0.8em;">Powered By 【${GEMINI_MODEL}】 脚本版本：${S_version}</p>
                </div>
            `;
            // 获取或创建显示历史信息的容器
            let displayArea = document.getElementById('analysis-display-area');
            if (!displayArea) {
                displayArea = document.createElement('div');
                displayArea.id = 'analysis-display-area';
                analysisContainer.appendChild(displayArea); // 添加到容器中
            }

            displayArea.innerHTML = htmlContent; // 只更新显示区域的内容
        } catch (error) {
            console.error("displayAnalysis error:", error);
            analysisContainer.innerHTML = `<p style="color: red;">显示分析结果时出错: ${error.message}</p>`;
        }
    }

   // 保存分析结果到本地
    function saveAnalysis(analysisResult) {
        let stockCode = getStockCode();
        if (!stockCode) return;  // 股票代码不存在，则不保存

        let history = getHistoryData(stockCode) || [];
        history.unshift(analysisResult); // 添加到数组开头

        if (history.length > HISTORY_DATA_COUNT) {
            history = history.slice(0, HISTORY_DATA_COUNT); // 保持数组长度不超过 HISTORY_DATA_COUNT
        }

        GM_setValue(`stock_history_${stockCode}`, JSON.stringify(history));
    }

    // 从本地获取历史数据
    function getHistoryData(stockCode) {
        if (!stockCode) return null; // 股票代码不存在，则不加载

        const historyString = GM_getValue(`stock_history_${stockCode}`, null);
        return historyString ? JSON.parse(historyString) : null;
    }

    // 加载历史数据到下拉菜单
    function loadHistoryData() {
        let stockCode = getStockCode();
        if (!stockCode) {
           //股票代码不存在不进行处理，保持html内容。
           return;
        }

        const historyData = getHistoryData(stockCode);

        // 获取或创建下拉菜单
        let historySelect = document.querySelector('#history-select');
        if (!historySelect) {
            historySelect = document.createElement('select');
            historySelect.id = 'history-select';
            historySelect.style.width = '100%'; // 设置宽度
            historySelect.style.marginBottom = '10px'; // 增加底部间距
            analysisContainer.appendChild(historySelect); // 添加到容器中
        }

        historySelect.innerHTML = ''; // 清空选项
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '查看历史记录';
        historySelect.appendChild(defaultOption);

        if (historyData && historyData.length > 0) {
            historyData.forEach((item, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${item["研判日期"]} - ${item["股票名称"]} - ${item["操作建议"]?.["建议"]}`;
                historySelect.appendChild(option);
            });
        }

        historySelect.addEventListener('change', () => {
            const selectedIndex = historySelect.value;
            if (selectedIndex !== '') {
                displayAnalysis(historyData[selectedIndex]); // 显示所选历史记录详情
            } else {
                // 如果选择 "查看历史记录" 选项，则清空显示区域
                let displayArea = document.getElementById('analysis-display-area');
                if (displayArea) {
                   displayArea.innerHTML = '';
                }
            }
        });
    }


    // 获取股票代码函数
    function getStockCode() {
        const url = window.location.href;
        let match = url.match(/(hk\/)?([a-zA-Z]{2})?(\d{5,6})/);
        let stockCode = null;

        if (match) {
            stockCode = match[3];
            const exchangeCode = match[2] || '';

            if (exchangeCode) {
                stockCode = stockCode + exchangeCode;
            }
        } else {
            match = url.match(/qihuo\/([a-zA-Z0-9]+)\.html/);
            if (match) {
                stockCode = match[1];
            }
        }

        return stockCode;
    }

    // 初始化设置界面
    function initializeSettings() {
        analysisContainer.innerHTML = ''; // Clear the analysis container

        const settingsContainer = document.createElement('div');
        settingsContainer.id = 'settings-container';
        analysisContainer.appendChild(settingsContainer);

        // API Key 输入框
        const apiKeyLabel = document.createElement('label');
        apiKeyLabel.textContent = `${SHOW_URL} API Key:`;
        settingsContainer.appendChild(apiKeyLabel);

        const apiKeyInput = document.createElement('input');
        apiKeyInput.type = 'text';
        apiKeyInput.value = GEMINI_API_KEY;
        settingsContainer.appendChild(apiKeyInput);

        // Model 名称输入框
        const modelLabel = document.createElement('label');
        modelLabel.textContent = `${SHOW_URL} Model Name:`;
        settingsContainer.appendChild(modelLabel);

        const modelInput = document.createElement('input');
        modelInput.type = 'text';
        modelInput.value = GEMINI_MODEL;
        settingsContainer.appendChild(modelInput);

        // work id 名称输入框
        const workidLabel = document.createElement('label');
        workidLabel.textContent = `WORK ID（详见：${DENO_SERVER_URL}）:`;
        settingsContainer.appendChild(workidLabel);

        const workidInput = document.createElement('input');
        workidInput.type = 'text';
        workidInput.value = ANALYSIS_WORK_ID;
        settingsContainer.appendChild(workidInput);


        // 保存按钮
        const saveButton = document.createElement('button');
        saveButton.textContent = '保存设置';
        settingsContainer.appendChild(saveButton);

        saveButton.addEventListener('click', async () => {
            async function setValueWithPromise(key, value) {
                return new Promise((resolve, reject) => {
                    GM_setValue(key, value);
                    resolve(); // GM_setValue 没有错误回调，直接 resolve
                });
            }

            const newApiKey = apiKeyInput.value.trim();
            const newModel = modelInput.value.trim();
            const newWrokId = workidInput.value.trim();

            if (newApiKey !== "" && newModel !== "" && newWrokId !== "") {
                await setValueWithPromise('GEMINI_API_KEY', newApiKey); // 等待 setValue 完成
                GEMINI_API_KEY = newApiKey; // 更新全局变量
                await setValueWithPromise('GEMINI_MODEL', newModel); // 等待 setValue 完成
                GEMINI_MODEL = newModel; // 更新全局变量
                await setValueWithPromise('ANALYSIS_WORK_ID', newWrokId); // 等待 setValue 完成
                ANALYSIS_WORK_ID = newWrokId; // 更新全局变量

                analysisContainer.innerHTML = '<p style="color: green;">设置已保存，脚本正在重新初始化...</p>';
                //  代码
                (async () => {
                    // 重新初始化分析容器
                    analysisContainer.innerHTML = '<p style="text-align: center; font-size: 15px; color: white;">正在重新初始化...</p>';

                    try {
                        await fetchShowUrl(ANALYSIS_WORK_ID);
                        let stockCode = getStockCode(); // 确保 getStockCode() 存在且能正确获取股票代码

                        if (stockCode) {
                            analysisContainer.innerHTML ='';
                            loadHistoryData(); // 创建并加载历史数据下拉菜单
                            let displayArea = document.getElementById('analysis-display-area');
                            if (!displayArea) {
                                displayArea = document.createElement('div');
                                displayArea.id = 'analysis-display-area';
                                analysisContainer.appendChild(displayArea); // 保证存在
                            }
                            displayArea.innerHTML = '<p style="text-align: center; font-size: 15px; color: white;">点击上方按钮，AI帮您分析当前行情 ↑</p>';
                        } else {
                            analysisContainer.innerHTML = '<p style="color: orange;">请在股票页面使用此脚本，以便获取历史分析记录。</p>';
                        }

                    } catch (error) {
                        analysisContainer.innerHTML = `<p style="color: red;">重新初始化出错，请检查控制台</p>`;
                    }
                })();

            } else {
                analysisContainer.innerHTML = '<p style="color: red;">API 密钥和模型名称不能为空。</p>';
            }
        });
    }

    // ---------------------  INITIALIZATION  ---------------------

    (function() {
        if (window.self !== window.top) {
            console.log("脚本在 iframe 中运行，已阻止初始化。");
            return;
        }

        if (window.hasEastMoneyAnalysisAssistant) {
            console.log("脚本已经初始化过了，已阻止重复初始化。");
            return;
        }
        window.hasEastMoneyAnalysisAssistant = true;

        console.log("脚本开始初始化...");

        (async function initialize() {
            analysisContainer = document.createElement('div');
            analysisContainer.id = 'analysis-container';

            document.body.appendChild(analysisContainer);

            const analysisButton = document.createElement('button');
            analysisButton.id = 'analysis-button';
            analysisButton.textContent = 'AI行情分析助手';
            document.body.appendChild(analysisButton);

            analysisButton.addEventListener('click', () => {
                analysisContainer.classList.remove('hidden');
                analyzeHTML(document.body.innerHTML);
            });

            try {
                await fetchShowUrl(ANALYSIS_WORK_ID);
                let stockCode = getStockCode();

                if (stockCode) {
                    //如果存在股票代码，加载历史数据并显示初始化信息
                    loadHistoryData();
                    let displayArea = document.getElementById('analysis-display-area');
                    if (!displayArea) {
                        displayArea = document.createElement('div');
                        displayArea.id = 'analysis-display-area';
                        analysisContainer.appendChild(displayArea); //保证存在
                    }
                     displayArea.innerHTML = '<p style="text-align: center; font-size: 15px; color: white;">点击上方按钮，AI帮您分析当前行情 ↑</p>';
                } else {
                    //如果不存在股票代码，显示提示信息
                    analysisContainer.innerHTML = '<p style="color: orange;">请在股票页面使用此脚本，以便获取历史分析记录。</p>';
                }
            } catch (error) {
                analysisContainer.innerHTML = `<p style="color: red;">初始化出错，请检查控制台</p>`;
            }
        })();

        GM_registerMenuCommand("设置API密钥和模型", () => {
            initializeSettings();
        });
    })();

    console.log("脚本初始化完成。");
})();
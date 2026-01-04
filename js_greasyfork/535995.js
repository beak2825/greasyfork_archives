// ==UserScript==
// @name         工信部官网miit ICP备案批量查询小工具
// @namespace    https://beian.miit.gov.cn
// @version      0.6
// @description  工业和信息化部政务服务平台，批量获取公司备案信息，手动查询一次公司名称后，批量获取该公司名下所有网站、APP、小程序、快应用备案内容，一键复制结果
// @match        *://beian.miit.gov.cn/*
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @run-at       document-start
// @author       ejfkdev and Gemini 2.5 pro
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535995/%E5%B7%A5%E4%BF%A1%E9%83%A8%E5%AE%98%E7%BD%91miit%20ICP%E5%A4%87%E6%A1%88%E6%89%B9%E9%87%8F%E6%9F%A5%E8%AF%A2%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/535995/%E5%B7%A5%E4%BF%A1%E9%83%A8%E5%AE%98%E7%BD%91miit%20ICP%E5%A4%87%E6%A1%88%E6%89%B9%E9%87%8F%E6%9F%A5%E8%AF%A2%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_API_URL = 'https://hlwicpfwc.miit.gov.cn/icpproject_query/api/icpAbbreviateInfo/queryByCondition';
    const UI_WRAPPER_ID = 'miit-userscript-ui-wrapper-v06'; // Version update in ID
    const FETCH_BUTTON_ID = 'miit-fetch-data-button-v06';
    const PROGRESS_DIV_ID = 'miit-progress-div-v06';
    const TEXTAREAS_TABLE_ID = 'miit-textareas-table-v06';
    const UNIT_NAME_INPUT_SELECTOR = 'input.el-input__inner';

    const TEXTAREA_CONFIG = [
        { id: 'miit-ta-website-v06', labelText: '网站', serviceType: 1, dataField: 'domain', countSpanId: 'miit-count-website-v06', copyButtonId: 'miit-copy-website-v06' },
        { id: 'miit-ta-app-v06', labelText: 'APP', serviceType: 6, dataField: 'serviceName', countSpanId: 'miit-count-app-v06', copyButtonId: 'miit-copy-app-v06' },
        { id: 'miit-ta-mini_program-v06', labelText: '小程序', serviceType: 7, dataField: 'serviceName', countSpanId: 'miit-count-mini_program-v06', copyButtonId: 'miit-copy-mini_program-v06' },
        { id: 'miit-ta-quick_app-v06', labelText: '快应用', serviceType: 8, dataField: 'serviceName', countSpanId: 'miit-count-quick_app-v06', copyButtonId: 'miit-copy-quick_app-v06' }
    ];
    const REQUIRED_MONITORED_HEADERS = ['sign', 'token', 'uuid'];

    let monitoredRequestData = { sign: null, token: null, uuid: null };
    let uiInjected = false;
    let isFetchingAllData = false;

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function headersToObject(headersSource) {
        const obj = {};
        if (headersSource instanceof Headers) {
            headersSource.forEach((value, key) => { obj[key.toLowerCase()] = value; });
        } else if (Array.isArray(headersSource)) {
            headersSource.forEach(([key, value]) => { obj[key.toLowerCase()] = value; });
        } else if (typeof headersSource === 'object' && headersSource !== null) {
            for (const key in headersSource) {
                obj[key.toLowerCase()] = headersSource[key];
            }
        }
        return obj;
    }

    async function fetchDataForServiceType(serviceConfig, unitName, baseApiHeaders, progressDivElement, textareaElement, labelCountSpanElement) {
        const collectedItems = new Set();
        let currentPage = 1;
        let totalPages = 1;
        const pageSize = "40";

        textareaElement.value = "";
        if (labelCountSpanElement) labelCountSpanElement.textContent = " (0)";

        progressDivElement.textContent = `进度: 即将开始获取 ${serviceConfig.labelText} 数据...`;

        while (currentPage <= totalPages && isFetchingAllData) {
            const payloadForPage = {
                pageNum: String(currentPage),
                pageSize: pageSize,
                unitName: unitName,
                serviceType: serviceConfig.serviceType
            };
            const currentHeaders = { ...baseApiHeaders,
                'sign': monitoredRequestData.sign,
                'token': monitoredRequestData.token,
                'uuid': monitoredRequestData.uuid,
                'content-type': 'application/json'
            };
             const browserControlledHeaders = ['host', 'connection', 'content-length', 'cookie'];
             Object.keys(currentHeaders).forEach(key => {
                const lowerKey = key.toLowerCase();
                if (browserControlledHeaders.includes(lowerKey) ||
                    (lowerKey.startsWith('sec-') && !['sec-ch-ua', 'sec-ch-ua-mobile', 'sec-ch-ua-platform', 'sec-fetch-dest', 'sec-fetch-mode', 'sec-fetch-site', 'sec-gpc'].includes(lowerKey) )) {
                    if (!['user-agent', 'origin', 'referer'].includes(lowerKey) || !baseApiHeaders[lowerKey]) {
                         delete currentHeaders[key];
                    }
                }
            });

            progressDivElement.textContent = `进度: 正在获取 ${serviceConfig.labelText} 数据 (第 ${currentPage}${totalPages > 1 && currentPage > 1 ? '/'+totalPages : ''} 页)...`;
            console.log(`[MIIT Helper] Fetching ${serviceConfig.labelText} - Page ${currentPage} - Payload:`, payloadForPage);

            try {
                const response = await unsafeWindow.fetch(TARGET_API_URL, {
                    method: 'POST',
                    headers: currentHeaders,
                    body: JSON.stringify(payloadForPage),
                    mode: 'cors',
                    credentials: 'include',
                    referrer: currentHeaders['referer'] || 'https://beian.miit.gov.cn/',
                    referrerPolicy: 'strict-origin-when-cross-origin'
                });

                if (!response.ok) {
                    let errorText = `HTTP错误! 状态: ${response.status} ${response.statusText}`;
                    try { const errorData = await response.text(); errorText += `, 响应: ${errorData.substring(0,200)}`; } catch (e) {}
                    throw new Error(errorText);
                }
                const responseData = await response.json();

                if (responseData.success && responseData.code === 200) {
                    const params = responseData.params || {};
                    if (currentPage === 1) {
                        totalPages = parseInt(params.pages, 10) || 1;
                        console.log(`[MIIT Helper] ${serviceConfig.labelText} - 总页数: ${totalPages}`);
                        if (totalPages === 0 && params.list && params.list.length > 0) totalPages = 1;
                        if (totalPages === 0 || (!params.list || params.list.length === 0 && totalPages <=1) ) {
                            if (params.list && params.list.length > 0) { /* continue */ } else {
                                progressDivElement.textContent = `进度: ${serviceConfig.labelText} - 服务器报告0页或无数据。`;
                                if ((!params.list || params.list.length === 0)) break;
                            }
                        }
                    }

                    const itemListOnPage = params.list || [];
                    let pageItemsCount = 0;
                    for (const item of itemListOnPage) {
                        const valueToCollect = item[serviceConfig.dataField];
                        if (valueToCollect) {
                            collectedItems.add(valueToCollect);
                            pageItemsCount++;
                        }
                    }
                    console.log(`[MIIT Helper] 从第 ${currentPage} 页 (${serviceConfig.labelText}) 提取到 ${pageItemsCount} 个条目。`);

                    textareaElement.value = Array.from(collectedItems).sort().join('\n');
                    if (labelCountSpanElement) labelCountSpanElement.textContent = ` (${collectedItems.size})`;

                    if (currentPage >= totalPages) break;
                    currentPage++;
                } else {
                    const errMsg = `[MIIT Helper] 第 ${currentPage} 页 (${serviceConfig.labelText}) API错误: ${responseData.msg || '未知API错误'}`;
                    progressDivElement.textContent = `进度: ${errMsg}`;
                    console.error(errMsg, responseData);
                    throw new Error(errMsg);
                }
            } catch (e) {
                const errMsg = `[MIIT Helper] 请求第 ${currentPage} 页 (${serviceConfig.labelText}) 时出错: ${e.message ? e.message.substring(0,150) : String(e).substring(0,150)}`;
                progressDivElement.textContent = `错误: ${errMsg}`;
                console.error(errMsg, e);
                isFetchingAllData = false;
                const fetchButton = document.getElementById(FETCH_BUTTON_ID);
                if (fetchButton) {
                    fetchButton.disabled = !(monitoredRequestData.sign && monitoredRequestData.token && monitoredRequestData.uuid);
                    fetchButton.style.backgroundColor = fetchButton.disabled ? '#aaa' : '#4CAF50'; // 更新按钮颜色
                }
                throw e;
            }
            if (currentPage <= totalPages && isFetchingAllData) { // 只有当还有下一页且未被中断时才延迟
                 await delay(10000); // 每个分页请求间隔调整到10秒
            }
        }
        console.log(`[MIIT Helper] ${serviceConfig.labelText} 数据提取完成，共 ${collectedItems.size} 条。`);
    }

    async function handleFetchAllData() {
        if (isFetchingAllData) {
            alert("已有一个获取任务正在进行中，请稍候...");
            return;
        }
        isFetchingAllData = true;
        const fetchButton = document.getElementById(FETCH_BUTTON_ID);
        if(fetchButton) fetchButton.disabled = true;


        const progressDiv = document.getElementById(PROGRESS_DIV_ID);
        const unitNameInputElement = document.querySelector(UNIT_NAME_INPUT_SELECTOR);

        if (!unitNameInputElement || !unitNameInputElement.value.trim()) {
            const msg = "错误: 请在页面顶部的输入框中输入单位名称 (例如 科大讯飞股份有限公司)。";
            if (progressDiv) progressDiv.textContent = msg;
            console.error(`[MIIT Helper] ${msg}`);
            alert(msg);
            isFetchingAllData = false;
            if(fetchButton) {
                 fetchButton.disabled = false; // 出错，重新启用按钮 (如果头部已捕获)
                 fetchButton.style.backgroundColor = (monitoredRequestData.sign && monitoredRequestData.token && monitoredRequestData.uuid) ? '#4CAF50' : '#aaa';
            }
            return;
        }
        const unitName = unitNameInputElement.value.trim();

        if (!monitoredRequestData.sign || !monitoredRequestData.token || !monitoredRequestData.uuid) {
            const msg = "错误: 必需的请求头 (sign, token, uuid) 尚未从页面请求中捕获。请先在页面上进行一次查询（可能需要验证码）以捕获这些信息。";
            if (progressDiv) progressDiv.textContent = msg;
            console.error(`[MIIT Helper] ${msg}`);
            alert(msg);
            isFetchingAllData = false;
            // 按钮状态由 updateUIAfterHeadersCaptured 控制，这里不直接启用
            return;
        }

        console.log(`[MIIT Helper] '获取备案数据' 按钮被点击。单位名称: ${unitName}`);
        if (progressDiv) progressDiv.textContent = '进度: 初始化中...';

        TEXTAREA_CONFIG.forEach(cfg => {
            const ta = document.getElementById(cfg.id);
            if (ta) ta.value = "";
            const lbl = document.getElementById(cfg.countSpanId);
            if (lbl) lbl.textContent = " (0)";
        });

        const baseApiHeadersFromExample = {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
            "cache-control": "no-cache", "pragma": "no-cache",
            "origin": "https://beian.miit.gov.cn",
            "referer": "https://beian.miit.gov.cn/"
        };
        baseApiHeadersFromExample['user-agent'] = navigator.userAgent;

        await delay(3000);

        for (let i = 0; i < TEXTAREA_CONFIG.length; i++) {
            if (!isFetchingAllData) break; // 如果中途出错，则不再继续
            const serviceConfig = TEXTAREA_CONFIG[i];
            const textareaElement = document.getElementById(serviceConfig.id);
            const labelCountSpanElement = document.getElementById(serviceConfig.countSpanId);

            try {
                await fetchDataForServiceType(serviceConfig, unitName, baseApiHeadersFromExample, progressDiv, textareaElement, labelCountSpanElement);
                if (i < TEXTAREA_CONFIG.length - 1 && isFetchingAllData) {
                    progressDiv.textContent = `进度: ${serviceConfig.labelText} 完成。等待10秒后获取下一组...`;
                    await delay(10000);
                }
            } catch (error) {
                console.error(`[MIIT Helper] 获取 ${serviceConfig.labelText} 数据时发生严重错误，后续任务已中止。`, error);
                // isFetchingAllData 和按钮状态已在 fetchDataForServiceType 中处理
                break;
            }
        }

        if (isFetchingAllData) {
            if (progressDiv) progressDiv.textContent = '进度: 所有数据类型获取完毕！（已去重）';
        }
        isFetchingAllData = false;
        if(fetchButton) {
            fetchButton.disabled = !(monitoredRequestData.sign && monitoredRequestData.token && monitoredRequestData.uuid);
            fetchButton.style.backgroundColor = fetchButton.disabled ? '#aaa' : '#4CAF50';
        }
    }

    function createCopyButton(textareaId, buttonText = "复制内容") {
        const button = document.createElement('button');
        button.textContent = buttonText;
        button.setAttribute('style', 'margin-top: 5px; padding: 3px 8px; font-size: 11px; cursor: pointer; background-color: #f0f0f0; border: 1px solid #ccc; border-radius: 3px;');
        button.onmouseover = function() { this.style.backgroundColor = '#e0e0e0'; };
        button.onmouseout = function() { this.style.backgroundColor = '#f0f0f0'; };
        button.onclick = function() {
            const textarea = document.getElementById(textareaId);
            if (textarea && textarea.value) {
                GM_setClipboard(textarea.value, 'text');
                const originalText = this.textContent;
                this.textContent = '已复制!';
                this.disabled = true;
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                }, 2000);
            } else {
                alert("没有内容可复制。");
            }
        };
        return button;
    }

    function tryInjectUI() {
        if (document.getElementById(UI_WRAPPER_ID)) {
            updateUIAfterHeadersCaptured(); // 如果UI已存在，仅更新其状态
            return;
        }

        const targetContainer = document.querySelector('div.listcont');
        if (!targetContainer) {
            setTimeout(tryInjectUI, 2000);
            return;
        }

        console.log("[MIIT Helper] 正在注入初始UI...");

        const wrapperDiv = document.createElement('div');
        wrapperDiv.id = UI_WRAPPER_ID;
        wrapperDiv.setAttribute('style', 'border: 1px solid #ccc; padding: 15px; margin-top: 20px; margin-bottom: 20px; background-color: #f9f9f9; font-family: sans-serif;');

        const button = document.createElement('button');
        button.id = FETCH_BUTTON_ID;
        button.textContent = '批量获取所有备案数据';
        // 初始样式为禁用
        button.setAttribute('style', 'padding: 10px 18px; font-size: 16px; cursor: not-allowed; background-color: #aaa; color: white; border: none; border-radius: 4px; transition: background-color 0.3s ease;');
        button.disabled = true;
        button.onclick = handleFetchAllData;
        wrapperDiv.appendChild(button);

        const progressDiv = document.createElement('div');
        progressDiv.id = PROGRESS_DIV_ID;
        progressDiv.textContent = '提示: 请先在页面顶部的输入框进行一次查询（可能需要输入验证码），本工具捕获到必要信息后，上方按钮将启用。';
        progressDiv.setAttribute('style', 'margin-top: 10px; margin-bottom:10px; min-height: 1.2em; font-weight: bold; color: #777;');
        wrapperDiv.appendChild(progressDiv);

        const table = document.createElement('table');
        table.id = TEXTAREAS_TABLE_ID;
        table.setAttribute('style', 'width: 100%; margin-top: 10px; border-collapse: collapse; display: none;');

        const trLabels = table.insertRow();
        TEXTAREA_CONFIG.forEach(cfg => {
            const th = document.createElement('th');
            th.setAttribute('style', 'width: 25%; text-align: left; padding: 8px; border: 1px solid #ddd; background-color: #f0f0f0; font-size: 14px;');
            th.textContent = cfg.labelText;
            const countSpan = document.createElement('span');
            countSpan.id = cfg.countSpanId;
            countSpan.textContent = " (0)";
            countSpan.style.fontWeight = 'normal';
            countSpan.style.fontSize = '12px';
            th.appendChild(countSpan);
            trLabels.appendChild(th);
        });

        const trTextareas = table.insertRow();
        TEXTAREA_CONFIG.forEach(cfg => {
            const td = trTextareas.insertCell();
            td.setAttribute('style', 'width: 25%; padding: 5px; border: 1px solid #ddd; vertical-align: top; text-align: center;');
            const textarea = document.createElement('textarea');
            textarea.id = cfg.id;
            textarea.setAttribute('style', 'width: 98%; height: 200px; box-sizing: border-box; font-size: 12px; padding: 5px; border: 1px solid #ccc; margin-bottom: 5px;');
            textarea.readOnly = true;
            td.appendChild(textarea);
            td.appendChild(createCopyButton(cfg.id, `复制 ${cfg.labelText}`));
        });
        wrapperDiv.appendChild(table);

        if (targetContainer.firstChild) {
            targetContainer.insertBefore(wrapperDiv, targetContainer.firstChild);
        } else {
            targetContainer.appendChild(wrapperDiv);
        }

        uiInjected = true;
        console.log("[MIIT Helper] UI框架注入成功。");
        updateUIAfterHeadersCaptured(); // 根据当前是否有头部信息更新按钮状态
    }

    function updateUIAfterHeadersCaptured() {
        if (!uiInjected) { // 如果UI还未注入，先尝试注入
             // 在监控到头部后，如果页面已加载，可以尝试注入
            if (document.readyState === "complete" || document.readyState === "interactive") {
                tryInjectUI();
            } else {
                // 如果DOM未加载完，监听事件稍后注入。这确保 targetContainer 存在。
                window.addEventListener('DOMContentLoaded', tryInjectUI, { once: true });
            }
            return; // tryInjectUI 内部会再次调用此函数来更新状态
        }

        const fetchButton = document.getElementById(FETCH_BUTTON_ID);
        const textareasTable = document.getElementById(TEXTAREAS_TABLE_ID);
        const progressDiv = document.getElementById(PROGRESS_DIV_ID);

        if (fetchButton && textareasTable && progressDiv) {
            const headersNowAvailable = monitoredRequestData.sign && monitoredRequestData.token && monitoredRequestData.uuid;
            if (headersNowAvailable) {
                fetchButton.disabled = false;
                fetchButton.style.backgroundColor = '#4CAF50'; // 绿色，表示可用
                fetchButton.style.cursor = 'pointer';
                textareasTable.style.display = ''; // 显示表格
                if (progressDiv.textContent.includes("请先在上方输入框搜索")) {
                     progressDiv.textContent = "提示: 必要信息已捕获！可点击上方按钮获取数据。";
                     progressDiv.style.color = '#333'; // 正常颜色
                }
            } else {
                fetchButton.disabled = true;
                fetchButton.style.backgroundColor = '#aaa'; // 灰色，表示禁用
                fetchButton.style.cursor = 'not-allowed';
                textareasTable.style.display = 'none'; // 隐藏表格
                progressDiv.textContent = '提示: 请先在页面顶部的输入框进行一次查询（可能需要输入验证码），本工具捕获到必要信息后，上方按钮将启用。';
                progressDiv.style.color = '#777';
            }
        }
    }

    // Monkey patch window.fetch
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async function(...args) {
        const resource = args[0];
        const config = args[1];
        let requestUrl = (typeof resource === 'string') ? resource : resource.url;
        let responseClone; // 用于安全地读取响应体而不消耗它
        let result;

        // 先执行原始请求
        try {
            result = await originalFetch.apply(this, args);
            if (requestUrl === TARGET_API_URL) {
                 responseClone = result.clone(); // 克隆响应对象以便安全地读取body
            }
        } catch(err) {
            console.error("[MIIT Monitor (fetch)] Original fetch error:", err);
            throw err; // 重新抛出原始错误
        }


        if (requestUrl === TARGET_API_URL) {
            console.log(`[MIIT Monitor (fetch)] 捕获到页面自身对目标API的请求: ${requestUrl}`);
            const requestConfigHeaders = headersToObject(config && config.headers ? config.headers : (resource instanceof Request ? resource.headers : {}));

            let headersChangedOrNewlyFound = false;
            REQUIRED_MONITORED_HEADERS.forEach(headerName => {
                const headerValue = requestConfigHeaders[headerName.toLowerCase()];
                if (headerValue) {
                    if (monitoredRequestData[headerName] !== headerValue) {
                        console.log(`[MIIT Monitor (fetch)] 更新 ${headerName}: ${headerValue.substring(0,30)}...`);
                        monitoredRequestData[headerName] = headerValue;
                        headersChangedOrNewlyFound = true;
                    }
                }
            });

            if (headersChangedOrNewlyFound || (monitoredRequestData.sign && !uiInjected)) {
                updateUIAfterHeadersCaptured();
            }

            // 调试：可以打印克隆的响应体
            // responseClone.text().then(text => console.log('[MIIT Monitor (fetch)] Cloned Response body for target URL:', text.substring(0, 200)));
        }
        return result;
    };

    // Monkey patch XMLHttpRequest
    const originalXhrOpen = unsafeWindow.XMLHttpRequest.prototype.open;
    const originalXhrSetRequestHeader = unsafeWindow.XMLHttpRequest.prototype.setRequestHeader;
    const originalXhrSend = unsafeWindow.XMLHttpRequest.prototype.send;
    const xhrRequestDataMap = new WeakMap();

    unsafeWindow.XMLHttpRequest.prototype.open = function(method, url, ...restArgs) {
        if (String(url) === TARGET_API_URL) {
            xhrRequestDataMap.set(this, { url: url, headers: {}, method: method, processedOnSend: false });
        } else {
            if (xhrRequestDataMap.has(this)) xhrRequestDataMap.delete(this);
        }
        return originalXhrOpen.apply(this, [method, url, ...restArgs]);
    };

    unsafeWindow.XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        const requestData = xhrRequestDataMap.get(this);
        if (requestData) {
            requestData.headers[header.toLowerCase()] = value;
        }
        return originalXhrSetRequestHeader.apply(this, [header, value]);
    };

    unsafeWindow.XMLHttpRequest.prototype.send = function(...sendArgs) {
        const requestData = xhrRequestDataMap.get(this);
        if (requestData && requestData.url === TARGET_API_URL && !requestData.processedOnSend) {
            requestData.processedOnSend = true;
            console.log(`[MIIT Monitor (XHR)] 捕获到页面自身对目标API的 ${requestData.method} 请求: ${requestData.url}`);

            let headersChangedOrNewlyFound = false;
            REQUIRED_MONITORED_HEADERS.forEach(headerName => {
                const headerValue = requestData.headers[headerName.toLowerCase()];
                if (headerValue) {
                     if (monitoredRequestData[headerName] !== headerValue) {
                        console.log(`[MIIT Monitor (XHR)] 更新 ${headerName}: ${headerValue.substring(0,30)}...`);
                        monitoredRequestData[headerName] = headerValue;
                        headersChangedOrNewlyFound = true;
                    }
                }
            });

            if (headersChangedOrNewlyFound || (monitoredRequestData.sign && !uiInjected)) {
                updateUIAfterHeadersCaptured();
            }
        }
        return originalXhrSend.apply(this, sendArgs);
    };

    console.log('[MIIT Helper] Userscript v0.6 已加载。');

    window.addEventListener('DOMContentLoaded', () => {
        tryInjectUI(); // 在DOM加载后立即尝试注入初始UI
    }, { once: true });

})();
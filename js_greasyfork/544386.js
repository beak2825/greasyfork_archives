// ==UserScript==
// @name         TikTok 样品申请 -> 飞书同步器
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  【新增UI配置】可通过油猴菜单按钮，随时开启/关闭“分析触发”功能。
// @author       Gemini
// @match        *://*.tiktok.com/product/sample-request*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      1170731839.workers.dev
// @connect      open.feishu.cn
// @connect      my-feishu-analyzer.1170731839.workers.dev
// @downloadURL https://update.greasyfork.org/scripts/544386/TikTok%20%E6%A0%B7%E5%93%81%E7%94%B3%E8%AF%B7%20-%3E%20%E9%A3%9E%E4%B9%A6%E5%90%8C%E6%AD%A5%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/544386/TikTok%20%E6%A0%B7%E5%93%81%E7%94%B3%E8%AF%B7%20-%3E%20%E9%A3%9E%E4%B9%A6%E5%90%8C%E6%AD%A5%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区 ---
    const FEISHU_APP_TOKEN = 'T68zbfXIlaHT0TsOuvNc8iEZnib';
    const FEISHU_TABLE_ID = 'tbl2HTj4qedmbB7H';
    const TOKEN_PROXY_URL = 'https://feishu-token-proxy.1170731839.workers.dev/';
    const ANALYSIS_URL = 'https://my-feishu-analyzer.1170731839.workers.dev';

    let feishuAccessToken = null;
    const processedRecords = new Set();

    // --- 样式定义 ---
    GM_addStyle(`
        #export-csv-button { position: fixed; bottom: 20px; right: 20px; z-index: 9999; padding: 10px 15px; font-size: 14px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
        #export-csv-button:hover { background-color: #0056b3; }
    `);

    // =========================================================================
    // --- ★★★ 新增：设置菜单模块 ★★★ ---
    // =========================================================================
    const analysisSettingKey = 'isAnalysisEnabled';

    // 读取当前设置，如果从未设置过，则默认为 true (开启)
    let isAnalysisEnabled = GM_getValue(analysisSettingKey, true);

    // 注册菜单命令
    GM_registerMenuCommand(
        `分析触发: ${isAnalysisEnabled ? '✅ 已开启 (点击关闭)' : '❌ 已关闭 (点击开启)'}`,
        toggleAnalysisSetting
    );

    function toggleAnalysisSetting() {
        // 切换设置状态
        isAnalysisEnabled = !isAnalysisEnabled;
        // 保存新设置
        GM_setValue(analysisSettingKey, isAnalysisEnabled);
        // 提示用户
        alert(`“分析触发”功能已${isAnalysisEnabled ? '开启' : '关闭'}。\n刷新页面后菜单文本将更新。`);
        // 重新加载页面以更新菜单文本和脚本行为
        location.reload();
    }


    // =========================================================================
    // --- 1. API 交互模块 ---
    // =========================================================================

    async function getFeishuToken() {
        return new Promise((resolve, reject) => {
            console.log("[飞书同步] 正在获取 Access Token...");
            GM_xmlhttpRequest({
                method: "GET",
                url: TOKEN_PROXY_URL,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        if (data.tenant_access_token) {
                            feishuAccessToken = data.tenant_access_token;
                            console.log("%c[飞书同步] Access Token 获取成功！", "color: green; font-weight: bold;");
                            resolve(feishuAccessToken);
                        } else {
                            reject("响应中无 tenant_access_token");
                        }
                    } else {
                        reject("Token 获取失败: HTTP 状态码 " + response.status);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    async function searchRecordInFeishu(creatorHandle, productName) {
        if (!feishuAccessToken) return false;
        const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_APP_TOKEN}/tables/${FEISHU_TABLE_ID}/records/search`;
        const payload = {
            filter: {
                conjunction: "and",
                conditions: [
                    { field_name: "创作者 Handle", operator: "is", value: [creatorHandle] },
                    { field_name: "产品名称", operator: "is", value: [productName] }
                ]
            },
            page_size: 1
        };
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: {
                    "Authorization": `Bearer ${feishuAccessToken}`,
                    "Content-Type": "application/json; charset=utf-8"
                },
                data: JSON.stringify(payload),
                onload: function(response) {
                    const data = JSON.parse(response.responseText);
                    resolve(data.code === 0 && data.data?.items?.length > 0);
                },
                onerror: () => resolve(false)
            });
        });
    }

    function triggerAnalysis(creatorHandle) {
        if (!creatorHandle) {
            console.warn("[分析触发] creatorHandle 为空，跳过触发。");
            return;
        }
        const payload = { creatorHandle: creatorHandle };
        console.log(`[分析触发] 正在为 [${creatorHandle}] 发送分析请求...`);
        GM_xmlhttpRequest({
            method: "POST",
            url: ANALYSIS_URL,
            headers: { "Content-Type": "application/json; charset=utf-8" },
            data: JSON.stringify(payload),
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    console.log(`%c[分析触发] ✅ 成功为 [${creatorHandle}] 发送分析请求。`, "color: #27ae60;");
                } else {
                    console.error(`[分析触发] 分析请求失败，状态码: ${response.status}`, response.responseText);
                }
            },
            onerror: function(error) {
                console.error(`[分析触发] 分析请求网络错误:`, error);
            }
        });
    }

    async function addRecordToFeishu(recordFields) {
        if (!feishuAccessToken) return;
        const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_APP_TOKEN}/tables/${FEISHU_TABLE_ID}/records/batch_create`;
        const payload = { records: [{ fields: recordFields }] };
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: {
                "Authorization": `Bearer ${feishuAccessToken}`,
                "Content-Type": "application/json; charset=utf-8"
            },
            data: JSON.stringify(payload),
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (data.code === 0) {
                    console.log(`%c[飞书同步] 🎉 成功新增记录: [${recordFields["创作者 Handle"]} | ${recordFields["产品名称"]}]`, "color: #007bff; font-weight: bold;");
                    // ★★★ 根据从菜单读取的设置，决定是否调用分析函数 ★★★
                    if (isAnalysisEnabled) {
                        console.log("[分析触发] 功能已开启，准备发送请求...");
                        triggerAnalysis(recordFields["创作者 Handle"]);
                    } else {
                         console.log("[分析触发] 功能已关闭，跳过发送请求。");
                    }
                } else {
                    console.error("[飞书同步] 新增记录失败:", data, "Payload:", payload);
                }
            },
            onerror: function(error) {
                console.error("[飞书同步] 新增记录网络错误:", error);
            }
        });
    }

    // =========================================================================
    // --- 页面交互与数据提取模块 ---
    // =========================================================================

    function findReactKey(element, prefix) { if (!element) return null; for (const key in element) { if (key.startsWith(prefix)) return key; } return null; }
    function expandSingleDetail(iconElement) { if (!iconElement) return; const parent = iconElement.parentElement; const targetElement = parent?.closest('[role="button"], [onclick], .cursor-pointer') || iconElement.closest('[role="button"], [onclick], .cursor-pointer') || iconElement; const reactPropsKey = findReactKey(targetElement, '__reactProps$'); if (!reactPropsKey) { targetElement.click(); return; } const reactInstance = targetElement[reactPropsKey]; if (reactInstance?.memoizedProps?.onClick) { reactInstance.memoizedProps.onClick(); } else { targetElement.click(); } }
    function expandAllDetails() { const COLLAPSED_ICON_SELECTOR = 'img[data-e2e="1d3438e3-7ab1-0af5"].rotate-180'; const unprocessedIcons = document.querySelectorAll(`${COLLAPSED_ICON_SELECTOR}:not([data-expanded-by-script])`); if (unprocessedIcons.length > 0) { unprocessedIcons.forEach(icon => { icon.setAttribute('data-expanded-by-script', 'true'); expandSingleDetail(icon); }); } }

    async function mainLoop() {
        if (!feishuAccessToken) return;
        expandAllDetails();
        const tableBody = document.querySelector('.arco-table-content-inner tbody');
        if (!tableBody) return;
        const rows = tableBody.querySelectorAll('tr.arco-table-tr');
        let currentCreatorInfo = {};

        for (const row of rows) {
            if (row.classList.contains('arco-table-row-expanded')) {
                const cells = row.querySelectorAll('td');
                if (cells.length < 7) continue;
                currentCreatorInfo = {
                    handle: cells[2]?.querySelector('div.sc-gFqAkR')?.innerText.trim() || '',
                    name: cells[2]?.querySelector('div[data-e2e="d24ea79a-0cbc-ea5a"]')?.innerText.trim() || '',
                    followers: cells[3]?.querySelector('div[data-e2e="c3aa67d0-8948-24d6"]')?.innerText.trim() || '',
                    postRate: cells[4]?.querySelector('div[data-e2e="f46b7697-c830-ca22"]')?.innerText.trim() || '',
                    sales: cells[5]?.querySelector('div[data-e2e="f46b7697-c830-ca22"]')?.innerText.trim() || '',
                    avgViews: cells[6]?.querySelector('div[data-e2e="f46b7697-c830-ca22"]')?.innerText.trim() || '',
                };
            } else if (row.classList.contains('arco-table-expand-content')) {
                const productItems = row.querySelectorAll('div.sc-dtBdUo:not([data-processed-by-feishu-script])');
                for (const item of productItems) {
                    item.setAttribute('data-processed-by-feishu-script', 'true');
                    const productName = item.querySelector('span[data-e2e="5810fc19-8066-252a"]')?.innerText.trim() || '';
                    const productId = (item.querySelector('div[data-e2e="3a7ad23a-8136-80f2"] > span > div')?.innerText.trim() || '').replace('ID: ', '');
                    if (!currentCreatorInfo.handle || !productName) continue;
                    const uniqueKey = `${currentCreatorInfo.handle}_${productName}`;
                    if (processedRecords.has(uniqueKey)) continue;
                    processedRecords.add(uniqueKey);
                    console.log(`[飞书同步] 发现新记录，正在查询: ${currentCreatorInfo.handle} - ${productName}`);
                    const recordExists = await searchRecordInFeishu(currentCreatorInfo.handle, productName);

                    if (recordExists) {
                        console.log(`[飞书同步] 记录已存在于表格中，跳过: ${uniqueKey}`);
                    } else {
                        console.log(`[飞书同步] 记录不存在，准备新增: ${uniqueKey}`);
                        const fields = {
                            "类型": "样品",
                            "创作者 Handle": currentCreatorInfo.handle,
                            "创作者名称": currentCreatorInfo.name,
                            "粉丝数": currentCreatorInfo.followers,
                            "预计发布率": currentCreatorInfo.postRate,
                            "销售额": currentCreatorInfo.sales,
                            "视频平均观看量": currentCreatorInfo.avgViews,
                            "产品图片": item.querySelector('img.arco-image-img')?.src || '',
                            "产品名称": productName,
                            "产品ID": productId,
                            "SKU": item.querySelector('.sc-iGgWBj')?.innerText.trim() || '',
                            "佣金": item.querySelector('.sc-gsFSXq')?.innerText.trim() || '',
                            "剩余天数": item.querySelector('.sc-iHGNWf')?.innerText.trim() || '',
                            "剩余样品数": item.querySelector('span.sc-cPiKLX')?.innerText.trim() || '',
                            "操作": item.querySelector('.sc-kpDqfm')?.innerText.trim().replace(/\s+/g, ' / ') || ''
                        };
                        await addRecordToFeishu(fields);
                    }
                }
            }
        }
    }

    // --- 启动与初始化 ---
    async function initialize() {
        try {
            await getFeishuToken();
            setInterval(mainLoop, 3000); // 每3秒检查一次新数据
        } catch (error) {
            alert("无法获取飞书Token，自动同步功能已禁用！请检查代理或网络连接。");
            console.error("初始化失败:", error);
        }
    }
    initialize();

    // 手动导出按钮（功能已由自动同步替代，仅作保留）
    const exportButton = document.createElement('button');
    exportButton.id = 'export-csv-button';
    exportButton.innerText = '（自动同步中）';
    document.body.appendChild(exportButton);
    exportButton.addEventListener('click', () => {
        alert("脚本正在自动同步新记录到飞书，无需手动操作。");
    });
})();
// ==UserScript==
// @name         USST Downloader
// @namespace    https://www.zhihu.com/people/tekcor_
// @version      1.0
// @description  一键下载一网畅学平台上的课件
// @author       tekcor
// @match        https://1906.usst.edu.cn/course/*
// @grant        GM_download
// @grant        GM_addStyle
// @license      MIT license
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/537919/USST%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/537919/USST%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_URL_PART = "sub_course_id";
    const INTERMEDIATE_URL_TEMPLATE ="https://1906.usst.edu.cn//api/uploads/reference/document/{REFERENCE_ID}/url?preview=true";

    let currentFileFinalUrl = null; // 用于存储类型1数据的最终下载链接
    let allActivitiesData = null;   // 用于存储类型2数据的 activities 数组

    console.log("油猴脚本 (v1.0) - USST Downloader - 已启动");

    // --- UI 创建 ---
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'userscript-download-panel';
        panel.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px; padding-bottom: 3px; border-bottom: 1px solid #ccc;">下载助手</div>
            <button id="btnDownloadCurrentUserscript" disabled>下载当前文件</button>
            <button id="btnDownloadAllUserscript" disabled style="margin-top: 5px;">下载全部文件</button>
        `;
        document.body.appendChild(panel);

        GM_addStyle(`
            #userscript-download-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: #f0f0f0;
                border: 1px solid #ccc;
                padding: 10px;
                z-index: 9999;
                font-family: sans-serif;
                font-size: 12px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            #userscript-download-panel button {
                display: block;
                width: 100%;
                padding: 5px;
                font-size: 12px;
                cursor: pointer;
                border: 1px solid #bbb;
                border-radius: 3px;
                background-color: #e7e7e7;
            }
            #userscript-download-panel button:disabled {
                cursor: not-allowed;
                opacity: 0.6;
            }
            #userscript-download-panel button:not(:disabled):hover {
                background-color: #d7d7d7;
            }
        `);

        document.getElementById('btnDownloadCurrentUserscript').addEventListener('click', handleDownloadCurrent);
        document.getElementById('btnDownloadAllUserscript').addEventListener('click', handleDownloadAll);
    }

    function extractFilenameFromUrl(fileUrl, defaultFilenamePrefix, referenceId = '') {
        try {
            const urlObj = new URL(fileUrl);
            const nameParam = urlObj.searchParams.get('name');
            if (nameParam) {
                return decodeURIComponent(nameParam);
            }
        } catch (e) {
            console.error(`[油猴脚本-UI] 解析URL提取文件名时出错: "${fileUrl}"`, e);
        }
        return `${defaultFilenamePrefix}_${referenceId || Date.now()}.pdf`;
    }

    // --- 下载处理函数 ---
    function handleDownloadCurrent() {
        if (!currentFileFinalUrl) {
            alert("没有可供下载的“当前文件”链接。");
            return;
        }
        const btn = document.getElementById('btnDownloadCurrentUserscript');
        btn.disabled = true;
        btn.textContent = "下载中...";

        const filename = extractFilenameFromUrl(currentFileFinalUrl, "current_file");
        console.log(`[油猴脚本-UI] “下载当前文件”点击。文件名: "${filename}", URL: ${currentFileFinalUrl}`);
        GM_download(currentFileFinalUrl, filename);

        // 考虑是否下载后重置状态或让用户可以再次点击
        setTimeout(() => { // 延迟一点恢复按钮状态
            btn.textContent = "下载当前文件";
            // currentFileFinalUrl = null; // 如果只允许一次下载，则取消注释
            // btn.disabled = !currentFileFinalUrl; // 根据currentFileFinalUrl是否重置来决定
             btn.disabled = false; // 允许重复下载同一个“当前文件”
        }, 2000);
    }

    async function handleDownloadAll() {
        if (!allActivitiesData || allActivitiesData.length === 0) {
            alert("没有可供“下载全部”的数据。");
            return;
        }
        const btn = document.getElementById('btnDownloadAllUserscript');
        btn.disabled = true;
        btn.textContent = "下载中...";

        console.log(`[油猴脚本-UI] “下载全部”点击。共 ${allActivitiesData.length} 个 activity。`);
        let downloadedCount = 0;

        for (let index = 0; index < allActivitiesData.length; index++) {
            const activity = allActivitiesData[index];
            const logPrefix = "[油猴脚本-UI DownloadAll]";

            if (!activity) { console.log(`${logPrefix} Activity #${index}: 元素为空，跳过。`); continue; }

            if (activity.uploads && Array.isArray(activity.uploads) && activity.uploads.length > 0) {
                const firstUpload = activity.uploads[0];
                if (firstUpload && typeof firstUpload.reference_id !== 'undefined') {
                    const referenceId = firstUpload.reference_id;
                    console.log(`${logPrefix} Activity #${index}: 找到 reference_id: ${referenceId}`);
                    const intermediateUrl = INTERMEDIATE_URL_TEMPLATE.replace("{REFERENCE_ID}", referenceId);

                    btn.textContent = `下载中 (${index + 1}/${allActivitiesData.length})...`;
                    console.log(`${logPrefix} Activity #${index}: (步骤1) 请求中间URL: ${intermediateUrl}`);
                    try {
                        const res = await originalFetch(intermediateUrl);
                        if (!res.ok) { throw new Error(`网络错误 (状态 ${res.status}) for ${intermediateUrl}`); }
                        const intermediateJsonData = await res.json();
                        console.log(`${logPrefix} Activity #${index}: (步骤2) 收到中间JSON:`, intermediateJsonData);

                        if (intermediateJsonData && typeof intermediateJsonData.url === 'string' && intermediateJsonData.url.startsWith('http') && intermediateJsonData.status === "ready") {
                            const finalDownloadUrl = intermediateJsonData.url;
                            const filename = extractFilenameFromUrl(finalDownloadUrl, `activity_${index}_file`, referenceId);
                            console.log(`${logPrefix} Activity #${index}: (步骤3) 最终URL: ${finalDownloadUrl}, 文件名: "${filename}"`);
                            GM_download(finalDownloadUrl, filename);
                            downloadedCount++;
                            console.log(`${logPrefix} Activity #${index}: (步骤4) GM_download 已调用。`);
                            // 可选：在每个下载间添加短暂延迟
                            // await new Promise(resolve => setTimeout(resolve, 500));
                        } else {
                            console.error(`${logPrefix} Activity #${index}: 中间JSON格式不正确或status不为ready。`, intermediateJsonData);
                        }
                    } catch (err) {
                        console.error(`${logPrefix} Activity #${index}: 处理中间URL (${intermediateUrl}) 时出错:`, err);
                    }
                } else { console.log(`${logPrefix} Activity #${index}: 'uploads[0]' 中未找到 reference_id。`); }
            } else { console.log(`${logPrefix} Activity #${index}: 'uploads' 为空或无效。`); }
        }
        console.log(`[油猴脚本-UI] “下载全部”完成，尝试下载 ${downloadedCount} 个文件。`);
        btn.textContent = "下载全部 (列表)";
        // allActivitiesData = null; // 如果只允许一次下载，则取消注释
        // btn.disabled = !allActivitiesData; // 根据allActivitiesData是否重置来决定
        btn.disabled = false; // 允许重复下载同一个列表
    }

    // --- 网络请求拦截处理 ---
    function processJsonResponse(jsonData, requestTypePrefix) { // requestTypePrefix is "[油猴脚本-Fetch]" or "[油猴脚本-XHR]"
        console.log(`${requestTypePrefix} 正在分析JSON结构...`, jsonData);

        // 类型1: 直接在根级别有 uploads 数组，且没有 activities 数组
        if (jsonData.uploads && Array.isArray(jsonData.uploads) && jsonData.uploads.length > 0 && typeof jsonData.activities === 'undefined') {
            console.log(`${requestTypePrefix} 检测到类型1 JSON (直接uploads)`);
            const firstUpload = jsonData.uploads[0];
            if (firstUpload && typeof firstUpload.reference_id !== 'undefined') {
                const referenceId = firstUpload.reference_id;
                const intermediateUrl = INTERMEDIATE_URL_TEMPLATE.replace("{REFERENCE_ID}", referenceId);

                console.log(`${requestTypePrefix} 类型1: (步骤1) 请求中间URL: ${intermediateUrl}`);
                originalFetch(intermediateUrl)
                    .then(res => {
                        if (!res.ok) { throw new Error(`网络错误 (状态 ${res.status}) for ${intermediateUrl}`); }
                        return res.json();
                    })
                    .then(intermediateJsonData => {
                        console.log(`${requestTypePrefix} 类型1: (步骤2) 收到中间JSON:`, intermediateJsonData);
                        if (intermediateJsonData && typeof intermediateJsonData.url === 'string' && intermediateJsonData.url.startsWith('http') && intermediateJsonData.status === "ready") {
                            currentFileFinalUrl = intermediateJsonData.url; // 存储最终链接
                            console.log(`${requestTypePrefix} 类型1: (步骤3) 已存储“当前文件”下载链接: ${currentFileFinalUrl}`);
                            const btn = document.getElementById('btnDownloadCurrentUserscript');
                            if (btn) { btn.disabled = false; btn.title = `准备下载: ${extractFilenameFromUrl(currentFileFinalUrl, "current_file")}`; }
                        } else {
                            console.error(`${requestTypePrefix} 类型1: 中间JSON格式不正确或status不为ready。`, intermediateJsonData);
                        }
                    })
                    .catch(err => {
                        console.error(`${requestTypePrefix} 类型1: 处理中间URL (${intermediateUrl}) 时出错:`, err);
                    });
            } else { console.log(`${requestTypePrefix} 类型1: 'uploads[0]' 中未找到 reference_id。`); }
        }
        // 类型2: 有 activities 数组 (我们之前的逻辑)
        else if (jsonData.activities && Array.isArray(jsonData.activities) && jsonData.activities.length > 0) {
            console.log(`${requestTypePrefix} 检测到类型2 JSON (activities数组 - ${jsonData.activities.length} 项)`);
            allActivitiesData = jsonData.activities; // 存储整个数组
            console.log(`${requestTypePrefix} 类型2: 已存储 "activities" 数据供“下载全部”使用。`);
            const btn = document.getElementById('btnDownloadAllUserscript');
            if (btn) { btn.disabled = false; btn.title = `准备下载列表中的 ${allActivitiesData.length} 个项目`; }
        }
        // 未知结构
        else {
            console.log(`${requestTypePrefix} 未识别的JSON结构，不包含直接 'uploads' 或 'activities' 数组。`);
        }
    }

    // --- Fetch Interception ---
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const [resource, config] = args;
        let requestUrl = '';
        if (typeof resource === 'string') { requestUrl = resource; }
        else if (resource instanceof Request) { requestUrl = resource.url; }
        else { try { requestUrl = resource.href; } catch (e) { return originalFetch(...args); } }
aswwsse
        const responsePromise = originalFetch(...args);
        if (requestUrl && requestUrl.includes(TARGET_URL_PART)) {
            try {
                const response = await responsePromise;
                const clonedResponse = response.clone();
                const jsonData = await clonedResponse.json();
                processJsonResponse(jsonData, "[油猴脚本-Fetch]");
            } catch (error) {
                console.error("[油猴脚本-Fetch] 拦截和处理主数据时出错:", error);
            }
        }
        return responsePromise;
    };

    // --- XMLHttpRequest Interception ---
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    const originalXhrSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._requestUrl = url;
        return originalXhrOpen.apply(this, [method, url, ...rest]);
    };
    XMLHttpRequest.prototype.send = function(...sendArgs) {
        this.addEventListener('load', function() {
            if (this._requestUrl && typeof this._requestUrl === 'string' && this._requestUrl.includes(TARGET_URL_PART)) {
                if (this.readyState === 4 && (this.status >= 200 && this.status < 300)) {
                    try {
                        const jsonData = JSON.parse(this.responseText);
                        processJsonResponse(jsonData, "[油猴脚本-XHR]");
                    } catch (e) {
                        console.error('[油猴脚本-XHR] 拦截和处理主数据时出错:', e);
                    }
                } else if (this.readyState === 4) { /* ... */ }
            }
        });
        return originalXhrSend.apply(this, sendArgs);
    };

    // --- 脚本启动 ---
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        createControlPanel();
    } else {
        document.addEventListener('DOMContentLoaded', createControlPanel);
    }
    console.log("[油猴脚本] Fetch 和 XMLHttpRequest 拦截器已设置。UI面板将很快创建。");

})();
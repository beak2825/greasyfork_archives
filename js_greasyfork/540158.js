// ==UserScript==
// @name         123pan JSON 高级工具集 (拆分与合并)
// @namespace    http://tampermonkey.net/
// @version      2.2.2
// @description  为123网盘用户设计，一个功能强大的油猴脚本。不仅可以将超大JSON文件拆分，还新增了将多个JSON文件合并为一体的独立功能。完美集成至左侧菜单，适配所有布局。
// @author       @一只氧气
// @match        *://www.123pan.com/*
// @match        *://*.123pan.com/*
// @match        *://*.123pan.cn/*
// @match        *://*.123865.com/*
// @match        *://*.123684.com/*
// @match        *://*.123912.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=123pan.com
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/540158/123pan%20JSON%20%E9%AB%98%E7%BA%A7%E5%B7%A5%E5%85%B7%E9%9B%86%20%28%E6%8B%86%E5%88%86%E4%B8%8E%E5%90%88%E5%B9%B6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540158/123pan%20JSON%20%E9%AB%98%E7%BA%A7%E5%B7%A5%E5%85%B7%E9%9B%86%20%28%E6%8B%86%E5%88%86%E4%B8%8E%E5%90%88%E5%B9%B6%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Constants ---
    const SCRIPT_NAME_SPLITTER = "123pan JSON 拆分工具";
    const SCRIPT_NAME_MERGER = "123pan JSON 合并工具";
    const SCRIPT_VERSION = "2.2.2"; // Final icon fix
    const BROWSER_DOWNLOAD_LIMIT = 10;
    const SEQUENTIAL_DOWNLOAD_DELAY = 1500; // ms

    // --- Core Logic (No changes here) ---
    const coreLogic = {
        analyzeJsonStructure: function(jsonData) {
            try {
                if (!jsonData || !Array.isArray(jsonData.files)) { return { error: "JSON数据格式无效，缺少 'files' 数组。" }; }
                const tree = {}; let maxDepth = 0;
                const commonPathPrefix = jsonData.commonPath ? `${jsonData.commonPath.replace(/\/$/, '')}/` : '';
                jsonData.files.forEach(file => {
                    const fullPath = commonPathPrefix + file.path;
                    const parts = fullPath.split('/').filter(p => p);
                    let currentLevel = tree;
                    parts.forEach((part, index) => {
                        if (index === parts.length - 1) { currentLevel[part] = null; }
                        else { if (!currentLevel[part]) { currentLevel[part] = {}; } currentLevel = currentLevel[part]; }
                    });
                    if (parts.length > maxDepth) { maxDepth = parts.length; }
                });
                function formatTree(node, prefix = '', depth = 1) {
                    let result = ''; const keys = Object.keys(node);
                    keys.forEach((key, index) => {
                        const isNodeLast = index === keys.length - 1;
                        const connector = isNodeLast ? '└── ' : '├── ';
                        const itemPrefix = node[key] === null ? '📄 ' : '📁 ';
                        result += `${prefix}${connector}${itemPrefix}${key}  (Lv. ${depth})\n`;
                        if (node[key] !== null) {
                            const newPrefix = prefix + (isNodeLast ? '    ' : '│   ');
                            result += formatTree(node[key], newPrefix, depth + 1);
                        }
                    });
                    return result;
                }
                const treeString = formatTree(tree);
                const fileCount = jsonData.files.length;
                const totalSize = jsonData.files.reduce((sum, file) => sum + (Number(file.size) || 0), 0);
                return { fileCount, totalSize: uiManager.formatBytes(totalSize), maxDepth, treeString };
            } catch (e) { return { error: `解析JSON时出错: ${e.message}` }; }
        },
        splitImportedJsonFile: function(jsonData, originalFilteredData, originalFileName, splitMethod, config) {
            try {
                if (!jsonData || !Array.isArray(jsonData.files)) { uiManager.showError("JSON数据格式无效，缺少 'files' 数组。"); return null; }
                const baseMetadata = { ...jsonData };
                delete baseMetadata.files; delete baseMetadata.totalFilesCount; delete baseMetadata.totalSize; delete baseMetadata.formattedTotalSize;
                const baseFileName = originalFileName.endsWith('.json') ? originalFileName.slice(0, -5) : originalFileName;
                const chunks = [];
                if (splitMethod === 'byCount') {
                    const chunkSize = config.chunkSize;
                    if (!chunkSize || chunkSize <= 0) { uiManager.showError("按数量拆分时，请输入有效的正整数。"); return null; }
                    for (let i = 0; i < jsonData.files.length; i += chunkSize) {
                        const chunkFiles = jsonData.files.slice(i, i + chunkSize);
                        const chunkTotalSize = chunkFiles.reduce((sum, file) => sum + (Number(file.size) || 0), 0);
                        const chunkJsonData = { ...baseMetadata, totalFilesCount: chunkFiles.length, totalSize: chunkTotalSize, formattedTotalSize: uiManager.formatBytes(chunkTotalSize), files: chunkFiles };
                        chunks.push({ data: chunkJsonData, filename: `${baseFileName}_part_${chunks.length + 1}.json` });
                    }
                } else if (splitMethod === 'byFolder') {
                    const level = config.level;
                    if (!level || level <= 0) { uiManager.showError("按目录层级拆分时，请输入有效的正整数。"); return null; }
                    const commonPathPrefixForDepth = jsonData.commonPath ? `${jsonData.commonPath.replace(/\/$/, '')}/` : '';
                    const originalCommonPathForOutput = jsonData.commonPath ? `${jsonData.commonPath.replace(/\/$/, '')}/` : '';
                    const folders = new Map();
                    jsonData.files.forEach(file => {
                        const fullPathForDepth = commonPathPrefixForDepth + file.path;
                        const pathParts = fullPathForDepth.split('/').filter(p => p.trim() !== '');
                        const dirParts = pathParts.slice(0, -1);
                        const groupKey = (dirParts.length >= level) ? dirParts.slice(0, level).join('/') : '_root_';
                        if (!folders.has(groupKey)) { folders.set(groupKey, []); }
                        folders.get(groupKey).push(file);
                    });
                    for (const [groupKey, filesInGroup] of folders.entries()) {
                        const sanitizedGroupKey = groupKey.replace(/[\/:*?"<>|]/g, '_');
                        let newCommonPath, newFilesArray, outputFileName;
                        if (groupKey === '_root_') {
                            newCommonPath = originalCommonPathForOutput;
                            newFilesArray = filesInGroup;
                            outputFileName = `${baseFileName}_${sanitizedGroupKey}.json`;
                        } else {
                            newCommonPath = groupKey + '/';
                            newFilesArray = filesInGroup.map(originalFile => {
                                const fullPathForThisFile = commonPathPrefixForDepth + originalFile.path;
                                const newRelativePath = fullPathForThisFile.substring(groupKey.length).replace(/^\//, '');
                                return { ...originalFile, path: newRelativePath };
                            });
                            outputFileName = `${baseFileName}_${sanitizedGroupKey}.json`;
                        }
                        if (newFilesArray.length === 0) continue;
                        const chunkTotalSize = newFilesArray.reduce((sum, file) => sum + (Number(file.size) || 0), 0);
                        const chunkJsonData = { ...baseMetadata, commonPath: newCommonPath, totalFilesCount: newFilesArray.length, totalSize: chunkTotalSize, formattedTotalSize: uiManager.formatBytes(chunkTotalSize), files: newFilesArray };
                        chunks.push({ data: chunkJsonData, filename: outputFileName });
                    }
                }

                if (chunks.length > 0) {
                     const verificationResult = coreLogic.verifyChunks(jsonData, chunks);
                     if (!verificationResult.success) {
                         const errorMessage = `校验失败！数据可能丢失！\n应有文件数: ${verificationResult.originalTotalFiles}, 拆分后总数: ${verificationResult.newTotalFiles}\n\n操作已取消。`;
                         uiManager.showError(errorMessage.replace(/\n/g, '<br>'), 10000);
                         return null;
                     }
                    if (splitMethod === 'byFolder') {
                        const rootChunk = chunks.find(c => c.filename.includes('_root_.json'));
                        if (rootChunk) { uiManager.showAlert(`提示：有 ${rootChunk.data.files.length} 个文件被打包到了 "_root_.json" 中。`, 4000); }
                    }
                    return { chunks, originalFilteredData, originalFileName, baseFileName };
                } else {
                    uiManager.showError("没有可供拆分的文件。请检查您的过滤设置。");
                    return null;
                }
            } catch (e) { console.error(`[${SCRIPT_NAME_SPLITTER}] 拆分失败:`, e); uiManager.showError(`拆分失败: ${e.message}.`); return null; }
        },
        verifyChunks: function(originalData, chunks) {
            const originalTotalFiles = originalData.files.length;
            const newTotalFiles = chunks.reduce((sum, chunk) => sum + chunk.data.files.length, 0);
            return { success: originalTotalFiles === newTotalFiles, originalTotalFiles, newTotalFiles };
        },
        mergeJsonFiles: function(filesToMerge) {
            try {
                if (filesToMerge.length < 2) {
                    uiManager.showError("请至少选择两个文件进行合并。");
                    return null;
                }
                const baseJson = filesToMerge[0].data;
                const mergedFilesArray = [...baseJson.files];

                for (let i = 1; i < filesToMerge.length; i++) {
                    const nextJson = filesToMerge[i].data;
                    if (nextJson && Array.isArray(nextJson.files)) {
                        mergedFilesArray.push(...nextJson.files);
                    } else {
                         uiManager.showError(`文件 "${filesToMerge[i].name}" 格式无效，已跳过。`);
                    }
                }

                const finalJson = { ...baseJson };
                finalJson.files = mergedFilesArray;
                finalJson.totalFilesCount = mergedFilesArray.length;
                const totalSize = mergedFilesArray.reduce((sum, file) => sum + (Number(file.size) || 0), 0);
                finalJson.totalSize = totalSize;
                finalJson.formattedTotalSize = uiManager.formatBytes(totalSize);

                return finalJson;

            } catch(e) {
                console.error(`[${SCRIPT_NAME_MERGER}] 合并失败:`, e);
                uiManager.showError(`合并失败: ${e.message}.`);
                return null;
            }
        }
    };

    // --- UI Manager ---
    const uiManager = {
        showCompletionSummary: function(originalFileName, originalFilteredData, downloadedChunks) {
            const originalTotalFiles = originalFilteredData.files.length;
            const originalTotalSize = originalFilteredData.files.reduce((sum, file) => sum + (Number(file.size) || 0), 0);
            const listItems = downloadedChunks.map(chunk => `<li><strong>${chunk.filename}</strong>: ${chunk.data.files.length} 个文件 - ${this.formatBytes(chunk.data.totalSize)}</li>`).join('');
            const newTotalFiles = downloadedChunks.reduce((sum, chunk) => sum + chunk.data.files.length, 0);
            const newTotalSize = downloadedChunks.reduce((sum, chunk) => sum + chunk.data.totalSize, 0);
            const summaryHtml = `<div style="text-align: left; line-height: 1.6;"><strong>原始文件 (过滤后):</strong> ${originalFileName}<br>- 总文件数: ${originalTotalFiles}<br>- 总大小: ${this.formatBytes(originalTotalSize)}<hr style="margin: 15px 0;"><strong>已下载文件列表 (${downloadedChunks.length}个):</strong><ul style="padding-left: 20px; margin-top: 10px; max-height: 150px; overflow-y: auto; background: #f7f7f7; border: 1px solid #eee; border-radius: 4px; padding: 10px;">${listItems}</ul><div style="font-weight: bold; margin-top: 10px; text-align: right;">合计: ${newTotalFiles} 个文件 - ${this.formatBytes(newTotalSize)}</div></div>`;
            this.showCenteredInfoModal("✅ 下载已启动！", summaryHtml);
        },
        showCenteredInfoModal: function(title, htmlContent) {
            if (document.getElementById('summary-modal-overlay')) { document.getElementById('summary-modal-overlay').remove(); }
            const overlay = document.createElement('div');
            overlay.id = 'summary-modal-overlay';
            overlay.className = 'splitter-overlay';
            const modalContainer = document.createElement('div');
            modalContainer.className = 'summary-container';
            modalContainer.innerHTML = `<h2 class="summary-title">${title}</h2><div class="summary-content">${htmlContent}</div><button id="summary-ok-btn" class="summary-ok-btn">确定</button>`;
            overlay.appendChild(modalContainer);
            document.body.appendChild(overlay);
            const close = () => overlay.remove();
            modalContainer.querySelector('#summary-ok-btn').onclick = close;
            overlay.onclick = (e) => { if (e.target === overlay) { close(); } };
        },
        showProgressModal: function(message) {
            this.hideProgressModal();
            const overlay = document.createElement('div');
            overlay.id = 'progress-modal-overlay';
            overlay.className = 'splitter-overlay';
            overlay.style.zIndex = '10004';
            overlay.innerHTML = `<div class="progress-container"><div class="progress-spinner"></div><div class="progress-text">${message}</div></div>`;
            document.body.appendChild(overlay);
        },
        hideProgressModal: function() {
            const overlay = document.getElementById('progress-modal-overlay');
            if (overlay) { overlay.remove(); }
        },
        _downloadToFile: function(content, filename, contentType) {
            try {
                const blob = (content instanceof Blob) ? content : new Blob([content], { type: contentType });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(a.href);
            } catch (e) { console.error("下载失败:", e); this.showError(`下载文件 "${filename}" 失败。`); }
        },
        formatBytes: function(bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024; const dm = decimals < 0 ? 0 : decimals; const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']; const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        },
        showAlert: function(message, duration = 3000) {
            const el = document.createElement('div');
            el.style.zIndex = '10005'; el.className = 'splitter-info-popup'; el.innerHTML = message; document.body.appendChild(el);
            setTimeout(() => { el.classList.add('fadeout'); setTimeout(() => el.remove(), 500); }, duration);
        },
        showError: function(message, duration = 4000) { this.showAlert(`<span style="color: #ffcdd2;">⚠️ ${message}</span>`, duration); },
        applyStyles: function() {
            // No custom styles needed for sidebar items, but keeping for modals.
            if (document.getElementById('splitter-tool-styles')) return;
            GM_addStyle(`
                .splitter-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 10000; }
                .splitter-modal-close-btn { position: absolute; top: 10px; right: 15px; font-size: 28px; font-weight: bold; color: #999; cursor: pointer; transition: color 0.3s; z-index: 1; }
                .splitter-container { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; background: #fff; padding: 0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); width: 90vw; max-width: 700px; text-align: center; position: relative; display: flex; flex-direction: column; max-height: 90vh; }
                .splitter-title { margin: 0; color: #333; padding: 1.5rem 2rem; border-bottom: 1px solid #f0f0f0; flex-shrink: 0; }
                .splitter-body { overflow-y: auto; padding: 1rem 2rem; flex-grow: 1; text-align: left; }
                .splitter-actions { padding: 1.5rem 2rem; border-top: 1px solid #f0f0f0; background: #fafafa; text-align: center; flex-shrink: 0; }
                .splitter-drop-area { border: 2px dashed #d9d9d9; padding: 40px 20px; border-radius: 8px; transition: all .3s; margin-bottom: 1.5rem; text-align: center; }
                .splitter-drop-area.drag-over { border-color: #1890ff; background-color: #e6f7ff; }
                #splitter-file-status, #merger-file-status { color: #52c41a; margin-top: 1rem; font-weight: 500; min-height: 1.2em; text-align: center;}
                #splitter-analysis-result { background-color: #fafafa; border: 1px solid #d9d9d9; border-radius: 4px; padding: 15px; margin-top: 1.5rem; text-align: left; max-height: 250px; overflow-y: auto; white-space: pre; font-family: 'Courier New', Courier, monospace; font-size: 0.85em; line-height: 1.6; }
                .splitter-options, .splitter-filter-options { margin: 1.5rem 0; border: 1px solid #f0f0f0; padding: 1.5rem; border-radius: 8px; text-align: left; }
                .splitter-options > div { margin-bottom: 1rem; }
                .splitter-options > div:last-child { margin-bottom: 0; }
                .button-primary, .download-action-btn, .button-secondary { font-size: 1rem; padding: 10px 15px; min-width: 170px; border: none; border-radius: 4px; cursor: pointer; transition: background-color .3s; margin: 5px; }
                .button-primary { background-color: #52c41a; color: #fff; }
                .button-primary:disabled { background-color: #d9d9d9; cursor: not-allowed; }
                .button-secondary { background-color: #1890ff; color: #fff; }
                .btn-green { background-color: #52c41a; color: white; }
                .btn-blue { background-color: #1890ff; color: white; }
                .btn-grey { background-color: #888; color: white; }
                .link-style-btn { background: none; border: none; color: #1890ff; cursor: pointer; padding: 0; font-size: inherit; text-decoration: underline; }
                .splitter-footer { padding: 1rem 2rem; font-size: 0.8em; color: #999; text-align: center; background: #fafafa; border-top: 1px solid #f0f0f0; flex-shrink: 0;}
                .splitter-info-popup { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background-color: rgba(0,0,0,0.8); color: white; padding: 12px 22px; border-radius: 5px; opacity: 1; transition: opacity 0.5s ease-out; font-size: 1em; max-width: 90vw; }
                .summary-container { background: #fff; padding: 25px 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); width: 90vw; max-width: 600px; text-align: center; }
                .summary-ok-btn { font-size: 1.1rem; padding: 10px 40px; background-color: #1890ff; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
                .chunk-list { flex-grow: 1; overflow-y: auto; border: 1px solid #eee; border-radius: 4px; padding: 10px; margin-top: 1rem;}
                .chunk-item { display: flex; align-items: center; padding: 8px; border-bottom: 1px solid #f0f0f0; }
                .chunk-item:last-child { border-bottom: none; }
                .chunk-item input[type="checkbox"] { margin-right: 15px; flex-shrink: 0; }
                .chunk-item label { word-break: break-all; }
                .chunk-item-details { color: #666; font-size: 0.9em; margin-left: auto; white-space: nowrap; padding-left: 10px; }
                .selection-header, .selection-summary, .merger-summary { padding-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; border-bottom: 1px solid #f0f0f0; padding: 1rem; margin-bottom: 1rem; background: #fafafa;}
                .selection-summary, .merger-summary { border-top: 1px solid #f0f0f0; margin-top: 1rem; margin-bottom: 0; font-weight: bold; }
                .progress-container { background: white; color: black; padding: 30px 40px; border-radius: 8px; display: flex; align-items: center; font-size: 1.2em; }
                .progress-spinner { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin-right: 20px; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `);
        },
        showDownloadSelectionView: function(resultData) {
            const { chunks, originalFilteredData, originalFileName, baseFileName } = resultData;
            const modalContainer = document.querySelector('.splitter-container');
            const splitterBody = modalContainer.querySelector('.splitter-body');
            const splitterActions = modalContainer.querySelector('.splitter-actions');
            const splitterTitle = modalContainer.querySelector('.splitter-title');
            const originalBodyHTML = splitterBody.innerHTML;
            const originalActionsHTML = splitterActions.innerHTML;
            const originalTitle = splitterTitle.textContent;
            const originalTotalFiles = originalFilteredData.files.length;
            const originalTotalSize = originalFilteredData.files.reduce((sum, file) => sum + (Number(file.size) || 0), 0);
            const chunkListItems = chunks.map((chunk, index) => `<div class="chunk-item"><input type="checkbox" class="chunk-checkbox" id="chunk-checkbox-${index}" value="${index}" checked><label for="chunk-checkbox-${index}"><strong>${chunk.filename}</strong></label><span class="chunk-item-details">${chunk.data.files.length} 个文件, ${this.formatBytes(chunk.data.totalSize)}</span></div>`).join('');

            splitterTitle.textContent = '拆分完成 - 请选择文件下载';
            splitterBody.innerHTML = `<div class="selection-header"><span><strong>原始文件 (过滤后):</strong> ${originalTotalFiles} 个, ${this.formatBytes(originalTotalSize)}</span><button id="back-to-splitter-btn" class="link-style-btn">返回修改</button></div><div class="chunk-list">${chunkListItems}</div><div class="selection-summary"><span>已选择: 0 个文件, 0 Bytes</span></div>`;
            splitterActions.innerHTML = `
                <button id="download-seq-btn" class="download-action-btn btn-green">顺序下载选中项 (推荐)</button>
                <button id="download-ind-btn" class="download-action-btn btn-grey">单独下载选中项</button>
                <button id="download-zip-btn" class="download-action-btn btn-blue">打包下载全部 (ZIP)</button>
            `;

            const allCheckboxes = splitterBody.querySelectorAll('.chunk-checkbox');
            const selectionSummaryEl = splitterBody.querySelector('.selection-summary > span');
            const updateSelectionSummary = () => {
                const selectedChunks = [...allCheckboxes].filter(cb => cb.checked).map(cb => chunks[cb.value]);
                const selectedFileCount = selectedChunks.reduce((sum, chunk) => sum + chunk.data.files.length, 0);
                const selectedSize = selectedChunks.reduce((sum, chunk) => sum + chunk.data.totalSize, 0);
                selectionSummaryEl.textContent = `已选择: ${selectedFileCount} 个文件, ${this.formatBytes(selectedSize)}`;
            };

            const selectAllCheckbox = document.createElement('input');
            selectAllCheckbox.type = 'checkbox'; selectAllCheckbox.checked = true;
            selectAllCheckbox.onchange = () => { allCheckboxes.forEach(cb => cb.checked = selectAllCheckbox.checked); updateSelectionSummary(); };
            allCheckboxes.forEach(cb => { cb.addEventListener('change', () => { selectAllCheckbox.checked = [...allCheckboxes].every(c => c.checked); updateSelectionSummary(); }); });
            const selectAllLabel = document.createElement('label');
            selectAllLabel.appendChild(selectAllCheckbox); selectAllLabel.append(' 全选/全不选');
            splitterBody.querySelector('.selection-header').prepend(selectAllLabel);
            updateSelectionSummary();

            splitterBody.querySelector('#back-to-splitter-btn').onclick = () => {
                splitterTitle.textContent = originalTitle; splitterBody.innerHTML = originalBodyHTML; splitterActions.innerHTML = originalActionsHTML;
                this.rebindMainViewEvents(modalContainer);
            };

            const downloadZip = (chunksToZip, zipFilename) => {
                try {
                    if (typeof JSZip === 'undefined') { this.showError("错误：ZIP库未能加载，请检查网络或浏览器插件冲突。"); return; }
                    this.showProgressModal('正在生成ZIP压缩包，请稍候...');
                    const zip = new JSZip();
                    chunksToZip.forEach(chunk => zip.file(chunk.filename, JSON.stringify(chunk.data, null, 2)));
                    zip.generateAsync({ type: "blob", compression: "DEFLATE" })
                        .then(blob => { this.hideProgressModal(); this._downloadToFile(blob, zipFilename, 'application/zip'); this.showCompletionSummary(originalFileName, originalFilteredData, chunksToZip); })
                        .catch(err => { this.hideProgressModal(); this.showError(`ZIP打包失败: ${err.message}`); console.error(err); });
                } catch(e) { this.hideProgressModal(); this.showError(`下载操作失败: ${e.message}`); console.error(e); }
            };

            const downloadSequentially = async (chunksToDownload) => {
                const delay = ms => new Promise(res => setTimeout(res, ms));
                for (let i = 0; i < chunksToDownload.length; i++) {
                    const chunk = chunksToDownload[i];
                    this.showProgressModal(`正在下载: ${chunk.filename} (${i + 1}/${chunksToDownload.length})`);
                    this._downloadToFile(JSON.stringify(chunk.data, null, 2), chunk.filename, 'application/json');
                    await delay(SEQUENTIAL_DOWNLOAD_DELAY);
                }
                this.hideProgressModal();
                this.showCompletionSummary(originalFileName, originalFilteredData, chunksToDownload);
            };

            splitterActions.querySelector('#download-ind-btn').onclick = () => {
                const selectedChunks = [...allCheckboxes].filter(cb => cb.checked).map(cb => chunks[cb.value]);
                if (selectedChunks.length === 0) { this.showError("请至少选择一个文件。"); return; }
                if (selectedChunks.length >= BROWSER_DOWNLOAD_LIMIT) { this.showError(`选择文件过多(${selectedChunks.length}个)，可能被浏览器拦截，建议使用“顺序下载”。`, 5000); }
                selectedChunks.forEach(chunk => this._downloadToFile(JSON.stringify(chunk.data, null, 2), chunk.filename, 'application/json'));
                this.showCompletionSummary(originalFileName, originalFilteredData, selectedChunks);
            };
            splitterActions.querySelector('#download-seq-btn').onclick = () => {
                const selectedChunks = [...allCheckboxes].filter(cb => cb.checked).map(cb => chunks[cb.value]);
                if (selectedChunks.length === 0) { this.showError("请至少选择一个文件。"); return; }
                downloadSequentially(selectedChunks);
            };
            splitterActions.querySelector('#download-zip-btn').onclick = () => downloadZip(chunks, `${baseFileName}_all.zip`);

            if (typeof JSZip === 'undefined') {
                const zipBtn = splitterActions.querySelector('#download-zip-btn');
                zipBtn.disabled = true; zipBtn.title = "ZIP库加载失败，此功能不可用";
            }
        },
        rebindMainViewEvents: function(modalContainer) {
            this.fileContent = this.fileContent || null;
            this.originalFileName = this.originalFileName || '';
            this.originalFilteredData = this.originalFilteredData || null;

            const dropArea = modalContainer.querySelector('#splitter-drop-area');
            const fileInput = modalContainer.querySelector('#splitter-file-input');
            const browseBtn = modalContainer.querySelector('#splitter-browse-btn');
            const analyzeBtn = modalContainer.querySelector('#splitter-analyze-btn');
            const startBtn = modalContainer.querySelector('#splitter-start-btn');
            const radioButtons = modalContainer.querySelectorAll('input[name="split-method"]');

            const handleFile = (file) => {
                const statusDiv = modalContainer.querySelector('#splitter-file-status');
                if (file && file.name.endsWith('.json')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.fileContent = e.target.result; this.originalFileName = file.name;
                        statusDiv.textContent = `已加载: ${file.name}`;
                        analyzeBtn.disabled = false; startBtn.disabled = false;
                        modalContainer.querySelector('#splitter-analysis-result').style.display = 'none';
                    };
                    reader.readAsText(file, 'UTF-8');
                } else {
                    this.showError("请选择一个有效的 .json 文件。");
                    this.fileContent = null; this.originalFileName = '';
                    statusDiv.textContent = ''; analyzeBtn.disabled = true; startBtn.disabled = true;
                }
            };

            browseBtn.onclick = () => fileInput.click();
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                if(dropArea.getAttribute('listener') !== 'true') {
                    dropArea.addEventListener(eventName, e => {
                        e.preventDefault(); e.stopPropagation();
                        if (eventName === 'dragover') dropArea.classList.add('drag-over');
                        if (eventName === 'dragleave' || eventName === 'drop') dropArea.classList.remove('drag-over');
                        if (eventName === 'drop') { handleFile(e.dataTransfer.files[0]); }
                    });
                }
            });
            dropArea.setAttribute('listener', 'true'); // Prevent re-adding listeners

            fileInput.onchange = (e) => handleFile(e.target.files[0]);
            analyzeBtn.onclick = () => this.analyzeHandler(modalContainer);
            startBtn.onclick = () => this.startHandler(modalContainer);
            const toggleInputs = () => {
                const selectedMethod = modalContainer.querySelector('input[name="split-method"]:checked').value;
                modalContainer.querySelector('#splitter-level-container').style.display = (selectedMethod === 'byFolder') ? 'inline-block' : 'none';
                modalContainer.querySelector('#splitter-chunk-size-container').style.display = (selectedMethod === 'byCount') ? 'inline-block' : 'none';
            };
            radioButtons.forEach(radio => radio.onchange = toggleInputs);
            toggleInputs();
        },
        showSplitterTool: function() {
            if (document.getElementById('splitter-modal-overlay')) return;
            this.applyStyles();
            const overlay = document.createElement('div');
            overlay.id = 'splitter-modal-overlay';
            overlay.className = 'splitter-overlay';
            const modalContainer = document.createElement('div');
            modalContainer.className = 'splitter-container';
            modalContainer.innerHTML = `
                <span id="splitter-modal-close-btn" class="splitter-modal-close-btn">&times;</span>
                <h1 class="splitter-title">${SCRIPT_NAME_SPLITTER}</h1>
                <div class="splitter-body">
                     <div id="splitter-drop-area" class="splitter-drop-area">
                        <p>拖拽一个 .json 文件到此处 或 <button id="splitter-browse-btn" class="link-style-btn">点击选择文件</button></p>
                        <input type="file" id="splitter-file-input" accept=".json" style="display: none;">
                        <p id="splitter-file-status"></p>
                    </div>
                    <div style="text-align:center; margin-bottom: 1.5rem;"><button id="splitter-analyze-btn" class="button-secondary" style="margin:0;">📊 分析JSON结构</button></div>
                    <div id="splitter-analysis-result" style="display: none;"></div>
                    <div class="splitter-options">
                         <strong>选择拆分模式:</strong>
                         <div><label><input type="radio" name="split-method" value="byFolder" checked> 按目录层级</label> <span id="splitter-level-container"><label>层数: <input type="number" id="splitter-level" value="1" min="1" style="width: 60px;"></label></span></div>
                         <div><label><input type="radio" name="split-method" value="byCount"> 按文件数量</label> <span id="splitter-chunk-size-container"><label><input type="number" id="splitter-chunk-size" value="500" min="1" style="width: 80px;"> 个文件/份</label></span></div>
                    </div>
                    <div class="splitter-filter-options">
                         <strong>元数据过滤设置 (可选):</strong>
                         <div>
                             <label style="margin-right: 10px;"><input type="checkbox" class="filter-ext" value="nfo">.nfo</label>
                             <label style="margin-right: 10px;"><input type="checkbox" class="filter-ext" value="jpg,jpeg">.jpg/.jpeg</label>
                             <label style="margin-right: 10px;"><input type="checkbox" class="filter-ext" value="png">.png</label>
                             <label>自定义: <input type="text" id="custom-filter-extensions" placeholder="txt,url (逗号隔开)" style="width: 180px;"></label>
                         </div>
                    </div>
                </div>
                <div class="splitter-actions">
                     <button id="splitter-start-btn" class="button-primary" disabled>🚀 开始拆分</button>
                </div>
                <div class="splitter-footer">v${SCRIPT_VERSION} <span style="margin-left: 15px;">鸣谢: @一只氧气</span></div>
            `;
            document.body.appendChild(overlay);
            overlay.appendChild(modalContainer);
            modalContainer.querySelector('#splitter-modal-close-btn').onclick = () => overlay.remove();
            this.rebindMainViewEvents(modalContainer);
        },
        showMergerTool: function() {
            if (document.getElementById('splitter-modal-overlay')) return;
            this.applyStyles();
            const overlay = document.createElement('div');
            overlay.id = 'splitter-modal-overlay';
            overlay.className = 'splitter-overlay';
            const modalContainer = document.createElement('div');
            modalContainer.className = 'splitter-container';
            modalContainer.innerHTML = `
                <span id="splitter-modal-close-btn" class="splitter-modal-close-btn">&times;</span>
                <h1 class="splitter-title">${SCRIPT_NAME_MERGER}</h1>
                <div class="splitter-body">
                     <div id="merger-drop-area" class="splitter-drop-area">
                         <p>拖拽多个 .json 文件到此处</p>
                         <p style="font-size: 0.9em; color: #999;">或</p>
                         <input type="file" id="merger-file-input" accept=".json" multiple style="display: none;">
                         <button id="merger-browse-btn" class="button-secondary" style="margin:0;">点击选择文件</button>
                         <p id="merger-file-status"></p>
                     </div>
                     <div id="merger-file-list-container" style="display:none;">
                         <strong>选择要合并的文件 (第一个将作为元数据基准):</strong>
                         <div class="chunk-list" id="merger-file-list"></div>
                         <div class="merger-summary"><span>已选择: 0 个文件, 0 Bytes</span></div>
                     </div>
                </div>
                <div class="splitter-actions">
                     <button id="merger-start-btn" class="button-primary" disabled>🔄 合并并下载</button>
                </div>
                <div class="splitter-footer">v${SCRIPT_VERSION} <span style="margin-left: 15px;">鸣谢: @一只氧气</span></div>
            `;
            document.body.appendChild(overlay);
            overlay.appendChild(modalContainer);
            modalContainer.querySelector('#splitter-modal-close-btn').onclick = () => overlay.remove();

            // --- Merger Logic ---
            let uploadedFiles = [];

            const dropArea = modalContainer.querySelector('#merger-drop-area');
            const fileInput = modalContainer.querySelector('#merger-file-input');
            const browseBtn = modalContainer.querySelector('#merger-browse-btn');
            const statusDiv = modalContainer.querySelector('#merger-file-status');
            const listContainer = modalContainer.querySelector('#merger-file-list-container');
            const fileListDiv = modalContainer.querySelector('#merger-file-list');
            const summaryEl = modalContainer.querySelector('.merger-summary > span');
            const startBtn = modalContainer.querySelector('#merger-start-btn');

            const renderFileList = () => {
                fileListDiv.innerHTML = uploadedFiles.map((file, index) => `
                    <div class="chunk-item">
                        <input type="checkbox" class="merger-checkbox" id="merger-checkbox-${index}" value="${index}" checked>
                        <label for="merger-checkbox-${index}"><strong>${file.name}</strong></label>
                        <span class="chunk-item-details">${file.data.files.length} 个文件, ${this.formatBytes(file.data.files.reduce((s,f) => s + (Number(f.size) || 0), 0))}</span>
                    </div>
                `).join('');
                listContainer.style.display = 'block';
                startBtn.disabled = uploadedFiles.length < 2;

                const allCheckboxes = fileListDiv.querySelectorAll('.merger-checkbox');
                const updateSummary = () => {
                    const selectedFiles = [...allCheckboxes].filter(cb => cb.checked).map(cb => uploadedFiles[cb.value]);
                    const totalFiles = selectedFiles.reduce((sum, f) => sum + f.data.files.length, 0);
                    const totalSize = selectedFiles.reduce((sum, f) => sum + f.data.files.reduce((s,i) => s + (Number(i.size) || 0), 0), 0);
                    summaryEl.textContent = `已选择: ${totalFiles} 个文件, ${this.formatBytes(totalSize)}`;
                    startBtn.disabled = selectedFiles.length < 2;
                };

                allCheckboxes.forEach(cb => cb.addEventListener('change', updateSummary));
                updateSummary();
            };

            const handleFiles = (files) => {
                if (files.length === 0) return;
                statusDiv.textContent = `正在加载 ${files.length} 个文件...`;
                uploadedFiles = [];
                const promises = [...files].map(file => new Promise((resolve, reject) => {
                    if (file.name.endsWith('.json')) {
                        const reader = new FileReader();
                        reader.onload = e => {
                            try {
                                const data = JSON.parse(e.target.result);
                                if (!data || !Array.isArray(data.files)) {
                                   return reject(`文件 ${file.name} 格式无效!`);
                                }
                                resolve({ name: file.name, data: data });
                            } catch (err) { reject(`文件 ${file.name} 解析失败!`); }
                        };
                        reader.onerror = () => reject(`读取文件 ${file.name} 失败!`);
                        reader.readAsText(file, 'UTF-8');
                    } else {
                        resolve(null);
                    }
                }));

                Promise.all(promises).then(results => {
                    uploadedFiles = results.filter(r => r !== null);
                    if (uploadedFiles.length > 0) {
                        statusDiv.textContent = `成功加载 ${uploadedFiles.length} 个JSON文件。`;
                        renderFileList();
                    } else {
                        this.showError("未能成功加载任何有效的JSON文件。");
                        statusDiv.textContent = '';
                    }
                }).catch(error => {
                    this.showError(error);
                    statusDiv.textContent = '加载失败。';
                });
            };

            browseBtn.onclick = () => fileInput.click();
            fileInput.onchange = (e) => handleFiles(e.target.files);
            dropArea.ondragover = (e) => { e.preventDefault(); e.stopPropagation(); dropArea.classList.add('drag-over'); };
            dropArea.ondragleave = (e) => { e.preventDefault(); e.stopPropagation(); dropArea.classList.remove('drag-over'); };
            dropArea.ondrop = (e) => { e.preventDefault(); e.stopPropagation(); dropArea.classList.remove('drag-over'); handleFiles(e.dataTransfer.files); };

            startBtn.onclick = () => {
                const allCheckboxes = fileListDiv.querySelectorAll('.merger-checkbox');
                const selectedFiles = [...allCheckboxes].filter(cb => cb.checked).map(cb => uploadedFiles[cb.value]);
                const mergedJson = coreLogic.mergeJsonFiles(selectedFiles);
                if (mergedJson) {
                    this.showAlert("合并成功！开始下载...", 3000);
                    this._downloadToFile(JSON.stringify(mergedJson, null, 2), "merged_files.json", "application/json");
                }
            };
        },
        /**
         * Creates a menu item element that mimics the native sidebar items.
         * @param {string} id - The ID for the new list item.
         * @param {string} text - The text to display for the menu item.
         * @param {string} iconHref - The SVG icon's xlink:href value.
         * @returns {HTMLLIElement} - The fully constructed list item element.
         */
        createToolMenuItem: function(id, text, iconHref) {
            const li = document.createElement('li');
            li.id = id;
            li.className = 'ant-menu-item ant-menu-item-only-child';
            li.setAttribute('role', 'menuitem');
            li.style.paddingLeft = '24px'; // Match native padding

            const span = document.createElement('span');
            span.className = 'ant-menu-title-content';

            const a = document.createElement('a');
            a.className = 'menu-item';
            a.href = '#'; // Use a dummy href to make it behave like a link

            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'menu-icon-wrapper';

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'icon menu-icon');
            svg.setAttribute('aria-hidden', 'true');

            const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', iconHref);

            svg.appendChild(use);
            iconWrapper.appendChild(svg);

            const textDiv = document.createElement('div');
            textDiv.className = 'menu-text';
            textDiv.textContent = text;

            a.appendChild(iconWrapper);
            a.appendChild(textDiv);
            span.appendChild(a);
            li.appendChild(span);

            return li;
        },

        /**
         * Injects tool links into the stable left sidebar menu.
         */
        injectSidebarTools: function() {
            const checkInterval = setInterval(() => {
                // More specific selector for the main menu, excluding the bottom one.
                const sidebarMenu = document.querySelector('.side-menu-container > ul.side-menu:not(.bottom-menu)');

                if (sidebarMenu && !document.getElementById('gm-tool-splitter-li')) {
                    // Define short names and icons for the menu items
                    const SHORT_NAME_SPLITTER = "JSON拆分";
                    const SHORT_NAME_MERGER = "JSON合并";
                    const splitterIcon = '#business_share_24_1'; // Use the "Share" icon - it's guaranteed to exist
                    const mergerIcon = '#business_toolcenter_24_1'; // Keep the tool icon

                    // --- Create and inject Splitter tool menu item ---
                    const splitterItem = this.createToolMenuItem('gm-tool-splitter-li', SHORT_NAME_SPLITTER, splitterIcon);
                    splitterItem.onclick = (e) => {
                        e.preventDefault();
                        this.showSplitterTool();
                    };
                    sidebarMenu.appendChild(splitterItem);

                     // --- Create and inject Merger tool menu item ---
                    const mergerItem = this.createToolMenuItem('gm-tool-merger-li', SHORT_NAME_MERGER, mergerIcon);
                    mergerItem.onclick = (e) => {
                        e.preventDefault();
                        this.showMergerTool();
                    };
                    sidebarMenu.appendChild(mergerItem);

                    clearInterval(checkInterval);
                }
            }, 1000);
        },
        fileContent: null,
        originalFileName: '',
        originalFilteredData: null,
        analyzeHandler: function(modalContainer) {
            const jsonData = this.getFilteredJsonData(modalContainer);
            if (!jsonData) { this.showError("请先加载JSON文件。"); return; }
            const analysis = coreLogic.analyzeJsonStructure(jsonData);
            const analysisResultDiv = modalContainer.querySelector('#splitter-analysis-result');
            if (analysis.error) { analysisResultDiv.innerHTML = `<span style="color:red;">分析失败: ${analysis.error}</span>`; }
            else { analysisResultDiv.innerHTML = `<strong>分析结果 (已过滤):</strong><br>- 总文件数: ${analysis.fileCount}<br>- 总大小: ${analysis.totalSize}<br><strong>目录结构预览:</strong><br>${analysis.treeString}`; }
            analysisResultDiv.style.display = 'block';
        },
        startHandler: function(modalContainer) {
            const jsonData = this.getFilteredJsonData(modalContainer);
            if (!jsonData) { this.showError("请先加载JSON文件。"); return; }
            this.originalFilteredData = jsonData;
            const method = modalContainer.querySelector('input[name="split-method"]:checked').value;
            const config = {};
            if (method === 'byFolder') { config.level = parseInt(modalContainer.querySelector('#splitter-level').value, 10); }
            else { config.chunkSize = parseInt(modalContainer.querySelector('#splitter-chunk-size').value, 10); }
            const result = coreLogic.splitImportedJsonFile(jsonData, this.originalFilteredData, this.originalFileName, method, config);
            if(result) { this.showDownloadSelectionView(result); }
        },
        getFilteredJsonData: function(modalContainer) {
            if (!this.fileContent) return null;
            let jsonData;
            try {
                jsonData = JSON.parse(this.fileContent);
            } catch(e) {
                this.showError("JSON文件解析失败，请检查文件内容是否正确。");
                return null;
            }

            const extensionsToFilter = new Set();
            modalContainer.querySelectorAll('.filter-ext:checked').forEach(cb => { cb.value.split(',').forEach(ext => extensionsToFilter.add(ext.trim().toLowerCase())); });
            const customInput = modalContainer.querySelector('#custom-filter-extensions').value;
            if (customInput) { customInput.split(',').forEach(ext => { const trimmedExt = ext.trim().toLowerCase(); if (trimmedExt) extensionsToFilter.add(trimmedExt); }); }

            if (extensionsToFilter.size > 0) {
                const originalCount = jsonData.files.length;
                jsonData.files = jsonData.files.filter(file => {
                    const parts = file.path.split('.');
                    if (parts.length < 2) return true;
                    const extension = parts.pop().toLowerCase();
                    return !extensionsToFilter.has(extension);
                });
                const filteredCount = originalCount - jsonData.files.length;
                if (filteredCount > 0) { uiManager.showAlert(`已根据您的设置过滤掉 ${filteredCount} 个文件。`, 2500); }
            }
            return jsonData;
        },
    };

    // --- Script Entry Point ---
    uiManager.applyStyles();
    uiManager.injectSidebarTools();
})();
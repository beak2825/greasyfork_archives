// ==UserScript==
// @name         iGPSPORT运动记录下载助手
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  iGPSPORT的运动记录fit文件的增加批量下载功能
// @author       Yesaye
// @match        https://app.zh.igpsport.com/sport/history/list
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @icon         https://www.strava.com/icon-strava-chrome-144.png
// @downloadURL https://update.greasyfork.org/scripts/536319/iGPSPORT%E8%BF%90%E5%8A%A8%E8%AE%B0%E5%BD%95%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/536319/iGPSPORT%E8%BF%90%E5%8A%A8%E8%AE%B0%E5%BD%95%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 主题色变量
    const PRIMARY_COLOR = '#ff3c1f';
    const PRIMARY_LIGHT = '#ff6647';
    const SUCCESS_COLOR = '#4CAF50';
    const ERROR_COLOR = '#f44336';
    const INFO_COLOR = '#2196F3';

    let isDownloading = false;

    // 添加自定义样式
    GM_addStyle(`
        .script-download-btn {
            border-radius: 17px !important;
            height: 34px !important;
            padding: 0 15px !important;
            background-color: ${PRIMARY_COLOR} !important;
            color: white !important;
            border: none !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 14px !important;
            font-weight: 400 !important;
            margin-left: 10px !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
        }
        
        .script-download-btn:hover {
            background-color: ${PRIMARY_LIGHT} !important;
            box-shadow: 0 3px 6px rgba(0,0,0,0.15) !important;
            cursor: pointer !important;
        }
        
        .script-download-btn:active {
            transform: translateY(0) !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
        }
        
        .script-download-btn.active {
            background-color: ${INFO_COLOR} !important;
        }
        
        .script-progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background-color: ${PRIMARY_COLOR};
            z-index: 10000;
            transition: width 0.3s ease;
        }
        
        .script-toast {
            position: fixed;
            top: 36px;
            left: 20px;
            background-color: rgba(0,0,0,0.7);
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .script-toast.show {
            opacity: 1;
        }
        
        .script-log-container {
            position: fixed;
            top: 80px;
            left: 20px;
            width: 400px;
            max-height: 400px;
            background-color: rgba(255, 255, 255, 0.95);
            color: #333;
            border-radius: 4px;
            overflow: hidden;
            z-index: 9998;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: none;
            border: 1px solid #eee;
            transform: translateX(-120%);
            transition: transform 0.3s ease-out;
        }
        
        .script-log-container.visible {
            transform: translateX(0);
        }
        
        .script-log-header {
            padding: 8px 12px;
            background-color: ${PRIMARY_COLOR};
            color: white;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .script-log-close {
            cursor: pointer;
            font-size: 18px;
        }
        
        .script-log-content {
            padding: 10px;
            max-height: 350px;
            overflow-y: auto;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.5;
        }
        
        .script-log-item {
            margin-bottom: 5px;
            padding: 3px 5px;
            border-radius: 2px;
            transition: all 0.2s ease;
        }
        
        .script-log-item:hover {
            background-color: rgba(0,0,0,0.05);
        }
        
        .script-log-item.success {
            color: ${SUCCESS_COLOR};
        }
        
        .script-log-item.error {
            color: ${ERROR_COLOR};
        }
        
        .script-log-item.info {
            color: ${INFO_COLOR};
        }
        
        /* 新增当前页下载按钮样式 */
        .script-download-current-page-btn {
            border-radius: 17px !important;
            height: 34px !important;
            padding: 0 12px !important;
            background-color: ${PRIMARY_COLOR} !important;
            color: white !important;
            border: none !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 14px !important;
            font-weight: 400 !important;
            margin-left: 10px !important; /* 与全量按钮保持间距 */
            transition: all 0.3s ease !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
        }
        
        .script-download-current-page-btn:hover {
            background-color: ${PRIMARY_LIGHT} !important;
            box-shadow: 0 3px 6px rgba(0,0,0,0.15) !important;
            cursor: pointer !important;
        }
        
        .script-download-current-page-btn.active {
            transform: translateY(0) !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
            background-color: ${INFO_COLOR} !important;
        }
    `);

    // 日志容器
    let logContainer = null;
    let logContent = null;

    // 初始化日志容器
    function initLogContainer() {
        if (logContainer) return;
        
        logContainer = document.createElement('div');
        logContainer.className = 'script-log-container';
        
        const header = document.createElement('div');
        header.className = 'script-log-header';
        header.textContent = '下载日志';
        
        const closeBtn = document.createElement('div');
        closeBtn.className = 'script-log-close';
        closeBtn.textContent = '×';
        closeBtn.onclick = () => {
            logContainer.classList.remove('visible');
            setTimeout(() => {
                logContainer.style.display = 'none';
            }, 300);
        };
        
        header.appendChild(closeBtn);
        logContainer.appendChild(header);
        
        logContent = document.createElement('div');
        logContent.className = 'script-log-content';
        logContainer.appendChild(logContent);
        
        document.body.appendChild(logContainer);
    }

    // 添加日志
    function addLog(message, type = 'info') {
        initLogContainer();
        
        const logItem = document.createElement('div');
        logItem.className = `script-log-item ${type}`;
        logItem.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        
        logContent.appendChild(logItem);
        logContent.scrollTop = logContent.scrollHeight;
        
        // 显示日志容器
        logContainer.style.display = 'block';
        setTimeout(() => {
            logContainer.classList.add('visible');
        }, 10);
    }

    // 显示提示消息
    function showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = 'script-toast';
        toast.textContent = message;
        
        // 设置类型样式
        if (type === 'error') {
            toast.style.backgroundColor = ERROR_COLOR;
        } else if (type === 'success') {
            toast.style.backgroundColor = SUCCESS_COLOR;
        } else if (type === 'primary') {
            toast.style.backgroundColor = PRIMARY_COLOR;
        } else if (type === 'info') { // 新增info类型背景色
            toast.style.backgroundColor = INFO_COLOR;
        }
        
        document.body.appendChild(toast);
        
        // 显示动画
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // 自动隐藏
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, duration);
        
        // 添加到日志
        addLog(message, type);
    }

    // 获取进度条元素，不存在则创建
    function getProgressBar() {
        let progressBar = document.querySelector('.script-progress-bar');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'script-progress-bar';
            progressBar.style.width = '0%';
            document.body.appendChild(progressBar);
        }
        return progressBar;
    }

    // 从localStorage获取authToken
    function getAuthTokenFromLocalStorage() {
        try {
            const persistState = localStorage.getItem('persist:redux-state');
            if (!persistState) {
                showToast('未找到用户认证信息，请先登录', 'error');
                throw new Error('认证信息缺失');
            }
            
            const parsedState = JSON.parse(persistState);
            const globalState = parsedState.global;
            
            if (!globalState) {
                showToast('用户状态异常，请重新登录', 'error');
                throw new Error('global状态缺失');
            }
            
            const globalData = JSON.parse(globalState);
            const token = globalData.token;
            
            if (!token) {
                showToast('认证Token无效，请重新登录', 'error');
                throw new Error('Token无效');
            }
            
            return token;
            
        } catch (error) {
            console.error('Token获取失败:', error);
            throw error;
        }
    }

    // 获取分页运动记录列表
    async function fetchActivityList(pageNo, authToken) {
        try {
            const response = await fetch(`https://prod.zh.igpsport.com/service/web-gateway/web-analyze/activity/queryMyActivity?pageNo=${pageNo}&pageSize=20&reqType=0&sort=1`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Authorization': `Bearer ${authToken}`,
                    'Origin': 'https://app.zh.igpsport.com',
                    'Referer': 'https://app.zh.igpsport.com/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
                    'timezone': 'Asia/Shanghai',
                    'qiwu-app-version': '1.0.0'
                }
            });
            
            if (!response.ok) {
                showToast(`分页接口请求失败：状态码 ${response.status}`, 'error');
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            if (data.code !== 0) {
                showToast(`接口返回错误：${data.message}`, 'error');
                throw new Error(`业务错误：${data.message}`);
            }
            
            return data;
            
        } catch (error) {
            console.error('分页数据获取失败:', error);
            throw error;
        }
    }

    // 获取运动记录详情
    async function fetchActivityDetail(rideId, authToken) {
        try {
            const response = await fetch(`https://prod.zh.igpsport.com/service/web-gateway/web-analyze/activity/queryActivityDetail/${rideId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Authorization': `Bearer ${authToken}`,
                    'Origin': 'https://app.zh.igpsport.com',
                    'Referer': 'https://app.zh.igpsport.com/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
                    'timezone': 'Asia/Shanghai',
                    'qiwu-app-version': '1.0.0'
                }
            });
            
            if (!response.ok) {
                showToast(`详情接口请求失败：状态码 ${response.status}`, 'error');
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            if (data.code !== 0) {
                showToast(`接口返回错误：${data.message}`, 'error');
                throw new Error(`业务错误：${data.message}`);
            }
            
            return data;
            
        } catch (error) {
            console.error('详情数据获取失败:', error);
            throw error;
        }
    }

    // 格式化日期为 ride-0-2025-03-25-07-35-57.fit 格式
    function formatDateForFileName(dateString) {
        try {
            // 尝试解析日期字符串
            const date = new Date(dateString);
            
            // 验证日期是否有效
            if (isNaN(date.getTime())) {
                // 如果无法解析，直接返回原始字符串（添加安全处理）
                return dateString.replace(/[:\s]/g, '-');
            }
            
            // 格式化为：YYYY-MM-DD-HH-MM-SS
            return [
                date.getFullYear(),
                String(date.getMonth() + 1).padStart(2, '0'),
                String(date.getDate()).padStart(2, '0'),
                String(date.getHours()).padStart(2, '0'),
                String(date.getMinutes()).padStart(2, '0'),
                String(date.getSeconds()).padStart(2, '0')
            ].join('-');
            
        } catch (error) {
            console.error('日期格式化失败:', error, '原始值:', dateString);
            // 发生错误时返回安全的文件名
            return `unknown-date-${Date.now()}`;
        }
    }

    // 下载fit文件
    async function downloadFitFile(fitUrl, startTime, rideId) {
        try {
            // 格式化为要求的文件名：ride-0-2025-03-25-07-35-57.fit
            const formattedDate = formatDateForFileName(startTime);
            const fileName = `ride-0-${formattedDate}.fit`;
            addLog(`准备下载: ${fileName}`, 'info');
            
            const response = await fetch(fitUrl);
            if (!response.ok) {
                throw new Error(`下载文件失败，状态码: ${response.status}`);
            }
            
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            addLog(`✅ 下载完成: ${fileName}`, 'success');
            return { success: true, fileName };
            
        } catch (error) {
            const errorMsg = `❌ 下载失败 (ID:${rideId}): ${error.message}`;
            addLog(errorMsg, 'error');
            return { success: false, error: error.message };
        }
    }

    // 主下载逻辑 - 全量下载
    async function downloadAllActivities() {
        if (isDownloading) {
            showToast('正在下载中，请稍后...', 'info');
            return;
        }
        isDownloading = true;
        
        const downloadBtn = document.querySelector('.script-download-btn');
        if (!downloadBtn) return;
        
        // 按钮状态切换
        downloadBtn.classList.add('active');
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<span class="ant-btn-icon"><i class="fa fa-spinner fa-spin"></i></span><span>正在下载...</span>';
        
        try {
            const progressBar = getProgressBar();
            progressBar.style.width = '0%';
        

            // 获取Token
            const authToken = getAuthTokenFromLocalStorage();
            if (!authToken) {
                throw new Error('认证Token获取失败');
            }
            
            // 获取总页数
            addLog('正在获取运动记录列表...', 'info');
            const firstPageData = await fetchActivityList(1, authToken);
            const totalPages = firstPageData.data.totalPage;
            const totalItems = firstPageData.data.totalRows;
            
            if (totalItems === 0) {
                showToast('没有可下载的运动记录数据', 'info');
                throw new Error('没有可下载的运动记录数据');
            }
            
            showToast(`开始下载 ${totalItems} 个运动记录文件`, 'primary', 5000);
            addLog(`发现 ${totalItems} 个运动记录文件（共${totalPages}页）`, 'info');
            
            let processedItems = 0;
            let failedItems = [];
            
            // 处理所有分页
            for (let page = 1; page <= totalPages; page++) {
                addLog(`📄 正在处理第 ${page}/${totalPages} 页...`, 'info');
                
                const pageData = await fetchActivityList(page, authToken);
                const items = pageData.data.rows;
                
                // 处理当前页的每个运动记录
                for (const item of items) {
                    try {
                        addLog(`🔍 获取运动记录 ${item.rideId} 详情...`, 'info');
                        const detail = await fetchActivityDetail(item.rideId, authToken);
                        const { fitUrl, startTime } = detail.data;
                        
                        if (!fitUrl || !startTime) {
                            throw new Error('缺少必要字段');
                        }
                        
                        const result = await downloadFitFile(fitUrl, startTime, item.rideId);
                        if (!result.success) {
                            throw new Error(result.error);
                        }
                        
                        processedItems++;
                        const progress = Math.round((processedItems / totalItems) * 100);
                        progressBar.style.width = `${progress}%`;
                        
                        // 下载间隔，避免请求过于频繁
                        await new Promise(resolve => setTimeout(resolve, 800));
                        
                    } catch (error) {
                        failedItems.push({
                            rideId: item.rideId,
                            error: error.message
                        });
                    }
                }
            }
            
            // 显示最终结果
            if (failedItems.length > 0) {
                showToast(`下载完成，成功 ${processedItems - failedItems.length} 个，失败 ${failedItems.length} 个`, 'info', 8000);
                addLog(`⚠️ 下载完成，成功 ${processedItems - failedItems.length} 个，失败 ${failedItems.length} 个`, 'info');
                
                if (failedItems.length > 0) {
                    addLog('失败项目列表:', 'error');
                    failedItems.forEach((item, index) => {
                        addLog(`  [${index+1}] ID:${item.rideId} - ${item.error}`, 'error');
                    });
                }
            } else {
                showToast(`全部 ${processedItems} 个运动记录文件下载成功！`, 'success', 8000);
                addLog(`🎉 全部 ${processedItems} 个运动记录文件下载成功！`, 'success');
            }
            
        } catch (error) {
            showToast(`操作失败: ${error.message}`, 'error', 8000);
            addLog(`💥 操作失败: ${error.message}`, 'error');
            console.error('下载过程中发生错误:', error);
        } finally {
            // 重置按钮状态
            const downloadBtn = document.querySelector('.script-download-btn');
            if (downloadBtn) {
                downloadBtn.classList.remove('active');
                downloadBtn.disabled = false;
                downloadBtn.innerHTML = '<span class="ant-btn-icon"><i class="fa fa-download"></i></span><span>下载全部</span>';
            }
            
            // 重置进度条
            const progressBar = getProgressBar();
            setTimeout(() => {
                progressBar.style.width = '0%';
            }, 3000);
            isDownloading = false; // 重置下载状态
        }
    }

    // 新增：获取当前页码函数
    function getCurrentPageNumber() {
        const activePageElement = document.getElementsByClassName('ant-pagination-item-active')[0];
        if (!activePageElement) {
            showToast('当前页信息获取失败，请检查分页组件', 'error');
            return null;
        }
        const pageNumber = activePageElement.getAttribute('title') || activePageElement.textContent;
        return parseInt(pageNumber, 10);
    }

    // 新增：下载当前页运动记录主函数
    async function downloadCurrentPageActivities() {
        if (isDownloading) {
            showToast('正在下载中，请稍后...', 'info');
            return;
        }
        isDownloading = true;

        const currentPage = getCurrentPageNumber();
        if (!currentPage) return;

        const downloadBtn = document.querySelector(`.script-download-current-page-btn`);
        if (!downloadBtn) return;

        // 按钮状态切换
        downloadBtn.classList.add('active');
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<span class="ant-btn-icon"><i class="fa fa-spinner fa-spin"></i></span><span>下载中...</span>';

        try {
            const progressBar = getProgressBar();
            progressBar.style.width = '0%';

            // 清空当前日志（可选）
            // if (logContent) logContent.innerHTML = '';

            const authToken = getAuthTokenFromLocalStorage();
            if (!authToken) throw new Error('认证Token获取失败');

            // 获取当前页数据
            addLog(`正在获取第 ${currentPage} 页运动记录列表...`, 'info');
            const pageData = await fetchActivityList(currentPage, authToken);
            const items = pageData.data.rows;
            const totalItems = items.length;

            if (totalItems === 0) {
                showToast(`第 ${currentPage} 页没有运动记录数据`, 'info');
                throw new Error('无运动记录数据');
            }

            showToast(`开始下载当前页 ${totalItems} 个运动记录文件`, 'primary', 5000); // 使用info类型提示
            addLog(`当前页发现 ${totalItems} 个运动记录文件`, 'info');

            let processedItems = 0;
            let failedItems = [];

            // 处理当前页所有运动记录
            for (const item of items) {
                try {
                    addLog(`🔍 获取运动记录 ${item.rideId} 详情...`, 'info');
                    const detail = await fetchActivityDetail(item.rideId, authToken);
                    const { fitUrl, startTime } = detail.data;

                    if (!fitUrl || !startTime) throw new Error('缺少必要字段');

                    const result = await downloadFitFile(fitUrl, startTime, item.rideId);
                    if (!result.success) throw new Error(result.error);

                    processedItems++;
                    const progress = Math.round((processedItems / totalItems) * 100);
                    progressBar.style.width = `${progress}%`;

                    // 控制请求间隔
                    await new Promise(resolve => setTimeout(resolve, 800));

                } catch (error) {
                    failedItems.push({
                        rideId: item.rideId,
                        error: error.message
                    });
                }
            }

            // 显示结果
            if (failedItems.length > 0) {
                showToast(`当前页下载完成，成功 ${processedItems - failedItems.length} 个，失败 ${failedItems.length} 个`, 'info', 8000);
                addLog(`⚠️ 第 ${currentPage} 页下载结果：成功 ${processedItems - failedItems.length} 个，失败 ${failedItems.length} 个`, 'info');
                failedItems.forEach((item, index) => {
                    addLog(`  [${index+1}] ID:${item.rideId} - ${item.error}`, 'error');
                });
            } else {
                showToast(`第 ${currentPage} 页 ${processedItems} 个运动记录文件全部下载成功！`, 'success', 8000);
                addLog(`🎉 第 ${currentPage} 页下载完成：全部成功`, 'success');
            }

        } catch (error) {
            showToast(`当前页下载失败: ${error.message}`, 'error', 8000);
            addLog(`💥 第 ${currentPage} 页下载失败: ${error.message}`, 'error');
            console.error('当前页下载错误:', error);
        } finally {
            // 重置按钮状态
            const downloadBtn = document.querySelector(`.script-download-current-page-btn`);
            if (downloadBtn) {
                downloadBtn.classList.remove('active');
                downloadBtn.disabled = false;
                downloadBtn.innerHTML = '<span class="ant-btn-icon"><i class="fa fa-download"></i></span><span>下载当前页</span>';
            }

            // 重置进度条
            const progressBar = getProgressBar();
            setTimeout(() => progressBar.style.width = '0%', 3000);
            isDownloading = false; // 重置下载状态
        }
    }

    // 修改：按钮添加函数，同时创建当前页下载按钮
    function addDownloadButton() {
        const importButton = document.querySelector('.global-tabbar button.ant-btn-primary');
        if (!importButton) {
            setTimeout(addDownloadButton, 500);
            return;
        }

        // 添加原有全量下载按钮
        if (!document.querySelector('.script-download-btn')) {
            const fullButton = document.createElement('button');
            fullButton.className = 'script-download-btn ant-btn ant-btn-primary ant-btn-color-primary ant-btn-variant-solid';
            fullButton.innerHTML = '<span class="ant-btn-icon"><i class="fa fa-download"></i></span><span>下载全部</span>';
            fullButton.onclick = downloadAllActivities;
            importButton.parentNode.insertBefore(fullButton, importButton.nextSibling);
        }

        // 添加当前页下载按钮
        if (!document.querySelector(`.script-download-current-page-btn`)) {
            const currentButton = document.createElement('button');
            currentButton.className = `script-download-current-page-btn ant-btn ant-btn-info ant-btn-variant-solid`;
            currentButton.innerHTML = '<span class="ant-btn-icon"><i class="fa fa-download"></i></span><span>下载当前页</span>';
            currentButton.onclick = downloadCurrentPageActivities;
            // 插入到全量按钮之后
            const fullButton = document.querySelector('.script-download-btn');
            fullButton.parentNode.insertBefore(currentButton, fullButton.nextSibling || importButton.nextSibling);
        }
    }

    // 保持原有页面监听逻辑
    window.addEventListener('load', () => {
        addDownloadButton();
        new MutationObserver(() => addDownloadButton()).observe(document.body, { childList: true, subtree: true });
    });

})();
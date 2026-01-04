
// ==UserScript==
// @name         头条数据采集最终版1
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动采集头条文章数据，支持本地存储和导出
// @author       李二狗
// @match        *://*.toutiao.com/*
// @match        https://www.toutiao.com/*
// @match        https://www.toutiao.com/
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @connect      ergou.dyzys.com
// @connect      *

// @run-at       document-start
// @noframes     true
// @downloadURL https://update.greasyfork.org/scripts/519958/%E5%A4%B4%E6%9D%A1%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86%E6%9C%80%E7%BB%88%E7%89%881.user.js
// @updateURL https://update.greasyfork.org/scripts/519958/%E5%A4%B4%E6%9D%A1%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86%E6%9C%80%E7%BB%88%E7%89%881.meta.js
// ==/UserScript==
const DataManager = {
    STORAGE_KEY: 'toutiao_data',
    SETTINGS_KEY: 'toutiao_settings',
    EXPIRY_TIME: 72 * 60 * 60 * 1000,
    SERVER_CONFIG: {
        API_URL: 'http://ergou.dyzys.com',
        SYNC_INTERVAL: 10 * 60 * 1000,
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 30 * 1000,
        TIMEOUT: 30000,
        HEADERS: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    },
    UPLOAD_QUEUE_KEY: 'toutiao_upload_queue',
    UPLOAD_LOCK_KEY: 'toutiao_upload_lock',
    LAST_UPLOAD_TIME_KEY: 'toutiao_last_upload',
    AUTH: {
        TOKEN_KEY: 'toutiao_token',
        USERNAME_KEY: 'toutiao_username'
    },
    consoleTimer: null,

    getSettings() {
        const settings = localStorage.getItem(this.SETTINGS_KEY);
        if (settings) {
            return JSON.parse(settings);
        }
        return {
            timeLimit: 14,
            readCount: 2000
        };
    },

    saveSettings(settings) {
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    },

    async saveData(newData) {
        // 简化日志输出，只保留关键信息
        console.log(`捕获新数据: ${newData.length} 条`);

    let currentData = this.getData().articles;

    // 移除详细的文章比对日志，只输出变更统计
    const changes = {
        new: 0,
        updated: 0,
        unchanged: 0
    };

    const settings = this.getSettings();
    const currentTime = Date.now();
    const timeLimit = settings.timeLimit * 60 * 60 * 1000;
    const quickTimeLimit = 1.5 * 60 * 60 * 1000;

    // 添加数据验证和日志
    if (!Array.isArray(newData)) {
        console.error('无效的数据格式:', newData);
        return;
    }

    const filteredData = newData.filter(article => {
        const articleTime = article.publish_time * 1000;
        const timeDiff = currentTime - articleTime;
        const readCount = parseInt(String(article.read_count).replace(/[^\d]/g, '')) || 0;

        return timeDiff <= timeLimit && readCount >= settings.readCount;
    });

    // 获取当前数据
    const dataMap = new Map(currentData.map(article => [article.article_url, article]));

    // 存储需要更新的数据
    const changedArticles = [];

    // 检查是否有新数据或更新
    let hasChanges = false;
    filteredData.forEach(article => {
        if (article.article_url) {
            const existingArticle = dataMap.get(article.article_url);

            if (!existingArticle) {
                changes.new++;
                hasChanges = true;
                changedArticles.push(article);
                dataMap.set(article.article_url, article);
            } else if (
                parseInt(String(existingArticle.read_count).replace(/[^\d]/g, '')) !==
                parseInt(String(article.read_count).replace(/[^\d]/g, '')) ||
                parseInt(String(existingArticle.comment_count).replace(/[^\d]/g, '')) !==
                parseInt(String(article.comment_count).replace(/[^\d]/g, ''))
            ) {
                changes.updated++;
                hasChanges = true;
                changedArticles.push(article);
                dataMap.set(article.article_url, article);
            } else {
                changes.unchanged++;
            }
        }
    });

    // 只输出变更统计
    console.log('数据变更统计:', changes);

    // 确保更新逻辑执行
    if (hasChanges) {
        const updatedData = {
            timestamp: Date.now(),
            articles: Array.from(dataMap.values())
        };

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedData));
        this.updateUI();

            // 服务器同步
            console.log('准备同步到服务器:', changedArticles.length, '条数据');
            try {
                await this.syncToServer(changedArticles);
                console.log('服务器同步成功');
            } catch (error) {
                console.error('服务器同步失败:', error);
                // 添加错误详情
                console.error('错误详情:', {
                    错误消息: error.message,
                    错误堆栈: error.stack
                });
            }
        } else {
            console.log('未检测到数据变化，跳过更新');
        }
    },

    getData() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (!data) return { articles: [] };

        const parsedData = JSON.parse(data);
        if (Date.now() - parsedData.timestamp > this.EXPIRY_TIME) {
            this.clearData();
            return { articles: [] };
        }
        return parsedData;
    },

    clearData() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.updateUI();
    },

    getRemainingTime() {
        const data = this.getData();
        if (data.timestamp) {
            const remaining = this.EXPIRY_TIME - (Date.now() - data.timestamp);
            return remaining > 0 ? remaining : 0;
        }
        return 0;
    },

    updateUI() {
        const dataCount = document.getElementById('data-count');
        const timeRemaining = document.getElementById('time-remaining');
        if (dataCount && timeRemaining) {
            const data = this.getData();
            dataCount.textContent = `已采集数据: ${data.articles.length} 条`;

            const remaining = this.getRemainingTime();
            const hours = Math.floor(remaining / (60 * 60 * 1000));
            const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
            timeRemaining.textContent = `有效期剩余: ${hours}小时${minutes}分钟`;
        }
    },

    async mergeAndDownload() {
        const choice = confirm("选择 '确定' 更新现有文件，选择 '取消' 生成新文件。");

        if (choice) {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.xlsx';

            fileInput.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                try {
                    const workbook = await this.readExcelFile(file);
                    const currentData = this.getData().articles;
                    const mergedWorkbook = this.mergeData(workbook, currentData);
                    this.downloadExcel(mergedWorkbook, file.name);
                } catch (error) {
                    console.error('处理Excel文件时出错:', error);
                    alert('处理文件时出错，请重试');
                }
            };

            fileInput.click();
        } else {
            // 生成新文件
            const currentData = this.getData().articles;
            const newWorkbook = this.createNewWorkbook(currentData);
            this.downloadExcel(newWorkbook, 'new_toutiao_data.xlsx');
        }
    },

    async readExcelFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    resolve(workbook);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    },

    mergeData(workbook, newArticles) {
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const existingData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const urlIndex = existingData[0].findIndex(col => col === '文章链接');

        // 获取现有的样式信息
        const styles = {};
        Object.keys(sheet).forEach(cell => {
            if (cell[0] !== '!') {  // 跳过特殊字段
                if (sheet[cell].s) {  // 如果单元格有样式
                    styles[cell] = sheet[cell].s;
                }
            }
        });

        // 创建URL到行索引的映射
        const urlToRowMap = new Map();
        for (let i = 1; i < existingData.length; i++) {
            const url = existingData[i][urlIndex];
            if (url) {
                urlToRowMap.set(url, i);
            }
        }

        // 更新或添加新数据
        newArticles.forEach(article => {
            if (!article.article_url) return;

            const newRow = [
                article.title || '',
                article.source || '',
                article.publish_time ? new Date(article.publish_time * 1000).toLocaleString() : '',
                article.read_count || '0',
                article.comment_count || '0',
                article.article_url || '',
                article.abstract || ''
            ];

            const existingRowIndex = urlToRowMap.get(article.article_url);
            if (existingRowIndex !== undefined) {
                // 更新现有行，保持原有样式
                for (let i = 0; i < newRow.length; i++) {
                    const cellAddress = XLSX.utils.encode_cell({ r: existingRowIndex, c: i });
                    const existingCell = sheet[cellAddress] || {};
                    sheet[cellAddress] = {
                        ...existingCell,
                        v: newRow[i],
                        w: newRow[i].toString(),
                        s: styles[cellAddress] // 保原有样式
                    };
                }
            } else {
                // 添加新行
                const newRowIndex = existingData.length;
                newRow.forEach((value, colIndex) => {
                    const cellAddress = XLSX.utils.encode_cell({ r: newRowIndex, c: colIndex });
                    sheet[cellAddress] = {
                        v: value,
                        w: value.toString(),
                        t: typeof value === 'number' ? 'n' : 's'
                    };
                });
                existingData.push(newRow);
            }
        });

        // 更新范围
        const range = XLSX.utils.decode_range(sheet['!ref']);
        range.e.r = Math.max(range.e.r, existingData.length - 1);
        sheet['!ref'] = XLSX.utils.encode_range(range);

        // 保持列宽设置
        if (sheet['!cols']) {
            workbook.Sheets[workbook.SheetNames[0]]['!cols'] = sheet['!cols'];
        }

        // 保持行高设置
        if (sheet['!rows']) {
            workbook.Sheets[workbook.SheetNames[0]]['!rows'] = sheet['!rows'];
        }

        return workbook;
    },

    createNewWorkbook(articles) {
        const headers = ['标题', '作者', '发布时间', '阅读量', '评论量', '文章链接', '要'];
        const data = [headers];

        articles.forEach(article => {
            data.push([
                article.title || '',
                article.source || '',
                article.publish_time ? new Date(article.publish_time * 1000).toLocaleString() : '',
                article.read_count || '0',
                article.comment_count || '0',
                article.article_url || '',
                article.abstract || ''
            ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        return wb;
    },

    downloadExcel(workbook, fileName) {
        // 设置写入选项以保持样式
        const wopts = {
            bookType: 'xlsx',
            bookSST: false,
            type: 'array',
            cellStyles: true
        };

        const wbout = XLSX.write(workbook, wopts);
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName.replace('.csv', '.xlsx');
        link.click();
        URL.revokeObjectURL(link.href);
    },

    async syncToServer(articles) {
        try {
            // 确保获取正确的用户名
            const username = String(localStorage.getItem('toutiao_username') || 'default');
            console.log('准备同步数据到服务器');
            console.log('用户名:', username);
            console.log('用户名类型:', typeof username);

            // 构建请求数据
            const requestData = {
                username: username,  // 直接使用字符串
                articles: articles
            };

            // 打印最终发送的数据
            console.log('发送的数据:', JSON.stringify(requestData));

            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${this.SERVER_CONFIG.API_URL}/sync`,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: JSON.stringify(requestData),  // 确保正确序列化
                    onload: (response) => {
                        console.log('收到服务器响应:', response.responseText);
                        resolve(response);
                    },
                    onerror: (error) => {
                        console.error('请求错误:', error);
                        reject(error);
                    }
                });
            });

            if (response.status === 200) {
                return JSON.parse(response.responseText);
            } else {
                console.error('服务器返回错误:', response.responseText);
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.error('同步失败:', error);
            throw error;
        }
    },

    async testConnection() {
        console.log('测试服务器连接...');
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${this.SERVER_CONFIG.API_URL}/stats`,
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Cache-Control': 'no-cache'
                },
                timeout: this.SERVER_CONFIG.TIMEOUT,
                onload: (response) => {
                    console.log('连接测试响应:', {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });

                    const statsDiv = document.getElementById('server-stats');
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (statsDiv) {
                                statsDiv.innerHTML = `
                                    <p>服务器状态: <span class="status-success">在线</span></p>
                                    <p>总文章数: ${data.totalArticles || 0}</p>
                                    <p>最后更新: ${data.lastUpdate ? new Date(data.lastUpdate).toLocaleString() : '未更新'}</p>
                                `;
                            }
                            resolve(true);
                        } catch (error) {
                            if (statsDiv) {
                                statsDiv.innerHTML = `
                                    <p>服务器状态: <span class="status-error">错误</span></p>
                                    <p>错误信息: 数据格式错误</p>
                                `;
                            }
                            resolve(false);
                        }
                    } else {
                        if (statsDiv) {
                            statsDiv.innerHTML = `
                                <p>服务器状态: <span class="status-error">离线</span></p>
                                <p>错误代码: ${response.status}</p>
                            `;
                        }
                        resolve(false);
                    }
                },
                onerror: (error) => {
                    console.error('连接测试错误:', error);
                    const statsDiv = document.getElementById('server-stats');
                    if (statsDiv) {
                        statsDiv.innerHTML = `
                            <p>服务器状态: <span class="status-error">连接失败</span></p>
                            <p>错误信息: 无法连接到服务器</p>
                        `;
                    }
                    resolve(false);
                },
                ontimeout: () => {
                    console.error('连接测试超时');
                    const statsDiv = document.getElementById('server-stats');
                    if (statsDiv) {
                        statsDiv.innerHTML = `
                            <p>服务器状态: <span class="status-error">连接超时</span></p>
                            <p>错误信息: 服务器响应超时</p>
                        `;
                    }
                    resolve(false);
                }
            });
        });
    },

    async updateServerStats() {
        console.log('更新服务器状态...');
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${this.SERVER_CONFIG.API_URL}/stats`,
                headers: {
                    'Accept': 'application/json'
                },
                onload: function(response) {
                    const statsDiv = document.getElementById('server-stats');
                    if (response.status === 200) {
                        try {
                            const stats = JSON.parse(response.responseText);
                            if (statsDiv) {
                                statsDiv.innerHTML = `
                                    <p>服务器状态: <span style="color: #4CAF50;">在线</span></p>
                                    <p>总文章数: ${stats.totalArticles || 0}</p>
                                    <p>最后更新: ${stats.lastUpdate ? new Date(stats.lastUpdate).toLocaleString() : '未更新'}</p>
                                `;
                            }
                            resolve(true);
                        } catch (error) {
                            console.error('解析服务器状态失败:', error);
                            if (statsDiv) {
                                statsDiv.innerHTML = `
                                    <p>服务器状态: <span style="color: #f44336;">错误</span></p>
                                    <p>错误信息: 数据格式错误</p>
                                `;
                            }
                            resolve(false);
                        }
                    } else {
                        if (statsDiv) {
                            statsDiv.innerHTML = `
                                <p>服务器状态: <span style="color: #f44336;">离线</span></p>
                                <p>错误代码: ${response.status}</p>
                            `;
                        }
                        resolve(false);
                    }
                },
                onerror: function(error) {
                    console.error('获取服务器状态失败:', error);
                    const statsDiv = document.getElementById('server-stats');
                    if (statsDiv) {
                        statsDiv.innerHTML = `
                            <p>服务器状态: <span style="color: #f44336;">连接失败</span></p>
                            <p>错误信息: 无法连接到服务器</p>
                        `;
                    }
                    resolve(false);
                },
                timeout: 5000
            });
        });
    },

    async fetchFromServer() {
        console.log('开始从服务器获取数据...');
        let retryCount = 0;

        const tryFetch = () => new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${this.SERVER_CONFIG.API_URL}/data`,
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Cache-Control': 'no-cache'
                },
                timeout: this.SERVER_CONFIG.TIMEOUT,
                onload: async (response) => {
                    console.log('服务器响应:', {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });

                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.status === 'success' && Array.isArray(data.articles)) {
                                await this.saveData(data.articles);
                                console.log(`成功获得 ${data.articles.length} 条文章`);
                                resolve(true);
                            } else {
                                console.error('无效的数据格式:', data);
                                resolve(false);
                            }
                        } catch (error) {
                            console.error('解析服务器数据失败:', error);
                            reject(new Error('数据解析失败'));
                        }
                    } else {
                        reject(new Error(`HTTP错误: ${response.status}`));
                    }
                },
                onerror: (error) => {
                    console.error('获取数据请求错误:', error);
                    reject(new Error('网络请求失败'));
                },
                ontimeout: () => {
                    console.error('获取数据请求超时');
                    reject(new Error('请求超时'));
                }
            });
        });

        while (retryCount < this.SERVER_CONFIG.RETRY_ATTEMPTS) {
            try {
                return await tryFetch();
            } catch (error) {
                retryCount++;
                console.log(`第 ${retryCount} 次重试...`);
                if (retryCount < this.SERVER_CONFIG.RETRY_ATTEMPTS) {
                    await new Promise(resolve => setTimeout(resolve, this.SERVER_CONFIG.RETRY_DELAY));
                } else {
                    throw error;
                }
            }
        }
    },

    applyFilter(timeLimit, readCount) {
        const settings = {
            timeLimit: timeLimit,
            readCount: readCount
        };
        this.saveSettings(settings);

        // 重新应用过滤器到现有数据
        const currentData = this.getData();
        const currentTime = Date.now();
        const timeLimitMs = timeLimit * 60 * 60 * 1000;

        const filteredArticles = currentData.articles.filter(article => {
            const articleTime = article.publish_time * 1000;
            const timeDiff = currentTime - articleTime;
            const articleReadCount = parseInt(article.read_count) || 0;

            return timeDiff <= timeLimitMs && articleReadCount >= readCount;
        });

        const updatedData = {
            timestamp: currentData.timestamp,
            articles: filteredArticles
        };

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedData));
        this.updateUI();

        console.log(`过滤条件已更新: ${timeLimit}小时内, 最低阅读量${readCount}`);
        console.log(`过滤后剩余文章: ${filteredArticles.length}条`);
    },

    // 添加启动自动同步的方法
    startAutoSync() {
        console.log(`启动自动同步，间隔: ${this.SERVER_CONFIG.SYNC_INTERVAL / 1000}秒`);

        this.syncInterval = setInterval(async () => {
            try {
                console.log('执行自动同步...');
                const data = this.getData();
                if (data.articles && data.articles.length > 0) {
                    // 获取设置并应用筛选
                    const settings = this.getSettings();
                    const currentTime = Date.now();
                    const timeLimit = settings.timeLimit * 60 * 60 * 1000;
                    const quickTimeLimit = 1.5 * 60 * 60 * 1000; // 1.5小时的毫秒数

                    const filteredArticles = data.articles.filter(article => {
                        const articleTime = article.publish_time * 1000;
                        const timeDiff = currentTime - articleTime;
                        const readCount = parseInt(article.read_count) || 0;

                        // 条件1: 符合用户设置的时间和阅读量设置
                        const matchesUserSettings = timeDiff <= timeLimit && readCount >= settings.readCount;

                        // 条件2: 1.5小时内且阅读量超过1000
                        const matchesQuickFilter = timeDiff <= quickTimeLimit && readCount >= 1000;

                        // 满足任一条件即可
                        return matchesUserSettings || matchesQuickFilter;
                    });

                    // 添加详细的日志输出
                    console.log('筛选条件:', {
                        condition1: `${settings.timeLimit}小时内，阅读量>=${settings.readCount}`,
                        condition2: '1.5小时内，阅读量>=1000',
                        totalArticles: data.articles.length
                    });

                    console.log('筛选结果:', {
                        beforeFilter: data.articles.length,
                        afterFilter: filteredArticles.length,
                        filtered: data.articles.length - filteredArticles.length
                    });

                    if (filteredArticles.length > 0) {
                        await this.syncToServer(filteredArticles);
                        console.log(`自动同步完成，共同步 ${filteredArticles.length} 条符条件的数据`);
                    } else {
                        console.log('没有符合筛选条件的数据需要同步');
                    }
                } else {
                    console.log('没有数据需要同步');
                }
            } catch (error) {
                console.error('自动同步失败:', error);
            }
        }, this.SERVER_CONFIG.SYNC_INTERVAL);

        // 添加页面关闭时的清理
        window.addEventListener('beforeunload', () => {
            if (this.syncInterval) {
                clearInterval(this.syncInterval);
            }
        });
    },

    // 停止自动同步的方法
    stopAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
            console.log('自动同步已停止');
        }
    },

    // 获取上传队列
    getUploadQueue() {
        return GM_getValue(this.UPLOAD_QUEUE_KEY, []);
    },

    // 保存上传队列
    saveUploadQueue(queue) {
        GM_setValue(this.UPLOAD_QUEUE_KEY, queue);
    },

    // 添加数据到上传队列
    addToUploadQueue(articles) {
        const queue = this.getUploadQueue();
        const timestamp = Date.now();

        // 为每条数据添加唯一标识和时间戳
        const newItems = articles.map(article => ({
            id: `${article.article_url}_${timestamp}`,
            data: article,
            timestamp,
            retries: 0
        }));

        queue.push(...newItems);
        this.saveUploadQueue(queue);

        // 立即尝试上传
        this.processUploadQueue();
    },

    // 使用 GM_xmlhttpRequest 上传数据
    async uploadData(data) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: this.SERVER_CONFIG.API_URL + '/data',
                data: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000, // 30秒超时
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(true);
                    } else {
                        reject(new Error(`Upload failed: ${response.status}`));
                    }
                },
                onerror: (error) => reject(error),
                ontimeout: () => reject(new Error('Upload timeout'))
            });
        });
    },

    // 处理上传队列
    async processUploadQueue() {
        // 检查是否有其他标签页正在上传
        if (this.isUploadLocked()) {
            console.log('其他标签页正在处理上传队列');
            return;
        }

        // 设置上传锁
        this.setUploadLock();

        try {
            let queue = this.getUploadQueue();
            console.log(`开始处理上传队列，共 ${queue.length} 条数据`);

            while (queue.length > 0) {
                const batch = queue.slice(0, 10); // 每次处理10条

                try {
                    await this.uploadData(batch.map(item => item.data));
                    console.log(`成功上传 ${batch.length} 条数据`);

                    // 更新队列
                    queue = queue.slice(batch.length);
                    this.saveUploadQueue(queue);

                    // 更新最后上传时间
                    GM_setValue(this.LAST_UPLOAD_TIME_KEY, Date.now());
                } catch (error) {
                    console.error('上传数据失败:', error);

                    // 更新重试次数
                    batch.forEach(item => item.retries++);

                    // 移除重试超过3次的数据
                    queue = queue.filter(item => item.retries < 3);
                    this.saveUploadQueue(queue);

                    // 等待5秒后继续
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }
        } finally {
            this.releaseUploadLock();
        }
    },

    // 设置上传锁
    setUploadLock() {
        GM_setValue(this.UPLOAD_LOCK_KEY, {
            timestamp: Date.now(),
            tabId: this.getTabId()
        });
    },

    // 检查是否有上传锁
    isUploadLocked() {
        const lock = GM_getValue(this.UPLOAD_LOCK_KEY);
        if (!lock) return false;

        // 如果锁超过5分钟，认为是过期的
        if (Date.now() - lock.timestamp > 5 * 60 * 1000) {
            this.releaseUploadLock();
            return false;
        }

        return lock.tabId !== this.getTabId();
    },

    // 释放上传锁
    releaseUploadLock() {
        GM_setValue(this.UPLOAD_LOCK_KEY, null);
    },

    // 初始化方法
    init() {
        // 检查并处理未完成的上传
        this.processUploadQueue();

        // 定期检查上传队列
        setInterval(() => {
            this.processUploadQueue();
        }, 30000); // 每30秒检查一次

        // 在页面关闭前尝试最后一次上传
        window.addEventListener('beforeunload', () => {
            const queue = this.getUploadQueue();
            if (queue.length > 0) {
                return '还有数据正在上传，确定要闭吗？';
            }
        });

        // 启动登录状态维护
        setInterval(() => {
            this.maintainLoginState();
        }, this.LOGIN_CONFIG.AUTO_LOGIN_INTERVAL);

        // 启动cookie刷新
        setInterval(() => {
            this.refreshCookies();
        }, this.LOGIN_CONFIG.COOKIE_REFRESH_INTERVAL);

        // 监听筛选条件变化
        document.addEventListener('click', (e) => {
            if (e.target.closest('.filter-option')) {
                setTimeout(() => {
                    this.saveFilterState();
                }, 500);
            }
        });

        // 页面加载完成后恢复筛选条件
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.restoreFilterState();
            }, 1000);
        });
    },

    // 添加用认证相关方法
    getAuthToken() {
        return localStorage.getItem(this.AUTH.TOKEN_KEY);
    },

    getUsername() {
        return localStorage.getItem(this.AUTH.USERNAME_KEY);
    },

    isLoggedIn() {
        return !!localStorage.getItem(this.AUTH.USERNAME_KEY);
    },

    // 保存筛选条件
    saveFilterState() {
        const filters = {
            timeLimit: document.getElementById('time-limit').value,
            readCount: document.getElementById('read-count').value
        };
        localStorage.setItem('filter_state', JSON.stringify(filters));
        console.log('已保存筛选条件:', filters);
    },

    // 恢复筛选条件
    restoreFilterState() {
        const savedFilters = localStorage.getItem('filter_state');
        if (savedFilters) {
            try {
                const filters = JSON.parse(savedFilters);
                // 设置时间范围
                const timeLimitInput = document.getElementById('time-limit');
                if (timeLimitInput) {
                    timeLimitInput.value = filters.timeLimit || 24;
                }

                // 设置阅读量
                const readCountInput = document.getElementById('read-count');
                if (readCountInput) {
                    readCountInput.value = filters.readCount || 1000;
                }

                // 立即应用保存的筛选条件
                this.applyFilter(filters.timeLimit, filters.readCount);

                console.log('已恢复筛选条件:', filters);
            } catch (error) {
                console.error('恢复筛选条件失败:', error);
            }
        }
    },

    // 维持登录状态
    async maintainLoginState() {
        try {
            // 检查登录状态
            const loginButton = document.querySelector('.login-button, .login-btn, [data-login]');
            const needLogin = loginButton && loginButton.offsetParent !== null;

            if (needLogin) {
                console.log('检测到需要登录，正在自动登录...');
                // 模拟点击登录按钮
                loginButton.click();

                // 等待登录弹窗出现
                await new Promise(resolve => setTimeout(resolve, 1000));

                // 自动填充登录信息并提交
                const usernameInput = document.querySelector('#username, input[name="username"]');
                const passwordInput = document.querySelector('#password, input[name="password"]');
                const submitButton = document.querySelector('.submit-btn, .login-submit');

                if (usernameInput && passwordInput && submitButton) {
                    usernameInput.value = localStorage.getItem(this.AUTH.USERNAME_KEY) || '';
                    passwordInput.value = localStorage.getItem('toutiao_password') || '';
                    submitButton.click();
                }
            }

            // 刷新cookie
            this.refreshCookies();

        } catch (error) {
            console.error('维持登录状态失败:', error);
        }
    },

    // 刷新cookie
    refreshCookies() {
        try {
            // 发送一个请求来刷新cookie
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://www.toutiao.com/api/pc/feed/',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                onload: function(response) {
                    console.log('Cookie刷新成功');
                }
            });
        } catch (error) {
            console.error('刷新Cookie失败:', error);
        }
    },

    // 清除本地数据
    clearLocalData() {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.SETTINGS_KEY);
        localStorage.removeItem(this.UPLOAD_QUEUE_KEY);
        localStorage.removeItem('filter_state');
    },

    // 修改 init 时的登录检查
    async initLoginState() {
        const savedUsername = localStorage.getItem(this.AUTH.USERNAME_KEY);
        if (savedUsername) {
            // 如果本地存在用户名，自动登录
            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `${this.SERVER_CONFIG.API_URL}/login`,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({
                            username: savedUsername,
                            auto_login: true  // 标记为自动登录
                        }),
                        onload: resolve,
                        onerror: reject
                    });
                });

                if (response.status === 200) {
                    updateLoginUI();  // 更新UI显示登录状态
                    console.log(`已自动登录账号: ${savedUsername}`);
                }
            } catch (error) {
                console.error('自动登录失败:', error);
                this.clearLocalData();  // 登录失败时清除本地数据
            }
        } else {
            // 未找到保存的用户名，清除所有本地数据
            this.clearLocalData();
        }
    },

    // 添加 consoleTimer 属性
    consoleTimer: null,

    // 添加 clearConsole 方法到 DataManager 对象
    clearConsole() {
        if (this.consoleTimer) {
            clearTimeout(this.consoleTimer);
        }
        this.consoleTimer = setTimeout(() => {
            console.clear();
            console.log('控制台已自动清理');
            console.log(`当前采集数据: ${this.getData().articles.length} 条`);
        }, 30000); // 30秒后自动清理
    }
};

// 创建控制面板
function createControlPanel() {
    console.log('创建控制面板...');

    // 检查是否已存在面板
    let existingPanel = document.getElementById('control-panel');
    if (existingPanel) {
        console.log('面板已存在，移除旧面板');
        existingPanel.remove();
    }

    const panel = document.createElement('div');
    panel.id = 'control-panel';

    // 添加样式确保面板可见
    GM_addStyle(`
        #control-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 999999 !important; /* 确保最高层级 */
            min-width: 250px;
            font-size: 14px;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
    `);

    // 获取保存的登录信息
    const savedUsername = localStorage.getItem(DataManager.AUTH.USERNAME_KEY);
    const savedPassword = localStorage.getItem('toutiao_password');

    // 获取保存的筛选条件
    const savedFilters = localStorage.getItem('filter_state');
    const filters = savedFilters ? JSON.parse(savedFilters) : { timeLimit: 24, readCount: 1000 };

    panel.innerHTML = `
        <div class="panel-container">
            <!-- 登录区域 - 根据登录状态显示不同内容 -->
            <div class="auth-section" style="margin-bottom: 10px; padding: 8px; background: #f5f5f5; border-radius: 4px;">
                <div id="loginForm" style="display: ${savedUsername ? 'none' : 'block'}">
                    <input type="text" id="username" placeholder="用户名" value="${savedUsername || ''}" style="width: 80px; margin-right: 5px;">
                    <input type="password" id="password" placeholder="密码" value="${savedPassword || ''}" style="width: 80px; margin-right: 5px;">
                    <button id="loginButton" class="panel-button">登录</button>
                </div>
                <div id="userInfo" style="display: ${savedUsername ? 'block' : 'none'}">
                    <span id="currentUser">当前用户: ${savedUsername || ''}</span>
                    <button id="logoutButton" class="panel-button">退出</button>
                </div>
            </div>
            <div>
                <div id="data-count">已采集数据: 0 条</div>
                <div id="time-remaining">有效期剩余: 0小时0分钟</div>
            </div>
            <div id="server-stats" style="margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">
                <p>服务器状态: 未连接</p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
                <button id="clear-data" class="panel-button">清除数据</button>
                <button id="test-connection" class="panel-button">测试连接</button>
                <button id="fetch-server-data" class="panel-button">获取服务器数据</button>
            </div>
            <div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">
                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="auto-sync" style="margin-right: 8px;">
                        自动同步
                    </label>
                    <span style="margin-left: 10px; font-size: 12px; color: #666;">
                        (${DataManager.SERVER_CONFIG.SYNC_INTERVAL / 1000 / 60}分钟/次)
                    </span>
                </div>
                <div id="sync-status" style="font-size: 12px; color: #666;">
                    下次同步时间: 计算中...
                </div>
            </div>
            <div id="filter-panel">
                <h4 style="margin: 0 0 10px 0;">数据筛选设置</h4>
                <div>
                    <label>发布时间范围（小时）：</label>
                    <input type="number" id="time-limit" min="1" max="72" value="${filters.timeLimit}">
                </div>
                <div>
                    <label>最低阅读量：</label>
                    <input type="number" id="read-count" min="0" step="100" value="${filters.readCount}">
                </div>
                <button id="apply-filter" class="panel-button">应用筛选</button>
                <button id="quick-filter" class="panel-button">1时内1000+</button>
            </div>
        </div>
    `;

    // 添加新的样式
    GM_addStyle(`
        #control-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            min-width: 250px;
            font-size: 14px;
        }
        .panel-button {
            padding: 6px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #f8f8f8;
            cursor: pointer;
            transition: all 0.3s;
        }
        .panel-button:hover {
            background: #e8e8e8;
            border-color: #ccc;
        }
        #server-stats {
            font-size: 12px;
            line-height: 1.4;
        }
        #server-stats p {
            margin: 4px 0;
        }
        .status-success {
            color: #4CAF50;
        }
        .status-error {
            color: #f44336;
        }
        #sync-status {
            margin-top: 5px;
            padding: 5px;
            background: #fff;
            border-radius: 4px;
        }
    `);

    document.body.appendChild(panel);

    // 使用事件监听器替代内联事件处理
    document.getElementById('loginButton').addEventListener('click', handleLogin);
    document.getElementById('logoutButton').addEventListener('click', handleLogout);

    // 获取自动同步开关的初始状态
    const autoSyncEnabled = localStorage.getItem('autoSyncEnabled') === 'true';
    const autoSyncCheckbox = document.getElementById('auto-sync');
    autoSyncCheckbox.checked = autoSyncEnabled;

    const syncStatus = document.getElementById('sync-status');

    autoSyncCheckbox.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        localStorage.setItem('autoSyncEnabled', isChecked);
        if (isChecked) {
            DataManager.startAutoSync();
            updateNextSyncTime();
        } else {
            DataManager.stopAutoSync();
            syncStatus.textContent = '自动同步已关闭';
        }
    });

    // 更新下次同步时间的函数
    function updateNextSyncTime() {
        if (autoSyncCheckbox.checked) {
            const nextSync = new Date(Date.now() + DataManager.SERVER_CONFIG.SYNC_INTERVAL);
            syncStatus.textContent = `下次同步时间: ${nextSync.toLocaleTimeString()}`;
            setTimeout(updateNextSyncTime, 1000); // 每秒更新一次
        }
    }

    // 初始启动自动同步
    if (autoSyncCheckbox.checked) {
        DataManager.startAutoSync();
        updateNextSyncTime();
    }

    // 添加事件监听器
    document.getElementById('clear-data').addEventListener('click', () => {
        if (confirm('确定要清除所有数据吗？')) {
            DataManager.clearData();
        }
    });

    document.getElementById('test-connection').addEventListener('click', async () => {
        const button = document.getElementById('test-connection');
        button.disabled = true;
        button.textContent = '测试中...';

        const result = await DataManager.testConnection();

        button.disabled = false;
        button.textContent = '测试连接';
        alert(result ? '服务器连接成功！' : '服务器连接失败！');
    });

    document.getElementById('apply-filter').addEventListener('click', () => {
        const timeLimit = parseInt(document.getElementById('time-limit').value) || 24;
        const readCount = parseInt(document.getElementById('read-count').value) || 1000;
        DataManager.applyFilter(timeLimit, readCount);
        DataManager.saveFilterState(); // 保存筛选条件
    });

    document.getElementById('quick-filter').addEventListener('click', () => {
        document.getElementById('time-limit').value = 1;
        document.getElementById('read-count').value = 1000;
        DataManager.applyFilter(1, 1000);
        DataManager.saveFilterState(); // 保存筛选条件
    });

    // 添加输入框值变化时的保存
    document.getElementById('time-limit').addEventListener('change', () => {
        DataManager.saveFilterState();
    });

    document.getElementById('read-count').addEventListener('change', () => {
        DataManager.saveFilterState();
    });

    return panel;
}

// 请求拦截和数据处理
function createPersistentRequestInterceptor(urlPattern) {
    const originalFetch = window.fetch;
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    function logRequest(info) {
        if (info.data?.data) {
            console.log(`捕获数据: ${info.data.data.length} 条 - ${new Date().toLocaleTimeString()}`);
            DataManager.saveData(info.data.data);
            DataManager.clearConsole(); // 现在这个方法应该可以正常调用了
        }
    }

    function isMatchingURL(url) {
        return url.includes('/api/pc/list/user/feed') || url.match(urlPattern);
    }

    // 拦截 fetch 请求
    window.fetch = async function(...args) {
        const url = args[0] instanceof Request ? args[0].url : args[0];

        if (isMatchingURL(url)) {
            try {
                const response = await originalFetch.apply(this, args);
                const clone = response.clone();
                const data = await clone.json();
                logRequest({url, method: args[1]?.method || 'GET', data});
                return response;
            } catch (error) {
                console.error('Fetch拦截错误:', error);
                return originalFetch.apply(this, args);
            }
        }
        return originalFetch.apply(this, args);
    };

    // 拦截 XHR 请求
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._url = url;
        this._method = method;
        return originalXHROpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function(...args) {
        if (this._url && isMatchingURL(this._url)) {
            this.addEventListener('load', function() {
                if (this.status >= 200 && this.status < 300) {
                    try {
                        const data = JSON.parse(this.responseText);
                        logRequest({url: this._url, method: this._method, data});
                    } catch (error) {
                        console.error('XHR拦截误:', error);
                    }
                }
            });
        }
        return originalXHRSend.apply(this, args);
    };
}
// 初始化
function init() {
    // 立即创建基础面板
    createBasicPanel();

    // 设置请求拦截器（最优先）
    createPersistentRequestInterceptor(/\/api\/pc\/list\/user\/feed/);

    // 等待 DOM 加载完成后初始化完整功能
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFullFeatures);
    } else {
        initFullFeatures();
    }
}

// 创建基础面板
function createBasicPanel() {
    const panel = document.createElement('div');
    panel.id = 'control-panel';
    panel.innerHTML = '<div>数据采集中...</div>';

    GM_addStyle(`
        #control-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 2147483647;
            min-width: 250px;
            font-size: 14px;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
    `);

    // 使用 document.documentElement 确保在 DOM 未完全加载时也能添加面板
    document.documentElement.appendChild(panel);
}

// 初始化完整功能
function initFullFeatures() {
    try {
        console.log('初始化完整功能...');
        createControlPanel();
        DataManager.initLoginState();
        DataManager.restoreFilterState();
    } catch (error) {
        console.error('初始化完整功能失败:', error);
    }
}

// 立即执行初始化
init();

// 添加登录相关的全局函数
async function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('请输入用户名和密码');
        return;
    }

    const loginButton = document.getElementById('loginButton');
    loginButton.disabled = true;
    loginButton.textContent = '登录中...';

    try {
        const response = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${DataManager.SERVER_CONFIG.API_URL}/login`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    username: username,
                    password: password
                }),
                onload: resolve,
                onerror: reject
            });
        });

        if (response.status === 200) {
            const data = JSON.parse(response.responseText);
            if (data.status === 'success') {
                // 保存登录信息
                localStorage.setItem(DataManager.AUTH.USERNAME_KEY, username);
                localStorage.setItem('toutiao_password', password); // 保存密码
                DataManager.restoreFilterState();
                updateLoginUI();
                alert('登录成功！');
            } else {
                throw new Error(data.message || '登录失败');
            }
        } else {
            throw new Error('登录失败，请检查用户名和密码');
        }
    } catch (error) {
        alert(error.message || '登录失败，请稍后重试');
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = '登录';
    }
}

function handleLogout() {
    if (confirm('确定要退出登录吗？')) {
        DataManager.clearLocalData();
        localStorage.removeItem(DataManager.AUTH.USERNAME_KEY);
        localStorage.removeItem('toutiao_password');
        updateLoginUI();
        // 刷新页面以重置状态
        window.location.reload();
    }
}

// 修改登录状态UI更新函数
function updateLoginUI() {
    const username = localStorage.getItem(DataManager.AUTH.USERNAME_KEY);
    const loginForm = document.getElementById('loginForm');
    const userInfo = document.getElementById('userInfo');
    const currentUser = document.getElementById('currentUser');

    if (username) {
        loginForm.style.display = 'none';
        userInfo.style.display = 'block';
        currentUser.textContent = `当前用户: ${username}`;
    } else {
        loginForm.style.display = 'block';
        userInfo.style.display = 'none';
        currentUser.textContent = '';
    }
}


// 在页面可见性改变时也检查登录状态
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        DataManager.maintainLoginState();
    }
});



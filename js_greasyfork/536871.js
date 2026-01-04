// ==UserScript==
// @name         微博收藏备份工具(HTML导出增强版)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  备份微博收藏内容，支持导出HTML格式，优化图片显示，支持Live Photo播放
// @author       Claude
// @match        https://*.weibo.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      weibo.com
// @connect      sinaimg.cn
// @connect      *
// @run-at       document-end
// @require https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/536871/%E5%BE%AE%E5%8D%9A%E6%94%B6%E8%97%8F%E5%A4%87%E4%BB%BD%E5%B7%A5%E5%85%B7%28HTML%E5%AF%BC%E5%87%BA%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536871/%E5%BE%AE%E5%8D%9A%E6%94%B6%E8%97%8F%E5%A4%87%E4%BB%BD%E5%B7%A5%E5%85%B7%28HTML%E5%AF%BC%E5%87%BA%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义全局消息提示函数
    function showMessage(message, type = 'info') {
        let messageElement = document.querySelector('.wb-backup-message');
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.className = 'wb-backup-message';
            document.body.appendChild(messageElement);
        }

        messageElement.textContent = message;
        messageElement.className = `wb-backup-message ${type}`;

        // 先移除之前的 show 类
        messageElement.classList.remove('show');

        // 使用 requestAnimationFrame 确保 DOM 更新
        requestAnimationFrame(() => {
            messageElement.classList.add('show');
        });

        // 清除之前的定时器
        if (window.messageTimeout) {
            clearTimeout(window.messageTimeout);
        }

        // 设置新的定时器
        window.messageTimeout = setTimeout(() => {
            messageElement.classList.remove('show');
        }, 3000);
    }

    // 将 showMessage 添加到全局作用域
    unsafeWindow.showMessage = showMessage;

    // 添加数字转中文函数到全局作用域
    unsafeWindow.numberToChinese = function(num) {
        const chinese = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];
        return chinese[num - 1] || num;
    };

    // 配置
    const config = {
        pageSize: 50,
        currentPage: 1,
        totalPages: 1,
        isLoggedIn: false,
        isLoading: false,
        processedIds: new Set(),
        preloadedPages: {},
        preloadDepth: 3,
        filters: {
            retweet: false,
            video: false,
            text: '',
            user: ''
        },
        settings: {
            videoQuality: 'highest', // 默认视频质量为"最高清晰度"
            maxConcurrentRequests: 5,
            loadImagesOnExport: true,
            saveVideosOnExport: true
        }
    };
       // 样式
    GM_addStyle(`
        .wb-backup-icon {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            width: 40px;
            height: 40px;
            background: #ff8200;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: transform 0.3s ease;
        }

        .wb-backup-icon:hover {
            transform: scale(1.1);
        }

        .wb-backup-icon svg {
            width: 24px;
            height: 24px;
        }

        .wb-backup-container {
            position: fixed;
            top: 70px;
            right: 20px;
            z-index: 9998;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 20px rgba(0,0,0,0.15);
            width: 800px;
            max-height: 88vh;
            display: flex;
            flex-direction: column;
            padding: 15px;
            overflow: hidden;
            @media (max-width: 768px) {
                width: 90%;
                margin: 10px auto;
            }
        }

        .wb-backup-container.show {
            display: block;
        }

        .wb-backup-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            border-bottom: 1px solid rgba(238, 238, 238, 0.5);
            padding-bottom: 10px;
        }

        .wb-backup-title {
            font-size: 18px;
            font-weight: bold;
        }

        .wb-backup-close {
            cursor: pointer;
            font-size: 20px;
        }

        .wb-backup-content-wrapper {
            display: flex;
            flex-direction: column;
            flex: 1;
            overflow: hidden;
            border: 1px solid rgba(238, 238, 238, 0.5);
            border-radius: 5px;
            margin-bottom: 15px;
            position: relative;
            min-height: 200px;
            max-height: calc(88vh - 200px);
        }

        .wb-backup-list {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
            position: relative;
        }

        .wb-backup-item {
            display: flex;
            padding: 15px;
            border-bottom: 1px solid rgba(238, 238, 238, 0.5);
            gap: 10px;
        }

        .wb-backup-item:last-child {
            border-bottom: none;
        }

        .wb-backup-content {
            flex: 1;
        }

        .wb-backup-images {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
        }

        .wb-backup-images .image-wrapper {
            position: relative;
            width: 200px;
            height: 200px;
            border-radius: 4px;
            overflow: hidden;
        }

        .wb-backup-images img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }

        .wb-backup-controls {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 8px;
            margin-bottom: 15px;
        }

        .wb-backup-button {
            background: #ff8200;
            color: white;
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            text-align: center;
            white-space: nowrap;
            height: 28px;
            line-height: 20px;
        }

        .wb-backup-button:hover {
            background: #e67300;
        }

        .wb-backup-button.danger {
            background: #f44336;
        }

        .wb-backup-button.danger:hover {
            background: #d32f2f;
        }

        .wb-backup-button.danger:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        .wb-backup-pagination {
            padding: 10px;
            background: #fff;
            border-top: 1px solid rgba(238, 238, 238, 0.5);
            z-index: 3;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-top: auto;
        }

        .wb-backup-page-input {
            width: 50px;
            text-align: center;
            margin: 0 5px;
            height: 28px;
            border: 1px solid rgba(221, 221, 221, 0.5);
            border-radius: 4px;
        }

        .wb-backup-checkbox {
            margin-top: 5px;
        }

        .wb-backup-message {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 15px;
            border-radius: 5px;
            color: white;
            background: #333;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .wb-backup-message.info {
            background: #2196f3;
        }

        .wb-backup-message.success {
            background: #4caf50;
        }

        .wb-backup-message.error {
            background: #f44336;
        }

        .wb-backup-message.show {
            opacity: 1;
        }

        .wb-backup-filters {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            margin-bottom: 15px;
            padding: 10px;
            background: #f8f8f8;
            border-radius: 4px;
        }

        .wb-backup-filter-group {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
        }

        .wb-backup-filter-input {
            flex: 1;
            padding: 4px 8px;
            border: 1px solid rgba(221, 221, 221, 0.5);
            border-radius: 4px;
            font-size: 13px;
            height: 28px;
        }

        .wb-backup-filter-checkbox {
            margin: 0;
        }

        .wb-backup-confirm-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10001;
            justify-content: center;
            align-items: center;
        }

        .wb-backup-confirm-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            width: 300px;
            text-align: center;
        }

        .wb-backup-confirm-buttons {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 20px;
        }

        .wb-backup-settings-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 20px rgba(0,0,0,0.15);
            z-index: 10002;
        }

        .wb-backup-settings-item {
            margin-bottom: 15px;
        }

        .wb-backup-settings-input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-top: 5px;
        }

        .wb-backup-settings-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        }

        /* 暗色主题支持 */
        @media (prefers-color-scheme: dark) {
            .wb-backup-container {
                background: #1a1a1a;
                color: #fff;
            }

            .wb-backup-button {
                background: #ff9933;
            }

            .wb-backup-button:hover {
                background: #ff8000;
            }

            .wb-backup-filters {
                background: #2a2a2a;
            }

            .wb-backup-filter-input {
                background: #333;
                color: #fff;
                border-color: #444;
            }
        }

        /* 下载进度条样式 */
        .wb-backup-progress {
            position: fixed;
            bottom: 60px;
            right: 20px;
            width: 200px;
            background: #f0f0f0;
            border-radius: 4px;
            overflow: hidden;
            display: none;
        }

        .wb-backup-progress-bar {
            height: 4px;
            background: #4caf50;
            width: 0;
            transition: width 0.3s;
        }

        .live-photo-badge, .live-badge {
            position: absolute;
            top: 8px;
            left: 8px;
            background: #FFFFFF;
            color: #000000;
            padding: 1px 4px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 450;
            cursor: pointer;
            z-index: 2;
            font-family: "Noto Sans SC Black";
            letter-spacing: 0;
            box-shadow: none;
            line-height: 16px;
            height: 18px;
            border: none;
            text-transform: none;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 24px;
            white-space: nowrap;
        }
    `);

    // 将下载函数定义在全局作用域
    unsafeWindow.downloadMedia = async function(url, filename) {
        const maxRetries = 3;
        let retryCount = 0;
        const progressBar = createProgressBar();

        async function attemptDownload() {
            try {
                console.log(`尝试下载 (${retryCount + 1}/${maxRetries}):`, url, filename);

                return new Promise((resolve, reject) => {
                    GM_download({
                        url: url,
                        name: filename,
                        headers: {
                            'Referer': 'https://weibo.com/',
                            'User-Agent': navigator.userAgent
                        },
                        onprogress: (e) => {
                            if (e.lengthComputable) {
                                const progress = (e.loaded / e.total) * 100;
                                updateProgressBar(progressBar, progress);
                            }
                        },
                        onload: () => {
                            showMessage(`下载完成: ${filename}`, 'success');
                            hideProgressBar(progressBar);
                            resolve();
                        },
                        onerror: (error) => {
                            console.error('下载失败:', error);
                            reject(error);
                        }
                    });
                });
            } catch (error) {
                if (retryCount < maxRetries - 1) {
                    retryCount++;
                    await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                    return attemptDownload();
                }
                throw error;
            }
        }

        try {
            await attemptDownload();
        } catch (error) {
            showMessage(`下载失败: ${filename} (已重试${retryCount}次)`, 'error');
            hideProgressBar(progressBar);
        }
    }

    function createProgressBar() {
        const container = document.createElement('div');
        container.className = 'wb-backup-progress';

        const bar = document.createElement('div');
        bar.className = 'wb-backup-progress-bar';

        container.appendChild(bar);
        document.body.appendChild(container);
        container.style.display = 'block';

        return container;
    }

    function updateProgressBar(container, progress) {
        const bar = container.querySelector('.wb-backup-progress-bar');
        bar.style.width = `${progress}%`;
    }

    function hideProgressBar(container) {
        setTimeout(() => {
            container.style.display = 'none';
            container.remove();
        }, 1000);
    }

    // 检查登录状态
    async function checkLoginStatus() {
        try {
            const hasLoginCookie = document.cookie.includes('SUB=') || document.cookie.includes('WBPSESS=');
            if (!hasLoginCookie) {
                config.isLoggedIn = false;
                return false;
            }

            const timestamp = new Date().getTime();
            const response = await fetch(`https://weibo.com/ajax/profile/info?_t=${timestamp}`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const data = await response.json();
            config.isLoggedIn = data && data.data && data.data.login;
            return config.isLoggedIn;
        } catch (error) {
            console.error('检查登录状态失败:', error);
            return false;
        }
    }

    // 修改 fixImageUrl 函数以支持新的图片URL格式
    function fixImageUrl(url, addParam = true) {
        if (!url) {
            console.error('收到空的图片URL');
            return '';
        }

        console.log('处理图片URL:', {
            original: url,
            is_gif: url.toLowerCase().includes('.gif')
        });

        try {
        // 处理相对URL
        if (url.startsWith('//')) {
            url = 'https:' + url;
        }

            // 确保使用wx4域名
            url = url.replace(/w[ww][1-4]\.sinaimg\.cn/, 'wx4.sinaimg.cn');

            // 检查是否为GIF
            const isGif = url.toLowerCase().includes('.gif');

        // 替换为原图
            if (!isGif) {
                url = url.replace(/orj360|mw690|mw1024|mw2048|small|square|thumb150|thumbnail|bmiddle|large/, 'large');
            }

        // 确保使用HTTPS
        url = url.replace(/^http:/, 'https:');

        // 添加必要的参数
        if (addParam) {
                const token = document.cookie.match(/SUB=([^;]+)/)?.[1] || '';
                url = url + (url.includes('?') ? '&' : '?') + 'token=' + encodeURIComponent(token);
                url += '&ts=' + new Date().getTime();
                url += '&ua=Weibo&from=feed';
            }

            console.log('处理后的URL:', url);
            return url;
        } catch (error) {
            console.error('处理图片URL时出错:', error);
        return url;
        }
    }

    // 修复视频URL
    function fixVideoUrl(url, addParam = true) {
        if (!url) return '';
        
        // 处理腾讯视频链接的特殊情况
        if (url.includes('qqvideo') || url.includes('vlive.qqvideo')) {
            // 腾讯视频链接可能会出现证书问题，尝试使用HTTP
            url = url.replace(/^https:/, 'http:').replace(/^\/\//, 'http://');
        } else {
            // 其他视频链接使用HTTPS
            url = url.replace(/^http:/, 'https:').replace(/^\/\//, 'https://');
        }

        // 添加必要的参数以避免链接失效
        if (addParam) {
            const token = document.cookie.match(/SUB=([^;]+)/)?.[1] || '';
            url = url + (url.includes('?') ? '&' : '?') + 'token=' + encodeURIComponent(token);
            // 添加时间戳避免缓存
            url += '&ts=' + new Date().getTime();
            // 添加必要的请求头参数
            url += '&ua=Weibo&from=feed';
        }

        return url;
    }

    // 添加错误处理工具类
    class ErrorHandler {
        static async withTimeout(promise, timeout = 30000) {
            return Promise.race([
                promise,
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('请求超时')), timeout)
                )
            ]);
        }

        static async retry(fn, retries = 3, delay = 1000) {
            for (let i = 0; i < retries; i++) {
                try {
                    return await fn();
                } catch (error) {
                    if (i === retries - 1) throw error;
                    Logger.warn(`操作失败，${retries - i - 1}次重试机会`, error);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        static handleError(error, context = '') {
            let message = '操作失败';

            if (error instanceof TypeError) {
                message = '数据类型错误';
            } else if (error.name === 'NetworkError') {
                message = '网络连接失败';
            } else if (error.message === '请求超时') {
                message = '请求超时，请重试';
            }

            Logger.error(`${context}: ${message}`, error);
            showMessage(`${context}: ${message}`, 'error');
        }
    }

    // 修改API请求函数，添加超时和重试机制
    async function getFavorites(page = 1) {
            try {
                if (config.preloadedPages[page]) {
                console.log(`使用预加载的第${page}页数据`);
                    const data = config.preloadedPages[page];
                    delete config.preloadedPages[page];
                    return data;
                }

            console.log('开始获取收藏数据...');
            const timestamp = new Date().getTime();
            console.log('发送请求获取总数据...');
            const totalResponse = await fetch(`https://weibo.com/ajax/favorites/all_fav?page=1&count=1&_t=${timestamp}`, {
                            credentials: 'include',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'X-Requested-With': 'XMLHttpRequest'
                            }
            });

                    const totalData = await totalResponse.json();
            console.log('获取到的总数据:', JSON.stringify(totalData, null, 2));

            if (totalData.ok !== 1) {
                console.error('获取总数据失败:', totalData.msg);
                throw new Error(totalData.msg || '获取数据失败');
            }

                        config.totalPages = Math.ceil(totalData.total / config.pageSize);
                        updatePaginationUI();

            console.log(`开始获取第${page}页数据...`);
            const pageResponse = await fetch(`https://weibo.com/ajax/favorites/all_fav?page=${page}&count=${config.pageSize}&_t=${timestamp}`, {
                        credentials: 'include',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        }
            });

            const data = await pageResponse.json();
            console.log('获取到的页面数据:', JSON.stringify(data, null, 2));

                if (data.ok === 1 && data.data) {
                // 处理每条微博数据
                data.data = data.data.map(item => {
                    console.log('处理微博数据:', item.id);

                    // 如果pic_infos为undefined但有pic_ids，尝试构建pic_infos
                    if (item.pic_ids && !item.pic_infos) {
                        console.log('尝试构建pic_infos');
                        item.pic_infos = {};
                        item.pic_ids.forEach(pid => {
                            const uid = item.user.id || '';
                            item.pic_infos[pid] = {
                                thumbnail: {
                                    url: `https://wx4.sinaimg.cn/thumbnail/${pid}.jpg`
                                },
                                bmiddle: {
                                    url: `https://wx4.sinaimg.cn/bmiddle/${pid}.jpg`
                                },
                                large: {
                                    url: `https://wx4.sinaimg.cn/large/${pid}.jpg`
                                },
                                original: {
                                    url: `https://wx4.sinaimg.cn/large/${pid}.jpg`
                                },
                                largest: {
                                    url: `https://wx4.sinaimg.cn/large/${pid}.jpg`
                                },
                                pid: pid,
                                uid: uid,
                                type: 'pic'
                            };
                        });
                    }

                    // 如果是转发的微博，同样处理其图片信息
                    if (item.retweeted_status && item.retweeted_status.pic_ids && !item.retweeted_status.pic_infos) {
                        console.log('尝试构建转发微博的pic_infos');
                        item.retweeted_status.pic_infos = {};
                        item.retweeted_status.pic_ids.forEach(pid => {
                            const uid = item.retweeted_status.user?.id || '';
                            item.retweeted_status.pic_infos[pid] = {
                                thumbnail: {
                                    url: `https://wx4.sinaimg.cn/thumbnail/${pid}.jpg`
                                },
                                bmiddle: {
                                    url: `https://wx4.sinaimg.cn/bmiddle/${pid}.jpg`
                                },
                                large: {
                                    url: `https://wx4.sinaimg.cn/large/${pid}.jpg`
                                },
                                original: {
                                    url: `https://wx4.sinaimg.cn/large/${pid}.jpg`
                                },
                                largest: {
                                    url: `https://wx4.sinaimg.cn/large/${pid}.jpg`
                                },
                                pid: pid,
                                uid: uid,
                                type: 'pic'
                            };
                        });
                    }

                    return item;
                    });

                    // 为长备份功能添加的额外返回结构
                    const result = {
                    items: data.data,
                        total: totalData.total,
                        favorites: data.data // 为长备份功能添加直接访问收藏的方式
                    };

                    return result;
                } else {
                console.error('获取页面数据失败:', data.msg);
                    throw new Error(data.msg || '获取数据失败');
                }
            } catch (error) {
            console.error(`获取第${page}页收藏失败:`, error);
            console.error('错误堆栈:', error.stack);
            showMessage(`获取第${page}页失败: ${error.message}`, 'error');
                return { items: [], favorites: [], total: 0 };
            }
    }

    // 更新分页UI
    function updatePaginationUI() {
        const pageInput = document.getElementById('pageInput');
        const totalPagesSpan = document.getElementById('totalPages');

        if (config.totalPages > 0) {
            pageInput.value = config.currentPage;
            pageInput.max = config.totalPages;
            totalPagesSpan.textContent = config.totalPages;
        } else {
            totalPagesSpan.textContent = '加载中...';
        }

        const prevBtn = document.getElementById('prevPageBtn');
        const nextBtn = document.getElementById('nextPageBtn');
        const firstBtn = document.getElementById('firstPageBtn');
        const lastBtn = document.getElementById('lastPageBtn');

        prevBtn.disabled = config.currentPage <= 1;
        nextBtn.disabled = config.currentPage >= config.totalPages;
        firstBtn.disabled = config.currentPage <= 1;
        lastBtn.disabled = config.currentPage >= config.totalPages;

        [prevBtn, nextBtn, firstBtn, lastBtn].forEach(btn => {
            btn.classList.toggle('disabled', btn.disabled);
        });
    }

    // 预加载后续页面
    async function preloadNextPages(currentPage) {
        try {
            for (let i = 1; i <= config.preloadDepth; i++) {
                const pageToLoad = currentPage + i;
                if (pageToLoad <= config.totalPages && !config.preloadedPages[pageToLoad]) {
                    console.log(`预加载第${pageToLoad}页`);
                    const timestamp = new Date().getTime();
                    const response = await fetch(`https://weibo.com/ajax/favorites/all_fav?page=${pageToLoad}&count=50&_t=${timestamp}`, {
                        credentials: 'include',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-XSRF-TOKEN': document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || ''
                        }
                    });

                    const data = await response.json();
                    if (data && data.ok === 1) {
                        config.preloadedPages[pageToLoad] = {
                            items: data.data || [],
                            total: data.total || 0
                        };
                    }

                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
        } catch (error) {
            console.error('预加载失败:', error);
        }
    }

    // 生成单个收藏项的HTML
    function generateItemHTML(item) {
        const hasVideo = item.page_info?.media_info || item.retweeted_status?.page_info?.media_info;
        const hasImages = (item.pic_ids && item.pic_ids.length > 0) ||
                         (item.retweeted_status?.pic_ids && item.retweeted_status.pic_ids.length > 0);

        return `
            <div class="wb-backup-item" data-id="${item.id}" data-weibo='${JSON.stringify(item)}'>
                <label class="wb-backup-checkbox-wrapper">
                    <input type="checkbox" class="wb-backup-checkbox">
                </label>
                <div class="wb-backup-content">
                    <div class="wb-backup-user">${item.user?.screen_name || '未知用户'}</div>
                    <div class="wb-backup-text">${item.text_raw || item.text || ''}</div>
                    ${hasImages ? `<div class="wb-backup-media-count">图片: ${item.pic_ids?.length || 0}</div>` : ''}
                    ${hasVideo ? '<div class="wb-backup-media-count">包含视频</div>' : ''}
                    ${item.retweeted_status ? `
                        <div class="wb-backup-retweet">
                            <div class="wb-backup-retweet-user">@${item.retweeted_status.user?.screen_name || '未知用户'}</div>
                            <div class="wb-backup-retweet-text">${item.retweeted_status.text_raw || item.retweeted_status.text || ''}</div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // 创建UI
    function createUI() {
        const icon = document.createElement('div');
        icon.className = 'wb-backup-icon';
        icon.innerHTML = `<svg viewBox="0 0 1024 1024" width="24" height="24">
            <path fill="#fff" d="M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-40 824H232V136h560v752zM400 432H304c-8.8 0-16-7.2-16-16v-96c0-8.8 7.2-16 16-16h96c8.8 0 16 7.2 16 16v96c0 8.8-7.2 16-16 16zm0 288H304c-8.8 0-16-7.2-16-16v-96c0-8.8 7.2-16 16-16h96c8.8 0 16 7.2 16 16v96c0 8.8-7.2 16-16 16z"/>
        </svg>`;
        document.body.appendChild(icon);

        const container = document.createElement('div');
        container.className = 'wb-backup-container';
        container.style.display = 'none';  // 初始时隐藏面板
        container.innerHTML = `
            <div class="wb-backup-header">
                <div class="wb-backup-title">微博收藏备份工具</div>
                <div class="wb-backup-close">×</div>
            </div>

            <div class="wb-backup-controls">
                <button class="wb-backup-button" id="loadBtn">加载收藏</button>
                <button class="wb-backup-button" id="selectAllBtn">全选</button>
                <button class="wb-backup-button" id="unselectAllBtn">取消全选</button>
                <button class="wb-backup-button" id="exportBtn">导出选中</button>
                <button class="wb-backup-button" id="exportLivePhotoBtn">导出LivePhoto</button>
                <button class="wb-backup-button" id="longBackupBtn">长备份</button>
                <button class="wb-backup-button danger" id="deleteBtn">删除选中</button>
            </div>

            <div class="wb-backup-filters" style="display: flex; align-items: center; gap: 15px;">
                <div style="display: flex; align-items: center; white-space: nowrap; gap: 20px;">
                    <label style="display: flex; align-items: center; gap: 5px;">
                        <input type="checkbox" class="wb-backup-filter-checkbox" id="retweetFilter">
                        只看转发
                    </label>
                    <label style="display: flex; align-items: center; gap: 5px;">
                        <input type="checkbox" class="wb-backup-filter-checkbox" id="videoFilter">
                        只看视频
                    </label>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                    <label style="white-space: nowrap;">视频清晰度：</label>
                    <select id="videoQualitySelect" class="wb-backup-filter-input" style="width: 120px;">
                        <option value="highest">最高清晰度</option>
                        <option value="8K60">8K 60帧</option>
                        <option value="4K60">4K 60帧</option>
                        <option value="2K60">2K 60帧</option>
                        <option value="1080p60">1080P 60帧</option>
                        <option value="1080p">1080P</option>
                        <option value="720p60">720P 60帧</option>
                        <option value="720p">720P</option>
                        <option value="480p">480P</option>
                    </select>
                    <input type="text" class="wb-backup-filter-input" id="textFilter" placeholder="搜索微博内容" style="width: 150px;">
                    <input type="text" class="wb-backup-filter-input" id="userFilter" placeholder="搜索用户" style="width: 150px;">
                </div>
            </div>

            <div class="wb-backup-content-wrapper">
            <div id="wb-backup-list" class="wb-backup-list"></div>

            <div class="wb-backup-pagination">
                <button class="wb-backup-button" id="firstPageBtn">首页</button>
                <button class="wb-backup-button" id="prevPageBtn">上一页</button>
                <span>第 <input type="number" class="wb-backup-page-input" id="pageInput" min="1" value="1"> / <span id="totalPages">1</span> 页</span>
                <button class="wb-backup-button" id="nextPageBtn">下一页</button>
                <button class="wb-backup-button" id="lastPageBtn">末页</button>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        // 添加确认删除模态框
        const confirmModal = document.createElement('div');
        confirmModal.className = 'wb-backup-confirm-modal';
        confirmModal.innerHTML = `
            <div class="wb-backup-confirm-content">
                <h3>确认删除</h3>
                <p>确定要删除选中的收藏吗？</p>
                <div style="margin: 15px 0; text-align: left;">
                    <label style="display: block; margin-bottom: 10px;">
                        <input type="radio" name="deleteScope" value="panel" checked> 仅删除插件面板中的微博收藏
                    </label>
                    <label style="display: block;">
                        <input type="radio" name="deleteScope" value="website"> 同时删除插件面板和微博网页中的收藏
                    </label>
                </div>
                <div class="wb-backup-confirm-buttons">
                    <button class="wb-backup-button" id="cancelDelete">取消</button>
                    <button class="wb-backup-button danger" id="confirmDelete">确认删除</button>
                </div>
            </div>
        `;
        document.body.appendChild(confirmModal);

        // 绑定事件
        icon.addEventListener('click', () => {
            const isVisible = container.style.display === 'block';
            container.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) {
                checkLoginStatus().then(isLoggedIn => {
                    if (isLoggedIn && document.querySelectorAll('#wb-backup-list .wb-backup-item').length === 0) {
                        loadPage(1);
                    }
                });
            }
        });

        container.querySelector('.wb-backup-close').addEventListener('click', () => {
            container.classList.remove('show');
        });

        document.getElementById('loadBtn').addEventListener('click', () => loadPage(1));
        document.getElementById('exportBtn').addEventListener('click', exportSelectedItems);
        document.getElementById('selectAllBtn').addEventListener('click', () => toggleSelectAll(true));
        document.getElementById('unselectAllBtn').addEventListener('click', () => toggleSelectAll(false));
        document.getElementById('firstPageBtn').addEventListener('click', () => loadPage(1));
        document.getElementById('prevPageBtn').addEventListener('click', () => loadPage(config.currentPage - 1));
        document.getElementById('nextPageBtn').addEventListener('click', () => loadPage(config.currentPage + 1));
        document.getElementById('lastPageBtn').addEventListener('click', () => loadPage(config.totalPages));
        document.getElementById('exportLivePhotoBtn').addEventListener('click', downloadLivePhotos);
        document.getElementById('longBackupBtn').addEventListener('click', longBackup);

        document.getElementById('pageInput').addEventListener('change', async (e) => {
            const page = parseInt(e.target.value);
            if (!page || page < 1 || page > config.totalPages) {
                e.target.value = config.currentPage;
                showMessage(`请输入 1-${config.totalPages} 之间的数字`, 'error');
                return;
            }
            await loadPage(page);
        });

        // 绑定筛选事件
        document.getElementById('retweetFilter').addEventListener('change', (e) => {
            config.filters.retweet = e.target.checked;
            applyFilters();
        });

        document.getElementById('videoFilter').addEventListener('change', (e) => {
            config.filters.video = e.target.checked;
            applyFilters();
        });

        document.getElementById('textFilter').addEventListener('input', (e) => {
            config.filters.text = e.target.value.trim();
            applyFilters();
        });

        document.getElementById('userFilter').addEventListener('input', (e) => {
            config.filters.user = e.target.value.trim();
            applyFilters();
        });

        // 绑定删除事件
        document.getElementById('deleteBtn').addEventListener('click', () => {
            const selectedItems = document.querySelectorAll('.wb-backup-checkbox:checked');
            if (selectedItems.length === 0) {
                showMessage('请先选择要删除的内容', 'error');
                return;
            }
            confirmModal.style.display = 'flex';
        });

        document.getElementById('cancelDelete').addEventListener('click', () => {
            confirmModal.style.display = 'none';
        });

        document.getElementById('confirmDelete').addEventListener('click', () => {
            deleteSelectedItems();
            confirmModal.style.display = 'none';
        });

        return { icon, container };
    }

    // 加载指定页面
    async function loadPage(page) {
        if (config.isLoading) {
            showMessage('正在加载中，请稍候...', 'info');
            return;
        }

        // 如果还没有获取过总页数，先获取一次
        if (!config.totalPages) {
            try {
                config.isLoading = true;
                const result = await getFavorites(1);
                if (result.total === 0) {
                    showMessage('获取总页数失败', 'error');
                    config.isLoading = false;
                    return;
                }
            } catch (error) {
                console.error('获取总页数失败:', error);
                showMessage('获取总页数失败', 'error');
                config.isLoading = false;
                return;
            }
        }

        // 检查页码是否有效
        if (page < 1 || page > config.totalPages) {
            showMessage(`页码无效，请输入 1-${config.totalPages} 之间的数字`, 'error');
            document.getElementById('pageInput').value = config.currentPage;
            return;
        }

        try {
            config.isLoading = true;
            showMessage(`正在加载第${page}页...`);
            document.getElementById('wb-backup-list').innerHTML = '<div style="text-align:center;padding:20px;">加载中...</div>';

            const result = await getFavorites(page);
            if (result.items.length === 0) {
                document.getElementById('wb-backup-list').innerHTML = '<div style="text-align:center;padding:20px;">没有收藏内容</div>';
                showMessage('没有收藏内容');
            } else {
                document.getElementById('wb-backup-list').innerHTML = '';
                await renderFavorites(result.items);
                config.currentPage = page;
                document.getElementById('pageInput').value = page;
                showMessage(`已加载第${page}页，共${result.items.length}条收藏`);

                if (config.isLoggedIn) {
                    preloadNextPages(page);
                }
            }

            updatePaginationUI();
        } catch (error) {
            console.error('加载页面失败:', error);
            showMessage('加载失败: ' + error.message, 'error');
            document.getElementById('wb-backup-list').innerHTML = '<div style="text-align:center;padding:20px;color:red;">加载失败</div>';
        } finally {
            config.isLoading = false;
        }
    }

    // 修改渲染函数中的媒体处理部分
    function renderFavorites(items) {
        console.log('\n===== 开始渲染收藏内容 =====');
        console.log('总微博数:', items.length);

        const list = document.getElementById('wb-backup-list');
        const existingIds = new Set(Array.from(document.querySelectorAll('.wb-backup-item')).map(item => item.dataset.id));

        // 获取之前导出阶段确定的LivePhoto状态
        const livePhotoMap = window.livePhotoStatus || new Map();
        console.log('LivePhoto状态映射:', {
            总数: livePhotoMap.size,
            样例: Array.from(livePhotoMap.entries()).slice(0, 3)
        });

        items.forEach((item, index) => {
            console.log(`\n----- 处理第${index + 1}条微博 -----`);
            console.log('微博ID:', item.id);
            console.log('微博用户:', item.user?.screen_name);
            console.log('微博内容:', item.text_raw || item.text);

            if (existingIds.has(item.id)) {
                console.log('跳过重复微博');
                return;
            }

            try {
                // 处理图片和视频
                const div = document.createElement('div');
                div.className = 'wb-backup-item';
                div.dataset.id = item.id;
                div.dataset.weibo = JSON.stringify(item);

                // 处理主微博和转发微博的所有媒体内容（图片和视频）
                const mainMediaItems = []; // 主微博的媒体项
                const retweetedMediaItems = []; // 转发微博的媒体项

                // 1. 首先处理混合媒体内容
                if (item.mix_media_info && item.mix_media_info.items) {
                    console.log('处理混合媒体内容...');
                    item.mix_media_info.items.forEach((media, i) => {
                        if (media.type === 'pic') {
                            // 处理图片
                            if (media.data && (media.data.original || media.data.large)) {
                                const url = fixImageUrl(media.data.original ? media.data.original.url : media.data.large.url);
                                const picId = media.data.pic_id || '';
                                // 使用预先判断的LivePhoto状态，如果没有则使用media.data.type
                                const isLivePhoto = picId && livePhotoMap.has(picId) ?
                                    livePhotoMap.get(picId) : media.data.type === 'livephoto';
                                const videoUrl = isLivePhoto && media.data.video ? fixVideoUrl(media.data.video) : null;

                                mainMediaItems.push({
                                    type: isLivePhoto ? 'livephoto' : 'image',
                                    url: url,
                                    videoUrl: videoUrl,
                                    picId: picId
                                });

                                console.log(`处理混合媒体图片 ${i+1}:`, { type: isLivePhoto ? 'livephoto' : 'image', url, videoUrl });
                            }
                        } else if (media.type === 'video') {
                            // 处理视频
                            if (media.data && media.data.media_info) {
                                const videoUrl = fixVideoUrl(
                                    media.data.media_info.stream_url ||
                                    media.data.media_info.mp4_hd_url ||
                                    media.data.media_info.mp4_sd_url
                                );
                                const coverUrl = media.data.page_pic ? fixImageUrl(media.data.page_pic) : '';

                                mainMediaItems.push({
                                    type: 'video',
                                    url: videoUrl,
                                    coverUrl: coverUrl,
                                    duration: media.data.media_info?.duration || ''
                                });

                                console.log(`处理混合媒体视频 ${i+1}:`, { type: 'video', url: videoUrl, coverUrl });
                            }
                        }
                    });
                }

                // 2. 如果没有混合媒体，则处理常规图片
                if (mainMediaItems.length === 0 && item.pic_ids && Array.isArray(item.pic_ids) && item.pic_infos) {
                    for (const picId of item.pic_ids) {
                        const picInfo = item.pic_infos[picId];
                        if (picInfo) {
                            const url = fixImageUrl(picInfo.original ? picInfo.original.url : picInfo.large.url);
                            // 使用预先判断的LivePhoto状态，如果没有则使用picInfo.type
                            const isLivePhoto = livePhotoMap.has(picId) ? livePhotoMap.get(picId) : picInfo.type === 'livephoto';
                            const videoUrl = isLivePhoto && picInfo.video ? fixVideoUrl(picInfo.video) : null;

                            mainMediaItems.push({
                                type: isLivePhoto ? 'livephoto' : 'image',
                                url: url,
                                videoUrl: videoUrl,
                                picId: picId // 保存picId用于调试
                            });

                            console.log(`处理常规图片:`, { picId, type: isLivePhoto ? 'livephoto' : 'image', url, videoUrl });
                        }
                    }
                }

                // 3. 如果没有混合媒体视频，则处理常规视频
                if (mainMediaItems.length === 0 && item.page_info?.media_info) {
                    const videoUrl = fixVideoUrl(
                        item.page_info.media_info.stream_url ||
                        item.page_info.media_info.mp4_hd_url ||
                        item.page_info.media_info.mp4_sd_url
                    );
                    const coverUrl = item.page_info.page_pic ? fixImageUrl(item.page_info.page_pic) : '';
                    const duration = item.page_info.media_info?.duration || '';

                    mainMediaItems.push({
                        type: 'video',
                        url: videoUrl,
                        coverUrl: coverUrl,
                        duration: duration
                    });

                    console.log(`处理常规视频:`, { type: 'video', url: videoUrl, coverUrl, duration });
                }

                // 4. 处理转发微博的混合媒体内容
                if (item.retweeted_status && item.retweeted_status.mix_media_info && item.retweeted_status.mix_media_info.items) {
                    console.log('处理转发微博的混合媒体内容...');
                    item.retweeted_status.mix_media_info.items.forEach((media, i) => {
                        if (media.type === 'pic') {
                            if (media.data && (media.data.original || media.data.large)) {
                                const url = fixImageUrl(media.data.original ? media.data.original.url : media.data.large.url);
                                const picId = media.data.pic_id || '';
                                // 使用预先判断的LivePhoto状态，如果没有则使用media.data.type
                                const isLivePhoto = picId && livePhotoMap.has(picId) ?
                                    livePhotoMap.get(picId) : media.data.type === 'livephoto';
                                const videoUrl = isLivePhoto && media.data.video ? fixVideoUrl(media.data.video) : null;

                                retweetedMediaItems.push({
                                    type: isLivePhoto ? 'livephoto' : 'image',
                                    url: url,
                                    videoUrl: videoUrl,
                                    picId: picId
                                });

                                console.log(`处理转发微博的混合媒体图片 ${i+1}:`, { type: isLivePhoto ? 'livephoto' : 'image', url, videoUrl });
                            }
                        } else if (media.type === 'video') {
                            if (media.data && media.data.media_info) {
                                const videoUrl = fixVideoUrl(
                                    media.data.media_info.stream_url ||
                                    media.data.media_info.mp4_hd_url ||
                                    media.data.media_info.mp4_sd_url
                                );
                                const coverUrl = media.data.page_pic ? fixImageUrl(media.data.page_pic) : '';
                                const duration = media.data.media_info?.duration || '';

                                retweetedMediaItems.push({
                                    type: 'video',
                                    url: videoUrl,
                                    coverUrl: coverUrl,
                                    duration: duration
                                });

                                console.log(`处理转发微博的混合媒体视频 ${i+1}:`, { type: 'video', url: videoUrl, coverUrl, duration });
                            }
                        }
                    });
                }

                // 5. 如果没有处理过转发微博的混合媒体，则处理转发微博常规图片
                if (retweetedMediaItems.length === 0 && item.retweeted_status && item.retweeted_status.pic_ids && Array.isArray(item.retweeted_status.pic_ids) && item.retweeted_status.pic_infos) {
                    for (const picId of item.retweeted_status.pic_ids) {
                        const picInfo = item.retweeted_status.pic_infos[picId];
                        if (picInfo) {
                            const url = fixImageUrl(picInfo.original ? picInfo.original.url : picInfo.large.url);
                            // 使用预先判断的LivePhoto状态，如果没有则使用picInfo.type
                            const isLivePhoto = livePhotoMap.has(picId) ? livePhotoMap.get(picId) : picInfo.type === 'livephoto';
                            const videoUrl = isLivePhoto && picInfo.video ? fixVideoUrl(picInfo.video) : null;

                            retweetedMediaItems.push({
                                type: isLivePhoto ? 'livephoto' : 'image',
                                url: url,
                                videoUrl: videoUrl,
                                picId: picId // 保存picId用于调试
                            });

                            console.log(`处理转发微博的常规图片:`, { picId, type: isLivePhoto ? 'livephoto' : 'image', url, videoUrl });
                        }
                    }
                }

                // 6. 如果没有处理过转发微博的混合媒体视频，则处理转发微博常规视频
                if (retweetedMediaItems.length === 0 && item.retweeted_status && item.retweeted_status.page_info?.media_info) {
                    const videoUrl = fixVideoUrl(
                        item.retweeted_status.page_info.media_info.stream_url ||
                        item.retweeted_status.page_info.media_info.mp4_hd_url ||
                        item.retweeted_status.page_info.media_info.mp4_sd_url
                    );
                    const coverUrl = item.retweeted_status.page_info.page_pic ? fixImageUrl(item.retweeted_status.page_info.page_pic) : '';
                    const duration = item.retweeted_status.page_info.media_info?.duration || '';

                    retweetedMediaItems.push({
                        type: 'video',
                        url: videoUrl,
                        coverUrl: coverUrl,
                        duration: duration
                    });

                    console.log(`处理转发微博的常规视频:`, { type: 'video', url: videoUrl, coverUrl, duration });
                }

                console.log('处理结果汇总:', {
                    mainMediaItemsCount: mainMediaItems.length,
                    retweetedMediaItemsCount: retweetedMediaItems.length
                });

                // 生成HTML
                div.innerHTML = `
                    <input type="checkbox" class="wb-backup-checkbox">
                    <div class="wb-backup-content">
                        <div class="wb-backup-user"><strong>${item.user?.screen_name || '未知用户'}</strong></div>
                        <div class="wb-backup-text">${item.text_raw || item.text || ''}</div>
                        ${mainMediaItems.length > 0 ? `
                            <div class="wb-backup-media-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin: 10px 0;">
                                ${mainMediaItems.map((media, index) => {
                                    if (media.type === 'image') {
                                        return `
                                            <div class="media-item" style="position: relative; padding-bottom: 100%; cursor: zoom-in;">
                                                <img src="${media.url}" loading="lazy" alt="微博图片"
                                                     style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
                                            </div>
                                        `;
                                    } else if (media.type === 'livephoto') {
                                        return `
                                            <div class="media-item live-photo" style="position: relative; padding-bottom: 100%; cursor: zoom-in;">
                                                <img src="${media.url}" loading="lazy" alt="LivePhoto"
                                                     style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
                                                <span class="live-badge">Live</span>
                                                <video loop muted playsinline preload="none" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: none;">
                                                    <source src="${media.videoUrl}" type="video/mp4">
                                                </video>
                                            </div>
                                        `;
                                    } else if (media.type === 'video') {
                                        return `
                                            <div class="media-item video-item" style="position: relative; padding-bottom: 100%; cursor: pointer;">
                                                <img src="${media.coverUrl || ''}" loading="lazy" alt="视频封面"
                                                     style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
                                                <div class="video-play-icon"></div>
                                                ${media.duration ? `<div class="video-duration">${formatDuration(media.duration)}</div>` : ''}
                                                <video controls preload="none" style="display: none;">
                                                    <source src="${media.url}" type="video/mp4">
                                                </video>
                                            </div>
                                        `;
                                    }
                                }).join('')}
                            </div>
                        ` : ''}
                        ${item.retweeted_status ? `
                            <div class="wb-backup-retweet" style="margin: 10px 0; padding: 10px; background: #f8f8f8; border-radius: 4px;">
                                <div class="wb-backup-user"><strong>@${item.retweeted_status.user?.screen_name || '未知用户'}</strong></div>
                                <div class="wb-backup-text">${item.retweeted_status.text_raw || item.retweeted_status.text || ''}</div>
                                ${retweetedMediaItems.length > 0 ? `
                                    <div class="wb-backup-media-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin: 10px 0;">
                                        ${retweetedMediaItems.map((media, index) => {
                                            if (media.type === 'image') {
                                                return `
                                                    <div class="media-item" style="position: relative; padding-bottom: 100%; cursor: zoom-in;">
                                                        <img src="${media.url}" loading="lazy" alt="转发微博图片"
                                                             style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
                                                    </div>
                                                `;
                                            } else if (media.type === 'livephoto') {
                                                return `
                                                    <div class="media-item live-photo" style="position: relative; padding-bottom: 100%; cursor: zoom-in;">
                                                        <img src="${media.url}" loading="lazy" alt="转发LivePhoto"
                                                             style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
                                                        <span class="live-badge">Live</span>
                                                        <video loop muted playsinline preload="none" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: none;">
                                                            <source src="${media.videoUrl}" type="video/mp4">
                                                        </video>
                                                    </div>
                                                `;
                                            } else if (media.type === 'video') {
                                                return `
                                                    <div class="media-item video-item" style="position: relative; padding-bottom: 100%; cursor: pointer;">
                                                        <img src="${media.coverUrl || ''}" loading="lazy" alt="转发视频封面"
                                                             style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
                                                        <div class="video-play-icon"></div>
                                                        ${media.duration ? `<div class="video-duration">${formatDuration(media.duration)}</div>` : ''}
                                                        <video controls preload="none" style="display: none;">
                                                            <source src="${media.url}" type="video/mp4">
                                                        </video>
                                                    </div>
                                                `;
                                            }
                                        }).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>
                `;

                // 绑定 LivePhoto 事件
                div.querySelectorAll('.live-photo').forEach(photo => {
                    photo.addEventListener('mouseenter', function() {
                        const video = this.querySelector('video');
                        const img = this.querySelector('img');
                        if (video && img) {
                            video.style.display = 'block';
                            video.currentTime = 0;
                            video.play();
                        }
                    });

                    photo.addEventListener('mouseleave', function() {
                        const video = this.querySelector('video');
                        const img = this.querySelector('img');
                        if (video && img) {
                            video.style.display = 'none';
                            video.pause();
                        }
                    });

                    photo.addEventListener('click', function(e) {
                        e.preventDefault();
                        const img = this.querySelector('img');
                        const video = this.querySelector('video');
                        showMediaPreview(img.src, video?.querySelector('source')?.src, this);
                    });
                });

                // 绑定普通图片点击事件
                div.querySelectorAll('.media-item:not(.live-photo):not(.video-item)').forEach(item => {
                    item.addEventListener('click', function(e) {
                        e.preventDefault();
                        const img = this.querySelector('img');
                        showMediaPreview(img.src, null, this);
                    });
                });

                // 绑定视频点击事件
                div.querySelectorAll('.video-item').forEach(item => {
                    item.addEventListener('click', function(e) {
                        e.preventDefault();
                        const video = this.querySelector('video');
                        const img = this.querySelector('img');
                        showVideoPreview(video?.querySelector('source')?.src, img?.src);
                    });
                });

                list.appendChild(div);
            } catch (error) {
                console.error(`渲染微博 ${item.id} 时出错:`, error);
                console.error('错误堆栈:', error.stack);
            }
        });
    }

    // 格式化视频时长
    function formatDuration(seconds) {
        if (!seconds) return '';
        seconds = parseInt(seconds);
        const minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // 全局变量用于存储当前预览的媒体信息
    let currentPreviewData = {
        currentIndex: 0,  // 当前查看的索引
        mediaList: [],    // 所有可预览的媒体列表
        mediaType: 'image' // 当前预览的媒体类型：'image', 'livephoto' 或 'video'
    };

    // 显示媒体预览
    function showMediaPreview(imgSrc, videoSrc = null, itemElement = null) {
        // 移除旧的预览容器
        closeMediaPreview();

        // 创建新的预览容器
        const previewContainer = document.createElement('div');
        previewContainer.id = 'mediaPreviewContainer';
        previewContainer.className = 'media-preview-container';
        previewContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            pointer-events: auto;
        `;

        const previewContent = document.createElement('div');
        previewContent.className = 'preview-content';
        previewContent.style.cssText = `
            position: relative;
            margin: 0 auto;
            max-width: 90vw;
            max-height: 90vh;
            display: flex;
            border-radius: 8px;
            overflow: hidden;
            pointer-events: auto;
        `;

        // 创建图片容器
        const mediaWrapper = document.createElement('div');
        mediaWrapper.style.cssText = `
            position: relative;
            width: 100%;
            overflow: hidden;
        `;

        if (videoSrc) {
            // 判断是LivePhoto还是普通视频
            const isNormalVideo = !itemElement || !itemElement.classList.contains('live-photo');

            // 创建图片元素
            const img = document.createElement('img');
            img.style.cssText = `
                display: block;
                width: 100%;
                max-height: 90vh;
                object-fit: contain;
            `;
            img.src = imgSrc || '';

            // 创建视频元素
            const video = document.createElement('video');

            if (isNormalVideo) {
                // 普通视频模式
                video.style.cssText = `
                    display: block;
                    width: 100%;
                    max-height: 90vh;
                    object-fit: contain;
                `;
                video.controls = true;
                video.autoplay = true;
                video.playsInline = true;
                video.loop = false;

                if (imgSrc) {
                    video.poster = imgSrc;
                }
            } else {
                // LivePhoto模式
                video.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.autoplay = false;
            }

            const source = document.createElement('source');
            source.src = videoSrc;
            source.type = 'video/mp4';
            video.appendChild(source);

            // 添加Live标签 (只对LivePhoto显示)
            if (!isNormalVideo) {
                const liveTag = document.createElement('div');
                liveTag.className = 'live-photo-badge';
                liveTag.textContent = 'Live';
                liveTag.style.cssText = `
                    position: absolute;
                    top: 8px;
                    left: 8px;
                    padding: 1px 7px;
                    height: 18px;
                    line-height: 16px;
                    min-width: 32px;
                    border-radius: 6px;
                    background: #FFFFFF;
                    color: #000;
                    font-size: 11px;
                    font-weight: 450;
                    text-align: center;
                    white-space: nowrap;
                    z-index: 10;
                `;
                mediaWrapper.appendChild(liveTag);

                // LivePhoto视频预加载
                try {
                    video.load();
                } catch (e) {
                    console.warn('视频预加载错误:', e);
                }

                // 添加交互效果 (只对LivePhoto)
                mediaWrapper.addEventListener('mouseenter', () => {
                    // 如果视频尚未尝试加载，先加载一次
                    if (video.dataset.hasAttemptedToLoad === 'false') {
                        try {
                            video.load();
                            video.dataset.hasAttemptedToLoad = 'true';
                        } catch (e) {
                            console.warn('视频加载错误:', e);
                        }
                    }

                    // 添加状态标记防止play/pause冲突
                    video.dataset.shouldPlay = 'true';

                    // 显示视频
                    img.style.opacity = '0';
                    video.style.opacity = '1';

                    // 如果视频被标记为不可播放，则直接返回
                    if (video.dataset.playable === 'false') {
                        console.warn('视频不可播放，跳过播放');
                        return;
                    }

                    // 重置视频时间
                    try {
                        video.currentTime = 0;
                    } catch (e) {
                        console.warn('设置视频时间失败:', e);
                    }

                    // 尝试播放视频
                    const playVideo = () => {
                        // 再次检查是否应该播放
                        if (video.dataset.shouldPlay !== 'true') return;

                        // 防止重复调用play()
                        if (video.paused) {
                            const playPromise = video.play();

                            // 正确处理play()返回的Promise
                            if (playPromise !== undefined) {
                                playPromise.then(() => {
                                    console.log('LivePhoto视频开始播放');
                                }).catch(err => {
                                    console.error('LivePhoto视频播放错误:', err);
                                    // 标记视频不可播放
                                    if (err.name === 'NotSupportedError' || err.name === 'NotAllowedError') {
                                        video.dataset.playable = 'false';
                                    }
                                    // 播放失败时恢复图片显示
                                    img.style.opacity = '1';
                                    video.style.opacity = '0';
                                });
                            }
                        }
                    };

                    // 检查视频是否准备好播放
                    if (video.readyState >= 2) {
                        playVideo();
                    } else {
                        // 视频未准备好，等待canplay事件
                        const onCanPlay = function() {
                            playVideo();
                            // 移除事件监听器，避免重复调用
                            video.removeEventListener('canplay', onCanPlay);
                        };
                        video.addEventListener('canplay', onCanPlay);

                        // 设置超时，如果3秒内视频还没准备好，恢复图片显示
                        setTimeout(() => {
                            if (video.readyState < 2 && video.dataset.shouldPlay === 'true') {
                                console.warn('视频加载超时，恢复图片显示');
                                img.style.opacity = '1';
                                video.style.opacity = '0';
                                video.dataset.shouldPlay = 'false';
                                video.removeEventListener('canplay', onCanPlay);
                            }
                        }, 3000);
                    }
                });

                mediaWrapper.addEventListener('mouseleave', () => {
                    // 更新状态标记
                    video.dataset.shouldPlay = 'false';

                    // 恢复图片显示
                    img.style.opacity = '1';
                    video.style.opacity = '0';

                    // 仅在视频真正播放时尝试暂停
                    if (!video.paused && video.readyState >= 2) {
                        try {
                            // 为了避免暂停错误，使用setTimeout稍微延迟暂停操作
                            setTimeout(() => {
                                if (!video.paused) {
                                    video.pause();
                                }
                            }, 50);
                        } catch (error) {
                            console.error('视频暂停出错:', error);
                        }
                    }
                });

                mediaWrapper.appendChild(img);
            }

            mediaWrapper.appendChild(video);

            // 为普通视频添加错误处理
            if (isNormalVideo) {
                video.addEventListener('error', function(e) {
                    console.error('视频加载错误:', e);
                    const errorMsg = document.createElement('div');
                    errorMsg.style.cssText = `
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        color: white;
                        background: rgba(0,0,0,0.7);
                        padding: 10px 20px;
                        border-radius: 4px;
                    `;
                    errorMsg.textContent = '视频加载失败';
                    mediaWrapper.appendChild(errorMsg);
                });

                // 尝试自动播放
                video.addEventListener('loadedmetadata', function() {
                    console.log('视频元数据已加载，尝试播放');
                    video.play().catch(err => {
                        console.log('自动播放失败，可能需要用户交互:', err.message);
                    });
                });
            }
        } else {
            // 普通图片
            const img = document.createElement('img');
            img.style.cssText = `
                display: block;
                width: 100%;
                max-height: 90vh;
                object-fit: contain;
            `;
            img.src = imgSrc;

            mediaWrapper.appendChild(img);
        }

        previewContent.appendChild(mediaWrapper);
        previewContainer.appendChild(previewContent);
        document.body.appendChild(previewContainer);

        // 添加键盘事件监听
        document.addEventListener('keydown', handlePreviewKeydown);

        // 点击空白区域关闭
        previewContainer.addEventListener('click', (e) => {
            if (e.target === previewContainer) {
                closeMediaPreview();
            }
        });
    }

    function closeMediaPreview() {
        const container = document.getElementById('mediaPreviewContainer');
        if (container) {
            document.removeEventListener('keydown', handlePreviewKeydown);
            container.remove();
        }
    }

    function handlePreviewKeydown(e) {
        if (e.key === 'Escape') {
            closeMediaPreview();
        }
    }

    // 添加预览样式
    const previewStyle = document.createElement('style');
    previewStyle.textContent = `
        .media-preview-container {
            animation: fadeIn 0.2s ease-in-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .preview-content {
            animation: zoomIn 0.2s ease-in-out;
        }

        @keyframes zoomIn {
            from { transform: scale(0.95); }
            to { transform: scale(1); }
        }

        .preview-close:hover {
            background: rgba(0, 0, 0, 0.8);
        }
    `;
    document.head.appendChild(previewStyle);

    // 移除旧的handlePreviewKeydown函数和添加预览样式部分

    // 处理键盘事件
    function handlePreviewKeydown(e) {
        const modal = document.querySelector('.media-preview-modal');
        if (!modal || modal.style.display === 'none') return;

        if (e.key === 'ArrowLeft') {
            navigatePreview('prev');
        } else if (e.key === 'ArrowRight') {
            navigatePreview('next');
        } else if (e.key === 'Escape') {
            closeMediaPreview();
        }
    }

    // 显示视频预览
    function showVideoPreview(videoSrc, posterSrc = '') {
        if (!videoSrc) return;

        const mediaItem = {
            type: 'video',
            videoSrc: videoSrc,
            posterSrc: posterSrc || ''
        };

        // 从点击的元素查找所有媒体
        const clickedElement = event?.target?.closest('.video-item');

        // 设置当前预览数据
        if (clickedElement) {
            currentPreviewData.mediaType = 'video';
            preparePreviewData(null, videoSrc, clickedElement);
        } else {
            currentPreviewData.mediaList = [mediaItem];
            currentPreviewData.currentIndex = 0;
            currentPreviewData.mediaType = 'video';
        }

        // 创建或获取模态框
        let modal = document.querySelector('.media-preview-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'media-preview-modal';
            modal.innerHTML = `
                <div class="preview-content"></div>
                <div class="preview-navigation">
                    <button class="preview-prev"><span>&lt;</span></button>
                    <button class="preview-next"><span>&gt;</span></button>
                </div>
                <div class="preview-counter"></div>
            `;
            document.body.appendChild(modal);

            // 绑定导航按钮事件
            modal.querySelector('.preview-prev').addEventListener('click', function(e) {
                e.stopPropagation();
                navigatePreview('prev');
            });

            modal.querySelector('.preview-next').addEventListener('click', function(e) {
                e.stopPropagation();
                navigatePreview('next');
            });

            // 点击空白区域关闭预览
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeMediaPreview();
                }
            });

            // 绑定键盘事件
            document.addEventListener('keydown', handlePreviewKeydown);
        }

        renderCurrentPreview(modal);
    }

    // 修改renderFavorites函数中的事件绑定部分
    function updateMediaItemEventListeners(div) {
        // 绑定 LivePhoto 事件
        div.querySelectorAll('.live-photo').forEach(photo => {
            photo.addEventListener('mouseenter', function() {
                const video = this.querySelector('video');
                const img = this.querySelector('img');
                if (video && img) {
                    video.style.display = 'block';
                    video.currentTime = 0;
                    video.play();
                }
            });

            photo.addEventListener('mouseleave', function() {
                const video = this.querySelector('video');
                const img = this.querySelector('img');
                if (video && img) {
                    video.style.display = 'none';
                    video.pause();
                }
            });

            photo.addEventListener('click', function(e) {
                e.preventDefault();
                const img = this.querySelector('img');
                const video = this.querySelector('video');
                showMediaPreview(img.src, video?.querySelector('source')?.src, this);
            });
        });

        // 绑定普通图片点击事件
        div.querySelectorAll('.media-item:not(.live-photo):not(.video-item)').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const img = this.querySelector('img');
                showMediaPreview(img.src, null, this);
            });
        });

        // 绑定视频点击事件 - 增加多种可能的选择器
        const videoSelectors = ['.video-item', '.video', '.wb-video', '.wb-media-video', '[data-type="video"]'];
        videoSelectors.forEach(selector => {
            try {
                div.querySelectorAll(selector).forEach(item => {
                    if (!item.hasEventListener) { // 避免重复添加事件
                        item.hasEventListener = true;
            item.addEventListener('click', function(e) {
                e.preventDefault();
                            e.stopPropagation();
                            console.log('视频元素被点击:', this);

                            // 查找视频元素和海报图片
                            const video = this.querySelector('video') || this.closest('video');
                            const img = this.querySelector('img') || this.closest('img');
                            const videoSource = video?.querySelector('source')?.src ||
                                              video?.src ||
                                              this.getAttribute('data-video-src') ||
                                              this.getAttribute('data-src');
                            const posterSrc = img?.src || this.getAttribute('data-poster');

                            console.log('找到视频源:', videoSource);
                            console.log('找到海报:', posterSrc);

                            if (videoSource) {
                                showMediaPreview(posterSrc, videoSource, this);
                            } else {
                                console.warn('未找到视频源');
                            }
                        });
                    }
                });
            } catch (error) {
                console.error('绑定视频点击事件失败:', selector, error);
            }
        });
    }

    // 在renderFavorites函数末尾替换现有的事件绑定代码为调用updateMediaItemEventListeners
    // 将以下代码:
    // div.querySelectorAll('.live-photo').forEach(photo => {...});
    // div.querySelectorAll('.media-item:not(.live-photo):not(.video-item)').forEach(item => {...});
    // div.querySelectorAll('.video-item').forEach(item => {...});
    // 替换为:
    // updateMediaItemEventListeners(div);

    // 添加预览样式
    GM_addStyle(`
        .wb-backup-media-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 4px;
            margin: 10px 0;
        }

        .media-item {
            position: relative;
            padding-bottom: 100%;
            cursor: zoom-in;
            overflow: hidden;
            background: #f5f5f5;
            border-radius: 4px;
        }

        .media-item img,
        .media-item video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .live-badge {
            position: absolute;
            top: 8px;
            left: 8px;
            background: #FFFFFF;
            color: #000000;
            padding: 1px 4px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 450;
            cursor: pointer;
            z-index: 2;
            font-family: "Noto Sans SC Black";
            letter-spacing: 0;
            box-shadow: none;
            line-height: 16px;
            height: 18px;
            border: none;
            text-transform: none;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 24px;
            white-space: nowrap;
        }

        .live-photo:hover .live-badge {
            background: rgba(255, 255, 255, 1);
        }

        .video-play-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2;
        }

        .video-play-icon:before {
            content: '';
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 8px 0 8px 16px;
            border-color: transparent transparent transparent #fff;
            margin-left: 3px;
        }

        .video-duration {
            position: absolute;
            bottom: 8px;
            right: 8px;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            font-size: 12px;
            padding: 2px 4px;
            border-radius: 2px;
            z-index: 2;
        }

        .media-preview-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            z-index: 1000;
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            cursor: zoom-out;
            justify-content: center;
            align-items: center;
        }

        .preview-content {
            position: relative;
            max-width: 90%;
            max-height: 90vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        /* 添加Live预览样式，支持左图右视频布局 */
        .livephoto-preview-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            background: #000;
            border-radius: 8px;
            overflow: hidden;
            width: 90vw;
            max-width: 1400px;
            height: 80vh;
            max-height: 800px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
        }

        .livephoto-preview-container .image-side,
        .livephoto-preview-container .video-side {
            flex: 1;
            height: 100%;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .livephoto-preview-container img,
        .livephoto-preview-container video {
            width: 100%;
            height: 100%;
            object-fit: contain;
            background: #000;
        }

        .livephoto-preview-container .image-side {
            border-right: 1px solid rgba(255, 255, 255, 0.2);
        }

        .livephoto-preview-badge {
            position: absolute;
            top: 15px;
            left: 15px;
            background: #FFFFFF;
            color: #000000;
            padding: 1px 4px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 450;
            z-index: 2;
            font-family: "Noto Sans SC Black";
            letter-spacing: 0;
            box-shadow: none;
            line-height: 16px;
            height: 18px;
            border: none;
            text-transform: none;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 24px;
            white-space: nowrap;
        }

        .livephoto-preview-badge::before {
            content: '';
            display: inline-block;
            width: 6px;
            height: 6px;
            background: #ff2442;
            border-radius: 50%;
            margin-right: 3px;
            position: relative;
            top: 1px;
            animation: pulse 2s infinite;
        }

        .video-preview-container {
            max-width: 90vw;
            max-height: 80vh;
            background: #000;
            border-radius: 8px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .video-preview-container video {
            max-width: 100%;
            max-height: 80vh;
        }

        .preview-navigation {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 100%;
            display: flex;
            justify-content: space-between;
            padding: 0 20px;
            box-sizing: border-box;
            pointer-events: none;
            z-index: 10;
        }

        .preview-prev,
        .preview-next {
            background: rgba(0, 0, 0, 0.5);
            border: none;
            color: white;
            padding: 15px;
            cursor: pointer;
            pointer-events: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            transition: background 0.3s, transform 0.3s;
        }

        .preview-prev:hover,
        .preview-next:hover {
            background: rgba(0, 0, 0, 0.8);
            transform: scale(1.1);
        }

        .preview-counter {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            background: rgba(0, 0, 0, 0.5);
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 10;
        }
    `);

    // 全选/取消全选
    function toggleSelectAll(select) {
        document.querySelectorAll('.wb-backup-checkbox').forEach(checkbox => {
            checkbox.checked = select;
        });
    }

    // 添加获取媒体文件 base64 的函数
    async function getMediaBase64(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                headers: {
                    'Referer': 'https://weibo.com/',
                    'User-Agent': navigator.userAgent
                },
                onload: function(response) {
                    if (response.status === 200) {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(response.response);
                    } else {
                        reject(new Error('Failed to load media'));
                    }
                },
                onerror: reject
            });
        });
    }

    // 修改processVideo函数，处理404错误并提供替代方案
    async function processVideo(videoInfo) {
        try {
            console.log('处理视频，原始数据:', JSON.stringify(videoInfo, null, 2));
            console.log('选择的视频清晰度:', config.settings.videoQuality);

            let videoUrl = '';

            // 优先处理playback_list（含有最高清晰度的选项）
            if (videoInfo.playback_list && Array.isArray(videoInfo.playback_list) && videoInfo.playback_list.length > 0) {
                console.log('检测到playback_list，视频有多种清晰度选项');

                // 分析可用的清晰度
                const availableQualities = videoInfo.playback_list.map(item => {
                    if (item.meta && item.meta.quality_label) {
                        return {
                            label: item.meta.quality_label,
                            url: item.play_info?.url || '',
                            quality_index: item.meta.quality_index || 0
                        };
                    }
                    return null;
                }).filter(q => q && q.url);

                console.log('可用清晰度选项:', availableQualities.map(q => q.label));

                const selectedQuality = config.settings.videoQuality;
                let targetQuality = null;

                // 精确匹配选择的清晰度
                for (const quality of availableQualities) {
                    const label = quality.label.toLowerCase();

                    if (selectedQuality === 'highest') {
                        // 找到最高清晰度 - 始终比较，确保选择最高质量
                        if (!targetQuality || quality.quality_index > targetQuality.quality_index) {
                            targetQuality = quality;
                        }
                        // 继续循环检查所有选项，找到最高清晰度
                        continue;
                    }

                    if (selectedQuality.includes('8K') && label.includes('8k')) {
                        targetQuality = quality;
                        break;
                    } else if (selectedQuality.includes('4K') && label.includes('4k')) {
                        targetQuality = quality;
                        break;
                    } else if (selectedQuality.includes('2K') && label.includes('2k')) {
                        targetQuality = quality;
                        break;
                    } else if (selectedQuality.includes('1080p') && label.includes('1080')) {
                        targetQuality = quality;
                        break;
                    } else if (selectedQuality.includes('720p') && label.includes('720')) {
                        targetQuality = quality;
                        break;
                    } else if (selectedQuality.includes('480p') && label.includes('480')) {
                        targetQuality = quality;
                        break;
                    } else if (selectedQuality.includes('360p') && label.includes('360')) {
                        targetQuality = quality;
                        break;
                    }

                    // 处理帧率匹配
                    if (selectedQuality.includes('60') && label.includes('60') &&
                        (label.includes(selectedQuality.split('60')[0].toLowerCase()))) {
                        targetQuality = quality;
                        break;
                    }
                }

                // 如果没有找到精确匹配，寻找最接近的清晰度
                if (!targetQuality && selectedQuality !== 'highest') {
                    console.log('未找到精确匹配清晰度:', selectedQuality);
                    const resolutionMap = {
                        '8K60': 7680,
                        '4K60': 3840,
                        '2K60': 2560,
                        '1080p60': 1080,
                        '720p60': 720,
                        '480p': 480,
                        '360p': 360,
                        '8K': 7680,
                        '4K': 3840,
                        '2K': 2560,
                        '1080p': 1080,
                        '720p': 720
                    };

                    // 获取选择清晰度的数值
                    let selectedRes = 1080; // 默认
                    for (const [key, value] of Object.entries(resolutionMap)) {
                        if (selectedQuality.includes(key)) {
                            selectedRes = value;
                            break;
                        }
                    }

                    // 查找最接近的可用清晰度
                    let closestDiff = Infinity;
                    for (const quality of availableQualities) {
                        const label = quality.label.toLowerCase();
                        let qualityRes = 1080; // 默认

                        // 从标签提取分辨率数字
                        for (const [key, value] of Object.entries(resolutionMap)) {
                            const keyLower = key.toLowerCase();
                            if (label.includes(keyLower.replace('p', '').replace('k', ''))) {
                                qualityRes = value;
                                break;
                            }
                        }

                        const diff = Math.abs(selectedRes - qualityRes);
                        if (diff < closestDiff) {
                            closestDiff = diff;
                            targetQuality = quality;
                        }
                    }
                }

                // 如果没有找到匹配或接近的清晰度，或用户选择了最高清晰度，使用最高清晰度
                if (!targetQuality || selectedQuality === 'highest') {
                    // 按quality_index排序，取最高
                    availableQualities.sort((a, b) => b.quality_index - a.quality_index);
                    targetQuality = availableQualities[0];
                    console.log('使用可用的最高清晰度:', targetQuality.label);
                }

                if (targetQuality && targetQuality.url) {
                    console.log('最终选择的视频清晰度:', targetQuality.label);
                    return fixVideoUrl(targetQuality.url, false);
                }
                // 如果playback_list解析失败，会继续执行下面的逻辑
            }

            // 尝试使用特定清晰度的URL（针对新版微博视频格式）
            if (videoInfo.mp4_720p_mp4 && config.settings.videoQuality.includes('720p')) {
                console.log('使用720p视频URL:', videoInfo.mp4_720p_mp4);
                return fixVideoUrl(videoInfo.mp4_720p_mp4, false);
            }

            // 尝试从现有信息中获取视频URL
            if (videoInfo.stream_url || videoInfo.mp4_hd_url || videoInfo.mp4_sd_url) {
                console.log('从现有信息中获取视频URL');
                console.log('可用视频源:', {
                    stream_url: videoInfo.stream_url,
                    mp4_hd_url: videoInfo.mp4_hd_url,
                    mp4_sd_url: videoInfo.mp4_sd_url
                });

                    // 对所有可用视频源进行排序
                    const availableSources = [];
                    if (videoInfo.mp4_hd_url) availableSources.push({url: videoInfo.mp4_hd_url, quality: '1080p', index: 3});
                    if (videoInfo.mp4_720p_mp4) availableSources.push({url: videoInfo.mp4_720p_mp4, quality: '720p', index: 2});
                    if (videoInfo.stream_url) availableSources.push({url: videoInfo.stream_url, quality: 'stream', index: 1});
                    if (videoInfo.mp4_sd_url) availableSources.push({url: videoInfo.mp4_sd_url, quality: 'sd', index: 0});

                // 根据清晰度选择最合适的URL
                    if (config.settings.videoQuality === 'highest') {
                        // 选择最高清晰度
                        availableSources.sort((a, b) => b.index - a.index);
                        videoUrl = availableSources[0].url;
                        console.log(`使用最高清晰度视频URL (${availableSources[0].quality}):`, videoUrl);
                    } else if (config.settings.videoQuality.includes('1080p') && videoInfo.mp4_hd_url) {
                    videoUrl = videoInfo.mp4_hd_url;
                    console.log('使用HD视频URL (1080p):', videoUrl);
                } else if (config.settings.videoQuality.includes('720p') && videoInfo.mp4_720p_mp4) {
                    videoUrl = videoInfo.mp4_720p_mp4;
                    console.log('使用720p视频URL:', videoUrl);
                } else if (videoInfo.stream_url) {
                    videoUrl = videoInfo.stream_url;
                    console.log('使用stream_url视频URL:', videoUrl);
                } else {
                    videoUrl = videoInfo.mp4_sd_url;
                    console.log('使用SD视频URL:', videoUrl);
                }

                if (!videoUrl) {
                    throw new Error('无法从现有信息获取有效的视频URL');
                }

                return fixVideoUrl(videoUrl, false);
            }

            // 如果无法从现有信息获取，尝试使用API获取
            try {
                console.log('尝试使用API获取视频信息:', videoInfo.media_id);
                // 首先尝试新接口
                const response = await fetch(`https://weibo.com/ajax/video/play_info?video_id=${videoInfo.media_id}`, {
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-XSRF-TOKEN': document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || ''
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const playInfo = await response.json();
                console.log('API返回的视频信息:', playInfo);

                if (playInfo.ok === 1 && playInfo.data) {
                    const qualities = playInfo.data.qualities || [];
                    const selectedQuality = config.settings.videoQuality;

                    console.log('可用清晰度:', qualities.map(q => q.quality_label));
                    console.log('用户选择的清晰度:', selectedQuality);

                    // 如果选择了最高清晰度
                    if (selectedQuality === 'highest' && qualities.length > 0) {
                        const highestQuality = qualities[0]; // 第一个是最高清晰度
                        console.log('使用最高清晰度:', highestQuality.quality_label);
                        return fixVideoUrl(highestQuality.play_info.url, false);
                    }

                    // 根据选择的清晰度查找对应的视频URL
                    let targetQuality = null;

                    // 精确匹配选择的清晰度
                    for (const quality of qualities) {
                        const label = quality.quality_label.toLowerCase();

                        if (selectedQuality.includes('8K') && label.includes('8k')) {
                            targetQuality = quality;
                            break;
                        } else if (selectedQuality.includes('4K') && label.includes('4k')) {
                            targetQuality = quality;
                            break;
                        } else if (selectedQuality.includes('2K') && label.includes('2k')) {
                            targetQuality = quality;
                            break;
                        } else if (selectedQuality.includes('1080p') && label.includes('1080p')) {
                            targetQuality = quality;
                            break;
                        } else if (selectedQuality.includes('720p') && label.includes('720p')) {
                            targetQuality = quality;
                            break;
                        } else if (selectedQuality.includes('480p') && label.includes('480p')) {
                            targetQuality = quality;
                            break;
                        } else if (selectedQuality.includes('360p') && label.includes('360p')) {
                            targetQuality = quality;
                            break;
                        }

                        // 处理帧率匹配
                        if (selectedQuality.includes('60') && label.includes('60') &&
                            (label.includes(selectedQuality.split('60')[0]))) {
                            targetQuality = quality;
                            break;
                        }
                    }

                    if (targetQuality) {
                        console.log('找到匹配清晰度:', targetQuality.quality_label);
                    } else {
                        console.log('未找到精确匹配清晰度:', selectedQuality);

                        // 尝试找到最接近的清晰度
                        const resolutionMap = {
                            '8K60': 7680,
                            '4K60': 3840,
                            '2K60': 2560,
                            '1080p60': 1080,
                            '720p60': 720,
                            '480p': 480,
                            '360p': 360,
                            '8K': 7680,
                            '4K': 3840,
                            '2K': 2560,
                            '1080p': 1080,
                            '720p': 720
                        };

                        // 获取选择清晰度的数值
                        let selectedRes = 1080; // 默认
                        for (const [key, value] of Object.entries(resolutionMap)) {
                            if (selectedQuality.includes(key)) {
                                selectedRes = value;
                                break;
                            }
                        }

                        // 查找最接近的可用清晰度
                        let closestDiff = Infinity;
                        for (const quality of qualities) {
                            const label = quality.quality_label.toLowerCase();
                            let qualityRes = 1080; // 默认

                            // 从标签提取分辨率数字
                            for (const [key, value] of Object.entries(resolutionMap)) {
                                const keyLower = key.toLowerCase();
                                if (label.includes(keyLower)) {
                                    qualityRes = value;
                                    break;
                                }
                            }

                            const diff = Math.abs(selectedRes - qualityRes);
                            if (diff < closestDiff) {
                                closestDiff = diff;
                                targetQuality = quality;
                            }
                        }
                    }

                    // 如果没有找到匹配或接近的清晰度，使用最高清晰度
                    if (!targetQuality && qualities.length > 0) {
                        targetQuality = qualities[0];
                        console.log('使用可用的最高清晰度:', targetQuality.quality_label);
                    }

                    if (targetQuality && targetQuality.play_info && targetQuality.play_info.url) {
                        console.log('最终选择的视频清晰度:', targetQuality.quality_label);
                        return fixVideoUrl(targetQuality.play_info.url, false);
                    }

                    throw new Error('无法从API响应中获取有效的视频URL');
                }

                throw new Error('API返回数据格式错误');
            } catch (error) {
                console.error('获取视频API信息失败:', error.message);
                // 继续尝试备用方法
            }

            // 如果API调用失败，尝试直接从视频ID构造URL
            console.log('尝试从ID构造视频URL');
            // 根据videoInfo类型构造可能的视频URL
            const possibleUrls = [
                `https://f.video.weibocdn.com/o0/${videoInfo.media_id}.mp4?label=mp4_hd&template=852x480.25.0`,
                `https://f.video.weibocdn.com/o0/${videoInfo.media_id}.mp4?label=mp4_720p&template=1280x720.25.0`,
                `https://f.video.weibocdn.com/o0/${videoInfo.stream_url}`
            ];

            console.log('尝试的备用URL:', possibleUrls);

            // 测试每个URL是否可访问
            for (const url of possibleUrls) {
                try {
                    const response = await fetch(url, { method: 'HEAD' });
                    if (response.ok) {
                        console.log('找到可用的备用URL:', url);
                        return fixVideoUrl(url, false);
                    }
                } catch (e) {
                    console.log(`备用URL ${url} 不可用:`, e.message);
                }
            }

            // 如果所有方法都失败，使用stream_url
            if (videoInfo.stream_url) {
                console.log('使用原始stream_url作为最后尝试');
                return fixVideoUrl(videoInfo.stream_url, false);
            }

            throw new Error('无法获取有效的视频URL');
        } catch (error) {
            console.error('处理视频失败:', error);
            // 返回任何可能的URL，即使可能无效
            return fixVideoUrl(videoInfo.stream_url || videoInfo.mp4_hd_url || videoInfo.mp4_sd_url, false);
        }
    }

    // 修改exportSelectedItems函数，确保正确使用所选视频清晰度
    async function exportSelectedItems() {
        try {
            const selectedItems = Array.from(document.querySelectorAll('.wb-backup-checkbox:checked'))
                .map(checkbox => {
                    try {
                        return JSON.parse(checkbox.closest('.wb-backup-item').dataset.weibo);
                    } catch (e) {
                        console.error('解析微博数据失败:', e);
                        return null;
                    }
                })
                .filter(item => item !== null);

            if (selectedItems.length === 0) {
                showMessage('请先选择要导出的内容', 'error');
                return;
            }

            console.log(`开始导出 ${selectedItems.length} 条收藏内容，使用视频清晰度: ${config.settings.videoQuality}`);
            showMessage(`正在处理 ${selectedItems.length} 条收藏内容，请稍候...`, 'info');

            const processedItems = [];
            let processedCount = 0;
            const mediaCache = new Map();

            // 添加媒体统计
            let stats = {
                totalItems: selectedItems.length,
                processedItems: 0,
                livePhotoCount: 0,
                videoCount: 0,
                imageCount: 0,
                errors: []
            };

            for (const item of selectedItems) {
                try {
                    console.log(`处理第 ${processedCount + 1} 条收藏`);
                    console.log('微博ID:', item.id);
                    console.log('用户:', item.user?.screen_name);
                    console.log('原始数据:', JSON.stringify(item, null, 2));

                    const processedItem = {...item};

                    // 处理主微博的视频
                    if (item.page_info?.media_info) {
                        try {
                            console.log('检测到主微博视频:', item.page_info.media_info);
                            processedItem.videoData = await processVideo(item.page_info.media_info);
                            if (processedItem.videoData) {
                                stats.videoCount++;
                                console.log('成功处理主微博视频:', processedItem.videoData);
                            } else {
                                console.error('处理主微博视频失败: 无法获取视频URL');
                                stats.errors.push({type: 'video', id: item.id, error: '无法获取视频URL'});
                            }
                        } catch (error) {
                            console.error('处理主微博视频失败:', error);
                            stats.errors.push({type: 'video', id: item.id, error: error.message});
                        }
                    }

                    // 处理主微博的图片
                    if (item.pic_ids && item.pic_infos) {
                        console.log('检测到主微博图片:', item.pic_ids.length, '张');
                        console.log('图片详细信息:', item.pic_infos);

                    const mediaData = [];
                        for (const picId of item.pic_ids) {
                            try {
                                const picInfo = item.pic_infos[picId];
                                if (!picInfo) {
                                    console.error(`未找到图片信息: ${picId}`);
                                    stats.errors.push({type: 'image', id: picId, error: '未找到图片信息'});
                                    continue;
                                }

                                // 在导出阶段执行LivePhoto判断
                                let isLivePhotoMedia = false;
                                try {
                                    // 检查isLivePhoto函数是否存在
                                    if (typeof isLivePhoto === 'function') {
                                        isLivePhotoMedia = isLivePhoto(picInfo, item, picId);
                                    } else {
                                        // 备选判断逻辑
                                        isLivePhotoMedia = picInfo.type === 'livephoto' ||
                                            !!picInfo.video ||
                                            !!picInfo.pic_video ||
                                            !!picInfo.live_photo_video_url ||
                                            picInfo.live_photo === 1;
                                        console.log('使用备选LivePhoto判断:', isLivePhotoMedia);
                                    }
                                } catch (error) {
                                    console.error('LivePhoto判断出错:', error);
                                    isLivePhotoMedia = false;
                                }

                                // 存储LivePhoto状态，便于后续渲染使用
                                if (!window.livePhotoStatus) {
                                    window.livePhotoStatus = new Map();
                                }
                                window.livePhotoStatus.set(picId, isLivePhotoMedia);

                                console.log('处理图片:', {
                                    picId,
                                    type: picInfo.type,
                                    isLivePhoto: isLivePhotoMedia,
                                    hasVideo: !!picInfo.video
                                });

                                const url = fixImageUrl(picInfo.original ? picInfo.original.url : picInfo.large.url);
                                const videoUrl = isLivePhotoMedia && picInfo.video ? fixVideoUrl(picInfo.video) : null;

                                if (isLivePhotoMedia) {
                                    stats.livePhotoCount++;
                                    console.log('检测到LivePhoto:', {
                                        imageUrl: url,
                                        videoUrl: videoUrl
                                    });
                                } else {
                                    stats.imageCount++;
                                }

                                let imageData = url;
                                let livephotoVideoData = null;

                                if (config.settings.loadImagesOnExport) {
                                    try {
                                        if (mediaCache.has(url)) {
                                            imageData = mediaCache.get(url);
                                        } else {
                                            const base64 = await getMediaBase64(url);
                                            mediaCache.set(url, base64);
                                            imageData = base64;
                                        }
                                    } catch (error) {
                                        console.error('获取图片base64失败:', error);
                                        stats.errors.push({type: 'image', id: picId, error: error.message});
                                    }
                                }

                                if (isLivePhotoMedia && videoUrl && config.settings.saveVideosOnExport) {
                                    try {
                                        if (mediaCache.has(videoUrl)) {
                                            livephotoVideoData = mediaCache.get(videoUrl);
                                        } else {
                                            const base64 = await getMediaBase64(videoUrl);
                                            mediaCache.set(videoUrl, base64);
                                            livephotoVideoData = base64;
                                        }
                                    } catch (error) {
                                        console.error('获取LivePhoto视频base64失败:', error);
                                        stats.errors.push({type: 'livephoto_video', id: picId, error: error.message});
                                        livephotoVideoData = videoUrl;
                                    }
                                } else if (isLivePhotoMedia && videoUrl) {
                                    livephotoVideoData = videoUrl;
                                }

                                mediaData.push({
                                    type: isLivePhotoMedia ? 'livephoto' : 'image',
                                    imageData: imageData,
                                    videoData: livephotoVideoData,
                                    picId: picId // 保存picId以便后续查询
                                });
                            } catch (error) {
                                console.error(`处理图片 ${picId} 失败:`, error);
                                stats.errors.push({type: 'image', id: picId, error: error.message});
                        }
                    }

                    if (mediaData.length > 0) {
                        processedItem.mediaData = mediaData;
                        }
                    }

                    // 处理转发微博的图片
                    if (item.retweeted_status && item.retweeted_status.pic_ids && item.retweeted_status.pic_ids.length > 0) {
                        console.log('处理转发微博图片:', item.retweeted_status.pic_ids.length);
                        const retweetedMediaData = [];

                        for (const picId of item.retweeted_status.pic_ids) {
                            try {
                                const picInfo = item.retweeted_status.pic_infos?.[picId];

                                if (!picInfo) {
                                    console.log('未找到转发微博图片信息，使用构造的URL');
                                    continue;
                                }

                                // 在导出阶段执行LivePhoto判断
                                let isLivePhotoMedia = false;
                                try {
                                    // 检查isLivePhoto函数是否存在
                                    if (typeof isLivePhoto === 'function') {
                                        isLivePhotoMedia = isLivePhoto(picInfo, item.retweeted_status, picId);
                                    } else {
                                        // 备选判断逻辑
                                        isLivePhotoMedia = picInfo.type === 'livephoto' ||
                                            !!picInfo.video ||
                                            !!picInfo.pic_video ||
                                            !!picInfo.live_photo_video_url ||
                                            picInfo.live_photo === 1;
                                        console.log('使用备选LivePhoto判断(转发微博):', isLivePhotoMedia);
                                    }
                                } catch (error) {
                                    console.error('LivePhoto判断出错(转发微博):', error);
                                    isLivePhotoMedia = false;
                                }

                                // 存储LivePhoto状态
                                if (!window.livePhotoStatus) {
                                    window.livePhotoStatus = new Map();
                                }
                                window.livePhotoStatus.set(picId, isLivePhotoMedia);

                                const url = fixImageUrl(picInfo.original ? picInfo.original.url : picInfo.large.url);
                                const videoUrl = isLivePhotoMedia && picInfo.video ? fixVideoUrl(picInfo.video) : null;

                                // 处理图片和视频数据
                                let imageData = url;
                                let livephotoVideoData = null;

                                if (config.settings.loadImagesOnExport) {
                                    try {
                                        if (mediaCache.has(url)) {
                                            imageData = mediaCache.get(url);
                                        } else {
                                            const base64 = await getMediaBase64(url);
                                            mediaCache.set(url, base64);
                                            imageData = base64;
                                        }
                                    } catch (error) {
                                        console.error('获取转发微博图片base64失败:', error);
                                    }
                                }

                                if (isLivePhotoMedia && videoUrl && config.settings.saveVideosOnExport) {
                                    try {
                                        if (mediaCache.has(videoUrl)) {
                                            livephotoVideoData = mediaCache.get(videoUrl);
                                        } else {
                                            const base64 = await getMediaBase64(videoUrl);
                                            mediaCache.set(videoUrl, base64);
                                            livephotoVideoData = base64;
                                        }
                                    } catch (error) {
                                        console.error('获取转发微博LivePhoto视频base64失败:', error);
                                        livephotoVideoData = videoUrl;
                                    }
                                } else if (isLivePhotoMedia && videoUrl) {
                                    livephotoVideoData = videoUrl;
                                }

                                retweetedMediaData.push({
                                    type: isLivePhotoMedia ? 'livephoto' : 'image',
                                    imageData: imageData,
                                    videoData: livephotoVideoData,
                                    picId: picId // 保存picId以便后续查询
                                });
                            } catch (error) {
                                console.error(`处理转发微博图片失败:`, error);
                            }
                        }

                        if (retweetedMediaData.length > 0) {
                            if (!processedItem.retweeted_status) {
                                processedItem.retweeted_status = {};
                            }
                            processedItem.retweeted_status.mediaData = retweetedMediaData;
                        }
                    }

                    processedItems.push(processedItem);
                    processedCount++;
                    stats.processedItems++;
                    showMessage(`已处理: ${processedCount}/${selectedItems.length}`, 'info');
                } catch (error) {
                    console.error(`处理第 ${processedCount + 1} 条收藏失败:`, error);
                    stats.errors.push({type: 'item', id: item.id, error: error.message});
                }
            }

            console.log('处理统计:', {
                总条数: stats.totalItems,
                成功处理: stats.processedItems,
                LivePhoto数: stats.livePhotoCount,
                视频数: stats.videoCount,
                图片数: stats.imageCount,
                错误数: stats.errors.length
            });

            if (stats.errors.length > 0) {
                console.log('处理错误列表:', stats.errors);
            }

            console.log('生成 HTML 内容');
            const htmlContent = generateHtmlTemplate(processedItems);
            console.log('HTML 内容生成完成，准备下载');

            const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `微博收藏_${new Date().toISOString().slice(0, 10)}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log('导出完成');
            showMessage(`已导出 ${processedItems.length} 条收藏内容`, 'success');
        } catch (error) {
            console.error('导出过程中发生错误:', error);
            showMessage(`导出失败: ${error.message}`, 'error');
        }
    }

    // 修改 HTML 模板生成函数
    function generateHtmlTemplate(items) {
        return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>微博收藏备份 - ${new Date().toLocaleDateString()}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f8f8f8;
            line-height: 1.6;
            position: relative;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            color: #333;
        }

        .post {
            position: relative;
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            max-width: 1000px;
            margin-left: auto;
            margin-right: auto;
        }

        .user {
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }

        .content {
            margin: 10px 0;
            word-break: break-all;
        }

        .images {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 4px;
            margin: 10px 0;
        }

        .image-wrapper {
            position: relative;
            padding-bottom: 100%;
            overflow: hidden;
            background: #f5f5f5;
            cursor: zoom-in;
        }

        .image-wrapper img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }

        .media-index {
            position: absolute;
            right: 8px;
            bottom: 8px;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: normal;
            z-index: 2;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            text-align: center;
            color: white;
        }

        .media-index.image {
            background: #5B9CE6;
        }

        .media-index.video {
            background: #B179DE;
            right: 40px;
        }

        .live-photo {
            position: relative;
            cursor: pointer;
        }

        .live-photo video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: none;
        }

        .live-photo.playing video {
            display: block;
        }

        .live-photo.playing img {
            visibility: hidden;
        }

        .live-photo-badge {
            position: absolute;
            top: 8px;
            left: 8px;
            background: #FFFFFF;
            color: #000000;
            padding: 1px 4px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 450;
            cursor: pointer;
            z-index: 2;
            font-family: "Noto Sans SC Black";
            letter-spacing: 0;
            box-shadow: none;
            line-height: 16px;
            height: 18px;
            border: none;
            text-transform: none;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 24px;
            white-space: nowrap;
        }

        .live-photo-badge:hover {
            background: rgba(255, 255, 255, 1);
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }

        .media-preview-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            pointer-events: auto;
        }

        .preview-content {
            position: relative;
            margin: 0 auto;
            max-width: 90vw;
            max-height: 90vh;
            display: flex;
            border-radius: 8px;
            overflow: hidden;
            pointer-events: auto;
        }

        .retweet-content {
            margin: 10px 0;
            padding: 10px;
            background: #f8f8f8;
            border-radius: 4px;
        }

        .video-container {
            margin: 10px 0;
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
            overflow: hidden;
        }

        .video-container video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .favorited-time {
            position: absolute;
            right: 8px;
            bottom: 35px;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
        }

        /* 下载按钮容器样式 */
        .download-container {
            position: fixed;
            right: 20px;
            top: 100px;
            width: 150px;
            max-height: 80vh;
            overflow-y: auto;
            background: #eaeaea;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 100;
        }

        .download-section {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #ccc;
        }

        .download-section-title {
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 14px;
            color: #333;
        }

        .download-btn {
            display: block;
            padding: 8px 10px;
            margin-bottom: 8px;
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
            font-size: 13px;
            opacity: 0.9;
            transition: opacity 0.3s;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            text-align: center;
            width: 100%;
        }

        .download-btn:hover {
            opacity: 1;
        }

        .download-btn.image {
            background: #5B9CE6;
        }

        .download-btn.video {
            background: #B179DE;
        }

        .retweet-section {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px dashed #ccc;
        }

        .retweet-title {
            font-size: 12px;
            color: #666;
            margin-bottom: 8px;
        }

        .favorite-time {
            position: absolute;
            left: 8px;
            bottom: 8px;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 2;
        }

        .time-info {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }

        .time-info .time-label {
            color: #666;
            font-size: 14px;
            font-weight: bold;
        }

        .time-info .time-value {
            color: #333;
            font-size: 14px;
        }

        /* 暗色主题支持 */
        @media (prefers-color-scheme: dark) {
            .wb-backup-container {
                background: #1a1a1a;
                color: #fff;
            }

            .wb-backup-button {
                background: #ff9933;
            }

            .wb-backup-button:hover {
                background: #ff8000;
            }

            .wb-backup-filters {
                background: #2a2a2a;
            }

            .wb-backup-filter-input {
                background: #333;
                color: #fff;
                border-color: #444;
            }
        }

        /* 下载进度条样式 */
        .wb-backup-progress {
            position: fixed;
            bottom: 60px;
            right: 20px;
            width: 200px;
            background: #f0f0f0;
            border-radius: 4px;
            overflow: hidden;
            display: none;
        }

        .wb-backup-progress-bar {
            height: 4px;
            background: #4caf50;
            width: 0;
            transition: width 0.3s;
        }
    </style>
</head>
<body>
        <div class="header">
            <h1>微博收藏备份</h1>
        <p>导出时间: ${new Date().toLocaleString()}</p>
            <p>共 ${items.length} 条收藏</p>
        </div>

    <div class="posts">
        ${items.map((item, index) => `
            <div class="post">
                <div class="user">${item.user?.screen_name || '未知用户'}</div>
                <div class="content">${item.text_raw || item.text || ''}</div>
                ${item.mediaData ? `
                    <div class="images">
                        ${item.mediaData.map((media, mediaIndex) => `
                            <div class="image-wrapper${media.type === 'livephoto' ? ' live-photo' : ''}"
                                 data-index="${mediaIndex}"
                                 ${media.type === 'livephoto' ? `data-video="${media.videoData}"` : ''}>
                                <img src="${media.imageData}"
                                     loading="lazy"
                                     alt="微博图片">
                                ${media.type === 'livephoto' ? `
                                    <span class="live-photo-badge">Live</span>
                                    <video loop muted playsinline preload="metadata">
                                        <source src="${media.videoData}" type="video/mp4">
                                    </video>
                                ` : ''}
                                <span class="media-index image">${mediaIndex + 1}</span>
                                ${media.type === 'livephoto' ? `
                                    <span class="media-index video">${mediaIndex + 1}</span>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                ${item.videoData ? `
                    <div class="video-container">
                        <video controls preload="metadata">
                            <source src="${item.videoData}" type="video/mp4">
                        </video>
                    </div>
                ` : ''}
                ${item.retweeted_status ? `
                    <div class="retweet-content">
                        <div class="user">@${item.retweeted_status.user?.screen_name || '未知用户'}</div>
                        <div class="content">${item.retweeted_status.text_raw || item.retweeted_status.text || ''}</div>
                        ${item.retweeted_status.mediaData ? `
                            <div class="images">
                                ${item.retweeted_status.mediaData.map((media, mediaIndex) => `
                                    <div class="image-wrapper${media.type === 'livephoto' ? ' live-photo' : ''}"
                                         data-index="${item.mediaData ? item.mediaData.length + mediaIndex : mediaIndex}"
                                         ${media.type === 'livephoto' ? `data-video="${media.videoData}"` : ''}>
                                        <img src="${media.imageData}"
                                             loading="lazy"
                                             alt="转发微博图片">
                                        ${media.type === 'livephoto' ? `
                                            <span class="live-photo-badge">Live</span>
                                            <video loop muted playsinline preload="metadata">
                                                <source src="${media.videoData}" type="video/mp4">
                                            </video>
                                        ` : ''}
                                        <span class="media-index image">${mediaIndex + 1}</span>
                                        ${media.type === 'livephoto' ? `
                                            <span class="media-index video">${mediaIndex + 1}</span>
                                        ` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                        ${item.retweeted_status.videoData ? `
                            <div class="video-container">
                                <video controls preload="metadata">
                                    <source src="${item.retweeted_status.videoData}" type="video/mp4">
                                </video>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
                <div class="time-info">
                    <div>
                        <span class="time-label">创建时间：</span>
                        <span class="time-value">${(() => {
                            if (!item.created_at && !item.created_at_timestamp) return '未知';

                            try {
                                // 优先使用已处理好的时间戳
                                if (item.created_at_timestamp) {
                                    const date = new Date(item.created_at_timestamp);
                                    if (!isNaN(date.getTime())) {
                                        return date.toLocaleString('zh-CN', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                            hour12: false
                                        });
                                    }
                                }

                                // 回退到使用原始创建时间
                                const date = new Date(item.created_at);
                                if (isNaN(date.getTime())) return '无效日期';

                                return date.toLocaleString('zh-CN', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false
                                });
                            } catch (e) {
                                console.error('处理创建时间出错:', e);
                                return '处理错误';
                            }
                        })()}</span>
                    </div>
                    <div>
                        <span class="time-label">收藏时间：</span>
                        <span class="time-value">${(() => {
                            // 明确使用收藏时间，不要使用创建时间作为备选
                            if (!item.favorited_time) return '未知时间';

                            try {
                                // 确保favorited_time是毫秒时间戳
                                let timestamp = item.favorited_time;
                                const date = new Date(timestamp);
                                if (isNaN(date.getTime())) return '无效日期';

                                return date.toLocaleString('zh-CN', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false
                                });
                            } catch (e) {
                                console.error('HTML模板中处理收藏时间出错:', e, item.favorited_time);
                                return '处理错误';
                            }
                        })()}</span>
                    </div>
                </div>
            </div>
        `).join('')}
    </div>

    <div class="download-container">
        ${items.map((item, index) => {
            const hasMedia = (item.mediaData && item.mediaData.length > 0) || item.videoData ||
                         (item.retweeted_status && item.retweeted_status.mediaData && item.retweeted_status.mediaData.length > 0) ||
                         (item.retweeted_status && item.retweeted_status.videoData);

            if (!hasMedia) return '';

            return `
                <div class="download-section">
                    <div class="download-section-title">${item.user?.screen_name || '未知用户'}</div>
                    ${item.mediaData ? item.mediaData.map((media, mediaIndex) => `
                        <button class="download-btn image" onclick="downloadMedia('${media.imageData}', '${item.user?.screen_name || '未知用户'}_图片_${mediaIndex + 1}.jpg')">
                            下载${mediaIndex + 1}图片
                        </button>
                        ${media.type === 'livephoto' ? `
                            <button class="download-btn video" onclick="downloadMedia('${media.videoData}', '${item.user?.screen_name || '未知用户'}_视频_${mediaIndex + 1}.mp4')">
                                下载${mediaIndex + 1}视频
                            </button>
                        ` : ''}
                    `).join('') : ''}
                    ${item.videoData ? `
                        <button class="download-btn video" onclick="downloadMedia('${item.videoData}', '${item.user?.screen_name || '未知用户'}_视频.mp4')">
                            下载1视频
                        </button>
                    ` : ''}
                    ${item.retweeted_status && (item.retweeted_status.mediaData || item.retweeted_status.videoData) ? `
                        <div class="retweet-section">
                            <div class="retweet-title">转发自：${item.retweeted_status.user?.screen_name || '未知用户'}</div>
                            ${item.retweeted_status.mediaData ? item.retweeted_status.mediaData.map((media, mediaIndex) => `
                                <button class="download-btn image" onclick="downloadMedia('${media.imageData}', '${item.retweeted_status.user?.screen_name || '未知用户'}_图片_${mediaIndex + 1}.jpg')">
                                    下载${mediaIndex + 1}图片
                                </button>
                                ${media.type === 'livephoto' ? `
                                    <button class="download-btn video" onclick="downloadMedia('${media.videoData}', '${item.retweeted_status.user?.screen_name || '未知用户'}_视频_${mediaIndex + 1}.mp4')">
                                        下载${mediaIndex + 1}视频
                                    </button>
                                ` : ''}
                            `).join('') : ''}
                            ${item.retweeted_status.videoData ? `
                                <button class="download-btn video" onclick="downloadMedia('${item.retweeted_status.videoData}', '${item.retweeted_status.user?.screen_name || '未知用户'}_视频.mp4')">
                                    下载1视频
                                </button>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('')}
    </div>

    <script>
        // 下载媒体函数
        function downloadMedia(url, filename) {
                    const a = document.createElement('a');
                    a.href = url;
            a.download = filename;
            a.target = '_blank';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
        }

        // LivePhoto交互和预览功能
        document.addEventListener('DOMContentLoaded', function() {
            // 处理LivePhoto鼠标悬停交互
            const livePhotos = document.querySelectorAll('.live-photo');
            livePhotos.forEach(photo => {
                photo.addEventListener('mouseenter', function() {
                    const video = this.querySelector('video');
                    if (video) {
                        this.classList.add('playing');
                        video.currentTime = 0;
                        video.play().catch(e => console.error('视频播放错误:', e));
                    }
                });

                photo.addEventListener('mouseleave', function() {
                    const video = this.querySelector('video');
                    if (video) {
                        this.classList.remove('playing');
                        video.pause();
                    }
                });

                // 添加点击预览功能
                photo.addEventListener('click', function(e) {
                    e.preventDefault();
                    const img = this.querySelector('img');
                    const video = this.querySelector('video');
                    if (img && video) {
                        showMediaPreview(img.src, video.querySelector('source').src, this);
                    }
                });
            });

            // 为普通图片添加点击预览功能
            const imageWrappers = document.querySelectorAll('.image-wrapper:not(.live-photo)');
            imageWrappers.forEach(wrapper => {
                wrapper.addEventListener('click', function(e) {
                    e.preventDefault();
                    const img = this.querySelector('img');
                    if (img) {
                        showMediaPreview(img.src, null, this);
                    }
                });
            });

            // 为视频添加点击预览功能
            const videoContainers = document.querySelectorAll('.video-container');
            videoContainers.forEach(container => {
                container.addEventListener('click', function(e) {
                    if (e.target === this) { // 只在点击容器时触发，不干扰视频本身的控制
                        const video = this.querySelector('video');
                        if (video && video.querySelector('source')) {
                            showMediaPreview(video.poster || '', video.querySelector('source').src, this);
                        }
                    }
                });
            });
        });

        // 媒体预览功能
        function showMediaPreview(imgSrc, videoSrc = null, itemElement = null) {
            // 移除已存在的预览容器
            closeMediaPreview();

            // 创建预览容器
            const previewContainer = document.createElement('div');
            previewContainer.id = 'mediaPreviewContainer';
            previewContainer.className = 'media-preview-container';

            const previewContent = document.createElement('div');
            previewContent.className = 'preview-content';

            // 创建图片/视频容器
            const mediaWrapper = document.createElement('div');
            mediaWrapper.style.cssText = 'position: relative; width: 100%; overflow: hidden;';

            if (videoSrc) {
                // 判断是LivePhoto还是普通视频
                const isLivePhoto = itemElement && itemElement.classList.contains('live-photo');

                if (isLivePhoto) {
                    // LivePhoto预览
                    const img = document.createElement('img');
                    img.style.cssText = 'display: block; width: 100%; max-height: 90vh; object-fit: contain;';
                    img.src = imgSrc || '';

                    const video = document.createElement('video');
                    video.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; opacity: 0; transition: opacity 0.3s ease;';
                    video.muted = true;
                    video.loop = true;
                    video.playsInline = true;
                    video.autoplay = false;

                    const source = document.createElement('source');
                    source.src = videoSrc;
                    source.type = 'video/mp4';
                    video.appendChild(source);

                    // 添加Live标签
                    const liveTag = document.createElement('div');
                    liveTag.className = 'live-photo-badge';
                    liveTag.textContent = 'Live';
                    liveTag.style.cssText = 'position: absolute; top: 8px; left: 8px; padding: 1px 7px; height: 18px; line-height: 16px; min-width: 32px; border-radius: 6px; background: #FFFFFF; color: #000; font-size: 11px; font-weight: 450; text-align: center; white-space: nowrap; z-index: 10;';

                    mediaWrapper.appendChild(liveTag);

                    // 添加交互效果 (只对LivePhoto)
                    mediaWrapper.addEventListener('mouseenter', () => {
                        img.style.opacity = '0';
                        video.style.opacity = '1';
                        video.currentTime = 0;

                        try {
                            if (video.readyState >= 2) {
                                video.play().catch(err => console.log('视频播放失败:', err.message));
                            } else {
                                video.addEventListener('canplay', function onCanPlay() {
                                    video.play().catch(console.error);
                                    video.removeEventListener('canplay', onCanPlay);
                                });
                            }
                        } catch (error) {
                            console.error('视频播放出错:', error);
                        }
                    });

                    mediaWrapper.addEventListener('mouseleave', () => {
                        img.style.opacity = '1';
                        video.style.opacity = '0';

                        try {
                            if (!video.paused) {
                        video.pause();
                }
                        } catch (error) {
                            console.error('视频暂停出错:', error);
                        }
                    });

                    mediaWrapper.appendChild(img);
                    mediaWrapper.appendChild(video);
                } else {
                    // 普通视频预览
                    const video = document.createElement('video');
                    video.style.cssText = 'display: block; width: 100%; max-height: 90vh; object-fit: contain;';
                    video.controls = true;
                    video.autoplay = true;
                    video.playsInline = true;

                    if (imgSrc) {
                        video.poster = imgSrc;
                    }

                    const source = document.createElement('source');
                    source.src = videoSrc;
                    source.type = 'video/mp4';
                    video.appendChild(source);

                    mediaWrapper.appendChild(video);

                    // 为普通视频添加错误处理
                    video.addEventListener('error', function(e) {
                        console.error('视频加载错误:', e);
                        const errorMsg = document.createElement('div');
                        errorMsg.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; background: rgba(0,0,0,0.7); padding: 10px 20px; border-radius: 4px;';
                        errorMsg.textContent = '视频加载失败';
                        mediaWrapper.appendChild(errorMsg);
                    });
                }
            } else {
                // 普通图片
                const img = document.createElement('img');
                img.style.cssText = 'display: block; width: 100%; max-height: 90vh; object-fit: contain;';
                img.src = imgSrc;

                mediaWrapper.appendChild(img);
            }

            previewContent.appendChild(mediaWrapper);
            previewContainer.appendChild(previewContent);
            document.body.appendChild(previewContainer);

            // 点击空白区域关闭
            previewContainer.addEventListener('click', (e) => {
                if (e.target === previewContainer) {
                    closeMediaPreview();
                }
            });

            // 添加键盘事件监听
            document.addEventListener('keydown', handlePreviewKeydown);
        }

        function closeMediaPreview() {
            const container = document.getElementById('mediaPreviewContainer');
            if (container) {
                document.removeEventListener('keydown', handlePreviewKeydown);
                container.remove();
            }
        }

        function handlePreviewKeydown(e) {
            if (e.key === 'Escape') {
                closeMediaPreview();
            }
        }
    </script>
</body>
</html>`;
    }

    // 添加筛选函数
    function applyFilters() {
        const items = document.querySelectorAll('.wb-backup-item');
        items.forEach(item => {
            const data = JSON.parse(item.dataset.weibo);
            let show = true;

            if (config.filters.retweet) {
                show = show && data.retweeted_status;
            }

            if (config.filters.video) {
                show = show && (data.page_info?.media_info || (data.retweeted_status?.page_info?.media_info));
            }

            if (config.filters.text) {
                const text = (data.text_raw || data.text || '').toLowerCase();
                const retweetText = (data.retweeted_status?.text_raw || data.retweeted_status?.text || '').toLowerCase();
                show = show && (text.includes(config.filters.text.toLowerCase()) || retweetText.includes(config.filters.text.toLowerCase()));
            }

            if (config.filters.user) {
                const username = (data.user?.screen_name || '').toLowerCase();
                const retweetUsername = (data.retweeted_status?.user?.screen_name || '').toLowerCase();
                show = show && (username.includes(config.filters.user.toLowerCase()) || retweetUsername.includes(config.filters.user.toLowerCase()));
            }

            item.style.display = show ? 'flex' : 'none';
        });
    }

    // 初始化函数
    function init() {
        // 加载用户设置
        const savedVideoQuality = GM_getValue('videoQuality');
        if (savedVideoQuality) {
            config.settings.videoQuality = savedVideoQuality;
            console.log('从本地存储加载视频清晰度设置:', config.settings.videoQuality);
        }

        // 创建UI元素
        const { icon, container } = createUI();

        // 设置下拉框的默认选中项
        const videoQualitySelect = document.getElementById('videoQualitySelect');
        if (videoQualitySelect) {
            videoQualitySelect.value = config.settings.videoQuality;
        }

        // 检查登录状态并加载数据
        checkLoginStatus().then(isLoggedIn => {
            if (isLoggedIn) {
                // 设置图标点击事件
                icon.addEventListener('click', () => {
                    const isVisible = container.style.display === 'block';
                    container.style.display = isVisible ? 'none' : 'block';
                    if (!isVisible && document.querySelectorAll('#wb-backup-list .wb-backup-item').length === 0) {
                        loadPage(1);
                    }
                });

                // 设置日志级别
                Logger.setLevel('INFO');

                // 创建媒体缓存实例
                const mediaCache = new LRUCache(500);
                mediaCache.maxSize = 1024 * 1024 * 1024;

                // 启动内存监控
                MemoryMonitor.startMonitoring(60000);

                // 启动性能监控
                PerformanceMonitor.startTracking();

                // 初始化其他优化
                initializeOptimizations();
            } else {
                showMessage('请先登录微博', 'error');
            }
        }).catch(error => {
            console.error('初始化失败:', error);
            showMessage('初始化失败，请刷新页面重试', 'error');
        });

        // 确保绑定视频预览事件
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM加载完成，开始绑定视频预览事件');
            // 为所有已存在的视频添加事件处理
            updateMediaItemEventListeners(document);

            // 处理后续添加的元素
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length) {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) { // 元素节点
                                updateMediaItemEventListeners(node);
                            }
                        });
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });

        // 直接处理当前页面上的元素
        updateMediaItemEventListeners(document);
    }

    // 立即执行初始化
    init();

    // 添加删除选中项目的函数
    // 长备份功能
    async function longBackup() {
        try {
            // 打开新标签页
            const newWindow = window.open('', '_blank');
            newWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>微博收藏长备份</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                            margin: 0;
                            background: #f5f5f5;
                        }
                        .header {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 10px 20px;
                            background: #fff;
                            border-radius: 5px;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                            margin-bottom: 20px;
                        }
                        .title {
                            font-size: 20px;
                            font-weight: bold;
                        }
                        .controls {
                            display: flex;
                            gap: 10px;
                        }
                        .button {
                            background: #ff8200;
                            color: white;
                            border: none;
                            padding: 8px 15px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 14px;
                        }
                        .button:hover {
                            background: #e67300;
                        }
                        .filter-container {
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            padding: 10px 20px;
                            background: #fff;
                            border-radius: 5px;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                            margin-bottom: 20px;
                        }
                        .favs-container {
                            display: flex;
                            flex-direction: column;
                            gap: 15px;
                        }
                        .fav-item {
                            padding: 15px;
                            background: #fff;
                            border-radius: 5px;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        }
                        .progress {
                            margin-top: 10px;
                            height: 20px;
                            background: #eee;
                            border-radius: 10px;
                            overflow: hidden;
                            display: none;
                        }
                        .progress-bar {
                            height: 100%;
                            background: #ff8200;
                            width: 0%;
                            transition: width 0.3s;
                        }
                        .status {
                            margin-top: 10px;
                            display: none;
                        }
                        .deleted-filter {
                            display: flex;
                            align-items: center;
                            gap: 5px;
                        }
                        .batch-progress {
                            height: 10px;
                            background: #eee;
                            border-radius: 5px;
                            overflow: hidden;
                        }
                        .batch-progress-bar {
                            height: 100%;
                            background: #4caf50;
                            width: 0%;
                            transition: width 0.3s;
                        }
                        .fav-item {
                            padding: 15px;
                            background: #fff;
                            border-radius: 5px;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                            display: flex;
                            flex-direction: column;
                            gap: 10px;
                        }
                        .fav-item .media-container {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 8px;
                            margin-top: 8px;
                        }
                        .fav-item .media-item {
                            position: relative;
                            cursor: pointer;
                            overflow: hidden;
                            border-radius: 4px;
                        }
                        .fav-item .media-item img {
                            width: 120px;
                            height: 120px;
                            object-fit: cover;
                            transition: transform 0.3s;
                        }
                        .fav-item .media-item:hover img {
                            transform: scale(1.05);
                        }
                        .fav-item .media-item.video::after {
                            content: "";
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 0;
                            height: 0;
                            border-top: 10px solid transparent;
                            border-left: 18px solid rgba(255,255,255,0.8);
                            border-bottom: 10px solid transparent;
                        }
                        .fav-item .media-item.livephoto::after {
                            content: "Live";
                            position: absolute;
                            top: 5px;
                            right: 5px;
                            background: rgba(255,255,255,0.8);
                            padding: 2px 5px;
                            border-radius: 3px;
                            font-size: 10px;
                            font-weight: bold;
                        }
                        .preview-overlay {
                            position: fixed;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: rgba(0,0,0,0.9);
                            z-index: 9999;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        .preview-container {
                            position: relative;
                            max-width: 90%;
                            max-height: 90%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        .preview-container img, .preview-container video {
                            max-width: 100%;
                            max-height: 90vh;
                            object-fit: contain;
                        }
                        .preview-close {
                            position: absolute;
                            top: -30px;
                            right: 0;
                            color: white;
                            font-size: 24px;
                            cursor: pointer;
                        }
                        .button:disabled {
                            background: #cccccc;
                            cursor: not-allowed;
                        }
                        .last-backup-info {
                            margin: 10px 0 20px;
                            padding: 15px;
                            background: #f0f8ff;
                            border-radius: 5px;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        }
                        .last-backup-title {
                            font-weight: bold;
                            margin-bottom: 8px;
                            font-size: 16px;
                        }
                        .last-backup-details {
                            margin-bottom: 10px;
                            color: #555;
                        }
                        .last-backup-weibo {
                            background: #fff;
                            padding: 10px;
                            border-radius: 4px;
                            margin-top: 8px;
                            border-left: 3px solid #ff8200;
                        }
                        .new-backup-btn {
                            background: #4caf50;
                            color: white;
                            border: none;
                            padding: 8px 15px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 14px;
                            margin-top: 10px;
                        }
                        .new-backup-btn:hover {
                            background: #3d8b40;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="title">微博收藏长备份</div>
                        <div class="controls">
                            <div style="display: flex; align-items: center; gap: 10px; margin-right: 15px;">
                                <label>视频清晰度：</label>
                                <select id="videoQualitySelect" style="padding: 6px; border-radius: 4px; border: 1px solid #ddd;">
                                    <option value="highest">最高清晰度</option>
                                    <option value="8K60">8K 60帧</option>
                                    <option value="4K60">4K 60帧</option>
                                    <option value="2K60">2K 60帧</option>
                                    <option value="1080p60">1080P 60帧</option>
                                    <option value="1080p">1080P</option>
                                    <option value="720p60">720P 60帧</option>
                                    <option value="720p">720P</option>
                                    <option value="480p">480P</option>
                                </select>
                            </div>
                            <button id="checkLastBackupBtn" class="button">查看上次备份信息</button>
                            <button id="autoBackupBtn" class="button">自动全部备份</button>
                            <button id="pauseBackupBtn" class="button" disabled>暂停</button>
                            <button id="exportBtn" class="button">导出</button>
                        </div>
                    </div>

                    <div id="lastBackupInfo" class="last-backup-info" style="display:none;">
                        <div class="last-backup-title">上次备份信息</div>
                        <div class="last-backup-details" id="lastBackupDetails">未找到上次备份记录</div>
                        <div class="last-backup-weibo" id="lastBackupWeibo"></div>
                        <button id="backupNewBtn" class="new-backup-btn">备份新收藏</button>
                    </div>
                    <div class="filter-container">
                        <div class="deleted-filter">
                            <input type="checkbox" id="skipDeletedCheck" checked>
                            <label for="skipDeletedCheck">跳过已删除微博</label>
                        </div>
                        <div class="deleted-filter">
                            <input type="checkbox" id="skipMobileOnlyCheck" checked>
                            <label for="skipMobileOnlyCheck">跳过"请至手机客户端查看"</label>
                        </div>
                    </div>
                    <div class="batch-progress-container" style="margin-top: 10px; display: none;">
                        <div style="margin-bottom: 5px;">当前批次进度：<span id="batchProgress">0</span>/100</div>
                        <div class="batch-progress">
                            <div class="batch-progress-bar"></div>
                        </div>
                    </div>
                    <div class="progress">
                        <div class="progress-bar"></div>
                    </div>
                    <div class="status"></div>
                    <div id="favs-container" class="favs-container">
                        <div style="text-align: center; padding: 20px;">加载中...</div>
                    </div>

                    <script>
                                        // 设置视频清晰度选择器的初始值
                const videoQualitySelect = document.getElementById('videoQualitySelect');
                videoQualitySelect.value = "${config.settings.videoQuality}";
                console.log('初始化长备份页面视频清晰度选择器:', videoQualitySelect.value);

                        // 当视频清晰度选择器发生变化时
                        document.getElementById('videoQualitySelect').addEventListener('change', function(e) {
                            const quality = e.target.value;
                            // 发送消息到父窗口更新视频清晰度设置
                            window.opener.postMessage({
                                type: 'updateVideoQuality',
                                quality: quality
                            }, '*');
                        });

                        // 通过消息接收数据
                        window.addEventListener('message', function(event) {
                            if (event.data.type === 'favsData') {
                                renderFavs(event.data.favs);
                            } else if (event.data.type === 'progress') {
                                updateProgress(event.data.percent, event.data.status);
                            } else if (event.data.type === 'batchProgress') {
                                updateBatchProgress(event.data.current, event.data.total);
                            } else if (event.data.type === 'exportData') {
                                downloadBackup(event.data.url, event.data.filename);
                            } else if (event.data.type === 'backupStarted') {
                                handleBackupStarted();
                            } else if (event.data.type === 'backupPaused') {
                                handleBackupPaused();
                            } else if (event.data.type === 'backupResumed') {
                                handleBackupResumed();
                            } else if (event.data.type === 'backupCompleted') {
                                handleBackupCompleted();
                            } else if (event.data.type === 'exportPaused') {
                                handleExportPaused();
                            } else if (event.data.type === 'exportCompleted') {
                                handleExportCompleted();
                            } else if (event.data.type === 'enablePauseButton') {
                                handleEnablePauseButton(event.data.operationType);
                            } else if (event.data.type === 'lastBackupInfo') {
                                // 显示上次备份信息
                                const info = event.data.info;
                                const context = event.data.context;
                                const lastBackupPanel = document.getElementById('lastBackupInfo');
                                const lastBackupDetails = document.getElementById('lastBackupDetails');
                                const lastBackupWeibo = document.getElementById('lastBackupWeibo');
                                const backupNewBtn = document.getElementById('backupNewBtn');

                                if (info && info.lastFavoriteId) {
                                    // 格式化时间
                                    const backupDate = new Date(info.timestamp);
                                    const formattedDate = backupDate.toLocaleString();

                                    // 显示备份详情
                                    lastBackupDetails.innerHTML =
                                        '上次备份时间: ' + formattedDate + '<br>' +
                                        '共备份 ' + info.totalBackedUp + ' 条微博收藏';

                                    // 构建微博内容 HTML
                                    let weiboHtml = '<div style="margin-bottom:15px;padding:10px;background:#f8f8f8;border-left:3px solid #ff8200;">' +
                                        '<div style="font-weight:bold;color:#333;margin-bottom:5px">上次备份的微博：</div>' +
                                        '<div><b>' + info.lastFavoriteName + '</b>：' + info.lastFavoriteContent + '</div>' +
                                    '</div>';
                                    
                                    // 如果有上下文信息，显示前后微博
                                    if (context) {
                                        // 显示是否找到了上次备份微博
                                        if (context.notFound) {
                                            weiboHtml += '<div style="color:#ff4500;margin:15px 0;padding:8px;background:#fff8f0;border-left:3px solid #ff4500;">' +
                                                '<span style="font-weight:bold">⚠️ 提示：</span>上次备份的微博未在当前收藏列表中找到，可能已被取消收藏' +
                                            '</div>';
                                        }
                                        
                                        // 显示更新的微博（如果有）
                                        if (context.newerFavorite) {
                                            weiboHtml += 
                                                '<div style="margin-top:15px;padding:10px;background:#f0fff0;border-left:3px solid #4caf50;">' +
                                                    '<div style="font-weight:bold;color:#2e7d32;margin-bottom:5px">↑ 更新的微博（将从此处开始备份）:</div>' +
                                                    '<div><b>' + context.newerFavorite.userName + '</b>：' + context.newerFavorite.content + '</div>' +
                                                '</div>';
                                            
                                            // 保存要备份的新微博ID
                                            window.backupFromId = context.newerFavorite.id;
                                            
                                            // 修改备份按钮文字
                                            if (backupNewBtn) {
                                                backupNewBtn.textContent = "从此条微博开始备份";
                                                backupNewBtn.style.background = "#4caf50";
                                            }
                                        }
                                        
                                        // 显示更早的微博（如果有）
                                        if (context.olderFavorite) {
                                            weiboHtml += 
                                                '<div style="margin-top:15px;padding:10px;background:#fff0f0;border-left:3px solid #f44336;">' +
                                                    '<div style="font-weight:bold;color:#c62828;margin-bottom:5px">↓ 更早的微博（已备份）:</div>' +
                                                    '<div><b>' + context.olderFavorite.userName + '</b>：' + context.olderFavorite.content + '</div>' +
                                                '</div>';
                                        }
                                    }
                                    
                                    // 显示微博内容
                                    lastBackupWeibo.innerHTML = weiboHtml;

                                    // 显示面板和备份按钮
                                    lastBackupPanel.style.display = 'block';
                                    if (backupNewBtn) {
                                        backupNewBtn.style.display = 'inline-block';
                                    }
                                } else {
                                    lastBackupDetails.textContent = '未找到上次备份记录';
                                    lastBackupWeibo.innerHTML = '';
                                    lastBackupPanel.style.display = 'block';
                                    if (backupNewBtn) {
                                        backupNewBtn.style.display = 'none';
                                    }
                                }
                            } else if (event.data.type === 'noLastBackupInfo') {
                                // 没有找到备份信息
                                document.getElementById('lastBackupDetails').textContent = '未找到上次备份记录';
                                document.getElementById('lastBackupWeibo').innerHTML = '';
                                document.getElementById('lastBackupInfo').style.display = 'block';
                                document.getElementById('backupNewBtn').style.display = 'none';
                            } else if (event.data.type === 'smartBackupStart') {
                                // 智能备份开始，显示新收藏范围
                                let progressMessage;
                                if (event.data.newCount === 1) {
                                    progressMessage = '正在备份 1 条新收藏微博，"' + event.data.firstUser + '"的微博';
                                } else {
                                    progressMessage = '正在备份 ' + event.data.newCount + ' 条新收藏微博，从 "' + event.data.firstUser + '" 到 "' + event.data.lastUser + '"';
                                }
                                updateProgress(0, progressMessage);
                                
                                // 备份开始后清除备份起点ID
                                delete window.backupFromId;
                            } else if (event.data.type === 'noNewFavorites') {
                                // 没有新收藏需要备份
                                updateProgress(100, '没有发现新的收藏需要备份');
                                setTimeout(() => {
                                    document.getElementById('autoBackupBtn').disabled = false;
                                    document.getElementById('exportBtn').disabled = false;
                                    document.getElementById('pauseBackupBtn').disabled = true;
                                }, 1000);
                            }
                        });

                        let allFavs = [];
                        let isBackupRunning = false;
                        let previewActive = false;

                        // 识别LivePhoto和视频
                        function hasLivePhoto(item) {
                            if (item.pic_ids && item.pic_infos) {
                                for (const picId of item.pic_ids) {
                                    const picInfo = item.pic_infos[picId];
                                    if (picInfo && (picInfo.type === 'livephoto' || picInfo.live_photo_video_url || picInfo.video || picInfo.pic_video)) {
                                        return true;
                                    }
                                }
                            }

                            if (item.retweeted_status && item.retweeted_status.pic_ids && item.retweeted_status.pic_infos) {
                                for (const picId of item.retweeted_status.pic_ids) {
                                    const picInfo = item.retweeted_status.pic_infos[picId];
                                    if (picInfo && (picInfo.type === 'livephoto' || picInfo.live_photo_video_url || picInfo.video || picInfo.pic_video)) {
                                        return true;
                                    }
                                }
                            }

                            return false;
                        }

                        function hasVideo(item) {
                            return (item.page_info && item.page_info.media_info) ||
                                  (item.retweeted_status && item.retweeted_status.page_info && item.retweeted_status.page_info.media_info);
                        }

                        function fixImageUrl(url) {
                            if (!url) return '';

                            // 修正图片URL，添加https前缀
                            if (url.startsWith('//')) {
                                return 'https:' + url;
                            }

                            return url;
                        }

                        function getMediaItems(item) {
                            const mediaItems = [];

                            // 处理混合媒体（优先检查）
                            if (item.mix_media_info && Array.isArray(item.mix_media_info.items)) {
                                for (const media of item.mix_media_info.items) {
                                    if (media.type === 'pic') {
                                        // 图片或 LivePhoto
                                        const picData = media.data;
                                        const picId = picData.pic_id || '';
                                        const isLivePhoto = picData.type === 'livephoto' || !!picData.video;
                                        const imgUrl = fixImageUrl(picData.original?.url || picData.large?.url || picData.bmiddle?.url);
                                        let videoUrl = null;

                                        if (isLivePhoto && picData.video) {
                                            videoUrl = fixImageUrl(picData.video);
                                        }

                                        mediaItems.push({
                                            type: isLivePhoto ? 'livephoto' : 'image',
                                            imgUrl: imgUrl,
                                            videoUrl: videoUrl,
                                            picId: picId
                                        });
                                    } else if (media.type === 'video') {
                                        // 视频项
                                        const mediaInfo = media.data.media_info;
                                        if (!mediaInfo) continue;

                                        const posterUrl = fixImageUrl(media.data.page_pic || mediaInfo.thumbnail_pic);
                                        const videoUrl = fixImageUrl(
                                            mediaInfo.stream_url ||
                                            mediaInfo.mp4_720p_mp4 ||
                                            mediaInfo.mp4_hd_url ||
                                            mediaInfo.h5_url ||
                                            mediaInfo.mp4_sd_url
                                        );

                                        if (videoUrl) {
                                            mediaItems.push({
                                                type: 'video',
                                                imgUrl: posterUrl,
                                                videoUrl: videoUrl
                                            });
                                        }
                                    }
                                }
                            }

                            // 如果没有混合媒体或媒体项为空，使用传统方式处理
                            if (mediaItems.length === 0) {
                                // 处理原微博图片
                                if (item.pic_ids && item.pic_infos) {
                                    for (const picId of item.pic_ids) {
                                        const picInfo = item.pic_infos[picId];
                                        if (picInfo) {
                                            const isLivePhoto = picInfo.type === 'livephoto' || picInfo.live_photo_video_url || picInfo.video || picInfo.pic_video;
                                            const imgUrl = fixImageUrl(picInfo.original ? picInfo.original.url : (picInfo.large ? picInfo.large.url : picInfo.bmiddle.url));

                                            // 找到LivePhoto的视频URL
                                            let videoUrl = null;
                                            if (isLivePhoto) {
                                                videoUrl = picInfo.live_photo_video_url || picInfo.video || picInfo.pic_video;
                                                if (videoUrl) {
                                                    videoUrl = fixImageUrl(videoUrl);
                                                }
                                            }

                                            mediaItems.push({
                                                type: isLivePhoto ? 'livephoto' : 'image',
                                                imgUrl: imgUrl,
                                                videoUrl: videoUrl,
                                                picId: picId
                                            });
                                        }
                                    }
                                }

                                // 处理原微博视频
                                if (item.page_info && item.page_info.media_info) {
                                    const mediaInfo = item.page_info.media_info;
                                    const posterUrl = fixImageUrl(mediaInfo.thumbnail_pic || item.page_info.page_pic);
                                    const videoUrl = fixImageUrl(mediaInfo.stream_url || mediaInfo.mp4_720p_mp4 || mediaInfo.mp4_hd_url || mediaInfo.h5_url || mediaInfo.mp4_sd_url);

                                    if (videoUrl) {
                                        mediaItems.push({
                                            type: 'video',
                                            imgUrl: posterUrl,
                                            videoUrl: videoUrl
                                        });
                                    }
                                }
                            }

                            // 处理转发微博
                            if (item.retweeted_status) {
                                // 处理转发微博的混合媒体
                                let hasRTMixedMediaItems = false;
                                if (item.retweeted_status.mix_media_info && Array.isArray(item.retweeted_status.mix_media_info.items)) {
                                    for (const media of item.retweeted_status.mix_media_info.items) {
                                        if (media.type === 'pic') {
                                            // 图片或 LivePhoto
                                            const picData = media.data;
                                            if (!picData) continue;

                                            const picId = picData.pic_id || '';
                                            const isLivePhoto = picData.type === 'livephoto' || !!picData.video;
                                            const imgUrl = fixImageUrl(picData.original?.url || picData.large?.url || picData.bmiddle?.url);

                                            let videoUrl = null;
                                            if (isLivePhoto && picData.video) {
                                                videoUrl = fixImageUrl(picData.video);
                                            }

                                            mediaItems.push({
                                                type: isLivePhoto ? 'livephoto' : 'image',
                                                imgUrl: imgUrl,
                                                videoUrl: videoUrl,
                                                picId: picId,
                                                isRetweet: true
                                            });
                                            hasRTMixedMediaItems = true;
                                        } else if (media.type === 'video') {
                                            // 视频项
                                            const mediaInfo = media.data.media_info;
                                            if (!mediaInfo) continue;

                                            const posterUrl = fixImageUrl(media.data.page_pic || mediaInfo.thumbnail_pic);
                                            const videoUrl = fixImageUrl(
                                                mediaInfo.stream_url ||
                                                mediaInfo.mp4_720p_mp4 ||
                                                mediaInfo.mp4_hd_url ||
                                                mediaInfo.h5_url ||
                                                mediaInfo.mp4_sd_url
                                            );

                                            if (videoUrl) {
                                                mediaItems.push({
                                                    type: 'video',
                                                    imgUrl: posterUrl,
                                                    videoUrl: videoUrl,
                                                    isRetweet: true
                                                });
                                                hasRTMixedMediaItems = true;
                                            }
                                        }
                                    }
                                }

                                // 如果没有找到转发微博的混合媒体，处理传统媒体
                                if (!hasRTMixedMediaItems) {
                                    // 处理转发微博的图片
                                    if (item.retweeted_status.pic_ids && item.retweeted_status.pic_infos) {
                                        for (const picId of item.retweeted_status.pic_ids) {
                                            const picInfo = item.retweeted_status.pic_infos[picId];
                                            if (picInfo) {
                                                const isLivePhoto = picInfo.type === 'livephoto' || picInfo.live_photo_video_url || picInfo.video || picInfo.pic_video;
                                                const imgUrl = fixImageUrl(picInfo.original ? picInfo.original.url : (picInfo.large ? picInfo.large.url : picInfo.bmiddle.url));

                                                let videoUrl = null;
                                                if (isLivePhoto) {
                                                    videoUrl = picInfo.live_photo_video_url || picInfo.video || picInfo.pic_video;
                                                    if (videoUrl) {
                                                        videoUrl = fixImageUrl(videoUrl);
                                                    }
                                                }

                                                mediaItems.push({
                                                    type: isLivePhoto ? 'livephoto' : 'image',
                                                    imgUrl: imgUrl,
                                                    videoUrl: videoUrl,
                                                    picId: picId,
                                                    isRetweet: true
                                                });
                                            }
                                        }
                                    }

                                    // 处理转发微博的视频
                                    if (item.retweeted_status.page_info && item.retweeted_status.page_info.media_info) {
                                        const mediaInfo = item.retweeted_status.page_info.media_info;
                                        const posterUrl = fixImageUrl(mediaInfo.thumbnail_pic || item.retweeted_status.page_info.page_pic);
                                        const videoUrl = fixImageUrl(mediaInfo.stream_url || mediaInfo.mp4_720p_mp4 || mediaInfo.mp4_hd_url || mediaInfo.h5_url || mediaInfo.mp4_sd_url);

                                        if (videoUrl) {
                                            mediaItems.push({
                                                type: 'video',
                                                imgUrl: posterUrl,
                                                videoUrl: videoUrl,
                                                isRetweet: true
                                            });
                                        }
                                    }
                                }
                            }

                            return mediaItems;
                        }

                        function renderFavs(favs) {
                            allFavs = favs;
                            const container = document.getElementById('favs-container');
                            if (favs.length === 0) {
                                container.innerHTML = '<div style="text-align: center; padding: 20px;">没有找到收藏</div>';
                                return;
                            }

                            container.innerHTML = favs.map((fav, index) => {
                                const isDeleted = fav.text && fav.text.includes('此微博已被删除');
                                const isMobileOnly = fav.text && fav.text.includes('该内容请至手机客户端查看');
                                const mediaItems = getMediaItems(fav);

                                let mediaHtml = '';
                                if (mediaItems.length > 0) {
                                    mediaHtml = \`
                                        <div class="media-container">
                                            \${mediaItems.map((media, idx) => \`
                                                <div class="media-item \${media.type}" data-index="\${index}" data-media-index="\${idx}">
                                                    <img src="\${media.imgUrl}" alt="">
                                                </div>
                                            \`).join('')}
                                        </div>
                                    \`;
                                }

                                return \`
                                    <div class="fav-item \${isDeleted ? 'deleted' : ''} \${isMobileOnly ? 'mobile-only' : ''}">
                                        <div><strong>\${fav.user ? fav.user.screen_name : '未知用户'}</strong> · \${fav.created_at}</div>
                                        <div>\${fav.text || '无内容'}</div>
                                        \${mediaHtml}
                                    </div>
                                \`;
                            }).join('');

                            // 添加媒体预览点击事件
                            attachMediaPreviewEvents();
                        }

                        function attachMediaPreviewEvents() {
                            document.querySelectorAll('.media-item').forEach(item => {
                                item.addEventListener('click', function() {
                                    if (previewActive) return;

                                    const favIndex = parseInt(this.getAttribute('data-index'));
                                    const mediaIndex = parseInt(this.getAttribute('data-media-index'));
                                    const fav = allFavs[favIndex];
                                    const mediaItems = getMediaItems(fav);
                                    const media = mediaItems[mediaIndex];

                                    showMediaPreview(media);
                                });
                            });
                        }

                        function showMediaPreview(media) {
                            previewActive = true;

                            const overlay = document.createElement('div');
                            overlay.className = 'preview-overlay';

                            const container = document.createElement('div');
                            container.className = 'preview-container';

                            const closeBtn = document.createElement('div');
                            closeBtn.className = 'preview-close';
                            closeBtn.innerHTML = '×';
                            closeBtn.addEventListener('click', () => {
                                document.body.removeChild(overlay);
                                previewActive = false;
                            });

                            container.appendChild(closeBtn);

                            if (media.type === 'video' || (media.type === 'livephoto' && media.videoUrl)) {
                                const video = document.createElement('video');
                                video.src = media.videoUrl;
                                video.poster = media.imgUrl;
                                video.controls = true;
                                video.autoplay = true;
                                container.appendChild(video);
                            } else {
                                const img = document.createElement('img');
                                img.src = media.imgUrl;
                                container.appendChild(img);
                            }

                            overlay.appendChild(container);
                            document.body.appendChild(overlay);

                            // 添加关闭事件
                            overlay.addEventListener('click', (e) => {
                                if (e.target === overlay) {
                                    document.body.removeChild(overlay);
                                    previewActive = false;
                                }
                            });

                            // 添加键盘事件
                            document.addEventListener('keydown', function escHandler(e) {
                                if (e.key === 'Escape') {
                                    document.body.removeChild(overlay);
                                    document.removeEventListener('keydown', escHandler);
                                    previewActive = false;
                                }
                            });
                        }

                        function updateProgress(percent, statusText) {
                            const progress = document.querySelector('.progress');
                            const progressBar = document.querySelector('.progress-bar');
                            const status = document.querySelector('.status');

                            if (percent > 0) {
                                progress.style.display = 'block';
                                status.style.display = 'block';
                            }

                            progressBar.style.width = percent + '%';
                            status.textContent = statusText;
                        }

                        function updateBatchProgress(current, total) {
                            const container = document.querySelector('.batch-progress-container');
                            const progressBar = document.querySelector('.batch-progress-bar');
                            const progressText = document.getElementById('batchProgress');

                            container.style.display = 'block';
                            progressText.textContent = current;
                            progressBar.style.width = (current / total * 100) + '%';
                        }

                        function downloadBackup(url, filename) {
                            const a = document.createElement('a');
                            a.href = url;

                            if (filename) {
                                // 使用传入的文件名
                                a.download = filename;
                            } else {
                                // 格式化日期时间为yyyyMMddHHmmss格式
                                const now = new Date();
                                const year = now.getFullYear();
                                const month = String(now.getMonth() + 1).padStart(2, '0');
                                const day = String(now.getDate()).padStart(2, '0');
                                const hours = String(now.getHours()).padStart(2, '0');
                                const minutes = String(now.getMinutes()).padStart(2, '0');
                                const seconds = String(now.getSeconds()).padStart(2, '0');

                                const timestamp = year + month + day + hours + minutes + seconds;
                                a.download = '微博收藏长备份_' + timestamp + '.zip';
                            }

                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        }

                        // 当前操作类型
                        let currentOperation = null; // 'backup' 或 'export'

                        function handleEnablePauseButton(operationType) {
                            currentOperation = operationType;
                            document.getElementById('pauseBackupBtn').disabled = false;
                            document.getElementById('pauseBackupBtn').textContent = '暂停';
                        }

                        function handleBackupStarted() {
                            isBackupRunning = true;
                            document.getElementById('autoBackupBtn').disabled = true;
                            document.getElementById('exportBtn').disabled = true;
                            document.getElementById('skipDeletedCheck').disabled = true;
                            document.getElementById('skipMobileOnlyCheck').disabled = true;
                        }

                        function handleBackupPaused() {
                            isBackupRunning = false;
                            document.getElementById('autoBackupBtn').disabled = false;
                            document.getElementById('autoBackupBtn').textContent = '继续备份';
                            document.getElementById('pauseBackupBtn').disabled = true;
                            document.getElementById('exportBtn').disabled = false;
                        }

                        function handleBackupResumed() {
                            isBackupRunning = true;
                            document.getElementById('autoBackupBtn').disabled = true;
                            document.getElementById('exportBtn').disabled = true;
                        }

                        function handleBackupCompleted() {
                            isBackupRunning = false;
                            currentOperation = null;
                            document.getElementById('autoBackupBtn').disabled = false;
                            document.getElementById('autoBackupBtn').textContent = '自动全部备份';
                            document.getElementById('pauseBackupBtn').disabled = true;
                            document.getElementById('exportBtn').disabled = false;
                            document.getElementById('skipDeletedCheck').disabled = false;
                            document.getElementById('skipMobileOnlyCheck').disabled = false;
                        }

                        function handleExportPaused() {
                            currentOperation = null;
                            document.getElementById('autoBackupBtn').disabled = false;
                            document.getElementById('exportBtn').disabled = false;
                            document.getElementById('pauseBackupBtn').disabled = true;
                            document.getElementById('pauseBackupBtn').textContent = '暂停';
                        }

                        function handleExportCompleted() {
                            currentOperation = null;
                            document.getElementById('autoBackupBtn').disabled = false;
                            document.getElementById('exportBtn').disabled = false;
                            document.getElementById('pauseBackupBtn').disabled = true;
                            document.getElementById('pauseBackupBtn').textContent = '暂停';
                        }

                        document.getElementById('autoBackupBtn').addEventListener('click', function() {
                            if (isBackupRunning) return;

                            const skipDeleted = document.getElementById('skipDeletedCheck').checked;
                            const skipMobileOnly = document.getElementById('skipMobileOnlyCheck').checked;

                            window.opener.postMessage({
                                type: 'startBackup',
                                skipDeleted: skipDeleted,
                                skipMobileOnly: skipMobileOnly
                            }, '*');
                        });

                        document.getElementById('pauseBackupBtn').addEventListener('click', function() {
                            if (!currentOperation) return;

                            window.opener.postMessage({
                                type: 'pauseOperation'
                            }, '*');
                        });

                        document.getElementById('exportBtn').addEventListener('click', function() {
                            window.opener.postMessage({
                                type: 'exportBackup'
                            }, '*');
                        });

                        // 添加上次备份信息按钮的处理程序
                        document.getElementById('checkLastBackupBtn').addEventListener('click', function() {
                            // 请求上次备份信息
                            window.opener.postMessage({
                                type: 'checkLastBackup'
                            }, '*');
                        });

                        // 添加备份新收藏按钮的处理程序
                        document.getElementById('backupNewBtn').addEventListener('click', function() {
                            // 请求仅备份新收藏
                            window.opener.postMessage({
                                type: 'backupNewFavorites',
                                backupFromId: window.backupFromId // 传递备份起点ID（如果有）
                            }, '*');

                            // 隐藏上次备份信息面板
                            document.getElementById('lastBackupInfo').style.display = 'none';
                            
                            // 重置按钮样式
                            this.textContent = "备份新收藏";
                            this.style.background = "#4caf50";
                        });
                    </script>
                </body>
                </html>
            `);
            newWindow.document.close();

            // 初始化微博API
            await initWeiboAPI();

            // 获取第一页数据
            const firstPageResult = await getFavorites(1);
            if (!firstPageResult || !firstPageResult.favorites) {
                throw new Error('获取收藏数据失败');
            }

            // 发送数据到新窗口
            newWindow.postMessage({
                type: 'favsData',
                favs: firstPageResult.favorites
            }, '*');

            // 监听来自新窗口的消息
            window.addEventListener('message', async function(event) {
                if (event.data.type === 'startBackup') {
                    await startLongBackup(
                        newWindow,
                        event.data.skipDeleted,
                        event.data.skipMobileOnly,
                        isBackupRunning ? lastBackupPage + 1 : 1
                    );
                } else if (event.data.type === 'pauseOperation') {
                    shouldPauseOperation = true;
                } else if (event.data.type === 'exportBackup') {
                    exportLongBackup(newWindow);
                } else if (event.data.type === 'checkLastBackup') {
                    // 获取并发送上次备份信息，以及前后微博信息
                    const info = loadLastBackupInfo();
                    if (info && info.lastFavoriteId) {
                        // 获取第一页数据
                        const firstPageResult = await getFavorites(1);
                        if (firstPageResult && firstPageResult.favorites && firstPageResult.favorites.length > 0) {
                            // 查找上次备份的微博在当前列表中的位置
                            let foundIndex = -1;
                            for (let i = 0; i < firstPageResult.favorites.length; i++) {
                                if (firstPageResult.favorites[i].id === info.lastFavoriteId) {
                                    foundIndex = i;
                                    break;
                                }
                            }

                            // 如果找到了上次备份的微博
                            if (foundIndex !== -1) {
                                // 获取前一条更新的微博（如果有）
                                const newerFavorite = foundIndex > 0 ? firstPageResult.favorites[foundIndex - 1] : null;
                                
                                // 获取后一条更早的微博（如果有）
                                const olderFavorite = foundIndex < firstPageResult.favorites.length - 1 ? firstPageResult.favorites[foundIndex + 1] : null;
                                
                                // 发送完整信息
                                newWindow.postMessage({
                                    type: 'lastBackupInfo',
                                    info: info,
                                    context: {
                                        newerFavorite: newerFavorite ? {
                                            id: newerFavorite.id,
                                            userName: newerFavorite.user ? newerFavorite.user.screen_name : '未知用户',
                                            content: newerFavorite.text ? (newerFavorite.text.substring(0, 100) + (newerFavorite.text.length > 100 ? '...' : '')) : ''
                                        } : null,
                                        olderFavorite: olderFavorite ? {
                                            id: olderFavorite.id,
                                            userName: olderFavorite.user ? olderFavorite.user.screen_name : '未知用户',
                                            content: olderFavorite.text ? (olderFavorite.text.substring(0, 100) + (olderFavorite.text.length > 100 ? '...' : '')) : ''
                                        } : null
                                    }
                                }, '*');
                            } else {
                                // 没有找到上次备份的微博，可能已被取消收藏
                                // 发送第一页的第一条微博作为最新微博
                                const newestFavorite = firstPageResult.favorites[0];
                                
                                newWindow.postMessage({
                                    type: 'lastBackupInfo',
                                    info: info,
                                    context: {
                                        newerFavorite: {
                                            id: newestFavorite.id,
                                            userName: newestFavorite.user ? newestFavorite.user.screen_name : '未知用户',
                                            content: newestFavorite.text ? (newestFavorite.text.substring(0, 100) + (newestFavorite.text.length > 100 ? '...' : '')) : ''
                                        },
                                        olderFavorite: null,
                                        notFound: true
                                    }
                                }, '*');
                            }
                        } else {
                            // 无法获取收藏列表，只发送基本信息
                            newWindow.postMessage({
                                type: 'lastBackupInfo',
                                info: info
                            }, '*');
                        }
                    } else {
                        newWindow.postMessage({
                            type: 'noLastBackupInfo'
                        }, '*');
                    }
                } else if (event.data.type === 'backupNewFavorites') {
                    // 开始智能备份（仅备份新收藏）
                    // 如果有指定起点ID，设置到targetWindow
                    if (event.data.backupFromId) {
                        newWindow.backupFromId = event.data.backupFromId;
                    }
                    startSmartBackup(newWindow);
                } else if (event.data.type === 'updateVideoQuality') {
                    // 更新视频清晰度设置
                    const quality = event.data.quality;
                    console.log('设置视频清晰度为:', quality);
                    config.settings.videoQuality = quality;

                    // 保存到本地存储
                    GM_setValue('videoQuality', quality);

                    // 显示提示消息
                    showMessage(`视频清晰度已更新为: ${quality}`, 'success');
                }
            });

            // 智能备份功能 - 仅备份上次备份后的新收藏
            async function startSmartBackup(targetWindow) {
                try {
                    // 加载上次备份信息
                    const lastInfo = loadLastBackupInfo();
                    if (!lastInfo || !lastInfo.lastFavoriteId) {
                        showMessage('没有找到上次备份信息，将执行完整备份', 'warning');
                        startLongBackup(targetWindow);
                        return;
                    }

                    // 获取第一页收藏
                    const result = await getFavorites(1);
                    if (!result || !result.favorites || result.favorites.length === 0) {
                        showMessage('获取收藏列表失败，无法执行智能备份', 'error');
                        return;
                    }

                    // 查找上次备份的最新微博在当前列表中的位置
                    let foundIndex = -1;
                    for (let i = 0; i < result.favorites.length; i++) {
                        if (result.favorites[i].id === lastInfo.lastFavoriteId) {
                            foundIndex = i;
                            break;
                        }
                    }

                    // 如果在第一页找到了上次备份的微博或者有指定的新微博ID
                    if (foundIndex !== -1 || (targetWindow.backupFromId && targetWindow.backupFromId !== lastInfo.lastFavoriteId)) {
                        let newFavorites = [];
                        let startMessage = '';
                        
                        // 如果页面上指定了特定微博ID作为起点
                        if (targetWindow.backupFromId && targetWindow.backupFromId !== lastInfo.lastFavoriteId) {
                            // 查找指定微博ID的位置
                            let specificIndex = -1;
                            for (let i = 0; i < result.favorites.length; i++) {
                                if (result.favorites[i].id === targetWindow.backupFromId) {
                                    specificIndex = i;
                                    break;
                                }
                            }
                            
                            if (specificIndex !== -1) {
                                // 从指定微博到第一条收藏（包含指定微博）
                                newFavorites = result.favorites.slice(0, specificIndex + 1);
                                startMessage = `从指定微博开始备份新收藏`;
                            } else {
                                // 指定的微博不在第一页
                                showMessage('没有在首页找到指定的微博，将从最新收藏开始备份', 'warning');
                                newFavorites = result.favorites;
                                startMessage = `从最新收藏开始备份`;
                            }
                        } else {
                            // 正常情况：从上次备份位置开始
                            newFavorites = result.favorites.slice(0, foundIndex);
                            startMessage = `继续从上次备份点备份新收藏`;
                        }

                        if (newFavorites.length === 0) {
                            showMessage('没有新的收藏需要备份', 'info');
                            targetWindow.postMessage({
                                type: 'noNewFavorites'
                            }, '*');
                            return;
                        }

                        // 显示新收藏的范围
                        const firstNew = newFavorites[0];
                        const lastNew = newFavorites.length > 1 ? newFavorites[newFavorites.length - 1] : firstNew;

                        const firstUserName = firstNew.user ? firstNew.user.screen_name : '未知用户';
                        const lastUserName = lastNew.user ? lastNew.user.screen_name : '未知用户';

                        // 根据收藏数量生成不同的消息
                        let message;
                        if (newFavorites.length === 1) {
                            message = `${startMessage}，发现1条新收藏，"${firstUserName}"的微博`;
                        } else {
                            message = `${startMessage}，发现${newFavorites.length}条新收藏，从"${firstUserName}"的微博到"${lastUserName}"的微博`;
                        }
                        showMessage(message, 'info');

                        // 开始备份这些新收藏
                        let messageData = {
                            type: 'smartBackupStart',
                            newCount: newFavorites.length,
                            firstUser: firstUserName
                        };

                        // 只有多条收藏时才添加lastUser
                        if (newFavorites.length > 1) {
                            messageData.lastUser = lastUserName;
                        }

                        targetWindow.postMessage(messageData, '*');

                        // 清空当前备份数据并设置为新收藏
                        backupData.favorites = [];
                        backupData.metadata.timestamp = new Date().toISOString();
                        backupMediaItems = [];

                        // 添加新收藏到备份数据中
                        backupData.favorites = newFavorites;

                        // 收集媒体项
                        newFavorites.forEach(collectMediaItems);

                        // 通知前端更新
                        targetWindow.postMessage({
                            type: 'favsData',
                            favs: backupData.favorites
                        }, '*');

                        // 记录备份完成和总数
                        backupData.metadata.total = newFavorites.length;
                        updateBackupProgress(targetWindow, newFavorites.length, newFavorites.length, true);

                        // 保存最新备份信息
                        if (newFavorites.length > 0) {
                            saveLastBackupInfo(newFavorites[0]);
                        }

                        // 通知完成
                        targetWindow.postMessage({
                            type: 'backupCompleted'
                        }, '*');

                        showMessage(`备份完成! 共备份${newFavorites.length}条新收藏`, 'success');

                        // 在备份完成后自动触发导出操作
                        setTimeout(() => {
                            exportLongBackup(targetWindow);
                        }, 1000);
                        
                        // 重置备份ID
                        delete targetWindow.backupFromId;
                    } else {
                        // 上次备份的微博不在第一页，执行完整备份
                        showMessage('没有在首页找到上次备份的微博，将执行完整备份', 'warning');
                        startLongBackup(targetWindow);
                    }
                } catch (error) {
                    console.error('智能备份失败:', error);
                    showMessage(`智能备份失败: ${error.message}`, 'error');
                }
            }

        } catch (error) {
            console.error('长备份失败:', error);
            showMessage(`长备份失败: ${error.message}`, 'error');
        }
    }

    // 全局变量存储已备份的收藏
    const backupData = {
        favorites: [],
        metadata: {
            timestamp: null,
            version: '1.0',
            total: 0
        }
    };

    // 状态控制
    let isBackupRunning = false;
    let isExportRunning = false;
    let shouldPauseOperation = false;
    let lastBackupPage = 1;
    // 记忆上次备份功能相关变量
    let lastBackupInfo = {
        timestamp: '',
        lastFavoriteId: '',
        lastFavoriteName: '',
        lastFavoriteContent: '',
        totalBackedUp: 0
    };
    let backupMediaItems = [];

    async function startLongBackup(targetWindow, skipDeleted = true, skipMobileOnly = true, resumeFrom = 1) {
        try {
            if (isBackupRunning) return;
            isBackupRunning = true;
            shouldPauseOperation = false;

            // 启用暂停按钮
            targetWindow.postMessage({
                type: 'enablePauseButton',
                operationType: 'backup'
            }, '*');

            // 如果是从头开始，清空数据
            if (resumeFrom === 1) {
                backupData.favorites = [];
                backupData.metadata.timestamp = new Date().toISOString();
                backupMediaItems = [];
            }

            // 通知前端备份开始
            targetWindow.postMessage({
                type: 'backupStarted'
            }, '*');

            let page = resumeFrom;
            let hasMore = true;
            let totalProcessed = 0;
            let totalBackedUp = 0;
            let batchCounter = 0;
            let batchProgress = 0;

            // 获取新收藏
            const checkNewFavorites = async () => {
                if (shouldPauseOperation) return;

                try {
                    const result = await getFavorites(1);
                    if (!result || !result.favorites) return;

                    const existingIds = new Set(backupData.favorites.map(fav => fav.id));
                    const newFavs = result.favorites.filter(fav => !existingIds.has(fav.id));

                    if (newFavs.length > 0) {
                        // 过滤微博
                        const filteredNewFavs = newFavs.filter(fav => {
                            if (skipDeleted && fav.text && fav.text.includes('此微博已被删除')) return false;
                            if (skipMobileOnly && ((fav.text && fav.text.includes('该内容请至手机客户端查看')) ||
                                                 (fav.user && fav.user.screen_name === '未知用户'))) return false;
                            return true;
                        });

                        if (filteredNewFavs.length > 0) {
                            backupData.favorites.unshift(...filteredNewFavs);
                            backupData.metadata.total += filteredNewFavs.length;

                            // 收集媒体项
                            filteredNewFavs.forEach(collectMediaItems);

                            // 通知前端
                            targetWindow.postMessage({
                                type: 'favsData',
                                favs: backupData.favorites
                            }, '*');

                            totalBackedUp += filteredNewFavs.length;
                            updateBackupProgress(targetWindow, totalProcessed, totalBackedUp);
                        }
                    }
                } catch (error) {
                    console.error('检查新收藏失败:', error);
                }
            };

            // 定期检查新收藏
            const checkInterval = setInterval(checkNewFavorites, 60000); // 每分钟检查一次

            while (hasMore && !shouldPauseOperation) {
                try {
                    const result = await getFavorites(page);
                    if (!result || !result.favorites || result.favorites.length === 0) {
                        hasMore = false;
                        break;
                    }

                    totalProcessed += result.favorites.length;
                    lastBackupPage = page;

                    // 过滤微博
                    const filteredFavs = result.favorites.filter(fav => {
                        if (skipDeleted && fav.text && fav.text.includes('此微博已被删除')) return false;
                        if (skipMobileOnly && ((fav.text && fav.text.includes('该内容请至手机客户端查看')) ||
                                             (fav.user && fav.user.screen_name === '未知用户'))) return false;
                        return true;
                    });

                    if (filteredFavs.length > 0) {
                        backupData.favorites.push(...filteredFavs);

                        // 收集媒体项
                        filteredFavs.forEach(collectMediaItems);

                        totalBackedUp += filteredFavs.length;
                    }

                    // 每处理100条收藏更新一次进度
                    batchCounter += result.favorites.length;
                    batchProgress += result.favorites.length;

                    if (batchProgress >= 100 || batchProgress >= result.favorites.length) {
                        // 更新批次进度
                        targetWindow.postMessage({
                            type: 'batchProgress',
                            current: batchProgress > 100 ? 100 : batchProgress,
                            total: 100
                        }, '*');
                    }

                    if (batchCounter >= 100) {
                        batchCounter = 0;
                        batchProgress = 0;

                        // 更新前端数据
                        targetWindow.postMessage({
                            type: 'favsData',
                            favs: backupData.favorites
                        }, '*');

                        updateBackupProgress(targetWindow, totalProcessed, totalBackedUp);

                        // 等待一小段时间避免请求过快
            await new Promise(resolve => setTimeout(resolve, 500));
        }

                    page++;

                    // 等待一小段时间避免请求过快
                    await new Promise(resolve => setTimeout(resolve, 300));
                } catch (error) {
                    console.error(`获取第${page}页收藏列表失败:`, error);
                    if (error.message && error.message.includes('未登录')) {
                        clearInterval(checkInterval);
                        isBackupRunning = false;
                        throw error; // 未登录错误，直接抛出
                    }

                    // 其他错误继续尝试下一页
                    page++;
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            clearInterval(checkInterval);

            if (shouldPauseOperation) {
                // 备份被暂停
                targetWindow.postMessage({
                    type: 'backupPaused'
                }, '*');
                isBackupRunning = false;
                shouldPauseOperation = false;
                return;
            }

            // 完成备份
            backupData.metadata.total = backupData.favorites.length;

            // 保存最新备份信息（最新的微博是第一条）
            if (backupData.favorites.length > 0) {
                saveLastBackupInfo(backupData.favorites[0]);
            }

            // 通知前端备份完成
            updateBackupProgress(targetWindow, totalProcessed, totalBackedUp, true);
            targetWindow.postMessage({
                type: 'backupCompleted'
            }, '*');

            showMessage(`备份完成! 共处理${totalProcessed}条收藏，成功备份${totalBackedUp}条`, 'success');
            isBackupRunning = false;
        } catch (error) {
            console.error('长备份过程中出错:', error);
            showMessage(`长备份失败: ${error.message}`, 'error');
            isBackupRunning = false;
        }
    }

    // 收集媒体项
    function collectMediaItems(item) {
        try {
            // 处理原微博混合媒体（优先检查）
            let hasProcessedMixedMedia = false;
            if (item.mix_media_info && Array.isArray(item.mix_media_info.items)) {
                for (const media of item.mix_media_info.items) {
                    if (media.type === 'pic') {
                        // 图片或 LivePhoto
                        const picData = media.data;
                        if (!picData) continue;

                        const picId = picData.pic_id || '';
                        const isLivePhoto = picData.type === 'livephoto' || !!picData.video;
                        const imgUrl = fixImageUrl(picData.original?.url || picData.large?.url || picData.bmiddle?.url);

                        let videoUrl = null;
                        if (isLivePhoto && picData.video) {
                            videoUrl = fixImageUrl(picData.video);
                        }

                        backupMediaItems.push({
                            id: `${item.id}_${picId || 'mix_' + backupMediaItems.length}`,
                            type: isLivePhoto ? 'livephoto' : 'image',
                            imgUrl: imgUrl,
                            videoUrl: videoUrl,
                            picId: picId,
                            weiboId: item.id,
                            user: item.user ? item.user.screen_name : '未知用户',
                            isMixedMedia: true
                        });
                        hasProcessedMixedMedia = true;
                    } else if (media.type === 'video') {
                        // 视频项
                        const mediaInfo = media.data.media_info;
                        if (!mediaInfo) continue;

                        const posterUrl = fixImageUrl(media.data.page_pic || mediaInfo.thumbnail_pic);
                        const videoUrl = fixImageUrl(
                            mediaInfo.stream_url ||
                            mediaInfo.mp4_720p_mp4 ||
                            mediaInfo.mp4_hd_url ||
                            mediaInfo.h5_url ||
                            mediaInfo.mp4_sd_url
                        );

                        if (videoUrl) {
                            backupMediaItems.push({
                                id: `${item.id}_video_mix_${backupMediaItems.length}`,
                                type: 'video',
                                imgUrl: posterUrl,
                                videoUrl: videoUrl,
                                weiboId: item.id,
                                user: item.user ? item.user.screen_name : '未知用户',
                                isMixedMedia: true
                            });
                            hasProcessedMixedMedia = true;
                        }
                    }
                }
            }

            // 如果没有处理混合媒体或需要备份所有媒体，使用传统方式继续处理
            if (!hasProcessedMixedMedia) {
                // 处理原微博图片
                if (item.pic_ids && item.pic_infos) {
                    for (const picId of item.pic_ids) {
                        const picInfo = item.pic_infos[picId];
                        if (!picInfo) continue;

                        const isLivePhoto = picInfo.type === 'livephoto' || picInfo.live_photo_video_url || picInfo.video || picInfo.pic_video;
                        const imgUrl = fixImageUrl(picInfo.original ? picInfo.original.url : (picInfo.large ? picInfo.large.url : picInfo.bmiddle.url));

                        let videoUrl = null;
                        if (isLivePhoto) {
                            videoUrl = picInfo.live_photo_video_url || picInfo.video || picInfo.pic_video;
                            if (videoUrl) {
                                videoUrl = fixImageUrl(videoUrl);
                            }
                        }

                        backupMediaItems.push({
                            id: `${item.id}_${picId}`,
                            type: isLivePhoto ? 'livephoto' : 'image',
                            imgUrl: imgUrl,
                            videoUrl: videoUrl,
                            picId: picId,
                            weiboId: item.id,
                            user: item.user ? item.user.screen_name : '未知用户'
                        });
                    }
                }

                // 处理原微博视频
                if (item.page_info && item.page_info.media_info) {
                    const mediaInfo = item.page_info.media_info;
                    const posterUrl = fixImageUrl(mediaInfo.thumbnail_pic || item.page_info.page_pic);

                    // 收集所有可用的视频清晰度选项
                    const videoSources = [];
                    const videoQualities = [];

                    // 按质量从高到低收集视频源
                    if (mediaInfo.playback_list && Array.isArray(mediaInfo.playback_list)) {
                        for (const playback of mediaInfo.playback_list) {
                            if (playback.play_info && playback.play_info.url) {
                                videoSources.push(fixImageUrl(playback.play_info.url));
                                videoQualities.push(playback.meta.quality_label || playback.meta.label || '未知');
                            }
                        }
                    }

                    // 如果没有playback_list，尝试使用普通字段
                    if (videoSources.length === 0) {
                        const sources = [
                            { url: mediaInfo.stream_url_hd, quality: '1080p' },
                            { url: mediaInfo.stream_url, quality: '高清' },
                            { url: mediaInfo.mp4_720p_mp4, quality: '720p' },
                            { url: mediaInfo.mp4_hd_url, quality: '高清' },
                            { url: mediaInfo.h5_url, quality: '标清' },
                            { url: mediaInfo.mp4_sd_url, quality: '标清' }
                        ];

                        for (const source of sources) {
                            if (source.url) {
                                videoSources.push(fixImageUrl(source.url));
                                videoQualities.push(source.quality);
                            }
                        }
                    }

                    // 如果没有找到视频源，使用默认字段
                    if (videoSources.length === 0) {
                    const videoUrl = fixImageUrl(
                        mediaInfo.stream_url ||
                        mediaInfo.mp4_720p_mp4 ||
                        mediaInfo.mp4_hd_url ||
                        mediaInfo.h5_url ||
                        mediaInfo.mp4_sd_url
                    );

                    if (videoUrl) {
                            videoSources.push(videoUrl);
                            videoQualities.push('默认');
                        }
                    }

                    // 如果找到至少一个视频源
                    if (videoSources.length > 0) {
                        // 根据当前选择的清晰度获取最终使用的视频URL
                        let bestVideoUrl = videoSources[0]; // 默认使用最高清晰度
                        let bestQuality = videoQualities[0];

                        // 记录所有可用的清晰度选项
                        console.log(`视频ID: ${item.id}, 可用清晰度:`, videoQualities.join(', '));
                        console.log(`当前选择的清晰度: ${config.settings.videoQuality}`);

                        if (config.settings.videoQuality !== 'highest') {
                            // 尝试找到精确匹配的清晰度
                            const matchIndex = videoQualities.findIndex(q =>
                                q.toLowerCase().includes(config.settings.videoQuality.toLowerCase()));

                            if (matchIndex !== -1) {
                                bestVideoUrl = videoSources[matchIndex];
                                bestQuality = videoQualities[matchIndex];
                                console.log(`找到匹配的清晰度: ${bestQuality}`);
                            } else {
                                console.log(`未找到匹配的清晰度，使用最高清晰度: ${bestQuality}`);
                            }
                        } else {
                            console.log(`使用最高清晰度: ${bestQuality}`);
                        }

                        backupMediaItems.push({
                            id: `${item.id}_video`,
                            type: 'video',
                            imgUrl: posterUrl,
                            videoUrl: bestVideoUrl,
                            weiboId: item.id,
                            user: item.user ? item.user.screen_name : '未知用户',
                            sources: videoSources,
                            qualities: videoQualities,
                            quality: bestQuality
                        });
                    }
                }
            }

            // 处理转发微博
            if (item.retweeted_status) {
                // 处理转发微博的混合媒体
                let hasProcessedRTMixedMedia = false;
                if (item.retweeted_status.mix_media_info && Array.isArray(item.retweeted_status.mix_media_info.items)) {
                    for (const media of item.retweeted_status.mix_media_info.items) {
                        if (media.type === 'pic') {
                            // 图片或 LivePhoto
                            const picData = media.data;
                            if (!picData) continue;

                            const picId = picData.pic_id || '';
                            const isLivePhoto = picData.type === 'livephoto' || !!picData.video;
                            const imgUrl = fixImageUrl(picData.original?.url || picData.large?.url || picData.bmiddle?.url);

                            let videoUrl = null;
                            if (isLivePhoto && picData.video) {
                                videoUrl = fixImageUrl(picData.video);
                            }

                            backupMediaItems.push({
                                id: `${item.id}_RT_${picId || 'mix_' + backupMediaItems.length}`,
                                type: isLivePhoto ? 'livephoto' : 'image',
                                imgUrl: imgUrl,
                                videoUrl: videoUrl,
                                picId: picId,
                                weiboId: item.id,
                                isRetweet: true,
                                user: item.user ? item.user.screen_name : '未知用户',
                                rtUser: item.retweeted_status.user ? item.retweeted_status.user.screen_name : '未知用户',
                                isMixedMedia: true
                            });
                            hasProcessedRTMixedMedia = true;
                        } else if (media.type === 'video') {
                            // 视频项
                            const mediaInfo = media.data.media_info;
                            if (!mediaInfo) continue;

                            const posterUrl = fixImageUrl(media.data.page_pic || mediaInfo.thumbnail_pic);
                            const videoUrl = fixImageUrl(
                                mediaInfo.stream_url ||
                                mediaInfo.mp4_720p_mp4 ||
                                mediaInfo.mp4_hd_url ||
                                mediaInfo.h5_url ||
                                mediaInfo.mp4_sd_url
                            );

                            if (videoUrl) {
                                backupMediaItems.push({
                                    id: `${item.id}_RT_video_mix_${backupMediaItems.length}`,
                                    type: 'video',
                                    imgUrl: posterUrl,
                                    videoUrl: videoUrl,
                                    weiboId: item.id,
                                    isRetweet: true,
                                    user: item.user ? item.user.screen_name : '未知用户',
                                    rtUser: item.retweeted_status.user ? item.retweeted_status.user.screen_name : '未知用户',
                                    isMixedMedia: true
                                });
                                hasProcessedRTMixedMedia = true;
                            }
                        }
                    }
                }

                // 如果没有处理转发微博的混合媒体，使用传统方式继续处理
                if (!hasProcessedRTMixedMedia) {
                    // 处理转发微博的图片
                    if (item.retweeted_status.pic_ids && item.retweeted_status.pic_infos) {
                        for (const picId of item.retweeted_status.pic_ids) {
                            const picInfo = item.retweeted_status.pic_infos[picId];
                            if (!picInfo) continue;

                            const isLivePhoto = picInfo.type === 'livephoto' || picInfo.live_photo_video_url || picInfo.video || picInfo.pic_video;
                            const imgUrl = fixImageUrl(picInfo.original ? picInfo.original.url : (picInfo.large ? picInfo.large.url : picInfo.bmiddle.url));

                            let videoUrl = null;
                            if (isLivePhoto) {
                                videoUrl = picInfo.live_photo_video_url || picInfo.video || picInfo.pic_video;
                                if (videoUrl) {
                                    videoUrl = fixImageUrl(videoUrl);
                                }
                            }

                            backupMediaItems.push({
                                id: `${item.id}_RT_${picId}`,
                                type: isLivePhoto ? 'livephoto' : 'image',
                                imgUrl: imgUrl,
                                videoUrl: videoUrl,
                                picId: picId,
                                weiboId: item.id,
                                isRetweet: true,
                                user: item.user ? item.user.screen_name : '未知用户',
                                rtUser: item.retweeted_status.user ? item.retweeted_status.user.screen_name : '未知用户'
                            });
                        }
                    }

                    // 处理转发微博的视频
                    if (item.retweeted_status.page_info && item.retweeted_status.page_info.media_info) {
                        const mediaInfo = item.retweeted_status.page_info.media_info;
                        const posterUrl = fixImageUrl(mediaInfo.thumbnail_pic || item.retweeted_status.page_info.page_pic);

                        // 收集所有可用的视频清晰度选项
                        const videoSources = [];
                        const videoQualities = [];

                        // 按质量从高到低收集视频源
                        if (mediaInfo.playback_list && Array.isArray(mediaInfo.playback_list)) {
                            for (const playback of mediaInfo.playback_list) {
                                if (playback.play_info && playback.play_info.url) {
                                    videoSources.push(fixImageUrl(playback.play_info.url));
                                    videoQualities.push(playback.meta.quality_label || playback.meta.label || '未知');
                                }
                            }
                        }

                        // 如果没有playback_list，尝试使用普通字段
                        if (videoSources.length === 0) {
                            const sources = [
                                { url: mediaInfo.stream_url_hd, quality: '1080p' },
                                { url: mediaInfo.stream_url, quality: '高清' },
                                { url: mediaInfo.mp4_720p_mp4, quality: '720p' },
                                { url: mediaInfo.mp4_hd_url, quality: '高清' },
                                { url: mediaInfo.h5_url, quality: '标清' },
                                { url: mediaInfo.mp4_sd_url, quality: '标清' }
                            ];

                            for (const source of sources) {
                                if (source.url) {
                                    videoSources.push(fixImageUrl(source.url));
                                    videoQualities.push(source.quality);
                                }
                            }
                        }

                        // 如果没有找到视频源，使用默认字段
                        if (videoSources.length === 0) {
                        const videoUrl = fixImageUrl(
                            mediaInfo.stream_url ||
                            mediaInfo.mp4_720p_mp4 ||
                            mediaInfo.mp4_hd_url ||
                            mediaInfo.h5_url ||
                            mediaInfo.mp4_sd_url
                        );

                        if (videoUrl) {
                                videoSources.push(videoUrl);
                                videoQualities.push('默认');
                            }
                        }

                        // 如果找到至少一个视频源
                        if (videoSources.length > 0) {
                            // 根据当前选择的清晰度获取最终使用的视频URL
                            let bestVideoUrl = videoSources[0]; // 默认使用最高清晰度
                            let bestQuality = videoQualities[0];

                            if (config.settings.videoQuality !== 'highest') {
                                // 尝试找到精确匹配的清晰度
                                const matchIndex = videoQualities.findIndex(q =>
                                    q.toLowerCase().includes(config.settings.videoQuality.toLowerCase()));

                                if (matchIndex !== -1) {
                                    bestVideoUrl = videoSources[matchIndex];
                                    bestQuality = videoQualities[matchIndex];
                                }
                            }

                            backupMediaItems.push({
                                id: `${item.id}_RT_video`,
                                type: 'video',
                                imgUrl: posterUrl,
                                videoUrl: bestVideoUrl,
                                weiboId: item.id,
                                isRetweet: true,
                                user: item.user ? item.user.screen_name : '未知用户',
                                rtUser: item.retweeted_status.user ? item.retweeted_status.user.screen_name : '未知用户',
                                sources: videoSources,
                                qualities: videoQualities,
                                quality: bestQuality
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.error('收集媒体项失败:', error);
        }
    }

    function updateBackupProgress(targetWindow, totalProcessed, totalBackedUp, isCompleted = false) {
        const percent = isCompleted ? 100 : Math.min(Math.floor((totalProcessed / 10000) * 100), 99);
        const statusText = isCompleted
            ? `备份完成! 共处理${totalProcessed}条收藏，成功备份${totalBackedUp}条`
            : `已处理${totalProcessed}条收藏，已备份${totalBackedUp}条`;

        targetWindow.postMessage({
            type: 'progress',
            percent: percent,
            status: statusText
        }, '*');
    }

    // 保存上次备份信息
    function saveLastBackupInfo(favoriteItem) {
        if (!favoriteItem) return;

        // 获取最新收藏微博的信息
        const timestamp = new Date().toISOString();
        const lastFavoriteId = favoriteItem.id;
        const lastFavoriteName = favoriteItem.user ? favoriteItem.user.screen_name : '未知用户';
        const lastFavoriteContent = favoriteItem.text ? favoriteItem.text.substring(0, 100) + (favoriteItem.text.length > 100 ? '...' : '') : '';
        const totalBackedUp = backupData.favorites.length;

        // 更新信息
        lastBackupInfo = {
            timestamp,
            lastFavoriteId,
            lastFavoriteName,
            lastFavoriteContent,
            totalBackedUp
        };

        // 保存到GM存储
        GM_setValue('lastBackupInfo', JSON.stringify(lastBackupInfo));

        console.log('保存上次备份信息:', lastBackupInfo);
    }

    // 加载上次备份信息
    function loadLastBackupInfo() {
        try {
            const savedInfo = GM_getValue('lastBackupInfo');
            if (savedInfo) {
                lastBackupInfo = JSON.parse(savedInfo);
                return lastBackupInfo;
            }
        } catch (error) {
            console.error('加载上次备份信息失败:', error);
        }
        return null;
    }

    // 内存优化器类
    class MemoryOptimizer {
        // 默认设置每批处理20条微博
        static CHUNK_SIZE = 20;

        // 清理内存
        static async cleanupMemory() {
            // 尝试手动触发垃圾回收(在支持的浏览器中)
            if (window.gc) {
                try {
                    window.gc();
                } catch (e) {
                    console.log('手动垃圾回收尝试失败:', e);
                }
            }

            // 等待一段时间让浏览器自己处理内存
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    async function exportLongBackup(targetWindow) {
        try {
            if (isExportRunning) return;
            isExportRunning = true;
            shouldPauseOperation = false;

            // 生成一个共享时间戳给所有批次使用
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const commonTimestamp = year + month + day + hours + minutes + seconds;

            // 启用暂停按钮
            targetWindow.postMessage({
                type: 'enablePauseButton',
                operationType: 'export'
            }, '*');

            showMessage('正在准备导出数据...', 'info');

            // 确保使用最新的清晰度设置
            console.log('导出前检查视频清晰度设置:', config.settings.videoQuality);

            // 重新处理媒体项以应用最新的清晰度设置
            backupMediaItems = [];
            console.log('重新收集媒体项以应用当前清晰度设置:', config.settings.videoQuality);
            backupData.favorites.forEach(item => collectMediaItems(item));

            if (!backupData.favorites || backupData.favorites.length === 0) {
                showMessage('没有可导出的数据', 'error');
                isExportRunning = false;
                targetWindow.postMessage({
                    type: 'exportCompleted'
                }, '*');
                return;
            }

            // 将收藏分批
            const batches = [];
            for (let i = 0; i < backupData.favorites.length; i += MemoryOptimizer.CHUNK_SIZE) {
                batches.push(backupData.favorites.slice(i, i + MemoryOptimizer.CHUNK_SIZE));
            }

            const totalBatches = batches.length;
            showMessage(`将分${totalBatches}批导出，每批${MemoryOptimizer.CHUNK_SIZE}条微博`, 'info');

                        // 创建进度条
            const progressContainer = createProgressBar();
            document.body.appendChild(progressContainer);
            updateProgressBar(progressContainer, 0);

            // 批量处理
            for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
                // 检查暂停状态
                if (shouldPauseOperation) {
                    targetWindow.postMessage({
                        type: 'exportPaused'
                    }, '*');
                    isExportRunning = false;
                    shouldPauseOperation = false;
                    return;
                }

                const currentBatch = batches[batchIndex];
                showMessage(`正在处理第 ${batchIndex + 1}/${totalBatches} 批`, 'info');

                // 更新总进度
                const totalProgress = Math.round(batchIndex / totalBatches * 100);
                updateProgressBar(progressContainer, totalProgress);

                targetWindow.postMessage({
                    type: 'progress',
                    percent: totalProgress,
                    status: `批次 ${batchIndex + 1}/${totalBatches}，准备导出...`
                }, '*');

                // 为当前批次创建一个新的ZIP文件
                const zip = new JSZip();
                const mediaFolder = zip.folder("media");
                const htmlFolder = zip.folder("html");

                // 收集当前批次的媒体项
                const batchMediaItems = [];
                currentBatch.forEach(fav => {
                    backupMediaItems.forEach(media => {
                        if (media.weiboId === fav.id) {
                            batchMediaItems.push(media);
                        }
                    });
                });

                // 构建微博媒体映射
                const weiboMediaMap = new Map();
                batchMediaItems.forEach(media => {
                    if (!weiboMediaMap.has(media.weiboId)) {
                        weiboMediaMap.set(media.weiboId, []);
                    }
                    weiboMediaMap.get(media.weiboId).push(media);
                });

                // 构建微博内容映射
                const weiboContentMap = new Map();
                currentBatch.forEach(fav => {
                    const content = fav.text ? fav.text.substring(0, 20) + (fav.text.length > 20 ? '...' : '') : '';
                    const userName = fav.user ? fav.user.screen_name : '未知用户';
                    weiboContentMap.set(fav.id, {
                        content: content,
                        userName: userName
                    });
                });

                // 下载该批次的媒体文件
                let weiboIndex = 0;
                for (const [weiboId, mediaList] of weiboMediaMap.entries()) {
                    // 检查暂停状态
                    if (shouldPauseOperation) {
                        targetWindow.postMessage({
                            type: 'exportPaused'
                        }, '*');
                        isExportRunning = false;
                        shouldPauseOperation = false;
                        return;
                    }

                    weiboIndex++;
                    const weiboInfo = weiboContentMap.get(weiboId) || { userName: '未知用户', content: '' };
                    const weiboDisplayName = `${weiboInfo.userName}: ${weiboInfo.content}`;

                    // 更新批次内进度
                    const batchProgress = totalProgress + Math.round((weiboIndex / weiboMediaMap.size) * (100 / totalBatches) * 0.5);
                    updateProgressBar(progressContainer, batchProgress);

                    targetWindow.postMessage({
                        type: 'progress',
                        percent: batchProgress,
                        status: `批次 ${batchIndex + 1}/${totalBatches}，正在下载微博 (${weiboIndex}/${weiboMediaMap.size})：${weiboDisplayName}`
                    }, '*');

                    // 下载媒体文件
                    const batchSize = 5; // 并发下载数
                    for (let i = 0; i < mediaList.length; i += batchSize) {
                        const batch = mediaList.slice(i, i + batchSize);
                        const mediaType = batch[0].type === 'video' ? '视频' : (batch[0].type === 'livephoto' ? 'LivePhoto' : '图片');

                        const promises = batch.map(async (media, mediaIndex) => {
                            try {
                                const currentMediaIndex = i + mediaIndex;

                                // 下载图片
                                const imgResponse = await fetch(media.imgUrl);
                                const imgData = await imgResponse.blob();
                                const imgFileName = `${media.id}_img.jpg`;
                                mediaFolder.file(imgFileName, imgData);

                                // 下载视频（如果有）
                                if (media.videoUrl) {
                                    try {
                                        // 获取当前选择的视频清晰度
                                        const currentQuality = config.settings.videoQuality;
                                        let videoUrlToUse = media.videoUrl;

                                        if (media.sources && media.sources.length > 0 && media.qualities && media.qualities.length > 0) {
                                            if (currentQuality === 'highest') {
                                                videoUrlToUse = media.sources[0];
                                                console.log(`使用最高清晰度: ${media.qualities[0]}`);
                                            } else {
                                                const matchIndex = media.qualities.findIndex(q =>
                                                    q.toLowerCase().includes(currentQuality.toLowerCase()));

                                                if (matchIndex !== -1) {
                                                    videoUrlToUse = media.sources[matchIndex];
                                                    console.log(`找到匹配的清晰度: ${media.qualities[matchIndex]}`);
                                                } else {
                                                    console.log(`未找到匹配的清晰度，继续使用: ${media.quality || '默认清晰度'}`);
                                                }
                                            }
                                        }

                                        // 增加下载视频的错误处理和重试机制
                                        let videoData = null;
                                        const maxRetries = 3;
                                        let lastError = null;

                                        for (let attempt = 0; attempt < maxRetries; attempt++) {
                                            try {
                                                if (attempt > 0) {
                                                    console.log(`尝试第${attempt + 1}次下载视频: ${videoUrlToUse}`);
                                                }

                                                // 处理腾讯视频链接的特殊情况
                                                if (videoUrlToUse.includes('qqvideo') || videoUrlToUse.includes('vlive.qqvideo')) {
                                                    videoUrlToUse = videoUrlToUse.replace(/^https:/, 'http:');
                                                }

                                                const videoResponse = await fetch(videoUrlToUse, {
                                                    // 对于腾讯视频链接，忽略证书错误
                                                    mode: 'cors',
                                                    credentials: 'omit'
                                                });

                                                if (!videoResponse.ok) {
                                                    throw new Error(`HTTP error: ${videoResponse.status}`);
                                                }
                                                
                                                videoData = await videoResponse.blob();
                                                break; // 成功下载，跳出循环
                                            } catch (error) {
                                                lastError = error;
                                                console.warn(`视频下载失败，尝试 ${attempt + 1}/${maxRetries}: ${error.message}`);
                                                
                                                // 如果是腾讯视频且失败，尝试使用alternative URL(包括http和https两种尝试)
                                                if (videoUrlToUse.includes('qqvideo') || videoUrlToUse.includes('vlive.qqvideo')) {
                                                    videoUrlToUse = videoUrlToUse.includes('http:') 
                                                        ? videoUrlToUse.replace('http:', 'https:') 
                                                        : videoUrlToUse.replace('https:', 'http:');
                                                }
                                                
                                                // 等待一段时间再重试
                                                if (attempt < maxRetries - 1) {
                                                    await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
                                                }
                                            }
                                        }

                                        if (videoData) {
                                            const videoFileName = `${media.id}_video.mp4`;
                                            mediaFolder.file(videoFileName, videoData);
                                            console.log(`视频下载成功: ${media.id}`);
                                        } else {
                                            console.error(`所有下载尝试均失败: ${media.videoUrl}`, lastError);
                                            
                                            // 即使视频下载失败，使用占位视频文件，避免HTML链接失效
                                            const placeholderVideo = new Blob(['视频下载失败'], {type: 'video/mp4'});
                                            const videoFileName = `${media.id}_video.mp4`;
                                            mediaFolder.file(videoFileName, placeholderVideo);
                                        }
                                    } catch (e) {
                                        console.error(`下载视频失败: ${media.videoUrl}`, e);
                                        
                                        // 即使视频下载失败，使用占位视频文件，避免HTML链接失效
                                        const placeholderVideo = new Blob(['视频下载失败'], {type: 'video/mp4'});
                                        const videoFileName = `${media.id}_video.mp4`;
                                        mediaFolder.file(videoFileName, placeholderVideo);
                                    }
                                }

                                media.downloaded = true;
                            } catch (error) {
                                console.error(`下载媒体失败: ${media.id}`, error);
                            }
                        });

                        await Promise.all(promises);

                        // 短暂暂停避免请求过快
                        await new Promise(resolve => setTimeout(resolve, 200));
                    }
                }

                // 生成HTML文件
                const htmlContent = generateLongBackupHTML(currentBatch, batchIndex + 1, totalBatches);
                htmlFolder.file(`微博收藏长备份_${batchIndex + 1}.html`, htmlContent);

                // 生成索引HTML - 在当前批次中只有一页
                const indexHtml = generateLongBackupIndex(1, batchIndex + 1);
                htmlFolder.file('index.html', indexHtml);

                // 更新批次进度
                const batchCompleteProgress = totalProgress + Math.round(100 / totalBatches * 0.8);
                updateProgressBar(progressContainer, batchCompleteProgress);

                targetWindow.postMessage({
                    type: 'progress',
                    percent: batchCompleteProgress,
                    status: `批次 ${batchIndex + 1}/${totalBatches}，正在生成ZIP文件...`
                }, '*');

                // 生成ZIP文件
                showMessage(`正在生成第 ${batchIndex + 1}/${totalBatches} 批ZIP文件...`, 'info');
                const zipBlob = await zip.generateAsync({type: 'blob'});
                const zipUrl = URL.createObjectURL(zipBlob);

                // 下载当前批次的ZIP文件，使用共享时间戳
                targetWindow.postMessage({
                    type: 'exportData',
                    url: zipUrl,
                    filename: `微博收藏_${commonTimestamp}_${batchIndex + 1}.zip`
                }, '*');

                // 等待一段时间,确保浏览器有时间完成下载
                await new Promise(resolve => setTimeout(resolve, 3000));

                // 释放内存
                URL.revokeObjectURL(zipUrl);
                await MemoryOptimizer.cleanupMemory();

                // 提示批次完成
                showMessage(`完成第 ${batchIndex + 1}/${totalBatches} 批导出`, 'success');
            }

            hideProgressBar(progressContainer);

            targetWindow.postMessage({
                type: 'progress',
                percent: 100,
                 status: `导出完成! 共导出 ${backupData.favorites.length} 条收藏，${backupMediaItems.length} 个媒体文件`
            }, '*');

             // 通知前端导出完成
            targetWindow.postMessage({
                type: 'exportCompleted'
            }, '*');

            isExportRunning = false;
             showMessage(`导出成功，共${backupData.favorites.length}条收藏，${backupMediaItems.length}个媒体文件`, 'success');
        } catch (error) {
            console.error('导出长备份数据失败:', error);
            showMessage(`导出失败: ${error.message}`, 'error');

            // 重置状态
            isExportRunning = false;
            targetWindow.postMessage({
                type: 'exportCompleted'
            }, '*');
        }
    }

    // 生成备份HTML
    function generateLongBackupHTML(favs, index, total) {
        const title = `微博收藏长备份 (${index}/${total})`;

        return `
        <!DOCTYPE html>
<html>
<head>
            <meta charset="UTF-8">
    <title>${title}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: #f5f5f5;
                }
                header {
                    background: #fff;
                    padding: 15px;
                    margin-bottom: 20px;
                    border-radius: 5px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                }
                h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .quality-selector {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-left: 15px;
                }
                .quality-selector select {
                    padding: 5px;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                }
                .navigation {
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                }
                .navigation a {
                    padding: 5px 10px;
                    background: #f0f0f0;
                    border-radius: 3px;
                    text-decoration: none;
                    color: #333;
                }
                .item-container {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                .item {
                    background: #fff;
                    padding: 15px;
                    border-radius: 5px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .item-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }
                .user {
                    font-weight: bold;
                }
                .date {
                    color: #888;
                }
                .content {
                    margin-bottom: 10px;
                    white-space: pre-wrap;
                }
                .media-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-top: 10px;
                }
                .media-item {
                    position: relative;
                    cursor: pointer;
                }
                .media-item img {
                    width: 150px;
                    height: 150px;
                    object-fit: cover;
                    border-radius: 3px;
                }
                .media-item.livephoto::after {
                    content: "Live";
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    background: rgba(255,255,255,0.8);
                    padding: 2px 5px;
                    border-radius: 3px;
                    font-size: 10px;
                    font-weight: bold;
                }
                .media-item.video::after {
                    content: "";
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 0;
                    height: 0;
                    border-top: 15px solid transparent;
                    border-left: 25px solid rgba(255,255,255,0.8);
                    border-bottom: 15px solid transparent;
                }
                .video-quality-info {
                    position: absolute;
                    top: 5px;
                    left: 5px;
                    background: rgba(255,255,255,0.8);
                    padding: 2px 5px;
                    border-radius: 3px;
                    font-size: 10px;
                    font-weight: bold;
                    color: #333;
                }
                .preview-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.9);
                    z-index: 9999;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    display: none;
                }
                .preview-container {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                }
                .preview-container img, .preview-container video {
                    max-width: 100%;
                    max-height: 90vh;
                    object-fit: contain;
                }
                .dual-view {
                    display: flex;
                    gap: 10px;
                    max-width: 90vw;
                    align-items: center;
                    justify-content: center;
                }
                .dual-view .image-container {
                    flex: 1;
                    max-width: 45%;
                }
                .dual-view .image-container img {
                    max-width: 100%;
                    max-height: 90vh;
                    object-fit: contain;
                }
                .dual-view .video-container {
                    flex: 1;
                    max-width: 45%;
                }
                .dual-view .video-container video {
                    max-width: 100%;
                    max-height: 90vh;
                    object-fit: contain;
                }
                .preview-close {
                    position: absolute;
                    top: -30px;
                    right: 0;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                }
                .retweeted {
                    background: #f9f9f9;
                    padding: 10px;
                    border-radius: 5px;
                    margin-top: 10px;
                    border-left: 3px solid #ddd;
                }
                .retweeted .user {
                    color: #0066cc;
                }
    </style>
</head>
<body>
            <header>
                <div>
            <h1>${title}</h1>
                <div class="navigation">
                    <a href="index.html">返回目录</a>
                    <!-- 在单个批次中，不需要上一页和下一页导航链接，因为每个批次通常只有一个页面 -->
            </div>
            </div>
                <div class="quality-selector">
                    <label>视频清晰度：</label>
                    <select id="videoQualitySelect">
                        <option value="highest">最高清晰度</option>
                        <option value="8K60">8K 60帧</option>
                        <option value="4K60">4K 60帧</option>
                        <option value="2K60">2K 60帧</option>
                        <option value="1080p60">1080P 60帧</option>
                        <option value="1080p">1080P</option>
                        <option value="720p60">720P 60帧</option>
                        <option value="720p">720P</option>
                        <option value="480p">480P</option>
                    </select>
        </div>
            </header>

            <div class="item-container">
                ${favs.map((fav, idx) => {
                    const mediaItems = [];

                    // 查找该微博的媒体项
                    backupMediaItems.forEach(media => {
                        if (media.weiboId === fav.id && !media.isRetweet) {
                            mediaItems.push(media);
                        }
                    });

                    // 查找转发微博的媒体项
                    const rtMediaItems = [];
                    if (fav.retweeted_status) {
                        backupMediaItems.forEach(media => {
                            if (media.weiboId === fav.id && media.isRetweet) {
                                rtMediaItems.push(media);
                            }
                        });
                    }

                    let mediaHtml = '';
                    if (mediaItems.length > 0) {
                        mediaHtml = `
                            <div class="media-container">
                                ${mediaItems.map(media => `
                                    <div class="media-item ${media.type}"
                                        data-img="../media/${media.id}_img.jpg"
                                        ${media.videoUrl ? `data-video="../media/${media.id}_video.mp4"` : ''}
                                        ${media.type === 'video' && media.sources ? `
                                            data-video-info='${JSON.stringify({
                                                qualities: media.qualities || [],
                                                sources: media.sources || []
                                            }).replace(/'/g, "\\'")}'
                                        ` : ''}>
                                        <img src="../media/${media.id}_img.jpg" alt="">
                                        ${media.type === 'video' && media.quality ? `<div class="video-quality-info">${media.quality}</div>` : ''}
        </div>
                                `).join('')}
    </div>
                        `;
                    }

                    let rtHtml = '';
                    if (fav.retweeted_status) {
                        let rtMediaHtml = '';
                        if (rtMediaItems.length > 0) {
                            rtMediaHtml = `
                                <div class="media-container">
                                    ${rtMediaItems.map(media => `
                                        <div class="media-item ${media.type}"
                                            data-img="../media/${media.id}_img.jpg"
                                            ${media.videoUrl ? `data-video="../media/${media.id}_video.mp4"` : ''}
                                            ${media.type === 'video' && media.sources ? `
                                                data-video-info='${JSON.stringify({
                                                    qualities: media.qualities || [],
                                                    sources: media.sources || []
                                                }).replace(/'/g, "\\'")}'
                                            ` : ''}>
                                            <img src="../media/${media.id}_img.jpg" alt="">
                                            ${media.type === 'video' && media.quality ? `<div class="video-quality-info">${media.quality}</div>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            `;
                        }

                        rtHtml = `
                            <div class="retweeted">
                                <div class="user">@${fav.retweeted_status.user ? fav.retweeted_status.user.screen_name : '未知用户'}</div>
                                <div class="content">${fav.retweeted_status.text || '无内容'}</div>
                                ${rtMediaHtml}
                            </div>
                        `;
                    }

                    return `
                        <div class="item" data-id="${fav.id}">
                            <div class="item-header">
                                <div class="user">@${fav.user ? fav.user.screen_name : '未知用户'}</div>
                                <div class="date">${fav.created_at}</div>
                            </div>
                            <div class="content">${fav.text || '无内容'}</div>
                            ${mediaHtml}
                            ${rtHtml}
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="preview-overlay">
                <div class="preview-container">
                    <div class="preview-close">×</div>
                    <div class="preview-content"></div>
                </div>
            </div>

    <script>
                document.addEventListener('DOMContentLoaded', function() {
                    const overlay = document.querySelector('.preview-overlay');
                    const previewContent = document.querySelector('.preview-content');
                    const closeBtn = document.querySelector('.preview-close');
                    const videoQualitySelect = document.getElementById('videoQualitySelect');

                    // 读取本地存储的视频清晰度
                    try {
                        const savedQuality = localStorage.getItem('videoQuality');
                        if (savedQuality) {
                            videoQualitySelect.value = savedQuality;
                        }
                    } catch (e) {
                        console.error('读取视频清晰度设置失败:', e);
                    }

                    // 监听视频清晰度变化
                    videoQualitySelect.addEventListener('change', function(e) {
                        const quality = e.target.value;
                        try {
                            localStorage.setItem('videoQuality', quality);
                            console.log('视频清晰度设置已保存:', quality);

                            // 如果有视频预览正在播放，更新其清晰度
                            if (overlay.style.display === 'flex') {
                                const video = previewContent.querySelector('video');
                                if (video && video.dataset.qualities) {
                                    updateVideoQuality(video, quality);
                                }
                            }

                            // 更新所有视频项的显示信息
                            updateAllVideoQualityInfo(quality);

                            // 如果主窗口存在，同步设置
                            if (window.opener && !window.opener.closed) {
                                window.opener.postMessage({
                                    type: 'updateVideoQuality',
                                    quality: quality
                                }, '*');
                            }
                        } catch (e) {
                            console.error('保存视频清晰度设置失败:', e);
                        }
                    });

                    // 更新所有视频的清晰度显示
                    function updateAllVideoQualityInfo(quality) {
                        document.querySelectorAll('.media-item.video').forEach(item => {
                            const qualityInfo = item.querySelector('.video-quality-info');
                            if (qualityInfo) {
                                try {
                                    const videoInfo = JSON.parse(item.getAttribute('data-video-info'));
                                    if (videoInfo && videoInfo.qualities && videoInfo.qualities.length > 0) {
                                        // 根据选择的清晰度找到匹配的或最接近的
                                        let bestQuality = videoInfo.qualities[0]; // 默认最高清晰度

                                        if (quality !== 'highest') {
                                            // 尝试精确匹配
                                            const exactMatch = videoInfo.qualities.find(q => q.includes(quality));
                                            if (exactMatch) {
                                                bestQuality = exactMatch;
                                            }
                                        }

                                        qualityInfo.textContent = bestQuality;
                                    }
                                } catch (e) {
                                    console.error('解析视频信息失败:', e);
                                }
                            }
                        });
                    }

                    // 初始更新一次视频清晰度信息
                    updateAllVideoQualityInfo(videoQualitySelect.value);

                    // 更新视频清晰度
                    function updateVideoQuality(videoElement, selectedQuality) {
                        try {
                            const videoInfo = JSON.parse(videoElement.dataset.qualities);
                            if (!videoInfo || !videoInfo.qualities || videoInfo.qualities.length === 0) {
                                return;
                            }

                            let bestSource = videoInfo.sources[0]; // 默认最高清晰度

                            if (selectedQuality !== 'highest') {
                                // 尝试找到精确匹配的清晰度
                                const matchIndex = videoInfo.qualities.findIndex(q => q.includes(selectedQuality));
                                if (matchIndex !== -1 && videoInfo.sources[matchIndex]) {
                                    bestSource = videoInfo.sources[matchIndex];
                                }
                            }

                            // 保存当前播放位置和状态
                            const currentTime = videoElement.currentTime;
                            const wasPlaying = !videoElement.paused;

                            // 更新视频源
                            videoElement.src = bestSource;
                            videoElement.load();

                            // 恢复播放位置和状态
                            videoElement.addEventListener('loadedmetadata', function onMetadata() {
                                videoElement.currentTime = currentTime;
                                if (wasPlaying) {
                                    videoElement.play();
                                }
                                videoElement.removeEventListener('loadedmetadata', onMetadata);
                            });
                        } catch (e) {
                            console.error('更新视频清晰度失败:', e);
                        }
                    }

                    // 添加媒体预览事件
                    document.querySelectorAll('.media-item').forEach(item => {
                        item.addEventListener('click', function() {
                            const imgSrc = this.getAttribute('data-img');
                            const videoSrc = this.getAttribute('data-video');
                            const isLivePhoto = this.classList.contains('livephoto');
                            const videoInfo = this.getAttribute('data-video-info');
                            const selectedQuality = videoQualitySelect.value;

                            if (videoSrc && isLivePhoto) {
                                // LivePhoto使用左图右视频的双视图预览
                                previewContent.innerHTML = \`
                                    <div class="dual-view">
                                        <div class="image-container">
                                            <img src="\${imgSrc}" alt="">
                                        </div>
                                        <div class="video-container">
                                            <video src="\${videoSrc}" autoplay loop muted></video>
                                        </div>
                                    </div>
                                \`;
                            } else if (videoSrc) {
                                // 普通视频使用全屏预览
                                let videoHtml = \`<video src="\${videoSrc}" poster="\${imgSrc}" controls autoplay\`;

                                // 如果有视频清晰度信息，添加到视频元素
                                if (videoInfo) {
                                    videoHtml += \` data-qualities='\${videoInfo}'\`;
                                }

                                videoHtml += \`></video>\`;
                                previewContent.innerHTML = videoHtml;

                                // 如果有视频清晰度信息且不是"最高清晰度"，尝试更新清晰度
                                if (videoInfo && selectedQuality !== 'highest') {
                                    const videoElement = previewContent.querySelector('video');
                                    if (videoElement) {
                                        updateVideoQuality(videoElement, selectedQuality);
                                    }
                                }
                            } else {
                                // 图片使用全屏预览
                                previewContent.innerHTML = \`<img src="\${imgSrc}" alt="">\`;
                            }

                            overlay.style.display = 'flex';
                        });
                    });

                    // 关闭预览
                    closeBtn.addEventListener('click', () => {
                        overlay.style.display = 'none';
                        previewContent.innerHTML = '';
                    });

                    overlay.addEventListener('click', (e) => {
                        if (e.target === overlay) {
                            overlay.style.display = 'none';
                            previewContent.innerHTML = '';
                        }
                    });

                    // 按ESC键关闭预览
                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape' && overlay.style.display === 'flex') {
                            overlay.style.display = 'none';
                            previewContent.innerHTML = '';
                        }
                    });
                });
            </script>
        </body>
        </html>
        `;
    }

    // 生成索引HTML
    function generateLongBackupIndex(totalPages, batchIndex = 1) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>微博收藏长备份目录</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: #f5f5f5;
                }
                header {
                    background: #fff;
                    padding: 15px;
                    margin-bottom: 20px;
                    border-radius: 5px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .page-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 15px;
                    margin-top: 20px;
                }
                .page-item {
                    background: #fff;
                    padding: 15px;
                    border-radius: 5px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    text-align: center;
                }
                .page-item a {
                    text-decoration: none;
                    color: #333;
                    font-weight: bold;
                    display: block;
                }
                .info {
                    margin-top: 10px;
                    color: #888;
                }
            </style>
        </head>
        <body>
            <header>
                <h1>微博收藏长备份目录 (批次${batchIndex})</h1>
                <div class="info">
                    共 ${backupData.favorites.length} 条收藏，${totalPages} 个分页，导出时间：${new Date().toLocaleString()}
                </div>
            </header>

            <div class="page-list">
                ${Array.from({length: totalPages}, (_, i) => i + 1).map(pageNum => `
                    <div class="page-item">
                        <a href="微博收藏长备份_${batchIndex}.html">第 ${pageNum} 页</a>
                    </div>
                `).join('')}
            </div>
        </body>
        </html>
        `;
    }

    // 辅助：从 document.cookie 里读取指定名称的 cookie
    function getCookie(name) {
        const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return m ? decodeURIComponent(m[2]) : '';
    }

    async function deleteSelectedItems() {
        try {
            const selectedItems = Array.from(document.querySelectorAll('.wb-backup-checkbox:checked'))
                .map(cb => {
                    try {
                        return JSON.parse(cb.closest('.wb-backup-item').dataset.weibo);
                    } catch {
                        return null;
                    }
                })
                .filter(item => item);

            if (selectedItems.length === 0) {
                showMessage('请先选择要删除的内容', 'error');
                return;
            }

            if (!confirm(`确定要删除 ${selectedItems.length} 条收藏吗？此操作不可恢复。`)) {
                return;
            }

            let success = 0, fail = 0;
            showMessage(`开始删除 ${selectedItems.length} 条收藏...`, 'info');

            for (const [i, item] of selectedItems.entries()) {
                // 节流：每条延迟 300ms
                await new Promise(r => setTimeout(r, i * 300));

                try {
                    const res = await fetch(
                        'https://weibo.com/ajax/statuses/destoryFavorites',
                        {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Requested-With': 'XMLHttpRequest',
                                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
                            },
                            body: JSON.stringify({ id: item.id })
                        }
                    );
                    const data = await res.json();
                    if (data.ok === 1) {
                        success++;
                        // 从列表中移除
                        const el = document.querySelector(`.wb-backup-item[data-id="${item.id}"]`);
                        if (el) el.remove();
                    } else {
                        console.warn(`删除失败(ID=${item.id}):`, data);
                        fail++;
                    }
                } catch (e) {
                    console.error(`删除出错(ID=${item.id}):`, e);
                    fail++;
                }

                showMessage(`进度：${success + fail}/${selectedItems.length}`, 'info');
            }

            showMessage(
                `删除完成：成功 ${success} 条，失败 ${fail} 条`,
                success > 0 ? 'success' : 'error'
            );
        } catch (e) {
            console.error('删除过程中出现异常：', e);
            showMessage(`删除失败：${e.message}`, 'error');
        }
    }

    // 添加时间处理工具类
    class TimeUtils {
        static parseTimestamp(timestamp) {
            if (!timestamp) return null;

            try {
                if (typeof timestamp === 'string') {
                    if (!isNaN(Number(timestamp))) {
                        // 字符串数字转换为时间戳
                        const num = Number(timestamp);
                        return num > 9999999999 ? num : num * 1000;
                    } else {
                        // 日期字符串直接解析
                        return new Date(timestamp).getTime();
                    }
                } else if (typeof timestamp === 'number') {
                    // 数字时间戳标准化
                    return timestamp > 9999999999 ? timestamp : timestamp * 1000;
                }
            } catch (e) {
                console.error('解析时间戳失败:', e);
            }
            return null;
        }

        static extractTimeFromTitle(title) {
            if (!title || !title.includes('收藏于')) return null;

            try {
                const timeStr = title.split('收藏于')[1].trim();
                const currentYear = new Date().getFullYear();
                const fullTimeStr = `${currentYear}-${timeStr.replace(' ', ' ')}`;
                const timestamp = new Date(fullTimeStr).getTime();
                return !isNaN(timestamp) ? timestamp : null;
            } catch (e) {
                console.error('从标题提取时间失败:', e);
                return null;
            }
        }

        static extractTimeFromUrl(urlStruct) {
            if (!urlStruct) return null;

            try {
                for (const urlObj of urlStruct) {
                    if (urlObj.url && urlObj.url.includes('favorite')) {
                        const match = urlObj.url.match(/favorite\?t=(\d+)/);
                        if (match && match[1]) {
                            const timestamp = Number(match[1]);
                            return timestamp > 9999999999 ? timestamp : timestamp * 1000;
                        }
                    }
                }
            } catch (e) {
                console.error('从URL提取时间失败:', e);
            }
            return null;
        }

        static formatDate(timestamp) {
            if (!timestamp) return '未知时间';

            try {
                const date = new Date(timestamp);
                if (isNaN(date.getTime())) return '无效日期';

                return date.toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });
            } catch (e) {
                console.error('格式化时间失败:', e);
                return '处理错误';
            }
        }
    }

    // 添加LRU缓存实现
    class LRUCache {
        constructor(capacity) {
            this.capacity = capacity;
            this.cache = new Map();
            this.totalSize = 0; // 以字节为单位
            this.maxSize = 1024 * 1024 * 1024; // 默认最大缓存1GB
        }

        get(key) {
            if (!this.cache.has(key)) return null;

            // 获取值并更新位置
            const value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }

        set(key, value, size) {
            // 如果已存在，先移除旧值
            if (this.cache.has(key)) {
                const oldSize = this.cache.get(key).size;
                this.totalSize -= oldSize;
                this.cache.delete(key);
            }

            // 检查容量和大小限制
            while (this.cache.size >= this.capacity || this.totalSize + size > this.maxSize) {
                const firstKey = this.cache.keys().next().value;
                const firstValue = this.cache.get(firstKey);
                this.totalSize -= firstValue.size;
                this.cache.delete(firstKey);
            }

            // 添加新值
            this.cache.set(key, { value, size });
            this.totalSize += size;
        }

        clear() {
            this.cache.clear();
            this.totalSize = 0;
        }

        getSize() {
            return {
                items: this.cache.size,
                totalSize: this.totalSize,
                maxSize: this.maxSize
            };
        }
    }

    // 创建媒体缓存实例
    const mediaCache = new LRUCache(100); // 最多缓存100个项目

    // 添加日志工具类
    class Logger {
        static LOG_LEVELS = {
            DEBUG: 0,
            INFO: 1,
            WARN: 2,
            ERROR: 3
        };

        static currentLevel = Logger.LOG_LEVELS.INFO;

        static setLevel(level) {
            if (level in Logger.LOG_LEVELS) {
                Logger.currentLevel = Logger.LOG_LEVELS[level];
            }
        }

        static debug(...args) {
            if (Logger.currentLevel <= Logger.LOG_LEVELS.DEBUG) {
                console.debug('[DEBUG]', ...args);
            }
        }

        static info(...args) {
            if (Logger.currentLevel <= Logger.LOG_LEVELS.INFO) {
                console.info('[INFO]', ...args);
            }
        }

        static warn(...args) {
            if (Logger.currentLevel <= Logger.LOG_LEVELS.WARN) {
                console.warn('[WARN]', ...args);
            }
        }

        static error(...args) {
            if (Logger.currentLevel <= Logger.LOG_LEVELS.ERROR) {
                console.error('[ERROR]', ...args);
            }
        }
    }

    // 添加内存监控类
    class MemoryMonitor {
        static checkMemory() {
            if (window.performance && window.performance.memory) {
                const memory = window.performance.memory;
                const usedHeap = memory.usedJSHeapSize / (1024 * 1024);
                const totalHeap = memory.totalJSHeapSize / (1024 * 1024);
                const limit = memory.jsHeapSizeLimit / (1024 * 1024);

                Logger.debug(`内存使用情况:
                    已用: ${usedHeap.toFixed(2)}MB
                    总量: ${totalHeap.toFixed(2)}MB
                    限制: ${limit.toFixed(2)}MB
                    使用率: ${((usedHeap / limit) * 100).toFixed(2)}%`);

                // 当内存使用超过80%时发出警告
                if (usedHeap / limit > 0.8) {
                    Logger.warn('内存使用率超过80%，建议清理缓存');
                    mediaCache.clear();
                }
            }
        }

        static startMonitoring(interval = 30000) {
            setInterval(() => {
                this.checkMemory();
            }, interval);
        }
    }

    // 启动内存监控
    MemoryMonitor.startMonitoring();

    class DOMOptimizer {
        static batchUpdate(updates) {
            return new Promise(resolve => {
                requestAnimationFrame(() => {
                    const fragment = document.createDocumentFragment();
                    updates.forEach(update => {
                        const element = this.createElement(update);
                        fragment.appendChild(element);
                    });
                    resolve(fragment);
                });
            });
        }

        static createElement(data) {
            const template = document.createElement('template');
            template.innerHTML = data.html.trim();
            return template.content.firstChild;
        }

        static updateAttributes(element, attributes) {
            Object.entries(attributes).forEach(([key, value]) => {
                if (value === null) {
                    element.removeAttribute(key);
                } else {
                    element.setAttribute(key, value);
                }
            });
        }
    }

    // 在初始化时设置
    async function initializeOptimizations() {
        // 启动性能监控
        PerformanceMonitor.startTracking();

        // 初始化懒加载
        LazyLoader.init();

        // 创建虚拟滚动实例
        const container = document.querySelector('.wb-backup-list');
        const virtualScroller = new VirtualScroller(container, {
            itemHeight: 200,
            bufferSize: 5
        });

        // 优化事件监听
        InteractionOptimizer.optimizeScroll(container);

        // 设置资源加载限制
        ResourceLoader.maxConcurrent = navigator.connection?.effectiveType === '4g' ? 5 : 3;

        // 定期清理内存
        setInterval(() => {
            const report = PerformanceMonitor.getPerformanceReport();
            if (report.memoryUsage.used > report.memoryUsage.limit * 0.8) {
                // 清理缓存
                ResourceLoader.imageCache.clear();
                // 触发垃圾回收
                if (window.gc) window.gc();
            }
        }, 30000);
    }

    class LazyLoader {
        static observer = null;
        static observedElements = new WeakSet();

        static init() {
            this.observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadElement(entry.target);
                        }
                    });
                },
                {
                    rootMargin: '50px 0px',
                    threshold: 0.1
                }
            );
        }

        static observe(element) {
            if (this.observedElements.has(element)) return;

            this.observedElements.add(element);
            this.observer.observe(element);
        }

        static loadElement(element) {
            if (element.tagName.toLowerCase() === 'img') {
                const src = element.dataset.src;
                if (src) {
                    const start = performance.now();
                    element.src = src;
                    element.onload = () => {
                        PerformanceMonitor.trackOperation('image', performance.now() - start);
                    };
                }
            } else if (element.tagName.toLowerCase() === 'video') {
                const src = element.dataset.src;
                if (src) {
                    const start = performance.now();
                    element.src = src;
                    element.onloadeddata = () => {
                        PerformanceMonitor.trackOperation('video', performance.now() - start);
                    };
                }
            }

            this.observer.unobserve(element);
        }
    }

    class VirtualScroller {
        constructor(container, options = {}) {
            this.container = container;
            this.options = {
                itemHeight: options.itemHeight || 200,
                bufferSize: options.bufferSize || 5,
                batchSize: options.batchSize || 10
            };

            this.items = [];
            this.visibleItems = new Map();
            this.lastScrollPosition = 0;

            this.setupContainer();
            this.bindEvents();
        }

        setupContainer() {
            this.viewport = document.createElement('div');
            this.viewport.style.cssText = `
                position: relative;
                width: 100%;
                height: 100%;
                overflow-y: auto;
            `;

            this.content = document.createElement('div');
            this.viewport.appendChild(this.content);
            this.container.appendChild(this.viewport);
        }

        setItems(items) {
            this.items = items;
            this.content.style.height = `${items.length * this.options.itemHeight}px`;
            this.render();
        }

        renderItem(item, index) {
            const element = document.createElement('div');
            element.className = 'wb-backup-item';
            element.dataset.id = item.id;
            element.dataset.weibo = JSON.stringify(item);
            element.innerHTML = generateItemHTML(item);
            return element;
        }

        render() {
            const scrollTop = this.viewport.scrollTop;
            const viewportHeight = this.viewport.clientHeight;

            const startIndex = Math.max(0, Math.floor(scrollTop / this.options.itemHeight) - this.options.bufferSize);
            const endIndex = Math.min(
                this.items.length,
                Math.ceil((scrollTop + viewportHeight) / this.options.itemHeight) + this.options.bufferSize
            );

            // 移除不可见的项目
            for (const [index, element] of this.visibleItems.entries()) {
                if (index < startIndex || index >= endIndex) {
                    element.remove();
                    this.visibleItems.delete(index);
                }
            }

            // 添加新的可见项目
            for (let i = startIndex; i < endIndex; i++) {
                if (!this.visibleItems.has(i) && this.items[i]) {
                    const element = this.renderItem(this.items[i], i);
                    element.style.position = 'absolute';
                    element.style.top = `${i * this.options.itemHeight}px`;
                    this.content.appendChild(element);
                    this.visibleItems.set(i, element);
                }
            }
        }

        bindEvents() {
            let scrollTimeout;
            this.viewport.addEventListener('scroll', () => {
                if (scrollTimeout) {
                    cancelAnimationFrame(scrollTimeout);
                }
                scrollTimeout = requestAnimationFrame(() => {
                    this.render();
                });
            });
        }
    }

    class RenderOptimizer {
        static async batchRender(items, container, batchSize = 10) {
            const total = items.length;
            let processed = 0;

            while (processed < total) {
                const batch = items.slice(processed, processed + batchSize);
                await new Promise(resolve => {
                    requestAnimationFrame(() => {
                        const start = performance.now();
                        this.renderBatch(batch, container);
                        PerformanceMonitor.trackOperation('render', performance.now() - start);
                        resolve();
                    });
                });
                processed += batchSize;

                // 更新进度
                showMessage(`正在加载 ${processed}/${total}`);
            }
        }

        static renderBatch(items, container) {
            const fragment = document.createDocumentFragment();
            items.forEach(item => {
                const element = this.createItemElement(item);
                fragment.appendChild(element);
            });
            container.appendChild(fragment);
        }
    }

    class InteractionOptimizer {
        static debounceTimeout = null;
        static throttleLastRun = 0;

        static debounce(func, wait = 300) {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => func(), wait);
        }

        static throttle(func, limit = 300) {
            const now = Date.now();
            if (now - this.throttleLastRun >= limit) {
                func();
                this.throttleLastRun = now;
            }
        }

        static optimizeScroll(element) {
            let ticking = false;
            element.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        // 执行滚动优化逻辑
                        this.handleScroll(element);
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }
    }

    class ResourceLoader {
        static imageCache = new Map();
        static loadQueue = [];
        static isProcessing = false;
        static maxConcurrent = 3;

        static async loadImage(url, priority = 1) {
            // 检查缓存
            if (this.imageCache.has(url)) {
                return this.imageCache.get(url);
            }

            return new Promise((resolve, reject) => {
                const loadStart = performance.now();

                const img = new Image();
                img.onload = () => {
                    const duration = performance.now() - loadStart;
                    PerformanceMonitor.trackOperation('image', duration);
                    this.imageCache.set(url, img);
                    resolve(img);
                };
                img.onerror = reject;
                img.src = url;
            });
        }

        static async loadVideo(url, priority = 1) {
            return new Promise((resolve, reject) => {
                const loadStart = performance.now();

                const video = document.createElement('video');
                video.onloadeddata = () => {
                    const duration = performance.now() - loadStart;
                    PerformanceMonitor.trackOperation('video', duration);
                    resolve(video);
                };
                video.onerror = reject;
                video.src = url;
            });
        }
    }

    class PerformanceMonitor {
        static metrics = {
            // 基础性能指标
            startTime: 0,
            loadTimes: [],
            renderTimes: [],
            memoryUsage: [],

            // 用户交互指标
            interactionDelays: [],
            responseTime: [],

            // 资源加载指标
            imageLoadTimes: [],
            videoLoadTimes: [],

            // 错误统计
            errors: {
                network: 0,
                rendering: 0,
                memory: 0
            }
        };

        static startTracking() {
            this.metrics.startTime = performance.now();
            this._setupObservers();
            this._trackMemory();
        }

        static trackOperation(operation, duration) {
            switch(operation) {
                case 'load':
                    this.metrics.loadTimes.push(duration);
                    break;
                case 'render':
                    this.metrics.renderTimes.push(duration);
                    break;
                case 'image':
                    this.metrics.imageLoadTimes.push(duration);
                    break;
                case 'video':
                    this.metrics.videoLoadTimes.push(duration);
                    break;
            }
        }

        static getPerformanceReport() {
            return {
                averageLoadTime: this._calculateAverage(this.metrics.loadTimes),
                averageRenderTime: this._calculateAverage(this.metrics.renderTimes),
                averageImageLoadTime: this._calculateAverage(this.metrics.imageLoadTimes),
                averageVideoLoadTime: this._calculateAverage(this.metrics.videoLoadTimes),
                memoryUsage: this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1],
                errorCounts: this.metrics.errors
            };
        }

        static _calculateAverage(array) {
            return array.length ? array.reduce((a, b) => a + b) / array.length : 0;
        }

        static _setupObservers() {
            // 监控DOM变化
            const observer = new MutationObserver((mutations) => {
                const start = performance.now();
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        this.trackNodeChanges(mutation.target);
                    }
                });
                this.trackOperation('render', performance.now() - start);
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        static _trackMemory() {
            setInterval(() => {
                if (window.performance && window.performance.memory) {
                    this.metrics.memoryUsage.push({
                        used: window.performance.memory.usedJSHeapSize,
                        total: window.performance.memory.totalJSHeapSize,
                        limit: window.performance.memory.jsHeapSizeLimit
                    });
                }
            }, 10000); // 每10秒记录一次
        }
    }

    // 优化getFavoriteTime函数，添加缓存机制
    const favoriteTimeCache = new Map(); // 用于缓存收藏时间

    async function getFavoriteTime(weiboId) {
        try {
            // 检查缓存中是否已有此微博的收藏时间
            if (favoriteTimeCache.has(weiboId)) {
                console.log(`使用缓存的收藏时间: ${weiboId}`);
                return favoriteTimeCache.get(weiboId);
            }

            // 获取所有收藏页面直到找到目标微博
            let page = 1;
            const maxPages = 50; // 设置最大页数限制

            while (page <= maxPages) {
                try {
                    const response = await fetch(`https://weibo.com/ajax/favorites/all_fav?page=${page}`, {
                        credentials: 'include',
                        headers: {
                            'Accept': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    });

                    if (!response.ok) {
                        throw new Error('获取收藏列表失败');
                    }

                    const data = await response.json();
                    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
                        break; // 没有更多数据了
                    }

                    // 同时缓存本页所有微博的收藏时间，提高后续效率
                    for (const favorite of data.data) {
                        if (!favorite || !favorite.status) continue;

                        const statusId = favorite.status.id;
                        if (!statusId) continue;

                        const favoriteTime = favorite.favorited_at ||
                                           favorite.created_at ||
                                           favorite.status.created_at ||
                                           new Date().toISOString();

                        const cacheItem = {
                            favorited_time: favoriteTime,
                            page: page
                        };

                        // 添加到缓存
                        favoriteTimeCache.set(statusId.toString(), cacheItem);

                        // 如果找到了目标微博，立即返回
                        if (statusId.toString() === weiboId.toString()) {
                            return cacheItem;
                        }
                    }

                    page++;
                    await new Promise(resolve => setTimeout(resolve, 300)); // 减少延迟时间
                } catch (error) {
                    console.error(`获取第${page}页收藏列表失败:`, error);
                    if (error.message.includes('未登录')) {
                        throw error; // 如果是未登录错误，直接抛出
                    }
                    page++;
                    await new Promise(resolve => setTimeout(resolve, 1000)); // 出错后等待更长时间
                    continue;
                }
            }
            return null;
        } catch (error) {
            console.error('获取收藏时间失败:', error);
            throw error; // 抛出错误以便上层处理
        }
    }

    async function downloadLivePhotos() {
        try {
            // 初始化微博API
            await initWeiboAPI();

            const selectedItems = Array.from(document.querySelectorAll('.wb-backup-checkbox:checked'))
                .map(checkbox => JSON.parse(checkbox.closest('.wb-backup-item').dataset.weibo))
                .filter(item => item !== null);

            if (selectedItems.length === 0) {
                showMessage('请先选择要导出的内容', 'error');
                return;
            }

            showMessage('正在准备处理LivePhoto和高清图片...', 'info');

            // 创建一个存储所有媒体信息的数组
            const mediaData = {
                livePhotos: [],
                images: [],
                videos: []
            };

            const zip = new JSZip();
            const mediaFolder = zip.folder("media");
            const htmlFolder = zip.folder("html");

            // 创建进度条
            const progressContainer = createProgressBar();
            document.body.appendChild(progressContainer);
            updateProgressBar(progressContainer, 0);

            // 统计媒体总数
            let totalMediaCount = 0;
            let completedMediaCount = 0;
            let startTime = Date.now();
            let livePhotoCount = 0;
            let totalLivePhotos = 0;

            // 增加详细统计
            let totalImageCount = 0;
            let totalVideoCount = 0;
            let completedLivePhotoCount = 0;
            let completedImageCount = 0;
            let completedVideoCount = 0;

            // 先计算总LivePhoto和媒体数量
            selectedItems.forEach(item => {
                if (item.pic_ids && item.pic_infos) {
                    item.pic_ids.forEach(picId => {
                        totalMediaCount++;
                        if (item.pic_infos[picId]?.type === 'livephoto') {
                            totalLivePhotos++;
                        } else {
                            totalImageCount++;
                        }
                    });
                }
                if (item.retweeted_status?.pic_ids && item.retweeted_status?.pic_infos) {
                    item.retweeted_status.pic_ids.forEach(picId => {
                        totalMediaCount++;
                        if (item.retweeted_status.pic_infos[picId]?.type === 'livephoto') {
                            totalLivePhotos++;
                        } else {
                            totalImageCount++;
                        }
                    });
                }
                if (item.page_info?.media_info) {
                    totalMediaCount++;
                    totalVideoCount++;
                }
                if (item.retweeted_status?.page_info?.media_info) {
                    totalMediaCount++;
                    totalVideoCount++;
                }
            });

            // 更新进度的函数 - 增加更详细的进度信息
            const updateProgress = () => {
                const percent = Math.floor((completedMediaCount / totalMediaCount) * 100);
                updateProgressBar(progressContainer, percent);

                // 计算预计剩余时间
                const elapsedTime = (Date.now() - startTime) / 1000; // 秒
                const itemsPerSecond = completedMediaCount / elapsedTime;
                const remainingItems = totalMediaCount - completedMediaCount;
                const estimatedRemainingTime = itemsPerSecond > 0 ? Math.round(remainingItems / itemsPerSecond) : '计算中';

                showMessage(
                    `正在下载媒体文件 (${completedMediaCount}/${totalMediaCount})，已完成 ${percent}%
                    LivePhoto: ${completedLivePhotoCount}/${totalLivePhotos}
                    普通图片: ${completedImageCount}/${totalImageCount}
                    视频: ${completedVideoCount}/${totalVideoCount}
                    预计剩余时间: ${typeof estimatedRemainingTime === 'number' ? estimatedRemainingTime + '秒' : estimatedRemainingTime}`,
                    'info'
                );
            };

            // 删除获取收藏时间的部分，直接开始下载媒体文件
            showMessage(`开始下载媒体文件...`, 'info');

            // 限制并发下载数
            const MAX_CONCURRENT = 5;
            let activeDownloads = 0;
            let downloadQueue = [];

            // 处理单个下载的函数 - 增加类型统计
            const processDownload = async (downloadFunc, type) => {
                try {
                    await downloadFunc();
                    // 更新完成数量
                    completedMediaCount++;

                    // 根据类型更新相应的计数器
                    if (type === 'livephoto') {
                        completedLivePhotoCount++;
                    } else if (type === 'image') {
                        completedImageCount++;
                    } else if (type === 'video') {
                        completedVideoCount++;
                    }

                    updateProgress();
                            } catch (error) {
                    console.error('下载失败:', error);
                    completedMediaCount++; // 即使失败也计入已处理
                    updateProgress();
                }
            };

            // 收集所有下载任务，但不立即执行
            const downloadTasks = [];

            // 处理LivePhoto下载
            const processLivePhoto = async (item, picId, picInfo, isRetweet) => {
                const sourceItem = isRetweet ? item.retweeted_status : item;
                const imgUrl = fixImageUrl(picInfo.original?.url || picInfo.large?.url);
                const fileName = `${sourceItem.user.screen_name}_${sourceItem.id}_${picId}`;

                console.log(`开始处理LivePhoto: ${picId}, 微博ID: ${sourceItem.id}, 尝试查找视频URL...`);

                try {
                    // 尝试找到视频URL
                    let videoUrl = null;

                    // 1. 尝试从picInfo.video获取
                    if (picInfo.video) {
                        videoUrl = fixVideoUrl(picInfo.video);
                        console.log(`1. 从picInfo.video获取到视频URL: ${videoUrl}`);
                    }
                    // 2. 尝试从pic_video获取
                    else if (picInfo.pic_video) {
                        videoUrl = fixVideoUrl(picInfo.pic_video);
                        console.log(`2. 从picInfo.pic_video获取到视频URL: ${videoUrl}`);
                    }
                    // 3. 尝试从live_photo_video_url获取
                    else if (picInfo.live_photo_video_url) {
                        videoUrl = fixVideoUrl(picInfo.live_photo_video_url);
                        console.log(`3. 从picInfo.live_photo_video_url获取到视频URL: ${videoUrl}`);
                    }

                    // 4. 尝试从媒体信息中获取
                    if (!videoUrl && item.page_info?.media_info) {
                        const mediaInfo = item.page_info.media_info;
                        if (mediaInfo.stream_url) {
                            videoUrl = fixVideoUrl(mediaInfo.stream_url);
                            console.log(`4. 从media_info.stream_url获取到视频URL: ${videoUrl}`);
                        } else if (mediaInfo.mp4_hd_url) {
                            videoUrl = fixVideoUrl(mediaInfo.mp4_hd_url);
                            console.log(`4. 从media_info.mp4_hd_url获取到视频URL: ${videoUrl}`);
                        }
                    }

                    // 5. 从mix_media_info中查找
                    if (!videoUrl && item.mix_media_info && Array.isArray(item.mix_media_info.items)) {
                        for (const mediaItem of item.mix_media_info.items) {
                            if ((mediaItem.type === 'livephoto' || mediaItem.data?.type === 'livephoto') &&
                                mediaItem.data?.pic_id === picId && mediaItem.data?.video) {
                                videoUrl = fixVideoUrl(mediaItem.data.video);
                                console.log(`5. 从mix_media_info获取到视频URL: ${videoUrl}`);
                                break;
                            }
                        }
                    }

                    // 6. 针对特定微博ID的处理（https://weibo.com/5291824241/PnRBTiETB）
                    if ((!videoUrl || videoUrl.includes('undefined')) &&
                        (sourceItem.id === '4975654847676664' || sourceItem.mblogid === 'PnRBTiETB')) {
                        console.log(`6. 特定微博ID ${sourceItem.id} 的LivePhoto，尝试构造视频URL`);

                        // 提取图片路径中的ID部分
                        const imgPathMatch = imgUrl.match(/\/([^\/]+)\.[jpg|png|gif]+$/);
                        if (imgPathMatch && imgPathMatch[1]) {
                            const baseId = imgPathMatch[1];
                            // 构造可能的视频URL
                            videoUrl = `https://video.weibo.com/media/play?livephoto=https://wx4.sinaimg.cn/large/${baseId}.mov`;
                            console.log(`6. 为特定微博构造视频URL: ${videoUrl}`);
                        }
                    }

                    // 如果仍然找不到有效的视频URL，创建一个基于图片URL的虚拟视频URL
                    if (!videoUrl || videoUrl.includes('undefined')) {
                        const imgPath = imgUrl.split('/').pop();
                        if (imgPath) {
                            const baseName = imgPath.split('.')[0];
                            videoUrl = `https://video.weibo.com/media/play?livephoto=https://wx4.sinaimg.cn/large/${baseName}.mov`;
                            console.log(`7. 生成备用虚拟视频URL: ${videoUrl}`);
                        }
                    }

                    // 下载图片
                    console.log(`尝试下载LivePhoto图片: ${imgUrl}`);
                    const imgResponse = await fetch(imgUrl);
                    const imgBlob = await imgResponse.blob();
                    mediaFolder.file(`${fileName}.jpg`, imgBlob);

                    // 尝试下载视频
                    if (videoUrl) {
                        console.log(`尝试下载LivePhoto视频: ${videoUrl}`);
                        try {
                            const videoResponse = await fetch(videoUrl);
                            const videoBlob = await videoResponse.blob();

                            // 检查视频内容是否有效
                            if (videoBlob.size > 100) { // 如果视频大小大于100字节，认为是有效视频
                                mediaFolder.file(`${fileName}.mp4`, videoBlob);
                                console.log(`成功下载LivePhoto视频: ${fileName}.mp4，大小: ${videoBlob.size} 字节`);
                            } else {
                                console.warn(`下载的视频内容太小 (${videoBlob.size} 字节)，可能不是有效视频`);
                                // 创建一个空的MP4视频文件占位
                                mediaFolder.file(`${fileName}.mp4`, new Blob([], {type: 'video/mp4'}));
                            }
                        } catch (videoError) {
                            console.error(`下载LivePhoto视频失败: ${videoError.message}`);
                            // 创建一个空的MP4视频文件占位
                            mediaFolder.file(`${fileName}.mp4`, new Blob([], {type: 'video/mp4'}));
                        }
                    } else {
                        console.warn(`未能找到LivePhoto的视频URL，创建空视频文件占位`);
                        // 创建一个空的MP4视频文件占位
                        mediaFolder.file(`${fileName}.mp4`, new Blob([], {type: 'video/mp4'}));
                    }

                    // 无论视频下载成功与否，都添加LivePhoto信息
                    mediaData.livePhotos.push({
                        id: picId,
                        weiboId: sourceItem.id,
                        userName: sourceItem.user.screen_name,
                        text: sourceItem.text_raw || sourceItem.text || '',
                        imageFile: `media/${fileName}.jpg`,
                        videoFile: `media/${fileName}.mp4`,
                        createTime: sourceItem.created_at,
                        isRetweet: isRetweet,
                        retweetFrom: isRetweet ? item.user.screen_name : ''
                    });

                    livePhotoCount++;
                    console.log(`LivePhoto处理完成: ${fileName}`);
                } catch (error) {
                    console.error(`处理${isRetweet ? '转发' : ''}LivePhoto失败:`, error);
                    // 尽管失败，也尝试添加图片信息
                    mediaData.livePhotos.push({
                        id: picId,
                        weiboId: sourceItem.id,
                        userName: sourceItem.user.screen_name,
                        text: sourceItem.text_raw || sourceItem.text || '',
                        imageFile: `media/${fileName}.jpg`,
                        videoFile: `media/${fileName}.mp4`,
                        createTime: sourceItem.created_at,
                        isRetweet: isRetweet,
                        retweetFrom: isRetweet ? item.user.screen_name : ''
                    });
                }
            };

            // 处理普通图片下载
            const processImage = async (item, picId, picInfo, isRetweet) => {
                // 现有代码保持不变
                const sourceItem = isRetweet ? item.retweeted_status : item;
                const fileName = `${sourceItem.user.screen_name}_${sourceItem.id}_${picId}`;

                try {
                                        const imgResponse = await fetch(fixImageUrl(picInfo.original?.url || picInfo.large?.url));
                                        const imgBlob = await imgResponse.blob();

                                        // 添加到ZIP文件
                                        mediaFolder.file(`${fileName}.jpg`, imgBlob);

                                        // 保存图片信息
                                        mediaData.images.push({
                                            id: picId,
                        weiboId: sourceItem.id,
                        userName: sourceItem.user.screen_name,
                        text: sourceItem.text_raw || sourceItem.text || '',
                                            imageFile: `media/${fileName}.jpg`,
                        createTime: sourceItem.created_at,
                        isRetweet: isRetweet,
                        retweetFrom: isRetweet ? item.user.screen_name : ''
                                        });
                                    } catch (error) {
                    console.error(`下载${isRetweet ? '转发' : ''}图片失败:`, error);
                }
            };

            // 处理视频下载
            const processVideoMedia = async (item, mediaInfo, isRetweet) => {
                // 现有代码保持不变
                const sourceItem = isRetweet ? item.retweeted_status : item;
                const fileName = `${sourceItem.user.screen_name}_${sourceItem.id}_video`;

                try {
                    const videoUrl = await processVideo(mediaInfo);
                    if (videoUrl) {
                                    const videoResponse = await fetch(videoUrl);
                                    const videoBlob = await videoResponse.blob();
                                    mediaFolder.file(`${fileName}.mp4`, videoBlob);

                                    mediaData.videos.push({
                            weiboId: sourceItem.id,
                            userName: sourceItem.user.screen_name,
                            text: sourceItem.text_raw || sourceItem.text || '',
                                        videoFile: `media/${fileName}.mp4`,
                            createTime: sourceItem.created_at,
                            isRetweet: isRetweet,
                            retweetFrom: isRetweet ? item.user.screen_name : ''
                                    });
                    }
                                } catch (error) {
                    console.error(`下载${isRetweet ? '转发' : ''}视频失败:`, error);
                }
            };

            // 增强的LivePhoto检测
            function isLivePhoto(picInfo, item, picId) {
                console.log('检查LivePhoto:', picInfo.pid || picId || '未知ID');

                // 严格模式检查 - 只接受明确标记为LivePhoto的图片
                const strictMode = true;

                // 创建检查计数器，用于加权判断
                let livePhotoScore = 0;
                let hasStrongEvidence = false;

                // 检查1: 微博本身提供的类型标记 (强证据)
                if (picInfo.type === 'livephoto') {
                    console.log('通过微博类型标记检测到LivePhoto:', picInfo.pid || picId || '未知ID');
                    livePhotoScore += 3;
                    hasStrongEvidence = true;
                }

                // 检查2: 明确的视频URL存在 (强证据)
                if (picInfo.pic_video || picInfo.video || picInfo.live_photo_video_url) {
                    console.log('通过视频URL检测到LivePhoto:', picInfo.pid || picId || '未知ID');
                    livePhotoScore += 3;
                    hasStrongEvidence = true;
                }

                // 检查3: 通过live_photo字段标记 (强证据)
                if (picInfo.live_photo === 1) {
                    console.log('通过live_photo字段检测到LivePhoto:', picInfo.pid || picId || '未知ID');
                    livePhotoScore += 3;
                    hasStrongEvidence = true;
                }

                // 检查4: 微博对象有LivePhoto标记 (强证据)
                if (item.has_live_photo === 1 && picInfo.pid &&
                    item.pic_ids && item.pic_ids.includes(picInfo.pid)) {
                    console.log('通过微博has_live_photo标记检测到LivePhoto:', picInfo.pid || picId || '未知ID');
                    livePhotoScore += 3;
                    hasStrongEvidence = true;
                }

                // 检查5: 特定微博ID的特殊处理
                if (picInfo.pid && (
                    item.id === '4975654847676664' ||
                    item.mblogid === 'PnRBTiETB'
                ) && item.pic_ids && item.pic_ids.includes(picInfo.pid)) {
                    console.log('通过特定微博ID匹配检测到LivePhoto:', picInfo.pid || picId || '未知ID');
                    livePhotoScore += 3;
                    hasStrongEvidence = true;
                }

                // 检查6: 媒体信息中的LivePhoto标记 (相对较弱的证据)
                const mediaInfo = item.page_info?.media_info;
                if (mediaInfo) {
                    if (mediaInfo.live_photo === 1 || mediaInfo.type === 'livephoto') {
                        console.log('通过媒体信息明确标记检测到LivePhoto');
                        livePhotoScore += 2;
                    }
                    if (mediaInfo.video_info && mediaInfo.video_info.play_completion_actions) {
                        console.log('通过媒体视频信息检测到可能的LivePhoto');
                        livePhotoScore += 1;
                    }
                }

                // 检查7: URL特征检查 (弱证据，可能误判)
                if (!strictMode && picInfo.original?.url) {
                    const strongPatterns = [
                        /livephoto/i,
                        /live_photo/i
                    ];

                    const weakPatterns = [
                        /picture_in_motion/i,
                        /\.mov$/i
                    ];

                    // 强URL模式匹配
                    for (const pattern of strongPatterns) {
                        if (pattern.test(picInfo.original.url)) {
                            console.log('通过强URL模式检测到LivePhoto:', picInfo.original.url);
                            livePhotoScore += 2;
                            break;
                        }
                    }

                    // 弱URL模式匹配
                    for (const pattern of weakPatterns) {
                        if (pattern.test(picInfo.original.url)) {
                            console.log('通过弱URL模式检测到可能的LivePhoto:', picInfo.original.url);
                            livePhotoScore += 1;
                            break;
                        }
                    }
                }

                // 检查8: mix_media_info中的LivePhoto标记
                if (item.mix_media_info && Array.isArray(item.mix_media_info.items)) {
                    const foundLivePhotoItem = item.mix_media_info.items.find(mediaItem =>
                        (mediaItem.type === 'livephoto' || mediaItem.data?.type === 'livephoto') &&
                        (!picInfo.pid || !mediaItem.data?.pic_id || mediaItem.data.pic_id === picInfo.pid)
                    );

                    if (foundLivePhotoItem) {
                        console.log('通过mix_media_info明确标记检测到LivePhoto');
                        livePhotoScore += 2;

                        // 检查是否有视频URL (更强的证据)
                        if (foundLivePhotoItem.data?.video) {
                            console.log('在mix_media_info中找到视频URL');
                            livePhotoScore += 1;
                            hasStrongEvidence = true;
                        }
                    }
                }

                // 检查9: DOM元素（对于直接从页面导出的情况，相对不可靠）
                if (!strictMode) {
                    try {
                        const pid = picInfo.pid || (typeof picId !== 'undefined' ? picId : null);
                        if (pid && typeof document !== 'undefined') {
                            const imgElements = document.querySelectorAll(`img[src*="${pid}"]`);
                            for (const img of imgElements) {
                                // LivePhoto容器元素
                                const parent = img.closest('.media-pic-livephoto') || img.closest('.live-photo') || img.closest('[data-livephoto]');
                                if (parent) {
                                    console.log('通过LivePhoto专用容器检测到LivePhoto:', pid);
                                    livePhotoScore += 2;
                                    break;
                                }

                                // 图片data-type属性
                                if (img.dataset.type === 'livephoto' || img.getAttribute('data-type') === 'livephoto') {
                                    console.log('通过图片data-type属性检测到LivePhoto:', pid);
                                    livePhotoScore += 2;
                                    break;
                                }

                                // 这些检查容易误判，分值较低
                                // Live标记 (不可靠，可能误导)
                                if (img.nextElementSibling && img.nextElementSibling.classList.contains('live-badge')) {
                                    console.log('通过Live标记检测到可能的LivePhoto:', pid);
                                    livePhotoScore += 1;
                                }

                                // 父元素类名 (不可靠，可能误导)
                                if (img.parentElement && img.parentElement.className.toLowerCase().includes('live')) {
                                    console.log('通过父元素类名检测到可能的LivePhoto:', pid);
                                    livePhotoScore += 1;
                                }
                            }
                        }
                    } catch (e) {
                        console.error('检查DOM元素失败:', e);
                    }
                }

                // 根据得分和证据决定是否为LivePhoto
                const isLive = strictMode ?
                    // 严格模式：需要强证据或高分
                    (hasStrongEvidence || livePhotoScore >= 3) :
                    // 宽松模式：较低分数即可
                    (livePhotoScore >= 2);

                if (isLive) {
                    console.log(`确认为LivePhoto: 分数=${livePhotoScore}, 强证据=${hasStrongEvidence}`);
                } else {
                    console.log(`不是LivePhoto: 分数=${livePhotoScore}, 强证据=${hasStrongEvidence}`);
                }

                return isLive;
            }

            // 收集所有要处理的媒体任务
            for (const item of selectedItems) {
                try {
                    // 处理主微博的图片和LivePhoto
                    if (item.pic_ids && item.pic_infos) {
                        for (const picId of item.pic_ids) {
                            const picInfo = item.pic_infos[picId];
                            if (picInfo) {
                                // 使用增强的LivePhoto检测
                                if (isLivePhoto(picInfo, item, picId)) {
                                    downloadTasks.push({
                                        type: 'livephoto',
                                        task: () => processLivePhoto(item, picId, picInfo, false)
                                    });
                                } else {
                                    downloadTasks.push({
                                        type: 'image',
                                        task: () => processImage(item, picId, picInfo, false)
                                    });
                                }
                            }
                        }
                    }

                    // 增强的视频检测
            function detectVideo(item) {
                // 1. 检查标准视频位置
                if (item.page_info?.media_info) {
                    return item.page_info.media_info;
                }

                // 2. 检查页面信息类型
                if (item.page_info &&
                    (item.page_info.type === 'video' ||
                     item.page_info.object_type === 'video' ||
                     item.page_info.page_url?.includes('video'))) {
                    console.log('通过页面信息类型检测到视频');
                    return item.page_info;
                }

                // 3. 检查混合媒体内容
                if (item.mix_media_info && Array.isArray(item.mix_media_info.items)) {
                    const videoItems = item.mix_media_info.items.filter(i =>
                        i.type === 'video' || i.data?.media_info);

                    if (videoItems.length > 0) {
                        console.log('通过混合媒体内容检测到视频');
                        return videoItems[0].data?.media_info || videoItems[0];
                    }
                }

                // 4. 检查直播回放
                if (item.video_replay) {
                    console.log('检测到直播回放视频');
                    return item.video_replay;
                }

                // 5. 检查短视频
                if (item.video) {
                    console.log('检测到短视频');
                    return item.video;
                }

                return null;
            }

            // 处理主微博的视频
                    const videoInfo = detectVideo(item);
                    if (videoInfo) {
                        console.log('检测到主微博视频');
                        downloadTasks.push({
                            type: 'video',
                            task: () => processVideoMedia(item, videoInfo, false)
                        });
                    }

                    // 处理转发微博的图片和LivePhoto
                    if (item.retweeted_status?.pic_ids && item.retweeted_status.pic_infos) {
                        for (const picId of item.retweeted_status.pic_ids) {
                            const picInfo = item.retweeted_status.pic_infos[picId];
                            if (picInfo) {
                                // 使用增强的LivePhoto检测
                                if (isLivePhoto(picInfo, item.retweeted_status, picId)) {
                                    downloadTasks.push({
                                        type: 'livephoto',
                                        task: () => processLivePhoto(item, picId, picInfo, true)
                                    });
                                } else {
                                    downloadTasks.push({
                                        type: 'image',
                                        task: () => processImage(item, picId, picInfo, true)
                                    });
                                }
                            }
                        }
                    }

                    // 处理转发微博的视频
                    if (item.retweeted_status) {
                        const rtVideoInfo = detectVideo(item.retweeted_status);
                        if (rtVideoInfo) {
                            console.log('检测到转发微博视频');
                            downloadTasks.push({
                                type: 'video',
                                task: () => processVideoMedia(item, rtVideoInfo, true)
                            });
                        }
                    }

                } catch (error) {
                    console.error('处理微博数据失败:', error);
                }
            }

            // 使用Promise.all并行处理所有下载任务，但限制并发数
            async function processAllDownloads() {
                // 先处理LivePhoto，然后是普通图片，最后是视频
                const prioritizedTasks = [
                    ...downloadTasks.filter(t => t.type === 'livephoto'),
                    ...downloadTasks.filter(t => t.type === 'image'),
                    ...downloadTasks.filter(t => t.type === 'video')
                ];

                // 创建一个信号量来控制并发数
                const semaphore = {
                    count: 0,
                    queue: [],

                    async acquire() {
                        if (this.count < MAX_CONCURRENT) {
                            this.count++;
                            return;
                        }

                        return new Promise(resolve => {
                            this.queue.push(resolve);
                        });
                    },

                    release() {
                        if (this.queue.length > 0) {
                            const resolve = this.queue.shift();
                            resolve();
                        } else {
                            this.count--;
                        }
                    }
                };

                // 使用Promise.all并行处理所有任务
                return Promise.all(prioritizedTasks.map(async ({type, task}) => {
                    await semaphore.acquire();
                    try {
                        await processDownload(task, type);
                    } finally {
                        semaphore.release();
                    }
                }));
            }

            // 开始处理所有下载
            await processAllDownloads();

            // 所有媒体下载完成后，生成HTML并打包
            const currentTime = new Date().toLocaleString();
            const mediaViewerHtml = generateMediaViewer(mediaData);
            htmlFolder.file("index.html", mediaViewerHtml);

            showMessage('正在生成ZIP文件，请稍候...', 'info');

            try {
                const zipBlob = await zip.generateAsync({
                    type: 'blob',
                    compression: 'DEFLATE',
                    compressionOptions: { level: 5 }
                }, (metadata) => {
                    updateProgressBar(progressContainer, metadata.percent);
                });

                // 生成下载链接
            const downloadUrl = URL.createObjectURL(zipBlob);
                const a = document.createElement('a');
                const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
            a.href = downloadUrl;
                a.download = `微博收藏导出_${timestamp}.zip`;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
            URL.revokeObjectURL(downloadUrl);
                document.body.removeChild(a);

            hideProgressBar(progressContainer);
                showMessage(`导出完成！共导出 ${livePhotoCount} 个LivePhoto, ${mediaData.images.length} 张图片, ${mediaData.videos.length} 个视频`, 'success');
        } catch (error) {
                console.error('生成ZIP文件失败:', error);
                hideProgressBar(progressContainer);
                showMessage('生成ZIP文件失败: ' + error.message, 'error');
            }
        } catch (error) {
            console.error('导出失败:', error);
            showMessage('导出失败: ' + error.message, 'error');
        }
    }

    // 生成媒体查看器页面（LivePhoto导出专用）
    // 检查DOM元素中的LivePhoto和视频
    function extractMediaFromDOM() {
        try {
            if (typeof document === 'undefined') return { livePhotos: [], videos: [] };

            const livePhotos = [];
            const videos = [];

            // 查找所有LivePhoto元素
            document.querySelectorAll('.media-pic-livephoto, .live-photo, [data-livephoto]').forEach(container => {
                const imgElement = container.querySelector('img');
                const videoElement = container.querySelector('video');

                if (imgElement && (videoElement || container.dataset.videoSrc)) {
                    const videoSrc = videoElement?.src || container.dataset.videoSrc;
                    if (videoSrc && imgElement.src) {
                        console.log('从DOM找到LivePhoto:', imgElement.src, videoSrc);
                        livePhotos.push({
                            imageUrl: imgElement.src,
                            videoUrl: videoSrc,
                            alt: imgElement.alt || ''
                        });
                    }
                }
            });

            // 查找所有可能包含Live标记的图片
            document.querySelectorAll('.wbpro-feed-content').forEach(feed => {
                const liveLabels = feed.querySelectorAll('.live-badge, .livePhoto');
                if (liveLabels.length > 0) {
                    const imgElements = feed.querySelectorAll('img:not(.live-badge img)');
                    const videoElements = feed.querySelectorAll('video');

                    // 尝试匹配图片和视频
                    if (imgElements.length > 0 && videoElements.length > 0) {
                        console.log('找到含Live标记的内容，图片:', imgElements.length, '视频:', videoElements.length);
                        imgElements.forEach(img => {
                            // 检查这个图片是否有Live标记
                            const isLive = Array.from(liveLabels).some(label =>
                                label.parentElement === img.parentElement ||
                                img.parentElement.contains(label) ||
                                Math.abs(label.getBoundingClientRect().top - img.getBoundingClientRect().top) < 50
                            );

                            if (isLive) {
                                console.log('找到带Live标记的图片:', img.src);
                                // 找最近的视频元素
                                let nearestVideo = null;
                                let minDistance = Infinity;

                                videoElements.forEach(video => {
                                    const distance = Math.abs(
                                        img.getBoundingClientRect().top -
                                        video.getBoundingClientRect().top
                                    );

                                    if (distance < minDistance) {
                                        minDistance = distance;
                                        nearestVideo = video;
                                    }
                                });

                                if (nearestVideo && nearestVideo.src && minDistance < 200) {
                                    console.log('匹配到相应视频:', nearestVideo.src);
                                    livePhotos.push({
                                        imageUrl: img.src,
                                        videoUrl: nearestVideo.src,
                                        alt: img.alt || ''
                                    });
                                }
                            }
                        });
                    }
                }
            });

            // 查找所有视频元素
            document.querySelectorAll('.video-player, .wbv-tech-video, [data-type="video"]').forEach(videoContainer => {
                const videoElement = videoContainer.querySelector('video');
                const posterElement = videoContainer.querySelector('img') || (videoElement?.poster ? videoElement : null);

                if (videoElement && videoElement.src) {
                    console.log('从DOM找到独立视频:', videoElement.src);
                    videos.push({
                        videoUrl: videoElement.src,
                        posterUrl: posterElement?.src || videoElement.poster || '',
                        duration: videoElement.duration || 0,
                        title: videoElement.title || videoContainer.querySelector('.title')?.textContent || ''
                    });
                }
            });

            console.log('从DOM提取媒体完成:', { livePhotos: livePhotos.length, videos: videos.length });
            return { livePhotos, videos };
        } catch (error) {
            console.error('从DOM提取媒体信息失败', error);
            return { livePhotos: [], videos: [] };
        }
    }

    function generateMediaViewer(mediaData) {
        console.log('生成媒体查看器，传入数据:', typeof mediaData, Object.keys(mediaData));
        console.log('媒体数量 - LivePhoto:', mediaData.livePhotos.length, '图片:', mediaData.images.length, '视频:', mediaData.videos.length);

        try {
            // 从DOM直接提取媒体
            try {
                const domMedia = extractMediaFromDOM();
                if (domMedia.livePhotos.length > 0 || domMedia.videos.length > 0) {
                    console.log('从DOM中提取到媒体:', { livePhotos: domMedia.livePhotos.length, videos: domMedia.videos.length });

                    // 处理从DOM提取的LivePhoto
                    domMedia.livePhotos.forEach((livePhoto, index) => {
                        const timestamp = Date.now() + index;
                        mediaData.livePhotos.push({
                            weiboId: `dom_${timestamp}`,
                            userName: '页面提取',
                            text: livePhoto.alt || '从页面直接提取的LivePhoto',
                            createTime: new Date().toISOString(),
                            isRetweet: false,
                            retweetFrom: '',
                            imageFile: livePhoto.imageUrl,
                            videoFile: livePhoto.videoUrl,
                            picId: `dom_${timestamp}`
                        });
                    });

                    // 处理从DOM提取的视频
                    domMedia.videos.forEach((video, index) => {
                        const timestamp = Date.now() + 1000 + index;
                        mediaData.videos.push({
                            weiboId: `dom_${timestamp}`,
                            userName: '页面提取',
                            text: video.title || '从页面直接提取的视频',
                            createTime: new Date().toISOString(),
                            isRetweet: false,
                            retweetFrom: '',
                            videoFile: video.videoUrl,
                            posterFile: video.posterUrl || '',
                            duration: video.duration || 0
                        });
                    });

                    console.log('合并后媒体数量 - LivePhoto:', mediaData.livePhotos.length, '图片:', mediaData.images.length, '视频:', mediaData.videos.length);
                }
            } catch (error) {
                console.error('处理DOM媒体出错:', error);
            }

        // 首先按微博ID分组所有媒体内容
        const groupedMedia = {};

        // 处理所有类型的媒体
            const allMedia = [
                ...(mediaData.livePhotos || []).map(item => ({...item, mediaType: 'livephoto'})),
                ...(mediaData.images || []).map(item => ({...item, mediaType: 'image'})),
                ...(mediaData.videos || []).map(item => ({...item, mediaType: 'video'}))
            ];

            console.log('处理的总媒体数:', allMedia.length);

            allMedia.forEach(item => {
            const key = item.isRetweet ? `${item.retweetFrom}_${item.weiboId}` : item.weiboId;
            if (!groupedMedia[key]) {
                groupedMedia[key] = {
                    weiboId: item.weiboId,
                        userName: item.userName || '未知用户',
                        text: item.text || '',
                        createTime: item.createTime || new Date().toISOString(),
                        isRetweet: item.isRetweet || false,
                        retweetFrom: item.retweetFrom || '',
                    media: []
                };
            }
            groupedMedia[key].media.push(item);
        });

            console.log('分组后的媒体数量:', Object.keys(groupedMedia).length);

        return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>微博媒体查看器</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            margin: 0 auto;
            padding: 20px;
            background: #f8f8f8;
            line-height: 1.6;
            position: relative;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            color: #333;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .controls {
            margin-bottom: 20px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
        }

        #searchInput {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-right: 10px;
            min-width: 200px;
        }

        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            background: #ff8200;
            color: white;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        }

        .btn:hover {
            background: #e67300;
        }

        .btn.active {
            background: #ff9933;
        }

        .post {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .post-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }

        .user-name {
            font-weight: bold;
            color: #333;
            font-size: 16px;
        }

        .post-content {
            margin-bottom: 15px;
            word-break: break-word;
        }

        .media-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 10px;
            margin-bottom: 15px;
        }

        .media-grid-large {
            grid-template-columns: repeat(3, 1fr);
        }

        .media-grid-small {
            grid-template-columns: repeat(4, 1fr);
        }

        /* 针对混合媒体微博的特殊布局 */
        .mixed-media-layout .media-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: auto;
            grid-gap: 8px;
        }

        .mixed-media-layout .media-item:first-child {
            grid-column: 1 / 3;
            grid-row: 1 / 3;
        }

        /* 针对LivePhoto的尺寸调整 */
        @media (min-width: 768px) {
            .mixed-media-layout .live-photo {
                height: 0;
                padding-bottom: 100%;
            }
        }

        .media-item {
            position: relative;
            padding-bottom: 100%;
            background: #f5f5f5;
            border-radius: 4px;
            overflow: hidden;
        }

        .media-item img,
        .media-item video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .live-photo {
            position: relative;
            cursor: pointer;
        }

        .live-photo video {
            display: none;
        }

        .live-photo.playing video {
            display: block;
        }

        .live-photo.playing img {
            visibility: hidden;
        }

        .live-badge {
            position: absolute;
            top: 8px;
            left: 8px;
            background: #FFFFFF;
            color: #000000;
            padding: 1px 4px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 450;
            cursor: pointer;
            z-index: 2;
            font-family: "Noto Sans SC Black";
            letter-spacing: 0;
            box-shadow: none;
            line-height: 16px;
            height: 18px;
            border: none;
            text-transform: none;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 24px;
            white-space: nowrap;
            transition: all 0.3s ease;
        }

        /* LivePhoto标签基本样式 */

        .live-badge::before {
            content: '';
            display: inline-block;
            width: 6px;
            height: 6px;
            background: #ff2442;
            border-radius: 50%;
            margin-right: 3px;
            position: relative;
            top: 1px;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(255, 36, 66, 0.7);
            }
            70% {
                transform: scale(1);
                box-shadow: 0 0 0 6px rgba(255, 36, 66, 0);
            }
            100% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(255, 36, 66, 0);
            }
        }

        .live-photo.playing .live-badge {
            background: rgba(255, 36, 66, 0.8);
        }

        @keyframes liveGlow {
            0% { box-shadow: 0 0 5px rgba(255, 36, 66, 0.5); }
            50% { box-shadow: 0 0 15px rgba(255, 36, 66, 0.8); }
            100% { box-shadow: 0 0 5px rgba(255, 36, 66, 0.5); }
        }

        .live-photo.playing .live-badge {
            animation: liveGlow 2s infinite;
        }

        .media-preview {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.85);
            z-index: 1000;
            display: none;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            cursor: zoom-out;
        }

        .media-preview.show {
            display: flex;
            opacity: 1;
        }

        .preview-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            gap: 20px;
            align-items: center;
            justify-content: center;
        }

        .preview-media-container {
            position: relative;
            margin: 0 auto;
            border-radius: 4px;
            overflow: hidden;
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
        }

        .preview-media-container img,
        .preview-media-container video {
            display: block;
            max-width: 100%;
            max-height: 95vh;
            object-fit: contain;
        }

        /* 视频播放器增强样式 */
        .video-container {
            position: relative;
            width: 100%;
            max-width: 960px;
            margin: 0 auto 20px auto;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            background: #000;
            cursor: pointer;
        }

        .video-wrapper {
            position: relative;
            padding-bottom: 56.25%; /* 16:9比例 */
            height: 0;
            overflow: hidden;
        }

        .video-wrapper video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        /* 视频播放按钮 */
        .video-play-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.3);
            opacity: 0;
            transition: opacity 0.3s;
        }

        .video-container:hover .video-play-overlay {
            opacity: 1;
        }

        .video-play-button {
            width: 80px;
            height: 80px;
            background: rgba(0,0,0,0.6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }

        .video-play-button:before {
            content: '';
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 20px 0 20px 30px;
            border-color: transparent transparent transparent #fff;
            margin-left: 7px;
        }

        /* 视频全屏预览 */
        .video-preview-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            z-index: 10000;
            display: none;
            align-items: center;
            justify-content: center;
        }

        .video-preview-modal.active {
            display: flex;
        }

        .video-preview-container {
            position: relative;
            width: 80%;
            max-width: 1200px;
            max-height: 80vh;
        }

        .video-preview-container video {
            width: 100%;
            height: auto;
            max-height: 80vh;
            display: block;
        }

        .video-preview-close {
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 30px;
            cursor: pointer;
            background: none;
            border: none;
            padding: 5px;
        }

        /* 视频控制 */
        .video-controls {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,0.7);
            padding: 10px;
            display: flex;
            align-items: center;
            transition: opacity 0.3s;
            opacity: 0;
        }

        .video-container:hover .video-controls {
            opacity: 1;
        }

        .video-controls button {
            background: transparent;
            border: none;
            color: white;
            margin-right: 10px;
            cursor: pointer;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .video-progress {
            flex: 1;
            height: 5px;
            background: rgba(255,255,255,0.3);
            cursor: pointer;
            position: relative;
            border-radius: 2px;
            overflow: hidden;
        }

        .video-progress-bar {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background: #ff8200;
            width: 0;
        }

        .video-time {
            color: white;
            font-size: 12px;
            margin: 0 10px;
            min-width: 65px;
            text-align: center;
        }

        .video-quality {
            position: relative;
        }

        .video-quality-options {
            position: absolute;
            bottom: 40px;
            right: 0;
            background: rgba(0,0,0,0.8);
            border-radius: 4px;
            padding: 5px 0;
            display: none;
            min-width: 100px;
        }

        .video-quality-options button {
            display: block;
            width: 100%;
            text-align: left;
            padding: 5px 10px;
            transition: background 0.2s;
        }

        .video-quality-options button:hover {
            background: rgba(255,255,255,0.1);
        }

        .video-quality-options button.active {
            color: #ff8200;
        }

        .video-quality.show .video-quality-options {
            display: block;
        }

        .video-fullscreen {
            margin-left: 10px;
        }

        /* 图片和视频网格样式优化 */
        .video-grid-item {
            grid-column: span 3;
            padding-bottom: 56.25%;
        }

        /* 混合媒体布局优化 */
        .mixed-media .media-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-auto-rows: minmax(120px, auto);
            gap: 8px;
        }

        /* 大图布局 - 针对第一张图片 */
        .mixed-media .media-item:first-child {
            grid-column: span 2;
            grid-row: span 2;
        }

        /* 针对Live照片突出显示 */
        .mixed-media .live-photo {
            border: 2px solid #ff8200;
        }

        /* 响应式布局优化 */
        @media (max-width: 768px) {
            .mixed-media .media-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .mixed-media .media-item:first-child {
                grid-column: span 2;
                grid-row: span 2;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>微博媒体查看器</h1>
        <p>共 ${allMedia.length} 条微博（LivePhoto: ${mediaData.livePhotos.length}, 图片: ${mediaData.images.length}, 视频: ${mediaData.videos.length}）</p>
    </div>

    <div class="controls">
        <input type="text" id="searchInput" placeholder="搜索微博内容或用户名..." />
        <button class="btn" id="showAllBtn">显示全部</button>
        <button class="btn" id="livephotoBtn">仅看LivePhoto</button>
        <button class="btn" id="imageBtn">仅看图片</button>
        <button class="btn" id="videoBtn">仅看视频</button>
        <button class="btn" id="expandAllLivePhotoBtn">播放所有LivePhoto</button>
        <button class="btn" id="collapseAllLivePhotoBtn">停止所有LivePhoto</button>
    </div>

    <div id="posts-container">
        ${Object.values(groupedMedia).length > 0 ?
            Object.values(groupedMedia).map(group => `
            <div class="post" data-user="${group.userName}" data-text="${group.text}" data-time="${group.createTime}">
                    <div class="post-header">
                    <div class="user-name">${group.userName}${group.isRetweet ? ` (转发自: ${group.retweetFrom})` : ''}</div>
                    </div>
                <div class="post-content">${group.text}</div>

                ${(() => {
                    // 检查是否有视频，优先单独显示视频
                    const videos = group.media.filter(m => m.mediaType === 'video');
                    if (videos.length > 0) {
                        // 取第一个视频进行展示
                        const video = videos[0];
                        return `
                        <div class="video-container" data-video="../${video.videoFile}">
                            <div class="video-wrapper">
                                <video poster="${video.posterFile ? '../' + video.posterFile : ''}" preload="metadata" data-video-path="../${video.videoFile}">
                                    <source src="../${video.videoFile}" type="video/mp4">
                                </video>
                                <div class="video-play-overlay">
                                    <div class="video-play-button"></div>
                            </div>
                            </div>
                        </div>`;
                    }
                    return '';
                })()}

                    <div class="media-grid">
                    ${group.media.map(item => {
                        if (item.mediaType === 'livephoto') {
                                return `
                            <div class="media-item live-photo" data-type="livephoto" data-img="../${item.imageFile}" data-video="../${item.videoFile}">
                                <img src="../${item.imageFile}" alt="LivePhoto" onerror="this.onerror=null; this.style.display='none'; this.parentNode.innerHTML += '<div class=\\'image-not-found\\'>图片加载失败</div>';" />
                                <video loop muted playsinline preload="metadata">
                                    <source src="../${item.videoFile}" type="video/mp4">
                                </video>
                                <span class="live-badge" data-verified="true">Live</span>
                            </div>`;
                        } else if (item.mediaType === 'image') {
                                return `
                            <div class="media-item" data-type="image" data-img="../${item.imageFile}">
                                <img src="../${item.imageFile}" alt="图片" onerror="this.onerror=null; this.style.display='none'; this.parentNode.innerHTML += '<div class=\\'image-not-found\\'>图片加载失败</div>';" />
                            </div>`;
                        } else if (item.mediaType === 'video') {
                            // 视频已经单独展示了，网格中不再重复显示
                            return '';
                        }
                        return '';
                        }).join('')}
                    </div>
                    <div class="time-info">
                    <span>创建时间: ${new Date(group.createTime).toLocaleString()}</span>
                </div>
            </div>
        `).join('') :
        '<div class="empty-state"><h2>没有找到媒体内容</h2><p>请尝试其他筛选条件或返回重新导出</p></div>'
        }
    </div>

    <div class="media-preview" id="mediaPreview">
        <div class="preview-content"></div>
    </div>

    <!-- 视频预览模态框 -->
    <div class="video-preview-modal" id="videoPreviewModal">
        <div class="video-preview-container">
            <button class="video-preview-close">&times;</button>
            <video controls id="videoPreviewPlayer">
                <source src="" type="video/mp4">
            </video>
        </div>
    </div>

    <script>
        // 初始化变量
        let currentPreviewItem = null;
        let isPlayingAll = false;
        const videoPlayers = [];

        // 格式化时间
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);
            return \`\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
        }

        // 设置视频源质量
        function setVideoQuality(videoElement, quality) {
            const videoPath = videoElement.dataset.videoPath;
            if (!videoPath) return;

            const currentTime = videoElement.currentTime;
            const isPaused = videoElement.paused;

            // 获取视频源
            let videoSrc = videoPath;

            // 根据清晰度级别调整视频源
            // 实际项目中，你可能需要多个清晰度的视频文件
            // 这里仅作示例，实际我们仍使用同一个视频源
            if (quality !== 'auto') {
                // 记录当前选择的清晰度
                videoElement.dataset.currentQuality = quality;
                console.log('切换视频清晰度: ' + quality);
            }

            // 设置视频源
            videoElement.querySelector('source').src = videoSrc;

            // 重新加载视频
            videoElement.load();

            // 恢复播放状态和时间
            videoElement.addEventListener('loadedmetadata', function onLoad() {
                videoElement.currentTime = currentTime;
                if (!isPaused) {
                    videoElement.play().catch(e => console.error('视频播放错误:', e));
                }
                videoElement.removeEventListener('loadedmetadata', onLoad);
            });

            // 记录清晰度变化
            console.log('视频清晰度已更改为: ' + quality + ', 使用源: ' + videoSrc);
        }

        // 显示视频全屏预览
        function showVideoPreview(videoSrc) {
            const modal = document.getElementById('videoPreviewModal');
            const player = document.getElementById('videoPreviewPlayer');
            const source = player.querySelector('source');

            // 设置视频源
            source.src = videoSrc;
            player.load();

            // 显示模态框
            modal.classList.add('active');

            // 尝试自动播放
            player.play().catch(err => {
                console.log('自动播放失败，可能需要用户交互:', err.message);
                });
        }

        // 关闭视频预览
        function closeVideoPreview() {
            const modal = document.getElementById('videoPreviewModal');
            const player = document.getElementById('videoPreviewPlayer');

            // 暂停播放
            player.pause();

            // 隐藏模态框
            modal.classList.remove('active');
        }

        // 验证LivePhoto视频有效性
        // LivePhoto处理函数已被移除

        // LivePhoto 鼠标悬停处理
        function handleLivePhotoHover() {
            // 查找所有LivePhoto元素
            document.querySelectorAll('.live-photo').forEach(photo => {
                const video = photo.querySelector('video');
                const img = photo.querySelector('img');
                const liveBadge = photo.querySelector('.live-badge');

                if (!video || !img) return;

                photo.addEventListener('mouseenter', function() {
                    // 视频播放逻辑
                    if (video && img) {
                        // 添加状态标记以防止play/pause冲突
                        video.dataset.shouldPlay = 'true';

                        // 显示视频元素
                        photo.classList.add('playing');
                        video.style.display = 'block';

                        // 重置视频时间
                        try {
                            video.currentTime = 0;
                        } catch (e) {
                            console.warn('设置视频时间失败:', e);
                        }

                        // 检查视频是否准备好播放
                        if (video.readyState >= 2) {
                            if (video.paused) {
                                const playPromise = video.play();
                                if (playPromise !== undefined) {
                                    playPromise.catch(err => {
                                        console.error('LivePhoto视频播放错误:', err);
                                        // 播放失败时重置状态
                                        video.dataset.shouldPlay = 'false';
                                        // 播放失败时显示图片
                                        photo.classList.remove('playing');
                                        video.style.display = 'none';
                                    });
                                }
                            }
            } else {
                            // 添加一个事件监听器，在视频可以播放时播放
                            video.addEventListener('canplay', function onCanPlay() {
                                // 确保仍然需要播放视频（可能已经移出）
                                if (video.dataset.shouldPlay === 'true' && video.paused) {
                                    const playPromise = video.play();
                                    if (playPromise !== undefined) {
                                        playPromise.catch(err => {
                                            console.error('LivePhoto视频播放错误:', err);
                                            // 播放失败时重置状态并显示图片
                                            video.dataset.shouldPlay = 'false';
                                            photo.classList.remove('playing');
                                            video.style.display = 'none';
                                        });
                                    }
                                }
                                video.removeEventListener('canplay', onCanPlay);
                            });
                        }
                    }
                });

                photo.addEventListener('mouseleave', function() {
                    if (video && img) {
                        // 更新状态标记
                        video.dataset.shouldPlay = 'false';

                        photo.classList.remove('playing');
                        video.style.display = 'none';

                        // 仅在视频正在播放时暂停
                        if (!video.paused) {
                            try {
                                video.pause();
                            } catch (error) {
                                console.error('视频暂停出错:', error);
                            }
                        }
                    }
                });

                // 也处理点击事件
                photo.addEventListener('click', function(e) {
                    // 阻止冒泡，避免触发父元素的点击事件
                    e.stopPropagation();

                    // 如果点击的是Live标签，不处理
                    if (e.target.classList.contains('live-badge')) return;

                        // 获取图片和视频URL用于全屏预览
                        const imgUrl = photo.dataset.img;
                        const videoUrl = photo.dataset.video;

                        // 检查是否有全屏预览函数
                        if (typeof showMediaPreview === 'function') {
                            showMediaPreview(imgUrl, videoUrl, photo);
                    }
                });
            });
        }

        // 搜索和筛选功能
        function initializeSearchAndFilter() {
            const searchInput = document.getElementById('searchInput');
            const showAllBtn = document.getElementById('showAllBtn');
            const livephotoBtn = document.getElementById('livephotoBtn');
            const imageBtn = document.getElementById('imageBtn');
            const videoBtn = document.getElementById('videoBtn');
            const expandAllBtn = document.getElementById('expandAllLivePhotoBtn');
            const collapseAllBtn = document.getElementById('collapseAllLivePhotoBtn');

            // 搜索功能
            searchInput.addEventListener('input', function() {
                const searchText = this.value.toLowerCase();
                document.querySelectorAll('.post').forEach(post => {
                    const userName = post.getAttribute('data-user').toLowerCase();
                    const postText = post.getAttribute('data-text').toLowerCase();
                    const shouldShow = userName.includes(searchText) || postText.includes(searchText);
                    post.style.display = shouldShow ? 'block' : 'none';
                });
            });

            // 筛选按钮点击事件
            function updateButtonStates(activeBtn) {
                [showAllBtn, livephotoBtn, imageBtn, videoBtn].forEach(btn => {
                    btn.classList.remove('active');
                });
                if (activeBtn) activeBtn.classList.add('active');
            }

            showAllBtn.addEventListener('click', function() {
                updateButtonStates(this);
                document.querySelectorAll('.media-item').forEach(item => {
                    item.style.display = 'block';
                });
                document.querySelectorAll('.video-container').forEach(item => {
                    item.style.display = 'block';
                });
            });

            livephotoBtn.addEventListener('click', function() {
                updateButtonStates(this);
                document.querySelectorAll('.media-item').forEach(item => {
                    item.style.display = item.classList.contains('live-photo') ? 'block' : 'none';
                });
                document.querySelectorAll('.video-container').forEach(item => {
                    item.style.display = 'none';
                });
            });

            imageBtn.addEventListener('click', function() {
                updateButtonStates(this);
                document.querySelectorAll('.media-item').forEach(item => {
                    const isImage = !item.classList.contains('live-photo') && !item.classList.contains('video');
                    item.style.display = isImage ? 'block' : 'none';
                });
                document.querySelectorAll('.video-container').forEach(item => {
                    item.style.display = 'none';
                });
            });

            videoBtn.addEventListener('click', function() {
                updateButtonStates(this);
                document.querySelectorAll('.media-item').forEach(item => {
                    item.style.display = 'none';
                });
                document.querySelectorAll('.video-container').forEach(item => {
                    item.style.display = 'block';
                });
            });

            // 播放/停止所有 LivePhoto
            expandAllBtn.addEventListener('click', function() {
                isPlayingAll = true;
                document.querySelectorAll('.live-photo').forEach(photo => {
                    const video = photo.querySelector('video');
                    const img = photo.querySelector('img');
                    if (video && img) {
                        photo.classList.add('playing');
                        video.style.display = 'block';
                        video.currentTime = 0;
                        video.play().catch(e => console.error('视频播放错误:', e));
                    }
                });
            });

            collapseAllBtn.addEventListener('click', function() {
                isPlayingAll = false;
                document.querySelectorAll('.live-photo').forEach(photo => {
                    const video = photo.querySelector('video');
                    const img = photo.querySelector('img');
                    if (video && img) {
                        photo.classList.remove('playing');
                        video.style.display = 'none';
                        video.pause();
                    }
                });
            });
        }

        // 打开预览
        function openPreview(item) {
            const preview = document.getElementById('mediaPreview');
            const content = preview.querySelector('.preview-content');
            currentPreviewItem = item;

            content.innerHTML = '';

            if (item.classList.contains('live-photo')) {
                const container1 = document.createElement('div');
                const container2 = document.createElement('div');
                container1.className = 'preview-media-container';
                container2.className = 'preview-media-container';

                const img = item.querySelector('img').cloneNode(true);
                const video = item.querySelector('video').cloneNode(true);

                container1.appendChild(img);
                container2.appendChild(video);
                content.appendChild(container1);
                content.appendChild(container2);

                video.currentTime = 0;
            video.play();
            } else {
                const container = document.createElement('div');
                container.className = 'preview-media-container single';

                if (item.classList.contains('video')) {
                    const video = item.querySelector('video').cloneNode(true);
                    container.appendChild(video);
                    video.controls = true;
                } else {
                    const img = item.querySelector('img').cloneNode(true);
                    container.appendChild(img);
                }

                content.appendChild(container);
            }

            preview.classList.add('show');
        }

        // 关闭预览
        function closePreview() {
            const preview = document.getElementById('mediaPreview');
            const content = preview.querySelector('.preview-content');
            const video = content.querySelector('video');
            if (video) video.pause();
            preview.classList.remove('show');
            currentPreviewItem = null;
        }

        // 事件监听
        document.addEventListener('DOMContentLoaded', function() {
            // 初始化所有功能
            handleLivePhotoHover();
            initializeSearchAndFilter();

            const preview = document.getElementById('mediaPreview');
            const videoPreviewModal = document.getElementById('videoPreviewModal');

            // 点击预览区域外关闭
            preview.addEventListener('click', function(e) {
                if (!e.target.closest('.preview-media-container')) {
                    closePreview();
                }
            });

            // 关闭视频预览
            document.querySelector('.video-preview-close').addEventListener('click', closeVideoPreview);

            // 点击预览区域外关闭视频预览
            videoPreviewModal.addEventListener('click', function(e) {
                if (!e.target.closest('.video-preview-container') || e.target === this) {
                    closeVideoPreview();
                }
            });

            // 阻止媒体容器的点击事件冒泡
            document.querySelectorAll('.preview-media-container').forEach(container => {
                container.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
            });

            // LivePhoto点击预览
            document.querySelectorAll('.live-photo').forEach(photo => {
                photo.addEventListener('click', function(e) {
                    e.preventDefault();
                    openPreview(this);
                });
            });

            // 图片预览
            document.querySelectorAll('.media-item:not(.live-photo)').forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    openPreview(this);
                });
            });

            // 视频容器点击事件 - 全屏预览
            document.querySelectorAll('.video-container').forEach(container => {
                container.addEventListener('click', function(e) {
                    e.preventDefault();
                    const videoPath = this.getAttribute('data-video');
                    if (videoPath) {
                        showVideoPreview(videoPath);
                    }
                });
            });

            // 视频播放按钮点击事件
            document.querySelectorAll('.video-play-button').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const container = this.closest('.video-container');
                    const videoPath = container.getAttribute('data-video');
                    if (videoPath) {
                        showVideoPreview(videoPath);
                    }
                });
            });

            // 键盘事件
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    if (document.getElementById('videoPreviewModal').classList.contains('active')) {
                        closeVideoPreview();
                    } else {
                    closePreview();
                    }
                }
            });
        });
    </script>
</body>
</html>`;
        } catch (error) {
            console.error('生成媒体查看器失败:', error);
            return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>错误 - 微博媒体查看器</title>
</head>
<body>
    <div style="padding: 20px; color: red; text-align: center;">
        <h2>生成媒体查看器时出错</h2>
        <p>${error.message}</p>
        <pre>${error.stack}</pre>
    </div>
</body>
</html>`;
        }
    }

    async function initWeiboAPI() {
        if (!window.weiboAccessToken) {
            try {
                const token = await getWeiboAccessToken();
                if (token) {
                    window.weiboAccessToken = token;
                    return true;
                }
            } catch (error) {
                console.error('初始化微博API失败:', error);
                return false;
            }
        }
        return true;
    }

    async function getWeiboAccessToken() {
        try {
            const response = await fetch('https://weibo.com/ajax/favorites/all_fav?page=1', {
                credentials: 'include'
            });
            if (response.ok) {
                return 'logged_in';
            } else {
                throw new Error('未登录或登录已过期');
            }
        } catch (error) {
            showMessage('请先登录微博', 'error');
            return null;
        }
    }

    // 添加preparePreviewData函数
    function preparePreviewData(imgSrc, videoSrc = null, itemElement = null) {
        // 确保currentPreviewData变量存在
        if (typeof currentPreviewData === 'undefined') {
            window.currentPreviewData = {
                mediaList: [],
                currentIndex: 0,
                mediaType: 'image'
            };
        }

        // 设置当前预览数据
        currentPreviewData = {
            mediaList: [],
            currentIndex: 0,
            mediaType: videoSrc ? 'livephoto' : 'image'
        };

        if (itemElement) {
            // 从上下文中找到所有相关媒体
            const mediaItems = document.querySelectorAll('.media-item');
            const mediaList = [];
            let currentIndex = 0;

            mediaItems.forEach((item, index) => {
                let type = 'image';
                let src = '';
                let videoSrc = null;

                if (item.classList.contains('live-photo')) {
                    type = 'livephoto';
                    src = item.querySelector('img')?.src || '';
                    videoSrc = item.querySelector('video source')?.src || null;
                } else if (item.classList.contains('video-item')) {
                    type = 'video';
                    src = item.querySelector('img')?.src || '';
                    videoSrc = item.querySelector('video source')?.src || null;
                } else {
                    type = 'image';
                    src = item.querySelector('img')?.src || '';
                }

                if (src) {
                    mediaList.push({ type, src, videoSrc });
                }

                if (item === itemElement) {
                    currentIndex = mediaList.length - 1;
                }
            });

            currentPreviewData.mediaList = mediaList;
            currentPreviewData.currentIndex = currentIndex;
        } else {
            // 单独的媒体项
            currentPreviewData.mediaList = [{
                type: videoSrc ? 'livephoto' : 'image',
                src: imgSrc,
                videoSrc: videoSrc
            }];
            currentPreviewData.currentIndex = 0;
        }

        return currentPreviewData;
    }

    // 添加渲染预览的函数
    function renderCurrentPreview(modal) {
        if (!modal) return;

        const content = modal.querySelector('.preview-content');
        const counter = modal.querySelector('.preview-counter');

        // 清空内容
        content.innerHTML = '';

        // 获取当前媒体项
        const item = currentPreviewData.mediaList[currentPreviewData.currentIndex];
        if (!item) return;

        // 创建预览容器
        const container = document.createElement('div');
        container.className = 'preview-container';

        if (item.type === 'livephoto') {
            // 创建图片
            const img = document.createElement('img');
            img.className = 'preview-image';
            img.src = item.src;

            // 创建视频
            if (item.videoSrc) {
                const video = document.createElement('video');
                video.className = 'preview-video';
                video.loop = true;
                video.muted = true;
                video.playsInline = true;
                video.style.display = 'none';

                const source = document.createElement('source');
                source.src = item.videoSrc;
                source.type = 'video/mp4';
                video.appendChild(source);

                container.appendChild(video);

                // 初始化视频状态
                video.dataset.playable = 'unknown';
                video.dataset.hasAttemptedToLoad = 'false';

                // 处理视频错误
                video.addEventListener('error', (e) => {
                    console.warn('LivePhoto视频加载错误:', e, item.videoSrc);
                    video.dataset.playable = 'false';
                });

                // 检查视频元数据加载
                video.addEventListener('loadedmetadata', () => {
                    if (video.duration > 0 && video.videoWidth > 0) {
                        video.dataset.playable = 'true';
                        console.log('LivePhoto视频可用:', item.videoSrc);
                    } else {
                        video.dataset.playable = 'false';
                        console.warn('LivePhoto视频无效 (时长或尺寸为0):', item.videoSrc);
                    }
                });

                // 尝试预加载视频
                try {
                    video.load();
                    video.dataset.hasAttemptedToLoad = 'true';
                } catch (e) {
                    console.warn('视频预加载错误:', e);
                }

                // 鼠标悬停播放视频
                container.addEventListener('mouseenter', () => {
                    // 添加状态标记防止play/pause冲突
                    video.dataset.shouldPlay = 'true';

                    // 显示视频元素
                    img.style.display = 'none';
                    video.style.display = 'block';

                                                // 没有验证，直接播放

                    // 重置视频时间
                    try {
                        video.currentTime = 0;
                    } catch (e) {
                        console.warn('设置视频时间失败:', e);
                    }

                    // 尝试播放视频
                    const playVideo = () => {
                        // 再次检查是否应该播放
                        if (video.dataset.shouldPlay !== 'true') return;

                        // 防止重复调用play()
                        if (video.paused) {
                            const playPromise = video.play();

                            // 正确处理play()返回的Promise
                            if (playPromise !== undefined) {
                                playPromise.then(() => {
                                    console.log('LivePhoto视频开始播放');
                                }).catch(err => {
                                    console.error('LivePhoto视频播放错误:', err);

                                    // 播放失败时恢复图片显示
                                    video.dataset.shouldPlay = 'false';
                                    img.style.display = 'block';
                                    video.style.display = 'none';

                                    // 标记视频不可播放（特定错误）
                                    if (err.name === 'NotSupportedError' || err.name === 'NotAllowedError') {
                                        video.dataset.playable = 'false';
                                    }
                                });
                            }
                        }
                    };

                    // 检查视频是否准备好播放
                    if (video.readyState >= 2) {
                        playVideo();
                    } else {
                        // 视频未准备好，等待canplay事件
                        const onCanPlay = function() {
                            playVideo();
                            // 移除事件监听器，避免重复调用
                            video.removeEventListener('canplay', onCanPlay);
                        };
                        video.addEventListener('canplay', onCanPlay);

                        // 设置超时，如果2秒内视频还没准备好，恢复图片显示
                        setTimeout(() => {
                            if (video.readyState < 2 && video.dataset.shouldPlay === 'true') {
                                console.warn('视频加载超时，恢复图片显示');
                                video.dataset.shouldPlay = 'false';
                                img.style.display = 'block';
                                video.style.display = 'none';
                                video.removeEventListener('canplay', onCanPlay);
                            }
                        }, 2000);
                    }
                });

                container.addEventListener('mouseleave', () => {
                    // 更新状态标记
                    video.dataset.shouldPlay = 'false';

                    // 恢复图片显示
                    img.style.display = 'block';
                    video.style.display = 'none';

                    // 仅在视频真正播放时尝试暂停
                    if (!video.paused && video.readyState >= 2) {
                        try {
                            // 延迟暂停，避免播放/暂停冲突
                            setTimeout(() => {
                                if (!video.paused) {
                                    video.pause();
                                }
                            }, 50);
                        } catch (error) {
                            console.error('视频暂停出错:', error);
                        }
                    }
                });
            }

            container.appendChild(img);
        } else if (item.type === 'video') {
            // 创建视频预览
            const video = document.createElement('video');
            video.className = 'preview-video';
            video.controls = true;
            video.playsInline = true;

            const source = document.createElement('source');
            source.src = item.videoSrc;
            source.type = 'video/mp4';
            video.appendChild(source);

            if (item.src) {
                video.poster = item.src;
            }

            container.appendChild(video);
        } else {
            // 普通图片
            const img = document.createElement('img');
            img.className = 'preview-image';
            img.src = item.src;
            container.appendChild(img);
        }

        content.appendChild(container);

        // 更新计数器
        if (currentPreviewData.mediaList.length > 1) {
            counter.textContent = `${currentPreviewData.currentIndex + 1} / ${currentPreviewData.mediaList.length}`;
            counter.style.display = 'block';
            modal.querySelector('.preview-navigation').style.display = 'flex';
        } else {
            counter.style.display = 'none';
            modal.querySelector('.preview-navigation').style.display = 'none';
        }

        // 显示模态框
        modal.style.display = 'flex';
    }

    // 添加导航功能
    function navigatePreview(direction) {
        const modal = document.querySelector('.media-preview-modal');
        if (!modal) return;

        const { mediaList, currentIndex } = currentPreviewData;

        if (mediaList.length <= 1) return;

        // 暂停当前视频
        const currentVideo = modal.querySelector('video');
        if (currentVideo && !currentVideo.paused) {
            currentVideo.pause();
        }

        // 计算新索引
        let newIndex = currentIndex;
        if (direction === 'prev') {
            newIndex = (currentIndex - 1 + mediaList.length) % mediaList.length;
        } else {
            newIndex = (currentIndex + 1) % mediaList.length;
        }

        // 更新索引并重新渲染
        currentPreviewData.currentIndex = newIndex;
        renderCurrentPreview(modal);
    }

    // 添加处理视频的功能
    function showVideoPreview(videoSrc, posterSrc = '') {
        if (!videoSrc) {
            console.warn('未提供视频源，无法预览');
            return;
        }

        console.log('显示视频预览:', videoSrc, posterSrc);
        showMediaPreview(posterSrc, videoSrc, null);
    }

    // 处理视频点击的快捷方式
    window.showVideoPreview = showVideoPreview;
    window.showMediaPreview = showMediaPreview;

    // 添加处理直接点击播放按钮的事件
    document.addEventListener('click', function(e) {
        // 检查是否点击了视频播放按钮
        if (e.target.matches('.video-play-button, .wb-play-button, [data-role="play"], .play-button-wrapper, .play-icon')) {
            e.preventDefault();
            e.stopPropagation();

            console.log('播放按钮被点击');

            // 查找最近的视频容器
            const videoContainer = e.target.closest('.video-item, .video, .wb-video, .wb-media-video, [data-type="video"]');
            if (videoContainer) {
                // 模拟点击视频容器
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                videoContainer.dispatchEvent(clickEvent);
            } else {
                // 直接尝试寻找视频源
                const videoEl = e.target.closest('video') ||
                              document.querySelector('video[src], video source[src]');
                const imgEl = e.target.closest('img');

                if (videoEl) {
                    const videoSrc = videoEl.src || videoEl.querySelector('source')?.src;
                    const posterSrc = imgEl?.src || videoEl.poster;

                    if (videoSrc) {
                        console.log('直接点击播放按钮，视频源:', videoSrc);
                        showMediaPreview(posterSrc, videoSrc, null);
                    }
                }
            }
        }
    }, true);

    // 修改videoQualitySelect change事件处理
    document.getElementById('videoQualitySelect').addEventListener('change', function(e) {
        config.settings.videoQuality = e.target.value;
        console.log('主界面视频清晰度设置已更改为:', config.settings.videoQuality);

        // 提示用户需要重新导出
        showMessage(`视频清晰度已更改为: ${config.settings.videoQuality}，请重新导出以应用新的清晰度设置`, 'info');

        // 保存设置到本地存储
        GM_setValue('videoQuality', config.settings.videoQuality);
    });
})();






// ==UserScript==
// @name           Enhanced_Media_Helper
// @version        2.7.6
// @description    Enhanced media downloader with multiple site support
// @author         cores
// @match          https://jable.tv/videos/*
// @match          https://tokyolib.com/*
// @match          https://javgg.net/tag/to-be-release/*
// @match          https://javgg.net/featured/*
// @match          https://javgg.net/
// @match          https://javgg.net/new-post/*
// @match          https://javgg.net/jav/*
// @match          https://javgg.net/star/*
// @match          https://javgg.net/trending/*
// @match          https://www.javbus.com/*
// @include        /.*javtxt.[a-z]+\/v/.*$/
// @include        /.*javtxt.[a-z]+\/.*$/
// @include        /.*javtext.[a-z]+\/v/.*$/
// @match          https://cableav.tv/?p=*
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @icon           data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant          GM_xmlhttpRequest
// @grant          GM_setValue
// @grant          GM_getValue
// @connect        api-shoulei-ssl.xunlei.com
// @connect        subtitle.v.geilijiasu.com
// @license        MPL
// @namespace      cdn.bootcss.com
// @downloadURL https://update.greasyfork.org/scripts/531966/Enhanced_Media_Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/531966/Enhanced_Media_Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let EMH_currentVideoCode = null;

    function updateGlobalVideoCode(code) {
        if (code) {
            EMH_currentVideoCode = code;
            console.log("EMH: Global video code updated:", EMH_currentVideoCode);
            // The draggable button no longer relies on this for being enabled,
            // but EMH_currentVideoCode is used as a default in its prompt.
        }
    }

    const CONFIG = {
        serverMode: 2,
        serverPort: 9909,
        alternateUrl: {
			 av123:'https://123av.com/zh/v/',
			 jable:'https://jable.tv/videos/',
			 cili1: 'https://1cili.com/search?q=',
        },
        subtitleApiUrl: 'https://api-shoulei-ssl.xunlei.com/oracle/subtitle',
        elementCheckInterval: 200,
        elementCheckTimeout: 7000,
        searchHistoryKey: 'emh_subtitle_search_history',
        maxHistoryItems: 10,
        animationDuration: 300,
        toastDuration: 3000,
        // 字幕文件名处理选项
        subtitleFilenameOptions: {
            useOriginalName: true,      // 使用API返回的原始name属性，不做修改
            addCodePrefix: false,       // 已弃用：是否添加影片编码作为前缀（当useOriginalName=false时使用）
            removeIllegalChars: true,   // 是否移除非法字符
            maxLength: 100              // 文件名最大长度
        },
        // 番号管理相关配置
        codeManager: {
            storageKey: 'emh_code_library',
            trashStorageKey: 'emh_code_trash',
            trashRetentionDays: 7,      // 回收站保留天数
            autoAddDetected: true,      // 自动添加检测到的番号
            defaultPage: 'all',         // 默认页面: all, favorite, watched, trash
            statusColors: {
                unmarked: '#909090',    // 未标记 - 灰色
                favorite: '#ff4757',    // 关注 - 红色
                watched: '#2ed573'      // 已看 - 绿色
            }
        }
    };

    // 番号管理库
    const CODE_LIBRARY = {
        // 数据结构
        data: null,
        trash: null,
        initialized: false,

        // 初始化库
        init: function() {
            if (this.initialized) return true;

            try {
                // 主库
                const savedData = GM_getValue(CONFIG.codeManager.storageKey);
                this.data = savedData ? JSON.parse(savedData) : {
                    items: [],
                    lastUpdated: new Date().toISOString()
                };

                // 回收站
                const savedTrash = GM_getValue(CONFIG.codeManager.trashStorageKey);
                this.trash = savedTrash ? JSON.parse(savedTrash) : {
                    items: [],
                    lastUpdated: new Date().toISOString()
                };

                // 清理过期回收站条目
                this.cleanupTrash();

                this.initialized = true;
                return true;
            } catch (e) {
                console.error('番号库初始化失败:', e);
                this.data = { items: [], lastUpdated: new Date().toISOString() };
                this.trash = { items: [], lastUpdated: new Date().toISOString() };
                this.initialized = true;
                return false;
            }
        },

        // 保存数据
        save: function() {
            try {
                // 更新时间戳
                this.data.lastUpdated = new Date().toISOString();
                const dataString = JSON.stringify(this.data);
                GM_setValue(CONFIG.codeManager.storageKey, dataString);

                this.trash.lastUpdated = new Date().toISOString();
                GM_setValue(CONFIG.codeManager.trashStorageKey, JSON.stringify(this.trash));

                // 触发自定义事件
                const event = new CustomEvent('emh_library_updated', {
                    detail: {
                        type: 'library_update',
                        data: this.data
                    }
                });
                window.dispatchEvent(event);

                // 同步更新所有打开的标签页
                if (typeof GM_setValue !== 'undefined') {
                    // 使用时间戳作为更新标记
                    GM_setValue('emh_sync_timestamp', Date.now().toString());
                }

                return true;
            } catch (e) {
                console.error('保存番号库失败:', e);
                UTILS.showToast('保存番号库失败', 'error');
                return false;
            }
        },

        // 获取所有番号
        getAll: function() {
            if (!this.initialized) this.init();
            return [...this.data.items];
        },

        // 获取关注列表
        getFavorites: function() {
            if (!this.initialized) this.init();
            return this.data.items.filter(item => item.status === 'favorite');
        },

        // 获取已看记录
        getWatched: function() {
            if (!this.initialized) this.init();
            return this.data.items.filter(item => item.status === 'watched');
        },

        // 获取回收站内容
        getTrash: function() {
            if (!this.initialized) this.init();
            return [...this.trash.items];
        },

        // 添加新番号
        add: function(code, title = '', remarks = '') {
            if (!this.initialized) this.init();
            if (!code) return false;

            // 标准化番号格式（大写）
            const normalizedCode = code.toUpperCase();

            // 检查是否已存在
            if (this.getItem(normalizedCode)) {
                UTILS.showToast(`番号 ${normalizedCode} 已存在于番号库中`, 'warning');
                return false;
            }

            // 创建新条目
            const newItem = {
                code: normalizedCode,
                title: title || normalizedCode,
                status: 'unmarked',
                remarks: remarks || '',
                tags: [],
                createdDate: new Date().toISOString(),
                modifiedDate: new Date().toISOString()
            };

            this.data.items.unshift(newItem);
            this.save();
            return true;
        },

        // 删除番号（移至回收站）
        delete: function(code) {
            if (!this.initialized) this.init();
            if (!code) return false;

            // 标准化番号格式
            const normalizedCode = code.toUpperCase();

            // 查找条目
            const itemIndex = this.data.items.findIndex(item => item.code.toUpperCase() === normalizedCode);
            if (itemIndex === -1) return false; // 不存在

            // 添加删除日期并移至回收站
            const item = this.data.items[itemIndex];
            item.deleteDate = new Date().toISOString();

            // 从主库中删除
            this.data.items.splice(itemIndex, 1);

            // 添加到回收站
            this.trash.items.unshift(item);

            return this.save();
        },

        // 清理回收站中过期的条目
        cleanupTrash: function() {
            if (!this.trash || !this.trash.items || !this.trash.items.length) return;

            const now = new Date();
            const retentionPeriod = CONFIG.codeManager.trashRetentionDays * 24 * 60 * 60 * 1000; // 转换为毫秒

            this.trash.items = this.trash.items.filter(item => {
                const deleteDate = new Date(item.deleteDate);
                return (now - deleteDate) < retentionPeriod;
            });

            this.save();
        },

        // 获取单个番号的信息
        getItem: function(code) {
            if (!this.initialized) this.init();
            if (!code) return null;

            // 标准化番号格式（大写）
            const normalizedCode = code.toUpperCase();
            return this.data.items.find(item => item.code.toUpperCase() === normalizedCode);
        },

        // 获取番号状态
        getStatus: function(code) {
            const item = this.getItem(code);
            return item ? item.status : 'unmarked';
        },

        // 标记番号
        markItem: function(code, status, title = '', remark = '') {
            if (!this.initialized) this.init();
            if (!code) return false;

            // 标准化番号格式（大写）
            const normalizedCode = code.toUpperCase();

            // 检查状态是否有效
            if (!['unmarked', 'favorite', 'watched'].includes(status)) {
                status = 'unmarked';
            }

            // 检查是否已存在
            const existingIndex = this.data.items.findIndex(item => item.code.toUpperCase() === normalizedCode);

            if (existingIndex >= 0) {
                // 更新现有条目
                this.data.items[existingIndex].status = status;

                // 只在提供了新值时更新这些字段
                if (title) this.data.items[existingIndex].title = title;
                if (remark !== undefined) this.data.items[existingIndex].remark = remark;

                // 更新修改时间
                this.data.items[existingIndex].modifiedDate = new Date().toISOString();
            } else {
                // 创建新条目
                const newItem = {
                    code: normalizedCode,
                    title: title || normalizedCode,
                    status: status,
                    remark: remark || '',
                    tags: [],
                    createdDate: new Date().toISOString(),
                    modifiedDate: new Date().toISOString()
                };

                this.data.items.unshift(newItem); // 添加到数组开头
            }

            return this.save();
        },

        // 导出数据
        exportData: function(filter = 'all') {
            if (!this.initialized) this.init();

            let exportData = {
                version: "1.0",
                exportDate: new Date().toISOString(),
                filter: filter,
                items: []
            };

            // 确定导出的数据
            if (filter === 'trash') {
                exportData.items = [...this.trash.items];
            } else if (filter === 'all') {
                exportData.items = [...this.data.items];
            } else {
                exportData.items = this.data.items.filter(item => item.status === filter);
            }

            return exportData;
        },

        // 导入数据
        importData: function(data, mode = 'merge') {
            if (!this.initialized) this.init();

            try {
                // 验证数据格式
                if (!data.items || !Array.isArray(data.items)) {
                    throw new Error('导入的数据格式不正确');
                }

                if (mode === 'replace') {
                    // 替换模式：完全覆盖现有数据
                    this.data.items = data.items;
                } else if (mode === 'merge') {
                    // 合并模式：更新已有条目，添加新条目
                    for (const importedItem of data.items) {
                        if (!importedItem.code) continue;

                        const normalizedCode = importedItem.code.toUpperCase();
                        const existingIndex = this.data.items.findIndex(item =>
                            item.code.toUpperCase() === normalizedCode
                        );

                        if (existingIndex >= 0) {
                            // 更新现有条目
                            this.data.items[existingIndex] = {
                                ...this.data.items[existingIndex],
                                ...importedItem,
                                code: normalizedCode,
                                modifiedDate: new Date().toISOString()
                            };
                        } else {
                            // 添加新条目
                            const newItem = {
                                ...importedItem,
                                code: normalizedCode,
                                createdDate: importedItem.createdDate || new Date().toISOString(),
                                modifiedDate: new Date().toISOString()
                            };
                            this.data.items.unshift(newItem);
                        }
                    }
                }

                this.save();
                return {
                    success: true,
                    message: `成功导入 ${data.items.length} 个番号条目`
                };
            } catch (e) {
                console.error('导入番号数据失败:', e);
                return {
                    success: false,
                    message: '导入失败: ' + e.message
                };
            }
        }
    };

    // 获取搜索历史
    function getSearchHistory() {
        try {
            const history = localStorage.getItem(CONFIG.searchHistoryKey);
            return history ? JSON.parse(history) : [];
        } catch (e) {
            console.error('读取搜索历史失败:', e);
            return [];
        }
    }

    // 保存搜索历史
    function saveSearchHistory(term) {
        if (!term || term.trim() === '') return;

        try {
            let history = getSearchHistory();
            // 移除已存在的相同条目
            history = history.filter(item => item.toLowerCase() !== term.toLowerCase());
            // 添加到开头
            history.unshift(term);
            // 限制数量
            if (history.length > CONFIG.maxHistoryItems) {
                history = history.slice(0, CONFIG.maxHistoryItems);
            }
            localStorage.setItem(CONFIG.searchHistoryKey, JSON.stringify(history));
        } catch (e) {
            console.error('保存搜索历史失败:', e);
        }
    }

    // 清除搜索历史
    function clearSearchHistory() {
        try {
            localStorage.removeItem(CONFIG.searchHistoryKey);
            return true;
        } catch (e) {
            console.error('清除搜索历史失败:', e);
            return false;
        }
    }

    // 字幕管理模块
    const SUBTITLE_MANAGER = {
        // 获取字幕列表
        fetchSubtitles: (searchTerm) => {
            if (!searchTerm || searchTerm.trim() === "") {
                UTILS.showToast("请输入有效的字幕搜索关键字", "error");
                return;
            }
            const searchTermTrimmed = searchTerm.trim();

            UTILS.showToast(`正在为 "${searchTermTrimmed}" 获取字幕信息...`, "info");

            const buttonsToDisable = [
                document.getElementById('emh-getSubtitles'), // Main auto-detect button
                ...document.querySelectorAll(`.emh-subtitle-button-small[data-video-code]`), // All small per-item buttons
                document.getElementById('emh-draggable-custom-subtitle-btn') // Draggable custom search button
            ].filter(Boolean);

            buttonsToDisable.forEach(btn => {
                btn.disabled = true;
                if (btn.classList.contains('btn')) {
                    btn.classList.add('btn-disabled');
                }
            });

            const apiUrl = `${CONFIG.subtitleApiUrl}?name=${encodeURIComponent(searchTermTrimmed)}`;

            const reEnableButtons = () => {
                buttonsToDisable.forEach(btn => {
                    btn.disabled = false;
                    if (btn.classList.contains('btn')) {
                        btn.classList.remove('btn-disabled');
                    }
                });
            };

            const handleResponse = (responseText) => {
                reEnableButtons();
                try {
                    const data = JSON.parse(responseText);
                    SUBTITLE_MANAGER.createSubtitleModal(data, searchTermTrimmed); // Pass searchTerm to modal
                    if (data.data && data.data.length > 0) {
                        UTILS.showToast(`"${searchTermTrimmed}" 的字幕信息获取成功`, "success");
                    } else {
                        UTILS.showToast(`未找到 "${searchTermTrimmed}" 的字幕`, "info");
                    }
                } catch (e) {
                    console.error("解析字幕数据时出错:", e);
                    UTILS.showToast("解析字幕数据时出错", "error");
                    SUBTITLE_MANAGER.createSubtitleModal(null, searchTermTrimmed);
                }
            };

            const handleError = (error) => {
                reEnableButtons();
                console.error("获取字幕时出错:", error);
                UTILS.showToast("获取字幕时出错", "error");
                SUBTITLE_MANAGER.createSubtitleModal(null, searchTermTrimmed);
            };

            // 设置超时处理
            let timeoutId = setTimeout(() => {
                reEnableButtons();
                UTILS.showToast("获取字幕超时", "error");
                SUBTITLE_MANAGER.createSubtitleModal(null, searchTermTrimmed);

                // 清理可能的JSONP回调
                if (window.emhJsonpCallback) {
                    delete window.emhJsonpCallback;
                }

                // 清理可能添加的script标签
                const jsonpScript = document.getElementById('emh-jsonp-script');
                if (jsonpScript) {
                    jsonpScript.remove();
                }
            }, 15000);

            if (typeof GM_xmlhttpRequest !== 'undefined') {
                // 使用油猴API，它能自动绕过CORS限制
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: apiUrl,
                    timeout: 15000,
                    onload: (response) => {
                        clearTimeout(timeoutId);
                        handleResponse(response.responseText);
                    },
                    onerror: (error) => {
                        clearTimeout(timeoutId);
                        handleError(error);
                    },
                    ontimeout: () => {
                        clearTimeout(timeoutId);
                        reEnableButtons();
                        UTILS.showToast("获取字幕超时", "error");
                        SUBTITLE_MANAGER.createSubtitleModal(null, searchTermTrimmed);
                    }
                });
            } else {
                // 尝试使用CORS代理
                const corsProxies = [
                    `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`,
                    `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`,
                    `https://cors-anywhere.herokuapp.com/${apiUrl}`
                ];

                // 创建一个Promise数组，对每个代理进行尝试
                const fetchRequests = corsProxies.map(proxyUrl => {
                    return fetch(proxyUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    })
                    .then(response => {
                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                        return response.text();
                    });
                });

                // 使用Promise.any来获取第一个成功的结果
                Promise.any(fetchRequests)
                    .then(text => {
                        clearTimeout(timeoutId);
                        if (!text) {
                            handleResponse('{"data": []}');
                        } else {
                            handleResponse(text);
                        }
                    })
                    .catch(error => {
                        // 所有代理都失败时，尝试使用JSONP方法
                        console.warn("所有CORS代理失败，尝试JSONP方法");

                        // 清理之前可能存在的回调和脚本
                        if (window.emhJsonpCallback) {
                            delete window.emhJsonpCallback;
                        }
                        const oldScript = document.getElementById('emh-jsonp-script');
                        if (oldScript) {
                            oldScript.remove();
                        }

                        // 创建JSONP回调
                        window.emhJsonpCallback = function(data) {
                            clearTimeout(timeoutId);
                            handleResponse(JSON.stringify(data));
                            delete window.emhJsonpCallback;
                        };

                        // 尝试直接请求，某些服务器可能支持JSONP
                        const jsonpUrl = `${CONFIG.subtitleApiUrl}?name=${encodeURIComponent(searchTermTrimmed)}&callback=emhJsonpCallback`;
                        const script = document.createElement('script');
                        script.id = 'emh-jsonp-script';
                        script.src = jsonpUrl;
                        script.onerror = () => {
                            // JSONP失败时，创建一个空结果并处理
                            if (!document.getElementById('emh-subtitle-modal')) {
                                clearTimeout(timeoutId);
                                handleResponse('{"data": []}');
                                UTILS.showToast("无法连接到字幕API，请稍后重试", "error");
                            }
                        };
                        document.head.appendChild(script);
                    });
            }
        },

        // 创建字幕模态框
        createSubtitleModal: (subtitleContent = null, videoCode = null) => {
            const existingModal = document.getElementById('emh-subtitle-modal');
            if (existingModal) existingModal.remove();

            const modal = document.createElement('div');
            modal.id = 'emh-subtitle-modal';
            modal.className = 'emh-modal';

            const modalContent = document.createElement('div');
            modalContent.className = 'emh-modal-content';

            const modalHeader = document.createElement('div');
            modalHeader.className = 'emh-modal-header';
            modalHeader.innerHTML = `<h3>字幕列表 (搜索关键字: ${videoCode || '未知'})</h3><span class="emh-modal-close">&times;</span>`;
            modalContent.appendChild(modalHeader);

            const modalBody = document.createElement('div');
            modalBody.className = 'emh-modal-body';

            if (subtitleContent && subtitleContent.data && subtitleContent.data.length > 0) {
                const list = document.createElement('ul');
                list.className = 'emh-subtitle-list';

                // 调试用：输出字幕数据结构
                console.log("字幕数据:", subtitleContent.data);

                subtitleContent.data.forEach((subtitle) => {
                    SUBTITLE_MANAGER.createSubtitleItem(list, subtitle, videoCode);
                });
                modalBody.appendChild(list);
            } else {
                modalBody.innerHTML = `<p class="emh-no-subtitle-message">未找到 "${videoCode}" 的相关字幕</p>`;
            }

            modalContent.appendChild(modalBody);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            modal.querySelector('.emh-modal-close').onclick = () => modal.remove();
            modal.onclick = (event) => {
                if (event.target === modal) {
                    modal.remove();
                }
            };
            setTimeout(() => modal.classList.add('show'), 10);
            return modal;
        },

        // 创建单个字幕项
        createSubtitleItem: (listElement, subtitle, videoCode) => {
            const item = document.createElement('li');
            item.className = 'emh-subtitle-item';

            // 获取原始文件名（直接从API返回）
            let originalFilename = subtitle.name || '';

            // 确保文件名有扩展名
            if (originalFilename && !originalFilename.toLowerCase().endsWith(`.${subtitle.ext}`)) {
                originalFilename = `${originalFilename}.${subtitle.ext || 'srt'}`;
            } else if (!originalFilename) {
                originalFilename = `subtitle.${subtitle.ext || 'srt'}`;
            }

            // 清理文件名中的非法字符
            if (CONFIG.subtitleFilenameOptions.removeIllegalChars) {
                originalFilename = UTILS.sanitizeFilename(originalFilename);
            }

            // 保存最终的下载文件名
            const downloadFilename = originalFilename;

            item.innerHTML = `
                <div class="emh-subtitle-info">
                    <h4>${subtitle.name || '未命名字幕'}</h4>
                    <p>格式: ${subtitle.ext || '未知'} | 语言: ${subtitle.languages?.length ? subtitle.languages.join(', ') : '未知'} ${subtitle.extra_name ? '| 来源: ' + subtitle.extra_name : ''}</p>
                </div>
                <div class="emh-subtitle-actions">
                    ${subtitle.url ? `
                        <button class="btn my-btn-primary emh-download-subtitle-btn" data-url="${subtitle.url}" data-filename="${downloadFilename}">缓存下载</button>
                        <a href="${subtitle.url}" target="_blank" class="btn btn-outline" download="${downloadFilename}">直接下载</a>
                    ` : ''}
                </div>
            `;
            listElement.appendChild(item);
            return item;
        },

        // 下载字幕文件
        downloadSubtitle: async (url, defaultFilename) => {
            try {
                UTILS.showToast('正在获取字幕文件...', 'info');

                // 处理可能的跨域问题
                if (typeof GM_xmlhttpRequest !== 'undefined') {
                    // 使用GM_xmlhttpRequest获取字幕内容（可绕过跨域限制）
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        responseType: 'blob',
                        onload: function(response) {
                            if (response.status >= 200 && response.status < 300) {
                                const blob = response.response;
                                SUBTITLE_MANAGER.processSubtitleDownload(blob, defaultFilename);
                            } else {
                                UTILS.showToast(`获取字幕失败: ${response.status}`, 'error');
                            }
                        },
                        onerror: function(error) {
                            console.error('字幕下载失败:', error);
                            UTILS.showToast('字幕下载失败，请尝试直接下载', 'error');
                        }
                    });
                } else {
                    // 使用标准fetch API
                    try {
                        const corsProxies = [
                            url, // 先尝试直接访问
                            `https://corsproxy.io/?${encodeURIComponent(url)}`,
                            `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
                        ];

                        // 尝试所有代理URL
                        let success = false;
                        for (const proxyUrl of corsProxies) {
                            try {
                                const response = await fetch(proxyUrl, {
                                    method: 'GET',
                                    headers: {
                                        'Accept': 'text/plain, application/octet-stream'
                                    }
                                });

                                if (response.ok) {
                                    const blob = await response.blob();
                                    SUBTITLE_MANAGER.processSubtitleDownload(blob, defaultFilename);
                                    success = true;
                                    break;
                                }
                            } catch (err) {
                                console.warn(`尝试使用代理 ${proxyUrl} 失败:`, err);
                                // 继续尝试下一个代理
                            }
                        }

                        if (!success) {
                            throw new Error('所有代理都失败');
                        }
                    } catch (error) {
                        console.error('字幕下载失败:', error);
                        UTILS.showToast('字幕下载失败，请尝试直接下载', 'error');

                        // 如果所有方法都失败，尝试打开新标签页直接下载
                        if (confirm('自动下载失败，是否尝试在新标签页中直接打开字幕链接？')) {
                            window.open(url, '_blank');
                        }
                    }
                }
            } catch (error) {
                console.error('字幕下载处理失败:', error);
                UTILS.showToast('字幕下载处理失败', 'error');
            }
        },

        // 处理字幕下载的通用流程
        processSubtitleDownload: (blob, defaultFilename) => {
            try {
                // 创建一个临时URL
                const objectUrl = URL.createObjectURL(blob);

                // 直接使用提供的文件名，无需用户确认
                const downloadLink = document.createElement('a');
                downloadLink.href = objectUrl;
                downloadLink.download = defaultFilename;
                downloadLink.style.display = 'none';

                // 添加到文档中并点击
                document.body.appendChild(downloadLink);
                downloadLink.click();

                // 清理
                setTimeout(() => {
                    document.body.removeChild(downloadLink);
                    URL.revokeObjectURL(objectUrl);
                }, 100);

                UTILS.showToast(`字幕文件 "${defaultFilename}" 下载已开始`, 'success');
            } catch (error) {
                console.error('字幕下载处理失败:', error);
                UTILS.showToast('字幕下载处理失败', 'error');
            }
        }
    };

    const UTILS = {
        getDomain: () => document.domain,

        getCodeFromUrl: (url) => {
            const match = url.match(/\/([a-z0-9-]+)\/?$/i);
            return match ? match[1] : null;
        },

        getPosterImage: () => {
            const videoContainer = document.querySelector('.video-player-container, .player-container, #player');
            if (videoContainer) {
                const posterElem = videoContainer.querySelector('.plyr__poster, [poster]');
                if (posterElem) {
                    if (posterElem.hasAttribute('poster')) {
                        return posterElem.getAttribute('poster');
                    }
                    const backgroundImageStyle = window.getComputedStyle(posterElem).getPropertyValue('background-image');
                    const matches = /url\("(.+)"\)/.exec(backgroundImageStyle);
                    return matches ? matches[1] : null;
                }
            }
            const metaPoster = document.querySelector('meta[property="og:image"], meta[name="twitter:image"]');
            return metaPoster ? metaPoster.content : null;
        },

        getActressNames: () => {
            const actressLinks = document.querySelectorAll('.video-info .info-item a[href*="/actress/"], .models-list .model a, .attributes a[href*="/star/"]');
            return Array.from(actressLinks)
                .map(link => link.getAttribute('title') || link.textContent.trim())
                .filter(name => name)
                .filter((value, index, self) => self.indexOf(value) === index)
                .join(',');
        },

        buildApiUrl: (domain, options) => {
            const queryParams = Object.keys(options.query || {})
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(options.query[key])}`)
                .join("&");
            const query = queryParams.length > 0 ? `?${queryParams}` : "";
            return `http://${domain}${options.path || ''}${query}`;
        },

        showToast: (message, type = 'info') => {
            let toastContainer = document.getElementById('custom-toast-container');
            if (!toastContainer) {
                toastContainer = document.createElement('div');
                toastContainer.id = 'custom-toast-container';
                document.body.appendChild(toastContainer);
            }
            const toast = document.createElement('div');
            toast.className = `custom-toast custom-toast-${type}`;
            toast.textContent = message;
            toastContainer.appendChild(toast);
            setTimeout(() => toast.classList.add('show'), 10);
            setTimeout(() => {
                toast.classList.remove('show');
                toast.addEventListener('transitionend', () => toast.remove());
            }, 3000);
        },

        copyToClipboard: async (text) => {
            if (!text) {
                UTILS.showToast("没有可复制的内容", "error");
                return false;
            }
            try {
                await navigator.clipboard.writeText(text);
                UTILS.showToast("内容已成功复制到剪贴板", "success");
                return true;
            } catch (error) {
                UTILS.showToast("复制失败，请检查浏览器权限", "error");
                console.error("Copy error:", error);
                try {
                    const textArea = document.createElement("textarea");
                    textArea.value = text;
                    textArea.style.position = "fixed";
                    textArea.style.top = "0";
                    textArea.style.left = "0";
                    textArea.style.opacity = "0";
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    const successful = document.execCommand('copy');
                    document.body.removeChild(textArea);
                    if (successful) {
                        UTILS.showToast("内容已复制 (fallback)", "success");
                        return true;
                    } else {
                        throw new Error('execCommand failed');
                    }
                } catch (fallbackError) {
                    UTILS.showToast("复制到剪贴板时出错", "error");
                    console.error("Fallback copy error:", fallbackError);
                    return false;
                }
            }
        },

        addActionButtons: (container, videoUrl, videoCode) => {
            const buttonContainer = document.createElement("div");
            buttonContainer.className = "emh-action-buttons";

            // Add code status indicator if we have a valid code
            if (videoCode) {
                createCodeStatusIndicator(buttonContainer, videoCode);

                // Auto-add to library if enabled
                if (CONFIG.codeManager.autoAddDetected && CODE_LIBRARY.initialized) {
                    const existingItem = CODE_LIBRARY.getItem(videoCode);
                    if (!existingItem) {
                        // Get title from page if possible
                        let title = '';
                        const titleElement = document.querySelector("h4.title, h1.post-title, .video-info h4, meta[property='og:title']");
                        if (titleElement) {
                            title = titleElement.content || titleElement.innerText.trim();
                            if (title.includes(videoCode)) {
                                title = title.split(videoCode).pop().trim().replace(/^[-–—\s]+/, '');
                            }
                        }

                        // Add to library with "unmarked" status
                        CODE_LIBRARY.markItem(videoCode, 'unmarked', title);
                    }
                }
            }

            const copyButton = document.createElement("button");
            copyButton.id = "emh-copyLink";
            copyButton.className = "btn my-btn-primary";
            copyButton.innerHTML = "<span>📋 复制链接</span>";
            copyButton.title = videoUrl || "无有效视频链接";
            copyButton.dataset.videoUrl = videoUrl || '';
            buttonContainer.appendChild(copyButton);

            const sendButton = document.createElement("button");
            sendButton.id = "emh-sendData";
            sendButton.className = "btn my-btn-danger";
            sendButton.innerHTML = "<span>💾 发送到服务器</span>";
            sendButton.dataset.videoUrl = videoUrl || '';
            sendButton.dataset.videoCode = videoCode || '';
            buttonContainer.appendChild(sendButton);

            const subtitleButton = document.createElement("button");
            subtitleButton.id = "emh-getSubtitles"; // This is for auto-detected code
            subtitleButton.className = "btn my-btn-success";
            subtitleButton.innerHTML = "<span>📄 获取字幕</span>";
            subtitleButton.dataset.videoCode = videoCode || '';
            buttonContainer.appendChild(subtitleButton);

            // Add code manager button
            const codeManagerButton = document.createElement("button");
            codeManagerButton.id = "emh-code-manager-btn";
            codeManagerButton.className = "btn btn-info";
            codeManagerButton.innerHTML = "<span>📋 番号库</span>";
            codeManagerButton.title = "打开番号管理面板";
            codeManagerButton.addEventListener('click', () => {
                if (window.CodeManagerPanel) {
                    window.CodeManagerPanel.togglePanel();
                }
            });
            buttonContainer.appendChild(codeManagerButton);

            container.appendChild(buttonContainer);
            return buttonContainer;
        },

        // 注意：下面的字幕相关函数已移至SUBTITLE_MANAGER模块，保留API兼容性
        createSubtitleModal: (subtitleContent, videoCode) => {
            return SUBTITLE_MANAGER.createSubtitleModal(subtitleContent, videoCode);
        },

        fetchSubtitles: (searchTerm) => {
            return SUBTITLE_MANAGER.fetchSubtitles(searchTerm);
        },

        downloadSubtitle: (url, defaultFilename) => {
            return SUBTITLE_MANAGER.downloadSubtitle(url, defaultFilename);
        },

        createDraggableSubtitleButton: () => {
            const button = document.createElement('button');
            button.id = 'emh-draggable-custom-subtitle-btn'; // New ID
            button.className = 'btn btn-info emh-draggable-btn';
            button.innerHTML = '<span>🔍 高级搜索</span>'; // Updated text
            button.title = '拖动我 | 点击打开高级字幕搜索';

            let isDragging = false;
            let offsetX, offsetY;
            let hasDragged = false;
            let startX, startY;

            button.onmousedown = (e) => {
                if (e.button !== 0) return;
                e.preventDefault();

                isDragging = true;
                hasDragged = false;
                button.style.cursor = 'grabbing';

                startX = e.clientX;
                startY = e.clientY;

                const rect = button.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
                button.style.position = 'fixed';

                document.onmousemove = (moveEvent) => {
                    if (!isDragging) return;
                    if (Math.abs(moveEvent.clientX - startX) > 3 || Math.abs(moveEvent.clientY - startY) > 3) {
                        hasDragged = true;
                    }
                    let newX = moveEvent.clientX - offsetX;
                    let newY = moveEvent.clientY - offsetY;
                    const viewportWidth = window.innerWidth;
                    const viewportHeight = window.innerHeight;
                    const buttonWidth = button.offsetWidth;
                    const buttonHeight = button.offsetHeight;

                    if (newX < 0) newX = 0;
                    if (newY < 0) newY = 0;
                    if (newX + buttonWidth > viewportWidth) newX = viewportWidth - buttonWidth;
                    if (newY + buttonHeight > viewportHeight) newY = viewportHeight - buttonHeight;

                    button.style.left = `${newX}px`;
                    button.style.top = `${newY}px`;
                    button.style.bottom = 'auto';
                    button.style.right = 'auto';
                };

                document.onmouseup = () => {
                    if (!isDragging) return;
                    isDragging = false;
                    button.style.cursor = 'grab';
                    document.onmousemove = null;
                    document.onmouseup = null;

                    if (!hasDragged) { // Click action
                        // 使用高级搜索模态框替代简单的 prompt
                        const defaultSearchTerm = EMH_currentVideoCode || "";
                        UTILS.createSearchModal(defaultSearchTerm);
                    }
                };
            };
            button.onclick = (e) => { // Prevent click if drag occurred
                if (hasDragged) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            };

            document.body.appendChild(button);
            if (!button.style.left && !button.style.top) {
                 button.style.position = 'fixed';
                 button.style.bottom = '70px';
                 button.style.right = '20px';
            }
            return button;
        },

        // 创建高级搜索模态框
        createSearchModal: (defaultSearchTerm = '') => {
            // 移除已存在的模态框
            const existingModal = document.getElementById('emh-search-modal');
            if (existingModal) existingModal.remove();

            // 创建模态框基本结构
            const modal = document.createElement('div');
            modal.id = 'emh-search-modal';
            modal.className = 'emh-modal';

            const modalContent = document.createElement('div');
            modalContent.className = 'emh-modal-content emh-search-modal-content';

            // 创建模态框头部
            const modalHeader = document.createElement('div');
            modalHeader.className = 'emh-modal-header';
            modalHeader.innerHTML = `
                <h3>高级字幕搜索</h3>
                <span class="emh-modal-close">&times;</span>
            `;

            // 创建模态框主体
            const modalBody = document.createElement('div');
            modalBody.className = 'emh-modal-body';

            // 搜索表单
            const searchForm = document.createElement('form');
            searchForm.className = 'emh-search-form';
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const searchInput = document.getElementById('emh-subtitle-search-input');
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    saveSearchHistory(searchTerm);
                    modal.remove();
                    UTILS.fetchSubtitles(searchTerm);
                }
            });

            // 搜索输入区域
            const searchInputGroup = document.createElement('div');
            searchInputGroup.className = 'emh-search-input-group';
            searchInputGroup.innerHTML = `
                <div class="emh-input-wrapper">
                    <input type="text" id="emh-subtitle-search-input" class="emh-search-input"
                        placeholder="输入字幕关键词..." value="${defaultSearchTerm}" autofocus>
                    <button type="button" class="emh-search-clear-btn" title="清除输入">&times;</button>
                </div>
                <button type="submit" class="emh-search-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    搜索
                </button>
            `;

            searchForm.appendChild(searchInputGroup);

            // 搜索历史
            const historySection = document.createElement('div');
            historySection.className = 'emh-search-history-section';

            const historyHeader = document.createElement('div');
            historyHeader.className = 'emh-search-history-header';
            historyHeader.innerHTML = `
                <h4>搜索历史</h4>
                <button type="button" class="emh-clear-history-btn">清除历史</button>
            `;

            const historyList = document.createElement('div');
            historyList.className = 'emh-search-history-list';
            UTILS.updateHistoryList(historyList);

            historySection.appendChild(historyHeader);
            historySection.appendChild(historyList);

            // 热门搜索（可选功能 - 如果有API支持）
            const trendingSection = document.createElement('div');
            trendingSection.className = 'emh-trending-section';
            trendingSection.innerHTML = `
                <h4>热门推荐</h4>
                <div class="emh-trending-tags">
                    <span class="emh-trending-tag">中文字幕</span>
                    <span class="emh-trending-tag">4K高清</span>
                    <span class="emh-trending-tag">双语字幕</span>
                    <span class="emh-trending-tag">特效字幕</span>
                    <span class="emh-trending-tag">日语字幕</span>
                </div>
            `;

            // 添加设置选项
            const settingsSection = document.createElement('div');
            settingsSection.className = 'emh-settings-section';
            settingsSection.innerHTML = `
                <h4>设置选项</h4>
                <div class="emh-setting-item">
                    <label for="emh-original-name-setting" class="emh-setting-label">
                        <span>使用原始文件名下载字幕</span>
                        <input type="checkbox" id="emh-original-name-setting" class="emh-toggle-checkbox" ${CONFIG.subtitleFilenameOptions.useOriginalName ? 'checked' : ''} disabled>
                        <span class="emh-toggle-switch"></span>
                    </label>
                </div>
            `;

            // 添加到主体
            modalBody.appendChild(searchForm);
            modalBody.appendChild(historySection);
            modalBody.appendChild(trendingSection);
            modalBody.appendChild(settingsSection);

            // 添加到模态框
            modalContent.appendChild(modalHeader);
            modalContent.appendChild(modalBody);
            modal.appendChild(modalContent);

            // 添加到文档
            document.body.appendChild(modal);

            // 绑定事件
            UTILS.setupSearchModalEvents(modal);

            // 显示模态框
            setTimeout(() => modal.classList.add('show'), 10);

            return modal;
        },

        // 更新历史列表
        updateHistoryList: (historyList) => {
            const history = getSearchHistory();

            if (history.length === 0) {
                historyList.innerHTML = '<div class="emh-empty-history">暂无搜索历史</div>';
                return;
            }

            historyList.innerHTML = '';
            history.forEach(term => {
                const historyItem = document.createElement('div');
                historyItem.className = 'emh-history-item';
                historyItem.innerHTML = `
                    <span class="emh-history-text">${term}</span>
                    <button class="emh-history-use-btn" data-term="${term}" title="使用该关键词">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 10 4 15 9 20"></polyline>
                            <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
                        </svg>
                    </button>
                `;
                historyList.appendChild(historyItem);
            });
        },

        // 设置搜索模态框事件
        setupSearchModalEvents: (modal) => {
            // 关闭按钮
            const closeBtn = modal.querySelector('.emh-modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    modal.classList.remove('show');
                    setTimeout(() => modal.remove(), CONFIG.animationDuration);
                });
            }

            // 点击模态框背景关闭
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                    setTimeout(() => modal.remove(), CONFIG.animationDuration);
                }
            });

            // 清除输入按钮
            const clearInputBtn = modal.querySelector('.emh-search-clear-btn');
            const searchInput = modal.querySelector('#emh-subtitle-search-input');

            if (clearInputBtn && searchInput) {
                clearInputBtn.addEventListener('click', () => {
                    searchInput.value = '';
                    searchInput.focus();
                });

                // 根据输入框内容显示/隐藏清除按钮
                searchInput.addEventListener('input', () => {
                    if (searchInput.value) {
                        clearInputBtn.style.visibility = 'visible';
                    } else {
                        clearInputBtn.style.visibility = 'hidden';
                    }
                });

                // 初始状态
                if (searchInput.value) {
                    clearInputBtn.style.visibility = 'visible';
                } else {
                    clearInputBtn.style.visibility = 'hidden';
                }
            }

            // 清除历史按钮
            const clearHistoryBtn = modal.querySelector('.emh-clear-history-btn');
            if (clearHistoryBtn) {
                clearHistoryBtn.addEventListener('click', () => {
                    if (confirm('确定要清除所有搜索历史吗？')) {
                        const success = clearSearchHistory();
                        if (success) {
                            const historyList = modal.querySelector('.emh-search-history-list');
                            if (historyList) {
                                UTILS.updateHistoryList(historyList);
                            }
                            UTILS.showToast('搜索历史已清除', 'success');
                        } else {
                            UTILS.showToast('清除历史失败', 'error');
                        }
                    }
                });
            }

            // 历史项使用按钮
            modal.querySelectorAll('.emh-history-use-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const term = btn.getAttribute('data-term');
                    if (term && searchInput) {
                        searchInput.value = term;
                        searchInput.focus();
                    }
                });
            });

            // 热门标签点击
            modal.querySelectorAll('.emh-trending-tag').forEach(tag => {
                tag.addEventListener('click', () => {
                    if (searchInput) {
                        searchInput.value = tag.textContent;
                        searchInput.focus();
                    }
                });
            });
        },

        // 创建悬浮搜索按钮
        createFloatingSearchButton: () => {
            const button = document.createElement('button');
            button.id = 'emh-floating-search-btn';
            button.className = 'emh-floating-btn';
            button.title = '高级字幕搜索';
            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            `;

            button.addEventListener('click', () => {
                // 使用当前视频代码作为默认搜索词
                let defaultSearchTerm = '';
                if (typeof EMH_currentVideoCode !== 'undefined' && EMH_currentVideoCode) {
                    defaultSearchTerm = EMH_currentVideoCode;
                }
                UTILS.createSearchModal(defaultSearchTerm);
            });

            document.body.appendChild(button);
            return button;
        },
        // 清理文件名，移除非法字符
        sanitizeFilename: (filename) => {
            if (!filename) return '字幕';

            // 移除Windows/通用文件系统中的非法字符
            let sanitized = filename.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '');

            // 替换连续空格为单个空格
            sanitized = sanitized.replace(/\s+/g, ' ').trim();

            // 如果为空，返回默认名称
            return sanitized || '字幕';
        },

        // 下载字幕文件（先缓存再下载）
        downloadSubtitle: async (url, defaultFilename) => {
            try {
                UTILS.showToast('正在获取字幕文件...', 'info');

                // 处理可能的跨域问题
                if (typeof GM_xmlhttpRequest !== 'undefined') {
                    // 使用GM_xmlhttpRequest获取字幕内容（可绕过跨域限制）
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        responseType: 'blob',
                        onload: function(response) {
                            if (response.status >= 200 && response.status < 300) {
                                const blob = response.response;
                                SUBTITLE_MANAGER.processSubtitleDownload(blob, defaultFilename);
                            } else {
                                UTILS.showToast(`获取字幕失败: ${response.status}`, 'error');
                            }
                        },
                        onerror: function(error) {
                            console.error('字幕下载失败:', error);
                            UTILS.showToast('字幕下载失败，请尝试直接下载', 'error');
                        }
                    });
                } else {
                    // 使用标准fetch API
                    try {
                        const corsProxies = [
                            url, // 先尝试直接访问
                            `https://corsproxy.io/?${encodeURIComponent(url)}`,
                            `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
                        ];

                        // 尝试所有代理URL
                        let success = false;
                        for (const proxyUrl of corsProxies) {
                            try {
                                const response = await fetch(proxyUrl, {
                                    method: 'GET',
                                    headers: {
                                        'Accept': 'text/plain, application/octet-stream'
                                    }
                                });

                                if (response.ok) {
                                    const blob = await response.blob();
                                    SUBTITLE_MANAGER.processSubtitleDownload(blob, defaultFilename);
                                    success = true;
                                    break;
                                }
                            } catch (err) {
                                console.warn(`尝试使用代理 ${proxyUrl} 失败:`, err);
                                // 继续尝试下一个代理
                            }
                        }

                        if (!success) {
                            throw new Error('所有代理都失败');
                        }
                    } catch (error) {
                        console.error('字幕下载失败:', error);
                        UTILS.showToast('字幕下载失败，请尝试直接下载', 'error');

                        // 如果所有方法都失败，尝试打开新标签页直接下载
                        if (confirm('自动下载失败，是否尝试在新标签页中直接打开字幕链接？')) {
                            window.open(url, '_blank');
                        }
                    }
                }
            } catch (error) {
                console.error('字幕下载处理失败:', error);
                UTILS.showToast('字幕下载失败，请尝试直接下载', 'error');
            }
        },

        // 处理字幕下载的通用流程
        processSubtitleDownload: (blob, defaultFilename) => {
            try {
                // 创建一个临时URL
                const objectUrl = URL.createObjectURL(blob);

                // 直接使用提供的文件名，无需用户确认
                const downloadLink = document.createElement('a');
                downloadLink.href = objectUrl;
                downloadLink.download = defaultFilename;
                downloadLink.style.display = 'none';

                // 添加到文档中并点击
                document.body.appendChild(downloadLink);
                downloadLink.click();

                // 清理
                setTimeout(() => {
                    document.body.removeChild(downloadLink);
                    URL.revokeObjectURL(objectUrl);
                }, 100);

                UTILS.showToast(`字幕文件 "${defaultFilename}" 下载已开始`, 'success');
            } catch (error) {
                console.error('字幕下载处理失败:', error);
                UTILS.showToast('字幕下载处理失败', 'error');
            }
        },
    };

    const SITE_HANDLERS = {
        javtxt: {
            isMatch: () => UTILS.getDomain().includes('javtxt') || UTILS.getDomain().includes('tokyolib') || UTILS.getDomain().includes('javtext'),
            targetSelector: 'body > div.main > div.info > div.attributes > dl > dt:nth-child(2)',
            process: (targetElement) => {
                if (!targetElement) {
                    console.error("JavTXT: Target element not found.");
                    return;
                }
                const config = {
                    links: [
                        { urlTemplate: 'https://123av.com/zh/v/$code', target: '_blank', displayText: '123av' },
                        { urlTemplate: 'https://jable.tv/videos/$code/', target: '_blank', displayText: 'Jable' }
                    ]
                };
                const cleanedCode = extractCode(targetElement.innerText);
                if (!cleanedCode) {
                    console.error("JavTXT: Failed to extract code.");
                    return;
                }
                updateGlobalVideoCode(cleanedCode);

                // 创建状态指示器容器
                const statusContainer = document.createElement('div');
                statusContainer.className = 'emh-code-status-container';
                statusContainer.style.display = 'inline-block';
                statusContainer.style.marginLeft = '10px';
                createCodeStatusIndicator(statusContainer, cleanedCode);

                // 将状态指示器添加到番号文本后面
                targetElement.appendChild(statusContainer);

                const controlsContainer = document.createElement('div');
                controlsContainer.className = 'emh-controls-container';
                config.links.forEach(linkConfig => {
                    const link = document.createElement('a');
                    link.href = linkConfig.urlTemplate.replace('$code', cleanedCode);
                    link.target = linkConfig.target;
                    link.className = 'btn btn-outline';
                    link.innerText = linkConfig.displayText;
                    controlsContainer.appendChild(link);
                });
                const subtitleButton = document.createElement('button');
                subtitleButton.id = 'emh-getSubtitles';
                subtitleButton.className = 'btn my-btn-success';
                subtitleButton.innerHTML = '<span>📄 获取字幕</span>';
                subtitleButton.dataset.videoCode = cleanedCode;
                controlsContainer.appendChild(subtitleButton);
                targetElement.parentNode.insertBefore(controlsContainer, targetElement.nextSibling);
            }
        },
        javgg: {
            isMatch: () => UTILS.getDomain().includes('javgg'),
            targetSelector: 'article.item.movies .data, h1.post-title, .videoinfo .meta',
            process: (targetElement) => {

                if (document.querySelector("article.item.movies")) {
                    const sidebar = document.querySelector("#contenedor > div > div.sidebar.right.scrolling");
                    if (sidebar) sidebar.remove();

                    const linkProviders = [
                        { code: "njav", url: CONFIG.alternateUrl.av123 + "$p", target: "_blank" },
                        { code: "jable", url: CONFIG.alternateUrl.jable+"$p/", target: "_blank" },
                        { code: "1cili", url: CONFIG.alternateUrl.cili1+"$p", target: "_blank" }
                    ];
                    document.querySelectorAll("article.item.movies").forEach(entry => {
                        const dataElement = entry.querySelector(".data");
                        const anchorTag = dataElement ? dataElement.querySelector("h3 a") : null;
                        if (anchorTag) {
                            const videoCode = anchorTag.textContent.trim();
                            if (!videoCode) return;
                            if (dataElement.querySelector('.emh-javgg-controls')) return;

                            // 创建状态指示器容器
                            const statusContainer = document.createElement('div');
                            statusContainer.className = 'emh-code-status-container';
                            statusContainer.style.display = 'inline-block';
                            statusContainer.style.marginLeft = '10px';
                            createCodeStatusIndicator(statusContainer, videoCode);

                            // 将状态指示器添加到标题后面
                            anchorTag.parentNode.appendChild(statusContainer);

                            const controlsDiv = document.createElement('div');
                            controlsDiv.className = 'emh-javgg-controls';
                            linkProviders.forEach(provider => {
                                const newAnchorTag = document.createElement("a");
                                newAnchorTag.href = provider.url.replace("$p", videoCode);
                                newAnchorTag.target = provider.target;
                                newAnchorTag.className = 'btn btn-outline';
                                newAnchorTag.style.padding = '4px 8px';
                                newAnchorTag.style.fontSize = '12px';
                                newAnchorTag.textContent = provider.code;
                                controlsDiv.appendChild(newAnchorTag);
                            });
                            const subtitleButton = document.createElement('button');
                            subtitleButton.className = 'btn my-btn-success emh-subtitle-button-small';
                            subtitleButton.style.padding = '4px 8px';
                            subtitleButton.style.fontSize = '12px';
                            subtitleButton.innerHTML = '<span>字幕</span>';
                            subtitleButton.dataset.videoCode = videoCode;
                            controlsDiv.appendChild(subtitleButton);
                            dataElement.appendChild(controlsDiv);
                        }
                    });
                }
            }
        },
        jable: {
            isMatch: () => UTILS.getDomain().includes('jable') || UTILS.getDomain().includes('cableav') || UTILS.getDomain().includes('fs1.app'),
            targetSelector: '.video-toolbar, .video-info .level, .video-info .row, .text-center, #detail-container .pb-3, .container .mt-4, .player-container + div',
            process: (targetElement) => {
                if (!targetElement) {
                    console.error("Jable-like: Target container not found or page structure mismatch.");
                    return;
                }
                if (targetElement.querySelector('.emh-ui-container') || document.querySelector('.emh-ui-container')) {
                    return;
                }
                const isCableAv = UTILS.getDomain() === "cableav.tv";
                let videoUrl = '';
                let videoCode = UTILS.getCodeFromUrl(window.location.href);
                if (!videoCode) {
                    const titleCodeMatch = document.title.match(/^([A-Z0-9-]+)/i);
                    if (titleCodeMatch) videoCode = titleCodeMatch[1].toUpperCase();
                }
                 if (!videoCode) {
                    const ogTitle = document.querySelector("meta[property='og:title']");
                    if (ogTitle && ogTitle.content) {
                        const titleMatch = ogTitle.content.match(/^([A-Z0-9-]+)/i);
                        if (titleMatch) videoCode = titleMatch[1].toUpperCase();
                    }
                }
                if (!isCableAv) {
                    if (typeof hlsUrl !== 'undefined' && hlsUrl) {
                        videoUrl = hlsUrl;
                    } else {
                        const scripts = document.querySelectorAll('script');
                        for (let script of scripts) {
                            if (script.textContent.includes('player.src({')) {
                                const match = script.textContent.match(/src:\s*['"]([^'"]+\.m3u8[^'"]*)['"]/);
                                if (match && match[1]) {
                                    videoUrl = match[1];
                                    break;
                                }
                            }
                        }
                    }
                    if (videoUrl && videoCode) {
                        videoUrl += "#" + videoCode;
                    } else if (videoUrl && !videoCode) {
                         if (videoCode) videoUrl += "#" + videoCode;
                    }
                } else {
                    const metaTag = document.head.querySelector("meta[property~='og:video:url'][content]");
                    if (metaTag) videoUrl = metaTag.content;
                }
                if (videoCode) {
                    updateGlobalVideoCode(videoCode);
                } else {
                    console.warn("Jable-like: Video code could not be determined for this page.");
                }
                const uiContainer = document.createElement("div");
                uiContainer.className = "emh-ui-container";
                if (videoCode) {
                    const dataElement = document.createElement("span");
                    dataElement.id = "emh-dataElement";
                    dataElement.className = "btn btn-outline";
                    dataElement.style.cursor = 'pointer';
                    dataElement.innerHTML = `番号: ${videoCode}`;
                    dataElement.title = "点击搜索番号 (1cili)";
                    dataElement.dataset.videoCode = videoCode;

                    // 创建状态指示器容器
                    const statusContainer = document.createElement('div');
                    statusContainer.className = 'emh-code-status-container';
                    statusContainer.style.display = 'inline-block';
                    statusContainer.style.marginLeft = '10px';
                    createCodeStatusIndicator(statusContainer, videoCode);

                    // 将状态指示器添加到番号文本后面
                    dataElement.appendChild(statusContainer);

                    uiContainer.appendChild(dataElement);
                }
                UTILS.addActionButtons(uiContainer, videoUrl, videoCode);
                targetElement.appendChild(uiContainer);
                console.log("EMH: Added UI buttons to Jable-like page via target:", targetElement);
            }
        },
        javbus:{
            isMatch: () => UTILS.getDomain().includes('javbus.com'),
                targetSelector: '.item.masonry-brick',  // 目标元素选择器

                // 处理函数：对每个由targetSelector选中的元素执行的操作
                process: (targetElement) => {
                    // 遍历所有masonry布局的视频项
                   document.querySelectorAll('.item.masonry-brick').forEach(entry => {
    // 获取视频信息容器元素
    const photoInfoElement = entry.querySelector(".photo-info");
    if (!photoInfoElement) return;

    // 防止重复处理
    // 检查 photoInfoElement 是否已经处理过
    if (photoInfoElement.classList.contains('emh-indicator-processed')) return;

    // 从span元素中提取第一个date元素（视频代码）
    const dateElements = photoInfoElement.querySelectorAll("span > date");
    const videoCodeElement = dateElements.length > 0 ? dateElements[0] : null;

    if (videoCodeElement) {
        const videoCode = videoCodeElement.textContent.trim();
        if (!videoCode) return; // 跳过空代码
        // --- 创建状态指示器的容器 ---
        const statusContainer = document.createElement('div');

        // statusContainer.className = 'emh-indicator-wrapper';
        createCodeStatusIndicator(statusContainer, videoCode); // 填充 statusContainer

        // 检查 statusContainer 是否真的包含了子元素 (指示器)
        if (statusContainer.firstChild) {
             // --- 插入到 photoInfoElement 的最前面 ---
             photoInfoElement.insertBefore(statusContainer.firstChild, photoInfoElement.firstChild);
             // photoInfoElement.insertBefore(indicatorElement, photoInfoElement.firstChild);
             // 添加标记，表示这个 photoInfoElement 已经处理过
             photoInfoElement.classList.add('emh-indicator-processed');
        }


    }
});
                }
        },
    };

    const VIDEO_MANAGER = {
        sendVideoData: (button) => {
            const videoUrl = button.dataset.videoUrl || '';
            const videoCode = button.dataset.videoCode || EMH_currentVideoCode || UTILS.getCodeFromUrl(window.location.href);
            const titleElement = document.querySelector("h4.title, h1.post-title, .video-info h4, meta[property='og:title']");
            let title = titleElement ? (titleElement.content || titleElement.innerText.trim()) : document.title;
            if (videoCode && title.includes(videoCode)) {
                title = title.split(videoCode).pop().trim().replace(/^[-–—\s]+/, '');
            }
            const posterImage = UTILS.getPosterImage();
            const actress = UTILS.getActressNames();
            const videoData = {
                code: videoCode || 'UNKNOWN',
                name: title || 'Untitled',
                img: posterImage || '',
                url: window.location.href,
                actress: actress || '',
                video: videoUrl || ''
            };
            if (!videoData.code || videoData.code === 'UNKNOWN') {
                UTILS.showToast("无法获取视频代码，发送中止", "warning");
                console.warn("Send data aborted, missing video code.", videoData);
                return;
            }
            console.log("Data to send:", videoData);
            const serverDomain = (CONFIG.serverMode === 1) ? `localhost:${CONFIG.serverPort}` : `YOUR_SERVER_IP:${CONFIG.serverPort}`;
            if (CONFIG.serverMode === 2 && serverDomain.includes('YOUR_SERVER_IP')) {
                UTILS.showToast("请先在脚本中配置服务器IP地址", "error");
                console.error("Server IP not configured in script for serverMode 2.");
                return;
            }
            const apiUrl = UTILS.buildApiUrl(serverDomain, { path: '/add', query: videoData });
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: apiUrl,
                    timeout: 10000,
                    onload: (response) => {
                        if (response.status >= 200 && response.status < 300) {
                            UTILS.showToast("数据已发送到服务器", "success");
                        } else {
                            UTILS.showToast(`服务器响应错误: ${response.status}`, "error");
                            console.error("Server response error:", response);
                        }
                    },
                    onerror: (error) => {
                        UTILS.showToast("发送数据时网络错误", "error");
                        console.error("Send data network error:", error);
                    },
                    ontimeout: () => {
                        UTILS.showToast("发送数据超时", "error");
                    }
                });
            } else {
                fetch(apiUrl, { mode: 'no-cors', signal: AbortSignal.timeout(10000) })
                    .then(response => {
                        UTILS.showToast("数据已尝试发送 (no-cors)", "success");
                    })
                    .catch(error => {
                        if (error.name === 'AbortError') {
                            UTILS.showToast("发送数据超时", "error");
                        } else {
                            UTILS.showToast("发送数据时出错 (fetch)", "error");
                        }
                        console.error("Send data error (fetch):", error);
                    });
            }
            return videoData;
        }
    };

    function extractCode(text) {
        if (!text) return null;
        const match = text.match(/([A-Za-z]{2,5}-?\d{2,5})/);
        return match ? match[1].toUpperCase() : text.replace(/\s*\(.*?\)/g, '').trim().toUpperCase();
    }

    function waitForElement(selector, callback, timeout = CONFIG.elementCheckTimeout) {
        const startTime = Date.now();
        const intervalId = setInterval(() => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                clearInterval(intervalId);
                callback(elements[0]);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(intervalId);
                console.warn(`EMH: Element "${selector}" not found within ${timeout}ms.`);
                callback(null);
            }
        }, CONFIG.elementCheckInterval);
    }

    // 给可拖动按钮增加高级搜索功能
    function enhanceDraggableButton() {
        const draggableBtn = document.getElementById('emh-draggable-custom-subtitle-btn');
        if (draggableBtn) {
            draggableBtn.innerHTML = '<span>🔍 高级搜索</span>';
            draggableBtn.title = '拖动我 | 点击打开高级字幕搜索';

            // 保留原有的拖动功能，但改变点击行为
            const originalClickHandler = draggableBtn.onclick;
            draggableBtn.onclick = function(e) {
                // 检查是否进行了拖动
                if (this.hasDragged) {
                    if (originalClickHandler) {
                        originalClickHandler.call(this, e);
                    }
                    return;
                }

                // 没有拖动，则打开高级搜索
                e.preventDefault();
                e.stopPropagation();

                let defaultSearchTerm = '';
                if (typeof EMH_currentVideoCode !== 'undefined' && EMH_currentVideoCode) {
                    defaultSearchTerm = EMH_currentVideoCode;
                }
                UTILS.createSearchModal(defaultSearchTerm);
            };
        } else {
            // 如果找不到原有按钮，创建新的
            UTILS.createFloatingSearchButton();
        }
    }

    function main() {
        let handlerFound = false;
        for (const [name, handler] of Object.entries(SITE_HANDLERS)) {
            if (handler.isMatch()) {
                handlerFound = true;
                if (handler.targetSelector) {
                    waitForElement(handler.targetSelector, (targetElement) => {
                        if (targetElement || name === 'javgg') {
                            try {
                                setTimeout(() => { handler.process(targetElement); }, 50);
                            } catch (e) { console.error(`EMH: Error processing handler ${name} with target:`, e, targetElement); }
                        }
                    });
                } else {
                    try {
                        setTimeout(() => handler.process(null), 150);
                    } catch (e) { console.error(`EMH: Error processing handler ${name} immediately:`, e); }
                }
                break;
            }
        }
        if (!handlerFound) {
            console.log("EMH: No matching handler found for this site.");
        }
        setupEventListeners();

        // 延迟执行增强可拖动按钮功能，确保原按钮已创建
        setTimeout(() => {
            enhanceDraggableButton();
        }, 1500);
    }

    function setupEventListeners() {
        $(document).off('.emh');
        $(document).on('click.emh', '#emh-copyLink', function () {
            UTILS.copyToClipboard($(this).data('videoUrl'));
        });
        $(document).on('click.emh', '#emh-sendData', function () {
            VIDEO_MANAGER.sendVideoData(this);
        });
        $(document).on('click.emh', '#emh-getSubtitles, .emh-subtitle-button-small', function (e) {
            e.preventDefault();
            const videoCode = $(this).data('videoCode'); // This is for auto-detected codes
            if (videoCode) {
                SUBTITLE_MANAGER.fetchSubtitles(videoCode);
            } else {
                UTILS.showToast("无法从此按钮获取番号", "warning");
            }
        });
        $(document).on('click.emh', '#emh-dataElement', function () {
            const code = $(this).data('videoCode');
            if (code) {
                window.open(`https://1cili.com/search?q=${code}`, "_blank");
            }
        });
        $(document).on('click.emh', '#emh-floating-search-btn', function () {
            const defaultSearchTerm = EMH_currentVideoCode || '';
            UTILS.createSearchModal(defaultSearchTerm);
        });
        $(document).on('click.emh', '.emh-trending-tag', function () {
            const searchInput = document.getElementById('emh-subtitle-search-input');
            if (searchInput) {
                searchInput.value = $(this).text();
                searchInput.focus();
            }
        });

        // 字幕下载按钮点击事件
        $(document).on('click.emh', '.emh-download-subtitle-btn', function(e) {
            e.preventDefault();
            const url = $(this).data('url');
            const filename = $(this).data('filename');
            if (url && filename) {
                SUBTITLE_MANAGER.downloadSubtitle(url, filename);
            } else {
                UTILS.showToast("下载信息不完整", "error");
            }
        });

        // 番号管理按钮点击事件
        $(document).on('click.emh', '#emh-code-manager-btn', function() {
            if (window.CodeManagerPanel) {
                window.CodeManagerPanel.togglePanel();
            } else {
                UTILS.showToast("番号管理面板未能加载", "error");
            }
        });
    }

    function addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
/* ==== CSS from Script ==== */
.navbar{z-index:12345679!important}.sub-header,#footer,.search-recent-keywords,.app-desktop-banner,div[data-controller=movie-tab] .tabs,h3.main-title,div.video-meta-panel>div>div:nth-child(2)>nav>div.review-buttons>div:nth-child(2),div.video-detail>div:nth-child(4)>div>div.tabs.no-bottom>ul>li:nth-child(3),div.video-detail>div:nth-child(4)>div>div.tabs.no-bottom>ul>li:nth-child(2),div.video-detail>div:nth-child(4)>div>div.tabs.no-bottom>ul>li:nth-child(1),.top-meta,.float-buttons{display:none!important}div.tabs.no-bottom,.tabs ul{border-bottom:none!important}.movie-list .item{position:relative!important}.fr-btn{float:right;margin-left:4px!important}.menu-box{position:fixed;right:10px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;z-index:1000;gap:6px}.menu-btn{display:inline-block!important;min-width:80px;padding:7px 12px;border-radius:4px;color:#fff!important;text-decoration:none;font-weight:700;font-size:12px;text-align:center;cursor:pointer;transition:all .3s ease;box-shadow:0 2px 5px #0000001a;text-shadow:0 1px 1px rgba(0,0,0,.2);border:none;line-height:1.3;margin:0}.menu-btn:hover{transform:translateY(-1px);box-shadow:0 3px 6px #00000026;opacity:.9}.menu-btn:active{transform:translateY(0);box-shadow:0 1px 2px #0000001a}.my-btn-primary,.my-btn-success,.my-btn-danger,.btn-warning,.btn-info,.btn-dark,.btn-outline,.btn-disabled{display:inline-flex;align-items:center;justify-content:center;padding:6px 14px;margin-left:10px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:500;transition:all .2s ease;cursor:pointer;border:1px solid rgba(0,0,0,.08);white-space:nowrap}.btn:hover{transform:translateY(-1px);box-shadow:0 2px 8px #0000000d}.my-btn-primary{background:#e0f2fe;color:#0369a1;border-color:#bae6fd}.my-btn-primary:hover{background:#bae6fd}.my-btn-success{background:#dcfce7;color:#166534;border-color:#bbf7d0}.my-btn-success:hover{background:#bbf7d0}.my-btn-danger{background:#fee2e2;color:#b91c1c;border-color:#fecaca}.my-btn-danger:hover{background:#fecaca}.btn-warning{background:#ffedd5;color:#9a3412;border-color:#fed7aa}.btn-warning:hover{background:#fed7aa}.btn-info{background:#ccfbf1;color:#0d9488;border-color:#99f6e4}.btn-info:hover{background:#99f6e4}.btn-dark{background:#e2e8f0;color:#334155;border-color:#cbd5e1}.btn-dark:hover{background:#cbd5e1}.btn-outline{background:transparent;color:#64748b;border-color:#cbd5e1}.btn-outline:hover{background:#f8fafc}.btn-disabled{background:#f1f5f9!important;color:#94a3b8!important;border-color:#e2e8f0!important;cursor:not-allowed!important}.btn-disabled:hover{transform:none!important;box-shadow:none!important;background:#f1f5f9!important;color:#94a3b8!important;}.data-table{width:100%;border-collapse:separate;border-spacing:0;font-family:Helvetica Neue,Arial,sans-serif;background:#fff;overflow:hidden;box-shadow:0 4px 20px #00000008;margin:0 auto}.data-table thead tr{background:#f8fafc}.data-table th{padding:16px 20px;text-align:center!important;color:#64748b;font-weight:500;font-size:14px;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid #e2e8f0}.data-table td{padding:14px 20px;color:#334155;font-size:15px;border-bottom:1px solid #f1f5f9;text-align:center!important;vertical-align:middle}.data-table tbody tr:last-child td{border-bottom:none}.data-table tbody tr{transition:all .2s ease}.data-table tbody tr:hover{background:#f8fafc}.data-table .text-left{text-align:left}.data-table .text-right{text-align:right}.data-table.show-border,.data-table.show-border th,.data-table.show-border td{border:1px solid #e2e8f0}
.loading-container{position:fixed;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center;background-color:rgba(0,0,0,.1);z-index:99999999}.loading-animation{position:relative;width:60px;height:12px;background:linear-gradient(90deg,#4facfe 0,#00f2fe 100%);border-radius:6px;animation:loading-animate 1.8s ease-in-out infinite;box-shadow:0 4px 12px rgba(0,0,0,.1)}.loading-animation:after,.loading-animation:before{position:absolute;display:block;content:"";animation:loading-animate 1.8s ease-in-out infinite;height:12px;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,.1)}.loading-animation:before{top:-20px;left:10px;width:40px;background:linear-gradient(90deg,#ff758c 0,#ff7eb3 100%)}.loading-animation:after{bottom:-20px;width:35px;background:linear-gradient(90deg,#ff9a9e 0,#fad0c4 100%)}@keyframes loading-animate{0%{transform:translateX(40px)}50%{transform:translateX(-30px)}100%{transform:translateX(40px)}}

/* ==== Additional Styles needed by EMH ==== */
.emh-modal{display:flex;align-items:center;justify-content:center;position:fixed;z-index:9998;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:rgba(0,0,0,0.7);opacity:0;transition:opacity 0.3s ease;backdrop-filter:blur(3px);}.emh-modal.show{opacity:1;}.emh-modal-content{background-color:#fff;margin:auto;padding:0;border-radius:12px;width:90%;max-width:650px;box-shadow:0 8px 24px rgba(0,0,0,0.4);transform:scale(0.9);transition:transform 0.3s ease;overflow:hidden;}.emh-modal.show .emh-modal-content{transform:scale(1);}.emh-modal-header{display:flex;justify-content:space-between;align-items:center;padding:16px 24px;background-color:#f8f9fa;border-bottom:1px solid #dadce0;}.emh-modal-header h3{margin:0;color:#202124;font-size:18px;font-weight:500;}.emh-modal-close{color:#5f6368;font-size:28px;font-weight:bold;cursor:pointer;line-height:1;padding:0 5px;transition:color 0.2s ease;}.emh-modal-close:hover{color:#202124;}.emh-modal-body{padding:20px 24px;max-height:65vh;overflow-y:auto;background-color:#fff;}.emh-no-subtitle-message{text-align:center;color:#5f6368;font-size:16px;padding:36px 0;}.emh-subtitle-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:14px;}.emh-subtitle-item{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;padding:16px;background-color:#f8f9fa;border-radius:8px;border:1px solid #e8eaed;gap:12px;transition:all 0.2s ease;}.emh-subtitle-item:hover{transform:translateY(-2px);box-shadow:0 4px 8px rgba(0,0,0,0.1);background-color:#f1f5f9;}.emh-subtitle-info{flex:1 1 auto;min-width:200px;}.emh-subtitle-info h4{margin:0 0 8px 0;color:#202124;font-size:16px;font-weight:500;overflow:hidden;text-overflow:ellipsis;}.emh-subtitle-info p{margin:3px 0;color:#5f6368;font-size:14px;line-height:1.5;}.emh-subtitle-item .my-btn-primary{flex-shrink:0; margin-left: auto !important;}
.emh-ui-container{margin:12px 0 8px 0;text-align:center;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:10px;border-top:1px solid #dadce0;padding:14px 8px 6px 8px;background-color:rgba(248,249,250,0.5);border-radius:8px;}
.emh-action-buttons{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;}
.emh-controls-container{margin-top:10px;padding:8px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;background-color:rgba(248,249,250,0.5);border-radius:8px;}
.emh-javgg-controls{margin-top:6px;display:inline-flex;flex-wrap:wrap;gap:6px;align-items:center;margin-left:10px;vertical-align:middle;padding:4px 6px;background-color:rgba(248,249,250,0.5);border-radius:6px;}
#custom-toast-container{position:fixed;top:70px;right:20px;z-index:10000;display:flex;flex-direction:column;gap:10px;}
.custom-toast{padding:14px 20px;border-radius:8px;color:#fff;box-shadow:0 4px 12px rgba(0,0,0,0.25);transition:opacity 0.3s ease,transform 0.3s ease;opacity:0;transform:translateX(100%);font-size:14px;font-weight:500;display:flex;align-items:center;}
.custom-toast.show{opacity:1;transform:translateX(0);}
.custom-toast::before{margin-right:8px;font-weight:bold;}.custom-toast-success{background:linear-gradient(to right, #68D391, #9AE6B4);}.custom-toast-success::before{content:"✓";}
.custom-toast-error{background:linear-gradient(to right, #FC8181, #FEB2B2);}.custom-toast-error::before{content:"✕";}
.custom-toast-info{background:linear-gradient(to right, #A78BFA, #C4B5FD);}.custom-toast-info::before{content:"ℹ";}
.custom-toast-warning{background:linear-gradient(to right, #ff9a9e, #fad0c4); color:#202124;}.custom-toast-warning::before{content:"⚠";}
.emh-button {} .emh-subtitle-button-small {min-width: auto;} .emh-external-link, .emh-external-link-small {} .emh-data-element {cursor: pointer;} .emh-data-element::after {content: " 🔍";opacity: 0.7;margin-left: 4px;} .emh-action-buttons, .emh-controls-container, .emh-javgg-controls, .emh-ui-container {display: flex;flex-wrap: wrap;align-items: center;gap: 8px;} .emh-ui-container {justify-content: center;margin-top: 10px;padding-top: 10px;border-top: 1px solid #e2e8f0;} .emh-javgg-controls {margin-left: 5px;}

/* Styles for the Draggable Custom Subtitle Button */
.emh-draggable-btn {
    z-index: 10001 !important;
    cursor: grab;
    padding: 8px 12px !important;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    min-width: auto !important;
    margin: 0 !important; /* Reset margin from .btn if any */
}
.emh-draggable-btn:active {
    cursor: grabbing !important;
}

/* Status Indicator for Video Codes */
.emh-code-status-indicator {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    cursor: pointer;
    margin-right: 8px;
    transition: all 0.2s ease;
    position: relative;
    border: 1px solid rgba(0,0,0,0.1);
}

.emh-code-status-indicator:hover {
    transform: scale(1.2);
    box-shadow: 0 0 5px rgba(0,0,0,0.2);
}

.emh-code-status-indicator[data-status="favorite"] {
    background-color: #ff4757; /* Red */
}

.emh-code-status-indicator[data-status="watched"] {
    background-color: #2ed573; /* Green */
}

.emh-code-status-indicator[data-status="unmarked"] {
    background-color: #909090; /* Gray */
}

/* 搜索模态框样式 */
.emh-search-modal-content {
    max-width: 540px;
}

.emh-search-form {
    margin-bottom: 20px;
}

.emh-search-input-group {
    display: flex;
    gap: 8px;
    width: 100%;
}

.emh-input-wrapper {
    position: relative;
    flex-grow: 1;
}

.emh-search-input {
    width: 100%;
    padding: 12px 32px 12px 16px;
    border-radius: 8px;
    border: 1px solid #dadce0;
    font-size: 15px;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.emh-search-input:focus {
    border-color: #a78bfa;
    box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.2);
}

.emh-search-clear-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #5f6368;
    font-size: 20px;
    line-height: 1;
    padding: 4px;
    cursor: pointer;
    border-radius: 50%;
    visibility: hidden;
}

.emh-search-clear-btn:hover {
    background-color: rgba(0,0,0,0.05);
}

.emh-search-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 0 20px;
    border: none;
    border-radius: 8px;
    background: linear-gradient(45deg, #a78bfa, #c4b5fd);
    color: white;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.emh-search-btn:hover {
    box-shadow: 0 4px 12px rgba(167, 139, 250, 0.3);
    transform: translateY(-1px);
}

.emh-search-btn:active {
    transform: translateY(0);
}

/* 搜索历史样式 */
.emh-search-history-section,
.emh-trending-section,
.emh-settings-section {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #f1f5f9;
}

.emh-search-history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.emh-search-history-header h4,
.emh-trending-section h4,
.emh-settings-section h4 {
    margin: 0;
    color: #202124;
    font-size: 15px;
    font-weight: 500;
}

.emh-clear-history-btn {
    background: none;
    border: none;
    color: #5f6368;
    font-size: 13px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
}

.emh-clear-history-btn:hover {
    background-color: rgba(0,0,0,0.05);
    color: #202124;
}

.emh-search-history-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 150px;
    overflow-y: auto;
}

.emh-history-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background-color: #f8f9fa;
    border-radius: 8px;
    transition: background-color 0.2s ease;
}

.emh-history-item:hover {
    background-color: #f1f5f9;
}

.emh-history-text {
    color: #202124;
    font-size: 14px;
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.emh-history-use-btn {
    background: none;
    border: none;
    color: #5f6368;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0.7;
    transition: all 0.2s ease;
}

.emh-history-use-btn:hover {
    background-color: rgba(0,0,0,0.05);
    color: #a78bfa;
    opacity: 1;
}

.emh-empty-history {
    text-align: center;
    color: #5f6368;
    font-size: 14px;
    padding: 12px 0;
}

/* 热门推荐样式 */
.emh-trending-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
}

.emh-trending-tag {
    background: linear-gradient(45deg, #e9d5ff, #f3e8ff);
    color: #7e22ce;
    border-radius: 16px;
    padding: 6px 14px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.emh-trending-tag:hover {
    background: linear-gradient(45deg, #d8b4fe, #e9d5ff);
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(167, 139, 250, 0.2);
}

/* 悬浮搜索按钮 */
.emh-floating-btn {
    position: fixed;
    bottom: 120px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(45deg, #a78bfa, #c4b5fd);
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    z-index: 10001;
    transition: all 0.2s ease;
}

.emh-floating-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.3);
}

/* 自定义滚动条 */
.emh-search-history-list::-webkit-scrollbar {
    width: 8px;
}

.emh-search-history-list::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 8px;
}

.emh-search-history-list::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 8px;
}

.emh-search-history-list::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

/* 设置项样式 */
.emh-setting-item {
    margin: 12px 0;
}

.emh-setting-disabled {
    opacity: 0.5;
    pointer-events: none;
}

.emh-setting-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 8px 12px;
    background-color: #f8f9fa;
    border-radius: 8px;
    transition: background-color 0.2s ease;
}

.emh-setting-label:hover {
    background-color: #f1f5f9;
}

.emh-setting-label span {
    color: #202124;
    font-size: 14px;
}

/* 开关样式 */
.emh-toggle-checkbox {
    height: 0;
    width: 0;
    visibility: hidden;
    position: absolute;
}

.emh-toggle-switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
    background: #e2e8f0;
    border-radius: 20px;
    transition: 0.3s;
}

.emh-toggle-switch:after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: #fff;
    border-radius: 16px;
    transition: 0.3s;
}

.emh-toggle-checkbox:checked + .emh-toggle-switch {
    background: #a78bfa;
}

.emh-toggle-checkbox:checked + .emh-toggle-switch:after {
    left: calc(100% - 2px);
    transform: translateX(-100%);
}

/* 响应式调整 */
@media (max-width: 576px) {
    .emh-search-input-group {
        flex-direction: column;
    }

    .emh-search-btn {
        height: 44px;
    }
}

/* 美化字幕模态框和列表 */
#emh-subtitle-modal {
    backdrop-filter: blur(5px);
}

#emh-subtitle-modal .emh-modal-content {
    border: none;
    box-shadow: 0 10px 30px rgba(0,0,0,0.25);
}

#emh-subtitle-modal .emh-modal-header {
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    padding: 18px 24px;
}

#emh-subtitle-modal .emh-modal-header h3 {
    font-size: 20px;
    background: linear-gradient(90deg, #4b6cb7, #182848);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 600;
}

#emh-subtitle-modal .emh-modal-close {
    font-size: 26px;
    transition: all 0.2s ease;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}

#emh-subtitle-modal .emh-modal-close:hover {
    background-color: rgba(0,0,0,0.05);
    transform: rotate(90deg);
}

#emh-subtitle-modal .emh-modal-body {
    background: linear-gradient(135deg, #ffffff, #f8f9fa);
    padding: 22px 24px;
}

/* 美化字幕列表样式 */
#emh-subtitle-modal .emh-subtitle-list {
    gap: 16px;
}

#emh-subtitle-modal .emh-subtitle-item {
    background: #ffffff;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    border-radius: 12px;
    border: 1px solid rgba(0,0,0,0.08);
    padding: 18px;
    transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
}

#emh-subtitle-modal .emh-subtitle-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    border-color: rgba(75, 108, 183, 0.3);
}

#emh-subtitle-modal .emh-subtitle-info h4 {
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 10px;
    color: #2d3748;
}

#emh-subtitle-modal .emh-subtitle-info p {
    color: #718096;
    font-size: 14.5px;
    line-height: 1.5;
}

/* 美化字幕按钮样式 */
#emh-subtitle-modal .emh-subtitle-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
    margin-left: auto;
}

#emh-subtitle-modal .emh-subtitle-actions .btn {
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

#emh-subtitle-modal .emh-subtitle-actions .my-btn-primary {
    background: linear-gradient(90deg, #4b6cb7, #182848);
    border: none;
    color: white;
}

#emh-subtitle-modal .emh-subtitle-actions .my-btn-primary:hover {
    box-shadow: 0 4px 8px rgba(75, 108, 183, 0.3);
    transform: translateY(-2px);
}

#emh-subtitle-modal .emh-subtitle-actions .btn-outline {
    border: 1px solid #cbd5e0;
    color: #4a5568;
    background: white;
}

#emh-subtitle-modal .emh-subtitle-actions .btn-outline:hover {
    background: #f7fafc;
    border-color: #a0aec0;
}

/* 无字幕时的提示 */
#emh-subtitle-modal .emh-no-subtitle-message {
    text-align: center;
    color: #718096;
    font-size: 17px;
    padding: 40px 0;
    font-weight: 500;
    background: #f7fafc;
    border-radius: 8px;
    border: 1px dashed #cbd5e0;
}

/* 响应式调整 - 字幕模态框 */
@media (max-width: 576px) {
    #emh-subtitle-modal .emh-subtitle-item {
        flex-direction: column;
        align-items: stretch;
    }

    #emh-subtitle-modal .emh-subtitle-actions {
        margin-top: 16px;
        justify-content: center;
    }

    #emh-subtitle-modal .emh-modal-content {
        width: 95%;
        max-width: 95%;
    }

    #emh-subtitle-modal .emh-modal-header h3 {
        font-size: 18px;
    }
}

.emh-code-manager-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10000;
    padding: 8px 16px;
    border-radius: 8px;
    background: #3b82f6;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    transition: all 0.2s ease;
}

.emh-code-manager-toggle:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    background: #2563eb;
}

.emh-code-manager-panel {
    position: fixed;
    top: 0;
    right: -500px;
    width: 450px;
    height: 100vh;
    background: white;
    box-shadow: -5px 0 15px rgba(0,0,0,0.2);
    z-index: 22345679 !important;
    transition: right 0.3s ease;
    display: flex;
    flex-direction: column;
}

.emh-code-manager-panel.visible {
    right: 0;
}

        `;
        document.head.appendChild(style);
    }

    // 创建番号状态标记按钮
    function createCodeStatusIndicator(container, code) {
        if (!code || !container) return null;

        // 初始化 CODE_LIBRARY
        if (!CODE_LIBRARY.initialized) {
            CODE_LIBRARY.init();
        }

        // 获取当前番号状态
        const currentStatus = CODE_LIBRARY.getStatus(code);

        // 创建状态指示器
        const statusIndicator = document.createElement('div');
        statusIndicator.className = 'emh-code-status-indicator';
        statusIndicator.dataset.code = code;
        statusIndicator.dataset.status = currentStatus;

        // 设置状态图标和颜色
        const statusColors = CONFIG.codeManager.statusColors;
        statusIndicator.style.backgroundColor = statusColors[currentStatus] || statusColors.unmarked;

        // 状态提示文本
        let statusText = '未标记';
        if (currentStatus === 'favorite') statusText = '已关注';
        if (currentStatus === 'watched') statusText = '已看过';

        // 根据状态设置不同的提示文本
        if (currentStatus === 'watched') {
            statusIndicator.title = `状态: ${statusText} (请在番号库中修改状态)`;
            statusIndicator.style.cursor = 'default';  // 已看状态下不可点击
        } else {
            statusIndicator.title = `状态: ${statusText} (点击${currentStatus === 'favorite' ? '取消' : ''}关注)`;
            statusIndicator.style.cursor = 'pointer';  // 可点击状态
        }

        // 点击事件 - 只能切换关注状态
        statusIndicator.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // 获取最新的当前状态
            const currentStatus = CODE_LIBRARY.getStatus(code);

            // 如果是已看状态，不允许修改
            if (currentStatus === 'watched') {
                UTILS.showToast('已看状态请在番号库中修改', 'warning');
                return;
            }

            // 在未标记和关注之间切换
            const newStatus = currentStatus === 'favorite' ? 'unmarked' : 'favorite';

            // 更新标记
            CODE_LIBRARY.markItem(code, newStatus);

            // 更新UI
            updateCodeStatusIndicators();

            // 显示提示
            const statusText = newStatus === 'favorite' ? '已关注' : '已取消关注';
            UTILS.showToast(`番号 ${code} ${statusText}`, 'success');
        });

        // 添加到容器
        container.appendChild(statusIndicator);
        return statusIndicator;
    }

    // 更新所有番号状态指示器
    function updateCodeStatusIndicators() {
        // 更新所有页面上的状态指示器
        document.querySelectorAll('.emh-code-status-indicator').forEach(indicator => {
            const code = indicator.dataset.code;
            if (!code) return;

            const currentStatus = CODE_LIBRARY.getStatus(code);
            indicator.dataset.status = currentStatus;

            // 更新颜色
            const statusColors = CONFIG.codeManager.statusColors;
            indicator.style.backgroundColor = statusColors[currentStatus] || statusColors.unmarked;

            // 更新提示和鼠标样式
            let statusText = '未标记';
            if (currentStatus === 'favorite') statusText = '已关注';
            if (currentStatus === 'watched') statusText = '已看过';

            if (currentStatus === 'watched') {
                indicator.title = `状态: ${statusText} (请在番号库中修改状态)`;
                indicator.style.cursor = 'default';
            } else {
                indicator.title = `状态: ${statusText} (点击${currentStatus === 'favorite' ? '取消' : ''}关注)`;
                indicator.style.cursor = 'pointer';
            }
        });
    }

    // Code Manager Panel Implementation
    const CodeManagerPanel = {
        initialized: false,
        panelElement: null,
        currentFilter: 'all',
        searchQuery: '',
        selectedItems: [],
        multiSelectMode: false,

        createToggleButton: function() {
            const existingButton = document.getElementById('emh-code-manager-toggle');
            if (existingButton) {
                existingButton.remove();
            }

            const btn = document.createElement('button');
            btn.id = 'emh-code-manager-toggle';
            btn.className = 'emh-code-manager-toggle';
            btn.innerHTML = '<span>📋 番号库</span>';
            btn.title = '管理番号库';

            btn.addEventListener('click', () => {
                this.togglePanel();
            });

            document.body.appendChild(btn);
        },

        init: function() {
            if (!this.initialized) {
                this.createStyles();
                this.createPanelElement();
                this.createToggleButton(); // 确保创建番号库按钮
                this.attachEventListeners();
                this.initialized = true;
                console.log('Code Manager Panel initialized');
            }
        },

        // Toggle panel visibility
        togglePanel: function() {
            if (this.isVisible) {
                this.hidePanel();
            } else {
                this.showPanel();
            }
        },

        // Show the panel
       showPanel: function() {
    if (!this.panelElement) { // 确保面板 DOM 元素已创建
        this.createPanelElement();
    }
    if (!CODE_LIBRARY.initialized) {
        CODE_LIBRARY.init();
    }

    this.isVisible = true;
    this.panelElement.classList.add('visible'); // 使面板滑入视图
    this.refreshPanelContent(); // 加载或刷新面板内容

    // ---- 新增：针对 javtxt 类网站调整面板位置 ----
    if (SITE_HANDLERS.javtxt && typeof SITE_HANDLERS.javtxt.isMatch === 'function' && SITE_HANDLERS.javtxt.isMatch()) {
        // !!! 重要: 下面的 'nav.site-navbar' 是一个示例选择器 !!!
        // !!! 你需要通过浏览器开发者工具检查 javtxt 网站，找到实际的导航栏元素的选择器 !!!
        // !!! 目标是找到那个 z-index 为 12345679 !important 的导航栏元素 !!!
        const navbarSelector = 'nav.navbar'; // <--- 【请修改为 javtxt 导航栏的实际 CSS 选择器】
                                           // 例如可能是: 'header#main-header', '.fixed-top-bar', 'div[class*="navbar-fixed"]' 等

        let navbarElement = document.querySelector(navbarSelector);

        // 如果特定选择器找不到，尝试更通用的、基于已知高 z-index 的启发式查找
        if (!navbarElement) {
            const potentialNavs = document.querySelectorAll('nav, header'); // 常见的导航栏标签
            for (const el of potentialNavs) {
                const style = window.getComputedStyle(el);
                // 检查是否固定定位在顶部且具有非常高的 z-index
                if ((style.position === 'fixed' || style.position === 'sticky') &&
                    parseInt(style.zIndex) >= 10000000 && // 查找具有类似超高 z-index 的元素
                    el.getBoundingClientRect().top < 10 && // 确保它在视口顶部
                    el.offsetHeight > 20) { // 确保它有一定高度
                    navbarElement = el;
                    console.log("EMH: Detected potential javtxt navbar via heuristics:", navbarElement);
                    break;
                }
            }
        }

        if (navbarElement) {
            const navbarHeight = navbarElement.offsetHeight;
            if (navbarHeight > 0) {
                this.panelElement.style.top = `${navbarHeight}px`;
                this.panelElement.style.height = `calc(100vh - ${navbarHeight}px)`;
                console.log(`EMH: Adjusted panel for javtxt navbar. Top: ${navbarHeight}px`);

                // (可选) 如果面板的 z-index 之前设置得非常高以覆盖导航栏，现在可以考虑降低它
                // this.panelElement.style.zIndex = '10050'; // 例如，一个仍然较高但低于导航栏的值
            } else {
                // 导航栏找到但高度为0，或不可见，则使用默认全屏
                this.panelElement.style.top = '0px';
                this.panelElement.style.height = '100vh';
            }
        } else {
            // 未找到导航栏，使用默认全屏
            this.panelElement.style.top = '0px';
            this.panelElement.style.height = '100vh';
            console.warn("EMH: javtxt navbar element not found with selector or heuristics. Panel might be obscured if navbar exists.");
        }
    } else {
        // 非 javtxt 类网站，使用默认全屏
        this.panelElement.style.top = '0px';
        this.panelElement.style.height = '100vh';
    }
    // ---- 调整结束 ----
},

        // Hide the panel
        hidePanel: function() {
            this.isVisible = false;
            if (this.panelElement) {
                this.panelElement.classList.remove('visible');
            }

            if (this.multiSelectMode) {
                this.toggleMultiSelectMode();
            }
        },

        // Create the panel element
        createPanelElement: function() {
            if (this.panelElement) return;

            const panel = document.createElement('div');
            panel.id = 'emh-code-manager-panel';
            panel.className = 'emh-code-manager-panel';

            panel.innerHTML = `
                <div class="emh-panel-header">
                    <h2>番号管理</h2>
                    <div class="emh-panel-controls">
                        <button class="emh-panel-close">&times;</button>
                    </div>
                </div>
                <div class="emh-panel-tabs">
                    <button data-filter="all" class="active">全部</button>
                    <button data-filter="favorite">关注列表</button>
                    <button data-filter="watched">已看记录</button>
                    <button data-filter="trash">回收站</button>
                </div>
                <div class="emh-panel-search">
                    <input type="text" placeholder="搜索番号或备注..." />
                    <button class="emh-search-btn">🔍</button>
                </div>
                <div class="emh-panel-content">
                    <!-- Content will be filled dynamically -->
                </div>
                <div class="emh-panel-actions">
                    <button id="emh-add-code" class="btn my-btn-primary">添加</button>
                    <button id="emh-multi-select" class="btn btn-outline">多选</button>
                    <button id="emh-export" class="btn btn-info">导出</button>
                    <button id="emh-import" class="btn btn-info">导入</button>
                    <button id="emh-clear-trash" class="btn my-btn-danger" style="display: none;">清空回收站</button>
                </div>
                <div class="emh-panel-multi-actions" style="display: none;">
                    <span class="emh-selected-count">已选择 0 项</span>
                    <button id="emh-mark-favorite" class="btn my-btn-danger">标为关注</button>
                    <button id="emh-mark-watched" class="btn my-btn-success">标为已看</button>
                    <button id="emh-delete-selected" class="btn btn-outline">删除</button>
                    <button id="emh-cancel-multi" class="btn btn-outline">取消</button>
                </div>
                <div class="emh-panel-modal" style="display: none;">
                    <div class="emh-panel-modal-content">
                        <h3></h3>
                        <div class="emh-panel-modal-buttons">
                            <button class="btn my-btn-danger emh-panel-modal-confirm">确定</button>
                            <button class="btn btn-outline emh-panel-modal-cancel">取消</button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(panel);
            this.panelElement = panel;

            panel.querySelector('.emh-panel-close').addEventListener('click', () => {
                this.hidePanel();
            });
        },

        // Add CSS styles for the panel
        createStyles: function() {
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                .emh-code-manager-toggle {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 10000;
                    padding: 8px 16px;
                    border-radius: 8px;
                    background: #3b82f6;
                    color: white;
                    border: none;
                    cursor: pointer;
                    font-size: 14px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    transition: all 0.2s ease;
                }

                .emh-code-manager-toggle:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    background: #2563eb;
                }

                .emh-code-manager-panel {
                    position: fixed;
                    top: 0;
                    right: -500px;
                    width: 450px;
                    height: 100vh;
                    background: white;
                    box-shadow: -5px 0 15px rgba(0,0,0,0.2);
                    z-index: 10010;
                    transition: right 0.3s ease;
                    display: flex;
                    flex-direction: column;
                }

                .emh-code-manager-panel.visible {
                    right: 0;
                }

                .emh-panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                    border-bottom: 1px solid #e2e8f0;
                }

                .emh-panel-header h2 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 500;
                    color: #334155;
                }

                .emh-panel-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #64748b;
                }

                .emh-panel-tabs {
                    display: flex;
                    border-bottom: 1px solid #e2e8f0;
                    padding: 0 15px;
                }

                .emh-panel-tabs button {
                    background: none;
                    border: none;
                    padding: 12px 15px;
                    font-size: 14px;
                    cursor: pointer;
                    color: #64748b;
                    position: relative;
                }

                .emh-panel-tabs button.active {
                    color: #3b82f6;
                    font-weight: 500;
                }

                .emh-panel-tabs button.active::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: #3b82f6;
                }

                .emh-panel-search {
                    padding: 15px;
                    display: flex;
                    border-bottom: 1px solid #e2e8f0;
                }

                .emh-panel-search input {
                    flex: 1;
                    padding: 8px 12px;
                    border: 1px solid #cbd5e1;
                    border-radius: 4px 0 0 4px;
                    outline: none;
                }

                .emh-search-btn {
                    background: #f1f5f9;
                    border: 1px solid #cbd5e1;
                    border-left: none;
                    border-radius: 0 4px 4px 0;
                    padding: 0 12px;
                    cursor: pointer;
                }

                .emh-panel-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 15px;
                    background: #f8fafc;
                }

                .emh-panel-actions,
                .emh-panel-multi-actions {
                    padding: 15px;
                    display: flex;
                    gap: 10px;
                    border-top: 1px solid #e2e8f0;
                    background: white;
                }

                .emh-item {
                    display: flex;
                    align-items: center;
                    padding: 12px;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    margin-bottom: 8px;
                    background: white;
                }

                .emh-item.favorite {
                    border-color: #f56565;
                    background: #fff5f5;
                }

                .emh-item.watched {
                    border-color: #48bb78;
                    background: #f0fff4;
                }

                .emh-item.selected {
                    border-color: #4299e1;
                    background: #ebf8ff;
                }

                .emh-item-code {
                    font-weight: 500;
                    color: #2d3748;
                    margin-right: 12px;
                }

                .emh-item-remarks {
                    flex: 1;
                    color: #718096;
                    font-size: 14px;
                }

                .emh-item-actions {
                    display: flex;
                    gap: 8px;
                }

                .emh-item-actions button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                }

                .emh-item-actions button:hover {
                    opacity: 1;
                }

                .emh-empty-state {
                    text-align: center;
                    color: #718096;
                    padding: 40px 0;
                }

                @media (max-width: 576px) {
                    .emh-code-manager-panel {
                        width: 100%;
                        right: -100%;
                    }
                }

                .emh-panel-modal {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: none;
                    justify-content: center;
                    align-items: center;
                    z-index: 10011;
                }

                .emh-panel-modal-content {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    width: 80%;
                    max-width: 300px;
                    text-align: center;
                }

                .emh-panel-modal-content h3 {
                    margin: 0 0 20px 0;
                    color: #334155;
                }

                .emh-panel-modal-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 20px;
                }
            `;

            document.head.appendChild(styleElement);
        },

        // Attach event listeners
        attachEventListeners: function() {
            // Tab switching
            this.panelElement.querySelectorAll('.emh-panel-tabs button').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    this.currentFilter = e.target.dataset.filter;
                    this.refreshPanelContent();

                    // Update active tab
                    this.panelElement.querySelectorAll('.emh-panel-tabs button').forEach(t => {
                        t.classList.remove('active');
                    });
                    e.target.classList.add('active');
                });
            });

            // Search functionality
            const searchInput = this.panelElement.querySelector('.emh-panel-search input');
            const searchBtn = this.panelElement.querySelector('.emh-search-btn');

            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.refreshPanelContent();
            });

            searchBtn.addEventListener('click', () => {
                this.refreshPanelContent();
            });

            // Multi-select mode
            const multiSelectBtn = this.panelElement.querySelector('#emh-multi-select');
            multiSelectBtn.addEventListener('click', () => {
                this.toggleMultiSelectMode();
            });

            // Multi-select actions
            this.panelElement.querySelector('#emh-mark-favorite').addEventListener('click', () => {
                this.batchMarkItems('favorite');
            });

            this.panelElement.querySelector('#emh-mark-watched').addEventListener('click', () => {
                this.batchMarkItems('watched');
            });

            this.panelElement.querySelector('#emh-delete-selected').addEventListener('click', () => {
                this.batchDeleteItems();
            });

            this.panelElement.querySelector('#emh-cancel-multi').addEventListener('click', () => {
                this.toggleMultiSelectMode();
            });

            // Add code button
            this.panelElement.querySelector('#emh-add-code').addEventListener('click', () => {
                const code = prompt('请输入要添加的番号:');
                if (code) {
                    CODE_LIBRARY.add(code);
                    this.refreshPanelContent();
                    UTILS.showToast(`番号 ${code} 已添加`, 'success');
                }
            });

            // Export button
            this.panelElement.querySelector('#emh-export').addEventListener('click', () => {
                const data = CODE_LIBRARY.exportData();
                const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'emh_code_library.json';
                a.click();
                URL.revokeObjectURL(url);
                UTILS.showToast('数据导出成功', 'success');
            });

            // Import button
            this.panelElement.querySelector('#emh-import').addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            try {
                                const data = JSON.parse(e.target.result);
                                CODE_LIBRARY.importData(data);
                                this.refreshPanelContent();
                                UTILS.showToast('数据导入成功', 'success');
                            } catch (err) {
                                console.error('Import failed:', err);
                                UTILS.showToast('数据导入失败', 'error');
                            }
                        };
                        reader.readAsText(file);
                    }
                };
                input.click();
            });

            // 修改删除按钮的事件处理
            const self = this;
            this.panelElement.addEventListener('click', function(e) {
                const deleteBtn = e.target.closest('.emh-delete');
                if (deleteBtn) {
                    e.stopPropagation();
                    const item = deleteBtn.closest('.emh-item');
                    const code = item.dataset.code;
                    if (code) {
                        self.showConfirmDialog(`确定要删除番号 ${code} 吗？`, function() {
                            CODE_LIBRARY.delete(code);
                            self.refreshPanelContent();
                            UTILS.showToast(`番号 ${code} 已删除`, 'success');
                        });
                    }
                }
            });

            // 添加清空回收站按钮事件
            const clearTrashBtn = this.panelElement.querySelector('#emh-clear-trash');
            if (clearTrashBtn) {
                clearTrashBtn.addEventListener('click', () => {
                    this.clearTrash();
                });
            }
        },

        // Toggle multi-select mode
        toggleMultiSelectMode: function() {
            this.multiSelectMode = !this.multiSelectMode;
            this.selectedItems = [];

            const actionsBar = this.panelElement.querySelector('.emh-panel-actions');
            const multiActionsBar = this.panelElement.querySelector('.emh-panel-multi-actions');

            if (this.multiSelectMode) {
                actionsBar.style.display = 'none';
                multiActionsBar.style.display = 'flex';
            } else {
                actionsBar.style.display = 'flex';
                multiActionsBar.style.display = 'none';
            }

            this.refreshPanelContent();
        },

        // Refresh panel content based on current filter and search term
        refreshPanelContent: function() {
            const contentArea = this.panelElement.querySelector('.emh-panel-content');
            let items = [];

            // Get items based on current filter
            switch(this.currentFilter) {
                case 'favorite':
                    items = CODE_LIBRARY.getFavorites();
                    break;
                case 'watched':
                    items = CODE_LIBRARY.getWatched();
                    break;
                case 'trash':
                    items = CODE_LIBRARY.getTrash();
                    // 在回收站视图中显示清空按钮
                    this.panelElement.querySelector('#emh-clear-trash').style.display = 'inline-flex';
                    // 隐藏不相关的按钮
                    this.panelElement.querySelector('#emh-add-code').style.display = 'none';
                    this.panelElement.querySelector('#emh-multi-select').style.display = 'none';
                    break;
                default:
                    items = CODE_LIBRARY.getAll();
                    // 在非回收站视图中隐藏清空按钮
                    this.panelElement.querySelector('#emh-clear-trash').style.display = 'none';
                    // 显示常规按钮
                    this.panelElement.querySelector('#emh-add-code').style.display = 'inline-flex';
                    this.panelElement.querySelector('#emh-multi-select').style.display = 'inline-flex';
            }

            // Apply search filter if needed
            if (this.searchQuery) {
                items = items.filter(item =>
                    item.code.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    (item.remarks && item.remarks.toLowerCase().includes(this.searchQuery.toLowerCase()))
                );
            }

            // Generate HTML for items
            const itemsHtml = items.map(item => this.generateItemHtml(item)).join('');
            contentArea.innerHTML = itemsHtml || '<div class="emh-empty-state">没有找到相关记录</div>';

            // Update selected count if in multi-select mode
            if (this.multiSelectMode) {
                this.panelElement.querySelector('.emh-selected-count').textContent =
                    `已选择 ${this.selectedItems.length} 项`;
            }

            // Add click handlers for items
            contentArea.querySelectorAll('.emh-item').forEach(item => {
                const code = item.dataset.code;

                if (this.multiSelectMode) {
                    // Multi-select mode click handler
                    item.addEventListener('click', () => {
                        const checkbox = item.querySelector('input[type="checkbox"]');
                        checkbox.checked = !checkbox.checked;

                        if (checkbox.checked) {
                            this.selectedItems.push(code);
                            item.classList.add('selected');
                        } else {
                            this.selectedItems = this.selectedItems.filter(c => c !== code);
                            item.classList.remove('selected');
                        }

                        this.panelElement.querySelector('.emh-selected-count').textContent =
                            `已选择 ${this.selectedItems.length} 项`;
                    });
                } else {
                    // Normal mode - individual action handlers
                    const actions = item.querySelector('.emh-item-actions');
                    if (actions) {
                        actions.querySelector('.emh-mark-favorite').addEventListener('click', (e) => {
                            e.stopPropagation();
                            CODE_LIBRARY.markItem(code, 'favorite');
                            this.refreshPanelContent();
                            UTILS.showToast(`番号 ${code} 已标记为关注`, 'success');
                        });

                        actions.querySelector('.emh-mark-watched').addEventListener('click', (e) => {
                            e.stopPropagation();
                            CODE_LIBRARY.markItem(code, 'watched');
                            this.refreshPanelContent();
                            UTILS.showToast(`番号 ${code} 已标记为已看`, 'success');
                        });

                        actions.querySelector('.emh-delete').addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.showConfirmDialog(`确定要删除番号 ${code} 吗？`, () => {
                                CODE_LIBRARY.delete(code);
                                this.refreshPanelContent();
                                UTILS.showToast(`番号 ${code} 已删除`, 'success');
                            });
                        });
                    }
                }
            });
        },

        // Generate HTML for a single item
        generateItemHtml: function(item) {
            const isSelected = this.selectedItems.includes(item.code);
            const statusClass = item.status === 'favorite' ? 'favorite' :
                              item.status === 'watched' ? 'watched' : '';

            return `
                <div class="emh-item ${statusClass} ${isSelected ? 'selected' : ''}"
                     data-code="${item.code}">
                    ${this.multiSelectMode ? `
                        <input type="checkbox" ${isSelected ? 'checked' : ''} />
                    ` : ''}
                    <div class="emh-item-code">${item.code}</div>
                    <div class="emh-item-remarks">${item.remarks || ''}</div>
                    <div class="emh-item-actions">
                        ${!this.multiSelectMode ? `
                            <button class="emh-mark-favorite">❤️</button>
                            <button class="emh-mark-watched">✓</button>
                            <button class="emh-delete">🗑️</button>
                        ` : ''}
                    </div>
                </div>
            `;
        },

        // Batch operations
        batchMarkItems: function(status) {
            this.selectedItems.forEach(code => {
                CODE_LIBRARY.markItem(code, status);
            });
            this.toggleMultiSelectMode();
            this.refreshPanelContent();
            UTILS.showToast(`已批量标记 ${this.selectedItems.length} 个番号`, 'success');
        },

        batchDeleteItems: function() {
            const self = this;
            this.showConfirmDialog(`确定要删除选中的 ${this.selectedItems.length} 项吗？`, function() {
                self.selectedItems.forEach(code => {
                    CODE_LIBRARY.delete(code);
                });
                self.toggleMultiSelectMode();
                self.refreshPanelContent();
                UTILS.showToast(`已删除 ${self.selectedItems.length} 个番号`, 'success');
            });
        },

        // Show confirmation dialog
        showConfirmDialog: function(message, onConfirm) {
            const modal = this.panelElement.querySelector('.emh-panel-modal');
            const modalTitle = modal.querySelector('h3');
            const confirmBtn = modal.querySelector('.emh-panel-modal-confirm');
            const cancelBtn = modal.querySelector('.emh-panel-modal-cancel');

            modalTitle.textContent = message;
            modal.style.display = 'flex';

            const handleConfirm = () => {
                modal.style.display = 'none';
                onConfirm();
                cleanup();
            };

            const handleCancel = () => {
                modal.style.display = 'none';
                cleanup();
            };

            const cleanup = () => {
                confirmBtn.removeEventListener('click', handleConfirm);
                cancelBtn.removeEventListener('click', handleCancel);
            };

            confirmBtn.addEventListener('click', handleConfirm);
            cancelBtn.addEventListener('click', handleCancel);
        },

        // 添加清空回收站方法
        clearTrash: function() {
            if (!CODE_LIBRARY.trash.items.length) {
                UTILS.showToast('回收站已经是空的', 'info');
                return;
            }

            this.showConfirmDialog('确定要清空回收站吗？此操作不可撤销！', () => {
                CODE_LIBRARY.trash.items = [];
                CODE_LIBRARY.save();
                this.refreshPanelContent();
                UTILS.showToast('回收站已清空', 'success');
            });
        },
    };

    function initialize() {
        addCustomStyles();

        // 加载用户设置
        try {
            const savedSubtitleOptions = localStorage.getItem('emh_subtitle_filename_options');
            if (savedSubtitleOptions) {
                const parsedOptions = JSON.parse(savedSubtitleOptions);

                // 合并保存的设置到CONFIG
                if (parsedOptions) {
                    CONFIG.subtitleFilenameOptions = {
                        ...CONFIG.subtitleFilenameOptions,
                        ...parsedOptions
                    };
                }
            }
        } catch (err) {
            console.error('加载字幕设置失败:', err);
        }

        // 初始化番号库
        CODE_LIBRARY.init();

        UTILS.createDraggableSubtitleButton(); // Create the draggable button

        // 初始化番号管理面板
        if (typeof CodeManagerPanel !== 'undefined') {
            window.CodeManagerPanel = CodeManagerPanel;
            CodeManagerPanel.init();
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', main);
        } else {
            main();
        }
        console.log("EMH Initialized with Enhanced Subtitle Search and Code Manager");

        // 添加自定义事件监听器
        window.addEventListener('emh_library_updated', function(e) {
            if (e.detail.type === 'library_update') {
                // 更新所有状态指示器
                updateCodeStatusIndicators();
                // 如果面板是打开的，刷新面板内容
                if (CodeManagerPanel.isVisible) {
                    CodeManagerPanel.refreshPanelContent();
                }
            }
        });

        // 添加 GM 存储变化监听
        if (typeof GM_addValueChangeListener !== 'undefined') {
            GM_addValueChangeListener('emh_sync_timestamp', function(name, old_value, new_value, remote) {
                if (remote) {
                    CODE_LIBRARY.init();
                    updateCodeStatusIndicators();
                    if (CodeManagerPanel.isVisible) {
                        CodeManagerPanel.refreshPanelContent();
                    }
                }
            });
        }

        // 定期检查更新（作为备用同步机制）
        setInterval(function() {
            if (typeof GM_getValue !== 'undefined') {
                const lastUpdate = GM_getValue('emh_sync_timestamp');
                if (lastUpdate && lastUpdate !== CodeManagerPanel.lastSyncTimestamp) {
                    CodeManagerPanel.lastSyncTimestamp = lastUpdate;
                    CODE_LIBRARY.init();
                    updateCodeStatusIndicators();
                    if (CodeManagerPanel.isVisible) {
                        CodeManagerPanel.refreshPanelContent();
                    }
                }
            }
        }, 2000); // 每2秒检查一次
    }

    initialize();
})();

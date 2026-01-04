// ==UserScript==
// @name             Enhanced_Media_Helper_vip
// @version          2.7.1
// @description      Enhanced media downloader with multiple site support, subtitles (auto-detected & custom search via draggable button), JAV-JHS style.
// @author           cores (original) & improved version & Gemini & JAV-JHS Style
// @match            https://jable.tv/videos/*/*
// @match            https://tokyolib.com/v/*
// @match            https://fs1.app/videos/*/*
// @match            https://cableav.tv/*/
// @match            https://javgg.net/tag/to-be-release/*
// @match            https://javgg.net/featured/*
// @match            https://javgg.net/
// @match            https://javgg.net/new-post/*
// @match            https://javgg.net/jav/*
// @match            https://javgg.net/star/*
// @match            https://javgg.net/trending/*
// @include          /.*javtxt.[a-z]+\/v/.*$/
// @include          /.*javtext.[a-z]+\/v/.*$/
// @match            https://cableav.tv/?p=*
// @require          https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @icon             data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant            GM_xmlhttpRequest
// @grant            GM_setValue
// @grant            GM_getValue
// @grant            GM_addStyle
// @grant            GM_addValueChangeListener
// @connect          api-shoulei-ssl.xunlei.com
// @connect          subtitle.v.geilijiasu.com
// @connect          cdn.jsdelivr.net
// @license          MPL
// @namespace        cdn.bootcss.com
// @downloadURL https://update.greasyfork.org/scripts/535527/Enhanced_Media_Helper_vip.user.js
// @updateURL https://update.greasyfork.org/scripts/535527/Enhanced_Media_Helper_vip.meta.js
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
        serverMode: 2, // 1 for localhost, 2 for YOUR_SERVER_IP
        serverPort: 9909,
        alternateUrl: 'https://123av.com/zh/v/',
        subtitleApiUrl: 'https://api-shoulei-ssl.xunlei.com/oracle/subtitle',
        elementCheckInterval: 200,
        elementCheckTimeout: 7000,
        searchHistoryKey: 'emh_subtitle_search_history',
        maxHistoryItems: 10,
        animationDuration: 300, // ms, for modals
        toastDuration: 3000, // ms
        // 字幕文件名处理选项
        subtitleFilenameOptions: {
            useOriginalName: true,     // 使用API返回的原始name属性，不做修改
            addCodePrefix: false,      // 已弃用：是否添加影片编码作为前缀（当useOriginalName=false时使用）
            removeIllegalChars: true,  // 是否移除非法字符
            maxLength: 100             // 文件名最大长度
        },
        // 番号管理相关配置
        codeManager: {
            storageKey: 'emh_code_library',
            trashStorageKey: 'emh_code_trash',
            trashRetentionDays: 7,     // 回收站保留天数
            autoAddDetected: true,     // 自动添加检测到的番号
            defaultPage: 'all',        // 默认页面: all, favorite, watched, trash
            itemsPerPage: 20,          // 每页显示条目数
            statusColors: {
                unmarked: '#909090',   // 未标记 - 灰色
                favorite: '#ff4757',   // 关注 - 红色
                watched: '#2ed573'     // 已看 - 绿色
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
                this.initialized = true; // Still set to true to prevent re-init loops
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
                        data: this.data // or a summary if data is large
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
                status: 'unmarked', // 默认状态
                remarks: remarks || '',
                tags: [],
                createdDate: new Date().toISOString(),
                modifiedDate: new Date().toISOString()
            };

            this.data.items.unshift(newItem); // 添加到数组开头，以便最新添加的在最前面
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
            item.deleteDate = new Date().toISOString(); // 记录删除时间

            // 从主库中删除
            this.data.items.splice(itemIndex, 1);

            // 添加到回收站
            this.trash.items.unshift(item); // 添加到回收站开头

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

            // No need to call this.save() here if init calls it or if it's called separately.
            // However, if cleanupTrash can be called independently, then save is needed.
            // For now, assuming init handles the save after cleanup.
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
            return item ? item.status : 'unmarked'; // Default to 'unmarked' if not found
        },


        // 标记番号
        markItem: function(code, status, title = '', remark = '') {
            if (!this.initialized) this.init();
            if (!code) return false;

            // 标准化番号格式（大写）
            const normalizedCode = code.toUpperCase();

            // 检查状态是否有效
            if (!['unmarked', 'favorite', 'watched'].includes(status)) {
                status = 'unmarked'; // 默认为未标记
            }

            // 检查是否已存在
            const existingIndex = this.data.items.findIndex(item => item.code.toUpperCase() === normalizedCode);

            if (existingIndex >= 0) {
                // 更新现有条目
                this.data.items[existingIndex].status = status;

                // 只在提供了新值时更新这些字段
                if (title) this.data.items[existingIndex].title = title;
                if (remark !== undefined) this.data.items[existingIndex].remarks = remark; // Allow empty string for remark

                // 更新修改时间
                this.data.items[existingIndex].modifiedDate = new Date().toISOString();
            } else {
                // 创建新条目
                const newItem = {
                    code: normalizedCode,
                    title: title || normalizedCode, // 如果没有提供标题，使用番号作为标题
                    status: status,
                    remarks: remark || '',
                    tags: [],
                    createdDate: new Date().toISOString(),
                    modifiedDate: new Date().toISOString()
                };

                this.data.items.unshift(newItem); // 添加到数组开头
            }

            return this.save();
        },
        // 导出数据
        exportData: function(filter = 'all') { // filter can be 'all', 'favorite', 'watched', 'trash'
            if (!this.initialized) this.init();

            let exportData = {
                version: "1.0", // Basic versioning for future compatibility
                exportDate: new Date().toISOString(),
                filter: filter,
                items: []
            };

            // 确定导出的数据
            if (filter === 'trash') {
                exportData.items = [...this.trash.items];
            } else if (filter === 'all') {
                exportData.items = [...this.data.items];
            } else { // 'favorite' or 'watched'
                exportData.items = this.data.items.filter(item => item.status === filter);
            }

            return exportData;
        },
        emptyTrash: function() {
            if (!this.initialized) this.init();
            if (this.trash.items.length > 0) {
                this.trash.items = []; // 清空回收站数组
                UTILS.showToast('回收站已清空', 'success');
                return this.save();    // 保存更改，这将触发 emh_library_updated 事件
            } else {
                UTILS.showToast('回收站已经是空的', 'info');
                return false; // 没有可清空的内容
            }
        },

        // 导入数据
        importData: function(data, mode = 'merge') { // mode can be 'merge' or 'replace'
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
                        if (!importedItem.code) continue; // 跳过没有番号的条目

                        const normalizedCode = importedItem.code.toUpperCase();
                        const existingIndex = this.data.items.findIndex(item =>
                            item.code.toUpperCase() === normalizedCode
                        );

                        if (existingIndex >= 0) {
                            // 更新现有条目
                            this.data.items[existingIndex] = {
                                ...this.data.items[existingIndex], // 保留原有信息
                                ...importedItem,                 // 用导入信息覆盖
                                code: normalizedCode,            // 确保番号大写
                                modifiedDate: new Date().toISOString() // 更新修改日期
                            };
                        } else {
                            // 添加新条目
                            const newItem = {
                                ...importedItem, // 导入所有字段
                                code: normalizedCode,
                                createdDate: importedItem.createdDate || new Date().toISOString(), // 保留或设置创建日期
                                modifiedDate: new Date().toISOString() // 设置修改日期
                            };
                            this.data.items.unshift(newItem); // 添加到开头
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

            // 禁用所有相关的字幕按钮
            const buttonsToDisable = [
                document.getElementById('emh-getSubtitles'), // Main auto-detect button
                ...document.querySelectorAll(`.emh-subtitle-button-small[data-video-code]`), // All small per-item buttons
                document.getElementById('emh-draggable-custom-subtitle-btn') // Draggable custom search button
            ].filter(Boolean); // Filter out nulls if some buttons don't exist

            buttonsToDisable.forEach(btn => {
                btn.disabled = true;
                if (btn.classList.contains('btn')) { // Apply JAV-JHS disabled style
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
                    SUBTITLE_MANAGER.createSubtitleModal(null, searchTermTrimmed); // Show empty modal on error
                }
            };

            const handleError = (error) => {
                reEnableButtons();
                console.error("获取字幕时出错:", error);
                UTILS.showToast("获取字幕时出错", "error");
                SUBTITLE_MANAGER.createSubtitleModal(null, searchTermTrimmed); // Show empty modal on error
            };

            // 设置超时处理
            let timeoutId = setTimeout(() => {
                reEnableButtons(); // 确保在超时后按钮重新启用
                UTILS.showToast("获取字幕超时", "error");
                SUBTITLE_MANAGER.createSubtitleModal(null, searchTermTrimmed); // 显示空模态框

                // 清理可能的JSONP回调
                if (window.emhJsonpCallback) {
                    delete window.emhJsonpCallback;
                }
                // 清理可能添加的script标签
                const jsonpScript = document.getElementById('emh-jsonp-script');
                if (jsonpScript) {
                    jsonpScript.remove();
                }
            }, 15000); // 15秒超时


            if (typeof GM_xmlhttpRequest !== 'undefined') {
                // 使用油猴API，它能自动绕过CORS限制
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: apiUrl,
                    timeout: 15000, // 15 seconds timeout
                    onload: (response) => {
                        clearTimeout(timeoutId); // 清除超时
                        handleResponse(response.responseText);
                    },
                    onerror: (error) => {
                        clearTimeout(timeoutId); // 清除超时
                        handleError(error);
                    },
                    ontimeout: () => {
                        // GM_xmlhttpRequest的ontimeout会在这里处理，上面的全局timeoutId主要用于fetch/JSONP
                        // reEnableButtons(); // GM_xmlhttpRequest 的 ontimeout 应该已经触发了，这里可能重复
                        // UTILS.showToast("获取字幕超时 (GM_xmlhttpRequest)", "error");
                        // SUBTITLE_MANAGER.createSubtitleModal(null, searchTermTrimmed);
                        // handleError({message: "Timeout via GM_xmlhttpRequest"}); // 确保调用handleError
                        // timeoutId 超时会自行处理，无需在此重复调用
                    }
                });
            } else {
                // 尝试使用CORS代理
                const corsProxies = [
                    // `https://cors-anywhere.herokuapp.com/${apiUrl}`, // Often down or rate-limited
                    `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`, // Recommended alternative
                    `https://corsproxy.io/?${encodeURIComponent(apiUrl)}` // Another alternative
                ];

                // 创建一个Promise数组，对每个代理进行尝试
                const fetchRequests = corsProxies.map(proxyUrl => {
                    return fetch(proxyUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest' // Some proxies might need this
                        }
                    })
                    .then(response => {
                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for ${proxyUrl}`);
                        return response.text();
                    });
                });

                // 使用Promise.any来获取第一个成功的结果
                Promise.any(fetchRequests)
                    .then(text => {
                        clearTimeout(timeoutId); // 清除超时
                        if (!text) { // Handle cases where text might be empty but successful
                           handleResponse('{"data": []}'); // Treat as no subtitles found
                        } else {
                           handleResponse(text);
                        }
                    })
                    .catch(error => { // AggregateError if all promises reject
                        // 所有代理都失败时，尝试使用JSONP方法
                        console.warn("所有CORS代理失败，尝试JSONP方法", error);

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
                            clearTimeout(timeoutId); // 清除超时
                            handleResponse(JSON.stringify(data));
                            delete window.emhJsonpCallback; // 清理回调
                            const script = document.getElementById('emh-jsonp-script');
                            if (script) script.remove(); // 清理脚本
                        };

                        // 尝试直接请求，某些服务器可能支持JSONP
                        const jsonpUrl = `${CONFIG.subtitleApiUrl}?name=${encodeURIComponent(searchTermTrimmed)}&callback=emhJsonpCallback`;
                        const script = document.createElement('script');
                        script.id = 'emh-jsonp-script';
                        script.src = jsonpUrl;
                        script.onerror = () => {
                            // JSONP失败时，创建一个空结果并处理
                            // 确保只在模态框未显示时创建，避免重复
                            if (!document.getElementById('emh-subtitle-modal')) {
                                clearTimeout(timeoutId); // 清除超时
                                handleResponse('{"data": []}'); // 返回空数据
                                UTILS.showToast("无法连接到字幕API，请稍后重试", "error");
                            }
                            delete window.emhJsonpCallback; // 清理回调
                            if (script) script.remove(); // 清理脚本
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
            modal.className = 'emh-modal'; // Standard modal class

            const modalContent = document.createElement('div');
            modalContent.className = 'emh-modal-content'; // Standard modal content class

            const modalHeader = document.createElement('div');
            modalHeader.className = 'emh-modal-header';
            modalHeader.innerHTML = `<h3>字幕列表 (搜索关键字: ${videoCode || '未知'})</h3><span class="emh-modal-close">&times;</span>`;
            modalContent.appendChild(modalHeader);

            const modalBody = document.createElement('div');
            modalBody.className = 'emh-modal-body';

            if (subtitleContent && subtitleContent.data && subtitleContent.data.length > 0) {
                const list = document.createElement('ul');
                list.className = 'emh-subtitle-list'; // Class for styling the list

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

            // Event listeners for closing the modal
            modal.querySelector('.emh-modal-close').onclick = () => modal.remove();
            modal.onclick = (event) => { // Close if clicked outside content
                if (event.target === modal) {
                    modal.remove();
                }
            };
            // Trigger animation
            setTimeout(() => modal.classList.add('show'), 10);
            return modal;
        },

        // 创建单个字幕项
        createSubtitleItem: (listElement, subtitle, videoCode) => {
            const item = document.createElement('li');
            item.className = 'emh-subtitle-item'; // Class for styling list items

            // 获取原始文件名（直接从API返回）
            let originalFilename = subtitle.name || '';

            // 确保文件名有扩展名
            if (originalFilename && !originalFilename.toLowerCase().endsWith(`.${subtitle.ext}`)) {
                originalFilename = `${originalFilename}.${subtitle.ext || 'srt'}`;
            } else if (!originalFilename) { // 如果name为空，则创建一个默认名
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
                        <button class="btn btn-primary emh-download-subtitle-btn" data-url="${subtitle.url}" data-filename="${downloadFilename}">缓存下载</button>
                        <a href="${subtitle.url}" target="_blank" class="btn btn-outline" download="${downloadFilename}">直接下载</a>
                    ` : ''}
                </div>
            `;
            listElement.appendChild(item);
            return item;
        },

        // 下载字幕文件 (using GM_xmlhttpRequest for robust cross-origin downloads)
        downloadSubtitle: async (url, defaultFilename) => {
            try {
                UTILS.showToast('正在获取字幕文件...', 'info');

                // 处理可能的跨域问题
                if (typeof GM_xmlhttpRequest !== 'undefined') {
                    // 使用GM_xmlhttpRequest获取字幕内容（可绕过跨域限制）
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        responseType: 'blob', // Important for binary files like subtitles
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
                    // 使用标准fetch API (fallback, may have CORS issues)
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
                                        'Accept': 'text/plain, application/octet-stream' // General accept for subtitles
                                    }
                                });

                                if (response.ok) {
                                    const blob = await response.blob();
                                    SUBTITLE_MANAGER.processSubtitleDownload(blob, defaultFilename);
                                    success = true;
                                    break; // Exit loop on success
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
                downloadLink.download = defaultFilename; // This is the key for setting the filename
                downloadLink.style.display = 'none'; // Hide the link

                // 添加到文档中并点击
                document.body.appendChild(downloadLink);
                downloadLink.click();

                // 清理
                setTimeout(() => {
                    document.body.removeChild(downloadLink);
                    URL.revokeObjectURL(objectUrl);
                }, 100); // Small delay to ensure download starts

                UTILS.showToast(`字幕文件 "${defaultFilename}" 下载已开始`, 'success');
            } catch (error) {
                console.error('字幕下载处理失败:', error);
                UTILS.showToast('字幕下载处理失败', 'error');
            }
        }
    };
    // ... (上一部分JS代码) ...

    const UTILS = {
        getDomain: () => document.domain,

        getCodeFromUrl: (url) => {
            // 改进的正则，尝试匹配更标准的番号格式，并处理末尾的斜杠
            const match = url.match(/\/([a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)\/?$/i);
            return match ? match[1].toUpperCase() : null;
        },

        getPosterImage: () => {
            // Try Plyr specific poster
            const videoContainer = document.querySelector('.video-player-container, .player-container, #player');
            if (videoContainer) {
                const posterElem = videoContainer.querySelector('.plyr__poster, [poster]');
                if (posterElem) {
                    if (posterElem.hasAttribute('poster')) {
                        return posterElem.getAttribute('poster');
                    }
                    // For elements using background-image style for poster
                    const backgroundImageStyle = window.getComputedStyle(posterElem).getPropertyValue('background-image');
                    const matches = /url\("(.+)"\)/.exec(backgroundImageStyle);
                    return matches ? matches[1] : null;
                }
            }
            // Fallback to Open Graph or Twitter card image
            const metaPoster = document.querySelector('meta[property="og:image"], meta[name="twitter:image"]');
            return metaPoster ? metaPoster.content : null;
        },

        getActressNames: () => {
            // More robust selectors for actress names across different site structures
            const actressLinks = document.querySelectorAll(
                '.video-info .info-item a[href*="/actress/"], .models-list .model a, .attributes a[href*="/star/"], a[href*="/idol/"], .video-actor li a, .star-name a, .javstar a, .video-meta-actor a'
            );
            return Array.from(actressLinks)
                .map(link => link.getAttribute('title') || link.textContent.trim())
                .filter(name => name) // Remove empty names
                .filter((value, index, self) => self.indexOf(value) === index) // Unique names
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
            setTimeout(() => toast.classList.add('show'), 10); // Animate in
            setTimeout(() => {
                toast.classList.remove('show');
                toast.addEventListener('transitionend', () => toast.remove()); // Remove after animation
            }, CONFIG.toastDuration);
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
                // Fallback for older browsers or if clipboard API fails
                try {
                    const textArea = document.createElement("textarea");
                    textArea.value = text;
                    textArea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
                    textArea.style.top = "0";
                    textArea.style.left = "0";
                    textArea.style.opacity = "0"; // Hide it
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

        // In UTILS object, replace the existing addActionButtons:
addActionButtons: (container, videoUrl, videoCode, isDetailPage = false) => { // Added isDetailPage parameter
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "emh-action-buttons";

    if (videoCode) {
        // The status indicator is now the first element in the button container
        // It will be created and prepended here.
        createCodeStatusIndicator(buttonContainer, videoCode); // Pass buttonContainer as parent

        // Auto-add to library if enabled AND on a detail page
        if (isDetailPage && CONFIG.codeManager.autoAddDetected && CODE_LIBRARY.initialized) {
            const existingItem = CODE_LIBRARY.getItem(videoCode);
            if (!existingItem) {
                let title = '';
                const titleElement = document.querySelector("h4.title, h1.post-title, .video-info h4, meta[property='og:title']");
                if (titleElement) {
                    title = titleElement.content || titleElement.innerText.trim();
                    if (title.includes(videoCode)) {
                        title = title.split(videoCode).pop().trim().replace(/^[-–—\s]+/, '');
                    }
                }
                CODE_LIBRARY.markItem(videoCode, 'unmarked', title);
                // console.log(`EMH: Auto-added ${videoCode} to library because it's a detail page.`);
            }
        }
    }

    const copyButton = document.createElement("button");
    copyButton.id = "emh-copyLink";
    copyButton.className = "btn btn-primary";
    copyButton.innerHTML = "<span>📋 复制链接</span>";
    copyButton.title = videoUrl || "无有效视频链接";
    copyButton.dataset.videoUrl = videoUrl || '';
    buttonContainer.appendChild(copyButton);

    const sendButton = document.createElement("button");
    sendButton.id = "emh-sendData";
    sendButton.className = "btn btn-danger";
    sendButton.innerHTML = "<span>💾 发送到服务器</span>";
    sendButton.dataset.videoUrl = videoUrl || '';
    sendButton.dataset.videoCode = videoCode || '';
    buttonContainer.appendChild(sendButton);

    const subtitleButton = document.createElement("button");
    subtitleButton.id = "emh-getSubtitles";
    subtitleButton.className = "btn btn-success";
    subtitleButton.innerHTML = "<span>📄 获取字幕</span>";
    subtitleButton.dataset.videoCode = videoCode || '';
    if (!videoCode) { // Disable if no code
        subtitleButton.disabled = true;
        subtitleButton.classList.add('btn-disabled');
        subtitleButton.title = "无番号，无法获取字幕";
    }
    buttonContainer.appendChild(subtitleButton);



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

        // downloadSubtitle: (url, defaultFilename) => { // This function is duplicated, remove this one
        //     return SUBTITLE_MANAGER.downloadSubtitle(url, defaultFilename);
        // },

        createDraggableSubtitleButton: () => {
            const button = document.createElement('button');
            button.id = 'emh-draggable-custom-subtitle-btn'; // New ID
            button.className = 'btn btn-info emh-draggable-btn'; // JAV-JHS style + draggable specific
            button.innerHTML = '<span>🔍 高级搜索</span>'; // Updated text
            button.title = '拖动我 | 点击打开高级字幕搜索';

            let isDragging = false;
            let offsetX, offsetY;
            let hasDragged = false; // To distinguish click from drag
            let startX, startY;


            button.onmousedown = (e) => {
                if (e.button !== 0) return; // Only respond to left-click for dragging
                e.preventDefault(); // Prevent text selection while dragging

                isDragging = true;
                hasDragged = false; // Reset drag state
                button.style.cursor = 'grabbing';

                startX = e.clientX;
                startY = e.clientY;

                const rect = button.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
                button.style.position = 'fixed'; // Ensure it moves freely

                document.onmousemove = (moveEvent) => {
                    if (!isDragging) return;
                    // Consider it a drag if moved more than a few pixels
                    if (Math.abs(moveEvent.clientX - startX) > 3 || Math.abs(moveEvent.clientY - startY) > 3) {
                        hasDragged = true;
                    }
                    let newX = moveEvent.clientX - offsetX;
                    let newY = moveEvent.clientY - offsetY;
                    const viewportWidth = window.innerWidth;
                    const viewportHeight = window.innerHeight;
                    const buttonWidth = button.offsetWidth;
                    const buttonHeight = button.offsetHeight;

                    // Keep button within viewport
                    if (newX < 0) newX = 0;
                    if (newY < 0) newY = 0;
                    if (newX + buttonWidth > viewportWidth) newX = viewportWidth - buttonWidth;
                    if (newY + buttonHeight > viewportHeight) newY = viewportHeight - buttonHeight;

                    button.style.left = `${newX}px`;
                    button.style.top = `${newY}px`;
                    button.style.bottom = 'auto'; // Important if initially positioned with bottom/right
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
            // Default position if not set by user drag
            if (!button.style.left && !button.style.top) {
                 button.style.position = 'fixed';
                 button.style.bottom = '70px'; // Position above the Code Manager toggle
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
            modal.className = 'emh-modal'; // Reusing general modal styles

            const modalContent = document.createElement('div');
            modalContent.className = 'emh-modal-content emh-search-modal-content'; // Specific class for search modal

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
                    saveSearchHistory(searchTerm); // 保存到历史记录
                    modal.remove(); // 关闭搜索模态框
                    UTILS.fetchSubtitles(searchTerm); // 执行搜索
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
            UTILS.updateHistoryList(historyList); // Populate history

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
            setTimeout(() => modal.classList.add('show'), 10); // For CSS transition

            return modal;
        },

        // 更新历史列表
        updateHistoryList: (historyList) => {
            const history = getSearchHistory();

            if (history.length === 0) {
                historyList.innerHTML = '<div class="emh-empty-history">暂无搜索历史</div>';
                return;
            }

            historyList.innerHTML = ''; // Clear existing items
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
                    clearInputBtn.style.visibility = 'hidden'; // Hide after clearing
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
                clearInputBtn.style.visibility = searchInput.value ? 'visible' : 'hidden';
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
                                UTILS.updateHistoryList(historyList); // Re-render history list
                            }
                            UTILS.showToast('搜索历史已清除', 'success');
                        } else {
                            UTILS.showToast('清除历史失败', 'error');
                        }
                    }
                });
            }

            // 历史项使用按钮 (Event delegation for dynamically added items)
            const historyListContainer = modal.querySelector('.emh-search-history-list');
            if (historyListContainer) {
                historyListContainer.addEventListener('click', (e) => {
                    const useBtn = e.target.closest('.emh-history-use-btn');
                    if (useBtn) {
                        const term = useBtn.getAttribute('data-term');
                        if (term && searchInput) {
                            searchInput.value = term;
                            searchInput.focus();
                        }
                    }
                });
            }


            // 热门标签点击 (Event delegation)
            const trendingTagsContainer = modal.querySelector('.emh-trending-tags');
            if (trendingTagsContainer) {
                trendingTagsContainer.addEventListener('click', (e) => {
                    if (e.target.classList.contains('emh-trending-tag')) {
                        if (searchInput) {
                            searchInput.value = e.target.textContent;
                            searchInput.focus();
                        }
                    }
                });
            }
        },
        // 创建悬浮搜索按钮 (Alternative to the draggable one if preferred)
        createFloatingSearchButton: () => {
            const button = document.createElement('button');
            button.id = 'emh-floating-search-btn'; // Unique ID for this button
            button.className = 'emh-floating-btn'; // Style for a FAB-like button
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
            if (!filename) return '字幕'; // Default if no filename

            // 移除Windows/通用文件系统中的非法字符
            // \ / : * ? " < > | and control characters (0-31)
            let sanitized = filename.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '');

            // 替换连续空格为单个空格
            sanitized = sanitized.replace(/\s+/g, ' ').trim();

            // 如果清理后文件名过短或为空，返回默认名称
            return sanitized || '字幕';
        },
        // 下载字幕文件（先缓存再下载）- This is a duplicate of SUBTITLE_MANAGER.downloadSubtitle, removing
        // processSubtitleDownload: (blob, defaultFilename) => { // This is a duplicate of SUBTITLE_MANAGER.processSubtitleDownload, removing

    };


    const SITE_HANDLERS = {
        javtxt: {
            isMatch: () => UTILS.getDomain().includes('javtxt') || UTILS.getDomain().includes('tokyolib') || UTILS.getDomain().includes('javtext'),
            targetSelector: 'body > div.main > div.info > div.attributes > dl > dt:nth-child(2)', // Target the dt element containing the code
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
                updateGlobalVideoCode(cleanedCode); // Update the global code

                // 创建状态指示器容器
                const statusContainer = document.createElement('div');
                statusContainer.className = 'emh-code-status-container'; // For styling
                statusContainer.style.display = 'inline-block';
                statusContainer.style.marginLeft = '10px';
                createCodeStatusIndicator(statusContainer, cleanedCode);

                // 将状态指示器添加到番号文本后面
                targetElement.appendChild(statusContainer);


                const controlsContainer = document.createElement('div');
                controlsContainer.className = 'emh-controls-container'; // For styling
                config.links.forEach(linkConfig => {
                    const link = document.createElement('a');
                    link.href = linkConfig.urlTemplate.replace('$code', cleanedCode);
                    link.target = linkConfig.target;
                    link.className = 'btn btn-outline'; // JAV-JHS style
                    link.innerText = linkConfig.displayText;
                    controlsContainer.appendChild(link);
                });
                const subtitleButton = document.createElement('button');
                subtitleButton.id = 'emh-getSubtitles'; // Keep ID for main subtitle button consistency
                subtitleButton.className = 'btn btn-success'; // JAV-JHS style
                subtitleButton.innerHTML = '<span>📄 获取字幕</span>';
                subtitleButton.dataset.videoCode = cleanedCode;
                controlsContainer.appendChild(subtitleButton);
                // Insert controls after the parent <dl> of the target <dt>
                targetElement.parentNode.insertBefore(controlsContainer, targetElement.nextSibling);
            }
        },
        javgg: {
            isMatch: () => UTILS.getDomain().includes('javgg'),
            targetSelector: 'article.item.movies .data, h1.post-title, .videoinfo .meta', // More targets for different page types
            process: (targetElement) => { // targetElement can be null if we're on a detail page processed differently
                // Handle detail page (/jav/CODE/)
                if (window.location.pathname.includes('/jav/')) {
                    let detailVideoCode = UTILS.getCodeFromUrl(window.location.href);
                    if (!detailVideoCode) { // Fallback if URL doesn't have code directly
                        const titleElem = document.querySelector("h1.post-title, .section-title h1");
                        if (titleElem) {
                             const titleMatch = titleElem.textContent.match(/([A-Za-z]{2,5}-?\d{2,5})/);
                             if (titleMatch) detailVideoCode = titleMatch[1].toUpperCase();
                        }
                    }

                    if (detailVideoCode) {
                        updateGlobalVideoCode(detailVideoCode);
                        console.log(`JavGG Detail Page: Identified video code ${detailVideoCode}.`);
                        // Place buttons in a suitable container on the detail page
                        const detailTargetContainer = document.querySelector('.videoinfo .meta') || document.querySelector('h1.post-title')?.parentElement || document.querySelector('.single_post_content');
                        if (detailTargetContainer && !detailTargetContainer.querySelector('.emh-ui-container')) { // Check if buttons already added
                            const uiContainer = document.createElement("div");
                            uiContainer.className = "emh-ui-container";
                            uiContainer.style.marginTop = "15px"; // Add some space

                            const dataElement = document.createElement("span");
                            dataElement.id = "emh-dataElement";
                            dataElement.className = "btn btn-outline"; // JAV-JHS Style
                            dataElement.style.cursor = 'pointer';
                            dataElement.innerHTML = `番号: ${detailVideoCode}`;
                            dataElement.title = "点击搜索番号 (1cili)";
                            dataElement.dataset.videoCode = detailVideoCode;

                            // 创建状态指示器容器
                            const statusContainer = document.createElement('div');
                            statusContainer.className = 'emh-code-status-container';
                            statusContainer.style.display = 'inline-block';
                            statusContainer.style.marginLeft = '10px';
                            createCodeStatusIndicator(statusContainer, detailVideoCode);

                            // 将状态指示器添加到番号文本后面
                            dataElement.appendChild(statusContainer);


                            uiContainer.appendChild(dataElement);
                            UTILS.addActionButtons(uiContainer, '', detailVideoCode); // No direct video URL here
                            detailTargetContainer.appendChild(uiContainer);
                            console.log("EMH: Added main buttons to JavGG detail page.");
                        }
                        return; // Processed detail page, no need for list item processing
                    }
                }

                // Handle list pages (homepage, featured, new-post, etc.)
                if (document.querySelector("article.item.movies")) { // Check if it's a list page
                    const sidebar = document.querySelector("#contenedor > div > div.sidebar.right.scrolling");
                    if (sidebar) sidebar.remove(); // Remove sidebar for better layout

                    const linkProviders = [
                        { code: "njav", url: CONFIG.alternateUrl + "$p", target: "_blank" },
                        { code: "jable", url: "https://jable.tv/videos/$p/", target: "_blank" },
                        { code: "1cili", url: "https://1cili.com/search?q=$p", target: "_blank" }
                    ];

                    document.querySelectorAll("article.item.movies").forEach(entry => {
                        const dataElement = entry.querySelector(".data");
                        const anchorTag = dataElement ? dataElement.querySelector("h3 a") : null;
                        if (anchorTag) {
                            const videoCode = anchorTag.textContent.trim();
                            if (!videoCode) return; // Skip if no code
                            // Prevent adding buttons multiple times
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
                            controlsDiv.className = 'emh-javgg-controls'; // For styling
                            linkProviders.forEach(provider => {
                                const newAnchorTag = document.createElement("a");
                                newAnchorTag.href = provider.url.replace("$p", videoCode);
                                newAnchorTag.target = provider.target;
                                newAnchorTag.className = 'btn btn-outline'; // JAV-JHS Style
                                newAnchorTag.style.padding = '4px 8px'; // Smaller buttons for list items
                                newAnchorTag.style.fontSize = '12px';
                                newAnchorTag.textContent = provider.code;
                                controlsDiv.appendChild(newAnchorTag);
                            });
                            const subtitleButton = document.createElement('button');
                            subtitleButton.className = 'btn btn-success emh-subtitle-button-small'; // JAV-JHS style + specific for small
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
            targetSelector: '.video-toolbar, .video-info .level, .video-info .row, .text-center, #detail-container .pb-3, .container .mt-4, .player-container + div', // More robust selectors
            process: (targetElement) => {
    if (!targetElement) {
        console.error("Jable-like: Target container not found or page structure mismatch for EMH UI.");
        return;
    }
    // Prevent adding buttons multiple times
    if (targetElement.querySelector('.emh-ui-container') || document.querySelector('.emh-ui-container#emh-jable-main-ui')) {
        // console.log("EMH: UI container already exists on Jable-like page.");
        return;
    }

    const isCableAv = UTILS.getDomain().includes('cableav.tv');
    const isFs1App = UTILS.getDomain().includes('fs1.app');
    const currentPath = window.location.pathname;
    let videoUrl = '';
    let videoCode = null; // Initialize videoCode to null
    let isDetailPage = false;

    // Determine if it's a detail page and try to extract videoCode
    if ( (UTILS.getDomain().includes('jable.tv') || isFs1App) && currentPath.startsWith('/videos/') ) {
        const parts = currentPath.split('/').filter(Boolean);
        if (parts.length >= 2 && parts[0] === 'videos') {
            // For Jable/Fs1, code is usually parts[1] or parts[2] if there's a language part
            // e.g., /videos/language/code/ or /videos/code/
            // A more robust extraction for these sites:
            const potentialCode = parts[parts.length -1] || parts[parts.length-2];
            if (potentialCode && potentialCode.match(/^([A-Z0-9]+(?:-[A-Z0-9]+)*)$/i)) {
                 videoCode = UTILS.getCodeFromUrl(window.location.href); // Use the more general URL parser
            }
            if (videoCode) isDetailPage = true;
        }
    } else if (isCableAv && currentPath !== '/' && !currentPath.startsWith('/?p=')) {
        // For cableav, a path like /CODE/ is a detail page
        videoCode = UTILS.getCodeFromUrl(window.location.href);
        if (videoCode) isDetailPage = true;
    }

    // If it's determined to be a detail page, try more methods to get the code if still null
    if (isDetailPage && !videoCode) {
        const titleCodeMatch = document.title.match(/^([A-Z0-9-]+)/i);
        if (titleCodeMatch) videoCode = titleCodeMatch[1].toUpperCase();
    }
    if (isDetailPage && !videoCode) {
        const ogTitle = document.querySelector("meta[property='og:title']");
        if (ogTitle && ogTitle.content) {
            const titleMatch = ogTitle.content.match(/^([A-Z0-9-]+)/i);
            if (titleMatch) videoCode = titleMatch[1].toUpperCase();
        }
    }

    // Video URL extraction (primarily for detail pages)
    if (isDetailPage && videoCode) {
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
            if (videoUrl) { // Append code only if videoUrl was found
                videoUrl += "#" + videoCode;
            }
        } else { // CableAV
            const metaTag = document.head.querySelector("meta[property~='og:video:url'][content]");
            if (metaTag) videoUrl = metaTag.content;
        }
    }

    if (videoCode) { // If a code was determined (likely only on detail pages now)
        updateGlobalVideoCode(videoCode);
    } else if (isDetailPage) { // If it's a detail page but we couldn't find a code
        console.warn("Jable-like: Video code could not be determined for this detail page by EMH.");
    }


    const uiContainer = document.createElement("div");
    uiContainer.className = "emh-ui-container";
    uiContainer.id = "emh-jable-main-ui"; // Add an ID to make the check more specific

    // Only add the "番号: CODE" display element if a videoCode is found (typically on detail pages)
    if (videoCode && isDetailPage) { // Ensure it's a detail page for this element too
        const dataElement = document.createElement("span");
        dataElement.id = "emh-dataElement";
        dataElement.className = "btn btn-outline";
        dataElement.style.cursor = 'pointer';
        dataElement.innerHTML = `番号: ${videoCode}`; // No separate status indicator here
        dataElement.title = "点击搜索番号 (1cili)";
        dataElement.dataset.videoCode = videoCode;
        uiContainer.appendChild(dataElement);
    }

    // Pass isDetailPage flag to addActionButtons.
    // videoCode might be null here if not a detail page or code not found.
    // addActionButtons handles the indicator and auto-add based on videoCode and isDetailPage.
    UTILS.addActionButtons(uiContainer, videoUrl, videoCode, isDetailPage);
    targetElement.appendChild(uiContainer);
    // console.log(`EMH: Added UI to Jable-like. Target:`, targetElement, `isDetailPage: ${isDetailPage}, Code: ${videoCode}`);
}
        }
    };

    const VIDEO_MANAGER = {
        sendVideoData: (button) => {
            const videoUrl = button.dataset.videoUrl || '';
            const videoCode = button.dataset.videoCode || EMH_currentVideoCode || UTILS.getCodeFromUrl(window.location.href);
            const titleElement = document.querySelector("h4.title, h1.post-title, .video-info h4, meta[property='og:title']");
            let title = titleElement ? (titleElement.content || titleElement.innerText.trim()) : document.title;
            // Clean title: remove code and leading/trailing hyphens/spaces
            if (videoCode && title.includes(videoCode)) {
                title = title.split(videoCode).pop().trim().replace(/^[-–—\s]+/, '');
            }

            const posterImage = UTILS.getPosterImage();
            const actress = UTILS.getActressNames();

            const videoData = {
                code: videoCode || 'UNKNOWN', // Default if no code found
                name: title || 'Untitled',
                img: posterImage || '',
                url: window.location.href, // Current page URL
                actress: actress || '',
                video: videoUrl || '' // M3U8 or video file URL
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
                    timeout: 10000, // 10 seconds timeout
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
            } else { // Fallback if GM_xmlhttpRequest is not available (less likely in userscripts)
                fetch(apiUrl, { mode: 'no-cors', signal: AbortSignal.timeout(10000) }) // no-cors will likely not give useful response but attempts send
                    .then(response => {
                        UTILS.showToast("数据已尝试发送 (no-cors)", "success"); // Cannot confirm success with no-cors
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
            return videoData; // Return the data that was attempted to be sent
        }
    };

    function extractCode(text) {
        if (!text) return null;
        // Improved regex: more flexible, allows letters before hyphen, requires digits after.
        // Handles cases like SSIS-123, MEYD-001, FC2-1234567, or just ABC-123
        const match = text.match(/([A-Za-z]{2,5}-?\d{2,7})/);
        return match ? match[1].toUpperCase() : text.replace(/\s*\(.*?\)/g, '').trim().toUpperCase(); // Fallback to cleaning up the text
    }


    function waitForElement(selector, callback, timeout = CONFIG.elementCheckTimeout) {
        const startTime = Date.now();
        const intervalId = setInterval(() => {
            const elements = document.querySelectorAll(selector); // Use querySelectorAll
            if (elements.length > 0) {
                clearInterval(intervalId);
                callback(elements[0]); // Pass the first matched element
            } else if (Date.now() - startTime > timeout) {
                clearInterval(intervalId);
                console.warn(`EMH: Element "${selector}" not found within ${timeout}ms.`);
                callback(null); // Indicate element not found
            }
        }, CONFIG.elementCheckInterval);
    }

    // 给可拖动按钮增加高级搜索功能 (replaces simple prompt with advanced search modal)
    function enhanceDraggableButton() {
        const draggableBtn = document.getElementById('emh-draggable-custom-subtitle-btn');
        if (draggableBtn) {
            draggableBtn.innerHTML = '<span>🔍 高级搜索</span>'; // Update text and icon
            draggableBtn.title = '拖动我 | 点击打开高级字幕搜索';

            // Retain existing drag functionality, but modify click behavior.
            // The drag logic is already in UTILS.createDraggableSubtitleButton
            // We only need to ensure the click action is correctly handled by that function.
            // The original UTILS.createDraggableSubtitleButton's onmouseup already handles the !hasDragged click.
        } else {
            // If the original draggable button isn't found (e.g., if it was removed or ID changed),
            // create the new floating search button as a fallback or primary UI element.
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
                        // For JavGG, process even if targetElement is null (for detail page)
                        if (targetElement || name === 'javgg') {
                             try {
                                setTimeout(() => { handler.process(targetElement); }, 50); // Slight delay for dynamic content
                            } catch (e) { console.error(`EMH: Error processing handler ${name} with target:`, e, targetElement); }
                        }
                    });
                } else { // For handlers that don't need a specific target (e.g., global page modifications)
                    try {
                        setTimeout(() => handler.process(null), 150); // Slightly longer delay if no target
                    } catch (e) { console.error(`EMH: Error processing handler ${name} immediately:`, e); }
                }
                break; // Assuming only one handler matches per page
            }
        }
        if (!handlerFound) {
            console.log("EMH: No matching handler found for this site.");
        }
        setupEventListeners();

        // 延迟执行增强可拖动按钮功能，确保原按钮已创建
        setTimeout(() => {
            enhanceDraggableButton(); // This will either enhance existing or create new
        }, 1500); // Delay to ensure other UI elements are potentially loaded
    }

    function setupEventListeners() {
        // Use event delegation for dynamically added elements where possible
        $(document).off('.emh'); // Remove previous EMH event listeners to prevent duplicates

        $(document).on('click.emh', '#emh-copyLink', function () {
            UTILS.copyToClipboard($(this).data('videoUrl'));
        });

        $(document).on('click.emh', '#emh-sendData', function () {
            VIDEO_MANAGER.sendVideoData(this);
        });

        // Combined handler for main and small subtitle buttons
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
        // Event listener for the new floating search button (if created)
        $(document).on('click.emh', '#emh-floating-search-btn', function () {
            const defaultSearchTerm = EMH_currentVideoCode || '';
            UTILS.createSearchModal(defaultSearchTerm);
        });

        // Event listener for trending tags in search modal (if open)
        // This needs to be delegated if the modal is created/destroyed
        $(document).on('click.emh', '.emh-trending-tag', function () {
            const searchInput = document.getElementById('emh-subtitle-search-input');
            if (searchInput) { // Check if search modal is open and input exists
                searchInput.value = $(this).text();
                searchInput.focus();
            }
        });

        // 字幕下载按钮点击事件 (delegated to document for items in modal)
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
        const cssUrl = "https://cdn.jsdelivr.net/gh/giffcores/giffcores@main/enhanced_media_helper.css";
        // 获取当前时间戳作为查询参数，以尝试绕过CDN缓存（用于开发/测试）
        // 对于生产环境，你可能不需要 '?v=' + Date.now()，除非你希望每次加载都获取最新版本
        const cssUrlWithCacheBuster = cssUrl + '?v=' + Date.now();


        if (typeof GM_xmlhttpRequest !== "undefined") {
            GM_xmlhttpRequest({
                method: "GET",
                url: cssUrlWithCacheBuster, // 使用带有缓存破坏参数的URL
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        GM_addStyle(response.responseText);
                        console.log("EMH: CSS loaded successfully from CDN.");
                    } else {
                        console.error(`EMH: Failed to load CSS from CDN. Status: ${response.status}`);
                        fallbackLoadCss(); // 尝试备用加载或提示错误
                    }
                },
                onerror: function(error) {
                    console.error("EMH: Error loading CSS from CDN:", error);
                    fallbackLoadCss(); // 尝试备用加载或提示错误
                },
                ontimeout: function() {
                    console.error("EMH: Timeout loading CSS from CDN.");
                    fallbackLoadCss();
                }
            });
        } else {
            console.warn("EMH: GM_xmlhttpRequest is not available. Cannot load CSS from CDN dynamically.");
            // 作为最后的手段，可以尝试使用 <link> 标签，但这在用户脚本中不总是可靠或被允许
            try {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = cssUrl; // 不带缓存破坏参数，依赖浏览器缓存
                document.head.appendChild(link);
                 console.log("EMH: Attempting to load CSS via <link> tag as fallback.");
            } catch (e) {
                console.error("EMH: Fallback CSS load via <link> tag failed.", e);
            }
        }
    }

    // 可选的备用函数，如果CDN加载失败
    function fallbackLoadCss() {
        // 你可以在这里实现一个备用逻辑，比如：
        // 1. 尝试从另一个CDN加载
        // 2. 如果之前有将CSS内嵌在脚本中的版本，可以临时注入那个版本的CSS
        // 3. 或者简单地显示一个错误提示给用户
        UTILS.showToast("无法加载脚本样式，部分界面可能显示不正确。", "error");
        // 例如，如果你有一个内嵌的极简CSS作为备用：
        // const minimalFallbackCSS = `
        // .emh-modal { display: none !important; } /* 隐藏主要组件以避免无样式混乱 */
        // #custom-toast-container { display: block !important; } /* 确保toast可见 */
        // /* ...其他必要的最小化样式... */
        // `;
        // GM_addStyle(minimalFallbackCSS);
    }
    function createCodeStatusIndicator(container, code) {
    if (!code || !container) return null;

    if (!CODE_LIBRARY.initialized) {
        CODE_LIBRARY.init();
    }

    const currentStatus = CODE_LIBRARY.getStatus(code);
    const statusIndicator = document.createElement('div');
    statusIndicator.className = 'emh-code-status-indicator';
    statusIndicator.dataset.code = code;
    statusIndicator.dataset.status = currentStatus;

    const statusColors = CONFIG.codeManager.statusColors;
    statusIndicator.style.backgroundColor = statusColors[currentStatus] || statusColors.unmarked;

    let statusText = '未标记';
    if (currentStatus === 'favorite') statusText = '已关注';
    if (currentStatus === 'watched') statusText = '已看过';

    if (currentStatus === 'watched') {
        statusIndicator.title = `状态: ${statusText} (请在番号库中修改状态)`;
        statusIndicator.style.cursor = 'default';
    } else {
        statusIndicator.title = `状态: ${statusText} (点击${currentStatus === 'favorite' ? '取消' : ''}关注)`;
        statusIndicator.style.cursor = 'pointer';
    }

    statusIndicator.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const latestStatus = CODE_LIBRARY.getStatus(code); // Get fresh status
        if (latestStatus === 'watched') {
            UTILS.showToast('已看状态请在番号库中修改', 'warning');
            return;
        }
        const newStatus = latestStatus === 'favorite' ? 'unmarked' : 'favorite';
        CODE_LIBRARY.markItem(code, newStatus); // This will save and trigger 'emh_library_updated'
        const newStatusText = newStatus === 'favorite' ? '已关注' : '已取消关注'; // Corrected for display
        UTILS.showToast(`番号 ${code} ${newStatusText}`, 'success');
    });

    // Prepend the indicator to its container so it appears first
    if (container.firstChild) {
        container.insertBefore(statusIndicator, container.firstChild);
    } else {
        container.appendChild(statusIndicator);
    }
    return statusIndicator;
}

    // 更新所有番号状态指示器
    function updateCodeStatusIndicators() {
        // 更新所有页面上的状态指示器
        document.querySelectorAll('.emh-code-status-indicator').forEach(indicator => {
            const code = indicator.dataset.code;
            if (!code) return;

            const currentStatus = CODE_LIBRARY.getStatus(code);
            indicator.dataset.status = currentStatus; // Update status attribute

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
        currentFilter: 'all', // Default filter
        searchQuery: '',
        selectedItems: [],    // For multi-select
        multiSelectMode: false,
        isVisible: false,     // Track panel visibility
        lastSyncTimestamp: null, // For cross-tab sync

        createToggleButton: function() {
            // Remove existing button if any to prevent duplicates on script re-run (e.g., during development)
            const existingButton = document.getElementById('emh-code-manager-toggle');
            if (existingButton) {
                existingButton.remove();
            }

            const btn = document.createElement('button');
            btn.id = 'emh-code-manager-toggle';
            btn.className = 'emh-code-manager-toggle'; // CSS will style this
            btn.innerHTML = '<span>📋 番号库</span>';
            btn.title = '管理番号库';

            btn.addEventListener('click', () => {
                this.togglePanel();
            });

            document.body.appendChild(btn);
        },


        init: function() {
            if (!this.initialized) {
                // Styles are now in the CSS file, loaded via addCustomStyles()
                // this.createStyles(); // No longer needed here
                this.createPanelElement();
                this.createToggleButton(); // Ensure the toggle button is created
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
            if (!this.panelElement) { // Ensure panel DOM is created
                this.createPanelElement();
            }
            // First, ensure CODE_LIBRARY is initialized
            if (!CODE_LIBRARY.initialized) {
                CODE_LIBRARY.init();
            }

            this.isVisible = true;
            this.panelElement.classList.add('visible');
            this.refreshPanelContent(); // Load content when shown
        },

        // Hide the panel
        hidePanel: function() {
            this.isVisible = false;
            if (this.panelElement) {
                this.panelElement.classList.remove('visible');
            }
            // Exit multi-select mode if panel is closed
            if (this.multiSelectMode) {
                this.toggleMultiSelectMode(false); // Pass false to explicitly turn off
            }
        },
        // Create the panel element
        createPanelElement: function() {
            if (this.panelElement) return; // Already created

            const panel = document.createElement('div');
            panel.id = 'emh-code-manager-panel';
            panel.className = 'emh-code-manager-panel'; // Base class for styling

            // Panel HTML structure
            panel.innerHTML = `
                <div class="emh-panel-header">
                    <h2>番号管理</h2>
                    <div class="emh-panel-controls">
                        <button class="emh-panel-close" title="关闭面板">&times;</button>
                    </div>
                </div>
                <div class="emh-panel-tabs">
                    <button data-filter="all" class="active">全部</button>
                    <button data-filter="favorite">关注列表</button>
                    <button data-filter="watched">已看记录</button>
                    <button data-filter="trash">回收站</button>
                </div>
                <div class="emh-panel-search">
                    <input type="text" placeholder="搜索番号、标题或备注..." />
                    <button class="emh-search-btn" title="搜索">🔍</button>
                </div>
                <div class="emh-panel-content">
                    </div>
                <div class="emh-panel-actions">
                    <button id="emh-add-code" class="btn btn-primary">添加</button>
                    <button id="emh-multi-select" class="btn btn-outline">多选</button>
                    <button id="emh-export" class="btn btn-info">导出</button>
                    <button id="emh-import" class="btn btn-info">导入</button>
                    <button id="emh-clear-trash" class="btn btn-danger" style="display: none;">清空回收站</button>
                </div>
                <div class="emh-panel-multi-actions" style="display: none;">
                    <span class="emh-selected-count">已选择 0 项</span>
                    <button id="emh-mark-favorite-multi" class="btn btn-danger">标为关注</button>
                    <button id="emh-mark-watched-multi" class="btn btn-success">标为已看</button>
                    <button id="emh-delete-selected-multi" class="btn btn-outline">删除选中</button>
                    <button id="emh-cancel-multi" class="btn btn-outline">取消多选</button>
                </div>
                <div class="emh-panel-modal" style="display: none;">
                    <div class="emh-panel-modal-content">
                        <h3></h3>
                        <div class="emh-panel-modal-buttons">
                            <button class="btn btn-danger emh-panel-modal-confirm">确定</button>
                            <button class="btn btn-outline emh-panel-modal-cancel">取消</button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(panel);
            this.panelElement = panel;

            // Add close button listener immediately after creation
            panel.querySelector('.emh-panel-close').addEventListener('click', () => {
                this.hidePanel();
            });
        },
        // Add CSS styles for the panel - Removed as CSS is now external
        // createStyles: function() { ... }

        // Attach event listeners
        attachEventListeners: function() {
            if (!this.panelElement) return;

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
            const searchBtn = this.panelElement.querySelector('.emh-panel-search .emh-search-btn');

            searchInput.addEventListener('input', (e) => { // Live search on input
                this.searchQuery = e.target.value;
                this.refreshPanelContent();
            });
            searchInput.addEventListener('keypress', (e) => { // Search on Enter key
                if (e.key === 'Enter') {
                    this.searchQuery = e.target.value;
                    this.refreshPanelContent();
                }
            });
            searchBtn.addEventListener('click', () => { // Search on button click
                this.searchQuery = searchInput.value;
                this.refreshPanelContent();
            });

            // Multi-select mode toggle
            const multiSelectBtn = this.panelElement.querySelector('#emh-multi-select');
            multiSelectBtn.addEventListener('click', () => {
                this.toggleMultiSelectMode();
            });

            // Multi-select actions
            this.panelElement.querySelector('#emh-mark-favorite-multi').addEventListener('click', () => {
                this.batchMarkItems('favorite');
            });
            this.panelElement.querySelector('#emh-mark-watched-multi').addEventListener('click', () => {
                this.batchMarkItems('watched');
            });
            this.panelElement.querySelector('#emh-delete-selected-multi').addEventListener('click', () => {
                this.batchDeleteItems();
            });
            this.panelElement.querySelector('#emh-cancel-multi').addEventListener('click', () => {
                this.toggleMultiSelectMode(false); // Explicitly turn off
            });


            // Add code button
            this.panelElement.querySelector('#emh-add-code').addEventListener('click', () => {
                const code = prompt('请输入要添加的番号:');
                if (code && code.trim() !== "") {
                    const title = prompt('请输入标题 (可选):') || '';
                    const remarks = prompt('请输入备注 (可选):') || '';
                    if (CODE_LIBRARY.add(code.trim(), title, remarks)) {
                        this.refreshPanelContent();
                        UTILS.showToast(`番号 ${code.trim().toUpperCase()} 已添加`, 'success');
                    }
                } else if (code !== null) { // User didn't cancel but entered empty string
                    UTILS.showToast('番号不能为空', 'warning');
                }
            });

            // Export button
            this.panelElement.querySelector('#emh-export').addEventListener('click', () => {
            // Get currently displayed items
            let itemsToExport = [];
            let currentViewName = this.currentFilter; // e.g., "all", "favorite", "watched", "trash"

            // 1. Get base items based on the current filter tab
            switch(this.currentFilter) {
                case 'favorite':
                    itemsToExport = CODE_LIBRARY.getFavorites();
                    break;
                case 'watched':
                    itemsToExport = CODE_LIBRARY.getWatched();
                    break;
                case 'trash':
                    itemsToExport = CODE_LIBRARY.getTrash();
                    break;
                default: // 'all'
                    itemsToExport = CODE_LIBRARY.getAll();
                    break;
            }

            // 2. Apply search query if there is one
            if (this.searchQuery && this.searchQuery.trim() !== "") {
                const query = this.searchQuery.toLowerCase().trim();
                itemsToExport = itemsToExport.filter(item =>
                    item.code.toLowerCase().includes(query) ||
                    (item.title && item.title.toLowerCase().includes(query)) ||
                    (item.remarks && item.remarks.toLowerCase().includes(query))
                );
                currentViewName += `_searched_${this.searchQuery.replace(/\s+/g, '_')}`; // Append search term to filename
            }

            // 3. Sort items as they are displayed (optional, but good for consistency)
            itemsToExport.sort((a, b) => new Date(b.modifiedDate) - new Date(a.modifiedDate));


            // 4. Prepare export data object
            const exportData = {
                version: "1.1", // Updated version to reflect new export logic
                exportDate: new Date().toISOString(),
                filter: this.currentFilter, // Original filter tab
                searchQuery: this.searchQuery, // Applied search query
                itemCount: itemsToExport.length,
                items: itemsToExport // The actual filtered and searched items
            };

            if (itemsToExport.length === 0) {
                UTILS.showToast('当前列表为空，无需导出', 'info');
                return;
            }

            const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            // Sanitize currentViewName for filename
            const sanitizedViewName = currentViewName.replace(/[^a-z0-9_.-]/gi, '_');
            a.download = `emh_code_library_${sanitizedViewName}_${new Date().toISOString().slice(0,10)}.json`;
            document.body.appendChild(a); // Required for Firefox
            a.click();
            document.body.removeChild(a); // Clean up
            URL.revokeObjectURL(url);
            UTILS.showToast(`成功导出 ${itemsToExport.length} 个当前列表中的项目`, 'success');
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
                        reader.onload = (ev) => {
                            try {
                                const data = JSON.parse(ev.target.result);
                                const importMode = confirm("是否覆盖现有相同番号的条目？\n点击“确定”进行合并/覆盖，点击“取消”仅添加新条目。") ? 'merge' : 'merge_new_only'; // Simplified for user
                                const result = CODE_LIBRARY.importData(data, 'merge'); // Default to merge, can add option later
                                this.refreshPanelContent();
                                UTILS.showToast(result.message, result.success ? 'success' : 'error');
                            } catch (err) {
                                console.error('Import failed:', err);
                                UTILS.showToast('数据导入失败: ' + err.message, 'error');
                            }
                        };
                        reader.readAsText(file);
                    }
                };
                input.click();
            });

            // Event delegation for item actions (delete, mark favorite/watched)
            const contentArea = this.panelElement.querySelector('.emh-panel-content');
            contentArea.addEventListener('click', (e) => {
                const target = e.target;
                const itemElement = target.closest('.emh-item');
                if (!itemElement) return;

                const code = itemElement.dataset.code;
                if (!code) return;

                // Handle item click for multi-select mode
                if (this.multiSelectMode && !target.closest('.emh-item-actions')) {
                     const checkbox = itemElement.querySelector('.emh-item-checkbox');
                     if (checkbox) { // Ensure checkbox exists before trying to toggle
                        checkbox.checked = !checkbox.checked;
                        // Manually trigger change event if needed for other listeners, or update selectedItems directly
                        if (checkbox.checked) {
                            if (!this.selectedItems.includes(code)) this.selectedItems.push(code);
                            itemElement.classList.add('selected');
                        } else {
                            this.selectedItems = this.selectedItems.filter(c => c !== code);
                            itemElement.classList.remove('selected');
                        }
                        this.updateMultiSelectCount();
                     }
                    return; // Prevent action buttons if in multi-select and clicked on item body
                }


                // Handle action buttons
                if (target.closest('.emh-mark-favorite')) {
                    e.stopPropagation();
                    const currentStatus = CODE_LIBRARY.getStatus(code);
                    const newStatus = currentStatus === 'favorite' ? 'unmarked' : 'favorite';
                    CODE_LIBRARY.markItem(code, newStatus);
                    // refreshPanelContent will be called by 'emh_library_updated'
                    UTILS.showToast(`番号 ${code} ${newStatus === 'favorite' ? '已关注' : '已取消关注'}`, 'success');
                } else if (target.closest('.emh-mark-watched')) {
                    e.stopPropagation();
                     const currentStatus = CODE_LIBRARY.getStatus(code);
                    const newStatus = currentStatus === 'watched' ? 'unmarked' : 'watched';
                    CODE_LIBRARY.markItem(code, newStatus);
                    UTILS.showToast(`番号 ${code} ${newStatus === 'watched' ? '已标记为已看' : '已取消已看'}`, 'success');
                } else if (target.closest('.emh-delete')) {
                    e.stopPropagation();
                    this.showConfirmDialog(`确定要将番号 ${code} 移至回收站吗？`, () => {
                        CODE_LIBRARY.delete(code);
                        // refreshPanelContent will be called by 'emh_library_updated'
                        UTILS.showToast(`番号 ${code} 已移至回收站`, 'success');
                    });
                } else if (target.closest('.emh-restore')) { // For trash view
                     e.stopPropagation();
                     const itemToRestore = CODE_LIBRARY.trash.items.find(i => i.code === code);
                     if (itemToRestore) {
                         CODE_LIBRARY.trash.items = CODE_LIBRARY.trash.items.filter(i => i.code !== code);
                         delete itemToRestore.deleteDate; // Remove delete date
                         CODE_LIBRARY.data.items.unshift(itemToRestore); // Add back to main list
                         CODE_LIBRARY.save();
                         this.refreshPanelContent();
                         UTILS.showToast(`番号 ${code} 已还原`, 'success');
                     }
                } else if (target.closest('.emh-delete-permanently')) { // For trash view
                    e.stopPropagation();
                    this.showConfirmDialog(`确定要永久删除番号 ${code} 吗？此操作不可撤销！`, () => {
                        CODE_LIBRARY.trash.items = CODE_LIBRARY.trash.items.filter(i => i.code !== code);
                        CODE_LIBRARY.save(); // Save changes to trash
                        this.refreshPanelContent();
                        UTILS.showToast(`番号 ${code} 已永久删除`, 'success');
                    });
                }
            });


            // Clear trash button
            const clearTrashBtn = this.panelElement.querySelector('#emh-clear-trash');
            if (clearTrashBtn) {
                clearTrashBtn.addEventListener('click', () => {
                    this.clearTrash();
                });
            }
        },
        updateMultiSelectCount: function() {
            if (this.multiSelectMode && this.panelElement) {
                this.panelElement.querySelector('.emh-selected-count').textContent =
                    `已选择 ${this.selectedItems.length} 项`;
            }
        },


        // Toggle multi-select mode
        toggleMultiSelectMode: function(forceState) {
            this.multiSelectMode = (typeof forceState === 'boolean') ? forceState : !this.multiSelectMode;
            this.selectedItems = []; // Clear selection when toggling mode

            const actionsBar = this.panelElement.querySelector('.emh-panel-actions');
            const multiActionsBar = this.panelElement.querySelector('.emh-panel-multi-actions');
            const multiSelectBtn = this.panelElement.querySelector('#emh-multi-select');


            if (this.multiSelectMode) {
                actionsBar.style.display = 'none';
                multiActionsBar.style.display = 'flex';
                multiSelectBtn.textContent = '取消多选';
                multiSelectBtn.classList.add('active');
            } else {
                actionsBar.style.display = 'flex';
                multiActionsBar.style.display = 'none';
                multiSelectBtn.textContent = '多选';
                multiSelectBtn.classList.remove('active');
            }
            this.updateMultiSelectCount();
            this.refreshPanelContent(); // Re-render items to show/hide checkboxes
        },


        // Refresh panel content based on current filter and search term
        refreshPanelContent: function() {
            if (!this.panelElement || !CODE_LIBRARY.initialized) return;

            const contentArea = this.panelElement.querySelector('.emh-panel-content');
            let items = [];

            // Get items based on current filter
            const clearTrashBtn = this.panelElement.querySelector('#emh-clear-trash');
            const regularActionButtons = ['#emh-add-code', '#emh-multi-select', '#emh-export', '#emh-import'];

            if (this.currentFilter === 'trash') {
                items = CODE_LIBRARY.getTrash();
                clearTrashBtn.style.display = items.length > 0 ? 'inline-flex' : 'none';
                regularActionButtons.forEach(sel => this.panelElement.querySelector(sel).style.display = 'none');
            } else {
                clearTrashBtn.style.display = 'none';
                regularActionButtons.forEach(sel => this.panelElement.querySelector(sel).style.display = 'inline-flex');
                if (this.currentFilter === 'all') items = CODE_LIBRARY.getAll();
                else if (this.currentFilter === 'favorite') items = CODE_LIBRARY.getFavorites();
                else if (this.currentFilter === 'watched') items = CODE_LIBRARY.getWatched();
            }


            // Apply search filter if needed
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                items = items.filter(item =>
                    item.code.toLowerCase().includes(query) ||
                    (item.title && item.title.toLowerCase().includes(query)) ||
                    (item.remarks && item.remarks.toLowerCase().includes(query))
                );
            }

            // Sort items: by modifiedDate descending (newest first)
            items.sort((a, b) => new Date(b.modifiedDate) - new Date(a.modifiedDate));


            // Generate HTML for items
            const itemsHtml = items.map(item => this.generateItemHtml(item)).join('');
            contentArea.innerHTML = itemsHtml || '<div class="emh-empty-state">没有找到相关记录</div>';

            // Update selected count if in multi-select mode
            this.updateMultiSelectCount();

            // No need to re-add item click listeners here if using event delegation on contentArea
        },

        // Generate HTML for a single item
        generateItemHtml: function(item) {
            const isSelected = this.selectedItems.includes(item.code);
            // const statusClass = item.status || 'unmarked'; // Ensure a class for styling
            let statusClass = item.status || 'unmarked';
            if (this.currentFilter === 'trash' && item.status) { // In trash, don't show original status color prominently
                statusClass = 'in-trash';
            }


            return `
                <div class="emh-item ${this.multiSelectMode ? 'multi-select-mode' : ''} ${statusClass} ${isSelected ? 'selected' : ''}"
                     data-code="${item.code}" title="创建: ${new Date(item.createdDate).toLocaleString()}\n修改: ${new Date(item.modifiedDate).toLocaleString()}">
                    ${this.multiSelectMode ? `
                        <input type="checkbox" class="emh-item-checkbox" ${isSelected ? 'checked' : ''} data-code="${item.code}">
                    ` : ''}
                    <div class="emh-item-info">
                        <div class="emh-item-code">${item.code}</div>
                        ${item.title && item.title !== item.code ? `<div class="emh-item-title">${item.title}</div>` : ''}
                        ${item.remarks ? `<div class="emh-item-remarks">${item.remarks}</div>` : ''}
                    </div>
                    <div class="emh-item-actions">
                        ${this.currentFilter === 'trash' ? `
                            <button class="emh-restore" title="还原">🔄</button>
                            <button class="emh-delete-permanently" title="永久删除">🗑️</button>
                        ` : `
                            <button class="emh-mark-favorite ${item.status === 'favorite' ? 'active' : ''}" title="${item.status === 'favorite' ? '取消关注' : '标记关注'}">❤️</button>
                            <button class="emh-mark-watched ${item.status === 'watched' ? 'active' : ''}" title="${item.status === 'watched' ? '取消已看' : '标记已看'}">👁️</button>
                            <button class="emh-delete" title="移至回收站">🗑️</button>
                        `}
                    </div>
                </div>
            `;
        },


        // Batch operations
        batchMarkItems: function(status) {
            if (this.selectedItems.length === 0) {
                UTILS.showToast('没有选中任何项目', 'warning');
                return;
            }
            this.selectedItems.forEach(code => {
                CODE_LIBRARY.markItem(code, status);
            });
            UTILS.showToast(`已批量标记 ${this.selectedItems.length} 个番号为 ${status === 'favorite' ? '关注' : '已看'}`, 'success');
            this.toggleMultiSelectMode(false); // Exit multi-select after action
             // Refresh will be handled by library update event
        },

        batchDeleteItems: function() {
            if (this.selectedItems.length === 0) {
                UTILS.showToast('没有选中任何项目', 'warning');
                return;
            }
            const self = this;
            this.showConfirmDialog(`确定要将选中的 ${this.selectedItems.length} 项移至回收站吗？`, function() {
                self.selectedItems.forEach(code => {
                    CODE_LIBRARY.delete(code);
                });
                UTILS.showToast(`已将 ${self.selectedItems.length} 个番号移至回收站`, 'success');
                self.toggleMultiSelectMode(false); // Exit multi-select
                // Refresh will be handled by library update event
            });
        },


        // Show confirmation dialog
        showConfirmDialog: function(message, onConfirm) {
            const modal = this.panelElement.querySelector('.emh-panel-modal');
            const modalTitle = modal.querySelector('h3');
            const confirmBtn = modal.querySelector('.emh-panel-modal-confirm');
            const cancelBtn = modal.querySelector('.emh-panel-modal-cancel');

            modalTitle.textContent = message;
            modal.style.display = 'flex'; // Show modal

            // Clone and replace buttons to remove old event listeners
            const newConfirmBtn = confirmBtn.cloneNode(true);
            confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
            const newCancelBtn = cancelBtn.cloneNode(true);
            cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);


            const handleConfirm = () => {
                modal.style.display = 'none';
                onConfirm();
            };

            const handleCancel = () => {
                modal.style.display = 'none';
            };

            newConfirmBtn.addEventListener('click', handleConfirm, { once: true });
            newCancelBtn.addEventListener('click', handleCancel, { once: true });
        },
        // 添加清空回收站方法
        clearTrash: function() {
            if (!CODE_LIBRARY.trash.items.length) {
                UTILS.showToast('回收站已经是空的', 'info');
                return;
            }

            this.showConfirmDialog('确定要清空回收站吗？此操作将永久删除这些项目！', () => {
                CODE_LIBRARY.trash.items = []; // Empty the trash array
                CODE_LIBRARY.save();          // Save the change
                this.refreshPanelContent();   // Refresh the panel view
                UTILS.showToast('回收站已清空', 'success');
            });
        },

    };


    function initialize() {
        addCustomStyles(); // Load CSS

        // 加载用户设置 (e.g., for subtitle filename options, though currently not user-configurable via UI)
        try {
            const savedSubtitleOptions = localStorage.getItem('emh_subtitle_filename_options');
            if (savedSubtitleOptions) {
                const parsedOptions = JSON.parse(savedSubtitleOptions);
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
        CODE_LIBRARY.init(); // This also calls cleanupTrash

        // UTILS.createDraggableSubtitleButton(); // Create the draggable/floating button
        // enhanceDraggableButton will be called in main() after a delay

        // 初始化番号管理面板
        if (typeof CodeManagerPanel !== 'undefined') {
            window.CodeManagerPanel = CodeManagerPanel; // Make it globally accessible if needed by other parts
            CodeManagerPanel.init();
        }


        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', main);
        } else {
            main();
        }
        console.log("EMH Initialized with Enhanced Subtitle Search and Code Manager");

        // 添加自定义事件监听器，当番号库更新时，刷新状态指示器和面板
        window.addEventListener('emh_library_updated', function(e) {
            // console.log('EMH Library Updated Event Received:', e.detail);
            if (e.detail.type === 'library_update') {
                // 更新所有状态指示器
                updateCodeStatusIndicators();
                // 如果面板是打开的，刷新面板内容
                if (CodeManagerPanel.isVisible) {
                    CodeManagerPanel.refreshPanelContent();
                }
            }
        });

        // 添加 GM 存储变化监听，用于跨标签页同步
        if (typeof GM_addValueChangeListener !== 'undefined' && typeof GM_getValue !== 'undefined') {
            GM_addValueChangeListener('emh_sync_timestamp', function(name, old_value, new_value, remote) {
                if (remote) { // Value changed in another tab
                    console.log("EMH: Sync event received from another tab.");
                    CODE_LIBRARY.init(); // Re-initialize to load the latest data
                    updateCodeStatusIndicators();
                    if (CodeManagerPanel.isVisible) {
                        CodeManagerPanel.refreshPanelContent();
                    }
                }
            });
        }

        // 定期检查更新（作为备用同步机制，以防 GM_addValueChangeListener 不完全可靠或未触发）
        // setInterval(function() {
        //     if (typeof GM_getValue !== 'undefined') {
        //         const lastUpdate = GM_getValue('emh_sync_timestamp');
        //         if (lastUpdate && lastUpdate !== CodeManagerPanel.lastSyncTimestamp) {
        //             console.log("EMH: Polling detected library change.");
        //             CodeManagerPanel.lastSyncTimestamp = lastUpdate;
        //             CODE_LIBRARY.init(); // Re-initialize
        //             updateCodeStatusIndicators();
        //             if (CodeManagerPanel.isVisible) {
        //                 CodeManagerPanel.refreshPanelContent();
        //             }
        //         }
        //     }
        // }, 5000); // 每5秒检查一次

    }

    initialize();

})();
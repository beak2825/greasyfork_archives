// ==UserScript==
// @name         m3u8Player
// @namespace    https://github.com/lol3721987/m3u8Player
// @version      1.0.1
// @license MIT
// @description  支持17个视频源的M3U8视频播放器，基于HLS.js
// @author       zjb
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @noframes
// @connect      cj.lziapi.com
// @connect      json.heimuer.xyz
// @connect      cj.rycjapi.com
// @connect      bfzyapi.com
// @connect      tyyszy.com
// @connect      ffzy5.tv
// @connect      360zy.com
// @connect      www.iqiyizyapi.com
// @connect      wolongzyw.com
// @connect      jszyapi.com
// @connect      dbzy.tv
// @connect      mozhuazy.com
// @connect      www.mdzyapi.com
// @connect      api.zuidapi.com
// @connect      m3u8.apiyhzy.com
// @connect      api.apibdzy.com
// @connect      api.wujinapi.me
// @connect      ikunzyapi.com
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/544089/m3u8Player.user.js
// @updateURL https://update.greasyfork.org/scripts/544089/m3u8Player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 配置模块 =====
    const ConfigModule = {
        // 视频源配置
        API_ENDPOINT: '/api.php/provide/vod',
        API_SITES_CONFIG: [
			['卧龙资源', 'https://collect.wolongzy.cc', true, '/api.php/provide/vod/'],
            ['淘片资源', 'https://www.taopianzy.com', true, '/cjapi/mc/vod/json.html'],
            ['LZI资源', 'https://cj.lziapi.com', true],
            ['黑木耳', 'https://json.heimuer.xyz', true],
            ['如意资源', 'https://cj.rycjapi.com', true],
            ['暴风资源', 'https://bfzyapi.com', true],
            ['天涯资源', 'https://tyyszy.com', true],
            ['非凡影视', 'http://ffzy5.tv', true],
            ['360资源', 'https://360zy.com', true],
            ['iqiyi资源', 'https://www.iqiyizyapi.com', true],
            ['极速资源', 'https://jszyapi.com', true],
            ['豆瓣资源', 'https://dbzy.tv', true],
            ['魔爪资源', 'https://mozhuazy.com', true],
            ['魔都资源', 'https://www.mdzyapi.com', true],
            ['最大资源', 'https://api.zuidapi.com', true],
            ['樱花资源', 'https://m3u8.apiyhzy.com', true],
            ['百度云资源', 'https://api.apibdzy.com', true],
            ['无尽资源', 'https://api.wujinapi.me', true],
            ['iKun资源', 'https://ikunzyapi.com', true],
            ['CK资源', 'https://www.ckzy1.com', false],
            ['jkun资源', 'https://jkunzyapi.com', false],
            ['百万资源', 'https://api.bwzym3u8.com', false],
            ['souav资源', 'https://api.souavzy.vip', false],
            ['155资源', 'https://155api.com', false],
            ['lsb资源', 'https://apilsbzy1.com', false],
            ['黄色仓库', 'https://hsckzy.vip', false],
            ['玉兔资源', 'https://yutuzy10.com', false],
            ['太子资源', 'https://apidanaizi.com', false],
            ['黄8资源', 'https://hsckzy888.com', false],
            ['搜V资源', 'https://api.souavzy.vip', false],
        ],

        get API_SITES() {
            return this.API_SITES_CONFIG.reduce((acc, [name, host, enabled, customEndpoint], index) => {
                const endpoint = customEndpoint || this.API_ENDPOINT;
                const key = new URL(host).hostname.split('.').slice(-2, -1)[0] || `site${index}`;
                acc[key] = {
                    api: `${host}${endpoint}`,
                    name,
                    enabled,
                };
                return acc;
            }, {});
        },

        // 应用配置
        CONFIG: {
            PAGE_SIZE: 10,
            MAX_RESULTS: 100, // 限制单次搜索返回的最大结果数
            SEARCH_TIMEOUT: 8000,
            MAX_HISTORY_ITEMS: 50, // 最大历史记录数量
            STORAGE_KEYS: {
                LAST_SEARCH: 'iePlayer_lastSearch',
                SELECTED_SOURCES: 'iePlayer_selectedSources',
                IS_AGGREGATED: 'iePlayer_isAggregated',
                USER_SETTINGS: 'iePlayer_userSettings',
                PLAY_HISTORY: 'iePlayer_playHistory'
            }
        },

        HLS_JS_CDNS: [
            'https://cdn.jsdelivr.net/npm/hls.js@1.4.12/dist/hls.min.js',
            'https://cdn.bootcdn.net/ajax/libs/hls.js/1.4.12/hls.min.js',
            'https://unpkg.com/hls.js@1.4.12/dist/hls.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.4.12/hls.min.js',
            'https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js',
            'https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js',
            'https://cdn.bootcdn.net/ajax/libs/hls.js/1.5.17/hls.min.js'
        ],

        // 获取启用的视频源
        getEnabledSources() {
            return Object.entries(this.API_SITES).filter(([key, source]) => source.enabled);
        },

        // 获取视频源配置
        getSource(sourceKey) {
            return this.API_SITES[sourceKey] || null;
        },

        // 获取所有视频源
        getAllSources() {
            return this.API_SITES;
        }
    };

    // ===== 存储模块 =====
    const StorageModule = {
        // 获取存储值
        get(key, defaultValue = null) {
            return GM_getValue(key, defaultValue);
        },

        // 设置存储值
        set(key, value) {
            GM_setValue(key, value);
        },

        // 获取最后搜索
        getLastSearch() {
            return this.get(ConfigModule.CONFIG.STORAGE_KEYS.LAST_SEARCH, '');
        },

        // 保存最后搜索
        setLastSearch(keyword) {
            this.set(ConfigModule.CONFIG.STORAGE_KEYS.LAST_SEARCH, keyword);
        },

        // 获取选中的视频源
        getSelectedSources() {
            return this.get(ConfigModule.CONFIG.STORAGE_KEYS.SELECTED_SOURCES, ['lziapi']);
        },

        // 保存选中的视频源
        setSelectedSources(sources) {
            this.set(ConfigModule.CONFIG.STORAGE_KEYS.SELECTED_SOURCES, sources);
        },

        // 获取是否聚合搜索
        getIsAggregated() {
            return this.get(ConfigModule.CONFIG.STORAGE_KEYS.IS_AGGREGATED, false);
        },

        // 保存是否聚合搜索
        setIsAggregated(isAggregated) {
            this.set(ConfigModule.CONFIG.STORAGE_KEYS.IS_AGGREGATED, isAggregated);
        },

        // 获取播放历史
        getPlayHistory() {
            return this.get(ConfigModule.CONFIG.STORAGE_KEYS.PLAY_HISTORY, []);
        },

        // 保存播放历史
        setPlayHistory(history) {
            this.set(ConfigModule.CONFIG.STORAGE_KEYS.PLAY_HISTORY, history);
        },

        // 添加播放记录
        addPlayHistory(videoData) {
            const history = this.getPlayHistory();
            const { id, title, url, source, episode, thumbnail, duration } = videoData;
            
            // 生成唯一ID
            const recordId = id || `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            // 检查是否已存在相同的URL记录，存在则更新
            const existingIndex = history.findIndex(item => item.url === url);
            
            const newRecord = {
                id: recordId,
                title: title || '未知视频',
                url: url,
                source: source || '未知来源',
                episode: episode || '',
                thumbnail: thumbnail || '',
                duration: duration || 0,
                playTime: Date.now(),
                watchedPosition: 0
            };

            if (existingIndex >= 0) {
                // 更新现有记录
                history[existingIndex] = newRecord;
            } else {
                // 添加新记录到开头
                history.unshift(newRecord);
                
                // 限制历史记录数量
                const maxItems = ConfigModule.CONFIG.MAX_HISTORY_ITEMS;
                if (history.length > maxItems) {
                    history.splice(maxItems);
                }
            }

            this.setPlayHistory(history);
            return newRecord;
        },

        // 删除播放记录
        removePlayHistory(id) {
            const history = this.getPlayHistory();
            const newHistory = history.filter(item => item.id !== id);
            this.setPlayHistory(newHistory);
        },

        // 清空播放历史
        clearPlayHistory() {
            this.setPlayHistory([]);
        },

        // 更新观看进度
        updateWatchProgress(id, position) {
            const history = this.getPlayHistory();
            const item = history.find(item => item.id === id);
            if (item) {
                item.watchedPosition = position;
                this.setPlayHistory(history);
            }
        }
    };

    // ===== 状态管理模块 =====
    const StateModule = {
        // 状态数据
        state: {
            searchPanel: null,
            currentPlayer: null,
            isPlayerVisible: false,
            currentPage: 1,
            totalPages: 1,
            currentKeyword: '',
            videoPlayer: null,
            selectedSources: ['lziapi'],
            isAggregatedSearch: false,
            isSearching: false,
            searchController: null,
            allSearchResults: null, // 用于存储所有搜索结果
            playHistory: [] // 播放历史记录
        },

        // 状态监听器
        listeners: {},

        // 获取状态
        get(key) {
            return this.state[key];
        },

        // 设置状态
        set(key, value) {
            const oldValue = this.state[key];
            this.state[key] = value;

            // 触发监听器
            if (this.listeners[key]) {
                this.listeners[key].forEach(callback => {
                    callback(value, oldValue);
                });
            }
        },

        // 批量设置状态
        setState(updates) {
            Object.keys(updates).forEach(key => {
                this.set(key, updates[key]);
            });
        },

        // 添加状态监听器
        addListener(key, callback) {
            if (!this.listeners[key]) {
                this.listeners[key] = [];
            }
            this.listeners[key].push(callback);
        },

        // 移除状态监听器
        removeListener(key, callback) {
            if (this.listeners[key]) {
                const index = this.listeners[key].indexOf(callback);
                if (index > -1) {
                    this.listeners[key].splice(index, 1);
                }
            }
        },

        // 初始化状态
        init() {
            // 从存储恢复状态
            this.set('isAggregatedSearch', StorageModule.getIsAggregated());
            this.set('selectedSources', StorageModule.getSelectedSources());
            this.set('playHistory', StorageModule.getPlayHistory());
            // 初始化分页状态
            this.set('currentPage', 1);
            this.set('totalPages', 1);
            this.set('currentKeyword', '');
        }
    };

    // 为了兼容性，保留全局状态引用
    const globalState = StateModule.state;

    // ===== API模块 =====
    const APIModule = {
        // 单个源搜索
        searchSingleSource(sourceKey, keyword, page = 1, abortController = null) {
            return new Promise((resolve) => {
                const source = ConfigModule.getSource(sourceKey);
                if (!source) {
                    resolve(null);
                    return;
                }

                // 检查是否已被取消
                if (abortController && abortController.signal.aborted) {
                    resolve(null);
                    return;
                }

                const params = new URLSearchParams({
                    ac: 'list',
                    wd: keyword,
                    pg: page,
                    limit: ConfigModule.CONFIG.PAGE_SIZE
                });

                const request = GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${source.api}?${params}`,
                    timeout: ConfigModule.CONFIG.SEARCH_TIMEOUT,
                    onload: function(response) {
                        try {
                            // 检查是否已被取消
                            if (abortController && abortController.signal.aborted) {
                                resolve(null);
                                return;
                            }

                            const data = JSON.parse(response.responseText);

                            // 为每个结果添加源信息
                            if (data.list && Array.isArray(data.list)) {
                                data.list.forEach(item => {
                                    item.source_name = source.name;
                                    item.source_key = sourceKey;
                                });
                            }

                            resolve(data);
                        } catch (error) {
                            resolve(null);
                        }
                    },
                    onerror: function() {
                        resolve(null);
                    },
                    ontimeout: function() {
                        resolve(null);
                    }
                });

                // 如果有中断控制器，监听中断信号
                if (abortController) {
                    abortController.signal.addEventListener('abort', () => {
                        if (request && request.abort) {
                            request.abort();
                        }
                        resolve(null);
                    });
                }
            });
        },

        // 聚合搜索（支持进度显示）
        async searchAggregated(keyword, page = 1, abortController = null, progressCallback = null) {
            const enabledSources = ConfigModule.getEnabledSources();
            const totalSources = enabledSources.length;
            let completedSources = 0;
            
            // 更新进度的辅助函数
            const updateProgress = () => {
                if (progressCallback) {
                    const progress = Math.round((completedSources / totalSources) * 100);
                    progressCallback(progress, completedSources, totalSources);
                }
            };
            
            // 初始化进度
            updateProgress();

            try {
                // 使用Promise.allSettled来处理部分失败的情况
                const searchPromises = enabledSources.map(async ([sourceKey]) => {
                    try {
                        const result = await this.searchSingleSource(sourceKey, keyword, page, abortController);
                        completedSources++;
                        updateProgress();
                        return { sourceKey, result, success: true };
                    } catch (error) {
                        completedSources++;
                        updateProgress();
                        return { sourceKey, error, success: false };
                    }
                });

                const results = await Promise.allSettled(searchPromises);
                
                // 检查是否已被取消
                if (abortController && abortController.signal.aborted) {
                    throw new Error('搜索已取消');
                }

                // 合并所有成功的结果
                let allResults = [];
                let totalCount = 0;
                let maxPage = 0;
                results.forEach(promiseResult => {
                    if (promiseResult.status === 'fulfilled' && promiseResult.value.success) {
                        const result = promiseResult.value.result;
                        if (result && result.list && Array.isArray(result.list)) {
                            // 为每个结果添加源信息
                            const source = ConfigModule.getSource(promiseResult.value.sourceKey);
                            result.list.forEach(item => {
                                item.source_name = source.name;
                                item.source_key = promiseResult.value.sourceKey;
                            });
                            allResults = allResults.concat(result.list);
                            // 累加总数量
                            if (result.total) {
                                totalCount += result.total;
                            }
                            // 记录最大页码
                            if (result.pagecount && result.pagecount > maxPage) {
                                maxPage = result.pagecount;
                            }
                        }
                    }
                });

                // 去重（基于视频名称和年份）
                const uniqueResults = [];
                const seen = new Set();

                allResults.forEach(item => {
                    const key = `${item.vod_name}_${item.vod_year}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        uniqueResults.push(item);
                    }
                });

                // 按名称排序
                uniqueResults.sort((a, b) => (a.vod_name || '').localeCompare(b.vod_name || ''));

                return {
                    code: 1,
                    list: uniqueResults,
                    total: totalCount,
                    pagecount: maxPage
                };
            } catch (error) {
                throw error;
            }
        },

        // 获取视频详情
        getVideoDetail(videoId, sourceKey) {
            return new Promise((resolve, reject) => {
                const source = ConfigModule.getSource(sourceKey);
                if (!source) {
                    reject(new Error('无效的视频源'));
                    return;
                }

                const params = new URLSearchParams({
                    ac: 'detail',
                    ids: videoId
                });

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${source.api}?${params}`,
                    timeout: ConfigModule.CONFIG.SEARCH_TIMEOUT,
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data);
                        } catch (error) {
                            reject(error);
                        }
                    },
                    onerror: function(error) {
                        reject(error);
                    }
                });
            });
        }
    };

    // ===== 工具函数模块 =====
    const UtilsModule = {
        // 复制到剪贴板
        copyToClipboard(text) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).catch(() => {
                    this.fallbackCopyTextToClipboard(text);
                });
            } else {
                this.fallbackCopyTextToClipboard(text);
            }
        },

        // 兜底复制方法
        fallbackCopyTextToClipboard(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
            } catch (err) {
                // 静默处理错误
            }

            document.body.removeChild(textArea);
        },

        // 防抖函数
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // 节流函数
        throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        // 性能监控函数
        perfMonitor: {
            marks: new Map(),
            
            // 标记时间点
            mark(name) {
                if (typeof performance !== 'undefined' && performance.mark) {
                    performance.mark(name);
                    this.marks.set(name, performance.now());
                }
            },
            
            // 测量两个标记之间的时间
            measure(startMark, endMark) {
                if (typeof performance !== 'undefined' && performance.measure) {
                    try {
                        performance.measure(`${startMark} to ${endMark}`, startMark, endMark);
                        const entries = performance.getEntriesByName(`${startMark} to ${endMark}`);
                        if (entries.length > 0) {
                            return entries[0].duration;
                        }
                    } catch (e) {
                        // 静默处理错误
                    }
                }
                // 降级到手动计算
                const start = this.marks.get(startMark);
                const end = this.marks.get(endMark);
                if (start !== undefined && end !== undefined) {
                    return end - start;
                }
                return null;
            },
            
            // 记录性能日志（仅在开发模式下）
            log(name, duration) {
                // 只在控制台中记录，不显示给用户
                // 生产环境中已移除性能日志输出
            }
        }
    };

    // ===== 搜索模块 =====
    const SearchModule = {
        // 搜索视频
        searchVideos(keyword, page = 1, abortController = null, progressCallback = null) {
            if (StateModule.get('isAggregatedSearch')) {
                return APIModule.searchAggregated(keyword, page, abortController, progressCallback);
            } else {
                const selectedSource = StateModule.get('selectedSources')[0] || 'lziapi';
                return APIModule.searchSingleSource(selectedSource, keyword, page, abortController);
            }
        }
    };

    // ===== UI模块 =====
    const UIModule = {
        // 创建搜索面板
        createSearchPanel() {
            const panel = document.createElement('div');
            panel.className = 'iePlayer-search-panel';
            panel.innerHTML = `
                <div class="iePlayer-panel-header">
                    <h3 class="iePlayer-panel-title">🎬 M3U8视频播放器 (多源版)</h3>
                    <button class="iePlayer-close-btn">×</button>
                </div>
                <div class="iePlayer-tabs">
                    <button class="iePlayer-tab-btn active" data-tab="search">视频搜索</button>
                    <button class="iePlayer-tab-btn" data-tab="direct-play">链接播放</button>
                    <button class="iePlayer-tab-btn" data-tab="history">播放历史</button>
                </div>
                <div class="iePlayer-panel-body">
                    <div class="iePlayer-tab-content active" id="iePlayer-tab-search">
                        <div class="iePlayer-section">
                            <div class="iePlayer-source-selector">
                                <div class="iePlayer-source-header">
                                    📺 选择视频源
                                </div>
                                <div class="iePlayer-source-options" id="iePlayer-source-options"></div>
                            </div>
                        </div>
                        
                        <div class="iePlayer-section">
                            <div class="iePlayer-search-form">
                                <div class="iePlayer-form-header">🔍 视频搜索</div>
                                <input type="text" class="iePlayer-search-input" placeholder="输入视频名称搜索...">
                                <button class="iePlayer-search-btn">搜索视频</button>
                            </div>
                        </div>

                        <div class="iePlayer-loading">
	                        <div class="iePlayer-loading-text">🔍 搜索中... (点击取消搜索按钮可停止)</div>
	                        <div class="iePlayer-progress-container" style="display: none; margin-top: 10px;">
	                            <div class="iePlayer-progress-bar" style="width: 100%; height: 8px; background: #e9ecef; border-radius: 4px; overflow: hidden;">
	                                <div class="iePlayer-progress-fill" style="height: 100%; width: 0%; background: linear-gradient(90deg, #667eea, #764ba2); transition: width 0.3s;"></div>
	                            </div>
	                            <div class="iePlayer-progress-text" style="text-align: center; font-size: 12px; color: #666; margin-top: 5px;">0%</div>
	                        </div>
	                    </div>
	                    
	                    <div class="iePlayer-results-container">
	                        <div class="iePlayer-results"></div>
	                        <div class="iePlayer-pagination" style="display: none;">
	                            <button class="iePlayer-page-btn" id="iePlayer-prev-page">上一页</button>
	                            <span class="iePlayer-page-info"></span>
	                            <button class="iePlayer-page-btn" id="iePlayer-next-page">下一页</button>
	                        </div>
	                    </div>
                    </div>

                    <div class="iePlayer-tab-content" id="iePlayer-tab-direct-play">
                        <div class="iePlayer-section">
                            <div class="iePlayer-m3u8-form">
                                <div class="iePlayer-m3u8-header">
                                    🔗 直接播放M3U8链接
                                </div>
                                <input type="text" class="iePlayer-m3u8-input" placeholder="请输入M3U8链接...">
                                <button class="iePlayer-m3u8-btn">播放链接</button>
                            </div>
                        </div>
                    </div>

                    <div class="iePlayer-tab-content" id="iePlayer-tab-history">
                        <div class="iePlayer-section">
                            <div class="iePlayer-history-header">
                                <div class="iePlayer-history-title">📚 播放历史</div>
                                <button class="iePlayer-clear-history-btn">清空历史</button>
                            </div>
                        </div>
                        <div class="iePlayer-history-container">
                            <div class="iePlayer-history-list"></div>
                            <div class="iePlayer-history-empty" style="display: none;">
                                暂无播放历史
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(panel);
            return panel;
        },

        // 初始化视频源选择器
        initializeSourceSelector() {
            const sourceOptions = document.getElementById('iePlayer-source-options');
            if (!sourceOptions) return;

            const enabledSources = ConfigModule.getEnabledSources();

            // 添加聚合搜索选项
            const aggregatedOption = document.createElement('div');
            aggregatedOption.className = 'iePlayer-source-option';
            aggregatedOption.innerHTML = `
                <label>
                    <input type="radio" name="iePlayer-searchType" value="aggregated" ${StateModule.get('isAggregatedSearch') ? 'checked' : ''}>
                    <span>聚合搜索</span>
                </label>
            `;
            sourceOptions.appendChild(aggregatedOption);

            // 添加单个源选项
            enabledSources.forEach(([sourceKey, source]) => {
                const option = document.createElement('div');
                option.className = 'iePlayer-source-option';
                option.innerHTML = `
                    <label>
                        <input type="radio" name="iePlayer-searchType" value="${sourceKey}" ${!StateModule.get('isAggregatedSearch') && StateModule.get('selectedSources').includes(sourceKey) ? 'checked' : ''}>
                        <span>${source.name}</span>
                    </label>
                `;
                sourceOptions.appendChild(option);
            });

            // 添加事件监听
            sourceOptions.addEventListener('change', function(e) {
                const selectedValue = e.target.value;
                if (selectedValue === 'aggregated') {
                    StateModule.set('isAggregatedSearch', true);
                    StateModule.set('selectedSources', []);
                } else {
                    StateModule.set('isAggregatedSearch', false);
                    StateModule.set('selectedSources', [selectedValue]);
                }

                // 保存设置
                StorageModule.setIsAggregated(StateModule.get('isAggregatedSearch'));
                StorageModule.setSelectedSources(StateModule.get('selectedSources'));
            });
        },

        // 显示/隐藏加载状态
        showLoading(show) {
            const searchPanel = StateModule.get('searchPanel');
            if (!searchPanel) return;

            const loading = searchPanel.querySelector('.iePlayer-loading');
            const searchBtn = searchPanel.querySelector('.iePlayer-search-btn');
            const progressContainer = searchPanel.querySelector('.iePlayer-progress-container');

            if (show) {
                loading.classList.add('show');
                // 只有在聚合搜索时才显示进度条
                if (StateModule.get('isAggregatedSearch')) {
                    progressContainer.style.display = 'block';
                    // 重置进度
                    const progressFill = progressContainer.querySelector('.iePlayer-progress-fill');
                    const progressText = progressContainer.querySelector('.iePlayer-progress-text');
                    if (progressFill) progressFill.style.width = '0%';
                    if (progressText) progressText.textContent = '0%';
                } else {
                    progressContainer.style.display = 'none';
                }
                searchBtn.disabled = false;
                searchBtn.textContent = '取消搜索';
                searchBtn.style.background = '#dc3545';
                StateModule.set('isSearching', true);
            } else {
                loading.classList.remove('show');
                progressContainer.style.display = 'none';
                searchBtn.disabled = false;
                searchBtn.textContent = '搜索视频';
                searchBtn.style.background = '';
                StateModule.set('isSearching', false);
            }
        },

        // 更新聚合搜索进度
        updateAggregatedSearchProgress(progress, completed, total) {
            const searchPanel = StateModule.get('searchPanel');
            if (!searchPanel) return;

            const progressContainer = searchPanel.querySelector('.iePlayer-progress-container');
            if (!progressContainer) return;

            const progressFill = progressContainer.querySelector('.iePlayer-progress-fill');
            const progressText = progressContainer.querySelector('.iePlayer-progress-text');

            if (progressFill) {
                progressFill.style.width = `${progress}%`;
            }
            
            if (progressText) {
                progressText.textContent = `${progress}% (${completed}/${total})`;
            }
        },

        // 更新分页信息
        updatePagination() {
            const searchPanel = StateModule.get('searchPanel');
            if (!searchPanel) return;

            const pageInfo = searchPanel.querySelector('.iePlayer-page-info');
            const prevPageBtn = searchPanel.querySelector('#iePlayer-prev-page');
            const nextPageBtn = searchPanel.querySelector('#iePlayer-next-page');

            const currentPage = StateModule.get('currentPage');
            const totalPages = StateModule.get('totalPages');

            pageInfo.textContent = `第 ${currentPage}/${totalPages} 页`;
            prevPageBtn.disabled = currentPage <= 1;
            nextPageBtn.disabled = currentPage >= totalPages;
        },

        // 切换搜索面板显示
        toggleSearchPanel() {
            let searchPanel = StateModule.get('searchPanel');

            if (!searchPanel) {
                searchPanel = this.createSearchPanel();
                StateModule.set('searchPanel', searchPanel);
                EventModule.initSearchPanel();
            }

            if (searchPanel.classList.contains('show')) {
                searchPanel.classList.remove('show');
            } else {
                searchPanel.classList.add('show');
                // 恢复上次搜索
                this.restoreLastSearch();
            }
        },

        // 恢复上次搜索和设置
        restoreLastSearch() {
            const searchPanel = StateModule.get('searchPanel');
            if (!searchPanel) return;

            // 恢复设置
            StateModule.set('isAggregatedSearch', StorageModule.getIsAggregated());
            StateModule.set('selectedSources', StorageModule.getSelectedSources());

            // 更新界面选择状态
            const radios = document.querySelectorAll('input[name="iePlayer-searchType"]');
            radios.forEach(radio => {
                if (StateModule.get('isAggregatedSearch') && radio.value === 'aggregated') {
                    radio.checked = true;
                } else if (!StateModule.get('isAggregatedSearch') && StateModule.get('selectedSources').includes(radio.value)) {
                    radio.checked = true;
                }
            });

            // 恢复上次搜索
            const lastSearch = StorageModule.getLastSearch();
            if (lastSearch) {
                const searchInput = searchPanel.querySelector('.iePlayer-search-input');
                searchInput.value = lastSearch;
                // 不再自动触发搜索，让用户手动点击搜索按钮
            }
        },

        // 显示播放历史
        displayPlayHistory() {
            const searchPanel = StateModule.get('searchPanel');
            if (!searchPanel) return;

            const historyList = searchPanel.querySelector('.iePlayer-history-list');
            const historyEmpty = searchPanel.querySelector('.iePlayer-history-empty');
            
            if (!historyList || !historyEmpty) return;

            const history = StateModule.get('playHistory') || [];
            
            if (history.length === 0) {
                historyList.style.display = 'none';
                historyEmpty.style.display = 'block';
                return;
            }

            historyList.style.display = 'block';
            historyEmpty.style.display = 'none';
            
            // 使用DocumentFragment优化DOM操作
            const fragment = document.createDocumentFragment();
            historyList.innerHTML = '';

            history.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'iePlayer-history-item';
                historyItem.innerHTML = `
                    <div class="iePlayer-history-info">
                        <div class="iePlayer-history-title">${this.escapeHtml(item.title)}</div>
                        <div class="iePlayer-history-meta">
                            ${item.source ? `<span class="iePlayer-history-source">${this.escapeHtml(item.source)}</span>` : ''}
                            ${item.episode ? `<span class="iePlayer-history-episode">${this.escapeHtml(item.episode)}</span>` : ''}
                            <span class="iePlayer-history-time">${this.formatTime(item.playTime)}</span>
                        </div>
                    </div>
                    <div class="iePlayer-history-actions">
                        <button class="iePlayer-history-play-btn" data-id="${item.id}" data-url="${item.url}" data-title="${item.title}" data-source="${item.source}" data-episode="${item.episode}">
                            播放
                        </button>
                        <button class="iePlayer-history-delete-btn" data-id="${item.id}">
                            删除
                        </button>
                    </div>
                `;
                fragment.appendChild(historyItem);
            });

            historyList.appendChild(fragment);
        },

        // 格式化时间显示
        formatTime(timestamp) {
            const date = new Date(timestamp);
            const now = new Date();
            const diff = now - date;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            
            if (days === 0) {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                if (hours === 0) {
                    const minutes = Math.floor(diff / (1000 * 60));
                    return minutes === 0 ? '刚刚' : `${minutes}分钟前`;
                }
                return `${hours}小时前`;
            } else if (days === 1) {
                return '昨天';
            } else if (days < 7) {
                return `${days}天前`;
            } else {
                return date.toLocaleDateString('zh-CN');
            }
        },

        // HTML转义
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    };

    // ===== 事件管理模块 =====
    const EventModule = {
        // 初始化搜索面板事件
        initSearchPanel() {
            const panel = StateModule.get('searchPanel');
            if (!panel) return;

            const closeBtn = panel.querySelector('.iePlayer-close-btn');
            const searchBtn = panel.querySelector('.iePlayer-search-btn');
            const searchInput = panel.querySelector('.iePlayer-search-input');
            const prevPageBtn = panel.querySelector('#iePlayer-prev-page');
            const nextPageBtn = panel.querySelector('#iePlayer-next-page');
            const m3u8Btn = panel.querySelector('.iePlayer-m3u8-btn');
            const m3u8Input = panel.querySelector('.iePlayer-m3u8-input');
            const tabs = panel.querySelector('.iePlayer-tabs');
            const clearHistoryBtn = panel.querySelector('.iePlayer-clear-history-btn');

            // 初始化视频源选择器
            UIModule.initializeSourceSelector();

            // Tab切换事件
            tabs.addEventListener('click', (e) => {
                if (e.target.classList.contains('iePlayer-tab-btn')) {
                    const tabName = e.target.dataset.tab;

                    // 切换按钮状态
                    panel.querySelectorAll('.iePlayer-tab-btn').forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');

                    // 切换内容面板
                    panel.querySelectorAll('.iePlayer-tab-content').forEach(content => {
                        content.classList.remove('active');
                    });
                    panel.querySelector(`#iePlayer-tab-${tabName}`).classList.add('active');

                    // 如果切换到历史记录Tab，加载历史数据
                    if (tabName === 'history') {
                        UIModule.displayPlayHistory();
                    }
                }
            });

            // 关闭按钮事件
            closeBtn.onclick = () => {
                panel.classList.remove('show');
            };

            // 搜索按钮事件
            searchBtn.onclick = this.performSearch.bind(this);

            // 回车搜索
            searchInput.onkeypress = (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            };

            // 添加输入防抖搜索
            const debouncedSearch = UtilsModule.debounce(() => {
                const keyword = searchInput.value.trim();
                if (keyword && keyword.length >= 2) {
                    // 自动搜索建议可以在这里实现
                }
            }, 500);

            searchInput.oninput = debouncedSearch;

            // 分页按钮事件
            prevPageBtn.onclick = () => {
                const currentPage = StateModule.get('currentPage');
                if (currentPage > 1) {
                    this.displayPageResults(currentPage - 1);
                }
            };

            nextPageBtn.onclick = () => {
                const currentPage = StateModule.get('currentPage');
                const totalPages = StateModule.get('totalPages');
                if (currentPage < totalPages) {
                    this.displayPageResults(currentPage + 1);
                }
            };

            // M3U8链接播放事件
            m3u8Btn.onclick = () => {
                const url = m3u8Input.value.trim();
                if (!url) {
                    alert('请输入M3U8链接');
                    return;
                }
                
                // 验证是否为有效的M3U8链接
                if (!url.toLowerCase().split('?')[0].endsWith('.m3u8')) {
                    if (!confirm('输入的链接似乎不是M3U8链接，是否继续播放？')) {
                        return;
                    }
                }
                
                // 使用播放器模块播放
                PlayerModule.openVideoPlayer(url, 'M3U8视频播放', '直接播放', '');
            };

            // M3U8输入框回车事件
            m3u8Input.onkeypress = (e) => {
                if (e.key === 'Enter') {
                    m3u8Btn.click();
                }
            };

            // 清空历史按钮事件
            clearHistoryBtn.onclick = () => {
                if (confirm('确定要清空所有播放历史吗？此操作不可恢复。')) {
                    StorageModule.clearPlayHistory();
                    StateModule.set('playHistory', []);
                    UIModule.displayPlayHistory();
                }
            };

            // 拖拽功能
            this.makeDraggable(panel);

            // 绑定历史记录事件
            this.bindHistoryEvents();
        },

        // 执行搜索
        async performSearch() {
            // 性能监控开始
            UtilsModule.perfMonitor.mark('search-start');
            
            const searchPanel = StateModule.get('searchPanel');
            if (!searchPanel) return;

            const searchInput = searchPanel.querySelector('.iePlayer-search-input');
            const keyword = searchInput.value.trim();

            // 如果正在搜索，则取消搜索
            if (StateModule.get('isSearching')) {
                const searchController = StateModule.get('searchController');
                if (searchController) {
                    searchController.abort();
                }
                UIModule.showLoading(false);
                return;
            }

            if (!keyword) {
                alert('请输入搜索关键词');
                return;
            }

            StateModule.set('currentKeyword', keyword);
            StateModule.set('currentPage', 1); // 重置为第一页

            // 保存搜索记录
            StorageModule.setLastSearch(keyword);

            // 创建新的中断控制器
            const searchController = new AbortController();
            StateModule.set('searchController', searchController);

            // 显示加载状态
            UIModule.showLoading(true);

            // 定义进度回调函数
            const progressCallback = (progress, completed, total) => {
                if (StateModule.get('isAggregatedSearch')) {
                    UIModule.updateAggregatedSearchProgress(progress, completed, total);
                }
            };

            try {
                const results = await SearchModule.searchVideos(keyword, StateModule.get('currentPage'), searchController, progressCallback);

                // 检查是否已被取消
                if (searchController.signal.aborted) {
                    // 清理搜索控制器
                    StateModule.set('searchController', null);
                    return;
                }

                UIModule.showLoading(false);
                this.displayResults(results);
                // 清理搜索控制器
                StateModule.set('searchController', null);
                
                // 性能监控结束
                UtilsModule.perfMonitor.mark('search-end');
                const duration = UtilsModule.perfMonitor.measure('search-start', 'search-end');
                UtilsModule.perfMonitor.log('执行搜索', duration);
            } catch (error) {
                UIModule.showLoading(false);
                // 清理搜索控制器
                StateModule.set('searchController', null);
                
                // 性能监控结束
                UtilsModule.perfMonitor.mark('search-end');
                const duration = UtilsModule.perfMonitor.measure('search-start', 'search-end');
                UtilsModule.perfMonitor.log('执行搜索(失败)', duration);
                
                if (error.message === '搜索已取消') {
                    // 搜索被取消，不显示错误消息
                    return;
                }
                // 提供更友好的错误提示
                let errorMsg = error.message;
                if (errorMsg.includes('timeout')) {
                    errorMsg = '搜索超时，请检查网络连接后重试';
                } else if (errorMsg.includes('NetworkError')) {
                    errorMsg = '网络连接错误，请检查网络连接后重试';
                } else if (errorMsg.includes('Failed to fetch')) {
                    errorMsg = '请求失败，请检查网络连接后重试';
                }
                
                alert(`搜索失败: ${errorMsg}\n\n建议:\n1. 检查网络连接\n2. 刷新页面后重试\n3. 更换其他视频源`);
            }
        },

        // 使面板可拖拽
        makeDraggable(element) {
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;
            let xOffset = 0;
            let yOffset = 0;

            const header = element.querySelector('.iePlayer-panel-header');

            header.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);

            function dragStart(e) {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;

                if (e.target === header || header.contains(e.target)) {
                    isDragging = true;
                }
            }

            function drag(e) {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;

                    xOffset = currentX;
                    yOffset = currentY;

                    element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
                }
            }

            function dragEnd() {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
            }
        },

        // 显示搜索结果
        displayResults(results) {
            // 性能监控开始
            UtilsModule.perfMonitor.mark('displayResults-start');
            
            const searchPanel = StateModule.get('searchPanel');
            if (!searchPanel) return;

            const resultsDiv = searchPanel.querySelector('.iePlayer-results');
            const pagination = searchPanel.querySelector('.iePlayer-pagination');

            // 保存所有搜索结果到状态中
            StateModule.set('allSearchResults', results);
            StateModule.set('currentPage', 1); // 重置为第一页

            if (!results || !results.list || results.list.length === 0) {
                resultsDiv.innerHTML = '<div class="iePlayer-no-results">未找到相关视频</div>';
                pagination.style.display = 'none';
                StateModule.set('totalPages', 1);
                UIModule.updatePagination();
                return;
            }

            // 显示第一页结果
            this.displayPageResults(1);

            // 更新总页数
            const totalPages = Math.ceil(results.list.length / ConfigModule.CONFIG.PAGE_SIZE);
            StateModule.set('totalPages', totalPages);
            UIModule.updatePagination();
            pagination.style.display = 'flex';
            
            // 性能监控结束
            UtilsModule.perfMonitor.mark('displayResults-end');
            const duration = UtilsModule.perfMonitor.measure('displayResults-start', 'displayResults-end');
            UtilsModule.perfMonitor.log('显示搜索结果', duration);
        },

        // 显示指定页面的搜索结果
        displayPageResults(page) {
            const searchPanel = StateModule.get('searchPanel');
            if (!searchPanel) return;

            const results = StateModule.get('allSearchResults');
            if (!results || !results.list) return;

            const resultsDiv = searchPanel.querySelector('.iePlayer-results');

            // 使用DocumentFragment优化DOM操作
            const fragment = document.createDocumentFragment();
            resultsDiv.innerHTML = '';

            // 获取指定页的数据进行显示
            const pageSize = ConfigModule.CONFIG.PAGE_SIZE;
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const pageResults = results.list.slice(startIndex, endIndex);

            pageResults.forEach(video => {
                const videoElement = document.createElement('div');
                videoElement.className = 'iePlayer-result-item';
                fragment.appendChild(videoElement); // 先添加到fragment中，方便后续查找

                const renderContent = (playUrl) => {
                    let playSourcesHTML = '';
                    let episodeCountInfo = '';

                    if (playUrl && playUrl.trim() !== '') {
                        const playSources = playUrl.split('$$$');
                        let episodeCount = 0;
                        if (playSources.length > 0) {
                            try {
                                episodeCount = playSources[0].split('#').length;
                            } catch (e) { /* 忽略错误 */ }
                        }
                        episodeCountInfo = ` | 集数：${episodeCount}集`;

                        if (playSources.length > 0) {
                            playSources.forEach((source, index) => {
                                const parts = source.split('$');
                                let routeName = `线路${index + 1}`;
                                if (parts.length > 1 && isNaN(parts[0]) && !parts[0].startsWith('http')) {
                                    routeName = parts[0];
                                }
                                playSourcesHTML += `<button class="iePlayer-play-btn" data-video-id="${video.vod_id}" data-source-key="${video.source_key}" data-source-index="${index}">${routeName}</button>`;
                            });
                        } else {
                            playSourcesHTML = '<span>暂无播放源</span>';
                        }
                    } else {
                        // 如果没有播放链接，则显示加载中
                        playSourcesHTML = '<span>正在加载线路...</span>';
                    }

                    videoElement.innerHTML = `
                        <div class="iePlayer-video-header">
                            <div class="iePlayer-video-title">${video.vod_name}</div>
                            ${video.source_name ? `<div class="iePlayer-source-badge">${video.source_name}</div>` : ''}
                        </div>
                        <div class="iePlayer-video-info">
                            类型：${video.type_name || '未知'} |
                            年份：${video.vod_year || '未知'} |
                            地区：${video.vod_area || '未知'}${episodeCountInfo}
                        </div>
                        <div class="iePlayer-play-sources" id="play-sources-${video.vod_id}">
                            ${playSourcesHTML}
                        </div>
                        <div class="iePlayer-episode-list" id="iePlayer-episodes-${video.vod_id}"></div>
                    `;
                };

                // 初始渲染
                renderContent(video.vod_play_url);

                // 如果初始数据没有播放链接，则自动获取
                if (!video.vod_play_url || video.vod_play_url.trim() === '') {
                    (async () => {
                        try {
                            const videoData = await APIModule.getVideoDetail(video.vod_id, video.source_key);
                            if (videoData && videoData.list && videoData.list[0]) {
                                // 使用获取到的新数据重新渲染
                                renderContent(videoData.list[0].vod_play_url);
                            } else {
                                const playSourcesDiv = videoElement.querySelector(`#play-sources-${video.vod_id}`);
                                if(playSourcesDiv) playSourcesDiv.innerHTML = '<span>获取线路失败</span>';
                            }
                        } catch (error) {
                            const playSourcesDiv = videoElement.querySelector(`#play-sources-${video.vod_id}`);
                            if(playSourcesDiv) playSourcesDiv.innerHTML = '<span>加载线路出错</span>';
                        }
                    })();
                }
            });

            // 一次性添加所有元素到DOM
            resultsDiv.appendChild(fragment);

            // 添加事件监听
            this.bindResultEvents();

            // 更新分页信息
            StateModule.set('currentPage', page);
            UIModule.updatePagination();
        },

        // 绑定结果事件 - 只绑定一次，使用事件委托
        bindResultEvents() {
            const searchPanel = StateModule.get('searchPanel');
            if (!searchPanel) return;

            const resultsDiv = searchPanel.querySelector('.iePlayer-results');

            // 移除之前可能存在的事件监听器
            const oldHandler = resultsDiv._iePlayerHandler;
            if (oldHandler) {
                resultsDiv.removeEventListener('click', oldHandler);
            }

            // 创建新的事件处理器
            const newHandler = async (e) => {
                try {
                    // 线路按钮点击事件
                    if (e.target.classList.contains('iePlayer-play-btn')) {
                        e.preventDefault();
                        e.stopPropagation();

                        const videoId = e.target.dataset.videoId;
                        const sourceKey = e.target.dataset.sourceKey;
                        const sourceIndex = parseInt(e.target.dataset.sourceIndex);
                        const episodeList = document.getElementById(`iePlayer-episodes-${videoId}`);

                        // 切换选集列表显示
                        const wasHidden = !episodeList.classList.contains('show');

                        // 隐藏所有其他选集列表
                        document.querySelectorAll('.iePlayer-episode-list').forEach(el => {
                            el.classList.remove('show');
                        });

                        if (wasHidden) {
                            // 显示加载状态
                            episodeList.innerHTML = '<div class="iePlayer-loading-episodes">加载中...</div>';
                            episodeList.classList.add('show');

                            try {
                                const videoData = await APIModule.getVideoDetail(videoId, sourceKey);

                                if (videoData && videoData.list && videoData.list[0]) {
                                    const video = videoData.list[0];

                                    if (!video.vod_play_url) {
                                        episodeList.innerHTML = '<div class="iePlayer-no-episodes">该视频暂无播放地址</div>';
                                        return;
                                    }

                                    // 解析播放URL - 支持多种格式
                                    const playUrls = video.vod_play_url.split('$$$');

                                    if (playUrls[sourceIndex]) {
                                        const episodes = playUrls[sourceIndex].split('#').filter(ep => ep.trim());

                                        if (episodes.length === 0) {
                                            episodeList.innerHTML = '<div class="iePlayer-no-episodes">该线路暂无可播放内容</div>';
                                            return;
                                        }

                                        // 使用DocumentFragment优化DOM操作
                                        const fragment = document.createDocumentFragment();

                                        episodes.forEach((ep, index) => {
                                            let name, url;

                                            // 处理多种格式的播放链接
                                            if (ep.includes('$')) {
                                                [name, url] = ep.split('$');
                                            } else if (ep.includes('】')) {
                                                // 处理 【第1集】http://example.com 格式
                                                const match = ep.match(/【(.+?)】(.+)/);
                                                if (match) {
                                                    name = match[1];
                                                    url = match[2];
                                                } else {
                                                    name = `第${index + 1}集`;
                                                    url = ep;
                                                }
                                            } else if (ep.match(/^\d+\./)) {
                                                // 处理 01.http://example.com 格式
                                                const parts = ep.split('.');
                                                if (parts.length >= 2) {
                                                    name = `第${parts[0]}集`;
                                                    url = parts.slice(1).join('.');
                                                } else {
                                                    name = `第${index + 1}集`;
                                                    url = ep;
                                                }
                                            } else {
                                                // 如果没有分隔符，整个就是URL
                                                name = `第${index + 1}集`;
                                                url = ep;
                                            }

                                            // 清理URL和名称
                                            url = url ? url.trim() : '';
                                            name = name ? name.trim() : `第${index + 1}集`;

                                            const episodeItem = document.createElement('div');
                                            episodeItem.className = 'iePlayer-episode-item';
                                            
                                            // 验证URL有效性
                                            if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
                                                episodeItem.innerHTML = `
                                                    <button class="iePlayer-episode-btn iePlayer-disabled" disabled>
                                                        ${name} (无效链接)
                                                    </button>
                                                `;
                                            } else {
                                                episodeItem.innerHTML = `
                                                    <button class="iePlayer-episode-btn"
                                                        data-video-id="${videoId}"
                                                        data-source-key="${sourceKey}"
                                                        data-source-index="${sourceIndex}"
                                                        data-episode-index="${index}"
                                                        data-url="${url}"
                                                        data-title="${video.vod_name} - ${name}">
                                                        ${name}
                                                    </button>
                                                    <button class="iePlayer-copy-btn" data-url="${url}">
                                                        复制
                                                    </button>
                                                `;
                                            }
                                            
                                            fragment.appendChild(episodeItem);
                                        });

                                        // 清空并一次性添加所有元素
                                        episodeList.innerHTML = '';
                                        episodeList.appendChild(fragment);

                                    } else {
                                        episodeList.innerHTML = '<div class="iePlayer-no-episodes">该线路暂无可播放内容</div>';
                                    }
                                } else {
                                    episodeList.innerHTML = '<div class="iePlayer-no-episodes">获取播放信息失败</div>';
                                }
                            } catch (error) {
                                episodeList.innerHTML = '<div class="iePlayer-no-episodes">加载失败，请稍后重试</div>';
                            }
                        }
                    }

                    // 选集播放按钮事件
                    if (e.target.classList.contains('iePlayer-episode-btn')) {
                        e.preventDefault();
                        e.stopPropagation();

                        const url = e.target.dataset.url;
                        const title = e.target.dataset.title;

                        // 验证URL
                        if (!url || url === 'undefined' || url === 'null') {
                            alert('播放链接无效，请尝试其他集数或线路');
                            return;
                        }

                        if (!url.startsWith('http://') && !url.startsWith('https://')) {
                            alert('播放链接格式无效，请尝试其他集数或线路');
                            return;
                        }

                        // 高亮当前选中的集数
                        document.querySelectorAll('.iePlayer-episode-btn').forEach(btn => {
                            btn.classList.remove('active');
                        });
                        e.target.classList.add('active');

                        try {
                            // 判断URL类型并选择播放方式

                            // 更准确的M3U8检测
                            const isM3U8 = url.toLowerCase().split('?')[0].endsWith('.m3u8') ||
                                           url.toLowerCase().includes('hls');

                            // 修改播放逻辑：所有M3U8链接都用内置播放器
                            if (isM3U8) {
                                const sourceKey = e.target.dataset.sourceKey;
                                const source = ConfigModule.getSource(sourceKey);
                                const episodeName = e.target.textContent.trim();
                                PlayerModule.openVideoPlayer(url, title || '视频播放', source?.name || '未知源', episodeName);
                            } else {
                                GM_openInTab(url, { active: true });
                            }
                        } catch (error) {
                            // 提供更友好的播放失败提示
                            let errorMsg = error.message;
                            if (errorMsg.includes('NetworkError') || errorMsg.includes('Failed to fetch')) {
                                errorMsg = '网络连接错误，无法播放视频';
                            } else if (errorMsg.includes('HLS')) {
                                errorMsg = '视频格式不支持或链接已失效';
                            }
                            
                            alert(`播放失败: ${errorMsg}\n\n建议:\n1. 尝试其他集数或线路\n2. 检查网络连接\n3. 刷新页面后重试`);
                        }
                    }

                    // 复制按钮事件
                    if (e.target.classList.contains('iePlayer-copy-btn')) {
                        e.preventDefault();
                        e.stopPropagation();

                        const url = e.target.dataset.url;
                        UtilsModule.copyToClipboard(url);

                        // 显示复制成功反馈
                        const originalText = e.target.textContent;
                        e.target.textContent = '已复制';
                        e.target.classList.add('copied');

                        setTimeout(() => {
                            e.target.textContent = originalText;
                            e.target.classList.remove('copied');
                        }, 1000);
                    }
                } catch (error) {
                    console.error('事件处理出错:', error);
                    // 静默处理错误，避免影响用户体验
                }
            };

            // 保存新的事件处理器引用并绑定
            resultsDiv._iePlayerHandler = newHandler;
            resultsDiv.addEventListener('click', newHandler);
        },

        // 绑定历史记录事件
        bindHistoryEvents() {
            const searchPanel = StateModule.get('searchPanel');
            if (!searchPanel) return;

            const historyList = searchPanel.querySelector('.iePlayer-history-list');

            // 移除之前可能存在的事件监听器
            const oldHistoryHandler = historyList._iePlayerHistoryHandler;
            if (oldHistoryHandler) {
                historyList.removeEventListener('click', oldHistoryHandler);
            }

            // 创建新的事件处理器
            const historyHandler = async (e) => {
                try {
                    // 播放按钮点击事件
                    if (e.target.classList.contains('iePlayer-history-play-btn')) {
                        const url = e.target.dataset.url;
                        const title = e.target.dataset.title;
                        const source = e.target.dataset.source;
                        const episode = e.target.dataset.episode;

                        // 验证URL
                        if (!url || url === 'undefined' || url === 'null') {
                            alert('播放链接无效');
                            return;
                        }

                        if (!url.startsWith('http://') && !url.startsWith('https://')) {
                            alert('播放链接格式无效');
                            return;
                        }

                        try {
                            PlayerModule.openVideoPlayer(url, title || '视频播放', source, episode);
                        } catch (error) {
                            alert(`播放失败: ${error.message}`);
                        }
                    }

                    // 删除按钮点击事件
                    if (e.target.classList.contains('iePlayer-history-delete-btn')) {
                        const id = e.target.dataset.id;
                        if (id && confirm('确定要删除这条播放记录吗？')) {
                            StorageModule.removePlayHistory(id);
                            StateModule.set('playHistory', StorageModule.getPlayHistory());
                            UIModule.displayPlayHistory();
                        }
                    }
                } catch (error) {
                    console.error('历史记录事件处理出错:', error);
                    // 静默处理错误，避免影响用户体验
                }
            };

            // 保存新的事件处理器引用并绑定
            historyList._iePlayerHistoryHandler = historyHandler;
            historyList.addEventListener('click', historyHandler);
        }
    };

    // ===== 播放器模块 =====
    const PlayerModule = {
        // 创建视频播放器
        openVideoPlayer(url, title, source = '', episode = '') {
            // 添加到历史记录
            const videoData = {
                id: null,
                title: title,
                url: url,
                source: source,
                episode: episode
            };
            const historyRecord = StorageModule.addPlayHistory(videoData);
            StateModule.set('playHistory', StorageModule.getPlayHistory());

            // 创建播放器容器
            const playerContainer = document.createElement('div');
            playerContainer.className = 'iePlayer-player-container';
            playerContainer.innerHTML = `
                <div class="iePlayer-player-wrapper">
                    <div class="iePlayer-player-header">
                        <div class="iePlayer-player-title">${title}</div>
                        <button class="iePlayer-player-close">×</button>
                    </div>
                    <video
                        id="iePlayer-video-${Date.now()}"
                        controls
                        preload="auto"
                        style="width: 100%; height: 100%; background: #000;">
                        您的浏览器不支持HTML5视频播放
                    </video>
                    <div class="iePlayer-loading-player" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 16px;">
                        正在加载播放器...
                    </div>
                </div>
            `;

            document.body.appendChild(playerContainer);

            // 显示播放器
            playerContainer.classList.add('show');

            // 初始化容器的事件处理器存储和定时器数组
            playerContainer.timers = [];
            
            // 绑定关闭事件
            const closeBtn = playerContainer.querySelector('.iePlayer-player-close');
            const closeBtnHandler = () => {
                this.closeVideoPlayer(playerContainer);
            };
            closeBtn.addEventListener('click', closeBtnHandler);
            closeBtn.clickHandler = closeBtnHandler; // 保存引用便于清理

            // 点击外部区域关闭
            const containerClickHandler = (e) => {
                if (e.target === playerContainer) {
                    this.closeVideoPlayer(playerContainer);
                }
            };
            playerContainer.addEventListener('click', containerClickHandler);
            playerContainer.clickHandler = containerClickHandler; // 保存引用便于清理

            // 键盘事件
            const keyHandler = (e) => {
                if (e.key === 'Escape') {
                    this.closeVideoPlayer(playerContainer);
                }
            };
            document.addEventListener('keydown', keyHandler);
            playerContainer.keyHandler = keyHandler; // 保存引用便于清理

            // 初始化播放器
            setTimeout(() => {
                this.initVideoPlayer(playerContainer, url, title, keyHandler);
            }, 100);
        },

        // 初始化视频播放器
        initVideoPlayer(container, url, title, keyHandler) {
            const videoElement = container.querySelector('video');
            const loadingElement = container.querySelector('.iePlayer-loading-player');

            // 检查是否已经有全局HLS.js可用
            if (typeof window.HlsGlobal !== 'undefined' && window.HlsGlobal.isSupported()) {
                this.setupVideoPlayer(window.HlsGlobal, container, url, videoElement, loadingElement);
                return;
            }

            // 强制清理可能存在的旧实例
            if (typeof Hls !== 'undefined') {
                delete window.Hls;
            }

            let currentCDNIndex = 0;

            const tryLoadHLS = () => {
                if (currentCDNIndex >= ConfigModule.HLS_JS_CDNS.length) {
                    if (loadingElement) {
                        loadingElement.textContent = '播放器库加载失败，请检查网络连接或稍后重试';
                    }
                    return;
                }

                const currentCDN = ConfigModule.HLS_JS_CDNS[currentCDNIndex];

                const script = document.createElement('script');
                script.src = currentCDN;

                script.onload = () => {
                    // 等待一点时间确保库完全加载
                    setTimeout(() => {
                        if (typeof Hls !== 'undefined' && typeof Hls.isSupported === 'function') {
                            // 缓存到全局变量
                            window.HlsGlobal = Hls;
                            this.setupVideoPlayer(Hls, container, url, videoElement, loadingElement);
                        } else {
                            currentCDNIndex++;
                            script.remove();
                            tryLoadHLS();
                        }
                    }, 100);
                };

                script.onerror = () => {
                    currentCDNIndex++;
                    script.remove();
                    tryLoadHLS();
                };

                // 超时处理
                setTimeout(() => {
                    if (typeof Hls === 'undefined') {
                        currentCDNIndex++;
                        script.remove();
                        tryLoadHLS();
                    }
                }, 5000);

                document.head.appendChild(script);
            };

            // 开始加载
            tryLoadHLS();
        },

        // 设置视频播放器
        setupVideoPlayer(HlsClass, container, url, videoElement, loadingElement) {
            try {
                // 隐藏加载提示
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }

                // 检查HLS支持
                if (HlsClass && HlsClass.isSupported()) {
                    try {
                        // 创建HLS实例前先清理可能存在的旧实例
                        if (container.hlsInstance) {
                            try {
                                container.hlsInstance.destroy();
                            } catch (oldHlsError) {
                                console.warn('清理旧HLS实例失败:', oldHlsError);
                            }
                        }

                        const hls = new HlsClass({
                            debug: false,
                            enableWorker: true,
                            lowLatencyMode: false,
                            backBufferLength: 90,
                            maxBufferLength: 30,
                            maxMaxBufferLength: 60,
                            liveSyncDurationCount: 3,
                            liveMaxLatencyDurationCount: 10,
                            // 添加CORS配置
                            xhrSetup: function(xhr) {
                                xhr.setRequestHeader('Accept', '*/*');
                            }
                        });

                        // 加载视频源
                        hls.loadSource(url);
                        hls.attachMedia(videoElement);

                        // 保存HLS实例引用，用于后续清理
                        container.hlsInstance = hls;

                        // 监听事件 - 定义可清理的事件处理器
                        const mediaAttachedHandler = () => {
                            // 媒体附加成功
                        };

                        const manifestParsedHandler = () => {
                            // 自动播放
                            videoElement.play().then(() => {
                                // 播放成功
                            }).catch(() => {
                                // 显示播放按钮
                                const playButton = document.createElement('button');
                                playButton.textContent = '点击播放';
                                playButton.style.cssText = `
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                    padding: 15px 30px;
                                    font-size: 18px;
                                    background: rgba(0,0,0,0.8);
                                    color: white;
                                    border: 2px solid white;
                                    border-radius: 8px;
                                    cursor: pointer;
                                    z-index: 1000;
                                `;
                                
                                const playButtonHandler = () => {
                                    videoElement.play();
                                    playButton.remove();
                                };
                                playButton.addEventListener('click', playButtonHandler);
                                container.appendChild(playButton);
                            });
                        };

                        const levelLoadedHandler = () => {
                            // 级别加载完成
                        };

                        const fragLoadedHandler = () => {
                            // 片段加载完成
                        };

                        // 错误处理
                        const errorHandler = (event, data) => {
                            if (data.fatal) {
                                switch (data.type) {
                                    case HlsClass.ErrorTypes.NETWORK_ERROR:
                                        const networkRetryTimer = setTimeout(() => {
                                            if (hls && !hls.destroyed) {
                                                hls.startLoad();
                                            }
                                        }, 1000);
                                        container.timers.push(networkRetryTimer);
                                        break;
                                    case HlsClass.ErrorTypes.MEDIA_ERROR:
                                        const mediaRetryTimer = setTimeout(() => {
                                            if (hls && !hls.destroyed) {
                                                hls.recoverMediaError();
                                            }
                                        }, 1000);
                                        container.timers.push(mediaRetryTimer);
                                        break;
                                    default:
                                        if (hls && !hls.destroyed) {
                                            hls.destroy();
                                        }
                                        if (loadingElement) {
                                            loadingElement.style.display = 'block';
                                            loadingElement.textContent = `播放失败：${data.details}\n\n可能原因：\n1. 视频源已失效\n2. 网络连接问题\n3. 视频格式不支持\n\n请尝试其他线路或稍后重试`;
                                        }
                                        break;
                                }
                            }
                        };

                        // 绑定事件监听器
                        hls.on(HlsClass.Events.MEDIA_ATTACHED, mediaAttachedHandler);
                        hls.on(HlsClass.Events.MANIFEST_PARSED, manifestParsedHandler);
                        hls.on(HlsClass.Events.LEVEL_LOADED, levelLoadedHandler);
                        hls.on(HlsClass.Events.FRAG_LOADED, fragLoadedHandler);
                        hls.on(HlsClass.Events.ERROR, errorHandler);

                    } catch (hlsError) {
                        if (loadingElement) {
                            loadingElement.style.display = 'block';
                            loadingElement.textContent = 'HLS播放器初始化失败，请尝试刷新页面';
                        }
                    }

                } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                    // 原生HLS支持（Safari等）
                    videoElement.src = url;

                    // 定义可清理的事件处理器
                    const loadStartHandler = () => {
                        // 开始加载
                    };

                    const loadedMetadataHandler = () => {
                        videoElement.play().catch(() => {
                            // 播放失败，静默处理
                        });
                    };

                    const errorHandler = () => {
                        if (loadingElement) {
                            loadingElement.style.display = 'block';
                            loadingElement.textContent = `播放失败：${videoElement.error?.message || '未知错误'}\n\n请尝试其他线路`;
                        }
                    };

                    // 绑定事件监听器
                    videoElement.addEventListener('loadstart', loadStartHandler);
                    videoElement.addEventListener('loadedmetadata', loadedMetadataHandler);
                    videoElement.addEventListener('error', errorHandler);
                    
                    // 保存事件处理器引用以便清理
                    if (!container.videoEventHandlers) {
                        container.videoEventHandlers = [];
                    }
                    container.videoEventHandlers.push(
                        { event: 'loadstart', handler: loadStartHandler },
                        { event: 'loadedmetadata', handler: loadedMetadataHandler },
                        { event: 'error', handler: errorHandler }
                    );

                } else {
                    if (loadingElement) {
                        loadingElement.style.display = 'block';
                        loadingElement.textContent = '当前浏览器不支持HLS播放\n\n建议使用：\n• Chrome 浏览器\n• Firefox 浏览器\n• Safari 浏览器\n\n或尝试其他线路';
                    }
                }

                // 保存播放器状态
                StateModule.set('currentPlayer', container);

            } catch (error) {
                if (loadingElement) {
                    loadingElement.textContent = '播放器初始化失败: ' + error.message;
                }
            }
        },

        // 关闭视频播放器
        closeVideoPlayer(container) {
            try {
                // 设置清理超时，防止卡死
                const cleanupTimeout = setTimeout(() => {
                    console.warn('播放器清理超时，强制移除容器');
                    if (container.parentNode) {
                        container.remove();
                    }
                }, 3000);

                // 清理HLS.js实例
                if (container.hlsInstance) {
                    try {
                        // 移除所有HLS事件监听器
                        container.hlsInstance.off('*');
                        
                        // 停止加载并清理缓冲区
                        container.hlsInstance.stopLoad();
                        
                        // 分离媒体元素
                        container.hlsInstance.detachMedia();
                        
                        // 销毁实例
                        container.hlsInstance.destroy();
                        
                        // 清除引用
                        container.hlsInstance = null;
                    } catch (hlsError) {
                        console.warn('HLS实例清理出错:', hlsError);
                    }
                }

                // 彻底清理视频元素
                const videoElement = container.querySelector('video');
                if (videoElement) {
                    try {
                        // 暂停播放
                        videoElement.pause();
                        
                        // 清理原生HLS事件监听器
                        if (container.videoEventHandlers) {
                            container.videoEventHandlers.forEach(({ event, handler }) => {
                                try {
                                    videoElement.removeEventListener(event, handler);
                                } catch (eventError) {
                                    console.warn(`移除视频事件 ${event} 失败:`, eventError);
                                }
                            });
                            container.videoEventHandlers = [];
                        }
                        
                        // 清空所有源
                        videoElement.src = '';
                        videoElement.srcObject = null;
                        
                        // 清理缓冲区
                        if (videoElement.load) {
                            videoElement.load();
                        }
                        
                        // 移除所有事件监听器（兜底方案）
                        const videoClone = videoElement.cloneNode(false);
                        if (videoElement.parentNode) {
                            videoElement.parentNode.replaceChild(videoClone, videoElement);
                        }
                    } catch (videoError) {
                        console.warn('视频元素清理出错:', videoError);
                    }
                }

                // 清理键盘事件监听器
                if (container.keyHandler) {
                    try {
                        document.removeEventListener('keydown', container.keyHandler);
                        container.keyHandler = null;
                    } catch (keyError) {
                        console.warn('键盘事件清理出错:', keyError);
                    }
                }

                // 清理容器事件监听器
                if (container.clickHandler) {
                    try {
                        container.removeEventListener('click', container.clickHandler);
                        container.clickHandler = null;
                    } catch (clickError) {
                        console.warn('容器点击事件清理出错:', clickError);
                    }
                }

                // 清理关闭按钮事件
                const closeBtn = container.querySelector('.iePlayer-player-close');
                if (closeBtn && closeBtn.clickHandler) {
                    try {
                        closeBtn.removeEventListener('click', closeBtn.clickHandler);
                        closeBtn.clickHandler = null;
                    } catch (closeBtnError) {
                        console.warn('关闭按钮事件清理出错:', closeBtnError);
                    }
                }

                // 清理所有定时器
                if (container.timers) {
                    container.timers.forEach(timer => {
                        try {
                            clearTimeout(timer);
                        } catch (timerError) {
                            console.warn('定时器清理出错:', timerError);
                        }
                    });
                    container.timers = [];
                }

                // 强制垃圾回收（如果可用）
                if (window.gc && typeof window.gc === 'function') {
                    setTimeout(() => {
                        try {
                            window.gc();
                        } catch (gcError) {
                            // 静默处理GC错误
                        }
                    }, 100);
                }

                // 移除容器
                if (container.parentNode) {
                    container.remove();
                }

                // 清理全局状态
                if (StateModule.get('currentPlayer') === container) {
                    StateModule.set('currentPlayer', null);
                }

                // 清除清理超时
                clearTimeout(cleanupTimeout);

            } catch (error) {
                console.error('播放器关闭时发生错误:', error);
                
                // 强制清理，即使有错误
                try {
                    if (container.parentNode) {
                        container.remove();
                    }
                    if (StateModule.get('currentPlayer') === container) {
                        StateModule.set('currentPlayer', null);
                    }
                } catch (forceCleanError) {
                    console.error('强制清理失败:', forceCleanError);
                }
            }
        }
    };;

    // 初始化样式
    function initStyles() {
        GM_addStyle(`
            /* 主面板样式 */
            .iePlayer-search-panel {
                position: fixed; top: 20px; right: 20px; width: 400px; max-height: 85vh;
                background: #fff; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                z-index: 999999; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
                display: none; overflow: hidden;
            }
            
            .iePlayer-search-panel.show { display: block; }
            
            .iePlayer-panel-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white; padding: 15px; display: flex; justify-content: space-between;
                align-items: center; cursor: move;
            }
            
            .iePlayer-panel-title { font-size: 16px; font-weight: 600; margin: 0; }
            
            .iePlayer-close-btn {
                background: none; border: none; color: white; font-size: 20px; cursor: pointer;
                padding: 0; width: 24px; height: 24px; display: flex; align-items: center;
                justify-content: center; border-radius: 50%; transition: background-color 0.2s;
            }
            
            .iePlayer-close-btn:hover { background-color: rgba(255,255,255,0.2); }
            
            .iePlayer-panel-body { padding: 0 15px 15px; max-height: 70vh; overflow-y: auto; }
            
            .iePlayer-tabs { display: flex; background-color: #f1f3f5; padding: 3px 15px 0; }
            
            .iePlayer-tab-btn {
                padding: 10px 15px; cursor: pointer; border: none; background-color: transparent;
                font-size: 14px; font-weight: 500; color: #868e96; position: relative;
                transition: color 0.3s;
            }
            
            .iePlayer-tab-btn:hover { color: #495057; }
            .iePlayer-tab-btn.active { color: #667eea; }
            
            .iePlayer-tab-btn.active::after {
                content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
                height: 3px; background-color: #667eea; border-radius: 3px 3px 0 0;
            }
            
            .iePlayer-tab-content { display: none; padding-top: 15px; }
            .iePlayer-tab-content.active { display: block; }
            
            .iePlayer-section {
                margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;
            }
            
            .iePlayer-section:last-child {
                margin-bottom: 0; padding-bottom: 0; border-bottom: none;
            }
            
            .iePlayer-form-header {
                font-weight: 600; color: #495057; font-size: 14px; margin-bottom: 12px;
                display: flex; align-items: center; gap: 8px;
            }
            
            /* 视频源选择器样式 */
            .iePlayer-source-selector, .iePlayer-search-form, .iePlayer-m3u8-form {
                padding: 15px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;
            }
            
            .iePlayer-source-header, .iePlayer-m3u8-header {
                display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
                font-weight: 600; color: #495057; font-size: 14px;
            }
            
            .iePlayer-source-options {
                display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;
                max-height: 150px; overflow-y: auto;
            }
            
            .iePlayer-source-option { display: flex; align-items: center; }
            
            .iePlayer-source-option label {
                display: flex; align-items: center; gap: 6px; padding: 6px 10px;
                border-radius: 6px; cursor: pointer; font-size: 12px; color: #495057;
                transition: all 0.2s ease; background: white; border: 1px solid #dee2e6;
                width: 100%;
            }
            
            .iePlayer-source-option label:hover,
            .iePlayer-source-option label:has(input[type="radio"]:checked) {
                background: #667eea; color: white; border-color: #667eea;
            }
            
            .iePlayer-source-option input[type="radio"] {
                margin: 0; accent-color: #667eea;
            }
            
            .iePlayer-source-option input[type="radio"]:checked + span {
                font-weight: 500;
            }
            
            .iePlayer-search-input, .iePlayer-m3u8-input {
                width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 6px;
                font-size: 14px; transition: border-color 0.2s; box-sizing: border-box;
                margin-bottom: 12px;
            }
            
            .iePlayer-search-input:focus, .iePlayer-m3u8-input:focus {
                outline: none; border-color: #667eea;
            }
            
            .iePlayer-search-btn, .iePlayer-m3u8-btn {
                width: 100%; padding: 12px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white; border: none; border-radius: 6px; font-size: 14px;
                font-weight: 500; cursor: pointer; transition: all 0.3s;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            
            .iePlayer-m3u8-btn {
                background: linear-gradient(135deg, #28a745 0%, #23843a 100%);
            }
            
            .iePlayer-search-btn:hover, .iePlayer-m3u8-btn:hover {
                transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            }
            
            .iePlayer-search-btn:disabled {
                opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none;
            }
            
            .iePlayer-loading {
                text-align: center; padding: 25px; color: #666; display: none;
                background: #f8f9fa; border-radius: 8px; margin: 15px 0;
            }
            
            .iePlayer-loading.show { display: block; }
            
            .iePlayer-results-container { margin-top: 15px; }
            
            .iePlayer-results {
                max-height: 400px; overflow-y: auto; padding: 5px;
            }
            
            .iePlayer-result-item {
                border: 1px solid #e1e5e9; border-radius: 6px; padding: 15px;
                margin-bottom: 10px; background: #f8f9fa; transition: box-shadow 0.2s;
            }
            
            .iePlayer-result-item:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            
            .iePlayer-video-header {
                display: flex; justify-content: space-between; align-items: flex-start;
                margin-bottom: 8px;
            }
            
            .iePlayer-video-title {
                font-size: 16px; font-weight: 600; color: #333; flex: 1; line-height: 1.3;
            }
            
            .iePlayer-source-badge {
                background: #667eea; color: white; padding: 3px 8px; border-radius: 12px;
                font-size: 11px; font-weight: 500; white-space: nowrap; margin-left: 10px;
            }
            
            .iePlayer-video-info {
                font-size: 12px; color: #666; margin-bottom: 12px; line-height: 1.4;
            }
            
            .iePlayer-play-sources { display: flex; gap: 8px; margin-bottom: 10px; }
            
            .iePlayer-play-btn, .iePlayer-copy-btn {
                padding: 6px 12px; border: 1px solid #667eea; background: white;
                color: #667eea; border-radius: 4px; cursor: pointer;
                font-size: 12px; transition: all 0.2s;
            }
            
            .iePlayer-copy-btn {
                padding: 4px 8px; border: 1px solid #28a745; color: #28a745;
            }
            
            .iePlayer-play-btn:hover, .iePlayer-copy-btn:hover {
                background: #667eea; color: white;
            }
            
            .iePlayer-copy-btn:hover { background: #28a745; }
            
            .iePlayer-copy-btn.copied { background: #28a745; color: white; }
            
            .iePlayer-episode-list {
                display: none !important; margin-top: 10px; padding-top: 10px;
                border-top: 1px solid #e1e5e9;
            }
            
            .iePlayer-episode-list.show { display: block !important; }
            
            .iePlayer-episode-item { display: inline-flex; margin: 3px; gap: 3px; }
            
            .iePlayer-episode-btn {
                padding: 4px 8px; border: 1px solid #ddd; border-radius: 3px;
                background: #f8f9fa; cursor: pointer; font-size: 11px;
                transition: all 0.2s;
            }
            
            .iePlayer-episode-btn.iePlayer-disabled {
                background: #e9ecef; color: #6c757d; cursor: not-allowed; opacity: 0.6;
            }
            
            .iePlayer-episode-btn:hover { background: #e9ecef; }
            
            .iePlayer-episode-btn.active {
                background: #667eea; color: white; border-color: #667eea;
            }
            
            .iePlayer-pagination {
                display: flex; justify-content: space-between; align-items: center;
                margin-top: 20px; padding: 15px; background: #f8f9fa;
                border-radius: 8px; border: 1px solid #e9ecef;
            }
            
            .iePlayer-page-btn {
                padding: 8px 16px; border: 1px solid #667eea; background: white;
                color: #667eea; border-radius: 4px; cursor: pointer;
                font-size: 13px; font-weight: 500; transition: all 0.2s;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            }
            
            .iePlayer-page-btn:hover:not(:disabled) {
                background: #667eea; color: white; transform: translateY(-1px);
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            
            .iePlayer-page-btn:disabled {
                opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none;
            }
            
            .iePlayer-page-info {
                font-size: 13px; color: #666; font-weight: 500;
            }
            
            .iePlayer-no-results, .iePlayer-loading-episodes {
                text-align: center; padding: 20px; color: #666;
            }
            
            .iePlayer-no-results { font-size: 14px; }
            .iePlayer-loading-episodes { font-size: 13px; }
            
            .iePlayer-no-episodes {
                text-align: center; padding: 20px; color: #666; font-size: 13px;
                background: #f8f9fa; border-radius: 6px; border: 1px dashed #dee2e6;
            }
            
            /* 浮动按钮样式 */
            .iePlayer-float-btn {
                position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%; border: none; color: white; font-size: 24px;
                cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                z-index: 999998; transition: all 0.3s;
                display: flex; align-items: center; justify-content: center;
            }
            
            .iePlayer-float-btn:hover {
                transform: scale(1.1); box-shadow: 0 6px 25px rgba(0,0,0,0.3);
            }
            
            /* M3U8 链接播放按钮样式 */
            .iePlayer-m3u8-play-btn {
                display: inline-block; margin-left: 10px; padding: 4px 8px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white; border: none; border-radius: 4px; cursor: pointer;
                font-size: 12px; text-decoration: none; transition: opacity 0.2s;
            }
            
            .iePlayer-m3u8-play-btn:hover { opacity: 0.9; }
            
            /* 播放器容器样式 */
            .iePlayer-player-container {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.9); z-index: 1000000; display: none;
                align-items: center; justify-content: center;
            }
            
            .iePlayer-player-container.show { display: flex; }
            
            .iePlayer-player-wrapper {
                width: 90%; max-width: 1200px; height: 70%; position: relative;
                background: #000; border-radius: 8px; overflow: hidden;
            }
            
            .iePlayer-player-header {
                position: absolute; top: 0; left: 0; right: 0; height: 50px;
                background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
                display: flex; align-items: center; justify-content: space-between;
                padding: 0 20px; z-index: 1000001; color: white;
                opacity: 0; transition: opacity 0.3s;
            }
            
            .iePlayer-player-wrapper:hover .iePlayer-player-header { opacity: 1; }
            
            .iePlayer-player-title { font-size: 16px; font-weight: 500; }
            
            .iePlayer-player-close {
                background: none; border: none; color: white; font-size: 24px;
                cursor: pointer; padding: 0; width: 32px; height: 32px;
                display: flex; align-items: center; justify-content: center;
                border-radius: 50%; transition: background-color 0.2s;
            }
            
            .iePlayer-player-close:hover { background-color: rgba(255,255,255,0.2); }

            /* 历史记录样式 */
            .iePlayer-history-header {
                display: flex; justify-content: space-between; align-items: center;
                margin-bottom: 15px; padding: 15px; background: #f8f9fa;
                border-radius: 8px; border: 1px solid #e9ecef;
            }

            .iePlayer-history-title {
                font-weight: 600; color: #495057; font-size: 14px;
            }

            .iePlayer-clear-history-btn {
                padding: 6px 12px; border: 1px solid #dc3545; background: white;
                color: #dc3545; border-radius: 4px; cursor: pointer;
                font-size: 12px; transition: all 0.2s;
            }

            .iePlayer-clear-history-btn:hover {
                background: #dc3545; color: white;
            }

            .iePlayer-history-container {
                max-height: 400px; overflow-y: auto; padding: 5px;
            }

            .iePlayer-history-list {
                display: block;
            }

            .iePlayer-history-item {
                display: flex; justify-content: space-between; align-items: center;
                padding: 15px; border-bottom: 1px solid #e9ecef;
            }

            .iePlayer-history-item:last-child {
                border-bottom: none;
            }

            .iePlayer-history-info {
                flex: 1;
            }

            .iePlayer-history-title {
                font-size: 14px; font-weight: 500; color: #333; margin-bottom: 5px;
            }

            .iePlayer-history-meta {
                font-size: 12px; color: #666;
            }

            .iePlayer-history-source, .iePlayer-history-episode {
                background: #e9ecef; color: #495057; padding: 2px 6px;
                border-radius: 10px; font-size: 11px; margin-right: 5px;
            }

            .iePlayer-history-time {
                color: #868e96;
            }

            .iePlayer-history-actions {
                display: flex; gap: 8px;
            }

            .iePlayer-history-play-btn, .iePlayer-history-delete-btn {
                padding: 6px 12px; border-radius: 4px; cursor: pointer;
                font-size: 12px; transition: all 0.2s;
            }

            .iePlayer-history-play-btn {
                border: 1px solid #667eea; background: white; color: #667eea;
            }

            .iePlayer-history-play-btn:hover {
                background: #667eea; color: white;
            }

            .iePlayer-history-delete-btn {
                border: 1px solid #dc3545; background: white; color: #dc3545;
            }

            .iePlayer-history-delete-btn:hover {
                background: #dc3545; color: white;
            }

            .iePlayer-history-empty {
                text-align: center; padding: 40px; color: #666; font-size: 14px;
            }
        `);
    }

    function toggleSearchPanel() {
        UIModule.toggleSearchPanel();
    }

    // 检测和注入M3U8播放按钮
    function injectM3U8PlayButtons() {
                        const m3u8Regex = /(https?:\/\/[^\s"'`<>?#]*\.m3u8(?:\?[^\s"'`<>#]*)?(?:#[^\s"'`<>?]*)?)/gi;

        const createPlayButton = (url) => {
            const playButton = document.createElement('button');
            playButton.className = 'iePlayer-m3u8-play-btn';
            playButton.textContent = '播放';
            playButton.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                PlayerModule.openVideoPlayer(url, '视频播放', '页面链接', '');
            };
            return playButton;
        };

        // 处理链接
        document.querySelectorAll('a[href]:not([data-ieplayer-injected])').forEach(link => {
            m3u8Regex.lastIndex = 0; // Reset regex state
            const match = m3u8Regex.exec(link.href);
            if (match) {
                const m3u8Url = match[0]; // The first full match
                if (!link.nextElementSibling || !link.nextElementSibling.classList.contains('iePlayer-m3u8-play-btn')) {
                    link.dataset.iePlayerInjected = 'true';
                    link.parentNode.insertBefore(createPlayButton(m3u8Url), link.nextSibling);
                }
            }
        });

        // 处理文本节点
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) => {
                const parent = node.parentElement;
                if (!parent || parent.isContentEditable || parent.closest('SCRIPT, STYLE, A, .iePlayer-m3u8-play-btn') || parent.dataset.ieplayerTextInjected) {
                    return NodeFilter.FILTER_REJECT;
                }
                return m3u8Regex.test(node.textContent) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
            }
        });

        while (walker.nextNode()) {
            const node = walker.currentNode;
            const parent = node.parentElement;
            parent.dataset.ieplayerTextInjected = 'true';

            const fragment = document.createDocumentFragment();
            let lastIndex = 0;
            node.textContent.replace(m3u8Regex, (match, url, offset) => {
                fragment.appendChild(document.createTextNode(node.textContent.substring(lastIndex, offset)));
                fragment.appendChild(document.createTextNode(url));
                fragment.appendChild(createPlayButton(url));
                lastIndex = offset + match.length;
            });
            fragment.appendChild(document.createTextNode(node.textContent.substring(lastIndex)));
            parent.replaceChild(fragment, node);
        }
    }

    // 监听DOM变化
    function observeDOM() {
        let scheduled = false;
        const observer = new MutationObserver(() => {
            if (!scheduled) {
                scheduled = true;
                requestAnimationFrame(() => {
                    injectM3U8PlayButtons();
                    scheduled = false;
                });
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 添加菜单命令
    function addMenuCommands() {
        GM_registerMenuCommand('🎬 打开视频搜索', toggleSearchPanel);
    }

    // 主初始化函数
    function init() {
        // 确保只在顶层窗口运行，避免在iframe中重复执行
        if (window.self !== window.top) {
            return;
        }
        
        // 检查是否为播放器页面
        if (window.location.href.includes('player.html')) {
            return;
        }

        // 初始化状态模块
        StateModule.init();

        // 初始化样式
        initStyles();

        // 注入M3U8播放按钮
        injectM3U8PlayButtons();

        // 监听DOM变化
        observeDOM();

        // 添加菜单命令
        addMenuCommands();
    }

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
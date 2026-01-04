// ==UserScript==
// @name         B站评论弹幕收藏夹
// @version      0.1.4
// @description  记录b站发送的评论和弹幕,防止重要评论的丢失
// @author       naaammme
// @match        *://www.bilibili.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license       AGPL-3.0-or-later
// @icon         https://www.bilibili.com/favicon.ico
// @namespace https://greasyfork.org/users/1508061
// @downloadURL https://update.greasyfork.org/scripts/546933/B%E7%AB%99%E8%AF%84%E8%AE%BA%E5%BC%B9%E5%B9%95%E6%94%B6%E8%97%8F%E5%A4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/546933/B%E7%AB%99%E8%AF%84%E8%AE%BA%E5%BC%B9%E5%B9%95%E6%94%B6%E8%97%8F%E5%A4%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // ===================================================工具函数=====================================================
    function generateUniqueKey(type, data) {
        switch(type) {
            case 'sentComment':
                if (!data.mainComment) return null;
                return data.mainComment.userName + '|||' + data.mainComment.content + '|||' + data.videoBvid;
            case 'danmaku':
                return data.text + '|||' + data.videoId + '|||' + Math.floor(data.timestamp / 60000);
            case 'comment':
                return data.key || (data.userName + '|||' + (data.content || data.text));
            default:
                return null;
        }
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function generateContextId() {
        return 'ctx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // ====================================================配置模块=======================================================

// 配置常量=
const CONFIG = {
    DB_NAME: 'BilibiliCollectorDB',
    DB_VERSION: 2,
    DEBUG: false,
    STORES: {
        COMMENTS: 'comments',
        DANMAKU: 'danmaku',
        SENT_COMMENTS: 'sent_comments'
    },
    DEFAULT_LIMITS: {
        DISPLAY_COMMENTS: 50,
        DISPLAY_DANMAKU: 50,
        SENT_COMMENTS: 50
    },
    PAGINATION: {
        PAGE_SIZE: 10,
        MAX_PAGE_BUTTONS: 5
    },
    PERFORMANCE: {
        RETRY_BASE_DELAY: 300, // 基础重试延迟
        RETRY_MAX_DELAY: 3000, // 最大重试延迟
        RETRY_MULTIPLIER: 1.5, // 重试延迟递增倍数
        MUTATION_THROTTLE: 300, // MutationObserver节流时间
        SEARCH_TIMEOUT: 30000, // 搜索超时时间
        RANDOM_FACTOR: 0.3, // 随机因子
        MAX_CACHE_SIZE: 1000
    }
};

let db = null;
let recordedThreads = new Map();
let recordedDanmaku = [];
let sentComments = [];
let currentVideoInfo = null;
let replyContextMap = new Map();
let settings = { ...CONFIG.DEFAULT_LIMITS };

const domCache = new Map();
const cacheTimestamps = new Map();

let paginationState = {
    sentComments: { currentPage: 1, searchTerm: '', filteredData: [] },
    comments: { currentPage: 1, searchTerm: '', filteredData: [] },
    danmaku: { currentPage: 1, searchTerm: '', filteredData: [] }
};

function setDB(database) {
    db = database;
}

function setSettings(newSettings) {
    settings = { ...settings, ...newSettings };
}

function setCurrentVideoInfo(info) {
    currentVideoInfo = info;
}

function clearReplyContextMap() {
    replyContextMap.clear();
}

function resetPaginationState(type) {
    if (type && paginationState[type]) {
        paginationState[type].currentPage = 1;
        paginationState[type].searchTerm = '';
        paginationState[type].filteredData = [];
    } else {
        for (const key in paginationState) {
            paginationState[key].currentPage = 1;
            paginationState[key].searchTerm = '';
            paginationState[key].filteredData = [];
        }
    }
}

function getCachedElement(key, selector, parent = document) {
    const cached = domCache.get(key);

    if (cached) {
        if (cached.isConnected) {
            return cached; 
        } else {
            domCache.delete(key);
            cacheTimestamps.delete(key);
            if (CONFIG.DEBUG) console.log(`[DOM缓存] 清理失效元素: ${key}`);
        }
    }

    const element = parent.querySelector(selector);
    if (element) {
        if (domCache.size >= CONFIG.PERFORMANCE.MAX_CACHE_SIZE) {
            const oldestKeys = Array.from(cacheTimestamps.entries())
                .sort((a, b) => a[1] - b[1])
                .slice(0, 10)
                .map(([key]) => key);

            oldestKeys.forEach(oldKey => {
                domCache.delete(oldKey);
                cacheTimestamps.delete(oldKey);
            });

            if (CONFIG.DEBUG) console.log(`[DOM缓存] 清理了 ${oldestKeys.length} 个最老的缓存项`);
        }

        domCache.set(key, element);
        cacheTimestamps.set(key, Date.now());
    }

    return element;
}

function clearAllDomCache() {
    const size = domCache.size;
    domCache.clear();
    cacheTimestamps.clear();
    if (CONFIG.DEBUG) console.log(`[DOM缓存] 页面切换，清理了 ${size} 个缓存项`);
}

// 手动清理失效的DOM缓存（暂时不加入,未来用于调试）
function cleanInvalidDomCache() {
    const invalidKeys = [];

    for (const [key, element] of domCache.entries()) {
        if (!element || !element.isConnected) {
            invalidKeys.push(key);
        }
    }

    invalidKeys.forEach(key => {
        domCache.delete(key);
        cacheTimestamps.delete(key);
    });

    if (CONFIG.DEBUG && invalidKeys.length > 0) {
        console.log(`[DOM缓存] 手动清理了 ${invalidKeys.length} 个失效缓存`);
    }

    return invalidKeys.length;
}

function getRandomDelay(baseDelay) {
    const randomFactor = 1 + (Math.random() - 0.5) * CONFIG.PERFORMANCE.RANDOM_FACTOR * 2;
    return Math.round(baseDelay * randomFactor);
}

function getRetryDelay(attemptCount) {
    const delay = Math.min(
        CONFIG.PERFORMANCE.RETRY_BASE_DELAY * Math.pow(CONFIG.PERFORMANCE.RETRY_MULTIPLIER, attemptCount),
        CONFIG.PERFORMANCE.RETRY_MAX_DELAY
    );
    return getRandomDelay(delay);
}

    // ============================================数据模块=================================================

class DatabaseManager {
    static async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(CONFIG.DB_NAME, CONFIG.DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const database = request.result;
                setDB(database);
                resolve(database);
            };

            request.onupgradeneeded = (event) => {
                const database = event.target.result;
                setDB(database);

                if (!database.objectStoreNames.contains(CONFIG.STORES.COMMENTS)) {
                    const commentStore = database.createObjectStore(CONFIG.STORES.COMMENTS, { keyPath: 'id' });
                    commentStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                if (!database.objectStoreNames.contains(CONFIG.STORES.DANMAKU)) {
                    const danmakuStore = database.createObjectStore(CONFIG.STORES.DANMAKU, { keyPath: 'id', autoIncrement: true });
                    danmakuStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                if (!database.objectStoreNames.contains(CONFIG.STORES.SENT_COMMENTS)) {
                    const sentStore = database.createObjectStore(CONFIG.STORES.SENT_COMMENTS, { keyPath: 'id', autoIncrement: true });
                    sentStore.createIndex('timestamp', 'createTime', { unique: false });
                }
            };
        });
    }

    static async save(store, key, data) {
        const transaction = db.transaction([store], 'readwrite');
        const objectStore = transaction.objectStore(store);

        if (store === CONFIG.STORES.COMMENTS) {
            return objectStore.put({ id: key, data: data, timestamp: Date.now() });
        } else {
            return new Promise((resolve, reject) => {
                const request = objectStore.add(data);
                request.onsuccess = resolve;
                request.onerror = () => reject(request.error);
            });
        }
    }

    static async update(store, data) {
        const transaction = db.transaction([store], 'readwrite');
        const objectStore = transaction.objectStore(store);
        return objectStore.put(data);
    }

    static async delete(store, key) {
        const transaction = db.transaction([store], 'readwrite');
        return transaction.objectStore(store).delete(key);
    }

    static async clear(store) {
        const transaction = db.transaction([store], 'readwrite');
        return transaction.objectStore(store).clear();
    }

    static async loadAll() {
        await Promise.all([
            this.loadComments(),
            this.loadDanmaku(),
            this.loadSentComments()
        ]);
    }

    static async loadComments() {
        const transaction = db.transaction([CONFIG.STORES.COMMENTS], 'readonly');
        const store = transaction.objectStore(CONFIG.STORES.COMMENTS);

        const comments = await new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        recordedThreads.clear();
        comments.forEach(record => recordedThreads.set(record.id, record.data));
    }

    static async loadDanmaku() {
        const transaction = db.transaction([CONFIG.STORES.DANMAKU], 'readonly');
        const store = transaction.objectStore(CONFIG.STORES.DANMAKU);

        const result = await new Promise((resolve, reject) => {
            const request = store.openCursor();
            const danmakuList = [];
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const danmaku = cursor.value;
                    danmaku.id = cursor.key;
                    danmakuList.push(danmaku);
                    cursor.continue();
                } else {
                    resolve(danmakuList);
                }
            };
            request.onerror = () => reject(request.error);
        });

        recordedDanmaku.length = 0;
        recordedDanmaku.push(...result);
    }

    static async loadSentComments() {
        const transaction = db.transaction([CONFIG.STORES.SENT_COMMENTS], 'readonly');
        const store = transaction.objectStore(CONFIG.STORES.SENT_COMMENTS);

        const result = await new Promise((resolve, reject) => {
            const request = store.openCursor();
            const commentsList = [];
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const comment = cursor.value;
                    comment.id = cursor.key;
                    commentsList.push(comment);
                    cursor.continue();
                } else {
                    resolve(commentsList);
                }
            };
            request.onerror = () => reject(request.error);
        });

        sentComments.length = 0;
        sentComments.push(...result);
    }
}

    // =============================================设置模块===========================================================

class SettingsManager {
    static save() {
        localStorage.setItem('bilibili_collector_settings', JSON.stringify(settings));
    }

    static load() {
        try {
            const saved = localStorage.getItem('bilibili_collector_settings');
            if (saved) {
                const loadedSettings = { ...CONFIG.DEFAULT_LIMITS, ...JSON.parse(saved) };
                setSettings(loadedSettings);
            }
        } catch (e) {
            console.error('加载设置失败:', e);
            setSettings({ ...CONFIG.DEFAULT_LIMITS });
        }
    }

    static savePosition(position) {
        localStorage.setItem('bilibili_collector_float_position', JSON.stringify(position));
    }

    static loadPosition() {
        try {
            const saved = localStorage.getItem('bilibili_collector_float_position');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    }
}

    // ==============================================样式定义模块===================================================

const STYLES = `

#collector-float-btn{position:fixed;bottom:50px;right:50px;width:45px;height:45px;background:linear-gradient(45deg,#fb7299,#ff6b9d);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;color:#fff;cursor:move;box-shadow:0 4px 12px rgba(251,114,153,0.4);transition:all .3s ease;z-index:9999;user-select:none;touch-action:none}
#collector-float-btn:hover{transform:scale(1.1);box-shadow:0 6px 20px rgba(251,114,153,0.6)}
#collector-float-btn.dragging{transition:none;z-index:10000}
#collector-panel{position:fixed;bottom:100px;right:30px;width:500px;max-height:70vh;background:#fff;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.2);z-index:9998;font-family:sans-serif;font-size: 20px;display:flex;flex-direction:column;overflow:hidden;border:1px solid #e0e0e0}
.panel-header{padding:15px 20px;background:linear-gradient(135deg,#fb7299,#ff6b9d);color:#fff;font-weight:600;display:flex;justify-content:space-between;align-items:center}
.panel-close-btn{cursor:pointer;font-size:20px;opacity:0.8;transition:opacity .2s}
.panel-close-btn:hover{opacity:1}
.panel-content{padding:15px;overflow-y:auto;flex-grow:1;display:flex;flex-direction:column}
.panel-tabs{display:flex;gap:5px;margin-bottom:15px}
.tab-btn{flex:1;padding:10px;border:none;border-radius:6px;cursor:pointer;font-size:13px;background:#f5f5f5;transition:all .2s;font-weight:500}
.tab-btn.active{background:#fb7299;color:#fff}
.tab-btn:hover{background:#e0e0e0}
.tab-btn.active:hover{background:#e55d80}
.stats-bar{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;padding:10px;background:#f8f9fa;border-radius:6px;border:1px solid #e9ecef}
.btn{padding:6px 12px;border:none;border-radius:4px;cursor:pointer;font-size:12px;background:#00a1d6;color:#fff;margin-left:5px;transition:background .2s}
.btn:hover{background:#0080a6}
.btn.export{background:#52c41a}
.btn.export:hover{background:#389e0d}
.btn.danger{background:#dc3545}
.btn.danger:hover{background:#c82333}
.tab-content{background:#fff;border:1px solid #e9ecef;padding:15px;border-radius:6px;overflow-y:auto;flex-grow:1;max-height:400px}

.history-item{margin-bottom:20px;background:white;border:1px solid #e8e8e8;border-radius:6px;overflow:hidden;cursor:pointer;transition:all 0.2s;position:relative}
.history-item:hover{border-color:#00a1d6;box-shadow:0 2px 8px rgba(0,161,214,0.2)}
.main-comment{padding:12px;border-bottom:1px solid #f0f0f0;background:#fafafa;position:relative}
.reply-comment{padding:12px;margin-left:20px;border-left:3px solid #999;background:white;position:relative;border-bottom:1px solid #f5f5f5}

.reply-comment:last-child{border-bottom:none}
.third-level-comment{padding:12px;margin-left:40px;border-left:3px solid #999;background:#f9f9f9;position:relative;border-bottom:1px solid #f0f0f0}
.third-level-comment:last-child{border-bottom:none}
.comment-header{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.user-avatar{width:32px;height:32px;border-radius:50%;object-fit:cover}
.user-name{font-weight:bold;color:#fb7299;text-decoration:none;font-size:14px}
.user-name:hover{text-decoration:underline}
.comment-content{margin-left:40px;margin-bottom:8px;line-height:1.4;color:#333}
.comment-images{margin-left:40px;margin-bottom:8px;display:flex;flex-wrap:wrap;gap:6px}
.comment-image{max-width:100px;max-height:100px;border-radius:4px;object-fit:cover;cursor:pointer}
.comment-meta{margin-left:40px;font-size:11px;color:#999;display:flex;gap:15px}
.history-time{font-size:11px;color:#999;margin-top:8px;text-align:right}
.group-info{position:absolute;top:8px;right:8px;font-size:10px;color:#666;background:#e6f7ff;padding:2px 6px;border-radius:2px}
.reply-indicator{font-size:10px;color:#666;background:#f0f0f0;padding:2px 4px;border-radius:2px;margin-left:8px}
.third-level-count{font-size:10px;color:#52c41a;background:#f6ffed;padding:2px 4px;border-radius:2px;margin-left:8px}
.jump-hint{position:absolute;bottom:5px;right:8px;font-size:10px;color:#999;opacity:0;transition:opacity 0.2s}
.history-item:hover .jump-hint{opacity:1}

.thread-container,.danmaku-item{position:relative;margin-bottom:15px;padding:12px;border:1px solid #e0e0e0;border-radius:8px;background:#fafafa;cursor:pointer;transition:all .2s}
.thread-container:hover,.danmaku-item:hover{background:#f0f8ff;border-color:#00a1d6;transform:translateY(-1px);box-shadow:0 2px 8px rgba(0,161,214,0.1)}
.delete-btn{position:absolute;top:8px;right:8px;width:24px;height:24px;border:none;background:#ff6b6b;color:#fff;border-radius:50%;cursor:pointer;font-size:14px;opacity:0;transition:all .2s;z-index:10}
.thread-container:hover .delete-btn,.danmaku-item:hover .delete-btn,.history-item:hover .delete-btn{opacity:1}
.delete-btn:hover{background:#ff5252;transform:scale(1.1)}
.danmaku-text{font-weight:600;color:#333;margin-bottom:6px;word-break:break-word}
.danmaku-meta{font-size:12px;color:#666}
.danmaku-video-link{color:#00a1d6;text-decoration:none}
.danmaku-video-link:hover{text-decoration:underline}
.settings-section h4{margin:15px 0 10px 0;color:#333;font-size:16px}
.setting-item{margin-bottom:15px;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.setting-item label{min-width:120px;color:#666;font-weight:500}
.setting-item input[type="number"]{padding:6px 10px;border:1px solid #ddd;border-radius:4px;width:80px}
#save-settings-btn,#import-data-btn,#export-all-btn{background:#00a1d6;color:#fff;padding:8px 16px;border:none;border-radius:4px;cursor:pointer;transition:background .2s;margin-right:10px}
#save-settings-btn:hover,#import-data-btn:hover,#export-all-btn:hover{background:#0080a6}
#storage-info{font-size:14px;color:#333;background:#f8f9fa;padding:5px 10px;border-radius:4px}
.comment-text{margin-top:6px;padding-left:42px;line-height:1.4;word-break:break-word}
.comment-pictures-container{margin-left:42px;margin-top:10px;display:flex;flex-wrap:wrap;gap:8px}
.recorded-reply-item{padding:10px;border-left:3px solid #999;margin-left:20px;margin-top:10px;background:#f8f9fa;border-radius:0 6px 6px 0}

/* 上下文ID标识样式 */
.context-id-badge{position:absolute;top:2px;right:60px;font-size:9px;color:#999;background:#f0f0f0;padding:1px 4px;border-radius:2px;font-family:monospace}

/* 分页和搜索样式 */
.search-pagination-container{margin-bottom:15px;border:1px solid #e9ecef;border-radius:6px;background:#f8f9fa}
.search-container{padding:10px;border-bottom:1px solid #e9ecef}
.search-input{width:100%;padding:8px 12px;border:1px solid #ddd;border-radius:4px;font-size:13px;outline:none;transition:border-color .2s}
.search-input:focus{border-color:#00a1d6}
.search-placeholder{color:#999;font-style:italic}

.pagination-container{padding:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}
.pagination-info{font-size:12px;color:#666}
.pagination-controls{display:flex;align-items:center;gap:5px}
.pagination-btn{padding:6px 10px;border:1px solid #ddd;background:#fff;color:#333;border-radius:4px;cursor:pointer;font-size:12px;transition:all .2s;user-select:none}
.pagination-btn:hover{background:#f5f5f5;border-color:#00a1d6}
.pagination-btn.active{background:#00a1d6;color:#fff;border-color:#00a1d6}
.pagination-btn.disabled{background:#f8f9fa;color:#ccc;cursor:not-allowed;border-color:#eee}
.pagination-btn.disabled:hover{background:#f8f9fa;border-color:#eee}

.page-size-selector{display:flex;align-items:center;gap:5px;font-size:12px;color:#666}
.page-size-select{padding:4px 6px;border:1px solid #ddd;border-radius:4px;font-size:12px;outline:none}
.page-size-select:focus{border-color:#00a1d6}

.search-result-highlight{background:#fff3cd;padding:1px 2px;border-radius:2px}
.no-results{text-align:center;color:#999;padding:40px 20px;font-size:14px}
.no-results-icon{font-size:48px;margin-bottom:10px;opacity:0.5}
`;


    // =========================================js显示模块=================================================
class DisplayManager {
    static updateAll() {
        this.updateSentComments();
        this.updateComments();
        this.updateDanmaku();
        UIManager.updateCurrentDisplayCounts();
    }

    static updateSentComments() {
        const outputDiv = document.getElementById('sent-comments-output');
        const countSpan = document.getElementById('sent-comment-count');
        if (!outputDiv) return;

        const searchTerm = paginationState.sentComments.searchTerm.toLowerCase().trim();
        let filteredData = sentComments;

        if (searchTerm) {
            filteredData = sentComments.filter(group => {
                const mainContent = group.mainComment?.content?.toLowerCase() || '';
                const mainUserName = group.mainComment?.userName?.toLowerCase() || '';
                const videoTitle = group.videoTitle?.toLowerCase() || '';

                const replyMatches = group.replies.some(reply => {
                    const replyContent = reply.content?.toLowerCase() || '';
                    const replyUserName = reply.userName?.toLowerCase() || '';

                    const thirdLevelMatches = reply.thirdLevelReplies?.some(third => {
                        const thirdContent = third.content?.toLowerCase() || '';
                        const thirdUserName = third.userName?.toLowerCase() || '';
                        return thirdContent.includes(searchTerm) || thirdUserName.includes(searchTerm);
                    }) || false;

                    return replyContent.includes(searchTerm) || replyUserName.includes(searchTerm) || thirdLevelMatches;
                });

                return mainContent.includes(searchTerm) ||
                       mainUserName.includes(searchTerm) ||
                       videoTitle.includes(searchTerm) ||
                       replyMatches;
            });
        }

        paginationState.sentComments.filteredData = filteredData;

        const pageSize = UIManager.getPageSize('sentComments');
        const currentPage = paginationState.sentComments.currentPage;
        const totalPages = Math.ceil(filteredData.length / pageSize);
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        countSpan.textContent = `发送记录: ${sentComments.length}组，最多保存${settings.SENT_COMMENTS}组`;

        this.updatePaginationInfo('sent-comments', filteredData.length, currentPage, totalPages, startIndex, endIndex);
        this.updatePaginationControls('sent-comments', currentPage, totalPages, 'sentComments');

        if (filteredData.length === 0) {
            if (searchTerm) {
                outputDiv.innerHTML = this.renderNoResults('未找到匹配的评论记录', '🔍');
            } else {
                outputDiv.innerHTML = '<div style="text-align:center;color:#999;padding:20px;">暂无记录</div>';
            }
            return;
        }

        if (paginatedData.length === 0 && currentPage > 1) {
            paginationState.sentComments.currentPage = 1;
            this.updateSentComments();
            return;
        }

        const highlightedHtml = paginatedData.map((group, index) => {
            return this.renderCommentGroup(group, startIndex + index, searchTerm);
        }).join('');

        outputDiv.innerHTML = highlightedHtml;
    }

    static updateComments() {
        const outputDiv = document.getElementById('recorded-comments-output');
        const countSpan = document.getElementById('comment-count');
        if (!outputDiv) return;

        const threadsArray = Array.from(recordedThreads.entries())
            .sort((a, b) => (b[1].timestamp || 0) - (a[1].timestamp || 0));

        const searchTerm = paginationState.comments.searchTerm.toLowerCase().trim();
        let filteredData = threadsArray;

        if (searchTerm) {
            filteredData = threadsArray.filter(([key, thread]) => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = thread.mainHTML + (thread.repliesHTML || []).join('');
                const textContent = tempDiv.textContent.toLowerCase();
                return textContent.includes(searchTerm);
            });
        }

        paginationState.comments.filteredData = filteredData;

        const pageSize = UIManager.getPageSize('comments');
        const currentPage = paginationState.comments.currentPage;
        const totalPages = Math.ceil(filteredData.length / pageSize);
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        const totalCount = recordedThreads.size;
        countSpan.textContent = `评论: ${totalCount}` + (searchTerm ? ` (搜索到${filteredData.length}组)` : '');

        this.updatePaginationInfo('comments', filteredData.length, currentPage, totalPages, startIndex, endIndex);
        this.updatePaginationControls('comments', currentPage, totalPages, 'comments');

        if (filteredData.length === 0) {
            if (searchTerm) {
                outputDiv.innerHTML = this.renderNoResults('未找到匹配的评论收藏', '🔍');
            } else {
                outputDiv.innerHTML = '暂无收藏，请点击评论区的点赞按钮。';
            }
            return;
        }

        if (paginatedData.length === 0 && currentPage > 1) {
            paginationState.comments.currentPage = 1;
            this.updateComments();
            return;
        }

        let html = '';
        paginatedData.forEach(([key, thread], index) => {
            const displayIndex = startIndex + index + 1;//暂时不使用
            let mainHTML = thread.mainHTML;
            let repliesHTML = (thread.repliesHTML || []).join('');

            if (searchTerm) {
                mainHTML = this.highlightSearchTerm(mainHTML, searchTerm);
                repliesHTML = this.highlightSearchTerm(repliesHTML, searchTerm);
            }

            html += `<div class="thread-container" data-video-url="${escapeHtml(thread.videoLink)}">
                ${mainHTML}
                ${repliesHTML}
                <button class="delete-btn" data-key="${escapeHtml(key)}" data-type="comment">×</button>
            </div>`;
        });
        outputDiv.innerHTML = html;
    }

    static updateDanmaku() {
        const outputDiv = document.getElementById('recorded-danmaku-output');
        const countSpan = document.getElementById('danmaku-count');
        if (!outputDiv) return;

        const sortedDanmaku = recordedDanmaku.sort((a, b) => b.timestamp - a.timestamp);

        const searchTerm = paginationState.danmaku.searchTerm.toLowerCase().trim();
        let filteredData = sortedDanmaku;

        if (searchTerm) {
            filteredData = sortedDanmaku.filter(danmaku => {
                const text = danmaku.text?.toLowerCase() || '';
                const videoTitle = danmaku.videoTitle?.toLowerCase() || '';
                return text.includes(searchTerm) || videoTitle.includes(searchTerm);
            });
        }

        paginationState.danmaku.filteredData = filteredData;

        const pageSize = UIManager.getPageSize('danmaku');
        const currentPage = paginationState.danmaku.currentPage;
        const totalPages = Math.ceil(filteredData.length / pageSize);
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        const totalCount = recordedDanmaku.length;
        countSpan.textContent = `弹幕: ${totalCount}` + (searchTerm ? ` (搜索到${filteredData.length}条)` : '');

        this.updatePaginationInfo('danmaku', filteredData.length, currentPage, totalPages, startIndex, endIndex);
        this.updatePaginationControls('danmaku', currentPage, totalPages, 'danmaku');

        if (filteredData.length === 0) {
            if (searchTerm) {
                outputDiv.innerHTML = this.renderNoResults('未找到匹配的弹幕记录', '🔍');
            } else {
                outputDiv.innerHTML = '暂无弹幕记录，发送弹幕后会自动记录。';
            }
            return;
        }

        if (paginatedData.length === 0 && currentPage > 1) {
            paginationState.danmaku.currentPage = 1;
            this.updateDanmaku();
            return;
        }

        let html = '';
        paginatedData.forEach((danmaku) => {
            let text = escapeHtml(danmaku.text);
            let videoTitle = escapeHtml(danmaku.videoTitle);

            if (searchTerm) {
                text = this.highlightSearchTerm(text, searchTerm);
                videoTitle = this.highlightSearchTerm(videoTitle, searchTerm);
            }

            html += `<div class="danmaku-item">
                <div class="danmaku-text">${text}</div>
                <div class="danmaku-meta">
                    <span>${escapeHtml(danmaku.time)}</span> ·
                    <a href="${escapeHtml(danmaku.videoUrl)}" target="_blank" class="danmaku-video-link">${videoTitle}</a>
                </div>
                <button class="delete-btn" data-id="${danmaku.id}" data-type="danmaku">×</button>
            </div>`;
        });
        outputDiv.innerHTML = html;
    }

    static updatePaginationInfo(type, totalCount, currentPage, totalPages, startIndex, endIndex) {
        const infoElement = document.getElementById(`${type}-pagination-info`);
        if (infoElement) {
            if (totalCount === 0) {
                infoElement.textContent = '显示 0 条记录';
            } else {
                const start = startIndex + 1;
                const end = Math.min(endIndex, totalCount);
                infoElement.textContent = `显示 ${start}-${end} 条，共 ${totalCount} 条记录 (第${currentPage}/${totalPages}页)`;
            }
        }
    }

    static updatePaginationControls(type, currentPage, totalPages, stateKey) {
        const controlsElement = document.getElementById(`${type}-pagination-controls`);
        if (!controlsElement) return;

        if (totalPages <= 1) {
            controlsElement.innerHTML = '';
            return;
        }

        let html = '';

        const prevDisabled = currentPage <= 1 ? 'disabled' : '';
        html += `<button class="pagination-btn ${prevDisabled}" data-type="${stateKey}" data-action="prev">‹ 上一页</button>`;

        const maxButtons = CONFIG.PAGINATION.MAX_PAGE_BUTTONS;
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);

        if (endPage - startPage + 1 < maxButtons) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        if (startPage > 1) {
            html += `<button class="pagination-btn" data-type="${stateKey}" data-page="1">1</button>`;
            if (startPage > 2) {
                html += `<span class="pagination-btn disabled">...</span>`;
            }
        }

        for (let page = startPage; page <= endPage; page++) {
            const activeClass = page === currentPage ? 'active' : '';
            html += `<button class="pagination-btn ${activeClass}" data-type="${stateKey}" data-page="${page}">${page}</button>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += `<span class="pagination-btn disabled">...</span>`;
            }
            html += `<button class="pagination-btn" data-type="${stateKey}" data-page="${totalPages}">${totalPages}</button>`;
        }

        const nextDisabled = currentPage >= totalPages ? 'disabled' : '';
        html += `<button class="pagination-btn ${nextDisabled}" data-type="${stateKey}" data-action="next">下一页 ›</button>`;

        controlsElement.innerHTML = html;
    }

    static renderNoResults(message, icon = '📝') {
        return `<div class="no-results">
            <div class="no-results-icon">${icon}</div>
            <div>${message}</div>
            <div style="margin-top:10px;font-size:12px;color:#ccc;">尝试修改搜索关键词或清空搜索框</div>
        </div>`;
    }

    static highlightSearchTerm(text, searchTerm) {
        if (!searchTerm || !text) return text;

        const regex = new RegExp(`(${escapeHtml(searchTerm).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<span class="search-result-highlight">$1</span>');
    }

    static renderCommentGroup(group, index, searchTerm = '') {
        let mainCommentHTML = '';
        if (group.mainComment) {
            const mainComment = group.mainComment;
            let mainImagesHTML = '';
            if (mainComment.images && mainComment.images.length > 0) {
                const mainImages = mainComment.images.map(src =>
                    `<img class="comment-image" src="${escapeHtml(src)}">`
                ).join('');
                mainImagesHTML = `<div class="comment-images">${mainImages}</div>`;
            }

            const totalReplies = group.replies.reduce((total, reply) => {
                return total + (reply.thirdLevelReplies ? reply.thirdLevelReplies.length : 0) + 1;
            }, 0);

            let userName = escapeHtml(mainComment.userName);
            let content = escapeHtml(mainComment.content);
            let videoTitle = escapeHtml(group.videoTitle);

            if (searchTerm) {
                userName = this.highlightSearchTerm(userName, searchTerm);
                content = this.highlightSearchTerm(content, searchTerm);
                videoTitle = this.highlightSearchTerm(videoTitle, searchTerm);
            }

            mainCommentHTML = `
                <div class="main-comment">
                    <div class="group-info">第${index + 1}组 (${totalReplies}条回复)</div>
                    ${group.contextId ? `<div class="context-id-badge">${group.contextId}</div>` : ''}
                    <div class="jump-hint">双击跳转视频</div>
                    <div class="comment-header">
                        <img class="user-avatar" src="${escapeHtml(mainComment.userAvatar || 'https://static.hdslb.com/images/member/noface.gif')}">
                        <a class="user-name" href="${escapeHtml(mainComment.userLink)}" target="_blank">${userName}</a>
                        <span style="color: #999; font-size: 12px;">（主评论）</span>
                    </div>
                    <div class="comment-content">${content}</div>
                    ${mainImagesHTML}
                    <div class="comment-meta">
                        <span>日期: ${escapeHtml(mainComment.pubDate)}</span>
                        <span>点赞: ${escapeHtml(mainComment.likeCount)}</span>
                        <span>标题: ${videoTitle}</span>
                    </div>
                    <div class="history-time">首次记录: ${escapeHtml(group.createTime)}</div>
                </div>
            `;
        }

        const repliesHTML = group.replies.map((reply) => {
            return this.renderReply(reply, searchTerm);
        }).join('');

        return `
            <div class="history-item" data-video-url="${escapeHtml(group.videoUrl)}">
                ${mainCommentHTML}
                ${repliesHTML}
                <button class="delete-btn" data-id="${group.id}" data-type="sent">×</button>
            </div>
        `;
    }

    static renderReply(reply, searchTerm = '') {
        let replyImagesHTML = '';
        if (reply.images && reply.images.length > 0) {
            const replyImages = reply.images.map(src =>
                `<img class="comment-image" src="${escapeHtml(src)}">`
            ).join('');
            replyImagesHTML = `<div class="comment-images">${replyImages}</div>`;
        }

        let thirdLevelHTML = '';
        if (reply.thirdLevelReplies && reply.thirdLevelReplies.length > 0) {
            thirdLevelHTML = reply.thirdLevelReplies.map(thirdLevel => {
                let thirdImagesHTML = '';
                if (thirdLevel.images && thirdLevel.images.length > 0) {
                    const thirdImages = thirdLevel.images.map(src =>
                        `<img class="comment-image" src="${escapeHtml(src)}">`
                    ).join('');
                    thirdImagesHTML = `<div class="comment-images">${thirdImages}</div>`;
                }

                let thirdUserName = escapeHtml(thirdLevel.userName);
                let thirdContent = escapeHtml(thirdLevel.content);

                if (searchTerm) {
                    thirdUserName = this.highlightSearchTerm(thirdUserName, searchTerm);
                    thirdContent = this.highlightSearchTerm(thirdContent, searchTerm);
                }

                return `
                    <div class="third-level-comment">
                        <div class="comment-header">
                            <img class="user-avatar" src="${escapeHtml(thirdLevel.userAvatar || 'https://static.hdslb.com/images/member/noface.gif')}">
                            <a class="user-name" href="${escapeHtml(thirdLevel.userLink)}" target="_blank">${thirdUserName}</a>
                            <span class="reply-indicator">回复 @${escapeHtml(reply.userName)}</span>
                        </div>
                        <div class="comment-content">${thirdContent}</div>
                        ${thirdImagesHTML}
                        <div class="comment-meta">
                            <span>日期: ${escapeHtml(thirdLevel.pubDate)}</span>
                            <span>点赞: ${escapeHtml(thirdLevel.likeCount)}</span>
                        </div>
                        <div class="history-time">${escapeHtml(thirdLevel.time)}</div>
                    </div>
                `;
            }).join('');
        }

        const thirdLevelCount = reply.thirdLevelReplies ? reply.thirdLevelReplies.length : 0;
        const countBadge = thirdLevelCount > 0 ? `<span class="third-level-count">${thirdLevelCount}条回复</span>` : '';

        let replyUserName = escapeHtml(reply.userName);
        let replyContent = escapeHtml(reply.content);

        if (searchTerm) {
            replyUserName = this.highlightSearchTerm(replyUserName, searchTerm);
            replyContent = this.highlightSearchTerm(replyContent, searchTerm);
        }

        return `
            <div class="reply-comment">
                <div class="comment-header">
                    <img class="user-avatar" src="${escapeHtml(reply.userAvatar || 'https://static.hdslb.com/images/member/noface.gif')}">
                    <a class="user-name" href="${escapeHtml(reply.userLink)}" target="_blank">${replyUserName}</a>
                    <span style="color: #999; font-size: 12px;">（二级评论）</span>
                    ${countBadge}
                </div>
                <div class="comment-content">${replyContent}</div>
                ${replyImagesHTML}
                <div class="comment-meta">
                    <span>日期: ${escapeHtml(reply.pubDate)}</span>
                    <span>点赞: ${escapeHtml(reply.likeCount)}</span>
                </div>
                <div class="history-time">${escapeHtml(reply.time)}</div>
            </div>
            ${thirdLevelHTML}
        `;
    }

    static detailsToHTML(details, className = 'comment-entry') {
        if (!details) return '';
        const avatarSrc = details.userAvatar || 'https://static.hdslb.com/images/member/noface.gif';
        let html = `<div class="${className}">
            <div class="comment-header">
                <a href="${escapeHtml(details.userLink)}" target="_blank" onclick="event.stopPropagation()">
                    <img class="user-avatar" src="${escapeHtml(avatarSrc)}">
                </a>
                <a class="user-name" href="${escapeHtml(details.userLink)}" target="_blank" onclick="event.stopPropagation()">
                    ${escapeHtml(details.userName)}
                </a>
            </div>`;

        if (details.text) html += `<div class="comment-text">${escapeHtml(details.text)}</div>`;

        if (details.imageSrcs?.length > 0) {
            html += `<div class="comment-pictures-container">`;
            details.imageSrcs.forEach(src => {
                html += `<img class="comment-image" src="${escapeHtml(src)}">`;
            });
            html += `</div>`;
        }

        html += `<div class="comment-meta">
            <span>日期: ${escapeHtml(details.pubDate)}</span>
            <span>点赞: ${escapeHtml(details.likeCount)}</span>
        </div></div>`;
        return html;
    }
}

        // =====================================数据管理模块====================================================
class DataManager {
    static exportAll() {
        const data = {
            version: '15.2',
            type: 'all',
            comments: Array.from(recordedThreads.entries()),
            danmaku: recordedDanmaku,
            sentComments: sentComments,
            exportTime: new Date().toISOString(),
            counts: {
                comments: recordedThreads.size,
                danmaku: recordedDanmaku.length,
                sentComments: sentComments.length
            }
        };
        this.downloadJSON(data, `bilibili_all_data_${Date.now()}.json`);
    }

    static exportSentComments() {
        const data = {
            version: '15.2',
            type: 'sent_comments_grouped',
            data: sentComments,
            exportTime: new Date().toISOString(),
            video: currentVideoInfo
        };
        this.downloadJSON(data, `bilibili_sent_comments_${Date.now()}.json`);
    }

    static downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    static async import(file) {
        try {
            const data = JSON.parse(await file.text());
            let importCount = { comments: 0, danmaku: 0, sentComments: 0 };
            let mergeCount = { sentComments: 0, danmaku: 0 };

            if (data.type === 'all') {
                if (data.comments) {
                    for (const [key, value] of data.comments) {
                        await DatabaseManager.save('comments', key, value);
                        importCount.comments++;
                    }
                }

                if (data.danmaku) {
                    for (const danmaku of data.danmaku) {
                        const result = await this.importWithMerge('danmaku', danmaku);
                        if (result.isNew) importCount.danmaku++;
                        else mergeCount.danmaku++;
                    }
                }

                if (data.sentComments) {
                    for (const comment of data.sentComments) {
                        const result = await this.importWithMerge('sentComment', comment);
                        if (result.isNew) importCount.sentComments++;
                        else mergeCount.sentComments++;
                    }
                }

            } else if (data.type === 'comments') {
                for (const [key, value] of data.data) {
                    await DatabaseManager.save('comments', key, value);
                    importCount.comments++;
                }
            } else if (data.type === 'danmaku') {
                for (const danmaku of data.data) {
                    const result = await this.importWithMerge('danmaku', danmaku);
                    if (result.isNew) importCount.danmaku++;
                    else mergeCount.danmaku++;
                }
            } else if (data.type === 'sent_comments_grouped' || data.type === 'sent_comments_grouped_optimized') {
                for (const comment of data.data) {
                    const result = await this.importWithMerge('sentComment', comment);
                    if (result.isNew) importCount.sentComments++;
                    else mergeCount.sentComments++;
                }
            }

            await DatabaseManager.loadAll();
            DisplayManager.updateAll();

            let resultMessage = '数据导入完成！\n';
            if (importCount.comments > 0) {
                resultMessage += `评论收藏: ${importCount.comments}条\n`;
            }
            if (importCount.danmaku > 0) {
                resultMessage += `弹幕记录:  ${importCount.danmaku}条`;
                if (mergeCount.danmaku > 0) {
                    resultMessage += `，合并${mergeCount.danmaku}条`;
                }
                resultMessage += '\n';
            }
            if (importCount.sentComments > 0) {
                resultMessage += `评论记录:  ${importCount.sentComments}组`;
                if (mergeCount.sentComments > 0) {
                    resultMessage += `，合并${mergeCount.sentComments}组`;
                }
            }

            alert(resultMessage);

        } catch (e) {
            console.error('导入错误:', e);
            alert('数据导入失败: ' + e.message);
        }
    }

    static async importWithMerge(type, data) {
        const uniqueKey = generateUniqueKey(type, data);
        if (!uniqueKey) return { isNew: true };

        if (type === 'sentComment') {
            const existingGroup = sentComments.find(group =>
                generateUniqueKey('sentComment', group) === uniqueKey
            );

            if (existingGroup) {
                if (data.replies && data.replies.length > 0) {
                    for (const newReply of data.replies) {
                        const existingReply = existingGroup.replies.find(reply =>
                            reply.content === newReply.content &&
                            reply.userName === newReply.userName
                        );
                        if (!existingReply) {
                            existingGroup.replies.push(newReply);
                        } else if (newReply.thirdLevelReplies && newReply.thirdLevelReplies.length > 0) {
                            if (!existingReply.thirdLevelReplies) {
                                existingReply.thirdLevelReplies = [];
                            }
                            for (const thirdLevel of newReply.thirdLevelReplies) {
                                const existingThird = existingReply.thirdLevelReplies.find(third =>
                                    third.content === thirdLevel.content &&
                                    third.userName === thirdLevel.userName
                                );
                                if (!existingThird) {
                                    existingReply.thirdLevelReplies.push(thirdLevel);
                                }
                            }
                        }
                    }
                }

                existingGroup.lastUpdateTime = new Date().toLocaleString();
                await DatabaseManager.update('sent_comments', existingGroup);
                return { isNew: false };
            }

        } else if (type === 'danmaku') {
            const existingDanmaku = recordedDanmaku.find(d =>
                generateUniqueKey('danmaku', d) === uniqueKey
            );

            if (existingDanmaku) {
                existingDanmaku.time = data.time || existingDanmaku.time;
                existingDanmaku.videoTitle = data.videoTitle || existingDanmaku.videoTitle;
                await DatabaseManager.update('danmaku', existingDanmaku);
                return { isNew: false };
            }
        }

        delete data.id;
        const store = type === 'sentComment' ? 'sent_comments' : 'danmaku';
        await DatabaseManager.save(store, null, data);
        return { isNew: true };
    }
}

    // ========================================评论提取和监听=========================================

class CommentExtractor {
    static extractDetails(commentRenderer) {
        if (!commentRenderer || !commentRenderer.shadowRoot) return null;

        try {
            const commentRoot = commentRenderer.shadowRoot;
            const richTextEl = commentRoot.querySelector('bili-rich-text');
            if (!richTextEl || !richTextEl.shadowRoot) return null;

            const contentsEl = richTextEl.shadowRoot.querySelector('p#contents');
            if (!contentsEl) return null;

            const text = contentsEl.textContent?.trim() || '';
            const imageNodes = commentRoot.querySelector('bili-comment-pictures-renderer')?.shadowRoot?.querySelectorAll('div#content img');
            const imageSrcs = imageNodes ? Array.from(imageNodes).map(img => img.src) : [];

            const uniqueKey = text || (imageSrcs.length > 0 ? imageSrcs[0] : null);
            if (!uniqueKey) return null;

            const userInfoHost = commentRoot.querySelector('bili-comment-user-info');
            const userAnchor = userInfoHost?.shadowRoot?.querySelector('a');
            const userName = userAnchor?.textContent.trim() || '未知用户';
            const userLink = userAnchor?.href || '#';

            const avatarRenderer = commentRoot.querySelector('bili-avatar');
            const userAvatar = avatarRenderer?.shadowRoot?.querySelector('img')?.src;

            const actionsRoot = commentRoot.querySelector('bili-comment-action-buttons-renderer')?.shadowRoot;
            const pubDate = actionsRoot?.querySelector('div#pubdate')?.textContent.trim() || '';
            const likeCount = actionsRoot?.querySelector('div#like span#count')?.textContent.trim() || '0';

            return {
                key: uniqueKey,
                text,
                content: text,
                imageSrcs,
                images: imageSrcs,
                pubDate,
                likeCount,
                userName,
                userLink,
                userAvatar,
                videoLink: window.location.href
            };
        } catch (error) {
            if (CONFIG.DEBUG) console.warn('[评论提取器] 提取失败:', error.message);
            return null;
        }
    }

    static generateCommentKey(comment) {
        if (!comment) return null;
        const content = comment.content || comment.text || '';
        return `${comment.userName}|||${content}`;
    }

    static findExistingCommentGroup(mainComment) {
        if (!mainComment) return null;
        const key = this.generateCommentKey(mainComment);
        if (!key) return null;

        return sentComments.find(group => {
            if (!group.mainComment) return false;
            const groupKey = this.generateCommentKey(group.mainComment);
            return groupKey === key;
        });
    }

    static findExistingSecondLevelComment(group, secondLevelComment) {
        if (!group || !secondLevelComment) return null;
        const key = this.generateCommentKey(secondLevelComment);
        if (!key) return null;

        return group.replies.find(reply => {
            if (reply.type !== '二级评论') return false;
            const replyKey = this.generateCommentKey(reply);
            return replyKey === key;
        });
    }

    static cleanupOldComments() {
        if (sentComments.length > settings.SENT_COMMENTS) {
            sentComments.splice(settings.SENT_COMMENTS);
        }
    }
}

    // =========================================核心!弹幕监听模块=================================================

class DanmakuListener {
    static isMonitoring = false;
    static searchTimer = null;
    static updateTimer = null; 
    static currentHandlers = null;
    static lastRecord = null;
    static retryCount = 0;
    static lastSearchTime = 0;
    static mutationObserver = null;

    static init() {
        if (CONFIG.DEBUG) console.log('[弹幕监听器] 开始初始化');
        setTimeout(() => {
            this.setupDanmakuMonitoring();
        }, getRandomDelay(500));
    }

    static setupDanmakuMonitoring() {
        const inputSelectors = [
            '.bpx-player-dm-input',
            '.bilibili-player-video-danmaku-input',
            'input[placeholder*="弹幕"]'
        ];

        const buttonSelectors = [
            '.bpx-player-dm-btn-send',
            '.bilibili-player-video-btn-send'
        ];

        const setupMonitoring = () => {
            if (this.isMonitoring) return;

            const now = Date.now();

            if (now - this.lastSearchTime < CONFIG.PERFORMANCE.RETRY_BASE_DELAY) {
                return;
            }
            this.lastSearchTime = now;

            const playerContainer = getCachedElement('player-container', '.bpx-player-container') ||
                                  getCachedElement('video-container', '.bilibili-player-video-wrap');

            if (!playerContainer) {
                if (CONFIG.DEBUG) console.log('[弹幕监听器] 播放器容器未找到');
                return;
            }

            let input = null;
            for (const selector of inputSelectors) {
                input = getCachedElement(`danmaku-input-${selector}`, selector, playerContainer);
                if (input) break;
            }

            let sendBtn = null;
            for (const selector of buttonSelectors) {
                sendBtn = getCachedElement(`danmaku-btn-${selector}`, selector, playerContainer);
                if (sendBtn) break;
            }

            if (input && sendBtn) {
                if (this.searchTimer) {
                    clearInterval(this.searchTimer);
                    this.searchTimer = null;
                    if (CONFIG.DEBUG) console.log('[弹幕监听器] 弹幕元素已找到，停止搜索');
                }

                this.isMonitoring = true;
                this.retryCount = 0; 

                this.removeOldHandlers();

                let lastKeyTime = 0;
                const handleKeydown = (e) => {
                    if (e.key === 'Enter') {
                        const now = Date.now();
                        if (now - lastKeyTime < 300) return; 
                        lastKeyTime = now;

                        const text = e.target.value.trim();
                        if (text && currentVideoInfo) {
                            setTimeout(() => {
                                this.recordDanmaku(text, '回车键');
                            }, getRandomDelay(100));
                        }
                    }
                };

                let lastClickTime = 0;
                const handleClick = () => {
                    const now = Date.now();
                    if (now - lastClickTime < 300) return; 
                    lastClickTime = now;

                    const text = input.value.trim();
                    if (text && currentVideoInfo) {
                        setTimeout(() => {
                            this.recordDanmaku(text, '点击发送');
                        }, getRandomDelay(100));
                    }
                };

                input.addEventListener('keydown', handleKeydown);
                sendBtn.addEventListener('click', handleClick);

                this.currentHandlers = {
                    input: input,
                    sendBtn: sendBtn,
                    keydownHandler: handleKeydown,
                    clickHandler: handleClick
                };

                if (CONFIG.DEBUG) console.log('[弹幕监听器] 弹幕监控已启动');

                this.setupMutationObserver(playerContainer);

            } else {
                if (CONFIG.DEBUG && this.retryCount % 5 === 0) {
                    console.log('[弹幕监听器] 弹幕元素未找到，继续搜索...');
                }
                this.retryCount++;
            }
        };

        const startSearching = () => {
            if (this.searchTimer) return;

            setupMonitoring()

            let searchCount = 0;
            this.searchTimer = setInterval(() => {
                if (!this.isMonitoring && searchCount < 10) { 
                    setupMonitoring();
                    searchCount++;

                    if (searchCount > 5) { 
                        clearInterval(this.searchTimer);
                        this.searchTimer = setInterval(() => {
                            if (!this.isMonitoring) {
                                setupMonitoring();
                            }
                        }, getRetryDelay(searchCount - 5));
                    }
                } else if (searchCount >= 10) { 
                    clearInterval(this.searchTimer);
                    this.searchTimer = null;
                    if (CONFIG.DEBUG) console.log('[弹幕监听器] 达到最大搜索次数，停止搜索');
                }
            }, getRetryDelay(Math.min(searchCount, 3)));
        };
        startSearching();
    }

    static setupMutationObserver(container) {
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
            this.mutationObserver = null;
        }

        let mutationThrottle = null;
        this.mutationObserver = new MutationObserver((mutations) => {

            if (mutationThrottle) return;

            mutationThrottle = setTimeout(() => {
                mutationThrottle = null;

                if (!this.currentHandlers ||
                    !this.currentHandlers.input ||
                    !this.currentHandlers.sendBtn) {
                    return;
                }

                if (!document.contains(this.currentHandlers.input) ||
                    !document.contains(this.currentHandlers.sendBtn)) {

                    if (CONFIG.DEBUG) console.log('[弹幕监听器] 弹幕元素已移除，重新搜索');
                    this.isMonitoring = false;
                    this.removeOldHandlers();

                    setTimeout(() => {
                        this.setupDanmakuMonitoring();
                    }, getRandomDelay(1000));
                }
            }, CONFIG.PERFORMANCE.MUTATION_THROTTLE);
        });

        const dmControl = container.querySelector('.bpx-player-control-bottom') ||
                         container.querySelector('.bilibili-player-video-control');

        if (dmControl) {
            this.mutationObserver.observe(dmControl, {
                childList: true,
                subtree: false, //不深入查询
                attributes: false
            });
        }
    }

    static removeOldHandlers() {
        if (this.currentHandlers) {
            if (this.currentHandlers.input && this.currentHandlers.keydownHandler) {
                this.currentHandlers.input.removeEventListener('keydown', this.currentHandlers.keydownHandler);
            }
            if (this.currentHandlers.sendBtn && this.currentHandlers.clickHandler) {
                this.currentHandlers.sendBtn.removeEventListener('click', this.currentHandlers.clickHandler);
            }
            this.currentHandlers = null;
        }
    }

    static recordDanmaku(text, method) {
        if (!text || text.trim() === '') return;

        const now = Date.now();
        const trimmedText = text.trim();

        if (this.lastRecord &&
            this.lastRecord.text === trimmedText &&
            (now - this.lastRecord.timestamp) < 1000) { // 1秒内防重复
            if (CONFIG.DEBUG) console.log(`[弹幕监听器] 弹幕去重: 忽略重复记录 "${trimmedText}" (${method})`);
            return;
        }

        const danmakuData = {
            text: trimmedText,
            videoId: currentVideoInfo.bvid,
            videoUrl: currentVideoInfo.url,
            videoTitle: currentVideoInfo.title,
            timestamp: now,
            time: new Date().toLocaleString()
        };

        const isDuplicate = recordedDanmaku.some(record =>
            record.text === text && (danmakuData.timestamp - record.timestamp) < 3000
        );

        if (!isDuplicate) {
            this.lastRecord = {
                text: trimmedText,
                timestamp: now
            };

            DatabaseManager.save('danmaku', null, danmakuData).then((event) => {
                danmakuData.id = event.target.result;
                recordedDanmaku.unshift(danmakuData);

                if (recordedDanmaku.length > 1000) {
                    recordedDanmaku = recordedDanmaku.slice(0, 1000);
                }

                if (!this.updateTimer) {
                    this.updateTimer = setTimeout(() => {
                        DisplayManager.updateDanmaku();
                        this.updateTimer = null;
                    }, 500);
                }
            }).catch(error => {
                if (CONFIG.DEBUG) console.error('[弹幕监听器] 保存失败:', error);
            });

            if (CONFIG.DEBUG) console.log(`[弹幕监听器] 弹幕记录: ${method} - "${text}"`);
        }
    }

    static reset() {
        if (CONFIG.DEBUG) console.log('[弹幕监听器] 重置状态');

        this.isMonitoring = false;
        this.retryCount = 0;
        this.lastSearchTime = 0;

        if (this.searchTimer) {
            clearInterval(this.searchTimer);
            this.searchTimer = null;
        }

        if (this.updateTimer) {
            clearTimeout(this.updateTimer);
            this.updateTimer = null;
        }

        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
            this.mutationObserver = null;
        }

        this.removeOldHandlers();
        this.lastRecord = null;
    }

    static cleanup() {
        this.reset();
        if (CONFIG.DEBUG) console.log('[弹幕监听器] 清理完成');
    }
}

    // ============================================核心,评论监听模块======================================================
//未来考虑使用事件委托减少监听数量

class ListenerManager {

    static listeners = new Map();
    static isInitialized = false;
    static mutationObservers = new Map();

    static recentComments = new Map();
    static lastRecordTime = 0;

    static lastMutationTime = 0;
    static pendingMutations = new Set();

    static init() {
        if (this.isInitialized) {
            if (CONFIG.DEBUG) console.log('[监听器管理] 已初始化，跳过');
            return;
        }

        setTimeout(() => {
            this.initReplyButtonListener();
            this.initSendButtonListener();
            this.initCommentClickListener();
            this.initPageListener();

            DanmakuListener.init();

            this.isInitialized = true;
            if (CONFIG.DEBUG) console.log('[监听器管理] 初始化完成');
        }, getRandomDelay(200));
    }

    static initReplyButtonListener() {
        if (this.listeners.has('reply-button')) {
            document.removeEventListener('click', this.listeners.get('reply-button'), true);
        }

        const replyHandler = (event) => {
            const now = Date.now();
            if (now - this.lastMutationTime < CONFIG.PERFORMANCE.MUTATION_THROTTLE) {
                return;
            }
            this.lastMutationTime = now;

            const path = event.composedPath();

            const replyElement = path.find(el =>
                el.nodeType === 1 &&
                (el.id === 'reply' ||
                 (el.tagName === 'BUTTON' && el.textContent?.includes('回复')))
            );

            if (replyElement) {
                const commentRenderer = path.find(el =>
                    el.tagName === 'BILI-COMMENT-RENDERER' ||
                    el.tagName === 'BILI-COMMENT-REPLY-RENDERER'
                );

                const threadRenderer = path.find(el =>
                    el.tagName === 'BILI-COMMENT-THREAD-RENDERER'
                );

                if (commentRenderer && threadRenderer) {
                    const parentCommentDetails = CommentExtractor.extractDetails(commentRenderer);

                    if (parentCommentDetails) {
                        const isMainComment = commentRenderer.tagName === 'BILI-COMMENT-RENDERER';
                        const isReplyComment = commentRenderer.tagName === 'BILI-COMMENT-REPLY-RENDERER';

                        let mainCommentDetails = null;
                        if (isMainComment) {
                            mainCommentDetails = parentCommentDetails;
                        } else if (isReplyComment) {
                            const mainCommentRenderer = threadRenderer.shadowRoot?.querySelector('bili-comment-renderer#comment');
                            if (mainCommentRenderer) {
                                mainCommentDetails = CommentExtractor.extractDetails(mainCommentRenderer);
                            }
                        }

                        const contextId = generateContextId();

                        const context = {
                            id: contextId,
                            parentComment: parentCommentDetails,
                            mainComment: mainCommentDetails,
                            isReplyToMain: isMainComment,
                            isReplyToReply: isReplyComment,
                            threadRenderer: threadRenderer,
                            timestamp: Date.now()
                        };

                        replyContextMap.set(contextId, context);
                        if (replyContextMap.size > 50) {
                            const oldestKey = replyContextMap.keys().next().value;
                            if (replyContextMap.has(oldestKey)) {
                                replyContextMap.delete(oldestKey);
                            }
                        }
                        setTimeout(() => {
                            if (replyContextMap.has(contextId)) {
                                if (CONFIG.DEBUG) console.log(`[监听器管理] 清理过期上下文: ${contextId}`);
                                replyContextMap.delete(contextId);
                            }
                        }, 1800000); 

                        if (CONFIG.DEBUG) console.log(`[监听器管理] 记录回复上下文 ID: ${contextId}`);
                    }
                }
            }
        };

        document.addEventListener('click', replyHandler, true);
        this.listeners.set('reply-button', replyHandler);
        if (CONFIG.DEBUG) console.log('[监听器管理] 回复按钮监听器绑定成功');
    }

    static initSendButtonListener() {
        if (this.listeners.has('send-button')) {
            const commentsHost = getCachedElement('comments-host', 'bili-comments');
            if (commentsHost?.shadowRoot) {
                commentsHost.shadowRoot.removeEventListener('click', this.listeners.get('send-button'), true);
            }
        }

        let retryCount = 0;
        const checkAndBind = () => {
            const commentsHost = getCachedElement('comments-host', 'bili-comments');
            if (!commentsHost || !commentsHost.shadowRoot) return false;

            const sendButtonHandler = async (event) => {
                const path = event.composedPath();
                const sendButton = path.find(el =>
                    el.nodeType === 1 &&
                    el.tagName === 'BUTTON' &&
                    el.hasAttribute('data-v-risk') &&
                    el.getAttribute('data-v-risk') === 'fingerprint'
                );

                if (!sendButton) return;

                const currentTime = Date.now();

                if (currentTime - this.lastRecordTime < 500) {
                    if (CONFIG.DEBUG) console.log('[监听器管理] 防抖：忽略重复的发送按钮点击');
                    return;
                }

                this.lastRecordTime = currentTime;

                const isReplyButton = path.some(el => el.id === 'reply-container');
                let threadRenderer = null;
                if (isReplyButton) {
                    threadRenderer = path.find(el =>
                        el.nodeType === 1 &&
                        el.tagName === 'BILI-COMMENT-THREAD-RENDERER'
                    );
                }

                const commentInfo = this.getCommentTextBeforeSend(sendButton, isReplyButton, threadRenderer);
                if (!commentInfo) {
                    if (CONFIG.DEBUG) console.log('[监听器管理] 获取评论信息失败');
                    return;
                }

                const { text: commentText, isReply } = commentInfo;

                if (CONFIG.DEBUG) {
                    console.log(`[监听器管理] 检测到发送按钮点击:`, {
                        isReply,
                        commentText: commentText.substring(0, 50) + (commentText.length > 50 ? '...' : ''),
                        timestamp: new Date().toLocaleString()
                    });
                }

                const sendContext = {
                    commentText,
                    isReply,
                    threadRenderer,
                    timestamp: currentTime
                };

                setTimeout(async () => {
                    if (CONFIG.DEBUG) console.log('[监听器管理] 开始查找新评论...');

                    let commentDetails = null;

                    if (isReply) {
                        commentDetails = await this.findNewReplyComment(threadRenderer, commentText);
                        if (CONFIG.DEBUG) {
                            console.log(`[监听器管理] 回复评论查找结果:`, commentDetails ? '找到' : '未找到');
                        }
                    } else {
                        commentDetails = await this.findNewMainComment(commentText);
                        if (CONFIG.DEBUG) {
                            console.log(`[监听器管理] 主评论查找结果:`, commentDetails ? '找到' : '未找到');
                        }
                    }

                    await this.handleCommentRecord(commentDetails, commentText, isReply, sendContext);
                    DisplayManager.updateSentComments();
                }, getRandomDelay(300));

            };

            commentsHost.shadowRoot.addEventListener('click', sendButtonHandler, true);
            this.listeners.set('send-button', sendButtonHandler);
            if (CONFIG.DEBUG) console.log('[监听器管理] 发送按钮监听器绑定成功');
            retryCount = 0; 
            return true;
        };

        if (!checkAndBind()) {
            const retry = () => {
                if (!checkAndBind() && retryCount < 10) {
                    retryCount++;
                    setTimeout(retry, getRetryDelay(retryCount));
                }
            };
            setTimeout(retry, getRetryDelay(0));
        }
    }

    static initCommentClickListener() {
        if (this.listeners.has('comment-click')) {
            const commentsHost = getCachedElement('comments-host', 'bili-comments');
            if (commentsHost?.shadowRoot) {
                commentsHost.shadowRoot.removeEventListener('click', this.listeners.get('comment-click'), true);
            }
        }

        let retryCount = 0;
        const checkAndBind = () => {
            const commentsHost = getCachedElement('comments-host', 'bili-comments');
            if (!commentsHost?.shadowRoot) return false;

            const commentClickHandler = async (event) => {
                const path = event.composedPath();
                const likeButton = path.find(el => el.nodeType === 1 && el.id === 'like' && el.tagName === 'DIV');
                if (!likeButton) return;

                const clickedRenderer = path.find(el => el.nodeType === 1 && (el.tagName === 'BILI-COMMENT-RENDERER' || el.tagName === 'BILI-COMMENT-REPLY-RENDERER'));
                if (!clickedRenderer) return;

                let dataChanged = false;

                if (clickedRenderer.tagName === 'BILI-COMMENT-REPLY-RENDERER') {
                    const replyDetails = CommentExtractor.extractDetails(clickedRenderer);
                    if (!replyDetails) return;

                    const threadRenderer = path.find(el => el.nodeType === 1 && el.tagName === 'BILI-COMMENT-THREAD-RENDERER');
                    const mainCommentRenderer = threadRenderer?.shadowRoot?.querySelector('bili-comment-renderer#comment');
                    const mainCommentDetails = CommentExtractor.extractDetails(mainCommentRenderer);
                    if (!mainCommentDetails) return;

                    const mainKey = mainCommentDetails.key;
                    if (!recordedThreads.has(mainKey)) {
                        recordedThreads.set(mainKey, {
                            videoLink: mainCommentDetails.videoLink,
                            mainHTML: DisplayManager.detailsToHTML(mainCommentDetails),
                            repliesHTML: [],
                            timestamp: Date.now()
                        });
                        dataChanged = true;
                    }

                    const replyHTML = DisplayManager.detailsToHTML(replyDetails, 'recorded-reply-item');
                    const thread = recordedThreads.get(mainKey);
                    if (!thread.repliesHTML.includes(replyHTML)) {
                        thread.repliesHTML.push(replyHTML);
                        thread.timestamp = Date.now();
                        dataChanged = true;
                    }

                } else if (clickedRenderer.tagName === 'BILI-COMMENT-RENDERER') {
                    const mainCommentDetails = CommentExtractor.extractDetails(clickedRenderer);
                    if (!mainCommentDetails) return;

                    const mainKey = mainCommentDetails.key;
                    if (!recordedThreads.has(mainKey)) {
                        recordedThreads.set(mainKey, {
                            videoLink: mainCommentDetails.videoLink,
                            mainHTML: DisplayManager.detailsToHTML(mainCommentDetails),
                            repliesHTML: [],
                            timestamp: Date.now()
                        });
                        dataChanged = true;
                    }
                }

                if (dataChanged) {
                    DisplayManager.updateComments();
                    const mainKey = clickedRenderer.tagName === 'BILI-COMMENT-RENDERER'
                        ? CommentExtractor.extractDetails(clickedRenderer).key
                        : CommentExtractor.extractDetails(path.find(el => el.nodeType === 1 && el.tagName === 'BILI-COMMENT-THREAD-RENDERER').shadowRoot.querySelector('bili-comment-renderer#comment')).key;
                    await DatabaseManager.save('comments', mainKey, recordedThreads.get(mainKey));
                }
            };

            commentsHost.shadowRoot.addEventListener('click', commentClickHandler, true);
            this.listeners.set('comment-click', commentClickHandler);
            if (CONFIG.DEBUG) console.log('[监听器管理] 评论点击监听器绑定成功');
            retryCount = 0;
            return true;
        };

        if (!checkAndBind()) {
            const retry = () => {
                if (!checkAndBind() && retryCount < 10) {
                    retryCount++;
                    setTimeout(retry, getRetryDelay(retryCount));
                }
            };
            setTimeout(retry, getRetryDelay(0));
        }
    }

    static resetListeners() {
        if (CONFIG.DEBUG) console.log('[监听器管理] 重置所有监听器状态');

        this.listeners.forEach((handler, key) => {
            try {
                if (key === 'reply-button') {
                    document.removeEventListener('click', handler, true);
                } else if (key === 'send-button' || key === 'comment-click') {
                    const commentsHost = getCachedElement('comments-host', 'bili-comments');
                    if (commentsHost?.shadowRoot) {
                        commentsHost.shadowRoot.removeEventListener('click', handler, true);
                    }
                }
            } catch (error) {
                if (CONFIG.DEBUG) console.warn(`[监听器管理] 清理监听器失败: ${key}`, error);
            }
        });

        this.mutationObservers.forEach(observer => {
            try {
                observer.disconnect();
            } catch (error) {
                if (CONFIG.DEBUG) console.warn('[监听器管理] 清理MutationObserver失败', error);
            }
        });
        this.mutationObservers.clear();

        this.listeners.clear();
        this.isInitialized = false;

        this.recentComments.clear();
        this.lastRecordTime = 0;

        DanmakuListener.reset();
    }

    static initPageListener() {
        this.updateVideoInfo();

        if (this.mutationObservers.has('page-observer')) {
            const oldObserver = this.mutationObservers.get('page-observer');
            oldObserver.disconnect();
            this.mutationObservers.delete('page-observer');
        }

        let lastUrl = location.href;
        let mutationThrottle = null;

        const pageObserver = new MutationObserver(() => {
            if (mutationThrottle) return;

            mutationThrottle = setTimeout(() => {
                mutationThrottle = null;
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    if (CONFIG.DEBUG) console.log('[监听器管理] 页面URL变化，重新初始化');

                    this.updateVideoInfo();
                    clearReplyContextMap();
                    clearAllDomCache();
                    this.resetListeners();
                    setTimeout(() => {
                        this.init();
                    }, getRandomDelay(500));
                }
            }, CONFIG.PERFORMANCE.MUTATION_THROTTLE);
        });

        const observeTarget = document.querySelector('head title') || document.head;
        if (observeTarget) {
            pageObserver.observe(observeTarget, {
                subtree: false,
                childList: true,
                characterData: true
            });
            this.mutationObservers.set('page-observer', pageObserver);
        }

        // 备用,,,使用popstate事件
        const popstateHandler = () => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                this.updateVideoInfo();
                clearReplyContextMap();
                clearAllDomCache();
                this.resetListeners();
                setTimeout(() => this.init(), getRandomDelay(300));
            }
        };
        window.addEventListener('popstate', popstateHandler);
        this.listeners.set('popstate', popstateHandler);
    }

    static updateVideoInfo() {
        const bvid = window.location.pathname.match(/\/video\/(BV[\w]+)/)?.[1];
        if (bvid) {
            setCurrentVideoInfo({
                bvid: bvid,
                url: window.location.href,
                title: document.title
            });
            if (CONFIG.DEBUG) console.log(`[监听器管理] 更新视频信息: ${bvid}`);
        }
    }

    static getCommentTextBeforeSend(sendButton, isReply, threadRenderer = null) {
        try {
            if (isReply && threadRenderer) {
                const shadowRoot = threadRenderer.shadowRoot;
                if (!shadowRoot) return null;

                const replyContainer = shadowRoot.querySelector('#reply-container');
                if (!replyContainer) return null;

                const text = this.extractTextFromReplyContainer(replyContainer);
                return text ? { text, isReply: true, threadRenderer } : null;
            } else {
                const commentsHost = getCachedElement('comments-host', 'bili-comments');
                if (!commentsHost || !commentsHost.shadowRoot) return null;

                const header = commentsHost.shadowRoot.querySelector('#header');
                if (!header) return null;

                const text = this.findEditorText(header);
                return text ? { text, isReply: false, threadRenderer: null } : null;
            }
        } catch (error) {
            if (CONFIG.DEBUG) console.error('[监听器管理] 获取评论文本失败:', error);
            return null;
        }
    }

    static extractTextFromReplyContainer(replyContainer) {
        const commentBox = replyContainer.querySelector('bili-comment-box');
        if (!commentBox || !commentBox.shadowRoot) return null;

        const commentArea = commentBox.shadowRoot.querySelector('#comment-area');
        if (!commentArea) return null;

        const bodyDiv = commentArea.querySelector('#body');
        if (!bodyDiv) return null;

        const editorDiv = bodyDiv.querySelector('#editor');
        if (!editorDiv) return null;

        const richTextarea = editorDiv.querySelector('bili-comment-rich-textarea');
        if (!richTextarea || !richTextarea.shadowRoot) return null;

        const inputDiv = richTextarea.shadowRoot.querySelector('#input');
        if (!inputDiv) return null;

        const brtRoot = inputDiv.querySelector('.brt-root');
        if (!brtRoot) return null;

        const brtEditor = brtRoot.querySelector('.brt-editor');
        if (!brtEditor) return null;

        return brtEditor.textContent?.trim() || brtEditor.innerText?.trim() || '';
    }

    static findEditorText(element, depth = 0) {
        if (depth > 10) return null;

        const editor = element.querySelector('.brt-editor');
        if (editor) {
            const text = editor.textContent?.trim() || editor.innerText?.trim();
            if (text) return text;
        }

        const allElements = element.querySelectorAll('*');
        for (const el of allElements) {
            if (el.shadowRoot) {
                const text = this.findEditorText(el.shadowRoot, depth + 1);
                if (text) return text;
            }
        }
        return null;
    }

    static async findNewReplyComment(threadRenderer, expectedText, maxWaitTime = 8000) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const checkInterval = 300;

            const checkForNewReply = () => {
                try {
                    if (!threadRenderer || !threadRenderer.shadowRoot) {
                        if (Date.now() - startTime < maxWaitTime) {
                            setTimeout(checkForNewReply, checkInterval);
                        } else {
                            resolve(null);
                        }
                        return;
                    }

                    const repliesDiv = threadRenderer.shadowRoot.querySelector('#replies');
                    if (!repliesDiv) {
                        if (Date.now() - startTime < maxWaitTime) {
                            setTimeout(checkForNewReply, checkInterval);
                        } else {
                            resolve(null);
                        }
                        return;
                    }

                    const repliesRenderer = repliesDiv.querySelector('bili-comment-replies-renderer');
                    if (!repliesRenderer || !repliesRenderer.shadowRoot) {
                        if (Date.now() - startTime < maxWaitTime) {
                            setTimeout(checkForNewReply, checkInterval);
                        } else {
                            resolve(null);
                        }
                        return;
                    }

                    const expander = repliesRenderer.shadowRoot.querySelector('#expander');
                    if (!expander) {
                        if (Date.now() - startTime < maxWaitTime) {
                            setTimeout(checkForNewReply, checkInterval);
                        } else {
                            resolve(null);
                        }
                        return;
                    }

                    const expanderContents = expander.querySelector('#expander-contents');
                    if (!expanderContents) {
                        if (Date.now() - startTime < maxWaitTime) {
                            setTimeout(checkForNewReply, checkInterval);
                        } else {
                            resolve(null);
                        }
                        return;
                    }

                    const replyRenderers = expanderContents.querySelectorAll('bili-comment-reply-renderer');

                    for (let i = replyRenderers.length - 1; i >= 0; i--) {
                        const renderer = replyRenderers[i];
                        const details = CommentExtractor.extractDetails(renderer);

                        if (details) {
                            let matchedText = '';
                            if (details.text === expectedText) {
                                matchedText = details.text;
                            } else {
                                const replyMatch = details.text.match(/^回复\s+@[^:]+\s*:\s*(.+)$/);
                                if (replyMatch && replyMatch[1].trim() === expectedText) {
                                    matchedText = replyMatch[1].trim();
                                }
                            }

                            if (matchedText) {
                                resolve(details);
                                return;
                            }
                        }
                    }

                    if (Date.now() - startTime < maxWaitTime) {
                        setTimeout(checkForNewReply, checkInterval);
                    } else {
                        resolve(null);
                    }
                } catch (error) {
                    if (CONFIG.DEBUG) console.error('[监听器管理] 查找回复评论时出错:', error);
                    resolve(null);
                }
            };

            checkForNewReply();
        });
    }

    static async findNewMainComment(expectedText, maxWaitTime = 8000) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const checkInterval = 300;

            const checkForNewComment = () => {
                try {
                    const commentsHost = getCachedElement('comments-host', 'bili-comments');
                    if (!commentsHost || !commentsHost.shadowRoot) {
                        if (Date.now() - startTime < maxWaitTime) {
                            setTimeout(checkForNewComment, checkInterval);
                        } else {
                            if (CONFIG.DEBUG) console.log('[监听器管理] 超时未找到主评论');
                            resolve(null);
                        }
                        return;
                    }

                    const newDiv = commentsHost.shadowRoot.querySelector('#contents #new');
                    if (!newDiv) {
                        if (Date.now() - startTime < maxWaitTime) {
                            setTimeout(checkForNewComment, checkInterval);
                        } else {
                            if (CONFIG.DEBUG) console.log('[监听器管理] 未找到#new容器');
                            resolve(null);
                        }
                        return;
                    }

                    const threadRenderers = newDiv.querySelectorAll('bili-comment-thread-renderer');

                    for (const threadRenderer of threadRenderers) {
                        if (threadRenderer.shadowRoot) {
                            const mainRenderer = threadRenderer.shadowRoot.querySelector('bili-comment-renderer#comment');
                            if (mainRenderer) {
                                const details = CommentExtractor.extractDetails(mainRenderer);
                                if (details && details.text === expectedText) {
                                    if (CONFIG.DEBUG) console.log('[监听器管理] 找到匹配的主评论');
                                    resolve(details);
                                    return;
                                }
                            }
                        }
                    }

                    if (Date.now() - startTime < maxWaitTime) {
                        setTimeout(checkForNewComment, checkInterval);
                    } else {
                        if (CONFIG.DEBUG) console.log('[监听器管理] 未找到匹配的主评论内容');
                        resolve(null);
                    }
                } catch (error) {
                    if (CONFIG.DEBUG) console.error('[监听器管理] 查找主评论时出错:', error);
                    resolve(null);
                }
            };

            checkForNewComment();
        });
    }

    static async handleCommentRecord(commentDetails, commentText, isReply, sendContext) {
        const currentTime = new Date().toLocaleString();
        let dataToSave = null;

        if (CONFIG.DEBUG) {
            console.log(`[监听器管理] 开始处理评论记录:`, {
                isReply,
                hasCommentDetails: !!commentDetails,
                commentText: commentText.substring(0, 50) + (commentText.length > 50 ? '...' : ''),
                videoBvid: currentVideoInfo?.bvid
            });
        }

        if (isReply) {
            let pendingReplyContext = this.findBestReplyContext(commentText, sendContext);

            if (!pendingReplyContext) {
                if (CONFIG.DEBUG) console.log('[监听器管理] 警告：回复上下文匹配失败，尝试宽松匹配');
                if (CONFIG.DEBUG) console.log('[监听器管理] 上下文Map内容:', Array.from(replyContextMap.entries()));
                if (CONFIG.DEBUG) console.log('[监听器管理] 发送上下文:', sendContext);

                pendingReplyContext = this.findLooseReplyContext(commentText, sendContext);
            }

            if (pendingReplyContext) {
                if (CONFIG.DEBUG) console.log(`[监听器管理] 使用回复上下文 ID: ${pendingReplyContext.id}`);

                dataToSave = await this.processReplyWithContext(pendingReplyContext, commentDetails, commentText, currentTime);

                replyContextMap.delete(pendingReplyContext.id);

            } else {
                if (CONFIG.DEBUG) console.log('[监听器管理] 彻底找不到上下文，跳过此回复');
                if (CONFIG.DEBUG) console.log('[监听器管理] 回复内容:', commentText);
                if (CONFIG.DEBUG) console.log('[监听器管理] 评论详情:', commentDetails);

                return;
            }

        } else {
            const commentKey = this.generateMainCommentKey(commentText, currentVideoInfo?.bvid);

            if (this.isCommentAlreadyRecorded(commentKey, commentText)) {
                if (CONFIG.DEBUG) console.log('[监听器管理] 检测到重复的主评论，跳过记录');
                return;
            }

            this.recentComments.set(commentKey, {
                text: commentText,
                timestamp: Date.now(),
                bvid: currentVideoInfo?.bvid
            });

            this.cleanupRecentComments();

            const newGroup = {
                mainComment: commentDetails ? {
                    content: commentDetails.text,
                    userName: commentDetails.userName,
                    userLink: commentDetails.userLink,
                    userAvatar: commentDetails.userAvatar,
                    images: commentDetails.imageSrcs,
                    pubDate: commentDetails.pubDate,
                    likeCount: commentDetails.likeCount
                } : {
                    content: commentText,
                    userName: '获取中...',
                    userLink: '#',
                    userAvatar: '',
                    images: [],
                    pubDate: '刚刚',
                    likeCount: '0'
                },
                replies: [],
                createTime: currentTime,
                lastUpdateTime: currentTime,
                videoTitle: currentVideoInfo?.title || document.title,
                videoUrl: currentVideoInfo?.url || window.location.href,
                videoBvid: currentVideoInfo?.bvid || 'unknown'
            };

            if (CONFIG.DEBUG) {
                console.log('[监听器管理] 创建新的主评论组:', {
                    commentKey,
                    hasDetails: !!commentDetails,
                    videoTitle: newGroup.videoTitle
                });
            }

            dataToSave = newGroup;
            sentComments.unshift(newGroup);
        }

        CommentExtractor.cleanupOldComments();

        if (dataToSave) {
            try {
                await DatabaseManager.save('sent_comments', null, dataToSave).then((event) => {
                    dataToSave.id = event.target.result;
                    if (CONFIG.DEBUG) console.log(`[监听器管理] 成功保存评论记录，ID: ${dataToSave.id}`);
                });
            } catch (error) {
                if (CONFIG.DEBUG) console.error('[监听器管理] 保存评论记录失败:', error);
            }
        }
    }

    static generateMainCommentKey(commentText, bvid) {
        return `main_${bvid}_${commentText.substring(0, 100)}`;
    }

    static isCommentAlreadyRecorded(commentKey, commentText) {
        if (this.recentComments.has(commentKey)) {
            const cached = this.recentComments.get(commentKey);
            if (Date.now() - cached.timestamp < 300000) {
                return true;
            }
        }

        const existingComment = sentComments.find(group => {
            if (!group.mainComment) return false;
            return group.mainComment.content === commentText &&
                   group.videoBvid === currentVideoInfo?.bvid;
        });

        return !!existingComment;
    }

    static cleanupRecentComments() {
        const now = Date.now();
        for (const [key, data] of this.recentComments.entries()) {
            if (now - data.timestamp > 300000) { // 5分钟过期
                this.recentComments.delete(key);
            }
        }
    }

    static async processReplyWithContext(context, commentDetails, commentText, currentTime) {
        let existingGroup = null;

        if (context.mainComment) {
            existingGroup = CommentExtractor.findExistingCommentGroup(context.mainComment);
        }

        if (existingGroup) {
            if (context.isReplyToMain) {
                const replyRecord = {
                    content: commentDetails?.text || commentText,
                    type: '二级评论',
                    time: currentTime,
                    timestamp: Date.now(),
                    userName: commentDetails?.userName || '获取中...',
                    userLink: commentDetails?.userLink || '#',
                    userAvatar: commentDetails?.userAvatar || '',
                    images: commentDetails?.imageSrcs || [],
                    pubDate: commentDetails?.pubDate || '刚刚',
                    likeCount: commentDetails?.likeCount || '0',
                    thirdLevelReplies: []
                };
                existingGroup.replies.push(replyRecord);
            } else if (context.isReplyToReply && context.parentComment) {
                const existingSecondLevel = CommentExtractor.findExistingSecondLevelComment(existingGroup, context.parentComment);
                if (existingSecondLevel) {
                    if (!existingSecondLevel.thirdLevelReplies) {
                        existingSecondLevel.thirdLevelReplies = [];
                    }
                    const thirdLevelRecord = {
                        content: commentDetails?.text || commentText,
                        type: '三级评论',
                        time: currentTime,
                        timestamp: Date.now(),
                        userName: commentDetails?.userName || '获取中...',
                        userLink: commentDetails?.userLink || '#',
                        userAvatar: commentDetails?.userAvatar || '',
                        images: commentDetails?.imageSrcs || [],
                        pubDate: commentDetails?.pubDate || '刚刚',
                        likeCount: commentDetails?.likeCount || '0'
                    };
                    existingSecondLevel.thirdLevelReplies.push(thirdLevelRecord);
                } else {
                    const replyRecord = {
                        content: context.parentComment.content,
                        type: '二级评论',
                        time: currentTime,
                        timestamp: Date.now(),
                        userName: context.parentComment.userName,
                        userLink: context.parentComment.userLink,
                        userAvatar: context.parentComment.userAvatar,
                        images: context.parentComment.imageSrcs,
                        pubDate: context.parentComment.pubDate,
                        likeCount: context.parentComment.likeCount,
                        thirdLevelReplies: [{
                            content: commentDetails?.text || commentText,
                            type: '三级评论',
                            time: currentTime,
                            timestamp: Date.now(),
                            userName: commentDetails?.userName || '获取中...',
                            userLink: commentDetails?.userLink || '#',
                            userAvatar: commentDetails?.userAvatar || '',
                            images: commentDetails?.imageSrcs || [],
                            pubDate: commentDetails?.pubDate || '刚刚',
                            likeCount: commentDetails?.likeCount || '0'
                        }]
                    };
                    existingGroup.replies.push(replyRecord);
                }
            }

            existingGroup.lastUpdateTime = currentTime;
            const index = sentComments.indexOf(existingGroup);
            if (index > 0) {
                sentComments.splice(index, 1);
                sentComments.unshift(existingGroup);
            }
            await DatabaseManager.update('sent_comments', existingGroup);
            return null; 

        } else {
            const newGroup = {
                contextId: context.id,
                mainComment: context.mainComment ? {
                    content: context.mainComment.content,
                    userName: context.mainComment.userName,
                    userLink: context.mainComment.userLink,
                    userAvatar: context.mainComment.userAvatar,
                    images: context.mainComment.imageSrcs,
                    pubDate: context.mainComment.pubDate,
                    likeCount: context.mainComment.likeCount
                } : null,
                replies: [],
                createTime: currentTime,
                lastUpdateTime: currentTime,
                videoTitle: currentVideoInfo?.title || document.title,
                videoUrl: currentVideoInfo?.url || window.location.href,
                videoBvid: currentVideoInfo?.bvid || 'unknown'
            };

            if (context.isReplyToMain) {
                newGroup.replies.push({
                    content: commentDetails?.text || commentText,
                    type: '二级评论',
                    time: currentTime,
                    timestamp: Date.now(),
                    userName: commentDetails?.userName || '获取中...',
                    userLink: commentDetails?.userLink || '#',
                    userAvatar: commentDetails?.userAvatar || '',
                    images: commentDetails?.imageSrcs || [],
                    pubDate: commentDetails?.pubDate || '刚刚',
                    likeCount: commentDetails?.likeCount || '0',
                    thirdLevelReplies: []
                });
            } else if (context.isReplyToReply && context.parentComment) {
                newGroup.replies.push({
                    content: context.parentComment.content,
                    type: '二级评论',
                    time: currentTime,
                    timestamp: Date.now(),
                    userName: context.parentComment.userName,
                    userLink: context.parentComment.userLink,
                    userAvatar: context.parentComment.userAvatar,
                    images: context.parentComment.imageSrcs,
                    pubDate: context.parentComment.pubDate,
                    likeCount: context.parentComment.likeCount,
                    thirdLevelReplies: [{
                        content: commentDetails?.text || commentText,
                        type: '三级评论',
                        time: currentTime,
                        timestamp: Date.now(),
                        userName: commentDetails?.userName || '获取中...',
                        userLink: commentDetails?.userLink || '#',
                        userAvatar: commentDetails?.userAvatar || '',
                        images: commentDetails?.imageSrcs || [],
                        pubDate: commentDetails?.pubDate || '刚刚',
                        likeCount: commentDetails?.likeCount || '0'
                    }]
                });
            }

            sentComments.unshift(newGroup);
            return newGroup; 
        }
    }

    static findBestReplyContext(commentText, sendContext) {
        if (replyContextMap.size === 0) {
            return null;
        }

        let bestMatch = null;
        let bestScore = 0;

        for (const [contextId, context] of replyContextMap) {//暂时不用contextid
            let score = 0;

            const timeDiff = Math.abs(sendContext.timestamp - context.timestamp);
            if (timeDiff < 60000) { 
                score += 20;
                score += Math.max(0, 20 - timeDiff / 1000);
            }

            if (context.mainComment && context.mainComment.content) {
                const mainContent = context.mainComment.content.substring(0, 100);
                if (this.isMainCommentVisibleOnPage(mainContent)) {
                    score += 30;
                }
            }

            if (context.parentComment && context.parentComment.content) {
                const parentContent = context.parentComment.content;
                if (commentText.length > 0 && parentContent.length > 0) {
                    score += 10;
                }
            }

            if (currentVideoInfo && currentVideoInfo.bvid) {
                score += 5; 
            }

            if (score > bestScore) {
                bestScore = score;
                bestMatch = context;
            }
        }

        if (CONFIG.DEBUG) console.log(`[监听器管理] 最佳匹配分数: ${bestScore}`);
        return bestScore >= 30 ? bestMatch : null;
    }

    static isMainCommentVisibleOnPage(mainContent) {
        try {
            const commentsHost = getCachedElement('comments-host', 'bili-comments');
            if (!commentsHost?.shadowRoot) return false;

            const allComments = commentsHost.shadowRoot.querySelectorAll('bili-comment-thread-renderer');
            for (const thread of allComments) {
                const mainRenderer = thread.shadowRoot?.querySelector('bili-comment-renderer#comment');
                if (mainRenderer) {
                    const details = CommentExtractor.extractDetails(mainRenderer);
                    if (details && details.content === mainContent) {
                        return true;
                    }
                }
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    static findLooseReplyContext(commentText, sendContext) {
        if (replyContextMap.size === 1) {
            const context = Array.from(replyContextMap.values())[0];
            const timeDiff = Math.abs(sendContext.timestamp - context.timestamp);
            if (timeDiff < 120000) { 
                if (CONFIG.DEBUG) console.log('[监听器管理] 使用宽松匹配（唯一上下文）');
                return context;
            }
        }
        return null;
    }
}

    // ======================================数据迁移模块===================================================

class DataMigration {
    static async migrateFromLocalStorage() {
        const oldData = localStorage.getItem('bilibili_recorded_comments_v11');
        if (oldData) {
            try {
                const dataArray = JSON.parse(oldData);
                for (const [key, value] of dataArray) {
                    await DatabaseManager.save('comments', key, {
                        ...value,
                        repliesHTML: Array.from(value.repliesHTML || [])
                    });
                }
                localStorage.removeItem('bilibili_recorded_comments_v11');
                console.log('成功迁移旧数据到 IndexedDB');
            } catch (e) {
                console.error('迁移数据失败:', e);
            }
        }
    }
}

    // =========================================ui管理模块==========================================================

class UIManager {
    static create() {
        if (document.getElementById('collector-float-btn')) return;

        const html = `
            <div id="collector-float-btn">
                <span class="float-btn-icon">▲</span>
            </div>
            <div id="collector-panel" style="display: none;">
                <div class="panel-header">
                    <span>B站收藏夹</span>
                    <span class="panel-close-btn">×</span>
                </div>
                <div class="panel-content">
                    <div class="panel-tabs">
                        <button class="tab-btn active" data-tab="sent-comments">评论记录</button>
                        <button class="tab-btn" data-tab="comments">评论收藏</button>
                        <button class="tab-btn" data-tab="danmaku">弹幕记录</button>
                        <button class="tab-btn" data-tab="settings">设置</button>
                    </div>
                    <div class="tab-content" id="sent-comments-tab">
                        <div class="stats-bar">
                            <span id="sent-comment-count">发送记录: 0</span>
                            <button class="btn export" id="export-sent-btn">导出</button>
                            <button class="btn danger" id="clear-sent-btn">清空</button>
                        </div>
                        <div class="search-pagination-container">
                            <div class="search-container">
                                <input type="text" class="search-input" id="sent-comments-search" placeholder="搜索评论内容、用户名或视频标题...">
                            </div>
                            <div class="pagination-container">
                                <div class="pagination-info" id="sent-comments-pagination-info">显示 0 条记录</div>
                                <div class="pagination-controls" id="sent-comments-pagination-controls"></div>
                                <div class="page-size-selector">
                                    <label>每页:</label>
                                    <select class="page-size-select" id="sent-comments-page-size">
                                        <option value="5">5条</option>
                                        <option value="10" selected>10条</option>
                                        <option value="20">20条</option>
                                        <option value="50">50条</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div id="sent-comments-output">正在加载...</div>
                    </div>
                    <div class="tab-content" id="comments-tab" style="display:none;">
                        <div class="stats-bar">
                            <span id="comment-count">评论: 0</span>
                            <button class="btn danger" id="clear-comments-btn">清空</button>
                        </div>
                        <div class="search-pagination-container">
                            <div class="search-container">
                                <input type="text" class="search-input" id="comments-search" placeholder="搜索评论内容或用户名...">
                            </div>
                            <div class="pagination-container">
                                <div class="pagination-info" id="comments-pagination-info">显示 0 条记录</div>
                                <div class="pagination-controls" id="comments-pagination-controls"></div>
                                <div class="page-size-selector">
                                    <label>每页:</label>
                                    <select class="page-size-select" id="comments-page-size">
                                        <option value="5">5条</option>
                                        <option value="10" selected>10条</option>
                                        <option value="20">20条</option>
                                        <option value="50">50条</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div id="recorded-comments-output">正在加载...</div>
                    </div>
                    <div class="tab-content" id="danmaku-tab" style="display:none;">
                        <div class="stats-bar">
                            <span id="danmaku-count">弹幕: 0</span>
                            <button class="btn danger" id="clear-danmaku-btn">清空</button>
                        </div>
                        <div class="search-pagination-container">
                            <div class="search-container">
                                <input type="text" class="search-input" id="danmaku-search" placeholder="搜索弹幕内容或视频标题...">
                            </div>
                            <div class="pagination-container">
                                <div class="pagination-info" id="danmaku-pagination-info">显示 0 条记录</div>
                                <div class="pagination-controls" id="danmaku-pagination-controls"></div>
                                <div class="page-size-selector">
                                    <label>每页:</label>
                                    <select class="page-size-select" id="danmaku-page-size">
                                        <option value="5">5条</option>
                                        <option value="10" selected>10条</option>
                                        <option value="20">20条</option>
                                        <option value="50">50条</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div id="recorded-danmaku-output">正在加载...</div>
                    </div>
                    <div class="tab-content" id="settings-tab" style="display:none;">
                        <div class="settings-section">
                            <h4>显示设置</h4>
                            <div class="setting-item">
                                <label>评论记录保存数量:</label>
                                <input type="number" id="max-sent-input" min="1" max="500">
                                <span>组</span>
                            </div>
                            <div class="setting-item">
                                <label>评论收藏显示数量:</label>
                                <input type="number" id="max-comments-input" min="1" max="200">
                                <span>条</span>
                            </div>
                            <div class="setting-item">
                                <label>弹幕显示数量:</label>
                                <input type="number" id="max-danmaku-input" min="1" max="200">
                                <span>条</span>
                            </div>
                            <div class="setting-item">
                                <button id="save-settings-btn">保存设置</button>
                            </div>
                            <h4>数据管理</h4>
                            <div class="setting-item">
                                <button id="export-all-btn">导出所有数据</button>
                                <button id="import-data-btn">导入数据</button>
                                <input type="file" id="import-file" accept=".json" style="display:none;">
                            </div>
                            <div class="setting-item" style="display">
                                <button class="danger" id="clear-all-btn">清空所有数据</button>
                            </div>
                            </div>
                            <div class="setting-item">
                                <div id="storage-info">计算存储中...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', html);
        this.addStyles();
        this.bindEvents();
        this.initFloatButton();
    }

    static addStyles() {
        GM_addStyle(STYLES);
    }

    static bindEvents() {
        const panel = document.getElementById('collector-panel');

        panel.querySelector('.panel-close-btn').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        document.addEventListener('click', (e) => {
            const floatBtn = document.getElementById('collector-float-btn');
            if (!panel.contains(e.target) && !floatBtn.contains(e.target) && panel.style.display !== 'none') {
                panel.style.display = 'none';
            }
        });

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.style.display = 'none';
                });
                document.getElementById(`${btn.dataset.tab}-tab`).style.display = 'block';

                if (btn.dataset.tab === 'settings') {
                    this.updateSettingsDisplay();
                }
            });
        });

        this.bindDelegatedEvents();
        this.bindButtonEvents();
        this.bindSearchAndPagination();
    }

    static bindDelegatedEvents() {
        document.addEventListener('click', (e) => {

            if (e.target.classList.contains('comment-image')) {
                e.stopPropagation();
                window.open(e.target.src, '_blank');
            }

            if (e.target.classList.contains('delete-btn')) {
                e.stopPropagation();
                this.handleDeleteClick(e.target);
            }
        });

        document.addEventListener('dblclick', (e) => {
            const historyItem = e.target.closest('.history-item');
            const threadContainer = e.target.closest('.thread-container');

            if (historyItem && !e.target.closest('.delete-btn') && !e.target.closest('a')) {
                const videoUrl = historyItem.dataset.videoUrl;
                if (videoUrl) window.open(videoUrl, '_blank');
            }

            if (threadContainer && !e.target.closest('.delete-btn') && !e.target.closest('a')) {
                const videoUrl = threadContainer.dataset.videoUrl;
                if (videoUrl) window.open(videoUrl, '_blank');
            }
        });
    }

    static bindButtonEvents() {
        document.getElementById('save-settings-btn').addEventListener('click', () => {
            const newSentLimit = parseInt(document.getElementById('max-sent-input').value);
            const newCommentsLimit = parseInt(document.getElementById('max-comments-input').value);
            const newDanmakuLimit = parseInt(document.getElementById('max-danmaku-input').value);

            if (newSentLimit > 0 && newSentLimit <= 500) settings.SENT_COMMENTS = newSentLimit;
            if (newCommentsLimit > 0 && newCommentsLimit <= 200) settings.DISPLAY_COMMENTS = newCommentsLimit;
            if (newDanmakuLimit > 0 && newDanmakuLimit <= 200) settings.DISPLAY_DANMAKU = newDanmakuLimit;

            SettingsManager.save();
            DisplayManager.updateAll();
            alert('设置已保存！');
        });

        document.getElementById('export-all-btn').addEventListener('click', () => DataManager.exportAll());
        document.getElementById('export-sent-btn').addEventListener('click', () => DataManager.exportSentComments());

        const importBtn = document.getElementById('import-data-btn');
        const importFile = document.getElementById('import-file');
        importBtn.addEventListener('click', () => importFile.click());
        importFile.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                await DataManager.import(file);
                e.target.value = '';
            }
        });

        this.bindClearButtons();
    }

    static bindSearchAndPagination() {
     
        ['sent-comments', 'comments', 'danmaku'].forEach(type => {
            const searchInput = document.getElementById(`${type}-search`);
            const pageSizeSelect = document.getElementById(`${type}-page-size`);

            if (searchInput) {
                let searchTimeout;
                searchInput.addEventListener('input', (e) => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        paginationState[type === 'sent-comments' ? 'sentComments' : type].searchTerm = e.target.value;
                        paginationState[type === 'sent-comments' ? 'sentComments' : type].currentPage = 1;
                        this.updateTabContent(type);
                    }, 300);
                });
            }

            if (pageSizeSelect) {
                pageSizeSelect.addEventListener('change', (e) => {
                    const stateKey = type === 'sent-comments' ? 'sentComments' : type;
                    paginationState[stateKey].currentPage = 1;
                    this.updateTabContent(type);
                });
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('pagination-btn') && !e.target.classList.contains('disabled')) {
                const type = e.target.dataset.type;
                const action = e.target.dataset.action;
                const page = parseInt(e.target.dataset.page);

                if (type && paginationState[type]) {
                    if (action === 'prev') {
                        paginationState[type].currentPage = Math.max(1, paginationState[type].currentPage - 1);
                    } else if (action === 'next') {
                        const maxPage = Math.ceil(paginationState[type].filteredData.length / this.getPageSize(type));
                        paginationState[type].currentPage = Math.min(maxPage, paginationState[type].currentPage + 1);
                    } else if (page) {
                        paginationState[type].currentPage = page;
                    }

                    const tabType = type === 'sentComments' ? 'sent-comments' : type;
                    this.updateTabContent(tabType);
                }
            }
        });
    }

    static getPageSize(type) {
        const select = document.getElementById(`${type === 'sentComments' ? 'sent-comments' : type}-page-size`);
        return select ? parseInt(select.value) : CONFIG.PAGINATION.PAGE_SIZE;
    }

    static updateTabContent(type) {
        if (type === 'sent-comments') {
            DisplayManager.updateSentComments();
        } else if (type === 'comments') {
            DisplayManager.updateComments();
        } else if (type === 'danmaku') {
            DisplayManager.updateDanmaku();
        }
    }

    static bindClearButtons() {
        document.getElementById('clear-sent-btn').addEventListener('click', async () => {
            if (confirm('确定要清空所有评论记录吗？')) {
                await DatabaseManager.clear(CONFIG.STORES.SENT_COMMENTS);
                sentComments.length = 0;
                resetPaginationState('sentComments');
                DisplayManager.updateSentComments();
            }
        });

        document.getElementById('clear-comments-btn').addEventListener('click', async () => {
            if (confirm('确定要清空所有评论收藏吗？')) {
                await DatabaseManager.clear(CONFIG.STORES.COMMENTS);
                recordedThreads.clear();
                resetPaginationState('comments');
                DisplayManager.updateComments();
            }
        });

        document.getElementById('clear-danmaku-btn').addEventListener('click', async () => {
            if (confirm('确定要清空所有弹幕记录吗？')) {
                await DatabaseManager.clear(CONFIG.STORES.DANMAKU);
                recordedDanmaku.length = 0;
                resetPaginationState('danmaku');
                DisplayManager.updateDanmaku();
            }
        });

        document.getElementById('clear-all-btn').addEventListener('click', async () => {
            if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
                await Promise.all([
                    DatabaseManager.clear(CONFIG.STORES.COMMENTS),
                    DatabaseManager.clear(CONFIG.STORES.DANMAKU),
                    DatabaseManager.clear(CONFIG.STORES.SENT_COMMENTS)
                ]);
                recordedThreads.clear();
                recordedDanmaku.length = 0;
                sentComments.length = 0;
                replyContextMap.clear();
                resetPaginationState(); 
                DisplayManager.updateAll();
            }
        });
    }

    static async handleDeleteClick(button) {
        const type = button.dataset.type;
        const key = button.dataset.key || parseInt(button.dataset.id);

        let confirmMsg = '';
        if (type === 'comment') confirmMsg = '确定要删除这条评论收藏吗？';
        else if (type === 'danmaku') confirmMsg = '确定要删除这条弹幕记录吗？';
        else if (type === 'sent') confirmMsg = '确定要删除这组评论记录吗？';

        if (confirm(confirmMsg)) {
            let store = '';
            if (type === 'comment') store = CONFIG.STORES.COMMENTS;
            else if (type === 'danmaku') store = CONFIG.STORES.DANMAKU;
            else if (type === 'sent') store = CONFIG.STORES.SENT_COMMENTS;

            await DatabaseManager.delete(store, key);

            if (type === 'comment') {
                recordedThreads.delete(key);
                DisplayManager.updateComments();
            } else if (type === 'danmaku') {
                const index = recordedDanmaku.findIndex(d => d.id === key);
                if (index !== -1) recordedDanmaku.splice(index, 1);
                DisplayManager.updateDanmaku();
            } else if (type === 'sent') {
                const index = sentComments.findIndex(c => c.id === key);
                if (index !== -1) sentComments.splice(index, 1);
                DisplayManager.updateSentComments();
            }
        }
    }

    static initFloatButton() {
        const floatBtn = document.getElementById('collector-float-btn');
        let isDragging = false;
        let startX, startY, initialX, initialY, dragStartTime;

        function dragStart(e) {
            dragStartTime = Date.now();
            isDragging = true;
            floatBtn.classList.add('dragging');

            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            startX = clientX;
            startY = clientY;

            const rect = floatBtn.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            e.preventDefault();
        }

        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();

            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            const deltaX = clientX - startX;
            const deltaY = clientY - startY;
            const newX = Math.max(0, Math.min(initialX + deltaX, window.innerWidth - 60));
            const newY = Math.max(0, Math.min(initialY + deltaY, window.innerHeight - 60));

            floatBtn.style.left = newX + 'px';
            floatBtn.style.top = newY + 'px';
            floatBtn.style.right = 'auto';
            floatBtn.style.bottom = 'auto';
        }

        function dragEnd() {
            if (!isDragging) return;
            isDragging = false;
            floatBtn.classList.remove('dragging');

            if (Date.now() - dragStartTime < 200) {
                const panel = document.getElementById('collector-panel');
                const isVisible = panel.style.display !== 'none';
                panel.style.display = isVisible ? 'none' : 'block';
                const icon = floatBtn.querySelector('.float-btn-icon');
                icon.textContent = isVisible ? '▲' : '▼';
                if (!isVisible) {
                    DisplayManager.updateAll();
                }
            }

            const rect = floatBtn.getBoundingClientRect();
            SettingsManager.savePosition({ left: rect.left, top: rect.top });
        }

        ['mousedown', 'touchstart'].forEach(event => floatBtn.addEventListener(event, dragStart));
        ['mousemove', 'touchmove'].forEach(event => document.addEventListener(event, drag));
        ['mouseup', 'touchend'].forEach(event => document.addEventListener(event, dragEnd));

        const position = SettingsManager.loadPosition();
        if (position) {
            const x = Math.max(0, Math.min(position.left, window.innerWidth - 60));
            const y = Math.max(0, Math.min(position.top, window.innerHeight - 60));
            floatBtn.style.left = x + 'px';
            floatBtn.style.top = y + 'px';
            floatBtn.style.right = 'auto';
            floatBtn.style.bottom = 'auto';
        }
    }

    static updateSettingsDisplay() {
        document.getElementById('max-sent-input').value = settings.SENT_COMMENTS;
        document.getElementById('max-comments-input').value = settings.DISPLAY_COMMENTS;
        document.getElementById('max-danmaku-input').value = settings.DISPLAY_DANMAKU;
        this.updateCurrentDisplayCounts();
        this.updateStorageInfo();
    }

    static updateCurrentDisplayCounts() {
        const commentsElement = document.getElementById('current-comments-display');
        const danmakuElement = document.getElementById('current-danmaku-display');

        if (commentsElement) {
            const actualCommentsCount = Math.min(recordedThreads.size, settings.DISPLAY_COMMENTS);
            commentsElement.textContent = actualCommentsCount;
        }

        if (danmakuElement) {
            const actualDanmakuCount = Math.min(recordedDanmaku.length, settings.DISPLAY_DANMAKU);
            danmakuElement.textContent = actualDanmakuCount;
        }
    }

    static async updateStorageInfo() {
        try {
            if (navigator.storage && navigator.storage.estimate) {
                const estimate = await navigator.storage.estimate();
                const usage = (estimate.usage / 1024 / 1024).toFixed(2);
                const quota = (estimate.quota / 1024 / 1024).toFixed(2);
                const percentage = ((estimate.usage / estimate.quota) * 100).toFixed(1);
                document.getElementById('storage-info').innerHTML = `已用: ${usage}MB / ${quota}MB (${percentage}%)`;
            } else {
                document.getElementById('storage-info').textContent = '浏览器不支持存储估算';
            }
        } catch (e) {
            document.getElementById('storage-info').textContent = '无法获取存储信息';
        }
    }
}

    // ======================================主程序入口=============================================

async function init() {
    try {
        console.log('开始初始化 B站收藏夹');

        SettingsManager.load();

        const database = await DatabaseManager.init();
        window.biliBiliDB = database; 
        setDB(database);

        await DataMigration.migrateFromLocalStorage();

        UIManager.create();

        await DatabaseManager.loadAll();

        resetPaginationState();

        DisplayManager.updateAll();

        ListenerManager.init();

        console.log('B站收藏夹已成功加载');
    } catch (error) {
        console.error('初始化失败:', error);
    }
}

// 启动脚本
init();

})();
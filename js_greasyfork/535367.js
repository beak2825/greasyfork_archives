// ==UserScript==
// @name               AV在线视频站点跳转Javdb
// @name:zh-CN         AV在线视频站点跳转Javdb
// @name:zh-TW         AV影片網站跳轉至Javdb
// @name:en            Javdb Redirection for AV Sites
// @name:ja            AV動画サイト Javdbジャンプ
// @icon               https://missav.ws/img/favicon.png
// @version            2.4.1
// @description        为支持站点的标题番号增加跳转功能，可在标题前显示JavDB观看状态与评分并直接修改；为Missav播放器页添加视频版本跳转按钮。各功能可独立开关。
// @description:zh-CN  为支持站点的标题番号增加跳转功能，可在标题前显示JavDB观看状态与评分并直接修改；为Missav播放器页添加视频版本跳转按钮。各功能可独立开关。
// @description:zh-TW  為支援的網站的標題番號增加點擊功能，使其可跳轉至影片對應的 JavDB 頁面；可在標題前顯示該影片在JavDB的觀看狀態和評分並直接修改；並為Missav播放器頁添加影片版本跳轉按鈕。各功能可獨立開關。
// @description:en     Adds redirection for video IDs on supported sites, displays and allows editing of JavDB watch status/rating in the title, and adds version jump buttons to Missav player pages. Features are individually toggleable.
// @description:ja     対応サイトのタイトルにある品番にクリック機能を追加し、JavDBページへジャンプできるようにします。JavDBでの視聴ステータスと評価をタイトル前に表示・編集でき、Missavプレーヤーページに動画バージョン切り替えボタンを追加します。各機能は個別に切り替え可能です。
// @author             Gemini, Claude, AI Assistant
// @license            MIT
// @match              *://missav.*/*
// @match              *://*.123av.*/*
// @match              *://*.1av.to/*
// @match              *://jable.tv/videos/*
// @match              *://www.av.gl/*
// @connect            javdb*.com
// @connect            javdb.com
// @grant              GM_openInTab
// @grant              GM_xmlhttpRequest
// @grant              GM_addStyle
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_registerMenuCommand
// @run-at             document-end
// @namespace          https://sleazyfork.org/zh-CN/scripts/535367-av在线视频站点跳转javdb
// @supportURL         https://sleazyfork.org/zh-CN/scripts/535367-av在线视频站点跳转javdb/feedback
// @downloadURL https://update.greasyfork.org/scripts/535367/AV%E5%9C%A8%E7%BA%BF%E8%A7%86%E9%A2%91%E7%AB%99%E7%82%B9%E8%B7%B3%E8%BD%ACJavdb.user.js
// @updateURL https://update.greasyfork.org/scripts/535367/AV%E5%9C%A8%E7%BA%BF%E8%A7%86%E9%A2%91%E7%AB%99%E7%82%B9%E8%B7%B3%E8%BD%ACJavdb.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 防止脚本重复执行
    if (window.javdbEnhancerLoaded) {
        return;
    }
    window.javdbEnhancerLoaded = true;

    // --- [OPTIMIZED] 全局常量，避免魔术字符串 ---
    const CONSTANTS = {
        SCRIPT_NAME: '番号助手',
        DEBUG_MODE: false,
        SETTINGS_KEY: 'JavdbHelper_Settings',
        CACHE_TTL: 10 * 60 * 1000, // 缓存有效期：10分钟
        CSS: {
            LOADING_TAG: 'javdb-loading-tag',
            ERROR_TAG: 'javdb-error-tag',
            LOGIN_TAG: 'javdb-login-tag',
            VIP_TAG: 'javdb-vip-tag',
            ADD_TAG: 'javdb-add-tag',
            REFRESH_TAG: 'javdb-refresh-tag',
            STATUS_TAG: 'javdb-status-tag',
        },
        STATUS: {
            WATCHED: 'watched',
            WANTED: 'wanted',
            UNMARKED: 'unmarked',
            NOT_LOGGED_IN: 'not-logged-in',
            DELETE: 'delete',
        },
        ERROR_TYPE: {
            VIP_REQUIRED: 'vipRequired',
            NOT_FOUND: 'notFound',
            STATUS_FETCH: 'statusFetch',
            LINK_FETCH: 'linkFetch',
        }
    };

    // --- 内存缓存类 ---
    class MemoryCache {
        constructor(ttl) {
            this.ttl = ttl;
            this.cache = new Map();
        }
        get(key) {
            const item = this.cache.get(key);
            if (!item) return null;
            if (Date.now() - item.timestamp > this.ttl) {
                this.cache.delete(key);
                return null;
            }
            return item.value;
        }
        set(key, value) {
            this.cache.set(key, {
                value,
                timestamp: Date.now()
            });
        }
        delete(key) {
            this.cache.delete(key);
        }
        clear() {
            this.cache.clear();
        }
    }

    // --- 持久化会话缓存类 (使用 sessionStorage) ---
    class PersistentCache {
        constructor(ttl, prefix) {
            this.ttl = ttl;
            this.prefix = `JavdbHelperCache_${prefix}_`;
        }
        _getFullKey(key) {
            return this.prefix + key;
        }
        get(key) {
            const fullKey = this._getFullKey(key);
            const rawItem = sessionStorage.getItem(fullKey);
            if (!rawItem) return null;

            try {
                const item = JSON.parse(rawItem);
                if (Date.now() - item.timestamp > this.ttl) {
                    sessionStorage.removeItem(fullKey);
                    return null;
                }
                return item.value;
            } catch (e) {
                sessionStorage.removeItem(fullKey);
                return null;
            }
        }
        set(key, value) {
            const fullKey = this._getFullKey(key);
            const item = {
                value,
                timestamp: Date.now()
            };
            try {
                sessionStorage.setItem(fullKey, JSON.stringify(item));
            } catch (e) {
                Utils.handleError(e, 'PersistentCache.set');
                this.clearExpired();
                try {
                    sessionStorage.setItem(fullKey, JSON.stringify(item));
                } catch (e2) {
                     Utils.handleError(e2, 'PersistentCache.set (retry)');
                }
            }
        }
        delete(key) {
            sessionStorage.removeItem(this._getFullKey(key));
        }
        clear() {
            for (let i = sessionStorage.length - 1; i >= 0; i--) {
                const key = sessionStorage.key(i);
                if (key && key.startsWith(this.prefix)) {
                    sessionStorage.removeItem(key);
                }
            }
        }
        clearExpired() {
            for (let i = sessionStorage.length - 1; i >= 0; i--) {
                const key = sessionStorage.key(i);
                if (key && key.startsWith(this.prefix)) {
                    this.get(key.substring(this.prefix.length));
                }
            }
        }
    }

    // --- 全局状态管理模块 (AppState) ---
    const AppState = {
        settings: {
            showJavdbStatus: true,
            showMissAvVersions: true,
            javdbDomain: 'javdb.com'
        },
        session: {
            authenticityToken: null,
            isLoggedIn: false,
            initialLoginCheckDone: false
        },
        cache: {
            fanhao: new PersistentCache(CONSTANTS.CACHE_TTL, 'fanhao'),
            status: new MemoryCache(CONSTANTS.CACHE_TTL),
            missav: new PersistentCache(CONSTANTS.CACHE_TTL * 6, 'missav')
        },
        loadSettings() {
            const savedSettings = GM_getValue(CONSTANTS.SETTINGS_KEY, {});
            this.settings = { ...this.settings,
                ...savedSettings
            };
        },
        saveSettings() {
            GM_setValue(CONSTANTS.SETTINGS_KEY, this.settings);
        },
        clearSessionAndCache() {
            this.session.authenticityToken = null;
            this.session.isLoggedIn = false;
            this.session.initialLoginCheckDone = false;
            this.cache.fanhao.clear();
            this.cache.status.clear();
            this.cache.missav.clear();
        }
    };

    // --- 通用工具模块 (Utils) ---
    const Utils = {
        logDebug(message, ...optionalParams) {
            if (CONSTANTS.DEBUG_MODE) {
                const version = (typeof GM_info !== 'undefined' && GM_info.script) ? GM_info.script.version : 'N/A';
                console.log(`[${CONSTANTS.SCRIPT_NAME} v${version}] ${message}`, ...optionalParams);
            }
        },
        handleError(error, context = '未知') {
            console.error(`[${CONSTANTS.SCRIPT_NAME}] 在 "${context}" 中发生错误:`, error);
        },
        getLanguage() {
            const lang = document.documentElement.lang.toLowerCase();
            if (lang.startsWith('zh-cn')) return 'zh-CN';
            if (lang.startsWith('zh')) return 'zh-TW';
            if (lang.startsWith('ja')) return 'ja';
            if (lang.startsWith('en')) return 'en';
            return 'zh-TW';
        },
        normalizeString: (str) => str ? str.normalize('NFKC').toLowerCase().replace(/[\u200B-\u200F\uFEFF]/g, '').replace(/[!！?？~～☆★♪♡♥【】「」『』《》.,'"‘’“”\(\){}\[\];:]/g, '').replace(/\s+/g, ' ').trim() : '',
        gmFetch(url, options = {}) {
            const defaultHeaders = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "Referer": options.overrideReferer || `https://${AppState.settings.javdbDomain}/`
            };
            if (options.method === 'POST') {
                defaultHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
            }
            const finalHeaders = { ...defaultHeaders,
                ...options.headers
            };
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: options.method || "GET",
                    url: url,
                    headers: finalHeaders,
                    data: options.data,
                    timeout: 15000,
                    onload: resolve,
                    onerror: reject,
                    ontimeout: reject
                });
            });
        },
        parseFanhao(originalText) {
            const FANHAO_REGEX_PATTERN = /[a-zA-Z]{2,}-\d{2,}/;
            const FC2_REGEX_PATTERN = /(FC2-PPV-)(\d{6,})/i;
            const NUMERIC_REGEX_PATTERN = /\b(\d{6,}[-_]?\d{1,3})\b/;
            let match, baseId, fullId, titleForComparison;
            if ((match = originalText.match(FC2_REGEX_PATTERN))) {
                fullId = match[0];
                baseId = `FC2-${match[2]}`;
            } else if ((match = originalText.match(FANHAO_REGEX_PATTERN))) {
                fullId = match[0];
                baseId = match[0];
            } else if ((match = originalText.match(NUMERIC_REGEX_PATTERN))) {
                baseId = match[1];
                const prefixMatch = originalText.substring(0, match.index).match(/([a-zA-Z0-9]+)\s*$/);
                const prefix = prefixMatch ? prefixMatch[1] : '';
                fullId = prefix ? `${prefix} ${baseId}` : baseId;
            } else {
                return null;
            }
            const titleStartIndex = originalText.indexOf(fullId) + fullId.length;
            titleForComparison = originalText.substring(titleStartIndex).trim();
            return {
                baseId: baseId.toUpperCase(),
                fullId,
                titleForComparison
            };
        },
        debounce(func, wait) {
            let timeout;
            return function(...args) {
                const context = this;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), wait);
            };
        }
    };

    // --- 多语言文本配置 ---
    const uiStrings = {
        'zh-CN': {
            settingsTitle: '番号助手设置',
            notAvailable: '此版本不可用',
            markWanted: '标记为想看',
            markWatched: '标记为已看',
            modifyRating: '修改评分',
            deleteTag: '删除标记',
            enableStatus: '启用 JavDB 观看状态显示',
            enableMissAV: '启用 MissAV 影片版本切换',
            linkFetchError: '详情页链接获取失败，请点击刷新',
            javdbNotFound: 'JavDB 未收录此影片',
            statusFetchError: '状态信息获取失败，请点击刷新',
            loginTooltip: '当前Javdb域名未登录，请点击交互',
            statusWatched: '已看',
            statusWanted: '想看',
            javdbDomainLabel: 'JavDB 域名',
            operationFailed: '操作失败，请检查与Javdb的连接情况',
            goToLogin: '跳转 JavDB 登录',
            popupLogin: '当前页弹窗登录',
            setDomain: '设置登录域名',
            refreshStatus: '刷新链接和状态',
            clearCache: '清除脚本缓存',
            cacheCleared: '缓存已清除',
            processing: '处理中...',
            publicRatingTooltip: 'JavDB 大众评分',
            publicRatingTooltipFull: 'JavDB 大众评分: {score}分, 由 {count} 人评价',
            vipTag: '[VIP]',
            vipRequiredTooltip: '此影片需要JavDB VIP权限',
            enableVip: '开启 VIP 权限',
            switchAccount: '切换 JavDB 账号',
            confirm: '确定',
            searchTooltip: 'JavDB 未找到精确匹配，将跳转至搜索页'
        },
        'zh-TW': {
            settingsTitle: '番號助手設定',
            notAvailable: '此版本不可用',
            markWanted: '標記為想看',
            markWatched: '標記為已看',
            modifyRating: '修改評分',
            deleteTag: '刪除標記',
            enableStatus: '啟用 JavDB 觀看狀態顯示',
            enableMissAV: '啟用 MissAV 影片版本切換',
            linkFetchError: '詳情頁鏈接獲取失敗，請點擊刷新',
            javdbNotFound: 'JavDB 未收錄此影片',
            statusFetchError: '狀態信息獲取失敗，請點擊刷新',
            loginTooltip: '當前Javdb域名未登錄，請點擊交互',
            statusWatched: '已看',
            statusWanted: '想看',
            javdbDomainLabel: 'JavDB 域名',
            operationFailed: '操作失敗，請檢查與Javdb的連接情況',
            goToLogin: '跳轉 JavDB 登錄',
            popupLogin: '當前頁彈窗登錄',
            setDomain: '設置登錄域名',
            refreshStatus: '刷新鏈接和狀態',
            clearCache: '清除腳本緩存',
            cacheCleared: '緩存已清除',
            processing: '處理中...',
            publicRatingTooltip: 'JavDB 大眾評分',
            publicRatingTooltipFull: 'JavDB 大眾評分: {score}分, 由 {count} 人評價',
            vipTag: '[VIP]',
            vipRequiredTooltip: '此影片需要JavDB VIP權限',
            enableVip: '開啟 VIP 權限',
            switchAccount: '切換 JavDB 帳號',
            confirm: '確定',
            searchTooltip: 'JavDB 未找到精確匹配，將跳轉至搜索頁'
        },
        'en': {
            settingsTitle: 'Fanhao Helper Settings',
            notAvailable: 'This version is not available',
            markWanted: 'Mark as Want',
            markWatched: 'Mark as Watched',
            modifyRating: 'Modify Rating',
            deleteTag: 'Delete Tag',
            enableStatus: 'Enable JavDB Watch Status',
            enableMissAV: 'Enable MissAV Version Switcher',
            linkFetchError: 'Failed to fetch details link, click to refresh',
            javdbNotFound: 'This video is not on JavDB',
            statusFetchError: 'Failed to fetch status, click to refresh',
            loginTooltip: 'Not logged in to current Javdb domain, click to interact',
            statusWatched: 'Watched',
            statusWanted: 'Want',
            javdbDomainLabel: 'JavDB Domain',
            operationFailed: 'Operation failed, please check connection to Javdb',
            goToLogin: 'Go to JavDB Login',
            popupLogin: 'Popup Login',
            setDomain: 'Set Login Domain',
            refreshStatus: 'Refresh link and status',
            clearCache: 'Clear Script Cache',
            cacheCleared: 'Cache Cleared',
            processing: 'Processing...',
            publicRatingTooltip: 'JavDB Public Rating',
            publicRatingTooltipFull: 'JavDB Public Rating: {score}, rated by {count} users',
            vipTag: '[VIP]',
            vipRequiredTooltip: 'This video requires JavDB VIP permission',
            enableVip: 'Enable VIP Access',
            switchAccount: 'Switch JavDB Account',
            confirm: 'Confirm',
            searchTooltip: 'No exact match found on JavDB, redirecting to search page'
        },
        'ja': {
            settingsTitle: '品番アシスタント設定',
            notAvailable: 'このバージョンは利用できません',
            markWanted: '見たい',
            markWatched: '見た',
            modifyRating: '評価を変更',
            deleteTag: 'タグを削除',
            enableStatus: 'JavDB視聴ステータスを有効にする',
            enableMissAV: 'MissAVバージョン切り替えを有効にする',
            linkFetchError: '詳細ページのリンク取得に失敗しました、クリックして再試行してください',
            javdbNotFound: 'このビデオはJavDBにありません',
            statusFetchError: 'ステータスの取得に失敗しました、クリックして再試行してください',
            loginTooltip: '現在のJavdbドメインにログインしていません、クリックして操作してください',
            statusWatched: '見た',
            statusWanted: '見たい',
            javdbDomainLabel: 'JavDB ドメイン',
            operationFailed: '操作に失敗しました、Javdbとの接続を確認してください',
            goToLogin: 'JavDB ログインへ移動',
            popupLogin: 'ポップアップログイン',
            setDomain: 'ログイン済みドメインを設定',
            refreshStatus: 'リンクとステータスを更新',
            clearCache: 'スクリプトキャッシュをクリア',
            cacheCleared: 'キャッシュをクリアしました',
            processing: '処理中...',
            publicRatingTooltip: 'JavDB 公開評価',
            publicRatingTooltipFull: 'JavDB 公開評価: {score}点, {count}人による評価',
            vipTag: '[VIP]',
            vipRequiredTooltip: 'このビデオにはJavDBのVIP権限が必要です',
            enableVip: 'VIPアクセスを有効にする',
            switchAccount: 'JavDBアカウントを切り替える',
            confirm: '確認',
            searchTooltip: 'JavDBで完全一致が見つかりませんでした。検索ページに移動します'
        },
    };
    const T = uiStrings[Utils.getLanguage()];

    // --- 站点和版本配置 ---
    const versionSettings = {
        'original': {
            shortName: {
                'zh-CN': '原版',
                'zh-TW': '原版',
                'en': 'Original',
                'ja': 'オリジナル'
            },
            defaultSuffix: '',
            buttonColor: 'rgba(60, 120, 60, 0.75)'
        },
        'uncensored-leak': {
            shortName: {
                'zh-CN': '无码',
                'zh-TW': '無碼',
                'en': 'Uncensored',
                'ja': '無修正'
            },
            defaultSuffix: '-uncensored-leak',
            buttonColor: 'rgba(24, 51, 140, 1.0)'
        },
        'chinese-subtitle': {
            shortName: {
                'zh-CN': '中字',
                'zh-TW': '中字',
                'en': 'CHS',
                'ja': '中字'
            },
            defaultSuffix: '-chinese-subtitle',
            buttonColor: 'rgba(122, 22, 22, 1.0)'
        },
        'english-subtitle': {
            shortName: {
                'zh-CN': '英字',
                'zh-TW': '英字',
                'en': 'ENG',
                'ja': '英字'
            },
            defaultSuffix: '-english-subtitle',
            buttonColor: 'rgba(200, 160, 50, 1.0)'
        }
    };
    const versionDisplayOrder = ['original', 'uncensored-leak', 'chinese-subtitle', 'english-subtitle'];
    const SITE_CONFIGS = [{
        hostnames: ['123av.', '1av.to'],
        selector: 'div.mr-3 > h1'
    }, {
        hostnames: ['jable.tv'],
        selector: '.header-left > h4'
    }, {
        hostnames: ['missav.'],
        selector: 'div.flex-1.order-first div.mt-4 h1, div.flex-1.order-first div.mt-4 span.font-medium'
    }, {
        hostnames: ['av.gl'],
        selector: 'h1.text-base.lg\\:text-lg'
    }];

    // --- 注入样式 ---
    GM_addStyle(`
        @keyframes javdb-helper-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .javdb-helper-modal {
            display: none;
            position: fixed;
            z-index: 10001;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.5);
            justify-content: center;
            align-items: center;
        }
        .javdb-helper-modal-content {
            background-color: #2D3748;
            color: #E2E8F0;
            margin: auto;
            padding: 20px;
            border: 1px solid #4A5568;
            border-radius: 8px;
            width: 90%;
            max-width: 400px;
        }
        .javdb-helper-setting-row {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        .javdb-helper-setting-row label {
            margin-left: 10px;
            font-size: 14px;
            flex-shrink: 0;
        }
        .javdb-helper-setting-row input[type="text"] {
            background-color: #4A5568;
            color: #E2E8F0;
            border: 1px solid #718096;
            border-radius: 4px;
            padding: 5px;
            margin-left: 5px;
            flex-grow: 1;
            width: 10px;
        }
        .javdb-helper-setting-row button {
            background-color: #4A5568;
            color: #E2E8F0;
            border: 1px solid #718096;
            border-radius: 4px;
            padding: 5px 10px;
            margin-left: 10px;
            cursor: pointer;
        }
        .javdb-helper-setting-row button:hover {
            background-color: #718096;
        }
        .javdb-status-menu {
            position: absolute;
            z-index: 99999;
            background: #374151;
            border: 1px solid #4B5563;
            border-radius: 6px;
            padding: 5px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            max-width: 250px;
        }
        .javdb-status-menu-button {
            background: #4B5563;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 8px;
            cursor: pointer;
            text-align: left;
            white-space: nowrap;
            font-size: 12px;
        }
        .javdb-status-menu-button:hover {
            background: #6B7280;
        }
        .javdb-rating-stars {
            display: flex;
            flex-direction: row-reverse;
            justify-content: center;
        }
        .javdb-rating-stars label {
            font-size: 1.5rem;
            color: #9CA3AF;
            cursor: pointer;
            transition: color 0.2s;
        }
        .javdb-rating-stars label:hover,
        .javdb-rating-stars label:hover ~ label {
            color: #FBBF24;
        }
        .javdb-helper-tag, .javdb-status-container > * {
            cursor: pointer;
            font-weight: bold;
            margin-right: 5px;
            vertical-align: middle;
            display: inline-block;
            transition: filter 0.2s ease-in-out;
        }
        .javdb-helper-tag:hover, .javdb-status-container > *:hover {
            filter: brightness(1.5);
        }
        .javdb-status-tag {
            color: white;
            padding: 2px 6px;
            font-size: 12px;
            border-radius: 4px;
        }
        .javdb-rating-span {
            font-size: 12px;
            vertical-align: middle;
            margin-right: 8px;
        }
        .javdb-user-rating {
            color: #FBBF24;
        }
        .javdb-public-rating {
            color: #A0AEC0;
        }
        .javdb-public-rating .star {
            color: #FBBF24;
        }
        .javdb-loading-tag {
            color: #90CDF4;
            animation: javdb-helper-spin 1s linear infinite;
        }
        .javdb-add-tag {
            color: #60A5FA;
        }
        .javdb-login-tag {
            color: #FBBF24;
        }
        .javdb-vip-tag {
            color: #F6E05E;
        }
        .javdb-error-tag {
            color: #EF4444;
        }
        .javdb-refresh-tag {
            color: #90CDF4;
        }
        body.javdb-status-hidden .javdb-helper-tag,
        body.javdb-status-hidden .javdb-rating-span,
        body.javdb-status-hidden .javdb-status-container {
            display: none !important;
        }
        body.missav-versions-hidden .missav-overall-version-container {
            display: none !important;
        }
        .missav-version-button-active:hover {
            filter: brightness(1.2);
        }
    `);

    // --- UI 模块 ---
    const UI = {
        updateVisibility() {
            document.body.classList.toggle('javdb-status-hidden', !AppState.settings.showJavdbStatus);
            document.body.classList.toggle('missav-versions-hidden', !AppState.settings.showMissAvVersions);
        },
        createTag(className, text, title, onClick) {
            const tag = document.createElement('span');
            tag.className = `javdb-helper-tag ${className}`;
            tag.textContent = text;
            if (title) tag.title = title;
            if (onClick) tag.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                onClick(tag, e);
            };
            return tag;
        },
        createMenu(targetElement, items) {
            document.querySelector('.javdb-status-menu')?.remove();
            const menu = document.createElement('div');
            menu.className = 'javdb-status-menu';
            const rect = targetElement.getBoundingClientRect();
            document.body.appendChild(menu);
            menu.style.top = `${window.scrollY + rect.bottom}px`;
            menu.style.left = `${window.scrollX + rect.left}px`;
            items.forEach(item => {
                if (item.type === 'rating') {
                    const ratingContainer = document.createElement('div');
                    ratingContainer.className = 'javdb-rating-stars';
                    for (let i = 5; i >= 1; i--) {
                        const starLabel = document.createElement('label');
                        starLabel.textContent = '★';
                        starLabel.onclick = (e) => {
                            e.stopPropagation();
                            item.onClick(i);
                            menu.remove();
                        };
                        ratingContainer.appendChild(starLabel);
                    }
                    menu.appendChild(ratingContainer);
                } else {
                    const btn = document.createElement('button');
                    btn.className = 'javdb-status-menu-button';
                    btn.textContent = item.text;
                    btn.onclick = (e) => {
                        e.stopPropagation();
                        item.onClick();
                        menu.remove();
                    };
                    menu.appendChild(btn);
                }
            });
            setTimeout(() => document.addEventListener('click', () => menu.remove(), {
                once: true
            }), 0);
        },
        renderStatusTags(statusContainer, javdbUrl, statusData) {
            statusContainer.innerHTML = ''; // 清空加载动画
            const {
                status,
                reviewId,
                score,
                publicScore,
                publicRaterCount,
                error
            } = statusData;

            const elementsToPrepend = [];
            let statusTag = null;
            let ratingSpan = null;
            let refreshTag = null;

            switch (status) {
                case CONSTANTS.STATUS.WATCHED:
                    statusTag = this.createTag(CONSTANTS.CSS.STATUS_TAG, `[${T.statusWatched}]`, null, (el) => this.showStatusMenu(el, javdbUrl, status, reviewId));
                    statusTag.style.backgroundColor = '#3273dc';
                    break;
                case CONSTANTS.STATUS.WANTED:
                    statusTag = this.createTag(CONSTANTS.CSS.STATUS_TAG, `[${T.statusWanted}]`, null, (el) => this.showStatusMenu(el, javdbUrl, status, reviewId));
                    statusTag.style.backgroundColor = '#e83e8c';
                    break;
                case CONSTANTS.STATUS.NOT_LOGGED_IN:
                    statusTag = this.createTag(CONSTANTS.CSS.LOGIN_TAG, '[ ! ]', T.loginTooltip, (el) => this.showLoginMenu(el));
                    break;
                default:
                    if (error) {
                        if (error === CONSTANTS.ERROR_TYPE.VIP_REQUIRED) {
                            statusTag = this.createTag(CONSTANTS.CSS.VIP_TAG, T.vipTag, T.vipRequiredTooltip, (el) => this.showVipMenu(el));
                        } else {
                            const errorText = error === CONSTANTS.ERROR_TYPE.NOT_FOUND ? '[∅]' : '[×]';
                            const errorTitleKey = error === CONSTANTS.ERROR_TYPE.NOT_FOUND ? 'javdbNotFound' : (error === CONSTANTS.ERROR_TYPE.STATUS_FETCH ? 'statusFetchError' : 'linkFetchError');
                            const errorTitle = T[errorTitleKey];
                            statusTag = this.createTag(CONSTANTS.CSS.ERROR_TAG, errorText, errorTitle);
                        }
                    } else if (AppState.session.isLoggedIn) {
                        statusTag = this.createTag(CONSTANTS.CSS.ADD_TAG, '[+]', null, (el) => this.showStatusMenu(el, javdbUrl, CONSTANTS.STATUS.UNMARKED, null));
                    }
                    break;
            }

            if (statusTag) elementsToPrepend.push(statusTag);

            if (status === CONSTANTS.STATUS.WATCHED && score > 0) {
                ratingSpan = document.createElement('span');
                ratingSpan.className = 'javdb-rating-span javdb-user-rating';
                ratingSpan.textContent = '★'.repeat(score) + '☆'.repeat(5 - score);
            } else if (publicScore && publicRaterCount) {
                ratingSpan = document.createElement('span');
                ratingSpan.className = 'javdb-rating-span javdb-public-rating';
                ratingSpan.innerHTML = `<span class="star">☆ ${publicScore}</span> (${publicRaterCount}人)`;
                ratingSpan.title = T.publicRatingTooltipFull.replace('{score}', publicScore).replace('{count}', publicRaterCount);
            }
            if (ratingSpan) elementsToPrepend.push(ratingSpan);

            if (error || status === CONSTANTS.STATUS.NOT_LOGGED_IN) {
                const titleElement = statusContainer.closest('[data-fanhao-enhanced]');
                refreshTag = this.createTag(CONSTANTS.CSS.REFRESH_TAG, '↻', T.refreshStatus, (el, e) => {
                    const fanhaoLink = titleElement?.querySelector('.javdb-enhancer-link');
                    if (fanhaoLink && fanhaoLink.href) {
                        AppState.session.authenticityToken = null;
                        AppState.session.isLoggedIn = false;
                        AppState.session.initialLoginCheckDone = false;

                        statusContainer.innerHTML = '';
                        statusContainer.appendChild(UI.createTag(CONSTANTS.CSS.LOADING_TAG, '↻', T.processing));

                        JavDB.fetchAndDisplayStatus({ link: fanhaoLink.href }, statusContainer, true);
                    }
                });
            }
            if (refreshTag) elementsToPrepend.push(refreshTag);

            elementsToPrepend.forEach(el => statusContainer.appendChild(el));
        },
        showStatusMenu(targetElement, javdbUrl, status, reviewId) {
            const titleElement = targetElement.closest('[data-fanhao-enhanced]');
            const items = [];
            const onRate = (score) => JavDB.updateReviewStatus(CONSTANTS.STATUS.WATCHED, javdbUrl, titleElement, score, reviewId);
            if (status === CONSTANTS.STATUS.UNMARKED) {
                items.push({
                    text: T.markWanted,
                    onClick: () => JavDB.updateReviewStatus(CONSTANTS.STATUS.WANTED, javdbUrl, titleElement)
                });
                items.push({
                    text: T.markWatched,
                    onClick: () => this.createMenu(targetElement, [{
                        type: 'rating',
                        onClick: onRate
                    }])
                });
            } else if (status === CONSTANTS.STATUS.WANTED) {
                items.push({
                    text: T.markWatched,
                    onClick: () => this.createMenu(targetElement, [{
                        type: 'rating',
                        onClick: onRate
                    }])
                });
                items.push({
                    text: T.deleteTag,
                    onClick: () => JavDB.updateReviewStatus(CONSTANTS.STATUS.DELETE, javdbUrl, titleElement, null, reviewId)
                });
            } else if (status === CONSTANTS.STATUS.WATCHED) {
                items.push({
                    text: T.modifyRating,
                    onClick: () => this.createMenu(targetElement, [{
                        type: 'rating',
                        onClick: onRate
                    }])
                });
                items.push({
                    text: T.deleteTag,
                    onClick: () => JavDB.updateReviewStatus(CONSTANTS.STATUS.DELETE, javdbUrl, titleElement, null, reviewId)
                });
            }
            this.createMenu(targetElement, items);
        },
        showLoginMenu(targetElement) {
            this.createMenu(targetElement, [{
                text: T.goToLogin,
                onClick: () => GM_openInTab(`https://${AppState.settings.javdbDomain}/login`, {
                    active: true
                })
            }, {
                text: T.popupLogin,
                onClick: () => {
                    const width = 600,
                        height = 800,
                        left = (window.screen.width / 2) - (width / 2),
                        top = (window.screen.height / 2) - (height / 2);
                    window.open(`https://${AppState.settings.javdbDomain}/login`, 'JavDBLogin', `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`);
                }
            }, {
                text: T.setDomain,
                onClick: () => this.openSettingsModal()
            }]);
        },
        showVipMenu(targetElement) {
            this.createMenu(targetElement, [{
                text: T.enableVip,
                onClick: () => GM_openInTab(`https://${AppState.settings.javdbDomain}/plans/ypay`, {
                    active: true
                })
            }, {
                text: T.switchAccount,
                onClick: () => GM_openInTab(`https://${AppState.settings.javdbDomain}/login`, {
                    active: true
                })
            }]);
        },
        openSettingsModal() {
            let modal = document.getElementById('javdb-helper-settings-modal');
            if (modal) {
                modal.style.display = 'flex';
                return;
            }
            modal = document.createElement('div');
            modal.id = 'javdb-helper-settings-modal';
            modal.className = 'javdb-helper-modal';
            modal.innerHTML = `
                <div class="javdb-helper-modal-content">
                    <span class="javdb-helper-modal-close" style="float:right; cursor:pointer;">&times;</span>
                    <h2>${T.settingsTitle}</h2>
                    <div class="javdb-helper-modal-body">
                        <div class="javdb-helper-setting-row">
                            <input type="checkbox" id="setting-javdb-status">
                            <label for="setting-javdb-status">${T.enableStatus}</label>
                        </div>
                        <div class="javdb-helper-setting-row">
                            <input type="checkbox" id="setting-missav-versions">
                            <label for="setting-missav-versions">${T.enableMissAV}</label>
                        </div>
                        <hr style="border-color: #4A5568; margin: 15px 0;">
                        <div class="javdb-helper-setting-row">
                            <label for="setting-javdb-domain">${T.javdbDomainLabel}:</label>
                            <input type="text" id="setting-javdb-domain" placeholder="e.g., javdb.com">
                            <button id="javdb-domain-confirm">${T.confirm}</button>
                        </div>
                        <div class="javdb-helper-setting-row">
                            <button id="javdb-clear-cache" style="width: 100%;">${T.clearCache}</button>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(modal);
            const closeModal = () => modal.style.display = 'none';
            modal.querySelector('.javdb-helper-modal-close').addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
            const statusCheck = document.getElementById('setting-javdb-status'),
                missavCheck = document.getElementById('setting-missav-versions'),
                domainInput = document.getElementById('setting-javdb-domain'),
                domainConfirmBtn = document.getElementById('javdb-domain-confirm'),
                clearCacheBtn = document.getElementById('javdb-clear-cache');
            statusCheck.checked = AppState.settings.showJavdbStatus;
            missavCheck.checked = AppState.settings.showMissAvVersions;
            domainInput.value = AppState.settings.javdbDomain;
            statusCheck.addEventListener('change', () => {
                AppState.settings.showJavdbStatus = statusCheck.checked;
                AppState.saveSettings();
                this.updateVisibility();
            });
            missavCheck.addEventListener('change', () => {
                AppState.settings.showMissAvVersions = missavCheck.checked;
                AppState.saveSettings();
                this.updateVisibility();
            });
            domainConfirmBtn.addEventListener('click', () => {
                const newDomain = domainInput.value.trim();
                if (newDomain && newDomain !== AppState.settings.javdbDomain) {
                    AppState.settings.javdbDomain = newDomain;
                    AppState.saveSettings();
                    AppState.clearSessionAndCache();
                    Utils.logDebug("域名已更改，重新处理所有元素。");
                    document.querySelectorAll('[data-fanhao-enhanced="true"]').forEach(el => {
                        if (el.dataset.originalHtml) el.innerHTML = el.dataset.originalHtml;
                        delete el.dataset.fanhaoEnhanced;
                        delete el.dataset.originalHtml;
                    });
                    const config = SITE_CONFIGS.find(c => c.hostnames.some(h => window.location.hostname.includes(h)));
                    if (config) processElements(document.querySelectorAll(config.selector));
                }
                closeModal();
            });
            clearCacheBtn.addEventListener('click', () => {
                AppState.cache.fanhao.clear();
                AppState.cache.status.clear();
                AppState.cache.missav.clear();
                Utils.logDebug("用户清除了脚本缓存。");
                const originalText = clearCacheBtn.textContent;
                clearCacheBtn.textContent = T.cacheCleared;
                setTimeout(() => {
                    clearCacheBtn.textContent = originalText;
                }, 1500);
            });
            modal.style.display = 'flex';
        }
    };

    // --- JavDB 交互模块 ---
    const JavDB = {
        async getCsrfToken(force = false) {
            if (AppState.session.authenticityToken && !force) return AppState.session.authenticityToken;
            try {
                const response = await Utils.gmFetch(`https://${AppState.settings.javdbDomain}`);
                if (response.status === 200) {
                    const html = response.responseText;
                    AppState.session.isLoggedIn = html.includes('/logout');
                    const match = html.match(/<meta name="csrf-token" content="([^"]+)"/);
                    if (match && match[1]) {
                        AppState.session.authenticityToken = match[1];
                        Utils.logDebug(`CSRF Token 已获取。登录状态: ${AppState.session.isLoggedIn}`);
                        AppState.session.initialLoginCheckDone = true;
                        return AppState.session.authenticityToken;
                    }
                }
            } catch (e) {
                Utils.handleError(e, 'getCsrfToken');
            }
            AppState.session.isLoggedIn = false;
            AppState.session.initialLoginCheckDone = true;
            return null;
        },
        async updateReviewStatus(action, javdbUrl, titleElement, rating = null, reviewId = null, isRetry = false) {
            const statusContainer = titleElement.querySelector('.javdb-status-container');

            const handleErrorAndRefresh = () => {
                if (statusContainer) this.fetchAndDisplayStatus({ link: javdbUrl }, statusContainer, true);
                alert(T.operationFailed);
            };

            if (!isRetry && statusContainer) {
                 statusContainer.innerHTML = '';
                 statusContainer.appendChild(UI.createTag(CONSTANTS.CSS.LOADING_TAG, '↻', T.processing));
            }

            const token = await this.getCsrfToken(isRetry);
            if (!AppState.session.isLoggedIn || !token) {
                handleErrorAndRefresh();
                return;
            }

            const urlObj = new URL(javdbUrl);
            const videoId = urlObj.pathname.split('/').pop();
            let url, body;
            switch (action) {
                case CONSTANTS.STATUS.WATCHED:
                    url = reviewId ? `${urlObj.origin}/v/${videoId}/reviews/${reviewId}` : `${urlObj.origin}/v/${videoId}/reviews`;
                    const commonBody = `authenticity_token=${encodeURIComponent(token)}&video_review[status]=watched&video_review[score]=${rating}&video_review[content]=`;
                    body = reviewId ? `_method=patch&${commonBody}` : commonBody;
                    break;
                case CONSTANTS.STATUS.WANTED:
                    url = `${urlObj.origin}/v/${videoId}/reviews/want_to_watch`;
                    body = `authenticity_token=${encodeURIComponent(token)}`;
                    break;
                case CONSTANTS.STATUS.DELETE:
                    if (!reviewId) return;
                    url = `${urlObj.origin}/v/${videoId}/reviews/${reviewId}`;
                    body = `_method=delete&authenticity_token=${encodeURIComponent(token)}`;
                    break;
                default:
                    return;
            }
            try {
                const response = await Utils.gmFetch(url, {
                    method: 'POST',
                    data: body,
                    headers: {
                        "Accept": "application/json, text/javascript, */*; q=0.01",
                        "X-Requested-With": "XMLHttpRequest"
                    }
                });
                if (response.status === 200) {
                    Utils.logDebug(`操作 '${action}' 成功，正在刷新状态。`);
                    if(statusContainer) this.fetchAndDisplayStatus({link: javdbUrl}, statusContainer, true);
                } else if (!isRetry) {
                    Utils.logDebug(`更新失败，状态码: ${response.status}，正在使用新token重试...`);
                    this.updateReviewStatus(action, javdbUrl, titleElement, rating, reviewId, true);
                } else {
                    throw new Error(`重试失败，状态码: ${response.status}`);
                }
            } catch (e) {
                Utils.handleError(e, `updateReviewStatus: ${action}`);
                handleErrorAndRefresh();
            }
        },
        async fetchAndDisplayStatus(javdbInfo, statusContainer, force = false) {
            const javdbUrl = javdbInfo.link;
            if (force) AppState.cache.status.delete(javdbUrl);

            if (!AppState.session.initialLoginCheckDone) await this.getCsrfToken();

            if (!AppState.session.isLoggedIn) {
                UI.renderStatusTags(statusContainer, javdbUrl, { status: CONSTANTS.STATUS.NOT_LOGGED_IN });
                return;
            }

            const cachedStatus = AppState.cache.status.get(javdbUrl);
            if (cachedStatus) {
                UI.renderStatusTags(statusContainer, javdbUrl, cachedStatus);
                return;
            }

            try {
                const response = await Utils.gmFetch(javdbUrl);
                if (response.finalUrl && response.finalUrl.includes('/plans')) {
                    Utils.logDebug("被重定向到VIP页面，标记为需要VIP。");
                    const statusData = { status: CONSTANTS.STATUS.UNMARKED, error: CONSTANTS.ERROR_TYPE.VIP_REQUIRED };
                    AppState.cache.status.set(javdbUrl, statusData);
                    UI.renderStatusTags(statusContainer, javdbUrl, statusData);
                    return;
                }
                if (response.status >= 200 && response.status < 300) {
                    const doc = new DOMParser().parseFromString(response.responseText, "text/html");
                    let status = CONSTANTS.STATUS.UNMARKED,
                        reviewId = null,
                        score = 0,
                        publicScore = null,
                        publicRaterCount = null;
                    const watchedTag = doc.querySelector('.review-title .tag.is-success.is-light');
                    const wantedTag = doc.querySelector('.review-title .tag.is-info.is-light');
                    const deleteLink = doc.querySelector('a[data-method="delete"][href*="/reviews/"]');
                    if (deleteLink) reviewId = deleteLink.href.match(/\/reviews\/(\d+)/)?.[1];
                    const ratingBlock = Array.from(doc.querySelectorAll('.panel-block')).find(block => block.querySelector('strong')?.textContent.match(/評分|Rating/));
                    if (ratingBlock) {
                        const ratingText = ratingBlock.querySelector('span.value')?.textContent.trim();
                        if (ratingText) {
                            publicScore = ratingText.match(/(\d+(?:\.\d+)?)/)?.[1] || null;
                            publicRaterCount = ratingText.match(/([\d,]+)\s*(?:人|users|評價)/)?.[1].replace(/,/g, '') || null;
                        }
                    }
                    if (watchedTag) {
                        status = CONSTANTS.STATUS.WATCHED;
                        const ratingInput = doc.querySelector('.rating-star .control input[checked="checked"]');
                        if (ratingInput) score = parseInt(ratingInput.value, 10) || 0;
                    } else if (wantedTag) {
                        status = CONSTANTS.STATUS.WANTED;
                    }
                    const statusData = {
                        status,
                        reviewId,
                        score,
                        publicScore,
                        publicRaterCount
                    };
                    AppState.cache.status.set(javdbUrl, statusData);
                    UI.renderStatusTags(statusContainer, javdbUrl, statusData);
                } else {
                    throw new Error(`HTTP 状态 ${response.status}`);
                }
            } catch (error) {
                Utils.handleError(error, `fetchAndDisplayStatus: ${javdbUrl}`);
                UI.renderStatusTags(statusContainer, javdbUrl, { status: CONSTANTS.STATUS.UNMARKED, error: CONSTANTS.ERROR_TYPE.STATUS_FETCH });
            }
        },
        async findLink(fanhaoCode, titleForComparison) {
            const searchUrl = `https://${AppState.settings.javdbDomain}/search?q=${encodeURIComponent(fanhaoCode)}&f=all`;
            Utils.logDebug(`正在搜索 JavDB: ${searchUrl} ，对比标题: "${titleForComparison}"`);
            try {
                const response = await Utils.gmFetch(searchUrl);
                if (response.status === 200) {
                    const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                    if (doc.querySelector('iframe[src*="challenges.cloudflare.com"]')) return {
                        link: searchUrl,
                        status: CONSTANTS.ERROR_TYPE.LINK_FETCH
                    };
                    const movieItems = doc.querySelectorAll('.movie-list a.box');
                    if (movieItems.length === 0) return {
                        link: searchUrl,
                        status: CONSTANTS.ERROR_TYPE.NOT_FOUND
                    };
                    for (const item of movieItems) {
                        const javdbId = item.querySelector('.video-title strong')?.textContent.trim().toUpperCase();
                        if (javdbId === fanhaoCode) {
                            const href = item.getAttribute('href');
                            return {
                                link: `https://${AppState.settings.javdbDomain}${href}`,
                                status: 'found'
                            };
                        }
                    }
                    const normalizedTitle = Utils.normalizeString(titleForComparison);
                    for (const item of movieItems) {
                        const javdbTitle = item.getAttribute('title');
                        const href = item.getAttribute('href');
                        if (javdbTitle && href) {
                            const normalizedJavdbTitle = Utils.normalizeString(javdbTitle);
                            if (normalizedJavdbTitle.includes(normalizedTitle) || normalizedTitle.includes(normalizedJavdbTitle)) {
                                return {
                                    link: `https://${AppState.settings.javdbDomain}${href}`,
                                    status: 'found'
                                };
                            }
                        }
                    }
                    return {
                        link: searchUrl,
                        status: CONSTANTS.ERROR_TYPE.NOT_FOUND
                    };
                }
            } catch (error) {
                Utils.handleError(error, `findLink: ${fanhaoCode}`);
            }
            return {
                link: searchUrl,
                status: CONSTANTS.ERROR_TYPE.LINK_FETCH
            };
        },
        async fetchJapaneseTitle(currentUrl, fanhaoCode, selector) {
            let japaneseUrl;
            const urlObj = new URL(currentUrl);
            const hostname = urlObj.hostname;
            if (hostname.includes('jable.tv')) {
                urlObj.searchParams.set('lang', 'jp');
                japaneseUrl = urlObj.toString();
            } else if (hostname.includes('av.gl')) {
                const segments = urlObj.pathname.split('/').filter(Boolean);
                if (segments.length === 0) return null;
                if (segments[0] === 'av') {
                    segments.unshift('ja');
                } else if (segments.length > 1 && segments[1] === 'av') {
                    segments[0] = 'ja';
                } else {
                    return null;
                }
                japaneseUrl = `${urlObj.origin}/${segments.join('/')}`;
            } else if (hostname.includes('missav') || hostname.includes('123av') || hostname.includes('1av')) {
                const segments = urlObj.pathname.split('/').filter(Boolean);
                const fanhaoSegment = segments.find(s => s.toUpperCase().includes(fanhaoCode.toUpperCase()));
                const encodingParts = segments.filter(s => !s.toUpperCase().includes(fanhaoCode.toUpperCase()) && !/^[a-z]{2,3}$/.test(s) && s !== 'v');
                const finalFanhaoId = fanhaoSegment || fanhaoCode;
                let newPath = hostname.includes('missav') ? [...encodingParts, 'ja', finalFanhaoId].join('/') : ['ja', ...encodingParts, 'v', finalFanhaoId].join('/');
                japaneseUrl = `${urlObj.origin}/${newPath}${urlObj.search}`;
            } else {
                return null;
            }
            Utils.logDebug(`尝试从此链接获取日文标题: ${japaneseUrl}`);
            try {
                const response = await Utils.gmFetch(japaneseUrl, {
                    overrideReferer: urlObj.origin
                });
                if (response.status === 200) {
                    const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                    if (doc.querySelector('iframe[src*="challenges.cloudflare.com"]')) return null;
                    const titleElement = doc.querySelector(selector);
                    if (titleElement) {
                        Utils.logDebug(`成功获取日文标题: "${titleElement.textContent.trim()}"`);
                        return titleElement.textContent.trim();
                    }
                }
            } catch (error) {
                Utils.handleError(error, `fetchJapaneseTitle: ${japaneseUrl}`);
            }
            return null;
        }
    };

    // --- MissAV 专属功能模块 ---
    const MissAvModule = (() => {
        let isProcessing = false;

        const findTargetElement = () => {
            if (!window.location.hostname.includes('missav')) return null;
            const playerBars = document.querySelectorAll('div[class*="bg-black"]');
            for (const bar of playerBars) {
                const controlContainer = bar.querySelector('div.flex.items-center.flex-nowrap');
                if (controlContainer && (controlContainer.querySelector('button') || controlContainer.querySelector('svg.icon'))) return controlContainer;
            }
            let target = document.querySelector('.plyr__controls div.grow');
            if (target) return target;
            const controls = document.querySelector('.plyr__controls');
            if (controls) {
                for (const candidate of controls.querySelectorAll('div')) {
                    if (window.getComputedStyle(candidate).flexGrow === '1' && candidate.clientHeight > 0) return candidate;
                }
            }
            return null;
        };

        const determineCurrentVersionByUrl = (url) => {
            for (const type in versionSettings) {
                const suffix = versionSettings[type].defaultSuffix;
                if (suffix && url.toLowerCase().endsWith(suffix)) return type;
            }
            return 'original';
        };

        const findVersionLinksFromDOM = () => {
            const versionLinks = new Map();
            const linkElements = document.querySelectorAll('a[id^="option-menu-item-"][href]');
            linkElements.forEach(linkElement => {
                const text = linkElement.textContent.trim().toLowerCase();
                let href = linkElement.getAttribute('href');
                let type = null;
                if (text.includes('无码') || text.includes('uncensored')) type = 'uncensored-leak';
                else if (text.includes('中字') || text.includes('chinese')) type = 'chinese-subtitle';
                else if (text.includes('英字') || text.includes('english')) type = 'english-subtitle';
                if (type) {
                    if (href.startsWith('http')) {
                        try {
                            href = new URL(href).pathname.replace(/^\/+/, '');
                        } catch (e) { return; }
                    }
                    versionLinks.set(type, href);
                }
            });
            return versionLinks;
        };

        const checkDirectUrlExists = (url) => new Promise(resolve => GM_xmlhttpRequest({
            method: "HEAD", url: url, timeout: 5000,
            onload: res => resolve(res.status === 200),
            onerror: () => resolve(false), ontimeout: () => resolve(false)
        }));

        const fetchHrefToTypeMapFromSearch = (fanhao) => new Promise(resolve => {
            const searchUrl = `${window.location.origin}/search/${encodeURIComponent(fanhao)}`;
            GM_xmlhttpRequest({
                method: "GET", url: searchUrl, timeout: 7000,
                onload: response => {
                    if (response.status === 200) {
                        const tempDoc = document.createElement('div');
                        tempDoc.innerHTML = response.responseText;
                        if (tempDoc.querySelector('iframe[src*="challenges.cloudflare.com"]')) return resolve(new Map());
                        const hrefToTypeMap = new Map();
                        tempDoc.querySelectorAll('div.grid:nth-child(3) > div').forEach(item => {
                            const link = item.querySelector('a:nth-child(2)');
                            if (!link) return;
                            let href = (link.getAttribute('href') || "").split('?')[0];
                            let relHref = href.startsWith(window.location.origin) ? href.substring(window.location.origin.length) : href;
                            relHref = relHref.replace(/^\/+|\/+$/g, '');
                            if (!relHref) return;
                            const type = determineCurrentVersionByUrl(relHref);
                            if (type && !hrefToTypeMap.has(relHref)) {
                                hrefToTypeMap.set(relHref, type);
                            }
                        });
                        return resolve(hrefToTypeMap);
                    }
                    resolve(new Map());
                },
                onerror: () => resolve(new Map()), ontimeout: () => resolve(new Map())
            });
        });

        const init = async () => {
            if (!AppState.settings.showMissAvVersions || isProcessing) return;

            const injectionTarget = findTargetElement();
            if (!injectionTarget) return;

            if (injectionTarget.querySelector('.missav-overall-version-container')) {
                return;
            }

            document.querySelector('.missav-overall-version-container')?.remove();

            try {
                isProcessing = true;
                const currentPath = window.location.pathname.split('?')[0].replace(/^\/+|\/+$/g, '');
                const pathParts = currentPath.toLowerCase().split('/');
                const baseFanhaoSegment = (pathParts.pop() || "").replace(/-uncensored-leak|-chinese-subtitle|-english-subtitle/i, '').trim();
                if (!baseFanhaoSegment) return;
                const pathPrefix = pathParts.length > 0 ? pathParts.join('/') + '/' : '';
                const finalCurrentVersionType = determineCurrentVersionByUrl(currentPath);

                const overallContainer = document.createElement('div');
                overallContainer.className = 'missav-overall-version-container';
                Object.assign(overallContainer.style, { display: 'flex', alignItems: 'center', zIndex: '9999', marginRight: '16px' });
                const versionsButtonContainer = document.createElement('div');
                Object.assign(versionsButtonContainer.style, { display: 'inline-flex', borderRadius: '0.375rem', overflow: 'hidden' });
                overallContainer.appendChild(versionsButtonContainer);
                const referenceElement = injectionTarget.querySelector('.sm\\:ml-6');
                if (referenceElement) injectionTarget.insertBefore(overallContainer, referenceElement);
                else injectionTarget.appendChild(overallContainer);

                const versionButtons = new Map();
                versionDisplayOrder.forEach(type => {
                    const button = document.createElement('span');
                    button.textContent = versionSettings[type].shortName[Utils.getLanguage()];
                    if (type === finalCurrentVersionType) {
                        Object.assign(button.style, {
                            padding: '4px 8px', fontSize: '12px', color: '#F9FAFB',
                            backgroundColor: versionSettings[type]?.buttonColor || 'rgba(150, 150, 150, 0.75)',
                            cursor: 'default', textAlign: 'center', whiteSpace: 'nowrap', border: 'none',
                            boxShadow: 'inset 0 0 10px rgba(0,255,255,1)',
                            boxSizing: 'border-box'
                        });
                    } else {
                        Object.assign(button.style, {
                            padding: '4px 8px', fontSize: '12px', color: '#9CA3AF',
                            backgroundColor: 'rgba(108, 117, 125, 0.75)',
                            cursor: 'default', textAlign: 'center', whiteSpace: 'nowrap', border: 'none',
                            transition: 'background-color 0.2s ease-in-out, filter 0.2s ease-in-out',
                            boxSizing: 'border-box'
                        });
                        button.title = T.notAvailable;
                        versionButtons.set(type, button);
                    }
                    versionsButtonContainer.appendChild(button);
                });

                const activateButton = (type, href) => {
                    const button = versionButtons.get(type);
                    if (!button || button.dataset.activated) return;

                    Utils.logDebug(`[MissAV] Activating button for type: ${type} with href: /${href}`);

                    Object.assign(button.style, {
                        color: '#F9FAFB',
                        backgroundColor: versionSettings[type]?.buttonColor || 'rgba(150, 150, 150, 0.75)',
                        cursor: 'pointer'
                    });
                    button.title = '';
                    button.dataset.activated = 'true';
                    button.classList.add('missav-version-button-active');

                    button.addEventListener('click', () => {
                        window.location.href = `${window.location.origin}/${href}`;
                    });
                };

                const cachedVersions = AppState.cache.missav.get(baseFanhaoSegment);
                if (cachedVersions) {
                    Utils.logDebug(`[MissAV] 从缓存加载版本信息: ${baseFanhaoSegment}`);
                    versionDisplayOrder.forEach(type => {
                        if (type !== finalCurrentVersionType && cachedVersions[type]?.href) {
                            activateButton(type, cachedVersions[type].href);
                        }
                    });
                    isProcessing = false;
                    return;
                }

                let finalVersionStates = {};
                versionDisplayOrder.forEach(type => { finalVersionStates[type] = { href: null, source: null }; });

                const processFoundLink = (type, href, source) => {
                    if (!finalVersionStates[type].href) {
                        finalVersionStates[type] = { href, source };
                        if (type !== finalCurrentVersionType) activateButton(type, href);
                    }
                };

                findVersionLinksFromDOM().forEach((href, type) => processFoundLink(type, href, 'dom'));
                await Promise.all(versionDisplayOrder.map(async type => {
                    if (finalVersionStates[type].href) return;
                    const defaultHref = (pathPrefix + baseFanhaoSegment + versionSettings[type].defaultSuffix).toLowerCase().replace(/^\/+|\/+$/g, '');
                    if (await checkDirectUrlExists(`${window.location.origin}/${defaultHref}`)) {
                        processFoundLink(type, defaultHref, 'direct');
                    }
                }));
                const searchResults = await fetchHrefToTypeMapFromSearch(baseFanhaoSegment);
                searchResults.forEach((type, href) => processFoundLink(type, href, 'search'));

                Utils.logDebug(`[MissAV] 版本信息查找完成，存入缓存: ${baseFanhaoSegment}`, finalVersionStates);
                AppState.cache.missav.set(baseFanhaoSegment, finalVersionStates);

            } catch (error) {
                Utils.handleError(error, 'MissAvModule.init');
            } finally {
                isProcessing = false;
            }
        };

        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                Utils.logDebug("Page loaded from bfcache, re-initializing MissAV module.");
                setTimeout(init, 100);
            }
        });

        return { init };
    })();


    // --- 核心逻辑 ---
    class AsyncQueue {
        constructor(concurrency) {
            this.concurrency = concurrency;
            this.running = 0;
            this.tasks = [];
            this.activeKeys = new Set();
        }
        add(key, task) {
            if (this.activeKeys.has(key)) {
                Utils.logDebug(`任务 [${key}] 已在队列中，跳过。`);
                return;
            }
            this.tasks.push({
                key,
                task
            });
            this.activeKeys.add(key);
            this.run();
        }
        async run() {
            while (this.running < this.concurrency && this.tasks.length > 0) {
                const {
                    key,
                    task
                } = this.tasks.shift();
                this.running++;
                try {
                    await task();
                } catch (error) {
                    Utils.handleError(error, `队列任务 ${key}`);
                } finally {
                    this.running--;
                    this.activeKeys.delete(key);
                    this.run();
                }
            }
        }
    }
    const requestQueue = new AsyncQueue(3);

    async function getJavDBInfo(baseId, titleForComparison, currentUrl, selector) {
        let javdbInfo = AppState.cache.fanhao.get(baseId);
        if (javdbInfo) {
            Utils.logDebug(`从缓存中获取番号 [${baseId}] 的信息。`);
            return javdbInfo;
        }
        Utils.logDebug(`缓存未命中，正在为 [${baseId}] 获取新信息。`);
        if (!document.documentElement.lang.toLowerCase().startsWith('ja')) {
            const japaneseFullTitle = await JavDB.fetchJapaneseTitle(currentUrl, baseId, selector);
            if (japaneseFullTitle) {
                const jpParsedInfo = Utils.parseFanhao(japaneseFullTitle);
                titleForComparison = jpParsedInfo ? jpParsedInfo.titleForComparison : japaneseFullTitle;
            }
        }
        javdbInfo = await JavDB.findLink(baseId, titleForComparison);
        AppState.cache.fanhao.set(baseId, javdbInfo);
        return javdbInfo;
    }

    async function processSingleElement(element, selector) {
        if (element.dataset.fanhaoEnhanced) return;
        element.dataset.fanhaoEnhanced = 'true';

        if (!element.dataset.originalHtml) element.dataset.originalHtml = element.innerHTML;

        const originalText = element.textContent.trim();
        const parsedInfo = Utils.parseFanhao(originalText);
        if (!parsedInfo) {
            element.dataset.fanhaoEnhanced = 'false';
            return;
        }

        const { baseId, fullId, titleForComparison } = parsedInfo;

        const statusContainer = document.createElement('span');
        statusContainer.className = 'javdb-status-container';
        statusContainer.appendChild(UI.createTag(CONSTANTS.CSS.LOADING_TAG, '↻', T.processing));
        element.prepend(statusContainer);

        const javdbInfo = await getJavDBInfo(baseId, titleForComparison, window.location.href, selector);
        const isSearchLink = javdbInfo.status !== 'found';

        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        let node;
        const textNodesToReplace = [];
        while (node = walker.nextNode()) {
            if (node.parentNode !== statusContainer && node.textContent.includes(fullId)) {
                textNodesToReplace.push(node);
            }
        }

        textNodesToReplace.forEach(textNode => {
            const parent = textNode.parentNode;
            const parts = textNode.textContent.split(fullId);
            const fragment = document.createDocumentFragment();
            parts.forEach((part, i) => {
                fragment.appendChild(document.createTextNode(part));
                if (i < parts.length - 1) {
                    const a = document.createElement('a');
                    a.className = 'javdb-enhancer-link';
                    a.href = javdbInfo.link;
                    a.target = '_blank';
                    a.style.cssText = 'text-decoration: underline; color: #60A5FA;';

                    // [FIX] 修复XSS漏洞：使用 textContent 替代 innerHTML
                    a.textContent = fullId;

                    if (isSearchLink) {
                        a.title = T.searchTooltip;
                        // 安全地添加图标
                        a.appendChild(document.createTextNode(' 🔍'));
                    }

                    a.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        GM_openInTab(a.href, { active: true });
                    });
                    fragment.appendChild(a);
                }
            });
            parent.replaceChild(fragment, textNode);
        });

        if (!isSearchLink && AppState.settings.showJavdbStatus) {
            await JavDB.fetchAndDisplayStatus(javdbInfo, statusContainer);
        } else {
            UI.renderStatusTags(statusContainer, null, { status: CONSTANTS.STATUS.UNMARKED, error: javdbInfo.status });
        }
    }

    function processElements(elementsToProcess) {
        const config = SITE_CONFIGS.find(c => c.hostnames.some(h => window.location.hostname.includes(h)));
        if (!config) return;
        for (const element of elementsToProcess) {
            const originalText = element.textContent.trim();
            const parsedInfo = Utils.parseFanhao(originalText);
            if (parsedInfo) {
                requestQueue.add(parsedInfo.baseId, () => processSingleElement(element, config.selector));
            }
        }
    }

    // --- 主程序入口 ---
    function main() {
        AppState.loadSettings();
        GM_registerMenuCommand(T.settingsTitle, () => UI.openSettingsModal());
        UI.updateVisibility();

        const handleDOMChanges = () => {
            const config = SITE_CONFIGS.find(c => c.hostnames.some(h => window.location.hostname.includes(h)));
            if (!config) return;

            const unenhancedElements = document.querySelectorAll(`${config.selector}:not([data-fanhao-enhanced])`);
            if (unenhancedElements.length > 0) {
                processElements(unenhancedElements);
            }

            if (window.location.hostname.includes('missav')) {
                MissAvModule.init();
            }
        };

        const debouncedHandler = Utils.debounce(handleDOMChanges, 300);

        // [OPTIMIZED] 监听body是功能覆盖最广且最稳妥的方案，配合debounce可有效控制性能。
        // 在多个结构各异的网站上，寻找精确的父容器会使代码变得复杂且脆弱。
        const observer = new MutationObserver(debouncedHandler);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        handleDOMChanges();
    }

    main();

})();

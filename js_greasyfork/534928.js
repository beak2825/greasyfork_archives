// ==UserScript==

// @name         🌐 搜索中心增强

// @name:en      🌐 Search Hub Enhancer

// @namespace    https://greasyfork.org/zh-CN/users/1454800

// @version      1.0.20

// @description  快速切换搜索引擎的工具栏，可拖动到顶部/底部/左侧/右侧，支持水平/垂直布局，内容少时居中，内容多时可滑动，设置面板宽度随屏幕动态调整

// @description:en A draggable toolbar for quick switching between search engines, supports top/bottom/left/right positions with horizontal/vertical layouts, centered when content is minimal, scrollable when content is extensive, settings panel width adjusts dynamically with screen size

// @author       Aiccest

// @match        *://*/*

// @grant        GM_setValue

// @grant        GM_getValue

// @grant        GM_registerMenuCommand

// @noframes

// @license      MIT



// @downloadURL https://update.greasyfork.org/scripts/534928/%F0%9F%8C%90%20%E6%90%9C%E7%B4%A2%E4%B8%AD%E5%BF%83%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/534928/%F0%9F%8C%90%20%E6%90%9C%E7%B4%A2%E4%B8%AD%E5%BF%83%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {

    'use strict';

    // 调试开关

    const DEBUG = true;

    // 配置

    const CONFIG = {

        STORAGE_KEY: 'search_hub_engines',

        POSITION_KEY: 'toolbar_position',

        DEBOUNCE_MS: 400,

        ANIMATION_MS: 300,

        WEIBO_CONTAINER_ID: '100103',

    };

    // 语言包

    const i18n = {

        'zh-CN': {

            scriptName: '🌐 搜索中心增强',

            scriptDescription: '快速切换搜索引擎的工具栏，可自定义引擎',

            settingsTitle: '🌐 搜索引擎设置',

            addButton: '添加',

            saveButton: '保存',

            closeButton: '关闭',

            namePlaceholder: '名称',

            urlPlaceholder: '包含 %s 的URL',

            alertRequired: '名称和URL为必填项！',

            alertUrlFormat: 'URL必须包含%s占位符！',

            alertInvalidUrl: '无效的URL！',

            alertMinEngines: '至少需要一个搜索引擎！',

            alertNotSearchPage: '当前页面不是搜索页面，无法添加为搜索引擎！',

            alertNoEngineConfig: '无法检测当前页面的搜索引擎配置！',

            menuAddEngine: '🌐 添加当前页面为搜索引擎'

        },

        'en-US': {

            scriptName: '🌐 Search Hub Enhancer',

            scriptDescription: 'A toolbar for quickly switching search engines, with customizable engines',

            settingsTitle: '🌐 Search Engine Settings',

            addButton: 'Add',

            saveButton: 'Save',

            closeButton: 'Close',

            namePlaceholder: 'Name',

            urlPlaceholder: 'URL containing %s',

            alertRequired: 'Name and URL are required!',

            alertUrlFormat: 'URL must contain %s placeholder!',

            alertInvalidUrl: 'Invalid URL!',

            alertMinEngines: 'At least one search engine is required!',

            alertNotSearchPage: 'This page is not a search page and cannot be added as a search engine!',

            alertNoEngineConfig: 'Cannot detect the search engine configuration for this page!',

            menuAddEngine: '🌐 Add Current Page as Search Engine'

        }

    };

    // 获取系统语言

    const getLanguage = () => {

        const lang = navigator.language || navigator.userLanguage;

        return lang.startsWith('zh') ? 'zh-CN' : 'en-US';

    };

    const lang = getLanguage();

    // 工具栏 CSS

    const TOOLBAR_CSS = `

        :host {

            all: initial;

            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;

            font-weight: normal !important;

            font-size: 14px !important;

            --bg-color: rgba(255, 255, 255, 0.95);

            --text-color: #1f2937;

            --border-color: #e5e7eb;

            --hover-bg: #f9fafb;

            --btn-bg: #f9fafb;

            --btn-active-bg: #e5e7eb;

            --dragging-bg: rgba(200, 200, 200, 0.3);

        }

        @media (prefers-color-scheme: dark) {

            :host {

                --bg-color: rgba(31, 41, 55, 0.95);

                --text-color: #e5e7eb;

                --border-color: #4b5563;

                --hover-bg: #374151;

                --btn-bg: #374151;

                --btn-active-bg: #4b5563;

                --dragging-bg: rgba(100, 100, 100, 0.3);

            }

        }

        #search-hub-toolbar {

            position: fixed !important;

            background: var(--bg-color) !important;

            border-radius: 12px !important;

            padding: 8px !important;

            display: flex !important;

            gap: 8px !important;

            z-index: 2147483647 !important;

            max-width: 90vw !important;

            overflow-x: auto !important;

            scrollbar-width: none !important;

            box-shadow: 0 -2px 8px rgba(0,0,0,0.1) !important;

            touch-action: pan-x !important;

            user-select: none !important;

            -webkit-user-select: none !important;

            pointer-events: auto !important;

            transition: all ${CONFIG.ANIMATION_MS}ms ease;

        }

        #search-hub-toolbar.dragging {

            background: var(--dragging-bg) !important;

            transform: translate(var(--drag-x, 0), var(--drag-y, 0)) !important;

            transition: none !important;

        }

        #search-hub-toolbar::-webkit-scrollbar { display: none !important; }

        #search-hub-toolbar[data-position="top"] {

            top: 0 !important;

            bottom: auto !important;

            left: 50% !important;

            right: auto !important;

            transform: translateX(-50%) !important;

            border-radius: 0 0 12px 12px !important;

            flex-direction: row !important;

            overflow-x: auto !important;

            overflow-y: hidden !important;

        }

        #search-hub-toolbar[data-position="bottom"] {

            bottom: 0 !important;

            top: auto !important;

            left: 50% !important;

            right: auto !important;

            transform: translateX(-50%) !important;

            border-radius: 12px 12px 0 0 !important;

            flex-direction: row !important;

            overflow-x: auto !important;

            overflow-y: hidden !important;

        }

        #search-hub-toolbar[data-position="left"] {

            top: 50% !important;

            bottom: auto !important;

            left: 0 !important;

            right: auto !important;

            transform: translateY(-50%) !important;

            flex-direction: column !important;

            border-radius: 0 12px 12px 0 !important;

            max-height: 90vh !important;

            overflow-x: hidden !important;

            overflow-y: auto !important;

            touch-action: pan-y !important;

        }

        #search-hub-toolbar[data-position="right"] {

            top: 50% !important;

            bottom: auto !important;

            right: 0 !important;

            left: auto !important;

            transform: translateY(-50%) !important;

            flex-direction: column !important;

            border-radius: 12px 0 0 12px !important;

            max-height: 90vh !important;

            overflow-x: hidden !important;

            overflow-y: auto !important;

            touch-action: pan-y !important;

        }

        .engine-btn {

            padding: 6px 12px !important;

            background: var(--btn-bg) !important;

            color: var(--text-color) !important;

            border: 0.8px solid var(--border-color) !important;

            border-radius: 8px !important;

            cursor: pointer !important;

            transition: background 0.2s ease !important;

            white-space: nowrap !important;

            box-sizing: border-box !important;

        }

        .engine-btn:hover {

            background: var(--hover-bg) !important;

        }

        .settings-btn {

            padding: 6px 12px !important;

            background: var(--btn-bg) !important;

            color: var(--text-color) !important;

            border: 0.8px solid var(--border-color) !important;

            border-radius: 8px !important;

            cursor: pointer !important;

            box-sizing: border-box !important;

        }

        @media (max-width: 640px) {

            #search-hub-toolbar {

                max-width: 95vw !important;

                padding: 6px !important;

            }

            .engine-btn, .settings-btn {

                padding: 4px 8px !important;

            }

        }

    `;

    // 设置面板 CSS

    const SETTINGS_CSS = `

        :host {

            all: initial;

            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;

            font-weight: normal !important;

            font-size: 14px !important;

            --panel-bg: white;

            --text-color: #1f2937;

            --border-color: #e5e7eb;

            --hover-bg: #f9fafb;

            --btn-bg: #f9fafb;

            --btn-active-bg: #e5e7eb;

            --btn-save-bg: #4f46e5;

            --btn-add-bg: #22c55e;

            --btn-close-bg: #6b7280;

        }

        @media (prefers-color-scheme: dark) {

            :host {

                --panel-bg: #1f2937;

                --text-color: #e5e7eb;

                --border-color: #4b5563;

                --hover-bg: #374151;

                --btn-bg: #374151;

                --btn-active-bg: #4b5563;

            }

        }

        @keyframes fadeIn {

            from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }

            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }

        }

        .settings-panel {

            position: fixed !important;

            top: 50% !important;

            left: 50% !important;

            transform: translate(-50%, -50%) !important;

            background: var(--panel-bg) !important;

            border-radius: 12px !important;

            padding: 16px !important;

            box-shadow: 0 4px 16px rgba(0,0,0,0.2) !important;

            z-index: 2147483647 !important;

            width: 50vw !important;

            min-width: 300px !important;

            max-width: 800px !important;

            max-height: 80vh !important;

            overflow-y: auto !important;

            box-sizing: border-box !important;

            animation: fadeIn ${CONFIG.ANIMATION_MS}ms ease forwards !important;

            pointer-events: auto !important;

            color: var(--text-color) !important;

        }

        h3 {

            font-size: 16px !important;

            font-weight: normal !important;

            margin: 0 0 12px !important;

            padding-bottom: 8px !important;

            border-bottom: 1px solid var(--border-color) !important;

        }

        .engine-item {

            margin-bottom: 12px !important;

            border: 1px solid var(--border-color) !important;

            border-radius: 6px !important;

            padding: 0 !important;

        }

        .name-row {

            display: flex !important;

            gap: 8px !important;

            align-items: center !important;

            margin: 8px !important;

        }

        .name-row input {

            flex: 1 !important;

            padding: 6px 8px !important;

            border: 1px solid var(--border-color) !important;

            border-radius: 4px !important;

            box-sizing: border-box !important;

            background: var(--panel-bg) !important;

            color: var(--text-color) !important;

        }

        .url-input {

            width: calc(100% - 16px) !important;

            margin: 0 8px 8px !important;

            padding: 6px 8px !important;

            border: 1px solid var(--border-color) !important;

            border-radius: 4px !important;

            box-sizing: border-box !important;

            background: var(--panel-bg) !important;

            color: var(--text-color) !important;

        }

        .actions {

            display: flex !important;

            gap: 4px !important;

        }

        .action-btn {

            width: 24px !important;

            height: 24px !important;

            padding: 0 !important;

            border: 1px solid var(--border-color) !important;

            border-radius: 4px !important;

            background: var(--btn-bg) !important;

            cursor: pointer !important;

            display: flex !important;

            align-items: center !important;

            justify-content: center !important;

            box-sizing: border-box !important;

            color: var(--text-color) !important;

        }

        .action-btn:hover {

            background: var(--hover-bg) !important;

        }

        .action-btn:disabled {

            opacity: 0.5 !important;

            cursor: not-allowed !important;

        }

        .panel-actions {

            display: flex !important;

            gap: 8px !important;

            margin-top: 12px !important;

            border-top: 1px solid var(--border-color) !important;

            padding-top: 12px !important;

            justify-content: flex-end !important;

        }

        .panel-btn {

            padding: 8px 16px !important;

            border-radius: 6px !important;

            border: none !important;

            cursor: pointer !important;

            box-sizing: border-box !important;

            color: white !important;

        }

        .add-btn { background: var(--btn-add-bg) !important; }

        .save-btn { background: var(--btn-save-bg) !important; }

        .close-btn { background: var(--btn-close-bg) !important; }

        @media (max-width: 640px) {

            .settings-panel {

                width: 50vw !important;

                min-width: 280px !important;

            }

            .name-row input {

                max-width: calc(100% - 94px) !important;

            }

            .url-input {

                width: calc(100% - 16px) !important;

            }

            .panel-btn {

                padding: 6px 12px !important;

            }

        }

    `;

    // 存储工具函数

    const safeGetStorage = (key, defaultValue) => {
    try {
        return GM_getValue(key, defaultValue);
    } catch (e) {
        console.error(`GM_getValue failed for ${key}:`, e);
        return defaultValue;
    }
};

    const safeSetStorage = (key, value) => {
    try {
        GM_setValue(key, value);
        return true;
    } catch (e) {
        console.error(`GM_setValue failed for ${key}:`, e);
        return false;
    }
};

    // 工具函数

    const decode = str => str ? decodeURIComponent(str) : '';

    const buildSearchUrl = (protocol, hostname, basePath, queryParam, extraParams = '') => {

        let urlPath = basePath;

        let queryString = '';

        if (queryParam) {

            const separator = basePath === '/' ? '?' : basePath.includes('?') ? '&' : '?';

            queryString = `${separator}${queryParam}=%s`;

        } else {

            urlPath = basePath.endsWith('/') ? `${basePath}%s/` : `${basePath}/%s`;

        }

        return `${protocol}//${hostname}${urlPath}${queryString}${extraParams}`;

    };

    const debounce = (fn, ms) => {

        let timeout;

        return (...args) => {

            clearTimeout(timeout);

            timeout = setTimeout(() => fn(...args), ms);

        };

    };

    const throttle = (fn, ms) => {

        let last = 0;

        return (...args) => {

            const now = Date.now();

            if (now - last > ms) {

                last = now;

                fn(...args);

            }

        };

    };

    const sanitize = str => {

        if (typeof str !== 'string') return '';

        return str.replace(/[&<>"']/g, c => ({

            '&': '&',

            '<': '<',

            '>': '>',

            '"': '"',

            "'": "'"

        })[c]);

    };

    const generateId = () => `se_${Math.random().toString(36).slice(2, 10)}`;

    function getEngineConfigFromCurrentPage() {

        if (!SearchDetector.isSearchPage()) {

            alert(i18n[lang].alertNotSearchPage);

            return null;

        }

        const engineConfig = SearchDetector.detectEngineConfig();

        if (!engineConfig) {

            alert(i18n[lang].alertNoEngineConfig);

            return null;

        }

        return engineConfig;

    }

    // 搜索页面检测

    class SearchDetector {

        static cachedInput = null;

        static cachedSearchPage = null;

        static cachedUrl = null;

        static cachedForm = null;

        static pexelsPathRegex = /^\/[a-z]{2}(-[a-z]{2})?\/search\//;

        static inputSelector = 'input[type="search"], input[name="q"], input[name="wd"], input[name="word"], input[name="search"], input[name="query"], input[name="text"], input[name="p"], input[name="i"], input[name="searchword"], input[name="lookfor"], input.search-input';

        static config = {

            domains: {

                'metaso.cn': { basePath: '/', queryParam: 'q', displayName: 'Metaso' },

                'www.baidu.com': { basePath: '/s', queryParam: 'wd', displayName: 'Baidu' },

                'm.baidu.com': { basePath: '/s', queryParam: 'word', displayName: 'Baidu' },

                'www.yandex.com': { basePath: '/search', queryParam: 'text', displayName: 'Yandex' },

                'search.yahoo.com': { basePath: '/search', queryParam: 'p', displayName: 'Yahoo' },

                'www.startpage.com': { basePath: '/search', queryParam: 'q', displayName: 'Startpage' },

                'search.aol.com': { basePath: '/aol/search', queryParam: 'q', displayName: 'AOL' },

                'www.sogou.com': { basePath: '/web', queryParam: 'query', displayName: 'Sogou' },

                'm.sogou.com': { basePath: '/web/searchList.jsp', queryParam: 'keyword', displayName: 'Sogou' },

                'm.weibo.cn': {

                    basePath: '/search',

                    queryParam: 'q',

                    extraParams: `containerid=${CONFIG.WEIBO_CONTAINER_ID}`,

                    displayName: 'Weibo'

                },

                'zh.m.wikipedia.org': { basePath: '/wiki', queryParam: null, displayName: 'Wikipedia' },

                'www.pexels.com': { basePath: '/zh-cn/search', queryParam: null, displayName: 'Pexels' },

                'www.wolframalpha.com': { basePath: '/input', queryParam: 'i', displayName: 'WolframAlpha' },

                'i.cnki.net': { basePath: '/searchResult.html', queryParam: 'searchword', displayName: 'CNKI' },

                'www.base-search.net': { basePath: '/Search/Results', queryParam: 'lookfor', displayName: 'BASE' }

            },

            exclude: [

                { domain: /baidu\.com$/, paths: [/^\/(tieba|zhidao|question|passport)/] },

            ],

            commonQueryParams: ['q', 'wd', 'word', 'keyword', 'search', 'query', 'text', 'p', 'i', 'searchword', 'lookfor'],

        };

        static init() {

            this.observeSearchInput();

        }

        static observeSearchInput() {

            const clearCache = throttle(() => {

                this.cachedInput = null;

                this.cachedForm = null;

                this.getSearchInput();

                if (DEBUG) console.log('Search input cache cleared');

            }, 100);

            const observer = new MutationObserver(mutations => {

                const isSearchRelated = mutations.some(mutation =>

                    Array.from(mutation.addedNodes).some(node =>

                        node.nodeType === 1 && (node.matches('form') || node.querySelector(this.inputSelector))

                    ) ||

                    Array.from(mutation.removedNodes).some(node =>

                        node.nodeType === 1 && (node.matches('form') || node.querySelector(this.inputSelector))

                    )

                );

                if (isSearchRelated) {

                    clearCache();

                }

            });

            const target = document.querySelector('form') || document.querySelector('main') || document.body;

            observer.observe(target, { childList: true, subtree: false });

            if (DEBUG) console.log('Search input observer initialized on:', target.tagName);

        }

        static isSearchPage() {

            const start = performance.now();

            if (location.href === this.cachedUrl && this.cachedSearchPage !== null) {

                if (DEBUG) console.log('Using cached search page result:', this.cachedSearchPage);

                return this.cachedSearchPage;

            }

            try {

                const url = new URL(location.href);

                const params = new URLSearchParams(url.search);

                if (this.config.commonQueryParams.some(param => params.has(param) && params.get(param).trim())) {

                    if (DEBUG) console.log('Fast path: Detected search page via URL params');

                    this.cachedSearchPage = true;

                    this.cachedUrl = location.href;

                    return true;

                }

                if (this.isPredefinedDomain(url, params)) {

                    if (DEBUG) console.log('Detected predefined search page:', url.hostname);

                    this.cachedSearchPage = true;

                    this.cachedUrl = location.href;

                    return true;

                }

                if (this.isCustomEngineMatch(url, params)) {

                    if (DEBUG) console.log('Detected custom engine page:', location.href);

                    this.cachedSearchPage = true;

                    this.cachedUrl = location.href;

                    return true;

                }

                if (this.isExcludedPage(url)) {

                    if (DEBUG) console.log('Page excluded:', location.href);

                    this.cachedSearchPage = false;

                    this.cachedUrl = location.href;

                    return false;

                }

                const hasSearchInput = !!this.getSearchInput()?.value?.trim();

                const hasSearchTitle = document.title.toLowerCase().includes('search') || document.title.includes('搜索');

                const result = hasSearchInput || hasSearchTitle;

                this.cachedSearchPage = result;

                this.cachedUrl = location.href;

                if (DEBUG) console.log('Fallback detection:', { hasSearchInput, hasSearchTitle, url: location.href });

                return result;

            } catch (e) {

                console.error('SearchDetector.isSearchPage error:', e);

                this.cachedSearchPage = false;

                this.cachedUrl = location.href;

                return false;

            } finally {

                if (DEBUG) console.log(`isSearchPage took: ${performance.now() - start}ms`);

            }

        }

        static isGenericSearchPage(url, params) {

            return ['/search', '/s', '/web', '/results'].some(path => url.pathname.toLowerCase().includes(path)) &&

                this.config.commonQueryParams.some(param => params.has(param) && params.get(param).trim());

        }

        static isPredefinedDomain(url, params) {

            const domainConfig = this.config.domains[url.hostname];

            if (!domainConfig) return false;

            if (url.hostname === 'zh.m.wikipedia.org' && url.pathname.startsWith('/wiki/')) return true;

            if (url.hostname === 'm.weibo.cn' && url.pathname === '/search' && params.get('containerid') === CONFIG.WEIBO_CONTAINER_ID) return true;

            if (url.hostname === 'www.pexels.com' && url.pathname.match(this.pexelsPathRegex)) return true;

            return domainConfig.basePath === url.pathname.split('?')[0];

        }

        static isCustomEngineMatch(url, params) {

            const customEngines = safeGetStorage(CONFIG.STORAGE_KEY, []);

            for (const engine of customEngines) {

                try {

                    const engineUrl = new URL(engine.url.replace('%s', 'test'));

                    if (engineUrl.hostname === url.hostname) {

                        const customConfig = this.custom(engine);

                        if (customConfig && customConfig.pathTest.test(url.pathname)) {

                            return true;

                        }

                    }

                } catch (e) {

                    console.warn('Error checking custom engine:', engine, e);

                }

            }

            return false;

        }

        static isExcludedPage(url) {

            for (const rule of this.config.exclude) {

                if (rule.domain.test(url.hostname) && rule.paths.some(ex => ex.test(url.pathname))) {

                    return true;

                }

            }

            return false;

        }

        static getSearchInput() {

            if (this.cachedInput !== null) return this.cachedInput;

            if (!this.cachedForm) {

                this.cachedForm = document.querySelector('form');

            }

            if (this.cachedForm) {

                this.cachedInput = this.cachedForm.querySelector(this.inputSelector);

                if (this.cachedInput) return this.cachedInput;

            }

            this.cachedInput = document.querySelector(this.inputSelector);

            return this.cachedInput;

        }

        static getQuery() {

            try {

                const url = new URL(location.href);

                const params = new URLSearchParams(url.search);

                for (const param of this.config.commonQueryParams) {

                    const value = params.get(param)?.trim();

                    if (value) {

                        if (DEBUG) console.log('Query extracted from params:', decode(value));

                        return decode(value);

                    }

                }

                const inputValue = this.getSearchInput()?.value?.trim();

                if (inputValue) {

                    if (DEBUG) console.log('Query extracted from input:', inputValue);

                    return inputValue;

                }

                if (url.hostname === 'zh.m.wikipedia.org' && url.pathname.startsWith('/wiki/')) {

                    const title = url.pathname.replace('/wiki/', '').split('/')[0];

                    if (DEBUG) console.log('Query extracted from Wikipedia path:', decode(title));

                    return decode(title);

                }

                if (url.hostname === 'www.pexels.com' && url.pathname.match(this.pexelsPathRegex)) {

                    const query = url.pathname.split(this.pexelsPathRegex)[1]?.replace(/\/$/, '');

                    if (DEBUG) console.log('Query extracted from Pexels path:', decode(query));

                    return decode(query);

                }

                const metaQuery = document.querySelector('meta[name="description"]')?.content?.replace(/.*?search\s*for\s*['"]([^'"]+)['"].*/i, '$1')?.trim();

                if (metaQuery) {

                    if (DEBUG) console.log('Query extracted from meta:', metaQuery);

                    return metaQuery;

                }

                const titleQuery = document.title.replace(/\s*[-_|](搜索|Search|Query|Results).*$/i, '').trim();

                if (titleQuery) {

                    if (DEBUG) console.log('Query extracted from title:', titleQuery);

                    return titleQuery;

                }

                console.warn('Failed to extract query:', location.href);

                return '';

            } catch (e) {

                console.error('SearchDetector.getQuery error:', e);

                return '';

            }

        }

        static custom(e) {

            try {

                const testQuery = 'testquery';

                const u = new URL(e.url.replace('%s', testQuery));

                let paramKeys = [];

                new URLSearchParams(u.search).forEach((v, key) => {

                    if (v === testQuery) paramKeys.push(key);

                });

                if (!paramKeys.length && e.url.includes('%s')) {

                    console.warn('No query param detected, defaulting to "q"');

                    paramKeys = ['q'];

                }

                const pathTest = new RegExp(`^${u.pathname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(/.*)?$`);

                if (!u.hostname) {

                    console.error('Invalid hostname in URL:', e.url);

                    return null;

                }

                return { pathTest, paramKeys };

            } catch (err) {

                console.error('SearchDetector.custom error:', err);

                return null;

            }

        }

        static getQueryParam(forms, params, commonQueryParams) {

            const searchForm = Array.from(forms).find(form => form.querySelector(this.inputSelector));

            if (searchForm) {

                const searchInput = searchForm.querySelector(this.inputSelector);

                if (searchInput && searchInput.name) {

                    return { queryParam: searchInput.name, source: 'form-input' };

                }

                try {

                    const actionUrl = new URL(searchForm.action, location.origin);

                    const actionParams = new URLSearchParams(actionUrl.search);

                    for (const param of commonQueryParams) {

                        if (actionParams.has(param)) {

                            return { queryParam: param, source: 'form-action' };

                        }

                    }

                } catch (e) {

                    console.warn('Form action parsing failed:', e);

                }

            }

            for (const param of commonQueryParams) {

                if (params.has(param) && params.get(param).trim()) {

                    return { queryParam: param, source: 'url-param' };

                }

            }

            if (this.getSearchInput()?.value?.trim()) {

                return { queryParam: 'q', source: 'input-fallback' };

            }

            return null;

        }

        static detectEngineConfig() {

            try {

                const url = new URL(location.href);

                const params = new URLSearchParams(url.search);

                const forms = document.querySelectorAll('form[action]');

                const domainConfig = this.config.domains[url.hostname];

                if (domainConfig) {

                    if (url.hostname === 'zh.m.wikipedia.org') {

                        return { name: domainConfig.displayName, url: buildSearchUrl(url.protocol, url.hostname, '/wiki', null) };

                    }

                    if (url.hostname === 'm.weibo.cn') {

                        return {

                            name: domainConfig.displayName,

                            url: buildSearchUrl(url.protocol, url.hostname, domainConfig.basePath, domainConfig.queryParam, `&${domainConfig.extraParams}`)

                        };

                    }

                    if (url.hostname === 'www.pexels.com') {

                        return { name: domainConfig.displayName, url: buildSearchUrl(url.protocol, url.hostname, '/zh-cn/search', null) };

                    }

                    let extraParams = '';

                    if (url.hostname === 'www.base-search.net' && params.has('language')) {

                        extraParams = `&language=${params.get('language')}`;

                    }

                    return {

                        name: domainConfig.displayName,

                        url: buildSearchUrl(url.protocol, url.hostname, domainConfig.basePath, domainConfig.queryParam, extraParams)

                    };

                }

                const queryResult = this.getQueryParam(forms, params, this.config.commonQueryParams);

                if (!queryResult) {

                    console.warn('Failed to extract query param:', location.href);

                    return null;

                }

                const { queryParam, source } = queryResult;

                let basePath = this.getBasePath(url, forms, source);

                return this.buildEngineConfig(url, basePath, queryParam);

            } catch (e) {

                console.error('SearchDetector.detectEngineConfig error:', e);

                return null;

            }

        }

        static getBasePath(url, forms, source) {

            if (source.startsWith('form')) {

                const searchForm = Array.from(forms).find(form => form.querySelector(this.inputSelector));

                if (searchForm) {

                    try {

                        const actionUrl = new URL(searchForm.action, url.origin);

                        return actionUrl.pathname || '/';

                    } catch (e) {

                        console.warn('Form action parsing failed:', e);

                    }

                }

            }

            const pathSegments = url.pathname.split('/').filter(segment => segment);

            const staticSegments = pathSegments.filter(segment =>

                !/^[0-9]+$/.test(segment) &&

                !/^from=/.test(segment) &&

                !/^ssid=/.test(segment) &&

                segment.length < 20

            );

            return staticSegments.length > 0 ? `/${staticSegments.join('/')}` : '/';

        }

        static buildEngineConfig(url, basePath, queryParam) {

            const hostnameParts = url.hostname.split('.');

            const commonSubdomains = ['www', 'm', 'mobile', 'search'];

            const tlds = ['com', 'cn', 'org', 'net', 'co', 'io', 'site', 'ai'];

            const significantParts = hostnameParts.filter(part => !commonSubdomains.includes(part) && !tlds.includes(part));

            const engineName = significantParts.length > 0 ? significantParts[significantParts.length - 1] : hostnameParts[0];

            const displayName = engineName.charAt(0).toUpperCase() + engineName.slice(1);

            return {

                name: displayName,

                url: buildSearchUrl(url.protocol, url.hostname, basePath, queryParam)

            };

        }

    }

    // 设置面板

    class SettingsPanel {

        constructor(searchHub) {

            this.searchHub = searchHub;

            this.panel = null;

        }

        render() {

            try {

                this.panel = document.createElement('div');

                this.panel.id = 'settings-panel-container';

                this.panel.setAttribute('translate', 'no');

                const shadow = this.panel.attachShadow({ mode: 'open' });

                const style = document.createElement('style');

                setTimeout(() => {

                    style.textContent = SETTINGS_CSS;

                    if (DEBUG) console.log('Settings panel CSS loaded');

                }, 0);

                const content = document.createElement('div');

                content.className = 'settings-panel';

                content.innerHTML = `

                    <h3>${i18n[lang].settingsTitle}</h3>

                    <div id="engine-list">

                        ${this.searchHub.engines.map((e, i) => `

                            <div class="engine-item" data-id="${sanitize(e.id)}">

                                <div class="name-row">

                                    <input type="text" value="${sanitize(e.name)}" placeholder="${i18n[lang].namePlaceholder}" required>

                                    <div class="actions">

                                        <button class="action-btn move-up" ${i === 0 ? 'disabled' : ''}>↑</button>

                                        <button class="action-btn move-down" ${i === this.searchHub.engines.length - 1 ? 'disabled' : ''}>↓</button>

                                        <button class="action-btn delete">×</button>

                                    </div>

                                </div>

                                <input class="url-input" type="url" value="${sanitize(e.url)}" placeholder="${i18n[lang].urlPlaceholder}" required>

                            </div>

                        `).join('')}

                    </div>

                    <div class="panel-actions">

                        <button class="panel-btn add-btn">${i18n[lang].addButton}</button>

                        <button class="panel-btn save-btn">${i18n[lang].saveButton}</button>

                        <button class="panel-btn close-btn">${i18n[lang].closeButton}</button>

                    </div>

                `;

                shadow.appendChild(style);

                shadow.appendChild(content);

                document.body.appendChild(this.panel);

                shadow.addEventListener('click', e => this.handleClick(e), { capture: true });

            } catch (e) {

                console.error('SettingsPanel.render error:', e);

            }

        }

        handleClick(e) {

            e.stopPropagation();

            const target = e.target;

            const list = this.panel.shadowRoot.querySelector('#engine-list');

            const panelContent = this.panel.shadowRoot.querySelector('.settings-panel');

            if (target.classList.contains('add-btn')) {

                let name = lang === 'zh-CN' ? '新搜索引擎' : 'New Search Engine';

                let url = 'https://example.com/search?q=%s';

                const engineConfig = getEngineConfigFromCurrentPage();

                if (engineConfig) {

                    name = engineConfig.name;

                    url = engineConfig.url;

                }

                this.searchHub.addEngineItem(list, name, url);

                panelContent.scrollTop = panelContent.scrollHeight;

                if (DEBUG) console.log('Added new engine item:', { name, url });

            } else if (target.classList.contains('save-btn')) {

                const engines = [];

                let valid = true;

                const items = list.querySelectorAll('.engine-item');

                items.forEach(item => {

                    const name = item.querySelector('input[type="text"]')?.value.trim();

                    const url = item.querySelector('input[type="url"]')?.value.trim();

                    if (!name || !url) {

                        console.warn('Engine validation failed: Name or URL empty', { name, url });

                        alert(i18n[lang].alertRequired);

                        valid = false;

                        return;

                    }

                    if (!/%s/.test(url)) {

                        console.warn('Engine validation failed: URL missing %s placeholder', url);

                        alert(i18n[lang].alertUrlFormat);

                        valid = false;

                        return;

                    }

                    try {

                        new URL(url.replace('%s', 'test'));

                        engines.push({ id: item.dataset.id, name, url });

                        if (DEBUG) console.log('Saving engine:', { id: item.dataset.id, name, url });

                    } catch {

                        console.warn('Engine validation failed: Invalid URL', url);

                        alert(i18n[lang].alertInvalidUrl);

                        valid = false;

                    }

                });

                if (valid) {

                    this.searchHub.engines = engines;

                    if (safeSetStorage(CONFIG.STORAGE_KEY, engines)) {

                        if (DEBUG) console.log('Engines saved:', engines);

                    }

                    this.close();

                    setTimeout(() => {

                        this.searchHub.toolbar.render();

                        if (DEBUG) console.log('Toolbar re-rendered after save');

                    }, 100);

                }

            } else if (target.classList.contains('close-btn')) {

                this.close();

            } else if (target.classList.contains('move-up') || target.classList.contains('move-down')) {

                const item = target.closest('.engine-item');

                if (target.classList.contains('move-up')) {

                    item.previousElementSibling?.before(item);

                } else {

                    item.nextElementSibling?.after(item);

                }

                const items = list.querySelectorAll('.engine-item');

                items.forEach((el, i) => {

                    el.querySelector('.move-up').disabled = i === 0;

                    el.querySelector('.move-down').disabled = i === items.length - 1;

                });

                if (DEBUG) console.log('Engine item moved:', target.classList.contains('move-up') ? 'up' : 'down');

            } else if (target.classList.contains('delete')) {

                const items = list.querySelectorAll('.engine-item');

                if (items.length <= 1) {

                    console.warn('Cannot delete: At least one engine required');

                    alert(i18n[lang].alertMinEngines);

                    return;

                }

                target.closest('.engine-item').remove();

                if (DEBUG) console.log('Engine item deleted');

            }

        }

        close() {

            if (this.panel) {

                this.panel.remove();

                if (DEBUG) console.log('Settings panel closed');

            }

            this.panel = null;

        }

    }

    // 工具栏类

    class Toolbar {

        constructor(searchHub) {

            this.searchHub = searchHub;

            this.toolbarClickHandler = null;

            this.styleElement = null;

        }

        render() {

            const start = performance.now();

            try {

                const isSearchPage = SearchDetector.isSearchPage();
const url = new URL(location.href);
const params = new URLSearchParams(url.search);

const isPredefined = SearchDetector.isPredefinedDomain(url, params);
const isCustom = SearchDetector.isCustomEngineMatch(url, params);
const hasCommonQuery = SearchDetector.config.commonQueryParams.some(p => params.has(p) && params.get(p).trim());

const shouldShowToolbar = isPredefined || isCustom || hasCommonQuery

let toolbarContainer = document.querySelector('#search-hub-toolbar-container');
if (!isSearchPage || !shouldShowToolbar) {
    if (toolbarContainer) toolbarContainer.remove();
    if (DEBUG) console.log('Toolbar hidden:', { isSearchPage, isPredefined, isCustom, hasCommonQuery });
    return;
}

                if (!toolbarContainer) {

                    toolbarContainer = document.createElement('div');

                    toolbarContainer.id = 'search-hub-toolbar-container';

                    toolbarContainer.setAttribute('translate', 'no');

                    document.body.appendChild(toolbarContainer);

                    const shadow = toolbarContainer.attachShadow({ mode: 'open' });

                    this.styleElement = document.createElement('style');

                    this.styleElement.textContent = TOOLBAR_CSS;

                    const toolbar = document.createElement('div');

                    toolbar.id = 'search-hub-toolbar';

                    shadow.appendChild(this.styleElement);

                    shadow.appendChild(toolbar);

                    if (DEBUG) console.log('Toolbar CSS loaded');

                }

                const toolbar = toolbarContainer.shadowRoot.querySelector('#search-hub-toolbar');

                const savedPosition = safeGetStorage(CONFIG.POSITION_KEY, 'bottom');

                toolbar.setAttribute('data-position', savedPosition);

                toolbar.innerHTML = `

                    ${this.searchHub.engines.map(e => `

                        <button class="engine-btn" data-id="${sanitize(e.id)}" data-url="${sanitize(e.url)}">

                            ${sanitize(e.name)}

                        </button>

                    `).join('')}

                    <button class="engine-btn settings-btn">⚙️</button>

                `;

                if (this.toolbarClickHandler) {

                    toolbar.removeEventListener('click', this.toolbarClickHandler, { capture: true });

                }

                this.toolbarClickHandler = (e) => {

                    e.preventDefault();

                    e.stopPropagation();

                    const target = e.target.closest('button');

                    if (!target) return;

                    if (target.classList.contains('settings-btn')) {

                        if (DEBUG) console.log('Settings button clicked, toggling settings');

                        this.searchHub.toggleSettings();

                    } else if (target.classList.contains('engine-btn')) {

                        const query = SearchDetector.getQuery();

                        if (!query) {

                            console.warn('Query empty, cannot navigate:', location.href);

                            alert(i18n[lang].alertNoEngineConfig);

                            return;

                        }

                        if (!target.dataset.url.match(/^https?:\/\/.*%s/)) {

                            console.warn('Invalid URL, must include http(s) and %s:', target.dataset.url);

                            alert(i18n[lang].alertInvalidUrl);

                            return;

                        }

                        let searchUrl = target.dataset.url.replace('%s', encodeURIComponent(query));

                        const url = new URL(location.href);

                        const params = new URLSearchParams(url.search);

                        if (params.has('language')) {

                            const lang = params.get('language');

                            if (target.dataset.url.includes('google.com')) {

                                searchUrl += `&hl=${lang === 'zh' ? 'zh-CN' : lang}&tbs=lr:lang_1${lang === 'zh' ? 'zh-CN' : lang}`;

                            } else if (target.dataset.url.includes('bing.com')) {

                                searchUrl += `&mkt=${lang === 'zh' ? 'zh-CN' : lang}`;

                            }

                        }

                        if (DEBUG) console.log('Navigating to:', searchUrl);

                        window.open(searchUrl, '_blank');

                    }

                };

                toolbar.addEventListener('click', this.toolbarClickHandler, { capture: true });

                let dragStart = null;

                function startDrag(x, y, e) {

                    e.preventDefault();

                    e.stopPropagation();

                    dragStart = { x, y };

                    toolbar.classList.add('dragging');

                    if (DEBUG) console.log('Drag started:', { x, y });

                }

                function moveDrag(x, y) {

                    const moveStart = performance.now();

                    if (!dragStart) return;

                    const deltaX = x - dragStart.x;

                    const deltaY = y - dragStart.y;

                    requestAnimationFrame(() => {

                        toolbar.style.setProperty('--drag-x', `${deltaX}px`);

                        toolbar.style.setProperty('--drag-y', `${deltaY}px`);

                        if (DEBUG) console.log(`moveDrag took: ${performance.now() - moveStart}ms`);

                    });

                }

                const throttledMoveDrag = throttle(moveDrag, 16);

                function endDrag(x, y) {

                    if (!dragStart) return;

                    toolbar.classList.remove('dragging');

                    toolbar.style.removeProperty('--drag-x');

                    toolbar.style.removeProperty('--drag-y');

                    requestAnimationFrame(() => {

                        const { innerWidth, innerHeight } = window;

                        const threshold = Math.min(innerWidth, innerHeight) * 0.1;

                        let pos = 'bottom';

                        if (y < threshold) pos = 'top';

                        else if (y > innerHeight - threshold) pos = 'bottom';

                        else if (x < threshold) pos = 'left';

                        else if (x > innerWidth - threshold) pos = 'right';

                        toolbar.setAttribute('data-position', pos);

                        setTimeout(() => {

                            safeSetStorage(CONFIG.POSITION_KEY, pos);

                            if (DEBUG) console.log('Drag ended, position:', pos);

                        }, 0);

                    });

                    dragStart = null;

                }

                toolbar.addEventListener('mousedown', e => {

                    if (e.target.closest('button')) return;

                    startDrag(e.clientX, e.clientY, e);

                    document.addEventListener('mousemove', onMouseMove, { passive: true });

                    document.addEventListener('mouseup', onMouseUp, { passive: true });

                }, { passive: false });

                function onMouseMove(e) {

                    throttledMoveDrag(e.clientX, e.clientY);

                }

                function onMouseUp(e) {

                    endDrag(e.clientX, e.clientY);

                    document.removeEventListener('mousemove', onMouseMove);

                    document.removeEventListener('mouseup', onMouseUp);

                }

                toolbar.addEventListener('touchstart', e => {

                    if (e.target.closest('button')) return;

                    const touch = e.touches[0];

                    startDrag(touch.clientX, touch.clientY, e);

                }, { passive: false });

                toolbar.addEventListener('touchmove', e => {

                    const touch = e.touches[0];

                    throttledMoveDrag(touch.clientX, touch.clientY);

                }, { passive: true });

                toolbar.addEventListener('touchend', e => {

                    const touch = e.changedTouches[0];

                    endDrag(touch.clientX, touch.clientY);

                }, { passive: true });

                if (DEBUG) console.log('Toolbar rendered successfully');

            } catch (e) {

                console.error('Toolbar.render error:', e);

            } finally {

                if (DEBUG) console.log(`renderToolbar took: ${performance.now() - start}ms`);

            }

        }

    }

    // 主类

    class SearchHub {

        constructor() {
            try {

                this.engines = safeGetStorage(CONFIG.STORAGE_KEY, [

                    { id: generateId(), name: 'Google', url: 'https://www.google.com/search?q=%s' },

                    { id: generateId(), name: 'Bing', url: 'https://www.bing.com/search?q=%s' },

                    { id: generateId(), name: 'Baidu', url: 'https://www.baidu.com/s?wd=%s' },

                    { id: generateId(), name: 'Yandex', url: 'https://www.yandex.com/search?text=%s' },

                    { id: generateId(), name: 'Yahoo', url: 'https://search.yahoo.com/search?p=%s' },

                ]);

                if (!safeGetStorage(CONFIG.STORAGE_KEY, null)) {

                    safeSetStorage(CONFIG.STORAGE_KEY, this.engines);

                }

            } catch (e) {

                console.error('SearchHub constructor error:', e);

                this.engines = [

                    { id: generateId(), name: 'Google', url: 'https://www.google.com/search?q=%s' },

                    { id: generateId(), name: 'Bing', url: 'https://www.bing.com/search?q=%s' },

                ];

            }

            this.toolbar = new Toolbar(this);

            this.init();

        }

        init() {

            SearchDetector.init();

            setTimeout(() => {

                if (SearchDetector.isSearchPage()) {

                    this.toolbar.render();

                    if (DEBUG) console.log('Toolbar rendered with delay');

                }

            }, 100);

            this.bindKeyboard();

            this.observePageChanges();

            try {

                GM_registerMenuCommand(i18n[lang].menuAddEngine, () => this.addCurrentPageAsEngine());

            } catch (e) {

                console.error('Failed to register menu command:', e);

            }

        }

        bindKeyboard() {

            this.keyboardHandler = (e) => {

                if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {

                    e.preventDefault();

                    this.toggleSettings();

                    if (DEBUG) console.log('Keyboard shortcut triggered: Ctrl+Shift+S');

                }

            };

            document.addEventListener('keydown', this.keyboardHandler);

        }

        observePageChanges() {

            const updateToolbar = debounce(() => {

                const isSearchPage = SearchDetector.isSearchPage();

                const toolbarExists = !!document.querySelector('#search-hub-toolbar-container');

                if (isSearchPage && !toolbarExists) {

                    this.toolbar.render();

                    if (DEBUG) console.log('Toolbar rendered due to page change');

                } else if (!isSearchPage && toolbarExists) {

                    document.querySelector('#search-hub-toolbar-container')?.remove();

                    if (DEBUG) console.log('Toolbar removed due to non-search page');

                }

            }, CONFIG.DEBOUNCE_MS);

            const observerTarget = document.querySelector('form') || document.querySelector('main') || document.body;

            const observer = new MutationObserver(mutations => {

                const isSearchRelated = mutations.some(mutation =>

                    Array.from(mutation.addedNodes).some(node =>

                        node.nodeType === 1 && (node.matches('form') || node.querySelector(SearchDetector.inputSelector))

                    ) ||

                    Array.from(mutation.removedNodes).some(node =>

                        node.nodeType === 1 && (node.matches('form') || node.querySelector(SearchDetector.inputSelector))

                    )

                );

                if (isSearchRelated) {

                    updateToolbar();

                    if (DEBUG) console.log('Page change detected, updating toolbar');

                }

            });

            observer.observe(observerTarget, { childList: true, subtree: false });

            if (DEBUG) console.log('Page change observer initialized on:', observerTarget.tagName);

            window.addEventListener('popstate', () => setTimeout(updateToolbar, 100));

            ['pushState', 'replaceState'].forEach(method => {

                const original = history[method];

                history[method] = (...args) => {

                    original.apply(history, args);

                    setTimeout(updateToolbar, 100);

                };

            });

        }

        toggleSettings() {

            const existingPanel = document.querySelector('#settings-panel-container');

            if (existingPanel) {

                this.closeSettings();

                if (DEBUG) console.log('Settings panel closed via toggle');

            } else {

                try {

                    const settingsPanel = new SettingsPanel(this);

                    settingsPanel.render();

                    if (DEBUG) console.log('Settings panel opened successfully');

                } catch (e) {

                    console.error('Failed to open settings panel:', e);

                }

            }

        }

        closeSettings() {

            const panel = document.querySelector('#settings-panel-container');

            if (panel) {

                panel.remove();

                if (DEBUG) console.log('Settings panel removed');

            }

        }

        addEngineItem(list, name = lang === 'zh-CN' ? '新搜索引擎' : 'New Search Engine', url = 'https://example.com/search?q=%s', id = generateId()) {

            const item = document.createElement('div');

            item.className = 'engine-item';

            item.dataset.id = id;

            item.innerHTML = `

                <div class="name-row">

                    <input type="text" value="${sanitize(name)}" placeholder="${i18n[lang].namePlaceholder}" required>

                    <div class="actions">

                        <button class="action-btn move-up">↑</button>

                        <button class="action-btn move-down">↓</button>

                        <button class="action-btn delete">×</button>

                    </div>

                </div>

                <input class="url-input" type="url" value="${sanitize(url)}" placeholder="${i18n[lang].urlPlaceholder}" required>

            `;

            list.appendChild(item);

            if (DEBUG) console.log('Added engine item:', { name, url, id });

            return item;

        }

        addCurrentPageAsEngine() {

            const engineConfig = getEngineConfigFromCurrentPage();

            if (!engineConfig) return;

            this.toggleSettings();
            const panel = document.querySelector('#settings-panel-container');

            if (panel) {

                const list = panel.shadowRoot.querySelector('#engine-list');

                this.addEngineItem(list, engineConfig.name, engineConfig.url);

                panel.scrollTop = panel.scrollHeight;

                if (DEBUG) console.log('Added current page as engine:', engineConfig);

            }

        }

    }

    // 初始化

    function init() {

        try {

            new SearchHub();

            if (DEBUG) console.log('SearchHub initialized');

        } catch (e) {

            console.error('SearchHub initialization error:', e);

        }

    }

    init();

})();
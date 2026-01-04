// ==UserScript==
// @name         表情符号助手 Pro (Emoji Helper Pro)
// @namespace    https://github.com/TechnologyStar/Emperor-Qin-Shi-Huang-Expression-Pack-Assistant
// @version      1.2.0
// @description  终极表情助手
// @author       TechnologyStar
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect        api.giphy.com
// @connect        tenor.googleapis.com
// @connect        media.tenor.com
// @connect        cdnjs.cloudflare.com
// @connect        cdn.jsdelivr.net
// @connect        unpkg.com

// @downloadURL https://update.greasyfork.org/scripts/545019/%E8%A1%A8%E6%83%85%E7%AC%A6%E5%8F%B7%E5%8A%A9%E6%89%8B%20Pro%20%28Emoji%20Helper%20Pro%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545019/%E8%A1%A8%E6%83%85%E7%AC%A6%E5%8F%B7%E5%8A%A9%E6%89%8B%20Pro%20%28Emoji%20Helper%20Pro%29.meta.js
// ==/UserScript==

(function() {
    // 网站白名单检测 - 添加这部分代码
    const allowedSites = [
        'github.com',
        'linux.do',
        'reddit.com'
        // 在这里添加你想要启用的网站域名
    ];

    const currentHost = window.location.hostname;
    const isAllowed = allowedSites.some(site =>
                                        currentHost === site || currentHost.endsWith('.' + site)
                                       );

    if (!isAllowed) {
        console.log('表情助手：当前网站不在允许列表中');
        return; // 退出脚本执行
    }
    // 网站检测结束
    'use strict';

    // 防止在iframe中重复执行
    if (window.top !== window.self) return;

    // 防止重复加载
    if (window.EmojiHelperProLoaded) {
        console.warn('EmojiHelper Pro 已加载，跳过重复初始化');
        return;
    }
    window.EmojiHelperProLoaded = true;

    // 🚀 详细日志系统
    const Logger = {
        levels: {
            ERROR: 0,
            WARN: 1,
            INFO: 2,
            DEBUG: 3,
            TRACE: 4
        },

        categories: {
            STORAGE: { name: 'Storage', color: '#4CAF50', emoji: '💾' },
            CONFIG: { name: 'Config', color: '#2196F3', emoji: '⚙️' },
            CLOUD: { name: 'CloudData', color: '#FF9800', emoji: '☁️' },
            SEARCH: { name: 'Search', color: '#9C27B0', emoji: '🔍' },
            UI: { name: 'UI', color: '#00BCD4', emoji: '🎨' },
            EVENT: { name: 'Event', color: '#FF5722', emoji: '🎯' },
            CACHE: { name: 'Cache', color: '#795548', emoji: '🗂️' },
            UPDATE: { name: 'Update', color: '#607D8B', emoji: '🔄' },
            INIT: { name: 'Init', color: '#E91E63', emoji: '🚀' },
            ERROR: { name: 'Error', color: '#F44336', emoji: '❌' }
        },

        currentLevel: 3,
        history: [],
        maxHistorySize: 500,

        _log(level, category, message, data = null) {
            if (level > this.currentLevel) return;

            const timestamp = new Date().toISOString();
            const cat = this.categories[category] || this.categories.INFO;
            const levelNames = ['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'];
            const levelName = levelNames[level];

            const logEntry = {
                timestamp,
                level: levelName,
                category: cat.name,
                message,
                data: data ? this._safeClone(data) : null
            };

            this.history.push(logEntry);
            if (this.history.length > this.maxHistorySize) {
                this.history.shift();
            }

            const consoleMessage = `%c${cat.emoji} [${cat.name}] %c${message}`;
            const styles = [
                `color: ${cat.color}; font-weight: bold;`,
                'color: inherit; font-weight: normal;'
            ];

            switch(level) {
                case this.levels.ERROR:
                    console.error(consoleMessage, ...styles, data);
                    break;
                case this.levels.WARN:
                    console.warn(consoleMessage, ...styles, data);
                    break;
                case this.levels.INFO:
                    console.info(consoleMessage, ...styles, data);
                    break;
                default:
                    console.log(consoleMessage, ...styles, data);
                    break;
            }
        },

        _safeClone(obj) {
            try {
                return JSON.parse(JSON.stringify(obj));
            } catch {
                return String(obj);
            }
        },

        error(category, message, data) { this._log(this.levels.ERROR, category, message, data); },
        warn(category, message, data) { this._log(this.levels.WARN, category, message, data); },
        info(category, message, data) { this._log(this.levels.INFO, category, message, data); },
        debug(category, message, data) { this._log(this.levels.DEBUG, category, message, data); },
        trace(category, message, data) { this._log(this.levels.TRACE, category, message, data); },

        setLevel(level) {
            this.currentLevel = typeof level === 'string' ? this.levels[level.toUpperCase()] : level;
            this.info('CONFIG', `日志级别设置为: ${Object.keys(this.levels)[this.currentLevel]}`);
        },

        getHistory(category = null, level = null) {
            let filtered = this.history;

            if (category) {
                filtered = filtered.filter(log => log.category === category);
            }

            if (level) {
                const levelValue = typeof level === 'string' ? this.levels[level.toUpperCase()] : level;
                filtered = filtered.filter(log => this.levels[log.level] === levelValue);
            }

            return filtered;
        },

        clearHistory() {
            const count = this.history.length;
            this.history = [];
            this.info('CONFIG', `清理了 ${count} 条日志记录`);
        },

        exportLogs() {
            try {
                const logs = JSON.stringify(this.history, null, 2);
                const blob = new Blob([logs], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `emoji-helper-logs-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                this.info('CONFIG', '日志已导出');
            } catch (error) {
                this.error('CONFIG', '日志导出失败', error);
            }
        }
    };

    // 🔥 极简存储管理器 - 三重保险
    const Storage = {
        prefix: 'EmojiHelper_',
        memCache: new Map(),

        get(key, defaultVal) {
            const fullKey = this.prefix + key;

            // 先检查内存缓存
            if (this.memCache.has(key)) {
                Logger.trace('STORAGE', `内存缓存读取 ${key}`, this.memCache.get(key));
                return this.memCache.get(key);
            }

            try {
                const val = GM_getValue(fullKey);
                if (val !== undefined) {
                    this.memCache.set(key, val);
                    Logger.trace('STORAGE', `GM读取 ${key}`, val);
                    return val;
                }
            } catch(e) {
                Logger.warn('STORAGE', `GM读取失败: ${key}`, e.message);
            }

            try {
                const val = localStorage.getItem(fullKey);
                if (val !== null) {
                    const parsed = JSON.parse(val);
                    this.memCache.set(key, parsed);
                    Logger.trace('STORAGE', `localStorage读取 ${key}`, parsed);
                    return parsed;
                }
            } catch(e) {
                Logger.warn('STORAGE', `localStorage读取失败: ${key}`, e.message);
            }

            Logger.debug('STORAGE', `使用默认值 ${key}`, defaultVal);
            return defaultVal;
        },

        set(key, value) {
            const fullKey = this.prefix + key;
            let saved = false;

            // 更新内存缓存
            this.memCache.set(key, value);

            try {
                GM_setValue(fullKey, value);
                if (GM_getValue(fullKey) === value) {
                    Logger.trace('STORAGE', `GM保存成功 ${key}`, value);
                    saved = true;
                }
            } catch(e) {
                Logger.warn('STORAGE', `GM保存失败: ${key}`, e.message);
            }

            try {
                localStorage.setItem(fullKey, JSON.stringify(value));
                if (!saved) {
                    Logger.trace('STORAGE', `localStorage保存 ${key}`, value);
                }
            } catch(e) {
                Logger.warn('STORAGE', `localStorage保存失败: ${key}`, e.message);
            }

            return true;
        },

        clearAll() {
            const keys = [];

            // 清理GM存储
            try {
                // 获取所有GM存储的键
                const gmKeys = [];
                for (let i = 0; i < 200; i++) {
                    const key = this.prefix + i;
                    if (GM_getValue(key) !== undefined) {
                        GM_setValue(key, undefined);
                        gmKeys.push(key);
                    }
                }
                keys.push(...gmKeys);
            } catch(e) {
                Logger.warn('STORAGE', 'GM清理失败', e.message);
            }

            // 清理localStorage
            try {
                for (let i = localStorage.length - 1; i >= 0; i--) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith(this.prefix)) {
                        localStorage.removeItem(key);
                        keys.push(key);
                    }
                }
            } catch(e) {
                Logger.warn('STORAGE', 'localStorage清理失败', e.message);
            }

            // 清理内存缓存
            this.memCache.clear();

            Logger.info('STORAGE', `清理了 ${keys.length} 个存储项`);
            return keys.length;
        }
    };

    // 🎯 配置管理器
    const Config = {
        defaults: {
            lang: 'zh-CN',
            theme: 'light',
            autoInsert: true,
            gifSize: 'medium',
            searchEngine: 'giphy',
            dataVersion: '1.0',
            autoUpdate: true,
            lastUpdateCheck: 0,
            showFloatingButton: true,
            panelPosition: { x: 20, y: 86 },
            settingsPanelPosition: { x: 450, y: 86 },
            editorPosition: { x: 'center', y: 'center' },
            logLevel: 'WARN',
            customUpdateUrl: 'https://raw.githubusercontent.com/TechnologyStar/Emperor-Qin-Shi-Huang-Expression-Pack-Assistant/refs/heads/main/neo.json',
            enableDetailedLogs: true,
            cacheSize: 100
        },

        cache: {},

        init() {
            Object.keys(this.defaults).forEach(key => {
                this.cache[key] = Storage.get(key, this.defaults[key]);
            });

            Logger.setLevel(this.cache.logLevel);
            Logger.info('CONFIG', '配置初始化完成', this.cache);
        },

        get(key) {
            return this.cache[key];
        },

        set(key, value) {
            const oldValue = this.cache[key];
            if (oldValue === value) return false;

            this.cache[key] = value;
            Storage.set(key, value);

            Logger.debug('CONFIG', `配置更新 ${key}: ${oldValue} -> ${value}`);
            this.onConfigChange(key, value, oldValue);
            return true;
        },

        onConfigChange(key, newValue, oldValue) {
            try {
                switch(key) {
                    case 'theme':
                        applyTheme();
                        break;
                    case 'lang':
                        updateAllText();
                        break;
                    case 'gifSize':
                        refreshCurrentView();
                        break;
                    case 'searchEngine':
                        clearGifCache();
                        break;
                    case 'showFloatingButton':
                        updateFloatingButtonVisibility();
                        break;
                    case 'panelPosition':
                        updatePanelPosition();
                        break;
                    case 'settingsPanelPosition':
                        updateSettingsPanelPosition();
                        break;
                    case 'logLevel':
                        Logger.setLevel(newValue);
                        break;
                    case 'customUpdateUrl':
                        Logger.info('CONFIG', '更新源地址已修改', newValue);
                        break;
                }
            } catch (error) {
                Logger.error('CONFIG', '配置变更处理失败', { key, newValue, error });
            }
        },

        reset() {
            Logger.info('CONFIG', '重置所有配置');
            Object.keys(this.defaults).forEach(key => {
                this.set(key, this.defaults[key]);
            });
            showMessage('设置已重置');
        }
    };

    // 🗂️ 缓存管理器
    const CacheManager = {
        cache: new Map(),

        set(key, value, category = 'default') {
            const cacheKey = `${category}:${key}`;
            const cacheEntry = {
                value,
                timestamp: Date.now(),
                category
            };

            this.cache.set(cacheKey, cacheEntry);
            Logger.trace('CACHE', `缓存设置: ${cacheKey}`, value);

            this.checkCacheLimit();
        },

        get(key, category = 'default') {
            const cacheKey = `${category}:${key}`;
            const entry = this.cache.get(cacheKey);

            if (entry) {
                Logger.trace('CACHE', `缓存命中: ${cacheKey}`);
                return entry.value;
            }

            Logger.trace('CACHE', `缓存未命中: ${cacheKey}`);
            return null;
        },

        has(key, category = 'default') {
            const cacheKey = `${category}:${key}`;
            return this.cache.has(cacheKey);
        },

        delete(key, category = 'default') {
            const cacheKey = `${category}:${key}`;
            const deleted = this.cache.delete(cacheKey);
            if (deleted) {
                Logger.debug('CACHE', `缓存删除: ${cacheKey}`);
            }
            return deleted;
        },

        clear(category = null) {
            if (category) {
                const keysToDelete = [];
                for (const [key, entry] of this.cache.entries()) {
                    if (entry.category === category) {
                        keysToDelete.push(key);
                    }
                }
                keysToDelete.forEach(key => this.cache.delete(key));
                Logger.info('CACHE', `清理分类缓存: ${category}, 删除 ${keysToDelete.length} 项`);
            } else {
                const size = this.cache.size;
                this.cache.clear();
                Logger.info('CACHE', `清理所有缓存, 删除 ${size} 项`);
            }
        },

        checkCacheLimit() {
            const limit = Config.get('cacheSize');
            if (this.cache.size > limit) {
                const entries = Array.from(this.cache.entries());
                entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

                const deleteCount = this.cache.size - limit + 10;
                for (let i = 0; i < deleteCount && i < entries.length; i++) {
                    this.cache.delete(entries[i][0]);
                }

                Logger.debug('CACHE', `缓存大小超限，删除了 ${deleteCount} 个最旧条目`);
            }
        },

        getStats() {
            const stats = {
                totalSize: this.cache.size,
                categories: {}
            };

            for (const [key, entry] of this.cache.entries()) {
                if (!stats.categories[entry.category]) {
                    stats.categories[entry.category] = 0;
                }
                stats.categories[entry.category]++;
            }

            return stats;
        }
    };

    // 🌐 多语言
    const i18n = {
        'zh-CN': {
            title: '表情助手',
            settings: '设置',
            search: '搜索表情、GIF...',
            searchBtn: '搜索',
            categories: {
                all: '全部',
                custom: '我的GIF',
                smileys: '表情符号',
                webGif: '网络GIF'
            },
            settingsPanel: {
                title: '设置面板',
                language: '界面语言',
                theme: '主题',
                autoInsert: '选择后自动关闭面板',
                gifSize: 'GIF显示尺寸',
                searchEngine: 'GIF搜索引擎',
                close: '关闭',
                reset: '重置设置',
                dataVersion: '数据版本',
                autoUpdate: '自动更新数据',
                updateNow: '立即更新',
                lastUpdate: '上次更新',
                showFloatingButton: '显示浮动按钮',
                logLevel: '日志级别',
                customUpdateUrl: '自定义更新源',
                enableDetailedLogs: '启用详细日志',
                cacheSize: '缓存大小限制',
                clearCache: '清理缓存',
                clearAllData: '清理所有数据',
                exportLogs: '导出日志',
                advanced: '高级设置'
            },
            textEditor: {
                title: '文字编辑器',
                addText: '添加文字',
                text: '文字内容',
                textPlaceholder: '输入你想添加的文字...',
                fontSize: '字体大小',
                fontFamily: '字体类型',
                textColor: '文字颜色',
                position: '文字位置',
                positions: {
                    top: '顶部',
                    center: '居中',
                    bottom: '底部'
                },
                generate: '复制图片',
                download: '下载',
                close: '关闭',
                dragHint: '可拖拽到任意位置使用',
                copyHint: '右键复制图片也可使用'
            },
            themes: {
                light: '浅色',
                dark: '深色'
            },
            sizes: {
                small: '小',
                medium: '中',
                large: '大'
            },
            logLevels: {
                ERROR: '错误',
                WARN: '警告',
                INFO: '信息',
                DEBUG: '调试',
                TRACE: '追踪'
            },
            messages: {
                copied: '已复制到剪贴板！',
                noResults: '没有找到相关内容',
                searching: '搜索中...',
                settingsSaved: '设置已保存！',
                settingsReset: '设置已重置！',
                searchHint: '输入关键词搜索GIF',
                apiError: '网络搜索失败，请稍后重试',
                updateSuccess: '数据更新成功！',
                updateFailed: '数据更新失败',
                updateChecking: '检查更新中...',
                noUpdate: '已是最新版本',
                imageGenerated: '图片生成成功！可拖拽或右键复制使用',
                imageError: '图片生成失败',
                cacheCleared: '缓存已清理',
                dataCleared: '所有数据已清理',
                logsExported: '日志已导出',
                invalidUpdateUrl: '更新源地址无效'
            }
        },
        'en': {
            title: 'Emoji Helper',
            settings: 'Settings',
            search: 'Search emoji, GIF...',
            searchBtn: 'Search',
            categories: {
                all: 'All',
                custom: 'My GIFs',
                smileys: 'Emojis',
                webGif: 'Web GIFs'
            },
            settingsPanel: {
                title: 'Settings Panel',
                language: 'Language',
                theme: 'Theme',
                autoInsert: 'Auto close after selection',
                gifSize: 'GIF display size',
                searchEngine: 'GIF search engine',
                close: 'Close',
                reset: 'Reset Settings',
                dataVersion: 'Data Version',
                autoUpdate: 'Auto Update Data',
                updateNow: 'Update Now',
                lastUpdate: 'Last Update',
                showFloatingButton: 'Show Floating Button',
                logLevel: 'Log Level',
                customUpdateUrl: 'Custom Update URL',
                enableDetailedLogs: 'Enable Detailed Logs',
                cacheSize: 'Cache Size Limit',
                clearCache: 'Clear Cache',
                clearAllData: 'Clear All Data',
                exportLogs: 'Export Logs',
                advanced: 'Advanced Settings'
            },
            textEditor: {
                title: 'Text Editor',
                addText: 'Add Text',
                text: 'Text Content',
                textPlaceholder: 'Enter text to add...',
                fontSize: 'Font Size',
                fontFamily: 'Font Family',
                textColor: 'Text Color',
                position: 'Text Position',
                positions: {
                    top: 'Top',
                    center: 'Center',
                    bottom: 'Bottom'
                },
                generate: 'Copy Image',
                download: 'Download',
                close: 'Close',
                dragHint: 'Draggable to any position',
                copyHint: 'Right-click copy image also works'
            },
            themes: {
                light: 'Light',
                dark: 'Dark'
            },
            sizes: {
                small: 'Small',
                medium: 'Medium',
                large: 'Large'
            },
            logLevels: {
                ERROR: 'Error',
                WARN: 'Warning',
                INFO: 'Info',
                DEBUG: 'Debug',
                TRACE: 'Trace'
            },
            messages: {
                copied: 'Copied to clipboard!',
                noResults: 'No results found',
                searching: 'Searching...',
                settingsSaved: 'Settings saved!',
                settingsReset: 'Settings reset!',
                searchHint: 'Enter keywords to search GIFs',
                apiError: 'Network search failed, please try again',
                updateSuccess: 'Data updated successfully!',
                updateFailed: 'Data update failed',
                updateChecking: 'Checking for updates...',
                noUpdate: 'Already up to date',
                imageGenerated: 'Image generated successfully! Draggable or right-click to copy',
                imageError: 'Image generation failed',
                cacheCleared: 'Cache cleared',
                dataCleared: 'All data cleared',
                logsExported: 'Logs exported',
                invalidUpdateUrl: 'Invalid update URL'
            }
        }
    };

    const t = () => i18n[Config.get('lang')] || i18n['zh-CN'];

    // 全局变量
    let emojiPanel = null;
    let settingsPanel = null;
    let textEditorPanel = null;
    let floatingButton = null;
    let webGifCache = new Map();
    let isSearching = false;
    let searchRequestId = 0;
    let currentEditingImage = null;

    // 拖拽相关变量
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let currentDragElement = null;

    // 默认自定义GIF（本地备份）
    let customGifs = [
        {
            name: 'cat-wave',
            url: 'https://file.woodo.cn/upload/image/201910/25/c7eb21a4-7693-4836-b23a-5ab3c9e1813d.gif',
            alt: '招手猫',
            keywords: ['猫', '招手', 'cat', 'wave', 'hello', '你好', '嗨']
        },
        {
            name: 'hello-cat',
            url: 'https://c-ssl.duitang.com/uploads/item/202001/11/20200111042746_kmmjw.gif',
            alt: '你好猫',
            keywords: ['猫', '你好', 'cat', 'hello', 'hi', '问候', '打招呼']
        },
        {
            name: 'thumbs-up',
            url: 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif',
            alt: '点赞',
            keywords: ['点赞', '赞', '好', 'thumbs', 'up', 'good', 'nice', '棒']
        },
        {
            name: 'happy-dance',
            url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
            alt: '开心舞蹈',
            keywords: ['开心', '舞蹈', '高兴', 'happy', 'dance', 'excited', 'party']
        }
    ];

    // 表情符号
    const defaultEmojis = ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];

    // 🔄 云数据更新管理器
    const CloudDataManager = {
        getUpdateUrl() {
            return Config.get('customUpdateUrl');
        },

        validateUpdateUrl(url) {
            try {
                const urlObj = new URL(url);
                return ['https:', 'http:'].includes(urlObj.protocol);
            } catch {
                return false;
            }
        },

        async checkAndUpdate(forceUpdate = false) {
            try {
                Logger.info('UPDATE', '开始检查更新', { force: forceUpdate });

                if (!forceUpdate) {
                    if (!Config.get('autoUpdate')) {
                        Logger.info('UPDATE', '自动更新已禁用');
                        return false;
                    }

                    const lastCheck = Config.get('lastUpdateCheck');
                    const now = Date.now();
                    if (now - lastCheck < 24 * 60 * 60 * 1000) {
                        Logger.debug('UPDATE', '距离上次检查不足24小时', {
                            lastCheck: new Date(lastCheck).toLocaleString(),
                            nextCheck: new Date(lastCheck + 24 * 60 * 60 * 1000).toLocaleString()
                        });
                        return false;
                    }
                }

                const updateUrl = this.getUpdateUrl();
                if (!this.validateUpdateUrl(updateUrl)) {
                    Logger.error('UPDATE', '更新源地址无效', updateUrl);
                    if (forceUpdate) {
                        showMessage(t().messages.invalidUpdateUrl);
                    }
                    return false;
                }

                const cloudData = await this.fetchCloudData(updateUrl);
                if (!cloudData) {
                    Logger.warn('UPDATE', '获取云数据失败');
                    return false;
                }

                const cloudVersion = cloudData.version || '1.0';
                const localVersion = Config.get('dataVersion');

                Logger.info('UPDATE', '版本比较', {
                    local: localVersion,
                    cloud: cloudVersion,
                    updateUrl
                });

                if (forceUpdate || this.isNewerVersion(cloudVersion, localVersion)) {
                    await this.updateLocalData(cloudData);
                    Config.set('dataVersion', cloudVersion);
                    Config.set('lastUpdateCheck', Date.now());

                    showMessage(t().messages.updateSuccess);
                    Logger.info('UPDATE', '数据更新成功', {
                        oldVersion: localVersion,
                        newVersion: cloudVersion,
                        gifCount: cloudData.customGifs?.length || 0
                    });
                    return true;
                } else {
                    Config.set('lastUpdateCheck', Date.now());
                    if (forceUpdate) {
                        showMessage(t().messages.noUpdate);
                    }
                    Logger.info('UPDATE', '已是最新版本', { version: cloudVersion });
                    return false;
                }

            } catch (error) {
                Logger.error('UPDATE', '更新失败', error);
                if (forceUpdate) {
                    showMessage(t().messages.updateFailed);
                }
                return false;
            }
        },

        async fetchCloudData(url) {
            return new Promise((resolve, reject) => {
                Logger.debug('UPDATE', '开始获取云数据', url);

                const timeout = setTimeout(() => {
                    reject(new Error('请求超时'));
                }, 15000);

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    timeout: 15000,
                    onload: (response) => {
                        clearTimeout(timeout);
                        try {
                            Logger.debug('UPDATE', '云数据响应状态', response.status);

                            if (response.status === 200) {
                                const data = JSON.parse(response.responseText);
                                Logger.info('UPDATE', '获取云数据成功', {
                                    version: data.version,
                                    gifCount: data.customGifs?.length || 0,
                                    dataSize: response.responseText.length
                                });
                                resolve(data);
                            } else {
                                Logger.error('UPDATE', `HTTP错误: ${response.status}`);
                                reject(new Error(`HTTP ${response.status}`));
                            }
                        } catch (e) {
                            Logger.error('UPDATE', '解析响应数据失败', e);
                            reject(e);
                        }
                    },
                    onerror: (error) => {
                        clearTimeout(timeout);
                        Logger.error('UPDATE', '请求失败', error);
                        reject(error);
                    },
                    ontimeout: () => {
                        clearTimeout(timeout);
                        Logger.error('UPDATE', '请求超时');
                        reject(new Error('请求超时'));
                    }
                });
            });
        },

        isNewerVersion(cloudVersion, localVersion) {
            const parseVersion = (v) => {
                const cleaned = v.replace(/^v/, '');
                return cleaned.split('.').map(n => parseInt(n) || 0);
            };

            const cloud = parseVersion(cloudVersion);
            const local = parseVersion(localVersion);

            Logger.debug('UPDATE', '版本解析', {
                cloudParsed: cloud,
                localParsed: local
            });

            for (let i = 0; i < Math.max(cloud.length, local.length); i++) {
                const c = cloud[i] || 0;
                const l = local[i] || 0;
                if (c > l) {
                    Logger.debug('UPDATE', '发现新版本', { position: i, cloud: c, local: l });
                    return true;
                }
                if (c < l) {
                    Logger.debug('UPDATE', '云端版本较旧', { position: i, cloud: c, local: l });
                    return false;
                }
            }

            Logger.debug('UPDATE', '版本相同');
            return false;
        },

        async updateLocalData(cloudData) {
            Logger.info('UPDATE', '开始更新本地数据', cloudData);

            if (cloudData.customGifs && Array.isArray(cloudData.customGifs)) {
                const oldCount = customGifs.length;
                customGifs = cloudData.customGifs;
                Storage.set('customGifs', customGifs);

                CacheManager.clear('gif');
                CacheManager.clear('search');

                refreshCurrentView();

                Logger.info('UPDATE', '本地数据已更新', {
                    oldCount,
                    newCount: customGifs.length,
                    added: customGifs.length - oldCount
                });
            } else {
                Logger.warn('UPDATE', '云数据格式无效', cloudData);
            }
        },

        async manualUpdate() {
            showMessage(t().messages.updateChecking);
            Logger.info('UPDATE', '手动检查更新');
            return await this.checkAndUpdate(true);
        }
    };
    /* === EH 工具函数 BEGIN === */
    // 外部库地址
    const EH_GIF_JS_CANDIDATES = [
        'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.min.js',
        'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.min.js',
        'https://unpkg.com/gif.js@0.2.0/dist/gif.min.js'
    ];
    const EH_GIF_WORKER_CANDIDATES = [
        'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.min.js',
        'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.min.js',
        'https://unpkg.com/gif.js@0.2.0/dist/gif.worker.min.js'
    ];
    const EH_GIFUCT_JS_CANDIDATES = [
        'https://cdn.jsdelivr.net/npm/gifuct-js@1.0.2/dist/gifuct.min.js',
        'https://unpkg.com/gifuct-js@1.0.2/dist/gifuct.min.js'
    ];

    // 简单日志别名
    const EH_LOG = { i: (...a)=>console.info('[EH]',...a), w:(...a)=>console.warn('[EH]',...a), e:(...a)=>console.error('[EH]',...a) };
    function eh_withTimeout(promise, ms = 3000) {
        return Promise.race([
            promise,
            new Promise(resolve => setTimeout(() => resolve('__EH_TIMEOUT__'), ms))
        ]);
    }
    // 动态载入脚本（一次）
    async function eh_loadScriptOnce(urlOrList){
        const urls = Array.isArray(urlOrList) ? urlOrList : [urlOrList];
        for (const url of urls) {
            if (window.__eh_loadedLibs && window.__eh_loadedLibs[url]) return;
            try {
                await new Promise((resolve, reject) => {
                    const s = document.createElement('script');
                    s.src = url;
                    s.crossOrigin = 'anonymous';
                    s.onload = () => {
                        window.__eh_loadedLibs = window.__eh_loadedLibs || {};
                        window.__eh_loadedLibs[url] = true;
                        resolve();
                    };
                    s.onerror = (err) => { EH_LOG.w('load lib fail', url, err); reject(err); };
                    document.head.appendChild(s);
                });
                return; // 某个候选加载成功，直接结束
            } catch (e) {
                // 该源失败，继续尝试下一个
            }
        }
        throw new Error('All CDN sources failed');
    }

    // 确保所需库已经加载
    async function eh_ensureLibs(){
        if (!window.GIF) await eh_loadScriptOnce(EH_GIF_JS_CANDIDATES);
        if (!window.gifuct) await eh_loadScriptOnce(EH_GIFUCT_JS_CANDIDATES);
        try {
            if (window.GIF) {
                for (const url of EH_GIF_WORKER_CANDIDATES) {
                    try { window.GIF.prototype.workerScript = url; break; } catch(e) {}
                }
            }
        } catch(e){ EH_LOG.w('set workerScript fail', e); }
    }

    // GM 跨域获取 ArrayBuffer（用于绕过 CORS）
    function eh_gmFetchArrayBuffer(url, timeout=20000){
        return new Promise((resolve, reject) => {
            try {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    responseType: 'arraybuffer',
                    timeout,
                    onload(res){ if (res.status >= 200 && res.status < 300) resolve(res.response); else reject(new Error('HTTP ' + res.status)); },
                    onerror(err){ reject(err); },
                    ontimeout(){ reject(new Error('timeout')); }
                });
            } catch(e) { reject(e); }
        });
    }

    // ArrayBuffer -> objectURL
    function eh_arrayBufferToObjectURL(ab, mime='image/gif'){
        const blob = new Blob([ab], { type: mime });
        return URL.createObjectURL(blob);
    }

    // 尝试用 GM 请求获取资源并返回 objectURL，失败回退原 url
    async function eh_loadImageObjectURL(url){
        try {
            const ab = await eh_gmFetchArrayBuffer(url);
            let mime = 'image/gif';
            if (/\.jpe?g($|\?)/i.test(url)) mime = 'image/jpeg';
            if (/\.png($|\?)/i.test(url)) mime = 'image/png';
            if (/\.webp($|\?)/i.test(url)) mime = 'image/webp';
            return eh_arrayBufferToObjectURL(ab, mime);
        } catch (err) {
            EH_LOG.w('GM fetch failed, fallback to direct URL', err);
            return url;
        }
    }

    // 用 gifuct-js 解析 GIF 帧
    function eh_parseGifFramesFromArrayBuffer(ab){
        const parsed = window.gifuct.parseGIF(ab);
        const frames = window.gifuct.decompressFrames(parsed, true);
        return frames;
    }

    // 将 gifuct-js 的帧合成为全帧 Canvas 列表（简单处理 disposalType==2）
    function eh_framesToCanvases(frames){
        const W = frames[0].dims.width;
        const H = frames[0].dims.height;
        const base = document.createElement('canvas'); base.width = W; base.height = H;
        const ctx = base.getContext('2d');
        ctx.clearRect(0,0,W,H);
        const out = [];
        frames.forEach(frame => {
            const { left, top, width: w, height: h } = frame.dims;
            try {
                const patch = new ImageData(new Uint8ClampedArray(frame.patch), w, h);
                ctx.putImageData(patch, left, top);
            } catch(e) {
                EH_LOG.w('putImageData failed', e);
            }
            const c = document.createElement('canvas'); c.width = W; c.height = H;
            c.getContext('2d').drawImage(base, 0, 0);
            out.push(c);
            if (frame.disposalType === 2) {
                ctx.clearRect(left, top, w, h);
            }
        });
        return out;
    }

    function eh_scaleFrameCanvas(canvas, scale, maxW = 480, maxH = 480){
        const w = Math.min(Math.round(canvas.width * scale), maxW);
        const h = Math.min(Math.round(canvas.height * scale), maxH);
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        c.getContext('2d').drawImage(canvas, 0, 0, w, h);
        return c;
    }

    function eh_drawTextOnCanvas(canvas, text, opts = { fontSize: 36, fontFamily: 'Arial, sans-serif', color: '#fff', stroke: '#000', position: 'bottom' }){
        const ctx = canvas.getContext('2d');
        ctx.save();
        const scaleRef = Math.max(1, canvas.width / 400);
        const fs = Math.round(opts.fontSize * scaleRef);
        ctx.font = `bold ${fs}px ${opts.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.fillStyle = opts.color || '#fff';
        ctx.strokeStyle = opts.stroke || '#000';
        ctx.lineWidth = Math.max(2, fs / 18);
        let x = Math.round(canvas.width / 2);
        let y;
        if (opts.position === 'top') y = fs + 10;
        else if (opts.position === 'center') y = Math.round(canvas.height / 2 + fs / 3);
        else y = canvas.height - 10;
        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    // 使用 gif.js 编码 frames (canvas[]) -> Blob
    function eh_encodeWithGifJs(frames, delays, { quality = 12, repeat = 0 } = {}){
        return new Promise(async (resolve, reject) => {
            await eh_ensureLibs();
            try {
                const gif = new GIF({ workers: 2, quality, repeat });
                frames.forEach((c, i) => gif.addFrame(c, { delay: delays[i] || 100 }));
                gif.on('finished', blob => resolve(blob));
                gif.on('error', err => reject(err));
                gif.render();
            } catch (e) { reject(e); }
        });
    }

    // 迭代尝试不同缩放比以控制输出大小（maxBytes，默认 5MB）
    async function eh_encodeGifWithLimit(frames, delays, { maxBytes = 5*1024*1024, quality = 12, repeat = 0, maxWidth = 480, maxHeight = 480 } = {}){
        let scale = 1.0;
        let lastBlob = null;
        for (let i=0;i<6;i++){
            const scaled = frames.map(f => eh_scaleFrameCanvas(f, scale, maxWidth, maxHeight));
            const blob = await eh_encodeWithGifJs(scaled, delays, { quality, repeat });
            lastBlob = blob;
            EH_LOG.i('encode try', i, 'scale', scale, 'size', blob.size);
            if (blob.size <= maxBytes) return blob;
            scale *= 0.8;
        }
        return lastBlob;
    }

    // 复制 Blob 到剪贴板（优先 Clipboard API）
    async function eh_copyBlobToClipboard(blob, { allowDownload = true } = {}) {
        // 1) 原生写入对应 MIME（若支持 image/gif 就保持动图）
        try {
            if (navigator.clipboard && navigator.clipboard.write && window.ClipboardItem) {
                const item = new ClipboardItem({ [blob.type]: blob });
                await navigator.clipboard.write([item]);
                return true;
            }
        } catch (e) {
            EH_LOG.w('clipboard write failed', e);
        }

        // 2) ✂️ 删除原逻辑（写入 blob: 文本URL）

        // 3) 仍不行：允许则下载兜底，至少保证得到动图文件
        if (!allowDownload) return false;
        try {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'emoji-' + Date.now() + (blob.type.includes('gif') ? '.gif' : '.png');
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(() => URL.revokeObjectURL(url), 3000);
            return true;
        } catch (e3) {
            EH_LOG.e('fallback download failed', e3);
            return false;
        }
    }
    /* 主流程：给 imageUrl（gif 或 静态）加文字并返回 Blob */
    async function addTextToImageOrGifAndExport(imageUrl, text, options = { fontSize: 36, fontFamily: 'Arial', color: '#fff', position: 'bottom' }){
        await eh_ensureLibs();
        const objectUrl = await eh_loadImageObjectURL(imageUrl);
        const isGif = /\.gif($|\?)/i.test(imageUrl) || (objectUrl && objectUrl.startsWith('blob:') && /\.gif($|\?)/i.test(imageUrl));
        if (isGif) {
            let ab;
            try { ab = await eh_gmFetchArrayBuffer(imageUrl); }
            catch(e) { const resp = await fetch(objectUrl); ab = await resp.arrayBuffer(); }
            const frames = eh_parseGifFramesFromArrayBuffer(ab);
            const canvases = eh_framesToCanvases(frames);
            const delays = frames.map(f => (f.delay || 10) * 10);
            canvases.forEach(c => eh_drawTextOnCanvas(c, text, options));
            const blob = await eh_encodeGifWithLimit(canvases, delays, { maxBytes: 5*1024*1024, quality: 12, maxWidth: 480, maxHeight: 480 });
            return blob;
        } else {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = objectUrl || imageUrl;
            await new Promise((res, rej)=>{ img.onload = res; img.onerror = ()=>rej(new Error('image load fail')); });
            const maxW = 1024, maxH = 1024;
            let w = img.naturalWidth, h = img.naturalHeight;
            const r = Math.min(1, Math.min(maxW / w, maxH / h));
            w = Math.round(w * r); h = Math.round(h * r);
            const c = document.createElement('canvas'); c.width = w; c.height = h;
            const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0, w, h);
            eh_drawTextOnCanvas(c, text, options);
            const blob = await new Promise(resolve => c.toBlob(resolve, 'image/webp', 0.85));
            if (blob && blob.size <= 5*1024*1024) return blob;
            return await new Promise(resolve => c.toBlob(resolve, 'image/png', 0.95));
        }
    }
    // 从 URL 拉取图像并转成 PNG Blob（走 GM_xmlhttpRequest，避免 CORS 污染）
    async function eh_fetchBlobFromUrl(imageUrl) {
        try {
            // 先尝试用 GM 直接拿原始二进制并保留 MIME（GIF 动图不会丢帧）
            const ab = await eh_gmFetchArrayBuffer(imageUrl);
            let mime = 'application/octet-stream';
            if (/\.gif($|\?)/i.test(imageUrl)) mime = 'image/gif';
            else if (/\.png($|\?)/i.test(imageUrl)) mime = 'image/png';
            else if (/\.jpe?g($|\?)/i.test(imageUrl)) mime = 'image/jpeg';
            else if (/\.webp($|\?)/i.test(imageUrl)) mime = 'image/webp';
            return new Blob([ab], { type: mime });
        } catch (e) {
            // 回退：静图转 PNG，GIF 仍尽量保持动画（多数浏览器直接 <img> 即可动）
            const objectUrl = await eh_loadImageObjectURL(imageUrl);
            const isGif = /\.gif($|\?)/i.test(imageUrl);
            if (isGif) {
                // 没有 GM 权限时，尽量把 blob: URL 的数据当作 GIF 交还
                const resp = await fetch(objectUrl);
                const buf = await resp.arrayBuffer();
                URL.revokeObjectURL(objectUrl);
                return new Blob([buf], { type: 'image/gif' });
            } else {
                const img = new Image();
                img.src = objectUrl;
                await img.decode();
                const c = document.createElement('canvas');
                c.width = img.naturalWidth;
                c.height = img.naturalHeight;
                c.getContext('2d').drawImage(img, 0, 0);
                const pngBlob = await new Promise(res => c.toBlob(res, 'image/png', 0.95));
                URL.revokeObjectURL(objectUrl);
                return pngBlob;
            }
        }
    }

    // 模拟“复制图像”——始终以 PNG 写入剪贴板；失败不下载
    async function copyImageLikeBrowser(imageUrl) {
        const blob = await eh_fetchBlobFromUrl(imageUrl);
        const isGif = /\.gif($|\?)/i.test(imageUrl) || (blob && blob.type === 'image/gif');
        await eh_copyBlobToClipboard(blob, { allowDownload: isGif });
    }

    /* === EH 工具函数 END === */

    // 🎨 文字编辑器
    const TextEditor = {
        fonts: [
            'Arial, sans-serif',
            'Helvetica, sans-serif',
            'Georgia, serif',
            'Times New Roman, serif',
            'Courier New, monospace',
            'Verdana, sans-serif',
            'Impact, sans-serif',
            'Comic Sans MS, cursive',
            'Trebuchet MS, sans-serif',
            'Arial Black, sans-serif',
            'Microsoft YaHei, sans-serif',
            'SimHei, sans-serif',
            'SimSun, serif',
            'KaiTi, serif'
        ],

        open(imageUrl) {
            currentEditingImage = imageUrl;
            Logger.info('UI', '打开文字编辑器', imageUrl);
            this.createEditor();
            this.showEditor();
        },

        createEditor() {
            if (textEditorPanel) {
                textEditorPanel.remove();
                Logger.debug('UI', '移除旧的编辑器面板');
            }

            const lang = t();
            const panel = document.createElement('div');
            panel.className = 'emoji-helper-text-editor';
            panel.id = 'emoji-helper-text-editor';

            panel.innerHTML = `
                <div class="emoji-helper-header draggable-header">
                    <div class="emoji-helper-title">${lang.textEditor.title}</div>
                    <button class="emoji-helper-btn close text-editor-close">×</button>
                </div>
                <div class="text-editor-content">
                    <div class="editor-preview">
                        <canvas id="text-editor-canvas"></canvas>
                        <div class="preview-overlay">
                            <div class="drag-hint">${lang.textEditor.dragHint}</div>
                            <div class="copy-hint">${lang.textEditor.copyHint}</div>
                        </div>
                    </div>
                    <div class="editor-controls">
                        <div class="control-group">
                            <label class="control-label">${lang.textEditor.text}</label>
                            <input type="text" id="text-input" placeholder="${lang.textEditor.textPlaceholder}" maxlength="50">
                        </div>
                        <div class="control-group">
                            <label class="control-label">${lang.textEditor.fontSize}</label>
                            <input type="range" id="font-size-slider" min="12" max="72" value="36">
                            <span id="font-size-value">36px</span>
                        </div>
                        <div class="control-group">
                            <label class="control-label">${lang.textEditor.fontFamily}</label>
                            <select id="font-family-select">
                                ${this.fonts.map(font => `<option value="${font}">${font.split(',')[0]}</option>`).join('')}
                            </select>
                        </div>
                        <div class="control-group">
                            <label class="control-label">${lang.textEditor.textColor}</label>
                            <input type="color" id="text-color-picker" value="#ffffff">
                        </div>
                        <div class="control-group">
                            <label class="control-label">${lang.textEditor.position}</label>
                            <select id="text-position-select">
                                <option value="top">${lang.textEditor.positions.top}</option>
                                <option value="center">${lang.textEditor.positions.center}</option>
                                <option value="bottom" selected>${lang.textEditor.positions.bottom}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="text-editor-actions">
                    <button class="editor-btn primary" id="download-btn" disabled>${lang.textEditor.download}</button>
                    <button class="editor-btn" id="close-editor-btn">${lang.textEditor.close}</button>
                </div>
            `;

            textEditorPanel = panel;
            document.body.appendChild(panel);

            this.bindEditorEvents();
            this.loadImage();
            this.makePanelDraggable(panel);

            Logger.debug('UI', '文字编辑器界面创建完成');
        },

        makePanelDraggable(panel) {
            const header = panel.querySelector('.draggable-header');
            if (!header) return;

            let isDragging = false;
            let startX = 0;
            let startY = 0;
            let initialX = 0;
            let initialY = 0;

            header.addEventListener('mousedown', (e) => {
                if (e.target.classList.contains('close')) return;

                isDragging = true;
                header.style.cursor = 'grabbing';

                const rect = panel.getBoundingClientRect();
                startX = e.clientX;
                startY = e.clientY;
                initialX = rect.left;
                initialY = rect.top;

                e.preventDefault();
                Logger.trace('UI', '开始拖拽文字编辑器');
            });

            const handleMouseMove = (e) => {
                if (!isDragging) return;

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                const newX = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, initialX + deltaX));
                const newY = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, initialY + deltaY));

                panel.style.left = newX + 'px';
                panel.style.top = newY + 'px';
                panel.style.transform = 'none';
            };

            const handleMouseUp = () => {
                if (isDragging) {
                    isDragging = false;
                    header.style.cursor = 'grab';
                    Logger.trace('UI', '结束拖拽文字编辑器');
                }
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            header.style.cursor = 'grab';
        },

        async loadImage() {
            const canvas = document.getElementById('text-editor-canvas');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');

            Logger.debug('UI', '开始加载图片到canvas', currentEditingImage);

            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => {
                const maxWidth = 400;
                const maxHeight = 300;
                let { width, height } = img;

                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width *= ratio;
                    height *= ratio;
                }

                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(img, 0, 0, width, height);
                this.redrawText();
                this.enableAdvancedDrag();

                Logger.info('UI', '图片加载完成', { width, height });
            };

            img.onerror = () => {
                Logger.error('UI', '图片加载失败', currentEditingImage);
                showMessage(t().messages.imageError);
            };

            img.src = currentEditingImage;
        },

        enableAdvancedDrag() {
            const canvas = document.getElementById('text-editor-canvas');
            if (!canvas) return;

            canvas.draggable = true;
            canvas.style.cursor = 'grab';

            canvas.addEventListener('dragstart', (e) => {
                canvas.style.cursor = 'grabbing';
                canvas.toBlob((blob) => {
                    if (!blob) return;
                    const filename = 'emoji-text-' + Date.now() + (blob.type.includes('gif') ? '.gif' : '.png');
                    const objectURL = URL.createObjectURL(blob);
                    try {
                        e.dataTransfer.setData('DownloadURL', `${blob.type}:${filename}:${objectURL}`);
                        e.dataTransfer.setData('text/plain', filename);
                        e.dataTransfer.effectAllowed = 'copy';
                    } catch (err) {
                        console.warn('dragset failed', err);
                    }
                    const dragImg = new Image();
                    dragImg.onload = () => e.dataTransfer.setDragImage(dragImg, dragImg.width / 2, dragImg.height / 2);
                    dragImg.src = objectURL;
                    setTimeout(() => { URL.revokeObjectURL(objectURL); }, 3000);
                }, 'image/png', 0.95);
            });

            canvas.addEventListener('dragend', () => {
                canvas.style.cursor = 'grab';
            });

            canvas.addEventListener('dragstart', (e) => {
                // 禁用从预览canvas导出PNG，避免误把GIF变成静态第一帧
                e.preventDefault();
            });

            canvas.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                canvas.toBlob(async (blob) => {
                    if (!blob) return;
                    try {
                        const ok = await eh_copyBlobToClipboard(blob);
                        if (ok) showMessage(t().messages.copied);
                    } catch (err) {
                        console.warn('copy failed', err);
                        const dataURL = canvas.toDataURL('image/png');
                        const ta = document.createElement('textarea'); ta.value = dataURL; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
                        showMessage(t().messages.copied);
                    }
                }, 'image/png', 0.95);
            });
        },


        fallbackCopyMethod(canvas) {
            try {
                const dataURL = canvas.toDataURL('image/png');
                const tempInput = document.createElement('textarea');
                tempInput.value = dataURL;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showMessage(t().messages.copied);
                Logger.info('UI', '图片复制成功（备用方法）');
            } catch (err) {
                Logger.error('UI', '备用复制方法失败', err);
                showMessage('复制失败，请使用拖拽功能');
            }
        },

        redrawText() {
            const canvas = document.getElementById('text-editor-canvas');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const textInput = document.getElementById('text-input');
                const text = textInput ? textInput.value : '';

                if (!text) {
                    const downloadBtn = document.getElementById('download-btn');
                    if (downloadBtn) downloadBtn.disabled = true;
                    return;
                }

                const fontSizeSlider = document.getElementById('font-size-slider');
                const fontFamilySelect = document.getElementById('font-family-select');
                const textColorPicker = document.getElementById('text-color-picker');
                const textPositionSelect = document.getElementById('text-position-select');

                const fontSize = fontSizeSlider ? fontSizeSlider.value : '36';
                const fontFamily = fontFamilySelect ? fontFamilySelect.value : 'Arial, sans-serif';
                const textColor = textColorPicker ? textColorPicker.value : '#ffffff';
                const position = textPositionSelect ? textPositionSelect.value : 'bottom';

                ctx.font = `bold ${fontSize}px ${fontFamily}`;
                ctx.fillStyle = textColor;
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = Math.max(2, parseInt(fontSize) / 18);
                ctx.textAlign = 'center';

                const x = canvas.width / 2;
                let y;
                switch (position) {
                    case 'top':
                        y = parseInt(fontSize) + 10;
                        break;
                    case 'center':
                        y = canvas.height / 2 + parseInt(fontSize) / 3;
                        break;
                    case 'bottom':
                    default:
                        y = canvas.height - 10;
                        break;
                }

                ctx.strokeText(text, x, y);
                ctx.fillText(text, x, y);

                const downloadBtn = document.getElementById('download-btn');
                if (downloadBtn) downloadBtn.disabled = false;

                Logger.trace('UI', '文字重绘完成', { text, fontSize, fontFamily, textColor, position });
            };

            img.src = currentEditingImage;
        },

        bindEditorEvents() {
            const closeBtn = document.querySelector('.text-editor-close');
            const closeEditorBtn = document.getElementById('close-editor-btn');

            if (closeBtn) closeBtn.addEventListener('click', this.close.bind(this));
            if (closeEditorBtn) closeEditorBtn.addEventListener('click', this.close.bind(this));

            const textInput = document.getElementById('text-input');
            const fontSizeSlider = document.getElementById('font-size-slider');
            const fontFamilySelect = document.getElementById('font-family-select');
            const textColorPicker = document.getElementById('text-color-picker');
            const textPositionSelect = document.getElementById('text-position-select');
            const downloadBtn = document.getElementById('download-btn');

            // ★ 关键：输入时联动预览 & 控件变动时重绘
            if (textInput) textInput.addEventListener('input', this.redrawText.bind(this));
            if (fontSizeSlider) {
                fontSizeSlider.addEventListener('input', (e) => {
                    const fontSizeValue = document.getElementById('font-size-value');
                    if (fontSizeValue) fontSizeValue.textContent = e.target.value + 'px';
                    this.redrawText();
                });
            }
            if (fontFamilySelect) fontFamilySelect.addEventListener('change', this.redrawText.bind(this));
            if (textColorPicker) textColorPicker.addEventListener('change', this.redrawText.bind(this));
            if (textPositionSelect) textPositionSelect.addEventListener('change', this.redrawText.bind(this));

            // 下载键：点击时生成并下载（GIF 保持多帧）
            if (downloadBtn) {
                downloadBtn.addEventListener('click', async () => {
                    this.redrawText();
                    const text = document.getElementById('text-input')?.value || '';
                    if (!text) { showMessage('请输入文字'); return; }

                    const fontSize = parseInt(document.getElementById('font-size-slider')?.value || 36, 10);
                    const fontFamily = document.getElementById('font-family-select')?.value || 'Arial, sans-serif';
                    const textColor = document.getElementById('text-color-picker')?.value || '#ffffff';
                    const position = document.getElementById('text-position-select')?.value || 'bottom';

                    try {
                        const blob = await addTextToImageOrGifAndExport(currentEditingImage, text, {
                            fontSize, fontFamily, color: textColor, position
                        });

                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'emoji-text-' + Date.now() + (blob.type.includes('gif') ? '.gif' : '.png');
                        document.body.appendChild(a); a.click(); a.remove();
                        setTimeout(() => URL.revokeObjectURL(url), 3000);
                        showMessage(t().messages.imageGenerated);
                    } catch (err) {
                        Logger.error('UI', '生成失败', err);
                        showMessage(t().messages.imageError);
                    }
                });
            }

            Logger.debug('UI', '编辑器事件绑定完成');
        },

        downloadImage() {
            const blob = this.lastGeneratedBlob;
            if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'emoji-text-' + Date.now() + (blob.type.includes('gif') ? '.gif' : '.png');
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => URL.revokeObjectURL(url), 3000);
                showMessage(t().messages.imageGenerated);
                Logger.info('UI', '图片下载完成', a.download);
                return;
            }
            const canvas = document.getElementById('text-editor-canvas');
            if (!canvas) return;
            const link = document.createElement('a');
            link.download = `emoji-with-text-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showMessage(t().messages.imageGenerated);
            Logger.info('UI', '图片下载完成 (canvas fallback)');
        },


        showEditor() {
            if (textEditorPanel) {
                textEditorPanel.style.display = 'flex';
                Logger.debug('UI', '显示文字编辑器');
            }
        },

        close() {
            if (textEditorPanel) {
                textEditorPanel.style.display = 'none';
                Logger.debug('UI', '关闭文字编辑器');
            }
        }
    };

    // 🔍 网络GIF搜索 API
    const GifSearchAPI = {
        async searchGifs(query, limit = 12, timeoutMs = 3000) {
            const searchEngine = Config.get('searchEngine');
            const cacheKey = `${searchEngine}-${query}`;

            if (CacheManager.has(cacheKey, 'search')) {
                Logger.debug('SEARCH', '使用缓存结果', { query, engine: searchEngine });
                return CacheManager.get(cacheKey, 'search');
            }

            try {
                Logger.info('SEARCH', '开始搜索GIF', { query, engine: searchEngine, limit, timeoutMs });
                const results = await this.callAPI(query, limit, timeoutMs);
                CacheManager.set(cacheKey, results, 'search');
                Logger.info('SEARCH', '搜索成功', { query, engine: searchEngine, resultCount: results.length });
                return results;
            } catch (error) {
                Logger.error('SEARCH', '搜索失败', { query, engine: searchEngine, error });
                return [];
            }
        },
        async callAPI(query, limit, timeoutMs = 3000) {
            const searchEngine = Config.get('searchEngine');

            return new Promise((resolve, reject) => {
                const apiUrl = this.getApiUrl(searchEngine, query, limit);
                Logger.debug('SEARCH', '调用API', { url: apiUrl, timeoutMs });

                const kill = setTimeout(() => reject(new Error('API请求超时')), timeoutMs);

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: apiUrl,
                    timeout: timeoutMs,
                    onload: (response) => {
                        clearTimeout(kill);
                        try {
                            Logger.debug('SEARCH', 'API响应状态', response.status);
                            const data = JSON.parse(response.responseText);
                            const gifs = this.parseResponse(searchEngine, data);
                            Logger.debug('SEARCH', 'API解析完成', { gifCount: gifs.length });
                            resolve(gifs);
                        } catch (e) {
                            Logger.error('SEARCH', '解析响应失败', e);
                            reject(e);
                        }
                    },
                    onerror: (error) => {
                        clearTimeout(kill);
                        Logger.error('SEARCH', 'API请求失败', error);
                        reject(error);
                    },
                    ontimeout: () => {
                        clearTimeout(kill);
                        Logger.error('SEARCH', 'API请求超时');
                        reject(new Error('请求超时'));
                    }
                });
            });
        },

        getApiUrl(searchEngine, query, limit) {
            const encodedQuery = encodeURIComponent(query);

            switch (searchEngine) {
                case 'giphy':
                    return `https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=${encodedQuery}&limit=${limit}&rating=g&lang=zh`;
                case 'tenor':
                    return `https://tenor.googleapis.com/v2/search?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCl0&q=${encodedQuery}&limit=${limit}&media_filter=gif&contentfilter=high`;
                default:
                    return `https://api.giphy.com/v1/gifs/search?api_key=GlVGYHkr3WSBnllca54iNt0yFbjz7L65&q=${encodedQuery}&limit=${limit}&rating=g`;
            }
        },

        parseResponse(searchEngine, data) {
            try {
                switch (searchEngine) {
                    case 'giphy':
                        return (data.data || []).map(gif => ({
                            id: gif.id,
                            title: gif.title || 'GIF',
                            url: gif.images.fixed_height_small?.url || gif.images.original?.url,
                            previewUrl: gif.images.preview_gif?.url || gif.images.fixed_height_small?.url,
                            width: gif.images.fixed_height_small?.width || 200,
                            height: gif.images.fixed_height_small?.height || 200
                        }));
                    case 'tenor':
                        return (data.results || []).map(gif => ({
                            id: gif.id,
                            title: gif.content_description || 'GIF',
                            url: gif.media_formats?.gif?.url || gif.media_formats?.tinygif?.url,
                            previewUrl: gif.media_formats?.tinygif?.url || gif.media_formats?.gif?.url,
                            width: gif.media_formats?.gif?.dims?.[0] || 200,
                            height: gif.media_formats?.gif?.dims?.[1] || 200
                        }));
                    default:
                        return [];
                }
            } catch (e) {
                Logger.error('SEARCH', '解析失败', e);
                return [];
            }
        }
    };

    // 拖拽管理器
    const DragManager = {
        makeDraggable(element, handle) {
            const dragHandle = handle || element.querySelector('.draggable-header') || element.querySelector('.emoji-helper-header');
            if (!dragHandle) return;

            let isDragging = false;
            let startX = 0;
            let startY = 0;
            let initialX = 0;
            let initialY = 0;

            const handleMouseDown = (e) => {
                if (e.target.classList.contains('close') || e.target.classList.contains('emoji-helper-btn')) return;

                isDragging = true;
                dragHandle.style.cursor = 'grabbing';

                const rect = element.getBoundingClientRect();
                startX = e.clientX;
                startY = e.clientY;
                initialX = rect.left;
                initialY = rect.top;

                e.preventDefault();
                Logger.trace('UI', '开始拖拽面板', element.id);
            };

            const handleMouseMove = (e) => {
                if (!isDragging) return;

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                let newX = initialX + deltaX;
                let newY = initialY + deltaY;

                newX = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, newX));
                newY = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, newY));

                element.style.left = newX + 'px';
                element.style.top = newY + 'px';
                element.style.right = 'auto';
                element.style.bottom = 'auto';

                if (element.id === 'emoji-helper-main-panel') {
                    Config.set('panelPosition', { x: newX, y: newY });
                } else if (element.id === 'emoji-helper-settings-panel') {
                    Config.set('settingsPanelPosition', { x: newX, y: newY });
                }
            };

            const handleMouseUp = () => {
                if (isDragging) {
                    isDragging = false;
                    dragHandle.style.cursor = 'grab';
                    Logger.trace('UI', '结束拖拽面板', element.id);
                }
            };

            dragHandle.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            dragHandle.style.cursor = 'grab';
            dragHandle.style.userSelect = 'none';
        }
    };

    // 浮动按钮显示控制
    function updateFloatingButtonVisibility() {
        if (floatingButton) {
            const show = Config.get('showFloatingButton');
            floatingButton.style.display = show ? 'flex' : 'none';
            Logger.debug('UI', '更新浮动按钮显示状态', show);
        }
    }

    // 更新面板位置
    function updatePanelPosition() {
        if (emojiPanel) {
            const pos = Config.get('panelPosition');
            emojiPanel.style.left = pos.x + 'px';
            emojiPanel.style.top = pos.y + 'px';
            emojiPanel.style.right = 'auto';
            emojiPanel.style.bottom = 'auto';
            Logger.trace('UI', '更新主面板位置', pos);
        }
    }

    function updateSettingsPanelPosition() {
        if (settingsPanel) {
            const pos = Config.get('settingsPanelPosition');
            settingsPanel.style.left = pos.x + 'px';
            settingsPanel.style.top = pos.y + 'px';
            settingsPanel.style.right = 'auto';
            settingsPanel.style.bottom = 'auto';
            Logger.trace('UI', '更新设置面板位置', pos);
        }
    }

    // 继续添加其余代码...
    // (由于长度限制，我需要分几个部分来完成。这是第一部分的修复版本)

    // 🎨 样式（全面优化UI）
    GM_addStyle(`
        :root {
            --eh-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            --eh-border-radius: 12px;
            --eh-shadow: 0 8px 32px rgba(0,0,0,0.12);
            --eh-shadow-hover: 0 12px 48px rgba(0,0,0,0.18);
            --eh-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .emoji-helper-light {
            --eh-bg-primary: #ffffff;
            --eh-bg-secondary: #f8fafc;
            --eh-bg-tertiary: #f1f5f9;
            --eh-text-primary: #1e293b;
            --eh-text-secondary: #64748b;
            --eh-border-color: #e2e8f0;
            --eh-accent-color: #3b82f6;
            --eh-accent-hover: #2563eb;
            --eh-hover-bg: #f1f5f9;
            --eh-success-color: #10b981;
            --eh-danger-color: #ef4444;
            --eh-warning-color: #f59e0b;
        }

                .emoji-helper-dark {
            --eh-bg-primary: #1e293b;
            --eh-bg-secondary: #334155;
            --eh-bg-tertiary: #475569;
            --eh-text-primary: #f8fafc;
            --eh-text-secondary: #cbd5e1;
            --eh-border-color: #475569;
            --eh-accent-color: #60a5fa;
            --eh-accent-hover: #3b82f6;
            --eh-hover-bg: #475569;
            --eh-success-color: #34d399;
            --eh-danger-color: #f87171;
            --eh-warning-color: #fbbf24;
        }

        /* 浮动按钮 */
        .emoji-helper-floating-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 56px;
            height: 56px;
            background: var(--eh-accent-color);
            border: none;
            border-radius: 50%;
            box-shadow: var(--eh-shadow);
            cursor: pointer;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: white;
            transition: var(--eh-transition);
            user-select: none;
        }

        .emoji-helper-floating-btn:hover {
            background: var(--eh-accent-hover);
            box-shadow: var(--eh-shadow-hover);
            transform: scale(1.1);
        }

        /* 主面板 */
        .emoji-helper-panel {
            position: fixed;
            top: 86px;
            left: 20px;
            width: 380px;
            max-height: 480px;
            background: var(--eh-bg-primary);
            border: 1px solid var(--eh-border-color);
            border-radius: var(--eh-border-radius);
            box-shadow: var(--eh-shadow);
            z-index: 10001;
            font-family: var(--eh-font);
            display: none;
            flex-direction: column;
            overflow: hidden;
            transition: var(--eh-transition);
        }

        .emoji-helper-panel.show {
            display: flex;
        }

        /* 面板头部 */
        .emoji-helper-header {
            background: var(--eh-bg-secondary);
            padding: 16px 20px;
            border-bottom: 1px solid var(--eh-border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: grab;
            user-select: none;
        }

        .emoji-helper-header:active {
            cursor: grabbing;
        }

        .emoji-helper-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--eh-text-primary);
            margin: 0;
        }

        .emoji-helper-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            color: var(--eh-text-secondary);
            transition: var(--eh-transition);
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .emoji-helper-btn:hover {
            background: var(--eh-hover-bg);
            color: var(--eh-text-primary);
        }

        .emoji-helper-btn.close {
            font-size: 20px;
            width: 32px;
            height: 32px;
            justify-content: center;
            padding: 0;
        }

        /* 搜索区域 */
        .emoji-helper-search-area {
            padding: 16px 20px;
            border-bottom: 1px solid var(--eh-border-color);
        }

        .emoji-helper-search-container {
            position: relative;
            display: flex;
            gap: 8px;
        }

        .emoji-helper-search-input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid var(--eh-border-color);
            border-radius: 8px;
            background: var(--eh-bg-primary);
            color: var(--eh-text-primary);
            font-size: 14px;
            transition: var(--eh-transition);
            outline: none;
        }

        .emoji-helper-search-input:focus {
            border-color: var(--eh-accent-color);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .emoji-helper-search-btn {
            padding: 12px 16px;
            background: var(--eh-accent-color);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: var(--eh-transition);
        }

        .emoji-helper-search-btn:hover {
            background: var(--eh-accent-hover);
        }

        .emoji-helper-search-btn:disabled {
            background: var(--eh-text-secondary);
            cursor: not-allowed;
        }

        /* 分类标签 */
        .emoji-helper-tabs {
            display: flex;
            padding: 0 20px;
            background: var(--eh-bg-secondary);
            border-bottom: 1px solid var(--eh-border-color);
            overflow-x: auto;
            min-height: 48px; /* 添加这行 */
            align-items: center; /* 添加这行 */
        }

        .emoji-helper-tab {
            padding: 12px 16px;
            background: none;
            border: none;
            color: var(--eh-text-secondary);
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            white-space: nowrap;
            border-bottom: 2px solid transparent;
            transition: var(--eh-transition);
        }

        .emoji-helper-tab:hover {
            color: var(--eh-text-primary);
        }

        .emoji-helper-tab.active {
            color: var(--eh-accent-color);
            border-bottom-color: var(--eh-accent-color);
        }

        /* 内容区域 */
        .emoji-helper-content {
            flex: 1;
            overflow-y: auto;
            padding: 16px 20px;
            max-height: 320px;
        }

        .emoji-helper-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
            gap: 8px;
        }

        .emoji-helper-item {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid transparent;
            border-radius: 8px;
            cursor: pointer;
            transition: var(--eh-transition);
            background: var(--eh-bg-tertiary);
            position: relative;
            overflow: hidden;
        }

        .emoji-helper-item:hover {
            border-color: var(--eh-accent-color);
            background: var(--eh-hover-bg);
            transform: scale(1.05);
        }

        .emoji-helper-item.emoji-item {
            font-size: 24px;
        }

        .emoji-helper-item.gif-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 6px;
        }

        .emoji-helper-item .item-actions {
            position: absolute;
            top: 4px;
            right: 4px;
            display: none;
            gap: 2px;
        }

        .emoji-helper-item:hover .item-actions {
            display: flex;
        }

        .item-action-btn {
            width: 20px;
            height: 20px;
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* 设置面板 */
        .emoji-helper-settings-panel {
            position: fixed;
            top: 86px;
            left: 450px;
            width: 360px;
            max-height: 600px;
            background: var(--eh-bg-primary);
            border: 1px solid var(--eh-border-color);
            border-radius: var(--eh-border-radius);
            box-shadow: var(--eh-shadow);
            z-index: 10002;
            font-family: var(--eh-font);
            display: none;
            flex-direction: column;
            overflow: hidden;
            max-height: calc(100vh - 40px);
            overflow-y: auto;

        }

        .emoji-helper-settings-panel.show {
            display: flex;
        }

        .settings-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }

        .setting-group {
            margin-bottom: 24px;
        }

        .setting-group:last-child {
            margin-bottom: 0;
        }

        .setting-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: var(--eh-text-primary);
            margin-bottom: 8px;
        }

        .setting-input {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid var(--eh-border-color);
            border-radius: 6px;
            background: var(--eh-bg-primary);
            color: var(--eh-text-primary);
            font-size: 14px;
            transition: var(--eh-transition);
        }

        .setting-input:focus {
            outline: none;
            border-color: var(--eh-accent-color);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .setting-checkbox {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
        }

        .setting-checkbox input[type="checkbox"] {
            margin: 0;
        }

        .settings-actions {
            padding: 16px 20px;
            border-top: 1px solid var(--eh-border-color);
            display: grid; /* 改为grid布局 */
            grid-template-columns: repeat(3, 1fr); /* 每行3个按钮 */
            gap: 8px;
            justify-items: stretch; /* 让按钮填满网格 */
        }




        .settings-btn {
            padding: 10px 12px; /* 减少左右padding */
            border: 1px solid var(--eh-border-color);
            border-radius: 6px;
            background: var(--eh-bg-primary);
            color: var(--eh-text-primary);
            cursor: pointer;
            font-size: 12px; /* 减小字体 */
            transition: var(--eh-transition);
            white-space: nowrap; /* 防止文字换行 */
            text-align: center;
            min-height: 36px; /* 统一按钮高度 */
        }


        .settings-btn.primary {
            background: var(--eh-accent-color);
            color: white;
            border-color: var(--eh-accent-color);
        }

        .settings-btn:hover {
            background: var(--eh-hover-bg);
        }

        .settings-btn.primary:hover {
            background: var(--eh-accent-hover);
        }

        .settings-btn.danger {
            background: var(--eh-danger-color);
            color: white;
            border-color: var(--eh-danger-color);
        }

        /* 文字编辑器 */
        .emoji-helper-text-editor {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 600px;
            max-height: 80vh;
            background: var(--eh-bg-primary);
            border: 1px solid var(--eh-border-color);
            border-radius: var(--eh-border-radius);
            box-shadow: var(--eh-shadow);
            z-index: 10003;
            font-family: var(--eh-font);
            display: none;
            flex-direction: column;
            overflow: hidden;
        }

        .text-editor-content {
            display: flex;
            flex: 1;
            overflow: hidden;
        }

        .editor-preview {
            flex: 1;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: var(--eh-bg-tertiary);
            position: relative;
        }

        .editor-preview canvas {
            max-width: 100%;
            max-height: 300px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .preview-overlay {
            position: absolute;
            bottom: 10px;
            left: 10px;
            right: 10px;
            text-align: center;
            font-size: 12px;
            color: var(--eh-text-secondary);
        }

        .editor-controls {
            width: 250px;
            padding: 20px;
            border-left: 1px solid var(--eh-border-color);
            overflow-y: auto;
        }

        .control-group {
            margin-bottom: 16px;
        }

        .control-label {
            display: block;
            font-size: 13px;
            font-weight: 500;
            color: var(--eh-text-primary);
            margin-bottom: 6px;
        }

        .text-editor-actions {
            padding: 16px 20px;
            border-top: 1px solid var(--eh-border-color);
            display: flex;
            gap: 8px;
            justify-content: flex-end;
        }

        .editor-btn {
            padding: 10px 16px;
            border: 1px solid var(--eh-border-color);
            border-radius: 6px;
            background: var(--eh-bg-primary);
            color: var(--eh-text-primary);
            cursor: pointer;
            font-size: 14px;
            transition: var(--eh-transition);
        }

        .editor-btn.primary {
            background: var(--eh-accent-color);
            color: white;
            border-color: var(--eh-accent-color);
        }

        .editor-btn:hover:not(:disabled) {
            background: var(--eh-hover-bg);
        }

        .editor-btn.primary:hover:not(:disabled) {
            background: var(--eh-accent-hover);
        }

        .editor-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* 消息提示 */
        .emoji-helper-message {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--eh-success-color);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: var(--eh-shadow);
            z-index: 10004;
            font-family: var(--eh-font);
            font-size: 14px;
            transform: translateX(100%);
            transition: var(--eh-transition);
        }

        .emoji-helper-message.show {
            transform: translateX(0);
        }

        .emoji-helper-message.error {
            background: var(--eh-danger-color);
        }

        .emoji-helper-message.warning {
            background: var(--eh-warning-color);
        }

        /* 加载状态 */
        .emoji-helper-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
            color: var(--eh-text-secondary);
            font-size: 14px;
        }

        .emoji-helper-loading::before {
            content: '';
            width: 16px;
            height: 16px;
            border: 2px solid var(--eh-border-color);
            border-top-color: var(--eh-accent-color);
            border-radius: 50%;
            margin-right: 8px;
            animation: eh-spin 1s linear infinite;
        }

        @keyframes eh-spin {
            to { transform: rotate(360deg); }
        }

        /* 空状态 */
        .emoji-helper-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            color: var(--eh-text-secondary);
            text-align: center;
        }

        .emoji-helper-empty-icon {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.5;
        }

        /* 响应式 */
        @media (max-width: 768px) {
            .emoji-helper-panel {
                width: calc(100vw - 40px);
                left: 20px;
                right: 20px;
            }

            .emoji-helper-settings-panel {
                width: calc(100vw - 40px);
                left: 20px;
                right: 20px;
            }

            .emoji-helper-text-editor {
                width: calc(100vw - 40px);
                left: 20px;
                right: 20px;
                transform: translateY(-50%);
                top: 50%;
            }

            .text-editor-content {
                flex-direction: column;
            }

            .editor-controls {
                width: 100%;
                border-left: none;
                border-top: 1px solid var(--eh-border-color);
            }
        }

        /* 滚动条样式 */
        .emoji-helper-content::-webkit-scrollbar,
        .settings-content::-webkit-scrollbar,
        .editor-controls::-webkit-scrollbar {
            width: 6px;
        }

        .emoji-helper-content::-webkit-scrollbar-track,
        .settings-content::-webkit-scrollbar-track,
        .editor-controls::-webkit-scrollbar-track {
            background: var(--eh-bg-tertiary);
        }

        .emoji-helper-content::-webkit-scrollbar-thumb,
        .settings-content::-webkit-scrollbar-thumb,
        .editor-controls::-webkit-scrollbar-thumb {
            background: var(--eh-border-color);
            border-radius: 3px;
        }

        .emoji-helper-content::-webkit-scrollbar-thumb:hover,
        .settings-content::-webkit-scrollbar-thumb:hover,
        .editor-controls::-webkit-scrollbar-thumb:hover {
            background: var(--eh-text-secondary);
        }
    `);

    // 继续其余功能函数...

    // 🏃‍♀️ 初始化函数
    function initEmojiHelper() {
        Logger.info('INIT', '开始初始化表情助手');

        try {
            // 初始化配置
            Config.init();

            // 加载自定义GIF
            const savedGifs = Storage.get('customGifs', null);
            if (savedGifs && Array.isArray(savedGifs) && savedGifs.length > 0) {
                customGifs = savedGifs;
                Logger.info('INIT', `加载了 ${customGifs.length} 个自定义GIF`);
            } else {
                Storage.set('customGifs', customGifs);
                Logger.info('INIT', '使用默认GIF集');
            }

            // 创建浮动按钮
            createFloatingButton();

            // 应用主题
            applyTheme();

            // 检查更新（异步，不阻塞初始化）
            if (Config.get('autoUpdate')) {
                setTimeout(() => {
                    CloudDataManager.checkAndUpdate();
                }, 2000);
            }

            Logger.info('INIT', '表情助手初始化完成');

        } catch (error) {
            Logger.error('INIT', '初始化失败', error);
        }
    }

    // 🎨 应用主题
    function applyTheme() {
        const theme = Config.get('theme');
        document.documentElement.className = document.documentElement.className
            .replace(/emoji-helper-(light|dark)/g, '') + ` emoji-helper-${theme}`;
        Logger.debug('UI', '应用主题', theme);
    }

    // 🔄 刷新当前视图
    function refreshCurrentView() {
        if (emojiPanel && emojiPanel.style.display !== 'none') {
            const activeTab = emojiPanel.querySelector('.emoji-helper-tab.active');
            if (activeTab) {
                const category = activeTab.dataset.category;
                Logger.debug('UI', '刷新当前视图', category);
                showCategory(category);
            }
        }
    }

    // 🗑️ 清理GIF缓存
    function clearGifCache() {
        webGifCache.clear();
        CacheManager.clear('gif');
        CacheManager.clear('search');
        Logger.info('CACHE', '已清理GIF缓存');
    }

    // 🔄 更新所有文本
    function updateAllText() {
        Logger.debug('UI', '更新界面语言');
        if (emojiPanel) {
            createEmojiPanel();
        }
        if (settingsPanel) {
            createSettingsPanel();
        }
    }

    // 🎈 创建浮动按钮
    function createFloatingButton() {
        if (floatingButton) {
            floatingButton.remove();
        }

        floatingButton = document.createElement('button');
        floatingButton.className = 'emoji-helper-floating-btn';
        floatingButton.innerHTML = '😀';
        floatingButton.title = t().title;

        floatingButton.addEventListener('click', toggleEmojiPanel);

        document.body.appendChild(floatingButton);
        updateFloatingButtonVisibility();

        Logger.debug('UI', '浮动按钮创建完成');
    }

    // 🔄 切换表情面板
    function toggleEmojiPanel() {
        if (!emojiPanel) {
            createEmojiPanel();
        }

        const isVisible = emojiPanel.style.display !== 'none';

        if (isVisible) {
            hideEmojiPanel();
        } else {
            showEmojiPanel();
        }

        Logger.debug('UI', '切换表情面板', !isVisible);
    }

    // 👁️ 显示表情面板
    function showEmojiPanel() {
        if (!emojiPanel) {
            createEmojiPanel();
        }

        emojiPanel.classList.add('show');
        emojiPanel.style.display = 'flex';

        // 应用保存的位置
        updatePanelPosition();

        // 默认显示“我的GIF”
        showCategory('custom');

        // 聚焦搜索框
        const searchInput = emojiPanel.querySelector('.emoji-helper-search-input');
        if (searchInput) {
            setTimeout(() => searchInput.focus(), 100);
        }

        Logger.info('UI', '显示表情面板');
    }

    // 🙈 隐藏表情面板
    function hideEmojiPanel() {
        if (emojiPanel) {
            emojiPanel.classList.remove('show');
            emojiPanel.style.display = 'none';
            Logger.debug('UI', '隐藏表情面板');
        }
    }

    // 🏗️ 创建表情面板
    function createEmojiPanel() {
        if (emojiPanel) {
            emojiPanel.remove();
        }

        const lang = t();
        const panel = document.createElement('div');
        panel.className = 'emoji-helper-panel';
        panel.id = 'emoji-helper-main-panel';

        panel.innerHTML = `
            <div class="emoji-helper-header">
                <div class="emoji-helper-title">${lang.title}</div>
                <div style="display: flex; gap: 8px;">
                    <button class="emoji-helper-btn settings-btn" title="${lang.settings}">⚙️</button>
                    <button class="emoji-helper-btn close" title="关闭">×</button>
                </div>
            </div>
            <div class="emoji-helper-search-area">
                <div class="emoji-helper-search-container">
                    <input type="text" class="emoji-helper-search-input" placeholder="${lang.search}" maxlength="50">
                    <button class="emoji-helper-search-btn">${lang.searchBtn}</button>
                </div>
            </div>
            <div class="emoji-helper-tabs">
                <button class="emoji-helper-tab active" data-category="custom">${lang.categories.custom}</button>
                <button class="emoji-helper-tab" data-category="smileys">${lang.categories.smileys}</button>
                <button class="emoji-helper-tab" data-category="webGif">${lang.categories.webGif}</button>
            </div>
            <div class="emoji-helper-content">
                <div class="emoji-helper-grid"></div>
            </div>
        `;

        emojiPanel = panel;
        document.body.appendChild(panel);

        bindEmojiPanelEvents();
        DragManager.makeDraggable(panel);

        Logger.debug('UI', '表情面板创建完成');
    }

    // 🔗 绑定表情面板事件
    function bindEmojiPanelEvents() {
        if (!emojiPanel) return;

        const closeBtn = emojiPanel.querySelector('.close');
        const settingsBtn = emojiPanel.querySelector('.settings-btn');
        const searchInput = emojiPanel.querySelector('.emoji-helper-search-input');
        const searchBtn = emojiPanel.querySelector('.emoji-helper-search-btn');
        const tabs = emojiPanel.querySelectorAll('.emoji-helper-tab');

        if (closeBtn) {
            closeBtn.addEventListener('click', hideEmojiPanel);
        }

        if (settingsBtn) {
            settingsBtn.addEventListener('click', toggleSettingsPanel);
        }

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    performSearch();
                }
            });

            searchInput.addEventListener('input', debounce(() => {
                if (searchInput.value.trim()) {
                    performSearch();
                }
            }, 800));
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', performSearch);
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.dataset.category;
                if (category) {
                    setActiveTab(tab);
                    showCategory(category);
                }
            });
        });

        Logger.debug('UI', '表情面板事件绑定完成');
    }

    async function performSearch() {
        const searchInput = emojiPanel?.querySelector('.emoji-helper-search-input');
        if (!searchInput) return;

        const query = searchInput.value.trim();
        if (!query) {
            Logger.debug('SEARCH', '搜索词为空');
            return;
        }

        const reqId = ++searchRequestId; // 本次搜索的 ID
        if (isSearching) {
            Logger.debug('SEARCH', '搜索进行中，仍然记录最新reqId以丢弃旧结果');
        }

        Logger.info('SEARCH', '开始搜索', { query, reqId });
        setSearching(true);

        try {
            // 1) 本地结果：先立即渲染，保证UI不卡
            const emojiResults = searchEmojis(query);
            const customResults = searchCustomGifs(query);
            const localResults = [
                ...emojiResults.map(e => ({ type: 'emoji', data: e })),
                ...customResults.map(g => ({ type: 'gif', data: g })),
            ];
            requestAnimationFrame(() => displaySearchResults(localResults, query));

            // 2) 第三方：最多等3秒；失败/超时就放弃
            const webPromise = GifSearchAPI.searchGifs(query, 12, 3000)
            .catch(err => { Logger.warn('SEARCH', '第三方失败', err); return []; });
            const webResults = await eh_withTimeout(webPromise, 3000);

            // 3) 过期保护
            if (reqId !== searchRequestId) {
                Logger.warn('SEARCH', '丢弃过期搜索结果', { query, reqId, latest: searchRequestId });
                return;
            }

            // 4) 成功在3s内返回才合并
            if (webResults !== '__EH_TIMEOUT__' && Array.isArray(webResults)) {
                const merged = [
                    ...localResults,
                    ...webResults.map(g => ({ type: 'webGif', data: g })),
                ];
                displaySearchResults(merged, query);
                Logger.info('SEARCH', '搜索完成(含第三方)', {
                    query, emoji: emojiResults.length, custom: customResults.length, web: webResults.length, total: merged.length
                });
            } else {
                Logger.warn('SEARCH', '第三方搜索超时(3s)，仅显示本地结果');
            }
        } catch (error) {
            Logger.error('SEARCH', '搜索失败', { query, error });
            showMessage(t().messages.apiError, 'error');
        } finally {
            setSearching(false);
        }
    }

    // 设置搜索状态
    function setSearching(searching) {
        isSearching = searching;
        const searchBtn = emojiPanel?.querySelector('.emoji-helper-search-btn');
        if (searchBtn) {
            searchBtn.disabled = searching;
            searchBtn.textContent = searching ? t().messages.searching : t().searchBtn;
        }
    }

    // 搜索表情符号
    // 修复表情符号搜索函数
    function searchEmojis(query) {
        const lowerQuery = query.toLowerCase();

        // 表情符号关键词映射
        const emojiKeywords = {
            // 笑脸和情感
            '😀': ['笑', '开心', '高兴', 'smile', 'happy', 'grin'],
            '😃': ['大笑', '开心', '高兴', 'smile', 'happy', 'joy'],
            '😄': ['哈哈', '大笑', '开心', 'laugh', 'happy', 'joy'],
            '😁': ['嘻嘻', '开心', '笑', 'grin', 'happy', 'smile'],
            '😅': ['苦笑', '尴尬', '汗', 'sweat', 'laugh', 'nervous'],
            '😂': ['笑哭', '大笑', '哈哈', 'joy', 'laugh', 'cry'],
            '🤣': ['笑得满地打滚', '大笑', '哈哈', 'rofl', 'laugh', 'roll'],
            '😊': ['微笑', '开心', '高兴', 'smile', 'happy', 'sweet'],
            '😇': ['天使', '纯洁', '善良', 'angel', 'innocent', 'halo'],
            '🙂': ['微笑', '开心', '友好', 'smile', 'happy', 'friendly'],
            '😉': ['眨眼', '调皮', '暗示', 'wink', 'playful', 'hint'],
            '😌': ['满足', '放松', '舒服', 'relieved', 'peaceful', 'calm'],
            '😍': ['爱心眼', '喜爱', '迷恋', 'love', 'heart', 'adore'],
            '🥰': ['可爱', '爱心', '甜蜜', 'cute', 'love', 'sweet'],
            '😘': ['飞吻', '亲吻', '爱', 'kiss', 'love', 'blow'],
            '😗': ['亲吻', '嘟嘴', '吻', 'kiss', 'pucker', 'lips'],
            '😙': ['亲吻', '吻', '嘟嘴', 'kiss', 'pucker', 'cute'],
            '😚': ['亲吻', '吻', '闭眼', 'kiss', 'closed', 'eyes'],
            '😋': ['好吃', '美味', '馋', 'yum', 'delicious', 'tasty'],
            '😛': ['吐舌', '调皮', '淘气', 'tongue', 'playful', 'silly'],
            '😝': ['吐舌', '调皮', '鬼脸', 'tongue', 'playful', 'wink'],
            '😜': ['调皮', '吐舌', '眨眼', 'wink', 'tongue', 'playful'],
            '🤪': ['疯狂', '搞怪', '调皮', 'crazy', 'wild', 'silly'],
            '🤨': ['怀疑', '质疑', '挑眉', 'skeptical', 'doubt', 'eyebrow'],
            '🧐': ['思考', '研究', '仔细', 'thinking', 'study', 'monocle'],
            '🤓': ['书呆子', '学霸', '眼镜', 'nerd', 'geek', 'glasses'],
            '😎': ['酷', '帅', '墨镜', 'cool', 'awesome', 'sunglasses'],
            '🤩': ['崇拜', '明星', '闪闪', 'star', 'worship', 'amazed'],
            '🥳': ['庆祝', '派对', '生日', 'party', 'celebrate', 'birthday'],
            '😏': ['得意', '坏笑', '阴险', 'smirk', 'sly', 'mischievous'],
            '😒': ['无聊', '无语', '翻白眼', 'bored', 'unamused', 'meh'],
            '😞': ['失望', '沮丧', '难过', 'disappointed', 'sad', 'down'],
            '😔': ['沮丧', '难过', '失落', 'pensive', 'sad', 'thoughtful'],
            '😟': ['担心', '忧虑', '不安', 'worried', 'anxious', 'concern'],
            '😕': ['困惑', '疑惑', '不解', 'confused', 'puzzled', 'uncertain'],
            '🙁': ['皱眉', '不高兴', '难过', 'frown', 'sad', 'unhappy'],
            '☹️': ['不高兴', '难过', '皱眉', 'frown', 'sad', 'unhappy'],
            '😣': ['痛苦', '难受', '挣扎', 'pain', 'struggle', 'persevere'],
            '😖': ['痛苦', '难受', '纠结', 'confounded', 'pain', 'struggle'],
            '😫': ['疲惫', '累', '痛苦', 'tired', 'weary', 'exhausted'],
            '😩': ['疲惫', '累', '无奈', 'weary', 'tired', 'helpless'],
            '🥺': ['可怜', '委屈', '乞求', 'pleading', 'pitiful', 'beg'],
            '😢': ['哭', '难过', '伤心', 'cry', 'sad', 'tears'],
            '😭': ['大哭', '伤心', '痛哭', 'cry', 'sob', 'wail'],
            '😤': ['生气', '愤怒', '怒气', 'angry', 'mad', 'huffing'],
            '😠': ['生气', '愤怒', '怒火', 'angry', 'mad', 'rage'],
            '😡': ['愤怒', '生气', '怒', 'angry', 'mad', 'furious'],
            '🤬': ['脏话', '愤怒', '生气', 'swearing', 'angry', 'cursing'],
            '🤯': ['震惊', '爆炸', '惊讶', 'shocked', 'mind-blown', 'exploding'],
            '😳': ['脸红', '害羞', '震惊', 'blushing', 'shy', 'flushed'],
            '🥵': ['热', '出汗', '发烧', 'hot', 'sweat', 'fever'],
            '🥶': ['冷', '寒冷', '冰', 'cold', 'freezing', 'ice'],
            '😱': ['恐惧', '害怕', '惊恐', 'fear', 'scared', 'screaming'],
            '😨': ['害怕', '恐惧', '惊吓', 'fearful', 'scared', 'anxious'],
            '😰': ['紧张', '出汗', '害怕', 'anxious', 'nervous', 'cold-sweat'],
            '😥': ['难过', '伤心', '失望', 'sad', 'disappointed', 'relieved'],
            '😓': ['出汗', '紧张', '累', 'sweat', 'nervous', 'tired'],
            '🤗': ['拥抱', '温暖', '友好', 'hug', 'warm', 'friendly'],
            '🤔': ['思考', '想', '考虑', 'thinking', 'consider', 'ponder'],
            '🤭': ['偷笑', '掩嘴', '害羞', 'giggle', 'shy', 'cover-mouth'],
            '🤫': ['安静', '嘘', '保密', 'quiet', 'shh', 'secret'],
            '🤥': ['撒谎', '长鼻子', '谎言', 'lie', 'pinocchio', 'liar'],
            '😶': ['无语', '沉默', '闭嘴', 'speechless', 'silent', 'no-mouth'],
            '😐': ['面无表情', '无感', '冷漠', 'neutral', 'expressionless', 'meh'],
            '😑': ['无语', '翻白眼', '无表情', 'expressionless', 'blank', 'meh'],
            '😬': ['尴尬', '龇牙', '紧张', 'grimace', 'awkward', 'nervous'],
            '🙄': ['翻白眼', '无语', '鄙视', 'eye-roll', 'whatever', 'annoyed'],
            '😯': ['惊讶', '震惊', '哇', 'surprised', 'shocked', 'wow'],
            '😦': ['担心', '不安', '惊讶', 'worried', 'frowning', 'concerned'],
            '😧': ['痛苦', '担心', '不安', 'anguished', 'worried', 'pain'],
            '😮': ['惊讶', '震惊', '张嘴', 'surprised', 'shocked', 'open-mouth'],
            '😲': ['震惊', '惊讶', '哇', 'astonished', 'shocked', 'amazed'],
            '🥱': ['打哈欠', '困', '无聊', 'yawn', 'sleepy', 'tired'],
            '😴': ['睡觉', '困', '休息', 'sleep', 'tired', 'zzz'],
            '🤤': ['流口水', '想要', '渴望', 'drool', 'desire', 'want'],
            '😪': ['困', '疲惫', '打瞌睡', 'sleepy', 'tired', 'drowsy'],
            '😵': ['晕', '头晕', '不省人事', 'dizzy', 'knocked-out', 'unconscious'],
            '🤐': ['闭嘴', '拉链', '保密', 'zip', 'silence', 'sealed'],
            '🥴': ['晕', '醉', '头晕', 'woozy', 'drunk', 'dizzy'],
            '🤢': ['恶心', '想吐', '不舒服', 'nausea', 'sick', 'vomit'],
            '🤮': ['呕吐', '恶心', '吐', 'vomit', 'puke', 'sick'],
            '🤧': ['打喷嚏', '感冒', '生病', 'sneeze', 'cold', 'sick'],
            '😷': ['口罩', '生病', '感冒', 'mask', 'sick', 'medical'],
            '🤒': ['发烧', '生病', '温度计', 'fever', 'sick', 'thermometer'],
            '🤕': ['受伤', '头痛', '绷带', 'injured', 'hurt', 'bandage'],
            '🤑': ['贪钱', '发财', '金钱', 'money', 'rich', 'greedy'],
            '🤠': ['牛仔', '帽子', '西部', 'cowboy', 'hat', 'western'],
            '😈': ['恶魔', '坏', '邪恶', 'devil', 'evil', 'mischievous'],
            '👿': ['愤怒', '恶魔', '生气', 'angry', 'devil', 'imp'],
            '👹': ['日本鬼', '恶魔', '怪物', 'ogre', 'demon', 'monster'],
            '👺': ['日本鬼', '恶魔', '怪物', 'goblin', 'demon', 'monster'],
            '🤡': ['小丑', '搞笑', '马戏团', 'clown', 'funny', 'circus'],
            '💩': ['便便', '大便', '屎', 'poop', 'shit', 'pile'],
            '👻': ['鬼', '幽灵', '鬼魂', 'ghost', 'spirit', 'boo'],
            '💀': ['骷髅', '死亡', '头骨', 'skull', 'death', 'bone'],
            '☠️': ['骷髅', '死亡', '危险', 'skull', 'death', 'poison'],
            '👽': ['外星人', '外星', '宇宙', 'alien', 'extraterrestrial', 'space'],
            '👾': ['游戏', '外星怪物', '电子游戏', 'alien-monster', 'game', 'pixel'],
            '🤖': ['机器人', '科技', '人工智能', 'robot', 'ai', 'technology'],
            '🎃': ['南瓜', '万圣节', '杰克灯', 'pumpkin', 'halloween', 'jack-o-lantern'],
            '😺': ['猫', '笑猫', '开心猫', 'cat', 'happy', 'smile'],
            '😸': ['猫', '大笑猫', '开心猫', 'cat', 'joy', 'grin'],
            '😹': ['猫', '笑哭猫', '流泪猫', 'cat', 'joy', 'tears'],
            '😻': ['猫', '爱心眼猫', '喜爱猫', 'cat', 'love', 'heart-eyes'],
            '😼': ['猫', '得意猫', '坏笑猫', 'cat', 'smirk', 'sly'],
            '😽': ['猫', '亲吻猫', '吻猫', 'cat', 'kiss', 'kissing'],
            '🙀': ['猫', '惊讶猫', '害怕猫', 'cat', 'surprised', 'weary'],
            '😿': ['猫', '哭猫', '伤心猫', 'cat', 'cry', 'sad'],
            '😾': ['猫', '生气猫', '愤怒猫', 'cat', 'angry', 'pouting']
        };

        // 精确匹配表情符号
        const matchedEmojis = [];

        for (const [emoji, keywords] of Object.entries(emojiKeywords)) {
            // 检查关键词是否匹配
            const isMatch = keywords.some(keyword =>
                                          keyword.includes(lowerQuery) ||
                                          lowerQuery.includes(keyword) ||
                                          keyword.startsWith(lowerQuery)
                                         );

            if (isMatch) {
                matchedEmojis.push(emoji);
            }
        }

        // 如果没有匹配的表情，返回部分默认表情
        if (matchedEmojis.length === 0) {
            return defaultEmojis.slice(0, 10);
        }

        Logger.debug('SEARCH', `表情符号搜索: "${query}" 匹配到 ${matchedEmojis.length} 个`, matchedEmojis);
        return matchedEmojis;
    }


    // 搜索自定义GIF
    function searchCustomGifs(query) {
        const lowerQuery = query.toLowerCase();
        return customGifs.filter(gif => {
            return gif.keywords.some(keyword =>
                                     keyword.toLowerCase().includes(lowerQuery)
                                    ) || gif.alt.toLowerCase().includes(lowerQuery);
        });
    }

    // 显示搜索结果
    function displaySearchResults(results, query) {
        const content = emojiPanel?.querySelector('.emoji-helper-content');
        const grid = content?.querySelector('.emoji-helper-grid');
        if (!grid) return;

        // 清除活动标签
        const tabs = emojiPanel.querySelectorAll('.emoji-helper-tab');
        tabs.forEach(tab => tab.classList.remove('active'));

        if (results.length === 0) {
            showEmptyState(t().messages.noResults);
            return;
        }

        grid.innerHTML = '';

        results.forEach(result => {
            const item = document.createElement('div');
            item.className = 'emoji-helper-item';

            if (result.type === 'emoji') {
                item.classList.add('emoji-item');
                item.textContent = result.data;
                item.addEventListener('click', () => insertEmoji(result.data));
            } else {
                item.classList.add('gif-item');
                const img = document.createElement('img');
                img.src = result.data.previewUrl || result.data.url;
                img.alt = result.data.alt || result.data.title;
                img.loading = 'lazy';

                img.onerror = () => {
                    item.style.display = 'none';
                };

                const actions = document.createElement('div');
                actions.className = 'item-actions';
                actions.innerHTML = `
                    <button class="item-action-btn" title="添加文字">T</button>
                `;

                actions.querySelector('.item-action-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    TextEditor.open(result.data.url);
                });

                item.appendChild(img);
                item.appendChild(actions);
                item.addEventListener('click', () => insertGif(result.data));
            }

            grid.appendChild(item);
        });

        Logger.debug('UI', '搜索结果显示完成', { query, count: results.length });
    }

    // 设置活动标签
    function setActiveTab(activeTab) {
        const tabs = emojiPanel?.querySelectorAll('.emoji-helper-tab');
        tabs?.forEach(tab => tab.classList.remove('active'));
        activeTab.classList.add('active');
    }

    // 显示分类内容
    function showCategory(category) {
        const content = emojiPanel?.querySelector('.emoji-helper-content');
        const grid = content?.querySelector('.emoji-helper-grid');
        if (!grid) return;

        Logger.debug('UI', '显示分类', category);

        switch (category) {
            case 'smileys':
                displayEmojis();
                break;
            case 'custom':
                displayCustomGifs();
                break;
            case 'webGif':
                showEmptyState(t().messages.searchHint);
                break;
        }
    }

    // 显示表情符号
    function displayEmojis() {
        const grid = emojiPanel?.querySelector('.emoji-helper-grid');
        if (!grid) return;

        grid.innerHTML = '';

        defaultEmojis.forEach(emoji => {
            const item = document.createElement('div');
            item.className = 'emoji-helper-item emoji-item';
            item.textContent = emoji;
            item.addEventListener('click', () => insertEmoji(emoji));
            grid.appendChild(item);
        });

        Logger.debug('UI', '表情符号显示完成', defaultEmojis.length);
    }

    // 显示自定义GIF
    function displayCustomGifs() {
        const grid = emojiPanel?.querySelector('.emoji-helper-grid');
        if (!grid) return;

        grid.innerHTML = '';

        if (customGifs.length === 0) {
            showEmptyState('暂无自定义GIF');
            return;
        }

        customGifs.forEach(gif => {
            const item = document.createElement('div');
            item.className = 'emoji-helper-item gif-item';

            const img = document.createElement('img');
            img.src = gif.url;
            img.alt = gif.alt;
            img.loading = 'lazy';

            img.onerror = () => {
                item.style.display = 'none';
                Logger.warn('UI', 'GIF加载失败', gif.url);
            };

            const actions = document.createElement('div');
            actions.className = 'item-actions';
            actions.innerHTML = `
                <button class="item-action-btn" title="添加文字">T</button>
            `;

            actions.querySelector('.item-action-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                TextEditor.open(gif.url);
            });

            item.appendChild(img);
            item.appendChild(actions);
            item.addEventListener('click', () => insertGif(gif));
            grid.appendChild(item);
        });

        Logger.debug('UI', '自定义GIF显示完成', customGifs.length);
    }

    // 显示空状态
    function showEmptyState(message) {
        const grid = emojiPanel?.querySelector('.emoji-helper-grid');
        if (!grid) return;

        grid.innerHTML = `
            <div class="emoji-helper-empty">
                <div class="emoji-helper-empty-icon">🤔</div>
                <div>${message}</div>
            </div>
        `;
    }

    // 插入表情符号
    function insertEmoji(emoji) {
        Logger.info('EVENT', '插入表情符号', emoji);
        insertToActiveElement(emoji);

        if (Config.get('autoInsert')) {
            hideEmojiPanel();
        }
    }

    // 插入 GIF / 图片：在 linux.do 直接插入 Markdown 链接；其他站点保持原逻辑
    async function insertGif(gif) {
        const isDiscourse = location.hostname.endsWith('linux.do');
        const textArea = document.querySelector('.d-editor-input');

        if (isDiscourse && textArea) {
            // 参照“人家的机制”，插入 Markdown（避免 blob:）
            const alt = (gif.alt || gif.title || 'gif').replace(/\|/g, ' ');
            const md = `![${alt}|2048x2048,10%](${gif.url})`;
            insertToActiveElement(md);
            if (Config.get('autoInsert')) hideEmojiPanel();
            return;
        }

        // 非 linux.do：沿用原“复制到剪贴板”的逻辑
        Logger.info('EVENT', '复制图像到剪贴板', { url: gif.url });
        try {
            await copyImageLikeBrowser(gif.url);
            showMessage(t().messages.copied);
        } catch (err) {
            Logger.warn('EVENT', '复制图像失败，回退为插入链接', err);
            insertToActiveElement(gif.url);
        }
        if (Config.get('autoInsert')) hideEmojiPanel();
    }

    // 插入到活动元素
    function insertToActiveElement(content) {
        const activeElement = document.activeElement;

        if (activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.contentEditable === 'true'
        )) {
            if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
                const start = activeElement.selectionStart;
                const end = activeElement.selectionEnd;
                const text = activeElement.value;

                activeElement.value = text.slice(0, start) + content + text.slice(end);
                activeElement.selectionStart = activeElement.selectionEnd = start + content.length;

                // 触发输入事件
                activeElement.dispatchEvent(new Event('input', { bubbles: true }));
            } else {
                // 对于contentEditable元素
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    range.deleteContents();

                    if (content.startsWith('http')) {
                        // 插入图片
                        const img = document.createElement('img');
                        img.src = content;
                        img.style.maxWidth = '200px';
                        img.style.height = 'auto';
                        range.insertNode(img);
                    } else {
                        // 插入文本
                        const textNode = document.createTextNode(content);
                        range.insertNode(textNode);
                    }

                    // 移动光标到插入内容后
                    range.setStartAfter(range.commonAncestorContainer.lastChild);
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }

            Logger.debug('EVENT', '内容已插入到活动元素', {
                tag: activeElement.tagName,
                contentLength: content.length
            });
        } else {
            // 复制到剪贴板作为备选方案
            copyToClipboard(content);
        }
    }

    // 复制到剪贴板
    function copyToClipboard(text) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    showMessage(t().messages.copied);
                    Logger.info('EVENT', '已复制到剪贴板（Clipboard API）', text.substring(0, 50));
                }).catch(() => {
                    fallbackCopy(text);
                });
            } else {
                fallbackCopy(text);
            }
        } catch (error) {
            Logger.warn('EVENT', '复制失败', error);
            fallbackCopy(text);
        }
    }

    // 备用复制方法
    function fallbackCopy(text) {
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showMessage(t().messages.copied);
            Logger.info('EVENT', '已复制到剪贴板（备用方法）', text.substring(0, 50));
        } catch (error) {
            Logger.error('EVENT', '备用复制方法失败', error);
        }
    }

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 切换设置面板
    function toggleSettingsPanel() {
        if (!settingsPanel) {
            createSettingsPanel();
        }

        const isVisible = settingsPanel.style.display !== 'none';

        if (isVisible) {
            hideSettingsPanel();
        } else {
            showSettingsPanel();
        }

        Logger.debug('UI', '切换设置面板', !isVisible);
    }

    // 显示设置面板
    function showSettingsPanel() {
        if (!settingsPanel) {
            createSettingsPanel();
        }

        settingsPanel.classList.add('show');
        settingsPanel.style.display = 'flex';
        updateSettingsPanelPosition();

        Logger.info('UI', '显示设置面板');
    }

    // 隐藏设置面板
    function hideSettingsPanel() {
        if (settingsPanel) {
            settingsPanel.classList.remove('show');
            settingsPanel.style.display = 'none';
            Logger.debug('UI', '隐藏设置面板');
        }
    }

    // 创建设置面板
    function createSettingsPanel() {
        if (settingsPanel) {
            settingsPanel.remove();
        }

        const lang = t();
        const panel = document.createElement('div');
        panel.className = 'emoji-helper-settings-panel';
        panel.id = 'emoji-helper-settings-panel';

        panel.innerHTML = `
            <div class="emoji-helper-header">
                <div class="emoji-helper-title">${lang.settingsPanel.title}</div>
                <button class="emoji-helper-btn close">×</button>
            </div>
            <div class="settings-content">
                <div class="setting-group">
                    <label class="setting-label">${lang.settingsPanel.language}</label>
                    <select class="setting-input" id="setting-lang">
                        <option value="zh-CN" ${Config.get('lang') === 'zh-CN' ? 'selected' : ''}>中文</option>
                        <option value="en" ${Config.get('lang') === 'en' ? 'selected' : ''}>English</option>
                    </select>
                </div>

                <div class="setting-group">
                    <label class="setting-label">${lang.settingsPanel.theme}</label>
                    <select class="setting-input" id="setting-theme">
                        <option value="light" ${Config.get('theme') === 'light' ? 'selected' : ''}>${lang.themes.light}</option>
                        <option value="dark" ${Config.get('theme') === 'dark' ? 'selected' : ''}>${lang.themes.dark}</option>
                    </select>
                </div>

                <div class="setting-group">
                    <label class="setting-checkbox">
                        <input type="checkbox" id="setting-auto-insert" ${Config.get('autoInsert') ? 'checked' : ''}>
                        <span>${lang.settingsPanel.autoInsert}</span>
                    </label>
                </div>

                <div class="setting-group">
                    <label class="setting-checkbox">
                        <input type="checkbox" id="setting-show-floating" ${Config.get('showFloatingButton') ? 'checked' : ''}>
                        <span>${lang.settingsPanel.showFloatingButton}</span>
                    </label>
                </div>

                <div class="setting-group">
                    <label class="setting-label">${lang.settingsPanel.gifSize}</label>
                    <select class="setting-input" id="setting-gif-size">
                        <option value="small" ${Config.get('gifSize') === 'small' ? 'selected' : ''}>${lang.sizes.small}</option>
                        <option value="medium" ${Config.get('gifSize') === 'medium' ? 'selected' : ''}>${lang.sizes.medium}</option>
                        <option value="large" ${Config.get('gifSize') === 'large' ? 'selected' : ''}>${lang.sizes.large}</option>
                    </select>
                </div>

                <div class="setting-group">
                    <label class="setting-label">${lang.settingsPanel.searchEngine}</label>
                    <select class="setting-input" id="setting-search-engine">
                        <option value="giphy" ${Config.get('searchEngine') === 'giphy' ? 'selected' : ''}>Giphy</option>
                        <option value="tenor" ${Config.get('searchEngine') === 'tenor' ? 'selected' : ''}>Tenor</option>
                    </select>
                </div>

                <div class="setting-group">
                    <label class="setting-checkbox">
                        <input type="checkbox" id="setting-auto-update" ${Config.get('autoUpdate') ? 'checked' : ''}>
                        <span>${lang.settingsPanel.autoUpdate}</span>
                    </label>
                </div>

                <div class="setting-group">
                    <label class="setting-label">${lang.settingsPanel.customUpdateUrl}</label>
                    <input type="url" class="setting-input" id="setting-update-url" value="${Config.get('customUpdateUrl')}">
                </div>

                <div class="setting-group">
                    <label class="setting-label">${lang.settingsPanel.logLevel}</label>
                    <select class="setting-input" id="setting-log-level">
                        <option value="ERROR" ${Config.get('logLevel') === 'ERROR' ? 'selected' : ''}>${lang.logLevels.ERROR}</option>
                        <option value="WARN" ${Config.get('logLevel') === 'WARN' ? 'selected' : ''}>${lang.logLevels.WARN}</option>
                        <option value="INFO" ${Config.get('logLevel') === 'INFO' ? 'selected' : ''}>${lang.logLevels.INFO}</option>
                        <option value="DEBUG" ${Config.get('logLevel') === 'DEBUG' ? 'selected' : ''}>${lang.logLevels.DEBUG}</option>
                        <option value="TRACE" ${Config.get('logLevel') === 'TRACE' ? 'selected' : ''}>${lang.logLevels.TRACE}</option>
                    </select>
                </div>

                <div class="setting-group">
                    <label class="setting-label">${lang.settingsPanel.cacheSize}</label>
                    <input type="number" class="setting-input" id="setting-cache-size" value="${Config.get('cacheSize')}" min="10" max="1000">
                </div>

                <div class="setting-group">
                    <small style="color: var(--eh-text-secondary);">
                        ${lang.settingsPanel.dataVersion}: ${Config.get('dataVersion')}<br>
                        ${lang.settingsPanel.lastUpdate}: ${Config.get('lastUpdateCheck') ? new Date(Config.get('lastUpdateCheck')).toLocaleString() : '从未'}
                    </small>
                </div>
            </div>
            <div class="settings-actions">
                <button class="settings-btn" id="export-logs-btn">${lang.settingsPanel.exportLogs}</button>
                <button class="settings-btn" id="clear-cache-btn">${lang.settingsPanel.clearCache}</button>
                <button class="settings-btn" id="update-now-btn">${lang.settingsPanel.updateNow}</button>
                <button class="settings-btn danger" id="clear-all-btn">${lang.settingsPanel.clearAllData}</button>
                <button class="settings-btn danger" id="reset-settings-btn">${lang.settingsPanel.reset}</button>
                <button class="settings-btn primary" id="close-settings-btn">${lang.settingsPanel.close}</button>
            </div>
        `;

        settingsPanel = panel;
        document.body.appendChild(panel);

        bindSettingsPanelEvents();
        DragManager.makeDraggable(panel);

        Logger.debug('UI', '设置面板创建完成');
    }

    // 绑定设置面板事件
    function bindSettingsPanelEvents() {
        if (!settingsPanel) return;

        const closeBtn = settingsPanel.querySelector('.close');
        const closeSettingsBtn = settingsPanel.querySelector('#close-settings-btn');

        if (closeBtn) closeBtn.addEventListener('click', hideSettingsPanel);
        if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', hideSettingsPanel);

        // 设置项事件
        const langSelect = settingsPanel.querySelector('#setting-lang');
        const themeSelect = settingsPanel.querySelector('#setting-theme');
        const autoInsertCheck = settingsPanel.querySelector('#setting-auto-insert');
        const showFloatingCheck = settingsPanel.querySelector('#setting-show-floating');
        const gifSizeSelect = settingsPanel.querySelector('#setting-gif-size');
        const searchEngineSelect = settingsPanel.querySelector('#setting-search-engine');
        const autoUpdateCheck = settingsPanel.querySelector('#setting-auto-update');
        const updateUrlInput = settingsPanel.querySelector('#setting-update-url');
        const logLevelSelect = settingsPanel.querySelector('#setting-log-level');
        const cacheSizeInput = settingsPanel.querySelector('#setting-cache-size');

        if (langSelect) langSelect.addEventListener('change', () => Config.set('lang', langSelect.value));
        if (themeSelect) themeSelect.addEventListener('change', () => Config.set('theme', themeSelect.value));
        if (autoInsertCheck) autoInsertCheck.addEventListener('change', () => Config.set('autoInsert', autoInsertCheck.checked));
        if (showFloatingCheck) showFloatingCheck.addEventListener('change', () => Config.set('showFloatingButton', showFloatingCheck.checked));
        if (gifSizeSelect) gifSizeSelect.addEventListener('change', () => Config.set('gifSize', gifSizeSelect.value));
        if (searchEngineSelect) searchEngineSelect.addEventListener('change', () => Config.set('searchEngine', searchEngineSelect.value));
        if (autoUpdateCheck) autoUpdateCheck.addEventListener('change', () => Config.set('autoUpdate', autoUpdateCheck.checked));
        if (updateUrlInput) updateUrlInput.addEventListener('change', () => Config.set('customUpdateUrl', updateUrlInput.value));
        if (logLevelSelect) logLevelSelect.addEventListener('change', () => Config.set('logLevel', logLevelSelect.value));
        if (cacheSizeInput) cacheSizeInput.addEventListener('change', () => Config.set('cacheSize', parseInt(cacheSizeInput.value)));

        // 操作按钮事件
        const exportLogsBtn = settingsPanel.querySelector('#export-logs-btn');
        const clearCacheBtn = settingsPanel.querySelector('#clear-cache-btn');
        const updateNowBtn = settingsPanel.querySelector('#update-now-btn');
        const clearAllBtn = settingsPanel.querySelector('#clear-all-btn');
        const resetSettingsBtn = settingsPanel.querySelector('#reset-settings-btn');

        if (exportLogsBtn) exportLogsBtn.addEventListener('click', () => Logger.exportLogs());
        if (clearCacheBtn) clearCacheBtn.addEventListener('click', () => {
            CacheManager.clear();
            showMessage(t().messages.cacheCleared);
        });
        if (updateNowBtn) updateNowBtn.addEventListener('click', () => CloudDataManager.manualUpdate());
        if (clearAllBtn) clearAllBtn.addEventListener('click', () => {
            if (confirm('确定要清理所有数据吗？这将清除所有设置和缓存。')) {
                Storage.clearAll();
                CacheManager.clear();
                Logger.clearHistory();
                showMessage(t().messages.dataCleared);
                setTimeout(() => location.reload(), 1000);
            }
        });
        if (resetSettingsBtn) resetSettingsBtn.addEventListener('click', () => {
            if (confirm('确定要重置所有设置吗？')) {
                Config.reset();
            }
        });

        Logger.debug('UI', '设置面板事件绑定完成');
    }

    // 显示消息
    function showMessage(message, type = 'success') {
        const messageEl = document.createElement('div');
        messageEl.className = `emoji-helper-message ${type}`;
        messageEl.textContent = message;

        document.body.appendChild(messageEl);

        setTimeout(() => messageEl.classList.add('show'), 100);

        setTimeout(() => {
            messageEl.classList.remove('show');
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);

        Logger.info('UI', '显示消息', { message, type });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEmojiHelper);
    } else {
        // 延迟初始化以确保页面完全加载
        setTimeout(initEmojiHelper, 100);
    }

    // 全局点击事件，点击面板外部时关闭面板
    document.addEventListener('click', (e) => {
        const target = e.target;

        // 检查是否点击在任何面板内
        const clickedInPanel = target.closest('.emoji-helper-panel') ||
              target.closest('.emoji-helper-settings-panel') ||
              target.closest('.emoji-helper-text-editor') ||
              target.closest('.emoji-helper-floating-btn');

        if (!clickedInPanel) {
            hideEmojiPanel();
            hideSettingsPanel();
            if (textEditorPanel) {
                TextEditor.close();
            }
        }
    });

    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Shift + E 切换表情面板
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
            e.preventDefault();
            toggleEmojiPanel();
            Logger.debug('EVENT', '快捷键切换表情面板');
        }

        // ESC 关闭所有面板
        if (e.key === 'Escape') {
            hideEmojiPanel();
            hideSettingsPanel();
            if (textEditorPanel) {
                TextEditor.close();
            }
            Logger.debug('EVENT', 'ESC关闭面板');
        }
    });

    // 窗口大小改变时调整面板位置
    window.addEventListener('resize', debounce(() => {
        updatePanelPosition();
        updateSettingsPanelPosition();
        Logger.debug('EVENT', '窗口大小改变，调整面板位置');
    }, 250));

    // 导出全局API（用于调试）
    window.EmojiHelperPro = {
        Config,
        Logger,
        Storage,
        CacheManager,
        CloudDataManager,
        TextEditor,
        GifSearchAPI,
        showPanel: showEmojiPanel,
        hidePanel: hideEmojiPanel,
        togglePanel: toggleEmojiPanel,
        showSettings: showSettingsPanel,
        version: '1.1.0'
    };

    Logger.info('INIT', '表情符号助手 Pro v1.1.0 加载完成 🎉');

})();
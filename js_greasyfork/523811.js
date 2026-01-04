// ==UserScript==
// @name:zh-CN   动漫花园种子屏蔽助手
// @name         DMHY Torrent Block
// @namespace    https://github.com/xkbkx5904
// @version      1.3.10
// @author       xkbkx5904
// @description  Enhanced version of DMHY Block script with more features: title display management, user interface management, regex filtering, context menu, ad blocking, and GitHub sync
// @description:zh-CN  增强版的动漫花园资源屏蔽工具，支持标题显示管理（简繁体切换）、用户界面管理、正则表达式过滤、右键菜单、广告屏蔽和GitHub同步等功能。提供标题过滤、云端数据同步、公共统计池和用户排行榜等特性。
// @homepage     https://github.com/xkbkx5904/dmhy-torrent-block
// @supportURL   https://github.com/xkbkx5904/dmhy-torrent-block/issues
// @match        *://share.dmhy.org/*
// @license      MIT
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @noframes
// @copyright    2025, xkbkx5904
// @originalAuthor tautcony
// @originalURL  https://greasyfork.org/zh-CN/scripts/36871-dmhy-block
// @icon         https://share.dmhy.org/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/full.js
// @downloadURL https://update.greasyfork.org/scripts/523811/DMHY%20Torrent%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/523811/DMHY%20Torrent%20Block.meta.js
// ==/UserScript==

/*
更新日志：
v1.3.10
- 优化标题转换功能，智能识别中英文内容
- 改进标题显示逻辑，只转换中文部分
- 保留英文、数字和特殊字符的原始格式
- 提升标题转换的准确性和性能
- 优化代码结构，提高可维护性

v1.3.9
- 修复标题简繁体转换时链接丢失的问题
- 优化标题转换逻辑，保留HTML结构
- 改进文本节点处理方式

v1.3.8
- 重构 TitleManager 和 UIManager 类，优化代码结构
- 移除重复的标题显示管理代码
- 改进类之间的依赖关系
- 优化事件监听器的绑定逻辑
- 提升代码可维护性和性能

v1.3.7
- 重构标题管理功能，创建独立的 TitleManager 类
- 优化简繁体切换功能，支持实时切换
- 改进代码结构，提高可维护性
- 统一缓存管理，创建 CacheManager 类

v1.3.6
- 添加详细的日志输出系统
- 优化错误处理和提示信息
- 改进代码结构和可维护性
- 统一配置管理

v1.3.5
- 优化 GitHub 同步功能
- 改进 Gist 查找和创建逻辑
- 修复同步时 Gist 不存在的问题
- 增强错误处理和自动恢复机制

v1.3.4
- 优化公共统计池的JSON数据格式
- 改进数据可读性，添加缩进和换行
- 优化数据存储结构

v1.3.1
- 优化公共统计池显示效果
- 添加用户名自动获取和缓存功能
- 改进统计列表显示格式，支持显示用户名
- 优化批量获取用户名的性能

v1.3.0
- 添加 GitHub Gist 同步功能
- 支持黑名单数据的云端备份和恢复
- 添加 GitHub 登录和验证功能
- 支持将黑名单数据贡献到公共统计池
- 添加黑名单用户排行榜功能

v1.2.4
- 优化管理界面加载速度
- 移除打开管理界面时的加载提示
- 使用缓存的用户名信息，提升显示速度
- 异步更新缺失的用户名信息

v1.2.3
- 添加行重排序功能，修复斑马纹样式 (感谢 ishadows)
- 优化过滤后的显示效果

v1.2.2
- 优化简繁体转换功能，增加香港繁体支持
- 添加文字转换缓存机制，提升性能
- 扩大缓存容量至100条
- 改进转换准确度

v1.2.1
- 修复opencc依赖问题

v1.2.0
- 添加简繁体标题过滤功能
- 集成OpenCC实现准确的简繁体转换
- 优化关键词过滤逻辑，支持不区分简繁体

v1.1.6
- 修复关键词输入单个斜杠时的验证问题
- 优化关键词处理逻辑，将单个斜杠视为普通字符串过滤
- 改进管理界面，已有内容时自动在末尾添加分号，方便添加新内容

v1.1.5
- 移除右键添加黑名单时的通知提示
- 优化代码结构，删除未使用的通知管理类
- 改进性能，减少不必要的DOM操作

v1.1.4
- 修复管理界面关闭时错误的未保存更改提示

v1.1.3
- 优化用户名显示和管理功能
- 改进用户ID输入规则提示
- 优化未完整删除的用户数据处理逻辑

v1.1.2
- 优化用户名显示和管理功能
- 改进用户ID输入规则提示
- 优化未完整删除的用户数据处理逻辑

v1.1.1
- 修复数字ID选择器的兼容性问题
- 优化广告屏蔽性能和时机
- 改进广告选择器的精确度
- 统一广告和PikPak按钮的处理逻辑

v1.1.0
- 初始版本发布
- 支持用户界面管理
- 支持正则表达式过滤
- 支持右键菜单
- 支持广告屏蔽
*/

/**
 * 配置对象
 */
const CONFIG = {
    // 存储相关配置
    storage: {
        blockListKey: 'dmhy_blocklist',
        usernameMapKey: 'dmhy_username_map',
        githubTokenKey: 'github_token',
        githubGistIdKey: 'github_gist_id',
        isContributingKey: 'is_contributing',
        githubUserKey: 'github_user'
    },

    // DOM选择器配置
    selectors: {
        torrentList: "table#topic_list tbody tr",
        userLink: "td:last-child a[href*='/user_id/']",
        titleCell: "td.title",
        adSelectors: [
            '[id="1280_adv"]',
            '[id="pkpk"]',
            '.kiwi-ad-wrapper-1280x120',
            'a[onclick*="_trackEvent"][onclick*="ad"]',
            'a[href*="mypikpak.com/drive/url-checker"]',
            'div[align="center"] > a[href*="sng.link"] > img',
            'div[align="center"] > a[href*="weidian.com"] > img[src*="/1280pik.png"]',
            'img[src*="/VA"][src*=".gif"]',
            '.download-pp'
        ]
    },

    // GitHub 相关配置
    github: {
        publicStatsGistId: 'c2df1ecfe5d04f3f2cfb92fd206d4884',
        gistDescription: 'DMHY Block List Sync'
    },

    // 缓存配置
    cache: {
        textConverterSize: 200
    }
};

/**
 * 样式配置
 */
const STYLES = {
    notification: `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        z-index: 10001;
        font-size: 14px;
        transition: opacity 0.3s;
    `,
    blocklistUI: `
        position: fixed;
        left: 10px;
        top: 10px;
        z-index: 9999;
    `,
    manager: `
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        background: white;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        z-index: 10000;
        width: 500px;
        max-height: 80vh;
        overflow-y: auto;
    `
};

/**
 * 缓存管理类
 */
class CacheManager {
    constructor() {
        this.caches = new Map();
        this.maxSize = 200;
    }

    get(cacheName, key) {
        const cache = this.caches.get(cacheName);
        return cache?.get(key);
    }

    set(cacheName, key, value) {
        if (!this.caches.has(cacheName)) {
            this.caches.set(cacheName, new Map());
        }
        const cache = this.caches.get(cacheName);
        
        if (cache.size >= this.maxSize) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }
        cache.set(key, value);
    }
}

/**
 * 工具类
 */
class Utils {
    static cacheManager = new CacheManager();
    static opencc = {
        s2t: null,
        s2hk: null,
        t2s: null
    };

    static async init() {
        try {
            this.opencc = {
                s2t: await OpenCC.Converter({ from: 'cn', to: 'tw' }),
                s2hk: await OpenCC.Converter({ from: 'cn', to: 'hk' }),
                t2s: await OpenCC.Converter({ from: 'tw', to: 'cn' })
            };
        } catch (error) {
            this.handleError(error, 'Utils.init');
        }
    }

    static handleError(error, context) {
        console.warn(`[DMHY Block] Error in ${context}:`, error);
    }

    static log(message, type = 'info') {
        const prefix = '[DMHY Block]';
        switch (type) {
            case 'info':
                console.log(`${prefix} ${message}`);
                break;
            case 'warn':
                console.warn(`${prefix} ${message}`);
                break;
            case 'error':
                console.error(`${prefix} ${message}`);
                break;
            case 'debug':
                console.debug(`${prefix} ${message}`);
                break;
        }
    }

    static convertText(text) {
        if (!text) return {
            original: '',
            simplified: '',
            traditionalTW: '',
            traditionalHK: ''
        };

        const cached = this.cacheManager.get('textConverter', text);
        if (cached) return cached;

        try {
            const result = {
                original: text,
                simplified: this.opencc.t2s?.(text) || text,
                traditionalTW: this.opencc.s2t?.(text) || text,
                traditionalHK: this.opencc.s2hk?.(text) || text
            };

            this.cacheManager.set('textConverter', text, result);
            return result;
        } catch (error) {
            this.handleError(error, 'Utils.convertText');
            return {
                original: text,
                simplified: text,
                traditionalTW: text,
                traditionalHK: text
            };
        }
    }

    static parseKeyword(keyword) {
        if (typeof keyword === 'string' && keyword.startsWith('/') && keyword.endsWith('/')) {
            try {
                return new RegExp(keyword.slice(1, -1));
            } catch (e) {
                return keyword;
            }
        }
        return keyword;
    }

    static formatKeyword(keyword) {
        if (keyword instanceof RegExp) {
            return `/${keyword.source}/`;
        }
        return keyword;
    }
}

/**
 * 黑名单管理类
 */
class BlockListManager {
    constructor() {
        Utils.log('初始化黑名单管理器');
        this.blockList = [];
        this.userNameMap = new Map();
    }

    async init() {
        Utils.log('加载黑名单数据');
        await this.loadBlockList();
        const savedUserNames = GM_getValue(CONFIG.storage.usernameMapKey, {});
        this.userNameMap = new Map(Object.entries(savedUserNames));
        Utils.log(`已加载 ${this.userNameMap.size} 个用户名映射`);
    }

    async loadBlockList() {
        try {
            const saved = GM_getValue(CONFIG.storage.blockListKey, []);
            this.blockList = Array.isArray(saved) ? saved.map(item => {
                if (item.type === 'keywords') {
                    return {
                        type: 'keywords',
                        values: item.values.map(Utils.parseKeyword)
                    };
                }
                return item;
            }) : [];
            Utils.log(`已加载 ${this.blockList.length} 条黑名单规则`);
        } catch (error) {
            Utils.handleError(error, 'BlockListManager.loadBlockList');
            this.blockList = [];
        }
    }

    saveBlockList() {
        try {
            const listToSave = this.blockList.map(item => ({
                ...item,
                values: item.type === 'keywords'
                    ? item.values.map(k => k instanceof RegExp ? `/${k.source}/` : k)
                    : item.values
            }));
            GM_setValue(CONFIG.storage.blockListKey, listToSave);
            Utils.log('黑名单数据已保存');
        } catch (error) {
            Utils.handleError(error, 'BlockListManager.saveBlockList');
        }
    }

    addUser(userId, userName) {
        if (!userId || isNaN(userId)) {
            Utils.log(`无效的用户ID: ${userId}`, 'warn');
            return false;
        }

        const userIdList = this.getUserIds();
        if (!userIdList.includes(userId)) {
            this.updateBlockList('userId', [...userIdList, userId]);
            if (userName) {
                this.userNameMap.set(userId.toString(), userName);
                this.saveUserNameMap();
                Utils.log(`已添加用户: ${userName}(${userId})`);
            }
            return true;
        }
        Utils.log(`用户 ${userId} 已在黑名单中`, 'debug');
        return false;
    }

    getUserIds() {
        return this.blockList.find(item => item.type === 'userId')?.values || [];
    }

    getKeywords() {
        return this.blockList.find(item => item.type === 'keywords')?.values || [];
    }

    updateBlockList(type, values) {
        const index = this.blockList.findIndex(item => item.type === type);
        if (index >= 0) {
            this.blockList[index].values = values;
        } else {
            this.blockList.push({ type, values });
        }
        this.saveBlockList();
    }

    saveUserNameMap() {
        GM_setValue(CONFIG.storage.usernameMapKey, Object.fromEntries(this.userNameMap));
    }

    async getUserName(userId, forceUpdate = false) {
        if (!userId) return null;

        const userIdStr = userId.toString();
        const cachedName = this.userNameMap.get(userIdStr);
        
        if (cachedName && !forceUpdate) return cachedName;

        const userLink = document.querySelector(`a[href="/topics/list/user_id/${userId}"]`);
        if (userLink) {
            const userName = userLink.textContent;
            if (userName) {
                this.userNameMap.set(userIdStr, userName);
                this.saveUserNameMap();
                return userName;
            }
        }

        return new Promise(resolve => {
            const callback = async () => {
                try {
                    const response = await fetch(`https://share.dmhy.org/topics/list/user_id/${userId}`);
                    const text = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'text/html');
                    const userName = doc.querySelector(`a[href="/topics/list/user_id/${userId}"]`)?.textContent;

                    if (userName) {
                        this.userNameMap.set(userIdStr, userName);
                        this.saveUserNameMap();
                        resolve(userName);
                    } else {
                        resolve(userIdStr);
                    }
                } catch (error) {
                    Utils.handleError(error, 'BlockListManager.getUserName');
                    resolve(userIdStr);
                }
            };

            if (window.requestIdleCallback) {
                requestIdleCallback(() => callback(), { timeout: 5000 });
            } else {
                setTimeout(callback, 0);
            }
        });
    }
}

/**
 * 标题管理类
 */
class TitleManager {
    constructor() {
        this.displayMode = GM_getValue('dmhy_title_display_mode', 'original');
    }

    init() {
        this.saveOriginalHTML();
        this.updateAllTitles();
    }

    saveOriginalHTML() {
        document.querySelectorAll(CONFIG.selectors.titleCell).forEach(cell => {
            if (!cell.hasAttribute('data-original-html')) {
                cell.setAttribute('data-original-html', cell.innerHTML);
            }
        });
    }

    getDisplayModeText() {
        switch (this.displayMode) {
            case 'simplified':
                return '简体';
            case 'traditional':
                return '繁体';
            default:
                return '原文';
        }
    }

    toggleTitleDisplay() {
        const modes = ['original', 'simplified', 'traditional'];
        const currentIndex = modes.indexOf(this.displayMode);
        this.displayMode = modes[(currentIndex + 1) % modes.length];
        GM_setValue('dmhy_title_display_mode', this.displayMode);
        this.updateAllTitles();
    }

    // 判断文本是否需要转换
    shouldConvertText(text) {
        // 如果文本只包含英文、数字、特殊字符，不需要转换
        if (!/[\u4e00-\u9fa5]/.test(text)) {
            return false;
        }
        return true;
    }

    // 智能分割文本，保留英文和特殊字符
    splitText(text) {
        const parts = [];
        let currentPart = '';
        let isChinese = false;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const isCharChinese = /[\u4e00-\u9fa5]/.test(char);
            
            if (isCharChinese !== isChinese) {
                if (currentPart) {
                    parts.push({
                        text: currentPart,
                        needConvert: isChinese
                    });
                }
                currentPart = char;
                isChinese = isCharChinese;
            } else {
                currentPart += char;
            }
        }

        if (currentPart) {
            parts.push({
                text: currentPart,
                needConvert: isChinese
            });
        }

        return parts;
    }

    updateAllTitles() {
        document.querySelectorAll(CONFIG.selectors.titleCell).forEach(cell => {
            if (this.displayMode === 'original') {
                const originalHTML = cell.getAttribute('data-original-html');
                if (originalHTML) {
                    cell.innerHTML = originalHTML;
                }
                return;
            }

            if (!cell.hasAttribute('data-original-html')) {
                cell.setAttribute('data-original-html', cell.innerHTML);
            }

            const walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT, null, false);
            const textNodes = [];
            let node;
            while (node = walker.nextNode()) {
                textNodes.push(node);
            }

            textNodes.forEach(textNode => {
                const originalText = textNode.textContent;
                
                // 如果文本不需要转换，直接跳过
                if (!this.shouldConvertText(originalText)) {
                    return;
                }

                // 智能分割文本
                const parts = this.splitText(originalText);
                let newText = '';

                parts.forEach(part => {
                    if (part.needConvert) {
                        const { simplified, traditionalTW } = Utils.convertText(part.text);
                        newText += this.displayMode === 'simplified' ? simplified : traditionalTW;
                    } else {
                        newText += part.text;
                    }
                });

                textNode.textContent = newText;
            });
        });
    }

    shouldHideByTitle(title, blockedKeywords) {
        const { original, simplified, traditionalTW, traditionalHK } = Utils.convertText(title);

        return blockedKeywords.some(keyword => {
            if (typeof keyword === 'string') {
                const keywordVariants = Utils.convertText(keyword);
                const lowerKeyword = keyword.toLowerCase();

                return [original, simplified, traditionalTW, traditionalHK].some(variant =>
                    variant.toLowerCase().includes(lowerKeyword) ||
                    variant.toLowerCase().includes(keywordVariants.simplified.toLowerCase()) ||
                    variant.toLowerCase().includes(keywordVariants.traditionalTW.toLowerCase()) ||
                    variant.toLowerCase().includes(keywordVariants.traditionalHK.toLowerCase())
                );
            }
            return keyword instanceof RegExp && (
                original.match(keyword) ||
                simplified.match(keyword) ||
                traditionalTW.match(keyword) ||
                traditionalHK.match(keyword)
            );
        });
    }
}

/**
 * 过滤管理类
 */
class FilterManager {
    constructor(blockListManager, titleManager) {
        Utils.log('初始化过滤管理器');
        this.blockListManager = blockListManager;
        this.titleManager = titleManager;
    }

    init() {
        Utils.log('应用过滤规则');
        this.applyFilters();
        // 初始化时应用标题显示模式
        this.uiManager?.updateAllTitles();
    }

    setUIManager(uiManager) {
        this.uiManager = uiManager;
    }

    applyFilters() {
        try {
            document.querySelectorAll(`${CONFIG.selectors.torrentList}[style*='display: none']`)
                .forEach(elem => elem.style.display = '');

            if (!this.blockListManager.blockList.length) {
                Utils.log('没有黑名单规则，跳过过滤');
                return;
            }

            const blockedUserIds = this.blockListManager.getUserIds();
            const blockedKeywords = this.blockListManager.getKeywords();

            if (!blockedUserIds.length && !blockedKeywords.length) {
                Utils.log('黑名单为空，跳过过滤');
                return;
            }

            Utils.log(`开始过滤: ${blockedUserIds.length} 个用户ID, ${blockedKeywords.length} 个关键词`);
            this.filterTorrentList(blockedUserIds, blockedKeywords);
        } catch (error) {
            Utils.handleError(error, 'FilterManager.applyFilters');
        }
    }

    filterTorrentList(blockedUserIds, blockedKeywords) {
        let n = 0; // 用于设置行的奇偶样式

        document.querySelectorAll(CONFIG.selectors.torrentList).forEach(elem => {
            try {
                const { title, userId } = this.extractItemInfo(elem);
                if (!title || !userId) return;

                if (this.shouldHideItem(userId, title, blockedUserIds, blockedKeywords)) {
                    elem.style.display = 'none'; // 隐藏元素而不是删除
                } else {
                    elem.style.display = ''; // 确保元素可见
                    // 设置奇偶行样式
                    elem.className = n % 2 === 0 ? 'even' : 'odd';
                    n++;
                }
            } catch (error) {
                Utils.handleError(error, 'FilterManager.filterTorrentList.item');
            }
        });

        // 过滤后更新标题显示
        this.uiManager?.updateAllTitles();
    }

    extractItemInfo(elem) {
        const titleCell = elem.querySelector(CONFIG.selectors.titleCell);
        const title = titleCell ? Array.from(titleCell.childNodes)
            .map(node => node.textContent?.trim())
            .filter(text => text)
            .join(' ') : '';

        const idMatch = elem.querySelector(CONFIG.selectors.userLink)?.href?.match(/user_id\/(\d+)/);
        const userId = idMatch ? parseInt(idMatch[1]) : null;

        return { title, userId };
    }

    shouldHideItem(userId, title, blockedUserIds, blockedKeywords) {
        if (blockedUserIds.includes(userId)) return true;
        return this.titleManager.shouldHideByTitle(title, blockedKeywords);
    }
}

/**
 * UI管理类
 */
class UIManager {
    constructor(blockListManager, filterManager, githubSyncManager, titleManager) {
        this.blockListManager = blockListManager;
        this.filterManager = filterManager;
        this.githubSyncManager = githubSyncManager;
        this.titleManager = titleManager;
        this.uiTexts = {
            manageButton: '管理种子黑名单',
            toggleButton: '切换标题显示：',
            simplified: '简体',
            traditional: '繁体',
            original: '原文',
            blockedUsers: '已屏蔽用户：',
            titleKeywords: '标题关键词（用分号分隔）：',
            keywordTips: [
                '提示：支持普通关键词和正则表达式',
                '- 普通关键词直接输入，用分号分隔',
                '- 正则表达式用 / 包裹，例如：/\\d+话/',
                '- 示例：关键词1；/\\d+话/；关键词2'
            ],
            userIdTips: [
                '提示：用户ID输入规则：',
                '- 支持纯数字ID，如：123456',
                '- 支持用户名(ID)格式，如：用户名(123456)',
                '- 多个ID之间用分号分隔'
            ],
            save: '保存',
            close: '关闭',
            githubSync: 'GitHub 同步',
            login: '登录',
            getTokenGuide: '获取 Token 指南',
            howToGetToken: '如何获取 GitHub Token：',
            tokenSteps: [
                '点击下方按钮打开 GitHub Token 设置页面',
                '点击 "Generate new token (classic)"',
                '在 Note 中输入描述（如：DMHY Block）',
                '在 Select scopes 中勾选 "gist"',
                '点击底部的 "Generate token" 按钮',
                '复制生成的 token 并粘贴到上方输入框'
            ],
            openTokenPage: '打开 Token 设置页面 →',
            loggedInAs: '已登录为：',
            logout: '退出',
            syncToGithub: '同步到 GitHub',
            syncFromGithub: '从 GitHub 同步',
            contributeStats: '贡献到公共统计池（用于生成黑名单用户排行榜）',
            userRanking: '黑名单用户排行榜',
            lastUpdate: '最后更新：'
        };
    }

    init() {
        this.addBlocklistUI();
        this.addContextMenu();
    }

    getDisplayModeText() {
        return this.titleManager.getDisplayModeText();
    }

    convertText(text) {
        if (this.titleManager.displayMode === 'original') {
            return text;
        }
        const { simplified, traditionalTW } = Utils.convertText(text);
        return this.titleManager.displayMode === 'simplified' ? simplified : traditionalTW;
    }

    convertTextArray(texts) {
        return texts.map(text => this.convertText(text));
    }

    updateUITexts() {
        const showBlocklistBtn = document.getElementById('show-blocklist');
        const toggleTitleBtn = document.getElementById('toggle-title-display');
        
        if (showBlocklistBtn) {
            showBlocklistBtn.textContent = this.convertText(this.uiTexts.manageButton);
        }
        if (toggleTitleBtn) {
            toggleTitleBtn.textContent = this.convertText(this.uiTexts.toggleButton) + this.getDisplayModeText();
        }
    }

    toggleTitleDisplay() {
        this.titleManager.toggleTitleDisplay();
        this.updateUITexts();
    }

    addBlocklistUI() {
        // 如果已经存在UI，先移除
        const existingUI = document.getElementById('dmhy-blocklist-ui');
        if (existingUI) {
            existingUI.remove();
        }

        const uiHtml = `
            <div id="dmhy-blocklist-ui" style="${STYLES.blocklistUI}">
                <button id="show-blocklist">${this.convertText(this.uiTexts.manageButton)}</button>
                <button id="toggle-title-display" style="margin-left:10px;">${this.convertText(this.uiTexts.toggleButton)}${this.getDisplayModeText()}</button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', uiHtml);

        // 确保在DOM加载完成后再绑定事件
        setTimeout(() => {
            const showBlocklistBtn = document.getElementById('show-blocklist');
            const toggleTitleBtn = document.getElementById('toggle-title-display');
            
            showBlocklistBtn?.addEventListener('click', () => this.showBlocklistManager());
            toggleTitleBtn?.addEventListener('click', () => this.toggleTitleDisplay());
        }, 0);
    }

    async showBlocklistManager() {
        // 如果已经存在管理界面，先移除
        const existingManager = document.getElementById('blocklist-manager');
        const existingOverlay = document.getElementById('blocklist-overlay');
        if (existingManager) existingManager.remove();
        if (existingOverlay) existingOverlay.remove();

        const managerHtml = `
            <div id="blocklist-manager" style="${STYLES.manager}">
                <h3 style="margin-top:0;">${this.convertText(this.uiTexts.manageButton)}</h3>
                <div style="margin-bottom:10px;">
                    <label>${this.convertText(this.uiTexts.blockedUsers)}</label><br>
                    <textarea id="user-ids" style="width:100%;height:100px;margin-top:5px;resize:none;border:1px solid #ccc;"></textarea>
                    <div id="user-ids-error" style="color:red;font-size:12px;margin-top:3px;display:none;"></div>
                </div>
                <div style="margin-bottom:10px;">
                    <label>${this.convertText(this.uiTexts.titleKeywords)}</label><br>
                    <textarea id="keywords" style="width:100%;height:100px;margin-top:5px;resize:none;border:1px solid #ccc;"></textarea>
                    <div id="keywords-error" style="color:red;font-size:12px;margin-top:3px;display:none;"></div>
                </div>
                <div style="display:flex;justify-content:space-between;color:#666;font-size:12px;margin-top:5px;">
                    <div style="flex:1;margin-right:10px;">
                        ${this.convertTextArray(this.uiTexts.keywordTips).join('<br>')}
                    </div>
                    <div style="flex:1;margin-left:10px;">
                        ${this.convertTextArray(this.uiTexts.userIdTips).join('<br>')}
                    </div>
                </div>
                <div style="margin-top:10px;text-align:right;">
                    <button id="save-blocklist" style="padding:5px 15px;">${this.convertText(this.uiTexts.save)}</button>
                    <button id="close-manager" style="padding:5px 15px;margin-left:10px;">${this.convertText(this.uiTexts.close)}</button>
                </div>
                <div style="margin-top:20px;border-top:1px solid #ccc;padding-top:10px;">
                    <h4 style="margin:0 0 10px 0;">GitHub 同步</h4>
                    <div id="github-login-section" style="display:none;">
                        <div style="margin-bottom:10px;">
                            <input type="text" id="github-token" placeholder="GitHub Personal Access Token" style="width:100%;margin-bottom:10px;padding:5px;">
                            <button id="github-login" style="padding:5px 15px;">${this.convertText(this.uiTexts.login)}</button>
                            <button id="get-token-guide" style="padding:5px 15px;margin-left:10px;background-color:#2ea44f;color:white;border:none;cursor:pointer;">
                                ${this.convertText(this.uiTexts.getTokenGuide)}
                            </button>
                        </div>
                        <div id="token-guide" style="display:none;background-color:#f6f8fa;padding:10px;border-radius:4px;margin-top:10px;font-size:12px;line-height:1.5;">
                            <h5 style="margin:0 0 10px 0;">${this.convertText(this.uiTexts.howToGetToken)}</h5>
                            <ol style="margin:0;padding-left:20px;">
                                ${this.convertTextArray(this.uiTexts.tokenSteps).map(step => `<li>${step}</li>`).join('')}
                            </ol>
                            <div style="margin-top:10px;text-align:right;">
                                <a href="https://github.com/settings/tokens" target="_blank" style="color:#0366d6;text-decoration:none;">
                                    ${this.convertText(this.uiTexts.openTokenPage)}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div id="github-sync-section" style="display:none;">
                        <div style="margin-bottom:10px;">
                            ${this.convertText(this.uiTexts.loggedInAs)}<span id="github-username"></span>
                            <button id="github-logout" style="margin-left:10px;padding:2px 8px;">${this.convertText(this.uiTexts.logout)}</button>
                        </div>
                        <div style="margin-bottom:10px;">
                            <button id="sync-to-github" style="padding:5px 15px;margin-right:10px;">${this.convertText(this.uiTexts.syncToGithub)}</button>
                            <button id="sync-from-github" style="padding:5px 15px;">${this.convertText(this.uiTexts.syncFromGithub)}</button>
                        </div>
                        <div style="margin-bottom:10px;">
                            <label>
                                <input type="checkbox" id="contribute-stats">
                                ${this.convertText(this.uiTexts.contributeStats)}
                            </label>
                        </div>
                        <div id="stats-section" style="display:none;">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                                <h5 style="margin:0;">${this.convertText(this.uiTexts.userRanking)}</h5>
                                <div style="font-size:12px;color:#666;">
                                    ${this.convertText(this.uiTexts.lastUpdate)}<span id="stats-last-update">-</span>
                                </div>
                            </div>
                            <div id="stats-list" style="max-height:200px;overflow-y:auto;"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="blocklist-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;"></div>
        `;
        document.body.insertAdjacentHTML('beforeend', managerHtml);

        this.initManagerEvents();
        this.fillManagerData();
        this.initGitHubEvents();
        
        // 如果已开启贡献，显示统计信息并更新
        if (this.githubSyncManager.isContributing) {
            const statsSection = document.getElementById('stats-section');
            statsSection.style.display = 'block';
            await this.updateStatsList();
        }
    }

    initManagerEvents() {
        const closeManager = () => {
            if (this.hasUnsavedChanges()) {
                if (confirm('有未保存的更改，确定要关闭吗？')) {
                    document.getElementById('blocklist-manager')?.remove();
                    document.getElementById('blocklist-overlay')?.remove();
                }
            } else {
                document.getElementById('blocklist-manager')?.remove();
                document.getElementById('blocklist-overlay')?.remove();
            }
        };

        document.getElementById('close-manager')?.addEventListener('click', closeManager);

        document.getElementById('blocklist-overlay')?.addEventListener('click', e => {
            if (e.target === e.currentTarget) {
                closeManager();
            }
        });

        document.getElementById('save-blocklist')?.addEventListener('click', async () => {
            const saveResult = await this.saveManagerData();
            if (saveResult) {
                closeManager();
                this.filterManager.applyFilters();
            }
        });

        document.getElementById('user-ids')?.addEventListener('input', () => {
            this.validateManagerData();
        });

        document.getElementById('keywords')?.addEventListener('input', () => {
            this.validateManagerData();
        });
    }

    fillManagerData() {
        const keywords = this.blockListManager.getKeywords();
        const keywordsText = keywords.map(k => {
            if (k instanceof RegExp) {
                return `/${k.source}/`;
            }
            return k;
        }).join('；');

        // 如果有关键词，在末尾添加分号
        document.getElementById('keywords').value = keywordsText ? keywordsText + '；' : '';

        // 获取用户ID列表并在末尾添加分号
        const userIds = this.blockListManager.getUserIds()
            .map(id => {
                const name = this.blockListManager.userNameMap.get(id.toString());
                return name ? `${name}(${id})` : id;
            })
            .join('；');

        document.getElementById('user-ids').value = userIds ? userIds + '；' : '';

        // 异步更新缺失的用户名
        this.updateMissingUserNames();
    }

    async updateMissingUserNames() {
        const userIds = this.blockListManager.getUserIds();
        const missingIds = userIds.filter(id => !this.blockListManager.userNameMap.has(id.toString()));

        if (missingIds.length > 0) {
            for (const id of missingIds) {
            try {
                const userName = await this.blockListManager.getUserName(id, true);
                if (userName) {
                        // 更新输入框中的用户名显示
                        const currentValue = document.getElementById('user-ids').value;
                        const newValue = currentValue.replace(
                            new RegExp(`\\b${id}\\b`),
                            `${userName}(${id})`
                        );
                        document.getElementById('user-ids').value = newValue;
                }
            } catch (error) {
                    this.handleError(error, 'UIManager.updateMissingUserNames');
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        }
    }

    hasUnsavedChanges() {
        const currentUserIds = document.getElementById('user-ids')?.value.trim() || '';
        const currentKeywords = document.getElementById('keywords')?.value.trim() || '';

        const originalUserIds = this.blockListManager.getUserIds()
            .map(id => {
                const name = this.blockListManager.userNameMap.get(id.toString());
                return name ? `${name}(${id})` : id;
            })
            .join('；');

        const originalKeywords = this.blockListManager.getKeywords()
            .map(k => k instanceof RegExp ? `/${k.source}/` : k)
            .join('；');

        const normalizeString = (str) => str.split(/[;；]/)
            .map(s => s.trim())
            .filter(s => s)
            .sort()
            .join('；');

        return normalizeString(currentUserIds) !== normalizeString(originalUserIds) ||
               normalizeString(currentKeywords) !== normalizeString(originalKeywords);
    }

    validateManagerData() {
        const userIdsInput = document.getElementById('user-ids');
        const keywordsInput = document.getElementById('keywords');
        const userIdsError = document.getElementById('user-ids-error');
        const keywordsError = document.getElementById('keywords-error');
        const saveButton = document.getElementById('save-blocklist');

        let isValid = true;

        userIdsError.style.display = 'none';
        keywordsError.style.display = 'none';
        userIdsInput.style.borderColor = '#ccc';
        keywordsInput.style.borderColor = '#ccc';
        saveButton.style.borderColor = '';

        if (userIdsInput.value.trim()) {
            const items = userIdsInput.value.trim().split(/[;；]/).map(item => item.trim()).filter(item => item);
            const invalidItems = items.filter(item => {
                return !(/^\d+$/.test(item) || /^.+\(\d+\)$/.test(item));
            });

            if (invalidItems.length > 0) {
                userIdsError.textContent = `以下用户ID格式无效：${invalidItems.join('、')}`;
                userIdsError.style.display = 'block';
                userIdsInput.style.borderColor = 'red';
                isValid = false;
            }
        }

        if (keywordsInput.value.trim()) {
            const keywords = keywordsInput.value.trim().split(/[;；]/).map(k => k.trim()).filter(k => k);
            const invalidKeywords = keywords.filter(k => {
                if (k === '/') return false;

                if (k.startsWith('/') && k.endsWith('/')) {
                    try {
                        new RegExp(k.slice(1, -1));
                        return false;
                    } catch (e) {
                        return true;
                    }
                }
                return false;
            });

            if (invalidKeywords.length > 0) {
                keywordsError.textContent = `以下正则表达式格式无效：${invalidKeywords.join('、')}`;
                keywordsError.style.display = 'block';
                keywordsInput.style.borderColor = 'red';
                isValid = false;
            }
        }

        if (!isValid) {
            saveButton.style.borderColor = 'red';
        }

        return { isValid };
    }

    async saveManagerData() {
        const { isValid } = this.validateManagerData();

        if (!isValid) {
            alert('请修正输入错误后再保存');
            return false;
        }

        const oldUserIds = this.blockListManager.getUserIds();

        const userIdsInput = document.getElementById('user-ids').value
            .split(/[;；]/)
            .map(item => item.trim())
            .filter(item => item);

        const validIds = [];
        const invalidItems = [];
        const retainedIds = [];

        userIdsInput.forEach(item => {
            if (/^\d+$/.test(item)) {
                validIds.push(parseInt(item));
                return;
            }

            const idMatch = item.match(/^.+\((\d+)\)$/);
            if (idMatch && /^\d+$/.test(idMatch[1])) {
                validIds.push(parseInt(idMatch[1]));
                return;
            }

            const partialMatch = item.match(/\((\d+)/);
            if (partialMatch) {
                const partialId = parseInt(partialMatch[1]);
                if (oldUserIds.includes(partialId)) {
                    retainedIds.push(partialId);
                    invalidItems.push(`${item} (已保留原数据)`);
                    return;
                }
            }

            invalidItems.push(item);
        });

        const finalIds = [...new Set([...validIds, ...retainedIds])];

        if (invalidItems.length > 0) {
            alert(`以下内容格式无效：${invalidItems.join('、')}`);
        }

        const newKeywords = document.getElementById('keywords').value
            .split(/[;；]/)
            .map(k => k.trim())
            .filter(k => k)
            .map(k => {
                if (k.startsWith('/') && k.endsWith('/')) {
                    try {
                        return new RegExp(k.slice(1, -1));
                    } catch (e) {
                        return k;
                    }
                }
                return k;
            });

        this.blockListManager.updateBlockList('userId', finalIds);
        this.blockListManager.updateBlockList('keywords', newKeywords);

        const addedUserIds = finalIds.filter(id => !oldUserIds.includes(id));

        if (addedUserIds.length > 0) {
            this.processNewUserIds(addedUserIds);
        }

        // 如果开启了贡献到公共池，自动同步
        if (this.githubSyncManager.isContributing) {
            await this.githubSyncManager.contributeToPublicStats();
            await this.updateStatsList();
        }

        return true;
    }

    processNewUserIds(userIds) {
        if (window.requestIdleCallback) {
            requestIdleCallback(() => {
                this.processUserNameQueue(userIds);
            }, { timeout: 1000 });
        } else {
            setTimeout(() => {
                this.processUserNameQueue(userIds);
            }, 0);
        }
    }

    async processUserNameQueue(userIds) {
        for (const userId of userIds) {
            try {
                const userName = await this.blockListManager.getUserName(userId, true);
                if (userName) {
                    console.log(`[DMHY Block] 成功获取用户名: ${userName}(${userId})`);
                }
            } catch (error) {
                this.handleError(error, 'UIManager.processUserNameQueue');
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    addContextMenu() {
        const menuHtml = `
            <div id="dmhy-context-menu" style="display:none;position:fixed;background:white;
                border:1px solid #ccc;border-radius:3px;padding:5px;box-shadow:2px 2px 5px rgba(0,0,0,0.2);z-index:10000;">
                <div id="block-user" style="padding:5px 10px;cursor:pointer;hover:background-color:#f0f0f0;">
                    添加用户到黑名单
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', menuHtml);
        this.initContextMenuEvents();
    }

    initContextMenuEvents() {
        const menu = document.getElementById('dmhy-context-menu');

        document.addEventListener('contextmenu', e => {
            const userLink = e.target.closest(CONFIG.selectors.userLink);
            if (userLink) {
                e.preventDefault();
                const userId = userLink.href.match(/user_id\/(\d+)/)?.[1];
                const userName = userLink.textContent;
                if (userId) {
                    menu.style.display = 'block';
                    menu.style.left = e.clientX + 'px';
                    menu.style.top = e.clientY + 'px';

                    document.getElementById('block-user').onclick = e => {
                        e.stopPropagation();
                        if (this.blockListManager.addUser(parseInt(userId), userName)) {
                            this.filterManager.applyFilters();
                        }
                        menu.style.display = 'none';
                    };
                }
            }
        });

        document.addEventListener('click', e => {
            if (!menu.contains(e.target)) {
                menu.style.display = 'none';
            }
        });

        window.addEventListener('scroll', () => {
            menu.style.display = 'none';
        });
    }

    initGitHubEvents() {
        const githubLoginSection = document.getElementById('github-login-section');
        const githubSyncSection = document.getElementById('github-sync-section');
        const githubUsername = document.getElementById('github-username');
        const contributeStats = document.getElementById('contribute-stats');
        const statsSection = document.getElementById('stats-section');
        const tokenGuide = document.getElementById('token-guide');

        // 显示登录状态
        if (this.githubSyncManager.githubUser) {
            githubLoginSection.style.display = 'none';
            githubSyncSection.style.display = 'block';
            githubUsername.textContent = this.githubSyncManager.githubUser;
            contributeStats.checked = this.githubSyncManager.isContributing;
        } else {
            githubLoginSection.style.display = 'block';
            githubSyncSection.style.display = 'none';
        }

        // 获取 Token 指南按钮
        document.getElementById('get-token-guide')?.addEventListener('click', () => {
            tokenGuide.style.display = tokenGuide.style.display === 'none' ? 'block' : 'none';
        });

        // 登录按钮
        document.getElementById('github-login')?.addEventListener('click', async () => {
            const token = document.getElementById('github-token').value.trim();
            if (!token) {
                alert('请输入 GitHub Personal Access Token');
                return;
            }

            this.githubSyncManager.setToken(token);
            if (await this.githubSyncManager.validateToken()) {
                githubLoginSection.style.display = 'none';
                githubSyncSection.style.display = 'block';
                githubUsername.textContent = this.githubSyncManager.githubUser;
            } else {
                alert('Token 无效，请检查后重试');
            }
        });

        // 退出按钮
        document.getElementById('github-logout')?.addEventListener('click', () => {
            this.githubSyncManager.setToken('');
            this.githubSyncManager.setContributing(false);
            githubLoginSection.style.display = 'block';
            githubSyncSection.style.display = 'none';
            statsSection.style.display = 'none';
        });

        // 同步到 GitHub
        document.getElementById('sync-to-github')?.addEventListener('click', async () => {
            if (await this.githubSyncManager.updateGist()) {
                alert('同步成功');
                if (this.githubSyncManager.isContributing) {
                    await this.githubSyncManager.contributeToPublicStats();
                }
            } else {
                alert('同步失败，请检查网络连接或 Token 权限');
            }
        });

        // 从 GitHub 同步
        document.getElementById('sync-from-github')?.addEventListener('click', async () => {
            if (await this.githubSyncManager.syncFromGist()) {
                this.fillManagerData();
                this.filterManager.applyFilters();
                alert('同步成功');
            } else {
                alert('同步失败，请检查网络连接或 Token 权限');
            }
        });

        // 贡献到公共统计池
        contributeStats?.addEventListener('change', async (e) => {
            this.githubSyncManager.setContributing(e.target.checked);
            if (e.target.checked) {
                await this.githubSyncManager.contributeToPublicStats();
                await this.updateStatsList();
                statsSection.style.display = 'block';
            } else {
                // 取消贡献时，从公共池中移除数据
                await this.githubSyncManager.removeFromPublicStats();
                statsSection.style.display = 'none';
            }
        });
    }

    async updateStatsList() {
        const statsList = document.getElementById('stats-list');
        const statsLastUpdate = document.getElementById('stats-last-update');
        const stats = await this.githubSyncManager.getPublicStats();
        
        if (stats && stats.length > 0) {
            const html = stats.slice(0, 10).map((stat, index) => `
                <div style="padding:5px;border-bottom:1px solid #eee;">
                    ${index + 1}. ${stat.userName} (ID: ${stat.userId}) - 被 ${stat.count} 人屏蔽
                </div>
            `).join('');
            statsList.innerHTML = html;
            statsLastUpdate.textContent = new Date().toLocaleString();
        } else {
            statsList.innerHTML = '<div style="padding:5px;color:#666;">暂无统计数据</div>';
            statsLastUpdate.textContent = '-';
        }
    }

    updateAllTitles() {
        document.querySelectorAll(CONFIG.selectors.titleCell).forEach(cell => {
            if (this.displayMode === 'original') {
                const originalHTML = cell.getAttribute('data-original-html');
                if (originalHTML) {
                    cell.innerHTML = originalHTML;
                }
                return;
            }

            if (!cell.hasAttribute('data-original-html')) {
                cell.setAttribute('data-original-html', cell.innerHTML);
            }

            const walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT, null, false);
            const textNodes = [];
            let node;
            while (node = walker.nextNode()) {
                textNodes.push(node);
            }

            textNodes.forEach(textNode => {
                const originalText = textNode.textContent;
                
                // 如果文本不需要转换，直接跳过
                if (!this.shouldConvertText(originalText)) {
                    return;
                }

                // 智能分割文本
                const parts = this.splitText(originalText);
                let newText = '';

                parts.forEach(part => {
                    if (part.needConvert) {
                        const { simplified, traditionalTW } = Utils.convertText(part.text);
                        newText += this.displayMode === 'simplified' ? simplified : traditionalTW;
                    } else {
                        newText += part.text;
                    }
                });

                textNode.textContent = newText;
            });
        });
    }
}

/**
 * 广告拦截类
 */
class AdBlocker {
    static init() {
        this.hideAds();

        document.addEventListener('DOMContentLoaded', () => {
            this.hideAds();
        });

        this.initDOMObserver();

        window.addEventListener('load', () => {
            this.hideAds();
        });
    }

    static initDOMObserver() {
        const config = {
            childList: true,
            subtree: true,
            attributes: true,
        };

        const observer = new MutationObserver((mutations) => {
            window.requestAnimationFrame(() => {
                this.hideAds();
            });
        });

        observer.observe(document.documentElement, config);
    }

    static hideAds() {
        if (!document.getElementById('dmhy-ad-styles')) {
            const style = document.createElement('style');
            style.id = 'dmhy-ad-styles';
            style.textContent = CONFIG.selectors.adSelectors
                .map(selector => `${selector} { display: none !important; }`)
                .join('\n');
            document.head.appendChild(style);
        }

        CONFIG.selectors.adSelectors.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(element => {
                    if (element) {
                        element.style.setProperty('display', 'none', 'important');
                    }
                });
            } catch (error) {
                Utils.handleError(error, 'AdBlocker.hideAds');
            }
        });
    }
}

/**
 * 事件管理类
 */
class EventManager {
    constructor(filterManager) {
        this.filterManager = filterManager;
    }

    init() {
        this.initSortingEvents();
    }

    initSortingEvents() {
        document.querySelectorAll("th.header").forEach(header => {
            header.addEventListener('click', () => {
                setTimeout(() => this.filterManager.applyFilters(), 100);
            });
        });
    }
}

/**
 * GitHub 同步管理类
 */
class GitHubSyncManager {
    constructor(blockListManager) {
        Utils.log('初始化 GitHub 同步管理器');
        this.blockListManager = blockListManager;
        this.token = GM_getValue(CONFIG.storage.githubTokenKey, '');
        this.gistId = GM_getValue(CONFIG.storage.githubGistIdKey, '');
        this.isContributing = GM_getValue(CONFIG.storage.isContributingKey, false);
        this.githubUser = GM_getValue(CONFIG.storage.githubUserKey, '');
        this.publicStatsGistId = CONFIG.github.publicStatsGistId;
    }

    async init() {
        if (this.token) {
            await this.validateToken();
        }
    }

    async validateToken() {
        try {
            Utils.log('验证 GitHub Token');
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const userData = await response.json();
                this.githubUser = userData.login;
                GM_setValue(CONFIG.storage.githubUserKey, this.githubUser);
                Utils.log(`GitHub 用户验证成功: ${this.githubUser}`);
                return true;
            } else {
                Utils.log('GitHub Token 无效', 'warn');
                this.token = '';
                this.githubUser = '';
                GM_setValue(CONFIG.storage.githubTokenKey, '');
                GM_setValue(CONFIG.storage.githubUserKey, '');
                return false;
            }
        } catch (error) {
            Utils.log('GitHub Token 验证失败', 'error');
            return false;
        }
    }

    async findExistingGist() {
        try {
            const response = await fetch('https://api.github.com/gists', {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const gists = await response.json();
                const existingGist = gists.find(gist => gist.description === CONFIG.github.gistDescription);
                if (existingGist) {
                    this.gistId = existingGist.id;
                    GM_setValue(CONFIG.storage.githubGistIdKey, this.gistId);
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('[DMHY Block] 查找 Gist 失败:', error);
            return false;
        }
    }

    getBlockListData() {
        return {
            userIds: this.blockListManager.getUserIds(),
            keywords: this.blockListManager.getKeywords().map(k => 
                k instanceof RegExp ? `/${k.source}/` : k
            ),
            lastUpdate: new Date().toISOString()
        };
    }

    async createGist() {
        try {
            // 先检查是否已存在 Gist
            if (await this.findExistingGist()) {
                return true;
            }

            // 如果没有找到现有 Gist，创建新的
            const createResponse = await fetch('https://api.github.com/gists', {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify({
                    description: CONFIG.github.gistDescription,
                    public: false,
                    files: {
                        'blocklist.json': {
                            content: JSON.stringify(this.getBlockListData())
                        }
                    }
                })
            });

            if (createResponse.ok) {
                const gist = await createResponse.json();
                this.gistId = gist.id;
                GM_setValue(CONFIG.storage.githubGistIdKey, this.gistId);
                return true;
            }
            return false;
        } catch (error) {
            console.error('[DMHY Block] Create gist error:', error);
            return false;
        }
    }

    async updateGist() {
        if (!this.gistId) {
            return await this.createGist();
        }

        try {
            const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify({
                    files: {
                        'blocklist.json': {
                            content: JSON.stringify(this.getBlockListData())
                        }
                    }
                })
            });

            if (!response.ok) {
                console.error('[DMHY Block] 更新 Gist 失败:', response.status);
                if (response.status === 404) {
                    this.gistId = '';
                    GM_setValue(CONFIG.storage.githubGistIdKey, '');
                    return await this.createGist();
                }
                return false;
            }

            return true;
        } catch (error) {
            console.error('[DMHY Block] Update gist error:', error);
            return false;
        }
    }

    async syncFromGist() {
        if (!this.gistId) {
            Utils.log('未找到 Gist ID，尝试查找现有 Gist');
            if (!await this.findExistingGist()) {
                Utils.log('未找到现有 Gist', 'warn');
                return false;
            }
        }

        try {
            Utils.log(`从 Gist ${this.gistId} 同步数据`);
            const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                Utils.log(`从 Gist 同步失败: ${response.status}`, 'error');
                if (response.status === 404) {
                    this.gistId = '';
                    GM_setValue(CONFIG.storage.githubGistIdKey, '');
                    return await this.syncFromGist();
                }
                return false;
            }

            const gist = await response.json();
            const content = JSON.parse(gist.files['blocklist.json'].content);
            
            this.blockListManager.updateBlockList('userId', content.userIds);
            this.blockListManager.updateBlockList('keywords', content.keywords.map(k => {
                if (k.startsWith('/') && k.endsWith('/')) {
                    try {
                        return new RegExp(k.slice(1, -1));
                    } catch (e) {
                        return k;
                    }
                }
                return k;
            }));

            Utils.log('Gist 同步成功');
            return true;
        } catch (error) {
            Utils.log('Gist 同步失败', 'error');
            return false;
        }
    }

    async getPublicStats() {
        try {
            const response = await fetch(`https://api.github.com/gists/${this.publicStatsGistId}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                console.error('[DMHY Block] 获取公共池数据失败:', response.status);
                return null;
            }

            const gist = await response.json();
            if (!gist.files || !gist.files['stats.json']) {
                console.error('[DMHY Block] 公共池文件不存在');
                return null;
            }

            const content = gist.files['stats.json'].content;
            if (!content) {
                console.error('[DMHY Block] 公共池内容为空');
                return null;
            }

            try {
                const parsedContent = JSON.parse(content);
                if (!parsedContent.contributors) {
                    parsedContent.contributors = [];
                }
                
                // 计算每个用户ID被屏蔽的次数
                const stats = {};
                parsedContent.contributors.forEach(contributor => {
                    contributor.userIds.forEach(userId => {
                        stats[userId] = (stats[userId] || 0) + 1;
                    });
                });

                // 转换为数组并排序
                const sortedStats = Object.entries(stats)
                    .map(([userId, count]) => ({ userId: parseInt(userId), count }))
                    .sort((a, b) => b.count - a.count);

                // 获取所有用户ID的用户名
                const userIds = sortedStats.map(stat => stat.userId);
                const userNames = await this.getUserNames(userIds);

                // 将用户名添加到统计结果中
                return sortedStats.map(stat => ({
                    ...stat,
                    userName: userNames[stat.userId] || `用户${stat.userId}`
                }));
            } catch (parseError) {
                console.error('[DMHY Block] 解析公共池数据失败:', parseError);
                return null;
            }
        } catch (error) {
            console.error('[DMHY Block] 获取公共统计失败:', error);
            return null;
        }
    }

    async removeFromPublicStats() {
        try {
            // 获取现有统计数据
            const response = await fetch(`https://api.github.com/gists/${this.publicStatsGistId}`, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                console.error('[DMHY Block] 获取公共池数据失败:', response.status);
                return;
            }

            const gist = await response.json();
            if (!gist.files || !gist.files['stats.json']) {
                console.error('[DMHY Block] 公共池文件不存在');
                return;
            }

            const content = gist.files['stats.json'].content;
            if (!content) {
                console.error('[DMHY Block] 公共池内容为空');
                return;
            }

            try {
                const parsedContent = JSON.parse(content);
                if (!parsedContent.contributors) {
                    parsedContent.contributors = [];
                }
                
                // 移除当前用户的贡献
                parsedContent.contributors = parsedContent.contributors.filter(c => c.githubUser !== this.githubUser);

                // 更新 Gist
                const updateResponse = await fetch(`https://api.github.com/gists/${this.publicStatsGistId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `token ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    body: JSON.stringify({
                        files: {
                            'stats.json': {
                                content: JSON.stringify(parsedContent, null, 2)
                            }
                        }
                    })
                });

                if (!updateResponse.ok) {
                    console.error('[DMHY Block] 更新公共池失败:', updateResponse.status);
                }
            } catch (parseError) {
                console.error('[DMHY Block] 解析公共池数据失败:', parseError);
            }
        } catch (error) {
            console.error('[DMHY Block] 从公共池移除数据失败:', error);
        }
    }

    async contributeToPublicStats() {
        if (!this.isContributing) return;

        try {
            const userIds = this.blockListManager.getUserIds();

            // 获取现有统计数据
            const response = await fetch(`https://api.github.com/gists/${this.publicStatsGistId}`, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                console.error('[DMHY Block] 获取公共池数据失败:', response.status);
                return;
            }

            const gist = await response.json();
            if (!gist.files || !gist.files['stats.json']) {
                console.error('[DMHY Block] 公共池文件不存在');
                return;
            }

            const content = gist.files['stats.json'].content;
            let parsedContent;
            
            try {
                parsedContent = content ? JSON.parse(content) : { contributors: [] };
            } catch (parseError) {
                console.error('[DMHY Block] 解析公共池数据失败:', parseError);
                parsedContent = { contributors: [] };
            }

            if (!parsedContent.contributors) {
                parsedContent.contributors = [];
            }
            
            // 更新或添加当前用户的贡献
            const contributorIndex = parsedContent.contributors.findIndex(c => c.githubUser === this.githubUser);
            if (contributorIndex >= 0) {
                parsedContent.contributors[contributorIndex] = {
                    githubUser: this.githubUser,
                    userIds: userIds,
                    lastUpdate: new Date().toISOString()
                };
            } else {
                parsedContent.contributors.push({
                    githubUser: this.githubUser,
                    userIds: userIds,
                    lastUpdate: new Date().toISOString()
                });
            }

            // 更新 Gist
            const updateResponse = await fetch(`https://api.github.com/gists/${this.publicStatsGistId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify({
                    files: {
                        'stats.json': {
                            content: JSON.stringify(parsedContent, null, 2)
                        }
                    }
                })
            });

            if (!updateResponse.ok) {
                console.error('[DMHY Block] 更新公共池失败:', updateResponse.status);
            }
        } catch (error) {
            console.error('[DMHY Block] 贡献到公共池失败:', error);
        }
    }

    async getUserNames(userIds) {
        const userNames = {};
        const unknownIds = userIds.filter(id => !this.blockListManager.userNameMap.has(id.toString()));

        // 批量获取未知用户名的用户信息
        for (const id of unknownIds) {
            try {
                const userName = await this.blockListManager.getUserName(id, true);
                if (userName) {
                    userNames[id] = userName;
                }
            } catch (error) {
                console.error(`[DMHY Block] Error getting username for user ${id}:`, error);
            }
            // 添加延迟以避免请求过快
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // 合并已知的用户名
        userIds.forEach(id => {
            const cachedName = this.blockListManager.userNameMap.get(id.toString());
            if (cachedName) {
                userNames[id] = cachedName;
            }
        });

        return userNames;
    }

    setToken(token) {
        this.token = token;
        GM_setValue(CONFIG.storage.githubTokenKey, token);
    }

    setContributing(isContributing) {
        this.isContributing = isContributing;
        GM_setValue(CONFIG.storage.isContributingKey, isContributing);
    }
}

/**
 * 应用主类
 */
class App {
    static async init() {
        try {
            Utils.log('初始化应用');
            await Utils.init();
            Utils.log('文字转换器初始化完成');

            AdBlocker.init();
            Utils.log('广告拦截器初始化完成');

            const blockListManager = new BlockListManager();
            await blockListManager.init();
            Utils.log('黑名单管理器初始化完成');

            const titleManager = new TitleManager();
            titleManager.init();
            Utils.log('标题管理器初始化完成');

            const filterManager = new FilterManager(blockListManager, titleManager);
            const githubSyncManager = new GitHubSyncManager(blockListManager);
            await githubSyncManager.init();
            Utils.log('GitHub 同步管理器初始化完成');

            const uiManager = new UIManager(blockListManager, filterManager, githubSyncManager, titleManager);
            const eventManager = new EventManager(filterManager);

            uiManager.init();
            filterManager.init();
            eventManager.init();
            Utils.log('应用初始化完成');
        } catch (error) {
            Utils.log('应用初始化失败', 'error');
            Utils.handleError(error, 'App.init');
        }
    }
}

// 启动应用
(function() {
    'use strict';
    App.init();
})();

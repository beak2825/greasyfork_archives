// ==UserScript==
// @name         小说漫画网页广告拦截器
// @namespace    http://tampermonkey.net/
// @version      4.5.1
// @author       DeepSeek&Gemini
// @description  一个手机端via浏览器能用的强大的广告拦截器
// @match        *://*/*
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/525345/%E5%B0%8F%E8%AF%B4%E6%BC%AB%E7%94%BB%E7%BD%91%E9%A1%B5%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/525345/%E5%B0%8F%E8%AF%B4%E6%BC%AB%E7%94%BB%E7%BD%91%E9%A1%B5%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const DEFAULT_MODULE_STATE = {
        smartInterception: false,
        removeInlineScripts: false,
        removeExternalScripts: false,
        interceptThirdPartyResources: false,
        interceptSubdomains: false,
        manageCSP: false,
    };
    const MODULE_NAMES = {
        smartInterception: '智能拦截',
        removeInlineScripts: '移除内嵌脚本',
        removeExternalScripts: '移除外联脚本',
        interceptThirdPartyResources: '拦截第三方资源',
        interceptSubdomains: '拦截子域名资源',
        manageCSP: 'CSP策略管理',
    };
    const DEFAULT_CSP_RULES_TEMPLATE = [
        { id: 1, name: '仅允许同源外部脚本 (禁止内嵌)', rule: "script-src 'self'", enabled: false },
        { id: 2, name: '允许同源脚本和内嵌脚本', rule: "script-src 'self' 'unsafe-inline'", enabled: false },
        { id: 3, name: '禁止eval和Function执行', rule: "script-src 'unsafe-eval'", enabled: false },
        { id: 4, name: '仅允许同源外部样式 (禁止内联)', rule: "style-src 'self'", enabled: false },
        { id: 5, name: '允许同源样式和内联样式', rule: "style-src 'self' 'unsafe-inline'", enabled: false },
        { id: 6, name: '仅允许同源图片', rule: "img-src 'self'", enabled: false },
        { id: 7, name: '禁止所有框架加载', rule: "frame-src 'none'", enabled: false },
        { id: 8, name: '禁止所有媒体资源加载', rule: "media-src 'none'", enabled: false },
        { id: 9, name: '禁止所有对象嵌入', rule: "object-src 'none'", enabled: false }
    ];
    const CONFIG_STORAGE_KEY_PREFIX = `customAdBlockerConfig_`;
    let currentConfig = {
        modules: { ...DEFAULT_MODULE_STATE },
        cspRules: DEFAULT_CSP_RULES_TEMPLATE.map(rule => ({ ...rule })),
        whitelist: {},
    };

    class LRUCache {
        constructor(capacity = 100, defaultTTL = 0) {
            this.capacity = capacity;
            this.defaultTTL = defaultTTL;
            this.cache = new Map();
        }

        get(key) {
            if (!this.cache.has(key)) return null;
            const entry = this.cache.get(key);
            if (this.defaultTTL > 0 && (Date.now() - entry.timestamp) > this.defaultTTL) {
                this.cache.delete(key);
                return null;
            }
            this.cache.delete(key);
            this.cache.set(key, entry);
            return entry.value;
        }

        set(key, value, ttl) {
            const finalTTL = ttl !== undefined ? ttl : this.defaultTTL;
            const entry = {
                value: value,
                timestamp: Date.now(),
                ttl: finalTTL
            };
            if (this.cache.has(key)) {
                this.cache.delete(key);
            } else if (this.cache.size >= this.capacity) {
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }
            this.cache.set(key, entry);
        }

        has(key) {
            const entry = this.cache.get(key);
            if (!entry) return false;
            if (this.defaultTTL > 0 && (Date.now() - entry.timestamp) > this.defaultTTL) {
                this.cache.delete(key);
                return false;
            }
            return true;
        }

        delete(key) {
            return this.cache.delete(key);
        }

        clear() {
            this.cache.clear();
        }

        get size() {
            return this.cache.size;
        }
    }

    class URLResolutionCache {
        constructor() {
            this.hostnameCache = new LRUCache(1000, 300000);
            this.domainCache = new LRUCache(1000, 300000);
            this.absoluteUrlCache = new LRUCache(1000, 300000);
            this.thirdPartyCache = new LRUCache(1000, 300000);
        }

        isDynamicURL(url) {
            if (!url || typeof url !== 'string') return false;
            const dynamicPatterns = [
                /\?.*[tT]=/,
                /\?.*timestamp/,
                /\?.*rand/,
                /\?.*rnd/,
                /\?.*[0-9]{13,}/,
                /\?.*\d{10,}/,
                /\?.*[a-zA-Z0-9]{32,}/,
                /\/\d{10,}\./,
                /\/[0-9a-f]{32,}\./
            ];
            return dynamicPatterns.some(pattern => pattern.test(url));
        }

        getHostname(url) {
            if (!url || typeof url !== 'string') return null;
            const cacheKey = `hostname_${url}`;
            
            if (this.hostnameCache.has(cacheKey)) {
                return this.hostnameCache.get(cacheKey);
            }

            if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('about:blank')) {
                this.hostnameCache.set(cacheKey, null, 60000);
                return null;
            }

            try {
                const hostname = new URL(url, location.href).hostname;
                const ttl = this.isDynamicURL(url) ? 30000 : 300000;
                this.hostnameCache.set(cacheKey, hostname, ttl);
                return hostname;
            } catch (e) {
                this.hostnameCache.set(cacheKey, null, 30000);
                return null;
            }
        }

        getDomain(hostname) {
            if (!hostname) return null;
            const cacheKey = `domain_${hostname}`;
            
            if (this.domainCache.has(cacheKey)) {
                return this.domainCache.get(cacheKey);
            }

            const parts = hostname.split('.');
            const domain = parts.length <= 2 ? hostname : parts.slice(-2).join('.');
            this.domainCache.set(cacheKey, domain, 300000);
            return domain;
        }

        getAbsoluteURL(url) {
            if (!url) return '';
            const cacheKey = `absolute_${url}_${location.href}`;
            
            if (this.absoluteUrlCache.has(cacheKey)) {
                return this.absoluteUrlCache.get(cacheKey);
            }

            try {
                const absoluteUrl = new URL(url, location.href).href;
                const ttl = this.isDynamicURL(url) ? 30000 : 300000;
                this.absoluteUrlCache.set(cacheKey, absoluteUrl, ttl);
                return absoluteUrl;
            } catch (e) {
                this.absoluteUrlCache.set(cacheKey, url, 30000);
                return url;
            }
        }

        isThirdPartyHost(resourceHostname, currentHost, interceptSubdomains = false) {
            if (!resourceHostname) return false;
            
            const cacheKey = `thirdparty_${resourceHostname}_${currentHost}_${interceptSubdomains}`;
            if (this.thirdPartyCache.has(cacheKey)) {
                return this.thirdPartyCache.get(cacheKey);
            }

            const currentHostDomain = this.getDomain(currentHost);
            const resourceHostDomain = this.getDomain(resourceHostname);
            
            let isThirdParty = false;
            
            if (!currentHostDomain || !resourceHostDomain) {
                isThirdParty = false;
            } else if (resourceHostDomain === currentHostDomain) {
                if (interceptSubdomains && resourceHostname !== currentHost) {
                    isThirdParty = true;
                } else {
                    isThirdParty = false;
                }
            } else {
                isThirdParty = true;
            }
            
            this.thirdPartyCache.set(cacheKey, isThirdParty, 300000);
            return isThirdParty;
        }

        clear() {
            this.hostnameCache.clear();
            this.domainCache.clear();
            this.absoluteUrlCache.clear();
            this.thirdPartyCache.clear();
        }
    }

    const urlCache = new URLResolutionCache();

    const Utils = {
        truncateString(str, maxLength) {
            if (typeof str !== 'string') return '';
            if (str.length <= maxLength) return str;
            return str.slice(0, maxLength) + '...';
        },
        getCurrentHostname() {
            return location.hostname;
        },
        isElement(el) {
            return el instanceof Element;
        },
        getScriptContentPreview(scriptElement) {
            if (!scriptElement || scriptElement.tagName !== 'SCRIPT') return '';
            const content = scriptElement.textContent;
            if (content.length > 200) {
                return content.slice(0, 100) + '...';
            }
            return content.split(/\s+/).join(' ').slice(0, 100);
        },
        getIframeSrcPreview(iframeElement) {
            if (!iframeElement || iframeElement.tagName !== 'IFRAME') return '';
            return Utils.truncateString(iframeElement.src, 100);
        },
        getResourceHostname(url) {
            return urlCache.getHostname(url);
        },
        getDomain(hostname) {
            return urlCache.getDomain(hostname);
        },
        isThirdPartyHost(resourceHostname, currentHost) {
            return urlCache.isThirdPartyHost(resourceHostname, currentHost, currentConfig.modules.interceptSubdomains);
        },
        getAbsoluteURL(url) {
            return urlCache.getAbsoluteURL(url);
        },
        getContentIdentifier(element, reasonType = null) {
            if (!element && !reasonType) return null;
            
            if (element && Utils.isElement(element)) {
                const tagName = element.tagName;
                const src = element.src || element.getAttribute('data-src') || element.href || element.action || '';

                if (tagName === 'SCRIPT') {
                    return element.src ? `SCRIPT_SRC: ${Utils.truncateString(element.src, 100)}` : `SCRIPT_CONTENT: ${Utils.getScriptContentPreview(element)}`;
                } else if (tagName === 'IFRAME') {
                    return `IFRAME_SRC: ${Utils.truncateString(element.src, 100)}`;
                } else if (tagName === 'IMG') {
                    return src ? `IMG_SRC: ${Utils.truncateString(src, 100)}` : null;
                } else if (tagName === 'A') {
                    return src ? `A_HREF: ${Utils.truncateString(src, 100)}` : null;
                } else if (tagName === 'LINK' && element.rel === 'stylesheet' && element.href) {
                    return `CSS_HREF: ${Utils.truncateString(element.href, 100)}`;
                } else if (['VIDEO', 'AUDIO', 'SOURCE'].includes(tagName) && src) {
                    return `${tagName}_SRC: ${Utils.truncateString(src, 100)}`;
                } else if (tagName === 'STYLE') {
                    return `STYLE_CONTENT: ${Utils.truncateString(element.textContent, 100)}`;
                }
                return null;
            } else if (reasonType && typeof reasonType.detail === 'string') {
                if (reasonType.detail.startsWith('SRC:')) {
                    return `${reasonType.type || 'INTERCEPTED'}_SRC: ${Utils.truncateString(reasonType.detail.substring(4).trim(), 100)}`;
                } else if (reasonType.detail.startsWith('URL:')) {
                    return `${reasonType.type || 'INTERCEPTED'}_URL: ${Utils.truncateString(reasonType.detail.substring(5).trim(), 100)}`;
                } else if (reasonType.type === 'EVAL') {
                    return `EVAL_CODE: ${Utils.truncateString(reasonType.detail, 100)}`;
                } else if (reasonType.type === 'FUNCTION_CONSTRUCTOR') {
                    return `FUNCTION_CODE: ${Utils.truncateString(reasonType.detail, 100)}`;
                } else if (reasonType.type === 'SETTIMEOUT') {
                    return `SETTIMEOUT: ${Utils.truncateString(reasonType.detail, 100)}`;
                } else if (reasonType.type === 'SETINTERVAL') {
                    return `SETINTERVAL: ${Utils.truncateString(reasonType.detail, 100)}`;
                } else if (reasonType.type === 'STYLE_ADS') {
                    return `STYLE_ADS: ${Utils.truncateString(reasonType.detail, 100)}`;
                }
                return `LOG_DETAIL: ${Utils.truncateString(reasonType.detail, 100)}`;
            }
            return null;
        },
        isParentProcessed(element) {
            let parent = element.parentElement;
            while (parent) {
                if (parent.dataset.adblockProcessed === 'true' || ProcessedElementsCache.isProcessed(parent)) {
                    return true;
                }
                parent = parent.parentElement;
            }
            return false;
        },
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
        throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    };

    const LogManager = {
        logs: [],
        maxLogs: 150,
        logEntryData: new LRUCache(150, 300000),
        loggedContentIdentifiers: new LRUCache(150, 300000),

        add(moduleKey, element, reason) {
            if (!currentConfig.modules.interceptThirdPartyResources && !currentConfig.modules.removeInlineScripts && !currentConfig.modules.removeExternalScripts && !currentConfig.modules.smartInterception) {
                return;
            }
            if (!Utils.isElement(element) && element !== null && typeof reason !== 'object') return;

            const currentDomain = Utils.getCurrentHostname();

            if (Whitelisting.isElementWhitelisted(element) || Whitelisting.isReasonWhitelisted(reason)) {
                return;
            }

            let elementIdentifier = '[未知元素]';
            let interceptedContent = '[无法获取内容]';
            let contentIdentifier = null;

            if (Utils.isElement(element)) {
                const tagName = element.tagName;
                const id = element.id ? `#${element.id}` : '';
                const className = element.className ? `.${element.className.split(/\s+/).join('.')}` : '';
                elementIdentifier = `${tagName}${id}${className}`;

                contentIdentifier = Utils.getContentIdentifier(element);

                if (tagName === 'SCRIPT') {
                    interceptedContent = element.src ? `SRC: ${Utils.truncateString(element.src, 100)}` : Utils.getScriptContentPreview(element);
                } else if (tagName === 'IFRAME') {
                    interceptedContent = Utils.getIframeSrcPreview(element);
                } else if (tagName === 'IMG') {
                    const src = element.src || element.dataset.src;
                    interceptedContent = Utils.truncateString(src || '', 100);
                } else if (tagName === 'A') {
                    interceptedContent = Utils.truncateString(element.href || '', 100);
                } else if (tagName === 'LINK' && element.rel === 'stylesheet' && element.href) {
                    interceptedContent = Utils.truncateString(element.href || '', 100);
                } else if (['VIDEO', 'AUDIO', 'SOURCE'].includes(tagName)) {
                    interceptedContent = Utils.truncateString(element.src || '', 100);
                } else if (tagName === 'STYLE') {
                    interceptedContent = Utils.truncateString(element.textContent, 100);
                } else {
                    interceptedContent = Utils.truncateString(element.outerHTML, 100);
                }
            } else if (reason && typeof reason.detail === 'string') {
                interceptedContent = Utils.truncateString(reason.detail, 100);
                elementIdentifier = reason.type ? `[${reason.type}]` : '[未知类型]';
                contentIdentifier = Utils.getContentIdentifier(null, reason);
            }

            if (!contentIdentifier) {
                return;
            }

            if (this.loggedContentIdentifiers.has(contentIdentifier)) {
                return;
            }

            const logId = this.logs.length + 1;
            const logEntry = {
                id: logId,
                module: MODULE_NAMES[moduleKey] || moduleKey,
                element: elementIdentifier,
                content: interceptedContent,
            };
            
            this.logs.push(logEntry);
            this.logEntryData.set(logId, {
                contentIdentifier: contentIdentifier,
                element: element,
                reason: reason,
            });
            this.loggedContentIdentifiers.set(contentIdentifier, true);

            if (this.logs.length > this.maxLogs) {
                const removedLogEntry = this.logs.shift();
                this.logEntryData.delete(removedLogEntry.id);
            }
        },

        showInAlert() {
            const currentDomain = Utils.getCurrentHostname();
            const logEntries = this.logs.map(log =>
                `序号: ${log.id}\n` +
                `模块: ${log.module}\n` +
                `元素: ${log.element}\n` +
                `内容: ${log.content}`
            ).join('\n\n');
            const promptMessage = `广告拦截日志（最近${this.logs.length}条）:\n\n${logEntries || '暂无日志'}\n\n` +
                `添加内嵌外联脚本白名单方式:\n` +
                `1. 输入序号（如 1-3, 1,3,5）\n` +
                `2. 输入关键词（如 aaa, bbb）\n` +
                `3. 输入 0 清空当前域名所有白名单\n\n` +
                `请输入:`;
            let input = prompt(promptMessage, "");
            if (input === null) return;
            input = input.trim();

            if (input === "0") {
                if (confirm(`清空 ${currentDomain} 的所有白名单？`)) {
                    Whitelisting.clearDomainWhitelist(currentDomain);
                    StorageManager.saveConfig();
                    alert("白名单已清空，页面将刷新。");
                    location.reload();
                }
            } else {
                const indicesToWhitelist = new Set();
                const keywordsToWhitelist = new Set();
                const parts = input.replace(/，/g, ',').split(/[\s,]+/);

                parts.forEach(part => {
                    if (part.includes('-')) {
                        const range = part.split('-').map(Number);
                        if (range.length === 2 && !isNaN(range[0]) && !isNaN(range[1])) {
                            const start = Math.min(range[0], range[1]);
                            const end = Math.max(range[0], range[1]);
                            for (let i = start; i <= end; i++) {
                                indicesToWhitelist.add(i);
                            }
                        }
                    } else {
                        const num = parseInt(part, 10);
                        if (!isNaN(num)) {
                            indicesToWhitelist.add(num);
                        } else if (part.length > 0) {
          keywordsToWhitelist.add(part.toLowerCase());
                        }
                    }
                });

                let addedCount = 0;
                let whitelistedIdentifiers = new Set();

                indicesToWhitelist.forEach(index => {
                    const logEntryInfo = this.logEntryData.get(index);
                    if (logEntryInfo && logEntryInfo.contentIdentifier) {
                        const { contentIdentifier } = logEntryInfo;
                        if (!Whitelisting.isContentWhitelisted(Utils.getCurrentHostname(), contentIdentifier)) {
                            whitelistedIdentifiers.add(contentIdentifier);
                        }
                    }
                });

                keywordsToWhitelist.forEach(keyword => {
                    for (const [key, entry] of this.logEntryData.cache) {
                        const logEntryInfo = entry.value;
                        if (logEntryInfo.contentIdentifier && logEntryInfo.contentIdentifier.toLowerCase().includes(keyword)) {
                            if (!Whitelisting.isContentWhitelisted(Utils.getCurrentHostname(), logEntryInfo.contentIdentifier)) {
                                whitelistedIdentifiers.add(logEntryInfo.contentIdentifier);
                            }
                        }
                    }
                });

                whitelistedIdentifiers.forEach(identifier => {
                    Whitelisting.add(Utils.getCurrentHostname(), identifier);
                    addedCount++;
                });

                if (addedCount > 0) {
                    StorageManager.saveConfig();
                    alert(`${addedCount} 项已添加到白名单，页面将刷新。`);
                    location.reload();
                } else if (input.length > 0) {
                    alert("未找到匹配项，或已在白名单中。");
                }
            }
        }
    };

    const Whitelisting = {
        isElementWhitelisted(element) {
            if (!element || !Utils.isElement(element)) return false;
            const currentDomain = Utils.getCurrentHostname();
            const contentIdentifier = Utils.getContentIdentifier(element);
            return !!(contentIdentifier && currentDomain && currentConfig.whitelist[currentDomain] && currentConfig.whitelist[currentDomain].has(contentIdentifier));
        },
        isReasonWhitelisted(reason) {
            if (!reason || typeof reason.detail !== 'string') return false;
            const currentDomain = Utils.getCurrentHostname();
            const contentIdentifier = Utils.getContentIdentifier(null, reason);
            return !!(contentIdentifier && currentDomain && currentConfig.whitelist[currentDomain] && currentConfig.whitelist[currentDomain].has(contentIdentifier));
        },
        isContentWhitelisted(domain, contentIdentifier) {
            if (!domain || !contentIdentifier) return false;
            return !!(currentConfig.whitelist[domain] && currentConfig.whitelist[domain].has(contentIdentifier));
        },
        add(domain, contentIdentifier) {
            if (!domain || !contentIdentifier || contentIdentifier.trim() === '') return;
            if (!currentConfig.whitelist[domain]) {
                currentConfig.whitelist[domain] = new Set();
            }
            currentConfig.whitelist[domain].add(contentIdentifier);
        },
        clearDomainWhitelist(domain) {
            if (currentConfig.whitelist[domain]) {
                currentConfig.whitelist[domain].clear();
            }
        },
        clearAllWhitelists() {
            currentConfig.whitelist = {};
        }
    };

    const StorageManager = {
        getConfigKey(hostname) {
            return `${CONFIG_STORAGE_KEY_PREFIX}${hostname}`;
        },
        loadConfig() {
            const hostname = Utils.getCurrentHostname();
            const key = this.getConfigKey(hostname);
            try {
                const savedConfig = JSON.parse(GM_getValue(key, '{}'));
                if (savedConfig) {
                    if (savedConfig.modules) {
                        Object.assign(currentConfig.modules, savedConfig.modules);
                    }
                    if (savedConfig.cspRules) {
                        currentConfig.cspRules = savedConfig.cspRules.map(rule => ({ ...rule }));
                    }
                    if (savedConfig.whitelist) {
                        currentConfig.whitelist = {};
                        for (const domain in savedConfig.whitelist) {
                            if (Array.isArray(savedConfig.whitelist[domain])) {
                                currentConfig.whitelist[domain] = new Set(savedConfig.whitelist[domain]);
                            }
                        }
                    }
                }
            } catch (e) {
                Object.assign(currentConfig.modules, DEFAULT_MODULE_STATE);
                currentConfig.cspRules = DEFAULT_CSP_RULES_TEMPLATE.map(rule => ({ ...rule }));
                currentConfig.whitelist = {};
            }
            Object.keys(DEFAULT_MODULE_STATE).forEach(key => {
                if (currentConfig.modules[key] === undefined) {
                    currentConfig.modules[key] = DEFAULT_MODULE_STATE[key];
                }
            });
            if (currentConfig.modules.manageCSP === undefined) currentConfig.modules.manageCSP = false;
            if (currentConfig.modules.interceptSubdomains === undefined) currentConfig.modules.interceptSubdomains = false;
            if (currentConfig.modules.smartInterception === undefined) currentConfig.modules.smartInterception = false;
        },
        saveConfig() {
            const hostname = Utils.getCurrentHostname();
            const key = this.getConfigKey(hostname);
            try {
                const whitelistForStorage = {};
                for (const domain in currentConfig.whitelist) {
                    whitelistForStorage[domain] = Array.from(currentConfig.whitelist[domain]);
                }
                GM_setValue(key, JSON.stringify({
                    modules: currentConfig.modules,
                    cspRules: currentConfig.cspRules,
                    whitelist: whitelistForStorage
                }));
            } catch (e) {}
        }
    };

    const ProcessedElementsCache = {
        _processedElements: new WeakSet(),

        isProcessed(element) {
            if (!Utils.isElement(element)) return false;
            return this._processedElements.has(element) || element.dataset.adblockProcessed === 'true';
        },

        markAsProcessed(element) {
            if (!Utils.isElement(element)) return;
            this._processedElements.add(element);
            element.dataset.adblockProcessed = 'true';
        },

        clear() {
            this._processedElements = new WeakSet();
        }
    };

    const ResourceCanceller = {
        cancelResourceLoading(element) {
            if (!Utils.isElement(element) || ProcessedElementsCache.isProcessed(element)) return;
            
            const tagName = element.tagName;
            
            if (['IMG', 'VIDEO', 'AUDIO', 'SOURCE'].includes(tagName) && element.src) {
                element.src = '';
                element.srcset = '';
                element.removeAttribute('srcset');
                if (element.load) element.load();
            } else if (tagName === 'IFRAME' && element.src) {
                element.src = 'about:blank';
            } else if (tagName === 'SCRIPT' && element.src) {
                element.src = '';
            } else if (tagName === 'LINK' && element.rel === 'stylesheet' && element.href) {
                element.href = '';
            } else if (tagName === 'STYLE') {
                element.textContent = '';
            }
            
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }
    };

    const SmartInterceptionModule = {
        originalSetTimeout: null,
        originalSetInterval: null,
        originalClearTimeout: null,
        originalClearInterval: null,
        processedTimers: new WeakSet(),
        stylePatterns: [
            /position\s*:\s*(fixed|sticky|absolute|relative)\s*(!?\s*important)?/i,
            /z-index\s*:\s*([1-9]\d{3,}|[2-9]\d{4,}|[1-9]\d{5,}|auto|inherit|static|relative|absolute|fixed|sticky|relative)\s*(!?\s*important)?/i,
            /(display|visibility|opacity)\s*:\s*(none|hidden|0)\s*(!?\s*important)?/i,
            /(width|height)\s*:\s*(\d{1,4}px|auto|inherit|%|vw|vh|em|rem|vmin|vmax)\s*(!?\s*important)?/i,
            /(top|bottom|left|right)\s*:\s*(0|auto|inherit|px|%|em|rem|vw|vh)\s*(!?\s*important)?/i,
            /background(?:\s*-\s*image)?\s*:\s*url\s*\(\s*['"]?(?!(data:|blob:))[^)'"]+['"]?\s*\)/i,
            /border\s*:\s*\d{1,2}px\s*(solid|dashed|dotted)\s*\S+/i,
            /overflow\s*:\s*(hidden|scroll|auto|visible)\s*(!?\s*important)?/i,
            /(margin|padding)\s*:\s*(\d+(\.\d+)?(px|%|em|rem)?|\s*auto|inherit)\s*(!?\s*important)?/i,
            /text-align\s*:\s*(center|right|justify)\s*(!?\s*important)?/i,
            /(font-size|line-height)\s*:\s*(\d+(\.\d+)?(px|%|em|rem)|normal)\s*(!?\s*important)?/i,
            /([\w\s\.\#\[\]\-\:]*?)\s*{.*(position\s*:\s*(fixed|sticky|absolute|relative)|z-index\s*:\s*([1-9]\d{3,}|[2-9]\d{4,}|[1-9]\d{5,})|display\s*:\s*(block|flex|grid|table|inline-block)|visibility\s*:\s*(visible)|width\s*:\s*(\d{1,4}px)|height\s*:\s*(\d{1,4}px)|top\s*:\s*(0|auto)|bottom\s*:\s*(0|auto)|left\s*:\s*(0|auto)|right\s*:\s*(0|auto)|overflow\s*:\s*(hidden|scroll|auto)).*\s*!\s*important/i
        ],
        init() {
            if (currentConfig.modules.smartInterception) {
                this.enable();
            }
        },
        enable() {
            this.setupTimerInterception();
            this.setupFastStyleChecker();
        },
        disable() {
            this.disableTimerInterception();
        },
        setupTimerInterception() {
            this.originalSetTimeout = window.setTimeout;
            this.originalSetInterval = window.setInterval;
            this.originalClearTimeout = window.clearTimeout;
            this.originalClearInterval = window.clearInterval;
            
            const self = this;
            
            window.setTimeout = function(callback, delay, ...args) {
                if (typeof callback === 'function') {
                    const callbackStr = callback.toString();
                    if (self.isAdTimerCallback(callbackStr)) {
                        const contentIdentifier = Utils.getContentIdentifier(null, { type: 'SETTIMEOUT', detail: `代码: ${Utils.truncateString(callbackStr, 100)}` });
                        if (contentIdentifier && !Whitelisting.isContentWhitelisted(Utils.getCurrentHostname(), contentIdentifier)) {
                            LogManager.add('smartInterception', null, { type: 'SETTIMEOUT', detail: `广告定时器: ${Utils.truncateString(callbackStr, 100)}` });
                            const timerId = self.originalSetTimeout(() => {}, delay);
                            self.processedTimers.add(timerId);
                            return timerId;
                        }
                    }
                }
                return self.originalSetTimeout.call(this, callback, delay, ...args);
            };
            
            window.setInterval = function(callback, delay, ...args) {
                if (typeof callback === 'function') {
                    const callbackStr = callback.toString();
                    if (self.isAdTimerCallback(callbackStr)) {
                        const contentIdentifier = Utils.getContentIdentifier(null, { type: 'SETINTERVAL', detail: `代码: ${Utils.truncateString(callbackStr, 100)}` });
                        if (contentIdentifier && !Whitelisting.isContentWhitelisted(Utils.getCurrentHostname(), contentIdentifier)) {
                            LogManager.add('smartInterception', null, { type: 'SETINTERVAL', detail: `广告定时器: ${Utils.truncateString(callbackStr, 100)}` });
                            const timerId = self.originalSetInterval(() => {}, delay);
                            self.processedTimers.add(timerId);
                            return timerId;
                        }
                    }
                }
                return self.originalSetInterval.call(this, callback, delay, ...args);
            };
            
            window.clearTimeout = function(timerId) {
                if (self.processedTimers.has(timerId)) {
                    self.processedTimers.delete(timerId);
                    return;
                }
                self.originalClearTimeout.call(this, timerId);
            };
            
            window.clearInterval = function(timerId) {
                if (self.processedTimers.has(timerId)) {
                    self.processedTimers.delete(timerId);
                    return;
                }
                self.originalClearInterval.call(this, timerId);
            };
        },
        disableTimerInterception() {
            if (this.originalSetTimeout) window.setTimeout = this.originalSetTimeout;
            if (this.originalSetInterval) window.setInterval = this.originalSetInterval;
            if (this.originalClearTimeout) window.clearTimeout = this.originalClearTimeout;
            if (this.originalClearInterval) window.clearInterval = this.originalClearInterval;
        },
        isAdTimerCallback(callbackStr) {
            const generalAdPatterns = [
                /\b(ad|ads|banner|popup|promo|sponsor|native|interstitial|rewarded|adslot|adbox|feed)\b/i,
                /ad\.(js|css|html)/i,
                /ads\.(js|css|html)/i,
                /banner\.(js|css|html)/i,
                /popup\.(js|css|html)/i,
                /\.(ad|ads|banner|popup|guanggao)[\w-]*\(/i,
                /showAd|displayAd|loadAd|renderAd/i,
                /\b(google_ad|youdao_ad|baidu_ads|toutiao_ads|xigua_ads|kuaishou_ads|weibo_ads|iqiyi_ad|qq_ad|tencent_ad|unionad|duomeng|guanggao)\b/i,
                /\b(doubleclick|googlesyndication|googleadservices|adsystem|adsense|admob|adx|taboola|outbrain|revcontent|contentad)\b/i,
                /['"](ad|ads|banner|popup|guanggao)['"]/i,
                /['"]\s*\+\s*['"](ad|ads|banner)['"]/i,
                /\w\s*=\s*\w\s*\+\s*['"](ad|ads|banner)['"]/i,
                /\w\s*\+\s*=\s*['"](ad|ads|banner)['"]/i,
                /\w\s*\.\s*\w\s*\(\s*['"](ad|ads|banner)['"]/i,
                /\w\s*\[\s*['"](ad|ads|banner)['"]\s*\]/i,
                /(adserver|adservice|advert|advertising|adtech|admanager)\b/i,
                /\/(ad|ads|banner|popup|guanggao)\//i,
                /function\s+\w*[Aa]d\w*\s*\(|function\s+\w*[Gg]uanggao\w*\s*\(/i,
                /var\s+\w*[Aa]d\w*\s*=|const\s+\w*[Aa]d\w*\s*=|let\s+\w*[Aa]d\w*\s*=/i,
                /var\s+\w*[Gg]uanggao\w*\s*=|const\s+\w*[Gg]uanggao\w*\s*=|let\s+\w*[Gg]uanggao\w*\s*=/i,
                /addEventListener.*(load|show|play).*(ad|ads|banner|guanggao)/i,
                /createElement.*(div|iframe|script).*(ad|ads|banner|guanggao)/i,
                /\.src\s*=\s*['"][^'"]*(ad|ads|banner|guanggao)[^'"]*['"]/i,
                /(amazon-adsystem|taboola|outbrain|adcolony|unityads|ironSource|applovin|chartboost|vungle|propellerads|adcash|adsterra|monumetric|ezoic|mediavine|zyncmedia|playwire)/i,
                /creative|campaign|impression|click|tracking|measurement|analytics/i,
                /\b(dynamic|config|init|setup|run|start|launch|module|service|api|ajax|request|get|post)\b.*\b(ad|ads|banner|popup|guanggao)\b/i,
                /common|utils|helpers|core|lib|manager|controller|provider|handler|loader|builder|generator|factory|observer|watcher|router|gateway|middleware|interceptor|plugin|extension|module/i,
                /\b(ads?|banner|popup|promo|native|interstitial|rewarded|adslot|adbox|feed)\b\.?\w*/i,
                /\b(guanggao)\b\.?\w*/i,
                /track|data|stat|event/i
            ];
            
            const isMinified = callbackStr.length > 50 && 
                              (callbackStr.includes(';') && 
                               callbackStr.split(';').length > 10 &&
                               callbackStr.replace(/\s+/g, '').length / callbackStr.length > 0.9);
            
            if (isMinified) {
                const compressedAdPatterns = [
                    /a\s*d\s*s/i,
                    /b\s*a\s*n\s*n\s*e\s*r/i,
                    /p\s*o\s*p\s*u\s*p/i,
                    /g\s*u\s*a\s*n\s*g\s*g\s*a\s*o/i,
                    /[\w\.]+ad[\w\.]*/i,
                    /ad[\w]*\s*=/i,
                    /guanggao[\w]*\s*=/i,
                    /track|data|event/i,
                    /init|setup|run|start|launch|module|service|api|ajax|request|get|post/i,
                    /common|utils|helpers|core|lib|manager|controller|provider|handler|loader|builder|generator|factory|observer|watcher|router|gateway|middleware|interceptor|plugin|extension/i
                ];
                
                if (compressedAdPatterns.some(pattern => pattern.test(callbackStr))) {
                    return true;
                }
            }
            
            return generalAdPatterns.some(pattern => pattern.test(callbackStr));
        },
        setupFastStyleChecker() {
            const observer = new MutationObserver(Utils.throttle((mutations) => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== Node.ELEMENT_NODE) continue;
                        if (ProcessedElementsCache.isProcessed(node) || Utils.isParentProcessed(node)) continue;
                        
                        this.fastCheckElement(node);
                    }
                }
            }, 200));
            
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        },
        fastCheckElement(element) {
            const tagName = element.tagName;
            
            if (tagName === 'STYLE') {
                this.checkStyleElement(element);
            }
        },
        checkStyleElement(styleElement) {
            const styleContent = styleElement.textContent;
            if (this.stylePatterns.some(pattern => pattern.test(styleContent))) {
                const contentIdentifier = Utils.getContentIdentifier(styleElement);
                if (contentIdentifier && !Whitelisting.isContentWhitelisted(Utils.getCurrentHostname(), contentIdentifier)) {
                    LogManager.add('smartInterception', styleElement, { type: 'STYLE_ADS', detail: `广告样式: ${Utils.truncateString(styleContent, 100)}` });
                    ResourceCanceller.cancelResourceLoading(styleElement);
                    ProcessedElementsCache.markAsProcessed(styleElement);
                }
            }
        },
        check(element) {
            if (!currentConfig.modules.smartInterception || ProcessedElementsCache.isProcessed(element) || Utils.isParentProcessed(element)) return false;
            
            const tagName = element.tagName;
            
            if (tagName === 'STYLE') {
                this.checkStyleElement(element);
                return ProcessedElementsCache.isProcessed(element);
            }
            
            return false;
        }
    };

    const RemoveInlineScriptsModule = {
        mutationObserver: null,
        init() {
            if (currentConfig.modules.removeInlineScripts) {
                this.enable();
            }
        },
        enable() {
            this.mutationObserver = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SCRIPT' && !node.src && !ProcessedElementsCache.isProcessed(node) && !Utils.isParentProcessed(node)) {
                            const contentIdentifier = Utils.getContentIdentifier(node);
                            if (contentIdentifier && !Whitelisting.isContentWhitelisted(Utils.getCurrentHostname(), contentIdentifier)) {
                                LogManager.add('removeInlineScripts', node, { type: '内嵌脚本移除', detail: `内容: ${Utils.getScriptContentPreview(node)}` });
                                ProcessedElementsCache.markAsProcessed(node);
                                node.remove();
                            }
                        }
                    }
                }
            });
            this.mutationObserver.observe(document.documentElement, { childList: true, subtree: true });
            document.querySelectorAll('script:not([src])').forEach(script => {
                if (ProcessedElementsCache.isProcessed(script) || Utils.isParentProcessed(script)) return;
                const contentIdentifier = Utils.getContentIdentifier(script);
                if (contentIdentifier && !Whitelisting.isContentWhitelisted(Utils.getCurrentHostname(), contentIdentifier)) {
                    LogManager.add('removeInlineScripts', script, { type: '内嵌脚本移除', detail: `内容: ${Utils.getScriptContentPreview(script)}` });
                    ProcessedElementsCache.markAsProcessed(script);
                    script.remove();
                }
            });
        },
        disable() {
            if (this.mutationObserver) {
                this.mutationObserver.disconnect();
                this.mutationObserver = null;
            }
        },
        check(element) {
            if (!currentConfig.modules.removeInlineScripts || ProcessedElementsCache.isProcessed(element) || Utils.isParentProcessed(element)) return false;
            if (element.tagName === 'SCRIPT' && !element.src) {
                const contentIdentifier = Utils.getContentIdentifier(element);
                if (contentIdentifier && !Whitelisting.isContentWhitelisted(Utils.getCurrentHostname(), contentIdentifier)) {
                    LogManager.add('removeInlineScripts', element, { type: '内嵌脚本移除', detail: `内容: ${Utils.getScriptContentPreview(element)}` });
                    ProcessedElementsCache.markAsProcessed(element);
                    return true;
                }
            }
            return false;
        }
    };

    const RemoveExternalScriptsModule = {
        mutationObserver: null,
        init() {
            if (currentConfig.modules.removeExternalScripts) {
                this.enable();
            }
        },
        enable() {
            this.mutationObserver = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SCRIPT' && node.src && !ProcessedElementsCache.isProcessed(node) && !Utils.isParentProcessed(node)) {
                            const contentIdentifier = Utils.getContentIdentifier(node);
                            if (contentIdentifier && !Whitelisting.isContentWhitelisted(Utils.getCurrentHostname(), contentIdentifier)) {
                                LogManager.add('removeExternalScripts', node, { type: '外联脚本移除', detail: `SRC: ${Utils.truncateString(node.src, 100)}` });
                                ResourceCanceller.cancelResourceLoading(node);
                                ProcessedElementsCache.markAsProcessed(node);
                            }
                        }
                    }
                }
            });
            this.mutationObserver.observe(document.documentElement, { childList: true, subtree: true });
            document.querySelectorAll('script[src]').forEach(script => {
                if (ProcessedElementsCache.isProcessed(script) || Utils.isParentProcessed(script)) return;
                const contentIdentifier = Utils.getContentIdentifier(script);
                if (contentIdentifier && !Whitelisting.isContentWhitelisted(Utils.getCurrentHostname(), contentIdentifier)) {
                    LogManager.add('removeExternalScripts', script, { type: '外联脚本移除', detail: `SRC: ${Utils.truncateString(script.src, 100)}` });
                    ResourceCanceller.cancelResourceLoading(script);
                    ProcessedElementsCache.markAsProcessed(script);
                }
            });
        },
        disable() {
            if (this.mutationObserver) {
                this.mutationObserver.disconnect();
                this.mutationObserver = null;
            }
        },
        check(element) {
            if (!currentConfig.modules.removeExternalScripts || ProcessedElementsCache.isProcessed(element) || Utils.isParentProcessed(element)) return false;
            if (element.tagName === 'SCRIPT' && element.src) {
                const contentIdentifier = Utils.getContentIdentifier(element);
                if (contentIdentifier && !Whitelisting.isContentWhitelisted(Utils.getCurrentHostname(), contentIdentifier)) {
                    LogManager.add('removeExternalScripts', element, { type: '外联脚本移除', detail: `SRC: ${Utils.truncateString(element.src, 100)}` });
                    ResourceCanceller.cancelResourceLoading(element);
                    ProcessedElementsCache.markAsProcessed(element);
                    return true;
                }
            }
            return false;
        }
    };

    const ThirdPartyModule = {
        originalFetch: null,
        originalXhrOpen: null,
        originalXhrSend: null,
        originalCreateElement: null,
        originalAppendChild: null,
        originalDocumentWrite: null,
        originalEval: null,
        originalFunction: null,
        init() {
            if (currentConfig.modules.interceptThirdPartyResources) {
                this.enable();
            }
        },
        enable() {
            const cspBlockEvalRule = currentConfig.cspRules.find(rule => rule.id === 3 && rule.enabled);
            if (!cspBlockEvalRule) {
                this.originalEval = window.eval;
                window.eval = (code) => {
                    const contentIdentifier = Utils.getContentIdentifier(null, { type: 'EVAL', detail: code });
                    if (contentIdentifier && !Whitelisting.isContentWhitelisted(Utils.getCurrentHostname(), contentIdentifier)) {
                        LogManager.add('interceptThirdPartyResources', null, { type: 'EVAL拦截', detail: `代码: ${Utils.truncateString(code, 100)}` });
                        return undefined;
                    }
                    return this.originalEval.call(unsafeWindow, code);
                };
            }

            const cspBlockFunctionRule = currentConfig.cspRules.find(rule => rule.id === 3 && rule.enabled);
            if (!cspBlockFunctionRule) {
                this.originalFunction = window.Function;
                window.Function = function(...args) {
                    const code = args.length > 0 ? args[args.length - 1] : '';
                    const contentIdentifier = Utils.getContentIdentifier(null, { type: 'FUNCTION_CONSTRUCTOR', detail: code });
                    if (contentIdentifier && !Whitelisting.isContentWhitelisted(Utils.getCurrentHostname(), contentIdentifier)) {
                        LogManager.add('interceptThirdPartyResources', null, { type: 'Function构造拦截', detail: `代码: ${Utils.truncateString(code, 100)}` });
                        return () => {};
                    }
                    return this.originalFunction.apply(unsafeWindow, args);
                };
            }

            this.originalFetch = window.fetch;
            window.fetch = (input, init) => {
                if (!currentConfig.modules.interceptThirdPartyResources) {
                    return this.originalFetch.call(this, input, init);
                }
                const url = typeof input === 'string' ? input : input.url;
                const resourceURL = Utils.getAbsoluteURL(url);
                const resourceHostname = Utils.getResourceHostname(resourceURL);
                const currentHost = Utils.getCurrentHostname();
                const contentIdentifier = Utils.getContentIdentifier(null, { type: 'FETCH', detail: `URL: ${Utils.truncateString(resourceURL, 100)}` });

                if (resourceHostname && Utils.isThirdPartyHost(resourceHostname, currentHost)) {
                    if (contentIdentifier && !Whitelisting.isContentWhitelisted(currentHost, contentIdentifier)) {
                        LogManager.add('interceptThirdPartyResources', null, { type: '第三方请求拦截', detail: `URL: ${Utils.truncateString(resourceURL, 100)}` });
                        return Promise.reject(new Error('Third-party resource blocked by AdBlocker.'));
                    }
                }
                return this.originalFetch.call(this, input, init);
            };

            this.originalXhrOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url) {
                if (!currentConfig.modules.interceptThirdPartyResources) {
                    return this.originalXhrOpen.apply(this, arguments);
                }
                const resourceURL = Utils.getAbsoluteURL(url);
                const resourceHostname = Utils.getResourceHostname(resourceURL);
                const currentHost = Utils.getCurrentHostname();
                const contentIdentifier = Utils.getContentIdentifier(null, { type: 'XHR', detail: `URL: ${Utils.truncateString(resourceURL, 100)}` });

                if (resourceHostname && Utils.isThirdPartyHost(resourceHostname, currentHost)) {
                    if (contentIdentifier && !Whitelisting.isContentWhitelisted(currentHost, contentIdentifier)) {
                        LogManager.add('interceptThirdPartyResources', null, { type: '第三方请求拦截', detail: `URL: ${Utils.truncateString(resourceURL, 100)}` });
                        this._adblockBlocked = true;
                        return;
                    }
                }
                return this.originalXhrOpen.apply(this, arguments);
            };
            this.originalXhrSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function() {
                if (this._adblockBlocked) {
                    return;
                }
                this.originalXhrSend.apply(this, arguments);
            };

            this.originalCreateElement = document.createElement;
            document.createElement = (tagName, options) => {
                const element = this.originalCreateElement.call(document, tagName, options);
                if (!currentConfig.modules.interceptThirdPartyResources || ProcessedElementsCache.isProcessed(element)) {
                    return element;
                }
                const resourceURL = Utils.getAbsoluteURL(element.src || element.getAttribute('data-src') || element.href || element.action);
                if (resourceURL) {
                    const resourceHostname = Utils.getResourceHostname(resourceURL);
                    const currentHost = Utils.getCurrentHostname();
                    const contentIdentifier = Utils.getContentIdentifier(element);

                    if (resourceHostname && Utils.isThirdPartyHost(resourceHostname, currentHost)) {
                        if (contentIdentifier && !Whitelisting.isContentWhitelisted(currentHost, contentIdentifier)) {
                            LogManager.add('interceptThirdPartyResources', element, { type: '第三方资源拦截', detail: `SRC: ${Utils.truncateString(resourceURL, 100)}` });
                            ResourceCanceller.cancelResourceLoading(element);
                            ProcessedElementsCache.markAsProcessed(element);
                            return element;
                        }
                    }
                }
                return element;
            };

            this.originalAppendChild = Node.prototype.appendChild;
            Node.prototype.appendChild = function(node) {
                if (!currentConfig.modules.interceptThirdPartyResources || !Utils.isElement(node) || ProcessedElementsCache.isProcessed(node) || Utils.isParentProcessed(node)) {
                    return this.originalAppendChild.call(this, node);
                }
                const resourceURL = Utils.getAbsoluteURL(node.src || node.getAttribute('data-src') || node.href || node.action);
                if (resourceURL) {
                    const resourceHostname = Utils.getResourceHostname(resourceURL);
                    const currentHost = Utils.getCurrentHostname();
                    const contentIdentifier = Utils.getContentIdentifier(node);

                    if (resourceHostname && Utils.isThirdPartyHost(resourceHostname, currentHost)) {
                        if (contentIdentifier && !Whitelisting.isContentWhitelisted(currentHost, contentIdentifier)) {
                            LogManager.add('interceptThirdPartyResources', node, { type: '第三方资源拦截', detail: `SRC: ${Utils.truncateString(resourceURL, 100)}` });
                            ResourceCanceller.cancelResourceLoading(node);
                            ProcessedElementsCache.markAsProcessed(node);
                            return node;
                        }
                    }
                }
                return this.originalAppendChild.call(this, node);
            };

            this.originalDocumentWrite = document.write;
            document.write = function(content) {
                if (!currentConfig.modules.interceptThirdPartyResources) {
                    return this.originalDocumentWrite.call(document, content);
                }
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content;
                const scripts = tempDiv.querySelectorAll('script[src]');
                let modifiedContent = content;

                for (const script of scripts) {
                    const src = script.src;
                    if (src) {
                        const resourceURL = Utils.getAbsoluteURL(src);
                        const resourceHostname = Utils.getResourceHostname(resourceURL);
                        const currentHost = Utils.getCurrentHostname();
                        const contentIdentifier = Utils.getContentIdentifier(script);

                        if (resourceHostname && Utils.isThirdPartyHost(resourceHostname, currentHost)) {
                            if (contentIdentifier && !Whitelisting.isContentWhitelisted(currentHost, contentIdentifier)) {
                                LogManager.add('interceptThirdPartyResources', script, { type: '第三方脚本通过document.write拦截', detail: `SRC: ${Utils.truncateString(resourceURL, 100)}` });
                                ResourceCanceller.cancelResourceLoading(script);
                                ProcessedElementsCache.markAsProcessed(script);
                            }
                        }
                    }
                }
                modifiedContent = tempDiv.innerHTML;
                this.originalDocumentWrite.call(document, modifiedContent);
            }.bind(this);
        },
        disable() {
            if (this.originalFetch) window.fetch = this.originalFetch;
            if (this.originalXhrOpen) XMLHttpRequest.prototype.open = this.originalXhrOpen;
            if (this.originalXhrSend) XMLHttpRequest.prototype.send = this.originalXhrSend;
            if (this.originalCreateElement) document.createElement = this.originalCreateElement;
            if (this.originalAppendChild) Node.prototype.appendChild = this.originalAppendChild;
            if (this.originalDocumentWrite) document.write = this.originalDocumentWrite;
            if (this.originalEval) unsafeWindow.eval = this.originalEval;
            if (this.originalFunction) unsafeWindow.Function = this.originalFunction;
        },
        check(element) {
            if (!currentConfig.modules.interceptThirdPartyResources || !Utils.isElement(element) || ProcessedElementsCache.isProcessed(element) || Utils.isParentProcessed(element)) return false;

            const resourceURL = Utils.getAbsoluteURL(element.src || element.getAttribute('data-src') || element.href || element.action);
            if (resourceURL) {
                const resourceHostname = Utils.getResourceHostname(resourceURL);
                const currentHost = Utils.getCurrentHostname();
                const contentIdentifier = Utils.getContentIdentifier(element);

                if (resourceHostname && Utils.isThirdPartyHost(resourceHostname, currentHost)) {
                    if (contentIdentifier && !Whitelisting.isContentWhitelisted(currentHost, contentIdentifier)) {
                        LogManager.add('interceptThirdPartyResources', element, { type: '第三方资源拦截', detail: `SRC: ${Utils.truncateString(resourceURL, 100)}` });
                        ResourceCanceller.cancelResourceLoading(element);
                        ProcessedElementsCache.markAsProcessed(element);
                        return true;
                    }
                }
            }
            return false;
        }
    };

    const CSPModule = {
        init() {},
        applyCSP() {
            if (!currentConfig.modules.manageCSP) return;
            const existingMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            if (existingMeta) {
                existingMeta.remove();
            }
            
            const enabledRules = currentConfig.cspRules.filter(rule => rule.enabled);
            if (enabledRules.length === 0) {
                return;
            }

            const directives = {};
            enabledRules.forEach(rule => {
                const [directive, ...values] = rule.rule.split(' ');
                if (!directives[directive]) {
                    directives[directive] = new Set();
                }
                values.forEach(value => directives[directive].add(value));
            });

            let policyString = '';
            for (const directive in directives) {
                if (directives.hasOwnProperty(directive)) {
                    const values = Array.from(directives[directive]).join(' ');
                    policyString += `${directive} ${values}; `;
                }
            }
            policyString = policyString.trim();

            if (policyString) {
                const meta = document.createElement('meta');
                meta.httpEquiv = "Content-Security-Policy";
                meta.content = policyString;
                if (document.head) {
                    document.head.appendChild(meta);
                } else {
                    document.documentElement.prepend(meta);
                }
            }
        },
        removeCSP() {
            const existingMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            if (existingMeta) {
                existingMeta.remove();
            }
        },
        updateRule(ruleId, enabled) {
            const rule = currentConfig.cspRules.find(r => r.id === ruleId);
            if (rule) {
                rule.enabled = enabled;
            }
        },
        showManagementPanel() {
            const ruleDisplayItems = currentConfig.cspRules.map(r =>
                `${r.id}. ${r.name} (${r.enabled ? '✅启用' : '❌禁用'})`
            ).join('\n');

            const promptMessage = `CSP策略管理:\n` +
                `当前状态: ${currentConfig.modules.manageCSP ? '已启用' : '已禁用'}\n\n` +
                `可用规则:\n${ruleDisplayItems}\n\n` +
                `操作指令:\n` +
                `enable - 启用CSP策略\n` +
                `disable - 禁用CSP策略\n` +
                `1on - 启用规则1\n` +
                `2off - 禁用规则2\n` +
                `1-2on - 启用规则1和2\n` +
                `1,3off - 禁用规则1和3\n` +
                `allon - 启用所有规则\n` +
                `alloff - 禁用所有规则\n\n` +
                `请输入指令:`;

            let input = prompt(promptMessage, "");
            if (input === null) return;
            input = input.trim().toLowerCase();
            let needsReload = false;

            if (input === 'enable') {
                currentConfig.modules.manageCSP = true;
                this.applyCSP();
                needsReload = true;
            } else if (input === 'disable') {
                currentConfig.modules.manageCSP = false;
                this.removeCSP();
                needsReload = true;
            } else if (input === 'allon') {
                currentConfig.cspRules.forEach(rule => rule.enabled = true);
                if (currentConfig.modules.manageCSP) this.applyCSP();
                needsReload = true;
            } else if (input === 'alloff') {
                currentConfig.cspRules.forEach(rule => rule.enabled = false);
                if (currentConfig.modules.manageCSP) this.removeCSP();
                needsReload = true;
            } else {
                const ruleActionMatch = input.match(/^([1-9,-]+)(on|off)$/);
                if (ruleActionMatch) {
                    const ruleSpecs = ruleActionMatch[1];
                    const action = ruleActionMatch[2];
                    const enable = action === 'on';
                    
                    let ruleIdsToModify = new Set();
                    ruleSpecs.split(',').forEach(spec => {
                        if (spec.includes('-')) {
                            const range = spec.split('-').map(Number);
                            if (range.length === 2 && !isNaN(range[0]) && !isNaN(range[1])) {
                                const start = Math.min(range[0], range[1]);
                                const end = Math.max(range[0], range[1]);
                                for (let i = start; i <= end; i++) {
                                    if (i >= 1 && i <= 9) ruleIdsToModify.add(i);
                                }
                            }
                        } else {
                            const id = parseInt(spec, 10);
                            if (!isNaN(id) && id >= 1 && id <= 9) {
                                ruleIdsToModify.add(id);
                            }
                        }
                    });

                    let modified = false;
                    ruleIdsToModify.forEach(id => {
                        const rule = currentConfig.cspRules.find(r => r.id === id);
                        if (rule && rule.enabled !== enable) {
                            rule.enabled = enable;
                            modified = true;
                        }
                    });
                    
                    if (modified) {
                        if (currentConfig.modules.manageCSP) this.applyCSP();
                        needsReload = true;
                    } else {
                        alert("未找到指定规则或规则状态已符合要求。");
                    }
                } else {
                    alert("无效指令。");
                }
            }

            if (needsReload) {
                StorageManager.saveConfig();
                location.reload();
            }
        }
    };

    const UIController = {
        mutationObserver: null,
        batchProcessingQueue: [],
        batchSize: 15,
        isProcessingBatch: false,
        lastProcessTime: 0,
        init() {
            StorageManager.loadConfig();
            this.applyInitialModuleStates();
            this.registerMenuCommands();
            this.applyModuleSettings();
            this.setupObservers();
        },
        applyInitialModuleStates() {
            Object.keys(DEFAULT_MODULE_STATE).forEach(key => {
                if (currentConfig.modules[key] === undefined) {
                    currentConfig.modules[key] = DEFAULT_MODULE_STATE[key];
                }
            });
            if (currentConfig.modules.manageCSP === undefined) {
                currentConfig.modules.manageCSP = false;
            }
            if (currentConfig.modules.interceptSubdomains === undefined) {
                currentConfig.modules.interceptSubdomains = false;
            }
            if (currentConfig.modules.smartInterception === undefined) {
                currentConfig.modules.smartInterception = false;
            }
        },
        registerMenuCommands() {
            GM_registerMenuCommand(`🔘 广告拦截 [${this.isAnyModuleEnabled() ? '✅' : '❌'}]`, () => this.toggleAllModules());
            const moduleOrder = ['smartInterception', 'removeInlineScripts', 'removeExternalScripts', 'interceptThirdPartyResources', 'interceptSubdomains', 'manageCSP'];
            moduleOrder.forEach(key => {
                GM_registerMenuCommand(
                    `${MODULE_NAMES[key]} [${currentConfig.modules[key] ? '✅' : '❌'}]`,
                    () => this.toggleModule(key)
                );
            });
            GM_registerMenuCommand('📜 查看拦截日志', () => LogManager.showInAlert());
            GM_registerMenuCommand('🚫 清空当前域名白名单', () => {
                const currentDomain = Utils.getCurrentHostname();
                if (confirm(`确定清空当前域名 (${currentDomain}) 的白名单吗？`)) {
                    Whitelisting.clearDomainWhitelist(currentDomain);
                    StorageManager.saveConfig();
                    alert("当前域名的白名单已清空。页面将刷新。");
                    location.reload();
                }
            });
            GM_registerMenuCommand('🛡️ CSP策略管理', () => CSPModule.showManagementPanel());
            GM_registerMenuCommand('🔄 重置所有设置', () => this.resetSettings());
        },
        isAnyModuleEnabled() {
            return Object.keys(MODULE_NAMES).some(key => currentConfig.modules[key]);
        },
        toggleAllModules() {
            const newState = !this.isAnyModuleEnabled();
            Object.keys(MODULE_NAMES).forEach(key => {
                currentConfig.modules[key] = newState;
            });
            this.applyModuleSettings();
            StorageManager.saveConfig();
            location.reload();
        },
        toggleModule(key) {
            if (key === 'interceptSubdomains') {
                if (!currentConfig.modules.interceptThirdPartyResources && !currentConfig.modules.interceptSubdomains) {
                    if (confirm('开启子域名拦截需要同时开启第三方资源拦截，是否同时开启？')) {
                        currentConfig.modules.interceptThirdPartyResources = true;
                        currentConfig.modules.interceptSubdomains = true;
                    } else {
                        return;
                    }
                } else {
                    currentConfig.modules[key] = !currentConfig.modules[key];
                }
            } else if (key === 'interceptThirdPartyResources') {
                const newState = !currentConfig.modules.interceptThirdPartyResources;
                currentConfig.modules.interceptThirdPartyResources = newState;
                if (!newState && currentConfig.modules.interceptSubdomains) {
                    currentConfig.modules.interceptSubdomains = false;
                }
            } else if (key === 'smartInterception') {
                currentConfig.modules[key] = !currentConfig.modules[key];
            } else {
                currentConfig.modules[key] = !currentConfig.modules[key];
            }
            
            this.applyModuleSettings();
            StorageManager.saveConfig();
            location.reload();
        },
        applyModuleSettings() {
            SmartInterceptionModule.init();
            RemoveInlineScriptsModule.init();
            RemoveExternalScriptsModule.init();
            ThirdPartyModule.init();
            CSPModule.init();
        },
        setupObservers() {
            const relevantModulesEnabled = Object.keys(MODULE_NAMES).some(key =>
                currentConfig.modules[key] && (
                    key === 'removeInlineScripts' ||
                    key === 'removeExternalScripts' ||
                    key === 'interceptThirdPartyResources' ||
                    key === 'smartInterception'
                )
            );
            if (!relevantModulesEnabled) return;

            this.mutationObserver = new MutationObserver(Utils.throttle((mutations) => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE && !ProcessedElementsCache.isProcessed(node) && !Utils.isParentProcessed(node)) {
                            this.addToBatchProcessingQueue(node);
                        }
                    }
                }
            }, 100));
            
            this.mutationObserver.observe(document.documentElement, {
                childList: true,
                subtree: true,
            });

            this.processExistingElementsBatch();
        },
        addToBatchProcessingQueue(element) {
            this.batchProcessingQueue.push(element);
            if (!this.isProcessingBatch) {
                this.processBatch();
            }
        },
        processBatch() {
            this.isProcessingBatch = true;
            
            const processChunk = () => {
                const now = Date.now();
                if (now - this.lastProcessTime < 16) {
                    requestAnimationFrame(processChunk);
                    return;
                }
                
                const chunk = this.batchProcessingQueue.splice(0, this.batchSize);
                this.lastProcessTime = now;
                
                chunk.forEach(node => {
                    if (ProcessedElementsCache.isProcessed(node) || Utils.isParentProcessed(node)) return;
                    
                    if (node.tagName === 'SCRIPT') {
                        if (currentConfig.modules.removeInlineScripts && !node.src) {
                            if (RemoveInlineScriptsModule.check(node)) node.remove();
                        } else if (currentConfig.modules.removeExternalScripts && node.src) {
                            if (RemoveExternalScriptsModule.check(node)) ResourceCanceller.cancelResourceLoading(node);
                        } else if (currentConfig.modules.interceptThirdPartyResources) {
                            if (ThirdPartyModule.check(node)) ResourceCanceller.cancelResourceLoading(node);
                        }
                    } else if (currentConfig.modules.interceptThirdPartyResources) {
                        if (ThirdPartyModule.check(node)) ResourceCanceller.cancelResourceLoading(node);
                    }
                    
                    if (currentConfig.modules.smartInterception) {
                        SmartInterceptionModule.check(node);
                    }
                });
                
                if (this.batchProcessingQueue.length > 0) {
                    requestAnimationFrame(processChunk);
                } else {
                    this.isProcessingBatch = false;
                }
            };
            
            requestAnimationFrame(processChunk);
        },
        processExistingElementsBatch() {
            const selector = 'script, iframe, img, a[href], link[rel="stylesheet"], form, video, audio, source, img[data-src], style, link[rel="preload"], link[rel="prefetch"]';
            const elementsToProcess = Array.from(document.querySelectorAll(selector));
            
            const processInChunks = () => {
                const chunk = elementsToProcess.splice(0, this.batchSize * 2);
                
                chunk.forEach(element => {
                    if (!ProcessedElementsCache.isProcessed(element) && !Utils.isParentProcessed(element)) {
                        this.addToBatchProcessingQueue(element);
                    }
                });
                
                if (elementsToProcess.length > 0) {
                    setTimeout(processInChunks, 0);
                }
            };
            
            processInChunks();
        },
        resetSettings() {
            if (confirm("确定要重置所有设置吗？这将清除所有配置和白名单。")) {
                Object.assign(currentConfig.modules, DEFAULT_MODULE_STATE);
                currentConfig.cspRules = DEFAULT_CSP_RULES_TEMPLATE.map(rule => ({ ...rule }));
                Whitelisting.clearAllWhitelists();
                ProcessedElementsCache.clear();
                CSPModule.removeCSP();
                StorageManager.saveConfig();
                location.reload();
            }
        }
    };

    function initializeAdBlocker() {
        UIController.init();
        if (currentConfig.modules.manageCSP) {
            CSPModule.applyCSP();
        }
    }

    if (document.readyState === 'loading') {
        initializeAdBlocker();
    } else {
        setTimeout(initializeAdBlocker, 0);
    }

})();
// ==UserScript==
// @name           Automagic网址自动替换 - 终极安全强化版 v6.8
// @namespace      http://tampermonkey.net/
// @version        6.8
// @description    配置冻结 + 精确正则匹配的安全强化版本（搜索引擎翻页优化）
// @author         Jeff_CF
// @icon           https://46.231.200.187/images/AutomagicAdaptiveIcon_25.png
// @match          *://46.231.200.187/*
// @match          *://automagic4android.com/*
// @match          *://*/*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/544313/Automagic%E7%BD%91%E5%9D%80%E8%87%AA%E5%8A%A8%E6%9B%BF%E6%8D%A2%20-%20%E7%BB%88%E6%9E%81%E5%AE%89%E5%85%A8%E5%BC%BA%E5%8C%96%E7%89%88%20v68.user.js
// @updateURL https://update.greasyfork.org/scripts/544313/Automagic%E7%BD%91%E5%9D%80%E8%87%AA%E5%8A%A8%E6%9B%BF%E6%8D%A2%20-%20%E7%BB%88%E6%9E%81%E5%AE%89%E5%85%A8%E5%BC%BA%E5%8C%96%E7%89%88%20v68.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 深度冻结配置对象
    const CONFIG = deepFreeze({
        OLD_DOMAIN: 'automagic4android.com',
        NEW_IP: '46.231.200.187',
        URL_ATTRIBUTES: Object.freeze([
            'href', 'src', 'action', 
            'data-src', 'data-url', 'data-href',
            'srcset', 'cite', 'formaction'
        ]),
        DEBOUNCE_DELAY: 50,
        MAX_BATCH_SIZE: 100,
        MAX_DEPTH: 2,
        SECURE_PROTOCOLS: Object.freeze(['http:', 'https:', 'ftp:']),
        EXCLUDED_DOMAINS: Object.freeze(['google.com', 'cloudflare.com']),
        PERFORMANCE_LOGGING: true,
        PROCESS_EXTERNAL_CSS: false,
        STATIC_PAGE_PATTERNS: Object.freeze([
            /^https?:\/\/(www\.)?google\.(com|co\.[a-z]{2})\/search\?/i,
            /^https?:\/\/(www\.)?bing\.com\/search\?/i,
            /^https?:\/\/(www\.)?yahoo\.com\/search\?/i,
            /^https?:\/\/(www\.)?duckduckgo\.com\/\?/i,
            /^https?:\/\/(www\.)?baidu\.com\/(s|wd=\w)/i
        ]),
        URL_LIKE_REGEX: /^(https?|ftp):\/\/|^\/\/|^\/[^\/\s]|^\.\.?\/|^mailto:|^tel:|^#/i,
        FRAMEWORK_CONTAINERS: Object.freeze([
            '#root', '#app', '.react-root', 
            '.vue-app', '[data-reactroot]'
        ]),
        EXTRA_SCAN_DELAY: 300,
        SEARCH_ENGINE_CONFIG: Object.freeze({
            'www.baidu.com': {
                container: '#content_left',
                itemSelector: '.result',
                paginationParam: 'pn',
                nextButton: '#page > a.n'
            },
            'www.google.com': {
                container: '#rso',
                itemSelector: '.g',
                paginationParam: 'start'
            },
            'www.bing.com': {
                container: '#b_results',
                itemSelector: '.b_algo',
                paginationParam: 'first'
            }
        })
    });
    
    // 性能监控器
    const performanceMetrics = {
        processedElements: 0,
        processedMutations: 0,
        processedCSS: 0,
        lastReportTime: Date.now(),
        mutationObserverEnabled: true,
        extraScans: 0,
        mixedContentWarnings: 0,
        navigationEvents: 0,
        searchResultsProcessed: 0
    };
    
    // 错误跟踪器
    const errorTracker = {
        elementErrors: 0,
        cssErrors: 0,
        mutationErrors: 0,
        skippedDataAttributes: 0,
        externalCSSErrors: 0,
        regexErrors: 0,
        navigationErrors: 0
    };
    
    // 预编译排除域名正则
    const EXCLUDED_REGEX = (function() {
        const domains = CONFIG.EXCLUDED_DOMAINS.map(domain => {
            return `(^|\\.)${domain.replace(/\./g, '\\.')}$`;
        }).join('|');
        
        return new RegExp(domains);
    })();
    
    // 深度冻结函数
    function deepFreeze(object) {
        if (!object || typeof object !== 'object') return object;
        
        Object.freeze(object);
        Object.getOwnPropertyNames(object).forEach(prop => {
            if (object[prop] !== null && 
                (typeof object[prop] === 'object' || typeof object[prop] === 'function') && 
                !Object.isFrozen(object[prop])) {
                deepFreeze(object[prop]);
            }
        });
        return object;
    }
    
    // 预编译正则表达式
    const DOMAIN_REGEX = (function() {
        const escapedDomain = CONFIG.OLD_DOMAIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(
            `\\b${escapedDomain}\\b`,
            'gi'
        );
    })();
    
    // 获取基准URL（处理<base>标签）
    function getBaseUrl() {
        const baseElement = document.querySelector('base[href]');
        return baseElement ? baseElement.href : window.location.href;
    }
    
    // 安全URI解码
    function safeDecodeURI(uri) {
        try {
            return decodeURIComponent(uri);
        } catch {
            return uri;
        }
    }
    
    // 检查是否在白名单中
    function isExcludedDomain(url) {
        try {
            const { hostname } = new URL(url);
            return EXCLUDED_REGEX.test(hostname);
        } catch {
            return false;
        }
    }
    
    // 检查是否是静态页面（如搜索引擎）
    function isStaticPage() {
        return CONFIG.STATIC_PAGE_PATTERNS.some(pattern => 
            pattern.test(window.location.href)
        );
    }
    
    // 检查值是否像URL
    function isUrlLike(value) {
        return CONFIG.URL_LIKE_REGEX.test(value) || 
               value.includes(CONFIG.OLD_DOMAIN);
    }
    
    // 精确URL替换
    function replaceUrl(url, base = getBaseUrl()) {
        // 跳过白名单域名
        if (isExcludedDomain(url)) return url;
        
        // 处理相对路径 - 使用页面基准URL
        if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
            try {
                const absoluteUrl = new URL(url, base).href;
                return absoluteUrl.replace(DOMAIN_REGEX, CONFIG.NEW_IP);
            } catch {
                return url;
            }
        }
        
        // 处理协议相对URL (//example.com)
        if (url.startsWith('//')) {
            const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
            const baseUrl = `${protocol}${url}`;
            return baseUrl.replace(DOMAIN_REGEX, CONFIG.NEW_IP);
        }
        
        // 处理安全协议
        if (!CONFIG.SECURE_PROTOCOLS.some(p => url.startsWith(p))) {
            return url;
        }
        
        // 检查混合内容
        if (window.location.protocol === 'https:' && url.startsWith('http:')) {
            performanceMetrics.mixedContentWarnings++;
            console.warn(`Automagic: 混合内容警告 - HTTP资源在HTTPS页面: ${url}`);
        }
        
        const decodedUrl = safeDecodeURI(url);
        try {
            return decodedUrl.replace(DOMAIN_REGEX, (match) => {
                // 保持原始协议
                const protocol = match.startsWith('https') ? 'https://' : 
                               match.startsWith('http') ? 'http://' : 
                               match.startsWith('ftp') ? 'ftp://' : '//';
                return protocol + CONFIG.NEW_IP;
            });
        } catch (e) {
            errorTracker.regexErrors++;
            console.warn('Automagic: URL替换错误', e);
            return url;
        }
    }
    
    // 安全处理srcset属性
    function processSrcset(srcset) {
        return srcset.split(',')
            .map(part => {
                const [url, ...descriptors] = part.trim().split(/\s+/);
                const newUrl = replaceUrl(url);
                return [newUrl, ...descriptors].join(' ');
            })
            .join(', ');
    }
    
    // 处理单个元素
    function processElement(element) {
        try {
            // 跳过跨域iframe
            if (element.tagName === 'IFRAME' && 
                element.contentDocument === null &&
                element.src && element.src !== 'about:blank') {
                console.warn('Automagic: 跳过跨域iframe', element.src);
                return;
            }
            
            for (const attr of CONFIG.URL_ATTRIBUTES) {
                const value = element.getAttribute(attr);
                if (!value) continue;
                
                // 跳过非URL类data属性
                if (attr.startsWith('data-') && !isUrlLike(value)) {
                    errorTracker.skippedDataAttributes++;
                    continue;
                }
                
                let newValue;
                if (attr === 'srcset') {
                    newValue = processSrcset(value);
                } else {
                    newValue = replaceUrl(value);
                }
                
                if (newValue !== value) {
                    element.setAttribute(attr, newValue);
                    performanceMetrics.processedElements++;
                }
            }
        } catch (e) {
            errorTracker.elementErrors++;
            console.warn('Automagic元素处理错误:', e.message, '\n元素:', element.outerHTML.slice(0, 200));
        }
    }
    
    // 批量处理元素
    function processElements(elements) {
        const startTime = performance.now();
        const batch = Math.min(elements.length, CONFIG.MAX_BATCH_SIZE);
        
        for (let i = 0; i < batch; i++) {
            processElement(elements[i]);
        }
        
        // 记录性能
        if (CONFIG.PERFORMANCE_LOGGING) {
            const duration = performance.now() - startTime;
            console.debug(`Automagic: 处理 ${batch} 个元素, 耗时 ${duration.toFixed(2)}ms`);
        }
        
        // 分批处理剩余元素
        if (elements.length > CONFIG.MAX_BATCH_SIZE) {
            setTimeout(() => {
                processElements(Array.from(elements).slice(CONFIG.MAX_BATCH_SIZE));
            }, CONFIG.DEBOUNCE_DELAY);
        }
    }
    
    // 扫描框架容器
    function scanFrameworkContainers() {
        const containers = CONFIG.FRAMEWORK_CONTAINERS
            .map(selector => document.querySelector(selector))
            .filter(el => el !== null);
        
        if (containers.length === 0) return;
        
        containers.forEach(container => {
            const selector = CONFIG.URL_ATTRIBUTES
                .map(attr => `[${attr}]`)
                .join(',');
            
            if (!selector) return;
            
            try {
                const elements = container.querySelectorAll(selector);
                if (elements.length > 0) {
                    console.debug(`Automagic: 在框架容器中发现${elements.length}个元素`);
                    processElements(elements);
                }
            } catch (e) {
                console.warn('Automagic框架容器扫描错误:', e);
            }
        });
    }
    
    // 获取当前搜索引擎配置
    function getSearchEngineConfig() {
        const hostname = window.location.hostname;
        for (const domain in CONFIG.SEARCH_ENGINE_CONFIG) {
            if (hostname.includes(domain)) {
                return CONFIG.SEARCH_ENGINE_CONFIG[domain];
            }
        }
        return null;
    }
    
    // 处理搜索引擎结果
    function processSearchResults() {
        const config = getSearchEngineConfig();
        if (!config) return;
        
        const container = document.querySelector(config.container);
        if (!container) return;
        
        const items = container.querySelectorAll(config.itemSelector);
        
        items.forEach(item => {
            // 跳过已处理的项
            if (item.getAttribute('data-automagic-processed') === 'true') return;
            
            CONFIG.URL_ATTRIBUTES.forEach(attr => {
                const elements = item.querySelectorAll(`[${attr}]`);
                elements.forEach(el => {
                    processElement(el);
                });
            });
            
            item.setAttribute('data-automagic-processed', 'true');
            performanceMetrics.searchResultsProcessed++;
        });
    }
    
    // 设置翻页监听器
    function setupPaginationListeners() {
        // 代理History API
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            handlePageNavigation();
        };
        
        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            handlePageNavigation();
        };
        
        // 监听popstate事件
        window.addEventListener('popstate', handlePageNavigation);
        
        // 监听百度"下一页"按钮
        const config = getSearchEngineConfig();
        if (config && config.nextButton) {
            const nextButton = document.querySelector(config.nextButton);
            if (nextButton) {
                nextButton.addEventListener('click', () => {
                    sessionStorage.setItem('forceRescan', 'true');
                    handlePageNavigation();
                });
            }
        }
    }
    
    // 处理页面导航
    let navigationTimer = null;
    function handlePageNavigation() {
        clearTimeout(navigationTimer);
        navigationTimer = setTimeout(() => {
            try {
                performanceMetrics.navigationEvents++;
                if (isStaticPage()) {
                    console.log('Automagic: 检测到翻页操作，重新处理搜索结果');
                    processSearchResults();
                }
            } catch (e) {
                errorTracker.navigationErrors++;
                console.error('Automagic: 翻页处理错误', e);
            }
        }, 500); // 500ms延迟确保DOM更新完成
    }
    
    // 初始页面处理
    function processInitialPage() {
        const selector = CONFIG.URL_ATTRIBUTES
            .map(attr => `[${attr}]`)
            .join(',');
        
        if (!selector) return;
        
        try {
            const elements = document.querySelectorAll(selector);
            processElements(elements);
            
            // 处理CSS样式
            processAllCSS();
            
            // 扫描框架容器
            scanFrameworkContainers();
            
            // 处理搜索引擎结果
            if (isStaticPage()) {
                processSearchResults();
                setupPaginationListeners();
            }
            
            // 额外扫描（针对异步渲染）
            if (!isStaticPage()) {
                setTimeout(() => {
                    console.debug('Automagic: 执行额外扫描');
                    processInitialPage();
                    performanceMetrics.extraScans++;
                }, CONFIG.EXTRA_SCAN_DELAY);
            }
        } catch (e) {
            console.warn('Automagic初始处理错误:', e.message);
        }
    }
    
    // 处理所有CSS样式
    function processAllCSS() {
        // 处理<style>元素
        document.querySelectorAll('style').forEach(styleEl => {
            processStyleElement(styleEl);
        });
        
        // 处理外部CSS（可选）
        if (CONFIG.PROCESS_EXTERNAL_CSS) {
            document.querySelectorAll('link[rel="stylesheet"]').forEach(linkEl => {
                processExternalCSS(linkEl);
            });
        }
    }
    
    // 处理<style>元素
    function processStyleElement(styleEl) {
        try {
            const newCss = styleEl.textContent.replace(
                /url\(['"]?(.*?)['"]?\)/gi, 
                (match, url) => {
                    const newUrl = replaceUrl(url);
                    if (newUrl !== url) {
                        performanceMetrics.processedCSS++;
                        return `url("${newUrl}")`;
                    }
                    return match;
                }
            );
            
            if (newCss !== styleEl.textContent) {
                styleEl.textContent = newCss;
            }
        } catch (e) {
            errorTracker.cssErrors++;
            console.warn('Automagic CSS处理错误:', e.message);
        }
    }
    
    // 处理外部CSS
    function processExternalCSS(linkEl) {
        try {
            const href = linkEl.getAttribute('href');
            if (!href) return;
            
            // 检查同源策略
            if (href.startsWith('http') && !isSameOrigin(href)) {
                console.warn(`Automagic: 跳过跨域CSS ${href}`);
                errorTracker.externalCSSErrors++;
                return;
            }
            
            const newHref = replaceUrl(href);
            if (newHref !== href) {
                linkEl.setAttribute('href', newHref);
            }
        } catch (e) {
            errorTracker.cssErrors++;
            console.warn('Automagic外部CSS处理错误:', e.message);
        }
    }
    
    // 检查是否同源
    function isSameOrigin(url) {
        try {
            const target = new URL(url);
            const current = new URL(window.location.href);
            return target.origin === current.origin;
        } catch {
            return false;
        }
    }
    
    // 处理DOM变化
    function handleMutations(mutations) {
        try {
            performanceMetrics.processedMutations++;
            
            const elementsToProcess = new Set();
            const selector = CONFIG.URL_ATTRIBUTES.map(attr => `[${attr}]`).join(',');
            
            for (const mutation of mutations) {
                // 处理新增节点
                if (mutation.addedNodes) {
                    for (const node of mutation.addedNodes) {
                        try {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                // 检查节点本身
                                if (selector && node.matches(selector)) {
                                    elementsToProcess.add(node);
                                }
                                
                                // 批量查询子节点
                                if (node.querySelectorAll) {
                                    const children = node.querySelectorAll(selector);
                                    children.forEach(child => elementsToProcess.add(child));
                                }
                                
                                // 处理动态样式
                                if (node.tagName === 'STYLE') {
                                    setTimeout(() => processStyleElement(node), 0);
                                }
                                
                                // 处理外部CSS
                                if (node.tagName === 'LINK' && 
                                    node.getAttribute('rel') === 'stylesheet' &&
                                    CONFIG.PROCESS_EXTERNAL_CSS) {
                                    setTimeout(() => processExternalCSS(node), 0);
                                }
                            }
                        } catch (e) {
                            errorTracker.mutationErrors++;
                            console.debug('Automagic: 跳过无法处理的节点', e);
                        }
                    }
                }
                
                // 处理属性变化
                if (mutation.type === 'attributes' && 
                    CONFIG.URL_ATTRIBUTES.includes(mutation.attributeName)) {
                    elementsToProcess.add(mutation.target);
                }
            }
            
            // 处理收集到的元素
            if (elementsToProcess.size > 0) {
                processElements(Array.from(elementsToProcess));
            }
            
            // 定期报告性能
            if (CONFIG.PERFORMANCE_LOGGING && 
                Date.now() - performanceMetrics.lastReportTime > 10000) {
                console.log(`Automagic性能报告: 
    处理元素: ${performanceMetrics.processedElements}
    处理变动: ${performanceMetrics.processedMutations}
    CSS处理: ${performanceMetrics.processedCSS}
    额外扫描: ${performanceMetrics.extraScans}
    翻页事件: ${performanceMetrics.navigationEvents}
    搜索结果处理: ${performanceMetrics.searchResultsProcessed}
    混合内容警告: ${performanceMetrics.mixedContentWarnings}
    错误统计: 
        元素: ${errorTracker.elementErrors}
        CSS: ${errorTracker.cssErrors}
        变动: ${errorTracker.mutationErrors}
        导航: ${errorTracker.navigationErrors}
        外部CSS: ${errorTracker.externalCSSErrors}
        正则: ${errorTracker.regexErrors}
    跳过的非URL属性: ${errorTracker.skippedDataAttributes}`);
                performanceMetrics.lastReportTime = Date.now();
            }
        } catch (e) {
            console.error('Automagic变动处理错误:', e);
        }
    }
    
    // 防抖的MutationObserver
    let mutationTimer = null;
    function mutationCallback(mutations) {
        if (mutationTimer) clearTimeout(mutationTimer);
        
        mutationTimer = setTimeout(() => {
            handleMutations(mutations);
            mutationTimer = null;
        }, CONFIG.DEBOUNCE_DELAY);
    }
    
    // 初始化MutationObserver
    function initObserver() {
        // 静态页面禁用MutationObserver
        if (isStaticPage()) {
            console.log('Automagic: 静态页面检测，禁用MutationObserver');
            performanceMetrics.mutationObserverEnabled = false;
            return null;
        }
        
        const observer = new MutationObserver(mutationCallback);
        observer.observe(document, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: CONFIG.URL_ATTRIBUTES
        });
        return observer;
    }
    
    // 注册用户菜单
    function registerUserCommands() {
        try {
            // 性能报告
            GM_registerMenuCommand("🚀 显示性能报告", () => {
                alert(`Automagic性能报告:
处理元素: ${performanceMetrics.processedElements}
处理变动: ${performanceMetrics.processedMutations}
CSS处理: ${performanceMetrics.processedCSS}
额外扫描: ${performanceMetrics.extraScans}
翻页事件: ${performanceMetrics.navigationEvents}
搜索结果处理: ${performanceMetrics.searchResultsProcessed}
混合内容警告: ${performanceMetrics.mixedContentWarnings}
错误统计: 
  元素: ${errorTracker.elementErrors}
  CSS: ${errorTracker.cssErrors}
  变动: ${errorTracker.mutationErrors}
  导航: ${errorTracker.navigationErrors}
  外部CSS: ${errorTracker.externalCSSErrors}
  正则: ${errorTracker.regexErrors}
跳过的非URL属性: ${errorTracker.skippedDataAttributes}
MutationObserver状态: ${performanceMetrics.mutationObserverEnabled ? '启用' : '禁用'}`);
            });
            
            // 临时禁用脚本
            GM_registerMenuCommand("⏸️ 临时禁用脚本", () => {
                GM_setValue('scriptEnabled', false);
                alert("脚本已禁用，刷新页面后生效");
            });
            
            // 启用脚本
            GM_registerMenuCommand("▶️ 启用脚本", () => {
                GM_setValue('scriptEnabled', true);
                alert("脚本已启用，刷新页面后生效");
            });
            
            // 切换性能日志
            GM_registerMenuCommand("📊 切换性能日志", () => {
                const current = GM_getValue('performanceLogging', CONFIG.PERFORMANCE_LOGGING);
                GM_setValue('performanceLogging', !current);
                alert(`性能日志已${!current ? '启用' : '禁用'}`);
            });
            
            // 调整批量大小
            GM_registerMenuCommand("⚙️ 调整批量大小", () => {
                const newSize = prompt("请输入新的批量处理大小 (10-500):", CONFIG.MAX_BATCH_SIZE);
                if (newSize && !isNaN(newSize) && newSize >= 10 && newSize <= 500) {
                    GM_setValue('batchSize', parseInt(newSize));
                    alert(`批量大小已设置为${newSize}`);
                }
            });
            
            // 切换外部CSS处理
            GM_registerMenuCommand("🎨 切换外部CSS处理", () => {
                const current = GM_getValue('processExternalCSS', CONFIG.PROCESS_EXTERNAL_CSS);
                const newValue = !current;
                GM_setValue('processExternalCSS', newValue);
                
                if (newValue) {
                    alert(`外部CSS处理已启用（注意跨域风险）`);
                    CONFIG.PROCESS_EXTERNAL_CSS = true;
                    processAllCSS();
                } else {
                    alert(`外部CSS处理已禁用`);
                    CONFIG.PROCESS_EXTERNAL_CSS = false;
                }
            });
        } catch (e) {
            console.debug('Automagic: 此环境不支持用户命令');
        }
    }
    
    // 增强SPA支持
    function initSPASupport() {
        // 监听history变化
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = function() {
            originalPushState.apply(this, arguments);
            setTimeout(processInitialPage, 100);
        };
        
        history.replaceState = function() {
            originalReplaceState.apply(this, arguments);
            setTimeout(processInitialPage, 100);
        };
        
        // 监听路由变化
        window.addEventListener('popstate', () => {
            setTimeout(processInitialPage, 100);
        });
        
        window.addEventListener('hashchange', () => {
            setTimeout(processInitialPage, 100);
        });
    }
    
    // 主初始化函数
    function init() {
        // 检查是否被禁用
        if (GM_getValue('scriptEnabled', true) === false) return;
        
        // 应用用户配置
        if (GM_getValue('performanceLogging') !== undefined) {
            CONFIG.PERFORMANCE_LOGGING = GM_getValue('performanceLogging');
        }
        
        if (GM_getValue('batchSize')) {
            CONFIG.MAX_BATCH_SIZE = GM_getValue('batchSize');
        }
        
        if (GM_getValue('processExternalCSS') !== undefined) {
            CONFIG.PROCESS_EXTERNAL_CSS = GM_getValue('processExternalCSS');
        }
        
        // 初始页面处理
        processInitialPage();
        
        // 初始化观察器
        initObserver();
        
        // 初始化SPA支持
        initSPASupport();
        
        // 注册用户命令
        setTimeout(registerUserCommands, 2000);
        
        // 添加性能监控面板
        addPerformancePanel();
    }
    
    // 添加性能监控面板
    function addPerformancePanel() {
        if (!CONFIG.PERFORMANCE_LOGGING) return;
        
        GM_addStyle(`
            #automagic-panel {
                position: fixed;
                bottom: 10px;
                right: 10px;
                background: rgba(0,0,0,0.85);
                color: white;
                padding: 15px;
                border-radius: 10px;
                font-family: Arial, sans-serif;
                font-size: 13px;
                z-index: 9999;
                max-width: 320px;
                backdrop-filter: blur(5px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                border: 1px solid #4CAF50;
                cursor: move;
                user-select: none;
            }
            #automagic-panel h3 {
                margin: 0 0 10px 0;
                font-size: 15px;
                color: #4CAF50;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            #automagic-panel .stats {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin-bottom: 10px;
            }
            #automagic-panel .stat {
                display: flex;
                justify-content: space-between;
                padding: 4px 0;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            #automagic-panel .stat-value {
                font-weight: bold;
                color: #4CAF50;
            }
            #automagic-panel .stat.warning .stat-value {
                color: #ffd166;
            }
            #automagic-panel .stat.error .stat-value {
                color: #ff6b6b;
            }
            #automagic-panel .controls {
                display: flex;
                gap: 8px;
                margin-top: 10px;
            }
            #automagic-panel button {
                flex: 1;
                background: #4CAF50;
                border: none;
                color: white;
                padding: 6px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            }
            #automagic-panel button:hover {
                background: #3d8b40;
                transform: translateY(-2px);
            }
            #automagic-panel button.warning {
                background: #ff9800;
            }
            #automagic-panel button.warning:hover {
                background: #e68a00;
            }
            #automagic-panel button.danger {
                background: #f44336;
            }
            #automagic-panel button.danger:hover {
                background: #d32f2f;
            }
        `);
        
        const panel = document.createElement('div');
        panel.id = 'automagic-panel';
        panel.innerHTML = `
            <h3><i class="fas fa-chart-line"></i> Automagic 性能监控</h3>
            <div class="stats">
                <div class="stat"><span>处理元素:</span> <span id="automagic-elements" class="stat-value">0</span></div>
                <div class="stat"><span>搜索结果:</span> <span id="automagic-search-results" class="stat-value">0</span></div>
                <div class="stat"><span>翻页事件:</span> <span id="automagic-navigations" class="stat-value">0</span></div>
                <div class="stat warning"><span>混合内容:</span> <span id="automagic-mixed" class="stat-value">0</span></div>
                <div class="stat"><span>额外扫描:</span> <span id="automagic-extrascans" class="stat-value">0</span></div>
                <div class="stat error"><span>元素错误:</span> <span id="automagic-element-errors" class="stat-value">0</span></div>
                <div class="stat error"><span>导航错误:</span> <span id="automagic-navigation-errors" class="stat-value">0</span></div>
            </div>
            <div class="controls">
                <button id="automagic-refresh"><i class="fas fa-sync"></i> 刷新</button>
                <button id="automagic-hide"><i class="fas fa-eye-slash"></i> 隐藏</button>
                <button class="danger" id="automagic-debug">调试模式</button>
            </div>
        `;
        document.body.appendChild(panel);
        
        // 使面板可拖动
        let isDragging = false;
        let offsetX, offsetY;
        
        panel.querySelector('h3').addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            panel.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                panel.style.left = (e.clientX - offsetX) + 'px';
                panel.style.top = (e.clientY - offsetY) + 'px';
            }
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
            panel.style.cursor = 'move';
        });
        
        // 刷新按钮
        panel.querySelector('#automagic-refresh').addEventListener('click', () => {
            processInitialPage();
            console.log('Automagic: 手动刷新页面处理');
        });
        
        // 隐藏按钮
        panel.querySelector('#automagic-hide').addEventListener('click', function() {
            panel.style.display = 'none';
            // 添加重新显示按钮
            const showBtn = document.createElement('button');
            showBtn.textContent = '显示面板';
            showBtn.style.position = 'fixed';
            showBtn.style.bottom = '10px';
            showBtn.style.right = '10px';
            showBtn.style.zIndex = '9999';
            showBtn.style.background = '#4CAF50';
            showBtn.style.color = 'white';
            showBtn.style.padding = '6px 12px';
            showBtn.style.borderRadius = '4px';
            showBtn.style.border = 'none';
            showBtn.style.cursor = 'pointer';
            showBtn.addEventListener('click', function() {
                panel.style.display = 'block';
                showBtn.remove();
            });
            document.body.appendChild(showBtn);
        });
        
        // 调试模式按钮
        let debugMode = false;
        panel.querySelector('#automagic-debug').addEventListener('click', function() {
            debugMode = !debugMode;
            if (debugMode) {
                this.innerHTML = '<i class="fas fa-bug"></i> 调试中...';
                this.style.background = '#f44336';
                console.debug('Automagic: 调试模式已启用');
            } else {
                this.innerHTML = '<i class="fas fa-bug"></i> 调试模式';
                this.style.background = '';
                console.debug('Automagic: 调试模式已禁用');
            }
        });
        
        // 定期更新面板
        setInterval(() => {
            document.getElementById('automagic-elements').textContent = performanceMetrics.processedElements;
            document.getElementById('automagic-search-results').textContent = performanceMetrics.searchResultsProcessed;
            document.getElementById('automagic-navigations').textContent = performanceMetrics.navigationEvents;
            document.getElementById('automagic-mixed').textContent = performanceMetrics.mixedContentWarnings;
            document.getElementById('automagic-extrascans').textContent = performanceMetrics.extraScans;
            document.getElementById('automagic-element-errors').textContent = errorTracker.elementErrors;
            document.getElementById('automagic-navigation-errors').textContent = errorTracker.navigationErrors;
        }, 1000);
    }
    
    // 尽早执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 0);
    }
})();
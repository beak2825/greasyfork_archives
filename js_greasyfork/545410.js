// ==UserScript==
// @name         知网安徽图书馆镜像
// @namespace    http://github.com/no-teasy/cnki-ahlib-mirror
// @version      1.4
// @description  将所有跳转到cnki.net的链接重定向到AH图书馆镜像站
// @author       no-teasy 3992412947@qq.com
// @match        *://*.ahlib.com/*
// @match        *://*.cnki.net/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545410/%E7%9F%A5%E7%BD%91%E5%AE%89%E5%BE%BD%E5%9B%BE%E4%B9%A6%E9%A6%86%E9%95%9C%E5%83%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/545410/%E7%9F%A5%E7%BD%91%E5%AE%89%E5%BE%BD%E5%9B%BE%E4%B9%A6%E9%A6%86%E9%95%9C%E5%83%8F.meta.js
// ==/UserScript==

(function() {
    const DEBUG = true;
    const SCRIPT_NAME = '[cnki-ahlib-mirror]';

    function log(...args) {
        if (DEBUG) {
            console.log(SCRIPT_NAME, ...args);
        }
    }

    function warn(...args) {
        console.warn(SCRIPT_NAME, ...args);
    }

    function error(...args) {
        console.error(SCRIPT_NAME, ...args);
    }

    log('脚本开始运行，当前域名:', window.location.hostname);
    log('当前页面URL:', window.location.href);
    log('document readyState:', document.readyState);

    // 检测是否为知网域名
    const isCnkiDomain = window.location.hostname.endsWith('cnki.net');
    if(isCnkiDomain){
        log("知网官方域名，即将跳转")
        const url = processCNKILink(window.location.href)
        window.location = url.toString();
    }
    // 检查是否为AH图书馆域名
    const isAHLibDomain = window.location.hostname.endsWith('ahlib.com');
    if (!isAHLibDomain) {
        log('非AH图书馆域名，脚本不生效');
        return;
    }

    log('检测到AH图书馆域名，脚本生效');

    // 处理URL中的cnki.net链接
    function processCNKILink(url) {
        try {
            // 如果URL不包含cnki.net，直接返回
            if (!url || typeof url !== 'string') {
                return url;
            }

            log('开始处理URL:', url);

            // 检查是否包含cnki.net
            if (!url.includes('cnki.net')) {
                log('URL不包含cnki.net:', url);
                return url;
            }

            log('检测到cnki链接:', url);

            // 处理相对链接和完整链接
            let fullUrl = url;
            if (!url.startsWith('http')) {
                try {
                    fullUrl = new URL(url, window.location.href).href;
                    log('转换相对链接为完整链接:', url, '->', fullUrl);
                } catch (e) {
                    log('相对链接转换失败:', url, e.message);
                    return url;
                }
            }

            const urlObj = new URL(fullUrl);
            log('解析URL对象:', {
                hostname: urlObj.hostname,
                pathname: urlObj.pathname,
                search: urlObj.search
            });

            if (urlObj.hostname.includes('cnki.net')) {
                // 将域名中的点替换为横线
                const modifiedHostname = urlObj.hostname.replace(/\./g, '-');
                // 构造新的URL
                const newUrl = `https://${modifiedHostname}-s.ycfw.ahlib.com${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
                log('链接转换成功:', url, '->', newUrl);
                return newUrl;
            } else {
                log('URL不包含cnki.net域名:', url);
            }
        } catch (e) {
            error('URL解析错误:', e, '原始URL:', url);
        }
        return url;
    }

    // 处理单个元素的属性
    function processElementAttribute(element, attribute) {
        const originalUrl = element.getAttribute(attribute);
        log('检查元素属性:', element.tagName, attribute, '值:', originalUrl);

        if (originalUrl && originalUrl.includes('cnki.net')) {
            const newUrl = processCNKILink(originalUrl);
            if (newUrl !== originalUrl) {
                element.setAttribute(attribute, newUrl);
                log('元素属性更新:', element.tagName, attribute, originalUrl, '->', newUrl);
                return true; // 表示已处理
            }
        }
        return false; // 表示未处理
    }

    // 处理所有可能包含链接的元素
    function processAllLinks(description = '常规检查') {
        log('开始批量处理链接 -', description);
        const startTime = performance.now();

        // 处理各种标签的链接属性
        const selectors = [
            { tag: 'a', attr: 'href' },
            { tag: 'form', attr: 'action' },
            { tag: 'img', attr: 'src' },
            { tag: 'script', attr: 'src' },
            { tag: 'iframe', attr: 'src' },
            { tag: 'link', attr: 'href' },
            { tag: 'object', attr: 'data' },
            { tag: 'embed', attr: 'src' },
            { tag: 'source', attr: 'src' },
            { tag: 'video', attr: 'src' },
            { tag: 'audio', attr: 'src' }
        ];

        let processedCount = 0;
        let totalElements = 0;

        selectors.forEach(selector => {
            try {
                log('查询选择器:', `${selector.tag}[${selector.attr}*="cnki.net"]`);
                const elements = document.querySelectorAll(`${selector.tag}[${selector.attr}*="cnki.net"]`);
                totalElements += elements.length;
                log('找到元素数量:', elements.length, '标签:', selector.tag, '属性:', selector.attr);

                elements.forEach((element, index) => {
                    log('处理第', index + 1, '个元素:', element.tagName, element.getAttribute(selector.attr));
                    if (processElementAttribute(element, selector.attr)) {
                        processedCount++;
                    }
                });

                if (elements.length > 0) {
                    log(`处理${selector.tag}标签${selector.attr}属性:`, elements.length, '个元素');
                }
            } catch (e) {
                error(`处理${selector.tag}标签时出错:`, e);
            }
        });

        const endTime = performance.now();
        log('批量处理完成 -', description, '耗时:', (endTime - startTime).toFixed(2), 'ms，总元素数:', totalElements, '处理元素数:', processedCount);
        return processedCount;
    }

    // 实时处理新创建的元素
    function processNewElement(element) {
        if (!element || element.nodeType !== 1) return false;

        // 处理元素自身的属性
        const linkAttributes = ['href', 'src', 'action', 'data'];
        let processed = false;

        linkAttributes.forEach(attr => {
            if (element.hasAttribute && element.hasAttribute(attr)) {
                const attrValue = element.getAttribute(attr);
                if (attrValue && attrValue.includes('cnki.net')) {
                    log('新元素包含cnki链接:', element.tagName, attr, attrValue);
                    if (processElementAttribute(element, attr)) {
                        processed = true;
                    }
                }
            }
        });

        // 递归处理子元素
        if (element.children) {
            Array.from(element.children).forEach(child => {
                if (processNewElement(child)) {
                    processed = true;
                }
            });
        }

        return processed;
    }

    // 拦截window.open
    const originalOpen = window.open;
    window.open = function(url, ...args) {
        log('拦截window.open调用:', url);
        const processedUrl = processCNKILink(url);
        log('window.open重定向:', url, '->', processedUrl);
        return originalOpen.call(this, processedUrl, ...args);
    };

    // 拦截location.assign和location.replace
    if (window.location) {
        const originalAssign = window.location.assign;
        const originalReplace = window.location.replace;

        window.location.assign = function(url) {
            log('拦截location.assign调用:', url);
            const processedUrl = processCNKILink(url);
            log('location.assign重定向:', url, '->', processedUrl);
            return originalAssign.call(this, processedUrl);
        };

        window.location.replace = function(url) {
            log('拦截location.replace调用:', url);
            const processedUrl = processCNKILink(url);
            log('location.replace重定向:', url, '->', processedUrl);
            return originalReplace.call(this, processedUrl);
        };
    }

    // 使用MutationObserver监听DOM变化 - 更智能的监听
    const observer = new MutationObserver(function(mutations) {
        let processedElements = 0;
        let attributeChanges = 0;
        let nodeAdditions = 0;

        mutations.forEach(function(mutation) {
            // 处理属性变化
            if (mutation.type === 'attributes') {
                attributeChanges++;
                const attrName = mutation.attributeName;
                if (attrName && ['href', 'src', 'action', 'data'].includes(attrName)) {
                    const oldValue = mutation.oldValue;
                    const newValue = mutation.target.getAttribute(attrName);
                    log('属性变化检测:', mutation.target.tagName, attrName, '旧值:', oldValue, '新值:', newValue);

                    if (newValue && newValue.includes('cnki.net') && (!oldValue || !oldValue.includes('ycfw.ahlib.com'))) {
                        log('检测到需要处理的属性变化:', mutation.target.tagName, attrName, oldValue, '->', newValue);
                        processElementAttribute(mutation.target, attrName);
                        processedElements++;
                    }
                }
            }

            // 处理新增节点
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // 元素节点
                    nodeAdditions++;
                    log('检测到新增节点:', node.tagName || node.nodeName);
                    if (processNewElement(node)) {
                        processedElements++;
                    }
                }
            });
        });

        if (processedElements > 0 || attributeChanges > 0 || nodeAdditions > 0) {
            log('MutationObserver处理完成 - 属性变化:', attributeChanges, '节点新增:', nodeAdditions, '处理元素数:', processedElements);
        }
    });

    // 启动观察器
    function startObserving() {
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeOldValue: true,
            attributeFilter: ['href', 'src', 'action', 'data']
        });
        log('开始监听DOM变化');
    }



    // 页面不同阶段的处理
    log('注册事件监听器...');

    // 立即开始观察（即使DOM未加载完成）
    startObserving();

    if (document.readyState === 'loading') {
        // DOM还在加载中
        log('DOM正在加载中，等待DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', function() {
            log('DOMContentLoaded事件触发');
            setTimeout(() => processAllLinks('DOMContentLoaded'), 100);
        });
    } else if (document.readyState === 'interactive') {
        // DOM已加载但资源还在加载
        log('DOM已交互状态');
        setTimeout(() => processAllLinks('Interactive状态'), 100);
    } else {
        // DOM已完成加载
        log('DOM已完成加载');
        setTimeout(() => processAllLinks('Complete状态'), 100);
    }

    // 页面加载完成后再次处理（确保所有内容都处理到）
    window.addEventListener('load', function() {
        log('页面load事件触发，再次处理所有链接');
        setTimeout(() => processAllLinks('Load事件'), 500);
        // 执行测试
        setTimeout(testSpecificLink, 1000);
    });

    // 定期检查（作为保险机制）
    const intervalId = setInterval(function() {
        const count = processAllLinks('定时检查');
        if (count > 0) {
            log('定时检查处理了', count, '个链接');
        }
    }, 5000);

    log('启动定时检查，间隔5秒');

    // 页面卸载时清理
    window.addEventListener('beforeunload', function() {
        log('页面即将卸载，清理资源');
        observer.disconnect();
        clearInterval(intervalId);
    });

    // 立即执行一次检查
    setTimeout(() => processAllLinks('立即检查'), 1000);
    setTimeout(testSpecificLink, 2000);

    log('脚本初始化完成');

})();

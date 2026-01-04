// ==UserScript==
// @name         微博网址一键跳转插件
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  在云智服工作台中自动转换微博链接
// @match        https://yzf.woa.com/
// @match        https://yzf.woa.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543110/%E5%BE%AE%E5%8D%9A%E7%BD%91%E5%9D%80%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BD%AC%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/543110/%E5%BE%AE%E5%8D%9A%E7%BD%91%E5%9D%80%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BD%AC%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置核心参数
    const URL_REGEX = /(https?:\/\/weibo\.com\/[\w\/\-\.]+)/g;
    const EXCLUDE_TAGS = ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'A', 'IFRAME'];

    // 主转换函数
    function convertLinks() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: node =>
                    node.textContent.includes('weibo.com') &&
                    !isExcluded(node) ?
                    NodeFilter.FILTER_ACCEPT :
                    NodeFilter.FILTER_SKIP
            }
        );

        while (walker.nextNode()) {
            const node = walker.currentNode;
            const matches = [...node.textContent.matchAll(URL_REGEX)];
            if (!matches.length) continue;

            const fragment = document.createDocumentFragment();
            let lastIndex = 0;

            matches.forEach(match => {
                // 添加匹配前的文本
                if (match.index > lastIndex) {
                    fragment.appendChild(document.createTextNode(
                        node.textContent.substring(lastIndex, match.index))
                    );
                }

                // 添加链接
                const link = document.createElement('a');
                link.href = match[0];
                link.textContent = match[0];
                link.target = '_blank';
                link.rel = 'noopener';
                fragment.appendChild(link);

                lastIndex = match.index + match[0].length;
            });

            // 添加剩余文本
            if (lastIndex < node.textContent.length) {
                fragment.appendChild(document.createTextNode(
                    node.textContent.substring(lastIndex))
                );
            }

            node.parentNode.replaceChild(fragment, node);
        }
    }

    // 排除检测函数
    function isExcluded(node) {
        let parent = node.parentNode;
        while (parent) {
            if (EXCLUDE_TAGS.includes(parent.tagName)) return true;
            parent = parent.parentNode;
        }
        return false;
    }

    // 初始化函数
    function init() {
        try {
            convertLinks();
        } catch(e) {
            console.error('[微博链接转换器] 初始化错误:', e);
        }

        // 监听动态内容变化
        new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    try {
                        convertLinks();
                    } catch(e) {
                        console.error('[微博链接转换器] 动态更新错误:', e);
                    }
                }
            });
        }).observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();// ==UserScript==
// @name         场景_帖子/私信/主页一键跳转
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  这是一个「只认微博官网链接，秒变安全跳转按钮，全程静默守护公司内网」的轻量工具，既省去手动复制粘贴的麻烦，又杜绝了安全隐患。
// @match        https://yzf.woa.com/*
// @grant        none
// @connect      weibo.com
// @connect      api.weibo.com
// ==/UserScript==

(function() {
    'use strict';

    // 安全配置 - 使用冻结对象防止篡改
    const config = Object.freeze({
        // 允许的安全域名
        ALLOWED_DOMAINS: Object.freeze(["weibo.com", "api.weibo.com"]),

        // 所有微博链接类型（使用更严格的正则）
        URL_REGEXES: Object.freeze([
            // 微博用户主页链接: https://weibo.com/u/7322270169
            /https?:\/\/weibo\.com\/u\/\d+(\?[\w&=]+)?/gi,
            // 微博帖子链接: https://weibo.com/5888596291/PBPfmzETQ
            /https?:\/\/weibo\.com\/\d+\/[\w\-]+/gi,
            // 微博聊天链接: https://api.weibo.com/chat/#/chat?to_uid=7680934505&source_from=
            /https?:\/\/api\.weibo\.com\/chat\/#\/chat\?to_uid=\d+[\w&=]*/gi
        ]),
        ARTICLE_SELECTOR: 'article.css-189ywbf.e3b8ccc61',
        CONTAINER_SELECTOR: 'div.css-9obf30.e3b8ccc62',
        SECURE_ATTRIBUTES: Object.freeze({
            target: '_blank',
            rel: 'noopener noreferrer',
            style: Object.freeze({
                color: '#1E90FF',
                textDecoration: 'underline'
            })
        })
    });

    // 安全DOM操作 - 防止XSS和危险属性
    function createSecureElement(tag, attributes) {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            // 过滤危险属性
            if (['src', 'onload', 'onerror'].includes(key)) return;

            if (key === 'style' && typeof value === 'object') {
                // 过滤危险CSS属性
                const safeStyles = Object.entries(value).filter(
                    ([k]) => !/expression|import|javascript|behaviour/i.test(k)
                );
                Object.assign(element.style, Object.fromEntries(safeStyles));
            } else {
                element.setAttribute(key, value);
            }
        });
        return element;
    }

    // 匹配所有完整的URL
    function findCompleteUrlMatches(text) {
        const matches = [];

        config.URL_REGEXES.forEach(regex => {
            regex.lastIndex = 0; // 重置正则状态
            let match;
            while ((match = regex.exec(text)) !== null) {
                // 验证域名白名单
                try {
                    const urlObj = new URL(match[0]);
                    if (config.ALLOWED_DOMAINS.includes(urlObj.hostname)) {
                        matches.push({
                            url: match[0],
                            index: match.index
                        });
                    }
                } catch(e) {
                    // 忽略无效URL
                }
            }
        });

        // 按出现位置排序
        return matches.sort((a, b) => a.index - b.index);
    }

    // 安全文本处理
    function convertTextToLinks(text) {
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;

        // 获取所有完整URL匹配
        const matches = findCompleteUrlMatches(text);
        if (!matches.length) {
            // 无匹配时返回原始文本
            fragment.appendChild(document.createTextNode(text));
            return fragment;
        }

        matches.forEach(match => {
            // 添加前段文本
            if (match.index > lastIndex) {
                fragment.appendChild(
                    document.createTextNode(text.substring(lastIndex, match.index))
                );
            }

            // 创建安全链接
            const link = createSecureElement('a', {
                ...config.SECURE_ATTRIBUTES,
                href: match.url
            });
            link.textContent = match.url;
            fragment.appendChild(link);

            lastIndex = match.index + match.url.length;
        });

        // 添加剩余文本
        if (lastIndex < text.length) {
            fragment.appendChild(
                document.createTextNode(text.substring(lastIndex))
            );
        }

        return fragment;
    }

    // 安全容器处理
    function processContainer(container) {
        if (container.dataset.linkProcessed) return;
        container.dataset.linkProcessed = 'true';

        const article = container.querySelector(config.ARTICLE_SELECTOR);
        if (!article) return;

        // 创建安全包装容器
        const wrapper = document.createElement('div');
        wrapper.style.whiteSpace = 'pre-wrap';

        // 处理所有文本节点
        const walker = document.createTreeWalker(
            article,
            NodeFilter.SHOW_TEXT,
            null
        );

        const textNodes = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        textNodes.forEach(node => {
            const newContent = convertTextToLinks(node.textContent);
            wrapper.appendChild(newContent);
        });

        // 安全替换
        article.replaceWith(wrapper);
    }

    // 安全内容转换
    function convertContainerLinks() {
        document.querySelectorAll(config.CONTAINER_SELECTOR)
            .forEach(processContainer);
    }

    // 安全观察器
    function initSecureObserver() {
        const observer = new MutationObserver(mutations => {
            const newContainers = [];

            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches(config.CONTAINER_SELECTOR)) {
                            newContainers.push(node);
                        } else {
                            const containers = node.querySelectorAll(config.CONTAINER_SELECTOR);
                            containers.forEach(c => newContainers.push(c));
                        }
                    }
                });
            });

            newContainers.forEach(processContainer);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 安全初始化
    function secureInit() {
        try {
            // 初始化处理
            convertContainerLinks();
            initSecureObserver();
        } catch(e) {
            // 安全错误处理
            console.error('[安全链接转换] 内部错误');
        }
    }

    // 安全启动
    if (document.readyState === 'complete') {
        secureInit();
    } else {
        window.addEventListener('load', secureInit, {once: true});
    }
})();// ==UserScript==
// @name         场景_帖子/私信/主页一键跳转
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  这是一个「只认微博官网链接，秒变安全跳转按钮，全程静默守护公司内网」的轻量工具，既省去手动复制粘贴的麻烦，又杜绝了安全隐患。
// @match        https://yzf.woa.com/*
// @grant        none
// @connect      weibo.com
// @connect      api.weibo.com
// ==/UserScript==

(function() {
    'use strict';

    // 安全配置 - 使用冻结对象防止篡改
    const config = Object.freeze({
        // 允许的安全域名
        ALLOWED_DOMAINS: Object.freeze(["weibo.com", "api.weibo.com"]),

        // 所有微博链接类型（使用更严格的正则）
        URL_REGEXES: Object.freeze([
            // 微博用户主页链接: https://weibo.com/u/7322270169
            /https?:\/\/weibo\.com\/u\/\d+(\?[\w&=]+)?/gi,
            // 微博帖子链接: https://weibo.com/5888596291/PBPfmzETQ
            /https?:\/\/weibo\.com\/\d+\/[\w\-]+/gi,
            // 微博聊天链接: https://api.weibo.com/chat/#/chat?to_uid=7680934505&source_from=
            /https?:\/\/api\.weibo\.com\/chat\/#\/chat\?to_uid=\d+[\w&=]*/gi
        ]),
        ARTICLE_SELECTOR: 'article.css-189ywbf.e3b8ccc61',
        CONTAINER_SELECTOR: 'div.css-9obf30.e3b8ccc62',
        SECURE_ATTRIBUTES: Object.freeze({
            target: '_blank',
            rel: 'noopener noreferrer',
            style: Object.freeze({
                color: '#1E90FF',
                textDecoration: 'underline'
            })
        })
    });

    // 安全DOM操作 - 防止XSS和危险属性
    function createSecureElement(tag, attributes) {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            // 过滤危险属性
            if (['src', 'onload', 'onerror'].includes(key)) return;

            if (key === 'style' && typeof value === 'object') {
                // 过滤危险CSS属性
                const safeStyles = Object.entries(value).filter(
                    ([k]) => !/expression|import|javascript|behaviour/i.test(k)
                );
                Object.assign(element.style, Object.fromEntries(safeStyles));
            } else {
                element.setAttribute(key, value);
            }
        });
        return element;
    }

    // 匹配所有完整的URL
    function findCompleteUrlMatches(text) {
        const matches = [];

        config.URL_REGEXES.forEach(regex => {
            regex.lastIndex = 0; // 重置正则状态
            let match;
            while ((match = regex.exec(text)) !== null) {
                // 验证域名白名单
                try {
                    const urlObj = new URL(match[0]);
                    if (config.ALLOWED_DOMAINS.includes(urlObj.hostname)) {
                        matches.push({
                            url: match[0],
                            index: match.index
                        });
                    }
                } catch(e) {
                    // 忽略无效URL
                }
            }
        });

        // 按出现位置排序
        return matches.sort((a, b) => a.index - b.index);
    }

    // 安全文本处理
    function convertTextToLinks(text) {
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;

        // 获取所有完整URL匹配
        const matches = findCompleteUrlMatches(text);
        if (!matches.length) {
            // 无匹配时返回原始文本
            fragment.appendChild(document.createTextNode(text));
            return fragment;
        }

        matches.forEach(match => {
            // 添加前段文本
            if (match.index > lastIndex) {
                fragment.appendChild(
                    document.createTextNode(text.substring(lastIndex, match.index))
                );
            }

            // 创建安全链接
            const link = createSecureElement('a', {
                ...config.SECURE_ATTRIBUTES,
                href: match.url
            });
            link.textContent = match.url;
            fragment.appendChild(link);

            lastIndex = match.index + match.url.length;
        });

        // 添加剩余文本
        if (lastIndex < text.length) {
            fragment.appendChild(
                document.createTextNode(text.substring(lastIndex))
            );
        }

        return fragment;
    }

    // 安全容器处理
    function processContainer(container) {
        if (container.dataset.linkProcessed) return;
        container.dataset.linkProcessed = 'true';

        const article = container.querySelector(config.ARTICLE_SELECTOR);
        if (!article) return;

        // 创建安全包装容器
        const wrapper = document.createElement('div');
        wrapper.style.whiteSpace = 'pre-wrap';

        // 处理所有文本节点
        const walker = document.createTreeWalker(
            article,
            NodeFilter.SHOW_TEXT,
            null
        );

        const textNodes = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        textNodes.forEach(node => {
            const newContent = convertTextToLinks(node.textContent);
            wrapper.appendChild(newContent);
        });

        // 安全替换
        article.replaceWith(wrapper);
    }

    // 安全内容转换
    function convertContainerLinks() {
        document.querySelectorAll(config.CONTAINER_SELECTOR)
            .forEach(processContainer);
    }

    // 安全观察器
    function initSecureObserver() {
        const observer = new MutationObserver(mutations => {
            const newContainers = [];

            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches(config.CONTAINER_SELECTOR)) {
                            newContainers.push(node);
                        } else {
                            const containers = node.querySelectorAll(config.CONTAINER_SELECTOR);
                            containers.forEach(c => newContainers.push(c));
                        }
                    }
                });
            });

            newContainers.forEach(processContainer);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 安全初始化
    function secureInit() {
        try {
            // 初始化处理
            convertContainerLinks();
            initSecureObserver();
        } catch(e) {
            // 安全错误处理
            console.error('[安全链接转换] 内部错误');
        }
    }

    // 安全启动
    if (document.readyState === 'complete') {
        secureInit();
    } else {
        window.addEventListener('load', secureInit, {once: true});
    }
})();
// ==UserScript==
// @name         网页划词高亮工具
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  提供网页划词高亮功能，支持WebDAV云端备份
// @author       sunny43
// @license      MIT
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_listValues
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/529467/%E7%BD%91%E9%A1%B5%E5%88%92%E8%AF%8D%E9%AB%98%E4%BA%AE%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/529467/%E7%BD%91%E9%A1%B5%E5%88%92%E8%AF%8D%E9%AB%98%E4%BA%AE%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STYLE_PREFIX = 'sunny43-';

    // 全局变量
    let highlights = [];
    const rawPageUrl = window.location.href;
    const rawDomain = window.location.hostname;
    const activationContext = resolveActivationContext(rawDomain, rawPageUrl);
    const activationDomain = activationContext.domain;
    const activationPageUrl = activationContext.url;
    let currentPageUrl = rawPageUrl;
    let settings = GM_getValue('highlight_settings', {
        colors: ['#ff909c', '#b89fff', '#74b4ff', '#70d382', '#ffcb7e'],
        activeColor: '#ff909c',
        minTextLength: 1,
        sidebarDescription: '高亮工具',
        sidebarWidth: 320,
        showFloatingButton: true
    });
    let savedRange = null; // 保存选区范围
    let ignoreNextClick = false; // 忽略下一次点击的标志
    let menuDisplayTimer = null; // 菜单显示定时器
    let menuOperationInProgress = false; // 添加菜单操作锁定
    function resolveActivationContext(defaultDomain, defaultUrl) {
        let domain = defaultDomain;
        let url = defaultUrl;

        let isTopWindow = true;
        try {
            isTopWindow = window.top === window.self;
        } catch (e) {
            isTopWindow = false;
        }

        if (!isTopWindow) {
            let resolvedFromTop = false;
            try {
                const topLocation = window.top.location;
                if (topLocation && topLocation.hostname) {
                    domain = topLocation.hostname;
                    resolvedFromTop = true;
                }
                if (topLocation && topLocation.href) {
                    url = topLocation.href;
                }
            } catch (e) {
                // 跨域访问顶层窗口会抛出异常，忽略
            }

            if (!resolvedFromTop && document.referrer) {
                try {
                    const refUrl = new URL(document.referrer);
                    if (refUrl.hostname) {
                        domain = refUrl.hostname;
                    }
                    if (refUrl.href) {
                        url = refUrl.href;
                    }
                } catch (e) {
                    // 忽略解析错误，继续使用默认值
                }
            }
        }

        return { domain, url };
    }

    // 启用列表
    let enabledList = GM_getValue('enabled_list', {
        domains: [],
        urls: []
    });
    // 判断当前页面是否启用：当启用列表为空时，默认启用所有页面
    const isEnabledForCurrentPage = (list) => {
        const emptyList = (!list || (Array.isArray(list.domains) && list.domains.length === 0) && (Array.isArray(list.urls) && list.urls.length === 0));
        if (emptyList) return true; // 默认开启
        return (list.domains || []).includes(activationDomain) || (list.urls || []).includes(activationPageUrl);
    };
    // 检查当前页面是否启用高亮功能
    let isHighlightEnabled = isEnabledForCurrentPage(enabledList);
    let updateSidebarHighlights = null;

    GM_addStyle(`
        /* 高亮菜单样式 */
        .${STYLE_PREFIX}highlight-menu,
        .${STYLE_PREFIX}highlight-menu * {
            all: initial;
            box-sizing: border-box;
        }
        .${STYLE_PREFIX}highlight-menu {
            position: absolute;
            background: #333336;
            border: none;
            border-radius: 24px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
            padding: 8px;
            height: 38px !important;
            z-index: 9999;
            display: flex;
            flex-direction: row;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 13px;
            line-height: 1;
            color: #fff;
            opacity: 0;
            transition: opacity 0.2s ease-in;
            pointer-events: none;
            box-sizing: border-box;
        }
        .${STYLE_PREFIX}highlight-menu.${STYLE_PREFIX}show {
            opacity: 1;
            pointer-events: auto; /* 显示时响应事件 */
        }

        /* 菜单箭头样式 */
        .${STYLE_PREFIX}highlight-menu::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: var(--arrow-left, 50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid #333336;
            margin-left: -6px;
            box-sizing: border-box;
        }
        .${STYLE_PREFIX}highlight-menu.${STYLE_PREFIX}arrow-top::after {
            top: -5px;
            bottom: auto;
            border-top: none;
            border-bottom: 6px solid #333336;
        }

        /* 颜色选择区域 */
        .${STYLE_PREFIX}highlight-menu-colors {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin: 0 2px;
            height: 22px !important;
            flex-wrap: nowrap;
            flex: 0 0 auto;
            gap: 6px;
        }

        /* 颜色选择按钮 */
        .${STYLE_PREFIX}highlight-menu-color {
            width: 22px !important;
            height: 22px !important;
            min-width: 22px !important;
            min-height: 22px !important;
            max-width: 22px !important;
            max-height: 22px !important;
            border-radius: 50% !important;
            margin: 0 !important;
            padding: 0 !important;
            cursor: pointer;
            position: relative;
            display: flex !important;
            align-items: center;
            justify-content: center;
            transition: transform 0.15s ease;
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12) !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
            border: none !important;
            outline: none !important;
        }
        .${STYLE_PREFIX}highlight-menu-color:hover {
            transform: scale(1.12);
        }
        .${STYLE_PREFIX}highlight-menu-color.${STYLE_PREFIX}active::after {
            content: "";
            width: 12px;
            height: 12px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23333336' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
        }

        /* 菜单按钮样式已移除（当前未使用） */

        /* 闪烁效果用于高亮跳转 */
        @keyframes ${STYLE_PREFIX}highlightFlash {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }
        .${STYLE_PREFIX}highlight-flash {
            animation: ${STYLE_PREFIX}highlightFlash 0.5s ease 4;
            box-shadow: 0 0 0 3px rgba(255, 255, 0, 0.7) !important;
            position: relative;
            z-index: 10;
        }
    `);

    // 保存启用列表
    function saveEnabledList() {
        GM_setValue('enabled_list', enabledList);
        // 刷新当前状态（空列表表示默认启用）
        isHighlightEnabled = isEnabledForCurrentPage(enabledList);

        // 更新浮动按钮显示状态
        const floatingButton = document.getElementById(`${STYLE_PREFIX}floating-button`);
        if (floatingButton) {
            floatingButton.style.display = (settings.showFloatingButton && isHighlightEnabled) ? 'flex' : 'none';
        }
    }

    // 启用域名
    function enableDomain(domain) {
        if (!enabledList.domains.includes(domain)) {
            enabledList.domains.push(domain);
            saveEnabledList();
        }
    }

    // 启用域名
    function disableDomain(domain) {
        enabledList.domains = enabledList.domains.filter(d => d !== domain);
        saveEnabledList();
    }

    // 启用URL
    function enableUrl(url) {
        if (!enabledList.urls.includes(url)) {
            enabledList.urls.push(url);
            saveEnabledList();
        }
    }

    // 启用URL
    function disableUrl(url) {
        enabledList.urls = enabledList.urls.filter(u => u !== url);
        saveEnabledList();
    }

    function generateUrlCandidates(url) {
        const candidates = [];
        if (!url) {
            return candidates;
        }
        candidates.push(url);

        try {
            const parsed = new URL(url);
            const noHash = new URL(parsed.href);
            if (noHash.hash) {
                noHash.hash = '';
                const candidate = noHash.href.endsWith('#') ? noHash.href.slice(0, -1) : noHash.href;
                if (!candidates.includes(candidate)) {
                    candidates.push(candidate);
                }
            }

            const noSearch = new URL(noHash.href);
            if (noSearch.search) {
                noSearch.search = '';
                const candidate = noSearch.href;
                if (!candidates.includes(candidate)) {
                    candidates.push(candidate);
                }
            }

            const trimmed = noSearch.href.endsWith('/') ? noSearch.href.slice(0, -1) : noSearch.href;
            if (trimmed && !candidates.includes(trimmed)) {
                candidates.push(trimmed);
            }
        } catch (e) {
            // 忽略无法解析的 URL
        }

        return candidates;
    }

    // 加载当前页面的高亮
    function loadHighlights() {
        const allHighlights = GM_getValue('highlights', {});
        const candidates = [
            currentPageUrl,
            ...generateUrlCandidates(currentPageUrl),
            activationPageUrl,
            ...generateUrlCandidates(activationPageUrl)
        ];
        const visited = new Set();

        for (const candidate of candidates) {
            if (!candidate || visited.has(candidate)) {
                continue;
            }
            visited.add(candidate);
            const stored = allHighlights[candidate];
            if (Array.isArray(stored)) {
                currentPageUrl = candidate;
                highlights = stored;
                return highlights;
            }
        }

        highlights = [];
        return highlights;
    }

    // 加载整个域名下的所有高亮数据
    function loadDomainHighlights() {
        const allHighlights = GM_getValue('highlights', {});
        const domainHighlights = {};
        const currentDomain = activationDomain;

        // 遍历所有URL，找出属于当前域名的高亮
        for (const [url, highlightArray] of Object.entries(allHighlights)) {
            try {
                const urlObj = new URL(url);
                if (urlObj.hostname === currentDomain && Array.isArray(highlightArray) && highlightArray.length > 0) {
                    domainHighlights[url] = highlightArray;
                }
            } catch (e) {
                // 忽略无效的URL
            }
        }

        return domainHighlights;
    }

    // 保存高亮到存储
    function saveHighlights() {
        const allHighlights = GM_getValue('highlights', {});
        allHighlights[currentPageUrl] = highlights;
        GM_setValue('highlights', allHighlights);
    }

    // 保存设置
    function saveSettings() {
        GM_setValue('highlight_settings', settings);
    }

    // 移除高亮菜单
    function removeHighlightMenu() {
        const existingMenus = document.querySelectorAll(`.${STYLE_PREFIX}highlight-menu`);
        if (existingMenus.length) {
            existingMenus.forEach(menu => {
                menu.classList.remove(`${STYLE_PREFIX}show`);
                setTimeout(() => {
                    if (menu && menu.parentNode) {
                        menu.parentNode.removeChild(menu);
                    }
                }, 200);
            });
        }
        clearTimeout(menuDisplayTimer);
        ignoreNextClick = false;
        menuOperationInProgress = false;
    }

    // 统一菜单外部点击关闭逻辑
    function attachOutsideClose(menu) {
        document.addEventListener('click', function closeMenu(e) {
            if (ignoreNextClick) {
                ignoreNextClick = false;
                return;
            }
            if (!menu.contains(e.target)) {
                removeHighlightMenu();
            }
        }, { once: true });
    }

    // 高亮选中文本
    function highlightSelection(color) {
        if (!isHighlightEnabled) {
            return null;
        }
        const selection = window.getSelection();
        if (!selection.rangeCount) return null;
        const range = selection.getRangeAt(0);
        const rawSelectedText = selection.toString();
        const trimmedText = rawSelectedText.trim();
        if (!trimmedText || trimmedText.length < settings.minTextLength) {
            return null;
        }
        const selectedText = rawSelectedText;
        const highlightId = 'highlight-' + Date.now() + '-' + Math.floor(Math.random() * 10000);

        // ★ 先从未修改前的文本中提取上下文
        let prefix = '', suffix = '';
        let xpath = '', textOffset = 0, parentElement = null;
        let container = null, containerXPath = '', containerFingerprint = null;
        let containerOffset = 0; // 容器内的绝对偏移

        const globalContext = collectRangeContext(range, 20);
        if (globalContext) {
            prefix = globalContext.prefix || '';
            suffix = globalContext.suffix || '';
        }

        if (range.startContainer.nodeType === Node.TEXT_NODE) {
            const originalText = range.startContainer.textContent;
            const startOffset = range.startOffset;
            const endOffset = Math.min(originalText.length, startOffset + selectedText.length);
            if (!prefix) {
                prefix = extractValidContext(originalText, startOffset, 20, "backward");
            }
            if (!suffix) {
                suffix = extractValidContext(originalText, endOffset, 20, "forward");
            }

            // 获取父元素用于生成XPath
            parentElement = range.startContainer.parentElement;
            textOffset = startOffset;

            // ★ 新增：查找最小容器
            container = findMinimalContainer(range.startContainer);
            if (container) {
                try {
                    containerXPath = generateXPath(container);
                    containerFingerprint = generateContainerFingerprint(container);

                    // 计算容器内的绝对偏移
                    containerOffset = calculateContainerOffset(container, range.startContainer, startOffset);
                } catch (e) {
                    console.warn('容器信息生成失败:', e);
                }
            }

            // 生成XPath
            try {
                xpath = generateXPath(parentElement);
            } catch (e) {
                console.warn('XPath生成失败:', e);
            }
        }

        try {
            // 检查是否需要分片段处理
            const fragments = collectHighlightFragments(range, highlightId, color);

            // 包装高亮（这会处理DOM）
            wrapRangeWithHighlight(range, highlightId, color);

            if (fragments && fragments.length > 1) {
                // 多片段情况：创建主记录和片段记录
                const mainHighlight = {
                    id: highlightId,
                    text: selectedText,  // 完整文本
                    color: color,
                    timestamp: Date.now(),
                    url: currentPageUrl,
                    isMultiFragment: true,  // 标记为多片段
                    fragmentCount: fragments.length,
                    // 保留第一个片段的信息用于兼容
                    xpath: fragments[0].xpath,
                    textOffset: fragments[0].textOffset,
                    textLength: selectedText.length,
                    contextHash: generateContextHash(fragments[0].prefix, fragments[fragments.length - 1].suffix, selectedText),
                    prefix: fragments[0].prefix,
                    suffix: fragments[fragments.length - 1].suffix
                };
                highlights.push(mainHighlight);

                // 添加所有片段记录
                fragments.forEach(fragment => {
                    highlights.push(fragment);
                });

            } else {
                // 单片段或传统情况
                const highlight = {
                    id: highlightId,
                    text: selectedText,
                    color: color,
                    timestamp: Date.now(),
                    url: currentPageUrl,

                    // 优化存储结构
                    xpath: xpath,
                    textOffset: textOffset,
                    textLength: selectedText.length,
                    contextHash: generateContextHash(prefix, suffix, selectedText),

                    // ★ 新增：容器相关信息
                    containerXPath: containerXPath,
                    containerOffset: containerOffset,
                    containerFingerprint: containerFingerprint,

                    // 兼容性：保留原有字段
                    prefix: prefix,    // 前置上下文
                    suffix: suffix     // 后置上下文
                };

                highlights.push(highlight);
            }

            saveHighlights();

            // 点击事件在包装函数中已处理

            // 检查侧边栏是否打开，如果打开则刷新高亮列表
            const sidebar = document.getElementById(`${STYLE_PREFIX}sidebar`);
            if (sidebar && sidebar.style.right === '0px' && updateSidebarHighlights) {
                updateSidebarHighlights();
            }

            selection.removeAllRanges();
            return highlightId;
        } catch (e) {
            console.warn('高亮失败:', e);
            try {
                findAndHighlight(selectedText, color, highlightId);

                // 检查侧边栏是否打开，如果打开则刷新高亮列表
                const sidebar = document.getElementById(`${STYLE_PREFIX}sidebar`);
                if (sidebar && sidebar.style.right === '0px' && updateSidebarHighlights) {
                    updateSidebarHighlights();
                }

                return highlightId;
            } catch (error) {
                console.error('替代高亮方法也失败:', error);
                return null;
            }
        }
    }

    // 收集高亮片段信息（新增辅助函数）
    function collectHighlightFragments(range, highlightId, color) {
        const fragments = [];
        const commonAncestor = range.commonAncestorContainer;
        const blockTags = ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BLOCKQUOTE'];

        // 判断是否跨块级元素
        let containsBlockElement = false;
        if (commonAncestor.nodeType === Node.ELEMENT_NODE) {
            containsBlockElement = blockTags.includes(commonAncestor.tagName) ||
                                    !!commonAncestor.querySelector(blockTags.map(tag => tag.toLowerCase()).join(','));
        }

        if (!containsBlockElement) {
            // 单片段情况
            return null; // 返回null表示使用传统方式
        }

        // 多片段情况：遍历所有文本节点
        const walker = document.createTreeWalker(
            commonAncestor,
            NodeFilter.SHOW_TEXT,
            null  // 不使用过滤器，遍历所有文本节点
        );

        let node;
        let fragmentIndex = 0;
        let isInRange = false;
        let foundStart = false;
        let foundEnd = false;

        while (node = walker.nextNode()) {
            // 跳过已高亮的节点
            if (node.parentElement && node.parentElement.classList.contains(`${STYLE_PREFIX}highlight-marked`)) {
                continue;
            }

            let nodeStartOffset = 0;
            let nodeEndOffset = node.textContent.length;
            let shouldInclude = false;

            // 检查是否是起始节点
            if (node === range.startContainer) {
                nodeStartOffset = range.startOffset;
                shouldInclude = true;
                isInRange = true;
                foundStart = true;
            }

            // 检查是否是结束节点
            if (node === range.endContainer) {
                nodeEndOffset = range.endOffset;
                shouldInclude = true;
                foundEnd = true;
            }

            // 如果已经开始但还未结束，包含整个节点
            if (isInRange && !foundEnd && node !== range.startContainer) {
                shouldInclude = true;
            }

            // 收集片段信息
            if (shouldInclude && nodeEndOffset > nodeStartOffset) {
                const fragmentText = node.textContent.substring(nodeStartOffset, nodeEndOffset);
                const parentElement = node.parentElement;

                // 生成该片段的上下文
                const fragmentPrefix = extractValidContext(node.textContent, nodeStartOffset, 20, "backward");
                const fragmentSuffix = extractValidContext(node.textContent, nodeEndOffset, 20, "forward");

                let xpath = '';
                try {
                    // 如果父元素只包含一个文本节点，使用父元素的XPath
                    // 否则，为文本节点生成特定的XPath
                    const textNodes = Array.from(parentElement.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
                    if (textNodes.length === 1) {
                        xpath = generateXPath(parentElement);
                    } else {
                        // 找出当前文本节点在父元素中的索引
                        const textIndex = textNodes.indexOf(node);
                        xpath = generateXPath(parentElement) + `/text()[${textIndex + 1}]`;
                    }
                } catch (e) {
                    console.warn('片段XPath生成失败:', e);
                }

                fragments.push({
                    id: `${highlightId}-fragment-${fragmentIndex}`,
                    parentId: highlightId,
                    text: fragmentText,
                    color: color,
                    isFragment: true,
                    fragmentIndex: fragmentIndex,
                    xpath: xpath,
                    textOffset: nodeStartOffset,
                    textLength: fragmentText.length,
                    contextHash: generateContextHash(fragmentPrefix, fragmentSuffix, fragmentText),
                    prefix: fragmentPrefix,
                    suffix: fragmentSuffix,
                    timestamp: Date.now(),
                    url: currentPageUrl
                });

                fragmentIndex++;
            }

            // 如果找到了结束节点，停止遍历
            if (foundEnd) {
                break;
            }
        }

        return fragments.length > 1 ? fragments : null;
    }

    // 根据ID删除高亮
    function removeHighlightById(highlightId) {
        // 查找主高亮记录
        const mainHighlight = highlights.find(h => h.id === highlightId);

        if (mainHighlight && mainHighlight.isMultiFragment) {
            // 多片段高亮：需要删除所有片段的DOM元素
            // 先删除主ID的元素（如果有）
            const mainElements = document.querySelectorAll(`.${STYLE_PREFIX}highlight-marked[data-highlight-id="${highlightId}"]`);
            mainElements.forEach(elem => {
                const textNode = document.createTextNode(elem.textContent);
                const parent = elem.parentNode;
                if (parent) {
                    parent.replaceChild(textNode, elem);
                    // 合并相邻的文本节点
                    parent.normalize();
                }
            });

            // 再删除所有片段ID的元素
            const fragments = highlights.filter(h => h.parentId === highlightId);
            fragments.forEach(fragment => {
                const fragmentElements = document.querySelectorAll(`.${STYLE_PREFIX}highlight-marked[data-highlight-id="${fragment.id}"]`);
                fragmentElements.forEach(elem => {
                    const textNode = document.createTextNode(elem.textContent);
                    const parent = elem.parentNode;
                    if (parent) {
                        parent.replaceChild(textNode, elem);
                        // 合并相邻的文本节点
                        parent.normalize();
                    }
                });
            });

            // 删除主记录和所有片段记录
            highlights = highlights.filter(h => h.id !== highlightId && h.parentId !== highlightId);
        } else {
            // 单片段高亮：使用原逻辑
            const highlightElement = document.querySelector(`.${STYLE_PREFIX}highlight-marked[data-highlight-id="${highlightId}"]`);
            if (highlightElement) {
                const textNode = document.createTextNode(highlightElement.textContent);
                const parent = highlightElement.parentNode;
                if (parent) {
                    parent.replaceChild(textNode, highlightElement);
                    // 合并相邻的文本节点
                    parent.normalize();
                }
            }
            highlights = highlights.filter(h => h.id !== highlightId);
        }

        saveHighlights();

        // 检查侧边栏是否打开，如果打开则刷新高亮列表
        const sidebar = document.getElementById(`${STYLE_PREFIX}sidebar`);
        if (sidebar && sidebar.style.right === '0px' && updateSidebarHighlights) {
            updateSidebarHighlights();
        }
    }

    // 使用 MutationObserver 监听 DOM 变化，动态恢复高亮
    function observeDomChanges() {
        // 检查 document.body 是否存在
        if (!document.body) {
            console.warn('document.body 不存在，无法启动 DOM 监听');
            return;
        }

        let debounceTimer;  // 新增变量用于防抖
        let isApplyingHighlights = false;  // 防止循环触发
        const observer = new MutationObserver((mutations) => {
            // 如果正在应用高亮，忽略此次变化
            if (isApplyingHighlights) {
                return;
            }

            // 过滤掉由脚本自身创建的高亮元素导致的变化
            const hasRelevantMutation = mutations.some(mutation => {
                // 忽略脚本自己创建的高亮标签变化
                if (mutation.target && mutation.target.classList &&
                    mutation.target.classList.contains(`${STYLE_PREFIX}highlight-marked`)) {
                    return false;
                }

                // 忽略父元素是高亮标签的变化
                if (mutation.target && mutation.target.parentElement &&
                    mutation.target.parentElement.classList &&
                    mutation.target.parentElement.classList.contains(`${STYLE_PREFIX}highlight-marked`)) {
                    return false;
                }

                // 忽略祖先元素是高亮标签的变化（解决嵌套高亮导致的问题）
                let parent = mutation.target;
                while (parent && parent !== document.body) {
                    if (parent.classList && parent.classList.contains(`${STYLE_PREFIX}highlight-marked`)) {
                        return false;
                    }
                    parent = parent.parentElement;
                }

                // 忽略添加的节点是脚本UI元素或高亮元素
                if (mutation.addedNodes.length > 0) {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const el = node;
                            if (el.classList && (
                                el.classList.contains(`${STYLE_PREFIX}highlight-marked`) ||
                                el.classList.contains(`${STYLE_PREFIX}highlight-menu`) ||
                                el.classList.contains(`${STYLE_PREFIX}floating-button`) ||
                                el.classList.contains(`${STYLE_PREFIX}sidebar`)
                            )) {
                                return false;
                            }
                            // 检查是否包含高亮元素（避免批量DOM操作触发重新应用）
                            if (el.querySelector && el.querySelector(`.${STYLE_PREFIX}highlight-marked`)) {
                                return false;
                            }
                        }
                    }
                }

                // 忽略删除的节点是高亮元素
                if (mutation.removedNodes.length > 0) {
                    for (let node of mutation.removedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const el = node;
                            if (el.classList && el.classList.contains(`${STYLE_PREFIX}highlight-marked`)) {
                                return false;
                            }
                        }
                    }
                }

                return true;
            });

            if (!hasRelevantMutation) {
                return;
            }

            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                // 只对没有高亮的元素重新应用高亮，避免影响已有高亮
                isApplyingHighlights = true;
                applyHighlights();
                // 延迟重置标志，确保所有由 applyHighlights 引起的 DOM 变化都被忽略
                setTimeout(() => {
                    isApplyingHighlights = false;
                }, 100);
            }, 300);
        });

        try {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });
        } catch (e) {
            console.warn('启动 DOM 监听失败:', e);
        }
    }

    // 更改高亮颜色
    function changeHighlightColor(highlightId, newColor) {
        // 查找主高亮记录
        const mainHighlight = highlights.find(h => h.id === highlightId);

        if (mainHighlight && mainHighlight.isMultiFragment) {
            // 多片段高亮：更新所有片段的颜色
            const fragments = highlights.filter(h => h.parentId === highlightId);

            // 更新主记录颜色
            mainHighlight.color = newColor;

            // 更新所有片段记录的颜色
            fragments.forEach(fragment => {
                fragment.color = newColor;

                // 更新DOM元素
                const fragmentElements = document.querySelectorAll(`.${STYLE_PREFIX}highlight-marked[data-highlight-id="${fragment.id}"]`);
                fragmentElements.forEach(elem => {
                    elem.style.backgroundColor = newColor;
                });
            });

        } else {
            // 单片段高亮：原逻辑
            const highlightElement = document.querySelector(`.${STYLE_PREFIX}highlight-marked[data-highlight-id="${highlightId}"]`);
            if (highlightElement) {
                highlightElement.style.backgroundColor = newColor;
            }
            const index = highlights.findIndex(h => h.id === highlightId);
            if (index !== -1) {
                highlights[index].color = newColor;
            }
        }

        saveHighlights();

        // 检查侧边栏是否打开，如果打开则刷新高亮列表
        const sidebar = document.getElementById(`${STYLE_PREFIX}sidebar`);
        if (sidebar && sidebar.style.right === '0px' && updateSidebarHighlights) {
            updateSidebarHighlights();
        }
    }

    // 显示/隐藏侧边栏
    function toggleSidebar(forceShow = true) {
        const sidebar = document.getElementById(`${STYLE_PREFIX}sidebar`);
        const floatingButton = document.getElementById(`${STYLE_PREFIX}floating-button`);
        if (!sidebar) return;

        if (forceShow) {
            sidebar.style.right = '0px';
            // 显示侧边栏时隐藏浮动按钮
            if (floatingButton) {
                floatingButton.style.display = 'none';
            }
            if (updateSidebarHighlights) {
                updateSidebarHighlights();
            }
        } else {
            const width = sidebar.style.width || '300px';
            const wasVisible = sidebar.style.right === '0px';
            sidebar.style.right = wasVisible ? `-${width}` : '0px';

            // 更新浮动按钮显示状态
            if (floatingButton) {
                if (wasVisible) {
                    // 关闭侧边栏时，根据设置和启用状态决定是否显示浮动按钮
                    floatingButton.style.display = (settings.showFloatingButton && isHighlightEnabled) ? 'flex' : 'none';
                } else {
                    // 打开侧边栏时，隐藏浮动按钮
                    floatingButton.style.display = 'none';
                }
            }

            if (sidebar.style.right === '0px' && updateSidebarHighlights) {
                updateSidebarHighlights();
            }
        }
    }

    // 切换浮动按钮显示/隐藏
    function toggleFloatingButton() {
        const floatingButton = document.getElementById(`${STYLE_PREFIX}floating-button`);
        if (!floatingButton) return;

        settings.showFloatingButton = !settings.showFloatingButton;
        // 根据设置与启用状态显示或隐藏浮动按钮
        floatingButton.style.display = (settings.showFloatingButton && isHighlightEnabled) ? 'flex' : 'none';
        saveSettings();
    }

    // 显示高亮编辑菜单
    function showHighlightEditMenu(event, highlightId) {
        if (!isHighlightEnabled) {
            return;
        }
        removeHighlightMenu();
        if (menuOperationInProgress) return;
        menuOperationInProgress = true;
        event.preventDefault();
        event.stopPropagation();
        ignoreNextClick = true;

        // 查找高亮记录，如果是片段ID，找到其主记录
        let highlight = highlights.find(h => h.id === highlightId);
        if (highlight && highlight.isFragment && highlight.parentId) {
            // 如果点击的是片段，使用主记录的ID
            highlightId = highlight.parentId;
            highlight = highlights.find(h => h.id === highlightId);
        }

        if (!highlight) {
            menuOperationInProgress = false;
            return;
        }
        const menu = createHighlightMenu(false);
        menu.dataset.currentHighlightId = highlightId;
        menu.querySelectorAll(`.${STYLE_PREFIX}highlight-menu-color`).forEach(colorBtn => {
            colorBtn.classList.remove(`${STYLE_PREFIX}active`);
        });
        const activeColorButton = menu.querySelector(`.${STYLE_PREFIX}highlight-menu-color[data-color="${highlight.color}"]`);
        if (activeColorButton) {
            activeColorButton.classList.add(`${STYLE_PREFIX}active`);
        }
        const menuHeight = 50;
        let menuTop = event.clientY + window.scrollY - menuHeight - 10;
        let showAbove = true;
        if (event.clientY < menuHeight + 10) {
            menuTop = event.clientY + window.scrollY + 10;
            showAbove = false;
        }
        menu.style.top = `${menuTop}px`;
        const menuWidth = menu.offsetWidth || 200;
        let menuLeft;
        if (event.clientX - (menuWidth / 2) < 5) {
            menuLeft = 5;
        } else if (event.clientX + (menuWidth / 2) > window.innerWidth - 5) {
            menuLeft = window.innerWidth - menuWidth - 5;
        } else {
            menuLeft = event.clientX - (menuWidth / 2);
        }
        menu.style.left = `${menuLeft}px`;
        const arrowLeft = event.clientX - menuLeft;
        const minArrowLeft = 12;
        const maxArrowLeft = menuWidth - 12;
        const safeArrowLeft = Math.max(minArrowLeft, Math.min(arrowLeft, maxArrowLeft));
        menu.style.setProperty('--arrow-left', `${safeArrowLeft}px`);
        if (!showAbove) {
            menu.classList.add(`${STYLE_PREFIX}arrow-top`);
        } else {
            menu.classList.remove(`${STYLE_PREFIX}arrow-top`);
        }
        requestAnimationFrame(() => {
            menu.classList.add(`${STYLE_PREFIX}show`);
            // 使用 once:true 来自动清理事件监听
            attachOutsideClose(menu);
            setTimeout(() => {
                ignoreNextClick = false;
                menuOperationInProgress = false;
            }, 50);
        });
    }

    // 查找并高亮文本
    function findAndHighlight(searchText, color, highlightId) {
        // 遍历所有文本节点查找匹配内容
        const treeWalker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null
        );
        while (treeWalker.nextNode()) {
            const node = treeWalker.currentNode;
            const textContent = node.textContent;
            if (!textContent || textContent.trim().length === 0) continue;
            const idx = textContent.indexOf(searchText);
            if (idx !== -1) {
                const range = document.createRange();
                range.setStart(node, idx);
                range.setEnd(node, idx + searchText.length);
                try {
                    wrapRangeWithHighlight(range, highlightId, color);
                    // 新高亮直接返回 true
                    return true;
                } catch (e) {
                    console.warn('应用高亮失败:', e);
                }
            }
        }
        return false;
    }

    // 应用页面上的所有高亮
    function applyHighlights() {
        // 过滤出主高亮记录（排除片段记录）
        const mainHighlights = highlights.filter(h => !h.isFragment);

        // 分离单片段和多片段高亮
        const singleFragmentHighlights = mainHighlights.filter(h => !h.isMultiFragment);
        const multiFragmentHighlights = mainHighlights.filter(h => h.isMultiFragment);

        // ★ 优化：按容器分组处理单片段高亮
        applySingleFragmentsByContainer(singleFragmentHighlights);

        // 然后按时间戳升序恢复多片段高亮（从早到晚）
        multiFragmentHighlights.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        multiFragmentHighlights.forEach(highlight => {
            const fragments = highlights.filter(h => h.parentId === highlight.id);

            // 按片段索引倒序排序，从后往前恢复，避免DOM变化影响XPath
            fragments.sort((a, b) => (b.fragmentIndex || 0) - (a.fragmentIndex || 0));

            let allFragmentsRestored = true;
            let anyFragmentRestored = false;

            fragments.forEach(fragment => {
                const restored = applyHighlightOptimized(fragment);
                if (!restored) {
                    allFragmentsRestored = false;
                    console.warn('片段恢复失败:', fragment.text);
                } else {
                    anyFragmentRestored = true;
                }
            });

            // 如果没有任何片段成功恢复，标记主记录为失败
            if (!anyFragmentRestored) {
                markHighlightAsFailed(highlight);
                console.warn('多片段高亮完全失败:', highlight.text);
            } else if (!allFragmentsRestored) {
                // 部分恢复也算失败
                markHighlightAsFailed(highlight);
                console.warn('多片段高亮部分恢复失败:', highlight.text);
            } else {
                // 全部成功，重置失败计数
                highlight.failedCount = 0;
            }
        });
    }

    // ★ 新增：按容器分组处理单片段高亮
    function applySingleFragmentsByContainer(singleFragments) {
        // 按容器 XPath 分组
        const containerGroups = new Map();

        singleFragments.forEach(highlight => {
            const containerKey = highlight.containerXPath || highlight.xpath || 'unknown';
            if (!containerGroups.has(containerKey)) {
                containerGroups.set(containerKey, []);
            }
            containerGroups.get(containerKey).push(highlight);
        });

        // 遍历每个容器组
        containerGroups.forEach((highlightsInContainer, containerXPath) => {
            // 同一容器内，按时间戳升序排序（早的先恢复）
            // 但按容器内偏移量降序排序（从后往前恢复，避免偏移变化）
            highlightsInContainer.sort((a, b) => {
                // 优先使用容器内偏移，如果没有则使用文本偏移
                const offsetA = a.containerOffset !== undefined ? a.containerOffset : a.textOffset || 0;
                const offsetB = b.containerOffset !== undefined ? b.containerOffset : b.textOffset || 0;
                // 从后往前排序（偏移大的先处理）
                return offsetB - offsetA;
            });

            // 逐个恢复该容器内的高亮
            highlightsInContainer.forEach(highlight => {
                const restored = applyHighlightOptimized(highlight);
                if (!restored) {
                    console.warn('优化恢复失败:', highlight.text);
                }
            });
        });
    }

    // 创建高亮菜单
    function createHighlightMenu(isNewHighlight = true) {
        removeHighlightMenu();
        ignoreNextClick = true;
        const menu = document.createElement('div');
        menu.className = `${STYLE_PREFIX}highlight-menu`;
        menu.innerHTML = `
        <div class="${STYLE_PREFIX}highlight-menu-colors">
            ${settings.colors.map(color => `
                <div class="${STYLE_PREFIX}highlight-menu-color"
                    style="background-color: ${color};"
                    data-color="${color}">
                </div>
            `).join('')}
        </div>
    `;
        // 无论如何先置空操作ID
        menu.dataset.currentHighlightId = '';
        document.body.appendChild(menu);

        // 如果是新建高亮，确保所有颜色块没有激活状态
        if (isNewHighlight) {
            menu.querySelectorAll(`.${STYLE_PREFIX}highlight-menu-color`).forEach(el => {
                el.classList.remove(`${STYLE_PREFIX}active`);
            });
        }

        menu.querySelectorAll(`.${STYLE_PREFIX}highlight-menu-color`).forEach(el => {
            el.addEventListener('click', (e) => {
                const color = el.dataset.color;
                const isActive = el.classList.contains(`${STYLE_PREFIX}active`);
                const currentHighlightId = menu.dataset.currentHighlightId;
                if (isActive) {
                    if (currentHighlightId) {
                        removeHighlightById(currentHighlightId);
                        menu.dataset.currentHighlightId = '';
                        menu.querySelectorAll(`.${STYLE_PREFIX}highlight-menu-color`)
                            .forEach(colorEl => colorEl.classList.remove(`${STYLE_PREFIX}active`));
                        const sel = window.getSelection();
                        sel.removeAllRanges();
                        if (savedRange) {
                            sel.addRange(savedRange.cloneRange());
                        }
                    } else {
                        window.getSelection().removeAllRanges();
                        menu.querySelectorAll(`.${STYLE_PREFIX}highlight-menu-color`)
                            .forEach(colorEl => colorEl.classList.remove(`${STYLE_PREFIX}active`));
                    }
                    removeHighlightMenu();
                } else {
                    settings.activeColor = color;
                    saveSettings();
                    if (currentHighlightId) {
                        changeHighlightColor(currentHighlightId, color);
                    } else {
                        const selection = window.getSelection();
                        if (selection.toString().trim() === '' && savedRange) {
                            selection.removeAllRanges();
                            selection.addRange(savedRange.cloneRange());
                        }
                        const newHighlightId = highlightSelection(color);
                        if (newHighlightId) {
                            menu.dataset.currentHighlightId = newHighlightId;
                        }
                    }
                    menu.querySelectorAll(`.${STYLE_PREFIX}highlight-menu-color`)
                        .forEach(colorEl => colorEl.classList.toggle(`${STYLE_PREFIX}active`, colorEl.dataset.color === color));
                }
                e.stopPropagation();
            });
        });
        return menu;
    }

    // 显示高亮菜单
    function showHighlightMenu() {
        if (!isHighlightEnabled) {
            return;
        }
        if (menuOperationInProgress) return;
        menuOperationInProgress = true;
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        if (selectedText === '') {
            menuOperationInProgress = false;
            return;
        }

        // 检查选中的文本是否在侧边栏内
        const range = selection.getRangeAt(0);
        let container = range.commonAncestorContainer;
        if (container.nodeType === Node.TEXT_NODE) {
            container = container.parentElement;
        }

        // 向上遍历DOM树，检查是否在侧边栏内
        let element = container;
        while (element && element !== document.body) {
            if (element.id === `${STYLE_PREFIX}sidebar`) {
                // 选中的文本在侧边栏内，不显示颜色选择器
                menuOperationInProgress = false;
                return;
            }
            element = element.parentElement;
        }
        const menu = createHighlightMenu(true);
        const rects = range.getClientRects();
        if (rects.length === 0) {
            menuOperationInProgress = false;
            return;
        }
        const targetRect = rects[0];
        const menuHeight = 50;
        let initialTop = window.scrollY + targetRect.top - menuHeight - 8;
        let showAbove = true;
        if (targetRect.top < menuHeight + 10) {
            initialTop = window.scrollY + targetRect.bottom + 8;
            showAbove = false;
        }
        menu.style.top = `${initialTop}px`;
        setTimeout(() => {
            const menuWidth = menu.offsetWidth;
            const textCenterX = targetRect.left + (targetRect.width / 2);
            let menuLeft;
            if (textCenterX - (menuWidth / 2) < 5) {
                menuLeft = 5;
            } else if (textCenterX + (menuWidth / 2) > window.innerWidth - 5) {
                menuLeft = window.innerWidth - menuWidth - 5;
            } else {
                menuLeft = textCenterX - (menuWidth / 2);
            }
            menu.style.left = `${menuLeft}px`;
            menu.style.transform = 'none';
            const arrowLeft = textCenterX - menuLeft;
            const minArrowLeft = 12;
            const maxArrowLeft = menuWidth - 12;
            const safeArrowLeft = Math.max(minArrowLeft, Math.min(arrowLeft, maxArrowLeft));
            menu.style.setProperty('--arrow-left', `${safeArrowLeft}px`);
            if (!showAbove) {
                menu.classList.add(`${STYLE_PREFIX}arrow-top`);
            } else {
                menu.classList.remove(`${STYLE_PREFIX}arrow-top`);
            }
            requestAnimationFrame(() => {
                menu.classList.add(`${STYLE_PREFIX}show`);
            });
        }, 0);
        attachOutsideClose(menu);
        setTimeout(() => {
            ignoreNextClick = false;
            menuOperationInProgress = false;
        }, 100);
    }

    // 注册事件
    function registerEvents() {
        document.addEventListener('mouseup', function (e) {
            if (!isHighlightEnabled) {
                return;
            }
            if (e.target.closest(`.${STYLE_PREFIX}highlight-menu`)) {
                return;
            }
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            if (selectedText.length < (settings.minTextLength || 1)) {
                return;
            }
            if (selection.rangeCount > 0) {
                savedRange = selection.getRangeAt(0).cloneRange();
            }
            removeHighlightMenu();
            clearTimeout(menuDisplayTimer);
            ignoreNextClick = true;
            menuDisplayTimer = setTimeout(() => {
                showHighlightMenu();
            }, 10);
        });
    }

    // 已弃用的模糊匹配实现已移除

    // 优化的高亮恢复函数 - 两层匹配策略
    function applyHighlightOptimized(highlight) {
        // 检查是否已经有相同ID的高亮存在
        const existingHighlight = document.querySelector(`.${STYLE_PREFIX}highlight-marked[data-highlight-id="${highlight.id}"]`);
        if (existingHighlight) {
            return true;
        }

        // 第一层：XPath + 偏移量快速定位（90%情况适用）
        if (tryXPathMatch(highlight)) {
            highlight.failedCount = 0; // 重置失败计数
            return true;
        }

        // 第二层：上下文哈希快速匹配（8%情况适用）
        if (tryContextHashMatch(highlight)) {
            highlight.failedCount = 0;
            return true;
        }

        // 失败处理：标记为失效，不进行复杂匹配
        markHighlightAsFailed(highlight);
        return false;
    }

    // 第一层匹配：XPath + 偏移量（增强：使用容器指纹验证）
    function tryXPathMatch(highlight) {
        try {
            // ★ 优先尝试使用容器 XPath（如果存在）
            if (highlight.containerXPath && highlight.containerOffset !== undefined) {
                const restored = tryContainerXPathMatch(highlight);
                if (restored) {
                    return true;
                }
            }

            // 降级：使用传统 XPath 方法
            if (!highlight.xpath || highlight.textOffset === undefined) {
                return false;
            }

            // 使用XPath查找元素
            const result = document.evaluate(
                highlight.xpath,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            );

            const targetNode = result.singleNodeValue;
            if (!targetNode) {
                return false;
            }

            // 如果XPath直接指向文本节点，直接使用它
            if (targetNode.nodeType === Node.TEXT_NODE) {
                const text = targetNode.textContent;
                if (text.substring(highlight.textOffset, highlight.textOffset + highlight.textLength) === highlight.text) {
                    return createHighlightAt(targetNode, highlight.textOffset, highlight);
                }
                return false;
            }

            // 否则，收集元素下的所有文本节点
            const targetElement = targetNode;
            const textNodes = [];
            const walker = document.createTreeWalker(
                targetElement,
                NodeFilter.SHOW_TEXT,
                null
            );

            let node;
            while (node = walker.nextNode()) {
                textNodes.push(node);
            }

            // 构建完整文本和节点位置映射
            let fullText = '';
            const nodeMap = []; // 记录每个字符对应的节点和节点内偏移

            for (let textNode of textNodes) {
                const nodeText = textNode.textContent;
                const startPos = fullText.length;
                for (let i = 0; i < nodeText.length; i++) {
                    nodeMap.push({ node: textNode, offset: i });
                }
                fullText += nodeText;
            }

            // 检查文本是否匹配
            const extractedText = fullText.substring(
                highlight.textOffset,
                highlight.textOffset + highlight.textLength
            );

            if (extractedText === highlight.text) {
                // 确定起始和结束节点
                const startInfo = nodeMap[highlight.textOffset];
                const endInfo = nodeMap[highlight.textOffset + highlight.textLength - 1];

                if (!startInfo || !endInfo) {
                    return false;
                }

                // 创建跨节点的高亮范围
                return createHighlightAtRange(
                    startInfo.node, startInfo.offset,
                    endInfo.node, endInfo.offset + 1,
                    highlight
                );
            }

            return false;
        } catch (e) {
            console.warn('XPath匹配失败:', e);
            return false;
        }
    }

    // ★ 新增：使用容器 XPath 和容器指纹进行匹配
    function tryContainerXPathMatch(highlight) {
        try {
            // 使用容器 XPath 查找容器
            const result = document.evaluate(
                highlight.containerXPath,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            );

            const container = result.singleNodeValue;
            if (!container) {
                return false;
            }

            // ★ 验证容器指纹（如果存在）
            if (highlight.containerFingerprint) {
                const currentFingerprint = generateContainerFingerprint(container);

                // 验证标签名
                if (currentFingerprint.tagName !== highlight.containerFingerprint.tagName) {
                    console.warn('容器标签不匹配:', currentFingerprint.tagName, '!=', highlight.containerFingerprint.tagName);
                    return false;
                }

                // 验证长度（允许10%的差异）
                const lengthDiff = Math.abs(currentFingerprint.textLength - highlight.containerFingerprint.textLength);
                const lengthThreshold = highlight.containerFingerprint.textLength * 0.1;
                if (lengthDiff > lengthThreshold) {
                    console.warn('容器长度差异过大:', lengthDiff, '>', lengthThreshold);
                    return false;
                }

                // 验证前缀后缀（至少有50%相似）
                const prefixMatch = highlight.containerFingerprint.prefix.substring(0, 50);
                const suffixMatch = highlight.containerFingerprint.suffix.substring(0, 50);
                if (!currentFingerprint.prefix.includes(prefixMatch) &&
                    !currentFingerprint.suffix.includes(suffixMatch)) {
                    console.warn('容器指纹不匹配');
                    return false;
                }
            }

            // 提取容器的完整文本
            const containerText = container.textContent || '';

            // 使用容器内偏移提取目标文本
            const extractedText = containerText.substring(
                highlight.containerOffset,
                highlight.containerOffset + highlight.textLength
            );

            // 验证文本是否匹配
            if (extractedText !== highlight.text) {
                return false;
            }

            // 找到容器内对应的文本节点和偏移
            const walker = document.createTreeWalker(
                container,
                NodeFilter.SHOW_TEXT,
                null
            );

            let totalOffset = 0;
            let startNode = null, startOffset = 0;
            let endNode = null, endOffset = 0;
            const targetEnd = highlight.containerOffset + highlight.textLength;

            let node;
            while (node = walker.nextNode()) {
                const nodeLength = node.textContent.length;
                const nodeStart = totalOffset;
                const nodeEnd = totalOffset + nodeLength;

                // 找起始节点：高亮起始位置在当前节点范围内
                if (startNode === null && nodeStart <= highlight.containerOffset && highlight.containerOffset < nodeEnd) {
                    startNode = node;
                    startOffset = highlight.containerOffset - nodeStart;
                }

                // 找结束节点：高亮结束位置在当前节点范围内或之前
                // ★ 修复：只有当 targetEnd 真正在当前节点内时才设置 endNode
                if (endNode === null && nodeStart < targetEnd && targetEnd <= nodeEnd) {
                    endNode = node;
                    endOffset = targetEnd - nodeStart;
                }

                totalOffset = nodeEnd;

                // ★ 修复：只有确认找到正确的结束节点后才停止
                // 如果 targetEnd 超出当前节点，继续遍历
                if (startNode && endNode) {
                    break;
                }
            }

            // ★ 修复：如果遍历完都没找到 endNode，可能 targetEnd 超出了容器范围
            // 此时使用最后一个节点作为 endNode
            if (startNode && !endNode && totalOffset > 0) {
                // 重新遍历找到最后一个节点
                const lastWalker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
                let lastNode = null;
                while (lastNode = lastWalker.nextNode()) {
                    endNode = lastNode;
                }
                if (endNode) {
                    endOffset = endNode.textContent.length;
                }
            }

            if (!startNode || !endNode) {
                console.warn('容器内未找到起始或结束节点');
                return false;
            }

            // 创建高亮
            return createHighlightAtRange(startNode, startOffset, endNode, endOffset, highlight);

        } catch (e) {
            console.warn('容器XPath匹配失败:', e);
            return false;
        }
    }

    // 第二层匹配：上下文哈希快速匹配
    function tryContextHashMatch(highlight) {
        try {
            if (!document.body || !highlight || !highlight.text) {
                return false;
            }

            const contextWindow = 50; // 上下文窗口大小
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null
            );

            const bufferNodes = [];
            let bufferText = '';

            const resolveOffsetInBuffer = (targetIndex) => {
                let accumulated = 0;
                for (let i = 0; i < bufferNodes.length; i++) {
                    const entry = bufferNodes[i];
                    const next = accumulated + entry.text.length;
                    if (targetIndex < next) {
                        return { node: entry.node, offset: targetIndex - accumulated };
                    }
                    accumulated = next;
                }
                if (bufferNodes.length) {
                    const lastEntry = bufferNodes[bufferNodes.length - 1];
                    if (targetIndex === accumulated) {
                        return { node: lastEntry.node, offset: lastEntry.text.length };
                    }
                }
                return null;
            };

            let node;
            while (node = walker.nextNode()) {
                if (!node || !node.textContent) {
                    continue;
                }

                // 跳过已经高亮的节点
                if (node.parentElement && node.parentElement.closest(`.${STYLE_PREFIX}highlight-marked`)) {
                    continue;
                }

                const textContent = node.textContent;
                if (!textContent.length) {
                    continue;
                }

                bufferNodes.push({ node, text: textContent });
                bufferText += textContent;

                const maxLength = highlight.text.length + contextWindow * 2;
                while (bufferNodes.length && bufferText.length > maxLength) {
                    const removed = bufferNodes.shift();
                    bufferText = bufferText.slice(removed.text.length);
                }

                let searchFrom = 0;
                while (true) {
                    const idx = bufferText.indexOf(highlight.text, searchFrom);
                    if (idx === -1) {
                        break;
                    }

                    const prefixStart = Math.max(0, idx - contextWindow);
                    const suffixEnd = Math.min(bufferText.length, idx + highlight.text.length + contextWindow);
                    const prefix = bufferText.substring(prefixStart, idx);
                    const suffix = bufferText.substring(idx + highlight.text.length, suffixEnd);
                    const currentHash = generateContextHash(prefix, suffix, highlight.text);

                    if (!highlight.contextHash || currentHash === highlight.contextHash) {
                        const startInfo = resolveOffsetInBuffer(idx);
                        const endInfo = resolveOffsetInBuffer(idx + highlight.text.length);

                        if (startInfo && endInfo && startInfo.node && endInfo.node) {
                            try {
                                const range = document.createRange();
                                range.setStart(startInfo.node, startInfo.offset);
                                range.setEnd(endInfo.node, endInfo.offset);
                                wrapRangeWithHighlight(range, highlight.id, highlight.color);
                                return true;
                            } catch (rangeError) {
                                console.warn('范围创建失败:', rangeError);
                            }
                        }
                    }

                    searchFrom = idx + 1;
                }
            }
            return false;
        } catch (e) {
            console.warn('上下文哈希匹配失败:', e);
            return false;
        }
    }

    // 将选区包装为高亮元素的通用方法
    function wrapRangeWithHighlight(range, highlightId, color) {
        // 检查是否需要分段处理
        const commonAncestor = range.commonAncestorContainer;
        const startContainer = range.startContainer;
        const endContainer = range.endContainer;
        const blockTags = ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BLOCKQUOTE'];

        // 判断是否包含块级元素
        let containsBlockElement = false;
        if (commonAncestor.nodeType === Node.ELEMENT_NODE) {
            containsBlockElement = blockTags.includes(commonAncestor.tagName) ||
                                    !!commonAncestor.querySelector(blockTags.map(tag => tag.toLowerCase()).join(','));
        }

        // ★ 修复：检查是否跨越多个文本节点（即使不跨块级元素）
        const spanMultipleNodes = startContainer !== endContainer;

        // 如果是简单情况（单个文本节点内，不跨块级元素），使用简单逻辑
        if (!containsBlockElement && !spanMultipleNodes) {
            // 简单情况：单个文本节点内的高亮
            const highlightElement = document.createElement('span');
            highlightElement.className = `${STYLE_PREFIX}highlight-marked`;
            highlightElement.dataset.highlightId = highlightId;
            highlightElement.style.backgroundColor = color;

            try {
                const fragment = range.extractContents();
                highlightElement.appendChild(fragment);
                range.insertNode(highlightElement);
            } catch (e) {
                console.warn('简单高亮创建失败:', e);
                return null;
            }

            highlightElement.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                removeHighlightMenu();
                setTimeout(() => {
                    showHighlightEditMenu(e, highlightId);
                }, 10);
            });

            return highlightElement;
        } else {
            // 复杂情况：跨越多个节点或跨块级元素，需要分段处理
            const highlightElements = [];

            try {
                // 获取选区内的所有节点
                const startOffset = range.startOffset;
                const endOffset = range.endOffset;

                // 创建树遍历器
                const walker = document.createTreeWalker(
                    commonAncestor,
                    NodeFilter.SHOW_TEXT,
                    null  // 简化处理，遍历所有文本节点
                );

                let node;
                let isInRange = false;
                let foundEnd = false;

                while (node = walker.nextNode()) {
                    // 跳过已高亮的节点
                    if (node.parentElement && node.parentElement.classList.contains(`${STYLE_PREFIX}highlight-marked`)) {
                        continue;
                    }

                    let nodeStartOffset = 0;
                    let nodeEndOffset = node.textContent.length;
                    let shouldHighlight = false;

                    // 如果是起始节点，调整偏移
                    if (node === startContainer) {
                        nodeStartOffset = startOffset;
                        isInRange = true;
                        shouldHighlight = true;
                    } else if (node === endContainer) {
                        // 如果是结束节点，调整偏移
                        nodeEndOffset = endOffset;
                        shouldHighlight = true;
                        foundEnd = true;
                    } else if (isInRange && !foundEnd) {
                        // 在范围内的中间节点
                        shouldHighlight = true;
                    }

                    // 创建单个文本节点的高亮
                    if (shouldHighlight && nodeEndOffset > nodeStartOffset) {
                        const nodeRange = document.createRange();
                        nodeRange.setStart(node, nodeStartOffset);
                        nodeRange.setEnd(node, nodeEndOffset);

                        const span = document.createElement('span');
                        span.className = `${STYLE_PREFIX}highlight-marked`;
                        span.dataset.highlightId = highlightId;
                        span.style.backgroundColor = color;

                        try {
                            nodeRange.surroundContents(span);

                            span.addEventListener('click', (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeHighlightMenu();
                                setTimeout(() => {
                                    showHighlightEditMenu(e, highlightId);
                                }, 10);
                            });

                            highlightElements.push(span);
                        } catch (e) {
                            // 如果 surroundContents 失败，尝试其他方法
                            const extracted = nodeRange.extractContents();
                            span.appendChild(extracted);
                            nodeRange.insertNode(span);

                            span.addEventListener('click', (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeHighlightMenu();
                                setTimeout(() => {
                                    showHighlightEditMenu(e, highlightId);
                                }, 10);
                            });

                            highlightElements.push(span);
                        }
                    }

                    // 如果已经处理了结束节点，停止遍历
                    if (foundEnd) {
                        break;
                    }
                }

                return highlightElements[0]; // 返回第一个高亮元素

            } catch (e) {
                console.error('分段高亮失败:', e);
                // 降级处理：使用原始方法
                const highlightElement = document.createElement('span');
                highlightElement.className = `${STYLE_PREFIX}highlight-marked`;
                highlightElement.dataset.highlightId = highlightId;
                highlightElement.style.backgroundColor = color;

                try {
                    const fragment = range.extractContents();
                    highlightElement.appendChild(fragment);
                    range.insertNode(highlightElement);
                } catch (extractError) {
                    console.error('降级处理也失败:', extractError);
                    return null;
                }

                highlightElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeHighlightMenu();
                    setTimeout(() => {
                        showHighlightEditMenu(e, highlightId);
                    }, 10);
                });

                return highlightElement;
            }
        }
    }

    // 在指定位置创建高亮
    function createHighlightAt(textNode, offset, highlight) {
        try {
            const range = document.createRange();
            range.setStart(textNode, offset);
            range.setEnd(textNode, offset + highlight.text.length);
            wrapRangeWithHighlight(range, highlight.id, highlight.color);
            return true;
        } catch (e) {
            console.warn('创建高亮失败:', e);
            return false;
        }
    }

    // 在跨节点范围创建高亮（支持包含<a>等内嵌元素的文本）
    function createHighlightAtRange(startNode, startOffset, endNode, endOffset, highlight) {
        try {
            const range = document.createRange();
            range.setStart(startNode, startOffset);
            range.setEnd(endNode, endOffset);
            wrapRangeWithHighlight(range, highlight.id, highlight.color);
            return true;
        } catch (e) {
            console.warn('创建跨节点高亮失败:', e);
            return false;
        }
    }

    // 标记高亮为失效
    function markHighlightAsFailed(highlight) {
        highlight.failedCount = (highlight.failedCount || 0) + 1;
        highlight.lastFailedTime = Date.now();
        console.warn('高亮失效:', highlight.text, '失败次数:', highlight.failedCount);
        saveHighlights();
    }

    // 创建失效高亮管理控件
    function createFailedHighlightControls() {
        const container = document.createElement('div');
        container.className = `${STYLE_PREFIX}failed-controls`;
        Object.assign(container.style, {
            padding: '8px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '8px',
            flex: '0 0 auto'
        });

        // 统计失效高亮数量（只统计主记录，不统计片段）
        const mainHighlights = highlights.filter(h => !h.isFragment);
        const failedCount = mainHighlights.filter(h => h.failedCount && h.failedCount >= 3).length;

        if (failedCount === 0) {
            container.style.display = 'none';
            return container;
        }

        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 8px;
                        background: linear-gradient(135deg, rgba(255, 165, 0, 0.08) 0%, rgba(255, 140, 0, 0.04) 100%);
                        border-radius: 6px; backdrop-filter: blur(8px);">
                <div style="display: flex; align-items: center; gap: 6px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFA500" stroke-width="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <span style="color: #FFA500; font-size: 12px; font-weight: 600;">
                        可能失效 (${failedCount})
                    </span>
                </div>
                <div style="display: flex; gap: 6px;">
                    <button id="${STYLE_PREFIX}detect-failed"
                            style="background: linear-gradient(135deg, rgba(74, 164, 222, 0.15) 0%, rgba(74, 164, 222, 0.08) 100%);
                                   border: 1px solid rgba(74, 164, 222, 0.25);
                                   color: #4EA8DE;
                                   padding: 4px 10px;
                                   border-radius: 4px;
                                   font-size: 11px;
                                   font-weight: 600;
                                   cursor: pointer;
                                   transition: all 0.2s;
                                   display: inline-flex;
                                   align-items: center;
                                   gap: 4px;
                                   backdrop-filter: blur(4px);
                                   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                        检测
                    </button>
                    <button id="${STYLE_PREFIX}clean-failed"
                            style="background: linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(255, 107, 107, 0.08) 100%);
                                   border: 1px solid rgba(255, 107, 107, 0.25);
                                   color: #FF6B6B;
                                   padding: 4px 10px;
                                   border-radius: 4px;
                                   font-size: 11px;
                                   font-weight: 600;
                                   cursor: pointer;
                                   transition: all 0.2s;
                                   display: inline-flex;
                                   align-items: center;
                                   gap: 4px;
                                   backdrop-filter: blur(4px);
                                   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                        清理
                    </button>
                </div>
            </div>
        `;

        // 添加事件监听
        const detectBtn = container.querySelector(`#${STYLE_PREFIX}detect-failed`);
        const cleanBtn = container.querySelector(`#${STYLE_PREFIX}clean-failed`);

        // 添加悬浮效果
        detectBtn.addEventListener('mouseenter', () => {
            detectBtn.style.transform = 'translateY(-1px)';
            detectBtn.style.boxShadow = '0 4px 8px rgba(74, 164, 222, 0.2)';
        });
        detectBtn.addEventListener('mouseleave', () => {
            detectBtn.style.transform = 'none';
            detectBtn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        });

        cleanBtn.addEventListener('mouseenter', () => {
            cleanBtn.style.transform = 'translateY(-1px)';
            cleanBtn.style.boxShadow = '0 4px 8px rgba(255, 107, 107, 0.2)';
        });
        cleanBtn.addEventListener('mouseleave', () => {
            cleanBtn.style.transform = 'none';
            cleanBtn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        });

        detectBtn.addEventListener('click', detectFailedHighlights);
        cleanBtn.addEventListener('click', cleanSelectedFailedHighlights);

        return container;
    }

    // 检测失效高亮
    function detectFailedHighlights() {
        let detectedCount = 0;

        // 只检测主高亮记录，不检测片段
        const mainHighlights = highlights.filter(h => !h.isFragment);

        mainHighlights.forEach(highlight => {
            const existing = document.querySelector(`.${STYLE_PREFIX}highlight-marked[data-highlight-id="${highlight.id}"]`);
            if (!existing) {
                highlight.failedCount = (highlight.failedCount || 0) + 1;
                detectedCount++;

                // 如果是多片段高亮，也更新片段的失败计数
                if (highlight.isMultiFragment) {
                    const fragments = highlights.filter(h => h.parentId === highlight.id);
                    fragments.forEach(fragment => {
                        fragment.failedCount = highlight.failedCount;
                    });
                }
            } else {
                highlight.failedCount = 0; // 重置失败计数

                // 如果是多片段高亮，也重置片段的失败计数
                if (highlight.isMultiFragment) {
                    const fragments = highlights.filter(h => h.parentId === highlight.id);
                    fragments.forEach(fragment => {
                        fragment.failedCount = 0;
                    });
                }
            }
        });

        saveHighlights();
        if (updateSidebarHighlights) updateSidebarHighlights();

        alert(`检测完成：发现 ${detectedCount} 个可能失效的高亮`);
    }

    // 清理选中的失效高亮
    function cleanSelectedFailedHighlights() {
        // 只检查主高亮记录
        const mainHighlights = highlights.filter(h => !h.isFragment);
        const failedHighlights = mainHighlights.filter(h => h.failedCount && h.failedCount >= 3);

        if (failedHighlights.length === 0) {
            alert('没有失效的高亮需要清理');
            return;
        }

        if (confirm(`确定要删除 ${failedHighlights.length} 个失效的高亮吗？此操作不可撤销。`)) {
            // 收集需要删除的ID（包括主记录和片段）
            const idsToDelete = new Set();

            failedHighlights.forEach(failedHighlight => {
                idsToDelete.add(failedHighlight.id);

                // 如果是多片段高亮，也添加片段ID
                if (failedHighlight.isMultiFragment) {
                    const fragments = highlights.filter(h => h.parentId === failedHighlight.id);
                    fragments.forEach(fragment => {
                        idsToDelete.add(fragment.id);
                    });
                }
            });

            // 过滤掉所有需要删除的高亮
            highlights = highlights.filter(h => !idsToDelete.has(h.id));

            saveHighlights();
            if (updateSidebarHighlights) updateSidebarHighlights();

            alert(`已成功清理 ${failedHighlights.length} 个失效高亮`);
        }
    }

    // 已弃用的上下文匹配实现已移除

    function extractValidContext(text, start, count, direction) {
        // direction: "backward" 从 start 往前提取, "forward" 从 start 往后提取
        let result = "";
        let processedChars = 0;

        // 对于短文本或单个字符，我们提取更多上下文
        const adjustedCount = count * (text.length <= 3 ? 2 : 1);

        if (direction === "backward") {
            for (let i = start - 1; i >= 0 && processedChars < adjustedCount * 2; i--) {
                const ch = text.charAt(i);
                // 只计算有效字符（中文、英文、数字）
                if (/[\u4e00-\u9fffA-Za-z0-9]/.test(ch)) {
                    result = ch + result;
                    processedChars++;
                    if (processedChars >= adjustedCount) break;
                } else {
                    // 空格和标点也记录，但不计入有效字符数
                    result = ch + result;
                }
            }
        } else { // forward
            for (let i = start; i < text.length && processedChars < adjustedCount * 2; i++) {
                const ch = text.charAt(i);
                // 只计算有效字符（中文、英文、数字）
                if (/[\u4e00-\u9fffA-Za-z0-9]/.test(ch)) {
                    result += ch;
                    processedChars++;
                    if (processedChars >= adjustedCount) break;
                } else {
                    // 空格和标点也记录，但不计入有效字符数
                    result += ch;
                }
            }
        }
        return result;
    }

    function collectRangeContext(range, count) {
        if (!range || typeof count !== 'number' || !document.body) {
            return { prefix: '', suffix: '' };
        }

        let prefix = '';
        let suffix = '';

        try {
            const prefixRange = document.createRange();
            prefixRange.setStart(document.body, 0);
            prefixRange.setEnd(range.startContainer, range.startOffset);
            const prefixText = prefixRange.toString();
            prefix = extractValidContext(prefixText, prefixText.length, count, 'backward');
        } catch (e) {
            console.warn('提取前置上下文失败:', e);
        }

        try {
            const suffixRange = document.createRange();
            suffixRange.setStart(range.endContainer, range.endOffset);
            const body = document.body;
            if (body && body.childNodes.length) {
                suffixRange.setEnd(body, body.childNodes.length);
            } else if (body) {
                suffixRange.setEnd(body, 0);
            }
            const suffixText = suffixRange.toString();
            suffix = extractValidContext(suffixText, 0, count, 'forward');
        } catch (e) {
            console.warn('提取后置上下文失败:', e);
        }

        return { prefix, suffix };
    }

    // 生成元素的XPath
    function generateXPath(element) {
        if (!element || element === document.body) {
            return '/html/body';
        }

        let path = '';
        for (; element && element.nodeType === Node.ELEMENT_NODE; element = element.parentNode) {
            let idx = 1;
            for (let sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
                if (sibling.nodeType === Node.ELEMENT_NODE && sibling.tagName === element.tagName) {
                    idx++;
                }
            }

            const tagName = element.tagName.toLowerCase();
            const xpathPart = tagName === 'body' ? tagName : `${tagName}[${idx}]`;
            path = '/' + xpathPart + path;

            if (element === document.body) break;
        }

        return '/html' + path;
    }

    // 查找最小容器（段落级别的块级元素）
    function findMinimalContainer(node) {
        const blockTags = ['P', 'DIV', 'LI', 'BLOCKQUOTE', 'TD', 'TH', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'ARTICLE', 'SECTION'];
        let element = node;

        // 如果是文本节点，从父元素开始
        if (element.nodeType === Node.TEXT_NODE) {
            element = element.parentElement;
        }

        // 向上查找第一个块级元素
        while (element && element !== document.body) {
            if (blockTags.includes(element.tagName)) {
                return element;
            }
            element = element.parentElement;
        }

        return document.body;
    }

    // 生成容器指纹
    function generateContainerFingerprint(container) {
        if (!container) {
            return null;
        }

        // 获取容器内的完整文本
        const containerText = container.textContent || '';
        const textLength = containerText.length;

        // 提取前100字和后100字作为容器指纹
        const prefixLength = Math.min(100, textLength);
        const suffixStart = Math.max(0, textLength - 100);

        return {
            tagName: container.tagName,
            textLength: textLength,
            prefix: containerText.substring(0, prefixLength),
            suffix: containerText.substring(suffixStart)
        };
    }

    // 提取容器内的上下文（相对于容器内偏移）
    function extractContainerContext(container, absoluteOffset, contextLength) {
        if (!container) {
            return { prefix: '', suffix: '' };
        }

        const containerText = container.textContent || '';
        const prefixStart = Math.max(0, absoluteOffset - contextLength);
        const suffixEnd = Math.min(containerText.length, absoluteOffset + contextLength);

        return {
            prefix: containerText.substring(prefixStart, absoluteOffset),
            suffix: containerText.substring(absoluteOffset, suffixEnd)
        };
    }

    // 计算文本节点在容器内的绝对偏移
    function calculateContainerOffset(container, targetTextNode, offsetInNode) {
        if (!container || !targetTextNode) {
            return 0;
        }

        let totalOffset = 0;
        const walker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_TEXT,
            null
        );

        let node;
        while (node = walker.nextNode()) {
            if (node === targetTextNode) {
                return totalOffset + offsetInNode;
            }
            totalOffset += node.textContent.length;
        }

        return 0;
    }

    // 生成上下文哈希（简单快速的字符串哈希）
    function generateContextHash(prefix, suffix, text) {
        const context = (prefix + '|' + text + '|' + suffix).substring(0, 100); // 限制长度
        let hash = 0;
        for (let i = 0; i < context.length; i++) {
            const char = context.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转换为32位整数
        }
        return Math.abs(hash).toString(36);
    }

    // 添加浮动按钮和侧边栏功能
    function createFloatingButtonAndSidebar() {
        // 检查 document.body 是否存在
        if (!document.body) {
            console.warn('document.body 不存在，延迟创建浮动按钮和侧边栏');
            // 延迟重试
            setTimeout(createFloatingButtonAndSidebar, 500);
            return;
        }

        const tooltipStyle = document.createElement('style');
        tooltipStyle.textContent = `
            .${STYLE_PREFIX}tooltip {
                position: absolute;
                background: #1A1D24;
                color: #E8E9EB;
                padding: 4px 10px;
                border-radius: 4px;
                font-size: 12px;
                pointer-events: none;
                white-space: nowrap;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.2s;
                bottom: 130%;
                left: 50%;
                transform: translateX(-50%);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
                border: 1px solid rgba(59, 165, 216, 0.2);
            }

            .${STYLE_PREFIX}tooltip::after {
                content: "";
                position: absolute;
                top: 100%;
                left: 50%;
                margin-left: -5px;
                border-width: 5px;
                border-style: solid;
                border-color: #1A1D24 transparent transparent transparent;
            }

            .${STYLE_PREFIX}tooltip-container {
                position: relative;
            }
        `;
        document.head.appendChild(tooltipStyle);
        // 创建浮动按钮
        const floatingButton = document.createElement('button');
        floatingButton.id = `${STYLE_PREFIX}floating-button`;
        // 使用 SVG 图标，代表"汉堡菜单"
        floatingButton.innerHTML = `
            <svg viewBox="0 0 100 80" width="16" height="16" fill="#ccc" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="10"></rect>
                <rect y="30" width="100" height="10"></rect>
                <rect y="60" width="100" height="10"></rect>
            </svg>
        `;
        // 基础样式（统一由此处控制，避免与 GM_addStyle 重复）
        Object.assign(floatingButton.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '10000',
            width: '38px',
            height: '38px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: '#262A33',
            color: '#E8E9EB',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.2s ease',
            display: (settings.showFloatingButton && isHighlightEnabled) ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center'
        });

        // 悬浮效果（替代 CSS :hover）
        floatingButton.addEventListener('mouseenter', () => {
            floatingButton.style.backgroundColor = '#3BA5D8';
            floatingButton.style.boxShadow = '0 4px 12px rgba(59, 165, 216, 0.25)';
        });
        floatingButton.addEventListener('mouseleave', () => {
            floatingButton.style.backgroundColor = '#262A33';
            floatingButton.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
        });

        document.body.appendChild(floatingButton);
        // 创建侧边栏（初始隐藏）
        const sidebar = document.createElement('div');
        sidebar.id = `${STYLE_PREFIX}sidebar`;
        Object.assign(sidebar.style, {
            position: 'fixed',
            top: '0',
            right: '-280px',
            width: '280px',
            height: '100%',
            boxShadow: '-2px 0 24px rgba(0, 0, 0, 0.15)',
            transition: 'none',
            zIndex: '9999',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            color: '#E8E9EB',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
            background: '#16181D',
            borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(20px)',
        });

        // 构建侧边栏内部结构
        sidebar.innerHTML = `
            <div class="${STYLE_PREFIX}sidebar-tabs">
                <button class="${STYLE_PREFIX}sidebar-tab ${STYLE_PREFIX}active" data-tab="current-page">
                    <span>本页</span>
                </button>
                <button class="${STYLE_PREFIX}sidebar-tab" data-tab="domain">
                    <span>全站</span>
                </button>
                <button class="${STYLE_PREFIX}sidebar-tab" data-tab="disabled">
                    <span>域名</span>
                </button>
                <button class="${STYLE_PREFIX}sidebar-tab" data-tab="webdav">
                    <span>备份</span>
                </button>
                <div style="flex: 1;"></div>
                <button class="${STYLE_PREFIX}sidebar-close" title="关闭">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                        <path d="M18 6L6 18M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <div class="${STYLE_PREFIX}sidebar-content">
                <div class="${STYLE_PREFIX}tab-panel ${STYLE_PREFIX}active" data-panel="current-page">
                    <div class="${STYLE_PREFIX}highlights-list"></div>
                </div>

                <div class="${STYLE_PREFIX}tab-panel" data-panel="domain">
                    <div class="${STYLE_PREFIX}domain-highlights-list"></div>
                </div>

                <div class="${STYLE_PREFIX}tab-panel" data-panel="disabled">
                    <div class="${STYLE_PREFIX}disabled-container"></div>
                </div>

                <div class="${STYLE_PREFIX}tab-panel" data-panel="webdav">
                    <div class="${STYLE_PREFIX}webdav-container"></div>
                </div>
            </div>
        `;

        document.body.appendChild(sidebar);
        setTimeout(() => {
            sidebar.style.transition = 'right 0.3s ease';
        }, 10);

        // 设置标签栏样式
        const tabs = sidebar.querySelector(`.${STYLE_PREFIX}sidebar-tabs`);
        Object.assign(tabs.style, {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '12px',
            background: 'rgba(22, 24, 29, 0.8)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(10px)',
        });

        // 设置标签按钮样式
        sidebar.querySelectorAll(`.${STYLE_PREFIX}sidebar-tab`).forEach(tab => {
            Object.assign(tab.style, {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid transparent',
                borderRadius: '6px',
                color: '#6B7280',
                fontSize: '12.5px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            });

            // 标签悬停效果
            tab.addEventListener('mouseenter', () => {
                if (!tab.classList.contains(`${STYLE_PREFIX}active`)) {
                    tab.style.background = 'rgba(255, 255, 255, 0.04)';
                    tab.style.color = '#9CA3AF';
                }
            });
            tab.addEventListener('mouseleave', () => {
                if (!tab.classList.contains(`${STYLE_PREFIX}active`)) {
                    tab.style.background = 'transparent';
                    tab.style.color = '#6B7280';
                }
            });
        });

        // 关闭按钮样式
        const closeBtn = sidebar.querySelector(`.${STYLE_PREFIX}sidebar-close`);
        Object.assign(closeBtn.style, {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6B7280',
            borderRadius: '6px',
            transition: 'all 0.2s',
        });
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(255, 107, 107, 0.12)';
            closeBtn.style.color = '#FF6B6B';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'none';
            closeBtn.style.color = '#6B7280';
        });

        // 激活的标签页样式
        const activeTab = sidebar.querySelector(`.${STYLE_PREFIX}sidebar-tab.${STYLE_PREFIX}active`);
        if (activeTab) {
            Object.assign(activeTab.style, {
                background: 'linear-gradient(135deg, rgba(74, 164, 222, 0.15) 0%, rgba(74, 164, 222, 0.08) 100%)',
                border: '1px solid rgba(74, 164, 222, 0.2)',
                color: '#4EA8DE',
            });
        }

        // 内容区域样式
        const contentArea = sidebar.querySelector(`.${STYLE_PREFIX}sidebar-content`);
        Object.assign(contentArea.style, {
            flex: '1',
            overflow: 'hidden',
            position: 'relative'
        });

        // 设置面板样式
        sidebar.querySelectorAll(`.${STYLE_PREFIX}tab-panel`).forEach(panel => {
            Object.assign(panel.style, {
                height: '100%',
                width: '100%',
                position: 'absolute',
                top: '0',
                left: '0',
                padding: '0',
                boxSizing: 'border-box',
                overflow: 'hidden',
                display: 'none',
                flexDirection: 'column'
            });
        });

        // 显示当前活动面板
        const activePanel = sidebar.querySelector(`.${STYLE_PREFIX}tab-panel.${STYLE_PREFIX}active`);
        if (activePanel) {
            activePanel.style.display = 'flex';
        }

        // 添加侧边栏拖拽调整区域（位于侧边栏的最左侧）
        const resizer = document.createElement('div');
        Object.assign(resizer.style, {
            position: 'absolute',
            left: '0',
            top: '0',
            width: '5px',
            height: '100%',
            cursor: 'ew-resize',
            backgroundColor: 'transparent'
        });
        sidebar.appendChild(resizer);

        // 拖拽事件逻辑
        resizer.addEventListener('mousedown', initResize);

        function initResize(e) {
            e.preventDefault();
            window.addEventListener('mousemove', resizeSidebar);
            window.addEventListener('mouseup', stopResize);
        }

        function resizeSidebar(e) {
            // 计算出新的宽度：侧边栏右对齐，宽度 = 窗口宽度 - 鼠标水平位置
            const newWidth = window.innerWidth - e.clientX;
            // 限制最小宽度为 150px，最大宽度为窗口 80%
            if (newWidth >= 150 && newWidth <= window.innerWidth * 0.8) {
                sidebar.style.width = newWidth + 'px';
                // 更新设置中的宽度
                settings.sidebarWidth = newWidth;
                saveSettings();
            }
        }

        function stopResize(e) {
            window.removeEventListener('mousemove', resizeSidebar);
            window.removeEventListener('mouseup', stopResize);
        }

        // 标签页切换事件
        sidebar.querySelectorAll(`.${STYLE_PREFIX}sidebar-tab`).forEach(tab => {
            tab.addEventListener('click', () => {
                // 移除所有标签页和面板的活动状态
                sidebar.querySelectorAll(`.${STYLE_PREFIX}sidebar-tab`).forEach(t => {
                    t.classList.remove(`${STYLE_PREFIX}active`);
                    t.style.background = 'transparent';
                    t.style.border = '1px solid transparent';
                    t.style.color = '#6B7280';
                });

                sidebar.querySelectorAll(`.${STYLE_PREFIX}tab-panel`).forEach(p => {
                    p.classList.remove(`${STYLE_PREFIX}active`);
                    p.style.display = 'none';
                });

                // 激活当前标签和面板
                tab.classList.add(`${STYLE_PREFIX}active`);
                tab.style.background = 'linear-gradient(135deg, rgba(74, 164, 222, 0.15) 0%, rgba(74, 164, 222, 0.08) 100%)';
                tab.style.border = '1px solid rgba(74, 164, 222, 0.2)';
                tab.style.color = '#4EA8DE';

                const panelId = tab.getAttribute('data-tab');
                const panel = sidebar.querySelector(`.${STYLE_PREFIX}tab-panel[data-panel="${panelId}"]`);
                if (panel) {
                    panel.classList.add(`${STYLE_PREFIX}active`);
                    panel.style.display = 'flex';
                }
            });
        });

        // 关闭按钮事件
        const closeButton = sidebar.querySelector(`.${STYLE_PREFIX}sidebar-close`);
        closeButton.addEventListener('click', () => {
            sidebar.style.right = `-${parseInt(sidebar.style.width)}px`;

            // 侧边栏关闭时，如果设置允许显示浮动按钮且当前页面未启用，则恢复显示浮动按钮
            if (settings.showFloatingButton && isHighlightEnabled) {
                floatingButton.style.display = 'flex';
            }
        });

        // 浮动按钮点击后切换侧边栏的显示和隐藏
        floatingButton.addEventListener('click', () => {
            if (sidebar.style.right === '0px') {
                sidebar.style.right = `-${parseInt(sidebar.style.width)}px`;
                // 如果设置允许显示浮动按钮且当前页面已启用，则显示浮动按钮
                if (settings.showFloatingButton && isHighlightEnabled) {  // 正确的变量
                    floatingButton.style.display = 'flex';
                }
            } else {
                sidebar.style.right = '0px';
                // 当侧边栏显示时，隐藏浮动按钮
                floatingButton.style.display = 'none';
                // 刷新高亮列表
                if (updateSidebarHighlights) {
                    updateSidebarHighlights();
                }
            }
        });

        // 初始设置宽度
        if (settings.sidebarWidth) {
            sidebar.style.width = `${settings.sidebarWidth}px`;
            sidebar.style.right = `-${settings.sidebarWidth}px`; // 确保初始位置与实际宽度匹配
        } else {
            sidebar.style.right = '-300px'; // 默认宽度的对应位置
        }

        // 渲染本页高亮列表
        function renderCurrentPageHighlights() {
            const highlightsListContainer = sidebar.querySelector(`.${STYLE_PREFIX}highlights-list`);
            if (!highlightsListContainer) return;

            // 清空容器
            highlightsListContainer.innerHTML = '';
            Object.assign(highlightsListContainer.style, {
                flex: '1',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                padding: '0',
                width: '100%',
                position: 'relative',
                boxSizing: 'border-box',
            });

            // 添加失效高亮管理控件
            const failedControlsContainer = createFailedHighlightControls();
            highlightsListContainer.appendChild(failedControlsContainer);

            // 创建高亮列表
            const listContainer = document.createElement('div');
            listContainer.className = `${STYLE_PREFIX}highlights-items`;
            Object.assign(listContainer.style, {
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: '12px',
                width: '100%',
                boxSizing: 'border-box',
                alignItems: 'stretch'
            });

            // 自定义滚动条样式（隐藏滚动条但保留滚动能力）
            let highlightScrollStyle = document.getElementById(`${STYLE_PREFIX}highlight-scroll-style`);
            if (!highlightScrollStyle) {
                highlightScrollStyle = document.createElement('style');
                highlightScrollStyle.id = `${STYLE_PREFIX}highlight-scroll-style`;
                document.head.appendChild(highlightScrollStyle);
            }
            highlightScrollStyle.textContent = `
                .${STYLE_PREFIX}highlights-items {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .${STYLE_PREFIX}highlights-items::-webkit-scrollbar {
                    width: 0;
                    height: 0;
                }
            `;

            // 当前页面模式：只显示当前页面的高亮
            const mainHighlights = highlights.filter(h => !h.isFragment);
            const sortedHighlights = [...mainHighlights].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

            if (sortedHighlights.length === 0) {
                // 显示空状态
                const emptyState = document.createElement('div');
                Object.assign(emptyState.style, {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 20px',
                    textAlign: 'center',
                    color: '#999',
                    fontSize: '13px'
                });

                emptyState.innerHTML = `
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)"
                        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                    <p style="margin-top:16px; font-size:13px !important;">暂无高亮内容<br>选中文本并点击颜色进行高亮</p>
                `;
                listContainer.appendChild(emptyState);
            } else {
                // 渲染所有高亮项目
                sortedHighlights.forEach((highlight, index) => {
                    const highlightItem = createHighlightItem(highlight, index);
                    listContainer.appendChild(highlightItem);
                });
            }

            highlightsListContainer.appendChild(listContainer);

            // 创建底部固定按钮栏 - 添加到 tab-panel 而不是 highlights-list
            const tabPanel = sidebar.querySelector(`.${STYLE_PREFIX}tab-panel[data-panel="current-page"]`);
            if (!tabPanel) return;

            // 清除旧的底部操作栏（如果存在）
            const existingActionBar = tabPanel.querySelector(`.${STYLE_PREFIX}highlights-bottom-actions`);
            if (existingActionBar) {
                existingActionBar.remove();
            }

            const bottomActionBar = document.createElement('div');
            bottomActionBar.className = `${STYLE_PREFIX}highlights-bottom-actions`;
            Object.assign(bottomActionBar.style, {
                display: 'flex',
                padding: '12px',
                gap: '10px',
                boxSizing: 'border-box',
                background: 'rgba(22, 24, 29, 0.95)',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                flexShrink: '0'
            });
            // 创建刷新按钮
            const refreshBtn = document.createElement('button');
            Object.assign(refreshBtn.style, {
                flex: '1',
                background: 'linear-gradient(135deg, rgba(74, 164, 222, 0.15) 0%, rgba(74, 164, 222, 0.08) 100%)',
                border: '1px solid rgba(74, 164, 222, 0.2)',
                borderRadius: '6px',
                padding: '10px',
                color: '#4EA8DE',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
            });
            refreshBtn.innerHTML = `刷新`;

            // 添加悬停效果
            refreshBtn.addEventListener('mouseenter', () => {
                refreshBtn.style.transform = 'translateY(-1px)';
                refreshBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            });
            refreshBtn.addEventListener('mouseleave', () => {
                refreshBtn.style.transform = 'none';
                refreshBtn.style.boxShadow = 'none';
            });

            refreshBtn.addEventListener('click', () => {
                // 刷新高亮列表
                loadHighlights();
                applyHighlights();
                renderCurrentPageHighlights();
            });

            // 创建清除按钮
            const clearBtn = document.createElement('button');
            Object.assign(clearBtn.style, {
                flex: '1',
                background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(255, 107, 107, 0.08) 100%)',
                border: '1px solid rgba(255, 107, 107, 0.2)',
                borderRadius: '6px',
                padding: '10px',
                color: '#FF6B6B',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
            });
            clearBtn.innerHTML = `清空`;

            // 添加悬停效果
            clearBtn.addEventListener('mouseenter', () => {
                clearBtn.style.transform = 'translateY(-1px)';
                clearBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            });
            clearBtn.addEventListener('mouseleave', () => {
                clearBtn.style.transform = 'none';
                clearBtn.style.boxShadow = 'none';
            });

            clearBtn.addEventListener('click', () => {
                if (highlights.length === 0) return;

                // 确认删除
                if (confirm('确定要删除所有高亮吗？此操作不可撤销。')) {
                    // 移除DOM中的高亮元素
                    document.querySelectorAll(`.${STYLE_PREFIX}highlight-marked`).forEach(el => {
                        const textNode = document.createTextNode(el.textContent);
                        el.parentNode.replaceChild(textNode, el);
                    });

                    // 清空高亮数组
                    highlights = [];
                    saveHighlights();
                    renderCurrentPageHighlights();
                }
            });

            bottomActionBar.appendChild(refreshBtn);
            bottomActionBar.appendChild(clearBtn);
            tabPanel.appendChild(bottomActionBar);
        }

        // 渲染全站高亮列表
        function renderDomainHighlights() {
            const domainHighlightsListContainer = sidebar.querySelector(`.${STYLE_PREFIX}domain-highlights-list`);
            if (!domainHighlightsListContainer) return;

            // 清空容器
            domainHighlightsListContainer.innerHTML = '';
            Object.assign(domainHighlightsListContainer.style, {
                flex: '1',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                padding: '0',
                width: '100%',
                position: 'relative',
                boxSizing: 'border-box',
            });

            // 创建高亮列表
            const listContainer = document.createElement('div');
            listContainer.className = `${STYLE_PREFIX}highlights-items`;
            Object.assign(listContainer.style, {
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: '12px',
                width: '100%',
                boxSizing: 'border-box',
                alignItems: 'stretch'
            });

            // 整个域名模式：显示域名下所有页面的高亮，按URL分组
            const domainHighlights = loadDomainHighlights();
            const urlEntries = Object.entries(domainHighlights);

            if (urlEntries.length === 0) {
                // 显示空状态
                const emptyState = document.createElement('div');
                Object.assign(emptyState.style, {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 20px',
                    textAlign: 'center',
                    color: '#999',
                    fontSize: '13px'
                });

                emptyState.innerHTML = `
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)"
                        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                    <p style="margin-top:16px; font-size:13px !important;">该域名下暂无高亮内容</p>
                `;
                listContainer.appendChild(emptyState);
            } else {
                // 按URL分组显示
                urlEntries.forEach(([url, highlightArray]) => {
                    const urlGroup = createUrlGroup(url, highlightArray);
                    listContainer.appendChild(urlGroup);
                });
            }

            domainHighlightsListContainer.appendChild(listContainer);
        }

        // 更新函数：同时更新本页和全站列表
        updateSidebarHighlights = function() {
            renderCurrentPageHighlights();
            renderDomainHighlights();
        };

        // 创建URL分组
        function createUrlGroup(url, highlightArray) {
            const isCurrentPage = url === currentPageUrl;
            const mainHighlights = highlightArray.filter(h => !h.isFragment);
            const sortedHighlights = [...mainHighlights].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

            // 获取URL的路径部分用于显示
            let displayPath = '';
            try {
                const urlObj = new URL(url);
                displayPath = urlObj.pathname + urlObj.search + urlObj.hash;
                if (displayPath.length > 50) {
                    displayPath = displayPath.substring(0, 47) + '...';
                }
            } catch (e) {
                displayPath = url;
            }

            // 创建分组容器
            const groupContainer = document.createElement('div');
            groupContainer.className = `${STYLE_PREFIX}url-group`;
            Object.assign(groupContainer.style, {
                marginBottom: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '8px',
                overflow: 'hidden',
                background: 'rgba(38, 42, 51, 0.3)'
            });

            // 创建分组头部
            const groupHeader = document.createElement('div');
            groupHeader.className = `${STYLE_PREFIX}url-group-header`;
            Object.assign(groupHeader.style, {
                padding: '10px 12px',
                background: isCurrentPage ? 'rgba(59, 165, 216, 0.1)' : 'rgba(46, 48, 58, 0.5)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s'
            });

            // URL图标
            const urlIcon = document.createElement('span');
            urlIcon.innerHTML = isCurrentPage ? '📄' : '🔗';
            urlIcon.style.fontSize = '14px';

            // URL路径文本
            const urlText = document.createElement('div');
            Object.assign(urlText.style, {
                flex: '1',
                fontSize: '12px',
                color: isCurrentPage ? '#3BA5D8' : '#E8E9EB',
                fontWeight: isCurrentPage ? '600' : '400',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            });
            urlText.textContent = displayPath;
            urlText.title = url; // 完整URL作为tooltip

            // 当前页面标签
            if (isCurrentPage) {
                const currentTag = document.createElement('span');
                Object.assign(currentTag.style, {
                    padding: '2px 8px',
                    background: 'rgba(59, 165, 216, 0.2)',
                    border: '1px solid rgba(59, 165, 216, 0.3)',
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: '#3BA5D8',
                    fontWeight: '600'
                });
                currentTag.textContent = '当前';
                groupHeader.appendChild(currentTag);
            }

            // 高亮数量
            const countBadge = document.createElement('span');
            Object.assign(countBadge.style, {
                padding: '2px 8px',
                background: 'rgba(112, 211, 130, 0.15)',
                border: '1px solid rgba(112, 211, 130, 0.3)',
                borderRadius: '4px',
                fontSize: '11px',
                color: '#70d382',
                fontWeight: '600'
            });
            countBadge.textContent = mainHighlights.length;

            // 展开/折叠图标
            const toggleIcon = document.createElement('span');
            toggleIcon.innerHTML = '▼';
            Object.assign(toggleIcon.style, {
                fontSize: '10px',
                color: '#999',
                transition: 'transform 0.2s'
            });

            groupHeader.appendChild(urlIcon);
            groupHeader.appendChild(urlText);
            groupHeader.appendChild(countBadge);
            groupHeader.appendChild(toggleIcon);

            // 创建高亮列表容器
            const highlightsContainer = document.createElement('div');
            highlightsContainer.className = `${STYLE_PREFIX}url-group-highlights`;
            Object.assign(highlightsContainer.style, {
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '8px',
                maxHeight: '400px',
                overflowY: 'auto'
            });

            // 渲染该URL的所有高亮
            sortedHighlights.forEach((highlight, index) => {
                const highlightItem = createHighlightItem(highlight, index, !isCurrentPage, url);
                highlightsContainer.appendChild(highlightItem);
            });

            // 展开/折叠功能
            let isExpanded = isCurrentPage; // 当前页面默认展开
            if (!isExpanded) {
                highlightsContainer.style.display = 'none';
                toggleIcon.style.transform = 'rotate(-90deg)';
            }

            groupHeader.addEventListener('click', () => {
                isExpanded = !isExpanded;
                highlightsContainer.style.display = isExpanded ? 'flex' : 'none';
                toggleIcon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)';
            });

            // 悬停效果
            groupHeader.addEventListener('mouseenter', () => {
                groupHeader.style.background = isCurrentPage ? 'rgba(59, 165, 216, 0.15)' : 'rgba(46, 48, 58, 0.7)';
            });
            groupHeader.addEventListener('mouseleave', () => {
                groupHeader.style.background = isCurrentPage ? 'rgba(59, 165, 216, 0.1)' : 'rgba(46, 48, 58, 0.5)';
            });

            groupContainer.appendChild(groupHeader);
            groupContainer.appendChild(highlightsContainer);

            return groupContainer;
        }

        // 创建单个高亮项目
        function createHighlightItem(highlight, index, isOtherPage = false, pageUrl = '') {
            const item = document.createElement('div');
            item.className = `${STYLE_PREFIX}highlight-item`;
            item.dataset.highlightId = highlight.id;

            Object.assign(item.style, {
                background: isOtherPage ?
                    'linear-gradient(135deg, rgba(78, 89, 108, 0.15) 0%, rgba(46, 48, 58, 0.12) 100%)' :
                    'linear-gradient(135deg, rgba(78, 89, 108, 0.22) 0%, rgba(46, 48, 58, 0.18) 100%)',
                border: isOtherPage ?
                    '1px solid rgba(255, 255, 255, 0.05)' :
                    '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '14px',
                margin: '0',
                position: 'relative',
                transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                overflow: 'hidden',
                flex: '0 0 auto',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 10px 24px rgba(7, 12, 24, 0.28)',
                opacity: isOtherPage ? '0.85' : '1'
            });

            // 高亮内容
            const content = document.createElement('div');
            Object.assign(content.style, {
                color: '#E8E9EB',
                fontSize: '13.5px',
                lineHeight: '1.6',
                marginBottom: '10px',
                wordBreak: 'break-word',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: '3',
                overflow: 'hidden',
                fontWeight: '400',
            });

            // 处理高亮文本，避免XSS
            const textNode = document.createTextNode(highlight.text);
            content.appendChild(textNode);

            // 底部信息栏
            const infoBar = document.createElement('div');
            Object.assign(infoBar.style, {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            });

            // 时间信息区域（含发光色点）
            const timeContainer = document.createElement('div');
            Object.assign(timeContainer.style, {
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
            });

            // 发光色点
            const colorDot = document.createElement('div');
            Object.assign(colorDot.style, {
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: highlight.color,
                boxShadow: `0 0 8px ${highlight.color}80`,
            });

            // 时间信息
            const timeInfo = document.createElement('div');
            Object.assign(timeInfo.style, {
                color: '#6B7280',
                fontSize: '11.5px',
                fontWeight: '500',
            });

            // 格式化时间
            const date = new Date(highlight.timestamp);
            const formattedDate = `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            timeInfo.textContent = formattedDate;

            timeContainer.appendChild(colorDot);
            timeContainer.appendChild(timeInfo);

            // 失效标识
            if (highlight.failedCount && highlight.failedCount >= 3) {
                const failedBadge = document.createElement('span');
                Object.assign(failedBadge.style, {
                    background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.15) 0%, rgba(255, 140, 0, 0.08) 100%)',
                    border: '1px solid rgba(255, 165, 0, 0.25)',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    color: '#FFA500',
                    fontSize: '10.5px',
                    fontWeight: '600',
                    marginLeft: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    backdropFilter: 'blur(4px)',
                    boxShadow: '0 0 8px rgba(255, 165, 0, 0.15)',
                    letterSpacing: '0.3px',
                });

                // 使用SVG图标替代emoji
                failedBadge.innerHTML = `
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <span>失效</span>
                `;
                failedBadge.title = `恢复失败 ${highlight.failedCount} 次`;
                timeContainer.appendChild(failedBadge);
            }

            // 操作按钮容器（默认隐藏，悬停时显示）
            const actionButtons = document.createElement('div');
            actionButtons.className = `${STYLE_PREFIX}card-actions`;
            Object.assign(actionButtons.style, {
                display: 'flex',
                gap: '6px',
                opacity: '0',
                transition: 'opacity 0.2s',
            });

            // 跳转按钮
            const jumpButton = document.createElement('button');
            const jumpDefaultBackground = 'transparent';
            const jumpDefaultBorder = 'transparent';
            const jumpHoverBackground = 'rgba(118, 196, 255, 0.22)';
            const jumpHoverBorder = 'rgba(118, 196, 255, 0.45)';
            Object.assign(jumpButton.style, {
                width: '25px',
                height: '25px',
                background: 'transparent',
                border: '1px solid transparent',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8ed0ff',
                transition: 'all 0.18s ease',
                boxShadow: 'none',
                backdropFilter: 'blur(0)'
            });
            jumpButton.setAttribute('aria-label', '定位到原文');
            jumpButton.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
            `;

            const activateJumpVisual = () => {
                jumpButton.style.background = jumpHoverBackground;
                jumpButton.style.borderColor = jumpHoverBorder;
                jumpButton.style.boxShadow = '0 10px 20px rgba(12, 23, 42, 0.35)';
                jumpButton.style.transform = 'translateY(-1px) scale(1.08)';
                jumpButton.style.color = '#e5f5ff';
            };
            const resetJumpVisual = () => {
                jumpButton.style.background = jumpDefaultBackground;
                jumpButton.style.borderColor = jumpDefaultBorder;
                jumpButton.style.boxShadow = 'none';
                jumpButton.style.transform = 'none';
                jumpButton.style.color = '#8ed0ff';
            };
            jumpButton.addEventListener('mouseenter', activateJumpVisual);
            jumpButton.addEventListener('focus', activateJumpVisual);
            jumpButton.addEventListener('mouseleave', resetJumpVisual);
            jumpButton.addEventListener('blur', resetJumpVisual);

            jumpButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                if (isOtherPage && pageUrl) {
                    // 其他页面的高亮，提示跳转
                    if (confirm(`该高亮位于其他页面，是否跳转？\n\n${pageUrl}`)) {
                        window.open(pageUrl, '_blank');
                    }
                } else {
                    // 当前页面的高亮，直接滚动
                    scrollToHighlight(highlight.id);
                }
            });

            // 删除按钮
            const deleteButton = document.createElement('button');
            const deleteDefaultBackground = 'transparent';
            const deleteDefaultBorder = 'transparent';
            const deleteHoverBackground = 'rgba(255, 126, 126, 0.24)';
            const deleteHoverBorder = 'rgba(255, 172, 172, 0.48)';
            Object.assign(deleteButton.style, {
                width: '25px',
                height: '25px',
                background: deleteDefaultBackground,
                border: `1px solid ${deleteDefaultBorder}`,
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ff9f9f',
                transition: 'all 0.18s ease',
                boxShadow: 'none',
                backdropFilter: 'blur(0)'
            });
            deleteButton.setAttribute('aria-label', '删除高亮');
            deleteButton.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"></path>
                </svg>
            `;

            const activateDeleteVisual = () => {
                deleteButton.style.background = deleteHoverBackground;
                deleteButton.style.borderColor = deleteHoverBorder;
                deleteButton.style.boxShadow = '0 10px 20px rgba(32, 12, 18, 0.4)';
                deleteButton.style.transform = 'translateY(-1px) scale(1.08)';
                deleteButton.style.color = '#ffe3e3';
            };
            const resetDeleteVisual = () => {
                deleteButton.style.background = deleteDefaultBackground;
                deleteButton.style.borderColor = deleteDefaultBorder;
                deleteButton.style.boxShadow = 'none';
                deleteButton.style.transform = 'none';
                deleteButton.style.color = '#ff9f9f';
            };
            deleteButton.addEventListener('mouseenter', activateDeleteVisual);
            deleteButton.addEventListener('focus', activateDeleteVisual);
            deleteButton.addEventListener('mouseleave', resetDeleteVisual);
            deleteButton.addEventListener('blur', resetDeleteVisual);

            deleteButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                if (confirm('确定要删除这条高亮吗？')) {
                    if (isOtherPage && pageUrl) {
                        // 删除其他页面的高亮
                        const allHighlights = GM_getValue('highlights', {});
                        if (allHighlights[pageUrl]) {
                            // 从该URL的高亮数组中删除
                            allHighlights[pageUrl] = allHighlights[pageUrl].filter(h =>
                                h.id !== highlight.id && h.parentId !== highlight.id
                            );
                            // 如果数组为空，删除该URL的键
                            if (allHighlights[pageUrl].length === 0) {
                                delete allHighlights[pageUrl];
                            }
                            GM_setValue('highlights', allHighlights);
                        }
                    } else {
                        // 删除当前页面的高亮
                        removeHighlightById(highlight.id);
                    }
                    updateSidebarHighlights();
                }
            });

            actionButtons.appendChild(jumpButton);
            actionButtons.appendChild(deleteButton);

            infoBar.appendChild(timeContainer);
            infoBar.appendChild(actionButtons);

            // 添加卡片悬停效果
            const defaultBackground = item.style.background;
            const defaultBorder = item.style.borderColor;
            const defaultShadow = item.style.boxShadow;

            item.addEventListener('mouseenter', () => {
                item.style.background = 'linear-gradient(135deg, rgba(94, 139, 194, 0.28) 0%, rgba(63, 83, 120, 0.24) 100%)';
                item.style.borderColor = 'rgba(124, 189, 255, 0.45)';
                item.style.transform = 'translateY(-2px)';
                item.style.boxShadow = '0 16px 32px rgba(7, 12, 24, 0.38)';
                actionButtons.style.opacity = '1';
            });
            item.addEventListener('mouseleave', () => {
                item.style.background = defaultBackground;
                item.style.borderColor = defaultBorder;
                item.style.transform = 'none';
                item.style.boxShadow = defaultShadow;
                actionButtons.style.opacity = '0';
            });


            item.appendChild(content);
            item.appendChild(infoBar);

            return item;
        }

        // 滚动到指定高亮
        function scrollToHighlight(highlightId) {
            // 先尝试查找主ID的元素
            let highlightElement = document.querySelector(`.${STYLE_PREFIX}highlight-marked[data-highlight-id="${highlightId}"]`);

            // 如果没找到主ID元素，检查是否为多片段高亮
            if (!highlightElement) {
                const mainHighlight = highlights.find(h => h.id === highlightId);
                if (mainHighlight && mainHighlight.isMultiFragment) {
                    // 查找第一个片段的元素
                    const firstFragment = highlights.find(h => h.parentId === highlightId);
                    if (firstFragment) {
                        highlightElement = document.querySelector(`.${STYLE_PREFIX}highlight-marked[data-highlight-id="${firstFragment.id}"]`);
                    }
                }
            }

            if (highlightElement) {
                // 平滑滚动到元素
                highlightElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // 获取所有相关的高亮元素（包括多片段）
                const mainHighlight = highlights.find(h => h.id === highlightId);
                let allElements = [highlightElement];

                // 如果是多片段高亮，获取所有片段元素
                if (mainHighlight && mainHighlight.isMultiFragment) {
                    const fragments = highlights.filter(h => h.parentId === highlightId);
                    fragments.forEach(fragment => {
                        const fragmentElement = document.querySelector(`.${STYLE_PREFIX}highlight-marked[data-highlight-id="${fragment.id}"]`);
                        if (fragmentElement && !allElements.includes(fragmentElement)) {
                            allElements.push(fragmentElement);
                        }
                    });
                }

                // 为所有相关元素添加闪烁效果
                allElements.forEach(element => {
                    element.classList.add(`${STYLE_PREFIX}highlight-flash`);
                    const originalTransition = element.style.transition;
                    element.style.transition = 'all 0.3s ease';

                    setTimeout(() => {
                        element.classList.remove(`${STYLE_PREFIX}highlight-flash`);
                        element.style.transition = originalTransition;
                    }, 2500);
                });
            }
        }

        // 初始渲染高亮列表
        renderCurrentPageHighlights();
        renderDomainHighlights();

        // 渲染启用管理面板内容
        function renderEnabledPanel() {
            const container = sidebar.querySelector(`.${STYLE_PREFIX}disabled-container`);
            if (!container) return;

            // 清空容器
            container.innerHTML = '';

            const theme = {
                cardBackground: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                cardBorder: '1px solid rgba(255, 255, 255, 0.08)'
            };

            Object.assign(container.style, {
                color: '#E8E9EB',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                padding: '18px',
                flex: '1',
                overflowY: 'auto',
                boxSizing: 'border-box'
            });

            // 添加当前页面管理区域
            const currentPageSection = document.createElement('div');
            currentPageSection.className = `${STYLE_PREFIX}disabled-section`;
            Object.assign(currentPageSection.style, {
                margin: '0',
                padding: '16px',
                background: theme.cardBackground,
                borderRadius: '10px',
                border: theme.cardBorder,
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.22)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            });

            const currentPageTitle = document.createElement('div');
            currentPageTitle.className = `${STYLE_PREFIX}disabled-title`;
            currentPageTitle.innerHTML = `<span>当前页面</span>`;
            Object.assign(currentPageTitle.style, {
                fontSize: '13px',
                fontWeight: '600',
                color: '#E8E9EB',
                marginBottom: '0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            });

            // 当前页面状态
            const currentStatus = document.createElement('div');
            currentStatus.className = `${STYLE_PREFIX}current-status`;
            currentStatus.innerHTML = renderCurrentPageStatus();

            currentPageSection.appendChild(currentPageTitle);
            currentPageSection.appendChild(currentStatus);
            container.appendChild(currentPageSection);

            // 启用域名列表区域
            const domainsSection = document.createElement('div');
            domainsSection.className = `${STYLE_PREFIX}disabled-section`;
            Object.assign(domainsSection.style, {
                margin: '0',
                padding: '16px',
                background: theme.cardBackground,
                borderRadius: '10px',
                border: theme.cardBorder,
                boxShadow: '0 10px 28px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            });

            const domainsTitle = document.createElement('div');
            domainsTitle.className = `${STYLE_PREFIX}disabled-title`;
            domainsTitle.innerHTML = `<span>启用域名列表</span>`;
            Object.assign(domainsTitle.style, {
                fontSize: '13px',
                fontWeight: '600',
                color: '#E8E9EB',
                marginBottom: '0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            });

            const domainsList = document.createElement('div');
            domainsList.className = `${STYLE_PREFIX}domains-list`;
            domainsList.innerHTML = renderEnabledDomains();
            Object.assign(domainsList.style, {
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            });

            // 添加域名表单
            const addDomainForm = document.createElement('div');
            addDomainForm.className = `${STYLE_PREFIX}add-disabled-form`;
            Object.assign(addDomainForm.style, {
                display: 'flex',
                marginTop: '0',
                gap: '0',
                borderRadius: '10px',
                overflow: 'hidden',
                border: theme.cardBorder,
                background: 'rgba(12, 14, 18, 0.8)',
                boxShadow: '0 10px 28px rgba(0, 0, 0, 0.18)'
            });

            const domainInput = document.createElement('input');
            domainInput.className = `${STYLE_PREFIX}add-disabled-input`;
            domainInput.id = 'add-domain-input';
            domainInput.placeholder = '输入域名...';
            Object.assign(domainInput.style, {
                flex: '1',
                background: 'transparent',
                border: 'none',
                borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '12px 14px',
                fontSize: '13px',
                color: '#E8E9EB',
                outline: 'none',
                transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
            });

            const addDomainBtn = document.createElement('button');
            addDomainBtn.className = `${STYLE_PREFIX}add-disabled-button`;
            addDomainBtn.id = 'add-domain-btn';
            addDomainBtn.textContent = '添加';
            Object.assign(addDomainBtn.style, {
                background: 'linear-gradient(135deg, rgba(78, 168, 222, 0.2) 0%, rgba(78, 168, 222, 0.12) 100%)',
                color: '#E4F3FF',
                border: 'none',
                borderRadius: '0',
                padding: '12px 18px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease'
            });

            addDomainForm.appendChild(domainInput);
            addDomainForm.appendChild(addDomainBtn);

            domainsSection.appendChild(domainsTitle);
            domainsSection.appendChild(domainsList);
            domainsSection.appendChild(addDomainForm);
            container.appendChild(domainsSection);

            // 启用URL列表区域
            const urlsSection = document.createElement('div');
            urlsSection.className = `${STYLE_PREFIX}disabled-section`;
            Object.assign(urlsSection.style, {
                margin: '0',
                padding: '16px',
                background: theme.cardBackground,
                borderRadius: '10px',
                border: theme.cardBorder,
                boxShadow: '0 10px 28px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            });

            const urlsTitle = document.createElement('div');
            urlsTitle.className = `${STYLE_PREFIX}disabled-title`;
            urlsTitle.innerHTML = `<span>启用网址列表</span>`;
            Object.assign(urlsTitle.style, {
                fontSize: '13px',
                fontWeight: '600',
                color: '#E8E9EB',
                marginBottom: '0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            });

            const urlsList = document.createElement('div');
            urlsList.className = `${STYLE_PREFIX}urls-list`;
            urlsList.innerHTML = renderEnabledUrls();
            Object.assign(urlsList.style, {
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            });

            // 添加URL表单
            const addUrlForm = document.createElement('div');
            addUrlForm.className = `${STYLE_PREFIX}add-disabled-form`;
            Object.assign(addUrlForm.style, {
                display: 'flex',
                marginTop: '0',
                gap: '0',
                borderRadius: '10px',
                overflow: 'hidden',
                border: theme.cardBorder,
                background: 'rgba(12, 14, 18, 0.8)',
                boxShadow: '0 10px 28px rgba(0, 0, 0, 0.18)'
            });

            const urlInput = document.createElement('input');
            urlInput.className = `${STYLE_PREFIX}add-disabled-input`;
            urlInput.id = 'add-url-input';
            urlInput.placeholder = '输入网址...';
            Object.assign(urlInput.style, {
                flex: '1',
                background: 'transparent',
                border: 'none',
                borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '12px 14px',
                fontSize: '13px',
                color: '#E8E9EB',
                outline: 'none',
                transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
            });

            const addUrlBtn = document.createElement('button');
            addUrlBtn.className = `${STYLE_PREFIX}add-disabled-button`;
            addUrlBtn.id = 'add-url-btn';
            addUrlBtn.textContent = '添加';
            Object.assign(addUrlBtn.style, {
                background: 'linear-gradient(135deg, rgba(78, 168, 222, 0.2) 0%, rgba(78, 168, 222, 0.12) 100%)',
                color: '#E4F3FF',
                border: 'none',
                borderRadius: '0',
                padding: '12px 18px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease'
            });

            addUrlForm.appendChild(urlInput);
            addUrlForm.appendChild(addUrlBtn);

            urlsSection.appendChild(urlsTitle);
            urlsSection.appendChild(urlsList);
            urlsSection.appendChild(addUrlForm);
            container.appendChild(urlsSection);

            // 绑定事件
            bindDisabledPanelEvents();
        }

        // 渲染当前页面状态
        function renderCurrentPageStatus() {
            const isDomainEnabled = enabledList.domains.includes(activationDomain);
            const isUrlEnabled = enabledList.urls.includes(activationPageUrl);

            if (isDomainEnabled || isUrlEnabled) {
                return `
                    <div class="${STYLE_PREFIX}disabled-item">
                        <div class="${STYLE_PREFIX}disabled-info">
                            <span>${isDomainEnabled ? `此域名 (${activationDomain}) 已启用高亮` : '此网址已启用高亮'}</span>
                        </div>
                        <span class="${STYLE_PREFIX}disabled-action" data-type="${isDomainEnabled ? 'domain' : 'url'}" data-value="${isDomainEnabled ? activationDomain : activationPageUrl}">
                            禁用
                        </span>
                    </div>
                `;
            } else {
                return `
                    <div class="${STYLE_PREFIX}current-page-actions">
                        <button class="${STYLE_PREFIX}disable-btn" id="enable-domain-btn">
                            启用此域名
                        </button>
                        <button class="${STYLE_PREFIX}disable-btn" id="enable-url-btn">
                            启用此网址
                        </button>
                    </div>
                `;
            }
        }

        // 渲染启用域名列表
        function renderEnabledDomains() {
            if (enabledList.domains.length === 0) {
                return `<div class="${STYLE_PREFIX}empty-list">没有启用的域名</div>`;
            }

            return enabledList.domains.map(domain => `
                <div class="${STYLE_PREFIX}disabled-item">
                    <div class="${STYLE_PREFIX}disabled-info">
                        <span>${domain}</span>
                    </div>
                    <span class="${STYLE_PREFIX}disabled-action" data-type="domain" data-value="${domain}">
                        删除
                    </span>
                </div>
            `).join('');
        }

        // 渲染启用URL列表
        function renderEnabledUrls() {
            if (enabledList.urls.length === 0) {
                return `<div class="${STYLE_PREFIX}empty-list">没有启用的网址</div>`;
            }

            return enabledList.urls.map(url => {
                // 为了美观，截断过长的URL
                const displayUrl = url.length > 40 ? url.substring(0, 37) + '...' : url;

                return `
                    <div class="${STYLE_PREFIX}disabled-item" title="${url}">
                        <div class="${STYLE_PREFIX}disabled-info">
                            <span>${displayUrl}</span>
                        </div>
                        <span class="${STYLE_PREFIX}disabled-action" data-type="url" data-value="${url}">
                            删除
                        </span>
                    </div>
                `;
            }).join('');
        }

        // 绑定启用管理面板事件
        function bindDisabledPanelEvents() {
            // 启用当前域名按钮
            const enableDomainBtn = document.getElementById('enable-domain-btn');
            if (enableDomainBtn) {
                enableDomainBtn.addEventListener('click', () => {
                    if (confirm('确定要启用域名 "' + activationDomain + '" 的高亮功能吗？')) {
                        enableDomain(activationDomain);
                        renderEnabledPanel();
                    }
                });
            }

            // 启用当前网址按钮
            const enableUrlBtn = document.getElementById('enable-url-btn');
            if (enableUrlBtn) {
                enableUrlBtn.addEventListener('click', () => {
                    if (confirm('确定要启用当前网址的高亮功能吗？')) {
                        enableUrl(activationPageUrl);
                        renderEnabledPanel();
                    }
                });
            }

            // 添加样式
            const existingDisabledStyle = document.getElementById(`${STYLE_PREFIX}disabled-style`);
            if (existingDisabledStyle) {
                existingDisabledStyle.remove();
            }
            const styleSheet = document.createElement('style');
            styleSheet.id = `${STYLE_PREFIX}disabled-style`;
            styleSheet.textContent = `
                #${STYLE_PREFIX}sidebar,
                #${STYLE_PREFIX}sidebar *,
                .${STYLE_PREFIX}disabled-section,
                .${STYLE_PREFIX}disabled-title,
                .${STYLE_PREFIX}disabled-title span,
                .${STYLE_PREFIX}disabled-item,
                .${STYLE_PREFIX}disabled-info,
                .${STYLE_PREFIX}disabled-info span,
                .${STYLE_PREFIX}empty-list,
                .${STYLE_PREFIX}sidebar-tab,
                .${STYLE_PREFIX}highlight-item {
                    color: #E8E9EB !important;
                }
                .${STYLE_PREFIX}disabled-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 14px;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
                    border-radius: 10px;
                    margin-bottom: 6px;
                    transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(6px);
                }

                .${STYLE_PREFIX}disabled-item:hover {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
                    border-color: rgba(255, 255, 255, 0.16);
                    box-shadow: 0 14px 32px rgba(0, 0, 0, 0.24);
                    transform: translateY(-1px);
                }

                .${STYLE_PREFIX}disabled-info {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    color: #E8E9EB;
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .${STYLE_PREFIX}disabled-action {
                    color: #4EA8DE !important;
                    font-size: 12px;
                    cursor: pointer;
                    padding: 4px 12px;
                    border-radius: 999px;
                    transition: all 0.2s ease;
                    background: rgba(78, 168, 222, 0.12);
                    border: 1px solid transparent;
                    opacity: 0.92;
                }

                .${STYLE_PREFIX}disabled-action:hover {
                    background: linear-gradient(135deg, rgba(78, 168, 222, 0.24) 0%, rgba(78, 168, 222, 0.16) 100%);
                    border-color: rgba(78, 168, 222, 0.35);
                    color: #BFE6FF !important;
                    opacity: 1;
                }

                .${STYLE_PREFIX}empty-list {
                    padding: 14px;
                    color: #A1A7B3 !important;
                    font-style: italic;
                    font-size: 13px;
                    text-align: center;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.015) 100%);
                    border-radius: 10px;
                    border: 1px dashed rgba(255, 255, 255, 0.08);
                }

                .${STYLE_PREFIX}current-page-actions {
                    display: flex;
                    gap: 12px;
                    width: 100%;
                }

                .${STYLE_PREFIX}disable-btn {
                    flex: 1;
                    background: linear-gradient(135deg, rgba(78, 168, 222, 0.2) 0%, rgba(78, 168, 222, 0.12) 100%);
                    border: 1px solid rgba(78, 168, 222, 0.32);
                    border-radius: 10px;
                    padding: 12px 16px;
                    color: #4EA8DE;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease;
                    backdrop-filter: blur(4px);
                }

                .${STYLE_PREFIX}disable-btn:hover {
                    background: linear-gradient(135deg, rgba(78, 168, 222, 0.26) 0%, rgba(78, 168, 222, 0.16) 100%);
                    border-color: rgba(78, 168, 222, 0.42);
                    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.22);
                    color: #BFE6FF;
                    transform: translateY(-1px);
                }

                .${STYLE_PREFIX}add-disabled-input {
                    background: transparent;
                    color: #E8E9EB;
                }

                .${STYLE_PREFIX}add-disabled-input::placeholder {
                    color: rgba(232, 233, 235, 0.4);
                }

                .${STYLE_PREFIX}add-disabled-input:focus {
                    background: rgba(78, 168, 222, 0.08);
                    box-shadow: inset 0 0 0 1px rgba(78, 168, 222, 0.35);
                }

                .${STYLE_PREFIX}add-disabled-button {
                    background: linear-gradient(135deg, rgba(78, 168, 222, 0.2) 0%, rgba(78, 168, 222, 0.12) 100%);
                    color: #E4F3FF;
                    border-left: 1px solid rgba(255, 255, 255, 0.04);
                }

                .${STYLE_PREFIX}add-disabled-button:hover {
                    background: linear-gradient(135deg, rgba(78, 168, 222, 0.28) 0%, rgba(78, 168, 222, 0.18) 100%);
                    color: #ffffff;
                    transform: translateY(-1px);
                    box-shadow: 0 10px 24px rgba(78, 168, 222, 0.24);
                }

                .${STYLE_PREFIX}disabled-container,
                .${STYLE_PREFIX}disabled-section,
                .${STYLE_PREFIX}domains-list,
                .${STYLE_PREFIX}urls-list,
                .${STYLE_PREFIX}webdav-container {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }

                .${STYLE_PREFIX}disabled-container::-webkit-scrollbar,
                .${STYLE_PREFIX}disabled-section::-webkit-scrollbar,
                .${STYLE_PREFIX}domains-list::-webkit-scrollbar,
                .${STYLE_PREFIX}urls-list::-webkit-scrollbar,
                .${STYLE_PREFIX}webdav-container::-webkit-scrollbar {
                    width: 0;
                    height: 0;
                }
            `;
            document.head.appendChild(styleSheet);

            // 删除按钮事件
            document.querySelectorAll(`.${STYLE_PREFIX}disabled-action`).forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const type = e.target.dataset.type;
                    const value = e.target.dataset.value;

                    if (e.target.textContent.trim() === '删除') {
                        if (type === 'domain') {
                            enabledList.domains = enabledList.domains.filter(d => d !== value);
                        } else if (type === 'url') {
                            enabledList.urls = enabledList.urls.filter(u => u !== value);
                        }
                        saveEnabledList();
                        renderEnabledPanel();
                    } else if (e.target.textContent.trim() === '启用') {
                        if (type === 'domain') {
                            enableDomain(value);
                        } else if (type === 'url') {
                            enableUrl(value);
                        }
                        renderEnabledPanel();
                    } else if (e.target.textContent.trim() === '禁用') {
                        // 添加对禁用按钮的处理
                        if (type === 'domain') {
                            disableDomain(value);
                        } else if (type === 'url') {
                            disableUrl(value);
                        }
                        saveEnabledList();
                        renderEnabledPanel();
                    }
                });
            });

            // 添加域名按钮
            const addDomainBtn = document.getElementById('add-domain-btn');
            if (addDomainBtn) {
                Object.assign(addDomainBtn.style, {
                    background: 'linear-gradient(135deg, rgba(78, 168, 222, 0.2) 0%, rgba(78, 168, 222, 0.12) 100%)',
                    color: '#E4F3FF',
                    border: 'none',
                    borderRadius: '0',
                    padding: '12px 18px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease'
                });
                addDomainBtn.addEventListener('click', () => {
                    const input = document.getElementById('add-domain-input');
                    const domain = input.value.trim();

                    if (domain) {
                        if (!enabledList.domains.includes(domain)) {
                            enabledList.domains.push(domain);
                            saveEnabledList();
                            input.value = '';
                            renderEnabledPanel();
                        } else {
                            alert('该域名已在启用列表中');
                        }
                    }
                });
            }

            // 添加URL按钮
            const addUrlBtn = document.getElementById('add-url-btn');
            if (addUrlBtn) {
                Object.assign(addUrlBtn.style, {
                    background: 'linear-gradient(135deg, rgba(78, 168, 222, 0.2) 0%, rgba(78, 168, 222, 0.12) 100%)',
                    color: '#E4F3FF',
                    border: 'none',
                    borderRadius: '0',
                    padding: '12px 18px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease'
                });
                addUrlBtn.addEventListener('click', () => {
                    const input = document.getElementById('add-url-input');
                    const url = input.value.trim();

                    if (url) {
                        if (!enabledList.urls.includes(url)) {
                            enabledList.urls.push(url);
                            saveEnabledList();
                            input.value = '';
                            renderEnabledPanel();
                        } else {
                            alert('该网址已在启用列表中');
                        }
                    }
                });
            }

            // 输入框回车事件
            const domainInput = document.getElementById('add-domain-input');
            if (domainInput) {
                domainInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        document.getElementById('add-domain-btn').click();
                    }
                });
            }

            const urlInput = document.getElementById('add-url-input');
            if (urlInput) {
                urlInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        document.getElementById('add-url-btn').click();
                    }
                });
            }
        }

        // 初始渲染启用管理面板
        renderEnabledPanel();

        // 渲染WebDAV面板内容
        function renderWebdavPanel() {
            const container = sidebar.querySelector(`.${STYLE_PREFIX}webdav-container`);
            if (!container) return;

            // 清空容器
            container.innerHTML = '';

            const theme = {
                cardBackground: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                cardBorder: '1px solid rgba(255, 255, 255, 0.08)'
            };

            Object.assign(container.style, {
                color: '#E8E9EB',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                padding: '18px',
                flex: '1',
                overflowY: 'auto',
                boxSizing: 'border-box'
            });

            // 加载WebDAV配置
            const webdavConfig = GM_getValue('webdavConfig', {
                server: '',
                username: '',
                password: '',
                remoteFolder: '/web-highlighter-backups',
                lastSync: 0
            });

            // 兼容性处理:如果存在旧的remotePath配置,自动转换为remoteFolder
            if (webdavConfig.remotePath && !webdavConfig.remoteFolder) {
                // 提取文件路径的父目录作为文件夹
                const lastSlashIndex = webdavConfig.remotePath.lastIndexOf('/');
                if (lastSlashIndex > 0) {
                    webdavConfig.remoteFolder = webdavConfig.remotePath.substring(0, lastSlashIndex);
                } else {
                    webdavConfig.remoteFolder = '/web-highlighter-backups';
                }
                // 保存转换后的配置
                GM_setValue('webdavConfig', webdavConfig);
                console.log('已自动迁移WebDAV配置:', webdavConfig.remotePath, '->', webdavConfig.remoteFolder);
            }

            // WebDAV配置区域
            const configSection = document.createElement('div');
            configSection.className = `${STYLE_PREFIX}webdav-section`;
            Object.assign(configSection.style, {
                margin: '0',
                padding: '16px',
                background: theme.cardBackground,
                borderRadius: '10px',
                border: theme.cardBorder,
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.22)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
            });

            const configTitle = document.createElement('div');
            configTitle.textContent = 'WebDAV配置';
            Object.assign(configTitle.style, {
                fontSize: '13px',
                fontWeight: '600',
                color: '#E8E9EB',
                marginBottom: '4px'
            });

            // 服务器地址输入
            const serverGroup = createInputGroup('服务器地址', 'webdav-server', 'https://dav.example.com', webdavConfig.server, 'text');

            // 用户名输入
            const usernameGroup = createInputGroup('用户名', 'webdav-username', '输入用户名', webdavConfig.username, 'text');

            // 密码输入
            const passwordGroup = createInputGroup('密码', 'webdav-password', '输入密码', webdavConfig.password, 'password');

            // 保存文件夹输入
            const folderGroup = createInputGroup('保存文件夹', 'webdav-folder', '/web-highlighter-backups', webdavConfig.remoteFolder, 'text');

            // 配置操作按钮
            const configActions = document.createElement('div');
            Object.assign(configActions.style, {
                display: 'flex',
                gap: '10px',
                marginTop: '6px'
            });

            const saveConfigBtn = createButton('💾 保存配置', '#4EA8DE');
            const testConnBtn = createButton('🧪 测试连接', '#6B7280');

            configActions.appendChild(saveConfigBtn);
            configActions.appendChild(testConnBtn);

            configSection.appendChild(configTitle);
            configSection.appendChild(serverGroup);
            configSection.appendChild(usernameGroup);
            configSection.appendChild(passwordGroup);
            configSection.appendChild(folderGroup);
            configSection.appendChild(configActions);

            // 同步操作区域
            const syncSection = document.createElement('div');
            syncSection.className = `${STYLE_PREFIX}webdav-section`;
            Object.assign(syncSection.style, {
                margin: '0',
                padding: '16px',
                background: theme.cardBackground,
                borderRadius: '10px',
                border: theme.cardBorder,
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.22)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
            });

            const syncTitle = document.createElement('div');
            syncTitle.textContent = '同步操作';
            Object.assign(syncTitle.style, {
                fontSize: '13px',
                fontWeight: '600',
                color: '#E8E9EB',
                marginBottom: '4px'
            });

            // 状态信息
            const statusInfo = document.createElement('div');
            Object.assign(statusInfo.style, {
                fontSize: '12px',
                color: '#9CA3AF',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
            });

            const lastSyncText = webdavConfig.lastSync > 0
                ? new Date(webdavConfig.lastSync).toLocaleString('zh-CN', {
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                })
                : '从未同步';

            statusInfo.innerHTML = `
                <div>上次同步: ${lastSyncText}</div>
            `;

            // 同步操作按钮
            const syncActions = document.createElement('div');
            Object.assign(syncActions.style, {
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginTop: '6px'
            });

            const backupBtn = createButton('☁️ 备份到云端', '#4EA8DE');
            const restoreBtn = createButton('📥 从云端恢复', '#4EA8DE');

            Object.assign(backupBtn.style, {
                width: '100%'
            });
            Object.assign(restoreBtn.style, {
                width: '100%'
            });

            syncActions.appendChild(backupBtn);
            syncActions.appendChild(restoreBtn);

            syncSection.appendChild(syncTitle);
            syncSection.appendChild(statusInfo);
            syncSection.appendChild(syncActions);

            container.appendChild(configSection);
            container.appendChild(syncSection);

            // 备份文件列表区域
            const backupListSection = document.createElement('div');
            backupListSection.id = `${STYLE_PREFIX}backup-list-section`;
            backupListSection.className = `${STYLE_PREFIX}webdav-section`;
            Object.assign(backupListSection.style, {
                margin: '0',
                padding: '16px',
                background: theme.cardBackground,
                borderRadius: '10px',
                border: theme.cardBorder,
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.22)',
                display: 'none', // 初始隐藏
                flexDirection: 'column',
                gap: '14px'
            });

            const backupListTitle = document.createElement('div');
            backupListTitle.textContent = '备份文件列表';
            Object.assign(backupListTitle.style, {
                fontSize: '13px',
                fontWeight: '600',
                color: '#E8E9EB',
                marginBottom: '4px'
            });

            const backupListContainer = document.createElement('div');
            backupListContainer.id = `${STYLE_PREFIX}backup-files-container`;
            Object.assign(backupListContainer.style, {
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '300px',
                overflowY: 'auto'
            });

            backupListSection.appendChild(backupListTitle);
            backupListSection.appendChild(backupListContainer);

            container.appendChild(backupListSection);

            // 绑定事件
            bindWebdavEvents(saveConfigBtn, testConnBtn, backupBtn, restoreBtn);
        }

        // 创建输入组辅助函数
        function createInputGroup(label, id, placeholder, value, type = 'text') {
            const group = document.createElement('div');
            Object.assign(group.style, {
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
            });

            const labelElem = document.createElement('label');
            labelElem.textContent = label;
            labelElem.htmlFor = id;
            Object.assign(labelElem.style, {
                fontSize: '12px',
                color: '#9CA3AF',
                fontWeight: '500'
            });

            const input = document.createElement('input');
            input.type = type;
            input.id = id;
            input.placeholder = placeholder;
            input.value = value || '';
            input.className = `${STYLE_PREFIX}webdav-input`;
            Object.assign(input.style, {
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '10px 12px',
                fontSize: '12.5px',
                color: '#E8E9EB',
                outline: 'none',
                transition: 'all 0.2s ease',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            });

            // 聚焦效果
            input.addEventListener('focus', () => {
                input.style.background = 'rgba(78, 168, 222, 0.08)';
                input.style.boxShadow = 'inset 0 0 0 1px rgba(78, 168, 222, 0.35)';
            });
            input.addEventListener('blur', () => {
                input.style.background = 'rgba(255, 255, 255, 0.04)';
                input.style.boxShadow = 'none';
            });

            group.appendChild(labelElem);
            group.appendChild(input);

            return group;
        }

        // 创建按钮辅助函数
        function createButton(text, color) {
            const button = document.createElement('button');
            button.textContent = text;
            Object.assign(button.style, {
                flex: '1',
                background: `linear-gradient(135deg, ${color}33 0%, ${color}1F 100%)`,
                border: `1px solid ${color}52`,
                borderRadius: '8px',
                padding: '10px 14px',
                color: color,
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            });

            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-1px)';
                button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                button.style.background = `linear-gradient(135deg, ${color}42 0%, ${color}28 100%)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'none';
                button.style.boxShadow = 'none';
                button.style.background = `linear-gradient(135deg, ${color}33 0%, ${color}1F 100%)`;
            });

            return button;
        }

        // 绑定WebDAV事件
        function bindWebdavEvents(saveConfigBtn, testConnBtn, backupBtn, restoreBtn) {
            // 保存配置
            saveConfigBtn.addEventListener('click', () => {
                const config = {
                    server: document.getElementById('webdav-server').value.trim(),
                    username: document.getElementById('webdav-username').value.trim(),
                    password: document.getElementById('webdav-password').value,
                    remoteFolder: document.getElementById('webdav-folder').value.trim(),
                    lastSync: GM_getValue('webdavConfig', {}).lastSync || 0
                };

                if (!config.server) {
                    alert('请输入服务器地址');
                    return;
                }

                GM_setValue('webdavConfig', config);
                alert('配置已保存');
            });

            // 测试连接
            testConnBtn.addEventListener('click', async () => {
                const server = document.getElementById('webdav-server').value.trim();
                const username = document.getElementById('webdav-username').value.trim();
                const password = document.getElementById('webdav-password').value;
                const remoteFolder = document.getElementById('webdav-folder').value.trim();

                if (!server || !username || !password) {
                    alert('请填写完整的服务器信息');
                    return;
                }

                testConnBtn.textContent = '🔄 测试中...';
                testConnBtn.disabled = true;

                try {
                    await testWebdavConnection(server, username, password, remoteFolder);
                    alert('连接成功！');
                } catch (error) {
                    alert('连接失败: ' + error.message);
                } finally {
                    testConnBtn.textContent = '🧪 测试连接';
                    testConnBtn.disabled = false;
                }
            });

            // 备份到云端
            backupBtn.addEventListener('click', async () => {
                const config = GM_getValue('webdavConfig', {});
                if (!config.server || !config.username || !config.password) {
                    alert('请先配置并保存WebDAV连接信息');
                    return;
                }

                if (!confirm('确定要备份当前所有高亮数据到云端吗？')) {
                    return;
                }

                backupBtn.textContent = '☁️ 备份中...';
                backupBtn.disabled = true;

                try {
                    await backupToWebdav(config);
                    config.lastSync = Date.now();
                    GM_setValue('webdavConfig', config);
                    alert('备份成功！');
                    renderWebdavPanel(); // 刷新面板显示最新同步时间
                } catch (error) {
                    alert('备份失败: ' + error.message);
                } finally {
                    backupBtn.textContent = '☁️ 备份到云端';
                    backupBtn.disabled = false;
                }
            });

            // 从云端恢复 - 修改为显示文件列表
            restoreBtn.addEventListener('click', async () => {
                const config = GM_getValue('webdavConfig', {});
                if (!config.server || !config.username || !config.password) {
                    alert('请先配置并保存WebDAV连接信息');
                    return;
                }

                restoreBtn.textContent = '📥 加载中...';
                restoreBtn.disabled = true;

                try {
                    const remoteFolder = config.remoteFolder || '/web-highlighter-backups';
                    const files = await listWebdavFiles(config.server, config.username, config.password, remoteFolder);

                    if (!files || files.length === 0) {
                        alert('未找到任何备份文件');
                        return;
                    }

                    // 显示文件列表
                    renderBackupFilesList(files, config);
                } catch (error) {
                    alert('获取备份文件列表失败: ' + error.message);
                } finally {
                    restoreBtn.textContent = '📥 从云端恢复';
                    restoreBtn.disabled = false;
                }
            });
        }

        // 渲染备份文件列表
        function renderBackupFilesList(files, config) {
            const backupListSection = document.getElementById(`${STYLE_PREFIX}backup-list-section`);
            const backupFilesContainer = document.getElementById(`${STYLE_PREFIX}backup-files-container`);

            if (!backupListSection || !backupFilesContainer) {
                console.error('备份文件列表容器未找到');
                return;
            }

            // 清空容器
            backupFilesContainer.innerHTML = '';

            // 按文件名降序排序（文件名包含时间戳，降序即最新的在前）
            const sortedFiles = [...files].sort().reverse();

            // 为每个文件创建列表项
            sortedFiles.forEach(fileName => {
                const fileItem = document.createElement('div');
                Object.assign(fileItem.style, {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease'
                });

                // 悬停效果
                fileItem.addEventListener('mouseenter', () => {
                    fileItem.style.background = 'rgba(255, 255, 255, 0.08)';
                    fileItem.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                });
                fileItem.addEventListener('mouseleave', () => {
                    fileItem.style.background = 'rgba(255, 255, 255, 0.04)';
                    fileItem.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                });

                // 左侧：文件名
                const fileNameSpan = document.createElement('span');
                fileNameSpan.textContent = fileName;
                Object.assign(fileNameSpan.style, {
                    flex: '1',
                    fontSize: '12px',
                    color: '#E8E9EB',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginRight: '10px'
                });

                // 右侧：按钮容器
                const buttonsContainer = document.createElement('div');
                Object.assign(buttonsContainer.style, {
                    display: 'flex',
                    gap: '6px',
                    flexShrink: '0'
                });

                // 恢复按钮（图标）
                const restoreBtn = document.createElement('button');
                restoreBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 3v5h5M3.05 13a9 9 0 1 0 .5-4M3 8l5 5"></path>
                    </svg>
                `;
                restoreBtn.title = '恢复此备份';
                Object.assign(restoreBtn.style, {
                    background: 'linear-gradient(135deg, rgba(74, 164, 222, 0.2) 0%, rgba(74, 164, 222, 0.1) 100%)',
                    border: '1px solid rgba(74, 164, 222, 0.3)',
                    borderRadius: '6px',
                    padding: '6px 8px',
                    color: '#4EA8DE',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                });

                restoreBtn.addEventListener('mouseenter', () => {
                    restoreBtn.style.background = 'linear-gradient(135deg, rgba(74, 164, 222, 0.3) 0%, rgba(74, 164, 222, 0.15) 100%)';
                    restoreBtn.style.transform = 'translateY(-1px)';
                    restoreBtn.style.boxShadow = '0 2px 8px rgba(74, 164, 222, 0.2)';
                });
                restoreBtn.addEventListener('mouseleave', () => {
                    restoreBtn.style.background = 'linear-gradient(135deg, rgba(74, 164, 222, 0.2) 0%, rgba(74, 164, 222, 0.1) 100%)';
                    restoreBtn.style.transform = 'none';
                    restoreBtn.style.boxShadow = 'none';
                });

                // 恢复按钮点击事件
                restoreBtn.addEventListener('click', async () => {
                    if (!confirm(`确定要从备份 "${fileName}" 恢复数据吗？\n\n这将覆盖本地所有高亮数据。建议先备份当前数据。`)) {
                        return;
                    }

                    restoreBtn.disabled = true;
                    restoreBtn.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 6v6l4 2"></path>
                        </svg>
                    `;

                    try {
                        await restoreFromSpecificFile(config, fileName);
                        alert('恢复成功！页面将刷新以应用数据。');
                        location.reload();
                    } catch (error) {
                        alert('恢复失败: ' + error.message);
                        restoreBtn.innerHTML = `
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 3v5h5M3.05 13a9 9 0 1 0 .5-4M3 8l5 5"></path>
                            </svg>
                        `;
                    } finally {
                        restoreBtn.disabled = false;
                    }
                });

                // 删除按钮（图标）
                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"></path>
                    </svg>
                `;
                deleteBtn.title = '删除此备份';
                Object.assign(deleteBtn.style, {
                    background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(255, 107, 107, 0.1) 100%)',
                    border: '1px solid rgba(255, 107, 107, 0.3)',
                    borderRadius: '6px',
                    padding: '6px 8px',
                    color: '#FF6B6B',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                });

                deleteBtn.addEventListener('mouseenter', () => {
                    deleteBtn.style.background = 'linear-gradient(135deg, rgba(255, 107, 107, 0.3) 0%, rgba(255, 107, 107, 0.15) 100%)';
                    deleteBtn.style.transform = 'translateY(-1px)';
                    deleteBtn.style.boxShadow = '0 2px 8px rgba(255, 107, 107, 0.2)';
                });
                deleteBtn.addEventListener('mouseleave', () => {
                    deleteBtn.style.background = 'linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(255, 107, 107, 0.1) 100%)';
                    deleteBtn.style.transform = 'none';
                    deleteBtn.style.boxShadow = 'none';
                });

                // 删除按钮点击事件
                deleteBtn.addEventListener('click', async () => {
                    if (!confirm(`确定要删除备份文件 "${fileName}" 吗？\n\n此操作不可撤销。`)) {
                        return;
                    }

                    deleteBtn.disabled = true;
                    deleteBtn.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 6v6l4 2"></path>
                        </svg>
                    `;

                    try {
                        await deleteWebdavFile(config, fileName);
                        alert('删除成功！');
                        // 从列表中移除该文件项
                        fileItem.remove();
                        // 如果列表为空，隐藏整个区域
                        if (backupFilesContainer.children.length === 0) {
                            backupListSection.style.display = 'none';
                        }
                    } catch (error) {
                        alert('删除失败: ' + error.message);
                        deleteBtn.innerHTML = `
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"></path>
                            </svg>
                        `;
                    } finally {
                        deleteBtn.disabled = false;
                    }
                });

                buttonsContainer.appendChild(restoreBtn);
                buttonsContainer.appendChild(deleteBtn);

                fileItem.appendChild(fileNameSpan);
                fileItem.appendChild(buttonsContainer);

                backupFilesContainer.appendChild(fileItem);
            });

            // 显示备份列表区域
            backupListSection.style.display = 'flex';
        }

        // 从指定文件恢复数据
        function restoreFromSpecificFile(config, fileName) {
            return new Promise((resolve, reject) => {
                const remoteFolder = config.remoteFolder || '/web-highlighter-backups';
                const fullPath = remoteFolder.endsWith('/') ? remoteFolder + fileName : remoteFolder + '/' + fileName;
                const url = buildWebdavUrl(config.server, fullPath);
                const auth = 'Basic ' + btoa(config.username + ':' + config.password);

                console.log('从指定文件恢复:', url);

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Authorization': auth
                    },
                    timeout: 30000,
                    onload: function(response) {
                        console.log('恢复响应状态:', response.status);
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const backupData = JSON.parse(response.responseText);

                                // 验证数据格式
                                if (!backupData.data || !backupData.data.highlights) {
                                    reject(new Error('备份数据格式不正确'));
                                    return;
                                }

                                // 恢复高亮数据
                                Object.keys(backupData.data.highlights).forEach(key => {
                                    GM_setValue(key, backupData.data.highlights[key]);
                                });

                                // 恢复设置
                                if (backupData.data.settings) {
                                    Object.assign(settings, backupData.data.settings);
                                    saveSettings();
                                }

                                // 恢复启用列表
                                if (backupData.data.enabledList) {
                                    Object.assign(enabledList, backupData.data.enabledList);
                                    saveEnabledList();
                                }

                                resolve(response);
                            } catch (error) {
                                reject(new Error('解析备份数据失败: ' + error.message));
                            }
                        } else if (response.status === 404) {
                            reject(new Error('备份文件不存在'));
                        } else {
                            reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                        }
                    },
                    onerror: function(error) {
                        reject(new Error('下载失败，请检查网络连接'));
                    },
                    ontimeout: function() {
                        reject(new Error('下载超时'));
                    }
                });
            });
        }

        // 删除WebDAV文件
        function deleteWebdavFile(config, fileName) {
            return new Promise((resolve, reject) => {
                const remoteFolder = config.remoteFolder || '/web-highlighter-backups';
                const fullPath = remoteFolder.endsWith('/') ? remoteFolder + fileName : remoteFolder + '/' + fileName;
                const url = buildWebdavUrl(config.server, fullPath);
                const auth = 'Basic ' + btoa(config.username + ':' + config.password);

                console.log('删除WebDAV文件:', url);

                GM_xmlhttpRequest({
                    method: 'DELETE',
                    url: url,
                    headers: {
                        'Authorization': auth
                    },
                    timeout: 10000,
                    onload: function(response) {
                        console.log('删除响应状态:', response.status);
                        if (response.status >= 200 && response.status < 300) {
                            resolve(response);
                        } else if (response.status === 404) {
                            reject(new Error('文件不存在'));
                        } else {
                            reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                        }
                    },
                    onerror: function(error) {
                        reject(new Error('删除失败'));
                    },
                    ontimeout: function() {
                        reject(new Error('删除超时'));
                    }
                });
            });
        }

        // 构建WebDAV URL的辅助函数
        function buildWebdavUrl(server, remotePath) {
            let baseUrl = server.trim();
            // 移除末尾的斜杠
            if (baseUrl.endsWith('/')) {
                baseUrl = baseUrl.slice(0, -1);
            }
            // 如果没有协议，添加https
            if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = 'https://' + baseUrl;
            }

            // 如果有远程路径，拼接上去
            if (remotePath) {
                let path = remotePath.trim();
                // 确保路径以/开头
                if (!path.startsWith('/')) {
                    path = '/' + path;
                }
                return baseUrl + path;
            }

            return baseUrl;
        }

        // 测试WebDAV连接
        function testWebdavConnection(server, username, password, remotePath) {
            return new Promise((resolve, reject) => {
                const url = buildWebdavUrl(server, '');
                const auth = 'Basic ' + btoa(username + ':' + password);

                console.log('测试WebDAV连接:', url);

                GM_xmlhttpRequest({
                    method: 'PROPFIND',
                    url: url,
                    headers: {
                        'Authorization': auth,
                        'Depth': '0'
                    },
                    timeout: 10000,
                    onload: function(response) {
                        console.log('WebDAV响应状态:', response.status, response.statusText);
                        if (response.status >= 200 && response.status < 300) {
                            resolve(response);
                        } else if (response.status === 401) {
                            reject(new Error('认证失败，请检查用户名和密码'));
                        } else if (response.status === 404) {
                            reject(new Error(`路径不存在: ${url}\n请检查服务器地址是否正确`));
                        } else {
                            reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                        }
                    },
                    onerror: function(error) {
                        reject(new Error(`网络错误，请检查服务器地址: ${url}`));
                    },
                    ontimeout: function() {
                        reject(new Error('连接超时，请检查网络或服务器地址'));
                    }
                });
            });
        }

        // 创建WebDAV目录
        function createWebdavDirectory(server, username, password, dirPath) {
            return new Promise((resolve, reject) => {
                const url = buildWebdavUrl(server, dirPath);
                const auth = 'Basic ' + btoa(username + ':' + password);

                console.log('创建WebDAV目录:', url);

                GM_xmlhttpRequest({
                    method: 'MKCOL',
                    url: url,
                    headers: {
                        'Authorization': auth
                    },
                    timeout: 10000,
                    onload: function(response) {
                        console.log('创建目录响应状态:', response.status);
                        // 201: 创建成功, 405: 目录已存在
                        if (response.status === 201 || response.status === 405) {
                            resolve(response);
                        } else {
                            reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                        }
                    },
                    onerror: function(error) {
                        reject(new Error('创建目录失败'));
                    },
                    ontimeout: function() {
                        reject(new Error('创建目录超时'));
                    }
                });
            });
        }

        // 备份到WebDAV
        function backupToWebdav(config) {
            return new Promise(async (resolve, reject) => {
                try {
                    // 生成带时间戳的文件名
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').split('.')[0];
                    const fileName = `backup_${timestamp}.json`;
                    const remoteFolder = config.remoteFolder || '/web-highlighter-backups';
                    const fullPath = remoteFolder.endsWith('/') ? remoteFolder + fileName : remoteFolder + '/' + fileName;

                    // 先尝试创建文件夹
                    console.log('检查并创建文件夹:', remoteFolder);
                    try {
                        await createWebdavDirectory(config.server, config.username, config.password, remoteFolder);
                    } catch (error) {
                        console.log('文件夹创建失败或已存在:', error.message);
                        // 继续执行,可能文件夹已经存在
                    }

                    // 收集所有数据
                    const allHighlightsData = {};
                    const allKeys = GM_listValues();

                    allKeys.forEach(key => {
                        if (key.startsWith('highlights_')) {
                            allHighlightsData[key] = GM_getValue(key, []);
                        }
                    });

                    const backupData = {
                        version: '1.0.0',
                        timestamp: Date.now(),
                        data: {
                            highlights: allHighlightsData,
                            settings: settings,
                            enabledList: enabledList
                        }
                    };

                    const jsonData = JSON.stringify(backupData, null, 2);
                    const url = buildWebdavUrl(config.server, fullPath);
                    const auth = 'Basic ' + btoa(config.username + ':' + config.password);

                    console.log('备份到WebDAV:', url);

                    GM_xmlhttpRequest({
                        method: 'PUT',
                        url: url,
                        headers: {
                            'Authorization': auth,
                            'Content-Type': 'application/json'
                        },
                        data: jsonData,
                        timeout: 30000,
                        onload: function(response) {
                            console.log('备份响应状态:', response.status);
                            if (response.status >= 200 && response.status < 300) {
                                resolve(response);
                            } else {
                                reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                            }
                        },
                        onerror: function(error) {
                            reject(new Error('上传失败，请检查网络连接'));
                        },
                        ontimeout: function() {
                            reject(new Error('上传超时'));
                        }
                    });
                } catch (error) {
                    reject(error);
                }
            });
        }

        // 列出WebDAV文件夹中的文件
        function listWebdavFiles(server, username, password, folderPath) {
            return new Promise((resolve, reject) => {
                const url = buildWebdavUrl(server, folderPath);
                const auth = 'Basic ' + btoa(username + ':' + password);

                console.log('列出WebDAV文件夹:', url);

                GM_xmlhttpRequest({
                    method: 'PROPFIND',
                    url: url,
                    headers: {
                        'Authorization': auth,
                        'Depth': '1',
                        'Content-Type': 'application/xml'
                    },
                    timeout: 10000,
                    onload: function(response) {
                        console.log('列出文件响应状态:', response.status);
                        if (response.status >= 200 && response.status < 300) {
                            // 解析XML响应
                            const parser = new DOMParser();
                            const xmlDoc = parser.parseFromString(response.responseText, 'text/xml');
                            const files = [];

                            // 获取所有response节点
                            const responses = xmlDoc.getElementsByTagNameNS('DAV:', 'response');

                            for (let i = 0; i < responses.length; i++) {
                                const href = responses[i].getElementsByTagNameNS('DAV:', 'href')[0];
                                if (href && href.textContent) {
                                    const fileName = decodeURIComponent(href.textContent.split('/').pop());
                                    // 只获取.json文件,排除文件夹本身
                                    if (fileName && fileName.endsWith('.json')) {
                                        files.push(fileName);
                                    }
                                }
                            }

                            resolve(files);
                        } else if (response.status === 404) {
                            reject(new Error('文件夹不存在'));
                        } else {
                            reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                        }
                    },
                    onerror: function(error) {
                        reject(new Error('列出文件失败'));
                    },
                    ontimeout: function() {
                        reject(new Error('列出文件超时'));
                    }
                });
            });
        }

        // 从WebDAV恢复
        function restoreFromWebdav(config) {
            return new Promise(async (resolve, reject) => {
                try {
                    const remoteFolder = config.remoteFolder || '/web-highlighter-backups';

                    // 列出文件夹中的所有备份文件
                    console.log('列出备份文件...');
                    let files;
                    try {
                        files = await listWebdavFiles(config.server, config.username, config.password, remoteFolder);
                    } catch (error) {
                        reject(new Error('无法列出备份文件: ' + error.message));
                        return;
                    }

                    if (!files || files.length === 0) {
                        reject(new Error('未找到任何备份文件'));
                        return;
                    }

                    // 按文件名排序,找到最新的备份文件(文件名包含时间戳)
                    files.sort().reverse();
                    const latestFile = files[0];

                    console.log('找到', files.length, '个备份文件,将恢复最新的:', latestFile);

                    // 构建完整的文件路径
                    const fullPath = remoteFolder.endsWith('/') ? remoteFolder + latestFile : remoteFolder + '/' + latestFile;
                    const url = buildWebdavUrl(config.server, fullPath);
                    const auth = 'Basic ' + btoa(config.username + ':' + config.password);

                    console.log('从WebDAV恢复:', url);

                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        headers: {
                            'Authorization': auth
                        },
                        timeout: 30000,
                        onload: function(response) {
                            console.log('恢复响应状态:', response.status);
                            if (response.status >= 200 && response.status < 300) {
                                try {
                                    const backupData = JSON.parse(response.responseText);

                                    // 验证数据格式
                                    if (!backupData.data || !backupData.data.highlights) {
                                        reject(new Error('备份数据格式不正确'));
                                        return;
                                    }

                                    // 恢复高亮数据
                                    Object.keys(backupData.data.highlights).forEach(key => {
                                        GM_setValue(key, backupData.data.highlights[key]);
                                    });

                                    // 恢复设置
                                    if (backupData.data.settings) {
                                        Object.assign(settings, backupData.data.settings);
                                        saveSettings();
                                    }

                                    // 恢复启用列表
                                    if (backupData.data.enabledList) {
                                        Object.assign(enabledList, backupData.data.enabledList);
                                        saveEnabledList();
                                    }

                                    resolve(response);
                                } catch (error) {
                                    reject(new Error('解析备份数据失败: ' + error.message));
                                }
                            } else if (response.status === 404) {
                                reject(new Error('云端未找到备份文件'));
                            } else {
                                reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                            }
                        },
                        onerror: function(error) {
                            reject(new Error('下载失败，请检查网络连接'));
                        },
                        ontimeout: function() {
                            reject(new Error('下载超时'));
                        }
                    });
                } catch (error) {
                    reject(error);
                }
            });
        }

        // 初始渲染WebDAV面板
        renderWebdavPanel();
    }

    function init() {
        loadHighlights();
        registerEvents();
        if (document.readyState === 'complete') {
            setTimeout(() => {
                applyHighlights();
                observeDomChanges();
            }, 500);
        } else {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    applyHighlights();
                    observeDomChanges();
                }, 500);
            });
        }
        // 注册油猴菜单命令
        GM_registerMenuCommand('打开侧边栏', () => {
            toggleSidebar(true);
        });
        GM_registerMenuCommand('切换浮动按钮显示/隐藏', toggleFloatingButton);
        GM_registerMenuCommand('启用当前域名高亮', () => {
            if (enabledList.domains.includes(activationDomain)) {
                alert(`当前域名(${activationDomain})已启用高亮功能`);
            } else {
                if (confirm(`确定要启用当前域名(${activationDomain})的高亮功能吗?`)) {
                    enableDomain(activationDomain);
                }
            }
        });
        GM_registerMenuCommand('启用当前网址高亮', () => {
            if (enabledList.urls.includes(activationPageUrl)) {
                alert(`当前网址已启用高亮功能`);
            } else {
                if (confirm(`确定要启用当前网址的高亮功能吗?`)) {
                    enableUrl(activationPageUrl);
                }
            }
        });
    }

    init();
    createFloatingButtonAndSidebar();
})();

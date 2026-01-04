// ==UserScript==
// @name         Google搜索增强
// @namespace    http://tampermonkey.net/
// @version      6.4
// @description  采用Google原生风格在左侧显示中文语言过滤、时间过滤和文件类型过滤，优化显示条件，修复图片搜索兼容性
// @author       You
// @match        https://www.google.com/search*
// @match        https://www.google.com.hk/search*
// @match        https://www.google.cn/search*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545210/Google%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/545210/Google%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 等待页面元素加载
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback), 1);
        }
    }

    // 生成过滤后的URL
    function generateFilterUrl(langFilter = null, timeFilter = null, fileFilter = null) {
        const currentUrl = new URL(window.location.href);
        const urlParams = currentUrl.searchParams;
        let query = urlParams.get('q') || '';

        if (langFilter !== null) {
            if (langFilter === 'all') {
                urlParams.delete('lr');
            } else {
                urlParams.set('lr', langFilter);
            }
        }

        if (timeFilter !== null) {
            if (timeFilter === 'all') {
                urlParams.delete('tbs');
            } else {
                urlParams.set('tbs', timeFilter);
            }
        }

        if (fileFilter !== null) {
            query = query.replace(/\s*filetype:\w+/g, '');

            if (fileFilter !== '' && fileFilter !== 'all') {
                query = (query.trim() + ' filetype:' + fileFilter).trim();
            }

            urlParams.set('q', query);
        }

        return currentUrl.toString();
    }

    // 生成高级搜索URL
    function generateAdvancedSearchUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const currentQuery = urlParams.get('q') || '';
        const currentHost = window.location.host;

        // 构建高级搜索URL，保持当前搜索词
        const advancedUrl = `https://${currentHost}/advanced_search`;
        const advancedParams = new URLSearchParams();

        if (currentQuery) {
            advancedParams.set('q', currentQuery);
        }

        return `${advancedUrl}?${advancedParams.toString()}`;
    }

    // 获取当前过滤状态
    function getCurrentStatus() {
        const urlParams = new URLSearchParams(window.location.search);
        const currentLang = urlParams.get('lr') || 'all';
        const currentTime = urlParams.get('tbs') || 'all';
        const query = urlParams.get('q') || '';
        const fileTypeMatch = query.match(/filetype:(\w+)/);
        const currentFileType = fileTypeMatch ? fileTypeMatch[1] : '';

        let normalizedLang = currentLang;
        if (currentLang.includes('lang_zh-CN|lang_zh-TW') || currentLang.includes('lang_zh-TW|lang_zh-CN')) {
            normalizedLang = 'lang_zh-CN|lang_zh-TW';
        }

        return { currentLang: normalizedLang, currentTime, currentFileType };
    }

    // 检查是否在图片搜索页面
    function isImageSearch() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('tbm') === 'isch';
    }

    // 检查是否在AI模式
    function isAIMode() {
        const urlParams = new URLSearchParams(window.location.search);
        // udm=50 是Google AI模式的标识
        return urlParams.get('udm') === '50';
    }

    // 检查是否有足够空间显示
    function hasEnoughSpace() {
        return window.innerWidth >= 1000;
    }

    // 获取Google原生布局的定位信息
    function getGoogleLayoutInfo() {
        // 查找主要内容区域
        const centerCol = document.querySelector('#center_col');
        const rcnt = document.querySelector('#rcnt');
        const mainContent = centerCol || rcnt;
        
        let leftPosition = '0.8%';  // 默认左边距比例
        let topPosition = '18vh';    // 默认顶部比例（视口高度）
        
        // 计算左边距（基于主内容区的实际位置）
        if (mainContent) {
            const rect = mainContent.getBoundingClientRect();
            // 将菜单放在内容区左侧，使用视口宽度的百分比
            leftPosition = `${(rect.left / window.innerWidth * 100 - 12)}%`;
            // 确保不会太靠左
            if (parseFloat(leftPosition) < 0.5) {
                leftPosition = '0.8%';
            }
        }
        
        // 智能计算顶部位置 - 查找实际搜索结果的起始位置
        // 尝试多个可能包含搜索结果的选择器
        const searchResult = document.querySelector('#search .g, #rso > div, #search > div > div, .hlcw0c, [data-sokoban-container]');
        
        if (searchResult) {
            // 基于第一个搜索结果的位置
            const rect = searchResult.getBoundingClientRect();
            // 菜单顶部与搜索结果对齐（稍微向上一点点）
            topPosition = `${Math.max((rect.top - 10) / window.innerHeight * 100, 10)}vh`;
        } else {
            // 如果找不到搜索结果，尝试查找导航栏
            const hdtb = document.querySelector('#hdtb, #hdtbMenus');
            const navTabs = document.querySelector('[role="navigation"]');
            const topBar = document.querySelector('#searchform, #tsf');
            
            if (hdtb) {
                const rect = hdtb.getBoundingClientRect();
                topPosition = `${((rect.bottom + 15) / window.innerHeight * 100)}vh`;
            } else if (navTabs) {
                const rect = navTabs.getBoundingClientRect();
                topPosition = `${((rect.bottom + 20) / window.innerHeight * 100)}vh`;
            } else if (topBar) {
                const rect = topBar.getBoundingClientRect();
                topPosition = `${((rect.bottom + 30) / window.innerHeight * 100)}vh`;
            }
        }
        
        return { leftPosition, topPosition };
    }

    // 左侧空间不再需要，保持为占满
    function addSpaceForFilter() {}
    function removeSpaceForFilter() {}

    // 创建顶部下拉的过滤面板
    function createFilterPanel(panelTop = 140, panelLeft = 20) {
        const { currentLang, currentTime, currentFileType } = getCurrentStatus();

        const container = document.createElement('div');
        container.id = 'native-left-filter';
        container.style.cssText = `
            position: absolute;
            left: ${panelLeft}px;
            top: ${panelTop}px;
            width: 240px;
            max-height: 70vh;
            background: #fff;
            font-family: arial,sans-serif;
            font-size: 12px;
            color: #3c4043;
            z-index: 2000;
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
            border-radius: 8px;
            overflow-y: auto;
            overflow-x: hidden;
            display: none;
        `;

        const languageOptions = [
            { value: 'all', label: '全部结果', current: currentLang === 'all' },
            { value: 'lang_zh-CN|lang_zh-TW', label: '所有中文', current: currentLang === 'lang_zh-CN|lang_zh-TW' },
            { value: 'lang_zh-CN', label: '简体中文', current: currentLang === 'lang_zh-CN' },
            { value: 'lang_zh-TW', label: '繁体中文', current: currentLang === 'lang_zh-TW' }
        ];

        const timeOptions = [
            { value: 'all', label: '不限时间', current: currentTime === 'all' },
            { value: 'qdr:d', label: '一天内', current: currentTime.includes('qdr:d') },
            { value: 'qdr:w', label: '一周内', current: currentTime.includes('qdr:w') },
            { value: 'qdr:m', label: '一月内', current: currentTime.includes('qdr:m') && !currentTime.includes('qdr:m6') },
            { value: 'qdr:m6', label: '半年内', current: currentTime.includes('qdr:m6') },
            { value: 'qdr:y', label: '一年内', current: currentTime.includes('qdr:y') }
        ];

        function generateNativeSection(title, options, filterType) {
            const links = options.map(option => {
                const url = filterType === 'lang' ? generateFilterUrl(option.value, null, null) :
                           generateFilterUrl(null, option.value, null);

                const isActive = option.current;
                const style = isActive
                    ? 'color: #1a73e8; text-decoration: none; font-weight: 400; border-left: 3px solid #1a73e8; padding-left: 5px; background: #f8f9fa;'
                    : 'color: #5f6368; text-decoration: none; padding-left: 8px;';

                return `
                    <div style="margin-bottom: 1px;">
                        <a href="${url}" style="${style} display: block; padding-top: 4px; padding-bottom: 4px; padding-right: 8px; line-height: 18px;">
                            ${option.label}
                        </a>
                    </div>
                `;
            }).join('');

            return `
                <div style="margin-bottom: 20px;">
                    <div class="section-title">
                        ${title}
                    </div>
                    ${links}
                </div>
            `;
        }

        const clearFileUrl = generateFilterUrl(null, null, '');
        const fileTypeSection = currentFileType ? `
            <div style="margin-bottom: 20px;">
                <div class="section-title">文件类型</div>
                <div style="margin-bottom: 1px;">
                    <div style="color: #1a73e8; display: block; padding: 4px 8px; line-height: 18px; border-left: 3px solid #1a73e8; background: #f8f9fa;">
                        ${currentFileType.toUpperCase()} 文件
                    </div>
                </div>
                <div style="margin-bottom: 1px;">
                    <a href="${clearFileUrl}" style="color: #5f6368; text-decoration: none; display: block; padding: 4px 8px; line-height: 18px;">
                        所有文件类型
                    </a>
                </div>
            </div>
        ` : '';

        const advancedSearchUrl = generateAdvancedSearchUrl();

        container.innerHTML = `
            <style>
                #native-left-filter {
                    scrollbar-width: thin;
                    scrollbar-color: #dadce0 transparent;
                }

                #native-left-filter::-webkit-scrollbar {
                    width: 6px;
                }

                #native-left-filter::-webkit-scrollbar-track {
                    background: transparent;
                }

                #native-left-filter::-webkit-scrollbar-thumb {
                    background-color: #dadce0;
                    border-radius: 3px;
                }

                #native-left-filter .filter-content {
                    padding: 12px 12px 16px 12px;
                }

                #native-left-filter a:hover {
                    color: #1a73e8 !important;
                    text-decoration: underline;
                }

                #native-left-filter .file-input {
                    width: 100%;
                    border: none;
                    border-bottom: 1px solid #dadce0;
                    padding: 6px 0;
                    font-size: 13px;
                    outline: none;
                    background: transparent;
                    color: #3c4043;
                    box-sizing: border-box;
                }

                #native-left-filter .file-input:focus {
                    border-bottom: 2px solid #1a73e8;
                }

                #native-left-filter .file-input::placeholder {
                    color: #5f6368;
                }

                #native-left-filter .advanced-search-link {
                    color: #1a73e8;
                    text-decoration: none;
                    display: block;
                    padding: 4px 8px;
                    line-height: 18px;
                    font-size: 13px;
                    border-left: 3px solid transparent;
                    transition: all 0.2s ease;
                }

                #native-left-filter .advanced-search-link:hover {
                    border-left: 3px solid #1a73e8;
                    background: #f8f9fa;
                    text-decoration: underline;
                }

                #native-left-filter .section-title {
                    color: #3c4043;
                    font-size: 14px;
                    font-weight: 500;
                    margin-bottom: 8px;
                }
            </style>

            <div class="filter-content">
                ${generateNativeSection('语言', languageOptions, 'lang')}
                ${generateNativeSection('时间', timeOptions, 'time')}
                ${fileTypeSection}

                <div style="margin-bottom: 20px;">
                    <div class="section-title">
                        ${currentFileType ? '搜索其他文件' : '文件类型'}
                    </div>
                    <input type="text" class="file-input" id="file-ext-input" placeholder="按回车搜索" value="">
                    <div style="font-size: 11px; color: #5f6368; margin-top: 6px; line-height: 1.4;">
                        例如：pdf, doc
                    </div>
                </div>

                <div style="margin-bottom: 16px;">
                    <div class="section-title">更多选项</div>
                    <div style="margin-bottom: 1px;">
                        <a href="${advancedSearchUrl}" target="_blank" class="advanced-search-link">
                            🔧 高级搜索
                        </a>
                    </div>
                </div>
            </div>
        `;

        return container;
    }

    // 设置事件处理器
    function setupEventHandlers(container) {
        const fileInput = container.querySelector('#file-ext-input');

        if (fileInput) {
            fileInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const fileType = fileInput.value.trim();
                    const url = generateFilterUrl(null, null, fileType);
                    window.location.href = url;
                }
            });

            // 输入框失去焦点时也可以搜索
            fileInput.addEventListener('blur', (e) => {
                const fileType = fileInput.value.trim();
                if (fileType && fileType !== getCurrentStatus().currentFileType) {
                    setTimeout(() => {
                        const url = generateFilterUrl(null, null, fileType);
                        window.location.href = url;
                    }, 200);
                }
            });
        }
    }

    // 在导航栏中插入“过滤器”按钮，并控制下拉面板显示
    function attachFilterTab(panel) {
        const searchBar = document.querySelector('#tsf .A8SBwf, #tsf .RNNXgb');
        const searchRight = searchBar ? searchBar.querySelector('.XDyW0e') : null;

        const navContainer = document.querySelector('#hdtb-msb-vis') || document.querySelector('#hdtb-msb') || document.querySelector('#hdtbMenus');

        if (!searchBar && !navContainer) {
            setTimeout(() => attachFilterTab(panel), 300);
            return;
        }

        const tab = document.createElement('button');
        tab.id = 'native-filter-tab';
        tab.type = 'button';
        tab.ariaLabel = '过滤器';
        tab.style.cssText = `
            border: none;
            background: transparent;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 6px;
            margin-left: 4px;
            color: #5f6368;
        `;
        tab.innerHTML = `
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 6h16"></path>
                <path d="M6 12h12"></path>
                <path d="M10 18h4"></path>
            </svg>
        `;

        const insertIntoSearch = () => {
            if (!searchBar) return false;
            if (searchRight && searchRight.parentNode) {
                searchRight.parentNode.insertBefore(tab, searchRight);
                return true;
            }
            searchBar.appendChild(tab);
            return true;
        };

        const insertIntoNav = () => {
            if (!navContainer) return false;
            const items = Array.from(navContainer.querySelectorAll('.hdtb-mitem, .hdtb-imb, a'));
            const normalizeText = (node) => (node.textContent || '').replace(/\s+/g, '').toLowerCase();
            const moreItem = items.find(item => normalizeText(item).includes('更多'));
            const aiItem = items.find(item => {
                const text = normalizeText(item);
                return text.includes('ai') || text.includes('ai模式') || text.includes('aioverview');
            });

            const wrapper = document.createElement('div');
            wrapper.className = 'hdtb-mitem';
            wrapper.style.cursor = 'pointer';
            wrapper.appendChild(tab);

            if (aiItem && aiItem.parentNode) {
                aiItem.parentNode.insertBefore(wrapper, aiItem);
            } else if (moreItem && moreItem.parentNode) {
                moreItem.parentNode.insertBefore(wrapper, moreItem.nextSibling);
            } else {
                navContainer.appendChild(wrapper);
            }
            return true;
        };

        if (!insertIntoSearch()) {
            insertIntoNav();
        }

        const link = tab;

        const closePanel = () => {
            panel.style.display = 'none';
            link.classList.remove('hdtb-msel');
        };

        const openPanel = () => {
            const rect = link.getBoundingClientRect();
            panel.style.left = `${rect.left + window.scrollX}px`;
            panel.style.top = `${rect.bottom + 8 + window.scrollY}px`;
            panel.style.display = 'block';
            link.classList.add('hdtb-msel');
        };

        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (panel.style.display === 'block') {
                closePanel();
            } else {
                openPanel();
            }
        });

        document.addEventListener('click', (ev) => {
            if (!panel.contains(ev.target) && !link.contains(ev.target)) {
                closePanel();
            }
        });
    }

    // 初始化过滤器（顶部下拉）
    function initializeFilter() {
        // 移除现有元素
        const existingFilter = document.getElementById('native-left-filter');
        if (existingFilter) existingFilter.remove();
        const existingTab = document.getElementById('native-filter-tab');
        if (existingTab) existingTab.remove();

        // 检查是否在AI模式
        if (isAIMode()) {
            removeSpaceForFilter();
            return;
        }

        // 检查是否有足够空间显示
        if (!hasEnoughSpace()) {
            removeSpaceForFilter();
            return;
        }

        // 创建过滤面板
        const filterPanel = createFilterPanel();
        setupEventHandlers(filterPanel);
        document.body.appendChild(filterPanel);

        // 创建顶部导航按钮
        attachFilterTab(filterPanel);
    }

    // 应用全局宽度扩展样式
    function applyWidthExpansion() {
        if (!document.getElementById('google-width-expander')) {
            const style = document.createElement('style');
            style.id = 'google-width-expander';
            style.textContent = `
                /* 只扩展实际内容区域，不扩展空白容器 */
                #center_col {
                    max-width: none !important;
                    width: 100% !important;
                    padding-right: 0 !important;
                }
                
                /* 搜索结果容器 */
                #rso {
                    max-width: none !important;
                    width: 100% !important;
                    margin: 0 !important;
                }

                /* 主容器全宽 */
                #main, #cnt, #search {
                    max-width: none !important;
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                
                /* 搜索结果项 */
                .g, .tF2Cxc, .Gx5Zad, .MjjYud {
                    max-width: none !important;
                    width: 100% !important;
                }
                
                /* 标题和链接容器 */
                .yuRUbf, .VwiC3b, .lEBKkf {
                    max-width: none !important;
                    width: 100% !important;
                }
                
                /* 强制标题单行显示 */
                .LC20lb, h3, .DKV0Md {
                    white-space: nowrap !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                    max-width: none !important;
                    width: auto !important;
                }
                
                /* 描述文本 */
                .VwiC3b, .yXK7lf, .MUxGbd, .yDYNvb, .lyLwlc {
                    max-width: none !important;
                    width: auto !important;
                }
                
                /* 搜索结果内部结构 */
                #rso > div, #rso .g, #rso .hlcw0c {
                    max-width: none !important;
                    width: 100% !important;
                }
                
                /* 右侧信息栏 */
                #rhs {
                    margin-left: 15px !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 主函数
    function main() {
        if (!window.location.pathname.includes('/search')) {
            return;
        }

        // 先应用宽度扩展（无论是否显示菜单）
        applyWidthExpansion();

        waitForElement('#search, #center_col, #main', () => {
            setTimeout(initializeFilter, 1);
        });

        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            setTimeout(initializeFilter, 1);
        });
    }

    // 页面加载时执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

    // 监听页面导航变化
    let currentUrl = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            setTimeout(main, 1);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
// ==UserScript==
// @name         学术科研网页辅助工具
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  一款
// @author       哔哩哔哩：凇月落
// @match        https://fanyi.baidu.com/*
// @match        https://dict.cnki.net/*
// @match        https://kns.cnki.net/*
// @match        https://www.kdocs.cn/*
// @match        https://sc.panda985.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540949/%E5%AD%A6%E6%9C%AF%E7%A7%91%E7%A0%94%E7%BD%91%E9%A1%B5%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/540949/%E5%AD%A6%E6%9C%AF%E7%A7%91%E7%A0%94%E7%BD%91%E9%A1%B5%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';


//***********谷粉学术*********************************

 if (window.location.href.includes('sc.panda985.com')) {
       // 1. 第一步：在页面渲染前注入CSS立即隐藏广告
    GM_addStyle(`
        .ad, [class*="ad-"], [id*="ad-"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
        }
    `);

    // 2. 第二步：等待DOM可用后移除广告元素
    const removeAds = () => {
        const ads = document.querySelectorAll('.ad, .adsbygoogle');
        ads.forEach(ad => ad.remove());

        // 3. 第三步：持续监听动态加载的广告
        if (window.adObserver) adObserver.disconnect();

        window.adObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    // 检查直接添加的广告节点
                    if (node.nodeType === 1 && (
                        node.matches('.ad, .adsbygoogle') ||
                        node.querySelector('.ad, .adsbygoogle')
                    )) {
                        node.remove();
                        return;
                    }

                    // 检查子节点中的广告
                    if (node.querySelectorAll) {
                        node.querySelectorAll('.ad, .adsbygoogle').forEach(ad => {
                            ad.remove();
                        });
                    }
                });
            });
        });

        adObserver.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    };

    // 根据页面状态选择执行时机
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeAds);
    } else {
        removeAds();
    }


     //****************翻页***********************


    // 配置参数
    const PAGES_PER_LOAD = 20;     // 每次加载的页数
    const LOAD_THRESHOLD = 300;   // 距离底部多少像素触发加载
    const LOAD_DELAY = 1000;      // 加载延迟(毫秒)
    const RESULT_CONTAINER = '#gs_res_ccl'; // 结果容器选择器
    const RESULT_ITEM = '.gs_r';  // 结果项选择器
    const NEXT_BUTTON = '.gs_ico_nav_next'; // 下一页按钮选择器

    // 状态变量
    let totalLoadedPages = GM_getValue('totalLoadedPages', 0);
    let currentCyclePages = GM_getValue('currentCyclePages', 0);
    let isLoading = false;
     currentCyclePages = 0
     totalLoadedPages = 0

    // 添加自定义样式
    GM_addStyle(`
        .auto-loading-indicator {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 10px 15px;
            border-radius: 20px;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            font-size: 14px;
            transition: all 0.3s ease;
        }
        .auto-loading-indicator.paused {
            background: #FF9800;
        }
        .auto-loading-indicator.completed {
            background: #f44336;
        }
        .loading-indicator {
            text-align: center;
            padding: 15px 0;
            color: #666;
            display: none;
        }
        .loading-indicator.active {
            display: block;
        }
        .loading-spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #4285f4;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
            display: inline-block;
            margin-right: 10px;
            vertical-align: middle;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .load-more-container {
            text-align: center;
            padding: 20px 0;
            margin: 20px 0;
        }
        .load-more-btn {
            display: inline-block;
            padding: 12px 30px;
            background: #4285f4;
            color: white;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 3px 10px rgba(66, 133, 244, 0.3);
            transition: all 0.3s ease;
        }
        .load-more-btn:hover {
            background: #3367d6;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(66, 133, 244, 0.4);
        }
        .load-more-btn:active {
            transform: translateY(0);
        }
        .load-more-btn.pulse {
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(66, 133, 244, 0); }
            100% { box-shadow: 0 0 0 0 rgba(66, 133, 244, 0); }
        }
    `);

    // 创建状态指示器
    const createStatusBanner = () => {
        const banner = document.createElement('div');
        banner.className = 'auto-loading-indicator';
        updateStatusBanner(banner);
        document.body.appendChild(banner);
        return banner;
    };

    // 更新状态指示器
    const updateStatusBanner = (banner) => {
        if (currentCyclePages >= PAGES_PER_LOAD) {
            banner.className = 'auto-loading-indicator paused';
            banner.innerHTML = `⏸️ 已加载 ${totalLoadedPages} 页`;
        } else if (isLoading) {
            banner.className = 'auto-loading-indicator';
            banner.innerHTML = `⏳ 正在加载第 ${totalLoadedPages + 1} 页...`;
        } else {
            banner.className = 'auto-loading-indicator';
            banner.innerHTML = `📚 已加载 ${totalLoadedPages} 页`;
        }
    };

    // 创建加载指示器
    const createLoadingIndicator = () => {
        const indicator = document.createElement('div');
        indicator.className = 'loading-indicator';
        indicator.innerHTML = `
            <div class="loading-spinner"></div>
            正在加载更多结果...
        `;
        document.querySelector(RESULT_CONTAINER).appendChild(indicator);
        return indicator;
    };

    // 创建"加载更多"按钮
    const createLoadMoreButton = () => {
        // 移除可能存在的旧按钮
        const existingBtn = document.querySelector('.load-more-container');
        if (existingBtn) existingBtn.remove();

        const container = document.createElement('div');
        container.className = 'load-more-container';

        const button = document.createElement('button');
        button.className = 'load-more-btn pulse';
        button.innerHTML = `加载更多 ${PAGES_PER_LOAD} 页结果`;

        container.appendChild(button);
        document.querySelector(RESULT_CONTAINER).appendChild(container);

        return button;
    };

    // 获取下一页URL
    const getNextPageUrl = () => {
        const nextBtn = document.querySelector(NEXT_BUTTON);
        return nextBtn ? nextBtn.closest('a').href : null;
    };

    // 从HTML中提取搜索结果
    const extractResults = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc.querySelectorAll(RESULT_ITEM);
    };

    // 滚动事件处理器
    const handleScroll = (banner, loadingIndicator) => {
        // 如果正在加载或已达到当前周期限制，不处理滚动
        if (isLoading || currentCyclePages >= PAGES_PER_LOAD) return;

        // 计算是否到达底部
        const scrollPosition = window.scrollY + window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight;

        if (scrollPosition > pageHeight - LOAD_THRESHOLD) {
            // 防止重复加载
            if (loadingIndicator.classList.contains('active')) return;

            // 显示加载指示器
            loadingIndicator.classList.add('active');
            isLoading = true;
            updateStatusBanner(banner);

            // 延迟加载以提供视觉反馈
            setTimeout(() => {
                loadNextPage(banner, loadingIndicator);
            }, LOAD_DELAY);
        }
    };

    // AJAX加载下一页内容
    const loadNextPage = (banner, loadingIndicator) => {
        const nextUrl = getNextPageUrl();
        if (!nextUrl) {
            finishLoading(banner, loadingIndicator);
            return;
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: nextUrl,
            onload: function(response) {
                const results = extractResults(response.responseText);
                if (results.length > 0) {
                    // 添加新结果到页面
                    const container = document.querySelector(RESULT_CONTAINER);

                    // 插入新结果
                    results.forEach(item => {
                        container.insertBefore(item.cloneNode(true), loadingIndicator);
                    });

                    // 更新页数
                    totalLoadedPages++;
                    currentCyclePages++;

                    // 保存状态
                    GM_setValue('totalLoadedPages', totalLoadedPages);
                    GM_setValue('currentCyclePages', currentCyclePages);

                    // 更新状态指示器
                    updateStatusBanner(banner);

                    // 如果达到当前周期限制，添加"加载更多"按钮
                    if (currentCyclePages >= PAGES_PER_LOAD) {
                        const loadMoreBtn = createLoadMoreButton();
                        loadMoreBtn.onclick = () => {
                            // 重置当前周期计数
                            currentCyclePages = 0;
                            GM_setValue('currentCyclePages', 0);

                            // 移除按钮并更新状态
                            loadMoreBtn.remove();
                            updateStatusBanner(banner);

                            // 手动触发加载
                            loadingIndicator.classList.add('active');
                            isLoading = true;
                            loadNextPage(banner, loadingIndicator);
                        };
                    }
                }

                finishLoading(banner, loadingIndicator);
            },
            onerror: function(error) {
                console.error('加载失败:', error);
                finishLoading(banner, loadingIndicator);
            }
        });
    };

    // 完成加载处理
    const finishLoading = (banner, loadingIndicator) => {
        loadingIndicator.classList.remove('active');
        isLoading = false;
        updateStatusBanner(banner);

        // 检查是否需要立即加载下一页
        if (currentCyclePages < PAGES_PER_LOAD) {
            setTimeout(() => {
                const scrollPosition = window.scrollY + window.innerHeight;
                const pageHeight = document.documentElement.scrollHeight;

                if (scrollPosition > pageHeight - LOAD_THRESHOLD) {
                    handleScroll(banner, loadingIndicator);
                }
            }, 500);
        }
    };

    // 主初始化函数
    const init = () => {
        // 创建状态指示器
        const banner = createStatusBanner();

        // 创建加载指示器
        const loadingIndicator = createLoadingIndicator();

        // 设置滚动监听
        const scrollHandler = () => handleScroll(banner, loadingIndicator);
        window.addEventListener('scroll', scrollHandler);

        // 初始加载检查
        setTimeout(() => {
            // 检查初始页面是否已滚动到底部
            const scrollPosition = window.scrollY + window.innerHeight;
            const pageHeight = document.documentElement.scrollHeight;

            if (scrollPosition > pageHeight - LOAD_THRESHOLD &&
                currentCyclePages < PAGES_PER_LOAD) {
                scrollHandler();
            }

            // 如果已达到周期限制，显示加载更多按钮
            if (currentCyclePages >= PAGES_PER_LOAD) {
                const loadMoreBtn = createLoadMoreButton();
                loadMoreBtn.onclick = () => {
                    // 重置当前周期计数
                    currentCyclePages = 0;
                    GM_setValue('currentCyclePages', 0);

                    // 移除按钮并更新状态
                    loadMoreBtn.closest('.load-more-container').remove();
                    updateStatusBanner(banner);

                    // 手动触发加载
                    loadingIndicator.classList.add('active');
                    isLoading = true;
                    loadNextPage(banner, loadingIndicator);
                };
            }
        }, 2000);
    };

    // 页面加载完成后执行
   document.addEventListener('DOMContentLoaded', init);

// 如果需要完全加载后的操作
window.addEventListener('load', function() {
    // 仅处理需要完全加载资源的代码
});

 }


//**********谷歌学术自动翻页*************************************
     // 调试模式开关

    if (window.location.href.includes('scholar.google.com')){

    const DEBUG_MODE = false;

    // 调试日志函数
    function debugLog(message) {
        if (DEBUG_MODE) {
            console.log(`[ScholarScroll] ${message}`);
            GM_log(`[ScholarScroll] ${message}`);
        }
    }

    // 添加自定义样式
    GM_addStyle(`
        .infinite-scroll-loader {
            display: flex;
            justify-content: center;
            padding: 20px;
            margin: 30px 0;
        }

        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left: 4px solid #4285f4;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        .infinite-scroll-status {
            text-align: center;
            padding: 10px;
            color: #5f6368;
            font-size: 14px;
        }

        .debug-panel {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: white;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            max-width: 300px;
            font-size: 12px;
        }

        .debug-header {
            font-weight: bold;
            margin-bottom: 5px;
            color: #1a73e8;
        }

        .debug-content {
            max-height: 150px;
            overflow-y: auto;
            font-family: monospace;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `);

    // 主函数
    function initInfiniteScroll() {
        debugLog("初始化无限滚动功能");

        // 检查是否在搜索结果页面
        const resultsContainer = document.querySelector('#gs_res_ccl');
        if (!resultsContainer) {
            debugLog("错误：找不到结果容器 (#gs_res_ccl)");
            return;
        }

        // 创建UI元素
        const loader = document.createElement('div');
        loader.className = 'infinite-scroll-loader';
        loader.innerHTML = '<div class="loading-spinner"></div>';
        loader.style.display = 'none';

        const statusDiv = document.createElement('div');
        statusDiv.className = 'infinite-scroll-status';

        const container = document.createElement('div');
        container.id = 'infinite-scroll-container';
        container.appendChild(loader);
        container.appendChild(statusDiv);

        resultsContainer.after(container);

        let isLoading = false;
        let hasMorePages = true;
        let nextPageUrl = null;

        // 创建调试面板
        if (DEBUG_MODE) {
            createDebugPanel();
        }

        // 查找下一页URL
        function findNextPageUrl() {
            const nextButton = document.querySelector('.gs_ico.gs_ico_nav_next')?.closest('a');
            const url = nextButton ? nextButton.href : null;
            debugLog(`找到下一页URL: ${url}`);
            return url;
        }

        // 初始化下一页URL
        nextPageUrl = findNextPageUrl();

        // 加载下一页
        async function loadNextPage() {
            if (isLoading) {
                debugLog("加载被阻止：当前正在加载中");
                return;
            }

            if (!hasMorePages) {
                debugLog("加载被阻止：没有更多页面");
                return;
            }

            if (!nextPageUrl) {
                debugLog("加载被阻止：没有下一页URL");
                hasMorePages = false;
                statusDiv.textContent = '已加载所有结果';
                return;
            }

            isLoading = true;
            loader.style.display = 'flex';
            statusDiv.textContent = '正在加载更多结果...';
            debugLog(`开始加载: ${nextPageUrl}`);

            try {
                // 使用GM_xmlhttpRequest获取下一页内容
                const response = await fetchPage(nextPageUrl);

                // 解析新内容
                const newContent = parseNewContent(response);

                if (newContent && newContent.results) {
                    debugLog(`成功获取新内容，找到 ${newContent.results.length} 个结果`);

                    // 添加新内容
                    addNewResults(newContent.results);

                    // 更新下一页URL
                    nextPageUrl = newContent.nextPageUrl;
                    debugLog(`更新下一页URL: ${nextPageUrl}`);

                    statusDiv.textContent = '';

                    if (!nextPageUrl) {
                        hasMorePages = false;
                        statusDiv.textContent = '已加载所有结果';
                        debugLog("没有更多页面了");
                    }
                } else {
                    debugLog("未找到新内容");
                    hasMorePages = false;
                    statusDiv.textContent = '没有更多结果了';
                }
            } catch (error) {
                debugLog(`加载错误: ${error.message}`);
                statusDiv.textContent = '加载失败，请重试';
                GM_notification({
                    title: 'Google Scholar 无限滚动',
                    text: '加载下一页时出错',
                    silent: true
                });
            } finally {
                isLoading = false;
                loader.style.display = 'none';
            }
        }

        // 使用GM_xmlhttpRequest获取页面内容
        function fetchPage(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            debugLog(`页面加载成功，状态码: ${response.status}`);
                            resolve(response.responseText);
                        } else {
                            debugLog(`请求失败，状态码: ${response.status}`);
                            reject(new Error(`请求失败，状态码: ${response.status}`));
                        }
                    },
                    onerror: function(error) {
                        debugLog(`网络错误: ${error}`);
                        reject(new Error('网络请求失败'));
                    },
                    ontimeout: function() {
                        debugLog("请求超时");
                        reject(new Error('请求超时'));
                    }
                });
            });
        }

        // 解析新内容
        function parseNewContent(html) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 提取结果列表
            const newResultsContainer = doc.querySelector('#gs_res_ccl');
            if (!newResultsContainer) {
                debugLog("解析错误：找不到结果容器");
                return null;
            }

            // 提取结果项
            const resultItems = newResultsContainer.querySelectorAll('.gs_r.gs_or.gs_scl, .gs_ri');
            if (resultItems.length === 0) {
                debugLog("解析错误：找不到结果项");
                return null;
            }

            // 提取下一页URL
            const nextButton = doc.querySelector('.gs_ico.gs_ico_nav_next')?.closest('a');
            const nextPageUrl = nextButton ? nextButton.href : null;

            return {
                results: Array.from(resultItems),
                nextPageUrl: nextPageUrl
            };
        }

        // 添加新结果到页面
        function addNewResults(results) {
            const resultsContainer = document.querySelector('#gs_res_ccl');

            results.forEach(item => {
                // 克隆节点以避免文档树问题
                const clonedItem = item.cloneNode(true);
                resultsContainer.appendChild(clonedItem);
            });

            debugLog(`成功添加 ${results.length} 个新结果`);
        }

        // 检查滚动位置
        function checkScrollPosition() {
            if (isLoading || !hasMorePages) return;

            const scrollPosition = window.scrollY + window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const threshold = 1000; // 提前500px加载

            if (scrollPosition >= documentHeight - threshold) {
                debugLog(`触发滚动加载 (${scrollPosition} >= ${documentHeight} - ${threshold})`);
                loadNextPage();
            }

            // 更新调试信息
            if (DEBUG_MODE) {
                updateDebugInfo();
            }
        }

        // 创建调试面板
        function createDebugPanel() {
            const debugPanel = document.createElement('div');
            debugPanel.className = 'debug-panel';
            debugPanel.innerHTML = `
                <div class="debug-header">Google Scholar 无限滚动调试</div>
                <div class="debug-content" id="debug-content"></div>
            `;
            document.body.appendChild(debugPanel);
        }

        // 更新调试信息
        function updateDebugInfo() {
            if (!DEBUG_MODE) return;

            const scrollPosition = window.scrollY + window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const threshold = 500;

            const debugInfo = `
状态: ${isLoading ? '加载中...' : (hasMorePages ? '等待中' : '完成')}
当前页: ${document.location.href}
下一页: ${nextPageUrl || '无'}
---
滚动位置: ${scrollPosition}px
文档高度: ${documentHeight}px
阈值: ${threshold}px
差值: ${documentHeight - scrollPosition}px
条件: ${scrollPosition >= (documentHeight - threshold) ? '满足' : '未满足'}
            `;

            const debugContent = document.getElementById('debug-content');
            if (debugContent) {
                debugContent.textContent = debugInfo;
            }
        }

        // 事件监听
        window.addEventListener('scroll', checkScrollPosition);

        // 初始检查
        setTimeout(() => {
            debugLog("初始滚动检查");
            checkScrollPosition();
        }, 1000);

        // 初始调试信息
        updateDebugInfo();
    }

    // 页面加载完成后初始化
    if (document.readyState === 'complete') {
        initInfiniteScroll();
    } else {
        window.addEventListener('load', initInfiniteScroll);
    }
}


//*****************金山文档**************************************
    //console.log("金山文档");
   if (window.location.href.includes('kdocs.cn')) {
         console.log("金山文档");
        // 提前注入CSS隐藏广告，避免布局抖动
        GM_addStyle(`
            .header-menu-ad,
            .company-guide,
            .content_style_card .kdv-button--secondary,
            .tips {
                display: none !important;
            }
        `);

        // 等待DOM加载完成
        document.addEventListener('DOMContentLoaded', function() {
            // 移除广告的函数
            const removeAds = () => {
                const selectors = [
                    '.header-menu-ad',
                    '.company-guide',
                    '.content_style_card .kdv-button--secondary',
                    '.tips'
                ];

                selectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(element => {
                        element.remove();
                        console.log(`已移除: ${selector}`);
                    });
                });
            };

            // 初始执行
            removeAds();

            // 创建观察器监听后续动态内容
            const observer = new MutationObserver(mutations => {
                let shouldRemove = false;
                mutations.forEach(mutation => {
                    if (mutation.addedNodes.length) {
                        shouldRemove = true;
                    }
                });
                if (shouldRemove) removeAds();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

 //**百度翻译******************************************************************************************************
if(window.location.href.includes('fanyi.baidu.com')){
    // 广告选择器配置（集中管理，便于维护）
    const AD_SELECTORS = {
        // 主广告容器
        MAIN_AD: '.KxVKmLZM',
        // 广告元素
        AD_ELEMENTS: [
            '.URCZyDIb',
            '._U9afNhR',
          //  '.R8Aay5vw',
            '.fU_fsLfm',
            '.YImUGZJo'
        ],
        // 动态加载的广告元素
        DYNAMIC_ADS: ['.LsBEmsAO']
    };

    // 广告移除功能
    function removeAds() {
        // 移除主广告容器
        const mainAd = document.querySelector(AD_SELECTORS.MAIN_AD);
        if (mainAd) {
            mainAd.style.display = 'none';
            console.log('主广告已隐藏');
        }

        // 批量移除静态广告元素
        AD_SELECTORS.AD_ELEMENTS.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.remove();
                console.log(`已移除广告元素: ${selector}`);
            });
        });

        // 批量移除动态广告元素
        AD_SELECTORS.DYNAMIC_ADS.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.remove();
                console.log(`已移除动态广告: ${selector}`);
            });
        });
    }

    // 初始执行
    removeAds();

    // 创建优化的观察者
    const observer = new MutationObserver(mutations => {
        let foundNewAd = false;

        // 检查是否有新节点添加
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                foundNewAd = true;
                break;
            }
        }

        // 发现新内容时重新清理广告
        if (foundNewAd) {
            setTimeout(removeAds, 10); // 延迟确保DOM完全加载
        }
    });

    // 开始观察文档变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 添加CSS增强隐藏（双重保障）
    const style = document.createElement('style');
    style.innerHTML = `
       
        ${AD_SELECTORS.MAIN_AD} {
            display: none !important;
            height: 0 !important;
            visibility: hidden !important;
        }

       
        ${[...AD_SELECTORS.AD_ELEMENTS, ...AD_SELECTORS.DYNAMIC_ADS].join(',')} {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
    `;
    document.head.appendChild(style);

    // 页面完全加载后再次检查
    window.addEventListener('load', () => {
        setTimeout(removeAds, 500);
    });

    // 控制台输出初始化信息
    console.log('百度翻译广告屏蔽脚本已激活。当前配置:');
    console.table(AD_SELECTORS);

}
//********************************************************************************************************
    //知网翻译
    //********************************************************************************

  if(window.location.href.includes('dict.cnki.net')){
    GM_addStyle(`
  a[href="https://huazhi.cnki.net/aidoc/"] {
    display: none !important;
  }
`);}


 //**************************ﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌ*
//知网检索
//**********ﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌﻌ***************
if(window.location.href.includes('kns.cnki.net')){

    // 立即尝试点击（不等待任何加载）
    const tryClick = () => {
        const zhBtn = document.getElementById('ZH');
        if (zhBtn) {
            zhBtn.click();
            if (document.querySelector('#perPageDiv .sort-default').textContent!=='50'){



// 显示下拉菜单但不让用户看到
const sortList = document.querySelector('#perPageDiv .sort-list');
sortList.style.display = 'block';
sortList.style.opacity = '0';
sortList.style.position = 'absolute';
sortList.style.zIndex = '-1000';

// 触发点击
document.querySelector('li[data-val="50"]').click();
document.querySelector('li[data-val="50"]').click();

// 立即恢复菜单状态（不影响后续操作）
setTimeout(() => {
  sortList.style = '';
}, 100);
                        }
            return true;
        }
        return false;
    };

    // 持续尝试直到成功
    const interval = setInterval(() => {
        if (tryClick()) {
            clearInterval(interval);
        }
    }, 100);

    // 10秒后停止尝试（防止无限循环）
    setTimeout(() => {
        clearInterval(interval);
    }, 7000);



}//if的括号






})();

// ==UserScript==
// @name         WNACG漫画无限滚动加载(优化版)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  将wnacg.com的漫画列表页修改为滚动到底部自动加载更多内容，支持新标签页打开，修复分类页面加载重复问题
// @author       太平绅士
// @license      MIT
// @match        https://wnacg.com/albums-index-page-*.html
// @match        https://wnacg.com/albums-index.html
// @match        https://wnacg.com/albums-index-page-*-cate-*.html
// @match        https://wnacg.com/albums-index-cate-*.html
// @match        https://www.wnacg.com/albums-index-page-*.html
// @match        https://www.wnacg.com/albums-index.html
// @match        https://www.wnacg.com/albums-index-page-*-cate-*.html
// @match        https://www.wnacg.com/albums-index-cate-*.html
// @match        https://wnacg.org/albums-index-page-*.html
// @match        https://wnacg.org/albums-index.html
// @match        https://wnacg.org/albums-index-page-*-cate-*.html
// @match        https://wnacg.org/albums-index-cate-*.html
// @match        https://www.wnacg.org/albums-index-page-*.html
// @match        https://www.wnacg.org/albums-index.html
// @match        https://www.wnacg.org/albums-index-page-*-cate-*.html
// @match        https://www.wnacg.org/albums-index-cate-*.html
// @match        https://wnacg.ru/albums-index-page-*.html
// @match        https://wnacg.ru/albums-index.html
// @match        https://wnacg.ru/albums-index-page-*-cate-*.html
// @match        https://wnacg.ru/albums-index-cate-*.html
// @match        https://www.wnacg.ru/albums-index-page-*.html
// @match        https://www.wnacg.ru/albums-index.html
// @match        https://www.wnacg.ru/albums-index-page-*-cate-*.html
// @match        https://www.wnacg.ru/albums-index-cate-*.html
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      wnacg.com
// @connect      wnacg.org
// @connect      wnacg.ru
// @connect      t4.qy0.ru
// @connect      qy0.ru
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/535295/WNACG%E6%BC%AB%E7%94%BB%E6%97%A0%E9%99%90%E6%BB%9A%E5%8A%A8%E5%8A%A0%E8%BD%BD%28%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535295/WNACG%E6%BC%AB%E7%94%BB%E6%97%A0%E9%99%90%E6%BB%9A%E5%8A%A8%E5%8A%A0%E8%BD%BD%28%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .infinite-scroll-indicator {
            text-align: center;
            padding: 15px;
            font-size: 14px;
            color: #666;
            background-color: #f5f5f5;
            border-radius: 4px;
            margin: 10px 0;
        }
        
        .error-message {
            color: #f44336;
            font-weight: bold;
        }
        
        .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(0,0,0,0.1);
            border-radius: 50%;
            border-top-color: #666;
            animation: spin 1s ease-in-out infinite;
            margin-right: 10px;
            vertical-align: middle;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .pic_box img.img-loading-placeholder {
            background-color: #f5f5f5;
            min-height: 150px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #aaa;
        }
    `);

    // 配置
    const config = {
        // 距离底部多少像素时加载下一页（小值意味着需要滚动更接近底部）
        bottomThreshold: 150,
        // 是否在加载中
        isLoading: false,
        // 当前页码
        currentPage: getCurrentPage(),
        // 当前分类ID
        categoryId: getCategoryId(),
        // 加载状态提示元素
        loadingIndicator: null,
        // 是否还有下一页
        hasNextPage: true,
        // 主域名
        mainDomain: window.location.hostname,
        // 协议
        protocol: window.location.protocol,
        // 是否显示调试信息
        debug: false,
        // 防止频繁触发的延迟（毫秒）
        scrollThrottleDelay: 100,
        // 上次滚动检查时间
        lastScrollCheck: 0,
        // 已加载页面的集合，防止重复加载
        loadedPages: new Set(),
        // 定期检查间隔（毫秒）
        periodicCheckInterval: 500,
        // 定期检查的定时器ID
        periodicCheckTimer: null,
        // 滚动结束检测延迟（毫秒）
        scrollEndDelay: 200,
        // 上次滚动时间
        lastScrollTime: 0,
        // 滚动结束检测的定时器ID
        scrollEndTimer: null,
        // 是否在新标签页打开链接
        openInNewTab: true
    };

    // 调试日志
    function logDebug(...args) {
        if (config.debug) {
            console.log('[WNACG无限滚动]', ...args);
        }
    }

    // 初始化
    function init() {
        // 创建加载指示器
        createLoadingIndicator();
        
        // 隐藏原始分页器
        hideOriginalPaginator();
        
        // 记录当前页和分类已加载
        const pageKey = getPageKey(config.currentPage, config.categoryId);
        config.loadedPages.add(pageKey);
        
        // 输出当前URL信息（调试用）
        logDebug('当前URL:', window.location.href);
        logDebug('当前页码:', config.currentPage);
        logDebug('当前分类ID:', config.categoryId || '无分类');
        logDebug('页面键值:', pageKey);
        
        // 为已存在的链接添加新标签页打开属性
        if (config.openInNewTab) {
            makeLinksOpenInNewTab(document);
        }
        
        // 添加滚动事件监听，包括滚动结束检测
        window.addEventListener('scroll', handleScroll);
        
        // 添加页面可见性变化事件监听
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // 设置定期检查，不依赖滚动事件
        startPeriodicCheck();
        
        // 首次加载完成后检查一次
        setTimeout(checkBottomPosition, 1000);
        
        logDebug('脚本初始化完成');
    }
    
    // 生成页面唯一键值（用于跟踪已加载页面）
    function getPageKey(page, categoryId) {
        return categoryId ? `page-${page}-cate-${categoryId}` : `page-${page}`;
    }
    
    // 使所有漫画链接在新标签页中打开
    function makeLinksOpenInNewTab(doc) {
        // 选择所有漫画项的链接
        const mangaLinks = doc.querySelectorAll('.gallary_wrap a');
        
        mangaLinks.forEach(link => {
            // 设置target属性为_blank，使链接在新标签页打开
            link.setAttribute('target', '_blank');
            // 为安全起见，添加rel属性
            link.setAttribute('rel', 'noopener noreferrer');
        });
        
        logDebug('已设置链接在新标签页打开');
    }
    
    // 开始定期检查
    function startPeriodicCheck() {
        // 清除可能存在的定时器
        if (config.periodicCheckTimer) {
            clearInterval(config.periodicCheckTimer);
        }
        
        // 设置新的定期检查
        config.periodicCheckTimer = setInterval(checkBottomPosition, config.periodicCheckInterval);
    }
    
    // 停止定期检查
    function stopPeriodicCheck() {
        if (config.periodicCheckTimer) {
            clearInterval(config.periodicCheckTimer);
            config.periodicCheckTimer = null;
        }
    }
    
    // 处理页面可见性变化
    function handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            // 页面变为可见时检查一次
            checkBottomPosition();
        }
    }
    
    // 处理滚动事件
    function handleScroll() {
        // 记录本次滚动时间
        config.lastScrollTime = Date.now();
        
        // 使用节流检查是否需要加载
        throttledScrollCheck();
        
        // 检测滚动结束
        detectScrollEnd();
    }
    
    // 检测滚动结束
    function detectScrollEnd() {
        // 清除可能存在的定时器
        if (config.scrollEndTimer) {
            clearTimeout(config.scrollEndTimer);
        }
        
        // 设置新的定时器
        config.scrollEndTimer = setTimeout(() => {
            // 如果从上次滚动到现在已经超过指定时间，视为滚动结束
            const timeSinceLastScroll = Date.now() - config.lastScrollTime;
            if (timeSinceLastScroll >= config.scrollEndDelay) {
                // 滚动结束后检查一次
                checkBottomPosition();
                logDebug('滚动结束，执行检查');
            }
        }, config.scrollEndDelay);
    }
    
    // 节流滚动检查
    function throttledScrollCheck() {
        const now = Date.now();
        if (now - config.lastScrollCheck >= config.scrollThrottleDelay) {
            config.lastScrollCheck = now;
            checkBottomPosition();
        }
    }
    
    // 检查是否接近底部
    function checkBottomPosition() {
        // 如果正在加载或者没有下一页，则不执行
        if (config.isLoading || !config.hasNextPage) return;
        
        // 计算距离底部的距离
        const scrollPosition = window.scrollY + window.innerHeight;
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        const distanceFromBottom = documentHeight - scrollPosition;
        
        // 调试显示距离底部的距离
        if (config.debug) {
            logDebug('距离底部:', distanceFromBottom, 'px', '阈值:', config.bottomThreshold, 'px', 
                    '窗口高度:', window.innerHeight, 'px',
                    '文档高度:', documentHeight, 'px',
                    '滚动位置:', scrollPosition, 'px');
        }
        
        // 当接近底部时加载下一页
        if (distanceFromBottom < config.bottomThreshold) {
            // 确保下一页未加载过
            const nextPage = config.currentPage + 1;
            const pageKey = getPageKey(nextPage, config.categoryId);
            
            if (!config.loadedPages.has(pageKey)) {
                logDebug('触发加载下一页', nextPage, '分类:', config.categoryId || '无分类');
                loadNextPage();
            }
        }
    }

    // 获取当前分类ID
    function getCategoryId() {
        const url = window.location.href;
        // 匹配 albums-index-page-数字-cate-数字.html 或 albums-index-cate-数字.html
        const match = url.match(/albums-index(?:-page-\d+)?-cate-(\d+)\.html/);
        return match ? match[1] : null;
    }

    // 获取当前页码
    function getCurrentPage() {
        const url = window.location.href;
        // 匹配普通页面和分类页面的页码
        const match = url.match(/albums-index-page-(\d+)(?:-cate-\d+)?\.html/);
        return match ? parseInt(match[1]) : 1;
    }

    // 获取下一页URL
    function getNextPageUrl() {
        const nextPage = config.currentPage + 1;
        const url = window.location.href;
        
        // 针对分类页面的URL
        if (config.categoryId) {
            // 如果当前URL已经有页码，替换页码
            if (url.match(/albums-index-page-\d+-cate-\d+\.html/)) {
                return url.replace(
                    /albums-index-page-\d+-cate-\d+\.html/, 
                    `albums-index-page-${nextPage}-cate-${config.categoryId}.html`
                );
            }
            // 如果当前URL没有页码（首页），插入页码
            else if (url.match(/albums-index-cate-\d+\.html/)) {
                return url.replace(
                    /albums-index-cate-\d+\.html/, 
                    `albums-index-page-${nextPage}-cate-${config.categoryId}.html`
                );
            }
        } 
        // 针对普通页面的URL
        else {
            // 如果当前URL已经有页码，替换页码
            if (url.match(/albums-index-page-\d+\.html/)) {
                return url.replace(
                    /albums-index-page-\d+\.html/, 
                    `albums-index-page-${nextPage}.html`
                );
            }
            // 如果当前URL没有页码（首页），插入页码
            else if (url.match(/albums-index\.html/)) {
                return url.replace(
                    /albums-index\.html/, 
                    `albums-index-page-${nextPage}.html`
                );
            }
        }
        
        // 如果没有匹配到任何模式，使用默认URL格式
        logDebug('URL格式无法识别，使用默认格式', url);
        return `${window.location.origin}/albums-index-page-${nextPage}${config.categoryId ? `-cate-${config.categoryId}` : ''}.html`;
    }
    
    // 修复URL
    function fixUrl(url, base) {
        if (!url) return url;
        
        try {
            // 如果是完整URL，直接返回
            if (url.match(/^https?:\/\//)) {
                return url;
            }
            
            // 处理相对协议URL（以//开头）
            if (url.startsWith('//')) {
                return config.protocol + url;
            }
            
            // 处理相对路径
            if (url.startsWith('/')) {
                return config.protocol + '//' + config.mainDomain + url;
            }
            
            // 处理其他相对路径
            return base ? new URL(url, base).href : url;
        } catch (e) {
            logDebug('URL修复错误', e, url);
            return url;
        }
    }

    // 处理并替换图片HTML
    function processImageElement(item) {
        const imgElements = item.querySelectorAll('img');
        
        imgElements.forEach(img => {
            // 保存原始图片属性
            const originalSrc = img.getAttribute('src') || '';
            const originalAlt = img.getAttribute('alt') || '';
            
            // 给图片添加加载中的样式
            img.classList.add('img-loading-placeholder');
            
            // 尝试不同的图片URL格式
            const srcVariations = [];
            
            // 原始URL
            if (originalSrc) {
                srcVariations.push(originalSrc);
            }
            
            // 修复的URL
            if (originalSrc && originalSrc.startsWith('//')) {
                srcVariations.push(config.protocol + originalSrc);
            }
            
            // 尝试不同的域名
            if (originalSrc && originalSrc.includes('qy0.ru')) {
                const imgHostVariations = ['t4.qy0.ru', 't3.qy0.ru', 't2.qy0.ru', 't1.qy0.ru'];
                imgHostVariations.forEach(host => {
                    srcVariations.push(originalSrc.replace(/\/\/[^\/]+\//, '//' + host + '/'));
                });
            }
            
            // 去掉可能的缓存参数
            if (originalSrc && originalSrc.includes('?')) {
                srcVariations.push(originalSrc.split('?')[0]);
            }
            
            logDebug('图片变体:', srcVariations);
            
            // 创建新的图片元素进行预加载
            const loader = new Image();
            let loadAttemptIndex = 0;
            let loadSuccessful = false;
            
            function tryNextVariation() {
                if (loadAttemptIndex < srcVariations.length) {
                    const nextSrc = srcVariations[loadAttemptIndex++];
                    logDebug('尝试加载图片:', nextSrc);
                    loader.src = nextSrc;
                } else {
                    // 所有尝试都失败，设置一个默认的替代图片
                    img.src = 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22120%22%20height%3D%22160%22%3E%3Crect%20width%3D%22120%22%20height%3D%22160%22%20fill%3D%22%23eee%22%2F%3E%3Ctext%20x%3D%2260%22%20y%3D%2280%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20fill%3D%22%23aaa%22%3E%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD%E5%A4%B1%E8%B4%A5%3C%2Ftext%3E%3C%2Fsvg%3E';
                    img.setAttribute('alt', '图片加载失败: ' + originalAlt);
                    img.classList.remove('img-loading-placeholder');
                    img.style.backgroundColor = '#f5f5f5';
                    logDebug('所有图片加载尝试失败');
                }
            }
            
            loader.onload = function() {
                // 预加载成功，设置到实际图片
                loadSuccessful = true;
                img.src = loader.src;
                img.classList.remove('img-loading-placeholder');
                logDebug('图片加载成功:', loader.src);
            };
            
            loader.onerror = function() {
                // 尝试下一个变体
                if (!loadSuccessful) {
                    tryNextVariation();
                }
            };
            
            // 开始第一次尝试
            tryNextVariation();
        });
    }
    
    // 处理链接元素
    function processLinkElement(item, baseUrl) {
        const linkElements = item.querySelectorAll('a');
        linkElements.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                // 修复链接URL
                link.setAttribute('href', fixUrl(href, baseUrl));
                
                // 设置在新标签页中打开
                if (config.openInNewTab) {
                    link.setAttribute('target', '_blank');
                    link.setAttribute('rel', 'noopener noreferrer');
                }
            }
        });
    }

    // 加载下一页
    function loadNextPage() {
        config.isLoading = true;
        showLoadingIndicator();
        
        const nextPageUrl = getNextPageUrl();
        const currentUrl = window.location.href;
        
        logDebug('加载下一页:', nextPageUrl);
        
        GM_xmlhttpRequest({
            method: 'GET',
            url: nextPageUrl,
            headers: {
                'Referer': currentUrl,
                'User-Agent': navigator.userAgent,
                // 添加随机缓存参数避免缓存
                'Cache-Control': 'no-cache, no-store',
                'Pragma': 'no-cache'
            },
            onload: function(response) {
                if (response.status === 200) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    
                    // 获取下一页的漫画列表
                    const mangaItems = doc.querySelectorAll('.gallary_wrap ul.cc .li.gallary_item');
                    
                    if (mangaItems && mangaItems.length > 0) {
                        // 获取容器
                        const container = document.querySelector('.gallary_wrap ul.cc');
                        
                        logDebug('加载到新项目:', mangaItems.length);
                        
                        // 处理图片链接，确保正确加载
                        mangaItems.forEach(item => {
                            // 深度克隆项目
                            const clonedItem = document.importNode(item, true);
                            
                            // 处理链接
                            processLinkElement(clonedItem, nextPageUrl);
                            
                            // 处理图片
                            processImageElement(clonedItem);
                            
                            // 添加到容器
                            container.appendChild(clonedItem);
                        });
                        
                        // 更新当前页码并记录已加载
                        config.currentPage++;
                        const pageKey = getPageKey(config.currentPage, config.categoryId);
                        config.loadedPages.add(pageKey);
                        
                        logDebug('页码更新为:', config.currentPage, '页面键值:', pageKey);
                        
                        // 检查是否还有下一页
                        const nextPageLink = doc.querySelector('.paginator .next a');
                        config.hasNextPage = !!nextPageLink;
                        
                        // 延迟隐藏加载指示器，以便用户看到更新
                        setTimeout(hideLoadingIndicator, 500);
                        
                        // 在新内容加载后，再次检查是否需要加载下一页
                        setTimeout(checkBottomPosition, 1000);
                    } else {
                        config.hasNextPage = false;
                        showNoMoreContent();
                        logDebug('没有找到更多内容');
                    }
                } else {
                    console.error('加载下一页失败:', response.status);
                    showErrorMessage('加载失败，请刷新页面重试');
                }
                
                // 加载完成后，延迟一段时间再允许下一次加载，防止频繁请求
                setTimeout(function() {
                    config.isLoading = false;
                    // 解锁后检查一次是否需要继续加载
                    checkBottomPosition();
                }, 800);
            },
            onerror: function(error) {
                console.error('请求错误:', error);
                showErrorMessage('网络错误，请检查您的网络连接');
                
                // 出错时也要延迟后才允许再次尝试
                setTimeout(function() {
                    config.isLoading = false;
                    // 解锁后检查一次是否需要继续加载
                    checkBottomPosition();
                }, 2000);
                
                logDebug('请求错误:', error);
            }
        });
    }

    // 创建加载指示器
    function createLoadingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'infinite-scroll-indicator';
        indicator.style.display = 'none';
        indicator.innerHTML = '<span class="loading-spinner"></span>正在加载更多内容...';
        
        // 添加到页面底部
        document.querySelector('.bot_toolbar').after(indicator);
        config.loadingIndicator = indicator;
    }

    // 显示加载指示器
    function showLoadingIndicator() {
        if (config.loadingIndicator) {
            config.loadingIndicator.innerHTML = '<span class="loading-spinner"></span>正在加载更多内容...';
            config.loadingIndicator.style.display = 'block';
            config.loadingIndicator.className = 'infinite-scroll-indicator';
        }
    }

    // 隐藏加载指示器
    function hideLoadingIndicator() {
        if (config.loadingIndicator) {
            config.loadingIndicator.style.display = 'none';
        }
    }

    // 显示无更多内容提示
    function showNoMoreContent() {
        if (config.loadingIndicator) {
            config.loadingIndicator.innerHTML = '已经到底了，没有更多内容';
            config.loadingIndicator.style.display = 'block';
        }
    }
    
    // 显示错误信息
    function showErrorMessage(message) {
        if (config.loadingIndicator) {
            config.loadingIndicator.innerHTML = `<span class="error-message">${message}</span>`;
            config.loadingIndicator.style.display = 'block';
        }
    }

    // 隐藏原始分页器
    function hideOriginalPaginator() {
        const paginator = document.querySelector('.bot_toolbar .paginator');
        if (paginator) {
            paginator.style.display = 'none';
        }
    }
    
    // 清理工作，在页面卸载前执行
    function cleanup() {
        // 清除所有定时器
        stopPeriodicCheck();
        if (config.scrollEndTimer) {
            clearTimeout(config.scrollEndTimer);
        }
        
        // 移除事件监听
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
    
    // 监听页面卸载事件
    window.addEventListener('beforeunload', cleanup);

    // 启动脚本
    init();
})(); 
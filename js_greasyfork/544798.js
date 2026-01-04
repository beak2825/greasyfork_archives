// ==UserScript==
// @name         YouTube 一键跳转 Bilibili 同名视频 v2.3
// @namespace    https://github.com/your-username/yt-bili-checker
// @version      2.3.0
// @description  在 YouTube 网站上自动检测当前视频在 Bilibili 是否有同名视频，显示前5个搜索结果供用户选择 - 修复面板状态管理
// @author       Maxxie wei
// @license      MIT
// @match        *://www.youtube.com/*
// @match        *://youtube.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      api.bilibili.com
// @connect      www.bilibili.com
// @connect      search.bilibili.com
// @connect      s.search.bilibili.com
// @icon         https://www.google.com/s2/favicons?domain=www.youtube.com
// @downloadURL https://update.greasyfork.org/scripts/544798/YouTube%20%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BD%AC%20Bilibili%20%E5%90%8C%E5%90%8D%E8%A7%86%E9%A2%91%20v23.user.js
// @updateURL https://update.greasyfork.org/scripts/544798/YouTube%20%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BD%AC%20Bilibili%20%E5%90%8C%E5%90%8D%E8%A7%86%E9%A2%91%20v23.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置常量
    const CONFIG = {
        BUTTON_ID: 'yt-bili-finder-button-v2',
        RESULTS_PANEL_ID: 'yt-bili-results-panel-v2',
        NOTIFICATION_ID: 'yt-bili-notification-v2',
        DEFAULT_THRESHOLD: 0.3,
        SEARCH_DELAY: 2000,
        NOTIFICATION_DURATION: 5000,
        CACHE_DURATION: 5 * 60 * 1000, // 5分钟
        MAX_SEARCH_RESULTS: 5
    };

    // 全局变量
    let lastUrl = '';
    let mainLogicInterval;
    let currentVideoTitle = '';
    let searchCache = new Map();
    let currentSearchResult = null; // 存储当前搜索结果

    /**
     * 优化的匹配算法
     */
    class OptimizedMatcher {
        constructor() {
            this.threshold = GM_getValue('similarity_threshold', CONFIG.DEFAULT_THRESHOLD);
        }

        /**
         * 标准化标题文本
         */
        normalizeTitle(str) {
            if (!str) return '';
            return str
                .toLowerCase()
                .replace(/[^\p{L}\p{N}\s]/gu, '')
                .replace(/\s+/g, ' ')
                .trim();
        }

        /**
         * 计算两个字符串的相似度 - 使用改进的算法
         */
        calculateStringSimilarity(str1, str2) {
            const s1 = this.normalizeTitle(str1);
            const s2 = this.normalizeTitle(str2);

            if (s1 === s2) return 1.0;
            if (s1.length < 2 || s2.length < 2) return 0.0;

            // 计算共同字符数和位置匹配
            const chars1 = new Set(s1.split(''));
            const chars2 = new Set(s2.split(''));
            
            let commonChars = 0;
            for (const char of chars1) {
                if (chars2.has(char)) {
                    commonChars++;
                }
            }

            // 基础相似度
            const baseSimilarity = (2.0 * commonChars) / (chars1.size + chars2.size);
            
            // 长度相似度
            const lengthSimilarity = Math.min(s1.length, s2.length) / Math.max(s1.length, s2.length);
            
            // 综合相似度
            return (baseSimilarity * 0.7 + lengthSimilarity * 0.3);
        }

        /**
         * 更新匹配阈值
         */
        updateThreshold(newThreshold) {
            if (newThreshold < 0.0 || newThreshold > 1.0) {
                throw new Error('阈值必须在0.0到1.0之间');
            }
            
            this.threshold = newThreshold;
            GM_setValue('similarity_threshold', newThreshold);
            console.log(`匹配阈值已更新为: ${(newThreshold * 100).toFixed(1)}%`);
        }
    }

    /**
     * 简化的标题处理工具
     */
    class SimpleTitleProcessor {
        /**
         * 清理标题中的无用信息
         */
        cleanTitle(title) {
            if (!title) return '';
            
            return title
                .replace(/\[.*?\]/g, '') // 移除方括号内容
                .replace(/【.*?】/g, '') // 移除中文方括号内容
                .replace(/\(.*?\)/g, '') // 移除圆括号内容
                .replace(/（.*?）/g, '') // 移除中文圆括号内容
                .replace(/[【】\[\]()（）]/g, '') // 移除所有括号
                .replace(/\s+/g, ' ') // 合并多个空格
                .trim();
        }

        /**
         * 生成搜索关键词 - 直接使用清理后的标题
         */
        generateSearchKeywords(title) {
            const cleanedTitle = this.cleanTitle(title);
            return {
                fullTitle: cleanedTitle,
                originalTitle: title
            };
        }
    }

    // 初始化工具类
    const matcher = new OptimizedMatcher();
    const titleProcessor = new SimpleTitleProcessor();

    /**
     * 设置菜单命令
     */
    function setupMenuCommands() {
        GM_registerMenuCommand('设置匹配阈值', () => {
            const currentThreshold = GM_getValue('similarity_threshold', CONFIG.DEFAULT_THRESHOLD);
            const userInput = prompt('请输入新的匹配阈值 (范围 0.0 - 1.0):', currentThreshold);
            
            if (userInput === null) return;
            
            const newThreshold = parseFloat(userInput);
            if (isNaN(newThreshold) || newThreshold < 0.0 || newThreshold > 1.0) {
                alert('输入无效！请输入一个介于 0.0 和 1.0 之间的数字。');
                return;
            }
            
            try {
                matcher.updateThreshold(newThreshold);
                alert(`匹配阈值已成功保存为: ${(newThreshold * 100).toFixed(1)}%`);
            } catch (error) {
                alert('设置失败: ' + error.message);
            }
        });

        GM_registerMenuCommand('清除搜索缓存', () => {
            searchCache.clear();
            alert('搜索缓存已清除！');
        });

        GM_registerMenuCommand('查看当前设置', () => {
            const threshold = GM_getValue('similarity_threshold', CONFIG.DEFAULT_THRESHOLD);
            alert(`当前匹配阈值: ${(threshold * 100).toFixed(1)}%\n缓存大小: ${searchCache.size}\n搜索结果数: ${CONFIG.MAX_SEARCH_RESULTS}`);
        });

        // 新增：手动搜索当前视频
        GM_registerMenuCommand('手动搜索当前视频', () => {
            const videoTitle = getVideoTitle();
            if (videoTitle) {
                console.log("YT-Bili v2: 手动搜索视频:", videoTitle);
                updateButtonToSearching();
                searchBilibili(videoTitle);
            } else {
                alert('未能获取当前视频标题');
            }
        });

        // 新增：直接跳转到Bilibili搜索页面
        GM_registerMenuCommand('直接跳转Bilibili搜索', () => {
            const videoTitle = getVideoTitle();
            if (videoTitle) {
                const searchKeywords = titleProcessor.generateSearchKeywords(videoTitle);
                const searchUrl = `https://search.bilibili.com/video?keyword=${encodeURIComponent(searchKeywords.fullTitle)}`;
                window.open(searchUrl, '_blank');
            } else {
                alert('未能获取当前视频标题');
            }
        });

        // 新增：测试API连接
        GM_registerMenuCommand('测试Bilibili API连接', () => {
            console.log("YT-Bili v2: 开始测试API连接...");
            testBilibiliAPI();
        });
    }

    /**
     * 主逻辑 - URL侦测器
     */
    function startUrlDetection() {
        let lastVideoId = '';
        
        setInterval(() => {
            const currentUrl = window.location.href;
            const currentVideoId = getVideoId();
            
            // 检查URL变化或视频ID变化
            if (currentUrl !== lastUrl || currentVideoId !== lastVideoId) {
                console.log("YT-Bili v2: 检测到变化，准备刷新按钮...");
                console.log("URL变化:", currentUrl !== lastUrl);
                console.log("视频ID变化:", currentVideoId !== lastVideoId);
                lastUrl = currentUrl;
                lastVideoId = currentVideoId;
                runMainLogic();
            }
        }, 1000);
    }

    /**
     * 获取当前视频ID
     */
    function getVideoId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v') || '';
    }

    /**
     * 运行主逻辑
     */
    function runMainLogic() {
        clearInterval(mainLogicInterval);
        removeExistingElements();
        
        mainLogicInterval = setInterval(() => {
            if (isVideoPage()) {
                const videoTitle = getVideoTitle();
                if (videoTitle && videoTitle !== currentVideoTitle) {
                    console.log("YT-Bili v2: 检测到新视频标题:", videoTitle);
                    clearInterval(mainLogicInterval);
                    createAndSearch();
                } else if (videoTitle && !document.getElementById(CONFIG.BUTTON_ID)) {
                    console.log("YT-Bili v2: 首次加载视频，创建按钮");
                    clearInterval(mainLogicInterval);
                    createAndSearch();
                }
            }
        }, 500);
    }

    /**
     * 检查是否为视频页面
     */
    function isVideoPage() {
        return window.location.pathname === '/watch' && window.location.search.includes('v=');
    }

    /**
     * 移除已存在的元素
     */
    function removeExistingElements() {
        document.getElementById(CONFIG.BUTTON_ID)?.remove();
        document.getElementById(CONFIG.RESULTS_PANEL_ID)?.remove();
        document.getElementById(CONFIG.NOTIFICATION_ID)?.remove();
        
        // 重置搜索结果状态
        currentSearchResult = null;
    }

    /**
     * 创建按钮并准备搜索
     */
    function createAndSearch() {
        if (document.getElementById(CONFIG.BUTTON_ID)) return;
        
        console.log("YT-Bili v2: 找到视频页面，正在注入按钮...");
        
        const videoTitle = getVideoTitle();
        if (!videoTitle) {
            console.log("YT-Bili v2: 未能获取视频标题，等待页面加载...");
            // 如果标题还没加载，等待一下再试
            setTimeout(() => {
                const retryTitle = getVideoTitle();
                if (retryTitle) {
                    console.log("YT-Bili v2: 重试获取视频标题成功:", retryTitle);
                    currentVideoTitle = retryTitle;
                    createSearchButton();
                } else {
                    console.log("YT-Bili v2: 重试后仍未获取到视频标题");
                }
            }, 2000);
            return;
        }

        currentVideoTitle = videoTitle;
        createSearchButton();
        
        // 设置标题变化监听
        setupTitleChangeListener();
    }

    /**
     * 设置标题变化监听器
     */
    function setupTitleChangeListener() {
        // 监听页面内容变化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const videoTitle = getVideoTitle();
                    if (videoTitle && videoTitle !== currentVideoTitle) {
                        console.log("YT-Bili v2: 检测到标题变化:", videoTitle);
                        currentVideoTitle = videoTitle;
                        removeExistingElements();
                        createSearchButton();
                        // 不再自动搜索，等待用户点击
                    }
                }
            });
        });

        // 监听整个文档的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * 获取YouTube视频标题
     */
    function getVideoTitle() {
        const selectors = [
            'h1.ytd-video-primary-info-renderer',
            'h1.ytd-watch-metadata',
            'h1.title',
            '.ytd-video-primary-info-renderer h1',
            'h1[class*="title"]',
            'h1.ytd-video-primary-info-renderer yt-formatted-string',
            'h1.ytd-watch-metadata yt-formatted-string'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }

        return null;
    }

    /**
     * 创建搜索按钮
     */
    function createSearchButton() {
        const button = document.createElement('div');
        button.id = CONFIG.BUTTON_ID;
        button.innerHTML = `
            <div style="
                position: fixed;
                top: 12px;
                right: 240px;
                background: linear-gradient(135deg, #00a1d6, #fb7299);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 12px;
                cursor: pointer;
                opacity: 0.9;
                transition: opacity 0.3s;
                white-space: nowrap;
                z-index: 10000;
            " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.9'">
                🔍 Bilibili
            </div>
        `;
        
        // 添加点击事件
        button.onclick = (event) => {
            // 阻止事件冒泡，避免影响YouTube播放
            event.preventDefault();
            event.stopPropagation();
            
            if (currentVideoTitle) {
                console.log("YT-Bili v2: 用户点击搜索按钮，开始搜索:", currentVideoTitle);
                updateButtonToSearching();
                searchBilibili(currentVideoTitle);
            } else {
                console.log("YT-Bili v2: 当前视频标题为空，无法搜索");
                alert('未能获取当前视频标题，请刷新页面重试');
            }
        };
        
        // 直接添加到body，使用固定定位
        document.body.appendChild(button);
        console.log("YT-Bili v2: 按钮已添加到页面顶部");
    }

    /**
     * 更新按钮为搜索中状态
     */
    function updateButtonToSearching() {
        const button = document.getElementById(CONFIG.BUTTON_ID);
        if (!button) return;
        
        button.innerHTML = `
            <div style="
                position: fixed;
                top: 12px;
                right: 240px;
                background: linear-gradient(135deg, #FF9800, #FFC107);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 12px;
                cursor: pointer;
                opacity: 0.9;
                transition: opacity 0.3s;
                white-space: nowrap;
                z-index: 10000;
            " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.9'">
                ⏳ 搜索中...
            </div>
        `;
    }

    /**
     * 暂停YouTube视频播放
     */
    function pauseYouTubeVideo() {
        try {
            // 尝试多种方式暂停YouTube视频
            const video = document.querySelector('video');
            if (video && !video.paused) {
                video.pause();
                console.log("YT-Bili v2: 已暂停YouTube视频播放");
            }
            
            // 尝试点击暂停按钮
            const pauseButton = document.querySelector('.ytp-play-button[aria-label*="暂停"], .ytp-play-button[aria-label*="Pause"]');
            if (pauseButton && pauseButton.getAttribute('aria-label').includes('播放')) {
                pauseButton.click();
                console.log("YT-Bili v2: 已点击暂停按钮");
            }
        } catch (error) {
            console.log("YT-Bili v2: 暂停视频时出现错误:", error);
        }
    }

    /**
     * 在Bilibili搜索视频 - 基于官方API文档优化，支持Cookie获取
     */
    function searchBilibili(query) {
        // 检查缓存
        const cacheKey = query.toLowerCase().trim();
        const cachedResult = searchCache.get(cacheKey);
        if (cachedResult && Date.now() - cachedResult.timestamp < CONFIG.CACHE_DURATION) {
            console.log("YT-Bili v2: 使用缓存结果");
            handleSearchResult(cachedResult.data);
            return;
        }

        const searchKeywords = titleProcessor.generateSearchKeywords(query);
        console.log("--- YT-Bili v2 开始查找 ---");
        console.log(`YouTube原始标题: ${query}`);
        console.log(`清理后标题: ${searchKeywords.fullTitle}`);
        console.log(`当前匹配阈值: ${(matcher.threshold * 100).toFixed(1)}%`);
        console.log(`搜索前${CONFIG.MAX_SEARCH_RESULTS}个结果`);

        // 首先获取B站cookies，解决412错误
        getBilibiliCookies().then(() => {
            // 使用新的综合搜索API
            const searchUrl = `https://api.bilibili.com/x/web-interface/wbi/search/all/v2?keyword=${encodeURIComponent(searchKeywords.fullTitle)}&page=1&pagesize=${CONFIG.MAX_SEARCH_RESULTS}`;
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: searchUrl,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-site',
                    'Origin': 'https://www.bilibili.com'
                },
                onload: function(response) {
                    console.log("YT-Bili v2: API响应状态:", response.status);
                    console.log("YT-Bili v2: API响应内容:", response.responseText.substring(0, 500));
                    
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            console.log("YT-Bili v2: 解析的API数据:", data);
                            
                            if (data.code === 0 && data.data && data.data.result) {
                                // 新API返回的是综合搜索结果，需要提取视频部分
                                const allResults = data.data.result;
                                let videos = [];
                                
                                // 提取视频结果 - 处理新API的数据结构
                                if (allResults.video && allResults.video.data) {
                                    videos = allResults.video.data.slice(0, CONFIG.MAX_SEARCH_RESULTS);
                                } else if (allResults.result && allResults.result.video && allResults.result.video.data) {
                                    // 另一种可能的嵌套结构
                                    videos = allResults.result.video.data.slice(0, CONFIG.MAX_SEARCH_RESULTS);
                                } else if (Array.isArray(allResults)) {
                                    // 如果直接是视频数组
                                    videos = allResults.slice(0, CONFIG.MAX_SEARCH_RESULTS);
                                } else if (allResults.result && Array.isArray(allResults.result)) {
                                    // 如果result是数组
                                    videos = allResults.result.slice(0, CONFIG.MAX_SEARCH_RESULTS);
                                }
                                
                                // 确保视频数据格式正确
                                videos = videos.filter(video => video && video.title && video.bvid);
                                
                                console.log(`YT-Bili v2: 找到 ${videos.length} 个Bilibili视频（前${CONFIG.MAX_SEARCH_RESULTS}个）`);
                                
                                if (videos.length > 0) {
                                    // 计算每个视频的相似度并过滤低匹配度结果
                                    const rankedVideos = videos.map((video, index) => {
                                        const similarity = matcher.calculateStringSimilarity(query, video.title);
                                        console.log(`YT-Bili v2: [${index + 1}/5] "${video.title}" - 相似度: ${(similarity * 100).toFixed(1)}%`);
                                        return {
                                            ...video,
                                            similarity: similarity,
                                            rank: index + 1
                                        };
                                    })
                                    .filter(video => video.similarity >= matcher.threshold) // 过滤低匹配度结果
                                    .sort((a, b) => b.similarity - a.similarity)
                                    .slice(0, CONFIG.MAX_SEARCH_RESULTS); // 限制显示数量
                                    
                                    console.log(`YT-Bili v2: 过滤后剩余 ${rankedVideos.length} 个匹配结果`);
                                    
                                    const result = {
                                        videos: rankedVideos,
                                        totalSearched: videos.length,
                                        threshold: matcher.threshold,
                                        originalTitle: query
                                    };
                                    
                                    // 缓存结果
                                    searchCache.set(cacheKey, {
                                        data: result,
                                        timestamp: Date.now()
                                    });
                                    
                                    handleSearchResult(result);
                                } else {
                                    console.log("YT-Bili v2: 新API返回无视频结果");
                                    // 尝试备用搜索方法
                                    tryAlternativeSearch(query, searchKeywords.fullTitle);
                                }
                            } else {
                                console.log("YT-Bili v2: API返回错误，错误信息:", data);
                                // 尝试备用搜索方法
                                tryAlternativeSearch(query, searchKeywords.fullTitle);
                            }
                        } catch (error) {
                            console.error("YT-Bili v2: 解析响应失败:", error);
                            // 尝试备用搜索方法
                            tryAlternativeSearch(query, searchKeywords.fullTitle);
                        }
                    } else {
                        console.error("YT-Bili v2: API请求失败:", response.status);
                        // 尝试备用搜索方法
                        tryAlternativeSearch(query, searchKeywords.fullTitle);
                    }
                },
                onerror: function(error) {
                    console.error("YT-Bili v2: 网络请求失败:", error);
                    // 尝试备用搜索方法
                    tryAlternativeSearch(query, searchKeywords.fullTitle);
                }
            });
        }).catch(error => {
            console.error("YT-Bili v2: 获取cookies失败:", error);
            // 直接尝试备用搜索方法
            tryAlternativeSearch(query, searchKeywords.fullTitle);
        });
    }

    /**
     * 获取B站cookies - 解决412错误
     */
    function getBilibiliCookies() {
        return new Promise((resolve, reject) => {
            console.log("YT-Bili v2: 开始获取B站cookies...");
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://www.bilibili.com/',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1'
                },
                onload: function(response) {
                    console.log("YT-Bili v2: 成功获取B站cookies，状态码:", response.status);
                    console.log("YT-Bili v2: 响应头:", response.responseHeaders);
                    resolve();
                },
                onerror: function(error) {
                    console.error("YT-Bili v2: 获取cookies失败:", error);
                    reject(error);
                }
            });
        });
    }

    /**
     * 备用搜索方法 - 使用不同的API端点
     */
    function tryAlternativeSearch(originalQuery, searchTitle) {
        console.log("YT-Bili v2: 尝试备用搜索方法...");
        
        // 尝试不同的API端点
        const alternativeUrls = [
            `https://api.bilibili.com/x/web-interface/search/all/v2?keyword=${encodeURIComponent(searchTitle)}&page=1&pagesize=${CONFIG.MAX_SEARCH_RESULTS}`,
            `https://api.bilibili.com/x/web-interface/search/type?search_type=video&keyword=${encodeURIComponent(searchTitle)}&order=totalrank&duration=0&tids=0&single_column=0&page=1&pagesize=${CONFIG.MAX_SEARCH_RESULTS}`,
            `https://api.bilibili.com/x/web-interface/search/type?search_type=video&keyword=${encodeURIComponent(searchTitle)}&order=update&duration=0&tids=0&single_column=0&page=1&pagesize=${CONFIG.MAX_SEARCH_RESULTS}`
        ];
        
        let currentIndex = 0;
        
        function tryNextUrl() {
            if (currentIndex >= alternativeUrls.length) {
                console.log("YT-Bili v2: 所有备用方法都失败，提供直接跳转");
                handleSearchResult({ 
                    videos: [], 
                    totalSearched: 0, 
                    threshold: matcher.threshold, 
                    originalTitle: originalQuery,
                    fallbackUrl: `https://search.bilibili.com/video?keyword=${encodeURIComponent(searchTitle)}`
                });
                return;
            }
            
            const url = alternativeUrls[currentIndex];
            console.log(`YT-Bili v2: 尝试备用URL ${currentIndex + 1}:`, url);
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
                },
                onload: function(response) {
                    console.log(`YT-Bili v2: 备用API ${currentIndex + 1} 响应状态:`, response.status);
                    
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            
                            if (data.code === 0 && data.data && data.data.result) {
                                let videos = [];
                                
                                // 处理不同的API返回格式
                                if (currentIndex === 0) {
                                    // 新API格式
                                    const allResults = data.data.result;
                                    if (allResults.video && allResults.video.data) {
                                        videos = allResults.video.data.slice(0, CONFIG.MAX_SEARCH_RESULTS);
                                    } else if (allResults.result && allResults.result.video && allResults.result.video.data) {
                                        videos = allResults.result.video.data.slice(0, CONFIG.MAX_SEARCH_RESULTS);
                                    } else if (Array.isArray(allResults)) {
                                        videos = allResults.slice(0, CONFIG.MAX_SEARCH_RESULTS);
                                    } else if (allResults.result && Array.isArray(allResults.result)) {
                                        videos = allResults.result.slice(0, CONFIG.MAX_SEARCH_RESULTS);
                                    }
                                } else {
                                    // 旧API格式
                                    videos = data.data.result.slice(0, CONFIG.MAX_SEARCH_RESULTS);
                                }
                                
                                // 确保视频数据格式正确
                                videos = videos.filter(video => video && video.title && video.bvid);
                                
                                console.log(`YT-Bili v2: 备用方法 ${currentIndex + 1} 找到 ${videos.length} 个视频`);
                                
                                if (videos.length > 0) {
                                    const rankedVideos = videos.map((video, index) => {
                                        const similarity = matcher.calculateStringSimilarity(originalQuery, video.title);
                                        return {
                                            ...video,
                                            similarity: similarity,
                                            rank: index + 1
                                        };
                                    })
                                    .filter(video => video.similarity >= matcher.threshold) // 过滤低匹配度结果
                                    .sort((a, b) => b.similarity - a.similarity)
                                    .slice(0, CONFIG.MAX_SEARCH_RESULTS); // 限制显示数量
                                    
                                    console.log(`YT-Bili v2: 备用方法 ${currentIndex + 1} 过滤后剩余 ${rankedVideos.length} 个匹配结果`);
                                    
                                    if (rankedVideos.length > 0) {
                                        const result = {
                                            videos: rankedVideos,
                                            totalSearched: videos.length,
                                            threshold: matcher.threshold,
                                            originalTitle: originalQuery
                                        };
                                        
                                        handleSearchResult(result);
                                    } else {
                                        console.log(`YT-Bili v2: 备用方法 ${currentIndex + 1} 过滤后无匹配结果`);
                                        currentIndex++;
                                        tryNextUrl();
                                    }
                                } else {
                                    console.log(`YT-Bili v2: 备用方法 ${currentIndex + 1} 也无视频结果`);
                                    currentIndex++;
                                    tryNextUrl();
                                }
                            } else {
                                console.log(`YT-Bili v2: 备用方法 ${currentIndex + 1} 也无结果`);
                                currentIndex++;
                                tryNextUrl();
                            }
                        } catch (error) {
                            console.error(`YT-Bili v2: 备用方法 ${currentIndex + 1} 解析失败:`, error);
                            currentIndex++;
                            tryNextUrl();
                        }
                    } else {
                        console.error(`YT-Bili v2: 备用API ${currentIndex + 1} 请求失败:`, response.status);
                        currentIndex++;
                        tryNextUrl();
                    }
                },
                onerror: function() {
                    console.error(`YT-Bili v2: 备用方法 ${currentIndex + 1} 网络请求失败`);
                    currentIndex++;
                    tryNextUrl();
                }
            });
        }
        
        tryNextUrl();
    }

    /**
     * 处理搜索结果 - 显示选择面板
     */
    function handleSearchResult(result) {
        // 保存当前搜索结果
        currentSearchResult = result;
        
        updateSearchButton(result);
        
        if (result.videos && result.videos.length > 0) {
            showResultsPanel(result);
        }
    }

    /**
     * 更新搜索按钮状态
     */
    function updateSearchButton(result) {
        const button = document.getElementById(CONFIG.BUTTON_ID);
        if (!button) return;

        if (result.videos && result.videos.length > 0) {
            const bestMatch = result.videos[0];
            const color = bestMatch.similarity >= 0.7 ? '#4CAF50' : bestMatch.similarity >= 0.5 ? '#FFC107' : '#FF9800';
            
            button.innerHTML = `
                <div style="
                    position: fixed;
                    top: 12px;
                    right: 240px;
                    background: ${color};
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    font-size: 12px;
                    cursor: pointer;
                    opacity: 0.9;
                    transition: opacity 0.3s;
                    white-space: nowrap;
                    z-index: 10000;
                " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.9'">
                    🎯 ${result.videos.length}个结果
                </div>
            `;
            
            button.onclick = (event) => {
                // 阻止事件冒泡，避免影响YouTube播放
                event.preventDefault();
                event.stopPropagation();
                toggleResultsPanel();
            };
        } else {
            const fallbackUrl = result.fallbackUrl || `https://search.bilibili.com/video?keyword=${encodeURIComponent(titleProcessor.generateSearchKeywords(currentVideoTitle).fullTitle)}`;
            
            button.innerHTML = `
                <div style="
                    position: fixed;
                    top: 12px;
                    right: 240px;
                    background: #FF9800;
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    font-size: 12px;
                    cursor: pointer;
                    opacity: 0.9;
                    transition: opacity 0.3s;
                    white-space: nowrap;
                    z-index: 10000;
                " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.9'">
                    🔍 Bilibili
                </div>
            `;
            
            button.onclick = (event) => {
                // 阻止事件冒泡
                event.preventDefault();
                event.stopPropagation();
                
                // 暂停YouTube播放（用户要离开页面）
                pauseYouTubeVideo();
                
                // 跳转到Bilibili搜索页面
                window.open(fallbackUrl, '_blank');
            };
        }
    }

    /**
     * 显示搜索结果面板 - 优化UI
     */
    function showResultsPanel(result) {
        // 移除已存在的结果面板
        document.getElementById(CONFIG.RESULTS_PANEL_ID)?.remove();

        const panel = document.createElement('div');
        panel.id = CONFIG.RESULTS_PANEL_ID;
        panel.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 450px;
            max-height: 600px;
            overflow-y: auto;
            animation: slideIn 0.3s ease-out;
            border: 1px solid #e0e0e0;
        `;

        let panelContent = `
            <div style="padding: 20px; border-bottom: 1px solid #eee; background: linear-gradient(135deg, #f8f9fa, #ffffff);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h3 style="margin: 0; color: #333; font-size: 18px; font-weight: 600;">🎯 Bilibili搜索结果</h3>
                    <button id="yt-bili-close-panel-v2" style="
                        background: none;
                        border: none;
                        font-size: 20px;
                        cursor: pointer;
                        color: #666;
                        padding: 0;
                        width: 28px;
                        height: 28px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        transition: background-color 0.2s;
                    " onmouseover="this.style.backgroundColor='#f0f0f0'" onmouseout="this.style.backgroundColor='transparent'">×</button>
                </div>
                <div style="font-size: 13px; color: #666; margin-bottom: 8px;">
                    找到 ${result.videos.length} 个结果，按相似度排序
                </div>
                <div style="font-size: 12px; color: #999; font-style: italic;">
                    原始标题: "${result.originalTitle}"
                </div>
            </div>
        `;

        if (result.videos && result.videos.length > 0) {
            result.videos.forEach((video, index) => {
                const similarity = video.similarity;
                const color = similarity >= 0.7 ? '#4CAF50' : similarity >= 0.5 ? '#FFC107' : '#FF9800';
                const rank = video.rank;
                
                // 确保视频信息完整
                const title = video.title || '未知标题';
                const author = video.author || '未知作者';
                const duration = video.duration || '未知时长';
                const bvid = video.bvid || '';
                
                panelContent += `
                    <div class="yt-bili-video-item-v2" data-bvid="${bvid}" style="
                        padding: 16px 20px;
                        border-bottom: 1px solid #f0f0f0;
                        cursor: pointer;
                        transition: all 0.2s;
                        position: relative;
                    " onmouseover="this.style.backgroundColor='#f8f9fa'; this.style.transform='translateX(-2px)'" onmouseout="this.style.backgroundColor='white'; this.style.transform='translateX(0)'">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                            <div style="font-weight: 500; color: #333; font-size: 14px; line-height: 1.4; flex: 1; margin-right: 12px;">
                                ${title}
                            </div>
                            <div style="
                                background: ${color};
                                color: white;
                                padding: 4px 8px;
                                border-radius: 6px;
                                font-size: 12px;
                                font-weight: 600;
                                white-space: nowrap;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            ">
                                ${(similarity * 100).toFixed(0)}%
                            </div>
                        </div>
                        <div style="font-size: 12px; color: #666; margin-bottom: 6px;">
                            <span style="color: #00a1d6;">👤</span> ${author} | <span style="color: #fb7299;">⏱️</span> ${duration} | <span style="color: #999;">#${rank}</span>
                        </div>
                        <div style="font-size: 11px; color: #999; display: flex; align-items: center;">
                            <span style="margin-right: 4px;">🔗</span> 点击跳转到Bilibili观看
                            <span style="margin-left: auto; font-size: 10px; opacity: 0.7;">→</span>
                        </div>
                    </div>
                `;
            });
        } else {
            // 没有匹配结果时的提示
            panelContent += `
                <div style="padding: 20px; text-align: center; color: #666;">
                    <div style="font-size: 16px; margin-bottom: 8px;">🔍</div>
                    <div style="font-size: 14px; margin-bottom: 4px;">未找到匹配的视频</div>
                    <div style="font-size: 12px; color: #999;">匹配度低于 ${(matcher.threshold * 100).toFixed(1)}% 的结果已被过滤</div>
                </div>
            `;
        }

        panelContent += `
            <div style="padding: 16px 20px; text-align: center; border-top: 1px solid #eee; background: #fafafa;">
                <button id="yt-bili-open-search-v2" style="
                    background: linear-gradient(135deg, #00a1d6, #fb7299);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    transition: transform 0.2s;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                " onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">在Bilibili中搜索更多结果</button>
            </div>
        `;

        panel.innerHTML = panelContent;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        // 添加到页面
        document.body.appendChild(panel);

        // 绑定事件
        document.getElementById('yt-bili-close-panel-v2').addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            panel.remove();
            console.log("YT-Bili v2: 用户关闭结果面板");
        });

        document.getElementById('yt-bili-open-search-v2').addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            // 暂停YouTube播放（用户要离开页面）
            pauseYouTubeVideo();
            
            const searchKeywords = titleProcessor.generateSearchKeywords(currentVideoTitle);
            const searchUrl = `https://search.bilibili.com/video?keyword=${encodeURIComponent(searchKeywords.fullTitle)}`;
            window.open(searchUrl, '_blank');
            panel.remove();
            console.log("YT-Bili v2: 用户跳转到Bilibili搜索页面");
        });

        // 绑定视频项点击事件
        const videoItems = panel.querySelectorAll('.yt-bili-video-item-v2');
        videoItems.forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                
                // 暂停YouTube播放（用户要跳转到Bilibili视频）
                pauseYouTubeVideo();
                
                const bvid = item.getAttribute('data-bvid');
                if (bvid) {
                    window.open(`https://www.bilibili.com/video/${bvid}`, '_blank');
                }
            });
        });

        // 点击面板外部关闭
        document.addEventListener('click', function closePanel(e) {
            if (!panel.contains(e.target) && e.target.id !== CONFIG.BUTTON_ID) {
                panel.remove();
                document.removeEventListener('click', closePanel);
                console.log("YT-Bili v2: 用户点击面板外部关闭");
            }
        });
    }

    /**
     * 切换结果面板显示/隐藏
     */
    function toggleResultsPanel() {
        const panel = document.getElementById(CONFIG.RESULTS_PANEL_ID);
        if (panel) {
            panel.remove();
            console.log("YT-Bili v2: 隐藏结果面板");
        } else {
            // 重新显示面板
            if (currentSearchResult && currentSearchResult.videos && currentSearchResult.videos.length > 0) {
                console.log("YT-Bili v2: 重新显示结果面板");
                showResultsPanel(currentSearchResult);
            } else {
                console.log("YT-Bili v2: 无搜索结果，重新搜索");
                // 如果没有搜索结果，重新搜索
                if (currentVideoTitle) {
                    updateButtonToSearching();
                    searchBilibili(currentVideoTitle);
                } else {
                    console.log("YT-Bili v2: 当前视频标题为空，无法重新搜索");
                    alert('当前视频标题为空，请刷新页面重试');
                }
            }
        }
    }

    /**
     * 测试Bilibili API连接
     */
    function testBilibiliAPI() {
        console.log("YT-Bili v2: 开始测试API连接...");
        
        // 首先获取cookies
        getBilibiliCookies().then(() => {
            const testUrl = 'https://api.bilibili.com/x/web-interface/wbi/search/all/v2?keyword=测试&page=1&pagesize=5';
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: testUrl,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/',
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
                },
                onload: function(response) {
                    console.log("YT-Bili v2: API测试响应状态:", response.status);
                    console.log("YT-Bili v2: API测试响应内容:", response.responseText.substring(0, 1000));
                    
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.code === 0) {
                                alert(`API连接成功！\n状态码: ${response.status}\n返回数据: ${JSON.stringify(data, null, 2).substring(0, 500)}`);
                            } else {
                                alert(`API连接成功但返回错误：\n错误码: ${data.code}\n错误信息: ${data.message || '未知错误'}`);
                            }
                        } catch (error) {
                            alert(`API连接成功但解析失败：\n${error.message}\n原始响应：\n${response.responseText.substring(0, 500)}`);
                        }
                    } else {
                        alert(`API连接失败：\n状态码: ${response.status}\n响应内容：\n${response.responseText.substring(0, 500)}`);
                    }
                },
                onerror: function(error) {
                    alert(`API网络请求失败：\n${error.message || '未知网络错误'}`);
                }
            });
        }).catch(error => {
            alert(`获取cookies失败：\n${error.message || '未知错误'}`);
        });
    }

    // 初始化
    setupMenuCommands();
    startUrlDetection();
    
    console.log('YouTube-Bilibili 检测器油猴脚本 v2.3 已加载');
    console.log(`配置: 搜索前${CONFIG.MAX_SEARCH_RESULTS}个结果，默认阈值${(CONFIG.DEFAULT_THRESHOLD * 100).toFixed(1)}%`);
    console.log('基于官方API文档优化，解决412错误');
    console.log('新增Cookie获取机制，确保API正常访问');
    console.log('使用新版综合搜索API: /x/web-interface/wbi/search/all/v2');
    console.log('智能过滤低匹配度结果，避免显示"undefined"');
    console.log('增强的数据解析，支持多种API返回格式');
    console.log('修复面板状态管理，解决返回后按钮无响应问题');
    console.log('增强的视频切换检测已启用');
    console.log('用户点击触发搜索模式已启用');
    console.log('多重备用搜索机制已启用');
    console.log('使用说明：');
    console.log('1. 访问YouTube视频页面');
    console.log('2. 点击右上角的"🔍 Bilibili"按钮');
    console.log('3. 等待搜索结果并选择跳转');
    console.log('4. 或使用菜单中的"直接跳转Bilibili搜索"功能');
    console.log('5. 如遇API问题，可使用"测试Bilibili API连接"菜单命令');
    console.log('6. 低匹配度结果会自动过滤，只显示高质量匹配');
    console.log('7. 从Bilibili返回后，点击结果按钮可重新显示面板');
})(); 
// ==UserScript==
// @name         抖音直播推荐列表显示开播时间
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  显示抖音直播开播时间
// @author       duqings
// @require      https://libs.baidu.com/jquery/2.1.1/jquery.min.js
// @match        *://*.douyin.com/*
// @match        *://douyin.com/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529787/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E6%8E%A8%E8%8D%90%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E5%BC%80%E6%92%AD%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/529787/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E6%8E%A8%E8%8D%90%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E5%BC%80%E6%92%AD%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 调试模式
    const DEBUG = false;
    const log = (...args) => DEBUG && console.log('[抖音直播时间]', ...args);

    log('脚本开始初始化');

    // 存储处理后的直播数据
    let processedLiveData = new Map();

    // 定义需要监听的 API URL 模式
    const API_PATTERNS = [
        '/aweme/v1/web/live/search',
    ];

    // 延迟函数
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 检查 URL 是否匹配任意模式
    function isTargetUrl(url) {
        return API_PATTERNS.some(pattern => url.includes(pattern));
    }

    // 劫持 XMLHttpRequest
    function hookXHR() {
        const originalXHR = unsafeWindow.XMLHttpRequest;
        
        function MyXHR() {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            const originalSend = xhr.send;

            xhr.open = function () {
                const url = arguments[1];
                if (url) {
                    // log('检测到 XHR 请求:', url);
                    if (isTargetUrl(url)) {
                        log('匹配到目标 API 请求:', url);
                        this.isLiveSearchRequest = true;
                    }
                }
                return originalOpen.apply(this, arguments);
            };

            xhr.send = function () {
                if (this.isLiveSearchRequest) {
                    const originalOnReadyStateChange = this.onreadystatechange;
                    this.onreadystatechange = function () {
                        if (this.readyState === 4) {
                            log('API 请求状态:', this.status);
                            if (this.status === 200) {
                                try {
                                    const responseData = JSON.parse(this.responseText);
                                    log('成功获取响应数据');
                                    processLiveData(responseData);
                                } catch (error) {
                                    console.error('处理直播数据时出错:', error);
                                }
                            }
                        }
                        if (originalOnReadyStateChange) {
                            originalOnReadyStateChange.apply(this, arguments);
                        }
                    };
                }
                return originalSend.apply(this, arguments);
            };

            return xhr;
        }

        // 替换原始的 XMLHttpRequest
        unsafeWindow.XMLHttpRequest = MyXHR;
        log('XMLHttpRequest 已被成功劫持');
    }

    // 处理直播数据
    function processLiveData(responseData) {
        if (!responseData?.data?.length) {
            log('返回的数据格式不正确或为空');
            return;
        }

        log('开始处理直播数据，数据条数:', responseData.data.length);

        // 处理每个直播数据
        responseData.data.forEach((item, index) => {
            if (item.type === 1 && item.lives?.rawdata) {
                try {
                    const rawDataStr = item.lives.rawdata.replace(/\.\.\.$/, '');
                    const rawDataObj = JSON.parse(rawDataStr);
                    
                    // 将解析后的数据存储到原始数据中
                    responseData.data[index].rawData = rawDataObj;
                    // 使用Map存储，key为房间ID
                    const webRid = rawDataObj.owner.web_rid;
                    processedLiveData.set(webRid, {
                        webRid,
                        roomId: rawDataObj.id_str,
                        createTime: rawDataObj.create_time,
                        title: rawDataObj.title,
                        userCount: rawDataObj.user_count
                    });
                    
                    log('成功处理直播间数据:', rawDataObj.id_str);
                } catch (error) {
                    console.error('解析rawdata时出错:', error);
                }
            }
        });

        log('数据处理完成，当前缓存数量:', processedLiveData.size);
        
        // 更新页面显示
        updateLiveTimeDisplay();
    }

    // 更新直播时间显示
    async function updateLiveTimeDisplay(useDelay = true) {
        // 等待3秒，确保 dom 完全准备好
        if (useDelay) {
            await delay(1000 * 3);
        }

        // 查找列表主容器
        const searchContainer = document.getElementById('search-result-container');
        if (!searchContainer) {
            log('未找到搜索结果容器');
            return;
        }

        // 先找到所有的 basicPlayer 容器
        const basicPlayers = searchContainer.querySelectorAll('.basicPlayer');
        const liveSearchPlayers = searchContainer.querySelectorAll('.liveSearchPlayer');
        const playerContainers = basicPlayers.length ? basicPlayers : liveSearchPlayers;
        log('找到播放器容器数量:', playerContainers.length);

        playerContainers.forEach(playerContainer => {
            const link = playerContainer.querySelector('a[href*="live.douyin.com"]');
            if (!link) {
                log('播放器容器中未找到直播链接');
                return;
            }

            // 从href中提取房间ID
            const href = link.getAttribute('href');
            const webRidMatch = href.match(/\/(\d+)(?:\?|$)/);
            
            if (!webRidMatch) {
                log('无法从链接提取房间ID:', href);
                return;
            }
            
            const webRid = webRidMatch[1];
            const liveData = processedLiveData.get(webRid);
            
            if (liveData) {
                log('找到直播数据:', liveData.webRid);
                
                // 创建或更新时间显示元素
                let timeElement = playerContainer.querySelector('.live-start-time');
                
                if (!timeElement) {
                    timeElement = document.createElement('div');
                    timeElement.className = 'live-start-time';
                    Object.assign(timeElement.style, {
                        position: 'absolute',
                        bottom: '5px',
                        right: '5px',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '2px 5px',
                        borderRadius: '3px',
                        fontSize: '26px',
                        zIndex: '100'
                    });
                    playerContainer.appendChild(timeElement);
                    log('创建时间显示元素:', webRid);
                }
                
                // 格式化并显示时间
                const startTime = formatTime(liveData.createTime);
                
                // 创建更新时长的函数
                const updateDuration = () => {
                    const duration = Math.floor((Date.now() - liveData.createTime * 1000) / 1000);
                    const durationHours = Math.floor(duration / 3600);
                    const durationMinutes = Math.floor((duration % 3600) / 60);
                    const durationSeconds = duration % 60;
                    timeElement.textContent = `开播时间: ${startTime}，开播时长: ${durationHours}小时${durationMinutes}分钟${durationSeconds}秒`;
                };
                
                // 立即更新
                updateDuration();
                
                // 设置定时器每秒更新一次
                const timerId = setInterval(updateDuration, 1000);
                
                timeElement.dataset.timerId = timerId;
                
                log('更新时间显示:', webRid, startTime);
            } else {
                log('未找到直播数据:', webRid);
            }
        });
    }

    // 格式化时间戳为可读时间
    function formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // 监听DOM变化
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                const hasNewLiveLinks = Array.from(mutation.addedNodes).some(node => {
                    return node.nodeType === 1 && (
                        node.querySelector('a[href*="live.douyin.com"]') ||
                        (node.tagName === 'A' && node.href?.includes('live.douyin.com'))
                    );
                });
                
                if (hasNewLiveLinks) {
                    shouldUpdate = true;
                    break;
                }
            }
        }
        
        if (shouldUpdate && processedLiveData.size > 0) {
            updateLiveTimeDisplay(false);
        }
    });

    // 初始化
    function initialize() {
        log('开始初始化脚本');
        hookXHR();
        
        // 开始监听DOM变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        log('初始化完成');
    }

    // 确保在页面加载开始时就运行初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();

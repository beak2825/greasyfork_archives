// ==UserScript==
// @name         微博newlogin帖子抓取器
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  抓取微博newlogin页面上的帖子内容、用户信息和互动数据
// @author       稳稳
// @match        https://weibo.com/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528952/%E5%BE%AE%E5%8D%9Anewlogin%E5%B8%96%E5%AD%90%E6%8A%93%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/528952/%E5%BE%AE%E5%8D%9Anewlogin%E5%B8%96%E5%AD%90%E6%8A%93%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        SCROLL_DELAY: {
            MIN: 1000,
            MAX: 12000
        },
        DETAIL_DELAY: {
            MIN: 3000,
            MAX: 8000
        },
        LOAD_CHECK_DELAY: {
            MIN: 500,
            MAX: 5000
        },
        DETAIL_TIMEOUT: 30000,
        BOTTOM_CHECK_RETRIES: 10,
        BOTTOM_CHECK_DELAY: {
            MIN: 1000,
            MAX: 5000
        },
        // 添加页面刷新配置
        PAGE_REFRESH: {
            MIN_INTERVAL: 10000,  // 最小刷新间隔：10秒
            MAX_INTERVAL: 60000,  // 最大刷新间隔：1分钟
            CHANCE: 0.3           // 触发刷新的概率：30%
        },
        // 添加日志配置
        LOG_LEVELS: {
            INFO: '✅',
            WARN: '⚠️',
            ERROR: '❌',
            SUCCESS: '🎉'
        }
    };

    let lastHeight = 0;
    const processedPosts = new Set();  // Rename from 'posts' to 'processedPosts'
    const allData = [];
    let isScrolling = false;
    let targetCount = Infinity;
    let isPaused = false;
    let currentDetailPost = null;
    let resumeCallback = null;
    let isLoopScraping = false;

    // 创建进度面板
    const progressPanel = document.createElement('div');
    progressPanel.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px;
        border-radius: 8px;
        font-size: 14px;
        min-width: 200px;
        display: none;
    `;

    const progressContent = document.createElement('div');
    progressContent.innerHTML = `
        <div style="margin-bottom: 10px;">
            <span>状态：</span>
            <span id="scrapeStatus">准备开始</span>
        </div>
        <div style="margin-bottom: 10px;">
            <span>已抓取：</span>
            <span id="scrapeCount">0</span> 条
        </div>
        <div style="margin-bottom: 10px;">
            <span>当前用户：</span>
            <span id="currentAuthor">-</span>
        </div>
        <div style="margin-bottom: 10px; word-break: break-all;">
            <span>当前内容：</span>
            <span id="currentContent">-</span>
        </div>
        <div style="margin-bottom: 10px;">
            <span>互动数据：</span>
            <span id="currentInteractions">-</span>
        </div>
        <div style="margin-bottom: 10px;">
            <span>上传状态：</span>
            <span id="uploadStatus">-</span>
        </div>
    `;
    progressPanel.appendChild(progressContent);
    document.body.appendChild(progressPanel);

    // 创建控制面板
    const controlPanel = document.createElement('div');
    controlPanel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;

    controlPanel.innerHTML = `
        <div style="margin-bottom: 10px;">
            <label>目标数量：</label>
            <input type="number" id="targetCount" value="100" min="1" style="width: 80px;">
        </div>
        <div style="margin-bottom: 10px;">
            <label>
                <input type="checkbox" id="loopMode"> 循环模式
            </label>
        </div>
        <div>
            <button id="startButton" style="margin-right: 10px;">开始采集</button>
            <button id="pauseButton" disabled>暂停</button>
        </div>
    `;

    document.body.appendChild(controlPanel);

    // 初始化控制按钮事件
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const loopModeCheckbox = document.getElementById('loopMode');

    startButton.addEventListener('click', () => {
        const targetInput = document.getElementById('targetCount');
        targetCount = parseInt(targetInput.value) || Infinity;
        isLoopScraping = loopModeCheckbox.checked;

        startButton.disabled = true;
        pauseButton.disabled = false;
        progressPanel.style.display = 'block';
        
        if (!isScrolling) {
            scrollAndExtract();
        }
    });

    pauseButton.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? '继续' : '暂停';
        if (!isPaused && resumeCallback) {
            resumeCallback();
            resumeCallback = null;
        }
    });

    // 待实现的核心功能函数
    function getRandomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function updateProgress(status, count, currentPost) {
        document.getElementById('scrapeStatus').textContent = status;
        if (count !== undefined) {
            document.getElementById('scrapeCount').textContent = count;
        }
        if (currentPost) {
            document.getElementById('currentAuthor').textContent = currentPost.author?.name || '-';
            document.getElementById('currentContent').textContent = 
                currentPost.content ? `${currentPost.content.substring(0, 50)}...` : '-';
            document.getElementById('currentInteractions').textContent = 
                `点赞:${currentPost.interactions?.likes || '0'} 转发:${currentPost.interactions?.reposts || '0'} 评论:${currentPost.interactions?.comments || '0'}`;
        }
    }

    // 提取帖子信息
    // 添加日志配置


    // 日志函数保持不变
    function log(level, message, data = null) {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = CONFIG.LOG_LEVELS[level] || '📝';
        
        console.log(`${prefix} [${timestamp}] ${message}`);
        if (data) {
            console.log('详细数据:', data);
        }
    }

    // 提取帖子信息
    async function extractPostInfo() {
        if (allData.length >= targetCount) {
            log('INFO', '已达到目标数量，停止抓取');
            return false;
        }

        const postElements = document.querySelectorAll('[class*="Feed_"]');
        log('INFO', `发现 ${postElements.length} 条微博`);
        let newItemsCount = 0;
        let newItems = [];
    
        for (const post of postElements) {
            if (allData.length >= targetCount) {
                break;
            }
    
            const weiboId = post.querySelector('a[href*="/"][title*="2"]')?.href.match(/\/(\w+)$/)?.[1];
            if (!weiboId || processedPosts.has(weiboId)) {
                if (processedPosts.has(weiboId)) {
                    log('INFO', `跳过重复微博: ${weiboId}`);
                }
                continue;
            }
            
            const authorElement = post.querySelector('a[class*="ALink"][usercard]');
            const authorName = authorElement?.querySelector('span')?.textContent.trim() || '';
            const contentElement = post.querySelector('[class*="wbtext"]');
            const content = contentElement ? contentElement.textContent.trim() : '';
            
            log('INFO', `正在处理微博 ${weiboId}`, {
                author: authorName,
                content: content.substring(0, 50) + '...'
            });
            
            const authorLink = authorElement?.href || '';
            const authorVerified = post.querySelector('[title*="微博"]')?.title || '';
    
            const timeElement = post.querySelector('a[title*="202"]');
            const postTime = timeElement?.title || timeElement?.textContent.trim() || '';
    
            const interactionElements = post.querySelectorAll('[class*="toolbar"] [class*="num"]');
            const [reposts = '0', comments = '0', likes = '0'] = Array.from(interactionElements).map(el => 
                el.textContent.trim().replace(/[^0-9]/g, '')
            );
    
            processedPosts.add(weiboId);  // Use processedPosts instead of posts
            newItemsCount++;
    
            const postData = {
                weiboId,
                content,
                author: {
                    name: authorName,
                    link: authorLink,
                    verified: authorVerified
                },
                postTime,
                interactions: {
                    reposts: parseInt(reposts) || 0,
                    comments: parseInt(comments) || 0,
                    likes: parseInt(likes) || 0
                }
            };

            newItems.push(postData);
        }

        if (newItems.length > 0) {
            for (const item of newItems) {
                try {
                    updateProgress('正在上传数据', allData.length, item);
                    await uploadToServer(item);
                    allData.push(item);
                } catch (error) {
                    console.error('数据上传失败:', error);
                }
            }
        }

        return newItemsCount > 0;
    }

    // 上传数据到服务器
    async function uploadToServer(data) {
        log('INFO', '准备上传数据', {
            weiboId: data.weiboId,
            author: data.author.name
        });

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'http://localhost:8888/weibo-server/save_post.php',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: JSON.stringify(data),
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.success) {
                            log('SUCCESS', `微博 ${data.weiboId} 上传成功`);
                            document.getElementById('uploadStatus').textContent = '上传成功';
                            resolve(result);
                        } else {
                            log('ERROR', `微博 ${data.weiboId} 上传失败`, result);
                            document.getElementById('uploadStatus').textContent = '上传失败: ' + result.message;
                            reject(new Error(result.message));
                        }
                    } catch (e) {
                        log('ERROR', '解析响应失败', e);
                        document.getElementById('uploadStatus').textContent = '上传失败: ' + e.message;
                        reject(e);
                    }
                },
                onerror: function(error) {
                    log('ERROR', '网络请求失败', error);
                    document.getElementById('uploadStatus').textContent = '上传失败';
                    reject(error);
                }
            });
        });
    }

    // 滚动并提取数据
    async function scrollAndExtract() {
        if (isPaused) {
            log('INFO', '暂停中');
            return;
        }

        if (isLoopScraping && Math.random() < CONFIG.PAGE_REFRESH.CHANCE) {
            const refreshDelay = getRandomDelay(CONFIG.PAGE_REFRESH.MIN_INTERVAL, CONFIG.PAGE_REFRESH.MAX_INTERVAL);
            log('INFO', `计划在 ${Math.floor(refreshDelay/1000)} 秒后刷新页面`);
            updateProgress('即将刷新页面以获取新内容...', allData.length);
            setTimeout(() => {
                window.location.reload();
            }, refreshDelay);
            return;
        }

        if (!isScrolling) {
            isScrolling = true;
            progressPanel.style.display = 'block';
            updateProgress('开始抓取', 0);
        }

        const hasNewItems = await extractPostInfo();
        const currentHeight = document.documentElement.scrollHeight;

        if (allData.length >= targetCount) {
            console.log('达到目标数量');
            updateProgress('抓取完成', allData.length);
            isScrolling = false;
            startButton.disabled = false;
            startButton.textContent = '开始采集';
            return;
        }

        if (currentHeight === lastHeight && !hasNewItems) {
            let retryCount = 0;

            while (retryCount < CONFIG.BOTTOM_CHECK_RETRIES) {
                updateProgress('检查是否到底', allData.length);
                console.log(`额外滚动检查 ${retryCount + 1}/${CONFIG.BOTTOM_CHECK_RETRIES}`);

                window.scrollTo(0, document.documentElement.scrollHeight);
                await new Promise(resolve => setTimeout(resolve, 
                    getRandomDelay(CONFIG.BOTTOM_CHECK_DELAY.MIN, CONFIG.BOTTOM_CHECK_DELAY.MAX)));

                const newHeight = document.documentElement.scrollHeight;
                const hasMoreItems = await extractPostInfo();

                if (newHeight > currentHeight || hasMoreItems) {
                    lastHeight = newHeight;
                    setTimeout(scrollAndExtract, 
                        getRandomDelay(CONFIG.SCROLL_DELAY.MIN, CONFIG.SCROLL_DELAY.MAX));
                    return;
                }

                retryCount++;
            }

            console.log('已到达页面底部');
            updateProgress('抓取完成', allData.length);
            isScrolling = false;
            startButton.disabled = false;
            startButton.textContent = '开始采集';
            
            if (isLoopScraping) {
                console.log('循环采集模式：准备刷新页面...');
                updateProgress('准备开始下一轮采集...', allData.length);
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
            return;
        }

        lastHeight = currentHeight;
        window.scrollTo(0, currentHeight);
        setTimeout(scrollAndExtract, 
            getRandomDelay(CONFIG.SCROLL_DELAY.MIN, CONFIG.SCROLL_DELAY.MAX));
    }

})();
// ==UserScript==
// @name         豆瓣推荐页面爬取器
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  抓取豆瓣推荐页面的帖子信息
// @author       稳稳
// @match        https://www.douban.com/explore/recommend*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528880/%E8%B1%86%E7%93%A3%E6%8E%A8%E8%8D%90%E9%A1%B5%E9%9D%A2%E7%88%AC%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/528880/%E8%B1%86%E7%93%A3%E6%8E%A8%E8%8D%90%E9%A1%B5%E9%9D%A2%E7%88%AC%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        API_HOST: 'http://192.168.1.8:8888',  // 服务器IP地址
        SCROLL_DELAY: {
            MIN: 2000,
            MAX: 5000
        },
        PAGE_LOAD_DELAY: {
            MIN: 3000,
            MAX: 15000
        },
        DETAIL_DELAY: {
            MIN: 3000,
            MAX: 8000
        },
        BOTTOM_CHECK_RETRIES: 5,
        BOTTOM_CHECK_DELAY: {
            MIN: 2000,
            MAX: 4000
        }
    };

    // 全局变量
    let lastHeight = 0;
    const posts = new Set();
    const allData = [];
    let isScrolling = false;
    let targetCount = 200;
    let searchKeyword = '';
    let isPaused = false;

    // 创建进度面板
    const progressPanel = document.createElement('div');
    progressPanel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.95);
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 99999;
        width: 300px;
        max-height: 200px;
        overflow-y: auto;
        font-size: 14px;
        color: #333;
        border: 1px solid #ddd;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
    `;

    progressPanel.innerHTML = `
        <div id="scrapeStatus" style="color: #1a73e8; font-weight: bold; margin-bottom: 8px;">准备开始...</div>
        <div id="scrapeCount" style="color: #28a745; margin-bottom: 8px;">进度: 0/200</div>
        <div id="currentTitle" style="color: #333; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</div>
        <div id="currentInteractions" style="color: #666; margin-bottom: 8px;">点赞:0 收藏:0 评论:0</div>
        <div id="uploadStatus" style="color: #dc3545; margin-bottom: 12px;">-</div>
        <div id="controls" style="display: flex; gap: 8px;">
            <button id="startButton" style="flex: 1; padding: 6px; background: #1a73e8; color: white; border: none; border-radius: 4px; cursor: pointer;">开始采集</button>
            <button id="pauseButton" style="flex: 1; padding: 6px; background: #ffc107; color: #000; border: none; border-radius: 4px; cursor: pointer;">暂停</button>
            <button id="stopButton" style="flex: 1; padding: 6px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">停止</button>
        </div>
    `;

    // 确保面板添加到页面并可见
    document.body.appendChild(progressPanel);
    setTimeout(() => {
        progressPanel.style.display = 'block';
        progressPanel.style.visibility = 'visible';
        progressPanel.style.opacity = '1';
    }, 1000);

        // 添加事件监听
    // 修改按钮逻辑
    let isStopped = false;

    document.getElementById('startButton').addEventListener('click', () => {
        if (isStopped || !isScrolling) {
            isStopped = false;
            isPaused = false;
            document.getElementById('pauseButton').textContent = '暂停';
            startScraping();
        }
    });

    document.getElementById('pauseButton').addEventListener('click', () => {
        if (!isStopped) {
            isPaused = !isPaused;
            const pauseButton = document.getElementById('pauseButton');
            pauseButton.textContent = isPaused ? '继续' : '暂停';
            pauseButton.style.background = isPaused ? '#28a745' : '#ffc107';
            
            if (!isPaused) {
                // 恢复抓取
                autoScroll();
            }
        }
    });

    document.getElementById('stopButton').addEventListener('click', () => {
        isStopped = true;
        isPaused = true;
        isScrolling = false;
        document.getElementById('scrapeStatus').textContent = '已停止抓取';
        document.getElementById('pauseButton').textContent = '暂停';
        // 移除这行，让面板保持显示
        // progressPanel.style.display = 'none';
    });

    // 修改更新进度函数
    function updateProgress(status, count, processedCount = 0, totalCount = 0, currentPost = null) {
        document.getElementById('scrapeStatus').textContent = status;
        document.getElementById('scrapeCount').textContent = `进度: ${count}/200`;
        
        if (currentPost) {
            // 优先使用标题，如果标题太长则截断
            const displayTitle = currentPost.title || '-';
            document.getElementById('currentTitle').textContent = 
                displayTitle.length > 30 ? displayTitle.substring(0, 30) + '...' : displayTitle;
            
            const interactions = currentPost.interactions || {};
            document.getElementById('currentInteractions').textContent =
                `点赞:${interactions.likes || '0'} 收藏:${interactions.collects || '0'} 评论:${interactions.comments || '0'}`;
        }
    }

    // 随机延迟函数
    function getRandomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 检查帖子是否存在
    async function checkNoteExists(detailUrl) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${CONFIG.API_HOST}/douban-server/douban_recommend/check_recommend_note.php?detail_url=${encodeURIComponent(detailUrl)}`,
                headers: {
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                timeout: 30000,
                onload: function(response) {
                    try {
                        // 检查响应对象的有效性
                        if (!response) {
                            console.error('检查帖子是否存在失败: 响应对象为空');
                            resolve(false);
                            return;
                        }

                        // 检查响应状态码
                        if (response.status !== 200) {
                            console.error(`检查帖子是否存在失败: HTTP状态码 ${response.status}`);
                            resolve(false);
                            return;
                        }

                        // 检查响应内容类型
                        const contentType = response.responseHeaders?.toLowerCase() || '';
                        if (!contentType.includes('application/json')) {
                            console.warn('响应内容类型不是JSON，但将继续尝试解析');
                        }

                        // 检查并预处理响应文本
                        const responseText = response.responseText?.trim();
                        if (!responseText) {
                            console.error('检查帖子是否存在失败: 响应内容为空');
                            resolve(false);
                            return;
                        }

                        // 尝试解析JSON，并进行数据验证
                        const result = JSON.parse(responseText);
                        if (!result || typeof result !== 'object') {
                            console.error('检查帖子是否存在失败: 无效的JSON格式');
                            resolve(false);
                            return;
                        }

                        // 检查API响应的业务状态
                        if (result.success === false) {
                            console.error('检查帖子是否存在的API调用失败:', result.message || '未知错误');
                            resolve(false);
                            return;
                        }

                        // 返回存在性检查结果
                        resolve(result.exists === true);

                    } catch (error) {
                        console.error('检查帖子是否存在时发生错误:', error.message);
                        if (response?.responseText) {
                            console.debug('原始响应内容:', response.responseText);
                        }
                        resolve(false);
                    }
                },
                onerror: function(error) {
                    console.error('检查帖子请求失败:', error?.message || '未知网络错误');
                    resolve(false);
                },
                ontimeout: function() {
                    console.error('检查帖子请求超时');
                    resolve(false);
                }
            });
        });
    }

    // 上传数据到服务器
    async function uploadToServer(data) {
        try {
            const validatedData = validateData(data);
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    // 修改接口路径
                    url: `${CONFIG.API_HOST}/douban-server/douban_recommend/save_recommend_note.php`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    data: JSON.stringify(validatedData),
                    onload: function(response) {
                        try {
                            const result = JSON.parse(response.responseText);
                            if (result.success) {
                                resolve(result);
                            } else {
                                reject(new Error(result.message));
                            }
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: function(error) {
                        reject(error);
                    }
                });
            });
        } catch (error) {
            throw error;
        }
    }

    // 数据验证函数
    function validateData(data) {
        return {
            note_id: data.noteId || '',
            title: data.title || '',  // 允许标题为空字符串
            preview_content: data.content ? data.content.substring(0, 200) : '',
            content: data.content || '',  // 允许内容为空字符串
            author_name: data.author?.name || null,
            author_link: data.author?.link || null,
            publish_date: null,
            detail_url: data.detailUrl,
            search_keyword: data.searchKeyword || null,
            likes_count: parseInt(data.interactions?.likes || '0'),
            reshares_count: parseInt(data.interactions?.reshares || '0'),
            comments_count: parseInt(data.interactions?.comments || '0'),
            topic_words: data.topic || null,
            tags: null
        };
    }

    // 开始抓取函数
    async function startScraping() {
        if (isScrolling) return;
        
        // 确保面板可见
        progressPanel.style.display = 'block';
        progressPanel.style.visibility = 'visible';
        
        isScrolling = true;
        isPaused = false;
        
        posts.clear();
        allData.length = 0;
        
        try {
            updateProgress('开始抓取帖子', 0);
            await autoScroll();
            console.log(`成功抓取 ${allData.length} 条帖子`);
            updateProgress('抓取完成', allData.length);
        } catch (error) {
            console.error('抓取过程出错:', error);
            updateProgress('抓取出错: ' + error.message, allData.length);
        }
        
        isScrolling = false;
    }

    // 自动滚动函数
    async function autoScroll() {
        if (isPaused) return;
        
        let lastProcessedHeight = 0;
        let noNewItemsCount = 0;
        const MAX_NO_NEW_ITEMS = CONFIG.BOTTOM_CHECK_RETRIES;

        while (!isPaused && allData.length < targetCount) {
            const hasNewItems = await extractPostInfo();
            
            if (allData.length >= targetCount) {
                updateProgress('抓取完成', allData.length);
                return true;
            }

            const currentHeight = document.documentElement.scrollHeight;
            if (!hasNewItems && currentHeight === lastProcessedHeight) {
                noNewItemsCount++;
                if (noNewItemsCount >= MAX_NO_NEW_ITEMS) {
                    // 检查是否存在"加载更多"按钮
                    const loadMoreBtn = document.querySelector('.gallery-more .a_more');
                    if (loadMoreBtn) {
                        updateProgress('点击加载更多...', allData.length);
                        loadMoreBtn.click();
                        // 等待新内容加载
                        await new Promise(resolve => setTimeout(resolve, getRandomDelay(CONFIG.PAGE_LOAD_DELAY.MIN, CONFIG.PAGE_LOAD_DELAY.MAX)));
                    } else {
                        updateProgress('等待新内容加载...', allData.length);
                        await new Promise(resolve => setTimeout(resolve, getRandomDelay(CONFIG.BOTTOM_CHECK_DELAY.MIN, CONFIG.BOTTOM_CHECK_DELAY.MAX)));
                    }
                    noNewItemsCount = 0;
                }
            } else {
                noNewItemsCount = 0;
            }

            lastProcessedHeight = currentHeight;
            window.scrollBy(0, Math.floor(Math.random() * 300) + 200);
            await new Promise(resolve => setTimeout(resolve, getRandomDelay(CONFIG.SCROLL_DELAY.MIN, CONFIG.SCROLL_DELAY.MAX)));
        }

        return true;
    }

    // 提取帖子信息函数
    async function extractPostInfo() {
        if (allData.length >= targetCount) return false;
    
        const feedItems = document.querySelectorAll('.item');
        let newItemsCount = 0;
        let skippedItems = 0;
    
        for (const item of feedItems) {
            try {
                if (allData.length >= targetCount) return true;
    
                // 获取内容区域
                const contentElement = item.querySelector('div.content');
                if (!contentElement) {
                    console.log('跳过原因: 未找到内容区域');
                    continue;
                }
    
                // 优先获取内容区域中的链接文本
                let mainText = '';
                const contentParagraphs = contentElement.querySelectorAll('p');
                for (const p of contentParagraphs) {
                    const linkInP = p.querySelector('a');
                    if (linkInP && linkInP.textContent.trim()) {
                        mainText = linkInP.textContent.trim();
                        break;
                    }
                }
    
                // 如果没有找到链接文本，则使用整个内容区域的文本
                if (!mainText) {
                    mainText = contentElement.textContent.trim();
                    console.log('使用内容区域的完整文本');
                }
                
                // 移除内容验证条件，允许空内容通过
                console.log('当前内容长度:', mainText.length);
                
                // 获取帖子链接
                let moreLink = '';
                const contentLinks = contentElement.querySelectorAll('a');
                for (const link of contentLinks) {
                    if (link.href && (link.href.includes('/group/topic/') || link.href.includes('/topic/'))) {
                        moreLink = link.href;
                        break;
                    }
                }
                
                if (!moreLink) {
                    const titleElement = item.querySelector('.title a');
                    if (titleElement && titleElement.href) {
                        moreLink = titleElement.href;
                    } else {
                        console.log('跳过原因: 未找到有效的帖子链接');
                        continue;
                    }
                }
    
                const uriMatch = moreLink.match(/\/(?:group\/)?topic\/(\d+)/);
                if (!uriMatch) {
                    console.log('跳过原因: 链接格式不符合要求', moreLink);
                    continue;
                }
    
                const noteId = uriMatch[1];
                if (posts.has(noteId)) {
                    console.log('跳过原因: 帖子已经被抓取过', noteId);
                    continue;
                }
    
                const detailUrl = `https://www.douban.com/topic/${noteId}`;  // 统一使用 /topic/ 格式
                const exists = await checkNoteExists(detailUrl);
                if (exists) {
                    skippedItems++;
                    posts.add(noteId);
                    continue;
                }
    
                // 获取作者信息
                const authorElement = item.querySelector('.usr-pic a:nth-child(2)');
                const authorName = authorElement ? authorElement.textContent.trim() : '';
                const authorLink = authorElement?.href || '';
                
                // 获取标题
                let titleText = '';
                const titleElement = item.querySelector('.title a');
                if (titleElement && titleElement.textContent.trim()) {
                    titleText = titleElement.textContent.trim();
                } else {
                    // 如果没有标题，使用内容的前20个字作为标题
                    titleText = mainText.length > 15 ? mainText.substring(0, 15) + '...' : mainText;
                }
                
                // 获取实际内容（排除标题和作者信息后的文本）
                const content = contentElement ? Array.from(contentElement.childNodes)
                    .filter(node => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            return node.textContent.trim().length > 0;
                        }
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            return !node.classList.contains('title') && 
                                   !node.classList.contains('usr-pic');
                        }
                        return false;
                    })
                    .map(node => node.textContent.trim())
                    .filter(text => text.length > 0)
                    .join('\n')
                    .trim() : '';

                // 获取互动数据
                const actionsElement = item.querySelector('.actions');
                let likes = 0, comments = 0, reshares = 0;
                
                if (actionsElement) {
                    // 获取回应数
                    const replyElement = actionsElement.querySelector('.btn-action-reply');
                    if (replyElement) {
                        const replyText = replyElement.textContent.trim();
                        const replyMatch = replyText.match(/(\d+)回应/);
                        if (replyMatch) comments = parseInt(replyMatch[1]);
                    }

                    // 获取点赞数
                    const likeElement = actionsElement.querySelector('.btn-like');
                    if (likeElement) {
                        const likeCountElement = actionsElement.querySelector('span');
                        if (likeCountElement) {
                            const likeText = likeCountElement.textContent.trim();
                            const likeMatch = likeText.match(/\((\d+)\)/);
                            if (likeMatch) likes = parseInt(likeMatch[1]);
                        }
                    }

                    // 获取转发数
                    const reshareElement = actionsElement.querySelector('.reshared-count');
                    if (reshareElement) {
                        const reshareText = reshareElement.textContent.trim();
                        const reshareMatch = reshareText.match(/(\d+)转发/);
                        if (reshareMatch) reshares = parseInt(reshareMatch[1]);
                    }
                }
    
                posts.add(noteId);
                newItemsCount++;
    
                const postData = {
                    title: titleText,
                    content: mainText,
                    noteId,
                    detailUrl,
                    author: {
                        name: authorName,
                        link: authorLink
                    },
                    interactions: {
                        likes,
                        reshares,
                        comments
                    },
                    topic: '',
                    searchKeyword
                };
    
                try {
                    updateProgress('正在上传数据', allData.length, newItemsCount, skippedItems, postData);
                    await uploadToServer(postData);
                    allData.push(postData);
                } catch (error) {
                    console.error('数据上传失败:', error);
                }
    
                await new Promise(resolve => setTimeout(resolve, getRandomDelay(CONFIG.DETAIL_DELAY.MIN, CONFIG.DETAIL_DELAY.MAX)));
            } catch (error) {
                console.error('处理帖子时出错:', error);
                continue;
            }
        }
    
        return newItemsCount > 0 || skippedItems > 0;
    }
}());

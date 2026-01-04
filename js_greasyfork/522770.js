// ==UserScript==
// @name         小红书帖子抓取器
// @namespace    http://tampermonkey.net/
// @version      0.97
// @description  抓取小红书页面上的帖子标题、链接和点赞数
// @author       dawne
// @match        https://www.xiaohongshu.com/*
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @license       未经许可不得用作任何用途
// @downloadURL https://update.greasyfork.org/scripts/522770/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%B8%96%E5%AD%90%E6%8A%93%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/522770/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%B8%96%E5%AD%90%E6%8A%93%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const CONFIG = {

        SCROLL_DELAY: {
            MIN: 0,
            MAX: 1000
        },

        PAGE_LOAD_DELAY: {
            MIN: 2000,
            MAX: 12000
        },

        DETAIL_DELAY: {
            MIN: 2000,
            MAX: 5000
        },

        CAPTCHA_CHECK_DELAY: 2000,

        LOAD_CHECK_DELAY: 500,

        DETAIL_TIMEOUT: 30000,

        BOTTOM_CHECK_RETRIES: 5,

        BOTTOM_CHECK_DELAY: {
            MIN: 1000,
            MAX: 2000
        }
    };

    let lastHeight = 0;
    const posts = new Set();
    const allData = [];
    let isScrolling = false;
    let isProcessingDetails = false;
    let currentProcessingIndex = 0;
    let targetCount = Infinity;
    let searchKeyword = '';
    let isPaused = false;
    let currentDetailPost = null;
    let resumeCallback = null;
    let isLoopScraping = false;
    const STORAGE_KEY = 'xhs_scraper_state';


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
            <span>已抓取列表：</span>
            <span id="scrapeCount">0</span> 条
        </div>
        <div style="margin-bottom: 10px;">
            <span>详情进度：</span>
            <span id="detailProgress">0</span> / <span id="detailTotal">0</span>
        </div>
        <div style="margin-bottom: 10px; word-break: break-all;">
            <span>当前标题：</span>
            <span id="currentTitle">-</span>
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


    function updateProgress(status, count, detailCurrent, detailTotal, currentPost) {
        document.getElementById('scrapeStatus').textContent = status;
        if (count !== undefined) document.getElementById('scrapeCount').textContent = count;
        if (detailCurrent !== undefined) document.getElementById('detailProgress').textContent = detailCurrent;
        if (detailTotal !== undefined) document.getElementById('detailTotal').textContent = detailTotal;


        if (currentPost) {
            document.getElementById('currentTitle').textContent = currentPost.title || '-';
            const interactions = currentPost.interactions || {};
            document.getElementById('currentInteractions').textContent =
                `点赞:${interactions.likes || '0'} 收藏:${interactions.collects || '0'} 评论:${interactions.comments || '0'}`;
        }
    }


    function parseCount(countStr) {
        if (!countStr) return 0;
        countStr = countStr.trim();


        if (countStr.includes('万')) {
            const num = parseFloat(countStr.replace('万', ''));
            return Math.round(num * 10000);
        }

        return parseInt(countStr) || 0;
    }


    async function getPostDetail(postData) {
        return new Promise((resolve) => {
            const noteItem = document.querySelector(`a[href*="${postData.noteId}"]`).closest('.note-item');
            if (!noteItem) {
                console.error('找不到对应的笔记卡片元素');
                resolve(postData);
                return;
            }

            const coverLink = noteItem.querySelector('.cover');
            if (coverLink) {
                coverLink.click();
            }

            currentDetailPost = postData;

            const checkInterval = setInterval(async () => {
                try {

                    const detailModal = document.querySelector('.note-detail-mask');
                    if (!detailModal) return;

                    await new Promise(resolve => setTimeout(resolve, 3000));


                    const contentElement = detailModal.querySelector('#detail-desc .note-text');
                    const content = contentElement ? contentElement.textContent.trim() : '';


                    const tags = Array.from(detailModal.querySelectorAll('#hash-tag'))
                        .map(tag => tag.textContent.trim());

                    const dateElement = detailModal.querySelector('.date');
                    const publishDate = dateElement ? dateElement.textContent.trim() : '';

                    let likes = '0', collects = '0', comments = '0';

                    const interactionContainer = detailModal.querySelector('.interactions.engage-bar');
                    if (interactionContainer) {
                        const likeElement = interactionContainer.querySelector('.like-wrapper .count');
                        likes = likeElement ? parseCount(likeElement.textContent) : 0;

                        const collectElement = interactionContainer.querySelector('.collect-wrapper .count');
                        collects = collectElement ? parseCount(collectElement.textContent) : 0;

                        const commentElement = interactionContainer.querySelector('.chat-wrapper .count');
                        comments = commentElement ? parseCount(commentElement.textContent) : 0;
                    }

                    postData.content = content;
                    postData.tags = tags;
                    postData.publishDate = publishDate;
                    postData.detailUrl = `https://www.xiaohongshu.com/explore/${postData.noteId}`;
                    postData.interactions = {
                        likes,
                        collects,
                        comments
                    };

                    await new Promise(resolve => setTimeout(resolve, 500));

                    const closeButton = detailModal.querySelector('.close-circle .close');
                    if (closeButton) {
                        closeButton.click();
                    }

                    clearInterval(checkInterval);
                    currentDetailPost = null;
                    resolve(postData);

                } catch (e) {
                    console.log('等待详情弹窗加载...', e);
                }
            }, CONFIG.LOAD_CHECK_DELAY);

            // 设置超时处理
            setTimeout(() => {
                if (!isPaused) {
                    clearInterval(checkInterval);
                    const closeButton = document.querySelector('.note-detail-mask .close-circle .close');
                    if (closeButton) {
                        closeButton.click();
                    }
                    currentDetailPost = null;
                    resolve(postData);
                }
            }, CONFIG.DETAIL_TIMEOUT);
        });
    }


    function validateData(data) {

        const validatedNote = {
            searchKeyword: searchKeyword || '',
            noteId: data.noteId || '',
            title: data.title || '',
            detailUrl: data.detailUrl || '',
            interactions: {
                likes: parseInt(data.interactions?.likes || '0'),
                collects: parseInt(data.interactions?.collects || '0'),
                comments: parseInt(data.interactions?.comments || '0')
            },
            author: {
                name: data.author?.name || '',
                link: data.author?.link || ''
            },
            content: data.content || '',
            tags: data.tags || [],
            publishDate: data.publishDate || ''
        };


        if (isNaN(validatedNote.interactions.likes)) validatedNote.interactions.likes = 0;
        if (isNaN(validatedNote.interactions.collects)) validatedNote.interactions.collects = 0;
        if (isNaN(validatedNote.interactions.comments)) validatedNote.interactions.comments = 0;


        return [validatedNote];
    }


    async function uploadToServer(data) {
        try {

            const validatedData = validateData(data);


            console.log('准备上传的数据结构:', JSON.stringify(validatedData, null, 2));

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://redbook.dawne.cn/save_notes.php',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    data: JSON.stringify(validatedData),
                    onload: function(response) {
                        console.log('Response status:', response.status);
                        console.log('Response text:', response.responseText);

                        try {

                            let result;
                            try {
                                result = JSON.parse(response.responseText);
                            } catch (e) {

                                const jsonMatch = response.responseText.match(/\{.*\}/s);
                                if (jsonMatch) {
                                    result = JSON.parse(jsonMatch[0]);
                                } else {
                                    throw e;
                                }
                            }

                            if (result.success) {
                                document.getElementById('uploadStatus').textContent = '上传成功';
                                resolve(result);
                            } else {
                                document.getElementById('uploadStatus').textContent = '上传失败: ' + result.message;
                                console.error('服务器返回错误:', result);
                                reject(new Error(result.message || '服务器返回错误'));
                            }
                        } catch (e) {
                            document.getElementById('uploadStatus').textContent = '上传失败: ' + e.message;
                            console.error('解析响应失败:', e);
                            console.error('原始响应内容:', response.responseText);
                            reject(new Error('解析响应失败: ' + e.message));
                        }
                    },
                    onerror: function(error) {
                        document.getElementById('uploadStatus').textContent = '上传失败: 网络错误';
                        console.error('请求失败:', error);
                        reject(new Error('上传失败: ' + (error.statusText || '未知错误')));
                    },
                    ontimeout: function() {
                        document.getElementById('uploadStatus').textContent = '上传失败: 超时';
                        reject(new Error('请求超时'));
                    },
                    timeout: 30000
                });
            });
        } catch (error) {
            document.getElementById('uploadStatus').textContent = '上传失败: ' + error.message;
            console.error('数据验证失败:', error);
            console.error('原始数据:', data);
            throw error;
        }
    }


    async function checkNoteExists(noteId) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://redbook.dawne.cn/check_note.php?note_id=${noteId}`,
                headers: {
                    'Accept': 'application/json'
                },
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        resolve(result.exists);
                    } catch (e) {
                        console.error('检查笔记是否存在失败:', e);
                        resolve(false);
                    }
                },
                onerror: function() {
                    console.error('检查笔记请求失败');
                    resolve(false);
                }
            });
        });
    }


    async function extractPostInfo() {
        if (allData.length >= targetCount) {
            return false;
        }

        const noteItems = document.querySelectorAll('.note-item');
        let newItemsCount = 0;
        let newItems = [];
        let skippedItems = 0;

        for (const item of noteItems) {
            if (allData.length >= targetCount) {
                break;
            }

            const coverLink = item.querySelector('.cover')?.href;
            if (!coverLink) continue;

            const searchMatch = coverLink.match(/\/search_result\/([^?]+)/);
            if (!searchMatch) continue;

            const noteId = searchMatch[1];
            const fullLink = coverLink;

            if (posts.has(noteId)) continue;

            if (!noteId) {
                console.error('无法从链接提取笔记ID:', fullLink);
                continue;
            }

            console.log('检查笔记是否存在:', noteId);
            const exists = await checkNoteExists(noteId);

            if (exists) {
                skippedItems++;
                posts.add(noteId);
                console.log(`笔记已存在，跳过: ${noteId}`);
                updateProgress(`已跳过${skippedItems}个已存在的笔记`, allData.length);
                continue;
            }

            console.log(`发现新笔记: ${noteId}`);
            newItemsCount++;

            const titleElement = item.querySelector('.title span');
            const title = titleElement ? titleElement.textContent : '';

            const authorElement = item.querySelector('.author');
            const authorNameElement = authorElement ? authorElement.querySelector('.name') : null;
            const authorName = authorNameElement ? authorNameElement.textContent : '';
            const authorLink = authorElement ? authorElement.href : '';

            posts.add(noteId);

            const postData = {
                title,
                link: fullLink.startsWith('http') ? fullLink : `https://www.xiaohongshu.com${fullLink}`,
                noteId,
                author: {
                    name: authorName,
                    link: authorLink
                }
            };

            newItems.push(postData);
        }

        if (newItems.length > 0) {
            for (let i = 0; i < newItems.length; i++) {
                updateProgress('正在获取详情', allData.length, i, newItems.length, newItems[i]);

                const detailPromise = new Promise(async (resolve) => {
                    const processDetail = async () => {
                        const detailedPost = await getPostDetail(newItems[i]);
                        resolve(detailedPost);
                    };

                    resumeCallback = () => {
                        processDetail();
                    };

                    await processDetail();
                });

                const detailedPost = await detailPromise;
                if (isPaused) {
                    return false;
                }

                try {
                    updateProgress('正在上传数据', allData.length, i, newItems.length, detailedPost);
                    await uploadToServer(detailedPost);
                    console.log('数据上传成功:', detailedPost.title);
                } catch (error) {
                    console.error('数据上传失败:', error);
                }

                allData.push(detailedPost);
                updateProgress('正在获取详情', allData.length, i + 1, newItems.length, detailedPost);

                await new Promise(resolve => setTimeout(resolve, getRandomDelay(CONFIG.DETAIL_DELAY.MIN, CONFIG.DETAIL_DELAY.MAX)));
            }
        }

        return newItemsCount > 0 || skippedItems > 0;
    }


    async function scrollAndExtract() {
        if (isPaused) {
            return;
        }

        if (!isScrolling) {
            isScrolling = true;
            progressPanel.style.display = 'block';
            updateProgress('开始抓取', 0, 0, 0);


            const searchInput = document.querySelector('#search-input');
            searchKeyword = searchInput ? searchInput.value.trim() : '';
        }

        const hasNewItems = await extractPostInfo();
        const currentHeight = document.documentElement.scrollHeight;


        if (allData.length >= targetCount) {
            console.log('达到目标数量');
            console.log(`共抓取到 ${allData.length} 条数据`);
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


                await new Promise(resolve => setTimeout(resolve, getRandomDelay(CONFIG.BOTTOM_CHECK_DELAY.MIN, CONFIG.BOTTOM_CHECK_DELAY.MAX)));


                const newHeight = document.documentElement.scrollHeight;
                const hasMoreItems = await extractPostInfo();

                if (newHeight > currentHeight || hasMoreItems) {
                    lastHeight = newHeight;
                    setTimeout(scrollAndExtract, getRandomDelay(CONFIG.SCROLL_DELAY.MIN, CONFIG.SCROLL_DELAY.MAX));
                    return;
                }

                retryCount++;
            }

            console.log('已到达页面底部');
            console.log(`共抓取到 ${allData.length} 条数据`);
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
        setTimeout(scrollAndExtract, getRandomDelay(CONFIG.SCROLL_DELAY.MIN, CONFIG.SCROLL_DELAY.MAX));
    }

    function exportToExcel() {
        if (allData.length === 0) {
            alert('还没有抓取到任何数据！');
            return;
        }


        let csv = '搜索关键词,笔记ID,标题,详情链接,点赞数,收藏数,评论数,作者,作者主页,内容,标签,发布时间\n';
        allData.forEach(item => {
            const safeTitle = item.title.includes(',') ? `"${item.title}"` : item.title;
            const safeContent = item.content ? `"${item.content.replace(/"/g, '""')}"` : '';
            const safeTags = item.tags ? `"${item.tags.join(',')}"` : '';
            const safeKeyword = searchKeyword.includes(',') ? `"${searchKeyword}"` : searchKeyword;

            csv += `${safeKeyword},${item.noteId},${safeTitle},${item.detailUrl},${item.interactions.likes},${item.interactions.collects},${item.interactions.comments},${item.author.name},${item.author.link},${safeContent},${safeTags},${item.publishDate}\n`;
        });

        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = '小红书数据_' + searchKeyword + '_' + new Date().toISOString().slice(0,10) + '.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    const controlPanel = document.createElement('div');
    controlPanel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        gap: 10px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    `;


    const startButton = document.createElement('button');
    startButton.className = 'reds-button-new large primary';
    startButton.style.cssText = `
        height: 32px;
        padding: 0 16px;
        border-radius: 4px;
        font-size: 14px;
        background: #ff2442;
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
    `;
    startButton.textContent = '开始采集';


    const loopButton = document.createElement('button');
    loopButton.className = 'reds-button-new large';
    loopButton.style.cssText = `
        height: 32px;
        padding: 0 16px;
        border-radius: 4px;
        font-size: 14px;
        background: #666;
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
    `;
    loopButton.textContent = '未循环';


    loopButton.onclick = () => {
        isLoopScraping = !isLoopScraping;
        loopButton.textContent = isLoopScraping ? '循环中' : '未循环';
        loopButton.style.background = isLoopScraping ? '#07c160' : '#666';
        
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                isLoopScraping
            }));
        } catch (e) {
            console.error('保存状态失败:', e);
        }
    };


    startButton.onclick = () => {
        if (!isScrolling) {
            targetCount = Infinity;
            startButton.textContent = '采集中';
            startButton.disabled = true;
            scrollAndExtract();
        }
    };


    controlPanel.appendChild(startButton);
    controlPanel.appendChild(loopButton);
    document.body.appendChild(controlPanel);


    function getRandomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function initializeState() {
        try {
            const savedState = localStorage.getItem(STORAGE_KEY);
            if (savedState) {
                const state = JSON.parse(savedState);
                if (state.isLoopScraping) {
                    isLoopScraping = true;
                    loopButton.textContent = '循环中';
                    loopButton.style.background = '#07c160';
                    
                    setTimeout(() => {
                        if (!isScrolling) {
                            targetCount = Infinity;
                            startButton.textContent = '采集中';
                            startButton.disabled = true;
                            scrollAndExtract();
                        }
                    }, 2000);
                }
            }
        } catch (e) {
            console.error('恢复状态失败:', e);
        }
    }

    window.onbeforeunload = () => {
        if (!isLoopScraping) {
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    initializeState();
})();
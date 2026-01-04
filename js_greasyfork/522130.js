// ==UserScript==
// @name         B站动态视频添加到稍后观看
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动获取并播放B站动态视频
// @author       Your name
// @match        *://t.bilibili.com/*
// @match        *://www.bilibili.com/*
// @match        *://www.bilibili.com/video/*
// @grant        GM_xmlhttpRequest
// @connect      api.bilibili.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522130/B%E7%AB%99%E5%8A%A8%E6%80%81%E8%A7%86%E9%A2%91%E6%B7%BB%E5%8A%A0%E5%88%B0%E7%A8%8D%E5%90%8E%E8%A7%82%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/522130/B%E7%AB%99%E5%8A%A8%E6%80%81%E8%A7%86%E9%A2%91%E6%B7%BB%E5%8A%A0%E5%88%B0%E7%A8%8D%E5%90%8E%E8%A7%82%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 常量定义
    const CONSTANTS = {
        API: {
            WATCH_LATER: 'https://api.bilibili.com/x/v2/history/toview/web',
            DYNAMIC_FEED: 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all',
            ADD_TO_WATCH: 'https://api.bilibili.com/x/v2/history/toview/add',
        },
        STORAGE_KEY: 'BILIBILI_ADDED_VIDEOS',
        MAX_PAGES: 20,
        REQUEST_DELAY: 300,
        STORAGE_EXPIRE_DAYS: 7,
    };

    // 优化的 StorageManager
    const StorageManager = {
        setWithExpiry(key, value, days = CONSTANTS.STORAGE_EXPIRE_DAYS) {
            const item = {
                value,
                expiry: new Date().getTime() + (days * 24 * 60 * 60 * 1000),
            }
            try {
                localStorage.setItem(key, JSON.stringify(item));
                return true;
            } catch (error) {
                console.error('存储数据失败:', error);
                return false;
            }
        },

        getWithExpiry(key) {
            try {
                const itemStr = localStorage.getItem(key);
                if (!itemStr) return null;

                const item = JSON.parse(itemStr);
                const now = new Date().getTime();

                if (now > item.expiry) {
                    localStorage.removeItem(key);
                    return null;
                }
                return item.value;
            } catch (error) {
                console.error('读取数据失败:', error);
                return null;
            }
        },

        clearExpired(key) {
            const item = this.getWithExpiry(key);
            if (!item) {
                console.log('数据已过期或不存在，已清除');
            }
        }
    };

    // 工具函数
    const utils = {
        async sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        async retry(fn, times = 3, delay = 1000) {
            for (let i = 0; i < times; i++) {
                try {
                    return await fn();
                } catch (err) {
                    if (i === times - 1) throw err;
                    console.log(`操作失败，${delay/1000}秒后重试:`, err);
                    await this.sleep(delay);
                }
            }
        }
    };

    // API 请求封装
    const api = {
        // 获取 CSRF token
        getCsrfToken() {
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'bili_jct') {
                    return value;
                }
            }
            return '';
        },

        async request(url, options = {}) {
            const defaultOptions = {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            };

            // 如果是 POST 请求，添加 CSRF token
            if (options.method === 'POST') {
                const csrf = this.getCsrfToken();
                if (!csrf) {
                    throw new Error('未找到 CSRF token，请确保已登录');
                }

                // 处理表单数据
                if (options.body) {
                    options.body += `&csrf=${csrf}`;
                } else {
                    options.body = `csrf=${csrf}`;
                }

                // 设置 Content-Type
                if (!options.headers) {
                    options.headers = {};
                }
                options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }

            const response = await fetch(url, { ...defaultOptions, ...options });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.code !== 0) {
                throw new Error(`API error! code: ${data.code}, message: ${data.message}`);
            }

            return data.data;
        },

        async getWatchLaterList() {
            try {
                const data = await this.request(CONSTANTS.API.WATCH_LATER);
                return new Set(data.list?.map(item => item.aid.toString()) || []);
            } catch (error) {
                console.error('获取稍后观看列表失败:', error);
                return new Set();
            }
        },

        async addToWatchLater(aid) {
            try {
                const csrf = this.getCsrfToken();
                if (!csrf) {
                    console.error('未登录状态，请先登录');
                    return false;
                }

                const response = await this.request(CONSTANTS.API.ADD_TO_WATCH, {
                    method: 'POST',
                    body: `aid=${aid}&csrf=${csrf}`
                });
                return true;
            } catch (error) {
                console.error('添加失败:', error);
                if (error.message.includes('未登录')) {
                    alert('请先登录 B 站账号！');
                }
                return false;
            }
        }
    };

    // 主要业务逻辑
    class VideoManager {
        constructor() {
            this.videoList = [];
            this.currentPage = 1;
            this.lastOffset = '';
            this.watchLaterList = null; // 新增：缓存稍后观看列表
        }

        // 新增：获取并缓存稍后观看列表
        async initWatchLaterList() {
            this.watchLaterList = await api.getWatchLaterList();
            console.log(`已获取稍后观看列表，共 ${this.watchLaterList.size} 个视频`);
        }

        async fetchVideos() {
            return utils.retry(async () => {
                const data = await api.request(`${CONSTANTS.API.DYNAMIC_FEED}?timezone_offset=-480&type=all&page=${this.currentPage}&offset=${this.lastOffset}`);
                
                const videos = data.items
                    .filter(item => item.modules?.module_dynamic?.major?.type === 'MAJOR_TYPE_ARCHIVE')
                    .map(item => {
                        const archive = item.modules.module_dynamic.major.archive;
                        return {
                            bvid: archive.bvid,
                            aid: archive.aid,
                            title: archive.title,
                            url: `https://www.bilibili.com/video/${archive.bvid}`
                        };
                    });

                console.log(`第 ${this.currentPage} 页找到 ${videos.length} 个视频`);
                this.videoList = this.videoList.concat(videos);
                this.lastOffset = data.offset || '';
                return this.lastOffset;
            });
        }

        async loadAllPages() {
            while (this.currentPage <= CONSTANTS.MAX_PAGES) {
                const hasMore = await this.fetchVideos();
                if (!hasMore) break;
                this.currentPage++;
                await utils.sleep(CONSTANTS.REQUEST_DELAY);
            }
        }

        async processVideos() {
            // 先获取稍后观看列表
            await this.initWatchLaterList();
            if (!this.watchLaterList) {
                console.error('获取稍后观看列表失败');
                return;
            }

            // 获取本地存储的已处理视频列表
            const processedVideos = getProcessedVideos();
            
            console.log(`当前稍后观看列表有 ${this.watchLaterList.size} 个视频`);
            console.log(`本地记录的已处理视频数: ${processedVideos.length}`);

            // 过滤需要添加的视频：既不在稍后观看列表中，也不在本地记录中
            const videosToAdd = this.videoList.filter(video => {
                const videoId = video.aid.toString();
                return !this.watchLaterList.has(videoId) && !processedVideos.includes(videoId);
            });

            console.log(`找到 ${this.videoList.length} 个视频，其中 ${videosToAdd.length} 个需要添加`);

            if (videosToAdd.length > 0) {
                console.log('即将添加的视频：');
                videosToAdd.forEach((video, index) => {
                    console.log(`${index + 1}. ${video.title}`);
                });
            }

            let successCount = 0;
            for (const video of videosToAdd) {
                console.log(`正在添加: ${video.title}`);
                if (await api.addToWatchLater(video.aid)) {
                    successCount++;
                    addToProcessedVideos(video.aid.toString());
                    console.log(`✅ 成功添加: ${video.title}`);
                } else {
                    console.log(`❌ 添加失败: ${video.title}`);
                }
                await utils.sleep(CONSTANTS.REQUEST_DELAY);
            }

            return {
                total: this.videoList.length,
                added: successCount,
                existing: this.videoList.length - videosToAdd.length
            };
        }
    }

    // UI 组件
    const UI = {
        createButton() {
            const button = document.createElement('div');
            button.innerHTML = `
                <div style="
                    position: fixed;
                    right: 20px;
                    top: 200px;
                    z-index: 999;
                    width: 32px;
                    height: 32px;
                    background: white;
                    border-radius: 50%;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    opacity: 0.8;
                ">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="#00AEEC" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                </div>
            `;

            const buttonElement = button.firstElementChild;
            this.addButtonEffects(buttonElement);
            document.body.appendChild(button);
        },

        addButtonEffects(button) {
            button.addEventListener('mouseover', () => {
                button.style.opacity = '1';
                button.style.transform = 'scale(1.1)';
            });
            
            button.addEventListener('mouseout', () => {
                button.style.opacity = '0.8';
                button.style.transform = 'scale(1)';
            });

            button.addEventListener('click', async () => {
                button.style.pointerEvents = 'none';
                button.style.opacity = '0.5';
                
                try {
                    const manager = new VideoManager();
                    await manager.loadAllPages();
                    const result = await manager.processVideos();
                    
                    console.log('\n处理完成:');
                    console.log(`✅ 成功添加: ${result.added} 个视频`);
                    console.log(`⏭️ 已在列表中: ${result.existing} 个视频`);
                    console.log(`📊 动态中总视频数: ${result.total}`);
                } catch (error) {
                    console.error('执行失败:', error);
                } finally {
                    button.style.pointerEvents = 'auto';
                    button.style.opacity = '0.8';
                }
            });
        }
    };

    // 初始化
    UI.createButton();

    function getProcessedVideos() {
        const stored = localStorage.getItem(CONSTANTS.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    function addToProcessedVideos(videoId) {
        const processed = getProcessedVideos();
        if (!processed.includes(videoId)) {
            processed.push(videoId);
            localStorage.setItem(CONSTANTS.STORAGE_KEY, JSON.stringify(processed));
        }
    }

    function isVideoProcessed(videoId) {
        return getProcessedVideos().includes(videoId);
    }

    // 获取已添加的视频列表
    function getAddedVideos() {
        const stored = localStorage.getItem(CONSTANTS.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    // 添加视频ID到记录中
    function addToVideoRecord(videoId) {
        const added = getAddedVideos();
        if (!added.includes(videoId)) {
            added.push(videoId);
            localStorage.setItem(CONSTANTS.STORAGE_KEY, JSON.stringify(added));
        }
    }

    async function processVideo(item) {
        const videoId = item.modules?.module_dynamic?.major?.archive?.aid;
        if (!videoId) return;

        // 检查是否已经添加过
        const addedVideos = getAddedVideos();
        if (addedVideos.includes(videoId)) {
            console.log(`视频 ${videoId} 已经添加过，跳过`);
            return;
        }

        const isWatched = await checkIfWatched(videoId);
        if (!isWatched) {
            // 只有成功添加后才记录
            const addSuccess = await addToWatchLater(videoId);
            if (addSuccess) {
                addToVideoRecord(videoId);
                console.log(`视频 ${videoId} 添加成功并记录`);
            } else {
                console.log(`视频 ${videoId} 添加失败，不记录`);
            }
        }
    }

    // 检查视频是否已观看
    async function checkIfWatched(videoId) {
        try {
            const watchLaterList = await api.getWatchLaterList();
            return watchLaterList.has(videoId.toString());
        } catch (error) {
            console.error('检查视频状态失败:', error);
            return false;
        }
    }

    // 添加到稍后观看
    async function addToWatchLater(videoId) {
        try {
            return await api.addToWatchLater(videoId);
        } catch (error) {
            console.error('添加到稍后观看失败:', error);
            return false;
        }
    }

})();
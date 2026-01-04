// ==UserScript==
// @name         Bilibili字幕时间跳转
// @namespace    http://tampermonkey.net/
// @version      1.22
// @description  使用h和l键在B站视频字幕间快速跳转，r键重复播放当前语句
// @author       hitori-Janai
// @match        *://*.bilibili.com/video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532830/Bilibili%E5%AD%97%E5%B9%95%E6%97%B6%E9%97%B4%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/532830/Bilibili%E5%AD%97%E5%B9%95%E6%97%B6%E9%97%B4%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 字幕获取模块 (从cc.js中提取)
    const SubtitleFetcher = {
        // 获取视频信息
        async getVideoInfo() {
            console.log('Getting video info...');
            
            const info = {
                aid: window.aid || window.__INITIAL_STATE__?.aid,
                bvid: window.bvid || window.__INITIAL_STATE__?.bvid,
                cid: window.cid
            };
 
            if (!info.cid) {
                const state = window.__INITIAL_STATE__;
                info.cid = state?.videoData?.cid || state?.epInfo?.cid;
            }
 
            if (!info.cid && window.player) {
                try {
                    const playerInfo = window.player.getVideoInfo();
                    info.cid = playerInfo.cid;
                    info.aid = playerInfo.aid;
                    info.bvid = playerInfo.bvid;
                } catch (e) {
                    console.log('Failed to get info from player:', e);
                }
            }
 
            console.log('Video info:', info);
            return info;
        },
 
        // 获取字幕配置
        async getSubtitleConfig(info) {
            console.log('Getting subtitle config...');
            
            const apis = [
                `//api.bilibili.com/x/player/v2?cid=${info.cid}&bvid=${info.bvid}`,
                `//api.bilibili.com/x/v2/dm/view?aid=${info.aid}&oid=${info.cid}&type=1`,
                `//api.bilibili.com/x/player/wbi/v2?cid=${info.cid}`
            ];
 
            for (const api of apis) {
                try {
                    console.log('Trying API:', api);
                    const res = await fetch(api);
                    const data = await res.json();
                    console.log('API response:', data);
 
                    if (data.code === 0 && data.data?.subtitle?.subtitles?.length > 0) {
                        return data.data.subtitle;
                    }
                } catch (e) {
                    console.log('API failed:', e);
                }
            }
 
            return null;
        },
 
        // 获取字幕内容
        async getSubtitleContent(subtitleUrl) {
            console.log('Getting subtitle content from:', subtitleUrl);
            
            try {
                const url = subtitleUrl.replace(/^http:/, 'https:');
                console.log('Using HTTPS URL:', url);
                
                const res = await fetch(url);
                const data = await res.json();
                console.log('Subtitle content:', data);
                return data;
            } catch (e) {
                console.error('Failed to get subtitle content:', e);
                return null;
            }
        }
    };

    // 字幕时间跳转模块
    const SubtitleJumper = {
        subtitles: null,
        timePoints: [],
        currentIndex: -1,
        isRepeating: false, // 是否正在重复播放
        repeatTimerId: null, // 重复播放的定时器ID
        
        // 初始化字幕数据
        async init() {
            try {
                const videoInfo = await SubtitleFetcher.getVideoInfo();
                if (!videoInfo.cid) {
                    throw new Error('无法获取视频信息');
                }
                
                const subtitleConfig = await SubtitleFetcher.getSubtitleConfig(videoInfo);
                if (!subtitleConfig || !subtitleConfig.subtitles || subtitleConfig.subtitles.length === 0) {
                    throw new Error('该视频没有CC字幕');
                }
                
                this.subtitles = await SubtitleFetcher.getSubtitleContent(subtitleConfig.subtitles[0].subtitle_url);
                if (!this.subtitles || !this.subtitles.body) {
                    throw new Error('获取字幕内容失败');
                }
                
                // 提取所有时间点
                this.timePoints = this.subtitles.body.map(item => item.from);
                console.log(`加载了 ${this.timePoints.length} 个字幕时间点`);
                
                // 初始化完成后显示通知
                this.showNotification('字幕跳转功能已启用 (h-上一个字幕, l-下一个字幕, r-重复播放)');
                
                return true;
            } catch (error) {
                console.error('初始化字幕跳转失败:', error);
                this.showNotification(`字幕跳转功能初始化失败: ${error.message}`);
                return false;
            }
        },
        
        // 获取视频元素
        getVideoElement() {
            return document.querySelector('video');
        },
        
        // 跳转到上一个字幕
        jumpToPrevious() {
            if (!this.subtitles || !this.timePoints.length) return;
            
            const videoElement = this.getVideoElement();
            if (!videoElement) return;
            
            const currentTime = videoElement.currentTime;
            
            // 查找当前时间前面的最近时间点
            let targetIndex = -1;
            for (let i = this.timePoints.length - 1; i >= 0; i--) {
                if (this.timePoints[i] < currentTime - 1.0) { // 1.0秒的容错
                    targetIndex = i;
                    break;
                }
            }
            
            if (targetIndex >= 0) {
                this.currentIndex = targetIndex;
                videoElement.currentTime = this.timePoints[targetIndex];
                this.showTimestampNotification(targetIndex);
            }
        },
        
        // 跳转到下一个字幕
        jumpToNext() {
            if (!this.subtitles || !this.timePoints.length) return;
            
            const videoElement = this.getVideoElement();
            if (!videoElement) return;
            
            const currentTime = videoElement.currentTime;
            
            // 查找当前时间后面的最近时间点
            let targetIndex = -1;
            for (let i = 0; i < this.timePoints.length; i++) {
                if (this.timePoints[i] > currentTime + 0.5) { // 0.5秒的容错
                    targetIndex = i;
                    break;
                }
            }
            
            if (targetIndex >= 0) {
                this.currentIndex = targetIndex;
                videoElement.currentTime = this.timePoints[targetIndex];
                this.showTimestampNotification(targetIndex);
            }
        },
        
        // 显示时间点跳转通知
        showTimestampNotification(index) {
            if (!this.subtitles || !this.subtitles.body[index]) return;
            
            const subtitle = this.subtitles.body[index];
            const timeStr = this.formatTime(subtitle.from);
            const content = subtitle.content;
            
            this.showNotification(`跳转到 ${timeStr}: ${content}`);
        },
        
        // 显示通知
        showNotification(message, duration = 2000) {
            // 创建通知元素
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                bottom: 60px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 8px 16px;
                border-radius: 4px;
                z-index: 10000;
                font-size: 14px;
                max-width: 80%;
                text-align: center;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            // 定时移除
            setTimeout(() => notification.remove(), duration);
        },
        
        // 格式化时间
        formatTime(seconds) {
            const mm = String(Math.floor(seconds/60)).padStart(2,'0');
            const ss = String(Math.floor(seconds%60)).padStart(2,'0');
            return `${mm}:${ss}`;
        },
        
        // 获取当前播放时间所在的字幕索引
        getCurrentSubtitleIndex() {
            if (!this.subtitles || !this.timePoints.length) return -1;
            
            const videoElement = this.getVideoElement();
            if (!videoElement) return -1;
            
            const currentTime = videoElement.currentTime;
            
            // 找到当前时间所在的字幕区间
            for (let i = 0; i < this.timePoints.length; i++) {
                const currentStart = this.timePoints[i];
                const nextStart = (i < this.timePoints.length - 1) ? this.timePoints[i + 1] : Infinity;
                
                if (currentTime >= currentStart && currentTime < nextStart) {
                    return i;
                }
            }
            
            return -1; // 没有找到匹配的字幕
        },
        
        // 检查并循环播放当前字幕
        checkAndLoopCurrentSubtitle() {
            if (!this.isRepeating) return;
            
            const videoElement = this.getVideoElement();
            if (!videoElement) return;
            
            const currentTime = videoElement.currentTime;
            
            // 如果currentIndex是有效索引
            if (this.currentIndex >= 0 && this.currentIndex < this.timePoints.length) {
                const currentStart = this.timePoints[this.currentIndex];
                const nextStart = (this.currentIndex < this.timePoints.length - 1) 
                    ? this.timePoints[this.currentIndex + 1] 
                    : currentStart + 5; // 最后一个字幕默认持续5秒
                
                // 如果超出当前字幕范围，跳回到字幕开头
                if (currentTime >= nextStart) {
                    videoElement.currentTime = currentStart;
                }
            } else {
                // 当前没有有效的字幕索引，尝试获取一个
                this.currentIndex = this.getCurrentSubtitleIndex();
            }
        },
        
        // 切换重复播放状态
        toggleRepeat() {
            this.isRepeating = !this.isRepeating;
            
            if (this.isRepeating) {
                // 获取当前字幕索引
                const currentIndex = this.getCurrentSubtitleIndex();
                
                if (currentIndex === -1) {
                    // 如果当前没有播放字幕，不启动循环
                    this.showNotification('当前没有字幕，无法开启重复播放');
                    this.isRepeating = false;
                    return;
                }
                
                this.currentIndex = currentIndex;
                const subtitle = this.subtitles.body[currentIndex];
                
                // 开始循环检测
                this.repeatTimerId = setInterval(() => this.checkAndLoopCurrentSubtitle(), 100);
                
                this.showNotification(`开始重复播放: ${subtitle.content}`);
            } else {
                // 停止循环
                if (this.repeatTimerId !== null) {
                    clearInterval(this.repeatTimerId);
                    this.repeatTimerId = null;
                }
                
                this.showNotification('已停止重复播放');
            }
        }
    };

    // 添加键盘事件监听
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', async (e) => {
            // 避免在输入框中触发快捷键
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch (e.key.toLowerCase()) {
                case 'h':
                    e.preventDefault();
                    SubtitleJumper.jumpToPrevious();
                    break;
                    
                case 'l':
                    e.preventDefault();
                    SubtitleJumper.jumpToNext();
                    break;
                    
                case 'r':
                    e.preventDefault();
                    SubtitleJumper.toggleRepeat();
                    break;
            }
        });
    }

    // 主函数
    async function main() {
        // 等待页面加载完成
        await new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
        
        // 等待视频播放器加载
        await new Promise(resolve => {
            const checkPlayer = () => {
                if (document.querySelector('video')) {
                    resolve();
                } else {
                    setTimeout(checkPlayer, 500);
                }
            };
            checkPlayer();
        });
        
        // 初始化字幕跳转
        await SubtitleJumper.init();
        
        // 设置键盘快捷键
        setupKeyboardShortcuts();
    }

    // 执行主函数
    main().catch(error => {
        console.error('Script initialization failed:', error);
    });
})(); 
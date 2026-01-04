// ==UserScript==
// @name         Bilibili CC字幕实时显示插件
// @name:en      Bilibili CC Subtitle Extractor
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在B站播放器中集成CC字幕列表
// @description:en  Integrate CC subtitle list in Bilibili video player
// @author       Zane
// @match        *://*.bilibili.com/video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519378/Bilibili%20CC%E5%AD%97%E5%B9%95%E5%AE%9E%E6%97%B6%E6%98%BE%E7%A4%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/519378/Bilibili%20CC%E5%AD%97%E5%B9%95%E5%AE%9E%E6%97%B6%E6%98%BE%E7%A4%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 字幕获取模块
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
 
    // 时间格式化模块
    const TimeFormatter = {
        formatTime(seconds) {
            const mm = String(Math.floor(seconds/60)).padStart(2,'0');
            const ss = String(Math.floor(seconds%60)).padStart(2,'0');
            return `${mm}:${ss}`;
        },
        
        // 如果需要其他格式的时间显示，可以添加更多方法
        formatTimeWithMs(seconds) {
            const date = new Date(seconds * 1000);
            const mm = String(Math.floor(seconds/60)).padStart(2,'0');
            const ss = String(Math.floor(seconds%60)).padStart(2,'0');
            const ms = String(date.getMilliseconds()).slice(0,3).padStart(3,'0');
            return `${mm}:${ss},${ms}`;
        }
    };
 
    // UI渲染模块更新
    const SubtitleUI = {
        injectStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .subtitle-container {
                    position: relative;
                    width: 100%;
                    background: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    margin: 10px 0;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s;
                }
                
                .subtitle-header {
                    display: flex;
                    height: 36px;
                    align-items: center;
                    padding: 0 12px;
                    cursor: pointer;
                    user-select: none;
                    font-size: 14px;
                    font-weight: 500;
                    color: #18191c;
                }
                
                .arrow-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 18px;
                    height: 18px;
                    margin-right: 6px;
                    transform: rotate(-90deg);
                    transition: transform 0.3s;
                }
                
                .arrow-icon.expanded {
                    transform: rotate(0);
                }
                
                .subtitle-content {
                    height: 0;
                    overflow: hidden;
                    transition: height 0.3s;
                }
                
                .subtitle-function {
                    height: 36px;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #f1f2f3;
                    color: #61666d;
                    font-size: 12px;
                    background: #f6f7f8;
                }
                
                .subtitle-function-left {
                    display: flex;
                    align-items: center;
                }
                
                .subtitle-function-btn {
                    padding: 0 10px;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                }
                
                .subtitle-function-btn:hover {
                    color: #00a1d6;
                }
                
                .subtitle-wrap {
                    height: 393px;
                    overflow-y: auto;
                    padding: 10px 0;
                }
                
                .subtitle-item {
                    display: flex;
                    padding: 6px 12px;
                    line-height: 1.5;
                    cursor: pointer;
                    border-bottom: 1px solid transparent;
                    transition: all 0.2s;
                }
                
                .subtitle-item:hover {
                    background: rgba(0, 161, 214, 0.1);
                }
                
                .subtitle-item.active {
                    background: rgba(0, 161, 214, 0.1);
                    border-left: 2px solid #00a1d6;
                }
                
                .subtitle-time {
                    color: #61666d;
                    margin-right: 8px;
                    font-size: 12px;
                    min-width: 40px;
                }
                
                .subtitle-text {
                    color: #18191c;
                    font-size: 13px;
                    flex: 1;
                    word-break: break-word;
                }
                
                .subtitle-menu {
                    position: relative;
                }
                
                .subtitle-menu-dropdown {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    width: 120px;
                    background: #fff;
                    border-radius: 4px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                    z-index: 100;
                    overflow: hidden;
                    display: none;
                }
                
                .subtitle-menu-dropdown.show {
                    display: block;
                }
                
                .subtitle-menu-item {
                    padding: 8px 12px;
                    font-size: 12px;
                    color: #212121;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                
                .subtitle-menu-item:hover {
                    background: #f6f7f8;
                    color: #00a1d6;
                }
                
                .subtitle-menu-item.active {
                    color: #00a1d6;
                }
                
                /* 合并视图样式 */
                .subtitle-merged {
                    padding: 10px 12px;
                    line-height: 1.8;
                    color: #18191c;
                    font-size: 14px;
                }
                
                .subtitle-span {
                    margin: 0 1px;
                    padding: 0 1px;
                    border-radius: 2px;
                    cursor: pointer;
                }
                
                .subtitle-span:hover {
                    background: rgba(0, 161, 214, 0.1);
                }
                
                .subtitle-span.active {
                    background: rgba(0, 161, 214, 0.2);
                    color: #00a1d6;
                }
                
                .subtitle-function-right {
                    display: flex;
                    align-items: center;
                }
                
                .subtitle-menu-icon {
                    width: 24px;
                    height: 24px;
                    padding: 4px;
                    cursor: pointer;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.3s;
                }
                
                .subtitle-menu-icon:hover {
                    background: rgba(0, 161, 214, 0.1);
                }
                
                /* 搜索功能样式 */
                .subtitle-search {
                    display: flex;
                    align-items: center;
                    flex: 0 1 auto;
                    margin: 0 10px;
                    max-width: 180px;
                    position: relative;
                }

                .subtitle-search-input {
                    width: 100%;
                    height: 24px;
                    border: 1px solid #e5e9ef;
                    border-radius: 12px;
                    padding: 0 8px;
                    font-size: 12px;
                    color: #212121;
                    outline: none;
                    transition: border-color 0.3s;
                }

                .subtitle-search-input:focus {
                    border-color: #00a1d6;
                }

                .subtitle-search-btn {
                    position: absolute;
                    right: 4px;
                    top: 50%;
                    transform: translateY(-50%);
                    cursor: pointer;
                    color: #757575;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2px;
                }

                .subtitle-search-btn:hover {
                    color: #00a1d6;
                }

                .subtitle-search-nav {
                    display: flex;
                    align-items: center;
                    margin-left: 4px;
                    white-space: nowrap;
                }

                .subtitle-search-count {
                    font-size: 12px;
                    color: #757575;
                    margin: 0 4px;
                    min-width: 36px;
                    text-align: center;
                }

                .subtitle-search-prev, .subtitle-search-next {
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    border-radius: 50%;
                    color: #757575;
                    margin: 0 2px;
                }

                .subtitle-search-prev:hover, .subtitle-search-next:hover {
                    background: rgba(0, 161, 214, 0.1);
                    color: #00a1d6;
                }

                .subtitle-search-prev:disabled, .subtitle-search-next:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .subtitle-text mark {
                    background-color: rgba(255, 247, 99, 0.7);
                    color: #111;
                    padding: 0;
                    border-radius: 2px;
                }

                .subtitle-text mark.current {
                    background-color: #ff9c00;
                    color: #fff;
                }

                .subtitle-span mark {
                    background-color: rgba(255, 247, 99, 0.7);
                    color: #111;
                    padding: 0;
                    border-radius: 2px;
                }

                .subtitle-span mark.current {
                    background-color: #ff9c00;
                    color: #fff;
                }
            `;
            document.head.appendChild(style);
        },
    
        isElementScrollable(element) {
            return element.scrollHeight > element.clientHeight;
        },
    
        createSubtitleUI() {
            const container = document.createElement('div');
            container.className = 'subtitle-container';
            
            // 头部
            const header = document.createElement('div');
            header.className = 'subtitle-header';
            header.innerHTML = `
                <div class="arrow-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                        <path d="m9.188 7.999-3.359 3.359a.75.75 0 1 0 1.061 1.061l3.889-3.889a.75.75 0 0 0 0-1.061L6.89 3.58a.75.75 0 1 0-1.061 1.061l3.359 3.358z"/>
                    </svg>
                </div>
                <span>字幕列表</span>
            `;
    
            // 内容区
            const content = document.createElement('div');
            content.className = 'subtitle-content';
            
            const function_bar = document.createElement('div');
            function_bar.className = 'subtitle-function';
            function_bar.innerHTML = `
                <div class="subtitle-function-left">
                    <div class="subtitle-function-btn">
                        <span>时间</span>
                    </div>
                    <div class="subtitle-function-btn">
                        <span>字幕内容</span>
                    </div>
                </div>
                <div class="subtitle-search">
                    <input type="text" class="subtitle-search-input" placeholder="搜索字幕..." />
                    <div class="subtitle-search-nav">
                        <span class="subtitle-search-count">0/0</span>
                        <div class="subtitle-search-prev">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </div>
                        <div class="subtitle-search-next">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="subtitle-function-right">
                    <div class="subtitle-menu">
                        <div class="subtitle-menu-icon">
                            <svg width="16" height="16" viewBox="0 0 16 16">
                                <circle cx="8" cy="3" r="1.5"/>
                                <circle cx="8" cy="8" r="1.5"/>
                                <circle cx="8" cy="13" r="1.5"/>
                            </svg>
                        </div>
                        <div class="subtitle-menu-dropdown">
                            <div class="subtitle-menu-item" data-action="toggle-view">单条显示</div>
                            <div class="subtitle-menu-item" data-action="copy-text">复制纯文本</div>
                            <div class="subtitle-menu-item" data-action="copy-srt">复制SRT格式</div>
                        </div>
                    </div>
                </div>
            `;
            
            const wrap = document.createElement('div');
            wrap.className = 'subtitle-wrap';
 
            // 更新滚动事件监听
            wrap.addEventListener('scroll', () => {
                SubtitleSync.ScrollManager.onManualScroll();
            });
            
            content.appendChild(function_bar);
            content.appendChild(wrap);
    
            container.appendChild(header);
            container.appendChild(content);
    
            return { container, header, content: wrap };
        }
    };
 
    // 字幕同步模块更新
    const SubtitleSync = {
        isVideoPlaying: true,
        
        // 新增统一的滚动管理器
        ScrollManager: {
            state: {
                isManualScrolling: false,
                scrollTimeout: null,
                lastActiveIndex: -1
            },
            
            onManualScroll() {
                this.state.isManualScrolling = true;
                clearTimeout(this.state.scrollTimeout);
                this.state.scrollTimeout = setTimeout(() => {
                    this.state.isManualScrolling = false;
                }, 3000);
            },
            
            shouldAutoScroll() {
                return !this.state.isManualScrolling;
            },
            
            updateActiveIndex(index) {
                if (this.state.lastActiveIndex !== index) {
                    this.state.lastActiveIndex = index;
                    return true; // 表示需要滚动
                }
                return false;
            }
        },
 
        displaySubtitles(subtitles, container, isMergedView = false) {
            if (isMergedView) {
                this.displayMergedSubtitles(subtitles, container);
                return;
            }
 
            const subtitleHtml = subtitles.body.map((item, index) => `
                <div class="subtitle-item" data-index="${index}">
                    <span class="subtitle-time">${TimeFormatter.formatTime(item.from)}</span>
                    <span class="subtitle-text">${item.content}</span>
                </div>
            `).join('');
 
            container.innerHTML = subtitleHtml;
 
            // 添加点击事件
            container.querySelectorAll('.subtitle-item').forEach(item => {
                item.addEventListener('click', () => {
                    const index = parseInt(item.dataset.index);
                    const subtitle = subtitles.body[index];
                    if (window.player && subtitle) {
                        window.player.seek(subtitle.from);
                    }
                });
            });
 
            // 更新滚动监听
            container.addEventListener('scroll', () => {
                this.ScrollManager.onManualScroll();
            });
 
            // 监听视播放状态
            if (window.player) {
                const observer = new MutationObserver(() => {
                    const video = document.querySelector('video');
                    if (video) {
                        this.isVideoPlaying = !video.paused;
                    }
                });
 
                observer.observe(document.querySelector('.bpx-player-container'), {
                    subtree: true,
                    attributes: true
                });
            }
            
            // 重新应用搜索高亮
            if (SubtitleSearch.state.query) {
                SubtitleSearch.highlightResults(container, false);
            }
        },
 
        // 计算元素在容器中的相对位置
        getRelativePosition(element, container) {
            const containerRect = container.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            
            return {
                top: elementRect.top - containerRect.top,
                bottom: elementRect.bottom - containerRect.top
            };
        },
 
        // 检查元素是否在容器的可视区域内
        isElementInViewport(element, container) {
            const pos = this.getRelativePosition(element, container);
            const containerHeight = container.clientHeight;
            
            // 虑一定的缓冲区域
            const buffer = 50;
            return pos.top >= -buffer && pos.bottom <= containerHeight + buffer;
        },
 
        // 平滑滚动到指定元素
        smoothScrollToElement(element, container) {
            const pos = this.getRelativePosition(element, container);
            const containerHeight = container.clientHeight;
            const targetScroll = container.scrollTop + pos.top - containerHeight / 2;
            
            container.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });
        },
 
        // 更新highlightCurrentSubtitle方法
        highlightCurrentSubtitle(subtitles, container, isMergedView = false) {
            const currentTime = window.player?.getCurrentTime() || 0;
            
            if (isMergedView) {
                // 获取所有字幕span
                const spans = container.querySelectorAll('.subtitle-span');
                let activeSpanFound = false;

                spans.forEach(span => {
                    const from = parseFloat(span.dataset.from);
                    const to = parseFloat(span.dataset.to);
                    
                    if (currentTime >= from && currentTime <= to) {
                        span.classList.add('active');
                        activeSpanFound = true;
                        
                        const index = parseInt(span.dataset.index);
                        if (this.isVideoPlaying && this.ScrollManager.shouldAutoScroll() && 
                            this.ScrollManager.updateActiveIndex(index)) {
                            if (!this.isElementInViewport(span, container)) {
                                this.smoothScrollToElement(span, container);
                            }
                        }
                    } else {
                        span.classList.remove('active');
                    }
                });

                if (!activeSpanFound) {
                    this.highlightNearestSubtitle(currentTime, spans);
                }
            } else {
                // 修复单条显示模式的高亮逻辑
                container.querySelectorAll('.subtitle-item').forEach(item => {
                    item.classList.remove('active');
                });

                const currentSubtitle = subtitles.body.find(item => 
                    currentTime >= item.from && currentTime <= item.to  // 修复这里的bug
                );

                if (currentSubtitle) {
                    const index = subtitles.body.indexOf(currentSubtitle);
                    const currentElement = container.querySelector(`.subtitle-item[data-index="${index}"]`);
                    
                    if (currentElement) {
                        currentElement.classList.add('active');
                        
                        // 使用ScrollManager控制滚动
                        if (this.isVideoPlaying && this.ScrollManager.shouldAutoScroll() && 
                            this.ScrollManager.updateActiveIndex(index)) {
                            if (!this.isElementInViewport(currentElement, container)) {
                                this.smoothScrollToElement(currentElement, container);
                            }
                        }
                    }
                }
            }
        },
 
        // 添加新方法用于显示合并视图
        displayMergedSubtitles(subtitles, container) {
            // 创建包装器div
            const mergedContent = document.createElement('div');
            mergedContent.className = 'merged-view';
            
            // 处理每个字幕
            subtitles.body.forEach((item, index) => {
                // 创建字幕span
                const subtitleSpan = document.createElement('span');
                subtitleSpan.className = 'subtitle-span';
                subtitleSpan.dataset.index = index;
                subtitleSpan.dataset.from = item.from;
                subtitleSpan.dataset.to = item.to;
                subtitleSpan.textContent = item.content;
                
                // 添加到容器
                mergedContent.appendChild(subtitleSpan);
                
                // 添加分隔符（空格）
                if (index < subtitles.body.length - 1) {
                    const separator = document.createElement('span');
                    separator.className = 'subtitle-separator';
                    separator.textContent = ' ';
                    mergedContent.appendChild(separator);
                }
            });

            // 清空并设置新内容
            container.innerHTML = '';
            container.appendChild(mergedContent);
            
            // 重新应用搜索高亮
            if (SubtitleSearch.state.query) {
                SubtitleSearch.highlightResults(container, true);
            }
        },
 
        // 添加辅助方法来处理最近字幕的高亮
        highlightNearestSubtitle(currentTime, spans) {
            let nearestSpan = null;
            let minDiff = Infinity;

            spans.forEach(span => {
                const from = parseFloat(span.dataset.from);
                const to = parseFloat(span.dataset.to);
                const diff = Math.min(
                    Math.abs(currentTime - from),
                    Math.abs(currentTime - to)
                );

                if (diff < minDiff) {
                    minDiff = diff;
                    nearestSpan = span;
                }
            });

            if (nearestSpan && minDiff < 1) { // 1秒内的最近字幕
                nearestSpan.classList.add('active');
            }
        }
    };
 
    // 添加新的复制功能模块
    const SubtitleCopy = {
        // 生成纯文本格式
        generatePlainText(subtitles) {
            return subtitles.body.map(item => item.content).join('\n');
        },

        // 生成SRT格式
        generateSRT(subtitles) {
            return subtitles.body.map((item, index) => {
                const startTime = TimeFormatter.formatTimeWithMs(item.from);
                const endTime = TimeFormatter.formatTimeWithMs(item.to);
                return `${index + 1}\n${startTime} --> ${endTime}\n${item.content}\n`;
            }).join('\n');
        },

        // 复制到剪贴板
        async copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
                // 可以添加一个简单的提示
                const tip = document.createElement('div');
                tip.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0,0,0,0.7);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 4px;
                    z-index: 10000;
                `;
                tip.textContent = '复制成功';
                document.body.appendChild(tip);
                setTimeout(() => tip.remove(), 1500);
            } catch (err) {
                console.error('复制失败:', err);
            }
        }
    };
 
    // 添加新的搜索功能模块
    const SubtitleSearch = {
        state: {
            query: '',
            results: [],
            currentIndex: -1,
            isCaseSensitive: false
        },
        
        // 搜索字幕内容
        search(subtitles, query, isCaseSensitive = false) {
            if (!query || !subtitles || !subtitles.body) {
                this.state.results = [];
                this.state.currentIndex = -1;
                return [];
            }
            
            this.state.query = query;
            this.state.isCaseSensitive = isCaseSensitive;
            
            const results = [];
            
            subtitles.body.forEach((subtitle, index) => {
                const content = subtitle.content;
                const searchText = isCaseSensitive ? content : content.toLowerCase();
                const searchQuery = isCaseSensitive ? query : query.toLowerCase();
                
                if (searchText.includes(searchQuery)) {
                    results.push(index);
                }
            });
            
            this.state.results = results;
            this.state.currentIndex = results.length > 0 ? 0 : -1;
            
            return results;
        },
        
        // 高亮显示搜索结果
        highlightResults(container, isMergedView = false) {
            if (!this.state.query || this.state.results.length === 0) {
                return;
            }
            
            const query = this.state.query;
            const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const pattern = new RegExp(`(${escapeRegExp(query)})`, this.state.isCaseSensitive ? 'g' : 'gi');
            
            if (isMergedView) {
                const spans = container.querySelectorAll('.subtitle-span');
                spans.forEach(span => {
                    const index = parseInt(span.dataset.index);
                    if (this.state.results.includes(index)) {
                        span.innerHTML = span.textContent.replace(pattern, '<mark>$1</mark>');
                        if (index === this.state.results[this.state.currentIndex]) {
                            span.querySelector('mark').classList.add('current');
                        }
                    }
                });
            } else {
                const items = container.querySelectorAll('.subtitle-item');
                items.forEach(item => {
                    const index = parseInt(item.dataset.index);
                    const textSpan = item.querySelector('.subtitle-text');
                    
                    if (this.state.results.includes(index)) {
                        textSpan.innerHTML = textSpan.textContent.replace(pattern, '<mark>$1</mark>');
                        if (index === this.state.results[this.state.currentIndex]) {
                            textSpan.querySelector('mark').classList.add('current');
                        }
                    }
                });
            }
        },
        
        // 导航到下一个结果
        nextResult(subtitles, container, isMergedView = false) {
            if (this.state.results.length === 0) return;
            
            this.state.currentIndex = (this.state.currentIndex + 1) % this.state.results.length;
            this.navigateToResult(subtitles, container, isMergedView);
        },
        
        // 导航到上一个结果
        prevResult(subtitles, container, isMergedView = false) {
            if (this.state.results.length === 0) return;
            
            this.state.currentIndex = (this.state.currentIndex - 1 + this.state.results.length) % this.state.results.length;
            this.navigateToResult(subtitles, container, isMergedView);
        },
        
        // 导航到当前结果
        navigateToResult(subtitles, container, isMergedView = false) {
            if (this.state.results.length === 0 || this.state.currentIndex < 0) return;
            
            // 更新高亮
            this.highlightResults(container, isMergedView);
            
            // 找到当前元素
            const currentResultIndex = this.state.results[this.state.currentIndex];
            let targetElement;
            
            if (isMergedView) {
                targetElement = container.querySelector(`.subtitle-span[data-index="${currentResultIndex}"]`);
            } else {
                targetElement = container.querySelector(`.subtitle-item[data-index="${currentResultIndex}"]`);
            }
            
            if (targetElement) {
                // 滚动到该元素
                SubtitleSync.smoothScrollToElement(targetElement, container);
                
                // 更新计数显示
                const countElement = document.querySelector('.subtitle-search-count');
                if (countElement) {
                    countElement.textContent = `${this.state.currentIndex + 1}/${this.state.results.length}`;
                }
            }
        },
        
        // 清除搜索结果
        clearResults(container, isMergedView = false) {
            this.state.query = '';
            this.state.results = [];
            this.state.currentIndex = -1;
            
            // 清除高亮
            if (isMergedView) {
                const spans = container.querySelectorAll('.subtitle-span');
                spans.forEach(span => {
                    span.innerHTML = span.textContent;
                });
            } else {
                const items = container.querySelectorAll('.subtitle-item');
                items.forEach(item => {
                    const textSpan = item.querySelector('.subtitle-text');
                    textSpan.innerHTML = textSpan.textContent;
                });
            }
            
            // 更新计数显示
            const countElement = document.querySelector('.subtitle-search-count');
            if (countElement) {
                countElement.textContent = '0/0';
            }
        }
    };
 
    // 主函数更新
    async function main() {
        // 等待弹幕列表容器加载
        const danmakuContainer = await new Promise(resolve => {
            const check = () => {
                const container = document.querySelector('.bui-collapse-wrap');
                if (container) {
                    resolve(container);
                } else {
                    setTimeout(check, 1000);
                }
            };
            check();
        });
 
        // 注入样式
        SubtitleUI.injectStyles();
 
        // 创建UI
        const { container, header, content } = SubtitleUI.createSubtitleUI();
        danmakuContainer.appendChild(container);
 
        // 切换展开/收起
        let isExpanded = false;
        header.addEventListener('click', () => {
            isExpanded = !isExpanded;
            container.querySelector('.subtitle-content').style.height = 
                isExpanded ? '429px' : '0';  // 36px(功能栏) + 393px(内容区)
            header.querySelector('.arrow-icon').classList.toggle('expanded', isExpanded);
        });
        // 声明subtitles变量
        let subtitles = null;
 
        // 加载字幕
        try {
            const videoInfo = await SubtitleFetcher.getVideoInfo();
            if (!videoInfo.cid) {
                throw new Error('无法获取视频信息');
            }
 
            const subtitleConfig = await SubtitleFetcher.getSubtitleConfig(videoInfo);
            if (!subtitleConfig) {
                throw new Error('该视频没有CC字幕');
            }
 
            subtitles = await SubtitleFetcher.getSubtitleContent(subtitleConfig.subtitles[0].subtitle_url);
            if (!subtitles) {
                throw new Error('获取字幕内容失败');
            }
 
            let isMergedView = false;
            const menuIcon = container.querySelector('.subtitle-menu-icon');
            const menuDropdown = container.querySelector('.subtitle-menu-dropdown');

            // 切换菜单显示
            menuIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                menuDropdown.classList.toggle('show');
            });

            // 点击其他地方关闭菜单
            document.addEventListener('click', () => {
                menuDropdown.classList.remove('show');
            });

            // 处理菜单项点击
            menuDropdown.addEventListener('click', async (e) => {
                const menuItem = e.target.closest('.subtitle-menu-item');
                if (!menuItem) return;

                const action = menuItem.dataset.action;
                switch (action) {
                    case 'toggle-view':
                        isMergedView = !isMergedView;
                        menuItem.textContent = isMergedView ? '单条显示' : '合并显示';
                        menuItem.classList.toggle('active', isMergedView);
                        SubtitleSync.displaySubtitles(subtitles, content, isMergedView);
                        // 重新应用搜索高亮
                        if (container.querySelector('.subtitle-search-input').value.trim()) {
                            SubtitleSearch.highlightResults(content, isMergedView);
                            SubtitleSearch.navigateToResult(subtitles, content, isMergedView);
                        }
                        break;
                    case 'copy-text':
                        await SubtitleCopy.copyToClipboard(
                            SubtitleCopy.generatePlainText(subtitles)
                        );
                        break;
                    case 'copy-srt':
                        await SubtitleCopy.copyToClipboard(
                            SubtitleCopy.generateSRT(subtitles)
                        );
                        break;
                }
                menuDropdown.classList.remove('show');
            });
 
            // 搜索功能初始化
            const searchInput = container.querySelector('.subtitle-search-input');
            const prevBtn = container.querySelector('.subtitle-search-prev');
            const nextBtn = container.querySelector('.subtitle-search-next');

            // 搜索输入事件
            searchInput.addEventListener('input', () => {
                const query = searchInput.value.trim();
                if (query) {
                    const results = SubtitleSearch.search(subtitles, query);
                    SubtitleSearch.highlightResults(content, isMergedView);
                    
                    // 更新计数显示
                    const countElement = container.querySelector('.subtitle-search-count');
                    countElement.textContent = results.length > 0 ? 
                        `${SubtitleSearch.state.currentIndex + 1}/${results.length}` : '0/0';
                        
                    // 如果有结果，导航到第一个结果
                    if (results.length > 0) {
                        SubtitleSearch.navigateToResult(subtitles, content, isMergedView);
                    }
                } else {
                    SubtitleSearch.clearResults(content, isMergedView);
                }
            });

            // 上一个结果按钮
            prevBtn.addEventListener('click', () => {
                SubtitleSearch.prevResult(subtitles, content, isMergedView);
            });

            // 下一个结果按钮
            nextBtn.addEventListener('click', () => {
                SubtitleSearch.nextResult(subtitles, content, isMergedView);
            });
 
            // 显示字幕
            SubtitleSync.displaySubtitles(subtitles, content, isMergedView);
 
            // 更新字幕同步逻辑
            setInterval(() => {
                if (isExpanded) {  // 移除!isMergedView条件
                    SubtitleSync.highlightCurrentSubtitle(subtitles, content, isMergedView);
                }
            }, 100);
 
            // 在合并视图中添加点击事件处理
            content.addEventListener('click', (e) => {
                const span = e.target.closest('.subtitle-span');
                if (span && window.player) {
                    const from = parseFloat(span.dataset.from);
                    window.player.seek(from);
                }
            });
 
        } catch (error) {
            console.error('Error:', error);
            content.innerHTML = `<div class="subtitle-item">${error.message}</div>`;
        }
    }
 
    // 等待页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})(); 
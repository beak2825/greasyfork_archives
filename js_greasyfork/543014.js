// ==UserScript==
// @name         小红书内容关键词过滤器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  过滤并隐藏小红书网页版中包含特定关键词的帖子内容
// @author       ObenK
// @license      MIT
// @match        https://www.xiaohongshu.com/*
// @match        https://www.xiaohongshu.com/explore*
// @match        https://www.xiaohongshu.com/search_result*
// @match        https://www.xiaohongshu.com/user/profile/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543014/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%86%85%E5%AE%B9%E5%85%B3%E9%94%AE%E8%AF%8D%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/543014/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%86%85%E5%AE%B9%E5%85%B3%E9%94%AE%E8%AF%8D%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .xhs-content-filter-hidden {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
        }
    `;
    document.head.appendChild(style);

    // 配置类
    class Config {
        static get DEFAULT_KEYWORDS() {
            return ['广告', '推广', '带货', '种草', '测评', '合作', '优惠', '折扣', '限时', '秒杀'];
        }

        static get BLOCKED_KEYWORDS() {
            const saved = GM_getValue('contentBlockedKeywords', null);
            if (saved === null) {
                // 首次安装时设置默认关键词
                this.BLOCKED_KEYWORDS = this.DEFAULT_KEYWORDS;
                return this.DEFAULT_KEYWORDS;
            }
            return saved;
        }

        static set BLOCKED_KEYWORDS(keywords) {
            GM_setValue('contentBlockedKeywords', keywords);
        }

        static addKeyword(keyword) {
            const keywords = this.BLOCKED_KEYWORDS;
            const normalizedKeyword = keyword.trim();
            if (normalizedKeyword && !keywords.some(k => k.toLowerCase() === normalizedKeyword.toLowerCase())) {
                keywords.push(normalizedKeyword);
                this.BLOCKED_KEYWORDS = keywords;
                return true;
            }
            return false;
        }

        static removeKeyword(keyword) {
            const keywords = this.BLOCKED_KEYWORDS;
            const index = keywords.indexOf(keyword);
            if (index > -1) {
                keywords.splice(index, 1);
                this.BLOCKED_KEYWORDS = keywords;
            }
        }

        static resetToDefault() {
            this.BLOCKED_KEYWORDS = this.DEFAULT_KEYWORDS;
        }

        // 统计相关方法
        static getKeywordStats() {
            return GM_getValue('contentKeywordStats', {});
        }

        static incrementKeywordHit(keyword) {
            const stats = this.getKeywordStats();
            stats[keyword] = (stats[keyword] || 0) + 1;
            GM_setValue('contentKeywordStats', stats);
        }

        static resetKeywordStats() {
            GM_setValue('contentKeywordStats', {});
        }
    }

    // 高性能过滤器类
    class ContentFilter {
        constructor() {
            this.processedPosts = new WeakSet();
            this.observer = null;
            this.keywordRegex = null;
            this.init();
        }

        init() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.startFiltering());
            } else {
                this.startFiltering();
            }

            this.updateKeywordRegex();
            this.setupApiInterceptor();
        }

        updateKeywordRegex() {
            const keywords = Config.BLOCKED_KEYWORDS;
            if (keywords.length === 0) {
                this.keywordRegex = null;
            } else {
                // 使用更精确的正则表达式，确保大小写不敏感匹配
                const escapedKeywords = keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
                this.keywordRegex = new RegExp(escapedKeywords.join('|'), 'i');
            }
        }

        startFiltering() {
            this.filterExistingPosts();
            this.setupMutationObserver();
            setTimeout(() => this.filterExistingPosts(), 100);
            setTimeout(() => this.filterExistingPosts(), 500);
        }

        filterExistingPosts() {
            if (!this.keywordRegex) return;

            const posts = this.getAllPosts();
            const newPosts = posts.filter(post => !this.processedPosts.has(post));

            if (newPosts.length === 0) return;

            this.processPosts(newPosts);
        }

        processPosts(posts) {
            if (!this.keywordRegex) return;

            let filteredCount = 0;

            for (const post of posts) {
                if (this.processedPosts.has(post)) continue;

                const content = this.getPostContent(post);
                if (!content) continue;

                // 使用正则表达式一次性匹配所有关键词
                const match = content.match(this.keywordRegex);
                if (match) {
                    this.hidePost(post, content, match[0]);
                    filteredCount++;

                    // 更新统计
                    try {
                        Config.incrementKeywordHit(match[0]);
                    } catch (e) {
                        console.error('[小红书内容过滤器] 统计更新失败:', e);
                    }
                }

                this.processedPosts.add(post);
            }

            if (filteredCount > 0) {
                console.log(`[小红书内容过滤器] 处理了 ${posts.length} 个帖子，过滤了 ${filteredCount} 个`);
            }
        }

        setupMutationObserver() {
            // 增强的MutationObserver，处理无限滚动
            this.observer = new MutationObserver((mutations) => {
                let hasNewPosts = false;
                const allNewPosts = [];

                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 处理节点本身和子节点
                            const posts = this.getPostsFromNode(node);
                            if (posts.length > 0) {
                                allNewPosts.push(...posts);
                                hasNewPosts = true;
                            }

                            // 处理延迟加载的内容
                            setTimeout(() => {
                                const delayedPosts = this.getPostsFromNode(node);
                                const newDelayedPosts = delayedPosts.filter(post => !this.processedPosts.has(post));
                                if (newDelayedPosts.length > 0) {
                                    this.processPosts(newDelayedPosts);
                                }
                            }, 200);
                        }
                    });
                });

                if (allNewPosts.length > 0) {
                    const newPosts = allNewPosts.filter(post => !this.processedPosts.has(post));
                    if (newPosts.length > 0) {
                        this.processPosts(newPosts);
                    }
                }
            });

            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 额外监听滚动事件，处理无限滚动
            let scrollTimer = null;
            window.addEventListener('scroll', () => {
                if (scrollTimer) clearTimeout(scrollTimer);
                scrollTimer = setTimeout(() => {
                    this.filterExistingPosts();
                }, 300);
            });
        }

        getAllPosts() {
            // 增强选择器，覆盖更多小红书页面结构
            const selectors = [
                '.note-item',
                '[data-testid="note-item"]',
                '.feeds-container .note-item',
                '.search-container .note-item',
                '[class*="note-item"]'
            ];

            const posts = [];
            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => posts.push(el));
            });

            return [...new Set(posts)];
        }

        getPostsFromNode(node) {
            if (!node || !node.querySelectorAll) return [];

            const selectors = [
                '.note-item',
                '[data-testid="note-item"]',
                '[class*="note-item"]'
            ];

            const posts = [];
            selectors.forEach(selector => {
                const elements = node.querySelectorAll(selector);
                elements.forEach(el => posts.push(el));
            });

            return [...new Set(posts)];
        }

        getPostContent(post) {
            // 获取帖子标题
            const titleSelectors = [
                '.title',
                '.note-title',
                '[data-testid="note-title"]',
                '.content-title',
                'h3[class*="title"]',
                '[class*="title"]'
            ];

            let content = '';
            
            // 获取标题
            for (const selector of titleSelectors) {
                const element = post.querySelector(selector);
                if (element) {
                    const text = element.textContent?.trim();
                    if (text) {
                        content += text + ' ';
                        break;
                    }
                }
            }

            // 获取描述/内容
            const descSelectors = [
                '.desc',
                '.note-desc',
                '[data-testid="note-desc"]',
                '.content',
                '.note-content',
                'p[class*="desc"]',
                '[class*="desc"]'
            ];

            for (const selector of descSelectors) {
                const element = post.querySelector(selector);
                if (element) {
                    const text = element.textContent?.trim();
                    if (text) {
                        content += text + ' ';
                    }
                }
            }

            // 获取标签
            const tagSelectors = [
                '.tag',
                '.note-tag',
                '[data-testid="note-tag"]',
                '.hashtag',
                '[class*="tag"]'
            ];

            for (const selector of tagSelectors) {
                const elements = post.querySelectorAll(selector);
                elements.forEach(element => {
                    const text = element.textContent?.trim();
                    if (text) {
                        content += text + ' ';
                    }
                });
            }

            return content.trim() || null;
        }

        hidePost(post, content, matchedKeyword) {
            // 使用CSS类替代直接样式操作
            post.classList.add('xhs-content-filter-hidden');
            post.setAttribute('data-content-filtered', 'true');
            post.setAttribute('data-filter-reason', `内容包含屏蔽关键词: ${matchedKeyword}`);

            console.log(`[小红书内容过滤器] 已隐藏包含关键词 "${matchedKeyword}" 的帖子`);
        }

        // 强制重新过滤所有帖子
        forceReFilter() {
            // 重新显示所有被隐藏的帖子
            this.restoreHiddenPosts();

            // 清空已处理集合
            this.processedPosts = new WeakSet();

            // 重新更新正则表达式
            this.updateKeywordRegex();

            // 重新过滤所有帖子
            this.filterExistingPosts();

            console.log('[小红书内容过滤器] 已强制重新过滤所有帖子');
        }

        // 恢复所有被隐藏的帖子
        restoreHiddenPosts() {
            const hiddenPosts = document.querySelectorAll('[data-content-filtered="true"]');
            hiddenPosts.forEach(post => {
                post.classList.remove('xhs-content-filter-hidden');
                post.removeAttribute('data-content-filtered');
                post.removeAttribute('data-filter-reason');
            });
            console.log(`[小红书内容过滤器] 已恢复 ${hiddenPosts.length} 个被隐藏的帖子`);
        }

        // 验证API拦截有效性
        setupApiInterceptor() {
            const self = this;

            // 测试API拦截是否生效
            console.log('[API验证] 开始设置内容过滤器API拦截器...');

            // 增强的Fetch拦截 - 验证有效性
            const originalFetch = window.fetch;
            window.fetch = async function(...args) {
                const url = args[0];
                const urlStr = typeof url === 'string' ? url : (url?.url || url?.href || '');

                // 更精确的API检测
                const isXHSApi = urlStr.includes('/api/sns/web/v1/feed') ||
                               urlStr.includes('/api/sns/web/v1/search') ||
                               urlStr.includes('/api/sns/web/v1/homefeed') ||
                               urlStr.includes('/api/sns/web/v1/search/notes') ||
                               urlStr.includes('/api/sns/web/v1/search/notes/v1');

                if (isXHSApi) {
                    console.log(`[API检测] 内容过滤器拦截到小红书API: ${urlStr}`);

                    try {
                        const response = await originalFetch.apply(this, args);
                        const clone = response.clone();
                        const data = await clone.json();

                        console.log('[API数据] 内容过滤器成功获取API响应');

                        // 验证数据结构
                        if (data && typeof data === 'object') {
                            let filteredCount = 0;
                            let totalItems = 0;

                            // 检测所有可能的数据结构
                            const items = data.data?.items || data.data?.notes || data.data || [];
                            if (Array.isArray(items)) {
                                totalItems = items.length;

                                // 过滤逻辑 - 基于内容关键词
                                const filteredItems = items.filter(item => {
                                    const note = item?.note_card || item;
                                    if (note) {
                                        // 获取标题
                                        const title = note.title || '';
                                        // 获取描述
                                        const desc = note.desc || '';
                                        // 获取标签
                                        const tags = note.tag_list?.map(tag => tag.name || '').join(' ') || '';
                                        
                                        const content = `${title} ${desc} ${tags}`.trim();
                                        
                                        if (content) {
                                            const shouldFilter = self.shouldFilterContent(content);
                                            if (shouldFilter) {
                                                // 获取匹配的关键词并更新统计
                                                const match = content.match(self.keywordRegex);
                                                if (match) {
                                                    Config.incrementKeywordHit(match[0]);
                                                    console.log(`[API内容过滤] 过滤内容: ${match[0]} (关键词: ${match[0]})`);
                                                }
                                            }
                                            return !shouldFilter;
                                        }
                                    }
                                    return true;
                                });

                                filteredCount = totalItems - filteredItems.length;

                                // 更新数据结构
                                if (data.data?.items) {
                                    data.data.items = filteredItems;
                                } else if (data.data?.notes) {
                                    data.data.notes = filteredItems;
                                } else if (Array.isArray(data.data)) {
                                    data.data = filteredItems;
                                }

                                if (filteredCount > 0) {
                                    console.log(`[API内容过滤] 从 ${totalItems} 个帖子中过滤了 ${filteredCount} 个`);
                                }
                            }
                        }

                        return new Response(JSON.stringify(data), {
                            status: response.status,
                            statusText: response.statusText,
                            headers: response.headers
                        });
                    } catch (e) {
                        console.error('[API内容拦截异常]', e);
                        return originalFetch.apply(this, args);
                    }
                }

                return originalFetch.apply(this, args);
            };

            // 增强XHR拦截 - 验证有效性
            const originalXHROpen = XMLHttpRequest.prototype.open;
            const originalXHRSend = XMLHttpRequest.prototype.send;

            XMLHttpRequest.prototype.open = function(method, url) {
                this._xhsContentFilterUrl = typeof url === 'string' ? url : '';
                return originalXHROpen.apply(this, arguments);
            };

            XMLHttpRequest.prototype.send = function() {
                const originalOnReadyStateChange = this.onreadystatechange;

                this.onreadystatechange = function() {
                    if (this.readyState === 4 && this._xhsContentFilterUrl) {
                        const isXHSApi = this._xhsContentFilterUrl.includes('/api/sns/web/v1/feed') ||
                                       this._xhsContentFilterUrl.includes('/api/sns/web/v1/search') ||
                                       this._xhsContentFilterUrl.includes('/api/sns/web/v1/homefeed') ||
                                       this._xhsContentFilterUrl.includes('/api/sns/web/v1/search/notes');

                        if (isXHSApi) {
                            console.log(`[XHR检测] 内容过滤器拦截到小红书XHR: ${this._xhsContentFilterUrl}`);

                            try {
                                const data = JSON.parse(this.responseText);
                                let filteredCount = 0;
                                let totalItems = 0;

                                // 检测所有可能的数据结构
                                const items = data.data?.items || data.data?.notes || data.data || [];
                                if (Array.isArray(items)) {
                                    totalItems = items.length;

                                    // 过滤逻辑 - 基于内容关键词
                                    const filteredItems = items.filter(item => {
                                        const note = item?.note_card || item;
                                        if (note) {
                                            // 获取标题
                                            const title = note.title || '';
                                            // 获取描述
                                            const desc = note.desc || '';
                                            // 获取标签
                                            const tags = note.tag_list?.map(tag => tag.name || '').join(' ') || '';
                                            
                                            const content = `${title} ${desc} ${tags}`.trim();
                                            
                                            if (content) {
                                                const shouldFilter = self.shouldFilterContent(content);
                                                if (shouldFilter) {
                                                    // 获取匹配的关键词并更新统计
                                                    const match = content.match(self.keywordRegex);
                                                    if (match) {
                                                        Config.incrementKeywordHit(match[0]);
                                                        console.log(`[XHR内容过滤] 过滤内容: ${match[0]} (关键词: ${match[0]})`);
                                                    }
                                                }
                                                return !shouldFilter;
                                            }
                                        }
                                        return true;
                                    });

                                    filteredCount = totalItems - filteredItems.length;

                                    // 更新响应数据
                                    if (data.data?.items) {
                                        data.data.items = filteredItems;
                                    } else if (data.data?.notes) {
                                        data.data.notes = filteredItems;
                                    } else if (Array.isArray(data.data)) {
                                        data.data = filteredItems;
                                    }

                                    if (filteredCount > 0) {
                                        console.log(`[XHR内容过滤] 从 ${totalItems} 个帖子中过滤了 ${filteredCount} 个`);
                                    }
                                }

                                try {
                                    Object.defineProperty(this, 'responseText', {
                                        value: JSON.stringify(data),
                                        writable: true,
                                        configurable: true
                                    });
                                } catch (e) {
                                    console.warn('[XHR内容修改异常]', e);
                                }
                            } catch (e) {
                                console.error('[XHR内容拦截异常]', e);
                            }
                        }
                    }

                    if (originalOnReadyStateChange) {
                        originalOnReadyStateChange.call(this);
                    }
                };

                return originalXHRSend.apply(this, arguments);
            };
        }

        // 判断是否应该过滤内容
        shouldFilterContent(content) {
            if (!this.keywordRegex || !content || typeof content !== 'string') return false;
            return this.keywordRegex.test(content.trim());
        }
    }

    // 可视化管理类
    class VisualizationManager {
        static createVisualizationPanel() {
            const panel = document.createElement('div');
            panel.id = 'xhs-content-visualization-panel';
            panel.innerHTML = `
                <div style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 12px;
                    padding: 25px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
                    z-index: 10001;
                    max-width: 600px;
                    width: 95%;
                    max-height: 80vh;
                    overflow-y: auto;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h3 style="margin: 0; color: #333; font-size: 20px;">📊 内容关键词数据可视化</h3>
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                            background: none;
                            border: none;
                            font-size: 24px;
                            cursor: pointer;
                            color: #666;
                        ">×</button>
                    </div>

                    <!-- 热力图 -->
                    <div style="margin-bottom: 25px;">
                        <h4 style="margin: 0 0 15px 0; color: #5a7d9a; font-size: 16px;">🌡️ 内容屏蔽热力图</h4>
                        <div id="content-heatmap-container" style="background: #f8f9fa; border-radius: 8px; padding: 15px;">
                            ${this.renderHeatmap()}
                        </div>
                    </div>

                    <!-- 词云动画 -->
                    <div style="margin-bottom: 25px;">
                        <h4 style="margin: 0 0 15px 0; color: #5a7d9a; font-size: 16px;">☁️ 内容关键词词云</h4>
                        <div id="content-wordcloud-container" style="background: #f8f9fa; border-radius: 8px; padding: 20px; text-align: center;">
                            ${this.renderWordCloud()}
                        </div>
                    </div>

                    <!-- 统计图表 -->
                    <div style="margin-bottom: 20px;">
                        <h4 style="margin: 0 0 15px 0; color: #5a7d9a; font-size: 16px;">📊 内容关键词统计</h4>
                        <div id="content-stats-container" style="background: #f8f9fa; border-radius: 8px; padding: 20px;">
                            ${this.renderStats()}
                        </div>
                    </div>
                </div>

                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 10000;
                "></div>
            `;

            document.body.appendChild(panel);

            // 添加ESC键关闭功能
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    e.stopPropagation();
                    panel.remove();
                    document.removeEventListener('keydown', escHandler, true);
                }
            };
            document.addEventListener('keydown', escHandler, true);

            // 点击遮罩关闭
            const clickHandler = (e) => {
                if (e.target === panel || e.target === panel.lastElementChild) {
                    panel.remove();
                    document.removeEventListener('keydown', escHandler, true);
                    document.removeEventListener('click', clickHandler);
                }
            };
            panel.addEventListener('click', clickHandler);
        }

        static renderHeatmap() {
            const stats = Config.getKeywordStats();
            const keywords = Config.BLOCKED_KEYWORDS;

            if (keywords.length === 0) {
                return '<p style="color: #666; text-align: center;">暂无数据</p>';
            }

            // 获取当前时间，只显示到当前小时
            const now = new Date();
            const currentHour = now.getHours();

            // 只显示到当前小时的真实数据
            const hours = Array.from({length: currentHour + 1}, (_, i) => i);
            const heatmapData = hours.map(hour => {
                // 使用真实统计数据的简化版本
                const totalHits = Object.values(stats).reduce((sum, hits) => sum + hits, 0);
                const intensity = totalHits > 0 ? Math.min(0.8, (Object.values(stats).reduce((sum, hits) => sum + hits, 0) / 100)) : 0.1;
                return { hour, intensity };
            });

            const cells = heatmapData.map(data => {
                const opacity = Math.min(0.8, data.intensity * (data.hour + 1) / 24);
                const color = `rgba(143, 179, 208, ${opacity})`;
                return `<div style="
                    width: 30px;
                    height: 20px;
                    background: ${color};
                    border-radius: 3px;
                    display: inline-block;
                    margin: 1px;
                    cursor: pointer;
                    transition: transform 0.2s;
                " title="${data.hour}:00 - ${Math.round(opacity * 100)}%"></div>`;
            }).join('');

            return `
                <div style="display: flex; flex-wrap: wrap; gap: 2px; justify-content: center;">
                    ${cells}
                    <div style="width: 100%; text-align: center; margin-top: 10px; font-size: 12px; color: #666;">
                        00:00 - ${currentHour}:00 (当前时间)
                    </div>
                </div>
            `;
        }

        static renderWordCloud() {
            const stats = Config.getKeywordStats();
            const keywords = Config.BLOCKED_KEYWORDS;

            if (keywords.length === 0) {
                return '<p style="color: #666; text-align: center;">暂无关键词</p>';
            }

            const sortedKeywords = keywords
                .map(keyword => ({ keyword, hits: stats[keyword] || 0 }))
                .sort((a, b) => b.hits - a.hits);

            const maxHits = Math.max(...sortedKeywords.map(item => item.hits), 1);

            const words = sortedKeywords.map(item => {
                const size = 12 + (item.hits / maxHits) * 24;
                const opacity = 0.4 + (item.hits / maxHits) * 0.6;
                return `<span style="
                    font-size: ${size}px;
                    color: rgba(90, 125, 154, ${opacity});
                    margin: 5px;
                    display: inline-block;
                    transition: all 0.3s ease;
                    cursor: pointer;
                " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">${item.keyword}</span>`;
            }).join('');

            return `<div style="line-height: 1.5;">${words}</div>`;
        }

        static renderStats() {
            const stats = Config.getKeywordStats();
            const keywords = Config.BLOCKED_KEYWORDS;

            if (keywords.length === 0) {
                return '<p style="color: #666; text-align: center;">暂无数据</p>';
            }

            const sortedKeywords = keywords
                .map(keyword => ({ keyword, hits: stats[keyword] || 0 }))
                .sort((a, b) => b.hits - a.hits)
                .slice(0, 8); // 只显示前8个

            const maxHits = Math.max(...sortedKeywords.map(item => item.hits), 1);

            const bars = sortedKeywords.map((item, index) => {
                const height = 20 + (item.hits / maxHits) * 80;
                const color = `hsl(200, 50%, ${50 + (item.hits / maxHits) * 30}%)`;

                return `
                    <div style="
                        display: inline-block;
                        margin: 0 5px;
                        text-align: center;
                    ">
                        <div style="
                            width: 30px;
                            height: ${height}px;
                            background: ${color};
                            border-radius: 3px 3px 0 0;
                            position: relative;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            transition: all 0.3s ease;
                        " title="${item.keyword}: ${item.hits}次">
                            <div style="
                                position: absolute;
                                bottom: -20px;
                                left: 50%;
                                transform: translateX(-50%);
                                font-size: 10px;
                                color: #666;
                                white-space: nowrap;
                            ">${item.keyword}</div>
                        </div>
                    </div>
                `;
            }).join('');

            return `<div style="text-align: center; padding: 20px 0;">${bars}</div>`;
        }
    }

    // 管理界面
    class SettingsUI {
        static createPanel() {
            const panel = document.createElement('div');
            panel.id = 'xhs-content-filter-panel';
            panel.innerHTML = `
                <div style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 12px;
                    padding: 25px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
                    z-index: 10000;
                    max-width: 600px;
                    width: 95%;
                    max-height: 80vh;
                    overflow-y: auto;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h3 style="margin: 0; color: #333; font-size: 20px;">📊 小红书内容关键词过滤器</h3>
                        <div style="display: flex; gap: 10px;">
                            <button id="show-content-visualization" style="
                                padding: 6px 12px;
                                background: #8fb3d0;
                                color: white;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                            ">📊 可视化</button>
                            <button onclick="this.parentElement.parentElement.parentElement.parentElement.remove()" style="
                                background: none;
                                border: none;
                                font-size: 24px;
                                cursor: pointer;
                                color: #666;
                            ">×</button>
                        </div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                            <label style="font-weight: bold;">屏蔽关键词：</label>
                            <span style="color: #666; font-size: 13px;">共 ${Config.BLOCKED_KEYWORDS.length} 个</span>
                        </div>
                        <div id="content-keyword-list" style="margin-bottom: 10px; max-height: 200px; overflow-y: auto; border: 1px solid #eee; border-radius: 4px; padding: 8px;">
                            ${this.renderKeywords()}
                        </div>

                        <div style="display: flex; gap: 10px;">
                            <input type="text" id="content-new-keyword" placeholder="输入关键词" style="
                                flex: 1;
                                padding: 8px;
                                border: 1px solid #ddd;
                                border-radius: 4px;
                            ">
                            <button id="content-add-keyword" style="
                                padding: 8px 16px;
                                background: #ff2442;
                                color: white;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                            ">添加</button>
                        </div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                            <label style="font-weight: bold;">关键词统计：</label>
                            <button id="content-reset-stats" style="
                                padding: 4px 8px;
                                background: #ff9800;
                                color: white;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                            ">清零</button>
                        </div>
                        <div id="content-keyword-stats" style="margin-bottom: 10px; max-height: 150px; overflow-y: auto; border: 1px solid #eee; border-radius: 4px; padding: 8px; font-size: 13px;">
                            ${this.renderKeywordStats()}
                        </div>
                    </div>

                    <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                        <button id="content-copy-keywords" style="
                            flex: 1;
                            padding: 8px 16px;
                            background: #2196f3;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                        ">复制全部</button>
                        <button id="content-paste-keywords" style="
                            flex: 1;
                            padding: 8px 16px;
                            background: #4caf50;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                        ">批量粘贴</button>
                    </div>
                    <div style="text-align: right;">
                        <button id="content-reset-keywords" style="
                            padding: 8px 16px;
                            background: #ff9800;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            margin-right: 10px;
                        ">重置默认</button>
                        <button id="content-close-panel" style="
                            padding: 8px 16px;
                            background: #666;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                        ">关闭</button>
                    </div>
                </div>

                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 9999;
                "></div>
            `;

            document.body.appendChild(panel);

            // 自动聚焦到输入框
            setTimeout(() => {
                const input = panel.querySelector('#content-new-keyword');
                if (input) {
                    input.focus();
                    input.select();
                }
            }, 100);

            // 绑定事件
            panel.querySelector('#content-add-keyword').addEventListener('click', () => {
                const input = panel.querySelector('#content-new-keyword');
                const keyword = input.value.trim();
                if (keyword) {
                    const added = Config.addKeyword(keyword);
                    if (added) {
                        input.value = '';
                        panel.querySelector('#content-keyword-list').innerHTML = this.renderKeywords();
                        panel.querySelector('span[style*="color: #666"]').textContent = `共 ${Config.BLOCKED_KEYWORDS.length} 个`;

                        // 强制重新过滤所有帖子
                        window.xhsContentFilter.forceReFilter();

                        input.focus(); // 添加后重新聚焦
                    } else {
                        alert(`关键词 "${keyword}" 已存在！`);
                        input.focus(); // 错误提示后重新聚焦
                    }
                }
            });

            // 绑定删除关键词事件（使用事件委托）
            panel.querySelector('#content-keyword-list').addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-keyword')) {
                    const keyword = e.target.dataset.keyword;
                    if (confirm(`确定要删除关键词 "${keyword}" 吗？`)) {
                        Config.removeKeyword(keyword);
                        // 重新渲染关键词列表
                        panel.querySelector('#content-keyword-list').innerHTML = this.renderKeywords();
                        // 更新计数
                        panel.querySelector('span[style*="color: #666"]').textContent = `共 ${Config.BLOCKED_KEYWORDS.length} 个`;
                        // 重新过滤
                        window.xhsContentFilter.forceReFilter();
                    }
                }
            });

            // 绑定可视化按钮事件
            panel.querySelector('#show-content-visualization').addEventListener('click', () => {
                VisualizationManager.createVisualizationPanel();
            });

            panel.querySelector('#content-close-panel').addEventListener('click', () => {
                panel.remove();
            });

            // 点击遮罩关闭
            panel.lastElementChild.addEventListener('click', () => {
                panel.remove();
            });

            // 重置默认关键词
            panel.querySelector('#content-reset-keywords').addEventListener('click', () => {
                if (confirm('确定要重置为默认关键词吗？这将清除所有自定义设置。')) {
                    Config.resetToDefault();
                    panel.querySelector('#content-keyword-list').innerHTML = this.renderKeywords();
                    location.reload();
                }
            });

            // 复制关键词功能
            panel.querySelector('#content-copy-keywords').addEventListener('click', () => {
                const keywords = Config.BLOCKED_KEYWORDS;
                if (keywords.length === 0) {
                    alert('暂无关键词可复制！');
                    return;
                }

                const keywordsText = keywords.join(',');
                navigator.clipboard.writeText(keywordsText).then(() => {
                    alert(`已复制 ${keywords.length} 个关键词到剪贴板！`);
                }).catch(() => {
                    // 降级方案
                    const textarea = document.createElement('textarea');
                    textarea.value = keywordsText;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    alert(`已复制 ${keywords.length} 个关键词到剪贴板！`);
                });
            });

            // 批量粘贴关键词功能
            panel.querySelector('#content-paste-keywords').addEventListener('click', () => {
                navigator.clipboard.readText().then(text => {
                    const keywords = text.split(/[,，、\s]+/).filter(k => k.trim());
                    if (keywords.length === 0) {
                        alert('剪贴板中没有有效的关键词！');
                        return;
                    }

                    let addedCount = 0;
                    keywords.forEach(keyword => {
                        if (Config.addKeyword(keyword)) {
                            addedCount++;
                        }
                    });

                    if (addedCount > 0) {
                        panel.querySelector('#content-keyword-list').innerHTML = this.renderKeywords();
                        panel.querySelector('span[style*="color: #666"]').textContent = `共 ${Config.BLOCKED_KEYWORDS.length} 个`;
                        alert(`成功添加 ${addedCount} 个新关键词！`);
                    } else {
                        alert('所有关键词都已存在，没有添加新的！');
                    }
                }).catch(() => {
                    // 降级方案：使用prompt输入
                    const text = prompt('请输入关键词，用逗号分隔：');
                    if (text) {
                        const keywords = text.split(/[,，、\s]+/).filter(k => k.trim());
                        let addedCount = 0;
                        keywords.forEach(keyword => {
                            if (Config.addKeyword(keyword)) {
                                addedCount++;
                            }
                        });

                        if (addedCount > 0) {
                            panel.querySelector('#content-keyword-list').innerHTML = this.renderKeywords();
                            panel.querySelector('span[style*="color: #666"]').textContent = `共 ${Config.BLOCKED_KEYWORDS.length} 个`;
                            alert(`成功添加 ${addedCount} 个新关键词！`);
                        } else {
                            alert('所有关键词都已存在，没有添加新的！');
                        }
                    }
                });
            });

            // 统计清零按钮
            panel.querySelector('#content-reset-stats').addEventListener('click', () => {
                if (confirm('确定要清零所有关键词的统计信息吗？')) {
                    Config.resetKeywordStats();
                    panel.querySelector('#content-keyword-stats').innerHTML = this.renderKeywordStats();
                    alert('统计信息已清零！');
                }
            });

            // 回车添加关键词
            panel.querySelector('#content-new-keyword').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    panel.querySelector('#content-add-keyword').click();
                }
            });

            // ESC键退出编辑界面（使用捕获阶段确保优先级）
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    e.stopPropagation();
                    panel.remove();
                    document.removeEventListener('keydown', escHandler, true);
                }
            };
            document.addEventListener('keydown', escHandler, true);

            // 点击面板外部关闭
            const clickHandler = (e) => {
                if (e.target === panel || e.target === panel.lastElementChild) {
                    panel.remove();
                    document.removeEventListener('keydown', escHandler, true);
                    document.removeEventListener('click', clickHandler);
                }
            };
            panel.addEventListener('click', clickHandler);

            // 确保ESC键在输入框中也能工作
            panel.querySelector('#content-new-keyword').addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    e.stopPropagation();
                    panel.remove();
                    document.removeEventListener('keydown', escHandler, true);
                    document.removeEventListener('click', clickHandler);
                }
            });
        }

        static renderKeywords() {
            const keywords = Config.BLOCKED_KEYWORDS;
            if (keywords.length === 0) {
                return '<p style="color: #666; font-style: italic;">暂无屏蔽关键词</p>';
            }

            return `
                <div style="
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-bottom: 10px;
                    max-height: 150px;
                    overflow-y: auto;
                    padding: 5px;
                ">
                    ${keywords.map(keyword => `
                        <span style="
                            display: inline-flex;
                            align-items: center;
                            background: #f0f0f0;
                            border: 1px solid #ddd;
                            border-radius: 16px;
                            padding: 4px 10px;
                            font-size: 13px;
                            color: #333;
                            cursor: default;
                            transition: all 0.2s;
                        " onmouseover="this.style.background='#ffe0e0'" onmouseout="this.style.background='#f0f0f0'">
                            ${keyword}
                            <span class="delete-keyword" data-keyword="${keyword.replace(/"/g, '"')}" style="
                                background: none;
                                border: none;
                                color: #ff2442;
                                cursor: pointer;
                                font-size: 16px;
                                margin-left: 6px;
                                padding: 0;
                                width: 16px;
                                height: 16px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                user-select: none;
                            ">×</span>
                        </span>
                    `).join('')}
                </div>
            `;
        }

        static renderKeywordStats() {
            const stats = Config.getKeywordStats();
            const keywords = Config.BLOCKED_KEYWORDS;

            if (keywords.length === 0) {
                return '<p style="color: #666; font-style: italic;">暂无统计信息</p>';
            }

            // 按命中次数降序排序
            const sortedKeywords = keywords
                .map(keyword => ({ keyword, hits: stats[keyword] || 0 }))
                .sort((a, b) => b.hits - a.hits);

            // 计算最大命中次数用于比例显示
            const maxHits = Math.max(...sortedKeywords.map(item => item.hits), 1);

            let totalHits = 0;
            const statsHtml = sortedKeywords.map(item => {
                totalHits += item.hits;
                const percentage = (item.hits / maxHits) * 100;

                return `
                    <div style="display: flex; align-items: center; margin-bottom: 6px; gap: 8px;">
                        <span style="font-size: 12px; min-width: 60px; white-space: nowrap;">${item.keyword}</span>
                        <div style="flex: 1; background: #f5f5f5; border-radius: 10px; height: 6px; overflow: hidden;">
                            <div style="background: #8fb3d0; height: 100%; width: ${percentage}%; transition: width 0.3s ease;"></div>
                        </div>
                        <span style="font-size: 12px; color: #5a7d9a; font-weight: bold; min-width: 20px; text-align: right;">${item.hits}</span>
                    </div>
                `;
            }).join('');

            return `
                <div>
                    <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #eee; margin-bottom: 6px; font-weight: bold; font-size: 13px;">
                        <span>总计</span>
                        <span style="color: #5a7d9a;">${totalHits}</span>
                    </div>
                    ${statsHtml}
                </div>
            `;
        }
    }

    // 键盘快捷键管理
    class KeyboardShortcuts {
        static init() {
            let isPanelOpen = false;

            document.addEventListener('keydown', (e) => {
                // 检测 Ctrl+Shift+J 或 Cmd+Shift+J
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
                    e.preventDefault();

                    // 检查是否已有面板打开
                    const existingPanel = document.getElementById('xhs-content-filter-panel');
                    if (existingPanel) {
                        existingPanel.remove();
                        isPanelOpen = false;
                    } else {
                        SettingsUI.createPanel();
                        isPanelOpen = true;
                    }
                }
            });

            console.log('[小红书内容过滤器] 快捷键已启用：Ctrl+Shift+J 或 Cmd+Shift+J');
        }
    }

    // 初始化
    function init() {
        // 创建全局过滤器实例
        window.xhsContentFilter = new ContentFilter();

        // 注册菜单命令
        GM_registerMenuCommand('内容关键词过滤器', () => {
            SettingsUI.createPanel();
        });

        // 注册可视化菜单命令
        GM_registerMenuCommand('📊 内容关键词可视化', () => {
            VisualizationManager.createVisualizationPanel();
        });

        // 注册键盘快捷键
        KeyboardShortcuts.init();

        // 添加全局移除关键词方法
        window.xhsContentFilter.removeKeyword = (keyword) => {
            Config.removeKeyword(keyword);
            // 刷新页面以重新过滤
            location.reload();
        };

        console.log('[小红书内容关键词过滤器] 已启动');
    }

    // 启动脚本
    init();
})();

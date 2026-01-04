// ==UserScript==
// @name         🐱 全世界都要变成可爱猫猫！
// @version      4.3.4
// @description  让整个网络世界都变成超可爱的猫娘语调喵～
// @author       超萌猫娘开发队
// @match        *://*/*
// @include      *://*.bilibili.com/video/*
// @include      *://*.bilibili.com/anime/*
// @include      *://*.bilibili.com/bangumi/play/*
// @exclude      *://greasyfork.org/*
// @exclude      *://*.gov/*
// @exclude      *://*.edu/*
// @icon         https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Cat/3D/cat_3d.png
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// @namespace https://greasyfork.org/users/1503554
// @downloadURL https://update.greasyfork.org/scripts/545316/%F0%9F%90%B1%20%E5%85%A8%E4%B8%96%E7%95%8C%E9%83%BD%E8%A6%81%E5%8F%98%E6%88%90%E5%8F%AF%E7%88%B1%E7%8C%AB%E7%8C%AB%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/545316/%F0%9F%90%B1%20%E5%85%A8%E4%B8%96%E7%95%8C%E9%83%BD%E8%A6%81%E5%8F%98%E6%88%90%E5%8F%AF%E7%88%B1%E7%8C%AB%E7%8C%AB%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 版本管理 =====
    const SCRIPT_VERSION = "4.3.4";
    const isVersionUpdate = GM_getValue("SCRIPT_VERSION") !== SCRIPT_VERSION;
    if (isVersionUpdate) {
        GM_setValue("SCRIPT_VERSION", SCRIPT_VERSION);
        console.log('🎉 猫娘脚本已更新到版本', SCRIPT_VERSION);
    }
    const UPdate_What = "修复黑名单只能添加一个的问题 😽"

    // ===== 增强配置系统 =====
    const defaultConfig = {
        // 性能配置
        performance: {
            processInterval: 5000,
            maxProcessingTimeSlice: 8,
            batchSize: 5,
            observerThrottle: 1000,
            maxRetryAttempts: 10,
            idleCallbackTimeout: 2000,
            debounceDelay: 500
        },

        // 功能开关
        features: {
            affectInput: false,
            bilibiliMergeALinks: true,
            bilibiliRandomizeUserNames: true, // 用户名前缀功能开关
            autoProcessNewContent: true,
            shadowDomSupport: true,
            performanceMonitoring: false,
            debugMode: false,
            smartProcessing: true,
            enableBlacklist: true, // 黑名单功能开关
            showOriginalOnHover: false // 鼠标悬停显示原文功能开关
        },

        // 站点配置
        sites: {
            excludeDomains: [
                'github.com', 'stackoverflow.com', 'google.com',
                'gov.cn', 'edu.cn', 'greasyfork.org'
            ],
            bilibili: {
                smartPause: true,
                retryInterval: 1000,
                maxRetryDelay: 5000,
                commentSelector: 'bili-comment-thread-renderer',
                userNameSelector: '#user-name a',
                contentSelector: '#contents span'
            }
        },

        // 黑名单配置
        blacklist: {
            sites: [], // 格式: [{domain: 'example.com', type: 'site'|'page', url: '', expiry: timestamp, reason: ''}]
            defaultDuration: 24 * 60 * 60 * 1000, // 24小时
            enabled: true
        },

        // 用户偏好 - 优化描述
        preferences: {
            cuteLevel: 'normal', // low, normal, high
            customEndings: [],
            disabledWords: [],
            processingMode: 'contextual', // gentle(保守替换), contextual(上下文感知), aggressive(积极替换)
            intelligentReplacement: true,
            replacementIntensity: 0.3, // 替换强度 0.1-1.0
            endingFrequency: 0.3, // 结尾词频率 0.1-1.0 (降低频率)
            decorativeFrequency: 0.2 // 装饰符频率 0.1-1.0
        },

        // 统计信息
        stats: {
            processedElements: 0,
            replacedWords: 0,
            lastActive: new Date().toISOString(),
            installDate: new Date().toISOString(),
            sessionProcessed: 0,
            blacklistHits: 0 // 黑名单命中次数
        }
    };


    // 加载用户配置
    let userConfig = GM_getValue("catgirlConfig") || {};

    // 正确的合并方式：始终创建一个新对象。
    // 以 defaultConfig 为基础，然后用 userConfig 中的设置覆盖它。
    // 这样既能保留用户的设置，又能在脚本更新时补充上新增的默认选项。
    let CONFIG = Object.assign({}, defaultConfig, userConfig);

    // 如果是版本更新，将合并后的新版配置保存回去，并显示更新通知。
    if (isVersionUpdate) {
        GM_setValue("catgirlConfig", CONFIG);
        showUpdateNotification();
    }

    // ===== 扩展的可爱元素库 =====
    const cuteLibrary = {
        endings: {
            low: ['喵', '呢', '哦', '啊'],
            normal: ['喵～', 'にゃん', '喵呜', 'nya~', '喵喵', '呢～'],
            high: ['喵～♪', 'にゃん♡', '喵呜～', 'nya~♡', '喵喵desu', 'にゃ♡', 'mew~', '喵♪', 'nyaa～', '喵desu～', '喵呢～', '喵哈～']
        },

        userPrefixes: ['🏳️‍⚧️', '✨', '💕', '🌸', '🎀', '🌟'],
        decorativePrefixes: ['✨', '💫', '⭐', '🌸', '🎀', '💎'],

        emotionalEndings: {
            excited: ['喵！', 'にゃん！', '哇喵～', '好棒喵～'],
            calm: ['喵～', '呢～', '嗯喵', '是这样喵'],
            happy: ['开心喵～', '嘻嘻喵', '哈哈喵～', '好开心喵'],
            confused: ['诶喵？', '嗯？喵', '咦喵～', '不懂喵'],
            sad: ['呜呜喵', '难过喵', '555喵', '想哭喵']
        }
    };

    // ===================================================================
    // ===== 网站适配器模块 (Site Adapter Modules) =====
    // ===================================================================
    const siteModules = {
        // Bilibili 适配器
        'bilibili.com': {
            name: 'Bilibili',
            // 需要处理的评论区选择器
            commentSelectors: [
                '.reply-item .reply-content', '.comment-item .comment-content', '.bili-comment-content',
                '#contents span', '.comment-text'
            ],
            // 用户名选择器
            usernameSelectors: [
                '.user-name', '.reply-author', '.comment-author', '#user-name a', '.author-name'
            ],
            // 动态内容容器（用于 MutationObserver 监控）
            dynamicContentContainer: '.reply-list',
            // 针对该网站的特殊处理函数
            postProcessing: function(app) {
                // 将原有的 B 站链接转文本功能放在这里
                if (CONFIG.features.bilibiliMergeALinks) {
                    app.processBilibiliLinks(); // 假设 processBilibiliLinks 已被正确实现
                }
            }
        },

        // YouTube 适配器 (示例)
        'youtube.com': {
            name: 'YouTube',
            commentSelectors: [
                '#content-text', // YouTube 评论文本
                'yt-formatted-string.ytd-comment-renderer'
            ],
            usernameSelectors: [
                '#author-text' // YouTube 用户名
            ],
            dynamicContentContainer: '#comments #contents', // YouTube 加载新评论的容器
            // YouTube 没有像B站那样的特殊需求，所以这里留空或不定义
            postProcessing: null
        },

        // 如果未来要支持 Twitter, 可以这样添加
        // 'twitter.com': { ... }
    };






    // ===== 黑名单管理器 =====
    class BlacklistManager {
        constructor() {
            this.panel = null;
            this.isVisible = false;
        }

        isBlacklisted() {
            if (!CONFIG.blacklist.enabled) return false;

            const currentDomain = location.hostname;
            const currentUrl = location.href;
            const now = Date.now();

            for (const item of CONFIG.blacklist.sites) {
                // 检查是否过期
                if (item.expiry && item.expiry < now) {
                    this.removeExpiredItem(item);
                    continue;
                }

                // 检查域名匹配
                if (item.type === 'site' && currentDomain.includes(item.domain)) {
                    CONFIG.stats.blacklistHits++;
                    return true;
                }

                // 检查页面匹配
                if (item.type === 'page' && currentUrl === item.url) {
                    CONFIG.stats.blacklistHits++;
                    return true;
                }
            }

            return false;
        }

        addToBlacklist(type, duration, reason = '') {
            const now = Date.now();
            const expiry = duration === -1 ? null : now + duration;
            const domain = location.hostname;
            const url = type === 'page' ? location.href : '';

            // 检查是否存在相同的域名，如果存在则更新而不是添加新项
            const existingIndex = CONFIG.blacklist.sites.findIndex(item => {
                if (item.type === 'site' && type === 'site') {
                    return item.domain === domain;
                }
                if (item.type === 'page' && type === 'page') {
                    return item.url === url;
                }
                return false;
            });

            if (existingIndex !== -1) {
                // 更新现有项目，按照最新的进行计时
                CONFIG.blacklist.sites[existingIndex] = {
                    ...CONFIG.blacklist.sites[existingIndex],
                    expiry: expiry,
                    reason: reason,
                    addedAt: now
                };
                const durationText = duration === -1 ? '永久' : this.formatDuration(duration);
                const typeText = type === 'site' ? '整站' : '单页面';
                showToast(`已更新${typeText}黑名单时间 (${durationText})`, 'success');
            } else {
                // 添加新项目
                const item = {
                    id: this.generateId(),
                    domain: domain,
                    url: url,
                    type: type,
                    expiry: expiry,
                    reason: reason,
                    addedAt: now
                };

                CONFIG.blacklist.sites.push(item);
                const durationText = duration === -1 ? '永久' : this.formatDuration(duration);
                const typeText = type === 'site' ? '整站' : '单页面';
                showToast(`已将${typeText}加入黑名单 (${durationText})`, 'success');
            }

            GM_setValue("catgirlConfig", CONFIG);
        }

        updateDisplay() {
            this.displayItems(CONFIG.blacklist.sites);
        }

        removeFromBlacklist(id) {
            CONFIG.blacklist.sites = CONFIG.blacklist.sites.filter(item => item.id !== id);
            GM_setValue("catgirlConfig", CONFIG);
            this.updateDisplay();
            showToast('已从黑名单移除', 'success');
        }

        removeExpiredItem(item) {
            CONFIG.blacklist.sites = CONFIG.blacklist.sites.filter(i => i.id !== item.id);
            GM_setValue("catgirlConfig", CONFIG);
        }

        generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }

        formatDuration(ms) {
            if (ms === -1) return '永久';
            const days = Math.floor(ms / (24 * 60 * 60 * 1000));
            const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
            if (days > 0) return `${days}天${hours}小时`;
            if (hours > 0) return `${hours}小时`;
            return '不到1小时';
        }

        show() {
            if (!this.panel) this.create();
            this.panel.style.display = 'block';
            this.isVisible = true;
            this.updateDisplay();
        }

        hide() {
            if (this.panel) {
                this.panel.style.display = 'none';
                this.isVisible = false;
            }
        }

        create() {
            if (this.panel) return;

            this.panel = document.createElement('div');
            this.panel.id = 'catgirl-blacklist';
            this.panel.innerHTML = this.getHTML();
            this.panel.style.cssText = this.getCSS();

            document.body.appendChild(this.panel);
            this.bindEvents();
        }

        getHTML() {
            return `
                <div class="blacklist-header">
                    <h3>🚫 网站黑名单管理</h3>
                    <button class="close-btn" data-action="close">×</button>
                </div>

                <div class="blacklist-content">
                    <div class="current-site-section">
                        <h4>🌐 当前网站操作</h4>
                        <div class="current-site-info">
                            <strong>域名:</strong> <code>${location.hostname}</code><br>
                            <strong>页面:</strong> <code>${location.pathname}</code>
                        </div>

                        <div class="blacklist-actions">
                            <div class="action-group">
                                <label>拉黑类型</label>
                                <select id="blacklist-type">
                                    <option value="site">整个网站</option>
                                    <option value="page">仅当前页面</option>
                                </select>
                                <small>选择要屏蔽的范围</small>
                            </div>

                            <div class="action-group">
                                <label>拉黑时长</label>
                                <select id="blacklist-duration">
                                    <option value="3600000">1小时</option>
                                    <option value="21600000">6小时</option>
                                    <option value="86400000">1天</option>
                                    <option value="604800000">1周</option>
                                    <option value="2592000000">1个月</option>
                                    <option value="-1">永久</option>
                                </select>
                                <small>选择屏蔽的持续时间</small>
                            </div>

                            <div class="action-group">
                                <label>拉黑原因</label>
                                <input type="text" id="blacklist-reason" placeholder="可选，记录拉黑原因">
                                <small>记录屏蔽原因，方便后续管理</small>
                            </div>

                            <button id="add-to-blacklist" class="btn-danger">🚫 加入黑名单</button>
                        </div>
                    </div>

                    <div class="blacklist-section">
                        <h4>📋 黑名单列表</h4>
                        <div class="search-section">
                            <input type="text" id="blacklist-search" class="search-input" placeholder="搜索域名或原因...">
                            <div class="search-hint">💡 支持域名和屏蔽原因搜索</div>
                        </div>
                        <div id="blacklist-items" class="blacklist-scroll"></div>
                        <div class="blacklist-stats">
                            <small>黑名单命中次数: <span id="blacklist-hits">${CONFIG.stats.blacklistHits}</span></small>
                        </div>
                    </div>

                    <div class="blacklist-settings">
                        <h4>⚙️ 黑名单设置</h4>
                        <label>
                            <input type="checkbox" id="enable-blacklist" ${CONFIG.blacklist.enabled ? 'checked' : ''}>
                            启用黑名单功能
                        </label>
                        <small>关闭后将忽略所有黑名单规则</small>
                    </div>

                    <div class="actions">
                        <button id="save-blacklist" class="btn-primary">💾 保存设置</button>
                        <button id="clear-expired" class="btn-secondary">🧹 清理过期</button>
                    </div>
                </div>

                <canvas id="cat-paw-canvas-blacklist" width="60" height="60"></canvas>
            `;
        }

        getCSS() {
            return `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: 600px; max-height: 85vh; background: #ffffff; border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3); z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
                display: none; overflow: hidden;
            `;
        }


        // 显示黑名单项目
        // 显示黑名单项目
        displayItems(items, searchQuery = '') {
            const container = document.getElementById('blacklist-items');
            if (!container) return;

            const now = Date.now();
            const itemsHTML = items.map(item => {
                const isExpired = item.expiry && item.expiry < now;
                const timeLeft = item.expiry ? this.formatDuration(item.expiry - now) : '永久';
                const addedAt = new Date(item.addedAt).toLocaleString();

                let displayDomain = item.domain;
                let displayReason = item.reason || '';

                // 修正后的高亮逻辑
                if (searchQuery) {
                    // 过滤掉无效的关键词并为正则表达式转义特殊字符
                    const keywords = searchQuery.split(' ').filter(k => k.trim()).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
                    if (keywords.length > 0) {
                        const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
                        displayDomain = displayDomain.replace(regex, '<span class="search-highlight">$1</span>');
                        displayReason = displayReason.replace(regex, '<span class="search-highlight">$1</span>');
                    }
                }

                return `
                    <div class="blacklist-item ${isExpired ? 'expired' : ''}">
                        <div class="item-info">
                            <div class="item-domain">${displayDomain}</div>
                            <div class="item-details">
                                类型: ${item.type === 'site' ? '整站' : '单页面'} |
                                剩余: ${isExpired ? '已过期' : timeLeft} |
                                添加: ${addedAt}
                                ${displayReason ? `<br>原因: ${displayReason}` : ''}
                            </div>
                        </div>
                        <button data-remove-id="${item.id}" class="remove-btn">移除</button>
                    </div>
                `;
            }).join('');

            container.innerHTML = itemsHTML || '<div class="empty-state">暂无匹配的黑名单项目</div>';

            const removeButtons = container.querySelectorAll('.remove-btn[data-remove-id]');
            removeButtons.forEach(btn => {
                btn.onclick = () => {
                    const id = btn.getAttribute('data-remove-id');
                    this.removeFromBlacklist(id);
                };
            });

            const hitsEl = document.getElementById('blacklist-hits');
            if (hitsEl) hitsEl.textContent = CONFIG.stats.blacklistHits;
        }


        // 黑名单搜索功能
        searchBlacklist(queryString) {
            const trimmedQuery = queryString?.trim() || '';
            const allItems = CONFIG.blacklist.sites;

            if (!trimmedQuery) {
                // 重置搜索，显示所有项目
                this.displayItems(allItems, '');
                return;
            }

            // 创建竞争映射
            const raceMap = new Map();
            allItems.forEach((item, index) => {
                raceMap.set(index, [
                    item.domain,
                    item.reason || '',
                    '',
                    0
                ]);
            });

            // 执行搜索竞争
            const keywords = trimmedQuery.trim().replace(/\s+/g, " ").split(" ");

            for (const [key, value] of raceMap) {
                let totalScore = 0;
                const domain = value[0].toLowerCase();
                const reason = value[1].toLowerCase();

                keywords.forEach((keyword) => {
                    const keywordLower = keyword.toLowerCase();

                    // 域名完全匹配
                    if (domain === keywordLower) {
                        totalScore += 10;
                    }

                    // 域名开头匹配
                    if (domain.startsWith(keywordLower)) {
                        totalScore += 5;
                    }

                    // 域名包含关键词
                    const domainMatches = (domain.match(new RegExp(keywordLower, 'g')) || []).length;
                    totalScore += domainMatches * 2;

                    // 原因匹配
                    const reasonMatches = (reason.match(new RegExp(keywordLower, 'g')) || []).length;
                    totalScore += reasonMatches;
                });

                raceMap.set(key, [
                    value[0],
                    value[1],
                    trimmedQuery,
                    totalScore
                ]);
            }

            // 排序并返回结果
            const sortedResults = Array.from(raceMap.entries())
            .filter(([_, value]) => value[3] > 0)
            .sort((a, b) => b[1][3] - a[1][3])
            .map(([key]) => {
                const item = { ...allItems[key] };
                item.user_word = trimmedQuery;
                return item;
            });

            this.displayItems(sortedResults, trimmedQuery);
        }


        drawCatPaw() {
            const canvas = document.getElementById('cat-paw-canvas-blacklist');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            const size = 60;

            // 清空画布
            ctx.clearRect(0, 0, size, size);

            // 设置样式
            ctx.fillStyle = '#ffb6c1'; // 樱花粉色
            ctx.strokeStyle = '#ff69b4';
            ctx.lineWidth = 2;

            // 绘制猫爪垫（主要部分）
            ctx.beginPath();
            ctx.arc(30, 35, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // 绘制四个小爪垫
            const pads = [
                { x: 20, y: 20, size: 6 },
                { x: 40, y: 20, size: 6 },
                { x: 15, y: 30, size: 5 },
                { x: 45, y: 30, size: 5 }
            ];

            pads.forEach(pad => {
                ctx.beginPath();
                ctx.arc(pad.x, pad.y, pad.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            });

            // 添加高光效果
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(25, 30, 4, 0, Math.PI * 2);
            ctx.fill();

            // 设置canvas位置
            canvas.style.cssText = `
                position: absolute;
                bottom: 15px;
                right: 15px;
                opacity: 0.6;
                pointer-events: none;
            `;
        }


        bindEvents() {
            // 关闭按钮
            this.panel.querySelector('[data-action="close"]').onclick = () => this.hide();

            // 添加到黑名单
            document.getElementById('add-to-blacklist').onclick = () => {
                const type = document.getElementById('blacklist-type').value;
                const duration = parseInt(document.getElementById('blacklist-duration').value);
                const reason = document.getElementById('blacklist-reason').value;

                this.addToBlacklist(type, duration, reason);
                this.updateDisplay();
            };

            // 保存设置
            document.getElementById('save-blacklist').onclick = () => {
                CONFIG.blacklist.enabled = document.getElementById('enable-blacklist').checked;
                GM_setValue("catgirlConfig", CONFIG);
                showToast('黑名单设置已保存', 'success');
            };

            // 清理过期
            document.getElementById('clear-expired').onclick = () => {
                this.clearExpired();
            };

            // 搜索功能
            const searchInput = document.getElementById('blacklist-search');
            if (searchInput) {
                searchInput.oninput = (e) => {
                    this.searchBlacklist(e.target.value);
                };
            }

            // 绘制猫爪
            this.drawCatPaw();
        }

        updateDisplay() {
            const container = document.getElementById('blacklist-items');
            if (!container) return;

            const now = Date.now();
            const items = CONFIG.blacklist.sites.map(item => {
                const isExpired = item.expiry && item.expiry < now;
                const timeLeft = item.expiry ? this.formatDuration(item.expiry - now) : '永久';
                const addedAt = new Date(item.addedAt).toLocaleString();

                return `
                    <div class="blacklist-item ${isExpired ? 'expired' : ''}">
                        <div class="item-info">
                            <div class="item-domain">${item.domain}</div>
                            <div class="item-details">
                                类型: ${item.type === 'site' ? '整站' : '单页面'} |
                                剩余: ${isExpired ? '已过期' : timeLeft} |
                                添加: ${addedAt}
                                ${item.reason ? `<br>原因: ${item.reason}` : ''}
                            </div>
                        </div>
                        <button data-remove-id="${item.id}" class="remove-btn">移除</button>
                    </div>
                `;
            }).join('');

            container.innerHTML = items || '<div class="empty-state">暂无黑名单项目</div>';

            // 绑定移除按钮事件
            const removeButtons = container.querySelectorAll('.remove-btn[data-remove-id]');
            removeButtons.forEach(btn => {
                btn.onclick = () => {
                    const id = btn.getAttribute('data-remove-id');
                    this.removeFromBlacklist(id);
                };
            });

            // 更新统计
            const hitsEl = document.getElementById('blacklist-hits');
            if (hitsEl) hitsEl.textContent = CONFIG.stats.blacklistHits;
        }

        clearExpired() {
            const now = Date.now();
            const before = CONFIG.blacklist.sites.length;
            CONFIG.blacklist.sites = CONFIG.blacklist.sites.filter(item =>
                                                                   !item.expiry || item.expiry > now
                                                                  );
            const after = CONFIG.blacklist.sites.length;
            const removed = before - after;

            GM_setValue("catgirlConfig", CONFIG);
            this.updateDisplay();
            showToast(`已清理 ${removed} 个过期项目`, 'success');
        }
    }

    // ===== 防抖工具类 =====
    class DebounceUtils {
        static debounce(func, delay) {
            let timeoutId;
            return function (...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        }

        static throttleWithDebounce(func, throttleMs, debounceMs) {
            let lastCallTime = 0;
            let debounceTimer;

            return function (...args) {
                const now = Date.now();
                clearTimeout(debounceTimer);

                if (now - lastCallTime >= throttleMs) {
                    lastCallTime = now;
                    func.apply(this, args);
                } else {
                    debounceTimer = setTimeout(() => {
                        lastCallTime = Date.now();
                        func.apply(this, args);
                    }, debounceMs);
                }
            };
        }
    }

    // ===== 增强的性能工具类 =====
    class EnhancedPerformanceUtils {
        static createTimeSliceProcessor(items, processor, options = {}) {
            const {
                batchSize = CONFIG.performance.batchSize,
                maxTime = CONFIG.performance.maxProcessingTimeSlice,
                onProgress = null,
                onComplete = null
            } = options;

            const processedKeys = new Set();
            const uniqueItems = items.filter(item => {
                const key = this.getItemKey(item);
                if (processedKeys.has(key)) return false;
                processedKeys.add(key);
                return true;
            });

            if (uniqueItems.length === 0) {
                if (onComplete) onComplete();
                return;
            }

            let index = 0;
            let startTime = Date.now();

            const processNextBatch = () => {
                const batchStartTime = performance.now();
                let processedInBatch = 0;

                while (index < uniqueItems.length &&
                       processedInBatch < batchSize &&
                       (performance.now() - batchStartTime) < maxTime) {

                    try {
                        processor(uniqueItems[index], index, uniqueItems);
                    } catch (error) {
                        console.error('🐱 处理项目出错:', error);
                    }

                    index++;
                    processedInBatch++;
                }

                if (onProgress) {
                    onProgress(index, uniqueItems.length, (index / uniqueItems.length) * 100);
                }

                if (index < uniqueItems.length) {
                    if (window.requestIdleCallback) {
                        requestIdleCallback(processNextBatch, {
                            timeout: CONFIG.performance.idleCallbackTimeout
                        });
                    } else {
                        setTimeout(processNextBatch, 16);
                    }
                } else {
                    const duration = Date.now() - startTime;
                    if (CONFIG.features.debugMode) {
                        console.log(`🎉 完成处理 ${uniqueItems.length} 个项目，耗时 ${duration}ms`);
                    }
                    if (onComplete) onComplete();
                }
            };

            processNextBatch();
        }

        static getItemKey(item) {
            if (item && item.nodeType === Node.ELEMENT_NODE) {
                return `${item.tagName}-${item.textContent ? item.textContent.slice(0, 20) : ''}-${item.offsetTop || 0}`;
            }
            return String(item);
        }
    }

    // ===== 状态管理类 =====
    class StateManager {
        constructor() {
            this.state = {
                isEnabled: true,
                currentUrl: location.href,
                processingQueue: new Set(),
                urlChangeHandlers: [],
                lastProcessTime: 0,

                bilibili: {
                    isCompleted: false,
                    lastProcessedUrl: '',
                    lastProcessedTime: 0,
                    retryCount: 0,
                    commentObserver: null,
                    lastCommentCount: 0
                }
            };
        }

        onUrlChange(handler) {
            if (!this.state.urlChangeHandlers) {
                this.state.urlChangeHandlers = [];
            }
            this.state.urlChangeHandlers.push(handler);
        }

        checkUrlChange() {
            const newUrl = location.href;
            if (newUrl !== this.state.currentUrl) {
                if (CONFIG.features.debugMode) {
                    console.log('🔄 页面切换:', this.state.currentUrl, '->', newUrl);
                }
                this.state.currentUrl = newUrl;

                this.state.bilibili.isCompleted = false;
                this.state.bilibili.lastProcessedUrl = newUrl;
                this.state.bilibili.retryCount = 0;
                this.state.bilibili.lastCommentCount = 0;

                if (this.state.urlChangeHandlers && Array.isArray(this.state.urlChangeHandlers)) {
                    this.state.urlChangeHandlers.forEach(handler => {
                        try {
                            if (typeof handler === 'function') {
                                handler(newUrl);
                            }
                        } catch (error) {
                            console.error('🐱 URL变化处理器出错:', error);
                        }
                    });
                }

                return true;
            }
            return false;
        }

        shouldProcess() {
            const now = Date.now();
            const timeSinceLastProcess = now - this.state.lastProcessTime;

            if (timeSinceLastProcess < 1000) {
                return false;
            }

            this.state.lastProcessTime = now;
            return true;
        }

        shouldSkipBilibiliProcessing() {
            if (!this.isBilibili()) return true;

            const { isCompleted, lastProcessedUrl, lastProcessedTime } = this.state.bilibili;
            const now = Date.now();

            return isCompleted &&
                lastProcessedUrl === location.href &&
                (now - lastProcessedTime) < 30000;
        }

        markBilibiliCompleted() {
            this.state.bilibili.isCompleted = true;
            this.state.bilibili.lastProcessedUrl = location.href;
            this.state.bilibili.lastProcessedTime = Date.now();
        }

        isBilibili() {
            return location.hostname.includes('bilibili.com');
        }

        checkBilibiliCommentChange() {
            if (!this.isBilibili()) return false;

            const commentThreads = document.querySelectorAll('bili-comment-thread-renderer');
            const currentCount = commentThreads.length;

            if (currentCount !== this.state.bilibili.lastCommentCount) {
                this.state.bilibili.lastCommentCount = currentCount;
                this.state.bilibili.isCompleted = false;
                return true;
            }

            return false;
        }
    }

    // ===== 增强的文本处理器 =====
    class EnhancedTextProcessor {
        constructor() {
            this.processedTexts = new Set();
            this.replacementStats = new Map();
            this.contextAnalyzer = new ContextAnalyzer();
            this.originalTexts = new WeakMap(); // 存储元素的原始文本
        }

        isProcessed(text) {
            return /喵[～~呜哈呢♪♡！]|nya|にゃ"|meow|🏳️‍⚧️|已处理标记/i.test(text) ||
                this.processedTexts.has(text);
        }

        getCuteEnding(context = 'normal') {
            const level = CONFIG.preferences.cuteLevel;
            const mode = CONFIG.preferences.processingMode;

            let endings = cuteLibrary.endings[level] || cuteLibrary.endings.normal;

            switch (mode) {
                case 'gentle':
                    endings = endings.slice(0, Math.ceil(endings.length / 2));
                    break;
                case 'aggressive':
                    endings = [...endings, ...cuteLibrary.emotionalEndings[context] || []];
                    break;
                case 'contextual':
                default:
                    if (cuteLibrary.emotionalEndings[context]) {
                        endings = [...endings, ...cuteLibrary.emotionalEndings[context]];
                    }
                    break;
            }

            return endings[Math.floor(Math.random() * endings.length)];
        }

        analyzeContext(text) {
            const excitedMarkers = /[！!？?]{2,}|哇|哟|啊{2,}/;
            const happyMarkers = /笑|哈哈|嘻嘻|开心|快乐|爽|棒/;
            const sadMarkers = /哭|难过|伤心|555|呜呜|痛苦/;
            const angryMarkers = /生气|愤怒|气死|烦|讨厌|恶心/;
            const confusedMarkers = /[？?]{2,}|什么|啥|诶|咦|奇怪/;

            if (excitedMarkers.test(text)) return 'excited';
            if (happyMarkers.test(text)) return 'happy';
            if (sadMarkers.test(text)) return 'sad';
            if (angryMarkers.test(text)) return 'excited';
            if (confusedMarkers.test(text)) return 'confused';
            if (/[。.，,；;]/.test(text)) return 'calm';

            return 'normal';
        }

        processText(text, options = {}) {
            if (!text?.trim() || this.isProcessed(text)) return text;

            if (CONFIG.preferences.disabledWords.some(word => text.includes(word))) {
                return text;
            }

            this.processedTexts.add(text);

            let result = text;
            let replacementCount = 0;

            const context = this.analyzeContext(text);
            const cleanups = this.getCleanupRules(context);

            cleanups.forEach(([regex, replacement]) => {
                const matches = result.match(regex);
                if (matches) {
                    const finalReplacement = this.getSmartReplacement(replacement, context);
                    result = result.replace(regex, finalReplacement);
                    replacementCount += matches.length;
                }
            });

            if (CONFIG.preferences.processingMode !== 'gentle' || replacementCount > 0) {
                result = this.addCuteEndings(result, context);
            }

            if (CONFIG.preferences.processingMode === 'aggressive' &&
                Math.random() < CONFIG.preferences.decorativeFrequency) {
                const prefix = cuteLibrary.decorativePrefixes[Math.floor(Math.random() * cuteLibrary.decorativePrefixes.length)];
                result = `${prefix} ${result}`;
            }

            if (replacementCount > 0) {
                CONFIG.stats.replacedWords += replacementCount;
                CONFIG.stats.sessionProcessed += replacementCount;
                this.updateReplacementStats(text, result);
            }

            return result;
        }

        getSmartReplacement(baseReplacement, context) {
            if (!CONFIG.preferences.intelligentReplacement) return baseReplacement;

            const contextEnding = cuteLibrary.emotionalEndings[context];
            if (contextEnding && Math.random() < 0.4) {
                const ending = contextEnding[Math.floor(Math.random() * contextEnding.length)];
                return `${baseReplacement}${ending}`;
            }

            return baseReplacement;
        }

        addCuteEndings(text, context = 'normal') {
            const getCuteEnding = () => this.getCuteEnding(context);
            const addDesu = () => {
                const chance = CONFIG.preferences.cuteLevel === 'high' ? 0.4 :
                CONFIG.preferences.cuteLevel === 'normal' ? 0.2 : 0.1;
                return Math.random() < chance ? 'です' : '';
            };

            let probability = CONFIG.preferences.endingFrequency;
            switch (CONFIG.preferences.processingMode) {
                case 'gentle':
                    probability *= 0.5;
                    break;
                case 'aggressive':
                    probability *= 2;
                    break;
            }

            return text
                .replace(/([也知兮之者焉啉]|[啊嗯呢吧哇哟哦嘛喔咯呵哼末])([\s\p{P}]|$)/gu,
                         (_, $1, $2) => `${getCuteEnding()}${addDesu()}${$2}`)
                .replace(/([的了辣])([\s\p{P}]|$)/gu,
                         (_, $1, $2) => Math.random() < probability ?
                         `${$1}${getCuteEnding()}${addDesu()}${$2}` : `${$1}${$2}`);
        }

        // ===== 大幅扩展的清理规则 - 针对B站和百度贴吧 =====
        getCleanupRules(context = 'normal') {
            const baseRules = [
                // ===== 极端攻击与侮辱性词汇 =====
                [/操你妈|操你娘|操你全家|肏你妈|干你妈|干你娘|去你妈的|去你娘的|去你全家/gi, '去睡觉觉'],
                [/妈了个?逼|妈的?智障|妈的/gi, '喵喵喵'],
                [/狗娘养的|狗杂种|狗东西|狗逼|狗比/gi, '不太好的小家伙'],
                [/操你大爷|去你大爷的|你大爷的/gi, '去玩耍啦'],
                [/去你老师的|你全家死光|你妈死了|你妈没了/gi, '嗯...安静一点'],
                [/你妈妈叫你回家吃饭|你妈炸了/gi, '你妈妈叫你回家吃饭'],

                // ===== 性相关及不雅词汇 =====
                [/鸡巴|鸡叭|鸡把|屌|吊|\bjb\b|\bJB\b|\bJj\b/gi, '小鱼干'],
                [/逼你|逼样|逼毛|逼崽子|什么逼|傻逼|煞逼|沙逼|装逼|牛逼|吹逼/gi, '小淘气'],
                [/肏|干你|草你|cao你|cao你妈|操逼|日你|日了|艹你/gi, '去玩耍啦'],
                [/生殖器|阴茎|阴道|性器官|做爱|啪啪|上床|嘿咻/gi, '小秘密'],

                // ===== B站特色脏话 =====
                [/小鬼|小学生|初中生|孤儿|没爹|没妈|爹妈死了/gi, '小朋友'],
                [/死妈|死全家|死开|去死|死了算了/gi, '去睡觉觉'],
                [/脑瘫|弱智|智障|残疾|白痴|傻子|蠢货|蠢蛋/gi, '小糊涂虫'],
                [/废物|废柴|废狗|垃圾|拉圾|辣鸡|人渣|渣渣/gi, '要抱抱的小家伙'],
                [/恶心|想吐|反胃|讨厌死了|烦死了/gi, '有点不开心'],

                // ===== 百度贴吧常见脏话 =====
                [/楼主是猪|楼主智障|楼主有病|lz有毒|楼主滚|lz滚/gi, '楼主很可爱'],
                [/水贴|灌水|刷屏|占楼|抢沙发|前排|火钳刘明/gi, '路过留名'],
                [/举报了|封号|删帖|水军|托儿|五毛|美分/gi, '认真讨论中'],
                [/撕逼|掐架|开撕|互喷|对骂|群嘲/gi, '友好交流'],

                // ===== 网络用语和缩写 =====
                [/\bcnm\b|\bCNM\b|c\s*n\s*m/gi, '你好软糯'],
                [/\bnmsl\b|\bNMSL\b|n\s*m\s*s\s*l/gi, '你超棒棒'],
                [/\bmlgb\b|\bMLGB\b|m\s*l\s*g\s*b/gi, '哇好厉害'],
                [/tmd|TMD|t\s*m\s*d|他妈的/gi, '太萌啦'],
                [/wtf|WTF|w\s*t\s*f|what\s*the\s*fuck/gi, '哇好神奇'],
                [/\bf\*\*k|\bf\*ck|fuck|\bFC\b|\bF\*\b/gi, '哇哦'],
                [/\bsh\*t|shit|\bs\*\*t/gi, '小意外'],
                [/\bbitch|\bb\*tch|\bb\*\*\*\*/gi, '小坏蛋'],

                // ===== 地域攻击相关 =====
                [/河南人|东北人|农村人|乡下人|山沟里|土包子/gi, '各地朋友'],
                [/北上广|屌丝|土豪|装富|穷逼|没钱|破产/gi, '普通人'],

                // ===== 游戏相关脏话 =====
                [/菜鸡|菜逼|坑货|坑爹|坑队友|演员|挂逼|开挂/gi, '游戏新手'],
                [/noob|萌新杀手|虐菜|吊打|碾压|秒杀/gi, '游戏高手'],

                // ===== 饭圈和明星相关 =====
                [/黑粉|脑残粉|私生饭|蹭热度|营销号|炒作|塌房/gi, '追星族'],
                [/爬|滚|死开|别来|有毒|拉黑|取关/gi, '不太喜欢'],

                // ===== 学历和职业攻击 =====
                [/小学毕业|没文化|文盲|初中肄业|高中都没毕业/gi, '正在学习中'],
                [/打工仔|搬砖|送外卖|快递员|保安|清洁工/gi, '勤劳的人'],

                // ===== 年龄相关攻击 =====
                [/老不死|老东西|老头子|老太婆|更年期|中年油腻/gi, '年长者'],
                [/熊孩子|小屁孩|幼稚|没长大|巨婴/gi, '年轻朋友'],

                // ===== 外貌身材攻击 =====
                [/丑逼|长得丑|颜值低|矮子|胖子|瘦猴|秃头|光头/gi, '独特的人'],
                [/整容|假脸|网红脸|蛇精脸|锥子脸/gi, '美丽的人'],

                // ===== 常见口头禅和语气词 =====
                [/我靠|我擦|我操|卧槽|握草|我草|尼玛|你妹/gi, '哇哦'],
                [/妈蛋|蛋疼|扯蛋|完蛋|滚蛋|鸡蛋|咸蛋/gi, '天哪'],
                [/见鬼|见了鬼|活见鬼|撞鬼了/gi, '好奇怪'],

                // ===== 网络流行语 =====
                [/笑死我了|笑死|xswl|XSWL|笑尿了/gi, '好有趣'],
                [/绝绝子|yyds|YYDS|永远的神|真香|真tm香/gi, '超级棒棒'],
                [/emo了|emo|EMO|破防了|破大防|血压高/gi, '有点难过'],
                [/社死|社会性死亡|尴尬死了|丢人现眼/gi, '有点害羞'],

                // ===== B站弹幕常见词汇 =====
                [/前方高能|高能预警|非战斗人员撤离|前排吃瓜/gi, '注意啦'],
                [/弹幕护体|弹幕保护|人类的本质|复读机/gi, '大家一起说'],
                [/鬼畜|魔性|洗脑|单曲循环|dssq|DSSQ/gi, '很有趣'],

                // ===== 百度贴吧表情包文字 =====
                [/滑稽|斜眼笑|狗头保命|手动狗头|\[狗头\]|\[滑稽\]/gi, '嘿嘿嘿'],
                [/微笑|呵呵|嘿嘿|嘻嘻|哈哈|哈哈哈/gi, '开心笑'],

                // ===== 政治敏感和争议话题 =====
                [/五毛党|美分党|公知|带路党|精神外国人|慕洋犬/gi, '不同观点的人'],
                [/粉红|小粉红|战狼|玻璃心|民族主义/gi, '爱国人士'],

                // ===== 其他常见不当用词 =====
                [/有病|脑子有问题|神经病|精神病|疯子|疯了/gi, '想法特别'],
                [/你有毒|有毒|中毒了|下毒|毒瘤/gi, '很特殊'],
                [/癌症|艾滋|梅毒|性病|传染病/gi, '不舒服'],
                [/自杀|跳楼|上吊|服毒|割腕/gi, '要好好的']
            ];

            // 根据可爱程度调整规则严格度
            if (CONFIG.preferences.cuteLevel === 'high') {
                // 高可爱程度下添加更多轻微词汇的替换
                const extraRules = [
                    [/靠|擦|艹|草/gi, '哎呀'],
                    [/烦|闷|郁/gi, '有点小情绪'],
                    [/累|疲惫|困|想睡|犯困/gi, '需要休息'],
                    [/痛|疼|难受|不舒|头疼/gi, '不太好'],
                    [/怒|生气|愤怒|漏火|火大/gi, '有点不开心'],
                    [/哭|难过|伤心|委屈|想哭/gi, '需要抱抱'],
                    [/怕|害怕|恐惧|担心|紧张/gi, '有点紧张'],
                    [/尴尬|囧|汗|无语|无奈/gi, '有点小尴尬'],
                    [/晕|蒙|糊涂|迷茫/gi, '有点迷茫'],
                    [/急|着急|焦虑|慌|慌张/gi, '有点小急'],
                ];
                baseRules.push(...extraRules);
            }

            // 根据上下文返回不同强度的规则
            return baseRules.map(([regex, replacement]) => {
                const contextEnding = this.getCuteEnding(context);
                return [regex, `${replacement}${contextEnding}`];
            });
        }

        updateReplacementStats(original, processed) {
            const key = `${original.length}:${processed.length}`;
            this.replacementStats.set(key, (this.replacementStats.get(key) || 0) + 1);
        }

        // 保存原始文本
        storeOriginalText(element, originalText) {
            this.originalTexts.set(element, originalText);
        }

        // 获取原始文本
        getOriginalText(element) {
            return this.originalTexts.get(element);
        }
    }

    // ===== 上下文分析器类 =====
    class ContextAnalyzer {
        constructor() {
            this.patterns = {
                excited: /[！!？?]{2,}|哇|哟|啊{2,}/,
                happy: /笑|哈哈|嘻嘻|开心|快乐|爽|棒/,
                sad: /哭|难过|伤心|555|呜呜|痛苦/,
                angry: /生气|愤怒|气死|烦|讨厌|恶心/,
                confused: /[？?]{2,}|什么|啥|诶|咦|奇怪/,
                calm: /[。.，,；;]/
            };
        }

        analyze(text) {
            for (const [emotion, pattern] of Object.entries(this.patterns)) {
                if (pattern.test(text)) {
                    return emotion;
                }
            }
            return 'normal';
        }
    }

    // ===== 增强设置面板类 =====
    class SettingsPanel {
        constructor() {
            this.isVisible = false;
            this.panel = null;
        }

        create() {
            if (this.panel) return;

            this.panel = document.createElement('div');
            this.panel.id = 'catgirl-settings';
            this.panel.innerHTML = this.getHTML();
            this.panel.style.cssText = this.getCSS();

            document.body.appendChild(this.panel);
            this.bindEvents();
        }

        getHTML() {
            return `
                <div class="settings-header">
                    <h3>🐱 猫娘化设置面板</h3>
                    <button class="close-btn" data-action="close">×</button>
                </div>

                <div class="settings-content">
                    <div class="tab-container">
                        <button class="tab-btn active" data-tab="basic">基础设置</button>
                        <button class="tab-btn" data-tab="advanced">高级设置</button>
                        <button class="tab-btn" data-tab="control">控制选项</button>
                        <button class="tab-btn" data-tab="stats">统计信息</button>
                    </div>

                    <div class="tab-content" id="basic-tab">
                        <div class="setting-group">
                            <label>🎀 可爱程度</label>
                            <select id="cute-level">
                                <option value="low">低 (温和可爱)</option>
                                <option value="normal" selected>普通 (标准可爱)</option>
                                <option value="high">高 (超级可爱，更多替换)</option>
                            </select>
                            <small>控制添加可爱词汇的数量和频率，高档位会替换更多轻微词汇</small>
                        </div>

                        <div class="setting-group">
                            <label>⚙️ 猫娘化风格</label>
                            <select id="processing-mode">
                                <option value="gentle">温柔模式 (仅替换攻击性词汇)</option>
                                <option value="contextual" selected>智能模式 (分析情感，智能选择词汇)</option>
                                <option value="aggressive">活力模式 (最大化可爱词汇和句尾)</option>
                            </select>
                            <small>选择猫娘化的整体风格。“智能模式”是兼顾自然与可爱的最佳选项。</small>
                        </div>

                        <div class="setting-group">
                            <label>📊 替换强度: <span id="intensity-value">30%</span></label>
                            <input type="range" id="replacement-intensity" min="0.1" max="1.0" step="0.1" value="0.3">
                            <small>控制词汇替换的概率，数值越高替换越频繁</small>
                        </div>

                        <div class="setting-group">
                            <label>🎵 结尾词频率: <span id="ending-value">30%</span></label>
                            <input type="range" id="ending-frequency" min="0.1" max="1.0" step="0.1" value="0.3">
                            <small>控制"喵～"等可爱结尾词的出现频率</small>
                        </div>

                        <div class="setting-group">
                            <label>✨ 装饰符频率: <span id="decorative-value">20%</span></label>
                            <input type="range" id="decorative-frequency" min="0.1" max="1.0" step="0.1" value="0.2">
                            <small>控制"✨"等装饰性符号的出现频率</small>
                        </div>
                    </div>

                    <div class="tab-content" id="advanced-tab" style="display: none;">
                        <div class="setting-group">
                            <label>
                                <input type="checkbox" id="intelligent-replacement"> 🧠 启用句尾情感关联
                            </label>
                            <small>开启后，替换词会根据上下文智能附带上符合当前情绪的句尾（如“好棒喵～”），让表达更生动。</small>
                        </div>

                        <div class="setting-group">
                            <label>
                                <input type="checkbox" id="debug-mode"> 🛠 调试模式
                            </label>
                            <small>显示详细的处理日志信息</small>
                        </div>

                        <div class="setting-group">
                            <label>
                                <input type="checkbox" id="performance-monitoring"> 📊 性能监控
                            </label>
                            <small>启用内存和性能监控</small>
                        </div>

                        <div class="setting-group">
                            <label>🕐 处理间隔 (毫秒): <span id="interval-value">5000</span></label>
                            <input type="range" id="process-interval" min="1000" max="10000" step="500" value="5000">
                            <small>控制自动处理的时间间隔，数值越小响应越快但消耗更多资源</small>
                        </div>

                        <div class="setting-group">
                            <label>📦 批处理大小: <span id="batch-value">5</span></label>
                            <input type="range" id="batch-size" min="3" max="20" step="1" value="5">
                            <small>单次处理的元素数量，数值越大处理越快但可能卡顿</small>
                        </div>

                        <div class="setting-group">
                            <label>⏱️ 防抖延迟 (毫秒): <span id="debounce-value">500</span></label>
                            <input type="range" id="debounce-delay" min="100" max="2000" step="100" value="500">
                            <small>防止重复处理的延迟时间，数值越大越省资源</small>
                        </div>
                    </div>

                    <div class="tab-content" id="control-tab" style="display: none;">
                        <div class="setting-group">
                            <label>
                                <input type="checkbox" id="affect-input"> 📝 影响输入框
                            </label>
                            <small>是否处理输入框和文本域中的内容</small>
                        </div>

                        <div class="setting-group">
                            <label>
                                <input type="checkbox" id="show-original-hover"> 👆 鼠标悬停显示原文
                            </label>
                            <small>鼠标悬停在处理过的文本上时显示原始内容</small>
                        </div>

                        <div class="setting-group">
                            <label>
                                <input type="checkbox" id="enable-user-prefix"> 👤 启用用户名前缀
                            </label>
                            <small>为用户名添加可爱的表情符号前缀</small>
                        </div>

                        <div class="setting-group">
                            <label>
                                <input type="checkbox" id="bilibili-merge-links"> 🔗 B站链接转文本
                            </label>
                            <small>将B站评论中的链接转换为纯文本</small>
                        </div>

                        <div class="setting-group">
                            <label>
                                <input type="checkbox" id="auto-process-content"> 🔄 自动处理新内容
                            </label>
                            <small>自动处理动态加载的新内容（通过DOM变化监听）</small>
                        </div>

                        <div class="setting-group">
                            <label>
                                <input type="checkbox" id="shadow-dom-support"> 🌐 Shadow DOM 支持
                            </label>
                            <small>处理 Shadow DOM 中的内容（如B站评论区）</small>
                        </div>

                        <div class="setting-group">
                            <label>
                                <input type="checkbox" id="smart-processing"> 💡 启用高级情感分析引擎
                            </label>
                            <small>脚本的核心智能开关。开启后才能启用所有与上下文、情感相关的分析功能。为获得最佳体验，请保持开启。</small>
                        </div>

                        <div class="setting-group">
                            <label>🚫 排除词汇</label>
                            <textarea id="disabled-words" placeholder="输入不想被替换的词汇，每行一个" rows="3"></textarea>
                            <small>这些词汇不会被猫娘化处理</small>
                        </div>
                    </div>

                    <div class="tab-content" id="stats-tab" style="display: none;">
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-number" id="processed-count">0</div>
                                <div class="stat-label">已处理元素</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number" id="replaced-count">0</div>
                                <div class="stat-label">已替换词汇</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number" id="session-count">0</div>
                                <div class="stat-label">本次会话</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number" id="blacklist-hits-count">0</div>
                                <div class="stat-label">黑名单命中</div>
                            </div>
                        </div>

                        <div class="info-section">
                            <h4>📅 系统信息</h4>
                            <p><strong>版本:</strong> ${SCRIPT_VERSION}</p>
                            <p><strong>安装时间:</strong> <span id="install-date">获取中...</span></p>
                            <p><strong>最后活动:</strong> <span id="last-active">获取中...</span></p>
                            <p><strong>当前网站:</strong> ${location.hostname}</p>
                            <p><strong>运行状态:</strong> <span id="running-status">检测中...</span></p>
                        </div>

                        <div class="performance-section">
                            <h4>⚡ 动态信息</h4>
                            <div id="performance-info">
                                <p>当前页面处理元素数: <span id="session-elements">计算中...</span></p>
                                <p>黑名单规则命中数: <span id="blacklist-hits-info">计算中...</span></p>
                            </div>
                        </div>
                    </div>

                    <div class="actions">
                        <button id="save-settings" class="btn-primary">💾 保存设置</button>
                        <button id="reset-settings" class="btn-warning">🔄 重置设置</button>
                        <button id="clear-cache" class="btn-secondary">🧹 清理缓存</button>
                    </div>
                </div>
            `;
        }

        getCSS() {
            return `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: 600px; max-height: 85vh; background: #ffffff; border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3); z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
                display: none; overflow: hidden;
            `;
        }

        bindEvents() {
            // 关闭按钮
            const closeBtn = this.panel.querySelector('[data-action="close"]');
            if (closeBtn) {
                closeBtn.onclick = () => this.hide();
            }

            // 标签切换
            const tabBtns = this.panel.querySelectorAll('.tab-btn');
            tabBtns.forEach(btn => {
                btn.onclick = () => this.switchTab(btn.dataset.tab);
            });

            // 滑块事件
            this.bindSliderEvents();

            // 保存设置
            const saveBtn = document.getElementById('save-settings');
            if (saveBtn) {
                saveBtn.onclick = () => {
                    this.saveSettings();
                    this.hide();
                    showToast('设置已保存喵～ ✨', 'success');
                };
            }

            // 重置设置
            const resetBtn = document.getElementById('reset-settings');
            if (resetBtn) {
                resetBtn.onclick = () => {
                    if (confirm('确定要重置所有设置吗？这将清除所有自定义配置。')) {
                        this.resetSettings();
                        showToast('设置已重置喵～ 🔄', 'info');
                    }
                };
            }

            // 清理缓存
            const clearBtn = document.getElementById('clear-cache');
            if (clearBtn) {
                clearBtn.onclick = () => {
                    this.clearCache();
                    showToast('缓存已清理喵～ 🧹', 'info');
                };
            }
        }

        bindSliderEvents() {
            const sliders = [
                { id: 'replacement-intensity', valueId: 'intensity-value', isPercent: true },
                { id: 'ending-frequency', valueId: 'ending-value', isPercent: true },
                { id: 'decorative-frequency', valueId: 'decorative-value', isPercent: true },
                { id: 'process-interval', valueId: 'interval-value', isPercent: false },
                { id: 'batch-size', valueId: 'batch-value', isPercent: false },
                { id: 'debounce-delay', valueId: 'debounce-value', isPercent: false }
            ];

            sliders.forEach(({ id, valueId, isPercent }) => {
                const slider = document.getElementById(id);
                const valueSpan = document.getElementById(valueId);

                if (slider && valueSpan) {
                    slider.oninput = (e) => {
                        const value = parseFloat(e.target.value);
                        valueSpan.textContent = isPercent ? `${Math.round(value * 100)}%` : value;
                    };
                }
            });
        }

        switchTab(tabName) {
            // 切换按钮状态
            this.panel.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.panel.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

            // 切换内容
            this.panel.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });
            const targetTab = document.getElementById(`${tabName}-tab`);
            if (targetTab) {
                targetTab.style.display = 'block';
            }
        }

        show() {
            if (!this.panel) this.create();

            this.loadCurrentSettings();
            this.panel.style.display = 'block';
            this.isVisible = true;
            this.updateStats();
        }

        hide() {
            if (this.panel) {
                this.panel.style.display = 'none';
                this.isVisible = false;
            }
        }

        loadCurrentSettings() {
            // 基础设置
            const elements = {
                'cute-level': CONFIG.preferences.cuteLevel,
                'processing-mode': CONFIG.preferences.processingMode,
                'replacement-intensity': CONFIG.preferences.replacementIntensity,
                'ending-frequency': CONFIG.preferences.endingFrequency,
                'decorative-frequency': CONFIG.preferences.decorativeFrequency
            };
            Object.entries(elements).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) {
                    element.value = value;
                }
            });

            // 复选框设置
            const checkboxes = {
                'affect-input': CONFIG.features.affectInput,
                'enable-user-prefix': CONFIG.features.bilibiliRandomizeUserNames,
                'bilibili-merge-links': CONFIG.features.bilibiliMergeALinks,
                'show-original-hover': CONFIG.features.showOriginalOnHover,
                'auto-process-content': CONFIG.features.autoProcessNewContent,
                'shadow-dom-support': CONFIG.features.shadowDomSupport,
                'smart-processing': CONFIG.features.smartProcessing,
                'intelligent-replacement': CONFIG.preferences.intelligentReplacement,
                'debug-mode': CONFIG.features.debugMode,
                'performance-monitoring': CONFIG.features.performanceMonitoring
            };
            Object.entries(checkboxes).forEach(([id, checked]) => {
                const element = document.getElementById(id);
                if (element) element.checked = checked;
            });

            // 高级设置 (滑块)
            const advancedElements = {
                'replacement-intensity': CONFIG.preferences.replacementIntensity,
                'ending-frequency': CONFIG.preferences.endingFrequency,
                'decorative-frequency': CONFIG.preferences.decorativeFrequency,
                'process-interval': CONFIG.performance.processInterval,
                'batch-size': CONFIG.performance.batchSize,
                'debounce-delay': CONFIG.performance.debounceDelay
            };

            const sliderToValueIdMap = {
                'replacement-intensity': 'intensity-value',
                'ending-frequency': 'ending-value',
                'decorative-frequency': 'decorative-value',
                'process-interval': 'interval-value',
                'batch-size': 'batch-value',
                'debounce-delay': 'debounce-value'
            };

            Object.entries(advancedElements).forEach(([id, value]) => {
                const slider = document.getElementById(id);
                if (slider) {
                    slider.value = value; // 设置滑块位置
                    const valueId = sliderToValueIdMap[id];
                    const valueSpan = document.getElementById(valueId);
                    if (valueSpan) {
                        const isPercent = ['replacement-intensity', 'ending-frequency', 'decorative-frequency'].includes(id);
                        valueSpan.textContent = isPercent ? `${Math.round(parseFloat(value) * 100)}%` : value;
                    }
                }
            });

            // 排除词汇
            const disabledWordsEl = document.getElementById('disabled-words');
            if (disabledWordsEl) {
                disabledWordsEl.value = CONFIG.preferences.disabledWords.join('\n');
            }
        }

        saveSettings() {
            // 基础设置
            CONFIG.preferences.cuteLevel = document.getElementById('cute-level')?.value || CONFIG.preferences.cuteLevel;
            CONFIG.preferences.processingMode = document.getElementById('processing-mode')?.value || CONFIG.preferences.processingMode;
            CONFIG.preferences.replacementIntensity = parseFloat(document.getElementById('replacement-intensity')?.value || CONFIG.preferences.replacementIntensity);
            CONFIG.preferences.endingFrequency = parseFloat(document.getElementById('ending-frequency')?.value || CONFIG.preferences.endingFrequency);
            CONFIG.preferences.decorativeFrequency = parseFloat(document.getElementById('decorative-frequency')?.value || CONFIG.preferences.decorativeFrequency);

            // 复选框设置
            CONFIG.features.affectInput = document.getElementById('affect-input')?.checked || false;
            CONFIG.features.bilibiliRandomizeUserNames = document.getElementById('enable-user-prefix')?.checked || false;
            CONFIG.features.bilibiliMergeALinks = document.getElementById('bilibili-merge-links')?.checked || false;
            CONFIG.features.showOriginalOnHover = document.getElementById('show-original-hover')?.checked || false;
            CONFIG.features.autoProcessNewContent = document.getElementById('auto-process-content')?.checked || false;
            CONFIG.features.shadowDomSupport = document.getElementById('shadow-dom-support')?.checked || false;
            CONFIG.features.smartProcessing = document.getElementById('smart-processing')?.checked || false;
            CONFIG.preferences.intelligentReplacement = document.getElementById('intelligent-replacement')?.checked || false;
            CONFIG.features.debugMode = document.getElementById('debug-mode')?.checked || false;
            CONFIG.features.performanceMonitoring = document.getElementById('performance-monitoring')?.checked || false;

            // 高级设置
            CONFIG.performance.processInterval = parseInt(document.getElementById('process-interval')?.value || CONFIG.performance.processInterval);
            CONFIG.performance.batchSize = parseInt(document.getElementById('batch-size')?.value || CONFIG.performance.batchSize);
            CONFIG.performance.debounceDelay = parseInt(document.getElementById('debounce-delay')?.value || CONFIG.performance.debounceDelay);

            // 排除词汇
            const disabledWordsEl = document.getElementById('disabled-words');
            if (disabledWordsEl) {
                CONFIG.preferences.disabledWords = disabledWordsEl.value
                    .split('\n')
                    .map(word => word.trim())
                    .filter(word => word.length > 0);
            }

            GM_setValue("catgirlConfig", CONFIG);
        }

        resetSettings() {
            CONFIG = Object.assign({}, defaultConfig);
            CONFIG.stats = Object.assign({}, defaultConfig.stats, {
                installDate: GM_getValue("catgirlConfig")?.stats?.installDate || new Date().toISOString()
            });
            GM_setValue("catgirlConfig", CONFIG);
            this.loadCurrentSettings();
        }

        clearCache() {
            if (window.catgirlApp && window.catgirlApp.clearCache) {
                window.catgirlApp.clearCache();
            }
        }

        updateStats() {
            const stats = {
                'processed-count': CONFIG.stats.processedElements,
                'replaced-count': CONFIG.stats.replacedWords,
                'session-count': CONFIG.stats.sessionProcessed,
                'blacklist-hits-count': CONFIG.stats.blacklistHits,
                // 新增的动态信息
                'session-elements': CONFIG.stats.sessionProcessed, // 复用会话处理数
                'blacklist-hits-info': CONFIG.stats.blacklistHits
            };
            // ... 后续代码不变

            Object.entries(stats).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) element.textContent = value;
            });

            // 更新运行状态
            const statusEl = document.getElementById('running-status');
            if (statusEl && window.catgirlApp) {
                const isRunning = window.catgirlApp.app.isRunning;
                statusEl.textContent = isRunning ? '运行中 ✅' : '已暂停 ⏸️';
                statusEl.style.color = isRunning ? '#28a745' : '#ffc107';
            }

            // 更新时间信息
            const installEl = document.getElementById('install-date');
            if (installEl) {
                installEl.textContent = new Date(CONFIG.stats.installDate).toLocaleString();
            }

            const activeEl = document.getElementById('last-active');
            if (activeEl) {
                activeEl.textContent = new Date(CONFIG.stats.lastActive).toLocaleString();
            }
        }
    }

    // ===== 主应用类 =====
    class CatgirlApp {
        constructor() {
            this.stateManager = new StateManager();
            this.textProcessor = new EnhancedTextProcessor();
            this.settingsPanel = new SettingsPanel();
            this.blacklistManager = new BlacklistManager();
            this.processedElements = new WeakSet();
            this.isRunning = false;
            this.intervalId = null;
            this.observer = null;
            this.lastProcessHash = '';
            this.processLock = false;
            this.bilibiliCommentObserver = null;
            this.isBlacklisted = false; // 添加黑名单状态标记
        }

        async initialize() {
            // 检查黑名单
            this.isBlacklisted = this.blacklistManager.isBlacklisted();

            if (this.isBlacklisted) {
                if (CONFIG.features.debugMode) {
                    console.log('🐱 当前网站已被加入黑名单，不启动喵～');
                }
                // 即使在黑名单中也注册菜单命令，但功能受限
                this.registerLimitedMenuCommands();
                return;
            }

            if (this.shouldExclude()) {
                if (CONFIG.features.debugMode) {
                    console.log('🐱 域名已排除，不启动喵～');
                }
                return;
            }

            console.log('🐱 增强版猫娘化系统启动喵～');

            this.registerMenuCommands();
            await this.waitForDOMReady();

            this.stateManager.onUrlChange((newUrl) => {
                setTimeout(() => {
                    if (location.href === newUrl) {
                        this.processPage();
                    }
                }, CONFIG.performance.debounceDelay);
            });

            this.start();
        }

        shouldExclude() {
            return CONFIG.sites.excludeDomains.some(domain =>
                                                    location.hostname.includes(domain)
                                                   );
        }

        registerMenuCommands() {
            GM_registerMenuCommand("🐱 设置面板", () => this.settingsPanel.show());
            GM_registerMenuCommand("🚫 网站黑名单", () => this.blacklistManager.show());
            //GM_registerMenuCommand("⛔ 屏蔽当前网站", () => this.showBlockSiteDialog());
            GM_registerMenuCommand("🔄 重新处理", () => this.handleReprocess());
            //GM_registerMenuCommand("📊 显示统计", () => this.showStats());
            GM_registerMenuCommand("🧹 清理缓存", () => this.clearCache());
        }

        // 为黑名单网站注册受限菜单
        registerLimitedMenuCommands() {
            GM_registerMenuCommand("🐱 设置面板", () => this.settingsPanel.show());
            GM_registerMenuCommand("🚫 网站黑名单", () => this.blacklistManager.show());
            GM_registerMenuCommand("🔄 重新处理", () => {
                showToast('该网站被列为黑名单内容，如需修改请到面板里调整', 'warning', 4000);
            });
            GM_registerMenuCommand("📊 显示统计", () => this.showStats());
        }

        handleReprocess() {
            if (this.isBlacklisted) {
                showToast('该网站被列为黑名单内容，如需修改请到面板里调整', 'warning', 4000);
                return;
            }
            this.restart();
        }

        showBlockSiteDialog() {
            this.showBlockSiteUI();
        }

        showBlockSiteUI() {
            if (document.getElementById('catgirl-block-ui')) return;

            const blockUI = document.createElement('div');
            blockUI.id = 'catgirl-block-ui';
            blockUI.innerHTML = this.getBlockSiteHTML();
            blockUI.style.cssText = this.getBlockSiteCSS();

            document.body.appendChild(blockUI);
            this.bindBlockSiteEvents(blockUI);
            this.drawCatPaw(blockUI);
        }

        getBlockSiteHTML() {
            const domain = location.hostname;
            return `
                <div class="block-site-header">
                    <h3>🚫 屏蔽网站 ${domain}</h3>
                    <button class="close-btn" data-action="close-block">×</button>
                </div>

                <div class="block-site-content">
                    <div class="site-info">
                        <div class="site-icon">🌐</div>
                        <div class="site-details">
                            <div class="site-domain">${domain}</div>
                            <div class="site-path">${location.pathname}</div>
                        </div>
                    </div>

                    <div class="block-options">
                        <div class="option-group">
                            <label class="cute-label">
                                <input type="radio" name="block-type" value="site" checked>
                                <span class="radio-custom"></span>
                                <span class="option-text">🏠 整个网站</span>
                            </label>
                            <small>屏蔽整个 ${domain} 域名</small>
                        </div>

                        <div class="option-group">
                            <label class="cute-label">
                                <input type="radio" name="block-type" value="page">
                                <span class="radio-custom"></span>
                                <span class="option-text">📄 仅当前页面</span>
                            </label>
                            <small>只屏蔽当前访问的页面</small>
                        </div>
                    </div>

                    <div class="duration-selector">
                        <label class="cute-label-block">⏰ 屏蔽时长</label>
                        <select id="block-duration" class="cute-select">
                            <option value="3600000">1小时</option>
                            <option value="21600000">6小时</option>
                            <option value="86400000" selected>1天</option>
                            <option value="604800000">1周</option>
                            <option value="2592000000">1个月</option>
                            <option value="-1">永久</option>
                        </select>
                    </div>

                    <div class="reason-input">
                        <label class="cute-label-block">💭 屏蔽原因</label>
                        <input type="text" id="block-reason" class="cute-input" placeholder="记录屏蔽原因，方便管理喵～">
                    </div>

                    <div class="block-actions">
                        <button id="confirm-block" class="btn-block-confirm">🚫 确认屏蔽</button>
                        <button id="cancel-block" class="btn-block-cancel">❌ 取消</button>
                    </div>
                </div>

                <canvas id="cat-paw-canvas" width="60" height="60"></canvas>
            `;
        }

        getBlockSiteCSS() {
            return `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: 420px; background: linear-gradient(135deg, #fff5f8 0%, #ffeef5 100%);
                border-radius: 20px; box-shadow: 0 15px 35px rgba(255, 182, 193, 0.3);
                z-index: 10000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
                overflow: hidden; border: 2px solid #ffb6c1;
            `;
        }

        bindBlockSiteEvents(blockUI) {
            blockUI.querySelector('[data-action="close-block"]').onclick = () => {
                document.body.removeChild(blockUI);
            };

            blockUI.querySelector('#cancel-block').onclick = () => {
                document.body.removeChild(blockUI);
            };

            blockUI.querySelector('#confirm-block').onclick = () => {
                const type = blockUI.querySelector('input[name="block-type"]:checked').value;
                const duration = parseInt(blockUI.querySelector('#block-duration').value);
                const reason = blockUI.querySelector('#block-reason').value.trim() || '用户手动屏蔽';

                this.blacklistManager.addToBlacklist(type, duration, reason);
                document.body.removeChild(blockUI);

                if (type === 'site') {
                    this.stop();
                    this.isBlacklisted = true;
                    showToast('网站已屏蔽，脚本已停止运行喵～', 'info', 5000);
                }
            };
        }

        showStats() {
            if (document.getElementById('catgirl-stats-ui')) return;

            const statsUI = document.createElement('div');
            statsUI.id = 'catgirl-stats-ui';
            statsUI.innerHTML = this.getStatsHTML();
            statsUI.style.cssText = this.getStatsCSS();

            document.body.appendChild(statsUI);
            this.bindStatsEvents(statsUI);
            this.drawCatPaw(statsUI);
        }

        getStatsHTML() {
            const processedElements = (CONFIG.stats.processedElements || 0);
            const replacedWords = (CONFIG.stats.replacedWords || 0);
            const sessionProcessed = (CONFIG.stats.sessionProcessed || 0);
            const blacklistHits = (CONFIG.stats.blacklistHits || 0);
            const installDate = CONFIG.stats.installDate || new Date().toISOString();
            const lastActive = CONFIG.stats.lastActive || new Date().toISOString();

            return `
                <div class="stats-header">
                    <h3>📊 猫娘化统计面板</h3>
                    <button class="close-btn" data-action="close-stats">×</button>
                </div>

                <div class="stats-content">
                    <div class="stats-cards">
                        <div class="stat-card">
                            <div class="stat-icon">🔄</div>
                            <div class="stat-info">
                                <div class="stat-number">${processedElements.toLocaleString()}</div>
                                <div class="stat-label">已处理元素</div>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon">✨</div>
                            <div class="stat-info">
                                <div class="stat-number">${replacedWords.toLocaleString()}</div>
                                <div class="stat-label">已替换词汇</div>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon">🎯</div>
                            <div class="stat-info">
                                <div class="stat-number">${sessionProcessed.toLocaleString()}</div>
                                <div class="stat-label">本次会话</div>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon">🚫</div>
                            <div class="stat-info">
                                <div class="stat-number">${blacklistHits.toLocaleString()}</div>
                                <div class="stat-label">黑名单命中</div>
                            </div>
                        </div>
                    </div>

                    <div class="system-info">
                        <div class="info-row">
                            <span class="info-label">🐱 当前版本:</span>
                            <span class="info-value">${SCRIPT_VERSION}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">📅 安装时间:</span>
                            <span class="info-value">${new Date(installDate).toLocaleString()}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">⏰ 最后活动:</span>
                            <span class="info-value">${new Date(lastActive).toLocaleString()}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">🌐 当前网站:</span>
                            <span class="info-value">${location.hostname}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">⚡ 运行状态:</span>
                            <span class="info-value status-${this.isBlacklisted ? 'blocked' : (this.isRunning ? 'running' : 'paused')}">
                                ${this.isBlacklisted ? '已屏蔽 🚫' : (this.isRunning ? '运行中 ✅' : '已暂停 ⏸️')}
                            </span>
                        </div>
                    </div>

                    <div class="stats-actions">
                        <button id="refresh-stats" class="btn-stats-refresh">🔄 刷新统计</button>
                        <button id="export-stats" class="btn-stats-export">📊 导出数据</button>
                    </div>
                </div>

                <canvas id="cat-paw-canvas-stats" width="60" height="60"></canvas>
            `;
        }

        getStatsCSS() {
            return `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: 500px; background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
                border-radius: 20px; box-shadow: 0 15px 35px rgba(135, 206, 250, 0.3);
                z-index: 10000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
                overflow: hidden; border: 2px solid #87ceeb;
            `;
        }

        bindStatsEvents(statsUI) {
            statsUI.querySelector('[data-action="close-stats"]').onclick = () => {
                document.body.removeChild(statsUI);
            };

            statsUI.querySelector('#refresh-stats').onclick = () => {
                document.body.removeChild(statsUI);
                setTimeout(() => this.showStats(), 100);
            };

            statsUI.querySelector('#export-stats').onclick = () => {
                const data = {
                    version: SCRIPT_VERSION,
                    stats: CONFIG.stats,
                    exportTime: new Date().toISOString(),
                    website: location.hostname
                };

                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `catgirl-stats-${location.hostname}-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);

                showToast('统计数据已导出喵～ 📊', 'success');
            };
        }

        drawCatPaw() {
            const canvas = document.getElementById('cat-paw-canvas-blacklist');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            const size = 60;

            // 清空画布
            ctx.clearRect(0, 0, size, size);

            // 设置样式
            ctx.fillStyle = '#ffb6c1'; // 樱花粉色
            ctx.strokeStyle = '#ff69b4';
            ctx.lineWidth = 2;

            // 绘制猫爪垫（主要部分）
            ctx.beginPath();
            ctx.arc(30, 35, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // 绘制四个小爪垫
            const pads = [
                { x: 20, y: 20, size: 6 },
                { x: 40, y: 20, size: 6 },
                { x: 15, y: 30, size: 5 },
                { x: 45, y: 30, size: 5 }
            ];

            pads.forEach(pad => {
                ctx.beginPath();
                ctx.arc(pad.x, pad.y, pad.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            });

            // 添加高光效果
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(25, 30, 4, 0, Math.PI * 2);
            ctx.fill();

            // 设置canvas位置
            canvas.style.cssText = `
                position: absolute;
                bottom: 15px;
                right: 15px;
                opacity: 0.6;
                pointer-events: none;
            `;
        }

        async start() {
            if (this.isRunning || this.isBlacklisted) return;
            this.isRunning = true;

            setTimeout(() => {
                if (this.isRunning && !this.isBlacklisted) {
                    this.processPage();
                }
            }, 1000);

            if (CONFIG.performance.processInterval > 0) {
                const debouncedProcess = DebounceUtils.throttleWithDebounce(
                    () => this.conditionalProcess(),
                    CONFIG.performance.processInterval,
                    CONFIG.performance.debounceDelay
                );

                this.intervalId = setInterval(debouncedProcess, CONFIG.performance.processInterval);
            }

            this.setupMutationObserver();

            if (this.stateManager.isBilibili()) {
                this.setupBilibiliCommentObserver();
            }

            if (CONFIG.features.debugMode) {
                console.log('🎀 猫娘化系统已启动完成喵～');
            }
        }

        conditionalProcess() {
            if (!this.isRunning || this.processLock || this.isBlacklisted) return;

            const urlChanged = this.stateManager.checkUrlChange();
            const commentChanged = this.stateManager.checkBilibiliCommentChange();
            const shouldProcess = this.stateManager.shouldProcess();

            if (urlChanged || commentChanged || (!this.stateManager.shouldSkipBilibiliProcessing() && shouldProcess)) {
                this.processPage();
            }
        }

        processPage() {
            if (!this.isRunning || !CONFIG.features.autoProcessNewContent || this.processLock || this.isBlacklisted) {
                return;
            }

            this.processLock = true;

            try {
                const elements = this.getProcessableElements();

                const contentHash = this.generateContentHash(elements);
                if (contentHash === this.lastProcessHash) {
                    return;
                }
                this.lastProcessHash = contentHash;

                if (elements.length === 0) {
                    return;
                }

                EnhancedPerformanceUtils.createTimeSliceProcessor(
                    elements,
                    (element) => this.processElement(element),
                    {
                        onProgress: CONFIG.features.debugMode ?
                        (current, total, percent) => {
                            if (current % 50 === 0) {
                                console.log(`🐱 处理进度: ${percent.toFixed(1)}% (${current}/${total})`);
                            }
                        } : null,
                        onComplete: () => {
                            CONFIG.stats.lastActive = new Date().toISOString();
                            GM_setValue("catgirlConfig", CONFIG);

                            if (this.stateManager.isBilibili()) {
                                this.processBilibiliSpecial();
                            }
                        }
                    }
                );
            } finally {
                setTimeout(() => {
                    this.processLock = false;
                }, 1000);
            }
        }

        getProcessableElements() {
            const baseSelector = 'title, h1, h2, h3, h4, h5, h6, p, article, section, blockquote, li, a, span, div:not([class*="settings"]):not([id*="catgirl"])';
            const inputSelector = CONFIG.features.affectInput ? ', input, textarea' : '';

            const elements = document.querySelectorAll(baseSelector + inputSelector);

            return Array.from(elements).filter(element => {
                return !this.processedElements.has(element) &&
                    !element.closest('#catgirl-settings, #catgirl-debug, #catgirl-blacklist') &&
                    this.shouldProcessElement(element);
            });
        }

        shouldProcessElement(element) {
            if (!element.textContent?.trim()) return false;
            if (this.textProcessor.isProcessed(element.textContent)) return false;
            if (element.tagName && /^(SCRIPT|STYLE|NOSCRIPT)$/.test(element.tagName)) return false;
            if (element.offsetParent === null && element.style.display !== 'none') return false;
            return true;
        }

        generateContentHash(elements) {
            const textContent = elements.slice(0, 10).map(el => el.textContent?.slice(0, 50)).join('|');
            return textContent.length + ':' + elements.length;
        }

        processElement(element) {
            if (!element || this.processedElements.has(element)) return;

            try {
                // 保存原始文本
                const originalText = element.textContent;
                if (originalText && !this.textProcessor.getOriginalText(element)) {
                    this.textProcessor.storeOriginalText(element, originalText);
                }

                if (element.matches && element.matches('input, textarea') && CONFIG.features.affectInput) {
                    if (element.value?.trim()) {
                        const processedValue = this.textProcessor.processText(element.value);
                        element.value = processedValue;
                    }
                } else {
                    this.processElementText(element);
                }

                // 如果开启了鼠标悬停显示原文功能，且是评论元素
                if (CONFIG.features.showOriginalOnHover && originalText && originalText !== element.textContent && this.isCommentElement(element)) {
                    this.setupHoverOriginalText(element, originalText);
                }

                this.processedElements.add(element);
                CONFIG.stats.processedElements++;

            } catch (error) {
                if (CONFIG.features.debugMode) {
                    console.error('🐱 处理元素出错:', error);
                }
            }
        }

        // 设置鼠标悬停显示原文功能 - 安全修复版本
        setupHoverOriginalText(element, originalText) {
            // 安全检查：避免处理可能包含脚本或重要功能的元素
            if (this.isUnsafeElement(element)) {
                return;
            }

            const processedText = element.textContent;
            let isHovering = false;
            let timeoutId = null;

            // 创建tooltip而不是直接修改元素内容
            const showTooltip = () => {
                if (isHovering) return;
                isHovering = true;

                // 创建tooltip显示原文
                const tooltip = document.createElement('div');
                tooltip.className = 'catgirl-original-tooltip';
                tooltip.textContent = originalText;
                tooltip.style.cssText = `
                    position: absolute;
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    z-index: 10002;
                    max-width: 300px;
                    word-wrap: break-word;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                `;

                // 计算位置
                const rect = element.getBoundingClientRect();
                tooltip.style.left = `${rect.left + window.scrollX}px`;
                tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;

                document.body.appendChild(tooltip);

                // 淡入效果
                setTimeout(() => {
                    tooltip.style.opacity = '1';
                }, 10);

                // 保存tooltip引用
                element._catgirlTooltip = tooltip;

                // 添加视觉提示
                element.style.backgroundColor = 'rgba(255, 248, 220, 0.3)';
                element.style.transition = 'background-color 0.2s ease';
            };

            const hideTooltip = () => {
                if (!isHovering) return;
                isHovering = false;

                // 移除tooltip
                if (element._catgirlTooltip) {
                    element._catgirlTooltip.style.opacity = '0';
                    setTimeout(() => {
                        if (element._catgirlTooltip && element._catgirlTooltip.parentNode) {
                            document.body.removeChild(element._catgirlTooltip);
                        }
                        element._catgirlTooltip = null;
                    }, 200);
                }

                // 恢复元素样式
                element.style.backgroundColor = '';
            };

            // 移除可能存在的旧事件监听器
            if (element._catgirlMouseEnter) {
                element.removeEventListener('mouseenter', element._catgirlMouseEnter);
            }
            if (element._catgirlMouseLeave) {
                element.removeEventListener('mouseleave', element._catgirlMouseLeave);
            }

            // 保存事件处理器引用
            element._catgirlMouseEnter = showTooltip;
            element._catgirlMouseLeave = hideTooltip;

            // 添加新的事件监听器
            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
        }

        // 设置鼠标悬停显示原文功能 - 仅针对评论区的安全版本
        setupHoverOriginalText(element, originalText) {
            // 只对评论相关元素启用悬停功能
            if (!this.isCommentElement(element)) {
                return;
            }

            const processedText = element.textContent;
            let isHovering = false;

            const showTooltip = () => {
                if (isHovering) return;
                isHovering = true;

                // 创建tooltip显示原文
                const tooltip = document.createElement('div');
                tooltip.className = 'catgirl-original-tooltip';
                tooltip.textContent = originalText;
                tooltip.style.cssText = `
                    position: absolute;
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    z-index: 10002;
                    max-width: 300px;
                    word-wrap: break-word;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                `;

                // 计算位置
                const rect = element.getBoundingClientRect();
                tooltip.style.left = `${rect.left + window.scrollX}px`;
                tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;

                document.body.appendChild(tooltip);

                // 淡入效果
                setTimeout(() => {
                    tooltip.style.opacity = '1';
                }, 10);

                // 保存tooltip引用
                element._catgirlTooltip = tooltip;

                // 添加视觉提示
                element.style.backgroundColor = 'rgba(255, 248, 220, 0.3)';
                element.style.transition = 'background-color 0.2s ease';
            };

            const hideTooltip = () => {
                if (!isHovering) return;
                isHovering = false;

                // 移除tooltip
                if (element._catgirlTooltip) {
                    element._catgirlTooltip.style.opacity = '0';
                    setTimeout(() => {
                        if (element._catgirlTooltip && element._catgirlTooltip.parentNode) {
                            document.body.removeChild(element._catgirlTooltip);
                        }
                        element._catgirlTooltip = null;
                    }, 200);
                }

                // 恢复元素样式
                element.style.backgroundColor = '';
            };

            // 移除可能存在的旧事件监听器
            if (element._catgirlMouseEnter) {
                element.removeEventListener('mouseenter', element._catgirlMouseEnter);
            }
            if (element._catgirlMouseLeave) {
                element.removeEventListener('mouseleave', element._catgirlMouseLeave);
            }

            // 保存事件处理器引用
            element._catgirlMouseEnter = showTooltip;
            element._catgirlMouseLeave = hideTooltip;

            // 添加新的事件监听器
            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
        }

        // 检查是否是评论相关元素（使用与评论处理相同的选择器）
        isCommentElement(element) {
            if (!element) return false;

            // 使用与 processBilibiliComments 中相同的选择器逻辑
            const commentSelectors = [
                '.reply-item .reply-content',
                '.comment-item .comment-content',
                '.bili-comment-content',
                '.reply-content',
                '.comment-content',
                '[data-e2e="reply-item"] .reply-content',
                '.bili-comment .comment-text'
            ];

            // B站 Shadow DOM 中的评论选择器
            const shadowCommentSelectors = [
                '#contents span',
                '.comment-text',
                '.reply-content',
                '.comment-content'
            ];

            // 检查元素本身是否匹配评论选择器
            for (const selector of commentSelectors) {
                try {
                    if (element.matches && element.matches(selector)) return true;
                    if (element.closest && element.closest(selector)) return true;
                } catch (e) {
                    // 忽略选择器错误
                }
            }

            // 检查是否在 Shadow DOM 的评论区中
            for (const selector of shadowCommentSelectors) {
                try {
                    // 检查元素是否直接匹配 shadow DOM 评论选择器
                    if (element.matches && element.matches(selector)) return true;

                    // 检查父元素路径中是否有评论容器
                    let parent = element.parentElement;
                    let depth = 0;
                    while (parent && depth < 5) {
                        if (parent.matches && parent.matches('bili-comment-thread-renderer, bili-comment-replies-renderer, bili-comments')) {
                            return true;
                        }
                        parent = parent.parentElement;
                        depth++;
                    }
                } catch (e) {
                    // 忽略选择器错误
                }
            }

            return false;
        }

        processElementText(element) {
            if (element.children.length === 0) {
                const newText = this.textProcessor.processText(element.textContent);
                if (newText !== element.textContent) {
                    element.textContent = newText;
                }
            } else {
                const textNodes = this.getTextNodes(element);
                textNodes.forEach(node => {
                    if (node.textContent?.trim()) {
                        const newText = this.textProcessor.processText(node.textContent);
                        if (newText !== node.textContent) {
                            node.textContent = newText;
                        }
                    }
                });
            }
        }

        getTextNodes(element) {
            const textNodes = [];
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        if (node.parentElement &&
                            /^(SCRIPT|STYLE|NOSCRIPT)$/.test(node.parentElement.tagName)) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                    }
                }
            );

            let node;
            while (node = walker.nextNode()) {
                textNodes.push(node);
            }

            return textNodes;
        }

        processBilibiliSpecial() {
            if (this.stateManager.shouldSkipBilibiliProcessing()) return;

            if (CONFIG.features.debugMode) {
                console.log('🎯 执行B站特殊处理');
            }

            try {
                this.processBilibiliComments();
                this.processBilibiliShadowDOM();

                // B站链接转文本功能
                if (CONFIG.features.bilibiliMergeALinks) {
                    this.processBilibiliLinks();
                }
            } catch (error) {
                if (CONFIG.features.debugMode) {
                    console.error('🐱 B站处理出错:', error);
                }
            }

            this.stateManager.markBilibiliCompleted();
        }

        // B站链接转文本功能实现
        processBilibiliLinks() {
            const linkSelectors = [
                '.reply-content a:not([data-catgirl-link-processed])',
                '.comment-content a:not([data-catgirl-link-processed])',
                '.bili-comment-content a:not([data-catgirl-link-processed])',
                'bili-comment-thread-renderer a:not([data-catgirl-link-processed])',
                '.reply-item a:not([data-catgirl-link-processed])'
            ];

            linkSelectors.forEach(selector => {
                const links = document.querySelectorAll(selector);
                links.forEach(link => {
                    this.convertLinkToText(link);
                });
            });

            // 处理 Shadow DOM 中的链接
            if (CONFIG.features.shadowDomSupport) {
                this.processBilibiliLinksInShadowDOM();
            }
        }

        // B站链接转文本功能实现 - 重写版本
        processBilibiliLinks() {
            // 处理普通DOM中的评论
            const commentContainers = document.querySelectorAll(
                '.reply-content, .comment-content, .bili-comment-content, .reply-item, .comment-item'
            );

            commentContainers.forEach(container => {
                this.processLinksInContainer(container);
            });

            // 处理 Shadow DOM 中的链接
            if (CONFIG.features.shadowDomSupport) {
                this.processBilibiliLinksInShadowDOM();
            }
        }

        processLinksInContainer(container) {
            if (!container || container.hasAttribute('data-catgirl-link-container-processed')) return;

            container.setAttribute('data-catgirl-link-container-processed', 'true');

            // 查找所有 p 元素，这些通常包含评论的完整结构
            const paragraphs = container.querySelectorAll('p');

            paragraphs.forEach(p => {
                this.processBilibiliLinks()
            });

            if (CONFIG.features.debugMode) {
                console.log('🔗 已处理评论容器的链接:', container);
            }
        }

        // 使用更稳健的逻辑重写
        convertLinkToText(linkElement) {
            if (!linkElement || linkElement.hasAttribute('data-catgirl-link-processed')) return;

            // 创建一个新的span元素来替换a标签
            const newSpan = document.createElement('span');
            newSpan.className = 'catgirl-converted-link'; // 可选，用于样式
            newSpan.textContent = linkElement.textContent || ''; // 使用a标签的文本内容

            // 替换节点
            linkElement.parentNode.replaceChild(newSpan, linkElement);

            // 标记容器，以便后续的文本处理可以重新扫描
            const container = newSpan.closest('.reply-content, .comment-content, .bili-comment-content');
            if (container) {
                container.removeAttribute('data-catgirl-processed');
            }
        }

        processBilibiliLinks() {
            const linkSelectors = [
                '.reply-content a:not([data-catgirl-link-processed])',
                '.comment-content a:not([data-catgirl-link-processed])',
                'bili-comment-thread-renderer a:not([data-catgirl-link-processed])'
            ];

            const processLinks = (rootNode) => {
                linkSelectors.forEach(selector => {
                    rootNode.querySelectorAll(selector).forEach(link => {
                        this.convertLinkToText(link);
                    });
                });
            };

            processLinks(document.body);

            // 处理 Shadow DOM
            document.querySelectorAll('bili-comment-thread-renderer').forEach(host => {
                if (host.shadowRoot) {
                    processLinks(host.shadowRoot);
                }
            });
        }

        extractTextFromLink(linkElement) {
            let text = '';

            // 遍历a标签的所有子节点
            for (const child of linkElement.childNodes) {
                if (child.nodeType === Node.TEXT_NODE) {
                    text += child.textContent;
                } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'IMG') {
                    // 非图片元素的文本内容
                    text += child.textContent || '';
                }
            }

            return text;
        }

        mergeContentToSpan(targetSpan, contentArray) {
            if (!targetSpan || contentArray.length === 0) return;

            const originalText = targetSpan.textContent || '';
            const additionalText = contentArray.join('');
            const mergedText = originalText + additionalText;

            // 应用猫娘化处理
            const processedText = this.textProcessor.processText(mergedText);
            targetSpan.textContent = processedText;

            if (CONFIG.features.debugMode) {
                console.log('🔗 文本合并:', originalText, '+', additionalText, '->', processedText);
            }
        }

        processBilibiliLinksInShadowDOM() {
            const shadowHosts = document.querySelectorAll('bili-comment-thread-renderer, bili-comment-replies-renderer');
            shadowHosts.forEach(host => {
                if (host.shadowRoot) {
                    // 在Shadow DOM中查找 #contents 元素
                    const contentsElements = host.shadowRoot.querySelectorAll('#contents:not([data-catgirl-shadow-link-processed])');
                    contentsElements.forEach(contents => {
                        contents.setAttribute('data-catgirl-shadow-link-processed', 'true');

                        // 处理 contents 中的 p 元素
                        const paragraphs = contents.querySelectorAll('p');
                        paragraphs.forEach(p => {
                            this.processBilibiliLinks()
                        });
                    });
                }
            });
        }

        processBilibiliComments() {
            const commentSelectors = [
                '.reply-item .reply-content:not([data-catgirl-processed])',
                '.comment-item .comment-content:not([data-catgirl-processed])',
                '.bili-comment-content:not([data-catgirl-processed])',
                '.reply-content:not([data-catgirl-processed])',
                '.comment-content:not([data-catgirl-processed])',
                '[data-e2e="reply-item"] .reply-content:not([data-catgirl-processed])',
                '.bili-comment .comment-text:not([data-catgirl-processed])'
            ];

            commentSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (!this.processedElements.has(element)) {
                        element.setAttribute('data-catgirl-processed', 'true');
                        this.processElement(element);
                    }
                });
            });

            // 处理用户名 - 检查开关
            if (CONFIG.features.bilibiliRandomizeUserNames) {
                const usernameSelectors = [
                    '.user-name:not([data-catgirl-processed])',
                    '.reply-item .user-name:not([data-catgirl-processed])',
                    '.comment-item .user-name:not([data-catgirl-processed])',
                    '.bili-comment .user-name:not([data-catgirl-processed])',
                    '.reply-author:not([data-catgirl-processed])',
                    '.comment-author:not([data-catgirl-processed])'
                ];

                usernameSelectors.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(element => {
                        this.processBilibiliUsername(element);
                    });
                });
            }
        }

        processBilibiliUsername(element) {
            if (!element || this.processedElements.has(element)) return;

            const userName = element.textContent?.trim();
            if (!userName || !CONFIG.features.bilibiliRandomizeUserNames) return;

            if (this.hasUserPrefix(userName)) return;

            element.setAttribute('data-catgirl-processed', 'true');
            this.processedElements.add(element);

            const processingType = Math.random();

            if (processingType < 0.3) {
                const randomPrefix = this.getRandomUserPrefix();
                element.textContent = `${randomPrefix}${userName}${randomPrefix}`;
            } else if (processingType < 0.6) {
                const randomPrefix = this.getRandomUserPrefix();
                element.textContent = `${randomPrefix}${userName}`;
            } else if (processingType < 0.8) {
                const decorative = cuteLibrary.decorativePrefixes[Math.floor(Math.random() * cuteLibrary.decorativePrefixes.length)];
                element.textContent = `${decorative}${userName}`;
            }

            if (CONFIG.features.debugMode) {
                console.log('🎀 处理用户名:', userName, '->', element.textContent);
            }
        }

        processBilibiliShadowDOM() {
            if (!CONFIG.features.shadowDomSupport) return;

            const biliComments = document.querySelector('bili-comments');
            if (biliComments && biliComments.shadowRoot) {
                this.processElementsInShadowDOM(biliComments.shadowRoot);
            }

            const shadowHosts = document.querySelectorAll('bili-comment-thread-renderer, bili-comment-replies-renderer');
            shadowHosts.forEach(host => {
                if (host.shadowRoot) {
                    this.processElementsInShadowDOM(host.shadowRoot);
                }
            });
        }

        processElementsInShadowDOM(shadowRoot) {
            try {
                const contentSelectors = [
                    '#contents span:not([data-catgirl-processed])',
                    '.comment-text:not([data-catgirl-processed])',
                    '.reply-content:not([data-catgirl-processed])',
                    '.comment-content:not([data-catgirl-processed])'
                ];

                contentSelectors.forEach(selector => {
                    const elements = shadowRoot.querySelectorAll(selector);
                    elements.forEach(element => {
                        if (!this.processedElements.has(element)) {
                            element.setAttribute('data-catgirl-processed', 'true');

                            // 保存原始文本用于悬停显示
                            const originalText = element.textContent;
                            if (originalText && !this.textProcessor.getOriginalText(element)) {
                                this.textProcessor.storeOriginalText(element, originalText);
                            }

                            this.processElement(element);

                            // Shadow DOM 中的评论元素也需要悬停功能
                            if (CONFIG.features.showOriginalOnHover && originalText && originalText !== element.textContent) {
                                this.setupHoverOriginalText(element, originalText);
                            }
                        }
                    });
                });

                if (CONFIG.features.bilibiliRandomizeUserNames) {
                    const usernameSelectors = [
                        '#user-name a:not([data-catgirl-processed])',
                        '.user-name:not([data-catgirl-processed])',
                        '.author-name:not([data-catgirl-processed])'
                    ];

                    usernameSelectors.forEach(selector => {
                        const elements = shadowRoot.querySelectorAll(selector);
                        elements.forEach(element => {
                            this.processBilibiliUsername(element);
                        });
                    });
                }

                const nestedHosts = shadowRoot.querySelectorAll('*');
                nestedHosts.forEach(el => {
                    if (el.shadowRoot && !el.hasAttribute('data-catgirl-shadow-processed')) {
                        el.setAttribute('data-catgirl-shadow-processed', 'true');
                        this.processElementsInShadowDOM(el.shadowRoot);
                    }
                });

            } catch (error) {
                if (CONFIG.features.debugMode) {
                    console.error('🐱 处理Shadow DOM出错:', error);
                }
            }
        }

        hasUserPrefix(userName) {
            if (!userName) return true;

            const hasPrefix = cuteLibrary.userPrefixes.some(prefix => userName.includes(prefix));
            const hasDecorative = cuteLibrary.decorativePrefixes.some(prefix => userName.includes(prefix));
            const isProcessed = /已处理|🏳️‍⚧️.*🏳️‍⚧️|✨.*✨|💕.*💕/.test(userName);
            const isTooLong = userName.length > 20;

            return hasPrefix || hasDecorative || isProcessed || isTooLong;
        }

        getRandomUserPrefix() {
            const prefixes = cuteLibrary.userPrefixes;
            return prefixes[Math.floor(Math.random() * prefixes.length)];
        }

        setupBilibiliCommentObserver() {
            if (this.bilibiliCommentObserver) return;

            const targetNode = document.body;
            const config = {
                childList: true,
                subtree: true,
                attributes: false
            };

            this.bilibiliCommentObserver = new MutationObserver(
                DebounceUtils.throttleWithDebounce((mutations) => {
                    let hasCommentChanges = false;

                    for (const mutation of mutations) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.matches && (
                                    node.matches('bili-comment-thread-renderer, bili-comment, .reply-item, .comment-item') ||
                                    (node.querySelector && (
                                        node.querySelector('bili-comment-thread-renderer') ||
                                        node.querySelector('.reply-item') ||
                                        node.querySelector('.comment-item') ||
                                        node.querySelector('.bili-comment')
                                    ))
                                )) {
                                    hasCommentChanges = true;
                                    break;
                                }
                            }
                        }
                        if (hasCommentChanges) break;
                    }

                    if (hasCommentChanges) {
                        setTimeout(() => {
                            if (CONFIG.features.debugMode) {
                                console.log('🔄 检测到B站评论变化，开始处理');
                            }
                            this.processBilibiliSpecial();
                        }, 1200);
                    }
                }, 800, 400)
            );

            this.bilibiliCommentObserver.observe(targetNode, config);

            if (CONFIG.features.debugMode) {
                console.log('🎯 B站评论观察器已启动');
            }
        }

        setupMutationObserver() {
            if (this.observer || !CONFIG.features.autoProcessNewContent) return;

            const throttledCallback = DebounceUtils.throttleWithDebounce(
                (mutations) => this.handleMutations(mutations),
                CONFIG.performance.observerThrottle,
                CONFIG.performance.debounceDelay
            );

            this.observer = new MutationObserver(throttledCallback);
            this.observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });

            if (CONFIG.features.debugMode) {
                console.log('👁️ DOM变化监听器已启动');
            }
        }

        handleMutations(mutations) {
            console.log('✨ 检测到DOM变化，立即处理新内容！');
            if (this.processLock || this.isBlacklisted) return;

            try {
                const elementsToProcess = new Set();

                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && this.shouldProcessElement(node)) {
                            elementsToProcess.add(node);

                            const children = node.querySelectorAll && node.querySelectorAll('*');
                            if (children) {
                                Array.from(children).forEach(child => {
                                    if (this.shouldProcessElement(child)) {
                                        elementsToProcess.add(child);
                                    }
                                });
                            }
                        }
                    });
                });

                if (elementsToProcess.size > 0) {
                    const limitedElements = Array.from(elementsToProcess).slice(0, 20);

                    if (CONFIG.features.debugMode) {
                        console.log(`🔄 DOM变化触发处理: ${limitedElements.length} 个新元素`);
                    }

                    EnhancedPerformanceUtils.createTimeSliceProcessor(
                        limitedElements,
                        (element) => this.processElement(element),
                        {
                            onComplete: () => {
                                CONFIG.stats.lastActive = new Date().toISOString();
                            }
                        }
                    );
                }
            } catch (error) {
                if (CONFIG.features.debugMode) {
                    console.error('🐱 处理DOM变化出错:', error);
                }
            }
        }

        toggle() {
            if (this.isBlacklisted) {
                showToast('该网站被列为黑名单内容，如需修改请到面板里调整', 'warning', 4000);
                return;
            }

            if (this.isRunning) {
                this.stop();
                showToast('猫娘化已暂停喵～ ⏸️', 'warning');
            } else {
                this.start();
                showToast('猫娘化已恢复喵～ ▶️', 'success');
            }
        }

        stop() {
            this.isRunning = false;
            this.processLock = false;

            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            if (this.bilibiliCommentObserver) {
                this.bilibiliCommentObserver.disconnect();
                this.bilibiliCommentObserver = null;
            }
        }

        restart() {
            if (this.isBlacklisted) {
                showToast('该网站被列为黑名单内容，如需修改请到面板里调整', 'warning', 4000);
                return;
            }

            this.stop();
            this.processedElements = new WeakSet();
            this.textProcessor.processedTexts = new Set();
            this.lastProcessHash = '';

            setTimeout(() => {
                this.start();
                showToast('系统已重启喵～ 🔄', 'info');
            }, 500);
        }

        showStats() {
            if (document.getElementById('catgirl-stats-ui')) return;

            const statsUI = document.createElement('div');
            statsUI.id = 'catgirl-stats-ui';
            statsUI.innerHTML = this.getStatsHTML();
            statsUI.style.cssText = this.getStatsCSS();

            document.body.appendChild(statsUI);
            this.bindStatsEvents(statsUI);
            this.drawCatPaw(statsUI);
        }

        clearCache() {
            this.processedElements = new WeakSet();
            this.textProcessor.processedTexts = new Set();
            this.lastProcessHash = '';
            CONFIG.stats.sessionProcessed = 0;

            // 清理处理标记
            const processedElements = document.querySelectorAll('[data-catgirl-processed]');
            processedElements.forEach(el => {
                el.removeAttribute('data-catgirl-processed');
            });

            const processedLinks = document.querySelectorAll('[data-catgirl-link-processed]');
            processedLinks.forEach(el => {
                el.removeAttribute('data-catgirl-link-processed');
            });

            const processedShadows = document.querySelectorAll('[data-catgirl-shadow-processed]');
            processedShadows.forEach(el => {
                el.removeAttribute('data-catgirl-shadow-processed');
            });

            GM_setValue("catgirlConfig", CONFIG);
            showToast('缓存已清理，统计已重置喵～ 🧹', 'success');
        }

        waitForDOMReady() {
            return new Promise(resolve => {
                if (document.readyState !== 'loading') {
                    resolve();
                } else {
                    document.addEventListener('DOMContentLoaded', resolve, { once: true });
                }
            });
        }
    }

    // ===== 工具函数 =====
    function showToast(message, type = 'info', duration = 3000) {
        // 计算已存在的toast的总高度，为新toast腾出位置
        let offset = 20;
        document.querySelectorAll('.catgirl-toast.show').forEach(existingToast => {
            offset += existingToast.offsetHeight + 10;
        });

        const toast = document.createElement('div');
        toast.className = 'catgirl-toast';
        toast.style.top = `${offset}px`; // 设置初始偏移
        toast.innerHTML = `
            <div class="toast-icon">${getToastIcon(type)}</div>
            <div class="toast-message">${message}</div>
        `;
        toast.classList.add(`toast-${type}`);
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    function getToastIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    function showUpdateNotification() {
        showToast(`🎉 猫娘脚本已更新到 v${SCRIPT_VERSION} 喵～\n新增功能：${UPdate_What}`, 'success', 5000);
    }

    // ===== 启动应用 =====
    const catgirlApp = new CatgirlApp();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => catgirlApp.initialize(), { once: true });
    } else {
        setTimeout(() => catgirlApp.initialize(), 100);
    }

    // ===== 样式注入 =====
    GM_addStyle(`
        /* Toast 通知样式 - 增强版 */
        .catgirl-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10001;
            padding: 16px 20px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            max-width: 350px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            transform: translateX(120%);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .catgirl-toast.show {
            transform: translateX(0);
        }

        .catgirl-toast.toast-success {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
        }

        .catgirl-toast.toast-error {
            background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%);
            color: white;
        }

        .catgirl-toast.toast-warning {
            background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
            color: #212529;
        }

        .catgirl-toast.toast-info {
            background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%);
            color: white;
        }

        .catgirl-toast .toast-icon {
            font-size: 18px;
        }

        .catgirl-toast .toast-message {
            flex: 1;
            line-height: 1.4;
        }

        /* 设置面板样式 - 增强版 */
        #catgirl-settings {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
            line-height: 1.5;
        }

        #catgirl-settings .settings-header,
        #catgirl-blacklist .blacklist-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 12px 12px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        #catgirl-settings .settings-header h3,
        #catgirl-blacklist .blacklist-header h3 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
        }

        #catgirl-settings .close-btn,
        #catgirl-blacklist .close-btn {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #catgirl-settings .close-btn:hover,
        #catgirl-blacklist .close-btn:hover {
            background: rgba(255,255,255,0.3);
            transform: scale(1.1);
        }

        #catgirl-settings .settings-content,
        #catgirl-blacklist .blacklist-content {
            padding: 24px;
            background: #ffffff;
            height: 590px;
            overflow-y: auto;
            border-radius: 0 0 12px 12px;
        }

        #catgirl-settings .tab-container {
            display: flex;
            margin-bottom: 24px;
            background: #f8f9fa;
            border-radius: 8px;
            padding: 4px;
            flex-wrap: wrap;
        }

        #catgirl-settings .tab-btn {
            flex: 1;
            padding: 12px 16px;
            border: none;
            background: transparent;
            cursor: pointer;
            border-radius: 6px;
            transition: all 0.3s ease;
            font-weight: 500;
            color: #6c757d;
            min-width: 80px;
        }

        #catgirl-settings .tab-btn.active {
            background: white;
            color: #495057;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        #catgirl-settings .tab-btn:hover:not(.active) {
            color: #495057;
            background: rgba(255,255,255,0.7);
        }

        #catgirl-settings .setting-group {
            margin-bottom: 20px;
        }

        #catgirl-settings label,
        #catgirl-blacklist label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #333;
            font-size: 14px;
        }

        #catgirl-settings small,
        #catgirl-blacklist small {
            display: block;
            color: #6c757d;
            font-size: 12px;
            margin-top: 4px;
            line-height: 1.4;
        }

        #catgirl-settings select,
        #catgirl-settings input[type="text"],
        #catgirl-settings input[type="range"],
        #catgirl-settings textarea,
        #catgirl-blacklist select,
        #catgirl-blacklist input[type="text"],
        #catgirl-blacklist textarea {
            color: #333;
            width: 100%;
            padding: 10px 12px;
            border: 2px solid #e9ecef;
            border-radius: 6px;
            font-size: 14px;
            transition: all 0.3s ease;
            background: #fff;
            box-sizing: border-box;
        }

        #catgirl-settings select:focus,
        #catgirl-settings input:focus,
        #catgirl-settings textarea:focus,
        #catgirl-blacklist select:focus,
        #catgirl-blacklist input:focus,
        #catgirl-blacklist textarea:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        #catgirl-settings input[type="checkbox"],
        #catgirl-blacklist input[type="checkbox"] {
            width: auto;
            margin-right: 8px;
            transform: scale(1.2);
            accent-color: #667eea;
        }

        #catgirl-settings input[type="range"] {
            height: 6px;
            -webkit-appearance: none;
            background: #e9ecef;
            border-radius: 3px;
            padding: 0;
        }

        #catgirl-settings input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #667eea;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        #catgirl-settings .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-bottom: 20px;
        }

        #catgirl-settings .stat-item {
            text-align: center;
            padding: 16px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 8px;
            border: 1px solid #dee2e6;
        }

        #catgirl-settings .stat-number {
            font-size: 24px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 4px;
        }

        #catgirl-settings .stat-label {
            font-size: 12px;
            color: #6c757d;
            font-weight: 500;
        }

        #catgirl-settings .info-section,
        #catgirl-settings .performance-section {
            background: #f8f9fa;
            padding: 16px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            margin-bottom: 16px;
        }

        #catgirl-settings .info-section h4,
        #catgirl-settings .performance-section h4,
        #catgirl-blacklist h4 {
            margin: 0 0 12px 0;
            color: #495057;
            font-size: 16px;
        }

        #catgirl-settings .info-section p,
        #catgirl-settings .performance-section p {
            margin: 6px 0;
            color: #6c757d;
            font-size: 14px;
        }

        #catgirl-settings .actions,
        #catgirl-blacklist .actions {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #e9ecef;
        }

        #catgirl-settings button,
        #catgirl-blacklist button {
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }

        #catgirl-settings .btn-primary,
        #catgirl-blacklist .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            flex: 1;
        }

        #catgirl-settings .btn-primary:hover,
        #catgirl-blacklist .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        #catgirl-settings .btn-warning {
            background: linear-gradient(135deg, #ffc107 0%, #ff8c00 100%);
            color: #212529;
            flex: 1;
        }

        #catgirl-settings .btn-warning:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4);
        }

        #catgirl-settings .btn-secondary,
        #catgirl-blacklist .btn-secondary {
            background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
            color: white;
            flex: 1;
        }

        #catgirl-settings .btn-secondary:hover,
        #catgirl-blacklist .btn-secondary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(108, 117, 125, 0.4);
        }

        /* 黑名单面板特殊样式 */
        #catgirl-blacklist {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
            line-height: 1.5;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 600px;
            max-height: 80vh;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 10000;
            display: none;
            overflow: hidden;
        }

        #catgirl-blacklist .current-site-section {
            background: #f8f9fa;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #28a745;
        }

        #catgirl-blacklist .current-site-info {
            color: #333;
            background: #e9ecef;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 16px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
        }

        #catgirl-blacklist .action-group {
            margin-bottom: 12px;
        }

        #catgirl-blacklist .btn-danger {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            color: white;
            width: 100%;
            margin-top: 10px;
        }

        #catgirl-blacklist .btn-danger:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
        }

        #catgirl-blacklist .blacklist-section {
            margin-bottom: 24px;
        }

        #catgirl-blacklist .blacklist-item {
            background: #fff;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s ease;
        }

        #catgirl-blacklist .blacklist-item:hover {
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        #catgirl-blacklist .blacklist-item.expired {
            background: #f8f9fa;
            border-color: #adb5bd;
            opacity: 0.7;
        }

        #catgirl-blacklist .item-info {
            flex: 1;
        }

        #catgirl-blacklist .item-domain {
            font-weight: 600;
            color: #495057;
            margin-bottom: 4px;
        }

        #catgirl-blacklist .item-details {
            font-size: 12px;
            color: #6c757d;
            line-height: 1.4;
        }

        #catgirl-blacklist .remove-btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.3s ease;
        }

        #catgirl-blacklist .remove-btn:hover {
            background: #c82333;
            transform: scale(1.05);
        }

        #catgirl-blacklist .empty-state {
            text-align: center;
            color: #6c757d;
            font-style: italic;
            padding: 32px;
            background: #f8f9fa;
            border-radius: 8px;
        }

        #catgirl-blacklist .blacklist-stats {
            text-align: center;
            padding-top: 16px;
            border-top: 1px solid #e9ecef;
            margin-top: 16px;
        }

        #catgirl-blacklist .blacklist-settings {
            background: #e3f2fd;
            padding: 16px;
            border-radius: 8px;
            border-left: 4px solid #2196f3;
            margin-bottom: 20px;
        }

        /* 设置面板定位样式 */
        #catgirl-settings {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            max-height: 80vh;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 10000;
            display: none;
            overflow: hidden;
        }

        /* 原文提示tooltip样式 */
        .catgirl-original-tooltip {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif !important;
            white-space: pre-wrap;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
            backdrop-filter: blur(8px);
        }

        /* 链接转换样式 */
        .catgirl-converted-link {
            color: #667eea !important;
            text-decoration: none !important;
        }

        .catgirl-converted-link:hover {
            opacity: 0.8;
        }
            background: linear-gradient(135deg, #ff6b9d 0%, #ff8cc8 100%);
            color: white;
            padding: 20px;
            border-radius: 20px 20px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 15px rgba(255, 107, 157, 0.3);
        }

        #catgirl-block-ui .block-site-content {
            padding: 25px;
        }

        #catgirl-block-ui .site-info {
            display: flex;
            align-items: center;
            background: rgba(255, 182, 193, 0.1);
            padding: 15px;
            border-radius: 12px;
            margin-bottom: 20px;
            border: 1px solid #ffb6c1;
        }

        #catgirl-block-ui .site-icon {
            font-size: 24px;
            margin-right: 15px;
        }

        #catgirl-block-ui .site-domain {
            font-weight: bold;
            color: #d63384;
            font-size: 16px;
        }

        #catgirl-block-ui .site-path {
            color: #6c757d;
            font-size: 12px;
            margin-top: 2px;
        }

        #catgirl-block-ui .block-options {
            margin-bottom: 20px;
        }

        #catgirl-block-ui .option-group {
            margin-bottom: 15px;
        }

        #catgirl-block-ui .cute-label {
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 10px;
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        #catgirl-block-ui .cute-label:hover {
            background: rgba(255, 182, 193, 0.1);
        }

        #catgirl-block-ui .radio-custom {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border: 2px solid #ffb6c1;
            margin-right: 10px;
            position: relative;
            transition: all 0.3s ease;
        }

        #catgirl-block-ui input[type="radio"]:checked + .radio-custom {
            background: #ff69b4;
            border-color: #ff69b4;
        }

        #catgirl-block-ui input[type="radio"]:checked + .radio-custom::after {
            content: '';
            width: 6px;
            height: 6px;
            background: white;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        #catgirl-block-ui input[type="radio"] {
            display: none;
        }

        #catgirl-block-ui .option-text {
            font-weight: 500;
            color: #495057;
        }

        #catgirl-block-ui .cute-label-block {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #d63384;
        }

        #catgirl-block-ui .cute-select,
        #catgirl-block-ui .cute-input {
            width: 100%;
            padding: 12px;
            border: 2px solid #ffb6c1;
            border-radius: 10px;
            font-size: 14px;
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.8);
        }

        #catgirl-block-ui .cute-select:focus,
        #catgirl-block-ui .cute-input:focus {
            outline: none;
            border-color: #ff69b4;
            box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
        }

        #catgirl-block-ui .block-actions {
            display: flex;
            gap: 12px;
            margin-top: 25px;
        }

        #catgirl-block-ui .btn-block-confirm {
            flex: 1;
            padding: 12px 20px;
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        #catgirl-block-ui .btn-block-confirm:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4);
        }

        #catgirl-block-ui .btn-block-cancel {
            flex: 1;
            padding: 12px 20px;
            background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        #catgirl-block-ui .btn-block-cancel:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(108, 117, 125, 0.4);
        }

        /* 统计UI样式 */
        #catgirl-stats-ui .stats-header {
            background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%);
            color: white;
            padding: 20px;
            border-radius: 20px 20px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 15px rgba(32, 201, 151, 0.3);
        }

        #catgirl-stats-ui .stats-content {
            padding: 25px;
        }

        #catgirl-stats-ui .stats-cards {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 25px;
        }

        #catgirl-stats-ui .stat-card {
            background: rgba(32, 201, 151, 0.1);
            border: 1px solid #20c997;
            border-radius: 12px;
            padding: 15px;
            display: flex;
            align-items: center;
            transition: all 0.3s ease;
        }

        #catgirl-stats-ui .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(32, 201, 151, 0.2);
        }

        #catgirl-stats-ui .stat-icon {
            font-size: 24px;
            margin-right: 12px;
        }

        #catgirl-stats-ui .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #17a2b8;
            line-height: 1;
        }

        #catgirl-stats-ui .stat-label {
            font-size: 12px;
            color: #6c757d;
            margin-top: 2px;
        }

        #catgirl-stats-ui .system-info {
            background: rgba(23, 162, 184, 0.1);
            border: 1px solid #17a2b8;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
        }

        #catgirl-stats-ui .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            align-items: center;
        }

        #catgirl-stats-ui .info-row:last-child {
            margin-bottom: 0;
        }

        #catgirl-stats-ui .info-label {
            font-weight: 500;
            color: #495057;
        }

        #catgirl-stats-ui .info-value {
            color: #17a2b8;
            font-weight: 500;
        }

        #catgirl-stats-ui .status-running {
            color: #28a745;
        }

        #catgirl-stats-ui .status-paused {
            color: #ffc107;
        }

        #catgirl-stats-ui .status-blocked {
            color: #dc3545;
        }

        #catgirl-stats-ui .stats-actions {
            display: flex;
            gap: 12px;
        }

        #catgirl-stats-ui .btn-stats-refresh,
        #catgirl-stats-ui .btn-stats-export {
            flex: 1;
            padding: 12px 20px;
            border: none;
            border-radius: 10px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        #catgirl-stats-ui .btn-stats-refresh {
            background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%);
            color: white;
        }

        #catgirl-stats-ui .btn-stats-refresh:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(32, 201, 151, 0.4);
        }

        #catgirl-stats-ui .btn-stats-export {
            background: linear-gradient(135deg, #6f42c1 0%, #6610f2 100%);
            color: white;
        }

        #catgirl-stats-ui .btn-stats-export:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(111, 66, 193, 0.4);
        }

        /* 黑名单搜索样式 */
        #catgirl-blacklist .search-section {
            margin-bottom: 15px;
        }

        #catgirl-blacklist .search-input {
            width: 100%;
            padding: 10px 15px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.3s ease;
            background: #fff;
        }

        #catgirl-blacklist .search-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        #catgirl-blacklist .search-hint {
            font-size: 12px;
            color: #6c757d;
            margin-top: 5px;
        }

        #catgirl-blacklist .blacklist-scroll {
            max-height: 300px;
            overflow-y: auto;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 10px;
        }

        #catgirl-blacklist .search-highlight {
            background: #fff3cd;
            color: #856404;
            padding: 1px 3px;
            border-radius: 3px;
            font-weight: 500;
        }

        /* 响应式设计 */
        @media (max-width: 700px) {
            #catgirl-settings,
            #catgirl-blacklist {
                width: 95vw;
                max-height: 90vh;
            }

            #catgirl-settings .tab-container {
                flex-direction: column;
            }

            #catgirl-settings .tab-btn {
                flex: none;
            }

            #catgirl-settings .actions,
            #catgirl-blacklist .actions {
                flex-direction: column;
            }

            #catgirl-settings .stats-grid {
                grid-template-columns: 1fr;
            }

            #catgirl-blacklist .blacklist-item {
                flex-direction: column;
                align-items: stretch;
                gap: 12px;
            }

            #catgirl-blacklist .remove-btn {
                align-self: flex-end;
            }
        }

        /* 滚动条美化 */
        #catgirl-settings ::-webkit-scrollbar,
        #catgirl-blacklist ::-webkit-scrollbar {
            width: 8px;
        }

        #catgirl-settings ::-webkit-scrollbar-track,
        #catgirl-blacklist ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }

        #catgirl-settings ::-webkit-scrollbar-thumb,
        #catgirl-blacklist ::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 4px;
        }

        #catgirl-settings ::-webkit-scrollbar-thumb:hover,
        #catgirl-blacklist ::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
    `);

    // ===== 全局调试接口 =====
    window.catgirlApp = {
        get app() {
            return catgirlApp;
        },
        get blacklistManager() {
            return catgirlApp?.blacklistManager;
        },
        get config() {
            return CONFIG;
        },
        get version() {
            return SCRIPT_VERSION;
        },
        clearCache: function() {
            if (catgirlApp && typeof catgirlApp.clearCache === 'function') {
                catgirlApp.clearCache();
            }
        }
    };

})();
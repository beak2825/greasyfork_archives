// ==UserScript==
// @name         梦熊OJ将题目标题颜色改为洛谷原题难度代表色
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  new!
// @author       DeepSeek
// @license      MIT
// @match        https://www.mxoj.net/problem/*
// @match        https://www.mxoj.net/training/problems*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      www.luogu.com.cn
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543080/%E6%A2%A6%E7%86%8AOJ%E5%B0%86%E9%A2%98%E7%9B%AE%E6%A0%87%E9%A2%98%E9%A2%9C%E8%89%B2%E6%94%B9%E4%B8%BA%E6%B4%9B%E8%B0%B7%E5%8E%9F%E9%A2%98%E9%9A%BE%E5%BA%A6%E4%BB%A3%E8%A1%A8%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/543080/%E6%A2%A6%E7%86%8AOJ%E5%B0%86%E9%A2%98%E7%9B%AE%E6%A0%87%E9%A2%98%E9%A2%9C%E8%89%B2%E6%94%B9%E4%B8%BA%E6%B4%9B%E8%B0%B7%E5%8E%9F%E9%A2%98%E9%9A%BE%E5%BA%A6%E4%BB%A3%E8%A1%A8%E8%89%B2.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 配置参数
    const CONFIG = {
        debug: true,
        maxRetry: 3,
        retryDelay: 500,
        colorTransition: 'color 0.5s ease',
        // 题目页特定选择器
        problemTitleSelector: '.info-title > h1.name',
        // 题单页特定选择器 - 使用更可靠的选择器
        problemListContainer: '.problem-list',
        problemListTitleSelector: 'a[href*="/problem/"]'
    };
 
    // 洛谷难度颜色映射
    const DIFFICULTY_COLORS = {
        '入门': '#FE4C61',
        '普及-': '#F39C11',
        '普及/提高-': '#FFC116',
        '普及+/提高': '#52C41A',
        '提高+/省选-': '#3498DB',
        '省选/NOI-': '#9D3DCF',
        'NOI/NOI+/CTSC': '#0E1D69',
        '暂无评定': '#BFBFBF'
    };
 
    // 添加关键样式
    GM_addStyle(`
        /* 强制颜色覆盖 */
        .luogu-colored-title {
            color: var(--luogu-difficulty-color) !important;
            transition: ${CONFIG.colorTransition} !important;
        }
 
        /* 最强覆盖方案 - 使用动画强制应用样式 */
        .luogu-force-color-override {
            animation: luogu-color-blink 0.1s !important;
        }
 
        @keyframes luogu-color-blink {
            0% { opacity: 0.99; }
            100% { opacity: 1; }
        }
    `);
 
    // 主控制器
    class DifficultyColorizer {
        constructor() {
            this.difficultyCache = new Map();
            this.observer = null;
            this.init();
        }
 
        init() {
            if (this.isProblemPage()) {
                this.setupProblemPage();
            } else if (this.isProblemSetPage()) {
                this.setupProblemSetPage();
            }
        }
 
        // 页面类型判断
        isProblemPage() {
            return window.location.pathname.includes('/problem/') &&
                  !window.location.pathname.includes('/problems');
        }
 
        isProblemSetPage() {
            return window.location.pathname.includes('/training/problems');
        }
 
        // 题目页面设置 - 使用精确选择器
        setupProblemPage() {
            // 使用精确的选择器避免选中其他元素
            this.waitForElement(CONFIG.problemTitleSelector, (titleElement) => {
                const problemId = this.extractProblemIdFromURL();
                const luoguId = this.convertToLuoguId(problemId);
 
                if (luoguId) {
                    this.forceApplyColor(titleElement, luoguId);
                } else if (CONFIG.debug) {
                    console.log('无法转换题号:', problemId);
                }
            });
        }
 
        // 题单页面设置 - 增强选择器逻辑
        setupProblemSetPage() {
            // 初始处理
            this.processProblemTitles();
 
            // 设置观察器
            this.setupProblemSetObserver();
        }
 
        // 设置题单页面观察器
        setupProblemSetObserver() {
            // 移除旧观察器
            if (this.observer) {
                this.observer.disconnect();
            }
 
            // 创建新观察器
            this.observer = new MutationObserver((mutations) => {
                this.processProblemTitles();
            });
 
            // 观察整个文档变化
            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
 
        // 处理题单页题目 - 使用更可靠的选择器方法
        processProblemTitles() {
            try {
                // 方法1: 使用容器内的选择器
                const container = document.querySelector(CONFIG.problemListContainer);
                let titles = [];
 
                if (container) {
                    // 在容器内查找题目链接
                    titles = container.querySelectorAll(CONFIG.problemListTitleSelector);
                } else {
                    // 方法2: 回退到全局查找
                    titles = document.querySelectorAll(CONFIG.problemListTitleSelector);
                }
 
                if (CONFIG.debug) {
                    console.log(`找到 ${titles.length} 个题目标题`);
                }
 
                titles.forEach((title) => {
                    if (title.dataset.luoguColored) return;
                    title.dataset.luoguColored = 'true';
 
                    const problemId = this.extractProblemIdFromElement(title);
 
                    if (CONFIG.debug) {
                        console.log('处理题目:', {
                            text: title.textContent,
                            href: title.href,
                            problemId: problemId
                        });
                    }
 
                    const luoguId = this.convertToLuoguId(problemId);
 
                    if (luoguId) {
                        if (CONFIG.debug) {
                            console.log(`转换题号: ${problemId} → ${luoguId}`);
                        }
 
                        // 立即添加标记类
                        title.classList.add('luogu-colored-title', 'luogu-force-color-override');
 
                        // 应用颜色
                        this.applyColorToTitle(title, luoguId);
                    }
                });
            } catch (error) {
                console.error('处理题单标题出错:', error);
            }
        }
 
        // 应用颜色到标题
        async applyColorToTitle(titleElement, luoguId) {
            try {
                // 优先使用缓存
                if (this.difficultyCache.has(luoguId)) {
                    const difficultyData = this.difficultyCache.get(luoguId);
                    this.applyColor(titleElement, difficultyData);
                    return;
                }
 
                // 获取难度数据
                const difficultyData = await this.fetchDifficulty(luoguId);
                if (difficultyData) {
                    this.difficultyCache.set(luoguId, difficultyData);
                    this.applyColor(titleElement, difficultyData);
                }
            } catch (error) {
                console.error('应用颜色出错:', error);
            }
        }
 
        // 应用颜色
        applyColor(element, difficultyData) {
            if (!element || !difficultyData) return;
 
            const color = DIFFICULTY_COLORS[difficultyData.level] || difficultyData.color;
 
            // 应用CSS变量
            element.style.setProperty('--luogu-difficulty-color', color, 'important');
 
            // 直接设置颜色属性
            element.style.color = color;
 
            // 添加难度提示
            element.title = `洛谷难度: ${difficultyData.level}`;
 
            if (CONFIG.debug) {
                console.log('应用颜色成功:', {
                    element: element,
                    color: color,
                    level: difficultyData.level
                });
            }
        }
 
        // 强力应用颜色 - 题目页专用
        async forceApplyColor(element, luoguId, attempt = 0) {
            if (!element || attempt > CONFIG.maxRetry) {
                if (CONFIG.debug) console.log('停止重试:', luoguId);
                return;
            }
 
            try {
                // 获取难度数据
                let difficultyData;
                if (this.difficultyCache.has(luoguId)) {
                    difficultyData = this.difficultyCache.get(luoguId);
                } else {
                    difficultyData = await this.fetchDifficulty(luoguId);
                    if (difficultyData) {
                        this.difficultyCache.set(luoguId, difficultyData);
                    }
                }
 
                if (difficultyData) {
                    this.applyColor(element, difficultyData);
                } else {
                    setTimeout(() => {
                        this.forceApplyColor(element, luoguId, attempt + 1);
                    }, CONFIG.retryDelay);
                }
            } catch (error) {
                console.error('应用颜色出错:', error);
            }
        }
 
        // 从URL提取题目ID
        extractProblemIdFromURL() {
            const urlMatch = window.location.pathname.match(/\/problem\/([A-Za-z]+[\dA-Za-z]*)/i);
            return urlMatch ? urlMatch[1] : null;
        }
 
        // 从元素提取题目ID
        extractProblemIdFromElement(element) {
            if (element.href) {
                const match = element.href.match(/\/problem\/([A-Za-z]+[\dA-Za-z]*)/i);
                if (match) return match[1];
            }
 
            // 备用方法：从文本内容提取
            const text = element.textContent.trim();
            const textMatch = text.match(/\[?([A-Za-z]+[\dA-Za-z]*)\]?/);
            return textMatch ? textMatch[1] : null;
        }
 
        // 转换为洛谷题目ID
        convertToLuoguId(problemId) {
            if (!problemId) return null;
 
            // LB题号处理: LB123 → B123
            if (problemId.startsWith('LB') && problemId.length > 2) {
                return 'B' + problemId.substring(2);
            }
 
            // L题号处理: L123 → P123
            if (problemId.startsWith('L') && problemId.length > 1) {
                return 'P' + problemId.substring(1);
            }
 
            // CF题号保持不变
            if (problemId.startsWith('CF')) {
                return problemId;
            }
 
            return null;
        }
 
        // 获取难度数据 - 优化解析逻辑
        fetchDifficulty(luoguId) {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://www.luogu.com.cn/problem/${luoguId}`,
                    onload: (response) => {
                        try {
                            // 方法1: 从题目标签中提取（最快）
                            const tagMatch = response.responseText.match(/"difficulty":(\d+)/);
                            if (tagMatch) {
                                const levelMap = {
                                    0: '暂无评定',
                                    1: '入门',
                                    2: '普及-',
                                    3: '普及/提高-',
                                    4: '普及+/提高',
                                    5: '提高+/省选-',
                                    6: '省选/NOI-',
                                    7: 'NOI/NOI+/CTSC'
                                };
                                const level = levelMap[tagMatch[1]] || '暂无评定';
                                resolve({ level, color: DIFFICULTY_COLORS[level] });
                                return;
                            }
 
                            // 方法2: 从JSON数据提取
                            const jsonMatch = response.responseText.match(/JSON\.parse\('(.+?)'\)/);
                            if (jsonMatch) {
                                try {
                                    const jsonStr = jsonMatch[1].replace(/\\"/g, '"');
                                    const data = JSON.parse(jsonStr);
                                    if (data.currentData?.problem?.difficulty) {
                                        const level = data.currentData.problem.difficulty;
                                        resolve({ level, color: DIFFICULTY_COLORS[level] });
                                        return;
                                    }
                                } catch (e) {
                                    // JSON解析失败，继续尝试其他方法
                                }
                            }
 
                            // 方法3: 从HTML提取
                            const htmlMatch = response.responseText.match(/<span style="color:([^"]+)"[^>]*>([^<]+)<\/span>/);
                            if (htmlMatch) {
                                resolve({ level: htmlMatch[2], color: htmlMatch[1] });
                                return;
                            }
 
                            resolve(null);
                        } catch (error) {
                            console.error('解析难度出错:', error);
                            resolve(null);
                        }
                    },
                    onerror: () => {
                        if (CONFIG.debug) console.log('网络请求失败:', luoguId);
                        resolve(null);
                    },
                    // 添加超时处理
                    timeout: 5000
                });
            });
        }
 
        // 等待元素出现 - 使用精确选择器
        waitForElement(selector, callback, attempt = 0) {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else if (attempt < 5) {
                setTimeout(() => this.waitForElement(selector, callback, attempt + 1), 200);
            } else if (CONFIG.debug) {
                console.log('未找到元素:', selector);
            }
        }
    }
 
    // 启动插件
    const colorizer = new DifficultyColorizer();
 
    // 调试信息
    if (CONFIG.debug) {
        console.log('洛谷题目难度颜色插件已启动');
        console.log('当前页面:', window.location.href);
        console.log('配置:', CONFIG);
        console.log('题单容器选择器:', CONFIG.problemListContainer);
        console.log('题目标题选择器:', CONFIG.problemListTitleSelector);
    }
})();
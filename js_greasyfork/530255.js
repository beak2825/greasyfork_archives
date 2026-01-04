// ==UserScript==
// @name         YouTube捐款统计器
// @name:en     YouTube Donation Tracker
// @namespace    https://github.com/yourusername/yt-donation-tracker
// @version      1.0.3
// @description  自动统计YouTube评论区的捐款信息，支持多种货币
// @description:en  Automatically track donation information from YouTube comment sections, supporting multiple currencies
// @author       Jorkey Liu
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530255/YouTube%E6%8D%90%E6%AC%BE%E7%BB%9F%E8%AE%A1%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/530255/YouTube%E6%8D%90%E6%AC%BE%E7%BB%9F%E8%AE%A1%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // =========================
    // 常量定义
    // =========================
    const CONFIG = {
        debug: true,                 // 调试模式
        scanInterval: 1000,          // 扫描间隔（毫秒）
        language: 'zh'               // 默认语言：'zh'中文，'en'英文
    };
    
    const SELECTORS = {
        commentsSection: 'ytd-comments#comments',
        commentThreads: 'ytd-comment-thread-renderer',
        commentContent: '#content-text',
        authorText: '#author-text',
        loadingIndicator: 'yt-next-continuation',
        
        // 捐款相关选择器
        donationChipPrice: 'span#comment-chip-price, .yt-spec-button-shape-next__button-text-content',  // 捐款价格元素，包括一般超级留言和其他按钮文本
        priceElements: '[id*="price"], [class*="price"], span.style-scope.yt-formatted-string'  // 通用价格元素选择器
    };
    
    const UI_TEXT = {
        zh: {
            panelTitle: 'YouTube捐款统计',
            toggleButton: '捐款统计',
            startButton: '开始统计',
            stopButton: '停止',
            exportButton: '导出数据',
            detailsButton: '查看详情',
            statusReady: '就绪 (请点击开始)',
            statusScanning: '正在扫描中...请手动滚动页面加载评论',
            noDataTip: '暂未检测到捐款',
            statsTitle: '捐款统计:',
            noStatsData: '暂无捐款数据',
            scannedComments: '已扫描评论: ',
            detectedDonations: '检测到捐款: ',
            donationDetailsTitle: '捐款详情',
            noDonationData: '暂无捐款数据',
            donationSummary: '总计: {total}笔捐款，来自{comments}条评论',
            donationTableHeaders: ['用户', '捐款金额', '评论内容'],
            exportNoData: '暂无数据可导出',
            errorPrefix: '发生错误: ',
            csvHeaders: '用户,捐款金额,货币,评论内容'
        },
        en: {
            panelTitle: 'YouTube Donation Tracker',
            toggleButton: 'Donations',
            startButton: 'Start Scanning',
            stopButton: 'Stop',
            exportButton: 'Export Data',
            detailsButton: 'View Details',
            statusReady: 'Ready (click to start)',
            statusScanning: 'Scanning...please scroll to load more comments',
            noDataTip: 'No donations detected yet',
            statsTitle: 'Donation Statistics:',
            noStatsData: 'No donation data',
            scannedComments: 'Comments Scanned: ',
            detectedDonations: 'Donations Detected: ',
            donationDetailsTitle: 'Donation Details',
            noDonationData: 'No donation data available',
            donationSummary: 'Total: {total} donations from {comments} comments',
            donationTableHeaders: ['User', 'Amount', 'Comment'],
            exportNoData: 'No data to export',
            errorPrefix: 'Error: ',
            csvHeaders: 'User,Amount,Currency,Comment'
        }
    };
    
    // =========================
    // 应用状态
    // =========================
    const AppState = {
        isScanning: false,      // 是否正在扫描
        totalProcessed: 0,      // 已处理评论数
        scanInterval: null,     // 扫描定时器
        scanStartTime: null,    // 扫描开始时间
        scanCount: 0,           // 当前扫描次数
        processedCommentIds: new Set(), // 已处理评论ID集合
        
        // 统计数据
        statistics: {
            totalDonations: 0,       // 总捐款数
            totalComments: 0,        // 总评论数
            currencyStats: {},       // 按币种统计: { "US$": { count: 0, total: 0, originalTexts: [] }, ... }
            donationComments: []     // 包含捐款的评论列表
        },
        
        // 重置统计数据
        resetStats() {
            this.statistics = {
                totalDonations: 0,
                totalComments: 0,
                currencyStats: {},
                donationComments: []
            };
            return this.statistics;
        },
        
        // 更新状态
        updateState(changes) {
            Object.assign(this, changes);
        }
    };
    
    // 初始化状态
    AppState.resetStats();
    
    // =========================
    // 数据模型
    // =========================
    
    /**
     * 评论数据模型
     * @typedef {Object} CommentData
     * @property {string} id - 评论ID
     * @property {string} author - 评论作者
     * @property {string} content - 评论内容
     * @property {Array<DonationData>} donations - 捐款数据列表
     */
    
    /**
     * 捐款数据模型
     * @typedef {Object} DonationData
     * @property {string} currencySymbol - 币种符号（原始文本格式）
     * @property {string} amount - 金额（原始文本格式）
     * @property {string} rawText - 原始完整文本
     */
    
    /**
     * 创建评论数据对象
     * @param {Element} commentElement - 评论DOM元素
     * @returns {CommentData}
     */
    function createCommentData(commentElement) {
        // 生成唯一ID
        const id = 'comment_' + Math.random().toString(36).substr(2, 9);
        
        // 获取作者信息
        const authorElement = commentElement.querySelector(SELECTORS.authorText);
        const author = authorElement ? authorElement.textContent.trim() : '未知用户';
        
        // 获取评论内容
        const contentElement = commentElement.querySelector(SELECTORS.commentContent);
        const content = contentElement ? contentElement.textContent.trim() : '';
        
        return {
            id,
            author,
            content,
            donations: [] // 初始为空数组，后续处理时添加
        };
    }
    
    // =========================
    // 捐款提取模块
    // =========================
    
    /**
     * 从捐款文本中提取币种和金额
     * @param {string} text - 捐款文本 (如 "US$199.99", "JP¥10,000", "€20.00" 等)
     * @returns {Object|null} 包含currencySymbol和amount的对象，或null
     */
    function parseDonationText(text) {
        // 清理文本
        const cleanText = text.trim();
        
        // 使用正则表达式找出数字部分（包括逗号和小数点）
        const numberMatch = /([\d,]+(\.\d{1,2})?)/g.exec(cleanText);
        
        if (!numberMatch) {
            return null; // 没有找到数字，不是有效的捐款格式
        }
        
        // 提取数字部分（保持原始格式，包括逗号）
        const amount = numberMatch[0];
        
        // 提取币种部分（数字之前的所有非空白字符）
        const startPos = cleanText.indexOf(amount);
        const currencySymbol = startPos > 0 ? cleanText.substring(0, startPos).trim() : '';
        
        // 如果没有币种标识，则不是有效捐款
        if (!currencySymbol) {
            return null;
        }
        
        return { 
            currencySymbol, 
            amount,
            rawText: cleanText
        };
    }
    
    /**
     * 从评论中查找并处理捐款信息
     * @param {Element} commentElement - 评论DOM元素
     * @returns {Array} 捐款数据数组
     */
    function extractDonationsFromComment(commentElement) {
        const donations = [];
        
        // 直接查找捐款价格元素 - 先尝试精确选择器
        let priceElements = commentElement.querySelectorAll(SELECTORS.donationChipPrice);
        
        // 如果没有找到，尝试使用更广泛的选择器
        if (!priceElements || priceElements.length === 0) {
            priceElements = commentElement.querySelectorAll(SELECTORS.priceElements);
        }
        
        if (priceElements && priceElements.length > 0) {
            // 处理每个价格元素
            priceElements.forEach(priceElement => {
                const priceText = priceElement.textContent.trim();
                
                // 解析捐款文本获取币种和金额
                const donationInfo = parseDonationText(priceText);
                if (donationInfo) {
                    donations.push({
                        currencySymbol: donationInfo.currencySymbol,
                        amount: donationInfo.amount,
                        rawText: donationInfo.rawText
                    });
                    
                    log(`检测到捐款: ${donationInfo.currencySymbol} ${donationInfo.amount}`, priceText);
                }
            });
        }
        
        return donations;
    }
    
    /**
     * 分析评论内容并更新统计
     * @param {CommentData} commentData - 评论数据
     * @param {Element} commentElement - 评论DOM元素
     * @returns {boolean} 是否检测到捐款
     */
    function analyzeComment(commentData, commentElement) {
        // 从评论DOM中提取捐款信息
        const donations = extractDonationsFromComment(commentElement);
        
        // 如果没有检测到捐款，返回false
        if (donations.length === 0) {
            return false;
        }
        
        // 将捐款信息添加到评论数据
        commentData.donations = donations;
        
        // 更新统计数据
        updateDonationStats(commentData);
        
        return true;
    }
    
    /**
     * 更新捐款统计数据
     * @param {CommentData} commentData - 包含捐款信息的评论数据
     */
    function updateDonationStats(commentData) {
        const { statistics } = AppState;
        
        // 如果评论包含捐款，添加到捐款评论列表
        if (commentData.donations.length > 0) {
            statistics.donationComments.push(commentData);
            statistics.totalDonations += commentData.donations.length;
            
            // 按币种更新统计
            commentData.donations.forEach(donation => {
                const { currencySymbol, amount, rawText } = donation;
                
                // 如果这个币种还没有统计记录，创建一个
                if (!statistics.currencyStats[currencySymbol]) {
                    statistics.currencyStats[currencySymbol] = {
                        count: 0,
                        total: 0,
                        originalTexts: []
                    };
                }
                
                // 更新统计
                const currencyStat = statistics.currencyStats[currencySymbol];
                currencyStat.count++;
                currencyStat.originalTexts.push(rawText);
                
                // 提取数值部分用于累加（去除逗号）
                const numericAmount = parseFloat(amount.replace(/,/g, ''));
                if (!isNaN(numericAmount)) {
                    currencyStat.total += numericAmount;
                }
            });
        }
    }
    
    /**
     * 格式化捐款金额显示
     * @param {string} currencySymbol - 币种符号
     * @param {string} amount - 金额
     * @returns {string} 格式化后的金额字符串
     */
    function formatDonation(currencySymbol, amount) {
        return `${currencySymbol}${amount}`;
    }
    
    // =========================
    // 工具函数
    // =========================
    
    /**
     * 调试日志输出
     * @param {string} message - 日志消息
     * @param {any} data - 相关数据（可选）
     */
    function log(message, data) {
        if (CONFIG.debug) {
            if (data !== undefined) {
                console.log(`[YT捐款统计] ${message}`, data);
            } else {
                console.log(`[YT捐款统计] ${message}`);
            }
        }
    }
    
    /**
     * 检查当前是否为YouTube视频页面
     * @returns {boolean}
     */
    function isYouTubeVideoPage() {
        return window.location.href.includes('youtube.com/watch');
    }
    
    /**
     * 等待元素出现在DOM中
     * @param {string} selector - CSS选择器
     * @param {number} timeout - 超时时间（毫秒）
     * @returns {Promise<Element>}
     */
    function waitForElement(selector, timeout = 30000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                return resolve(element);
            }
            
            const observer = new MutationObserver((mutations, observer) => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // 设置超时
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`等待元素 ${selector} 超时`));
            }, timeout);
        });
    }
    
    /**
     * 防抖函数
     * @param {Function} func - 要执行的函数
     * @param {number} wait - 等待时间（毫秒）
     * @returns {Function} 防抖处理后的函数
     */
    function debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * 节流函数
     * @param {Function} func - 要执行的函数
     * @param {number} limit - 限制时间（毫秒）
     * @returns {Function} 节流处理后的函数
     */
    function throttle(func, limit = 300) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false;
                }, limit);
            }
        };
    }
    
    /**
     * 获取当前语言的UI文本
     * @param {string} key - 文本键名
     * @returns {string|array} - 对应语言的文本
     */
    function getText(key) {
        const lang = CONFIG.language;
        return UI_TEXT[lang][key] || UI_TEXT['en'][key]; // 如果找不到则使用中文作为后备
    }
    
    /**
     * 错误处理器
     * @param {Error} error - 错误对象
     * @param {string} context - 错误上下文
     */
    function handleError(error, context) {
        log(`错误 [${context}]:`, error);
        
        // 在UI上显示错误
        const status = document.getElementById('yt-donation-status');
        if (status) {
            status.textContent = `${getText('errorPrefix')}${error.message}`;
            status.style.color = '#f44336';
        }
        
        // 如果正在扫描，尝试恢复
        if (AppState.isScanning) {
            log('尝试恢复扫描...');
            // 短暂延迟后尝试继续
            setTimeout(() => {
                if (AppState.isScanning) {
                    processNewComments();
                }
            }, 2000);
        }
    }
    
    /**
     * 等待评论区加载完成
     * @returns {Promise<Element>}
     */
    async function waitForComments() {
        log('等待评论区加载...');
        try {
            const commentsSection = await waitForElement(SELECTORS.commentsSection);
            log('评论区已加载');
            return commentsSection;
        } catch (error) {
            log('评论区加载失败', error);
            throw error;
        }
    }
    
    /**
     * 监听页面URL变化
     * @param {Function} callback - URL变化时的回调函数
     */
    function watchPageChanges(callback) {
        let lastUrl = location.href;
        
        // 创建MutationObserver监听URL变化
        const observer = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                callback(location.href);
            }
        });
        
        // 开始观察
        observer.observe(document.querySelector('body'), {
            childList: true,
            subtree: true
        });
        
        return observer;
    }
    
    // =========================
    // DOM分析相关函数
    // =========================
    
    /**
     * 初始化评论区监视器
     * @param {Element} commentsSection - 评论区容器元素
     */
    function initObservers(commentsSection) {
        log('初始化评论区监视器');
        
        // 创建MutationObserver监听评论区变化
        const commentObserver = new MutationObserver((mutations) => {
            if (AppState.isScanning) {
                // 如果正在扫描中，检查新增评论
                const newComments = getUnprocessedComments();
                if (newComments.length > 0) {
                    log(`检测到${newComments.length}条新评论`);
                    // 重置无新评论计数
                    AppState.noNewCommentsCount = 0;
                }
            }
        });
        
        // 开始观察评论区变化
        commentObserver.observe(commentsSection, {
            childList: true,
            subtree: true
        });
        
        log('评论区监视器已初始化');
    }
    
    /**
     * 获取未处理的评论元素
     * @returns {NodeList}
     */
    function getUnprocessedComments() {
        // 获取所有评论元素
        const allComments = document.querySelectorAll(SELECTORS.commentThreads);
        // 过滤出未处理的评论
        return Array.from(allComments).filter(comment => {
            // 为每个评论生成一个唯一ID
            const commentId = generateCommentId(comment);
            // 检查是否已经处理过
            return !AppState.processedCommentIds.has(commentId);
        });
    }
    
    /**
     * 为评论生成唯一ID
     * @param {Element} commentElement - 评论DOM元素
     * @returns {string} 唯一ID
     */
    function generateCommentId(commentElement) {
        // 获取作者和内容作为ID的组成部分
        const authorElement = commentElement.querySelector(SELECTORS.authorText);
        const contentElement = commentElement.querySelector(SELECTORS.commentContent);
        
        const author = authorElement ? authorElement.textContent.trim() : '';
        const content = contentElement ? contentElement.textContent.trim() : '';
        
        // 组合作者和内容的简短摘要作为ID
        return `${author.slice(0, 20)}_${content.slice(0, 30)}`;
    }
    
    /**
     * 处理所有未处理的评论
     * @returns {number} 处理的评论数量
     */
    function processNewComments() {
        // 获取所有未处理评论
        const newComments = getUnprocessedComments();
        let processedCount = 0;
        
        if (newComments.length === 0) {
            log(`未找到新评论，已处理总数: ${AppState.totalProcessed}`);
            return 0;
        }
        
        // 处理每条评论
        newComments.forEach(commentElement => {
            try {
                // 创建评论数据
                const commentData = createCommentData(commentElement);
                
                // 生成并记录评论ID
                const commentId = generateCommentId(commentElement);
                AppState.processedCommentIds.add(commentId);
                
                // 更新统计
                AppState.statistics.totalComments++;
                AppState.totalProcessed++;
                
                // 分析评论
                analyzeComment(commentData, commentElement);
                
                processedCount++;
            } catch (error) {
                log('处理评论时出错', error);
            }
        });
        
        if (processedCount > 0) {
            log(`已处理${processedCount}条新评论，累计: ${AppState.totalProcessed}`);
            updateUI(); // 更新UI显示
        }
        
        return processedCount;
    }
    
    /**
     * 开始扫描评论
     */
    function startScanning() {
        if (AppState.isScanning) {
            log('已经在扫描中');
            return;
        }
        
        log('开始扫描评论');
        
        // 更新状态
        AppState.updateState({
            isScanning: true,
            scanStartTime: Date.now(),
            scanCount: 0,
            totalProcessed: 0,
            processedCommentIds: new Set()
        });
        
        // 重置统计
        AppState.resetStats();
        
        // 初始扫描一次
        processNewComments();
        
        // 设置定时扫描
        AppState.scanInterval = setInterval(() => {
            // 更新扫描计数
            AppState.scanCount++;
            
            // 处理新评论
            processNewComments();
            
            
            // 更新状态显示
            updateUIState();
        }, CONFIG.scanInterval);
        
        // 更新UI状态
        updateUIState();
    }
    
    /**
     * 停止扫描评论
     */
    function stopScanning() {
        if (!AppState.isScanning) {
            return;
        }
        
        log('停止扫描评论');
        
        // 清除定时器
        if (AppState.scanInterval) {
            clearInterval(AppState.scanInterval);
            AppState.scanInterval = null;
        }
        
        // 更新状态
        AppState.updateState({
            isScanning: false
        });
        
        // 更新UI状态
        updateUIState();
        
        // 显示最终统计结果
        log('扫描完成，最终统计', AppState.statistics);
    }
    
    // =========================
    // UI相关函数
    // =========================
    
    /**
     * 创建UI控制面板
     */
    function createUI() {
        log('创建UI控制面板');
        
        // 创建主容器
        const panel = document.createElement('div');
        panel.id = 'yt-donation-tracker-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 280px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            font-family: Arial, sans-serif;
            padding: 12px;
            color: #333;
            display: none;
        `;
        
        // 创建标题容器
        const title = document.createElement('div');
        title.style.cssText = `
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        // 创建标题文本元素
        const titleText = document.createElement('span');
        titleText.id = 'yt-donation-title-text';
        titleText.textContent = getText('panelTitle');
        title.appendChild(titleText);
        
        // 添加关闭按钮
        const closeBtn = document.createElement('span');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            cursor: pointer;
            padding: 0 5px;
            font-size: 16px;
        `;
        closeBtn.addEventListener('click', () => {
            // 如果正在扫描，先停止扫描
            if (AppState.isScanning) {
                stopScanning();
            }
            // 然后隐藏面板
            panel.style.display = 'none';
            toggleButton.style.display = 'block';
        });
        title.appendChild(closeBtn);
        
        // 创建内容容器
        const content = document.createElement('div');
        content.id = 'yt-donation-tracker-content';
        
        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 8px;
            margin-bottom: 10px;
        `;
        
        // 创建操作按钮（开始/停止）
        const actionBtn = document.createElement('button');
        actionBtn.id = 'yt-donation-action-btn';
        actionBtn.textContent = getText('startButton');
        actionBtn.style.cssText = buttonStyle();
        actionBtn.addEventListener('click', () => {
            if (AppState.isScanning) {
                stopScanning();
            } else {
                startScanning();
            }
        });
        
        // 添加按钮到容器
        buttonContainer.appendChild(actionBtn);
        
        // 创建状态显示
        const status = document.createElement('div');
        status.id = 'yt-donation-status';
        status.style.cssText = `
            font-size: 12px;
            margin: 8px 0;
            color: #666;
        `;
        status.textContent = getText('statusReady');
        
        // 创建统计结果容器
        const results = document.createElement('div');
        results.id = 'yt-donation-results';
        results.style.cssText = `
            margin-top: 10px;
            font-size: 13px;
        `;
        
        // 创建导出按钮
        const exportBtn = document.createElement('button');
        exportBtn.id = 'yt-donation-export-btn';
        exportBtn.textContent = getText('exportButton');
        exportBtn.style.cssText = buttonStyle('#2196f3');
        exportBtn.style.display = 'none';
        exportBtn.addEventListener('click', exportData);
        
        // 创建详情按钮
        const detailsBtn = document.createElement('button');
        detailsBtn.id = 'yt-donation-details-btn';
        detailsBtn.textContent = getText('detailsButton');
        detailsBtn.style.cssText = buttonStyle('#ff9800');
        detailsBtn.style.display = 'none';
        detailsBtn.addEventListener('click', showDetailsModal);
        
        // 创建操作按钮容器
        const actionContainer = document.createElement('div');
        actionContainer.style.cssText = `
            display: flex;
            gap: 8px;
            margin-top: 10px;
        `;
        actionContainer.appendChild(exportBtn);
        actionContainer.appendChild(detailsBtn);
        
        // 创建语言切换按钮
        const langBtn = document.createElement('button');
        langBtn.id = 'yt-donation-lang-btn';
        langBtn.textContent = CONFIG.language === 'zh' ? 'EN' : '中';
        langBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 48px;
            padding: 2px 4px;
            font-size: 10px;
            background: #eee;
            border: none;
            border-radius: 2px;
            cursor: pointer;
            color: #666;
        `;
        langBtn.addEventListener('click', () => {
            // 切换语言
            CONFIG.language = CONFIG.language === 'zh' ? 'en' : 'zh';
            langBtn.textContent = CONFIG.language === 'zh' ? 'EN' : '中';
            
            // 更新UI文本
            const titleText = document.getElementById('yt-donation-title-text');
            if (titleText) {
                titleText.textContent = getText('panelTitle');
            }
            
            status.textContent = AppState.isScanning ? 
                getText('statusScanning').replace('{count}', AppState.totalProcessed)
                    .replace('{time}', Math.round((Date.now() - AppState.scanStartTime) / 1000)) : 
                getText('statusReady');
            actionBtn.textContent = AppState.isScanning ? 
                getText('stopButton') : getText('startButton');
            exportBtn.textContent = getText('exportButton');
            detailsBtn.textContent = getText('detailsButton');
            toggleButton.textContent = getText('toggleButton');
            
            // 更新统计显示
            updateUI();
        });
        
        // 组装UI
        content.appendChild(buttonContainer);
        content.appendChild(status);
        content.appendChild(results);
        content.appendChild(actionContainer);
        
        panel.appendChild(title);
        panel.appendChild(langBtn);
        panel.appendChild(content);
        
        // 创建侧边呼出按钮
        const toggleButton = document.createElement('div');
        toggleButton.id = 'yt-donation-toggle';
        toggleButton.textContent = getText('toggleButton');
        toggleButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 8px 16px;
            font-size: 13px;
            border-radius: 4px;
            cursor: pointer;
            z-index: 9998;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            text-align: center;
            font-weight: bold;
        `;
        toggleButton.addEventListener('click', () => {
            panel.style.display = 'block';
            toggleButton.style.display = 'none';
        });
        
        // 添加到页面
        document.body.appendChild(panel);
        document.body.appendChild(toggleButton);
        
        // 初始化UI
        updateUI();
        
        log('UI控制面板已创建');
        
        return { panel, toggleButton };
    }
    
    /**
     * 按钮样式生成器
     * @param {string} bgColor - 背景颜色
     * @returns {string} CSS样式字符串
     */
    function buttonStyle(bgColor = '#4caf50') {
        return `
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            background: ${bgColor};
            color: white;
            font-size: 12px;
            cursor: pointer;
            flex: 1;
        `;
    }
    
    /**
     * 更新UI显示
     */
    function updateUI() {
        const results = document.getElementById('yt-donation-results');
        if (!results) return;
        
        const { statistics } = AppState;
        
        // 清空结果容器
        while (results.firstChild) {
            results.removeChild(results.firstChild);
        }
        
        // 创建扫描计数元素
        const scanCountDiv = document.createElement('div');
        scanCountDiv.style.marginBottom = '5px';
        scanCountDiv.appendChild(document.createTextNode(getText('scannedComments')));
        const scanCountStrong = document.createElement('strong');
        scanCountStrong.textContent = statistics.totalComments;
        scanCountDiv.appendChild(scanCountStrong);
        results.appendChild(scanCountDiv);
        
        // 创建捐款计数元素
        const donationCountDiv = document.createElement('div');
        donationCountDiv.style.marginBottom = '8px';
        donationCountDiv.appendChild(document.createTextNode(getText('detectedDonations')));
        const donationCountStrong = document.createElement('strong');
        donationCountStrong.textContent = statistics.totalDonations;
        donationCountDiv.appendChild(donationCountStrong);
        results.appendChild(donationCountDiv);
        
        // 没有捐款时显示提示
        if (statistics.totalDonations === 0) {
            const noDataDiv = document.createElement('div');
            noDataDiv.style.color = '#666';
            noDataDiv.style.fontStyle = 'italic';
            noDataDiv.textContent = getText('noDataTip');
            results.appendChild(noDataDiv);
        } else {
            // 创建捐款统计标题
            const statsTitle = document.createElement('div');
            statsTitle.style.fontWeight = 'bold';
            statsTitle.style.marginTop = '5px';
            statsTitle.textContent = getText('statsTitle');
            results.appendChild(statsTitle);
            
            // 创建列表
            const statsList = document.createElement('ul');
            statsList.style.margin = '5px 0';
            statsList.style.paddingLeft = '20px';
            
            let hasDonations = false;
            
            // 遍历所有币种统计
            Object.keys(statistics.currencyStats).forEach(symbol => {
                const stat = statistics.currencyStats[symbol];
                // 只显示有捐款的币种
                if (stat.count > 0) {
                    hasDonations = true;
                    const listItem = document.createElement('li');
                    
                    // 添加币种信息
                    listItem.appendChild(document.createTextNode(`${symbol}: `));
                    
                    // 添加金额
                    const amountStrong = document.createElement('strong');
                    // 显示两位小数，除非是整数
                    let totalDisplay = stat.total;
                    if (Math.floor(stat.total) !== stat.total) {
                        totalDisplay = stat.total.toFixed(2);
                    }
                    amountStrong.textContent = totalDisplay;
                    listItem.appendChild(amountStrong);
                    
                    // 添加笔数
                    listItem.appendChild(document.createTextNode(` (${stat.count}${CONFIG.language === 'zh' ? '笔' : ''})`));
                    
                    statsList.appendChild(listItem);
                }
            });
            
            if (!hasDonations) {
                const listItem = document.createElement('li');
                listItem.textContent = getText('noStatsData');
                statsList.appendChild(listItem);
            }
            
            results.appendChild(statsList);
            
            // 显示操作按钮
            const exportBtn = document.getElementById('yt-donation-export-btn');
            const detailsBtn = document.getElementById('yt-donation-details-btn');
            
            if (exportBtn) exportBtn.style.display = 'block';
            if (detailsBtn) detailsBtn.style.display = 'block';
        }
    }
    
    /**
     * 更新UI状态
     */
    function updateUIState() {
        // 更新按钮状态
        const actionBtn = document.getElementById('yt-donation-action-btn');
        const panel = document.getElementById('yt-donation-tracker-panel');
        const toggleButton = document.getElementById('yt-donation-toggle');
        
        if (actionBtn) {
            if (AppState.isScanning) {
                actionBtn.textContent = getText('stopButton');
                actionBtn.style.background = '#f44336'; // 红色
            } else {
                actionBtn.textContent = getText('startButton');
                actionBtn.style.background = '#4caf50'; // 绿色
            }
        }
        
        // 如果正在扫描，确保面板显示
        if (AppState.isScanning && panel && toggleButton) {
            panel.style.display = 'block';
            toggleButton.style.display = 'none';
        }
        
        // 更新状态文本
        const status = document.getElementById('yt-donation-status');
        if (status) {
            if (AppState.isScanning) {
                const scannedTime = Math.round((Date.now() - AppState.scanStartTime) / 1000);
                status.textContent = getText('statusScanning')
                    .replace('{count}', AppState.totalProcessed)
                    .replace('{time}', scannedTime);
            } else {
                status.textContent = getText('statusReady');
            }
        }
    }
    
    /**
     * 创建详情模态窗口
     */
    function showDetailsModal() {
        // 移除已有的模态窗口
        const existingModal = document.getElementById('yt-donation-details-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const { statistics } = AppState;
        
        // 创建模态窗口容器
        const modal = document.createElement('div');
        modal.id = 'yt-donation-details-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        // 添加点击空白处关闭功能
        modal.addEventListener('click', (event) => {
            // 如果点击的是模态窗口背景（而不是内容区域），关闭窗口
            if (event.target === modal) {
                modal.remove();
            }
        });
        
        // 创建模态窗口内容
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 8px;
            max-width: 800px;
            width: 80%;
            max-height: 80vh;
            overflow-y: auto;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        `;
        
        // 创建标题和关闭按钮
        const titleRow = document.createElement('div');
        titleRow.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        `;
        
        // 创建标题文本
        const title = document.createElement('h2');
        title.style.cssText = `
            margin: 0;
            font-size: 18px;
        `;
        title.textContent = getText('donationDetailsTitle');
        titleRow.appendChild(title);
        
        // 创建关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            padding: 0 5px;
        `;
        closeBtn.addEventListener('click', () => modal.remove());
        titleRow.appendChild(closeBtn);
        
        // 创建内容
        const contentDiv = document.createElement('div');
        
        // 构建捐款详情
        if (statistics.donationComments.length === 0) {
            const noDataP = document.createElement('p');
            noDataP.textContent = getText('noDonationData');
            contentDiv.appendChild(noDataP);
        } else {
            // 创建总计信息
            const summaryDiv = document.createElement('div');
            summaryDiv.style.marginBottom = '15px';
            
            const summaryText = getText('donationSummary')
                .replace('{total}', statistics.totalDonations)
                .replace('{comments}', statistics.donationComments.length);
            summaryDiv.textContent = summaryText;
            
            contentDiv.appendChild(summaryDiv);
            
            // 创建表格
            const table = document.createElement('table');
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            
            // 创建表头
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            
            const headers = getText('donationTableHeaders');
            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.style.textAlign = 'left';
                th.style.padding = '8px';
                th.style.borderBottom = '1px solid #ddd';
                th.textContent = headerText;
                headerRow.appendChild(th);
            });
            
            thead.appendChild(headerRow);
            table.appendChild(thead);
            
            // 创建表格内容
            const tbody = document.createElement('tbody');
            
            // 添加每条捐款评论
            statistics.donationComments.forEach(comment => {
                const row = document.createElement('tr');
                
                // 用户单元格
                const userCell = document.createElement('td');
                userCell.style.padding = '8px';
                userCell.style.borderBottom = '1px solid #eee';
                userCell.textContent = comment.author;
                row.appendChild(userCell);
                
                // 捐款金额单元格
                const donationCell = document.createElement('td');
                donationCell.style.padding = '8px';
                donationCell.style.borderBottom = '1px solid #eee';
                
                // 构建该评论的所有捐款文本
                const donationsText = comment.donations.map(d => 
                    formatDonation(d.currencySymbol, d.amount)
                ).join(', ');
                donationCell.textContent = donationsText;
                
                row.appendChild(donationCell);
                
                // 评论内容单元格
                const contentCell = document.createElement('td');
                contentCell.style.padding = '8px';
                contentCell.style.borderBottom = '1px solid #eee';
                contentCell.textContent = comment.content;
                row.appendChild(contentCell);
                
                tbody.appendChild(row);
            });
            
            table.appendChild(tbody);
            contentDiv.appendChild(table);
        }
        
        // 组装模态窗口
        modalContent.appendChild(titleRow);
        modalContent.appendChild(contentDiv);
        modal.appendChild(modalContent);
        
        // 添加到页面
        document.body.appendChild(modal);
    }
    
    /**
     * 导出数据为CSV文件
     */
    function exportData() {
        const { statistics } = AppState;
        
        if (statistics.donationComments.length === 0) {
            alert(getText('exportNoData'));
            return;
        }
        
        // 创建CSV内容
        let csvContent = getText('csvHeaders') + '\n';
        
        statistics.donationComments.forEach(comment => {
            comment.donations.forEach(donation => {
                // 格式化CSV行
                const row = [
                    csvEscape(comment.author),
                    donation.amount,
                    donation.currencySymbol,
                    csvEscape(comment.content)
                ];
                
                csvContent += row.join(',') + '\n';
            });
        });
        
        // 使用Blob创建CSV文件
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        // 创建下载链接
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `youtube_donations_${Date.now()}.csv`);
        link.style.display = 'none';
        document.body.appendChild(link);
        
        // 触发下载
        link.click();
        
        // 清理
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // 释放URL对象
    }
    
    /**
     * 转义CSV中的文本
     * @param {string} text - 原始文本
     * @returns {string} 转义后的文本
     */
    function csvEscape(text) {
        // 如果文本中包含逗号、引号或换行符，需要用引号包裹
        if (/[",\n\r]/.test(text)) {
            // 将文本中的引号替换为两个引号
            return '"' + text.replace(/"/g, '""') + '"';
        }
        return text;
    }
    
    /**
     * 转义HTML特殊字符
     * @param {string} text - 原始文本
     * @returns {string} 转义后的文本
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // =========================
    // 主逻辑
    // =========================
    
    /**
     * 脚本初始化
     */
    async function init() {
        log('YouTube捐款统计器初始化...');
        
        // 检查是否在YouTube视频页面
        if (!isYouTubeVideoPage()) {
            log('不是YouTube视频页面，等待页面变化');
            // 监听页面变化
            watchPageChanges(url => {
                if (url.includes('youtube.com/watch')) {
                    log('检测到视频页面，开始初始化');
                    initOnVideoPage();
                }
            });
            return;
        }
        
        await initOnVideoPage();
    }
    
    /**
     * 在视频页面上初始化
     */
    async function initOnVideoPage() {
        try {
            // 清理旧的UI和状态
            cleanup();
            
            // 等待评论区加载
            const commentsSection = await waitForComments();
            
            // 创建UI
            const { panel, toggleButton } = createUI();
            
            // 初始化观察器
            initObservers(commentsSection);
            
            log('初始化完成');
        } catch (error) {
            handleError(error, '初始化');
            
            // 如果是评论区加载失败，可能是YouTube的SPA导航，尝试延迟重试
            setTimeout(() => {
                if (isYouTubeVideoPage()) {
                    log('尝试重新初始化...');
                    initOnVideoPage();
                }
            }, 3000);
        }
    }
    
    /**
     * 清理旧的UI和状态
     */
    function cleanup() {
        log('清理旧状态...');
        
        // 停止扫描
        stopScanning();
        
        // 移除旧UI
        const oldPanel = document.getElementById('yt-donation-tracker-panel');
        if (oldPanel) {
            oldPanel.remove();
        }
        
        // 移除旧的模态窗口
        const oldModal = document.getElementById('yt-donation-details-modal');
        if (oldModal) {
            oldModal.remove();
        }
        
        // 重置状态
        AppState.resetStats();
        AppState.updateState({
            isScanning: false,
            totalProcessed: 0,
            scanInterval: null,
            scanStartTime: null,
            scanCount: 0,
            processedCommentIds: new Set()
        });
    }
    
    // 页面加载完成后执行初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 
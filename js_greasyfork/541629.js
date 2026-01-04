// ==UserScript==
// @name         NodeSeek抽奖提醒助手
// @namespace    https://nodeseek.com/
// @version      0.6
// @description  在NodeSeek论坛方便地管理抽奖活动并获取开奖提醒
// @author       luofengyuan
// @match        https://nodeseek.com/*
// @match        https://www.nodeseek.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @license      GPLV3

// @downloadURL https://update.greasyfork.org/scripts/541629/NodeSeek%E6%8A%BD%E5%A5%96%E6%8F%90%E9%86%92%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/541629/NodeSeek%E6%8A%BD%E5%A5%96%E6%8F%90%E9%86%92%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 用户配置 =====
    // 请在这里设置你的NodeSeek用户ID（从个人主页链接中获取，如 /space/11723 中的 11723）
    const USER_ID = '11723'; // 请修改为你的实际用户ID

    // ===== 核心功能 =====

    // URL标准化函数 - 用于统一URL格式进行比较
    function normalizeUrl(url) {
        try {
            // 创建URL对象进行标准化
            const urlObj = new URL(url);

            // 统一协议为https
            urlObj.protocol = 'https:';

            // 统一域名（移除www前缀，统一为www.nodeseek.com）
            if (urlObj.hostname === 'nodeseek.com') {
                urlObj.hostname = 'www.nodeseek.com';
            }

            // 移除末尾斜杠
            if (urlObj.pathname.endsWith('/') && urlObj.pathname.length > 1) {
                urlObj.pathname = urlObj.pathname.slice(0, -1);
            }

            // 移除hash部分
            urlObj.hash = '';

            // 返回标准化的URL
            return urlObj.toString();
        } catch (error) {
            console.error('URL标准化失败:', error);
            // 如果标准化失败，返回原URL
            return url;
        }
    }

    // 防抖函数
    function debounce(func, wait) {
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

    // 样式定义 - 简化为小圆点系统
    const styles = `
        /* 小圆点指示器 */
        #lottery-dot {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 9999;
            border: 2px solid #ccc;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        /* 圆点状态颜色 */
        #lottery-dot.default {
            background-color: white;
            border-color: #ccc;
        }

        #lottery-dot.won {
            background-color: #4caf50;
            border-color: #388e3c;
        }

        #lottery-dot.found {
            background-color: #ffd700;
            border-color: #ffb300;
            animation: pulse 2s infinite;
        }

        #lottery-dot.added {
            background-color: #ff4444;
            border-color: #cc0000;
        }

        /* 脉动动画 */
        @keyframes pulse {
            0% { transform: translateY(-50%) scale(1); }
            50% { transform: translateY(-50%) scale(1.1); }
            100% { transform: translateY(-50%) scale(1); }
        }

        /* 简化的管理器 */
        #lottery-manager {
            position: fixed;
            right: 50px;
            top: 50%;
            transform: translateY(-50%);
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            width: 350px;
            max-height: 400px;
            z-index: 10000;
            font-size: 14px;
            display: none;
        }

        #lottery-manager.show {
            display: block;
        }

        .lottery-manager-header {
            background: #f8f9fa;
            padding: 12px 15px;
            border-radius: 8px 8px 0 0;
            font-weight: bold;
            color: #333;
            border-bottom: 1px solid #eee;
        }

        .lottery-stats {
            font-size: 12px;
            font-weight: normal;
            color: #666;
            margin-top: 5px;
            display: flex;
            gap: 15px;
        }

        .lottery-stats .stat-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .lottery-stats .win-rate {
            color: #4caf50;
            font-weight: bold;
        }

        .refresh-btn {
            background: #4caf50;
            color: white;
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            margin-left: 10px;
            transition: background-color 0.2s;
        }

        .refresh-btn:hover {
            background: #388e3c;
        }

        .clear-all-btn {
            background: #ff4444;
            color: white;
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            margin-left: 10px;
            transition: background-color 0.2s;
        }

        .clear-all-btn:hover {
            background: #cc0000;
        }

        .lottery-manager-content {
            padding: 15px;
            max-height: 300px;
            overflow-y: auto;
        }

        .lottery-item {
            padding: 10px;
            border: 1px solid #eee;
            border-radius: 6px;
            margin-bottom: 10px;
            background: #f9f9f9;
        }

        .lottery-item.won {
            background: #e8f5e9;
            border-color: #4caf50;
        }

        .lottery-title {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }

        .lottery-won-badge {
            background: #4caf50;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            margin-left: 10px;
        }

        .lottery-participated-tag {
            background-color: #e8f5e9;
            color: #388e3c;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.8em;
            margin-left: 8px;
            font-weight: bold;
        }
    `;

    // 添加样式
    GM_addStyle(styles);


    // 创建小圆点UI系统
    function createDotUI() {
        // 创建小圆点
        const dot = document.createElement('div');
        dot.id = 'lottery-dot';
        dot.className = 'default';
        document.body.appendChild(dot);

        // 创建简化的管理器
        const manager = document.createElement('div');
        manager.id = 'lottery-manager';
        manager.innerHTML = `
            <div class="lottery-manager-header">
                中奖抽奖列表
                <div class="lottery-stats"></div>
            </div>
            <div class="lottery-manager-content">
                <div class="lottery-list"></div>
            </div>
        `;
        document.body.appendChild(manager);

        // 绑定圆点点击事件
        dot.addEventListener('click', () => {
            if (dot.classList.contains('found')) {
                // 黄色状态：添加当前页面抽奖
                addCurrentPageLottery();
            } else if (dot.classList.contains('default') || dot.classList.contains('added') || dot.classList.contains('won')) {
                // 白色、红色或绿色状态：显示/隐藏管理器
                manager.classList.toggle('show');
            }
        });

        // 点击管理器外部关闭
        document.addEventListener('click', (e) => {
            if (!manager.contains(e.target) && !dot.contains(e.target)) {
                manager.classList.remove('show');
            }
        });

        return { dot, manager };
    }

    // 检测当前页面是否有抽奖链接
    function detectLotteryOnCurrentPage() {
        // 检查页面中是否有抽奖链接
        const lotteryLinks = document.querySelectorAll('a[href*="/lucky?"], a[href*="nodeseek.com/lucky?"]');
        return lotteryLinks.length > 0;
    }

    // 更新圆点状态并检查中奖状态
    async function updateDotStatus() {
        const dot = document.getElementById('lottery-dot');
        if (!dot) return;

        // 开始更新圆点状态和检查中奖状态

        // 首先清理过期记录
        const hasCleanedExpired = cleanExpiredLotteries();
        if (hasCleanedExpired) {
            console.log('✅ 已清理过期抽奖记录');
        }

        const currentUrl = normalizeUrl(window.location.href);
        let reminders = GM_getValue('lottery_reminders', []);
        const now = Date.now();
        let hasUpdates = false;

        // 检查所有任务的开奖时间和中奖状态

        for (const reminder of reminders) {
            // 检查是否有开奖时间
            if (!reminder.drawTime) {
                console.log(`⏰ 跳过无开奖时间的任务: ${reminder.title}`);
                continue;
            }

            // 检查是否已开奖
            const isDrawn = reminder.drawTime <= now;

            // 简化任务状态检查信息
            if (!reminder.checked && isDrawn) {
                console.log(`🔍 检查任务: ${reminder.title}`);
            }

            // 如果已开奖且未检查过，进行中奖判断
            if (isDrawn && !reminder.checked && reminder.luckyUrl) {
                console.log(`🔍 开始检查中奖状态: ${reminder.title}`);

                try {
                    const luckyPageHtml = await fetchLuckyPage(reminder.luckyUrl);
                    const winnerIds = parseWinnerIds(luckyPageHtml);

                    // 简化的中奖判断信息
                    console.log(`🎯 中奖ID列表: [${winnerIds.join(', ')}]`);
                    console.log(`🎯 当前用户ID: ${USER_ID}`);

                    // 检查用户是否中奖 - 使用多种比较方式
                    const isWonStrict = winnerIds.includes(USER_ID);
                    const isWonLoose = winnerIds.some(id => id == USER_ID);
                    const isWonString = winnerIds.some(id => String(id) === String(USER_ID));

                    // 使用最宽松的比较方式
                    const isWon = isWonStrict || isWonLoose || isWonString;

                    // 更新中奖状态
                    reminder.isWon = isWon;
                    reminder.checked = true;
                    hasUpdates = true;

                    // 更新独立统计数据（只在首次检查时更新）
                    if (!reminder.statsUpdated) {
                        updateIndependentStats(isWon);
                        reminder.statsUpdated = true; // 标记已更新统计，避免重复计算
                    }

                    console.log(`🎉 最终中奖判断结果: ${reminder.title} - ${isWon ? '🎊 中奖了！' : '😔 未中奖'}`);

                } catch (error) {
                    console.error(`❌ 检查中奖状态失败: ${reminder.title}`, error);
                    // 标记为已检查，避免重复检查
                    reminder.checked = true;
                    hasUpdates = true;
                }
            }
        }

        // 如果有更新，保存数据并刷新显示
        if (hasUpdates || hasCleanedExpired) {
            GM_setValue('lottery_reminders', reminders);
            refreshLotteryList();
            console.log('💾 已保存更新的抽奖数据');
        }

        // 检查当前页面是否有有效的抽奖链接
        let hasValidLotteryOnPage = false;
        let isCurrentPageAdded = false;

        // 先简单检测是否可能有抽奖链接
        const hasLotteryOnPage = detectLotteryOnCurrentPage();

        if (hasLotteryOnPage) {
            try {
                // 获取当前页面的抽奖信息
                const postHtml = await fetchPostFirstPage(currentUrl);
                const luckyUrl = extractLuckyUrl(postHtml);

                if (luckyUrl) {
                    // 只有找到有效抽奖链接才设置为true
                    hasValidLotteryOnPage = true;

                    const drawTime = getLuckyPageDrawTime(luckyUrl);
                    const currentDrawTime = drawTime ? drawTime.getTime() : null;

                    // 检查是否存在相同帖子URL + 相同开奖时间的记录
                    isCurrentPageAdded = reminders.some(r =>
                        normalizeUrl(r.postUrl) === currentUrl &&
                        r.drawTime === currentDrawTime
                    );

                    // 调试日志
                    if (isCurrentPageAdded) {
                        console.log('🔴 检测到已添加的抽奖:', currentUrl, '开奖时间:', currentDrawTime);
                    } else {
                        console.log('🟡 检测到有效抽奖链接:', luckyUrl);
                    }
                } else {
                    console.log('⚪ 页面有抽奖相关链接但未找到有效抽奖链接');
                }
            } catch (error) {
                console.error('❌ 检查页面抽奖状态失败:', error);
                // 出错时不显示黄色，保持默认状态
                hasValidLotteryOnPage = false;
            }
        }

        // 检查是否有中奖记录
        const hasWonLotteries = reminders.some(r => r.isWon);

        // 更新圆点状态
        let dotStatus = '';
        if (isCurrentPageAdded) {
            // 当前页面已添加相同开奖时间的抽奖 - 红色
            dot.className = 'added';
            dotStatus = '红色(已添加)';
        } else if (hasValidLotteryOnPage) {
            // 发现有效抽奖链接但未添加 - 黄色
            dot.className = 'found';
            dotStatus = '黄色(发现抽奖)';
        } else if (hasWonLotteries) {
            // 有中奖记录 - 绿色
            dot.className = 'won';
            dotStatus = '绿色(有中奖)';
        } else {
            // 默认状态 - 白色
            dot.className = 'default';
            dotStatus = '白色(默认)';
        }

        console.log(`🎨 圆点状态更新完成: ${dotStatus}`);
    }

    // 修改提醒数据结构
    function createReminderObject(postUrl, title) {
        return {
            postUrl: postUrl,
            luckyUrl: null,  // 抽奖链接
            title: title,
            drawTime: null,
            added: Date.now(),
            isWon: false,    // 是否中奖
            checked: false   // 是否已检查过中奖状态
        };
    }

    // 从页面内容中提取抽奖链接
    function extractLuckyUrl(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // 查找所有链接
        const allLinks = doc.querySelectorAll('a');

        // 遍历所有链接查找抽奖链接
        for (const link of allLinks) {
            const href = link.href || link.getAttribute('href') || '';

            // 处理各种可能的链接格式
            if (
                href.includes('/lucky?') ||           // 相对路径
                href.includes('nodeseek.com/lucky?')  // 完整路径
            ) {
                // 确保返回完整的URL
                if (href.startsWith('/')) {
                    return 'https://www.nodeseek.com' + href;
                }
                return href;
            }
        }

        // 如果在链接中没找到，尝试在文本中查找
        const textContent = doc.body.textContent;
        const luckyUrlPattern = /https?:\/\/(?:www\.)?nodeseek\.com\/lucky\?[^\s"')>]*/g;
        const matches = textContent.match(luckyUrlPattern);

        if (matches && matches.length > 0) {
            return matches[0];
        }

        // 输出调试信息
        console.log('页面中的所有链接:');
        allLinks.forEach(link => {
            console.log(link.href || link.getAttribute('href'));
        });

        return null;
    }

    // 从抽奖链接中获取开奖时间
    function getLuckyPageDrawTime(luckyUrl) {
        try {
            const url = new URL(luckyUrl);
            const timeParam = url.searchParams.get('time');
            if (timeParam) {
                const timestamp = parseInt(timeParam);
                if (!isNaN(timestamp)) {
                    return new Date(timestamp);
                }
            }
        } catch (error) {
            console.error('解析抽奖链接时间失败:', error);
        }
        return null;
    }

    // 获取帖子第一页链接
    function getFirstPageUrl(postUrl) {
        try {
            // 移除URL中的hash部分（如果有）
            const urlWithoutHash = postUrl.split('#')[0];

            // 匹配帖子ID和页码
            const match = urlWithoutHash.match(/post-(\d+)(?:-(\d+))?/);
            if (match) {
                const postId = match[1];
                // 始终返回第一页的URL
                return `https://www.nodeseek.com/post-${postId}-1`;
            }
        } catch (error) {
            console.error('处理帖子链接失败:', error);
        }
        return postUrl;
    }

    // 获取帖子第一页内容
    async function fetchPostFirstPage(postUrl) {
        return new Promise((resolve, reject) => {
            const firstPageUrl = getFirstPageUrl(postUrl);
            console.log('获取帖子页面:', firstPageUrl);

            GM_xmlhttpRequest({
                method: 'GET',
                url: firstPageUrl,
                onload: response => {
                    console.log('帖子页面获取状态:', response.status);
                    if (response.status === 200) {
                        resolve(response.responseText);
                    } else {
                        reject(new Error(`获取帖子页面失败: ${response.status}`));
                    }
                },
                onerror: (error) => {
                    console.error('获取帖子页面错误:', error);
                    reject(error);
                }
            });
        });
    }

    // 获取抽奖页面内容 - 支持动态加载的Vue.js页面
    async function fetchLuckyPage(luckyUrl) {
        console.log('🌐 开始获取抽奖页面:', luckyUrl);

        // 方法1: 尝试直接在当前页面打开抽奖链接获取动态内容
        return new Promise((resolve, reject) => {
            // 创建一个隐藏的iframe来加载抽奖页面
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.width = '0';
            iframe.style.height = '0';
            document.body.appendChild(iframe);

            let timeoutId;
            let resolved = false;

            const cleanup = () => {
                if (timeoutId) clearTimeout(timeoutId);
                if (iframe.parentNode) {
                    iframe.parentNode.removeChild(iframe);
                }
            };

            const checkContent = () => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    const body = iframeDoc.body;

                    if (!body) {
                        console.log('⏳ iframe body未加载，继续等待...');
                        return false;
                    }

                    const loadingElement = body.querySelector('#lucky-mount img[src*="loading"]');
                    const hasRealContent = body.querySelector('.rank-row, div[class*="rank-row"], a[href*="/space/"]');
                    const hasJsonData = body.querySelector('#temp-script[type="application/json"]');

                    console.log('� iframe内容检查:');
                    console.log('   是否有loading图片:', !!loadingElement);
                    console.log('   是否有真实内容:', !!hasRealContent);
                    console.log('   是否有JSON数据:', !!hasJsonData);
                    console.log('   body内容长度:', body.innerHTML.length);

                    // 不再需要从iframe获取用户ID

                    // 检查是否内容已加载完成：没有loading图片且(有真实内容或有JSON数据)
                    const contentReady = !loadingElement && (hasRealContent || hasJsonData);
                    const timeoutReady = body.innerHTML.length > 1000; // 超时备用条件

                    if (contentReady || timeoutReady) {
                        console.log('✅ 检测到动态内容已加载完成');
                        if (!resolved) {
                            resolved = true;
                            cleanup();
                            resolve(iframeDoc.documentElement.outerHTML);
                        }
                        return true;
                    }

                    return false;
                } catch (error) {
                    console.log('⚠️ 检查iframe内容时出错:', error.message);
                    return false;
                }
            };

            iframe.onload = () => {
                console.log('📡 iframe加载完成，开始等待动态内容...');

                // 每1秒检查一次内容，减少频率
                const checkInterval = setInterval(() => {
                    if (checkContent()) {
                        clearInterval(checkInterval);
                    }
                }, 1000);

                // 10秒超时
                timeoutId = setTimeout(() => {
                    clearInterval(checkInterval);
                    if (!resolved) {
                        console.log('⏰ 等待动态内容超时，使用当前内容');
                        resolved = true;
                        try {
                            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                            cleanup();
                            resolve(iframeDoc.documentElement.outerHTML);
                        } catch (error) {
                            cleanup();
                            reject(new Error('获取iframe内容失败: ' + error.message));
                        }
                    }
                }, 10000);
            };

            iframe.onerror = () => {
                console.error('❌ iframe加载失败');
                cleanup();
                reject(new Error('iframe加载失败'));
            };

            // 开始加载页面
            iframe.src = luckyUrl;
        });
    }

    // 解析中奖名单，提取中奖用户ID
    function parseWinnerIds(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // 查找中奖名单区域
        let winnerSection = doc.querySelector('div[data-v-23190e9e][style*="padding: 0px 20px 20px"]');

        if (!winnerSection) {
            winnerSection = doc.querySelector('div[style*="padding: 0px 20px 20px"]');
        }

        if (!winnerSection) {
            const rankRows = doc.querySelectorAll('.rank-row, div[class*="rank-row"]');
            if (rankRows.length > 0) {
                winnerSection = rankRows[0].parentElement;
            }
        }

        if (!winnerSection) {
            const allDivs = doc.querySelectorAll('div');
            for (let div of allDivs) {
                const text = div.textContent || '';
                if (text.includes('中奖名单') || text.includes('中奖') || text.includes('获奖') || text.includes('winner')) {
                    winnerSection = div;
                    break;
                }
            }
        }

        if (!winnerSection) {
            // 尝试解析页面中的JSON数据获取中奖信息
            const scriptElement = doc.querySelector('#temp-script[type="application/json"]');

            if (scriptElement) {
                try {
                    const base64Data = scriptElement.textContent;
                    const jsonData = JSON.parse(atob(base64Data));

                    // 检查是否有中奖相关数据
                    if (jsonData.winners || jsonData.luckyUsers || jsonData.result) {
                        const winners = jsonData.winners || jsonData.luckyUsers || jsonData.result || [];
                        const jsonIds = [];
                        winners.forEach(winner => {
                            if (winner.member_id || winner.id || winner.user_id) {
                                const id = String(winner.member_id || winner.id || winner.user_id);
                                jsonIds.push(id);
                            }
                        });

                        if (jsonIds.length > 0) {
                            return jsonIds;
                        }
                    }
                } catch (error) {
                    // 静默处理JSON解析错误
                }
            }

            // 尝试查找所有包含/space/链接的元素
            const allSpaceLinks = doc.querySelectorAll('a[href*="/space/"]');
            if (allSpaceLinks.length > 0) {
                const directIds = [];
                allSpaceLinks.forEach((link) => {
                    const href = link.getAttribute('href');
                    const match = href.match(/\/space\/(\d+)/);
                    if (match) {
                        directIds.push(match[1]);
                    }
                });
                if (directIds.length > 0) {
                    return directIds;
                }
            }

            return [];
        }

        // 提取所有中奖用户的ID
        const winnerIds = [];

        // 方法1: 查找/space/链接
        const winnerLinks = winnerSection.querySelectorAll('a[href*="/space/"]');
        winnerLinks.forEach((link) => {
            const href = link.getAttribute('href');
            const match = href.match(/\/space\/(\d+)/);
            if (match) {
                winnerIds.push(match[1]);
            }
        });

        // 方法2: 如果没找到链接，尝试从头像src中提取
        if (winnerIds.length === 0) {
            const avatarImgs = winnerSection.querySelectorAll('img[src*="/avatar/"]');
            avatarImgs.forEach((img) => {
                const src = img.getAttribute('src');
                const match = src.match(/\/avatar\/(\d+)\.png/);
                if (match) {
                    winnerIds.push(match[1]);
                }
            });
        }

        // 方法3: 如果还是没找到，尝试正则表达式匹配整个HTML
        if (winnerIds.length === 0) {
            const spaceRegex = /\/space\/(\d+)/g;
            const avatarRegex = /\/avatar\/(\d+)\.png/g;
            let match;
            const foundIds = new Set();

            while ((match = spaceRegex.exec(winnerSection.innerHTML)) !== null) {
                foundIds.add(match[1]);
            }

            while ((match = avatarRegex.exec(winnerSection.innerHTML)) !== null) {
                foundIds.add(match[1]);
            }

            winnerIds.push(...Array.from(foundIds));
        }

        return winnerIds;
    }

    // 清理过期抽奖记录
    function cleanExpiredLotteries() {
        const reminders = GM_getValue('lottery_reminders', []);
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000; // 1天的毫秒数

        // 过滤掉开奖超过1天的记录
        const filteredReminders = reminders.filter(reminder => {
            if (!reminder.drawTime) return true; // 保留没有开奖时间的记录

            const timeSinceDraw = now - reminder.drawTime;
            return timeSinceDraw <= oneDayMs; // 只保留开奖1天内的记录
        });

        // 如果有记录被删除，更新存储
        if (filteredReminders.length !== reminders.length) {
            console.log(`清理了 ${reminders.length - filteredReminders.length} 条过期抽奖记录`);
            GM_setValue('lottery_reminders', filteredReminders);
            return true;
        }

        return false;
    }

    // 手动刷新状态
    async function manualRefresh() {
        console.log('🔄 手动刷新触发...');
        try {
            await updateDotStatus();
            console.log('✅ 手动刷新完成');
        } catch (error) {
            console.error('❌ 手动刷新失败:', error);
        }
    }

    // 清理所有抽奖记录
    function clearAllLotteries() {
        const clearTasks = confirm('确定要清理所有抽奖记录吗？此操作不可恢复！');
        if (clearTasks) {
            GM_setValue('lottery_reminders', []);

            // 询问是否同时重置统计数据
            const clearStats = confirm('是否同时重置统计数据（总参与数、中奖数、中奖率）？\n\n点击"确定"重置统计数据\n点击"取消"保留统计数据');
            if (clearStats) {
                resetIndependentStats();
                console.log('已清理所有抽奖记录并重置统计数据');
            } else {
                console.log('已清理所有抽奖记录，统计数据已保留');
            }

            refreshLotteryList();
            updateDotStatus().catch(console.error);
        }
    }

    // 检查中奖状态 (已集成到updateDotStatus中，保留此函数用于向后兼容)
    async function checkWinningStatus() {
        console.log('⚠️  checkWinningStatus() 已弃用，中奖检查逻辑已集成到 updateDotStatus() 中');
        // 直接调用updateDotStatus来执行检查
        await updateDotStatus();
    }

    // ===== 独立统计存储管理 =====

    // 获取独立统计数据
    function getIndependentStats() {
        return GM_getValue('lottery_stats', {
            total: 0,    // 总参与数
            won: 0,      // 中奖数
            rate: '0.0'  // 中奖率
        });
    }

    // 更新独立统计数据
    function updateIndependentStats(isWon) {
        const stats = getIndependentStats();

        // 增加总参与数
        stats.total += 1;

        // 如果中奖，增加中奖数
        if (isWon) {
            stats.won += 1;
        }

        // 重新计算中奖率
        stats.rate = stats.total > 0 ? ((stats.won / stats.total) * 100).toFixed(1) : '0.0';

        // 保存到独立存储
        GM_setValue('lottery_stats', stats);

        console.log(`📊 更新独立统计: 总参与${stats.total}, 中奖${stats.won}, 中奖率${stats.rate}%`);

        return stats;
    }

    // 计算中奖统计信息（使用独立存储）
    function calculateWinningStats() {
        return getIndependentStats();
    }

    // 重置独立统计数据
    function resetIndependentStats() {
        const defaultStats = {
            total: 0,
            won: 0,
            rate: '0.0'
        };
        GM_setValue('lottery_stats', defaultStats);
        console.log('🔄 已重置独立统计数据');
        return defaultStats;
    }

    // 数据迁移：将现有任务数据迁移到独立统计（仅执行一次）
    function migrateToIndependentStats() {
        // 检查是否已经迁移过
        const migrated = GM_getValue('stats_migrated', false);
        if (migrated) {
            return; // 已经迁移过，跳过
        }

        console.log('🔄 开始迁移现有数据到独立统计...');

        const reminders = GM_getValue('lottery_reminders', []);
        const checkedReminders = reminders.filter(r => r.checked);

        if (checkedReminders.length > 0) {
            const totalCount = checkedReminders.length;
            const wonCount = checkedReminders.filter(r => r.isWon).length;
            const winRate = totalCount > 0 ? ((wonCount / totalCount) * 100).toFixed(1) : '0.0';

            // 设置独立统计数据
            const stats = {
                total: totalCount,
                won: wonCount,
                rate: winRate
            };

            GM_setValue('lottery_stats', stats);
            console.log(`✅ 数据迁移完成: 总参与${totalCount}, 中奖${wonCount}, 中奖率${winRate}%`);

            // 标记现有任务为已更新统计，避免重复计算
            checkedReminders.forEach(reminder => {
                reminder.statsUpdated = true;
            });
            GM_setValue('lottery_reminders', reminders);
        } else {
            console.log('📊 没有现有数据需要迁移');
        }

        // 标记为已迁移
        GM_setValue('stats_migrated', true);
    }



    // 添加当前页面抽奖
    async function addCurrentPageLottery() {
        const url = normalizeUrl(window.location.href);
        const title = document.title.replace(' - NodeSeek', '') || '抽奖活动';

        // 获取现有提醒列表
        let reminders = GM_getValue('lottery_reminders', []);

        // 创建新的提醒对象
        const reminder = createReminderObject(url, title);

        try {
            // 获取帖子第一页内容
            const postHtml = await fetchPostFirstPage(url);
            const luckyUrl = extractLuckyUrl(postHtml);

            if (luckyUrl) {
                reminder.luckyUrl = luckyUrl;
                // 从抽奖链接中获取开奖时间
                const drawTime = getLuckyPageDrawTime(luckyUrl);
                if (drawTime) {
                    reminder.drawTime = drawTime.getTime();
                } else {
                    console.log('未能从抽奖链接获取开奖时间');
                }

                // 增强的重复检查：同一帖子 + 同一开奖时间 = 同一抽奖
                const existingReminder = reminders.find(r =>
                    normalizeUrl(r.postUrl) === url &&
                    r.drawTime === reminder.drawTime
                );
                if (existingReminder) {
                    const status = existingReminder.isWon ? '已中奖' :
                                  existingReminder.checked ? '未中奖' : '待开奖';
                    alert(`该抽奖已经添加过了！\n状态：${status}\n标题：${existingReminder.title}`);
                    return;
                }
            } else {
                console.log('未在帖子中找到抽奖链接');
            }

            // 添加新提醒
            reminders.push(reminder);
            GM_setValue('lottery_reminders', reminders);

            // 刷新列表
            refreshLotteryList();

            // 更新圆点状态
            updateDotStatus().catch(console.error);

            // 不再设置通知提醒

            if (!reminder.luckyUrl) {
                alert('添加成功，但未找到抽奖链接！');
            } else if (!reminder.drawTime) {
                alert('添加成功，但未找到开奖时间！请手动查看抽奖页面。');
            } else {
                alert('添加成功！');
            }
        } catch (error) {
            console.error('添加抽奖失败:', error);
            alert('添加失败，请重试！');
        }
    }



    // 刷新抽奖列表显示 - 只显示中奖的抽奖
    function refreshLotteryList() {
        const listContainer = document.querySelector('.lottery-list');
        const statsContainer = document.querySelector('.lottery-stats');
        const reminders = GM_getValue('lottery_reminders', []);

        // 更新统计信息
        if (statsContainer) {
            const stats = calculateWinningStats();
            statsContainer.innerHTML = `
                <div class="stat-item">总参与: ${stats.total}</div>
                <div class="stat-item">中奖: ${stats.won}</div>
                <div class="stat-item">中奖率: <span class="win-rate">${stats.rate}%</span></div>
                <button class="refresh-btn">手动刷新</button>
                <button class="clear-all-btn">清理所有</button>
            `;

            // 绑定手动刷新按钮事件
            const refreshBtn = statsContainer.querySelector('.refresh-btn');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', manualRefresh);
            }

            // 绑定清理按钮事件
            const clearBtn = statsContainer.querySelector('.clear-all-btn');
            if (clearBtn) {
                clearBtn.addEventListener('click', clearAllLotteries);
            }
        }

        // 只显示中奖的抽奖
        const wonReminders = reminders.filter(reminder => reminder.isWon);

        if (wonReminders.length === 0) {
            listContainer.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">暂无中奖记录</div>';
            return;
        }

        // 按开奖时间排序
        const sortedReminders = [...wonReminders].sort((a, b) => {
            if (!a.drawTime) return 1;
            if (!b.drawTime) return -1;
            return b.drawTime - a.drawTime; // 最新的在前面
        });

        listContainer.innerHTML = sortedReminders.map(reminder => `
            <div class="lottery-item won">
                <div class="lottery-title">
                    ${reminder.title}
                    <span class="lottery-won-badge">中奖</span>
                </div>
                <div class="lottery-links">
                    <div>帖子链接: <a href="${reminder.postUrl}" target="_blank">查看帖子</a></div>
                    ${reminder.luckyUrl ? `<div>抽奖链接: <a href="${reminder.luckyUrl}" target="_blank">查看开奖结果</a></div>` : ''}
                </div>
                <div class="lottery-time">
                    ${reminder.drawTime ? `开奖时间: ${new Date(reminder.drawTime).toLocaleString('zh-CN')}` : '开奖时间未知'}
                </div>
            </div>
        `).join('');
    }

    // 计算倒计时
    function getCountdown(targetDate) {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) return '已开奖';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        let countdown = '';
        if (days > 0) countdown += `${days}天`;
        if (hours > 0) countdown += `${hours}小时`;
        countdown += `${minutes}分钟`;

        return countdown;
    }

    // 在主页标记已参加的抽奖
    function markParticipatedLotteries() {
        const reminders = GM_getValue('lottery_reminders', []);
        if (reminders.length === 0) return;

        // 从提醒中提取帖子ID
        const reminderPostIds = new Set(reminders.map(r => {
            const match = r.postUrl.match(/post-(\d+)/);
            return match ? match[1] : null;
        }).filter(id => id));

        if (reminderPostIds.size === 0) return;

        // 查找页面上所有的帖子链接, 使用属性选择器以提高兼容性
        document.querySelectorAll('a[href*="/post-"]').forEach(link => {
            // 排除管理器内部的链接
            if (link.closest('#lottery-manager')) {
                return;
            }

            // 排除指向评论的链接
            if (link.href.includes('#')) {
                return;
            }

            const postUrl = link.href;
            const match = postUrl.match(/post-(\d+)/);
            if (!match) return;

            const postId = match[1];

            // 检查此帖子是否已添加
            if (reminderPostIds.has(postId)) {
                // 避免重复添加标签, 检查后面是否已经有标签了
                if (link.nextElementSibling && link.nextElementSibling.classList.contains('lottery-participated-tag')) return;

                // 简单的启发式方法，判断是否是主标题链接 (通常标题链接文本较长, 且不是纯数字的分页链接)
                if (link.textContent.trim().length < 5 || /^\d+$/.test(link.textContent.trim())) return;

                const tag = document.createElement('span');
                tag.textContent = '已参加抽奖';
                tag.className = 'lottery-participated-tag';

                // 插入标签
                link.insertAdjacentElement('afterend', tag);
            }
        });
    }

    // 定期更新倒计时显示
    function updateCountdowns() {
        // 更新管理器中的倒计时
        document.querySelectorAll('.lottery-item').forEach(item => {
            const timeElement = item.querySelector('.lottery-time');
            const drawTimeStr = timeElement.textContent.match(/开奖时间: (.*?)(?=\(|$)/)[1].trim();
            const drawTime = new Date(drawTimeStr);

            const countdownElement = item.querySelector('.lottery-countdown');
            countdownElement.textContent = `(${getCountdown(drawTime)})`;
        });
    }

    // 初始化
    function init() {
        console.log('🚀 NodeSeek抽奖助手初始化开始...');

        // 数据迁移（仅首次运行）
        migrateToIndependentStats();

        // 显示配置的用户ID
        console.log(`👤 配置的用户ID: ${USER_ID}`);
        if (USER_ID === '11723') {
            console.log('💡 提示: 请确认用户ID是否正确');
        }

        // 显示独立统计信息
        const stats = getIndependentStats();
        console.log(`📊 历史统计数据: 总参与${stats.total}次, 中奖${stats.won}次, 中奖率${stats.rate}%`);

        // 创建小圆点UI系统
        createDotUI();
        refreshLotteryList();

        // 页面刷新时不自动检查，减少服务器负载
        console.log('🔄 页面刷新完成，等待定时器或手动刷新...');

        // 首次加载时标记，并设置观察器以处理动态加载
        markParticipatedLotteries();
        const debouncedMarker = debounce(markParticipatedLotteries, 1000);
        const debouncedUpdateDot = debounce(() => {
            console.log('🔄 页面内容变化，重新检查任务状态...');
            updateDotStatus().catch(console.error);
        }, 2000);
        const observer = new MutationObserver((mutations) => {
            // 只在有意义的DOM变化时触发
            const hasSignificantChange = mutations.some(mutation =>
                mutation.type === 'childList' &&
                mutation.addedNodes.length > 0 &&
                Array.from(mutation.addedNodes).some(node =>
                    node.nodeType === Node.ELEMENT_NODE &&
                    (node.tagName === 'A' || node.querySelector('a'))
                )
            );

            if (hasSignificantChange) {
                debouncedMarker();
                debouncedUpdateDot(); // 只在有链接相关变化时更新
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false, // 不监听属性变化
            characterData: false // 不监听文本变化
        });

        // 定时器检查机制（默认5分钟）
        setInterval(() => {
            console.log('⏰ 定时器触发，检查任务状态...');
            updateDotStatus().catch(console.error);
        }, 5 * 60 * 1000);

        // 每分钟更新一次倒计时
        setInterval(updateCountdowns, 60000);

        console.log('✅ NodeSeek抽奖助手初始化完成');
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
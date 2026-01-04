// ==UserScript==
// @name         NodeSeek抽奖提醒助手
// @namespace    https://nodeseek.com/
// @version      0.4
// @description  在NodeSeek论坛方便地管理抽奖活动并获取开奖提醒
// @author       Your name
// @match        https://nodeseek.com/*
// @match        https://www.nodeseek.com/*
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/541117/NodeSeek%E6%8A%BD%E5%A5%96%E6%8F%90%E9%86%92%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/541117/NodeSeek%E6%8A%BD%E5%A5%96%E6%8F%90%E9%86%92%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

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

    // 样式定义
    const styles = `
        .lottery-reminder {
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid #e3e3e3;
            border-radius: 4px;
            padding: 8px 12px;
            margin: 10px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .lottery-title {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        .lottery-time {
            color: #666;
            font-size: 0.9em;
        }
        .lottery-countdown {
            color: #ff6b6b;
            font-weight: bold;
        }
        #lottery-manager {
            position: fixed;
            right: 20px;
            bottom: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            width: 300px; /* Base width */
            z-index: 9999;
            font-size: 14px;
            transform-origin: bottom; /* Set scale origin to bottom-center */
        }
        #lottery-manager.minimized {
            width: auto;
            height: auto;
            transform: none !important; /* Do not scale when minimized */
        }
        .lottery-manager-header {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 8px 8px 0 0;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #333;
        }
        .lottery-manager-content {
            padding: 15px;
            max-height: 400px;
            overflow-y: auto;
        }
        .lottery-manager-footer {
            padding: 10px;
            border-top: 1px solid #eee;
            text-align: right;
        }
        .lottery-list {
            margin-bottom: 15px;
        }
        .lottery-item {
            padding: 8px;
            border: 1px solid #eee;
            border-radius: 4px;
            margin-bottom: 8px;
        }
        .lottery-item:hover {
            background: #f8f9fa;
        }
        .lottery-delete {
            color: #dc3545;
            cursor: pointer;
            float: right;
        }
        #lottery-manager .btn {
            padding: 6px 12px;
            border-radius: 4px;
            border: 1px solid #ddd;
            background: #fff;
            cursor: pointer;
            margin-left: 8px;
            color: #333;
        }
        #lottery-manager .btn-primary {
            background: #007bff;
            color: white;
            border-color: #0056b3;
        }
        #lottery-manager .btn-toggle {
            padding: 4px 8px;
            font-size: 12px;
        }
        #lottery-manager .btn-add-current {
            width: 100%;
            margin: 0 0 10px 0;
            background: #28a745;
            color: white;
            border-color: #28a745;
        }
        #lottery-manager.minimized .lottery-manager-content,
        #lottery-manager.minimized .lottery-manager-footer {
            display: none;
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


    // 创建管理器UI
    function createManagerUI() {
        const manager = document.createElement('div');
        manager.id = 'lottery-manager';

        // 获取保存的位置
        const savedLeft = GM_getValue('ui_pos_left');
        const savedTop = GM_getValue('ui_pos_top');
        if (savedLeft && savedTop) {
            manager.style.left = savedLeft;
            manager.style.top = savedTop;
            manager.style.right = 'auto';
            manager.style.bottom = 'auto';
        }

        // 获取保存的缩放比例
        const savedScale = GM_getValue('ui_scale', 1);
        manager.style.transform = `scale(${savedScale})`;

        // 获取默认状态设置
        const isMinimized = GM_getValue('ui_minimized', true);
        if (isMinimized) {
            manager.classList.add('minimized');
        }

        manager.innerHTML = `
            <div class="lottery-manager-header">
                <span>抽奖提醒管理器</span>
                <button class="btn btn-toggle">${isMinimized ? '展开' : '最小化'}</button>
            </div>
            <div class="lottery-manager-content">
                <button class="btn btn-add-current">添加当前页面抽奖</button>
                <div class="lottery-list"></div>
            </div>
            <div class="lottery-manager-footer">
                <div class="settings">
                    <label>
                        <input type="checkbox" id="default-minimized" ${isMinimized ? 'checked' : ''}>
                        默认最小化
                    </label>
                    <div id="scale-control" style="margin-left: 10px; font-size: 12px; display: flex; align-items: center; gap: 5px;">
                        缩放: <input type="range" id="scale-slider" min="0.5" max="1.5" step="0.05" style="width: 80px;">
                        <span id="scale-value">100%</span>
                    </div>
                </div>
                <div>
                    <button class="btn" id="reset-btn">重置位置</button>
                    <button class="btn" id="refresh-btn">刷新列表</button>
                </div>
            </div>
        `;
        document.body.appendChild(manager);

        // 添加设置相关的样式
        GM_addStyle(`
            #lottery-manager .lottery-manager-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
            }
            #lottery-manager .settings {
                display: flex;
                align-items: center;
            }
            #lottery-manager .settings label {
                display: flex;
                align-items: center;
                gap: 5px;
                cursor: pointer;
                color: #333;
            }
            #lottery-manager .settings input[type="checkbox"] {
                cursor: pointer;
            }
        `);

        // 使管理器可拖动
        makeDraggable(manager);

        // 绑定事件
        const toggleBtn = manager.querySelector('.btn-toggle');
        toggleBtn.addEventListener('click', () => {
            manager.classList.toggle('minimized');
            toggleBtn.textContent = manager.classList.contains('minimized') ? '展开' : '最小化';
        });

        // 绑定设置事件
        const defaultMinimizedCheckbox = manager.querySelector('#default-minimized');
        defaultMinimizedCheckbox.addEventListener('change', (e) => {
            GM_setValue('ui_minimized', e.target.checked);
        });

        const addCurrentBtn = manager.querySelector('.btn-add-current');
        addCurrentBtn.addEventListener('click', addCurrentPageLottery);

        const refreshBtn = manager.querySelector('#refresh-btn');
        refreshBtn.addEventListener('click', refreshLotteryList);

        const resetBtn = manager.querySelector('#reset-btn');
        resetBtn.addEventListener('click', () => {
            GM_setValue('ui_pos_left', null);
            GM_setValue('ui_pos_top', null);
            GM_setValue('ui_scale', 1);
            alert('管理器位置和大小已重置，页面将刷新。');
            location.reload();
        });

        // 缩放控制逻辑
        const scaleSlider = manager.querySelector('#scale-slider');
        const scaleValueDisplay = manager.querySelector('#scale-value');

        scaleSlider.value = savedScale;
        scaleValueDisplay.textContent = `${Math.round(savedScale * 100)}%`;

        scaleSlider.addEventListener('input', () => {
            const newScale = scaleSlider.value;
            manager.style.transform = `scale(${newScale})`;
            scaleValueDisplay.textContent = `${Math.round(newScale * 100)}%`;
            GM_setValue('ui_scale', newScale);
        });

        return manager;
    }

    // 修改提醒数据结构
    function createReminderObject(postUrl, title) {
        return {
            postUrl: postUrl,
            luckyUrl: null,  // 抽奖链接
            title: title,
            drawTime: null,
            added: Date.now()
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
    function getLuckyPageDrawTime(html, luckyUrl) {
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

    // 获取抽奖页面内容
    async function fetchLuckyPage(luckyUrl) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: luckyUrl,
                onload: response => resolve(response.responseText),
                onerror: reject
            });
        });
    }

    // 检查并设置临近开奖提醒
    function checkUpcomingDraws() {
        const reminders = GM_getValue('lottery_reminders', []);
        const now = Date.now();

        reminders.forEach(reminder => {
            if (!reminder.drawTime) return;

            const timeUntilDraw = reminder.drawTime - now;
            // 如果距离开奖时间不到1分钟且没有提醒过
            if (timeUntilDraw > 0 && timeUntilDraw <= 60000 && !reminder.nearDrawNotified) {
                // 标记为已提醒
                reminder.nearDrawNotified = true;
                GM_setValue('lottery_reminders', reminders);

                // 发送通知
                GM_notification({
                    title: '抽奖即将开奖',
                    text: `${reminder.title}\n还有不到1分钟就要开奖了！`,
                    timeout: 0, // 不自动关闭
                    onclick: () => {
                        // 点击通知时打开抽奖链接
                        if (reminder.luckyUrl) {
                            window.open(reminder.luckyUrl, '_blank');
                        }
                    }
                });
            }
        });
    }

    // 添加当前页面抽奖
    async function addCurrentPageLottery() {
        const url = window.location.href;
        const title = document.title.replace(' - NodeSeek', '') || '抽奖活动';

        // 获取现有提醒列表
        let reminders = GM_getValue('lottery_reminders', []);

        // 检查是否已经添加过
        if (reminders.some(r => r.postUrl === url)) {
            alert('该抽奖已经添加过了！');
            return;
        }

        // 创建新的提醒对象
        const reminder = createReminderObject(url, title);

        try {
            // 获取帖子第一页内容
            const postHtml = await fetchPostFirstPage(url);
            const luckyUrl = extractLuckyUrl(postHtml);

            if (luckyUrl) {
                reminder.luckyUrl = luckyUrl;
                // 从抽奖链接中获取开奖时间
                const drawTime = getLuckyPageDrawTime(null, luckyUrl);
                if (drawTime) {
                    reminder.drawTime = drawTime.getTime();
                } else {
                    console.log('未能从抽奖链接获取开奖时间');
                }
            } else {
                console.log('未在帖子中找到抽奖链接');
            }

            // 添加新提醒
            reminders.push(reminder);
            GM_setValue('lottery_reminders', reminders);

            // 刷新列表
            refreshLotteryList();

            // 设置提醒
            if (reminder.drawTime) {
                const timeUntilDraw = reminder.drawTime - Date.now();
                if (timeUntilDraw > 0) {
                    // 开奖提醒
                    setTimeout(() => {
                        GM_notification({
                            title: '抽奖开奖提醒',
                            text: `${title}\n已经开奖了！`,
                            timeout: 0, // 不自动关闭
                            onclick: () => {
                                // 点击通知时打开抽奖链接
                                if (reminder.luckyUrl) {
                                    window.open(reminder.luckyUrl, '_blank');
                                }
                            }
                        });
                    }, timeUntilDraw);
                }
            }

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

    // 使元素可拖动
    function makeDraggable(element) {
        const header = element.querySelector('.lottery-manager-header');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            // Do not drag if the element is minimized and scaled down
            if (element.classList.contains('minimized')) return;
            initialX = e.clientX - element.offsetLeft;
            initialY = e.clientY - element.offsetTop;
            isDragging = true;
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                // Calculate new theoretical position
                let newX = e.clientX - initialX;
                let newY = e.clientY - initialY;

                // Temporarily apply to calculate boundaries with getBoundingClientRect
                element.style.left = `${newX}px`;
                element.style.top = `${newY}px`;

                // Get visual dimensions and position
                const rect = element.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                // Check and correct boundaries
                if (rect.left < 0) {
                    newX -= rect.left;
                }
                if (rect.top < 0) {
                    newY -= rect.top;
                }
                if (rect.right > viewportWidth) {
                    newX -= (rect.right - viewportWidth);
                }
                if (rect.bottom > viewportHeight) {
                    newY -= (rect.bottom - viewportHeight);
                }

                // Apply the corrected position
                element.style.left = `${newX}px`;
                element.style.top = `${newY}px`;
                element.style.right = 'auto';
                element.style.bottom = 'auto';
            }
        }

        function dragEnd() {
            if (isDragging) {
                isDragging = false;
                // 保存位置
                GM_setValue('ui_pos_left', element.style.left);
                GM_setValue('ui_pos_top', element.style.top);
            }
        }
    }

    // 刷新抽奖列表显示
    function refreshLotteryList() {
        const listContainer = document.querySelector('.lottery-list');
        const reminders = GM_getValue('lottery_reminders', []);

        // 按开奖时间排序
        const sortedReminders = [...reminders].sort((a, b) => {
            // 如果没有开奖时间的放到最后
            if (!a.drawTime) return 1;
            if (!b.drawTime) return -1;
            return a.drawTime - b.drawTime;
        });

        listContainer.innerHTML = sortedReminders.map(reminder => `
            <div class="lottery-item">
                <span class="lottery-delete" data-url="${reminder.postUrl}">×</span>
                <div class="lottery-title">${reminder.title}</div>
                <div class="lottery-links">
                    <div>帖子链接: <a href="${reminder.postUrl}" target="_blank">${reminder.postUrl}</a></div>
                    ${reminder.luckyUrl ? `<div>抽奖链接: <a href="${reminder.luckyUrl}" target="_blank">${reminder.luckyUrl}</a></div>` : ''}
                </div>
                <div class="lottery-time">
                    ${reminder.drawTime ? `
                        开奖时间: ${new Date(reminder.drawTime).toLocaleString('zh-CN')}
                        <span class="lottery-countdown">(${getCountdown(new Date(reminder.drawTime))})</span>
                    ` : '未找到开奖时间'}
                </div>
            </div>
        `).join('');

        // 绑定删除事件
        document.querySelectorAll('.lottery-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const url = e.target.dataset.url;
                const reminders = GM_getValue('lottery_reminders', []);
                const newReminders = reminders.filter(r => r.postUrl !== url);
                GM_setValue('lottery_reminders', newReminders);
                refreshLotteryList();
            });
        });
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
        createManagerUI();
        refreshLotteryList();

        // 注册菜单命令
        GM_registerMenuCommand('重置管理器位置和大小', () => {
            GM_setValue('ui_pos_left', null);
            GM_setValue('ui_pos_top', null);
            GM_setValue('ui_scale', 1);
            alert('管理器位置和大小已重置，页面将刷新。');
            location.reload();
        });

        // 首次加载时标记，并设置观察器以处理动态加载
        markParticipatedLotteries();
        const debouncedMarker = debounce(markParticipatedLotteries, 200);
        const observer = new MutationObserver(debouncedMarker);
        observer.observe(document.body, { childList: true, subtree: true });

        // 每30秒检查一次临近开奖
        setInterval(checkUpcomingDraws, 30000);

        // 每分钟更新一次倒计时
        setInterval(updateCountdowns, 60000);
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
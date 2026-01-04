// ==UserScript==
// @name         Linux Do Sidebar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  An enhancement tool for linux.do
// @author       Reno, Unique, King-Huiwen-of-Qin
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @connect      connect.linux.do
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/515997/Linux%20Do%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/515997/Linux%20Do%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 按钮配置
    const BUTTON_CONFIG = {
        main: {
            id: 'main-button',
            icon: `<svg class="fa d-icon d-icon-bars svg-icon svg-string" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px;">
                <use href="#bars"></use>
            </svg>`,
            position: { bottom: '50px', right: '50px' }
        },
        sub: [
            { icon: '<svg class="fa d-icon d-icon-chart-line svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#chart-line"></use></svg>', action: 'trending' },
            { icon: '<svg class="fa d-icon d-icon-signal svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#signal"></use></svg>', action: 'connect' },
            { icon: '<svg class="fa d-icon d-icon-comments svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#comments"></use></svg>', action: 'chatroom' },
            { icon: '<svg class="fa d-icon d-icon-calculator svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#calculator"></use></svg>', action: 'summary' }
        ]
    };

    // 按钮管理类
    class ButtonManager {
        constructor(config) {
            this.config = config;
            this.mainButton = null;
            this.subButtons = [];
            this.isOpen = false;
            this.init();
        }

        init() {
            this.createMainButton();
            this.createSubButtons();
            this.bindEvents();
        }

        createMainButton() {
            this.mainButton = document.createElement('button');
            this.mainButton.id = this.config.main.id;
            this.mainButton.innerHTML = this.config.main.icon;
            document.body.appendChild(this.mainButton);
        }

        createSubButtons() {
            this.config.sub.forEach((btnConfig, index) => {
                const button = document.createElement('button');
                button.className = 'sub-button';
                button.innerHTML = btnConfig.icon;
                button.dataset.action = btnConfig.action;
                this.subButtons.push(button);
                document.body.appendChild(button);
            });
        }

        updateSubButtonsPosition() {
            const mainRect = this.mainButton.getBoundingClientRect();
            const mainCenterX = mainRect.left + mainRect.width / 2;
            const mainCenterY = mainRect.top + mainRect.height / 2;
            const radius = 60; // 子按钮分布半径

            this.subButtons.forEach((btn, index) => {
                const angle = ((index - 1.5) * 45) * (Math.PI / 180); // 转换为弧度
                const x = mainCenterX + radius * Math.cos(angle);
                const y = mainCenterY + radius * Math.sin(angle);

                btn.style.left = `${x - btn.offsetWidth / 2}px`;
                btn.style.top = `${y - btn.offsetHeight / 2}px`;
            });
        }

        toggleSubButtons() {
            this.isOpen = !this.isOpen;

            // 关闭所有弹窗
            if (!this.isOpen) {
                // 关闭热榜
                const trendingPanel = document.getElementById('trendingPanel');
                if (trendingPanel) {
                    trendingPanel.style.right = '-350px';
                }

                // 关闭等级详情
                const summaryContainer = document.querySelector('.summary-container');
                if (summaryContainer) {
                    summaryContainer.classList.remove('show');
                    setTimeout(() => {
                        summaryContainer.style.display = 'none';
                    }, 300);
                }

                // 关闭聊天室
                const chatroom = document.getElementById('chatroom-container');
                if (chatroom) {
                    chatroom.classList.remove('show');
                }

                // 关闭用户活动追踪浮窗
                if (window.userActivityTracker) {
                    window.userActivityTracker.hideContainer();
                }
            }

            const radius = 60; // 子按钮分布半径
            const mainRect = this.mainButton.getBoundingClientRect();
            const mainCenterX = mainRect.left + mainRect.width / 2;
            const mainCenterY = mainRect.top + mainRect.height / 2;

            this.subButtons.forEach((btn, index) => {
                const angle = ((index - 1.5) * 45) * (Math.PI / 180);
                const targetX = mainCenterX + radius * Math.cos(angle);
                const targetY = mainCenterY + radius * Math.sin(angle);

                if (this.isOpen) {
                    // 展开动画
                    btn.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    btn.style.left = `${targetX - btn.offsetWidth / 2}px`;
                    btn.style.top = `${targetY - btn.offsetHeight / 2}px`;
                    setTimeout(() => btn.classList.add('show'), index * 50);
                } else {
                    // 收起动画
                    btn.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    btn.style.left = `${mainCenterX - btn.offsetWidth / 2}px`;
                    btn.style.top = `${mainCenterY - btn.offsetHeight / 2}px`;
                    setTimeout(() => btn.classList.remove('show'), (this.subButtons.length - index - 1) * 50);
                }
            });
        }

        bindEvents() {
            // 主按钮点击事件
            this.mainButton.addEventListener('click', () => this.toggleSubButtons());

            // 子按钮点击事件
            this.subButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // 获取最近的带有 data-action 属性的元素
                    const actionElement = e.target.closest('[data-action]');
                    if (actionElement) {
                        const action = actionElement.dataset.action;
                        this.handleSubButtonClick(action);
                    }
                });
            });
        }

        handleSubButtonClick(action) {
            try {
                switch (action) {
                    case 'connect': // S1 - 等级
                        if (!window.connectDataFetcher) {
                            throw new Error('等级查询功能未初始化');
                        }
                        window.connectDataFetcher.toggleSummary();
                        break;
                    case 'trending': // S2 - 热榜
                        if (!window.trendingSidebar) {
                            throw new Error('热榜功能未初始化');
                        }
                        window.trendingSidebar.toggleSidebar();
                        break;
                    case 'chatroom': // S3 - 聊天室
                        if (!window.chatRoom) {
                            window.chatRoom = new ChatRoom();
                        }
                        window.chatRoom.toggleChatRoom();
                        break;
                    case 'summary':
                        if (!window.userActivityTracker) {
                            window.userActivityTracker = new UserActivityTracker();
                        }
                        window.userActivityTracker.showContainer();
                        break;
                    default:
                        console.log('功能开发中...');
                }
            } catch (error) {
                console.error('功能执行错误:', error);
                alert('操作失败: ' + error.message);
            }
        }
    }

    // 添加样式
    GM_addStyle(`
        #main-button {
            position: fixed;
            bottom: 50px;
            right: 50px;
            width: 50px;
            height: 50px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: all 0.3s;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #main-button:hover {
            background-color: #2980b9;
            transform: scale(1.1);
        }

        .sub-button {
            position: fixed;
            width: 40px;
            height: 40px;
            background-color: #e74c3c;
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            opacity: 0;
            transform: scale(0);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .sub-button svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }

        .sub-button:hover {
            transform: scale(1.1) !important;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        }

        .show {
            opacity: 1;
            transform: scale(1) !important;
        }

        #trendingPanel {
            position: fixed;
            top: 70px;
            right: -350px;
            width: 300px;
            background: rgba(255, 255, 255, 0.95);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border-right: 1px solid rgba(0, 0, 0, 0.1);
            padding: 10px;
            border-radius: 15px 0 0 15px;
            overflow: auto;
            z-index: 9999;
            transition: right 0.3s ease;
        }

        #trendingPanel h1 {
            animation: pulse 3s infinite;
            margin-bottom: 10px;
            font-size: 18px;
            text-align: center;
        }

        #trendingPanel ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        #trendingPanel li {
            padding: 8px;
            border-bottom: 1px solid #eee;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        #trendingPanel li:hover {
            background-color: #f0f0f0;
            transform: translateX(5px);
        }

        @keyframes pulse {
            0% { color: #333; }
            50% { color: #FF6347; }
            100% { color: #333; }
        }

        /* 等级模块样式 */
        .summary-container {
            position: fixed;
            top: 70px;
            right: 10px;
            z-index: 1000;
            background: #fff;
            border: 1px solid #e0e0e0;
            padding: 15px;
            width: 320px;
            max-height: 400px;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            border-radius: 12px;
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(-20px);
        }

        .summary-container.show {
            opacity: 1;
            transform: translateY(0);
        }

        .summary-table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 8px;
            background-color: #f9f9f9;
        }

        .summary-table td {
            padding: 6px 10px;
            text-align: left;
            font-family: 'Arial', sans-serif;
            border-bottom: 1px solid #eee;
            font-size: 13px;
        }

        .progress-bar {
            height: 16px;
            background: #e9ecef;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
            margin: 3px 0;
            width: 120px;
        }

        .progress-bar-fill {
            height: 100%;
            transition: width 0.5s ease;
            border-radius: 10px;
            background: linear-gradient(90deg, #28a745, #85e0a2);
        }

        .violation {
            color: #dc3545;
            font-weight: bold;
            padding: 8px;
            margin-top: 8px;
            background-color: rgba(220, 53, 69, 0.1);
            border-radius: 6px;
            font-size: 13px;
        }

        .compliance {
            color: #28a745;
            font-weight: bold;
            padding: 8px;
            margin-top: 8px;
            background-color: rgba(40, 167, 69, 0.1);
            border-radius: 6px;
            font-size: 13px;
        }

        #chatroom-container {
            position: fixed;
            top: 70px;
            right: -400px;
            width: 385px;
            height: 520px;
            background-color: #fff;
            border: 1px solid #ccc;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: right 0.3s ease;
            z-index: 999;
            padding: 8px;
        }

        #chatroom-container.show {
            right: 5px;
        }

        /* UserActivityTracker 样式 */
        .user-activity-container {
            position: fixed;
            bottom: -300px;
            left: 10px;
            transition: bottom 0.3s ease-in-out;
            background-color: #e8e8e8;
            padding: 15px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #333;
            z-index: 1000;
        }
    `);

    // 等级模块
    class ConnectDataFetcher {
        constructor() {
            this.summaryContainer = null;
            console.log("ConnectDataFetcher initialized.");
        }

        // 添加切换显示方
        toggleSummary = async () => {
            if (this.summaryContainer) {
                if (this.summaryContainer.classList.contains('show')) {
                    this.summaryContainer.classList.remove('show');
                    setTimeout(() => {
                        this.summaryContainer.style.display = 'none';
                    }, 300);
                } else {
                    this.summaryContainer.style.display = 'block';
                    setTimeout(() => {
                        this.summaryContainer.classList.add('show');
                    }, 50);
                }
            } else {
                try {
                    const summary = await this.fetchConnect();
                    this.displaySummary(summary);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    // 移除错误提示,因为已经自动跳转了
                    this.summaryContainer = null;
                }
            }
        }

        // 修改 fetchConnect 方法
        async fetchConnect() {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://connect.linux.do',
                    onload: (response) => {
                        try {
                            const bodyRegex = /<body[^>]*>([\s\S]+?)<\/body>/i;
                            const match = bodyRegex.exec(response.responseText);

                            if (!match || !match[1]) {
                                window.open('https://connect.linux.do', '_blank');
                                throw new Error('无法获取数据');
                            }

                            const doc = new DOMParser().parseFromString(match[1], 'text/html');
                            const rows = doc.querySelectorAll('tr');

                            if (!rows || rows.length === 0) {
                                window.open('https://connect.linux.do', '_blank');
                                throw new Error('无法获取数据');
                            }

                            let summary = '<table class="summary-table">';
                            let violationExists = false;
                            let violationStats = [];

                            rows.forEach((row, index) => {
                                if (row) {
                                    const cells = Array.from(row.querySelectorAll('td'), cell => cell.innerText.trim());
                                    if (cells.length >= 3) {
                                        const stat = cells[0];
                                        const curMatches = cells[1].match(/(\d+)/);
                                        const reqMatches = cells[2].match(/(\d+)/);

                                        const curValue = curMatches ? parseInt(curMatches[0]) : 0;
                                        const reqValue = reqMatches ? parseInt(reqMatches[0]) : 0;

                                        if ([7, 8, 13, 14].includes(index) && curValue > reqValue) {
                                            violationExists = true;
                                            violationStats.push(stat);
                                        }

                                        if ([1, 2, 3, 5, 9, 10].includes(index)) {
                                            const isCompliant = curValue >= reqValue;
                                            const color = isCompliant ? '#28a745' : '#dc3545';
                                            const displayValue = `${curValue}/${reqValue}`;
                                            summary += `
                                                <tr style="color: ${color};">
                                                    <td>${stat}</td>
                                                    <td>${displayValue}</td>
                                                    <td>
                                                        <div class="progress-bar" title="${curValue}/${reqValue}">
                                                            <div class="progress-bar-fill" style="width: ${Math.min((curValue / reqValue) * 100, 100)}%;"></div>
                                                        </div>
                                                        ${Math.round((curValue / reqValue) * 100)}%
                                                    </td>
                                                </tr>`;
                                        }
                                    }
                                }
                            });

                            if (violationExists) {
                                summary += `<tr><td colspan="3" class="violation">用户存在违规行为：${violationStats.join(', ')}</td></tr>`;
                            } else {
                                summary += '<tr><td colspan="3" class="compliance">用户不存在违规行为</td></tr>';
                            }

                            summary += '</table>';
                            resolve(summary);
                        } catch (error) {
                            reject(error);
                        }
                    },
                    onerror: (error) => {
                        window.open('https://connect.linux.do', '_blank');
                        reject(new Error('网络请求失败'));
                    }
                });
            });
        }

        displaySummary(summary) {
            this.summaryContainer = document.createElement('div');
            this.summaryContainer.className = 'summary-container';

            // 添加标题和关闭按钮
            const titleHtml = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <div style="font-size: 14px;"><strong>等级详情</strong></div>
                    <button class="btn no-text btn-icon btn-flat no-text" title="关闭" type="button" style="border: none; background: none;">
                        <svg class="fa d-icon d-icon-times svg-icon svg-string" xmlns="http://www.w3.org/2000/svg">
                            <use href="#times"></use>
                        </svg>
                    </button>
                </div>
            `;

            this.summaryContainer.innerHTML = titleHtml + summary;
            document.body.appendChild(this.summaryContainer);

            // 添加关闭按钮事件
            const closeBtn = this.summaryContainer.querySelector('button');
            closeBtn.addEventListener('click', () => {
                this.summaryContainer.classList.remove('show');
                setTimeout(() => {
                    this.summaryContainer.style.display = 'none';
                }, 300);
            });

            setTimeout(() => {
                this.summaryContainer.classList.add('show');
            }, 50);

            console.log("Summary displayed to the user.");
        }
    }

    // 添加热榜模块类
    class TrendingSidebar {
        constructor() {
            this.sidebar = null;
            this.init();
        }

        toggleSidebar = () => {
            if (this.sidebar) {
                const currentRight = this.sidebar.style.right;
                this.sidebar.style.right = currentRight === '0px' ? '-350px' : '0px';
            } else {
                console.error('Sidebar element not initialized');
            }
        }

        async init() {
            try {
                const headers = await this.prepareHeaders();
                const topics = await this.processData(headers);
                this.displaySidebar(topics);
            } catch (error) {
                console.error("Error initializing the Trending Sidebar:", error);
            }
        }

        async prepareHeaders() {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            return {
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "X-Csrf-Token": csrfToken,
                "X-Requested-With": "XMLHttpRequest"
            };
        }

        async fetchAllData(pages, headers) {
            const fetchPromises = pages.map(page =>
                fetch(`https://linux.do/top.json?page=${page}&per_page=50&period=daily`, {
                    method: 'GET',
                    headers: headers
                })
                .then(response => response.json()
                .then(data => data.topic_list.topics))
                .catch(err => {
                    console.error("Error fetching data for page", page, err);
                    return [];
                })
            );
            const results = await Promise.all(fetchPromises);
            return results.flat();
        }

        calculateHeatScore(post) {
            const now = new Date();
            const created_at = new Date(post.created_at);
            const updated_at = new Date(post.last_posted_at);
            const last_interaction_age_days = Math.floor((now - updated_at) / (1000 * 60 * 60));
            const recent_interaction_bonus = last_interaction_age_days <= 1 ? 80 : 0;
            const interaction_score = post.posts_count * 10 + post.views * 0.1 + (post.like_count || 0) * 5;
            const post_age_days = Math.floor((now - created_at) / (1000 * 60 * 60));
            const heat_score = (interaction_score + recent_interaction_bonus) * Math.pow(0.95, post_age_days);
            return heat_score;
        }

        createTableRows(topics) {
            return topics.map((topic, index) => {
                const heatScore = this.calculateHeatScore(topic);
                const color = this.getColor(heatScore);
                const formattedHeatScore = this.formatHeatScore(heatScore);
                let changeIndicator = topic.change ? `<span class="${topic.animation}">${topic.change}</span>` : "";
                return `
                    <li data-id="${topic.id}" style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #eee; font-size: 14px; transition: background-color 0.3s, transform 0.3s;">
                        <div style="flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${topic.title}">
                            <span style="color: ${color}; margin-right: 10px; font-weight:bold;">${index + 1} ${changeIndicator}</span>
                            <span style="color: #555;">${topic.title}</span>
                        </div>
                        <span style="color: ${color};">${formattedHeatScore}</span>
                    </li>
                `;
            }).join('');
        }

        getColor(heatScore) {
            return heatScore < 500
                ? `rgb(${Math.round(255 * (heatScore / 500))}, 128, 0)`
                : heatScore < 700
                ? `rgb(255, ${Math.round(128 - 128 * ((heatScore - 500) / 200))}, 0)`
                : heatScore < 1000
                ? `rgb(255, 0, 0)`
                : `rgb(${Math.round(Math.min(255, 200 + (heatScore - 1000) * 0.055))}, 0, 0)`;
        }

        formatHeatScore(heatScore) {
            return heatScore < 1000
                ? `${heatScore.toFixed(1)}`
                : `${(heatScore / 1000).toFixed(1)}k`;
        }

        async processData(headers) {
            const pages = Array.from({ length: 10 }, (_, i) => i + 1);
            const allTopics = await this.fetchAllData(pages, headers);
            return allTopics
                .filter(topic => topic.id)
                .sort((a, b) => this.calculateHeatScore(b) - this.calculateHeatScore(a))
                .slice(0, 10);
        }

        displaySidebar(topics) {
            if (!this.sidebar) {
                this.sidebar = document.createElement('div');
                this.sidebar.id = 'trendingPanel';
                this.sidebar.style.right = '-350px';
                document.body.appendChild(this.sidebar);
            }

            const closeButton = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h1 style="margin: 0; font-size: 16px; flex-grow: 1;">LinuxDO 热榜</h1>
                    <button class="btn no-text btn-icon btn-flat no-text" title="关闭" type="button" style="border: none; background: none; padding: 4px; margin-left: 8px; flex-shrink: 0;">
                        <svg class="fa d-icon d-icon-times svg-icon svg-string" xmlns="http://www.w3.org/2000/svg" style="width: 14px; height: 14px;">
                            <use href="#times"></use>
                        </svg>
                    </button>
                </div>
            `;

            const markdown = this.createTableRows(topics);
            this.sidebar.innerHTML = `${closeButton}<ul>${markdown}</ul>`;

            // 添加关闭按钮事件
            const closeBtn = this.sidebar.querySelector('button');
            closeBtn.addEventListener('click', () => {
                this.toggleSidebar();
            });

            // 修改点击事件，使用 Discourse 的路由事件进行跳转
            const items = this.sidebar.querySelectorAll('li[data-id]');
            items.forEach(item => {
                item.addEventListener('click', () => {
                    const topicId = item.getAttribute('data-id');
                    // 触发 Discourse 的路由事件
                    const routeEvent = new CustomEvent('discourse-route', {
                        detail: { path: `/t/${topicId}` }
                    });
                    document.dispatchEvent(routeEvent);

                    // 备用方案：如果上面的方法不生效，尝试直接修改 URL 并触发 popstate 事件
                    const newUrl = `/t/${topicId}`;
                    history.pushState({}, '', newUrl);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                });
            });
        }
    }

    // 添加 ChatRoom 类
    class ChatRoom {
        constructor() {
            this.config = {
                fixTopicId: '',
                homeTopic_id: '',
                homeNumber: '',
                username: '',
                reply_to_post_number: '',
                reply_avater: 'https://linux.do/uploads/default/optimized/3X/7/d/7de31932a4fd533496cfe35979a4d9d995bb5c63_2_180x180.png',
                newMsg: true,
                adminFloor: '',
                imgUrl: [],
                newArray: [],
                scrollPosition: 0
            };

            // 绑定方法
            this.init = this.init.bind(this);
            this.createContent = this.createContent.bind(this);
            this.handleFileUpload = this.handleFileUpload.bind(this);

            // 初始化容器
            this.container = null;
            this.init();
        }

        // 添加切换显示方法
        async toggleChatRoom() {
            if (!this.container) {
                // 创建主容器
                this.container = document.createElement('div');
                this.container.id = 'chatroom-container';
                document.body.appendChild(this.container);

                // 初始化所有UI组件
                await this.createTitle(this.container);
                await this.createContent(this.container);
                this.createInputAndSendButton(this.container);

                // 设置定时刷新
                this.setupRefreshInterval(this.container);
            }

            if (this.container.classList.contains('show')) {
                this.container.classList.remove('show');
            } else {
                this.container.classList.add('show');
                await this.createContent(this.container);
                await this.sendRead(0);
                const recentReplyContent = document.getElementById('recent-reply-content');
                if (recentReplyContent) {
                    recentReplyContent.scrollTop = this.config.scrollPosition;
                }
            }
        }

        // 添加刷新内容方法
        async refreshContent() {
            if (this.container && this.container.classList.contains('show')) {
                await this.createContent(this.container);
                await this.sendRead(0);
            }
        }

        // 初始化方法
        async init() {
            try {
                await this.getUsername();
                // 不再在初始化时创建UI,而是等待切换显示时创建
            } catch (error) {
                console.error('Error initializing chat room:', error);
            }
        }

        // 获取CSRF Token
        getCsrfToken() {
            const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
            return csrfTokenMeta ? csrfTokenMeta.getAttribute('content') : null;
        }

        // 获取用户名
        async getUsername() {
            if (this.config.username === '') {
                const headers = new Headers();
                headers.append('X-Csrf-Token', this.getCsrfToken());

                const response = await fetch('https://linux.do/my/summary.json', {
                    method: 'GET',
                    headers: headers
                });

                const newURL = response.url;
                const urlObj = new URL(newURL);
                const pathParts = urlObj.pathname.split('/');
                this.config.username = pathParts[2];  // 删除 toLowerCase()
            }
        }

        // 创建DOM元素的辅助方法
        createAndAppendElement(tag, attributes, textContent, parent) {
            const element = document.createElement(tag);
            if (attributes) {
                Object.keys(attributes).forEach(key => {
                    element.setAttribute(key, attributes[key]);
                });
            }
            if (textContent) {
                element.textContent = textContent;
            } else {
                element.innerHTML = attributes && attributes.innerHTML ? attributes.innerHTML : '';
            }
            if (parent) {
                parent.appendChild(element);
            }
            return element;
        }

        // 按钮控制
        buttonController() {
            const indicatorStyle = `
                -webkit-user-select: none;
                user-select: none;
                cursor: default;
                width: 14px;
                height: 14px;
                border-radius: 1em;
                box-sizing: content-box;
                -webkit-touch-callout: none;
                background: var(--tertiary-med-or-tertiary);
                color: var(--secondary);
                font-size: var(--font-down-2);
                text-align: center;
                transition: border-color linear .15s;
                border: 2px solid var(--header_background);
                position: absolute;
                top: 0px;
                right: 3px;
            `;

            return {
                setButtonColor: (newMsgRemind) => {
                    try {
                        const buttonWrapper = document.getElementById('quick-reply-open');
                        if (!buttonWrapper) {
                            console.warn('Button wrapper not found, skipping indicator update');
                            return;
                        }

                        const indicator = buttonWrapper.querySelector('.chat-indicator');

                        if (newMsgRemind) {
                            if (!indicator) {
                                const indicatorElement = this.createAndAppendElement('div', {
                                    class: 'chat-indicator',
                                    style: indicatorStyle
                                }, null, buttonWrapper);
                            }
                        } else {
                            if (indicator) {
                                indicator.remove();
                            }
                        }
                    } catch (error) {
                        console.error('Error setting button color:', error);
                    }
                }
            };
        }

        // 获取用最近回复
        async userRecentReply() {
            const response = await fetch(`https://linux.do/user_actions.json?offset=0&username=${this.config.username}&filter=5`);
            if (!response.ok) throw new Error('Failed to fetch recent reply.');

            const jsonData = await response.json();
            if (jsonData.length === 0) {
                console.error('No recent actions found');
                return null;
            }
            return jsonData.user_actions[0];
        }

        // 获取最近回复内容
        async fetchMostRecentReply() {
            try {
                if (this.config.fixTopicId === '') {
                    const recentPost = await this.userRecentReply();
                    this.config.homeTopic_id = recentPost.topic_id;
                } else {
                    this.config.homeTopic_id = this.config.fixTopicId;
                }

                const postTopicResponse = await fetch(`https://linux.do/t/topic/${this.config.homeTopic_id}.json`);
                const postTopicJsonData = await postTopicResponse.json();

                this.config.adminFloor = postTopicJsonData.user_id;
                let difference = Math.abs(postTopicJsonData.highest_post_number - postTopicJsonData.last_read_post_number);

                for (let i = 1; i <= difference; i++) {
                    const newValue = postTopicJsonData.last_read_post_number + i;
                    if (!this.config.newArray.includes(newValue)) {
                        this.config.newArray.push(newValue);
                    }
                }

                let postNumber = Math.max(postTopicJsonData.last_read_post_number, postTopicJsonData.highest_post_number);
                this.config.newMsg = postTopicJsonData.highest_post_number > postTopicJsonData.last_read_post_number;

                // 添加错误处理
                const buttonWrapper = document.getElementById('quick-reply-open');
                if (buttonWrapper) {
                    this.buttonController().setButtonColor(this.config.newMsg);
                }

                this.config.homeNumber = postNumber;

                const postResponse = await fetch(`https://linux.do/t/topic/${this.config.homeTopic_id}/${postNumber}.json`, {
                    headers: {
                        'X-CSRF-Token': this.getCsrfToken()
                    }
                });

                const postJsonData = await postResponse.json();
                const posts = postJsonData.post_stream.posts;

                const lastTenPosts = posts.map(post => ({
                    id: post.id,
                    user_id: post.user_id,
                    name: post.name,
                    username: post.username,
                    avatar_template: post.avatar_template,
                    cooked: post.cooked,
                    reaction_users_count: post.reaction_users_count,
                    current_user_used_main_reaction: post.current_user_reaction,
                    reply_to_user: post.reply_to_user,
                    date: post.created_at,
                    floor: post.post_number
                }));

                return {topicId: this.config.homeTopic_id, mostRecentReply: lastTenPosts};
            } catch (error) {
                console.error('Error fetching recent reply:', error);
                return null;
            }
        }

        // 创建标题
        async createTitle(popup) {
            try {
                const container = this.createAndAppendElement('div', {
                    style: 'display: flex; justify-content: space-between; align-items: center; font-weight: bold; margin-bottom: 2px;width:375px'
                }, null, popup);

                const title = this.createAndAppendElement('div', null, null, container);

                const svgIcon = `
                    <svg class="fa d-icon d-icon-d-chat svg-icon svg-string" xmlns="http://www.w3.org/2000/svg">
                        <use href="#comment" style="fill: #0088cc;"></use>
                    </svg>
                `;

                const svgElement = this.createAndAppendElement('span', null, null, title);
                svgElement.innerHTML = svgIcon;

                this.createAndAppendElement('span', null, '最近回复', title);

                const button = this.createAndAppendElement('button', {
                    style: 'border: none; background: none;float: right;width:25px'
                }, null, container);

                button.innerHTML = `
                    <button class="btn no-text btn-icon btn-flat no-text c-navbar__close-drawer-button" title="关闭" type="button">
                        <svg class="fa d-icon d-icon-times svg-icon svg-string" xmlns="http://www.w3.org/2000/svg">
                            <use href="#times"></use>
                        </svg>&ZeroWidthSpace;
                    </button>
                `;

                // 修改关闭按钮的点击事件处理
                button.addEventListener('click', () => {
                    if (this.container) {
                        this.container.classList.remove('show');

                        // 重置头像
                        const avatarImg = document.getElementById('quick-reply-avatar');
                        if (avatarImg) {
                            avatarImg.src = this.config.reply_avater;
                        }

                        // 保存滚动位置
                        const recentReplyContent = document.getElementById('recent-reply-content');
                        if (recentReplyContent) {
                            this.config.scrollPosition = recentReplyContent.scrollTop;
                        }

                        // 重置按钮状态
                        const openButton = document.getElementById('quick-reply-open');
                        if (openButton) {
                            openButton.style.pointerEvents = 'auto';
                            this.buttonController().setButtonColor(false);
                        }
                    }
                });
            } catch (e) {
                console.error('Error creating title:', e);
            }
        }

        // 创建卡片
        createCard(reply, popup) {
            const truncatedName = reply.name.length > 10 ? reply.name.substring(0, 10) + '...' : reply.name;
            const avatarSrc = reply.avatar_template.replace("{size}", "144");
            const shareIcon = reply.reply_to_user ? `<span style="vertical-align: middle;">
                <svg class="fa d-icon d-icon-share svg-icon svg-node" style="vertical-align: middle; width: 12px; height: 10px;">
                    <use xlink:href="#share"></use>
                </svg>
                <img src="https://linux.do${reply.reply_to_user.avatar_template.replace('{size}', '48')}"
                     alt="Avatar"
                     style="width: 18px; height: 18px; border-radius: 50%; margin-right: 4px;padding-bottom: 0px;" />
            </span>` : '';

            const cardHtml = `
                <div style="
                    display: flex;
                    align-items: start;
                    padding: 8px 10px;
                    background-color: #f8f8f8;
                    border-radius: 12px;
                    margin-bottom: 12px;
                    width: calc(100% - 4px);
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    box-sizing: border-box;
                    margin-left: 2px;
                    margin-right: 2px;
                ">
                    <img src="${avatarSrc}" alt="" width="40" height="40" class="avatar" loading="lazy"
                         style="border-radius: 50%; margin-right: 8px; object-fit: cover; flex-shrink: 0;" />
                    <div style="flex-grow: 1; overflow: hidden; min-width: 0; width: calc(100% - 48px);">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="color: #646464; font-weight: bold; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 13px;"
                                 title="${truncatedName}">
                                ${truncatedName.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                            </div>
                            <div style="color: #777; font-size: 11px; flex-shrink: 0;">
                                ${shareIcon}
                                ${this.formatDate(reply.date)}
                            </div>
                        </div>
                        <div style="color: #555; word-wrap: break-word; font-size: 14px; font-family: 'Microsoft YaHei'; position: relative;">
                            <style>
                                .message-content img {
                                    max-width: 100% !important;
                                    height: auto !important;
                                    object-fit: contain;
                                    border-radius: 8px;
                                    margin: 4px 0;
                                }
                                .message-content p {
                                    margin: 0;
                                    word-break: break-word;
                                    font-size: 13px;
                                    line-height: 1.5;
                                }
                                .message-content {
                                    overflow-wrap: break-word;
                                    word-wrap: break-word;
                                    word-break: break-word;
                                    margin: 2px 0;
                                }
                                .ownerBox {
                                    position: relative;
                                    margin-top: 8px;
                                    font-size: xx-small;
                                    color: #00aeff;
                                    font-style: italic;
                                    font-weight: 700;
                                    text-align: right;
                                    padding-right: 4px;
                                }
                            </style>
                            <div class="message-content">
                                ${reply.cooked}
                            </div>
                            ${reply.user_id === this.config.adminFloor ? '<div class="ownerBox">TOPIC OWNER</div>' : ''}
                        </div>
                        <div style="display: flex; align-items: center; margin-top: 4px;">
                            <span style="color: #b6b6b6; font-size: 12px;">楼层: ${reply.floor}</span>
                            <div style="flex-grow: 1;"></div>
                            <button class="heart-button" style="border: none;background-color: transparent; padding: 4px 6px;">
                                <span style="color: #b6b6b6; font-size: 12px; margin-right: 2px;">${reply.reaction_users_count}</span>
                                <svg class="fa d-icon d-icon-far-heart svg-icon svg-node" aria-hidden="true" style="width: 14px; height: 14px;">
                                    <use xlink:href="#far-heart" style="fill: ${reply.current_user_used_main_reaction ? 'red' : '#b6b6b6'};"></use>
                                </svg>
                            </button>
                            <button class="widget-button btn-flat reply create fade-out btn-icon-text" style="padding: 4px 6px;">
                                <svg class="fa d-icon d-icon-reply svg-icon svg-node" aria-hidden="true" style="width: 14px; height: 14px;">
                                    <use xlink:href="#reply"></use>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            const card = document.createElement('div');
            card.innerHTML = cardHtml;

            // 添加头像悬停事件
            const avatarImg = card.querySelector('.avatar');
            let hoverTimeout;

            avatarImg.addEventListener('mouseover', () => {
                hoverTimeout = setTimeout(async () => {
                    const isOnline = await this.checkLastSeenWithinFiveMinutes(reply.username);
                    avatarImg.style.border = isOnline ? '2px solid green !important' : '2px solid gray !important';
                }, 500);
            });

            avatarImg.addEventListener('mouseout', () => {
                clearTimeout(hoverTimeout);
                avatarImg.style.border = '';
            });

            // 添加回复按钮事件
            const button = card.querySelector('.widget-button');
            button.addEventListener('click', () => {
                this.config.reply_avater = reply.avatar_template.replace("{size}", "144");
                this.config.reply_to_post_number = reply.floor;
                const avatarImg = document.getElementById('quick-reply-avatar');
                avatarImg.src = this.config.reply_avater;
            });

            // 添加点赞按钮事件
            const heartbutton = card.querySelector('.heart-button');
            heartbutton.addEventListener('click', () => {
                this.fetchPutLikePost(reply.id);
                this.createContent(popup);
            });

            // 处理图片点击事件
            const images = card.querySelectorAll('img');
            images.forEach(image => {
                image.style.cursor = 'pointer';
                image.addEventListener('click', (event) => {
                    event.preventDefault();
                    window.open(image.src, '_blank');
                    image.style.maxWidth = image.style.maxWidth === '100%' ? '' : '100%';
                });
            });

            return card;
        }

        // 格式化日期
        formatDate(dateString) {
            const date = new Date(dateString);
            const hours = ('0' + date.getHours()).slice(-2);
            const minutes = ('0' + date.getMinutes()).slice(-2);
            return `${hours}:${minutes}`;
        }

        // 发已读状态
        async sendRead(itemIndex) {
            if (itemIndex < this.config.newArray.length) {
                const randomTime = this.getRandomInt(60000, 61000);
                const item = this.config.newArray[itemIndex];
                const postData = [
                    `timings%5B${item}%5D=${randomTime}`,
                    `topic_time=${randomTime}`,
                    `topic_id=${this.config.homeTopic_id}`
                ].join('&');

                try {
                    await fetch("https://linux.do/topics/timings", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                            "X-CSRF-Token": this.getCsrfToken(),
                            "X-Requested-With": "XMLHttpRequest",
                        },
                        body: postData,
                        credentials: "include"
                    });

                    setTimeout(() => {
                        this.sendRead(itemIndex + 1);
                    }, 200);
                } catch (error) {
                    console.error(`Error processing timing for post ${item}:`, error);
                }
            } else {
                this.config.newArray = [];
            }
        }

        // 获取随机整数
        getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // 创建内容区域
        async createContent(popup) {
            try {
                let recentReplyContent = document.getElementById('recent-reply-content');
                if (!recentReplyContent) {
                    recentReplyContent = this.createAndAppendElement('div', {
                        id: 'recent-reply-content',
                        style: `
                            overflow-y: auto;
                            height: 85%;
                            margin-bottom: 0px;
                            scrollbar-width: thin;
                            scrollbar-color: #888 #f0f0f0;
                            width: 100%;
                            padding: 16px 8px 0 8px;
                            box-sizing: border-box;
                            display: flex;           /* 添加 flex 布局 */
                            flex-direction: column;  /* 设置垂直方向 */
                        `
                    }, null, popup);
                }

                this.config.scrollPosition = recentReplyContent.scrollTop;
                const mostRecentReply = await this.fetchMostRecentReply();
                recentReplyContent.innerHTML = '';

                if (!mostRecentReply) return;

                const {mostRecentReply: replies} = mostRecentReply;
                const fragment = document.createDocumentFragment();

                // 反转消息数组
                replies.reverse().forEach(reply => {
                    reply.name = (reply.name === reply.username) ? reply.username : reply.name + ' ' + reply.username;
                    const cardElement = this.createCard(reply, popup);
                    fragment.appendChild(cardElement);
                });

                recentReplyContent.appendChild(fragment);

                // 设置滚动位置到顶部
                recentReplyContent.scrollTop = 0;

                recentReplyContent.addEventListener('scroll', () => {
                    this.config.scrollPosition = recentReplyContent.scrollTop;
                });
            } catch (error) {
                console.error('Error creating content:', error);
            }
        }

        // 创建打开按钮
        createOpenButton() {
            const buttonWrapper = this.createAndAppendElement('div', {
                title: "聊天室",
                style: `position: fixed;
                    top: 1.4%;
                    right: 18.5%;
                    transform: translate(50%, 0);
                    z-index: 9999;
                    cursor: move;
                    width: 42.33px;
                    height: 42.33px;
                    display: flex;
                    justify-content: center;
                    align-items: center;`
            }, null, document.body);

            const openButton = this.createAndAppendElement('button', {
                id: 'quick-reply-open',
                style: 'border: none; cursor: pointer; background: none;width:42.33px;height: 42.33px;'
            }, null, buttonWrapper);

            const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgIcon.setAttribute("class", "fa d-icon d-icon-d-regular svg-icon svg-string");
            svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svgIcon.setAttribute("style", "width: 26px; height: 26px;fill: #d0d0d0;");
            svgIcon.innerHTML = '<use href="#bell"></use>';

            openButton.appendChild(svgIcon);

            const openStyleButton = document.getElementById('quick-reply-open');

            openStyleButton.addEventListener('mouseover', () => {
                openStyleButton.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                openStyleButton.style.borderTop = '1px solid transparent';
                openStyleButton.style.borderLeft = '1px solid transparent';
                openStyleButton.style.borderRight = '1px solid transparent';
                openStyleButton.style.borderRadius = '4px';

                const svgIcon = openStyleButton.querySelector('svg');
                if (svgIcon) {
                    svgIcon.querySelector('use').setAttribute('fill', '#919191');
                }
            });

            openStyleButton.addEventListener('mouseleave', () => {
                openStyleButton.style.background = 'none';
                openStyleButton.style.border = 'none';
                openStyleButton.style.cursor = 'pointer';

                const svgIcon = openStyleButton.querySelector('svg');
                if (svgIcon) {
                    svgIcon.querySelector('use').setAttribute('fill', '#d0d0d0');
                }
            });

            openButton.addEventListener('click', async () => {
                const popup = document.getElementById('quick-reply-popup');
                if (popup.style.display === 'none') {
                    popup.style.display = 'block';
                    await this.createContent(popup);
                    await this.sendRead(0);
                    const recentReplyContent = document.getElementById('recent-reply-content')
                    recentReplyContent.scrollTop = this.config.scrollPosition;
                }
            });
        }

        // 设置定时刷新
        setupRefreshInterval(popup) {
            setInterval(async () => {
                const replyBox = document.getElementById('quick-reply-box');
                if (!replyBox.value.trim()) {
                    await this.createContent(popup);
                    const recentReplyContent = document.getElementById('recent-reply-content');
                    recentReplyContent.scrollTop = this.config.scrollPosition;
                }
            }, 5000);
        }

        // 添加消息提示
        showTip(message, isError = false) {
            const replyBox = document.getElementById('quick-reply-box');
            const existingTip = document.querySelector('.message-tip');
            if (existingTip) {
                existingTip.remove();
            }

            const tip = this.createAndAppendElement('div', {
                className: 'message-tip',
                style: `
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: ${isError ? 'rgba(255, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.7)'};
                    color: white;
                    padding: 8px 16px;
                    border-radius: 4px;
                    margin-bottom: 8px;
                    white-space: nowrap;
                    z-index: 10000;
                `
            }, message, replyBox.parentElement);

            setTimeout(() => {
                tip.remove();
            }, 2000);
        }

        // 修改 handleFileUpload 方法
        handleFileUpload() {
            const fileInput = this.createAndAppendElement('input', {
                type: 'file',
                style: 'display: none;',
                id: 'file-input'
            }, null, document.body);

            fileInput.addEventListener('change', async () => {
                const uploadFile = fileInput.files && fileInput.files[0];
                if (uploadFile) {
                    this.showTip('正在上传图片...');

                    const uploadFileChecksum = await this.getFileHash(uploadFile);
                    const formData = new FormData();
                    formData.append('upload_type', 'composer');
                    formData.append('relativePath', 'null');
                    formData.append('name', uploadFile.name);
                    formData.append('type', '"image/png"');
                    formData.append('sha1_checksum', uploadFileChecksum);
                    formData.append('file', uploadFile, uploadFile.name);

                    try {
                        const response = await fetch('https://linux.do/uploads.json?client_id=bddb80db355c49e1b0a68a47fbabf1a9', {
                            method: 'POST',
                            body: formData,
                            credentials: 'include',
                            headers: {
                                accept: '*/*',
                                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                                'sec-fetch-dest': 'empty',
                                'sec-fetch-mode': 'cors',
                                'sec-fetch-site': 'same-origin',
                                'x-csrf-token': this.getCsrfToken(),
                            },
                        });

                        const res = await response.json();
                        this.showTip('上传成功!');
                        this.handleUploadSuccess(res);
                    } catch (error) {
                        this.showTip('上传失败，请重试', true);
                        console.error('上传失', error);
                    }
                }
            });

            fileInput.click();
        }

        // 处理上传成功
        handleUploadSuccess(res) {
            this.config.imgUrl.push('\n' + res.url + '\n');
            const imagePreviewContainer = document.getElementById("uploaded-image-preview-container");
            const recentReplyContent = document.getElementById('recent-reply-content');

            if (!imagePreviewContainer) {
                console.error('Image preview container not found');
                return;
            }

            // 调整聊天内容区域的高度
            if (recentReplyContent) {
                recentReplyContent.style.height = '72%';
                recentReplyContent.scrollTop = recentReplyContent.scrollHeight - recentReplyContent.clientHeight;
            }

            this.createImagePreview(res.url, imagePreviewContainer);
        }

        // 修改 createImagePreview 方法
        createImagePreview(imageUrl, container) {
            // 创或获取图片预览行容器
            let previewRow = container.querySelector('.preview-row');
            if (!previewRow) {
                previewRow = this.createAndAppendElement('div', {
                    class: 'preview-row',
                    style: 'display: flex; flex-wrap: wrap; gap: 5px; padding: 5px;'
                }, null, container);
            }

            // 创建图片预览
            const imgPreview = this.createAndAppendElement('img', {
                src: imageUrl,
                style: `
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: opacity 0.2s;
                `
            }, null, previewRow);

            // 添加鼠标悬停效果
            imgPreview.addEventListener('mouseover', () => {
                imgPreview.style.opacity = '0.8';
            });

            imgPreview.addEventListener('mouseout', () => {
                imgPreview.style.opacity = '1';
            });

            // 点击图片删除
            imgPreview.addEventListener('click', () => {
                this.showTip('已删除图片');
                const index = this.config.imgUrl.indexOf('\n' + imageUrl + '\n');
                if (index !== -1) {
                    this.config.imgUrl.splice(index, 1);
                }
                imgPreview.remove();

                // 如果没有图片了，恢复聊天内容区域的高度并移除预览行
                if (this.config.imgUrl.length === 0) {
                    const recentReplyContent = document.getElementById('recent-reply-content');
                    if (recentReplyContent) {
                        recentReplyContent.style.height = '85%';
                    }
                    previewRow.remove();
                }
            });
        }

        // 计算文件哈希值
        async getFileHash(file) {
            const buffer = await file.arrayBuffer();
            const crypto = window.crypto || window.msCrypto;
            const subtleCrypto = crypto.subtle || crypto.webkitSubtle;

            if (!subtleCrypto) {
                throw new Error('SubtleCrypto API not available');
            }

            const hashBuffer = await subtleCrypto.digest('SHA-1', buffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        }

        // 修改 createInputAndSendButton 方法中的图片预览容器样式
        createInputAndSendButton(popup) {
            // 创建图片预览容器
            const imagePreviewContainer = this.createAndAppendElement('div', {
                id: 'uploaded-image-preview-container',
                style: `
                    width: 100%;
                    min-height: 0;
                    max-height: 70px;
                    overflow-y: auto;
                    margin-bottom: 5px;
                    scrollbar-width: thin;
                    scrollbar-color: #888 #f0f0f0;
                `
            }, null, popup);

            // 添加滚动条样式
            const style = document.createElement('style');
            style.textContent = `
                #uploaded-image-preview-container::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                #uploaded-image-preview-container::-webkit-scrollbar-track {
                    background: #f0f0f0;
                    border-radius: 3px;
                }
                #uploaded-image-preview-container::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 3px;
                }
                #uploaded-image-preview-container::-webkit-scrollbar-thumb:hover {
                    background: #666;
                }
            `;
            document.head.appendChild(style);

            const container = this.createAndAppendElement('div', {
                style: 'position: absolute; bottom: 0px; right:0px; width:97%; background-color: #f0f0f0;padding:6px;'
            }, null, popup);

            // 创建输入框容器
            const inputContainer = this.createAndAppendElement('div', {
                style: 'display: flex; align-items: center; background-color: #ffffff; padding: 1px; border-radius: 8px; justify-content: space-between; border: 1px solid #494949;'
            }, null, container);

            // 建定位图标
            this.createLocationIcon(inputContainer);
            this.createSeparator(inputContainer);

            // 建头像按钮
            this.createAvatarButton(inputContainer);
            this.createSeparator(inputContainer);

            // 创建上传按钮
            this.createUploadButton(inputContainer);

            // 创建输入框
            const replyBox = this.createReplyBox(inputContainer);

            // 创建发送按钮
            this.createSendButton(inputContainer, replyBox);
        }

        // 创建分隔线
        createSeparator(container) {
            this.createAndAppendElement('div', {
                className: 'composer-separator',
                style: 'width: 1px;margin:0.25rem;box-sizing: border-box;background: var(--primary-low-mid);height: 26px;display: flex;'
            }, null, container);
        }

        // 创建头像钮
        createAvatarButton(container) {
            const avatarButton = this.createAndAppendElement('button', {
                id: 'quick-reply-avatar-button',
                style: 'border: none; background: none; padding: 0;height:40px;margin-left: 2px;width: 30px;'
            }, null, container);

            const avatarImg = this.createAndAppendElement('img', {
                id: 'quick-reply-avatar',
                src: this.config.reply_avater,
                width: '28',
                height: '28',
                style: 'border-radius: 50%; object-fit: cover;margin-bottom: 2px;margin-right: 6px;margin-bottom: 0px;'
            }, null, avatarButton);

            avatarButton.addEventListener('click', () => {
                this.config.reply_avater = 'https://linux.do/uploads/default/optimized/3X/7/d/7de31932a4fd533496cfe35979a4d9d995bb5c63_2_180x180.png';
                avatarImg.src = this.config.reply_avater;
                this.config.reply_to_post_number = '';
            });
        }

        // 创建上传按钮
        createUploadButton(container) {
            const uploadButton = this.createAndAppendElement('div', {
                id: 'quick-reply-refresh',
            }, null, container);

            uploadButton.innerHTML = `
                <button class="btn no-text btn-icon fk-d-menu__trigger chat-composer-dropdown__trigger-btn btn-flat"
                        aria-expanded="false"
                        data-trigger=""
                        type="button"
                        id="ember419"
                        data-identifier="chat-composer-dropdown__menu"
                        style="padding-left: 2px; padding-right: 2px;">
                    <svg class="fa d-icon d-icon-plus svg-icon svg-string" xmlns="http://www.w3.org/2000/svg">
                        <use href="#plus"></use>
                    </svg>&ZeroWidthSpace;
                </button>
            `;

            uploadButton.addEventListener('click', () => this.handleFileUpload());
        }

        // 创建发送按钮
        createSendButton(container, replyBox) {
            const sendButton = this.createAndAppendElement('button', {
                id: 'quick-reply-send',
                style: 'background-color: transparent; margin-bottom:0px; color: white; border: none; border-radius: 0 9px 9px 0; cursor: pointer; font-size: 14px; line-height: 1; outline: none; padding: 10px 16px 8px 5px; height: 40px; width: 40px;'
            }, null, container);

            sendButton.innerHTML = `
                <svg class="fa d-icon d-icon-paper-plane svg-icon svg-string" xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="height: 20px;width: 17px;padding-left: 5px;">
                    <use href="#paper-plane" fill="#494949"></use>
                </svg>
            `;

            this.setupSendButtonEvents(sendButton, replyBox);
        }

        // 设置发送按钮事件
        setupSendButtonEvents(sendButton, replyBox) {
            sendButton.addEventListener('click', async () => {
                const content = replyBox.value;
                const url = this.config.imgUrl.length > 0 ? this.config.imgUrl.join('\n') : '';
                const postData = url ? url + content : content;
                await this.sendNewPost(postData);
                replyBox.value = '';
                this.config.imgUrl = [];
                const imagePreviewContainer = document.getElementById("uploaded-image-preview-container");
                imagePreviewContainer.innerHTML = '';
            });

            replyBox.addEventListener('keydown', (event) => {
                if (event.ctrlKey && event.key === 'Enter') {
                    event.preventDefault();
                    sendButton.click();
                }
            });
        }

        // 修改 sendNewPost 方法
        async sendNewPost(content) {
            if (!content.trim()) {
                console.warn('Content is empty, skipping post');
                return;
            }

            this.showTip('正在发送...');

            const url = 'https://linux.do/posts';
            const csrfToken = this.getCsrfToken();
            if (!csrfToken) {
                console.error('CSRF token not found');
                return;
            }

            const headers = {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-CSRF-Token': csrfToken,
                'X-Requested-With': 'XMLHttpRequest'
            };

            const formData = new URLSearchParams({
                'raw': content,
                'topic_id': this.config.homeTopic_id,
                'reply_to_post_number': this.config.reply_to_post_number || '',
                'category': '',
                'archetype': 'regular',
                'typing_duration_msecs': '1000',
                'composer_open_duration_msecs': '1000',
                'nested_post': 'true',
                'is_warning': 'false',
                'whisper': 'false',
                'draft_key': `topic_${this.config.homeTopic_id}`
            });

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: formData,
                    credentials: 'include'
                });

                const responseData = await response.json();

                if (!response.ok) {
                    console.error('Server response:', responseData);
                    this.showTip('发送失败: ' + (responseData.errors?.[0] || '未知错误'), true);
                    throw new Error(responseData.errors?.[0] || 'Failed to send new post');
                }

                this.showTip('发送成功!');

                // 重置回复相关的状态
                this.config.reply_to_post_number = '';
                const avatarImg = document.getElementById('quick-reply-avatar');
                if (avatarImg) {
                    avatarImg.src = 'https://linux.do/uploads/default/optimized/3X/7/d/7de31932a4fd533496cfe35979a4d9d995bb5c63_2_180x180.png';
                }

                // 清空图片预览容器
                const imagePreviewContainer = document.getElementById("uploaded-image-preview-container");
                if (imagePreviewContainer) {
                    imagePreviewContainer.innerHTML = '';
                }

                // 发送成功后刷新内容
                await this.createContent(document.getElementById('quick-reply-popup'));

            } catch (error) {
                console.error('Error sending new post:', error);
                this.showTip('发送失败: ' + error.message, true);
            }
        }

        // 修改 fetchPutLikePost 方法
        async fetchPutLikePost(postID) {
            this.showTip('正在点赞...');
            const csrfToken = this.getCsrfToken();
            try {
                const response = await fetch(
                    `https://linux.do/discourse-reactions/posts/${postID}/custom-reactions/heart/toggle.json`,
                    {
                        headers: {
                            "x-csrf-token": csrfToken,
                        },
                        method: "PUT",
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error('点赞失败');
                }

                this.showTip('点赞成功!');
            } catch (error) {
                console.error('Error toggling like:', error);
                this.showTip('点赞失败，请重试', true);
            }
        }

        // 检查用户在线状态
        async checkLastSeenWithinFiveMinutes(username) {
            try {
                const csrfToken = this.getCsrfToken();
                const url = `https://linux.do/u/${username}/card.json`;
                const headers = new Headers({
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'Discourse-Logged-In': 'true',
                    'Discourse-Present': 'true',
                    'Referer': 'https://linux.do',
                    'Sec-Ch-Ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                    'Sec-Ch-Ua-Mobile': '?0',
                    'Sec-Ch-Ua-Platform': '"Windows"',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                    'X-Csrf-Token': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                });

                const response = await fetch(url, {
                    method: 'GET',
                    headers: headers,
                });

                const userData = await response.json();
                const lastSeenTime = new Date(userData.user.last_seen_at);
                const currentTime = new Date();
                const timeDifference = currentTime - lastSeenTime;
                const minutesDifference = timeDifference / (1000 * 60);

                return minutesDifference <= 5;
            } catch (error) {
                console.error('Error checking user status:', error);
                return false;
            }
        }

        // 创建定位钮
        createLocationIcon(container) {
            const svgContent = `
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="28" viewBox="0 0 24 24" fill="none" style="margin-top: 5px;">
                    <path d="M11.286 21.7001C11.286 21.7001 11.2862 21.7004 12 21C12.7138 21.7004 12.7145 21.6997 12.7145 21.6997C12.5264 21.8913 12.2685 22 12 22C11.7315 22 11.474 21.8918 11.286 21.7001Z" fill="#494949"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7ZM11 10C11 9.44772 11.4477 9 12 9C12.5523 9 13 9.44772 13 10C13 10.5523 12.5523 11 12 11C11.4477 11 11 10.5523 11 10Z" fill="#494949"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.286 21.7001L12 21L12.7145 21.6997L12.7204 21.6937L12.7369 21.6767L12.7986 21.6129C12.8521 21.5574 12.9296 21.4765 13.0277 21.3726C13.2239 21.1649 13.5029 20.8652 13.8371 20.4938C14.5045 19.7523 15.3968 18.7198 16.2916 17.5608C17.1835 16.4056 18.0938 15.104 18.7857 13.8257C19.4617 12.5767 20 11.2239 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 11.2239 4.53828 12.5767 5.21431 13.8257C5.90617 15.104 6.81655 16.4056 7.70845 17.5608C8.60322 18.7198 9.49555 19.7523 10.1629 20.4938C10.4971 20.8652 10.7761 21.1649 10.9723 21.3726C11.0704 21.4765 11.1479 21.5574 11.2014 21.6129L11.2631 21.6767L11.2796 21.6937L11.286 21.7001ZM6 10C6 6.68629 8.68629 4 12 4C15.3137 4 18 6.68629 18 10C18 10.7091 17.6633 11.6978 17.0268 12.8737C16.4062 14.0204 15.5665 15.2272 14.7084 16.3386C13.8532 17.4464 12.9955 18.4391 12.3504 19.156C12.2249 19.2955 12.1075 19.4244 12 19.5414C11.8925 19.4244 11.7751 19.2955 11.6496 19.156C11.0045 18.4391 10.1468 17.4464 9.29155 16.3386C8.43345 15.2272 7.59383 14.0204 6.9732 12.8737C6.33672 11.6978 6 10.7091 6 10Z" fill="#494949"/>
                </svg>
            `;

            const iconButton = this.createAndAppendElement('button', {
                id: 'quick-reply-icon',
                style: 'border: none; flex-shrink: 0; background-color: transparent; cursor: pointer; outline: none; padding: 0; margin-left: 2px;margin-bottom:0px;height:40px;'
            }, null, container);

            iconButton.innerHTML = svgContent;
            iconButton.addEventListener('click', () => {
                // 使用无刷新跳转
                const routeEvent = new CustomEvent('discourse-route', {
                    detail: { path: `/t/topic/${this.config.homeTopic_id}/${this.config.homeNumber}` }
                });
                document.dispatchEvent(routeEvent);

                // 备用方案：如果上面的方法不生效，尝试直接修改 URL 并触发 popstate 事件
                const newUrl = `/t/topic/${this.config.homeTopic_id}/${this.config.homeNumber}`;
                history.pushState({}, '', newUrl);
                window.dispatchEvent(new PopStateEvent('popstate'));
            });

            return iconButton;
        }

        // 创建回复输入框
        createReplyBox(container) {
            const replyBox = this.createAndAppendElement('textarea', {
                id: 'quick-reply-box',
                style: 'whiteSpace = pre-wrap; flex-grow: 1;padding-left: 5px;padding-right:10px;padding-top:10px;padding-bottom:10px;background-color: rgb(255, 255, 255);border: 1px solid transparent;border-radius: 0px 0px 0px 0px;resize: none;font-size: 14px;line-height: 1.2;outline: none;height: 40px;margin-right: 0px;margin-bottom: 0px;'
            }, null, container);

            replyBox.style.overflow = 'hidden';
            return replyBox;
        }
    }

    class UserActivityTracker {
        constructor() {
            this.username = '';
            this.hideTimeout = null;
            this.isQuerying = false;
            this.timer = null;
            this.timeSpent = parseInt(localStorage.getItem('timeSpent')) || 0;

            this.STORAGE_KEYS = {
                COUNTS: 'timings_counts',
                DATE: 'timings_date',
                TOPIC: 'topic_count'
            };

            this.initUI();
            this.initEventListeners();
            this.initTimingsMonitor();
            this.initTimeTracker();
            this.getUsername();
        }

        // UI初始化相关方法
        initUI() {
            this.createInputContainer();
            this.createInput();
            this.createQueryButton();
            this.createResultContainer();
            this.createCloseButton();
            this.addStyles();
        }

        // 修 createInputContainer 方法中的位置相关样式
        createInputContainer() {
            this.inputContainer = document.createElement('div');
            Object.assign(this.inputContainer.style, {
                position: 'fixed',
                bottom: '-500px',
                right: '120px', // 改为右侧定位
                transition: 'bottom 0.3s ease-in-out',
                backgroundColor: '#e8e8e8',
                padding: '15px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                color: '#333',
                zIndex: '10000'
            });
            document.body.appendChild(this.inputContainer);
        }

        createInput() {
            this.input = document.createElement('input');
            Object.assign(this.input, {
                type: 'text',
                placeholder: '输入用户名'
            });
            Object.assign(this.input.style, {
                width: '160px',
                height: '40px',
                lineHeight: '28px',
                padding: '0 1rem',
                paddingLeft: '10px',
                marginRight: '10px',
                border: '2px solid transparent',
                borderRadius: '8px',
                outline: 'none',
                backgroundColor: '#f3f3f4',
                color: '#0d0c22',
                transition: '.3s ease'
            });
            this.input.classList.add('input');
            this.inputContainer.appendChild(this.input);
        }

        createQueryButton() {
            this.button = document.createElement('button');
            Object.assign(this.button.style, {
                position: 'relative',
                overflow: 'hidden',
                height: '38px',
                padding: '0 2rem',
                borderRadius: '0.5rem',
                background: '#3d3a4e',
                backgroundSize: '400%',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                zIndex: '1'
            });
            this.createBeforeElement(this.button);
            this.inputContainer.appendChild(this.button);
        }

        createResultContainer() {
            this.resultContainer = document.createElement('div');
            Object.assign(this.resultContainer.style, {
                marginTop: '20px',
                padding: '20px',
                width: '217px',
                borderRadius: '15px',
                backgroundColor: '#efefef',
                boxShadow: '8px 8px 5px #bebebe, -8px -8px 5px #ffffff',
                display: 'none'
            });
            this.inputContainer.appendChild(this.resultContainer);
        }

        // 修改 createCloseButton 方法
        createCloseButton() {
            this.closeButton = document.createElement('button');
            this.closeButton.innerText = '关闭'; // 改为"关闭"
            Object.assign(this.closeButton.style, {
                display: 'block',
                width: '257px',
                marginTop: '20px',
                padding: '10px 40px',
                borderRadius: '6px',
                cursor: 'pointer',
                border: '0',
                backgroundColor: '#ffffff',
                boxShadow: 'rgb(0 0 0 / 5%) 0 0 8px',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                fontSize: '15px',
                transition: 'all 0.5s ease',
                color: '#000'
            });

            this.closeButton.onclick = () => {
                this.hideContainer(); // 点击关闭按钮时隐藏容器
            };

            this.inputContainer.appendChild(this.closeButton);
        }

        addStyles() {
            const style = document.createElement('style');
            style.innerHTML = `
                .input::placeholder {
                    color: #9e9ea7;
                }
                .input:focus, .input:hover {
                    outline: none;
                    border-color: rgba(93,24,220,0.4) !important;
                    background-color: #fff;
                    box-shadow: 0 0 0 4px rgb(93 24 220 / 10%) !important;
                }
            `;
            document.head.appendChild(style);
        }

        // 事件监听相关方法
        initEventListeners() {
            this.initButtonEvents();
            this.initVisibilityEvents();
            this.initButtonHoverEffects();
        }

        // 修改 initButtonEvents 方法,删除自动隐藏
        initButtonEvents() {
            this.button.onclick = async () => {
                const queryUsername = this.input.value.trim();
                await this.countAllTodaysActions(queryUsername);
                // 删除 this.hideContainer() 调用
            };
        }

        initVisibilityEvents() {
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') {
                    this.startTimer();
                } else {
                    this.stopTimer();
                }
            });

            window.addEventListener('load', () => this.startTimer());
            window.addEventListener('beforeunload', () => {
                this.stopTimer();
                this.updateLocalStorage();
            });
        }

        // 时间追踪相关方法
        initTimeTracker() {
            this.startTimer();
        }

        startTimer() {
            this.timer = setInterval(async () => {
                const istoday = await this.resetLocalStorageIfNeeded();
                if (!istoday) {
                    this.timeSpent += 1;
                } else {
                    console.log("时间到了，开始更新");
                    this.timeSpent = 0;
                }
                this.updateLocalStorage();
            }, 1000);
        }

        stopTimer() {
            clearInterval(this.timer);
        }

        updateLocalStorage() {
            localStorage.setItem('timeSpent', this.timeSpent);
        }

        // 修改 showContainer 方法中显示位置
        showContainer() {
            clearTimeout(this.hideTimeout);
            this.inputContainer.style.bottom = '120px'; // 调整底部距离,避免与主按钮重叠
            this.inputContainer.style.zIndex = '10000';
        }

        // 修改 hideContainer 方法中的隐藏位置
        hideContainer() {
            if (!this.isQuerying) {
                this.inputContainer.style.bottom = '-500px';
            }
        }

        // 工具方法
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        isToday(timestamp) {
            const now = new Date();
            const date = new Date(timestamp);
            return date.toDateString() === now.toDateString();
        }

        isOlderThanToday(timestamp) {
            const now = new Date();
            const date = new Date(timestamp);
            return date < new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }

        getStoredTopics() {
            try {
                return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.TOPIC)) || [];
            } catch(e) {
                return [];
            }
        }

        // 用户数据获取相关方法
        async getUsername() {
            if (this.username === '') {
                const headers = new Headers();
                headers.append('X-Csrf-Token', this.getCsrfToken());
                const response = await fetch('https://linux.do/my/summary.json', {
                    method: 'GET',
                    headers: headers
                });
                const newURL = response.url;
                const urlObj = new URL(newURL);
                const pathParts = urlObj.pathname.split('/');
                this.username = pathParts[2];  // 删除 toLowerCase()
            }
        }

        // 添加 processUniqueTopics 方法
        processUniqueTopics(actions, topicIds, uniqueTopicCount) {
            actions.forEach(action => {
                if (!topicIds.has(action.topic_id)) {
                    topicIds.add(action.topic_id);
                    uniqueTopicCount++;
                }
            });
            return uniqueTopicCount;
        }

        // 修改 countTodaysActions 方法
        async countTodaysActions(username, filter, uniqueTopicIds = false) {
            let offset = 0;
            let actionCount = 0;
            let uniqueTopicCount = 0;
            let hasMoreData = true;
            let queryData = true;
            const topicIds = new Set();
            let firstAction = '';

            while (hasMoreData) {
                const url = `https://linux.do/user_actions.json?offset=${offset}&limit=500&username=${username}&filter=${filter}`;
                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    const userActions = data.user_actions;

                    if (!userActions || userActions.length === 0) {
                        hasMoreData = false;
                        break;
                    }

                    firstAction = userActions[0];
                    const todaysActions = userActions.filter(action => this.isToday(action.created_at));
                    actionCount += todaysActions.length;

                    if (uniqueTopicIds) {
                        uniqueTopicCount = this.processUniqueTopics(todaysActions, topicIds, uniqueTopicCount);
                    }

                    const oldestAction = userActions[userActions.length - 1];
                    if (this.isOlderThanToday(oldestAction.created_at)) {
                        hasMoreData = false;
                        break;
                    }

                    offset += 500;
                    await this.delay(600);
                } catch (error) {
                    console.error(`Error fetching user actions with filter ${filter}:`, error);
                    hasMoreData = false;
                    queryData = false;
                    break;
                }
            }
            return {actionCount, uniqueTopicCount, firstAction, queryData};
        }

        async countTodaysReactionsReceived(username) {
            return await this.countReactions(username, 'reactions-received');
        }

        async countTodaysReactionsGiven(username) {
            return await this.countReactions(username, 'reactions');
        }

        // 修改 countReactions 方法
        async countReactions(username, type) {
            try {
                const url = `https://linux.do/u/${username}/activity/reactions.json`;
                const response = await fetch(url);
                const data = await response.json();

                if (!data || !Array.isArray(data.reactions)) {
                    return 0;
                }

                const todaysReactions = data.reactions.filter(reaction =>
                    this.isToday(reaction.created_at)
                );

                return todaysReactions.length;
            } catch (error) {
                console.error(`Error fetching ${type}:`, error);
                return 0;
            }
        }

        // 排名查询相关方法
        async getTotalUsers() {
            const response = await fetch('https://linux.do/about.json');
            const data = await response.json();
            return data.about.stats.users_count;
        }

        async getUsersPerPage() {
            const response = await fetch('https://linux.do/leaderboard/1.json?page=0&period=all');
            const data = await response.json();
            return data.users.length;
        }

        async getPageData(page) {
            const response = await fetch(`https://linux.do/leaderboard/1.json?page=${page}&period=all`);
            return await response.json();
        }

        async findUserPosition(targetName, gamificationScore) {
            const totalUsers = await this.getTotalUsers();
            const usersPerPage = await this.getUsersPerPage();
            const totalPages = Math.ceil(totalUsers / usersPerPage);
            let position = "未查询到";

            const normalizeFirstChar = (name) => name.charAt(0).toLowerCase() + name.slice(1);
            const normalizedTargetName = normalizeFirstChar(targetName);

            let left = 0;
            let right = totalPages - 1;

            while (left <= right) {
                const mid = Math.floor((left + right) / 2);
                const data = await this.getPageData(mid);

                if (!data.users.length) break;

                const firstUserScore = data.users[0].total_score;
                const lastUserScore = data.users[data.users.length - 1].total_score;

                if (gamificationScore > firstUserScore) {
                    right = mid - 1;
                } else if (gamificationScore < lastUserScore) {
                    left = mid + 1;
                } else {
                    position = await this.searchUserInPages(data, mid, normalizedTargetName, gamificationScore, totalPages);
                    break;
                }

                await this.delay(100);
            }

            return position;
        }

        async searchUserInPages(data, mid, normalizedTargetName, gamificationScore, totalPages) {
            // 在当前页面搜索
            for (const user of data.users) {
                if (this.normalizeFirstChar(user.username) === normalizedTargetName) {
                    return user.position;
                }
            }

            // 在前面的页面搜索
            let tempPage = mid - 1;
            while (tempPage >= 0) {
                const tempData = await this.getPageData(tempPage);
                for (let i = tempData.users.length - 1; i >= 0; i--) {
                    if (tempData.users[i].total_score !== gamificationScore) {
                        tempPage = -1;
                        break;
                    }
                    if (this.normalizeFirstChar(tempData.users[i].username) === normalizedTargetName) {
                        return tempData.users[i].position;
                    }
                }
                tempPage--;
                await this.delay(100);
            }

            // 在后面的页面搜索
            tempPage = mid + 1;
            while (tempPage < totalPages) {
                const tempData = await this.getPageData(tempPage);
                for (const user of tempData.users) {
                    if (user.total_score !== gamificationScore) {
                        tempPage = totalPages;
                        break;
                    }
                    if (this.normalizeFirstChar(user.username) === normalizedTargetName) {
                        return user.position;
                    }
                }
                tempPage++;
                await this.delay(100);
            }

            return "未查询到";
        }

        normalizeFirstChar(name) {
            return name.charAt(0).toLowerCase() + name.slice(1);
        }

        // 本地存储相关方法
        async resetLocalStorageIfNeeded() {
            const storedDate = localStorage.getItem(this.STORAGE_KEYS.DATE);
            const now = new Date();

            if (!storedDate || this.isOlderThanToday(new Date(storedDate))) {
                localStorage.setItem(this.STORAGE_KEYS.COUNTS, '0');
                localStorage.setItem(this.STORAGE_KEYS.TOPIC, JSON.stringify([]));
                localStorage.setItem(this.STORAGE_KEYS.DATE, now.toISOString());
                localStorage.setItem('timeSpent', '0');
                return true;
            }
            return false;
        }

        handleTimingsRequest(count, topicId) {
            const now = new Date();
            const todayStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
            let storedCounts = parseInt(localStorage.getItem(this.STORAGE_KEYS.COUNTS), 10) || 0;
            const storedDate = localStorage.getItem(this.STORAGE_KEYS.DATE) || '';
            let storedTopics = this.getStoredTopics();

            if (storedDate !== todayStr) {
                storedCounts = 0;
                storedTopics = [];
            }

            if (!storedTopics.includes(topicId)) {
                storedTopics.push(topicId);
            }

            storedCounts += count;

            localStorage.setItem(this.STORAGE_KEYS.COUNTS, storedCounts);
            localStorage.setItem(this.STORAGE_KEYS.DATE, todayStr);
            localStorage.setItem(this.STORAGE_KEYS.TOPIC, JSON.stringify(storedTopics));
        }

        getCsrfToken() {
            const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
            return csrfTokenMeta ? csrfTokenMeta.content : '';
        }

        // 修改 countAllTodaysActions 方法
        async countAllTodaysActions(queryUsername) {
            this.isQuerying = true;
            this.button.innerText = '.......';
            this.button.disabled = true;

            try {
                const user = queryUsername || this.username;
                const likesGiven = await this.countTodaysActions(user, 1);
                await this.delay(300);
                const repliesMadeData = await this.countTodaysActions(user, 5, true);
                await this.delay(300);

                let message;
                if(!likesGiven.queryData) {
                    message = `👻这个佬友什么也没有留下~`;
                } else {
                    message = `
                        ❤️ 送出爱心: ${likesGiven.actionCount}<br>
                        💬 回复帖子: ${repliesMadeData.actionCount}<br>
                        🗂️ 回复话题: ${repliesMadeData.uniqueTopicCount}
                    `;

                    if (queryUsername) {
                        const { isOnline, gamificationScore } = await this.checkUserOnline(queryUsername);
                        await this.delay(100);
                        const position = await this.findUserPosition(queryUsername, gamificationScore);

                        message += `
                            <br>📟 佬友状态: ${isOnline ? '在线🙉' : '离线🙈'}
                            <br>🏅 冲浪排名: ${position}
                            <br>🏄 最后冲浪: <a href="https://linux.do/t/topic/${repliesMadeData.firstAction.topic_id}/${repliesMadeData.firstAction.post_number}">${repliesMadeData.firstAction.title}</a>
                        `;
                    } else {
                        const likesReceived = await this.countTodaysActions(user, 2);
                        await this.delay(300);
                        const reactionsReceived = await this.countTodaysReactionsReceived(user);
                        await this.delay(300);
                        const reactionsGiven = await this.countTodaysReactionsGiven(user);
                        await this.delay(300);

                        const timingsCount = parseInt(localStorage.getItem(this.STORAGE_KEYS.COUNTS), 10) || 0;
                        const timingsTotalTime = parseInt(localStorage.getItem('timeSpent'), 10) || 0;
                        const storedTopics = this.getStoredTopics();

                        const hours = Math.floor(timingsTotalTime / 3600);
                        const minutes = Math.floor((timingsTotalTime % 3600) / 60);
                        const seconds = timingsTotalTime % 3600 % 60;

                        message += `
                            <br>🥰 收到爱心: ${likesReceived.actionCount}<br>
                            🤩 收到回应: ${reactionsReceived || 0}<br>
                            👏 给出回应: ${reactionsGiven || 0}<br>
                            📖 阅读话题: ${storedTopics.length}<br>
                            ⏱️ 阅读帖子: ${timingsCount}<br>
                            🕒 停留时间: ${hours}时${minutes}分${seconds}秒
                        `;
                    }
                }

                this.resultContainer.innerHTML = message;
                this.resultContainer.style.display = 'block';
            } catch (error) {
                console.error('Error in countAllTodaysActions:', error);
                this.resultContainer.innerHTML = '查询出错，请稍后试';
                this.resultContainer.style.display = 'block';
            } finally {
                this.isQuerying = false;
                this.button.innerText = '';
                this.button.disabled = false;
                this.createBeforeElement(this.button);
            }
        }

        initTimingsMonitor() {
            const self = this;
            const originalXHROpen = XMLHttpRequest.prototype.open;
            const originalXHRSend = XMLHttpRequest.prototype.send;

            XMLHttpRequest.prototype.open = function(...args) {
                const url = args[1];
                this._url = url;
                if (url === '/topics/timings') {
                    const startTime = performance.now();
                    this.addEventListener('readystatechange', function() {
                        if (this.readyState === XMLHttpRequest.DONE) {
                            const endTime = performance.now();
                            const duration = endTime - startTime;
                        }
                    });
                }
                return originalXHROpen.apply(this, args);
            };

            XMLHttpRequest.prototype.send = function(body) {
                if (this._url === '/topics/timings') {
                    self.processTimingsRequest(body);
                }
                return originalXHRSend.call(this, body);
            };
        }

        processTimingsRequest(body) {
            if (typeof body === 'string') {
                try {
                    const params = new URLSearchParams(body);
                    let timings = 0;
                    let topicTime = 0;
                    let topicId = 0;
                    let topicCount = 0;

                    for (const [key, value] of params.entries()) {
                        if (key.startsWith('timings[')) {
                            timings += parseInt(value);
                            topicCount += 1;
                        }
                        if (key.startsWith('topic_time')) {
                            topicTime = parseInt(value);
                        }
                        if (key.startsWith('topic_id')) {
                            topicId = parseInt(value);
                        }
                    }
                    this.handleTimingsRequest(topicCount, topicId);
                } catch (error) {
                    console.error('Error processing form data:', error);
                }
            }
        }

        async checkUserOnline(username) {
            try {
                const csrfToken = this.getCsrfToken();
                const url = `https://linux.do/u/${username}/card.json`;
                // 构建请求头
                const headers = new Headers();
                // 添加需要的请求头
                headers.append('Accept', 'application/json, text/javascript, */*; q=0.01');
                headers.append('Discourse-Logged-In', 'true');
                headers.append('Discourse-Present', 'true');
                headers.append('Referer', 'https://linux.do');
                headers.append('Sec-Ch-Ua', '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"');
                headers.append('Sec-Ch-Ua-Mobile', '?0');
                headers.append('Sec-Ch-Ua-Platform', '"Windows"');
                headers.append('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');
                headers.append('X-Csrf-Token', csrfToken);
                headers.append('X-Requested-With', 'XMLHttpRequest');

                // 发送请求
                const response = await fetch(url, {
                    method: 'GET',
                    headers: headers,
                });

                const userData = await response.json();
                const lastSeenTime = new Date(userData.user.last_seen_at);
                const currentTime = new Date();
                const timeDifference = currentTime - lastSeenTime;
                const minutesDifference = timeDifference / (1000 * 60);

                // 用户在线状态
                const isOnline = minutesDifference <= 5;

                // 用户点数
                const gamificationScore = userData.user.gamification_score;

                return {
                    isOnline,
                    gamificationScore
                };
            } catch (error) {
                console.error("Error checking user online status:", error);
                return {
                    isOnline: false,
                    gamificationScore: null
                };
            }
        }

        createBeforeElement(button) {
            const buttonContent = document.createElement('span');
            buttonContent.innerText = '查询';
            buttonContent.style.position = 'relative';
            buttonContent.style.zIndex = '1';
            button.appendChild(buttonContent);

            const beforeElement = document.createElement('span');
            beforeElement.setAttribute('id', 'myBeforeElement');
            beforeElement.style.position = 'absolute';
            beforeElement.style.top = '0';
            beforeElement.style.left = '0';
            beforeElement.style.transform = 'scaleX(0)';
            beforeElement.style.transformOrigin = '0 50%';
            beforeElement.style.width = '100%';
            beforeElement.style.height = '100%';
            beforeElement.style.borderRadius = 'inherit';
            beforeElement.style.background = 'linear-gradient(82.3deg, rgba(150, 93, 233, 1) 10.8%, rgba(99, 88, 238, 1) 94.3%)';
            beforeElement.style.transition = 'all 0.475s';
            beforeElement.style.zIndex = '0';

            button.style.position = 'relative'; // 确保按钮具有相对定位
            button.insertBefore(beforeElement, button.firstChild);

            return beforeElement;
        }

        initButtonHoverEffects() {
            const beforeElement = document.getElementById('myBeforeElement');
            if (beforeElement) {
                this.button.addEventListener('mouseover', () => {
                    beforeElement.style.transform = 'scaleX(1)';
                });

                this.button.addEventListener('mouseout', () => {
                    beforeElement.style.transform = 'scaleX(0)';
                });
            }
        }

    } // UserActivityTracker 类结束

    // 将初始化类定义
    const initializeApp = () => {
        // 初始化按钮管理器
        window.buttonManager = new ButtonManager(BUTTON_CONFIG);

        // 初始化功能模块
        window.connectDataFetcher = new ConnectDataFetcher();
        window.trendingSidebar = new TrendingSidebar();
        window.chatRoom = new ChatRoom();
        window.userActivityTracker = new UserActivityTracker();
    };

    // 添加 load 事件监听器
    window.addEventListener('load', initializeApp);

})();
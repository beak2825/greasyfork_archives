// ==UserScript==
// @name         nodeLoc Level
// @version      0.0.1
// @description  Enhanced script to track progress towards next trust level on nodeloc.cc with added search functionality, adjusted posts read limit, and a breathing icon animation.
// @author       Alterem
// @match        https://nodeloc.cc/*
// @icon         https://www.google.com/s2/favicons?domain=nodeloc.cc
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/991002
// @downloadURL https://update.greasyfork.org/scripts/535307/nodeLoc%20Level.user.js
// @updateURL https://update.greasyfork.org/scripts/535307/nodeLoc%20Level.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONSTANTS = {
        BREATH_ANIMATION_DURATION: 4,
        MINIMIZED_WIDTH: '60px',
        MINIMIZED_HEIGHT: '50px',
        NORMAL_WIDTH: '280px',
        NORMAL_HEIGHT: 'auto',
        DEFAULT_POPUP_BOTTOM: '20px',
        DEFAULT_POPUP_RIGHT: '20px',
        ACCENT_COLOR: '#9AC5AA'
    };

    const StyleManager = {
        styles: `
            @keyframes breathAnimation {
                0%, 100% { transform: scale(1); box-shadow: 0 0 5px ${CONSTANTS.ACCENT_COLOR}; }
                50% { transform: scale(1.1); box-shadow: 0 0 10px ${CONSTANTS.ACCENT_COLOR}; }
            }
            .breath-animation { animation: breathAnimation ${CONSTANTS.BREATH_ANIMATION_DURATION}s ease-in-out infinite; }
            .minimized { border-radius: 50%; cursor: pointer; }
            .nodeLocLevelPopup { position: fixed; width: ${CONSTANTS.NORMAL_WIDTH}; height: ${CONSTANTS.NORMAL_HEIGHT}; background: var(--d-sidebar-background); box-shadow: 0 0 10px rgba(0,0,0,0.5); padding: 15px; z-index: 10000; font-size: 14px; border-radius: 5px; cursor: move; }
            .nodeLocLevelPopup input, .nodeLocLevelPopup button { width: 100%; margin-top: 10px; }
            .nodeLocLevelPopup button {
                cursor: pointer;
                background-color: ${CONSTANTS.ACCENT_COLOR};
                color: #fff;
                border: none;
                padding: 8px 12px;
                border-radius: 4px;
                transition: background-color 0.3s ease;
            }
            .nodeLocLevelPopup button:hover {
                background-color: #7bb398;
            }
            .minimizeButton { position: absolute; top: 5px; right: 5px; background: transparent; border: none; cursor: pointer; width: 30px; height: 30px; font-size: 16px; }
            .searchButton { width: 100%; marginTop: 10px }
            .searchBox { width: 100%; marginTop: 10px }
            .minimized-width { width: ${CONSTANTS.MINIMIZED_WIDTH} !important; }
            .minimized-height { height: ${CONSTANTS.MINIMIZED_HEIGHT} !important; }
            .hidden { display: none !important; }
            .loading { text-align: center; padding: 10px; }
            .error { color: red; padding: 10px; }
        `,

        injectStyles: function() {
            const styleSheet = document.createElement('style');
            styleSheet.type = 'text/css';
            styleSheet.innerText = this.styles;
            document.head.appendChild(styleSheet);
        }
    };

    const DataManager = {
        Config: {
            BASE_URL: 'https://nodeloc.cc',
            PATHS: {
                ABOUT: '/about.json',
                USER_SUMMARY: '/u/{username}/summary.json',
                USER_DETAIL: '/u/{username}.json',
            },
        },

        cache: new Map(),

        levelRequirements: {
            0: { 'topics_entered': 5, 'posts_read_count': 30, 'time_read': 600 },
            1: { 'days_visited': 15, 'likes_given': 1, 'likes_received': 1, 'post_count': 3, 'topics_entered': 20, 'posts_read_count': 100, 'time_read': 3600 },
            2: { 'days_visited': 50, 'likes_given': 30, 'likes_received': 20, 'post_count': 10 },
        },

        levelDescriptions: {
            0: "白银会员",
            1: "黄金会员",
            2: "钻石会员",
            3: "王者会员",
            4: "遥不可及"
        },

        async fetch(url, options = {}) {
            if (this.cache.has(url)) {
                const {data, timestamp} = this.cache.get(url);
                if (Date.now() - timestamp < 600000) {
                    return data;
                }
            }

            try {
                const response = await fetch(url, {
                    ...options,
                    headers: {
                        "Accept": "application/json",
                        "User-Agent": "Mozilla/5.0"
                    },
                    method: options.method || "GET"
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                this.cache.set(url, {
                    data,
                    timestamp: Date.now()
                });

                return data;
            } catch (error) {
                console.error(`Error fetching data from ${url}:`, error);
                throw error;
            }
        },

        fetchAboutData: function() {
            const url = this.buildUrl(this.Config.PATHS.ABOUT);
            return this.fetch(url);
        },

        fetchSummaryData: function(username) {
            const url = this.buildUrl(this.Config.PATHS.USER_SUMMARY, { username });
            return this.fetch(url);
        },

        fetchUserData: function(username) {
            const url = this.buildUrl(this.Config.PATHS.USER_DETAIL, { username });
            return this.fetch(url);
        },

        buildUrl: function(path, params = {}) {
            let url = this.Config.BASE_URL + path;
            Object.keys(params).forEach(key => {
                url = url.replace(`{${key}}`, encodeURIComponent(params[key]));
            });
            return url;
        },
    };

    const UIManager = {
        initPopup: function() {
            this.popup = this.createElement('div', { id: 'nodeLocLevelPopup', class: 'nodeLocLevelPopup' });
            this.content = this.createElement('div', { id: 'nodeLocLevelPopupContent' }, '欢迎使用 nodeLoc 等级增强插件');
            this.searchBox = this.createElement('input', { placeholder: '请输入用户名...', type: 'text', class: 'searchBox' });
            this.searchButton = this.createElement('button', { class: 'searchButton' }, '搜索');
            this.minimizeButton = this.createElement('button', { }, '隐藏');

            this.popup.style.bottom = CONSTANTS.DEFAULT_POPUP_BOTTOM;
            this.popup.style.right = CONSTANTS.DEFAULT_POPUP_RIGHT;

            this.searchButton.classList.add('btn', 'btn-icon-text', 'btn-default');
            this.minimizeButton.classList.add('btn', 'btn-icon-text', 'btn-default');

            this.popup.append(this.content, this.searchBox, this.searchButton, this.minimizeButton);
            document.body.appendChild(this.popup);

            this.minimizeButton.addEventListener('click', () => this.togglePopupSize());
            this.searchButton.addEventListener('click', () => EventHandler.debouncedHandleSearch());
            this.searchBox.addEventListener('keypress', (event) => {
                if (event.key === 'Enter' && !this.popup.classList.contains('minimized')) {
                    EventHandler.debouncedHandleSearch();
                }
            });

            this.autoFillUsername();
        },

        autoFillUsername: function() {
            const checkUser = () => {
                try {
                    if (typeof Discourse !== 'undefined' &&
                        Discourse.User &&
                        Discourse.User.current()) {
                        const user = Discourse.User.current();
                        if (user && user.username) {
                            this.searchBox.value = user.username;
                            return true;
                        }
                    }
                    return false;
                } catch (error) {
                    console.error("Error getting username:", error);
                    return false;
                }
            };

            if (checkUser()) return;

            let attempts = 0;
            const maxAttempts = 10;
            const interval = setInterval(() => {
                attempts++;
                if (checkUser() || attempts >= maxAttempts) {
                    clearInterval(interval);
                }
            }, 1000);
        },

        createElement: function(tag, attributes, text) {
            const element = document.createElement(tag);
            for (const attr in attributes) {
                if (attr === 'class') {
                    element.classList.add(attributes[attr]);
                } else {
                    element.setAttribute(attr, attributes[attr]);
                }
            }
            if (text) element.textContent = text;
            return element;
        },

        updatePopupContent: function(userSummary, user, userDetail, status) {
            if (!userSummary || !user || !userDetail) return;

            let content = `<strong>信任等级：</strong>${DataManager.levelDescriptions[user.trust_level]}<br>`;
            const requirements = DataManager.levelRequirements[user.trust_level] || {};

            if (userDetail.invited_by) {
                content += `<strong>邀请人：</strong>${userDetail.invited_by.username}<br>`;
            } else {
                content += `<strong>邀请人：</strong>无<br>`;
            }

            content += `<strong>最近活跃：</strong>${formatTimestamp(userDetail.last_seen_at)}<br>  <strong>升级进度：</strong><br>`;

            if (user.trust_level === 2) {
                requirements['posts_read_count'] = Math.min(parseInt(parseInt(status.posts_30_days) / 4), 20000);
                requirements['topics_entered'] = Math.min(parseInt(parseInt(status.topics_30_days) / 4), 500);
            }

            if (user.trust_level === 3) {
                content += '联系管理员进行py交易以升级到领导者<br>';
            } else if (user.trust_level === 4) {
                content += '您已是最高信任等级<br>';
            } else {
                let summary = summaryRequired(requirements, userSummary, this.translateStat.bind(this));
                content += summary;
            }
            this.content.innerHTML = content;
        },

        async togglePopupSize() {
            this.popup.classList.toggle('minimized');
            this.popup.classList.toggle('breath-animation');
            this.popup.classList.toggle('minimized-width');
            this.popup.classList.toggle('minimized-height');
            this.content.classList.toggle('hidden');
            this.searchBox.classList.toggle('hidden');
            this.searchButton.classList.toggle('hidden');
            this.minimizeButton.textContent = this.popup.classList.contains('minimized') ? '展开' : '隐藏';

            // 如果是展开状态且有用户名,自动搜索
            if (!this.popup.classList.contains('minimized') && this.searchBox.value.trim()) {
                await EventHandler.handleSearch();
            }

            enableDraggable(this.popup);
            this.correctPopupPosition();
        },

        correctPopupPosition: function() {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const popupWidth = this.popup.offsetWidth;
            const popupHeight = this.popup.offsetHeight;
            const popupTop = parseInt(this.popup.style.top);
            const popupLeft = parseInt(this.popup.style.left);

            let newTop = popupTop;
            let newLeft = popupLeft;

            newTop = Math.min(Math.max(70, popupTop), windowHeight - popupHeight);
            newLeft = Math.min(Math.max(5, popupLeft), windowWidth - popupWidth - 20);

            this.popup.style.top = newTop + 'px';
            this.popup.style.left = newLeft + 'px';
        },

        displayError: function(message) {
            this.content.innerHTML = `<div class="error">${message}</div>`;
        },

        displayLoading: function() {
            this.content.innerHTML = '<div class="loading">加载中...</div>';
        },

        translateStat: function(stat) {
            const translations = {
                'days_visited': '访问天数',
                'likes_given': '给出的赞',
                'likes_received': '收到的赞',
                'post_count': '帖子数量',
                'posts_read_count': '已读帖子',
                'topics_entered': '已读主题',
                'time_read': '阅读时间(秒)'
            };
            return translations[stat] || stat;
        }
    };

    const EventHandler = {
        debounce: function(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },

        handleSearch: async function() {
            const username = UIManager.searchBox.value.trim();
            if (!username) return;

            UIManager.displayLoading();

            try {
                const [aboutData, summaryData, userData] = await Promise.all([
                    DataManager.fetchAboutData(),
                    DataManager.fetchSummaryData(username),
                    DataManager.fetchUserData(username)
                ]);

                if (summaryData && userData && aboutData) {
                    UIManager.updatePopupContent(
                        summaryData.user_summary,
                        summaryData.users ? summaryData.users[0] : { 'trust_level': 0 },
                        userData.user,
                        aboutData.about.stats
                    );
                }
            } catch (error) {
                console.error(error);
                UIManager.displayError("获取用户数据失败: " + (error.message || '未知错误'));
            }
        },

        debouncedHandleSearch: null,
    };

    function formatTimestamp(lastSeenAt) {
        let timestamp = new Date(lastSeenAt);

        let formatter = new Intl.DateTimeFormat('zh-CN', {
            timeZone: 'Asia/Shanghai',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        });

        return formatter.format(timestamp);
    }

    function summaryRequired(required, current, translateStat) {
        let summary = '';
        let allMet = true;

        for (const stat in required) {
            if (required.hasOwnProperty(stat) && current.hasOwnProperty(stat)) {
                const reqValue = required[stat];
                const curValue = current[stat] || 0;
                if (curValue < reqValue) {
                    allMet = false;
                    const diff = reqValue - curValue;
                    summary += `${translateStat(stat)}: <span style="color: red;"> ${curValue} < ${reqValue}，还差 ${diff}</span><br>`;
                } else {
                    summary += `${translateStat(stat)}: <span style="color: green;"> ${curValue} ≥ ${reqValue}，已合格</span><br>`;
                }
            }
        }

        if (allMet) {
            return "恭喜您！所有项次都已达到合格标准。<br>" + summary;
        } else {
            return summary;
        }
    }

    function enableDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        const dragMouseDown = function(e) {
            if (e.target.tagName.toUpperCase() === 'INPUT' ||
                e.target.tagName.toUpperCase() === 'TEXTAREA' ||
                e.target.tagName.toUpperCase() === 'BUTTON') {
                return;
            }

            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        };

        const elementDrag = function(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.bottom = '';
            element.style.right = '';
        };

        const closeDragElement = function() {
            document.onmouseup = null;
            document.onmousemove = null;
        };

        element.onmousedown = dragMouseDown;
    }

    const init = () => {
        StyleManager.injectStyles();
        UIManager.initPopup();
        enableDraggable(document.getElementById('nodeLocLevelPopup'));

        EventHandler.debouncedHandleSearch = EventHandler.debounce(EventHandler.handleSearch, 300);

        UIManager.togglePopupSize();
    };

    init();
})();

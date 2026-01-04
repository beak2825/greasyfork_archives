// ==UserScript==
// @name         linux.do 小助手
// @description  自动浏览、点赞、只看楼主、楼层号。默认悬浮球，点击展开。
// @namespace    Violentmonkey Scripts
// @match        https://linux.do/*
// @grant        none
// @version      1.0.2
// @author       quantumcat & nulluser & Optimized
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=linux.do
// @downloadURL https://update.greasyfork.org/scripts/532402/linuxdo%20%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/532402/linuxdo%20%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 配置项
const CONFIG = {
    scroll: {
        minSpeed: 10,
        maxSpeed: 15,
        minDistance: 2,
        maxDistance: 4,
        checkInterval: 500,
        fastScrollChance: 0.08,
        fastScrollMin: 80,
        fastScrollMax: 200
    },
    time: {
        browseTime: 3600000,
        restTime: 600000,
        minPause: 300,
        maxPause: 500,
        loadWait: 1500,
    },
    article: {
        commentLimit: 1000,
        topicListLimit: 100,
        retryLimit: 3
    },
    mustRead: {
        posts: [
            { id: '1051', url: 'https://linux.do/t/topic/1051/' },
            { id: '5973', url: 'https://linux.do/t/topic/5973' },
            { id: '102770', url: 'https://linux.do/t/topic/102770' },
            { id: '154010', url: 'https://linux.do/t/topic/154010' },
            { id: '149576', url: 'https://linux.do/t/topic/149576' },
            { id: '22118', url: 'https://linux.do/t/topic/22118' },
        ],
        likesNeeded: 5
    }
};

// 工具函数
const Utils = {
    random: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    isPageLoaded: () => {
        const loadingElements = document.querySelectorAll('.loading, .infinite-scroll');
        return loadingElements.length === 0;
    },
    isNearBottom: () => {
        const {scrollHeight, clientHeight, scrollTop} = document.documentElement;
        return (scrollTop + clientHeight) >= (scrollHeight - 200);
    },
    debounce: (func, wait) => {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
};

// 存储管理
const Storage = {
    get: (key, defaultValue = null) => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch {
            return defaultValue;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    }
};

class BrowseController {
    constructor() {
        this.isScrolling = false;
        this.scrollInterval = null;
        this.pauseTimeout = null;
        this.accumulatedTime = Storage.get('accumulatedTime', 0);
        this.lastActionTime = Date.now();
        this.isTopicPage = window.location.href.includes("/t/topic/");
        this.autoRunning = Storage.get('autoRunning', false);
        this.topicList = Storage.get('topicList', []);
        this.firstUseChecked = Storage.get('firstUseChecked', false);
        this.likesCount = Storage.get('likesCount', 0);
        this.selectedPost = Storage.get('selectedPost', null);
        this.autoLikeEnabled = Storage.get('autoLikeEnabled', false);
        this.likedTopics = Storage.get('likedTopics', []);

        // 状态变量：菜单是否展开
        this.isMenuExpanded = false;

        this.setupUI();
        this.initFloorNumberDisplay();
        this.initOnlyOwnerView();

        if (!this.firstUseChecked) {
            this.handleFirstUse();
        } else if (this.autoRunning) {
            if (this.isTopicPage) {
                this.startScrolling();
                if (this.autoLikeEnabled) {
                    this.autoLikeTopic();
                }
            } else {
                this.getLatestTopics().then(() => this.navigateNextTopic());
            }
        }

        if (this.autoLikeEnabled && this.isTopicPage) {
            this.autoLikeTopic();
        }
    }

    // --- UI 构建部分 ---

    setupUI() {
        // 主容器
        this.container = document.createElement("div");
        Object.assign(this.container.style, {
            position: "fixed",
            right: "20px",
            bottom: "40%",
            zIndex: "9999",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end"
        });

        // 1. 创建菜单面板 (默认隐藏)
        this.menuPanel = document.createElement("div");
        Object.assign(this.menuPanel.style, {
            display: "none",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "15px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            backdropFilter: "blur(5px)",
            minWidth: "160px"
        });

        // 2. 创建主控制按钮 (开始/停止)
        this.actionButton = document.createElement("button");
        Object.assign(this.actionButton.style, {
            padding: "10px 0",
            width: "100%",
            fontSize: "14px",
            fontWeight: "bold",
            backgroundColor: this.autoRunning ? "#ff6b6b" : "#4caf50",
            border: "none",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
            transition: "all 0.3s"
        });
        this.actionButton.textContent = this.autoRunning ? "停止阅读" : "开始阅读";
        this.actionButton.onclick = () => this.handleButtonClick();

        // 3. 创建设置项
        const createSwitch = (labelText, isChecked, onChange) => {
            const wrapper = document.createElement("div");
            Object.assign(wrapper.style, {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "5px 0",
                borderBottom: "1px solid #eee"
            });

            const label = document.createElement("label");
            label.textContent = labelText;
            label.style.fontSize = "13px";
            label.style.color = "#333";
            label.style.cursor = "pointer";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = isChecked;
            checkbox.style.cursor = "pointer";
            checkbox.onchange = onChange;

            label.onclick = () => checkbox.click();

            wrapper.appendChild(label);
            wrapper.appendChild(checkbox);
            return wrapper;
        };

        const autoLikeSwitch = createSwitch("自动点赞主题", this.autoLikeEnabled, (e) => {
            this.autoLikeEnabled = e.target.checked;
            Storage.set('autoLikeEnabled', this.autoLikeEnabled);
            if (this.autoLikeEnabled && this.isTopicPage) this.autoLikeTopic();
        });

        // 组装菜单
        this.menuPanel.appendChild(this.actionButton);
        this.menuPanel.appendChild(autoLikeSwitch);

        // 4. 创建悬浮球
        this.floatBall = document.createElement("div");
        Object.assign(this.floatBall.style, {
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            backgroundColor: this.autoRunning ? "#ff6b6b" : "#4caf50",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            color: "white",
            fontWeight: "bold",
            fontSize: "14px",
            userSelect: "none",
            transition: "transform 0.2s, background-color 0.3s"
        });
        this.floatBall.textContent = "助手";
        this.floatBall.title = "点击展开/收起助手菜单";

        this.floatBall.onmouseover = () => this.floatBall.style.transform = "scale(1.1)";
        this.floatBall.onmouseout = () => this.floatBall.style.transform = "scale(1.0)";
        this.floatBall.onclick = () => {
            this.isMenuExpanded = !this.isMenuExpanded;
            this.menuPanel.style.display = this.isMenuExpanded ? "flex" : "none";
        };

        this.container.appendChild(this.menuPanel);
        this.container.appendChild(this.floatBall);
        document.body.appendChild(this.container);
    }

    updateUIState() {
        const color = this.autoRunning ? "#ff6b6b" : "#4caf50";
        const text = this.autoRunning ? "停止阅读" : "开始阅读";

        this.actionButton.style.backgroundColor = color;
        this.actionButton.textContent = text;
        this.floatBall.style.backgroundColor = color;
    }

    // --- 核心逻辑部分 ---

    initOnlyOwnerView() {
        this.createToggleButton();
        this.observePageChanges();
        this.toggleVisibility();
    }

    toggleVisibility() {
        const displayMode = localStorage.getItem("on_off") || "当前查看全部";
        const userId = document.getElementById("post_1")?.getAttribute('data-user-id');
        if (userId) {
            document.querySelectorAll('article').forEach(article => {
                article.style.display = (displayMode === "当前只看楼主" && article.dataset.userId !== userId) ? 'none' : '';
            });
        }
    }

    createToggleButton() {
        if (document.getElementById("toggleVisibilityBtn")) return;

        const btn = document.createElement("button");
        btn.id = "toggleVisibilityBtn";
        btn.textContent = localStorage.getItem("on_off") || "当前查看全部";
        btn.onclick = () => {
            const newText = btn.textContent === '当前查看全部' ? '当前只看楼主' : '当前查看全部';
            document.getElementsByClassName("start-date")[0]?.click();
            btn.textContent = newText;
            localStorage.setItem("on_off", newText);
            this.toggleVisibility();
        };

        Object.assign(btn.style, {
            backgroundColor: "#333", color: "#FFF", border: "none",
            padding: "8px 16px", marginLeft: "10px", borderRadius: "5px", cursor: "pointer",
            marginTop: "10px"
        });

        // 简化的插入逻辑：直接插入到楼主帖子的内容底部
        const firstPostContent = document.querySelector('.boxed.onscreen-post[data-post-id] .cooked');
        if (firstPostContent) {
            firstPostContent.appendChild(btn);
        }
    }

    observePageChanges() {
        const observer = new MutationObserver(() => {
            if (document.querySelector(".timeline-footer-controls") && !document.getElementById("toggleVisibilityBtn")) {
                this.createToggleButton();
            }
            this.toggleVisibility();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    initFloorNumberDisplay() {
        this.addFloorNumbers();
        this.initMutationObserver();
        this.monitorURLChange();
    }

    addFloorNumbers() {
        document.querySelectorAll('.boxed.onscreen-post').forEach((post) => {
            if (!post.querySelector('.floor-number')) {
                const floorNumber = document.createElement('div');
                floorNumber.className = 'floor-number';
                floorNumber.textContent = '楼层: ' + post.id.split("_")[1];
                floorNumber.style.cssText = 'color: grey; margin-left: 10px;';
                post.querySelector('.topic-meta-data').appendChild(floorNumber);
            }
        });
    }

    initMutationObserver() {
        const observer = new MutationObserver(() => {
            this.addFloorNumbers();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    monitorURLChange() {
        let lastURL = location.href;
        setInterval(() => {
            const currentURL = location.href;
            if (currentURL !== lastURL) {
                lastURL = currentURL;
                this.isTopicPage = /^https:\/\/linux\.do\/t\/topic\//.test(currentURL);
                if (this.autoLikeEnabled && this.isTopicPage) {
                    this.autoLikeTopic();
                }
            }
        }, 1000);
    }

    handleButtonClick() {
        if (this.isScrolling || this.autoRunning) {
            this.stopScrolling();
            this.autoRunning = false;
            Storage.set('autoRunning', false);
        } else {
            this.autoRunning = true;
            Storage.set('autoRunning', true);
            if (!this.firstUseChecked) {
                this.handleFirstUse();
            } else if (this.isTopicPage) {
                this.startScrolling();
                if (this.autoLikeEnabled) this.autoLikeTopic();
            } else {
                this.getLatestTopics().then(() => this.navigateNextTopic());
            }
        }
        this.updateUIState();
    }

    async autoLikeTopic() {
        if (!this.autoLikeEnabled) return;
        const match = window.location.pathname.match(/\/t\/topic\/(\d+)/);
        if (!match) return;
        const topicId = match[1];

        if (this.likedTopics.includes(topicId)) return;
        await Utils.sleep(2000);

        const likeButton = document.querySelector('div.discourse-reactions-reaction-button button.btn-toggle-reaction-like');
        if (likeButton && !likeButton.classList.contains('has-like') && !likeButton.classList.contains('liked')) {
            likeButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await Utils.sleep(1000);
            likeButton.click();
            this.likedTopics.push(topicId);
            Storage.set('likedTopics', this.likedTopics);
        } else if (likeButton && (likeButton.classList.contains('has-like') || likeButton.classList.contains('liked'))) {
            if (!this.likedTopics.includes(topicId)) {
                this.likedTopics.push(topicId);
                Storage.set('likedTopics', this.likedTopics);
            }
        }
    }

    async handleFirstUse() {
        if (!this.autoRunning) return;
        if (!this.selectedPost) {
            const randomIndex = Math.floor(Math.random() * CONFIG.mustRead.posts.length);
            this.selectedPost = CONFIG.mustRead.posts[randomIndex];
            Storage.set('selectedPost', this.selectedPost);
            window.location.href = this.selectedPost.url;
            return;
        }

        if (window.location.href.includes(this.selectedPost.url)) {
            while (this.likesCount < CONFIG.mustRead.likesNeeded && this.autoRunning) {
                await this.likeRandomComment();
                if (this.likesCount >= CONFIG.mustRead.likesNeeded) {
                    Storage.set('firstUseChecked', true);
                    this.firstUseChecked = true;
                    await this.getLatestTopics();
                    await this.navigateNextTopic();
                    break;
                }
                await Utils.sleep(1000);
            }
        } else {
            window.location.href = this.selectedPost.url;
        }
    }

    async likeRandomComment() {
        if (!this.autoRunning) return false;
        const likeButtons = Array.from(document.querySelectorAll('.like-button, .like-count, [data-like-button], .discourse-reactions-reaction-button'))
            .filter(button => button && button.offsetParent !== null && !button.classList.contains('has-like') && !button.classList.contains('liked'));

        if (likeButtons.length > 0) {
            const randomButton = likeButtons[Math.floor(Math.random() * likeButtons.length)];
            randomButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await Utils.sleep(1000);
            if (!this.autoRunning) return false;
            randomButton.click();
            this.likesCount++;
            Storage.set('likesCount', this.likesCount);
            await Utils.sleep(1000);
            return true;
        }
        window.scrollBy({ top: 500, behavior: 'smooth' });
        await Utils.sleep(1000);
        return false;
    }

    async getLatestTopics() {
        let page = 1, topicList = [], retryCount = 0;
        while (topicList.length < CONFIG.article.topicListLimit && retryCount < CONFIG.article.retryLimit) {
            try {
                const response = await fetch(`https://linux.do/latest.json?no_definitions=true&page=${page}`);
                const data = await response.json();
                if (data?.topic_list?.topics) {
                    const filteredTopics = data.topic_list.topics.filter(topic => topic.posts_count < CONFIG.article.commentLimit);
                    topicList.push(...filteredTopics);
                    page++;
                } else break;
            } catch (error) { retryCount++; await Utils.sleep(1000); }
        }
        this.topicList = topicList.slice(0, CONFIG.article.topicListLimit);
        Storage.set('topicList', this.topicList);
    }

    async getNextTopic() {
        if (this.topicList.length === 0) await this.getLatestTopics();
        if (this.topicList.length > 0) {
            const topic = this.topicList.shift();
            Storage.set('topicList', this.topicList);
            return topic;
        }
        return null;
    }

    async startScrolling() {
        if (this.isScrolling) return;
        this.isScrolling = true;
        this.updateUIState();
        this.lastActionTime = Date.now();

        while (this.isScrolling) {
            const speed = Utils.random(CONFIG.scroll.minSpeed, CONFIG.scroll.maxSpeed);
            const distance = Utils.random(CONFIG.scroll.minDistance, CONFIG.scroll.maxDistance);
            window.scrollBy({ top: distance * 2.5, behavior: 'smooth' });

            if (Utils.isNearBottom()) {
                await Utils.sleep(800);
                if (Utils.isNearBottom() && Utils.isPageLoaded()) {
                    await Utils.sleep(1000);
                    await this.navigateNextTopic();
                    break;
                }
            }
            await Utils.sleep(speed);
            this.accumulateTime();
            if (Math.random() < CONFIG.scroll.fastScrollChance) {
                window.scrollBy({ top: Utils.random(CONFIG.scroll.fastScrollMin, CONFIG.scroll.fastScrollMax), behavior: 'smooth' });
                await Utils.sleep(200);
            }
        }
    }

    stopScrolling() {
        this.isScrolling = false;
        clearInterval(this.scrollInterval);
        clearTimeout(this.pauseTimeout);
        this.updateUIState();
    }

    accumulateTime() {
        const now = Date.now();
        this.accumulatedTime += now - this.lastActionTime;
        Storage.set('accumulatedTime', this.accumulatedTime);
        this.lastActionTime = now;
        if (this.accumulatedTime >= CONFIG.time.browseTime) {
            this.accumulatedTime = 0;
            Storage.set('accumulatedTime', 0);
            this.pauseForRest();
        }
    }

    async pauseForRest() {
        this.stopScrolling();
        console.log("休息10分钟...");
        await Utils.sleep(CONFIG.time.restTime);
        this.startScrolling();
    }

    async navigateNextTopic() {
        const nextTopic = await this.getNextTopic();
        if (nextTopic) {
            const url = nextTopic.last_read_post_number ? `https://linux.do/t/topic/${nextTopic.id}/${nextTopic.last_read_post_number}` : `https://linux.do/t/topic/${nextTopic.id}`;
            window.location.href = url;
        } else {
            window.location.href = "https://linux.do/latest";
        }
    }
}

// 初始化
(function() {
    new BrowseController();
})();
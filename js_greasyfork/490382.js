// ==UserScript==
// @name        自动浏览linux.do,autoBrowse-linux.do
// @description 自动浏览linux.do的帖子和话题，智能滚动和加载检测
// @namespace   Violentmonkey Scripts
// @match       https://linux.do/*
// @grant       none
// @version     1.2.5
// @author      quantumcat
// @license     MIT
// @icon        https://www.google.com/s2/favicons?domain=linux.do
// @downloadURL https://update.greasyfork.org/scripts/490382/%E8%87%AA%E5%8A%A8%E6%B5%8F%E8%A7%88linuxdo%2CautoBrowse-linuxdo.user.js
// @updateURL https://update.greasyfork.org/scripts/490382/%E8%87%AA%E5%8A%A8%E6%B5%8F%E8%A7%88linuxdo%2CautoBrowse-linuxdo.meta.js
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
            {
                id: '1051',
                url: 'https://linux.do/t/topic/1051/'
            },
            {
                id: '5973',
                url: 'https://linux.do/t/topic/5973'
            },
            // 在这里添加更多文章
            {
                id: '102770',
                url: 'https://linux.do/t/topic/102770'
            },
            // 示例格式
            {
                id: '154010',
                url: 'https://linux.do/t/topic/154010'
            },
            {
                id: '149576',
                url: 'https://linux.do/t/topic/149576'
            },
            {
                id: '22118',
                url: 'https://linux.do/t/topic/22118'
            },
        ],
      likesNeeded: 5  // 需要点赞的数量
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

        this.setupButton();

        // 如果是第一次使用,先处理必读文章
        if (!this.firstUseChecked) {
            this.handleFirstUse();
        } else if (this.autoRunning) {
            if (this.isTopicPage) {
                this.startScrolling();
            } else {
                this.getLatestTopics().then(() => this.navigateNextTopic());
            }
        }
    }

    setupButton() {
        this.button = document.createElement("button");
        Object.assign(this.button.style, {
            position: "fixed",
            right: "15%",
            bottom: "30%",
            padding: "10px 20px",
            fontSize: "20px",
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "5px",
            color: "black",
            cursor: "pointer",
            zIndex: "9999",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
        });
        this.button.textContent = this.autoRunning ? "停止" : "开始阅读";
        this.button.addEventListener("click", () => this.handleButtonClick());
        document.body.appendChild(this.button);
    }

    async handleFirstUse() {
    if (!this.autoRunning) return; // 如果没有运行，直接返回

    // 如果还没有选择文章
    if (!this.selectedPost) {
        // 随机选择一篇必读文章
        const randomIndex = Math.floor(Math.random() * CONFIG.mustRead.posts.length);
        this.selectedPost = CONFIG.mustRead.posts[randomIndex];
        Storage.set('selectedPost', this.selectedPost);
        console.log(`随机选择文章: ${this.selectedPost.url}`);

        // 导航到选中的文章
        window.location.href = this.selectedPost.url;
        return;
    }

    const currentUrl = window.location.href;

    // 如果在选中的文章页面
    if (currentUrl.includes(this.selectedPost.url)) {
        console.log(`当前在选中的文章页面，已点赞数: ${this.likesCount}`);

        while (this.likesCount < CONFIG.mustRead.likesNeeded && this.autoRunning) {
            // 尝试点赞随机评论
            await this.likeRandomComment();

            if (this.likesCount >= CONFIG.mustRead.likesNeeded) {
                console.log('完成所需点赞数量，开始正常浏览');
                Storage.set('firstUseChecked', true);
                this.firstUseChecked = true;
                await this.getLatestTopics();
                await this.navigateNextTopic();
                break;
            }

            await Utils.sleep(1000); // 点赞间隔
        }
    } else {
        // 如果不在选中的文章页面，导航过去
        window.location.href = this.selectedPost.url;
    }
}

handleButtonClick() {
    if (this.isScrolling || this.autoRunning) {
        // 停止所有操作
        this.stopScrolling();
        this.autoRunning = false;
        Storage.set('autoRunning', false);
        this.button.textContent = "开始";
    } else {
        // 开始运行
        this.autoRunning = true;
        Storage.set('autoRunning', true);
        this.button.textContent = "停止";

        if (!this.firstUseChecked) {
            // 开始处理必读文章
            this.handleFirstUse();
        } else if (this.isTopicPage) {
            this.startScrolling();
        } else {
            this.getLatestTopics().then(() => this.navigateNextTopic());
        }
    }
}

async likeRandomComment() {
    if (!this.autoRunning) return false; // 如果停止运行，立即返回

    // 获取所有评论的点赞按钮
    const likeButtons = Array.from(document.querySelectorAll('.like-button, .like-count, [data-like-button], .discourse-reactions-reaction-button'))
        .filter(button =>
            button &&
            button.offsetParent !== null &&
            !button.classList.contains('has-like') &&
            !button.classList.contains('liked')
        );

    if (likeButtons.length > 0) {
        // 随机选择一个未点赞的按钮
        const randomButton = likeButtons[Math.floor(Math.random() * likeButtons.length)];
        // 滚动到按钮位置
        randomButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await Utils.sleep(1000);

        if (!this.autoRunning) return false; // 再次检查是否停止运行

        console.log('找到可点赞的评论，准备点赞');
        randomButton.click();
        this.likesCount++;
        Storage.set('likesCount', this.likesCount);
        await Utils.sleep(1000);
        return true;
    }

    // 如果找不到可点赞的按钮，往下滚动一段距离
    window.scrollBy({
        top: 500,
        behavior: 'smooth'
    });
    await Utils.sleep(1000);

    console.log('当前位置没有找到可点赞的评论，继续往下找');
    return false;
}

    async getLatestTopics() {
        let page = 1;
        let topicList = [];
        let retryCount = 0;

        while (topicList.length < CONFIG.article.topicListLimit && retryCount < CONFIG.article.retryLimit) {
            try {
                const response = await fetch(`https://linux.do/latest.json?no_definitions=true&page=${page}`);
                const data = await response.json();

                if (data?.topic_list?.topics) {
                    const filteredTopics = data.topic_list.topics.filter(topic =>
                        topic.posts_count < CONFIG.article.commentLimit
                    );
                    topicList.push(...filteredTopics);
                    page++;
                } else {
                    break;
                }
            } catch (error) {
                console.error('获取文章列表失败:', error);
                retryCount++;
                await Utils.sleep(1000);
            }
        }

        if (topicList.length > CONFIG.article.topicListLimit) {
            topicList = topicList.slice(0, CONFIG.article.topicListLimit);
        }

        this.topicList = topicList;
        Storage.set('topicList', topicList);
        console.log(`已获取 ${topicList.length} 篇文章`);
    }

    async getNextTopic() {
        if (this.topicList.length === 0) {
            await this.getLatestTopics();
        }

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
        this.button.textContent = "停止";
        this.lastActionTime = Date.now();

        while (this.isScrolling) {
            const speed = Utils.random(CONFIG.scroll.minSpeed, CONFIG.scroll.maxSpeed);
            const distance = Utils.random(CONFIG.scroll.minDistance, CONFIG.scroll.maxDistance);
            const scrollStep = distance * 2.5;

            window.scrollBy({
                top: scrollStep,
                behavior: 'smooth'
            });

            if (Utils.isNearBottom()) {
                await Utils.sleep(800);

                if (Utils.isNearBottom() && Utils.isPageLoaded()) {
                    console.log("已到达页面底部，准备导航到下一篇文章...");
                    await Utils.sleep(1000);
                    await this.navigateNextTopic();
                    break;
                }
            }

            await Utils.sleep(speed);
            this.accumulateTime();

            if (Math.random() < CONFIG.scroll.fastScrollChance) {
                const fastScroll = Utils.random(CONFIG.scroll.fastScrollMin, CONFIG.scroll.fastScrollMax);
                window.scrollBy({
                    top: fastScroll,
                    behavior: 'smooth'
                });
                await Utils.sleep(200);
            }
        }
    }

    async waitForPageLoad() {
        let attempts = 0;
        const maxAttempts = 5;

        while (attempts < maxAttempts) {
            if (Utils.isPageLoaded()) {
                return true;
            }
            await Utils.sleep(300);
            attempts++;
        }

        return false;
    }

    stopScrolling() {
        this.isScrolling = false;
        clearInterval(this.scrollInterval);
        clearTimeout(this.pauseTimeout);
        this.button.textContent = "开始";
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
        console.log("休息结束，继续浏览...");
        this.startScrolling();
    }

    async navigateNextTopic() {
        const nextTopic = await this.getNextTopic();
        if (nextTopic) {
            console.log("导航到新文章:", nextTopic.title);
            const url = nextTopic.last_read_post_number
                ? `https://linux.do/t/topic/${nextTopic.id}/${nextTopic.last_read_post_number}`
                : `https://linux.do/t/topic/${nextTopic.id}`;
            window.location.href = url;
        } else {
            console.log("没有更多文章，返回首页");
            window.location.href = "https://linux.do/latest";
        }
    }

    // 添加重置方法（可选，用于测试）
    resetFirstUse() {
        Storage.set('firstUseChecked', false);
        Storage.set('likesCount', 0);
        Storage.set('selectedPost', null);
        this.firstUseChecked = false;
        this.likesCount = 0;
        this.selectedPost = null;
        console.log('已重置首次使用状态');
    }
}

// 初始化
(function() {
    new BrowseController();
})();
// ==UserScript==
// @name         Auto Read
// @namespace    http://tampermonkey.net/
// @version      1.6.0
// @description  自动刷linuxdo文章，第一作者liuweiqing
// @author       liuweiqing,linmew
// @match        https://meta.discourse.org/*
// @match        https://linux.do/*
// @match        https://meta.appinn.net/*
// @match        https://community.openai.com/*
// @grant        GM_addStyle
// @license      MIT
// @icon         https://icon.ooo/linux.do
// @downloadURL https://update.greasyfork.org/scripts/546081/Auto%20Read.user.js
// @updateURL https://update.greasyfork.org/scripts/546081/Auto%20Read.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 注入样式
  GM_addStyle(`
    .dar-container {
      position: fixed;
      right: -320px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      width: 320px;
      transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    }
    .dar-container.expanded {
      right: 0;
      pointer-events: auto;
    }
    .dar-toggle-btn {
      position: absolute;
      left: -40px;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      height: 64px;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%);
      background-size: 200% 100%;
      border: none;
      border-radius: 8px 0 0 8px;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: -2px 2px 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: auto;
    }
    .dar-toggle-btn:hover {
      box-shadow: -4px 4px 20px rgba(0, 0, 0, 0.15);
      transform: translateY(-50%) translateX(-2px);
    }
    .dar-toggle-btn svg {
      width: 20px;
      height: 20px;
      transition: transform 0.3s ease;
    }
    .dar-container.expanded .dar-toggle-btn svg {
      transform: rotate(180deg);
    }
    .dar-panel {
      width: 320px;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(10px);
      border-radius: 16px 0 0 16px;
      box-shadow: -4px 0 30px rgba(0, 0, 0, 0.1);
      max-height: 80vh;
      overflow-y: auto;
    }
    .dar-header {
      padding: 20px;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%);
      background-size: 200% 100%;
      border-radius: 16px 0 0 0;
      color: white;
    }
    .dar-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
    .dar-header p {
      margin: 8px 0 0 0;
      font-size: 12px;
      opacity: 0.9;
    }
    .dar-content {
      padding: 20px;
    }
    .dar-current-topic {
      padding: 12px;
      background: #f0f7ff;
      border-radius: 8px;
      margin-bottom: 16px;
      border: 1px solid #d0e2ff;
    }
    .dar-current-topic-title {
      font-size: 13px;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 4px;
    }
    .dar-current-topic-floor {
      font-size: 12px;
      color: #4a5568;
    }
    .dar-progress {
      padding: 12px;
      background: #f7fafc;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    .dar-progress-item {
      margin-bottom: 12px;
    }
    .dar-progress-item:last-child {
      margin-bottom: 0;
    }
    .dar-progress-label {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #4a5568;
      margin-bottom: 4px;
    }
    .dar-progress-bar {
      width: 100%;
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }
    .dar-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%);
      background-size: 200% 100%;
      animation: gradientMove 3s ease infinite;
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    .dar-status {
      padding: 12px;
      background: #edf2f7;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    .dar-status-item {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #4a5568;
      margin-bottom: 6px;
    }
    .dar-status-item:last-child {
      margin-bottom: 0;
    }
    .dar-status-value {
      font-weight: 600;
      color: #2d3748;
    }
    .dar-status-value.active {
      color: #48bb78;
    }
    .dar-control-group {
      margin-bottom: 16px;
    }
    .dar-control-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #2d3748;
    }
    .dar-switch {
      position: relative;
      width: 48px;
      height: 24px;
      background: #cbd5e0;
      border-radius: 12px;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    .dar-switch.active {
      background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%);
      background-size: 200% 100%;
      animation: gradientMove 2s ease infinite;
    }
    .dar-switch-handle {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      transition: transform 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .dar-switch.active .dar-switch-handle {
      transform: translateX(24px);
    }
    .dar-number-input {
      width: 60px;
      padding: 4px 8px;
      border: 1px solid #cbd5e0;
      border-radius: 4px;
      text-align: center;
      font-size: 14px;
      color: #2d3748;
      transition: border-color 0.2s ease;
    }
    .dar-number-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    .dar-number-input::-webkit-inner-spin-button,
    .dar-number-input::-webkit-outer-spin-button {
      opacity: 1;
    }
    @keyframes gradientMove {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
    @keyframes gradientMoveStop {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
    .dar-main-button {
      width: 100%;
      padding: 12px;
      background: linear-gradient(120deg, #667eea 0%, #764ba2 25%, #667eea 50%, #764ba2 75%, #667eea 100%);
      background-size: 200% 100%;
      background-position: 0% 50%;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      position: relative;
      overflow: hidden;
    }
    .dar-main-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      animation: gradientMove 3s ease infinite;
    }
    .dar-main-button.stop {
      background: linear-gradient(120deg, #764ba2 0%, #f093fb 25%, #764ba2 50%, #f093fb 75%, #764ba2 100%);
      background-size: 200% 100%;
      background-position: 0% 50%;
      box-shadow: 0 4px 12px rgba(240, 147, 251, 0.3);
    }
    .dar-main-button.stop:hover {
      box-shadow: 0 6px 20px rgba(240, 147, 251, 0.4);
      animation: gradientMoveStop 3s ease infinite;
    }
    .dar-divider {
      height: 1px;
      background: #e2e8f0;
      margin: 16px 0;
    }
    .dar-panel::-webkit-scrollbar {
      width: 6px;
    }
    .dar-panel::-webkit-scrollbar-track {
      background: transparent;
    }
    .dar-panel::-webkit-scrollbar-thumb {
      background: #cbd5e0;
      border-radius: 3px;
    }
  `);

  // 配置常量
  const CONFIG = {
    SCROLL_SPEED: 30, // 滚动速度
    SCROLL_INTERVAL: 150, // 滚动间隔
    SCROLL_VARIATION: 10, // 滚动速度变化幅度
    LIKE_LIMIT: 50, // 最大点赞数
    LIKE_INTERVAL_MIN: 3000, // 点赞间隔
    LIKE_INTERVAL_MAX: 6000,
    MAX_RETRIES: 3,
    PAGE_TRANSITION_DELAY: 1500, // 页面切换延迟
  };

  // 统计
  class StatsManager {
    constructor() {
      this.goals = {
        topics: 500,
        posts: 20000,
        likes: 50,
        days: 100,
      };
      this.MAX_DAYS = 100; // 只保留100天的数据
      this.load();
    }

    load() {
      const stored = localStorage.getItem("dar_stats");
      const defaults = {
        firstReadTime: null,  // 第一次点击开始阅读的时间
        topics: {},           // 话题详细访问记录
        todayLikes: 0,        // 24小时内点赞数
        firstLikeTime: null,  // 24小时周期的第一次点赞时间
        dailyStats: [],       // 每日统计栈，最多100条
        currentDate: new Date().toDateString(),
        // 当日临时统计（不在dailyStats中，直到日期变更才推入）
        todayTopics: 0,
        todayPosts: 0,
        todayLikesTotal: 0,   // 当日点赞总数（用于记录）
      };

      if (stored) {
        const parsedStats = JSON.parse(stored);
        this.stats = { ...defaults, ...parsedStats };

        // 确保 dailyStats 是数组
        if (!Array.isArray(this.stats.dailyStats)) {
          this.stats.dailyStats = [];
        }

        // 迁移旧数据格式
        if (parsedStats.topicsVisited !== undefined || parsedStats.postsRead !== undefined) {
          this.migrateOldData(parsedStats);
        }
      } else {
        this.stats = defaults;
      }

      // 检查是否需要推入新的一天数据
      this.checkDateChange();

      // 检查24小时点赞重置
      this.check24HourReset();
    }

    // 迁移旧数据格式到新的栈结构
    migrateOldData(oldStats) {
      const today = new Date().toDateString();

      // 如果有旧的累计数据，将其作为今日数据
      if (oldStats.topicsVisited || oldStats.postsRead || oldStats.likesGiven) {
        this.stats.todayTopics = oldStats.topicsVisited || 0;
        this.stats.todayPosts = oldStats.postsRead || 0;
        this.stats.todayLikesTotal = oldStats.likesGiven || 0;
      }

      // 清理旧字段
      delete this.stats.topicsVisited;
      delete this.stats.postsRead;
      delete this.stats.likesGiven;
      delete this.stats.startDate;
      delete this.stats.lastResetDate;

      this.save();
    }

    save() {
      localStorage.setItem("dar_stats", JSON.stringify(this.stats));
    }

    // 检查日期变更，将昨日数据推入栈
    checkDateChange() {
      const today = new Date().toDateString();

      if (this.stats.currentDate !== today && this.stats.currentDate) {
        // 日期变更，保存昨日数据
        this.pushDailyStats();

        // 重置当日统计
        this.stats.todayTopics = 0;
        this.stats.todayPosts = 0;
        this.stats.todayLikesTotal = 0;
        this.stats.currentDate = today;

        this.save();
      } else if (!this.stats.currentDate) {
        this.stats.currentDate = today;
      }
    }

    // 推入每日统计数据到栈
    pushDailyStats() {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const dailyData = {
        date: yesterday.toISOString().split('T')[0], // YYYY-MM-DD格式
        topics: this.stats.todayTopics || 0,
        posts: this.stats.todayPosts || 0,
        likes: this.stats.todayLikesTotal || 0,
      };

      // 推入新数据
      this.stats.dailyStats.push(dailyData);

      // 保持栈长度为100天
      if (this.stats.dailyStats.length > this.MAX_DAYS) {
        this.stats.dailyStats.shift(); // 移除最旧的数据
      }
    }

    check24HourReset() {
      // 处理已有数据的情况
      if (this.stats.todayLikes > 0 && !this.stats.firstLikeTime) {
        // 如果有点赞数但没有记录时间，说明是旧数据，设置为当前时间
        this.stats.firstLikeTime = Date.now();
        this.save();
        return;
      }

      // 如果没有第一次点赞时间，直接返回
      if (!this.stats.firstLikeTime) {
        return;
      }

      const now = Date.now();
      const firstLikeTime = this.stats.firstLikeTime;
      const hoursPassed = (now - firstLikeTime) / (1000 * 60 * 60);

      // 如果超过24小时，重置计数
      if (hoursPassed >= 24) {
        this.stats.todayLikes = 0;
        this.stats.firstLikeTime = null;
        this.save();
      }
    }

    // 获取100天内的累计统计
    get100DaysStats() {
      let totalTopics = this.stats.todayTopics || 0;
      let totalPosts = this.stats.todayPosts || 0;
      let totalLikes = this.stats.todayLikesTotal || 0;

      // 累加栈中的所有历史数据
      this.stats.dailyStats.forEach(day => {
        totalTopics += day.topics;
        totalPosts += day.posts;
        totalLikes += day.likes;
      });

      return {
        topics: totalTopics,
        posts: totalPosts,
        likes: totalLikes,
        days: this.stats.dailyStats.length + 1, // +1 包含今天
      };
    }

    v;

    // 记录帖子阅读进度
    recordTopicVisit(topicId, title = "", startingPost = 1) {
      // 检查日期变更
      this.checkDateChange();

      if (!this.stats.topics[topicId]) {
        this.stats.topics[topicId] = {
          title: title,
          visitCount: 0,
          lastVisit: Date.now(),
          maxPostRead: 0,
          totalPostsRead: 0,
          firstPostSeen: startingPost,
        };
        // 当日新访问的话题
        this.stats.todayTopics++;

        // 记录第一次开始阅读的时间
        if (!this.stats.firstReadTime) {
          this.stats.firstReadTime = Date.now();
        }
      }

      this.stats.topics[topicId].visitCount++;
      this.stats.topics[topicId].lastVisit = Date.now();

      // 如果从新的起始位置开始，更新起始楼层
      if (startingPost > 0 && (!this.stats.topics[topicId].firstPostSeen || startingPost < this.stats.topics[topicId].firstPostSeen)) {
        this.stats.topics[topicId].firstPostSeen = startingPost;
      }

      if (title) {
        this.stats.topics[topicId].title = title;
      }
      this.save();
    }

    recordPostRead(topicId, currentPost) {
      // 检查日期变更
      this.checkDateChange();

      if (!this.stats.topics[topicId]) return;

      const topic = this.stats.topics[topicId];
      const previousMax = topic.maxPostRead || 0;

      if (currentPost > previousMax) {
        // 如果是第一次记录，从起始楼层开始计算
        let newPosts = 0;
        if (previousMax === 0 && topic.firstPostSeen) {
          newPosts = currentPost - topic.firstPostSeen + 1;
        } else {
          // 只计算新增的帖子
          newPosts = currentPost - previousMax;
        }

        // 记录到当日统计
        this.stats.todayPosts += newPosts;
        topic.maxPostRead = currentPost;
        topic.totalPostsRead += newPosts;
        this.save();
      }
    }

    recordLike() {
      // 在每次点赞前检查日期变更
      this.checkDateChange();

      // 在每次点赞前检查24小时重置
      this.check24HourReset();

      // 如果是24小时周期内的第一次点赞，记录时间
      if (this.stats.todayLikes === 0 && !this.stats.firstLikeTime) {
        this.stats.firstLikeTime = Date.now();
      }

      // 记录到24小时计数和当日总计
      this.stats.todayLikes++;
      this.stats.todayLikesTotal++;
      this.save();
    }

    getProgress() {
      const stats100Days = this.get100DaysStats();

      return {
        topics: {
          current: stats100Days.topics,
          goal: this.goals.topics,
          percentage: Math.min(100, (stats100Days.topics / this.goals.topics) * 100),
        },
        posts: {
          current: stats100Days.posts,
          goal: this.goals.posts,
          percentage: Math.min(100, (stats100Days.posts / this.goals.posts) * 100),
        },
        likes: {
          current: stats100Days.likes,
          goal: this.goals.likes,
          percentage: Math.min(100, (stats100Days.likes / this.goals.likes) * 100),
        },
      };
    }

    // 获取详细统计信息
    getDetailedStats() {
      const stats100Days = this.get100DaysStats();
      const today = new Date();

      // 计算运行天数
      let runningDays = stats100Days.days;
      if (this.stats.firstReadTime) {
        const daysSinceStart = Math.ceil((today - new Date(this.stats.firstReadTime)) / (1000 * 60 * 60 * 24));
        runningDays = Math.min(daysSinceStart, 100); // 最多100天
      }

      // 计算平均值
      const avgTopics = runningDays > 0 ? Math.floor(stats100Days.topics / runningDays) : 0;
      const avgPosts = runningDays > 0 ? Math.floor(stats100Days.posts / runningDays) : 0;
      const avgLikes = runningDays > 0 ? Math.floor(stats100Days.likes / runningDays) : 0;

      return {
        total: stats100Days,
        today: {
          topics: this.stats.todayTopics || 0,
          posts: this.stats.todayPosts || 0,
          likes: this.stats.todayLikesTotal || 0,
          likesRemaining: Math.max(0, CONFIG.LIKE_LIMIT - this.stats.todayLikes),
        },
        average: {
          topics: avgTopics,
          posts: avgPosts,
          likes: avgLikes,
        },
        runningDays: runningDays,
        firstReadTime: this.stats.firstReadTime,
      };
    }
  }

  // Discourse API 交互
  class DiscourseAPI {
    constructor() {
      this.baseURL = this.getCurrentBaseURL();
      this.csrfToken = this.getCSRFToken();
      this._cachedSelectors = {};
    }

    getCurrentBaseURL() {
      const currentURL = window.location.href;
      const baseURLs = ["https://linux.do", "https://meta.discourse.org", "https://meta.appinn.net", "https://community.openai.com"];
      return baseURLs.find((url) => currentURL.startsWith(url)) || baseURLs[0];
    }

    getCSRFToken() {
      const token = document.querySelector('meta[name="csrf-token"]');
      return token ? token.content : "";
    }

    parseTopicURL(url) {
      const match = url.match(/\/t\/(?:[^\/]+\/)?(\d+)(?:\/(\d+))?/);
      if (match) {
        return {
          topicId: parseInt(match[1]),
          postNumber: match[2] ? parseInt(match[2]) : 1,
        };
      }
      return null;
    }

    // 获取当前话题信息
    getCurrentTopicInfo() {
      const parsed = this.parseTopicURL(window.location.pathname);
      if (!parsed) return null;

      const titleElement = document.querySelector(".fancy-title, .topic-title, h1");
      const title = titleElement ? titleElement.textContent.trim() : "";

      let currentPost = 1;
      let totalPosts = 0;

      // 获取楼层信息
      const timelineReplies = document.querySelector("div.timeline-replies");
      if (timelineReplies) {
        const parts = timelineReplies.textContent
          .trim()
          .replace(/[^0-9/]/g, "")
          .split("/");
        if (parts.length >= 2) {
          currentPost = parseInt(parts[0]) || 1;
          totalPosts = parseInt(parts[1]) || 0;
        }
      }

      return {
        topicId: parsed.topicId,
        title: title,
        currentPost: currentPost,
        totalPosts: totalPosts,
      };
    }

    getTopicsFromList() {
      const topics = [];
      const topicElements = document.querySelectorAll("tr.topic-list-item");

      topicElements.forEach((element) => {
        const topicId = element.getAttribute("data-topic-id");
        if (!topicId) return;

        const linkElement = element.querySelector("a.title");
        if (!linkElement) return;

        const href = linkElement.getAttribute("href");
        const title = linkElement.textContent.trim();

        const postsElement = element.querySelector(".posts .number");
        const postsCount = postsElement ? parseInt(postsElement.textContent) : 0;

        const newBadge = element.querySelector(".badge-notification.new-topic");
        const unreadBadge = element.querySelector(".badge-notification.unread-posts");
        const hasNew = !!(newBadge || unreadBadge);

        topics.push({
          id: topicId,
          title: title,
          href: href,
          postsCount: postsCount + 1,
          hasNew: hasNew,
        });
      });

      return topics;
    }

    async likePost(postId) {
      try {
        const element = document.getElementById(`post_${postId}`) || document.querySelector(`[data-post-id="${postId}"]`);

        if (!element) return false;

        const likeButton = element.querySelector(".discourse-reactions-reaction-button button, .like-button");
        if (likeButton) {
          const container = likeButton.closest(".discourse-reactions-actions");
          if (!container || !container.classList.contains("has-reacted")) {
            likeButton.click();
            return true;
          }
        }
      } catch (error) {
        console.error("Error liking post:", error);
      }
      return false;
    }

    // 底部检测
    isAtBottomOfTopic() {
      const timelineReplies = document.querySelector("div.timeline-replies");
      if (timelineReplies) {
        const parts = timelineReplies.textContent
          .trim()
          .replace(/[^0-9/]/g, "")
          .split("/");
        // 判断是否相等（如：35/35），表示已到达底部
        if (parts.length >= 2 && parts[0] === parts[1]) {
          return true;
        }
      } else {
        // 没有 timeline-replies 元素时，即只有主楼的情况，检查是否已经滚动到页面底部
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        // 滚动到底部（留 100px 容差）
        if (scrollTop + clientHeight >= scrollHeight - 100) {
          const posts = document.querySelectorAll("article[data-post-id]");
          if (posts.length <= 1) {
            return true;
          }
        }
      }
      return false;
    }
  }

  // 智能阅读
  class SmartReader {
    constructor(config, stats, api) {
      this.config = config;
      this.stats = stats;
      this.api = api;
      this.isReading = false;
      this.currentTopic = null;
      this.readPosts = new Set();
      this.topicQueue = [];
      this.scrollTimer = null;
      this.postObserver = null;
      this.currentStatus = "待机";
      this.statusUpdateCallback = null;
      this.isPageVisible = true;
      this.lastScrollTime = 0;
      this.lastRecordedPost = 0;
      this.errorRetries = 0;
      this.setupVisibilityHandler();
    }

    setStatusCallback(callback) {
      this.statusUpdateCallback = callback;
    }

    updateStatus(status) {
      this.currentStatus = status;
      if (this.statusUpdateCallback) {
        this.statusUpdateCallback(status);
      }
    }

    setupVisibilityHandler() {
      document.addEventListener("visibilitychange", () => {
        this.isPageVisible = !document.hidden;

        if (this.isPageVisible && this.isReading) {
          this.resumeReading();
        } else if (!this.isPageVisible && this.isReading) {
          this.pauseReading();
        }
      });
    }

    start() {
      this.isReading = true;
      this.config.set("autoRead", true);

      // 记录第一次开始阅读的时间
      if (!this.stats.stats.firstReadTime) {
        this.stats.stats.firstReadTime = Date.now();
        this.stats.save();
      }

      // 启动时检查24小时重置
      this.stats.check24HourReset();

      this.updateStatus("启动中...");
      this.errorRetries = 0;

      if (this.isTopicPage()) {
        this.readCurrentTopic();
      } else if (this.isListPage()) {
        this.loadTopicList();
      } else {
        window.location.href = `${this.api.baseURL}/latest`;
      }
    }

    stop() {
      this.isReading = false;
      this.config.set("autoRead", false);
      this.updateStatus("已停止");
      this.clearTimers();
    }

    pauseReading() {
      this.clearTimers();
      this.updateStatus("后台暂停中...");
    }

    resumeReading() {
      if (!this.isReading) return;

      if (this.isTopicPage()) {
        this.startSmoothScrolling();
      }
      this.updateStatus("继续阅读...");
    }

    clearTimers() {
      if (this.scrollTimer) {
        cancelAnimationFrame(this.scrollTimer);
        this.scrollTimer = null;
      }
      if (this.postObserver) {
        this.postObserver.disconnect();
        this.postObserver = null;
      }
    }

    isTopicPage() {
      return window.location.pathname.includes("/t/");
    }

    isListPage() {
      const path = window.location.pathname;
      return ["/", "/latest", "/new", "/unread", "/top"].some((p) => path === p || path.startsWith(p));
    }

    // 检测是否为错误页面
    isErrorPage() {
      return document.title.includes("找不到页面") || document.title.includes("404") || document.querySelector(".page-not-found");
    }

    // 处理错误页面
    handleError() {
      this.errorRetries++;
      if (this.errorRetries > CONFIG.MAX_RETRIES) {
        this.updateStatus("错误次数过多，返回列表");
        this.errorRetries = 0;
        setTimeout(() => {
          window.location.href = `${this.api.baseURL}/latest`;
        }, 2000);
      } else {
        this.updateStatus(`错误页面，重试 ${this.errorRetries}/${CONFIG.MAX_RETRIES}`);
        setTimeout(() => this.navigateToNextTopic(), 2000);
      }
    }

    async readCurrentTopic() {
      if (!this.isReading) return;

      // 页面加载时检查日期变更
      this.stats.checkDateChange();

      // 页面加载时检查24小时重置
      this.stats.check24HourReset();

      // 检查错误页面
      if (this.isErrorPage()) {
        this.handleError();
        return;
      }

      const topicInfo = this.api.getCurrentTopicInfo();
      if (!topicInfo) {
        this.updateStatus("获取话题失败，返回列表...");
        setTimeout(() => this.navigateToNextTopic(), 2000);
        return;
      }

      // 传入起始楼层
      this.stats.recordTopicVisit(topicInfo.topicId, topicInfo.title, topicInfo.currentPost);
      this.currentTopic = topicInfo;
      // 设置最后记录的楼层为当前楼层-1
      this.lastRecordedPost = topicInfo.currentPost - 1;
      this.updateStatus(`正在浏览: ${topicInfo.title}`);

      // 检查返回按钮
      const backButton = document.querySelector('[title="返回上一个未读帖子"]');
      if (backButton) {
        backButton.click();
      }

      if (this.isPageVisible) {
        this.startSmoothScrolling();
        this.setupPostObserver();
      }
    }

    // 滚动行为
    startSmoothScrolling() {
      if (this.scrollTimer) return;

      let scrollSpeed = CONFIG.SCROLL_SPEED;
      let lastVariation = 0;

      const scrollStep = () => {
        if (!this.isReading || !this.isPageVisible) {
          this.scrollTimer = null;
          return;
        }

        const timestamp = performance.now();

        // 控制滚动频率
        if (timestamp - this.lastScrollTime < CONFIG.SCROLL_INTERVAL) {
          this.scrollTimer = requestAnimationFrame(scrollStep);
          return;
        }
        this.lastScrollTime = timestamp;

        // 检查是否到达底部
        if (this.api.isAtBottomOfTopic()) {
          this.updateStatus("已到达话题底部，准备跳转...");
          this.clearTimers();

          // 确保记录最后的楼层
          const finalInfo = this.api.getCurrentTopicInfo();
          if (finalInfo && finalInfo.currentPost > this.lastRecordedPost) {
            this.stats.recordPostRead(this.currentTopic.topicId, finalInfo.currentPost);
          }

          setTimeout(() => {
            this.navigateToNextTopic();
          }, CONFIG.PAGE_TRANSITION_DELAY);
          return;
        }

        // 添加随机变化，让滚动更自然
        if (Math.random() < 0.1) {
          // 10%概率改变速度
          lastVariation = (Math.random() - 0.5) * CONFIG.SCROLL_VARIATION;
        }

        const currentSpeed = Math.max(10, scrollSpeed + lastVariation);
        window.scrollBy(0, currentSpeed);

        // 处理可见帖子
        this.processVisiblePosts();

        // 继续下一帧
        this.scrollTimer = requestAnimationFrame(scrollStep);
      };

      // 开始滚动动画
      this.scrollTimer = requestAnimationFrame(scrollStep);
    }

    // 观察帖子可见性变化
    setupPostObserver() {
      if (this.postObserver) {
        this.postObserver.disconnect();
      }

      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.6,
      };

      this.postObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const postElement = entry.target;
            const postId = postElement.getAttribute("data-post-id") || postElement.id.replace("post_", "");

            if (postId && !this.readPosts.has(postId)) {
              this.readPosts.add(postId);

              // 从元素中提取点赞数
              const likeCountEl = postElement.querySelector(".reactions-counter, .discourse-reactions-counter");
              const likeCount = likeCountEl ? parseInt(likeCountEl.innerText.trim()) || 0 : 0;

              // 自动点赞逻辑
              if (this.config.get("autoLike") && this.shouldLikePost(likeCount)) {
                const delay = Math.random() * (CONFIG.LIKE_INTERVAL_MAX - CONFIG.LIKE_INTERVAL_MIN) + CONFIG.LIKE_INTERVAL_MIN;
                setTimeout(() => {
                  this.api.likePost(postId).then((success) => {
                    if (success) {
                      console.log(`成功点赞 Post ${postId}`);
                      this.stats.recordLike();
                    }
                  });
                }, delay);
              }

              observer.unobserve(postElement);
            }
          }
        });
      }, options);

      // 观察页面上所有的帖子
      const postElements = document.querySelectorAll(".topic-post, article[data-post-id]");
      postElements.forEach((el) => this.postObserver.observe(el));
    }

    // 处理可见帖子和更新进度
    processVisiblePosts() {
      // 获取当前楼层信息并更新帖子进度
      const topicInfo = this.api.getCurrentTopicInfo();
      if (topicInfo && topicInfo.currentPost > this.lastRecordedPost) {
        this.stats.recordPostRead(this.currentTopic.topicId, topicInfo.currentPost);
        this.lastRecordedPost = topicInfo.currentPost;

        // 更新状态显示
        const floorInfo = topicInfo.totalPosts ? `楼层：${topicInfo.currentPost}/${topicInfo.totalPosts}` : `楼层：${topicInfo.currentPost}`;
        this.updateStatus(`正在浏览: ${topicInfo.title} (${floorInfo})`);
      }
    }

    shouldLikePost(likeCount = 0) {
      // 确保 likeCount 不为负数
      likeCount = Math.max(0, likeCount);

      // 检查24小时重置
      this.stats.check24HourReset();

      // 检查今日点赞限制
      if (this.stats.stats.todayLikes >= CONFIG.LIKE_LIMIT) {
        return false;
      }

      // 检查总点赞目标
      const progress = this.stats.getProgress();
      if (progress.likes.current >= progress.likes.goal) {
        return false;
      }

      // 获取当前点赞数
      const threshold = Math.max(0, this.config.get("likeThreshold") || 5);
      const guarantee = Math.max(threshold, this.config.get("likeGuarantee") || 10);
      let baseProb = Math.max(0, this.config.get("likeBaseProb") || 0.05);
      let maxProb = Math.max(0, Math.min(1, this.config.get("likeMaxProb") || 0.8));
      // 降低基础和最大概率，显得更“挑剔”
      if (this.config.get("humanMode")) {
        baseProb *= 0.8;
        maxProb *= 0.8;
      }

      // 必定点赞 (高赞帖子)
      if (likeCount >= guarantee) {
        return true;
      }

      // 低于阈值的帖子
      if (likeCount < threshold) {
        return Math.random() < baseProb;
      }

      // 曲线增长 (likeCount 在 [threshold, guarantee) 区间)
      // 使用对数曲线，模拟“点赞数的价值递减”
      // 将 [threshold, guarantee] 映射到 [0, 1] (使用对数)
      const range = guarantee - threshold;
      if (range <= 0) {
        return Math.random() < maxProb;
      }

      const logBase = Math.log(guarantee / Math.max(1, threshold));
      const logValue = Math.log(Math.max(1, likeCount) / Math.max(1, threshold));
      const normalized = Math.min(1, Math.max(0, logValue / logBase));

      // 将 [0, 1] 映射到 [baseProb, maxProb]
      const probability = baseProb + (maxProb - baseProb) * normalized;

      return Math.random() < probability;
    }

    loadTopicList() {
      this.updateStatus("加载话题列表...");

      const topics = this.api.getTopicsFromList();

      if (topics.length === 0) {
        this.updateStatus("加载更多话题...");
        window.scrollTo(0, document.body.scrollHeight);
        setTimeout(() => this.loadTopicList(), 2000);
        return;
      }

      // 过滤未读或未完成的话题
      const filteredTopics = topics.filter((topic) => {
        const topicStats = this.stats.stats.topics[topic.id];
        if (!topicStats) return true;
        if (topic.hasNew) return true;
        if ((topicStats.maxPostRead || 0) < topic.postsCount) return true;
        return false;
      });

      // 优先处理有新内容的话题
      filteredTopics.sort((a, b) => {
        if (a.hasNew && !b.hasNew) return -1;
        if (!a.hasNew && b.hasNew) return 1;
        return a.postsCount - b.postsCount;
      });

      this.topicQueue = filteredTopics.slice(0, this.config.get("topicLimit"));

      if (this.topicQueue.length === 0) {
        this.updateStatus("没有新话题，滚动加载...");
        window.scrollTo(0, document.body.scrollHeight);
        setTimeout(() => this.loadTopicList(), 3000);
        return;
      }

      this.navigateToNextTopic();
    }

    navigateToNextTopic() {
      if (!this.isReading) return;

      this.clearTimers();
      this.readPosts.clear();
      this.lastRecordedPost = 0;

      if (this.topicQueue.length === 0) {
        this.updateStatus("返回话题列表...");
        setTimeout(() => {
          window.location.href = `${this.api.baseURL}/latest`;
        }, CONFIG.PAGE_TRANSITION_DELAY);
        return;
      }

      const nextTopic = this.topicQueue.shift();
      this.updateStatus(`准备进入: ${nextTopic.title}`);

      let url = `${this.api.baseURL}${nextTopic.href}`;

      // 从上次阅读位置继续
      const topicStats = this.stats.stats.topics[nextTopic.id];
      if (topicStats && topicStats.maxPostRead > 0) {
        const targetPost = Math.min(topicStats.maxPostRead + 1, nextTopic.postsCount);
        url = url.replace(/\/\d+$/, "") + `/${targetPost}`;
      }

      // 拟人模式下增加随机延迟
      const delay = this.config.get("humanMode") ? CONFIG.PAGE_TRANSITION_DELAY + Math.random() * 2000 : CONFIG.PAGE_TRANSITION_DELAY;

      setTimeout(() => {
        window.location.href = url;
      }, delay);
    }
  }

  // 配置管理
  class ConfigManager {
    constructor() {
      this.defaults = {
        autoRead: false,
        autoLike: false,
        scrollSpeed: 30,
        scrollDelay: 150,
        readDelay: 2000,
        commentLimit: 1000,
        topicLimit: 20,
        likeLimit: 50,
        humanMode: true,
        likeThreshold: 5,
        likeGuarantee: 10,
        likeBaseProb: 0.05,
        likeMaxProb: 0.8,
      };
      this.load();
    }

    load() {
      const stored = localStorage.getItem("dar_config");
      this.config = stored ? { ...this.defaults, ...JSON.parse(stored) } : { ...this.defaults };
    }

    save() {
      localStorage.setItem("dar_config", JSON.stringify(this.config));
    }

    get(key) {
      return this.config[key];
    }

    set(key, value) {
      this.config[key] = value;
      this.save();
    }
  }

  // UI控制类
  class UIController {
    constructor(config, stats, reader) {
      this.config = config;
      this.stats = stats;
      this.reader = reader;
      this.isExpanded = false;
      this.updateTimerId = null;
      this.init();
    }

    init() {
      this.createUI();
      this.bindEvents();
      this.updateDisplay();

      this.reader.setStatusCallback((status) => {
        this.updateCurrentTopicDisplay(status);
      });

      this.startUpdateLoop();

      document.addEventListener("visibilitychange", () => {
        if (!document.hidden && !this.updateTimerId) {
          this.startUpdateLoop();
        }
      });
    }

    startUpdateLoop() {
      const update = () => {
        if (document.hidden) {
          this.updateTimerId = null;
          return;
        }

        this.updateDisplay();
        this.updateTimerId = setTimeout(update, 1000);
      };

      if (this.updateTimerId) {
        clearTimeout(this.updateTimerId);
      }

      this.updateTimerId = setTimeout(update, 1000);
    }

    createUI() {
      const container = document.createElement("div");
      container.className = "dar-container";

      container.innerHTML = `
        <button class="dar-toggle-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div class="dar-panel">
          <div class="dar-header">
            <h3>📚 自动阅读</h3>
            <p>自动浏览论坛内容</p>
          </div>
          
          <div class="dar-content">
            <div class="dar-current-topic" id="dar-current-topic" style="display: none;">
              <div class="dar-current-topic-title" id="dar-current-title">准备就绪</div>
              <div class="dar-current-topic-floor" id="dar-current-floor">等待开始...</div>
            </div>

            <div class="dar-progress">
              <div class="dar-progress-item">
                <div class="dar-progress-label">
                  <span>话题进度(100天)</span>
                  <span id="dar-topics-count">0/500</span>
                </div>
                <div class="dar-progress-bar">
                  <div class="dar-progress-fill" id="dar-topics-progress" style="width: 0%"></div>
                </div>
              </div>

              <div class="dar-progress-item">
                <div class="dar-progress-label">
                  <span>帖子进度(100天)</span>
                  <span id="dar-posts-count">0/20000</span>
                </div>
                <div class="dar-progress-bar">
                  <div class="dar-progress-fill" id="dar-posts-progress" style="width: 0%"></div>
                </div>
              </div>

              <div class="dar-progress-item">
                <div class="dar-progress-label">
                  <span>点赞进度(100天)</span>
                  <span id="dar-likes-count">0/50</span>
                </div>
                <div class="dar-progress-bar">
                  <div class="dar-progress-fill" id="dar-likes-progress" style="width: 0%"></div>
                </div>
              </div>
            </div>

            <div class="dar-status">
              <div class="dar-status-item">
                <span>当前状态</span>
                <span class="dar-status-value" id="dar-status">待机</span>
              </div>
              <div class="dar-status-item">
                <span>24小时内点赞</span>
                <span class="dar-status-value" id="dar-today-likes">0</span>
              </div>
              <div class="dar-status-item">
                <span>今日话题</span>
                <span class="dar-status-value" id="dar-today-topics">0</span>
              </div>
              <div class="dar-status-item">
                <span>今日帖子</span>
                <span class="dar-status-value" id="dar-today-posts">0</span>
              </div>
              <div class="dar-status-item">
                <span>运行天数</span>
                <span class="dar-status-value" id="dar-running-days">0</span>
              </div>
            </div>

            <button class="dar-main-button" id="dar-main-btn">
              开始阅读
            </button>

            <div class="dar-divider"></div>

            <div class="dar-control-group">
              <div class="dar-control-label">
                <span>自动点赞</span>
                <div class="dar-switch" id="dar-like-switch">
                  <div class="dar-switch-handle"></div>
                </div>
              </div>
            </div>

            <div class="dar-control-group">
              <div class="dar-control-label">
                <span>点赞阈值</span>
                <input
                  type="number"
                  id="dar-like-threshold"
                  class="dar-number-input"
                  min="0"
                  value="5"
                />
              </div>
            </div>

            <div class="dar-control-group">
              <div class="dar-control-label">
                <span>拟人模式</span>
                <div class="dar-switch" id="dar-human-switch">
                  <div class="dar-switch-handle"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(container);
      this.container = container;
    }

    bindEvents() {
      this.container.querySelector(".dar-toggle-btn").addEventListener("click", () => {
        this.isExpanded = !this.isExpanded;
        this.container.classList.toggle("expanded", this.isExpanded);
      });

      document.querySelector("#dar-main-btn").addEventListener("click", () => {
        if (this.reader.isReading) {
          this.reader.stop();
        } else {
          this.reader.start();
        }
        this.updateDisplay();
      });

      this.bindSwitch("dar-like-switch", "autoLike");
      this.bindNumberInput("dar-like-threshold", "likeThreshold", 0);
      this.bindSwitch("dar-human-switch", "humanMode");
    }

    bindSwitch(elementId, configKey) {
      const switchEl = document.getElementById(elementId);
      switchEl.addEventListener("click", () => {
        const newValue = !this.config.get(configKey);
        this.config.set(configKey, newValue);
        switchEl.classList.toggle("active", newValue);
      });

      switchEl.classList.toggle("active", this.config.get(configKey));
    }

    bindNumberInput(elementId, configKey, minValue = 1) {
      const inputEl = document.getElementById(elementId);

      // 初始化显示值
      inputEl.value = this.config.get(configKey) || minValue;

      // 监听输入变化
      inputEl.addEventListener("input", (e) => {
        let value = parseInt(e.target.value) || minValue;

        // 防止小于最小值
        if (value < minValue) {
          value = minValue;
          e.target.value = minValue;
        }

        this.config.set(configKey, value);
      });

      // 监听失焦事件，确保值有效
      inputEl.addEventListener("blur", (e) => {
        let value = parseInt(e.target.value) || minValue;
        if (value < minValue) {
          value = minValue;
        }
        e.target.value = value;
        this.config.set(configKey, value);
      });
    }

    updateCurrentTopicDisplay(status) {
      const topicDiv = document.querySelector("#dar-current-topic");
      const titleEl = document.querySelector("#dar-current-title");
      const floorEl = document.querySelector("#dar-current-floor");

      if (this.reader.isReading) {
        topicDiv.style.display = "block";

        // 解析状态信息
        if (status.includes("正在浏览:")) {
          const parts = status.split("(");
          titleEl.textContent = parts[0].trim();
          floorEl.textContent = parts[1] ? parts[1].replace(")", "").trim() : status;
        } else {
          titleEl.textContent = "当前状态";
          floorEl.textContent = status;
        }
      } else {
        topicDiv.style.display = "none";
      }
    }

    updateDisplay() {
      const progress = this.stats.getProgress();
      const detailed = this.stats.getDetailedStats();

      // 更新进度条（100天累计）
      document.querySelector("#dar-topics-count").textContent = `${progress.topics.current}/${progress.topics.goal}`;
      document.querySelector("#dar-topics-progress").style.width = `${progress.topics.percentage}%`;

      document.querySelector("#dar-posts-count").textContent = `${progress.posts.current}/${progress.posts.goal}`;
      document.querySelector("#dar-posts-progress").style.width = `${progress.posts.percentage}%`;

      document.querySelector("#dar-likes-count").textContent = `${progress.likes.current}/${progress.likes.goal}`;
      document.querySelector("#dar-likes-progress").style.width = `${progress.likes.percentage}%`;

      // 更新状态
      const statusEl = document.querySelector("#dar-status");
      if (this.reader.isReading) {
        statusEl.textContent = "阅读中";
        statusEl.classList.add("active");
      } else {
        statusEl.textContent = "待机";
        statusEl.classList.remove("active");
      }

      // 更新24小时点赞和今日统计
      document.querySelector("#dar-today-likes").textContent = this.stats.stats.todayLikes;
      document.querySelector("#dar-today-topics").textContent = detailed.today.topics;
      document.querySelector("#dar-today-posts").textContent = detailed.today.posts;
      document.querySelector("#dar-running-days").textContent = detailed.runningDays;

      // 更新按钮
      const btn = document.querySelector("#dar-main-btn");
      if (this.reader.isReading) {
        btn.textContent = "停止阅读";
        btn.classList.add("stop");
      } else {
        btn.textContent = "开始阅读";
        btn.classList.remove("stop");
      }
    }
  }

  // 初始化
  function init() {
    if (window.self !== window.top) return;

    const config = new ConfigManager();
    const stats = new StatsManager();
    const api = new DiscourseAPI();
    const reader = new SmartReader(config, stats, api);
    const ui = new UIController(config, stats, reader);

    // 自动启动
    if (config.get("autoRead")) {
      setTimeout(() => {
        reader.start();
      }, 2000);
    }

    // 全局暴露
    window.DAR = { config, stats, api, reader, ui };
  }

  init();
})();

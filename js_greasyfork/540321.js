// ==UserScript==
// @name         Linux.do 快问快答统计
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  在用户统计信息和帖子标题区域显示快问快答统计数据
// @author       Haleclipse & Claude
// @license      MIT
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540321/Linuxdo%20%E5%BF%AB%E9%97%AE%E5%BF%AB%E7%AD%94%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/540321/Linuxdo%20%E5%BF%AB%E9%97%AE%E5%BF%AB%E7%AD%94%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CACHE_PREFIX = 'linuxdo_qa_stats_';
  const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24小时缓存
  const REQUEST_DELAY_MS = 300;
  const MAX_RETRIES_429 = 3;
  const RETRY_DELAY_429_MS = 5000;

  // --- 样式 ---
  const styles = `
/* 用户统计信息页面样式 */
.stats-qa-count {
  /* 复用现有的 stats-* 样式 */
}

.stats-qa-solved {
  /* 复用现有的 stats-* 样式 */
}

.stats-qa-rate {
  /* 复用现有的 stats-* 样式 */
}

/* 帖子标题区域按钮样式 - 完全模仿标签样式 */
.qa-stats-btn {
  display: inline-block !important;
  vertical-align: middle !important;
  padding: 2px 8px !important;
  background: var(--primary-low) !important;
  border: none !important;
  border-radius: 0.25em !important;
  font-size: var(--font-down-1) !important;
  color: var(--primary) !important;
  cursor: pointer !important;
  text-decoration: none !important;
  white-space: nowrap !important;
  margin-right: 0.35em !important;
  margin-left: auto !important;
  flex-shrink: 0 !important;
  max-width: 14em !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  transition: background-color 0.2s ease !important;
}

.qa-stats-btn:hover {
  background: var(--primary-200) !important;
  color: var(--primary) !important;
}

.qa-stats-btn-icon {
  width: 12px !important;
  height: 12px !important;
  margin-right: 4px !important;
  vertical-align: middle !important;
  color: var(--primary) !important;
}

.qa-stats-text {
  display: inline-block !important;
  vertical-align: middle !important;
  padding: 2px 8px !important;
  background: var(--tertiary-low) !important;
  border: none !important;
  border-radius: 0.25em !important;
  font-size: var(--font-down-1) !important;
  color: var(--tertiary) !important;
  white-space: nowrap !important;
  margin-right: 0.35em !important;
  margin-left: auto !important;
  flex-shrink: 0 !important;
  /* 移除文字省略限制 */
  max-width: none !important;
  overflow: visible !important;
  text-overflow: initial !important;
}

.qa-stats-container {
  display: inline-flex !important;
  align-items: center !important;
  margin-left: auto !important;
  flex-shrink: 0 !important;
}

.qa-stats-loading {
  display: inline !important;
  margin-left: 8px !important;
  font-size: 12px !important;
  color: #666 !important;
}

.qa-stats-error {
  display: inline !important;
  margin-left: 8px !important;
  font-size: 12px !important;
  color: #dc3545 !important;
}
`;

  // 创建并注入样式
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);

  // --- 缓存功能 ---
  function getCachedData(username) {
    const cacheKey = `${CACHE_PREFIX}${username}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION_MS) {
          return data;
        }
      }
    } catch (e) {
      console.error('快问快答统计: 读取缓存错误', e);
      localStorage.removeItem(cacheKey);
    }
    return null;
  }

  function setCachedData(username, data) {
    const cacheKey = `${CACHE_PREFIX}${username}`;
    const itemToCache = {
      timestamp: Date.now(),
      data: data
    };
    try {
      localStorage.setItem(cacheKey, JSON.stringify(itemToCache));
    } catch (e) {
      console.error('快问快答统计: 缓存设置错误', e);
    }
  }

  // --- 数据获取 ---
  async function fetchUserTopics(username) {
    const cachedData = getCachedData(username);
    if (cachedData) {
      return cachedData;
    }

    const allTopics = [];
    let page = 0;
    const maxPages = 20; // 减少页数以提高性能

    while (page < maxPages) {
      let retries = 0;
      let success = false;

      while (retries <= MAX_RETRIES_429 && !success) {
        try {
          if (page > 0 || retries > 0) {
            await new Promise(resolve => setTimeout(resolve, retries > 0 ? RETRY_DELAY_429_MS : REQUEST_DELAY_MS));
          }

          const url = page === 0
            ? `https://linux.do/topics/created-by/${username}.json`
            : `https://linux.do/topics/created-by/${username}.json?page=${page}`;

          const response = await fetch(url);

          if (response.status === 429) {
            retries++;
            if (retries > MAX_RETRIES_429) {
              throw new Error(`超过最大重试次数`);
            }
            continue;
          }

          if (!response.ok) {
            throw new Error(`HTTP错误 ${response.status}`);
          }

          const data = await response.json();

          if (data.topic_list && data.topic_list.topics && data.topic_list.topics.length > 0) {
            allTopics.push(...data.topic_list.topics);

            if (!data.topic_list.more_topics_url) {
              page = maxPages;
            } else {
              page++;
            }
          } else {
            page = maxPages;
          }
          success = true;

        } catch (error) {
          console.error('快问快答统计: 获取数据错误', error);
          if (retries >= MAX_RETRIES_429) {
            page = maxPages;
            break;
          }
          retries++;
        }
      }
    }

    const resultData = { topics: allTopics };
    setCachedData(username, resultData);
    return resultData;
  }

  // --- 数据处理 ---
  function processQAData(data) {
    const allTopics = data.topics || [];

    const qaTopics = allTopics.filter(topic =>
      topic.tags && topic.tags.includes('快问快答')
    );

    const total = qaTopics.length;
    const solved = qaTopics.filter(topic => topic.has_accepted_answer === true).length;
    const solvedRate = total > 0 ? (solved / total * 100) : 0;

    return {
      total,
      solved,
      unsolved: total - solved,
      solvedRate: Math.round(solvedRate * 10) / 10
    };
  }

  // --- 用户统计信息页面功能 ---
  function isUserSummaryPage() {
    return window.location.pathname.match(/^\/u\/[^/]+\/summary$/);
  }

  function addStatsToUserPage(username, stats) {
    const statsSection = document.querySelector('.top-section.stats-section ul');
    if (!statsSection) return;

    // 检查是否已添加
    if (document.querySelector('.stats-qa-count')) return;

    // 创建快问快答统计项
    const qaCountItem = document.createElement('li');
    qaCountItem.className = 'stats-qa-count';
    qaCountItem.innerHTML = `
      <div class="user-stat">
        <span class="value">
          <span class="number">${stats.total}</span>
        </span>
        <span class="label">
          快问快答
        </span>
      </div>
    `;

    const qaSolvedItem = document.createElement('li');
    qaSolvedItem.className = 'stats-qa-solved';
    qaSolvedItem.innerHTML = `
      <div class="user-stat">
        <span class="value">
          <span class="number">${stats.solved}</span>
        </span>
        <span class="label">
          已采纳
        </span>
      </div>
    `;

    const qaRateItem = document.createElement('li');
    qaRateItem.className = 'stats-qa-rate';
    qaRateItem.innerHTML = `
      <div class="user-stat">
        <span class="value">
          <span class="number">${stats.solvedRate}%</span>
        </span>
        <span class="label">
          已采纳率
        </span>
      </div>
    `;

    // 插入到统计列表中
    statsSection.appendChild(qaCountItem);
    statsSection.appendChild(qaSolvedItem);
    statsSection.appendChild(qaRateItem);
  }

  // --- 帖子页面功能 ---
  function isTopicPage() {
    return window.location.pathname.match(/^\/t\/[^/]+\/\d+/);
  }

  function extractUsernameFromTopic() {
    // 从帖子页面提取发帖用户名
    const firstPostUserLink = document.querySelector('.topic-post[data-post-number="1"] .names .username a');
    if (firstPostUserLink) {
      const href = firstPostUserLink.getAttribute('href');
      const match = href.match(/\/u\/([^/?]+)/);
      return match ? match[1] : null;
    }
    return null;
  }

  function addStatsToTopicTitle(username, stats) {
    // 首先检查当前帖子是否包含"快问快答"标签
    const qaTag = document.querySelector('.discourse-tags a[data-tag-name="快问快答"]');
    if (!qaTag) {
      return; // 如果帖子没有快问快答标签，直接返回
    }

    // 查找类别标签区域
    const topicCategory = document.querySelector('.topic-category, #ember38');
    if (!topicCategory) return;

    // 检查是否已添加
    if (document.querySelector('.qa-stats-btn') || document.querySelector('.qa-stats-text')) return;

    // 如果没有快问快答数据，不显示
    if (stats.total === 0) return;

    // 查找或创建 topic-statuses 容器
    let statusesContainer = topicCategory.querySelector('.topic-statuses');
    if (!statusesContainer) {
      statusesContainer = document.createElement('span');
      statusesContainer.className = 'topic-statuses';
      statusesContainer.style.cssText = 'display: flex !important; align-items: center !important; flex-wrap: wrap !important; gap: 8px !important;';
      topicCategory.appendChild(statusesContainer);
    }

    addButtonToStatusContainer(statusesContainer, stats);
  }

  function addButtonToStatusContainer(statusesContainer, stats) {
    // 创建按钮容器
    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'qa-stats-container';
    buttonWrapper.innerHTML = `
      <button class="qa-stats-btn" type="button">
        <svg class="qa-stats-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
        </svg>
        快问快答统计
      </button>
    `;

    const btn = buttonWrapper.querySelector('.qa-stats-btn');
    btn.addEventListener('click', function() {
      // 替换按钮为统计文本
      const statsText = document.createElement('span');
      statsText.className = 'qa-stats-text';
      statsText.textContent = `此用户共提出${stats.total}个问题，已采纳${stats.solved}个，已采纳率${stats.solvedRate}%`;

      buttonWrapper.replaceChild(statsText, btn);
    });

    // 将按钮容器添加到 statuses 容器
    statusesContainer.appendChild(buttonWrapper);
  }

  // --- 主处理函数 ---
  async function processUserStats(username) {
    try {
      const data = await fetchUserTopics(username);
      const stats = processQAData(data);

      if (isUserSummaryPage()) {
        addStatsToUserPage(username, stats);
      } else if (isTopicPage()) {
        addStatsToTopicTitle(username, stats);
      }

    } catch (error) {
      console.error('快问快答统计: 处理用户统计错误:', error);
    }
  }

  // --- 页面初始化 ---
  function init() {
    let username = null;

    if (isUserSummaryPage()) {
      const usernameMatch = window.location.pathname.match(/^\/u\/([^/]+)\/summary$/);
      username = usernameMatch ? usernameMatch[1] : null;
    } else if (isTopicPage()) {
      // 等待页面加载完成后提取用户名
      setTimeout(() => {
        username = extractUsernameFromTopic();
        if (username) {
          processUserStats(username);
        }
      }, 1000);
      return; // 提前返回，避免重复处理
    }

    if (username) {
      processUserStats(username);
    }
  }

  // --- 页面变化监听 ---
  let lastUrl = location.href;
  const urlChangeObserver = new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      setTimeout(init, 500); // 延迟执行，确保页面元素加载完成
    }
  });

  urlChangeObserver.observe(document, { subtree: true, childList: true });

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 500);
  }

})();
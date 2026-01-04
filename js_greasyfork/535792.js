// ==UserScript==
// @name        自动浏览nodeloc.cc,autoBrowse-nodeloc.cc
// @description 自动浏览nodeloc.cc的帖子和话题，滚动5秒后停留5秒再跳转
// @namespace   Violentmonkey Scripts
// @match       https://nodeloc.cc/*
// @grant       GM_setValue
// @grant       GM_getValue
// @version     0.0.1
// @author      oner
// @license     MIT
// @icon        https://www.google.com/s2/favicons?domain=nodeloc.cc
// @downloadURL https://update.greasyfork.org/scripts/535792/%E8%87%AA%E5%8A%A8%E6%B5%8F%E8%A7%88nodeloccc%2CautoBrowse-nodeloccc.user.js
// @updateURL https://update.greasyfork.org/scripts/535792/%E8%87%AA%E5%8A%A8%E6%B5%8F%E8%A7%88nodeloccc%2CautoBrowse-nodeloccc.meta.js
// ==/UserScript==

const CONFIG = {
  scrollSpeed: 25,
  scrollInterval: 100,
  scrollDuration: 5000,      // 滚动5秒
  pauseDuration: 5000,       // 停留5秒
  topicPattern: '/t/topic',
  maxLinks: 8,
  skipInitialLinks: 4,
  noLinksWaitTime: 10 * 60 * 1000  // 10分钟，单位为毫秒
};

// URLs to navigate between
const NAVIGATION_URLS = [
  //'https://nodeloc.cc/unseen',
  'https://nodeloc.cc/new',
  //'https://nodeloc.cc/top',
  'https://nodeloc.cc/latest'
];

class PageNavigator {
  constructor() {
    this.isScrolling = false;
    this.isPaused = false;
    this.scrollInterval = null;
    this.nextTopicTimeout = null;
    this.pauseTimeout = null;
    this.waitTimer = null;
    this.button = this.createNavigationButton();
    this.infoLabel = this.createInfoLabel();
    this.currentUrl = window.location.href;

    // 检查是否是首次访问latest页面
    this.isFirstVisit = this.checkIfFirstVisit();
  }

  // 检查是否是首次访问latest页面
  checkIfFirstVisit() {
    if (window.location.href === 'https://nodeloc.cc/latest') {
      const hasVisited = GM_getValue('hasVisitedLatest', false);

      if (!hasVisited) {
        // 标记为已访问
        GM_setValue('hasVisitedLatest', true);
        return true;
      }
    }

    // 如果是从帖子页面返回，重置访问标记
    if (window.location.href.includes('/t/topic/')) {
      // 不重置，仅当浏览帖子后返回latest页面时才重置
    }

    return false;
  }

  // Helper function to get random number in range
  getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Create info label for displaying status
  createInfoLabel() {
    const label = document.createElement('div');
    Object.assign(label.style, {
      position: 'fixed',
      right: '15%',
      bottom: '25%',
      padding: '5px 10px',
      fontSize: '14px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      border: '1px solid #ddd',
      borderRadius: '3px',
      color: 'black',
      zIndex: '9999',
      display: 'none'
    });
    document.body.appendChild(label);
    return label;
  }

  // Update info label text and show it
  updateInfoLabel(text) {
    this.infoLabel.textContent = text;
    this.infoLabel.style.display = 'block';
  }

  // Create and setup navigation button
  createNavigationButton() {
    const button = document.createElement('button');
    Object.assign(button.style, {
      position: 'fixed',
      right: '15%',
      bottom: '30%',
      transform: 'translateY(-50%)',
      padding: '10px 20px',
      fontSize: '20px',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '5px',
      color: 'black',
      zIndex: '9999'
    });
    button.textContent = '开始';
    button.addEventListener('click', () => this.toggleScrolling());
    document.body.appendChild(button);
    return button;
  }

  // Toggle scrolling state
  toggleScrolling() {
    if (this.isScrolling || this.isPaused) {
      this.stopAllActivity();
    } else {
      this.startScrolling();
    }
  }

  // Start the scrolling process
  startScrolling() {
    if (this.isScrolling) return;
    this.isScrolling = true;
    this.isPaused = false;
    this.button.textContent = '停止';
    this.button.disabled = false;
    this.infoLabel.style.display = 'none';

    // Start smooth scrolling
    this.scrollInterval = setInterval(() => {
      window.scrollBy(0, CONFIG.scrollSpeed);

      // 检查是否已经到达页面底部，如果是则重新开始向下滚动
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        window.scrollTo(0, 0);
      }
    }, CONFIG.scrollInterval);

    // Schedule pause after scrolling
    this.pauseTimeout = setTimeout(() => {
      this.pauseScrolling();
    }, CONFIG.scrollDuration);
  }

  // Pause scrolling and wait before navigating
  pauseScrolling() {
    clearInterval(this.scrollInterval);
    this.isScrolling = false;
    this.isPaused = true;
    this.updateInfoLabel("停留中... 即将跳转");

    // Schedule next topic navigation after pause
    this.nextTopicTimeout = setTimeout(() => {
      this.stopAllActivity();
      this.navigateNextTopic();
    }, CONFIG.pauseDuration);
  }

  // Stop all activity (scrolling, pause, waiting)
  stopAllActivity() {
    clearInterval(this.scrollInterval);
    clearTimeout(this.pauseTimeout);
    clearTimeout(this.nextTopicTimeout);
    clearInterval(this.waitTimer);
    this.isScrolling = false;
    this.isPaused = false;
    this.button.textContent = '开始';
    this.button.disabled = false;
    this.infoLabel.style.display = 'none';
  }

  // Navigate to random URL from list
  navigateNextTopic() {
    const randomIndex = Math.floor(Math.random() * NAVIGATION_URLS.length);
    const newURL = NAVIGATION_URLS[randomIndex];
    console.log('Navigating to new URL:', newURL);
    window.location.href = newURL;
  }

  // Find and navigate to a random topic link
  findLinkAndRedirect() {
    // 如果是latest页面的首次访问，不跳转
    if (window.location.href === 'https://nodeloc.cc/latest' && this.isFirstVisit) {
      console.log('首次访问latest页面，不跳转');
      this.updateInfoLabel("首次访问latest页面，不跳转。点击开始按钮开始浏览。");
      return;
    }

    let linksToFilter = Array.from(document.links)
      .slice(CONFIG.skipInitialLinks)
      .filter(link => link.href.includes(CONFIG.topicPattern));

    // 取前maxLinks个链接
    const links = linksToFilter.slice(0, CONFIG.maxLinks).map(link => link.href);

    if (links.length > 0) {
      const randomLink = links[Math.floor(Math.random() * links.length)];
      window.location.href = randomLink;
    } else {
      console.log('No links found, waiting for 10 minutes before refreshing');
      this.waitForRefresh();
    }
  }

  // Wait for 10 minutes then refresh
  waitForRefresh() {
    this.setButtonDisabled();

    const startTime = Date.now();
    const endTime = startTime + CONFIG.noLinksWaitTime;

    this.updateInfoLabel(`未找到链接，将在10分钟后刷新 (0%)...`);

    this.waitTimer = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const remaining = CONFIG.noLinksWaitTime - elapsed;

      if (remaining <= 0) {
        clearInterval(this.waitTimer);
        location.reload();
        return;
      }

      const percent = Math.floor((elapsed / CONFIG.noLinksWaitTime) * 100);
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);

      this.updateInfoLabel(`未找到链接，将在 ${minutes}分${seconds}秒 后刷新 (${percent}%)...`);
    }, 1000);
  }

  // Set button to disabled state
  setButtonDisabled() {
    this.button.textContent = '导航中';
    this.button.style.color = '#f0f0f0';
    this.button.disabled = true;
  }

  // Initialize the navigator
  init() {
    if (window.location.href.includes('/t/topic/')) {
      this.startScrolling();
    } else {
      this.findLinkAndRedirect();
    }
  }
}

// Create and initialize the navigator
const navigator = new PageNavigator();
navigator.init();
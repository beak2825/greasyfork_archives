// ==UserScript==
// @name         Twitter/X 稳定屏蔽广告推文
// @namespace    https://x.com
// @version      1.8
// @description  避免页面崩溃的动态广告推文识别与隐藏逻辑（推荐标签识别）
// @author       _Sure.Lee
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531304/TwitterX%20%E7%A8%B3%E5%AE%9A%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%E6%8E%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/531304/TwitterX%20%E7%A8%B3%E5%AE%9A%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%E6%8E%A8%E6%96%87.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const OBSERVER_CONFIG = { childList: true, subtree: true };

  function isPromoted(tweet) {
    const labels = tweet.querySelectorAll('div[dir="ltr"]');
    return Array.from(labels).some((el) =>
      ['推荐', 'Promoted', '推薦', '推广'].some(keyword => el.textContent.trim().includes(keyword))
    );
  }

  function hideWithAnimation(tweet) {
    if (tweet.dataset.__adHandled) return;
    tweet.dataset.__adHandled = 'true';

    tweet.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    tweet.style.opacity = '0';
    tweet.style.transform = 'scale(0.95)';

    setTimeout(() => {
      try {
        tweet.style.display = 'none'; // 更安全：不直接 remove
        console.log('🧹 屏蔽广告推文成功');
      } catch (e) {
        console.warn('❗️ 删除广告推文失败:', e);
      }
    }, 600);
  }

  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const tweet = entry.target;
        if (isPromoted(tweet)) {
          console.log('👀 发现广告推文，准备屏蔽...');
          requestIdleCallback(() => hideWithAnimation(tweet), { timeout: 1000 });
          visibilityObserver.unobserve(tweet);
        }
      }
    });
  });

  function scanTweets() {
    const tweets = document.querySelectorAll('article[data-testid="tweet"]');
    tweets.forEach((tweet) => {
      if (!tweet.dataset.__observing) {
        tweet.dataset.__observing = 'true';
        visibilityObserver.observe(tweet);
      }
    });
  }

  // 启动 MutationObserver 监听动态加载
  const mo = new MutationObserver(() => {
    requestIdleCallback(scanTweets, { timeout: 500 });
  });

  mo.observe(document.body, OBSERVER_CONFIG);

  // 首次执行
  scanTweets();
})();
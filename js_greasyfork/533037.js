// ==UserScript==
// @name         微博垃圾内容清理
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  移除微博页面中的垃圾骚扰内容，例如：投票、推荐、荐读、"你常看的优质博主"
// @author       Roo
// @license      MIT
// @license-url  https://opensource.org/licenses/MIT
// @match        https://weibo.com/*
// @match        https://*.weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533037/%E5%BE%AE%E5%8D%9A%E5%9E%83%E5%9C%BE%E5%86%85%E5%AE%B9%E6%B8%85%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/533037/%E5%BE%AE%E5%8D%9A%E5%9E%83%E5%9C%BE%E5%86%85%E5%AE%B9%E6%B8%85%E7%90%86.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 防抖函数
  function debounce(func, wait) {
    let timeout;
    return function () {
      const context = this,
        args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }

  // Filter out spam items (votes, recommendations, "recommended bloggers", vote links)
  function filterSpamItems() {
    try {
      const items = document.querySelectorAll(".vue-recycle-scroller__item-view");
      if (!items.length) return;

      let stats = { votes: 0, recommends: 0, bloggers: 0, voteLinks: 0 };

      items.forEach((item) => {
        const voteElement = item.querySelector('[class^="card-vote"]');
        const wbproTags = item.querySelectorAll(".wbpro-tag");
        const recommendTag = wbproTags
          ? Array.from(wbproTags).find(
              (tag) =>
                tag.textContent &&
                (tag.textContent.includes("推荐") || tag.textContent.includes("荐读"))
            )
          : null;

        const bloggerTitle = item.querySelector('[class^="title_title_"]');
        const isBloggerRecommend =
          bloggerTitle && bloggerTitle.textContent.includes("你常看的优质博主");

        const voteLinks = item.querySelectorAll('a[href*="vote.weibo.com"]');
        const hasVoteLink = voteLinks.length > 0;

        if (voteElement || recommendTag || isBloggerRecommend || hasVoteLink) {
          if (voteElement) stats.votes++;
          if (recommendTag) stats.recommends++;
          if (isBloggerRecommend) stats.bloggers++;
          if (hasVoteLink) stats.voteLinks++;
          item.remove();
        }
      });

      if (stats.votes || stats.recommends || stats.bloggers) {
        console.log(
          `[weibo-cleaner] 已移除: ${stats.votes}个投票, ${stats.recommends}个推荐/引荐, ${stats.bloggers}个你常看的优质博主, ${stats.voteLinks}个投票链接`
        );
      }
    } catch (error) {
      console.error("[weibo-cleaner] 清理过程中出错:", error);
    }
  }

  // Debounced filter function
  const debouncedClean = debounce(filterSpamItems, 300);

  // 观察DOM变化
  function observeDOM() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          debouncedClean();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Initial filtering
    debouncedClean();
  }

  // 页面加载完成后开始观察
  if (document.readyState === "complete" || document.readyState === "interactive") {
    observeDOM();
  } else {
    window.addEventListener("DOMContentLoaded", observeDOM);
  }
})();

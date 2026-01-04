// ==UserScript==
// @name         Telegram web 屏蔽指定频道
// @version      0.7
// @description  屏蔽Telegram特定频道的搜索和打开，触发会重定向到首页
// @author       涵有闲
// @homepage     https://hyx.ink
// @match        https://web.telegram.org/*
// @grant        none
// @namespace https://greasyfork.org/users/1385884
// @downloadURL https://update.greasyfork.org/scripts/518912/Telegram%20web%20%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%E9%A2%91%E9%81%93.user.js
// @updateURL https://update.greasyfork.org/scripts/518912/Telegram%20web%20%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%E9%A2%91%E9%81%93.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 核心配置
  const config = {
    // 需要屏蔽的完整用户名列表
    blockList: ["@v114bot","@jisou"],
    // 重定向目标
    baseUrl: "https://web.telegram.org/k/",
    // 选择器配置
    selectors: {
      searchContainer: ".search-super",
      searchGroup: ".search-group-contacts",
      chatItem: ".row.chatlist-chat",
      subtitle: ".row-subtitle",
    },
  };

  /**
   * 检查URL是否需要屏蔽
   * @param {string} url 当前URL
   * @returns {boolean}
   */
  function shouldBlockUrl(url) {
    // 移除@符号并转换为小写进行匹配
    const blockPatterns = config.blockList.map(
      (item) => new RegExp(item.replace("@", ""), "i")
    );
    return blockPatterns.some((pattern) => pattern.test(url));
  }

  /**
   * 处理重定向
   */
  function handleRedirect() {
    const currentUrl = window.location.href;
    if (shouldBlockUrl(currentUrl) && currentUrl !== config.baseUrl) {
      window.location.replace(config.baseUrl);
    }
  }

  /**
   * 处理搜索结果
   */
  function handleSearchResults() {
    const observer = new MutationObserver(() => {
      document
        .querySelectorAll(config.selectors.searchGroup)
        .forEach((group) => {
          group.querySelectorAll(config.selectors.chatItem).forEach((item) => {
            const subtitle = item
              .querySelector(config.selectors.subtitle)
              ?.textContent?.trim();
            // 严格匹配完整用户名
            if (config.blockList.includes(subtitle)) {
              item.style.display = "none";
            }
          });
        });
    });

    // 观察搜索结果区域
    const searchContainer = document.querySelector(
      config.selectors.searchContainer
    );
    if (searchContainer) {
      observer.observe(searchContainer, {
        childList: true,
        subtree: true,
      });
    }
  }

  /**
   * 防抖函数
   */
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // 主函数
  const main = debounce(() => {
    if (window.location.hostname === "web.telegram.org") {
      handleRedirect(); // 保留重定向功能
      handleSearchResults();
    }
  }, 100);

  // 初始化
  function init() {
    main();
    // 监听 URL 变化
    const pushState = history.pushState;
    history.pushState = function () {
      pushState.apply(history, arguments);
      main();
    };
    window.addEventListener("popstate", main);
  }

  // 启动
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

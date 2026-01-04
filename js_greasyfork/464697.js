// ==UserScript==
// @name         切换百度谷歌搜索引擎
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  在百度和谷歌搜索之间快速切换的脚本
// @author       Blazing
// @match        https://www.google.com/*
// @match        https://www.google.com.hk/*
// @match        https://www.google.com.tw/*
// @match        https://www.google.co.jp/*
// @match        https://www.google.co.kr/*
// @match        https://www.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com.hk
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464697/%E5%88%87%E6%8D%A2%E7%99%BE%E5%BA%A6%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/464697/%E5%88%87%E6%8D%A2%E7%99%BE%E5%BA%A6%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 搜索引擎配置
  const SEARCH_ENGINES = {
    google: {
      domainPrefix: "www.google.", // 使用前缀匹配
      pathStart: "/search",
      queryParam: "q",
      searchUrl: "https://www.google.com/search?q=",
    },
    baidu: {
      domain: "www.baidu.com",
      pathStart: "/s",
      queryParam: "wd",
      searchUrl: "https://www.baidu.com/s?wd=",
    },
  };

  // 获取当前搜索引擎和目标搜索引擎
  function getCurrentEngine(domain) {
    if (domain.startsWith(SEARCH_ENGINES.google.domainPrefix)) {
      return "google";
    } else if (domain === SEARCH_ENGINES.baidu.domain) {
      return "baidu";
    }
    return null;
  }

  function getTargetEngine(currentEngine) {
    return currentEngine === "google" ? "baidu" : "google";
  }

  // 获取搜索词
  function getSearchQuery(engine) {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get(SEARCH_ENGINES[engine].queryParam);
  }

  // 执行搜索
  function openSearch(query, engine) {
    if (!query) return;
    const url = SEARCH_ENGINES[engine].searchUrl + encodeURIComponent(query);
    window.open(url, "_self");
  }

  // 处理快捷键
  function handleHotkey(e) {
    if (!(e.ctrlKey && e.shiftKey && e.key === "S")) return;

    e.preventDefault();

    const currentDomain = window.location.hostname;
    const currentPath = window.location.pathname;

    const currentEngine = getCurrentEngine(currentDomain);
    if (!currentEngine) return;

    const engineConfig = SEARCH_ENGINES[currentEngine];
    if (!currentPath.startsWith(engineConfig.pathStart)) return;

    const searchQuery = getSearchQuery(currentEngine);
    const targetEngine = getTargetEngine(currentEngine);

    openSearch(searchQuery, targetEngine);
  }

  // 添加搜索引擎切换按钮
  function addSearchEngineButton() {
    const currentDomain = window.location.hostname;
    let searchQuery;

    // 判断是否为谷歌域名
    const isGoogle = currentDomain.startsWith(
      SEARCH_ENGINES.google.domainPrefix
    );

    // 针对不同搜索引擎获取搜索词
    if (isGoogle) {
      searchQuery = new URLSearchParams(window.location.search).get("q");
    } else if (currentDomain === SEARCH_ENGINES.baidu.domain) {
      const urlParams = new URLSearchParams(window.location.search);
      searchQuery = urlParams.get("wd");
    }

    if (!searchQuery) return;

    if (isGoogle) {
      // 在谷歌搜索页添加百度搜索按钮 - 适配新版界面
      const allTab = document.querySelector('[aria-current="page"]');
      if (allTab) {
        // 获取选项卡列表容器
        const tabList = allTab.closest('[role="list"]');
        if (tabList) {
          const existingButton = tabList.querySelector(
            '[data-search-engine="baidu"]'
          );
          if (!existingButton) {
            const baiduButton = document.createElement("div");
            baiduButton.setAttribute("role", "listitem");
            baiduButton.innerHTML = `
                            <a class="C6AK7c" href="https://www.baidu.com/s?wd=${encodeURIComponent(
                              searchQuery
                            )}" data-search-engine="baidu">
                                <div jsname="xBNgKe" class="mXwfNd">
                                    <span class="R1QWuf">百度</span>
                                </div>
                            </a>
                        `;
            // 插入到"全部"选项后面
            const allTabContainer = allTab.closest('[role="listitem"]');
            if (allTabContainer && allTabContainer.nextElementSibling) {
              tabList.insertBefore(
                baiduButton,
                allTabContainer.nextElementSibling
              );
            } else {
              tabList.appendChild(baiduButton);
            }
          }
        }
      }
    } else if (currentDomain === SEARCH_ENGINES.baidu.domain) {
      // 在百度搜索页添加谷歌搜索按钮
      const webTab = document.querySelector(".cur-tab");
      if (webTab && webTab.nextElementSibling) {
        const existingButton = webTab.parentElement.querySelector(
          '[data-search-engine="google"]'
        );
        if (!existingButton) {
          const googleButton = document.createElement("a");
          googleButton.setAttribute("data-search-engine", "google");
          googleButton.href = `https://www.google.com/search?q=${encodeURIComponent(
            searchQuery
          )}`;
          googleButton.innerHTML = "<span>谷歌</span>";
          googleButton.style.cssText = webTab.nextElementSibling.style.cssText;
          webTab.parentElement.insertBefore(
            googleButton,
            webTab.nextElementSibling
          );
        }
      }
    }
  }

  // 初始化函数
  function init() {
    document.addEventListener("keydown", handleHotkey);
    addSearchEngineButton();

    const observer = new MutationObserver(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        setTimeout(addSearchEngineButton, 100);
      }

      const currentDomain = window.location.hostname;
      const isGoogle = currentDomain.startsWith(
        SEARCH_ENGINES.google.domainPrefix
      );

      if (currentDomain === SEARCH_ENGINES.baidu.domain) {
        const webTab = document.querySelector(".cur-tab");
        if (
          webTab &&
          !webTab.parentElement.querySelector('[data-search-engine="google"]')
        ) {
          addSearchEngineButton();
        }
      } else if (isGoogle) {
        const allTab = document.querySelector('[aria-current="page"]');
        if (allTab) {
          const tabList = allTab.closest('[role="list"]');
          if (
            tabList &&
            !tabList.querySelector('[data-search-engine="baidu"]')
          ) {
            addSearchEngineButton();
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  let lastUrl = window.location.href;
  init();
})();

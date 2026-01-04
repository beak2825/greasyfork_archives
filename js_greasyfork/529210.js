// ==UserScript==
// @name         聚合搜索引擎切换导航[自改]
// @namespace    http://tampermonkey.net/
// @icon         https://s2.loli.net/2025/03/08/OCtScJhM1biHEfB.png
// @version      2025.05.15
// @description  在搜索结果页顶部或选中文本时显示一个聚合搜索引擎切换导航栏，方便在不同引擎间跳转。专注于移动端优化。修复非搜索页选中弹出时页面跳动问题。改进对Cloudflare保护页面的兼容性。
// @author       PunkJet,tutrabbit,Gemini,Claude
// @match        *://*/*
// @exclude      *://*/cdn-cgi/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-body
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529210/%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2%E5%AF%BC%E8%88%AA%5B%E8%87%AA%E6%94%B9%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/529210/%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2%E5%AF%BC%E8%88%AA%5B%E8%87%AA%E6%94%B9%5D.meta.js
// ==/UserScript==

(function () {
  "use strict"; // 启用严格模式

  // --- 配置区域 ---
  const DEFAULT_ENGINES_ORDER = "必应-百度-谷歌-头条-F搜-夸克-搜狗-360";
  const AUTO_HIDE_DELAY = 5000;
  const ALL_SUPPORTED_ENGINES = "必应-百度-谷歌-知乎-F搜-360-夸克-搜狗-头条-Yandex-Ecosia-DuckDuckGo-QwantLite-Swisscows";
  const GM_STORAGE_KEY = "punk_setup_search";


  // --- 搜索引擎配置 (MODIFIED regexes) ---
  const SEARCH_ENGINES = [
    {
      name: "必应",
      searchUrl: "https://www.bing.com/search?q=",
      searchkeyName: ["q"],
      matchUrl: /bing\.com\/search\?.*q=/i, // Matches bing.com/search? followed by params including q=
    },
    {
      name: "百度",
      searchUrl: "https://baidu.com/s?wd=",
      searchkeyName: ["wd", "word"],
      matchUrl: /baidu\.com\/(s|m\/s|s\?tn=|wap\/s)\?.*(?:wd=|word=)/i, // More specific Baidu paths
    },
    {
      name: "谷歌",
      searchUrl: "https://www.google.com/search?q=",
      searchkeyName: ["q"],
      matchUrl: /google\.[^/]+\/search\?.*q=/i, // Matches google.anytld/search? with q=
    },
    {
      name: "知乎", // Original regex was good as it included /search
      searchUrl: "https://www.zhihu.com/search?q=",
      searchkeyName: ["q"],
      matchUrl: /zhihu\.com\/search.*?q=/i,
    },
    {
      name: "F搜",
      searchUrl: "https://fsoufsou.com/search?q=",
      searchkeyName: ["q"],
      // Allows fsoufsou.com/?q=, /search?q=, /search/embed?q=
      matchUrl: /fsoufsou\.com\/(search\?.*q=|search\/embed\?.*q=|\?.*q=)/i,
    },
    {
      name: "360",
      searchUrl: "https://www.so.com/s?q=",
      searchkeyName: ["q"],
      matchUrl: /(?:www\.)?so\.com\/(s|index)\?.*q=/i, // www.so.com/s? or so.com/s? or /index?
    },
    {
      name: "夸克",
      searchUrl: "https://quark.sm.cn/s?q=",
      searchkeyName: ["q"],
      matchUrl: /(?:quark\.)?sm\.cn\/s\?.*q=/i, // quark.sm.cn/s? or sm.cn/s?
    },
    {
      name: "搜狗",
      searchUrl: "https://m.sogou.com/web/searchList.jsp?keyword=",
      searchkeyName: ["keyword", "query"],
      // m.sogou.com (mobile) or www.sogou.com, specific paths
      matchUrl: /(?:m\.|www\.)?sogou\.com\/(?:web\/searchList\.jsp|wap\/index|web\/results|sogou)\?.*(?:keyword=|query=)/i,
    },
    {
      name: "头条",
      searchUrl: "https://so.toutiao.com/search/?keyword=",
      searchkeyName: ["keyword"],
      matchUrl: /(?:so\.)?toutiao\.com\/search(?:(?:\/|\/wap\/)\?tab=search)?\?.*keyword=/i,
    },
    {
      name: "Yandex",
      searchUrl: "https://yandex.com/search/touch/?text=",
      searchkeyName: ["text"],
      // yandex.com or .ru, /search/ or /search/touch/
      matchUrl: /yandex\.(?:com|ru)\/search(?:\/touch)?\/\?.*text=/i,
    },
    {
      name: "DuckDuckGo",
      searchUrl: "https://duckduckgo.com/?q=",
      searchkeyName: ["q"],
      // Allows duckduckgo.com/?q=, /html/?q=, /lite/?q=
      matchUrl: /duckduckgo\.com\/(?:(?:html|lite)\/)?\?.*q=/i,
    },
    {
      name: "Ecosia",
      searchUrl: "https://www.ecosia.org/search?q=",
      searchkeyName: ["q"],
      matchUrl: /(?:www\.)?ecosia\.org\/search\?.*q=/i,
    },
    {
      name: "QwantLite", // Was already specific
      searchUrl: "https://lite.qwant.com/?q=",
      searchkeyName: ["q"],
      matchUrl: /lite\.qwant\.com\/\?.*q=/i,
    },
    {
      name: "Swisscows",
      searchUrl: "https://swisscows.com/en/web?query=",
      searchkeyName: ["query"],
      matchUrl: /swisscows\.com\/(?:[a-z]{2}\/)?web\?.*query=/i, // Optional language code like en/
    },
  ];

  // --- 社交及其他站点分类配置 (保持不变) ---
  const SOCIAL_SITES = [
    {
      tabName: "日常",
      tabList: [
        { name: "知乎", searchUrl: "https://www.zhihu.com/search?q=" },
        { name: "豆瓣", searchUrl: "https://m.douban.com/search/?query=" },
        {
          name: "微博",
          searchUrl: "https://m.weibo.cn/search?containerid=100103&q=",
        },
        {
          name: "哔哩哔哩",
          searchUrl: "https://m.bilibili.com/search?keyword=",
        },
        { name: "维基百科", searchUrl: "https://zh.m.wikipedia.org/wiki/" },
        { name: "安娜档案", searchUrl: "https://annas-archive.org/search?q=" },
        { name: "Unsplash", searchUrl: "https://unsplash.com/s/photos/" },
        {
          name: "火山翻译",
          searchUrl: "https://translate.volcengine.com/mobile?text=",
        },
        { name: "博客园", searchUrl: "https://zzk.cnblogs.com/s?w=" },
      ],
    },
    {
      tabName: "娱乐",
      tabList: [
        { name: "知乎", searchUrl: "https://www.zhihu.com/search?q=" },
        { name: "豆瓣", searchUrl: "https://m.douban.com/search/?query=" },
        {
          name: "微博",
          searchUrl: "https://m.weibo.cn/search?containerid=100103&q=",
        },
        {
          name: "哔哩哔哩",
          searchUrl: "https://m.bilibili.com/search?keyword=",
        },
        {
          name: "小红书",
          searchUrl: "https://m.sogou.com/web/xiaohongshu?keyword=",
        },
        {
          name: "微信文章",
          searchUrl: "https://weixin.sogou.com/weixinwap?type=2&query=",
        },
        { name: "推特", searchUrl: "https://mobile.twitter.com/search?q=" },
        { name: "豆瓣阅读", searchUrl: "https://read.douban.com/search?q=" },
        {
          name: "Malavida",
          searchUrl: "https://www.malavida.com/en/android/s/",
        },
        { name: "ApkPure", searchUrl: "https://m.apkpure.com/search?q=" },
        { name: "安娜档案", searchUrl: "https://annas-archive.org/search?q=" },
        { name: "人人影视", searchUrl: "https://www.renren.pro/search?wd=" },
        { name: "豌豆Pro", searchUrl: "https://wandou.la/search/" },
      ],
    },
    {
      tabName: "开发",
      tabList: [
        {
          name: "开发者搜索",
          searchUrl: "https://kaifa.baidu.com/searchPage?wd=",
        },
        { name: "GitHub", searchUrl: "https://github.com/search?q=" },
        { name: "Gitee", searchUrl: "https://search.gitee.com/?q=" },
        {
          name: "Stackoverflow",
          searchUrl: "https://stackoverflow.com/search?q=",
        },
        { name: "GreasyFork", searchUrl: "https://greasyfork.org/scripts?q=" },
        { name: "MDN", searchUrl: "https://developer.mozilla.org/search?q=" },
        { name: "菜鸟教程", searchUrl: "https://www.runoob.com/?s=" },
        { name: "掘金", searchUrl: "https://juejin.cn/search?query=" },
        { name: "博客园", searchUrl: "https://zzk.cnblogs.com/s?w=" },
      ],
    },
    {
      tabName: "网盘",
      tabList: [
        { name: "阿里云盘", searchUrl: "https://alipansou.com/search?k=" },
        { name: "百度云盘", searchUrl: "https://xiongdipan.com/search?k=" },
        { name: "夸克网盘", searchUrl: "https://aipanso.com/search?k=" },
        {
          name: "罗马网盘",
          searchUrl: "https://www.luomapan.com/#/main/search?keyword=",
        },
      ],
    },
    {
      tabName: "翻译",
      tabList: [
        { name: "有道词典", searchUrl: "https://youdao.com/m/result?word=" },
        { name: "必应翻译", searchUrl: "https://cn.bing.com/dict/search?q=" },
        { name: "百度翻译", searchUrl: "https://fanyi.baidu.com/#zh/en/" },
        {
          name: "谷歌翻译",
          searchUrl: "https://translate.google.com/?sl=auto&tl=auto&text=",
        },
        {
          name: "火山翻译",
          searchUrl: "https://translate.volcengine.com/mobile?text=",
        },
        {
          name: "DeepL翻译",
          searchUrl: "https://www.deepl.com/translator-mobile#auto/auto/",
        },
      ],
    },
    {
      tabName: "图片",
      tabList: [
        {
          name: "谷歌搜图",
          searchUrl: "https://www.google.com/search?tbm=isch&q=",
        },
        {
          name: "必应搜图",
          searchUrl: "https://www.bing.com/images/search?q=",
        },
        { name: "Flickr", searchUrl: "https://www.flickr.com/search/?text=" },
        {
          name: "Pinterest",
          searchUrl: "https://www.pinterest.com/search/pins/?q=",
        },
        { name: "Pixabay", searchUrl: "https://pixabay.com/images/search/" },
        { name: "花瓣", searchUrl: "https://huaban.com/search/?q=" },
        { name: "Unsplash", searchUrl: "https://unsplash.com/s/photos/" },
      ],
    },
  ];

  // --- 辅助函数 ---
  function createElement(tagName, attributes = {}, innerHTML = "") {
    const element = document.createElement(tagName);
    for (const key in attributes) {
      if (Object.hasOwnProperty.call(attributes, key)) {
        element.setAttribute(key, attributes[key]);
      }
    }
    if (innerHTML) {
      element.innerHTML = innerHTML;
    }
    return element;
  }

  function getKeywordsFromUrl() {
    const currentUrl = window.location.href;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      for (const engine of SEARCH_ENGINES) {
        try {
          // Use .test() for boolean check, more direct than .match() if only check is needed
          if (engine.matchUrl.test(currentUrl)) {
            for (const key of engine.searchkeyName) {
              if (urlParams.has(key)) {
                return decodeURIComponent(urlParams.get(key) || "");
              }
            }
            // If regex matched but no specific key found, this might mean the page is related
            // but the keyword isn't in the expected param. For this function's purpose
            // (determining if it's a search page AND getting keywords), we might return ""
            // or a generic marker if we want to distinguish "search page, no keyword" from "not search page".
            // Current logic: continues to next engine if key not found. This is mostly fine with specific regexes.
            // If a highly specific regex (like one checking for the query param name in the regex itself) matches,
            // we can be more confident.
          }
        } catch (regexError) {
          console.error(`聚合搜索：匹配引擎 ${engine.name} 的正则表达式出错:`, regexError, engine.matchUrl);
          continue; // Skip to next engine on regex error
        }
      }
    } catch (urlError) {
      console.error("聚合搜索：解析 URL 参数时出错:", urlError);
    }
    return ""; // No keyword found or no matching search engine
  }

  function getDisplayEngineNames() {
    let storedValue = DEFAULT_ENGINES_ORDER;
    try {
      if (typeof GM_getValue === "function") {
        storedValue = GM_getValue(GM_STORAGE_KEY, DEFAULT_ENGINES_ORDER);
      } else {
        console.warn("聚合搜索：GM_getValue 不可用，使用默认引擎排序。");
      }
    } catch (e) {
      console.error("聚合搜索：读取 GM_getValue 错误，使用默认引擎排序。", e);
    }
    return storedValue.split("-").map(name => name.trim()).filter(Boolean);
  }

 function createLinkListItems( linkList, currentKeywords = "", activeEngineName = "" ) {
    const fragment = document.createDocumentFragment();
    const encodedKeywords = encodeURIComponent(currentKeywords);

    for (const item of linkList) {
      if (!item || !item.name || typeof item.searchUrl !== "string") {
        console.warn("聚合搜索: createLinkListItems 收到无效的 link item:", item);
        continue;
      }

      const isCurrentEngine = item.name === activeEngineName;
      const safeIdName = item.name.replace(/[^a-zA-Z0-9_-]/g, "-");
      const link = createElement(
        "a",
        {
          href: item.searchUrl + encodedKeywords,
          "data-base-url": item.searchUrl,
          id: `punk-link-${safeIdName}`,
          style: `color: ${isCurrentEngine ? "#5C6BC0" : "#666666"} !important; font-weight: ${isCurrentEngine ? "bold" : "normal"};`,
           target: "_blank"
        },
        item.name
      );

      const updateLinkHref = () => {
        const keywords = getCurrentSearchTerm(); // Uses selection or URL
        if (keywords) { // Ensure keywords is not empty
          link.href = link.getAttribute("data-base-url") + encodeURIComponent(keywords);
        } else { // Fallback if no keywords, link to base search URL
          link.href = link.getAttribute("data-base-url");
        }
      };
      link.addEventListener("contextmenu", updateLinkHref);
      link.addEventListener("mouseenter", updateLinkHref); // Update on hover for accurate "Open in new tab"

      const listItem = createElement("li");
      listItem.appendChild(link);
      fragment.appendChild(listItem);
    }
    return fragment;
  }

  function getCurrentSearchTerm() {
    const selection = window.getSelection().toString().trim();
    return selection || getKeywordsFromUrl(); // Prioritize selection
  }

  // --- UI 创建函数 ---
  function createMainContainer() {
    try {
      const mainContainer = createElement("div", {
        id: "punkjet-search-box",
        style: "display: none; font-size: 15px;",
      });
      if (document.body) {
        document.body.insertAdjacentElement("afterbegin", mainContainer);
        return mainContainer;
      } else {
        console.error("聚合搜索：document.body 不存在，无法插入主容器。");
        return null;
      }
    } catch (e) {
      console.error("聚合搜索：创建主容器时出错:", e);
      return null;
    }
  }

 function createNavigationBar( parentContainer, currentKeywords, activeEngineName ) {
    if (!parentContainer) return;

    const naviBox = createElement("div", { id: "punk-search-navi-box" });
    const appBox = createElement("div", { id: "punk-search-app-box" });
    const ulList = createElement("ul");

    const allSearchableItems = [...SEARCH_ENGINES];
    SOCIAL_SITES.forEach((category) => {
      if (category && Array.isArray(category.tabList)) {
        category.tabList.forEach((site) => {
          if (site && site.name && typeof site.searchUrl === "string") {
            if (!allSearchableItems.some(existing => existing.name === site.name)) {
              allSearchableItems.push({ ...site, isSocial: true });
            }
          } else { console.warn("聚合搜索: 无效的社交站点配置:", site, "in category", category.tabName); }
        });
      } else { console.warn("聚合搜索: 无效的社交站点分类:", category); }
    });

    const displayNames = getDisplayEngineNames();
    const displayItems = displayNames
      .map(name => {
        const found = allSearchableItems.find(item => item && item.name === name);
        if (!found) console.warn(`聚合搜索：在配置中未找到名为 "${name}" 的引擎或站点。`);
        return found;
      })
      .filter(Boolean); // Filter out not found items

    ulList.appendChild(createLinkListItems(displayItems, currentKeywords, activeEngineName));
    appBox.appendChild(ulList);

    const settingsButton = createElement("div", { id: "search-setting-box", title: "设置与更多选项" }, `<span id="punkBtnSet">⛮</span>`);
    settingsButton.onclick = toggleJumpSearchBox;

    const closeButton = createElement("div", { id: "search-close-box", title: "隐藏导航栏" }, `<span id="punkBtnClose">✕</span>`);
    closeButton.onclick = hideNavigationBar;

    naviBox.appendChild(appBox);
    naviBox.appendChild(settingsButton);
    naviBox.appendChild(closeButton);
    parentContainer.appendChild(naviBox);
  }

 function createOpenButton(referenceElement) {
    if (!referenceElement || !referenceElement.after) {
      console.error("聚合搜索：无法创建展开按钮，参考元素无效。");
      return;
    }
    const openButton = createElement("div", { id: "punk-search-open-box", title: "显示搜索导航", style: "display: none;" });
    openButton.onclick = () => {
        const isCurrentlySearchPage = Boolean(getKeywordsFromUrl());
        showNavigationBar(isCurrentlySearchPage);
    };
    try {
      referenceElement.after(openButton); // Insert button after main container
    } catch (e) {
      console.error("聚合搜索：插入展开按钮时出错:", e);
      // Fallback if `after` fails (e.g. referenceElement is document.body)
      if (document.body && document.body.appendChild) {
          document.body.appendChild(openButton);
      }
    }
  }

 function createJumpSearchBox(parentContainer) {
    if (!parentContainer) return;
    const jumpBox = createElement("div", { id: "punk-search-jump-box", style: "display: none;" });
    const currentKeywords = getCurrentSearchTerm(); // Get current context for links

    try { /* All Engines Section */
        const allEnginesSection = createElement("div", { id: "punk-search-all-app" });
        allEnginesSection.appendChild(createElement("h1", {}, "✰ 全部搜索引擎"));
        const allEnginesUl = createElement("ul");
        allEnginesUl.appendChild(createLinkListItems(SEARCH_ENGINES, currentKeywords)); // Pass currentKeywords
        allEnginesSection.appendChild(allEnginesUl);
        jumpBox.appendChild(allEnginesSection);
    } catch (e) { console.error("聚合搜索：创建全部搜索引擎部分出错:", e); }

    try { /* Tab Section */
        const tabContainer = createElement("div", { id: "punk-tab-container" });
        const tabListDiv = createElement("div", { id: "punk-tablist" });
        tabListDiv.appendChild(createElement("h1", {}, "@ 分类站点"));
        const tabUl = createElement("ul");
        const tabContentDiv = createElement("div", { class: "tab-content" });
        const tabFragments = document.createDocumentFragment();
        const contentFragments = document.createDocumentFragment();

        SOCIAL_SITES.forEach((category, index) => {
          if (!category || !category.tabName || !Array.isArray(category.tabList)) {
            console.warn("聚合搜索：跳过无效的分类站点配置:", category); return;
          }
          const tabLi = createElement("li", { "data-index": index.toString() }, category.tabName);
          if (index === 0) tabLi.classList.add("punk-current");
          tabFragments.appendChild(tabLi);

          const contentItem = createElement("div", { class: "punk-item", style: `display: ${index === 0 ? "block" : "none"};` });
          const contentUl = createElement("ul");
          const validTabList = category.tabList.filter(site => site && site.name && typeof site.searchUrl === "string");
          contentUl.appendChild(createLinkListItems(validTabList, currentKeywords)); // Pass currentKeywords
          contentItem.appendChild(contentUl);
          contentFragments.appendChild(contentItem);
        });

        tabUl.appendChild(tabFragments);
        tabListDiv.appendChild(tabUl);
        tabContainer.appendChild(tabListDiv);
        tabContentDiv.appendChild(contentFragments);
        tabContainer.appendChild(tabContentDiv);
        jumpBox.appendChild(tabContainer);
        setTimeout(setupTabSwitching, 0); // Ensure elements are in DOM
    } catch (e) { console.error("聚合搜索：创建分类站点 Tab 部分出错:", e); }

    try { /* Sort Section */
        jumpBox.appendChild(createElement("h1", {}, "■ 搜索引擎排序"));
        const sortDesc = createElement("div", { class: "jump-sort-discription" });
        sortDesc.innerHTML = `<a style="color:#666666 !important">说明：设置在导航栏中显示的搜索引擎及其顺序。<br>支持的格式：${ALL_SUPPORTED_ENGINES}</a>`;
        jumpBox.appendChild(sortDesc);
        const sortButton = createElement("button", { class: "punk-jump-sort-btn" }, "点击输入排序");
        sortButton.onclick = promptAndSetSortOrder;
        jumpBox.appendChild(sortButton);
        const closeJumpButton = createElement("button", { class: "punk-jump-sort-btn" }, "收起面板");
        closeJumpButton.onclick = () => { jumpBox.style.display = "none"; };
        jumpBox.appendChild(closeJumpButton);
    } catch (e) { console.error("聚合搜索：创建排序设置部分出错:", e); }
    parentContainer.appendChild(jumpBox);
  }

  function setupTabSwitching() {
    try {
      const tabList = document.querySelector("#punk-tablist ul");
      const items = document.querySelectorAll("#punk-tab-container .punk-item");
      const tabs = document.querySelectorAll("#punk-tablist li");
      if (!tabList || items.length === 0 || tabs.length === 0 || tabs.length !== items.length) {
        // console.warn("聚合搜索：未能找到 Tab 相关元素或数量不匹配，无法设置切换功能。", { tabListExists: !!tabList, itemsCount: items.length, tabsCount: tabs.length });
        return;
      }
      tabList.addEventListener("click", (event) => {
        const clickedTab = event.target.closest("li[data-index]");
        if (!clickedTab) return;
        const index = clickedTab.getAttribute("data-index");
        tabs.forEach(tab => tab.classList.remove("punk-current"));
        clickedTab.classList.add("punk-current");
        items.forEach((item, i) => { item.style.display = i.toString() === index ? "block" : "none"; });
      });
    } catch (e) { console.error("聚合搜索：设置 Tab 切换功能时出错:", e); }
  }

 function injectStyle(parentContainer) {
    if (!parentContainer) return;
    const css = `
      /* --- 主容器与导航栏 --- */
      #punkjet-search-box { position: fixed; top: 0; left: 0; width: 100%; height: 35px; background-color: rgba(255, 255, 255, 0.85) !important; z-index: 9999999; display: flex; flex-direction: column; box-shadow: 0 1px 2px rgba(0,0,0,0.1); font-family: Helvetica Neue, Helvetica, Arial, sans-serif; }
      #punk-search-navi-box { display: flex; align-items: center; width: 100%; height: 100%; }
      #punk-search-app-box { flex: 1; overflow: hidden; display: flex; align-items: center; }
      #punk-search-app-box ul { margin: 0; padding: 0 5px; list-style: none; white-space: nowrap; overflow-x: auto; overflow-y: hidden; scrollbar-width: thin; scrollbar-color: #aaa #eee; height: 100%; display: flex; align-items: center; }
      #punk-search-app-box ul::-webkit-scrollbar { height: 4px; background-color: #eee; } #punk-search-app-box ul::-webkit-scrollbar-thumb { background-color: #aaa; border-radius: 2px; }
      #punk-search-app-box li { display: inline-block; margin: 0 2px; vertical-align: middle; }
      #punk-search-app-box ul li a { display: block; padding: 6px 8px; text-decoration: none; font-size: 14px !important; color: #666666 !important; border-radius: 3px; transition: background-color 0.2s ease; }
      #punk-search-app-box ul li a:hover { background-color: #f0f0f0; }
      #punk-search-app-box ul li a[style*="font-weight: bold"] { color: #5C6BC0 !important; }

      /* --- 设置与关闭按钮 --- */
      #search-setting-box, #search-close-box { flex: 0 0 35px; display: flex; align-items: center; justify-content: center; height: 100%; cursor: pointer; font-size: 18px; color: #555; transition: background-color 0.2s ease; }
      #search-setting-box:hover, #search-close-box:hover { background-color: #f0f0f0; }

      /* --- 展开按钮 (浮动) --- */
      #punk-search-open-box { position: fixed; left: 15px; bottom: 70px; height: 40px; width: 40px; font-size: 15px; text-align: center; border-radius: 50%; z-index: 9999998; background: #005fbf url("data:image/svg+xml;utf8,%3Csvg width='48' height='48' xmlns='http://www.w3.org/2000/svg' stroke='null' style='vector-effect:non-scaling-stroke;' fill='none'%3E%3Cg id='Layer_1'%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cpath stroke='%23000' id='svg_5' d='m1.97999,23.9675l0,0c0,-12.42641 10.0537,-22.5 22.45556,-22.5l0,0c5.95558,0 11.66724,2.37053 15.87848,6.5901c4.21123,4.21957 6.57708,9.94253 6.57708,15.9099l0,0c0,12.4264 -10.05369,22.5 -22.45555,22.5l0,0c-12.40186,0 -22.45556,-10.07359 -22.45556,-22.5zm22.45556,-22.5l0,45m-22.45556,-22.5l44.91111,0' stroke-width='0' fill='%23005fbf'/%3E%3Cpath stroke='%23000' id='svg_7' d='m13.95011,18.65388l0,0l0,-0.00203l0,0.00203zm0.00073,-0.00203l4.2148,5.84978l-4.21553,5.84775l1.54978,2.15123l5.76532,-8l-5.76532,-8l-1.54905,2.15123zm7.46847,13.70285l10.5308,0l0,-3.03889l-10.5308,0l0,3.03889zm3.16603,-6.33312l7.36476,0l0,-3.03889l-7.36476,0l0,3.03889zm-3.16603,-9.37302l0,3.04091l10.5308,0l0,-3.04091l-10.5308,0z' stroke-width='0' fill='%23ffffff'/%3E%3Cpath id='svg_8' d='m135.44834,59.25124l0,0l0,-0.00001l0,0.00001zm0.00004,-0.00001l0.23416,0.02887l-0.2342,0.02886l0.0861,0.01062l0.3203,-0.03948l-0.3203,-0.03948l-0.08606,0.01062zm0.41492,0.06762l0.58504,0l0,-0.015l-0.58504,0l0,0.015zm0.17589,-0.03125l0.40915,0l0,-0.015l-0.40915,0l0,0.015zm-0.17589,-0.04625l0,0.01501l0.58504,0l0,-0.01501l-0.58504,0z' stroke-width='0' stroke='%23000' fill='%23ffffff'/%3E%3C/g%3E%3C/svg%3E") no-repeat center; background-size: 60%; box-shadow: 0 2px 5px rgba(0,0,0,0.2); cursor: pointer; box-sizing: border-box !important; }
      #punk-search-open-box:hover { background-color: #004c99; }

      /* --- 跳转/设置面板 --- */
      #punk-search-jump-box { position: absolute; top: 35px; right: 0; width: 95%; max-width: 450px; max-height: calc(90vh - 40px); padding: 10px; background-color: #ffffff !important; box-shadow: 0 2px 8px rgba(0,0,0,0.15); border-radius: 0 0 5px 5px; overflow-y: auto; z-index: 9999998; scrollbar-width: thin; scrollbar-color: #ccc #f8f8f8; }
      #punk-search-jump-box::-webkit-scrollbar { width: 6px; background-color: #f8f8f8; } #punk-search-jump-box::-webkit-scrollbar-thumb { background-color: #ccc; border-radius: 3px; }
      #punk-search-jump-box h1 { font-size: 14px !important; color: #333 !important; font-weight: bold; margin: 12px 0 8px 4px; padding-bottom: 4px; border-bottom: 1px solid #eee; }
      #punk-search-jump-box ul { margin: 0 0 10px 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; gap: 5px; }
      #punk-search-jump-box li { background-color: #f2f2f2 !important; border-radius: 3px; transition: background-color 0.2s ease; }
      #punk-search-jump-box li:hover { background-color: #e0e0e0 !important; }
      #punk-search-jump-box a { display: block; color: #333 !important; padding: 4px 8px; margin: 0; font-size: 13px; text-decoration: none; white-space: nowrap; }

      /* --- 设置面板 - Tab --- */
       #punk-tab-container { margin-bottom: 15px; }
       #punk-tablist ul { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px; padding-left: 4px; }
       #punk-tablist li { list-style: none; cursor: pointer; padding: 4px 0; font-size: 13px; color: #666666 !important; border-bottom: 3px solid transparent; transition: color 0.2s ease, border-color 0.2s ease; }
       #punk-tablist li:hover { color: #005fbf !important; }
       #punk-tablist li.punk-current { color: #005fbf !important; font-weight: bold; border-bottom-color: #005fbf; }
       .tab-content .punk-item ul { gap: 5px; }

      /* --- 设置面板 - 排序 --- */
      .jump-sort-discription { margin: 5px 4px 10px; font-size: 12px; color: #666; line-height: 1.5; }
      .punk-jump-sort-btn { background-color: #007bff; border: none; color: white; padding: 8px 16px; text-align: center; text-decoration: none; display: block; width: calc(100% - 10px); font-size: 13px; margin: 8px auto; cursor: pointer; border-radius: 4px; transition: background-color 0.2s ease; }
      .punk-jump-sort-btn:hover { background-color: #0056b3; }
      .punk-jump-sort-btn:last-of-type { background-color: #6c757d; } .punk-jump-sort-btn:last-of-type:hover { background-color: #5a6268; }

      /* --- 页面主体调整 (使用 data-* 属性) --- */
      body[data-search-nav-active="true"] { padding-top: 35px !important; }
      body[data-search-nav-active="true"] [style*="position: fixed"][style*="top: 0px"]:not(#punkjet-search-box):not([id^="punk-"]),
      body[data-search-nav-active="true"] [style*="position: sticky"][style*="top: 0px"]:not(#punkjet-search-box):not([id^="punk-"]) {
         top: 35px !important;
      }
      body:not([data-search-nav-active="true"]) [style*="position: fixed"][style*="top: 35px"]:not(#punkjet-search-box):not([id^="punk-"]),
      body:not([data-search-nav-active="true"]) [style*="position: sticky"][style*="top: 35px"]:not(#punkjet-search-box):not([id^="punk-"]) {
         /* top: 0px !important; */ /* Recovery is complex, better to avoid interfering if possible */
      }
    `;
    try {
      const styleElement = createElement("style", { type: "text/css" }, css);
      parentContainer.appendChild(styleElement);
    } catch (e) {
      console.error("聚合搜索：注入样式时出错:", e);
    }
  }

  // --- 事件处理与逻辑控制 ---
  function showNavigationBar(applyBodyPadding = true) {
    try {
      const navBox = document.getElementById("punkjet-search-box");
      const openButton = document.getElementById("punk-search-open-box");
      if (navBox) {
        navBox.style.display = "flex";
        if (applyBodyPadding && document.body) {
            document.body.setAttribute("data-search-nav-active", "true");
        } else if (document.body) { // Ensure removal if not applying padding
            document.body.removeAttribute("data-search-nav-active");
        }
      } else {
        // console.warn("聚合搜索：无法找到导航栏元素 #punkjet-search-box (showNavigationBar)");
      }
      if (openButton) {
        openButton.style.display = "none";
      }
    } catch (e) {
      console.error("聚合搜索：显示导航栏时出错:", e);
    }
  }

  function hideNavigationBar() {
    try {
      const navBox = document.getElementById("punkjet-search-box");
      const openButton = document.getElementById("punk-search-open-box");
      const jumpBox = document.getElementById("punk-search-jump-box");
      if (navBox) {
        navBox.style.display = "none";
        if (document.body) { // Always remove attribute when hiding
            document.body.removeAttribute("data-search-nav-active");
        }
      } else {
        // console.warn("聚合搜索：无法找到导航栏元素 #punkjet-search-box (hideNavigationBar)");
      }
      if (openButton) {
        openButton.style.display = "block";
      }
      if (jumpBox && jumpBox.style.display !== "none") { // Also hide jumpbox if it's open
        jumpBox.style.display = "none";
      }
    } catch (e) {
      console.error("聚合搜索：隐藏导航栏时出错:", e);
    }
  }

  function toggleJumpSearchBox() {
      try {
          const jumpBox = document.getElementById('punk-search-jump-box');
          if (jumpBox) {
              const isHidden = jumpBox.style.display === 'none' || !jumpBox.style.display;
              jumpBox.style.display = isHidden ? 'block' : 'none';
              if (isHidden) { // If just opened, update its link keywords
                  updateAllLinkKeywords(getCurrentSearchTerm());
              }
          } else {
              console.warn('聚合搜索：无法找到跳转/设置面板元素 #punk-search-jump-box');
          }
      } catch (e) {
          console.error('聚合搜索：切换设置面板显示时出错:', e);
      }
  }

  function promptAndSetSortOrder() {
    let currentOrder = DEFAULT_ENGINES_ORDER;
    let canAccessStorage = false;
    try {
      if (typeof GM_getValue === "function" && typeof GM_setValue === "function") {
        currentOrder = GM_getValue(GM_STORAGE_KEY, DEFAULT_ENGINES_ORDER);
        canAccessStorage = true;
      } else {
        console.warn("聚合搜索：GM_getValue/GM_setValue 不可用，无法读取/保存当前排序。");
      }
    } catch (e) {
      console.error("聚合搜索：读写 GM 存储错误。", e);
    }

    const promptMessage = `请输入导航栏需要显示的引擎名称，用 '-' 分隔。\n可用引擎: ${ALL_SUPPORTED_ENGINES}\n当前设置:${canAccessStorage ? "" : " (无法读取存储，更改不会保存)"}`;
    const newUserSortOrder = prompt(promptMessage, currentOrder);

    if (newUserSortOrder !== null) { // User clicked OK
      const trimmedOrder = newUserSortOrder.trim();
      if (trimmedOrder !== currentOrder) {
        if (canAccessStorage) {
          try {
            GM_setValue(GM_STORAGE_KEY, trimmedOrder);
            alert("设置已保存，页面将刷新以应用更改。");
            setTimeout(() => location.reload(), 300);
          } catch (e) {
            console.error("聚合搜索：写入 GM_setValue 错误。", e);
            alert("错误：保存设置时出错。请检查控制台。");
          }
        } else {
          alert("错误：无法保存设置 (存储功能不可用)。更改仅在当前页面生效，刷新后将丢失。");
          // To apply temporarily, we'd need to rebuild the nav bar here.
          // For simplicity, current version requires reload via GM_setValue.
        }
      } else { /* console.log("排序设置未改变。"); */ }
    } else { /* console.log("用户取消了排序设置。"); */ }
  }

  function updateAllLinkKeywords(keywords) {
    if (typeof keywords !== "string") return;
    try {
      const encodedKeywords = encodeURIComponent(keywords);
      // QuerySelectorAll on document to catch links even if jump box is not yet created or visible
      const links = document.querySelectorAll("#punkjet-search-box a[data-base-url]");
      links.forEach(link => {
        const baseUrl = link.getAttribute("data-base-url");
        if (baseUrl) { link.href = baseUrl + encodedKeywords; }
      });
    } catch (e) { console.error("聚合搜索：更新链接关键词时出错:", e); }
  }


  // --- 初始化与执行 ---

  // Initial check for iframe, @noframes should handle this, but as a fallback.
  if (window.self !== window.top) {
    // console.log("聚合搜索：在iframe中，脚本不执行。");
    return;
  }

  // Heuristic for CF challenge pages. If detected, script might not run or run limited.
  // This check is early, document.body might not be fully available.
  if (document.title && (document.title.includes("Just a moment...") || document.title.includes("Checking your browser"))){
      console.warn("聚合搜索：检测到可能是Cloudflare验证页面 (by title)，脚本将不执行。");
      return;
  }
  if (document.documentElement && document.documentElement.innerHTML.includes("cf- प्लीज-wait") /* common in CF HTML */) {
      console.warn("聚合搜索：检测到可能是Cloudflare验证页面 (by HTML content)，脚本将不执行。");
      return;
  }


  try {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initializeScript);
    } else {
      initializeScript();
    }
  } catch (globalError) {
    console.error("聚合搜索脚本初始化时发生严重错误:", globalError);
  }

  /**
   * 脚本的主要初始化逻辑
   */
  function initializeScript() {
    if (window.self !== window.top) return; // Final iframe check

    if (!document.body) {
      console.error("聚合搜索：DOM Ready 后 body 仍然不存在。");
      if (!window.punkjetSearchLateLoadAttempted) { // Retry once on full window load
          window.punkjetSearchLateLoadAttempted = true;
          window.addEventListener('load', initializeScript);
      }
      return;
    }
    // Check again for CF challenge page, now that body is more likely available
    if (document.body.classList.contains("challenge-running") || document.body.id === "cf-wrapper") {
        console.warn("聚合搜索：检测到可能是Cloudflare验证页面 (by body class/id)，脚本将不执行。");
        return;
    }


    const currentKeywords = getKeywordsFromUrl();
    const isSearchPage = Boolean(currentKeywords); // Critical: relies on refined regexes
    let activeEngineName = "";

    if (isSearchPage) {
      const currentUrl = window.location.href;
      // Find current engine based on refined matchUrl
      const currentEngine = SEARCH_ENGINES.find((engine) => {
        try { return engine.matchUrl.test(currentUrl); }
        catch (e) { console.warn(`检查引擎 ${engine.name} 匹配时正则出错:`, e, engine.matchUrl); return false; }
      });
      if (currentEngine) activeEngineName = currentEngine.name;
    }

    const mainContainer = createMainContainer();
    if (!mainContainer) {
      console.error("聚合搜索：主容器创建失败，无法继续创建 UI。");
      return;
    }

    createNavigationBar(mainContainer, currentKeywords, activeEngineName);
    createJumpSearchBox(mainContainer);
    createOpenButton(mainContainer); // Depends on mainContainer being in DOM
    injectStyle(mainContainer);

    if (isSearchPage) {
      showNavigationBar(true); // Show bar AND apply body padding
    } else {
      // Non-search page logic: show on text selection
      let debounceTimer;
      let autoHideTimer; // Timer for auto-hiding the bar after selection
      document.addEventListener("selectionchange", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          try {
            const selection = window.getSelection().toString().trim();
            const navBox = document.getElementById("punkjet-search-box");

            if (selection && navBox) {
              updateAllLinkKeywords(selection);
              showNavigationBar(false); // Show bar WITHOUT body padding

              clearTimeout(autoHideTimer); // Clear previous auto-hide timer
              autoHideTimer = setTimeout(() => {
                const stillNotSearchPage = !Boolean(getKeywordsFromUrl()); // Re-check if page changed
                if (stillNotSearchPage && navBox.style.display !== "none") {
                     hideNavigationBar();
                }
              }, AUTO_HIDE_DELAY);
            }
            // No automatic hiding if selection becomes empty; relies on autoHideTimer or manual close.
          } catch (e) {
            console.error("聚合搜索：处理 selectionchange 事件时出错:", e);
          }
        }, 250); // Debounce
      });

      // Mouse/touch events on navBox to pause/reset auto-hide
      const navBox = document.getElementById("punkjet-search-box");
      if (navBox) {
        const clearAutoHide = () => clearTimeout(autoHideTimer);
        const resetAutoHide = () => {
            // Only reset if bar is visible AND we are still on a non-search page
          if (navBox.style.display !== 'none' && !Boolean(getKeywordsFromUrl())) {
            clearTimeout(autoHideTimer);
            autoHideTimer = setTimeout(hideNavigationBar, AUTO_HIDE_DELAY);
          }
        };
        navBox.addEventListener('mouseenter', clearAutoHide);
        navBox.addEventListener('touchstart', clearAutoHide, { passive: true });
        navBox.addEventListener('mouseleave', resetAutoHide);
        navBox.addEventListener('touchend', resetAutoHide, { passive: true });
        // Prevent auto-hide if user clicks a link within the bar
        navBox.addEventListener('click', (e) => {
           if (e.target.closest('a')) {
               clearAutoHide();
           }
        });
      }
    } // End non-search page logic

    // popstate listener (handles browser back/forward)
    window.addEventListener("popstate", () => {
      setTimeout(() => { // Delay to allow URL and DOM to update
        try {
          const newKeywords = getKeywordsFromUrl();
          const newIsSearchPage = Boolean(newKeywords);
          const navBox = document.getElementById("punkjet-search-box");

          if (navBox) {
            updateAllLinkKeywords(newKeywords || getCurrentSearchTerm() || ""); // Update links with new keywords or current selection/URL

            let newActiveEngineName = "";
            if (newIsSearchPage) { // Navigated TO a search page
                const newUrl = window.location.href;
                const newEngine = SEARCH_ENGINES.find(e => { try { return e.matchUrl.test(newUrl); } catch { return false; } });
                if (newEngine) newActiveEngineName = newEngine.name;

                // Update active engine highlighting
                const links = navBox.querySelectorAll("#punk-search-app-box a"); // More specific selector
                links.forEach(link => {
                    link.style.fontWeight = 'normal';
                    link.style.color = '#666666 !important'; // Reset style
                    // A more robust way to get engine name from link if textContent is not reliable:
                    // const linkEngineId = link.id.replace('punk-link-', '');
                    // if (linkEngineId === newActiveEngineName.replace(/[^a-zA-Z0-9_-]/g, "-")) { ... }
                    if (link.textContent === newActiveEngineName) { // Assuming textContent is reliable
                        link.style.fontWeight = 'bold';
                        link.style.color = '#5C6BC0 !important';
                    }
                });
                showNavigationBar(true); // Show bar and apply body padding
            } else { // Navigated TO a non-search page
              // If bar was visible, keep it visible but remove body padding.
              // It will overlay content, consistent with selection behavior.
              // User can close it manually, or auto-hide might take effect if it was shown by selection.
              if (document.body) {
                 document.body.removeAttribute("data-search-nav-active");
              }
            }
          }
        } catch (e) {
          console.error("聚合搜索：处理 popstate 事件时出错:", e);
        }
      }, 200); // Increased delay slightly for stability
    });

    // Check if GM_info is available for version logging
    const scriptVersion = (typeof GM_info !== 'undefined' && GM_info.script) ? GM_info.script.version : VERSION_FALLBACK;
    console.log(`聚合搜索引擎切换导航[自改] 初始化完成 (v${scriptVersion})。`);
  } // end of initializeScript

  const VERSION_FALLBACK = "2025.04.30"; // Fallback if GM_info is not available

})(); // Immediately Invoked Function Expression Ends
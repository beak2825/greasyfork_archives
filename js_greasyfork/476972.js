// ==UserScript==
// @name         聚合搜索
// @namespace    https://github.com/funcdfs
// @version      2.1
// @description  在搜索顶部显示一个聚合搜索引擎切换导航
// @author       funcdfs
// @include      *
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/476972/%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/476972/%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==


// 默认搜索引擎排序
const defaultEngines = "Google-DuckDuckGo-Yandex-Sougou-Quark-360-Bing-Baidu-Zhihu-Bilibili";

// 搜索引擎配置
const searchEngines = [
  { name: "谷歌", searchUrl: "https://www.google.com/search?q=", searchKey: "q", matchUrl: /google\.com.*?search.*?q=/g, mark: "Google" },
  { name: "DuckDuckGo", searchUrl: "https://duckduckgo.com/?q=", searchKey: "q", matchUrl: /duckduckgo\.com.*?q=/g, mark: "DuckDuckGo" },
  { name: "Yandex", searchUrl: "https://yandex.com/search/?text=", searchKey: "text", matchUrl: /((ya(ndex)?\.ru)|(yandex\.com)).*?text=/g, mark: "Yandex" },
  { name: "搜狗", searchUrl: "https://www.sogou.com/web?query=", searchKey: ["query", "keyword"], matchUrl: /sogou\.com.*?(query|keyword)=/g, mark: "Sougou" },
  { name: "夸克", searchUrl: "https://quark.sm.cn/s?q=", searchKey: "q", matchUrl: /sm\.cn.*?q=/g, mark: "Quark" },
  { name: "360", searchUrl: "https://www.so.com/s?q=", searchKey: "q", matchUrl: /\.so\.com.*?q=/g, mark: "360" },
  { name: "必应", searchUrl: "https://www.bing.com/search?q=", searchKey: "q", matchUrl: /bing\.com.*?search\?q=?/g, mark: "Bing" },
  { name: "百度", searchUrl: "https://baidu.com/s?wd=", searchKey: ["wd", "word"], matchUrl: /baidu\.com.*?w(or)?d=?/g, mark: "Baidu" },
  { name: "知乎", searchUrl: "https://www.zhihu.com/search?q=", searchKey: "q", matchUrl: /zhihu\.com\/search.*?q=/g, mark: "Zhihu" },
  { name: "哔哩哔哩", searchUrl: "https://search.bilibili.com/all?keyword=", searchKey: "keyword", matchUrl: /search\.bilibili\.com.*?keyword=/g, mark: "Bilibili" },
];

// 面板选项配置
const panelOptions = [
  {
    title: "常用站点",
    links: [
      { name: "维基百科", url: "https://zh.wikipedia.org/w/index.php?search=" },
      { name: "GitHub", url: "https://github.com/search?q=&type=repositories" },
      { name: "Stack Overflow", url: "https://stackoverflow.com/search?q=" },
    ]
  },
  {
    title: "娱乐",
    links: [
      { name: "抖音", url: "https://www.douyin.com/root/search/" },
      { name: "豆瓣", url: "https://www.douban.com/search?q=" },
      { name: "豆瓣阅读", url: "https://read.douban.com/search?q=" },
    ]
  },
  {
    title: "翻译",
    links: [
      { name: "DeepL翻译", url: "https://www.deepl.com/translator#zh/en/" },
      { name: "谷歌翻译", url: "https://translate.google.com/?text=" },
      { name: "火山翻译", url: "https://translate.volcengine.com/translate?text=" },
      { name: "百度翻译", url: "https://fanyi.baidu.com/#zh/en/" },
    ]
  },
  {
    title: "网盘",
    links: [
      { name: "阿里云盘", url: "https://alipansou.com/search?k=" },
      { name: "百度网盘", url: "https://xiongdipan.com/search?k=" },
      { name: "夸克网盘", url: "https://aipanso.com/search?k=" },
      { name: "Google网盘", url: "https://drive.google.com/drive/home?dmr=1&ec=wgc-drive-globalnav-goto" },
      { name: "Dropbox", url: "https://www.dropbox.com/home" },
      { name: "Mega网盘", url: "https://mega.nz/fm" }
    ]
  }
];

// 获取当前搜索关键词
function getKeyword() {
  for (const engine of searchEngines) {
    if (window.location.href.match(engine.matchUrl)) {
      const keys = Array.isArray(engine.searchKey) ? engine.searchKey : [engine.searchKey];
      for (const key of keys) {
        if (window.location.href.indexOf(key) >= 0) {
          const url = new URL(window.location.href);
          return url.searchParams.get(key);
        }
      }
    }
  }
  return "";
}

// Store the panel element globally for easier access
let panelElement = null;

const closeIconSVG = `
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>`;

const collapseIconSVG = `
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="6 15 12 9 18 15"></polyline>
</svg>`;

// 添加主搜索栏
function addSearchBar() {
  // 创建主容器
  const container = document.createElement("div");
  container.id = "search-bar-container";
  container.className = "search-container";

  // 创建右侧按钮容器
  const rightBtnGroup = document.createElement("div");
  rightBtnGroup.className = "search-bar-btn-group";

  // 创建收起按钮
  const collapseBtn = document.createElement("button");
  collapseBtn.className = "search-collapse-btn";
  collapseBtn.innerHTML = collapseIconSVG;
  collapseBtn.title = "收起搜索栏";
  collapseBtn.onclick = function () {
    container.classList.add("collapsed");

    // 创建悬浮的展开按钮
    if (!document.getElementById("search-restore-btn")) {
      const restoreBtn = document.createElement("button");
      restoreBtn.id = "search-restore-btn";
      restoreBtn.className = "search-restore-btn";
      restoreBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      `;
      restoreBtn.title = "展开搜索栏";
      restoreBtn.onclick = function () {
        container.classList.remove("collapsed");
        this.remove();
      };
      document.body.appendChild(restoreBtn);
    }
  };

  // 创建搜索引擎列表
  const engineList = document.createElement("div");
  engineList.className = "engine-list";

  // 创建展开按钮
  const expandBtn = document.createElement("button");
  expandBtn.className = "expand-btn";
  expandBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
         <line x1="3" y1="12" x2="21" y2="12"></line>
         <line x1="3" y1="6" x2="21" y2="6"></line>
         <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
      <span class="expand-btn-text">展开</span>
   `;
  expandBtn.onclick = togglePanel;
  expandBtn.setAttribute("aria-expanded", "false");

  // 创建搜索引擎项
  const currentEngines = GM_getValue("search_engines") || defaultEngines;
  const engineMarks = currentEngines.split("-");
  const fragment = document.createDocumentFragment();

  for (const mark of engineMarks) {
    const engine = searchEngines.find(e => e.mark === mark);
    if (!engine) continue;

    const item = document.createElement("div");
    item.className = "engine-item";
    item.textContent = engine.name;
    item.dataset.url = engine.searchUrl + (getKeyword() || "");
    item.style.cursor = "pointer";

    // 添加点击事件处理器
    item.addEventListener("click", function (e) {
      e.preventDefault();
      // 如果是当前激活的搜索引擎，不执行任何操作
      if (this.classList.contains("active")) {
        return;
      }
      // 否则导航到目标URL
      window.location.href = this.dataset.url;
    });

    // 标记当前使用的搜索引擎
    if (window.location.href.match(engine.matchUrl)) {
      item.classList.add("active");
    }

    fragment.appendChild(item);
  }

  // 组装元素
  engineList.appendChild(fragment);
  container.appendChild(engineList);
  rightBtnGroup.appendChild(expandBtn);
  rightBtnGroup.appendChild(collapseBtn);
  container.appendChild(rightBtnGroup);
  document.body.prepend(container);

  // 创建但隐藏面板
  createPanel();
}

// 创建侧边面板
function createPanel() {
  panelElement = document.createElement("div"); // Assign to the global variable
  panelElement.id = "search-panel";
  panelElement.className = "search-panel";

  // 创建面板标题
  const panelHeader = document.createElement("div");
  panelHeader.className = "panel-header";
  panelHeader.innerHTML = `
      <h2>搜索工具箱</h2>
      <button class="close-btn" aria-label="关闭面板">
         ${closeIconSVG}
      </button>
   `;
  panelElement.appendChild(panelHeader);

  // 添加关闭按钮事件
  panelHeader.querySelector('.close-btn').onclick = togglePanel;

  // 创建面板内容容器
  const panelContent = document.createElement("div");
  panelContent.className = "panel-content";
  panelElement.appendChild(panelContent);

  // 创建面板内容
  for (const section of panelOptions) {
    const sectionEl = document.createElement("div");
    sectionEl.className = "panel-section";

    // 添加分类图标和标题
    const iconMap = {
      "常用站点": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
      "娱乐": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
      "翻译": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>',
      "网盘": '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>'
    };

    const titleEl = document.createElement("h3");
    titleEl.innerHTML = `${iconMap[section.title] || ''} <span>${section.title}</span>`;
    sectionEl.appendChild(titleEl);

    const linkList = document.createElement("div");
    linkList.className = "link-list";

    for (const link of section.links) {
      const linkEl = document.createElement("div");
      linkEl.className = "panel-link";
      linkEl.textContent = link.name;
      linkEl.style.cursor = "pointer";

      // 确定是否需要在链接后添加关键词
      // 判断是否是网盘类别中的Google网盘、Dropbox或Mega网盘
      const directAccessLinks = [
        "https://drive.google.com/drive/home",
        "https://www.dropbox.com/home",
        "https://mega.nz/fm"
      ];

      const isDirect = directAccessLinks.some(directUrl => link.url.startsWith(directUrl));

      // 如果是直接访问链接则不添加关键词，否则添加
      const url = isDirect ? link.url : link.url + (getKeyword() || "");
      linkEl.dataset.url = url;

      // 添加点击事件处理器 - 在新标签页中打开
      linkEl.addEventListener("click", function () {
        window.open(this.dataset.url, "_blank");
      });

      linkList.appendChild(linkEl);
    }

    sectionEl.appendChild(linkList);
    panelContent.appendChild(sectionEl);
  }

  document.body.appendChild(panelElement);
}

// 切换面板显示/隐藏
function togglePanel() {
  if (!panelElement) return; // Guard clause if panel is not yet created
  const expandBtn = document.querySelector(".expand-btn");
  const expandBtnText = expandBtn ? expandBtn.querySelector(".expand-btn-text") : null;

  if (panelElement.classList.contains("visible")) {
    panelElement.classList.remove("visible");
    if (expandBtn) expandBtn.setAttribute("aria-expanded", "false");
    if (expandBtnText) expandBtnText.textContent = "展开";
  } else {
    panelElement.classList.add("visible");
    if (expandBtn) expandBtn.setAttribute("aria-expanded", "true");
    if (expandBtnText) expandBtnText.textContent = "收起";
  }
}

// 添加样式
function addStyles() {
  const css = `
    /* 全局变量 */
    :root {
      --primary-color: #1a73e8;
      --primary-light: rgba(26, 115, 232, 0.1);
      --text-dark: #ffffff;
      --text-light: #333333;
      --text-hover-dark: #ffffff;
      --text-hover-light: #555555;
      --bg-hover-dark: rgba(255, 255, 255, 0.1);
      --bg-hover-light: rgba(0, 0, 0, 0.05);
      --border-dark: #333333;
      --border-light: #eeeeee;
      --item-bg-dark: #333333;
      --item-bg-light: #f5f5f5;
      --item-hover-dark: #3a3a3a;
      --item-hover-light: #e9e9e9;
      --header-height: 42px;
      --radius-sm: 4px;
      --radius-md: 8px;
      --transition: all 0.2s ease;
      --panel-bg-dark: #1a1a1a;
      --panel-bg-light: #ffffff;
      --header-bg-dark: #2e2e2e;
    }

    /* 搜索栏容器 */
    .search-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: var(--header-height);
      background-color: var(--header-bg-dark);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 8px;
      z-index: 9999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      transition: transform 0.3s ease;
    }

    /* 收起状态的搜索栏 */
    .search-container.collapsed {
      transform: translateY(-100%);
    }

    /* 用于恢复的悬浮按钮 */
    .search-restore-btn {
      position: fixed;
      top: 10px;
      right: 10px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: var(--primary-color);
      color: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 999999;
      transition: transform 0.2s ease, background-color 0.2s ease;
    }

    .search-restore-btn:hover {
      transform: scale(1.05);
      background-color: #1565C0;
    }

    /* 右侧按钮组 */
    .search-bar-btn-group {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-right: 8px;
      height: 100%;
    }

    /* 收起按钮 */
    .search-collapse-btn {
      width: 28px;
      height: 28px;
      background: transparent;
      border: none;
      color: var(--text-dark);
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border-radius: 50%;
      transition: background 0.18s, color 0.18s;
      opacity: 0.85;
    }

    .search-collapse-btn:hover {
      background-color: rgba(255, 255, 255, 0.13);
      color: var(--primary-color);
      opacity: 1;
    }
    
    /* Panel close button SVG specifically if it needs different sizing */
    .panel-header .close-btn svg {
      width: 20px; /* Or your preferred size */
      height: 20px; /* Or your preferred size */
    }

    /* Style for the panel's close button to make it less obtrusive */
    .panel-header .close-btn {
      background: transparent;
      border: none;
      color: var(--text-dark);
      padding: 4px;
      border-radius: 50%;
      cursor: pointer;
      transition: background-color 0.2s ease, color 0.2s ease;
      opacity: 0.7;
    }

    .panel-header .close-btn:hover {
      background-color: var(--bg-hover-dark);
      color: var(--text-hover-dark);
      opacity: 1;
    }

    /* 搜索引擎列表 */
    .engine-list {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      white-space: nowrap;
      padding: 0 8px;
      scrollbar-width: none;
      -ms-overflow-style: none;
      margin-right: 8px;
      flex: 1;
      background-color: var(--header-bg-dark);
    }

    .engine-list::-webkit-scrollbar {
      display: none;
    }

    /* 搜索引擎项 */
    .engine-item {
      color: var(--text-dark);
      text-decoration: none;
      font-size: 13px;
      padding: 4px 12px;
      border-radius: var(--radius-sm);
      transition: var(--transition);
      position: relative;
      font-weight: 400;
      letter-spacing: 0.2px;
      line-height: 1.4;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
    }

    .engine-item:hover {
      color: var(--text-hover-dark);
      background-color: var(--bg-hover-dark);
    }

    .engine-item.active {
      color: #ffffff;
      position: relative;
      background-color: var(--primary-color);
      font-weight: 500;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .engine-item.active:after {
      content: none;
    }

    /* 展开按钮 */
    .expand-btn {
      margin-right: 30px;
      background-color: rgba(255, 255, 255, 0.1);
      color: var(--text-dark);
      border: none;
      padding: 6px 12px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-size: 13px;
      transition: var(--transition);
      display: flex;
      align-items: center;
      gap: 6px;
      height: 28px;
      min-width: 68px;
    }

    .expand-btn svg {
      width: 14px;
      height: 14px;
    }

    .expand-btn:hover {
      background-color: rgba(255, 255, 255, 0.15);
    }

    /* 侧边面板 */
    .search-panel {
      position: fixed;
      top: var(--header-height);
      right: -340px;
      width: 340px;
      height: calc(100vh - var(--header-height));
      background-color: var(--panel-bg-dark);
      box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
      z-index: 9999998;
      transition: right 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      color: var(--text-dark);
    }

    .search-panel.visible {
      right: 0;
      margin-right: 20px;
      border-radius: 8px 0 0 8px;
      width: 320px;
    }

    /* 面板头部 */
    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-dark);
    }

    .panel-header h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: var(--text-dark);
    }

    /* 面板内容 */
    .panel-content {
      padding: 12px 16px;
      overflow-y: auto;
      flex: 1;
      scrollbar-width: thin;
      scrollbar-color: #555 transparent;
    }

    .panel-content::-webkit-scrollbar {
      width: 4px;
    }

    .panel-content::-webkit-scrollbar-track {
      background: transparent;
    }

    .panel-content::-webkit-scrollbar-thumb {
      background-color: #555;
      border-radius: 4px;
    }

    /* 面板部分 */
    .panel-section {
      margin-bottom: 20px;
    }

    .panel-section h3 {
      font-size: 14px;
      margin: 0 0 10px 0;
      padding-bottom: 6px;
      border-bottom: 1px solid var(--border-dark);
      color: var(--text-dark);
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .panel-section h3 svg {
      color: var(--primary-color);
      opacity: 0.9;
    }

    /* 链接列表 */
    .link-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }

    /* 面板链接 */
    .panel-link {
      display: inline-block;
      color: var(--text-dark);
      text-decoration: none;
      background-color: var(--item-bg-dark);
      padding: 5px 10px;
      border-radius: var(--radius-sm);
      font-size: 13px;
      transition: var(--transition);
      border: 1px solid rgba(255, 255, 255, 0.05);
      cursor: pointer;
      user-select: none;
    }

    .panel-link:hover {
      background-color: var(--item-hover-dark);
      color: var(--text-hover-dark);
      border-color: rgba(255, 255, 255, 0.1);
    }

    /* 页面内容调整 */
    body {
      margin-top: var(--header-height) !important;
    }

    /* 光明模式 */
    @media (prefers-color-scheme: light) {
      .search-container {
        background-color: rgba(255, 255, 255, 0.97);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      /* 亮色模式下的恢复按钮 */
      .search-restore-btn {
        background-color: var(--primary-color);
      }

      .search-restore-btn:hover {
        background-color: #1565C0;
      }

      .engine-item {
        color: var(--text-light);
      }

      .engine-item:hover {
        color: var(--text-hover-light);
        background-color: var(--bg-hover-light);
      }

      .engine-item.active {
        color: #ffffff;
        background-color: var(--primary-color);
      }

      .expand-btn {
        background-color: rgba(0, 0, 0, 0.07);
        color: var(--text-light);
      }

      .expand-btn:hover {
        background-color: rgba(0, 0, 0, 0.12);
      }

      .search-panel {
        background-color: var(--panel-bg-light);
        box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
      }

      .panel-header {
        border-bottom: 1px solid var(--border-light);
      }

      .panel-header h2 {
        color: var(--text-light);
      }

      /* Ensure panel close button in light mode is also styled correctly */
      .panel-header .close-btn {
        color: var(--text-light);
      }

      .panel-header .close-btn:hover {
        background-color: var(--bg-hover-light);
        color: var(--text-hover-light);
      }

      .panel-section h3 {
        border-bottom: 1px solid var(--border-light);
        color: var(--text-light);
      }

      .panel-link {
        background-color: var(--item-bg-light);
        color: var(--text-light);
        border: 1px solid rgba(0, 0, 0, 0.05);
      }

      .panel-link:hover {
        background-color: var(--item-hover-light);
        color: var(--text-hover-light);
        border-color: rgba(0, 0, 0, 0.1);
      }

      .search-collapse-btn {
        background: transparent;
        color: var(--text-light);
      }

      .search-collapse-btn:hover {
        background-color: rgba(0, 0, 0, 0.08);
        color: var(--primary-color);
      }
    }

    /* 移动设备适配 */
    @media (max-width: 768px) {
      :root {
        --header-height: 40px;
      }

      .search-container {
        padding: 0 6px;
      }

      .engine-list {
        gap: 4px;
        padding: 0 4px;
      }

      .engine-item {
        font-size: 12px;
        padding: 4px 8px;
      }

      .expand-btn {
        padding: 4px 8px;
        font-size: 12px;
        min-width: auto;
      }

      .expand-btn span {
        display: none;
      }

      .search-panel {
        width: 280px;
      }

      .search-panel.visible {
        margin-right: 10px;
        width: 260px;
      }

      .panel-header {
        padding: 10px 12px;
      }

      .panel-content {
        padding: 10px 12px;
      }

      .panel-link {
        font-size: 12px;
        padding: 4px 8px;
      }
    }
   `;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
}

// 初始化
(function () {
  "use strict";

  // 检查是否在搜索引擎页面
  for (const engine of searchEngines) {
    if (window.location.href.match(engine.matchUrl) && getKeyword()) {
      if (!GM_getValue("search_engines")) {
        GM_setValue("search_engines", defaultEngines);
      }

      // 页面加载完成后添加搜索栏
      window.addEventListener("DOMContentLoaded", function () {
        addStyles();
        addSearchBar();
      });

      break;
    }
  }
})();

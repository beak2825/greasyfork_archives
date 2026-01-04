// ==UserScript==
// @name         GitHub DeepWiki Button
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  在 GitHub 仓库页面的 Star/Watch/Fork 按钮旁添加 DeepWiki 按钮及新窗口打开图标，方便一键跳转到对应仓库的 DeepWiki 页面。
// @author       nuttycc
// @match        https://github.com/*/*
// @icon         https://deepwiki.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535111/GitHub%20DeepWiki%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/535111/GitHub%20DeepWiki%20Button.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 配置
  const CONFIG = {
    DEBUG: false, // 设置为 true 开启调试日志
    DEBOUNCE_DELAY: 300, // 防抖延迟时间（毫秒）
  };

  // 缓存常用数据
  const CACHE = {
    excludedPaths: [
      "settings",
      "marketplace",
      "explore",
      "topics",
      "trending",
      "collections",
      "events",
      "sponsors",
      "notifications",
    ],
    // 预定义 SVG 图标
    svgIcon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right:4px">
      <path d="M21 4H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm-1 14H4V6h16v12z"></path>
      <path d="M7 9h10v1H7zm0 4h10v1H7z"></path>
    </svg>`,
    // 新窗口打开图标
    newWindowIcon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle">
      <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path>
    </svg>`,
  };

  // 日志函数，只在调试模式下输出
  function log(...args) {
    if (CONFIG.DEBUG) {
      console.debug("[DeepWiki]", ...args);
    }
  }

  // 防抖函数
  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // 获取仓库路径
  function getRepoPath() {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    if (pathParts.length < 2) return null;
    return `${pathParts[0]}/${pathParts[1]}`;
  }

  // 检查当前页面是否是仓库页面
  function isRepoPage() {
    // 快速检查 URL 格式
    const pathParts = window.location.pathname.split("/").filter(Boolean);

    // 必须至少有用户名和仓库名两部分
    if (pathParts.length < 2) {
      return false;
    }

    // 排除特殊页面
    if (CACHE.excludedPaths.includes(pathParts[0])) {
      return false;
    }

    // 检查是否存在 Star/Watch/Fork 按钮容器
    const buttonContainer = document.querySelector("ul.pagehead-actions");
    const isRepo = !!buttonContainer;

    log(
      `[isRepoPage] 检测仓库页面: 路径：${pathParts.join(
        "/"
      )}, 按钮容器是否存在：${isRepo}`
    );
    return isRepo;
  }

  // 创建 DeepWiki 按钮
  function createDeepWikiButton(repoPath) {
    // 使用 DocumentFragment 提高性能
    const fragment = document.createDocumentFragment();

    // 创建列表项
    const listItem = document.createElement("li");
    listItem.className = "deepwiki-button d-flex";
    listItem.style.display = "flex";
    listItem.style.alignItems = "center";

    // 创建主按钮
    const button = document.createElement("a");
    button.href = `https://deepwiki.com/${repoPath}`;
    button.className = "btn btn-sm";
    button.target = "_blank";
    button.rel = "noopener noreferrer";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.gap = "4px";
    button.style.borderTopRightRadius = "0";
    button.style.borderBottomRightRadius = "0";
    button.style.marginRight = "0";
    button.style.height = "28px"; // 固定高度

    // 使用预定义的 SVG 图标
    button.innerHTML = CACHE.svgIcon;

    // 添加文本
    const text = document.createElement("span");
    text.textContent = "DeepWiki";
    button.appendChild(text);

    // 创建新窗口打开按钮
    const newWindowButton = document.createElement("a");
    newWindowButton.href = `https://deepwiki.com/${repoPath}`;
    newWindowButton.className = "btn btn-sm";
    newWindowButton.target = "_blank";
    newWindowButton.rel = "noopener noreferrer";
    newWindowButton.title = "在新窗口中打开";
    newWindowButton.setAttribute("aria-label", "在新窗口中打开");
    newWindowButton.style.display = "flex";
    newWindowButton.style.alignItems = "center";
    newWindowButton.style.justifyContent = "center";
    newWindowButton.style.borderTopLeftRadius = "0";
    newWindowButton.style.borderBottomLeftRadius = "0";
    newWindowButton.style.borderLeft = "1px solid var(--color-border-default)";
    newWindowButton.style.padding = "5px 8px";
    newWindowButton.style.height = "28px"; // 确保与主按钮高度一致

    // 添加新窗口图标
    newWindowButton.innerHTML = CACHE.newWindowIcon;

    // 组装
    listItem.appendChild(button);
    listItem.appendChild(newWindowButton);
    fragment.appendChild(listItem);

    return fragment;
  }

  // 添加 DeepWiki 按钮
  function addDeepWikiButton() {
    // 如果按钮已存在，则不再添加
    if (document.querySelector(".deepwiki-button")) {
      log("按钮已存在，跳过添加。");
      return;
    }

    // 获取仓库路径
    const repoPath = getRepoPath();
    if (!repoPath) {
      log("路径不符合要求，跳过添加。");
      return;
    }

    log(`[addDeepWikiButton] 检测到仓库路径: ${repoPath}`);

    // 获取按钮容器
    const buttonContainer = document.querySelector("ul.pagehead-actions");
    if (!buttonContainer) {
      log("未找到 ul.pagehead-actions 容器，跳过添加。");
      return;
    }

    // 创建并添加按钮
    const buttonFragment = createDeepWikiButton(repoPath);
    buttonContainer.insertBefore(buttonFragment, buttonContainer.firstChild);

    log("🎉 按钮添加成功。");
  }

  // 处理页面变化的统一函数
  const handlePageChange = debounce(() => {
    if (isRepoPage()) {
      addDeepWikiButton();
    }
  }, CONFIG.DEBOUNCE_DELAY);

  // 初始化函数
  function init() {
    // 页面加载完成时检查
    window.addEventListener("load", () => {
      log("[event] load 事件触发");
      handlePageChange();
    });

    // 监听 PJAX 结束事件
    document.addEventListener("pjax:end", () => {
      log("[event] pjax:end 事件触发");
      handlePageChange();
    });

    // 监听 turbo:render 事件
    document.addEventListener("turbo:render", () => {
      log("[event] turbo:render 事件触发");
      handlePageChange();
    });

    // 使用 turbo:render 监听变化已经足够。故移除下面内容。
    // 使用更精确的 MutationObserver 监听 DOM 变化。
    // let lastUrl = location.href;
    // const urlObserver = new MutationObserver(() => {
    //   const url = location.href;
    //   if (url !== lastUrl) {
    //     lastUrl = url;
    //     log("[Observer CallBack] URL 变化:", url);
    //     handlePageChange();
    //   }
    // });

    // // 只观察 body 元素，减少不必要的回调
    // const observeTarget = document.querySelector("body");
    // if (observeTarget) {
    //   urlObserver.observe(observeTarget, {
    //     childList: true,
    //     subtree: true,
    //   });
    // }

    // 初始检查
    log("[init] 初始检查。");
    handlePageChange();
  }

  // 启动脚本
  init();
})();

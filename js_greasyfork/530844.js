// ==UserScript==
// @name         github在线编辑器-快速跳转
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  在GitHub仓库页面添加快速跳转到各种在线编辑器的按钮
// @author       Jiabin
// @match        https://github.com/*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530844/github%E5%9C%A8%E7%BA%BF%E7%BC%96%E8%BE%91%E5%99%A8-%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/530844/github%E5%9C%A8%E7%BA%BF%E7%BC%96%E8%BE%91%E5%99%A8-%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 配置所有支持的在线编辑器
  const EDITORS = [
    {
      name: "StackBlitz",
      color: "#5C6BC0",
      textColor: "white",
      getUrl: (owner, repo) => `https://stackblitz.com/github/${owner}/${repo}`,
    },
    {
      name: "CodeSandbox",
      color: "#151515",
      textColor: "white",
      getUrl: (owner, repo) => `https://codesandbox.io/s/github/${owner}/${repo}`,
    },
    {
      name: "GitHub.dev",
      color: "#0969da",
      textColor: "white",
      getUrl: (owner, repo) => `https://github.dev/${owner}/${repo}`,
    },
    {
      name: "Gitpod",
      color: "#FFAE33",
      textColor: "black",
      getUrl: (owner, repo) => `https://gitpod.io/#https://github.com/${owner}/${repo}`,
    },
    {
      name: "Replit",
      color: "#F26207",
      textColor: "white",
      getUrl: (owner, repo) => `https://replit.com/github/${owner}/${repo}`,
    },
    {
      name: "Glitch",
      color: "#3333FF",
      textColor: "white",
      getUrl: (owner, repo) => `https://glitch.com/edit/#!/import/github/${owner}/${repo}`,
    },
  ];

  // 存储状态
  let currentUrl = window.location.href;
  let editorPanel = null;
  const STYLE_ID = "github-online-editors-style";
  let isPageLoaded = false;

  // 添加样式表
  function addStyles() {
    // 如果已存在样式表，则不重复添加
    if (document.getElementById(STYLE_ID)) return;

    const styleElement = document.createElement("style");
    styleElement.id = STYLE_ID;
    styleElement.textContent = `
            .gh-online-editors-container {
                display: grid;
                grid-template-columns: 50% 50%;
                gap: 8px;
                margin-bottom: 16px;
            }

            .gh-online-editor-button {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 6px 12px;
                font-size: 14px;
                font-weight: 500;
                line-height: 20px;
                white-space: nowrap;
                vertical-align: middle;
                cursor: pointer;
                user-select: none;
                border: 1px solid;
                border-radius: 6px;
                appearance: none;
                text-decoration: none;
                transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
            }

            .gh-online-editors-panel {
                width: 100%;
            }

            .gh-online-editors-title {
                margin-bottom: 12px;
                font-size: 16px;
                font-weight: 600;
            }
        `;

    document.head.appendChild(styleElement);
  }

  // 主函数
  function init() {
    // 如果页面还没加载完成，则不执行
    if (!isPageLoaded) return;

    removePanel();
    addStyles();

    if (!isRepoPage()) return;

    const repoInfo = getRepoInfo();
    if (!repoInfo) return;

    createPanel(repoInfo);
  }

  // 移除现有面板
  function removePanel() {
    // 首先尝试使用已存储的引用删除
    if (editorPanel && editorPanel.parentNode) {
      editorPanel.parentNode.removeChild(editorPanel);
      editorPanel = null;
    }

    // 再次查找并删除可能存在的面板（以防引用失效）
    const existingPanel = document.querySelector(".gh-online-editors-panel");
    if (existingPanel && existingPanel.parentNode) {
      existingPanel.parentNode.removeChild(existingPanel);
    }
  }

  // 检查是否在仓库页面
  function isRepoPage() {
    const path = window.location.pathname.split("/").filter((p) => p);

    if (path.length < 2) return false;

    const nonRepoPages = [
      "issues",
      "pull",
      "pulls",
      "wiki",
      "settings",
      "actions",
      "security",
      "pulse",
      "people",
      "network",
    ];

    if (path.length === 2) return true;

    return !nonRepoPages.includes(path[2]);
  }

  // 获取仓库信息
  function getRepoInfo() {
    const path = window.location.pathname.split("/").filter((p) => p);
    if (path.length < 2) return null;

    return {
      owner: path[0],
      repo: path[1],
    };
  }

  // 创建面板
  function createPanel(repoInfo) {
    const sidebar = document.querySelector(".BorderGrid");
    if (!sidebar) {
      console.warn("GitHub侧边栏未找到，无法插入在线编辑器面板");
      return;
    }

    // 查找About部分
    const aboutElement = findSidebarSection(sidebar, "About");

    // 创建面板容器
    const panel = document.createElement("div");
    panel.className = "BorderGrid-row gh-online-editors-panel";

    // 创建标题部分
    const header = document.createElement("div");
    header.className = "BorderGrid-cell";

    // 添加标题
    const title = document.createElement("h2");
    title.className = "h4 gh-online-editors-title";
    title.textContent = "在线编辑器";
    header.appendChild(title);

    // 创建按钮容器
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "gh-online-editors-container";

    // 添加所有编辑器按钮
    EDITORS.forEach((editor) => {
      const button = createEditorButton(editor, repoInfo);
      buttonsContainer.appendChild(button);
    });

    header.appendChild(buttonsContainer);
    panel.appendChild(header);

    // 插入面板
    if (aboutElement) {
      sidebar.insertBefore(panel, aboutElement);
    } else {
      sidebar.insertBefore(panel, sidebar.firstChild);
    }

    editorPanel = panel;
  }

  // 查找侧边栏中的特定部分
  function findSidebarSection(sidebar, title) {
    return Array.from(sidebar.children).find(
      (el) => el.textContent.includes(title) || el.querySelector("h2")?.textContent.includes(title)
    );
  }

  // 创建编辑器按钮
  function createEditorButton(editor, repoInfo) {
    const button = document.createElement("a");
    button.href = editor.getUrl(repoInfo.owner, repoInfo.repo);
    button.target = "_blank";
    button.className = "btn gh-online-editor-button";
    button.style.backgroundColor = editor.color;
    button.style.color = editor.textColor;
    button.textContent = editor.name;
    return button;
  }

  // 监听URL变化
  function checkUrlChange() {
    if (currentUrl !== window.location.href) {
      currentUrl = window.location.href;
      init();
    }
  }

  // 等待页面加载完成
  function waitForPageLoad() {
    // 当DOM内容加载完成后
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", onPageLoaded);
    } else {
      onPageLoaded();
    }
  }

  // 页面加载完成后的处理
  function onPageLoaded() {
    isPageLoaded = true;
    init();

    // 设置URL变化检测
    setInterval(checkUrlChange, 1000);

    // 监听GitHub的导航事件
    setupNavigationListeners();
  }

  // 设置导航事件监听
  function setupNavigationListeners() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function () {
      originalPushState.apply(this, arguments);
      setTimeout(init, 300);
    };

    history.replaceState = function () {
      originalReplaceState.apply(this, arguments);
      setTimeout(init, 300);
    };

    // 监听popstate事件
    window.addEventListener("popstate", () => {
      setTimeout(init, 300);
    });
  }

  // 启动脚本
  waitForPageLoad();
})();

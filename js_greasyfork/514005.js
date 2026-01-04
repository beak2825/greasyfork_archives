// ==UserScript==
// @name         Zhihu MCN | 知乎答主MCN信息显示
// @namespace    https://github.com/ByronLeeeee/zhihu-mcn-data/
// @version      1.3
// @description  一键获取并显示答主MCN数据，可同步数据库更新信息。一次收集，长效显示。
// @author       ByronLeeeee
// @match        *://www.zhihu.com/question/*
// @match        *://www.zhihu.com/people/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/514005/Zhihu%20MCN%20%7C%20%E7%9F%A5%E4%B9%8E%E7%AD%94%E4%B8%BBMCN%E4%BF%A1%E6%81%AF%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/514005/Zhihu%20MCN%20%7C%20%E7%9F%A5%E4%B9%8E%E7%AD%94%E4%B8%BBMCN%E4%BF%A1%E6%81%AF%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // GitHub配置
  const GITHUB_CONFIG = {
    owner: "ByronLeeeee",
    repo: "zhihu-mcn-data",
    branch: "main",
    path: "mcn-data.json",
  };

  // 添加样式
  GM_addStyle(`
      .mcn-button {
          margin-left: 8px;
          padding: 2px 8px;
          font-size: 12px;
          color: #8590a6;
          background: none;
          border: 1px solid #8590a6;
          border-radius: 3px;
          cursor: pointer;
      }
      .mcn-button:hover {
          color: #76839b;
          border-color: #76839b;
      }
      .mcn-info {
          color: #999;
          font-size: 14px;
          margin-left: 5px;
      }
      .mcn-main-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          background: #1772f6;
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
      }
      .mcn-main-button:hover {
          background: #0077e6;
      }
      .mcn-sub-buttons {
          position: fixed;
          bottom: 80px;
          right: 20px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          z-index: 999;
      }
      .mcn-sub-button {
          margin-bottom: 10px;
          padding: 8px 16px;
          background: #1772f6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: none;
      }
      .mcn-sub-button:hover {
          background: #389e0d;
      }
      .status-message {
          position: fixed;
          bottom: 70px;
          right: 20px;
          padding: 8px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border-radius: 4px;
          font-size: 12px;
          z-index: 1000;
          display: none;
      }
  `);

  // 存储正在处理的用户ID，防止重复获取
  const processingUsers = new Set();

  // 数据管理器
  const DataManager = {
    statusElement: null,
    mcnData: null,

    createStatusElement() {
      if (!this.statusElement) {
        this.statusElement = document.createElement("div");
        this.statusElement.className = "status-message";
        document.body.appendChild(this.statusElement);
      }
    },

    showStatus(message, duration = 3000) {
      this.statusElement.textContent = message;
      this.statusElement.style.display = "block";
      setTimeout(() => {
        this.statusElement.style.display = "none";
      }, duration);
    },

    // 添加主按钮
    addMainButton() {
      const mainButton = document.createElement("button");
      mainButton.className = "mcn-main-button";
      mainButton.textContent = "MCN";

      const subButtonsContainer = document.createElement("div");
      subButtonsContainer.className = "mcn-sub-buttons";

      const downloadButton = document.createElement("button");
      downloadButton.className = "mcn-sub-button";
      downloadButton.textContent = "更新MCN数据库";
      downloadButton.onclick = async () => {
        downloadButton.disabled = true;
        downloadButton.textContent = "更新中...";
        await this.updateMCNData();
        downloadButton.disabled = false;
        downloadButton.textContent = "更新MCN数据库";
        updateAllMCNDisplays();
      };

      const exportButton = document.createElement("button");
      exportButton.className = "mcn-sub-button";
      exportButton.textContent = "导出MCN数据";
      exportButton.onclick = () => {
        try {
          this.exportData();
        } catch (error) {
          console.error("导出按钮点击处理失败:", error);
          this.showStatus("导出操作失败");
        }
      };

      subButtonsContainer.appendChild(downloadButton);
      subButtonsContainer.appendChild(exportButton);

      mainButton.onclick = () => {
        if (
          subButtonsContainer.style.display === "none" ||
          subButtonsContainer.style.display === ""
        ) {
          subButtonsContainer.style.display = "flex";
          downloadButton.style.display = "block";
          exportButton.style.display = "block";
        } else {
          subButtonsContainer.style.display = "none";
          downloadButton.style.display = "none";
          exportButton.style.display = "none";
        }
      };

      document.body.appendChild(mainButton);
      document.body.appendChild(subButtonsContainer);
    },

    // 获取所有本地存储的MCN数据
    getAllLocalData() {
      const localData = {};

      // 从本地存储获取手动记录的数据
      if (typeof GM_listValues === "function") {
        const keys = GM_listValues();
        keys.forEach((key) => {
          const value = GM_getValue(key);
          if (value) {
            localData[key] = value;
          }
        });
      }

      console.log("导出数据统计：", {
        本地数据条数: Object.keys(localData).length,
      });

      return localData;
    },

    // 导出数据为JSON文件
    exportData() {
      const data = this.getAllLocalData();
      const dataCount = Object.keys(data).length;

      if (dataCount === 0) {
        this.showStatus("没有找到可导出的数据");
        return;
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[T:]/g, "-");

      const a = document.createElement("a");
      a.href = url;
      a.download = `zhihu-mcn-data-${timestamp}.json`;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

      this.showStatus(`已导出 ${dataCount} 条MCN数据`);
    },

    // 更新MCN数据
    async updateMCNData() {
      try {
        // 从GitHub获取新数据
        const data = await this.fetchFromGitHub();

        // 获取本地存储的键
        const keys = GM_listValues ? GM_listValues() : [];

        // 优先使用本地数据并保存
        for (const key of Object.keys(data)) {
          const localValue = keys.includes(key) ? GM_getValue(key) : undefined;
          const valueToSave = localValue !== undefined ? localValue : data[key];
          GM_setValue(key, valueToSave);
        }

        // 处理本地数据中未在data中出现的键
        for (const key of keys) {
          if (!data.hasOwnProperty(key)) {
            GM_setValue(key, GM_getValue(key)); // 重新保存本地值
          }
        }

        this.showStatus("已更新MCN数据");
        return true;
      } catch (error) {
        console.error("更新MCN数据失败:", error);
        this.showStatus("更新MCN数据失败");
        return false;
      }
    },
    // 从GitHub获取数据
    async fetchFromGitHub() {
      const rawUrl = `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.path}`;

      try {
        console.log("Fetching from URL:", rawUrl); // 调试信息
        const response = await fetch(rawUrl);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data); // 调试信息
        return data;
      } catch (error) {
        console.error("Fetch failed:", error); // 调试信息
        throw error;
      }
    },

    // 获取MCN信息
    getMCNInfo(userId) {
      // 优先从本地存储获取
      const localInfo = GM_getValue(userId);
      if (localInfo) return localInfo;
    },
  };

  // 获取MCN信息的函数（手动模式）
  async function fetchMCNInfo(userId, mcnButton) {
    if (processingUsers.has(userId)) {
      return;
    }

    processingUsers.add(userId);
    mcnButton.textContent = "获取中...";
    mcnButton.disabled = true;

    const tab = GM_openInTab(
      `https://www.zhihu.com/people/${userId}?autoOpened=true`,
      {
        active: false,
        insert: true,
      }
    );

    const checkInterval = setInterval(() => {
      const mcnInfo = GM_getValue(userId);
      if (mcnInfo !== undefined) {
        clearInterval(checkInterval);
        processingUsers.delete(userId);
        mcnButton.textContent = "记录MCN";
        mcnButton.disabled = false;
        updateAllMCNDisplays();
      }
    }, 500);

    setTimeout(() => {
      clearInterval(checkInterval);
      processingUsers.delete(userId);
      mcnButton.textContent = "记录MCN";
      mcnButton.disabled = false;
    }, 10000);
  }

  // 更新所有MCN显示
  function updateAllMCNDisplays() {
    const answers = document.querySelectorAll(".List-item");
    answers.forEach((answer) => {
      const urlMeta = answer.querySelector('meta[itemprop="url"]');
      if (!urlMeta) return;

      const userId = urlMeta.content.split("/").pop();
      const nameElement = answer.querySelector(".AuthorInfo-name");
      if (!nameElement) return;

      // 移除旧的MCN信息
      const oldMcnInfo = nameElement.querySelector(".mcn-info");
      if (oldMcnInfo) {
        oldMcnInfo.remove();
      }

      // 添加新的MCN信息
      const mcnInfo = DataManager.getMCNInfo(userId);
      if (mcnInfo) {
        const mcnElement = document.createElement("span");
        mcnElement.className = "mcn-info";
        mcnElement.textContent = `（MCN: ${mcnInfo}）`;
        nameElement.appendChild(mcnElement);
      }
    });
  }

  // 处理用户页面（用于手动获取MCN信息）
  function handlePeoplePage() {
    if (!window.location.pathname.startsWith("/people/")) {
      return;
    }

    const userId = window.location.pathname.split("/").pop();
    const urlParams = new URLSearchParams(window.location.search);
    const isAutoOpened = urlParams.get("autoOpened") === "true";

    setTimeout(async () => {
      const expandButton = document.querySelector(
        ".ProfileHeader-expandButton"
      );
      if (expandButton) {
        expandButton.click();
      }

      setTimeout(() => {
        const mcnElements = document.querySelectorAll(
          ".ProfileHeader-detailItem"
        );
        let mcnInfo = "";

        for (const element of mcnElements) {
          if (element.textContent.includes("MCN 机构")) {
            const mcnValue = element.querySelector(
              ".ProfileHeader-detailValue"
            );
            if (mcnValue) {
              mcnInfo = mcnValue.textContent.trim();
              // 存储到本地
              GM_setValue(userId, mcnInfo);
              console.log("已保存MCN信息:", userId, mcnInfo);
              break;
            }
          }
        }

        if (isAutoOpened) {
          window.close();
        }
      }, 1000);
    }, 1000);
  }

  // 处理问题页面
  function handleQuestionPage() {
    if (!window.location.pathname.startsWith("/question/")) {
      return;
    }

    function processAnswer(answer) {
      if (answer.classList.contains("processed-mcn")) {
        return;
      }

      const authorInfo = answer.querySelector(".AuthorInfo");
      if (!authorInfo) return;

      const urlMeta = authorInfo.querySelector('meta[itemprop="url"]');
      if (!urlMeta) return;

      const userId = urlMeta.content.split("/").pop();
      answer.classList.add("processed-mcn");

      const nameElement = authorInfo.querySelector(".AuthorInfo-name");
      if (nameElement && !nameElement.querySelector(".mcn-button")) {
        // 创建MCN按钮
        const mcnButton = document.createElement("button");
        mcnButton.className = "mcn-button";
        mcnButton.textContent = "记录MCN";
        mcnButton.onclick = () => fetchMCNInfo(userId, mcnButton);
        nameElement.appendChild(mcnButton);

        // 显示MCN信息
        const mcnInfo = DataManager.getMCNInfo(userId);
        if (mcnInfo) {
          const mcnElement = document.createElement("span");
          mcnElement.className = "mcn-info";
          mcnElement.textContent = `（MCN: ${mcnInfo}）`;
          nameElement.appendChild(mcnElement);
        }
      }
    }

    // 处理已有的回答
    const initialAnswers = document.querySelectorAll(".List-item");
    initialAnswers.forEach(processAnswer);

    // 监听新加载的回答
    const observer = new MutationObserver((mutations) => {
      const answers = document.querySelectorAll(
        ".List-item:not(.processed-mcn)"
      );
      answers.forEach(processAnswer);
    });

    observer.observe(document.querySelector(".List") || document.body, {
      childList: true,
      subtree: true,
    });




  }

  // 初始化
  async function initialize() {
    DataManager.createStatusElement();
    DataManager.addMainButton();

    if (window.location.pathname.startsWith("/people/")) {
      handlePeoplePage();
    } else if (window.location.pathname.startsWith("/question/")) {
      handleQuestionPage();
    }
  }

  // 页面加载完成后初始化
  window.addEventListener("load", initialize);
})();

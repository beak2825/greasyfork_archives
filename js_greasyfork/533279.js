// ==UserScript==
// @name         Emby海报下载
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  在Emby界面悬停时显示海报下载按钮
// @author       You
// @match        http*://*/web/index.html*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533279/Emby%E6%B5%B7%E6%8A%A5%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/533279/Emby%E6%B5%B7%E6%8A%A5%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 调试模式
  const DEBUG = true;

  function debugLog(...args) {
    if (DEBUG) {
      console.log("[Emby海报下载]", ...args);
    }
  }

  // 检查jQuery是否可用
  if (typeof jQuery === "undefined") {
    debugLog("jQuery未加载，尝试使用原生JavaScript");
    return;
  }

  // 创建一个独立的样式
  const styleEl = document.createElement("style");
  styleEl.id = "emby-poster-downloader-style";
  styleEl.textContent = `
    .emby-poster-download-button {
      position: absolute;
      bottom: 100px;
      right: 5px;
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      border-radius: 4px;
      padding: 5px 10px;
      font-size: 12px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 999;
      font-family: Arial, sans-serif;
      pointer-events: auto;
    }
    
    .emby-banner-download-button {
      position: absolute;
      bottom: 75px;
      right: 5px;
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      border-radius: 4px;
      padding: 5px 10px;
      font-size: 12px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 999;
      font-family: Arial, sans-serif;
      pointer-events: auto;
    }

    /* 悬停时显示按钮 */
    .cardOverlayContainer:hover .emby-poster-download-button,
    .cardBox:hover .emby-poster-download-button,
    .card:hover .emby-poster-download-button,
    .cardScalable:hover .emby-poster-download-button,
    .cardContent:hover .emby-poster-download-button,
    .cardImageContainer:hover .emby-poster-download-button,
    .itemsContainer .card:hover .emby-poster-download-button,
    .cardOverlayContainer:hover .emby-banner-download-button,
    .cardBox:hover .emby-banner-download-button,
    .card:hover .emby-banner-download-button,
    .cardScalable:hover .emby-banner-download-button,
    .cardContent:hover .emby-banner-download-button,
    .cardImageContainer:hover .emby-banner-download-button,
    .itemsContainer .card:hover .emby-banner-download-button {
      opacity: 1;
    }

    /* 详情页样式 */
    .detailImageContainer .emby-poster-download-button {
      bottom: 40px;
      z-index: 10;
    }

    .detailImageContainer .emby-banner-download-button {
      bottom: 10px;
      z-index: 10;
    }

    .detailImageContainer:hover .emby-poster-download-button,
    .detailImageContainer:hover .emby-banner-download-button {
      opacity: 1;
    }
  `;
  document.head.appendChild(styleEl);

  // 跟踪添加按钮的itemId，避免重复
  const processedIds = new Set();

  // 标记正在处理，防止无限循环
  let isProcessing = false;

  // 处理海报项目
  function processPosterItems() {
    // 防止重复处理和无限循环
    if (isProcessing) {
      return;
    }

    isProcessing = true;
    debugLog("开始处理海报项目");

    // 首先移除所有现有的下载按钮
    $(".emby-poster-download-button, .emby-banner-download-button").remove();

    // 重置处理状态
    processedIds.clear();

    // 检查是否是详情页
    const isDetailPage = window.location.hash.includes("/item?");
    debugLog("是否为详情页:", isDetailPage);

    if (isDetailPage) {
      // 在详情页中，只处理detailImageContainer
      processDetailPage();
      isProcessing = false;
      return; // 详情页只处理特定节点，不处理其他节点
    }

    // 以下代码只在非详情页（列表页）执行
    // 尝试多种选择器来匹配不同页面的海报容器
    const selectors = [
      // 用户提供的特定选择器
      ".cardBox.cardBox-touchzoom.cardBox-bottompadded",
      ".cardOverlayContainer.itemAction.cardPadder-portrait.cardPadder-margin",
    ];

    for (let selector of selectors) {
      const containers = $(selector);
      if (containers.length > 0) {
        debugLog(`使用选择器 ${selector} 找到 ${containers.length} 个容器`);
        processContainers(containers);
      }
    }

    // 如果上面的选择器都没找到，尝试直接找所有图片
    if (processedIds.size === 0) {
      debugLog("尝试处理所有海报图片");

      const allImages = $('img[src*="/Items/"]');
      if (allImages.length > 0) {
        debugLog(`找到 ${allImages.length} 张图片`);

        allImages.each(function () {
          processImageElement($(this));
        });
      }
    }

    debugLog(`总共添加了 ${processedIds.size} 个下载按钮`);
    isProcessing = false;
  }

  // 处理图片元素
  function processImageElement(img) {
    // 从图片URL提取itemId
    if (!img.attr("src") || !img.attr("src").includes("/Items/")) return;

    const match = img.attr("src").match(/\/Items\/([^\/]+)/);
    if (!match || !match[1]) return;

    const itemId = match[1];

    // 如果此itemId已处理，跳过
    if (processedIds.has(itemId)) return;

    // 寻找合适的父容器
    const parentCard = img
      .closest(".card, .cardBox, .cardScalable, .cardOverlayContainer")
      .first();
    if (!parentCard.length) return;

    // 确保父容器是相对定位
    if (parentCard.css("position") !== "relative") {
      parentCard.css("position", "relative");
    }

    // 创建下载按钮
    createDownloadButton(parentCard, itemId);
    processedIds.add(itemId);
  }

  // 处理详情页
  function processDetailPage() {
    // 在详情页中，只处理detailImageContainer
    const detailImageContainers = $(".detailImageContainer");

    if (detailImageContainers.length > 0) {
      debugLog("找到详情页图片容器:", detailImageContainers.length);

      // 从URL获取itemId
      let itemId = "";
      const match = window.location.hash.match(/item\?id=([^&]+)/);
      if (match && match[1]) {
        itemId = match[1];
      }

      if (itemId) {
        detailImageContainers.each(function () {
          const container = $(this);
          // 确保容器是相对定位
          if (container.css("position") !== "relative") {
            container.css("position", "relative");
          }

          // 创建下载按钮
          createDownloadButton(container, itemId);
          processedIds.add(itemId);
        });
      } else {
        debugLog("详情页未找到itemId");

        // 尝试从图片查找
        detailImageContainers.each(function () {
          const container = $(this);
          const img = container.find('img[src*="/Items/"]');
          if (img.length && img.attr("src")) {
            const imgMatch = img.attr("src").match(/\/Items\/([^\/]+)/);
            if (imgMatch && imgMatch[1]) {
              // 创建下载按钮
              createDownloadButton(container, imgMatch[1]);
              processedIds.add(imgMatch[1]);
            }
          }
        });
      }
    }
  }

  // 创建下载按钮
  function createDownloadButton(container, itemId) {
    // 避免在同一容器添加多个按钮
    if (container.find(".emby-poster-download-button").length) {
      return;
    }

    // 尝试获取标题
    let itemName = "";

    // 检查是否是详情页
    const isDetailPage = window.location.hash.includes("/item?");
    if (isDetailPage) {
      // 从详情页标题获取名称
      const titleElement = $(".itemName-primary");
      if (titleElement.length && titleElement.text()) {
        itemName = titleElement.text().trim();
        debugLog(`创建按钮时从详情页获取到名称: ${itemName}`);
      }
    } else {
      // 在列表页寻找名称
      // 直接在container中查找cardText元素
      const nameElement = container.find(
        ".cardText.cardText-first.cardText-first-padded, .cardText-first"
      );

      if (nameElement.length && nameElement.text()) {
        itemName = nameElement.text().trim();
        debugLog(`创建按钮时从容器内部获取到名称: ${itemName}`);
      }

      // 如果没找到，查找container所在的卡片容器
      if (!itemName) {
        const cardBox = container.closest(".cardBox, .card");

        if (cardBox.length) {
          // 在卡片容器中查找名称元素
          const cardTextElement = cardBox
            .find(
              ".cardText.cardText-first.cardText-first-padded, .cardText-first, [class*='cardText']"
            )
            .first();

          if (cardTextElement.length && cardTextElement.text()) {
            itemName = cardTextElement.text().trim();
            debugLog(`创建按钮时从卡片容器获取到名称: ${itemName}`);
          }
        }
      }
    }

    // 创建海报下载按钮
    const downloadBtn = $("<button>")
      .addClass("emby-poster-download-button")
      .text("海报")
      .attr("data-itemid", itemId);

    // 创建横幅下载按钮
    const bannerBtn = $("<button>")
      .addClass("emby-banner-download-button")
      .text("横幅")
      .attr("data-itemid", itemId);

    // 存储标题到按钮的data属性
    if (itemName) {
      downloadBtn.attr("data-itemname", itemName);
      bannerBtn.attr("data-itemname", itemName);
    }

    downloadBtn.on("click", function (e) {
      e.stopPropagation();
      e.preventDefault();
      downloadPoster(itemId);
      return false;
    });

    bannerBtn.on("click", function (e) {
      e.stopPropagation();
      e.preventDefault();
      downloadBanner(itemId);
      return false;
    });

    container.append(downloadBtn);
    container.append(bannerBtn);
    debugLog("添加按钮, itemId:", itemId, "标题:", itemName || "未找到");
  }

  // 为容器添加下载按钮
  function processContainers(containers) {
    containers.each(function () {
      const container = $(this);
      // 寻找包含itemId的元素
      let itemId = "";

      // 1. 检查容器自身的data-id属性
      if (container.data("id")) {
        itemId = container.data("id");
      }

      // 2. 检查父元素的data-id属性
      if (!itemId) {
        const parentWithId = container.closest("[data-id]");
        if (parentWithId.length && parentWithId.data("id")) {
          itemId = parentWithId.data("id");
        }
      }

      // 3. 从图片URL中提取
      if (!itemId) {
        const img = container.find('img[src*="/Items/"]');
        if (img.length && img.attr("src")) {
          const match = img.attr("src").match(/\/Items\/([^\/]+)/);
          if (match && match[1]) {
            itemId = match[1];
          }
        }
      }

      // 4. 从背景图像中提取
      if (!itemId && container.css("background-image")) {
        const match = container
          .css("background-image")
          .match(/\/Items\/([^\/]+)/);
        if (match && match[1]) {
          itemId = match[1];
        }
      }

      if (itemId && !processedIds.has(itemId)) {
        // 确保容器是相对定位的
        if (container.css("position") !== "relative") {
          container.css("position", "relative");
        }

        // 创建下载按钮
        createDownloadButton(container, itemId);
        processedIds.add(itemId);
      }
    });
  }

  // 下载海报的函数
  function downloadPoster(itemId) {
    // 从当前URL获取域名和端口，构建emby API基础URL
    const currentUrl = new URL(window.location.href);
    const baseUrl = `${currentUrl.protocol}//${currentUrl.host}/emby`;
    const posterUrl = `${baseUrl}/Items/${itemId}/Images/Primary?maxHeight=752&maxWidth=501&quality=90`;

    debugLog(`下载海报: ${posterUrl}`);

    // 获取正确的名称
    let itemName = "";

    // 首先尝试从按钮上直接获取名称
    const downloadButton = $(
      `.emby-poster-download-button[data-itemid="${itemId}"]`
    );
    if (downloadButton.length && downloadButton.attr("data-itemname")) {
      itemName = downloadButton.attr("data-itemname");
      debugLog(`从按钮属性获取到名称: ${itemName}`);
    } else {
      // 如果按钮上没有名称，尝试从DOM中获取
      // 检查是否在详情页
      const isDetailPage = window.location.hash.includes("/item?");
      if (isDetailPage) {
        // 在详情页从<h1 class="itemName-primary">中获取名称
        const titleElement = $(".itemName-primary");
        if (titleElement.length && titleElement.text()) {
          itemName = titleElement.text().trim();
          debugLog(`从详情页获取到名称: ${itemName}`);
        }
      } else {
        // 已移动到按钮创建时获取名称，这里只作为备用方案
        if (downloadButton.length) {
          // 获取按钮的父元素
          const parentElement = downloadButton.parent();

          if (parentElement.length) {
            // 直接在父元素中查找cardText元素
            const nameElement = parentElement.find(
              ".cardText.cardText-first.cardText-first-padded, .cardText-first"
            );

            if (nameElement.length && nameElement.text()) {
              itemName = nameElement.text().trim();
              debugLog(`从按钮父元素内部获取到名称: ${itemName}`);
            } else {
              // 如果没找到，尝试在卡片容器中查找
              const cardBox = parentElement.closest(".cardBox, .card");

              if (cardBox.length) {
                const cardTextElement = cardBox
                  .find(
                    ".cardText.cardText-first.cardText-first-padded, .cardText-first, [class*='cardText']"
                  )
                  .first();

                if (cardTextElement.length && cardTextElement.text()) {
                  itemName = cardTextElement.text().trim();
                  debugLog(`从卡片容器获取到名称: ${itemName}`);
                }
              }
            }
          }
        }
      }
    }

    // 如果没有获取到名称，使用itemId
    const fileName = itemName ? `${itemName}.jpg` : `poster_${itemId}.jpg`;

    // 处理文件名中的非法字符
    const safeFileName = fileName.replace(/[\\/:*?"<>|]/g, "_");

    debugLog(`使用文件名下载: ${safeFileName}`);

    // 创建一个临时链接并触发下载
    fetch(posterUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`请求失败: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = safeFileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      })
      .catch((error) => {
        console.error("下载海报失败:", error);
        alert(`下载海报失败: ${error.message}`);
      });
  }

  // 下载横幅的函数
  function downloadBanner(itemId) {
    // 从当前URL获取域名和端口，构建emby API基础URL
    const currentUrl = new URL(window.location.href);
    const baseUrl = `${currentUrl.protocol}//${currentUrl.host}/emby`;
    const bannerUrl = `${baseUrl}/Items/${itemId}/Images/Backdrop?maxWidth=1920&quality=90`;

    debugLog(`下载横幅: ${bannerUrl}`);

    // 获取正确的名称
    let itemName = "";

    // 首先尝试从按钮上直接获取名称
    const downloadButton = $(
      `.emby-banner-download-button[data-itemid="${itemId}"]`
    );
    if (downloadButton.length && downloadButton.attr("data-itemname")) {
      itemName = downloadButton.attr("data-itemname");
      debugLog(`从按钮属性获取到名称: ${itemName}`);
    } else {
      // 如果按钮上没有名称，尝试从DOM中获取
      // 检查是否在详情页
      const isDetailPage = window.location.hash.includes("/item?");
      if (isDetailPage) {
        // 在详情页从<h1 class="itemName-primary">中获取名称
        const titleElement = $(".itemName-primary");
        if (titleElement.length && titleElement.text()) {
          itemName = titleElement.text().trim();
          debugLog(`从详情页获取到名称: ${itemName}`);
        }
      } else {
        // 已移动到按钮创建时获取名称，这里只作为备用方案
        if (downloadButton.length) {
          // 获取按钮的父元素
          const parentElement = downloadButton.parent();

          if (parentElement.length) {
            // 直接在父元素中查找cardText元素
            const nameElement = parentElement.find(
              ".cardText.cardText-first.cardText-first-padded, .cardText-first"
            );

            if (nameElement.length && nameElement.text()) {
              itemName = nameElement.text().trim();
              debugLog(`从按钮父元素内部获取到名称: ${itemName}`);
            } else {
              // 如果没找到，尝试在卡片容器中查找
              const cardBox = parentElement.closest(".cardBox, .card");

              if (cardBox.length) {
                const cardTextElement = cardBox
                  .find(
                    ".cardText.cardText-first.cardText-first-padded, .cardText-first, [class*='cardText']"
                  )
                  .first();

                if (cardTextElement.length && cardTextElement.text()) {
                  itemName = cardTextElement.text().trim();
                  debugLog(`从卡片容器获取到名称: ${itemName}`);
                }
              }
            }
          }
        }
      }
    }

    // 如果没有获取到名称，使用itemId
    const fileName = itemName
      ? `background-${itemName}.jpg`
      : `banner_${itemId}.jpg`;

    // 处理文件名中的非法字符
    const safeFileName = fileName.replace(/[\\/:*?"<>|]/g, "_");

    debugLog(`使用文件名下载横幅: ${safeFileName}`);

    // 创建一个临时链接并触发下载
    fetch(bannerUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`请求失败: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = safeFileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      })
      .catch((error) => {
        console.error("下载横幅失败:", error);
        alert(`下载横幅失败: ${error.message}`);
      });
  }

  // 使用防抖函数避免过度处理
  function debounce(func, wait) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }

  // 防抖版本的处理函数
  const debouncedProcess = debounce(processPosterItems, 500);

  // 使用MutationObserver监听DOM变化
  const observer = new MutationObserver((mutations) => {
    // 检查变化是否相关
    const relevantChange = mutations.some((mutation) => {
      // 只有当添加了新节点且不是我们自己添加的按钮时才处理
      if (mutation.addedNodes.length > 0) {
        return Array.from(mutation.addedNodes).some((node) => {
          if (node.nodeType === 1) {
            // 元素节点
            return (
              !$(node).hasClass("emby-poster-download-button") &&
              !$(node).find(".emby-poster-download-button").length
            );
          }
          return false;
        });
      }
      return false;
    });

    if (relevantChange && !isProcessing) {
      debouncedProcess();
    }
  });

  // 初始化函数
  function initializeScript() {
    debugLog("脚本初始化");

    // 立即处理现有的海报
    processPosterItems();

    // 开始观察DOM变化
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    debugLog("Emby海报下载脚本已初始化");
  }

  // 在页面完全加载后初始化
  if (document.readyState === "complete") {
    initializeScript();
  } else {
    window.addEventListener("load", initializeScript);
  }

  // 确保延迟处理，应对异步加载内容
  setTimeout(processPosterItems, 1500);

  // 处理SPA路由变化
  window.addEventListener("hashchange", () => {
    debugLog("检测到路由变化");

    // 路由变化时延迟处理
    setTimeout(processPosterItems, 800);
  });
})();

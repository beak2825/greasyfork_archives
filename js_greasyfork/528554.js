// ==UserScript==
// @name         B站稍后再看边栏显示视频时长
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在Bilibili稍后再看的侧边栏中，为每个视频显现播放时长
// @author       迷途小书童007
// @match        https://www.bilibili.com/list/watchlater*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @license      MIT
// @connect      api.bilibili.com
// @downloadURL https://update.greasyfork.org/scripts/528554/B%E7%AB%99%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E8%BE%B9%E6%A0%8F%E6%98%BE%E7%A4%BA%E8%A7%86%E9%A2%91%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/528554/B%E7%AB%99%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E8%BE%B9%E6%A0%8F%E6%98%BE%E7%A4%BA%E8%A7%86%E9%A2%91%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 简化常量定义
  const API_URL = "https://api.bilibili.com/x/v2/history/toview/web";
  const SELECTOR = {
    CONTAINER: ".action-list-inner",
    ITEM: ".action-list-item-wrap",
    COVER: ".cover",
    IMAGE: ".cover-img img, .cover-img source",
    TITLE: ".info .title",
  };

  // 视频信息缓存
  const videoInfoCache = new Map();

  // 主函数
  function init() {
    // 添加CSS
    document.head.insertAdjacentHTML(
      "beforeend",
      `
      <style>
        .duration-overlay {
          position: absolute;
          right: 5px;
          bottom: 5px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 2px 5px;
          border-radius: 2px;
          font-size: 12px;
          z-index: 10;
        }
      </style>
    `
    );

    // 延迟执行初始化操作
    setTimeout(async () => {
      await refreshVideoData();
      observeChanges();
    }, 500);
  }

  // 获取API数据并刷新缓存
  async function refreshVideoData() {
    const videoList = await fetchVideos();
    if (!videoList.length) return false;

    // 清空并重建缓存
    videoInfoCache.clear();

    // 构建查找索引
    videoList.forEach((video) => {
      // 图片ID索引
      const imageId = extractImageId(video.pic);
      if (imageId) videoInfoCache.set(`img:${imageId}`, video);

      // 标题索引 (备用)
      if (video.title) videoInfoCache.set(`title:${video.title}`, video);
    });

    // 更新所有视频时长显示
    updateAllVideoDurations();
    return true;
  }

  // 格式化时长
  function formatDuration(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}`.padStart(2, "0") + ":" + `${sec}`.padStart(2, "0");
  }

  // 从图片URL提取标识符
  function extractImageId(url) {
    if (!url) return null;
    const match = url.match(/\/([a-f0-9]+)\.(jpg|png|webp)/i);
    return match ? match[1] : null;
  }

  // 获取API数据 (带重试)
  async function fetchVideos(retries = 2) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await new Promise((resolve) => {
          GM_xmlhttpRequest({
            method: "GET",
            url: API_URL,
            headers: { Referer: "https://www.bilibili.com/" },
            onload: resolve,
            onerror: () => resolve({ responseText: "{}" }),
          });
        });

        const data = JSON.parse(response.responseText);
        if (data?.code === 0 && data?.data?.list?.length > 0) {
          return data.data.list;
        }
      } catch (e) {}

      // 如果失败且还有重试次数，则等待后重试
      if (attempt < retries) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (attempt + 1))
        );
      }
    }

    return [];
  }

  // 从DOM元素获取标识信息
  function getVideoIdentifiers(element) {
    const result = {};

    // 获取标题
    const titleEl = element.querySelector(SELECTOR.TITLE);
    if (titleEl) {
      result.title =
        titleEl.getAttribute("title") || titleEl.textContent.trim();
    }

    // 获取图片ID
    const imgElements = element.querySelectorAll(SELECTOR.IMAGE);
    for (const img of imgElements) {
      const src = img.getAttribute("src") || img.getAttribute("srcset");
      const imageId = extractImageId(src);
      if (imageId) {
        result.imageId = imageId;
        break;
      }
    }

    return result;
  }

  // 为视频添加时长标签
  function addDurationToVideo(element) {
    const cover = element.querySelector(SELECTOR.COVER);
    if (!cover || cover.querySelector(".duration-overlay")) return false;

    // 获取标识符并查找匹配的视频信息
    const identifiers = getVideoIdentifiers(element);
    if (!identifiers.imageId && !identifiers.title) return false;

    // 查找匹配视频
    const videoInfo =
      (identifiers.imageId &&
        videoInfoCache.get(`img:${identifiers.imageId}`)) ||
      (identifiers.title && videoInfoCache.get(`title:${identifiers.title}`));

    if (!videoInfo) return false;

    // 确保cover元素为相对定位
    if (getComputedStyle(cover).position === "static") {
      cover.style.position = "relative";
    }

    // 创建并添加时长标签
    const duration = document.createElement("div");
    duration.className = "duration-overlay";
    duration.textContent = formatDuration(videoInfo.duration || 0);
    cover.appendChild(duration);

    return true;
  }

  // 更新所有视频的时长显示
  function updateAllVideoDurations() {
    document.querySelectorAll(SELECTOR.ITEM).forEach(addDurationToVideo);
  }

  // 设置DOM变化观察器
  function observeChanges() {
    const container = document.querySelector(SELECTOR.CONTAINER);
    if (!container) {
      setTimeout(observeChanges, 1000);
      return;
    }

    // 创建节流函数
    let timer = null;
    const handleChanges = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => refreshVideoData(), 300);
    };

    // 创建并设置MutationObserver
    new MutationObserver((mutations) => {
      // 只在有实质性变化时触发更新
      const needsUpdate = mutations.some(
        (mutation) =>
          (mutation.type === "childList" && mutation.addedNodes.length > 0) ||
          (mutation.type === "attributes" &&
            ["class", "style"].includes(mutation.attributeName))
      );

      if (needsUpdate) handleChanges();
    }).observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });
  }

  // 启动脚本
  init();
})();

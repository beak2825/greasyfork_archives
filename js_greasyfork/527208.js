// ==UserScript==
// @name         爱给网音频助手
// @namespace    http://tampermonkey.net/
// @author       Dogxi
// @version      1.0
// @license      MIT
// @description  获取爱给网音频直链并下载，需先播放音频!!
// @match        https://www.aigei.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/ajax-hook@2.1.3/dist/ajaxhook.min.js
// @downloadURL https://update.greasyfork.org/scripts/527208/%E7%88%B1%E7%BB%99%E7%BD%91%E9%9F%B3%E9%A2%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/527208/%E7%88%B1%E7%BB%99%E7%BD%91%E9%9F%B3%E9%A2%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 全局变量记录当前音频项
  let currentAudioBox = null;
  // 初始读取本地缓存
  let audioCache = JSON.parse(localStorage.getItem("aigeiAudioCache") || "{}");

  // 清理过期缓存
  for (const title in audioCache) {
    if (Date.now() > audioCache[title].expire) {
      delete audioCache[title];
    }
  }

  // 同步缓存到 localStorage
  function saveCache() {
    localStorage.setItem("aigeiAudioCache", JSON.stringify(audioCache));
  }
  saveCache();

  // 防抖函数
  function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  // 获取音频标题
  function getAudioTitle(audioBox) {
    const titleElement = audioBox.querySelector(".title-name");
    return titleElement ? titleElement.innerText.trim() : "未知音频";
  }

  // 更新下载按钮
  function updateDownloadBtn(audioBox, encodedUrl) {
    const btn = audioBox.querySelector(".download-btn");
    if (!btn) return;
    const fileName = getAudioTitle(audioBox) + ".mp3";
    const decodedUrl = atob(encodedUrl);

    btn.removeEventListener("click", btn.clickHandler);

    btn.clickHandler = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(decodedUrl, {
          headers: { Referer: "https://www.aigei.com/" },
        });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("下载失败:", err);
      }
    };
    btn.addEventListener("click", btn.clickHandler);
    btn.innerHTML = "直链下载";
    btn.style.marginLeft = "7px";
    btn.style.cursor = "pointer";
    btn.removeAttribute("disabled");
  }

  // 初始化下载按钮
  function initDownloadButtons() {
    const audioBoxes = document.querySelectorAll(".audio-item-box");
    audioBoxes.forEach((box) => {
      const titleEl = box.querySelector(".title-name");
      const playBtn = box.querySelector(".audio-player-btn");
      // 如果没有下载按钮则创建
      if (titleEl && !titleEl.parentNode.querySelector(".download-btn")) {
        const btn = document.createElement("a");
        btn.className = "btn btn-default download-btn";
        btn.innerHTML = "等待获取";
        btn.style.marginLeft = "7px";
        btn.style.cursor = "not-allowed";
        btn.setAttribute("disabled", "disabled");
        titleEl.parentNode.insertBefore(btn, titleEl);
      }
      // 若已有缓存则直接更新
      const title = getAudioTitle(box);
      const cacheItem = audioCache[title];
      if (cacheItem && Date.now() < cacheItem.expire) {
        updateDownloadBtn(box, cacheItem.message);
      }
      // 绑定播放按钮
      if (playBtn && !playBtn.hasEventListener) {
        playBtn.hasEventListener = true;
        playBtn.addEventListener("click", () => {
          currentAudioBox = box;
        });
      }
    });
  }

  // 使用 ajaxHook 拦截请求
  ah.proxy({
    onRequest: (config, handler) => {
      handler.next(config);
    },
    onResponse: (response, handler) => {
      if (response.config.url.includes("/f/d/audio_mp3")) {
        try {
          const json = JSON.parse(response.response);
          if (json.status === "success" && json.message && currentAudioBox) {
            const title = getAudioTitle(currentAudioBox);
            // 写入缓存(过期时间24小时)
            audioCache[title] = {
              message: json.message,
              expire: Date.now() + 24 * 60 * 60 * 1000,
            };
            saveCache();
            updateDownloadBtn(currentAudioBox, json.message);
          }
        } catch (e) {
          console.error("解析响应失败:", e);
        }
      }
      handler.next(response);
    },
    onError: (err, handler) => {
      console.error("请求错误:", err);
      handler.next(err);
    },
  });

  // 初始化脚本
  function init() {
    initDownloadButtons();
    // 仅监听主要音频列表容器，使用防抖
    const mainContainer =
      document.querySelector(".audio-list-content") || document.body;
    const debouncedInit = debounce(initDownloadButtons, 500);
    const observer = new MutationObserver(() => {
      debouncedInit();
    });
    observer.observe(mainContainer, {
      childList: true,
      subtree: true,
    });
  }

  // 启动脚本
  init();
})();

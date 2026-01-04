// ==UserScript==
// @name         B站播放器动态视频预览
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  为B站动态页面的视频添加预览功能
// @author       Ts8zs
// @license GPL
// @match        https://player.bilibili.com/player.html
// @match        https://t.bilibili.com/
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/527836/B%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E5%8A%A8%E6%80%81%E8%A7%86%E9%A2%91%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/527836/B%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E5%8A%A8%E6%80%81%E8%A7%86%E9%A2%91%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 监听播放结束事件
  const video = document.querySelector("video");
  if (video) {
    video.addEventListener("ended", () => {
      window.parent.postMessage("bilibili:player:ended", "*");
    });
  }

  // 样式注入
  GM_addStyle(`
          .bili-dyn-home--member {
              justify-content: left !important;
              padding: 10px;
          }
          .preview-btn {
              position: absolute;
              left: 10px;
              bottom: 10px;
              z-index: 1000000;
              padding: 5px 10px;
              background: rgba(128, 128, 128, 0.2);
              color: white;
              border-radius: 4px;
              cursor: pointer;
              transition: opacity 0.3s;
          }
          .preview-btn:hover {
              opacity: 0.8;
          }
          #preview-container {
              position: fixed;
              right: 20px;
              bottom: 20px;
              width: 48vw;
      height: 27vw;
              background: black;
              z-index: 9999;
              border-radius: 8px;
              box-shadow: 0 0 10px #000;
              overflow: hidden;
              transition: all 0.3s;
          }
          #preview-container.maximized {
              width: 100vw;
              height: 100vh;
              right: 0;
              bottom: 0;
              z-index: 10000000;
              transform: translate(0, 0); /* 确保全屏时容器居中 */
          }
          #preview-player {
              width: 100%;
              height: 100%;
              border-width: 0px;
          }
          .preview-controls {
              position: absolute;
              top: 10px;
              right: 10px;
              display: flex;
              gap: 10px;
          }
          .control-btn {
              padding: 5px 10px;
              background: rgba(0, 0, 0, 0.2);
            opacity:0.2;
              color: white;
              border-radius: 4px;
              cursor: pointer;
          }
          .control-btn:hover {
              opacity:1;
              background: rgba(0, 0, 0, 0.4);
          }
      `);

  // 视频队列和状态管理
  let currentIndex = 0;
  let videoList = [];
  let isMaximized = false;

  // 初始化预览容器
  const initPreviewContainer = () => {
    const container = document.createElement("div");
    container.id = "preview-container";
    container.style.display = "none"; // 初始时隐藏预览容器
    container.innerHTML = `
              <div class="preview-controls">
                    <div class="control-btn" id="next-video">⏭</div>
                  <div class="control-btn" id="maximize">⛶</div>
                  <div class="control-btn" id="close-preview">✕</div> <!-- 添加关闭按钮 -->
              </div>
              <iframe id="preview-player" allowfullscreen></iframe>
          `;
    document.body.appendChild(container);

    // 控制按钮事件
    container
      .querySelector("#maximize")
      .addEventListener("click", toggleMaximize);
    container.querySelector("#next-video").addEventListener("click", playNext);
    container
      .querySelector("#close-preview")
      .addEventListener("click", closePreview); // 添加关闭按钮事件
  };

  // 最大化切换
  const toggleMaximize = () => {
    const container = document.querySelector("#preview-container");
    isMaximized = !isMaximized;
    container.classList.toggle("maximized", isMaximized);
  };

  // 播放控制
  const playVideo = (index) => {
    const container = document.querySelector("#preview-container");
    container.style.display = "block"; // 播放时显示预览容器
    currentIndex = index;
    const video = videoList[currentIndex];
    const iframe = document.querySelector("#preview-player");

    // 隐藏 .left 和 .right 元素
    document
      .querySelectorAll(".left, .right")
      .forEach((el) => (el.style.display = "none"));

    // 使用新的播放器参数支持事件监听
    iframe.src = `https://player.bilibili.com/player.html?bvid=${video.bvid}&autoplay=1&page=1&enable_ssl=1&crossDomain=1`;

    // 监听播放结束事件
    window.addEventListener("message", (e) => {
      if (e.origin !== "https://player.bilibili.com") return;
      if (e.data === "bilibili:player:ended") {
        playNext();
      }
    });
  };

  const playNext = () => {
    if (currentIndex < videoList.length - 1) {
      // 滚动到对应的视频链接位置
      const nextVideoElement = videoList[currentIndex + 1].element;
      nextVideoElement.scrollIntoView({ behavior: "smooth", block: "center" });
      playVideo(currentIndex + 1);
    }
  };

  // 关闭预览容器并恢复 .left 和 .right 元素
  const closePreview = () => {
    const container = document.querySelector("#preview-container");
    container.style.display = "none";
    document
      .querySelectorAll(".left, .right")
      .forEach((el) => (el.style.display = ""));
    const iframe = document.querySelector("#preview-player");
    if (iframe) {
        iframe.remove(); // 删除 iframe 元素
    }
    container.innerHTML = `
        <div class="preview-controls">
            <div class="control-btn" id="maximize">⛶</div>
            <div class="control-btn" id="next-video">⏭</div>
            <div class="control-btn" id="close-preview">✕</div> <!-- 添加关闭按钮 -->
        </div>
        <iframe id="preview-player" allowfullscreen></iframe>
    `;
    // 重新绑定事件
    container
      .querySelector("#maximize")
      .addEventListener("click", toggleMaximize);
    container.querySelector("#next-video").addEventListener("click", playNext);
    container
      .querySelector("#close-preview")
      .addEventListener("click", closePreview); // 添加关闭按钮事件
  };

  // 动态检测处理器
  const processCards = () => {
    document.querySelectorAll(".bili-dyn-list__item").forEach((card) => {
      if (card.dataset.processed) return;

      const videoLink = card.querySelector('a[href*="/video/BV"]');
      if (videoLink) {
        const bvid = videoLink.href.match(/video\/(BV\w+)/)[1];
        const previewBtn = document.createElement("div");
        previewBtn.className = "preview-btn";
        previewBtn.textContent = "▶";

        previewBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          videoList = Array.from(
            document.querySelectorAll(".bili-dyn-list__item")
          )
            .filter((c) => c.querySelector('a[href*="/video/BV"]'))
            .map((c) => ({
              element: c,
              bvid: c
                .querySelector('a[href*="/video/BV"]')
                .href.match(/video\/(BV\w+)/)[1],
            }));
          const currentIdx = videoList.findIndex((v) => v.element === card);
          playVideo(currentIdx);
        });

        card.style.position = "relative";
        card.appendChild(previewBtn);
        card.dataset.processed = true;
      }
    });
  };

  // 初始化执行
  initPreviewContainer();
  processCards();

  // 动态内容监听
  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        processCards();
      }
    });
  }).observe(document.querySelector("#app"), {
    childList: true,
    subtree: true,
  });

  // 播放结束检测（需根据实际播放情况调整）
  setInterval(() => {
    const iframe = document.querySelector("#preview-player");
    if (iframe && iframe.contentWindow) {
      try {
        const player = iframe.contentWindow.document.querySelector("video");
        if (player && player.ended) {
          playNext();
        }
      } catch (e) {
        // 跨域安全限制
      }
    }
  }, 1000);
})(); 
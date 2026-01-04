// ==UserScript==
// @name         DeepSeek Screenshoter
// @namespace    https://greasyfork.org/users/1312316
// @version      1.4.1
// @description  将DeepSeek回答内容转为图片并复制到剪贴板
// @author       星小韵
// @iconURL      https://www.google.com/s2/favicons?sz=64&domain=chat.deepseek.com
// @icon64URL    https://www.google.com/s2/favicons?sz=64&domain=chat.deepseek.com
// @match        https://chat.deepseek.com/*
// @connect      deepseek.com
// @require      https://fastly.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      MIT License
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/527018/DeepSeek%20Screenshoter.user.js
// @updateURL https://update.greasyfork.org/scripts/527018/DeepSeek%20Screenshoter.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 顶部气泡提示系统
  function showToast(message, type = "info", duration = 3000) {
    const toast = document.createElement("div");
    toast.className = `ds-toast ds-toast-${type}`;
    toast.innerHTML = `
          ${type === "loading" ? `<div class="ds-spinner"></div>` : ""}
          <span>${message}</span>
        `;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);
    if (duration > 0) {
      setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }
    return toast;
  }

  // 全局样式
  GM_addStyle(`
      /* 统一按钮样式 */
      .ds-icon-button:hover {
        background-color: var(--ds-icon-button-hover-color, #44444D) !important;
      }
  
      /* 提示气泡 */
      [data-tooltip]::before, [data-tooltip]::after {
        transition: opacity 0.2s ease;
        opacity: 0;
        pointer-events: none;
      }
      [data-tooltip]::before {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: rgb(0, 0, 0);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        margin-bottom: 6px;
      }
      [data-tooltip]::after {
        content: '';
        position: absolute;
        bottom: calc(100% - 4px);
        left: 50%;
        transform: translateX(-50%);
        border: 4px solid transparent;
        border-top-color: rgba(0, 0, 0, 0.8);
      }
      [data-tooltip]:hover::before,
      [data-tooltip]:hover::after {
        opacity: 1;
      }
  
      /* 消息气泡样式 */
      .ds-bubble {
        background: rgba(255,255,255,0.05);
        border-radius: 12px;
        padding: 16px;
        position: relative;
        color: #CDD4DF;
        line-height: 1.6;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        word-break: break-word;
        overflow-wrap: anywhere;
      }
      .ds-bubble::before {
        content: '';
        position: absolute;
        left: -16px;
        top: 12px;
        border: 8px solid transparent;
        border-right-color: rgba(255,255,255,0.05);
      }
  
      /* 顶部提示 */
      .ds-toast {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(40, 42, 54, 0.95);
        color: #FFFFFF;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-family: -apple-system, system-ui;
        display: inline-flex;
        align-items: center;
        gap: 12px;
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 99999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        backdrop-filter: blur(4px);
      }
      .ds-toast.show { opacity: 1; transform: translateX(-50%) translateY(10px); }
      .ds-spinner {
        width: 18px;
        height: 18px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top-color: #00E599;
        border-radius: 50%;
        animation: ds-spin 0.8s linear infinite;
      }
          .ds-toast-success {
            background: rgba(0, 184, 120, 0.95);
          .ds-toast-error {
            background: rgba(255, 85, 85, 0.95);
          }
      @keyframes ds-spin { to { transform: rotate(360deg); } }
  
      /* 覆盖markdown样式 */
      .ds-capture-markdown * {
        color: #CDD4DF !important;
        font-family: system-ui !important;
        max-width: 100% !important;
      }
      .ds-capture-markdown pre {
        background: rgba(0,0,0,0.3) !important;
        padding: 12px !important;
        border-radius: 8px !important;
      }
      .ds-capture-markdown code {
        background: transparent !important;
        padding: 0 !important;
      }
      .ds-capture-markdown img {
        max-width: 100% !important;
        border-radius: 8px;
      }
    `);

  // 创建截图按钮
  function createScreenshotButton(container) {
    const btn = document.createElement("div");
    btn.className = "ds-screenshot-btn";
    btn.setAttribute("data-tooltip", "截图");
    btn.style.cssText = `
          --ds-icon-button-text-color: #CDD4DF;
          padding: 4px;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
          position: relative;
        `;

    btn.innerHTML = `<svg viewBox="0 0 1024 1024" width="23" height="23"><path d="M853.333333 219.428571a73.142857 73.142857 0 0 1 73.142857 73.142858v487.619047a73.142857 73.142857 0 0 1-73.142857 73.142857H170.666667a73.142857 73.142857 0 0 1-73.142857-73.142857V292.571429a73.142857 73.142857 0 0 1 73.142857-73.142858h682.666666z m0 73.142858H170.666667v487.619047h682.666666V292.571429z m-341.333333 73.142857a170.666667 170.666667 0 1 1 0 341.333333 170.666667 170.666667 0 0 1 0-341.333333z m0 73.142857a97.52381 97.52381 0 1 0 0 195.047619 97.52381 97.52381 0 0 0 0-195.047619zM853.333333 97.52381v73.142857H512V97.52381h341.333333z" fill="currentColor"></path></svg>`;

    btn.onclick = async () => {
      let loadingToast;
      try {
        loadingToast = showToast("正在生成截图...", "loading", 0);
        const DeepSeekFace = container.querySelector(".eb23581b.dfa60d66");
        const deepSearch = container.querySelector(
          ".f9bf7997.d7dc56a8.c05b5566 > .a6d716f5.db5991dd"
        );
        const deepThink = container.querySelector(".edb250b1");
        const markdownContent = container.querySelector(".ds-markdown");

        // 创建截图容器
        const captureWrapper = document.createElement("div");
        captureWrapper.style.cssText = `
              background: #1A1B25;
              border-radius: 12px;
              position: fixed;
              left: -9999px;
              width: calc(100% - 32px);
              max-width: 680px;
              box-shadow: 0 0 12px rgba(0,0,0,0.2);
              padding: 20px;
          `;

        // 消息气泡容器
        const messageContainer = document.createElement("div");
        messageContainer.style.cssText = `
              display: flex;
              gap: 16px;
              align-items: flex-start;
              margin-bottom: 20px;
              min-width: 300px;
          `;

        // 左侧头像
        if (DeepSeekFace) {
          const cloneFace = DeepSeekFace.cloneNode(true);
          cloneFace.style.cssText = `
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          margin-top: 2px;
          position: relative;
          z-index: 1;
      `;
          messageContainer.appendChild(cloneFace);
        }

        // 右侧气泡
        const bubble = document.createElement("div");
        bubble.className = "ds-bubble";
        bubble.style.cssText = `
      flex: 1;
      min-width: 240px;
      max-width: calc(100% - 64px);
      margin-right: 8px;
  `;

        // 克隆内容
        if (deepSearch) {
          const cloneSearch = deepSearch.cloneNode(true);
          bubble.appendChild(cloneSearch);
          if (deepThink) {
            cloneSearch.style.marginBottom = "10px";
          } else {
            cloneSearch.style.margin = "0";
          }
        }
        if (deepThink) {
          const cloneDeep = deepThink.cloneNode(true);
          cloneDeep.style.margin = "0";
          bubble.appendChild(cloneDeep);
        }
        if (markdownContent) {
          const cloneMarkdown = markdownContent.cloneNode(true);
          cloneMarkdown.className += " ds-capture-markdown";
          bubble.appendChild(cloneMarkdown);
        }

        messageContainer.appendChild(bubble);
        captureWrapper.appendChild(messageContainer);

        // 版权声明
        const footer = document.createElement("div");
        footer.style.cssText = `
              margin-top: 20px;
              padding-top: 12px;
              border-top: 1px solid rgba(255,255,255,0.1);
              color: rgba(205, 212, 223, 0.6);
              font-size: 12px;
              text-align: right;
          `;
        footer.textContent =
          "内容由 DeepSeek 生成，图片由 DeepSeek Screenshoter 生成";
        captureWrapper.appendChild(footer);

        document.body.appendChild(captureWrapper);

        // 生成截图
        const canvas = await html2canvas(captureWrapper, {
          useCORS: true,
          logging: false,
          scale: 2,
          backgroundColor: "#1A1B25",
        });

        document.body.removeChild(captureWrapper);

        canvas.toBlob(async (blob) => {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);

            loadingToast.innerHTML = `
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#fff"/>
                  </svg>
                  <span>截图已复制到剪贴板！</span>
                `;
            loadingToast.classList.add("ds-toast-success");
            loadingToast.classList.remove("ds-toast-loading");

            setTimeout(() => {
              loadingToast.classList.remove("show");
              setTimeout(() => loadingToast.remove(), 300);
            }, 2000);
          } catch (err) {
            console.error("复制失败:", err);
            throw new Error("clipboard-error");
          }
        }, "image/png");
      } catch (error) {
        if (loadingToast) {
          loadingToast.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="#fff"/>
                </svg>
                <span>${
                  error.message === "clipboard-error"
                    ? "请手动粘贴图片"
                    : "生成失败，请重试"
                }</span>
              `;
          loadingToast.classList.add("ds-toast-error");
          loadingToast.classList.remove("ds-toast-loading", "show");
          setTimeout(() => {
            loadingToast.classList.add("show");
            setTimeout(() => {
              loadingToast.classList.remove("show");
              setTimeout(() => loadingToast.remove(), 300);
            }, 3000);
          }, 10);
        }
      }
    };

    return btn;
  }

  // 处理消息容器
  function processAnswers() {
    document.querySelectorAll(".f9bf7997.c05b5566").forEach((container) => {
      const buttonBar = container.querySelector(".ds-flex.abe97156");
      if (!buttonBar) return;

      if (!buttonBar.querySelector(".ds-screenshot-btn")) {
        const btn = createScreenshotButton(container);
        buttonBar.appendChild(btn);
      }
    });
  }

  // 初始运行
  processAnswers();

  // 监听动态内容
  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        setTimeout(processAnswers, 500);
      }
    });
  }).observe(document.body, {
    childList: true,
    subtree: true,
  });
})();

// ==UserScript==
// @name               Copy token from skland for ark.yituliu.cn
// @name:zh-CN         一键复制明日方舟一图流所需的森空岛token
// @namespace          ling921
// @version            0.2.0
// @description        Script to copy skland token to ark.yituliu.cn
// @description:zh-CN  脚本用于复制森空岛token到明日方舟一图流中使用，并支持Shift+C快捷键
// @author             ling921
// @match              https://www.skland.com/*
// @icon               https://ark.yituliu.cn/favicon.ico
// @grant              none
// @run-at             document-idle
// @tag                utilities
// @tag                game
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/520836/Copy%20token%20from%20skland%20for%20arkyituliucn.user.js
// @updateURL https://update.greasyfork.org/scripts/520836/Copy%20token%20from%20skland%20for%20arkyituliucn.meta.js
// ==/UserScript==

/**
 * 通知管理器类
 */
class NotificationManager {
  static #instance = null;
  static #maxNotifications = 3;
  static #defaultDuration = 3000;
  static #queue = [];
  static #active = new Set();
  static #container = null;

  /**
   * 获取通知管理器实例
   * @param {{
   *  maxNotifications?: number,
   *  duration?: number
   * }} options - 配置选项
   */
  static getInstance(options = {}) {
    if (!NotificationManager.#instance) {
      if (options.maxNotifications && options.maxNotifications > 0) {
        NotificationManager.#maxNotifications = options.maxNotifications;
      }
      if (options.duration && options.duration > 0) {
        NotificationManager.#defaultDuration = options.duration;
      }
      NotificationManager.#instance = new NotificationManager(options);
    }
    return NotificationManager.#instance;
  }

  constructor() {
    if (NotificationManager.#instance) {
      return NotificationManager.#instance;
    }

    NotificationManager.#container = document.getElementById(
      "notification-container"
    );
    if (!NotificationManager.#container) {
      const style = document.createElement("style");
      style.textContent = `
        #notification-container {
          position: fixed;
          top: 20px;
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          pointer-events: none;
          z-index: 10000;
        }
        
        #notification-container .notification {
          position: relative;
          padding: 10px 25px;
          padding-right: 35px !important;
          border-radius: 20px;
          font-size: 14px;
          color: white;
          font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          text-align: center;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transform: translateY(-20px);
          pointer-events: auto;
        }

        #notification-container .notification:hover {
          filter: brightness(1.1);
        }

        #notification-container .notification .close {
          position: absolute !important;
          right: 10px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          width: 16px !important;
          height: 16px !important;
          cursor: pointer !important;
          opacity: 0.7 !important;
          transition: opacity 0.2s !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          user-select: none !important;
        }

        #notification-container .notification .close:hover {
          opacity: 1 !important;
        }

        #notification-container .success {
          background-color: #52c41a !important;
          box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
        }

        #notification-container .info {
          background-color: #1890ff !important;
          box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
        }

        #notification-container .warning {
          background-color: #faad14 !important;
          box-shadow: 0 4px 12px rgba(250, 173, 20, 0.3) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }

        #notification-container .error {
          background-color: #ff4d4f !important;
          box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
      `;
      document.head.appendChild(style);

      NotificationManager.#container = document.createElement("div");
      NotificationManager.#container.id = "notification-container";
      document.body.appendChild(NotificationManager.#container);
    }

    NotificationManager.#instance = this;
  }

  success(message, duration) {
    this.#show(message, "success", duration);
  }

  info(message, duration) {
    this.#show(message, "info", duration);
  }

  warning(message, duration) {
    this.#show(message, "warning", duration);
  }

  error(message, duration) {
    this.#show(message, "error", duration);
  }

  #show(message, type, duration) {
    if (!duration || duration <= 0) {
      duration = NotificationManager.#defaultDuration;
    }
    NotificationManager.#queue.push({ message, type, duration });
    NotificationManager.#processQueue();
  }

  static #processQueue() {
    if (
      NotificationManager.#queue.length === 0 ||
      NotificationManager.#active.size >= NotificationManager.#maxNotifications
    ) {
      return;
    }

    const { message, type, duration } = NotificationManager.#queue.shift();
    NotificationManager.#showNotification(message, type, duration);

    if (NotificationManager.#queue.length > 0) {
      NotificationManager.#processQueue();
    }
  }

  static #showNotification(
    message,
    type,
    duration = NotificationManager.#defaultDuration
  ) {
    const notify = document.createElement("div");
    notify.classList.add("notification", type);

    const messageText = document.createElement("span");
    messageText.textContent = message;
    notify.appendChild(messageText);

    const removeNotify = () => {
      notify.style.opacity = "0";
      notify.style.transform = "translateY(-20px)";
      setTimeout(() => {
        notify.remove();
        NotificationManager.#active.delete(notify);
        NotificationManager.#processQueue();
      }, 300);
    };

    const closeBtn = document.createElement("div");
    closeBtn.classList.add("close");
    closeBtn.innerHTML = "✕";
    closeBtn.onclick = removeNotify;
    notify.appendChild(closeBtn);

    let timer;

    notify.addEventListener("mouseenter", () => {
      clearTimeout(timer);
    });

    notify.addEventListener("mouseleave", () => {
      timer = setTimeout(removeNotify, duration);
    });

    NotificationManager.#container.appendChild(notify);
    NotificationManager.#active.add(notify);

    requestAnimationFrame(() => {
      notify.style.opacity = "1";
      notify.style.transform = "translateY(0)";
    });

    timer = setTimeout(removeNotify, duration);
  }
}

/**
 * 防抖复制令牌
 */
const debouncedCopyToken = debounce(copyToken, 300);

/**
 * 消息通知
 */
const message = NotificationManager.getInstance();

(function () {
  ("use strict");

  // 添加按钮
  const button = createButton();
  document.body.appendChild(button);

  // 添加快捷键
  document.addEventListener("keydown", (event) => {
    if (event.shiftKey && event.key.toLowerCase() === "c") {
      event.preventDefault();
      debouncedCopyToken();
    }
  });
})();

/**
 * 创建按钮
 * @returns {HTMLElement} - 按钮元素
 */
function createButton() {
  // 创建按钮
  const button = document.createElement("div", { class: "copy-button" });
  button.innerHTML = `
      <div class="main-text">复制</div>
      <div class="shortcut">Shift + C</div>
  `;
  button.style.cssText = `
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(71, 120, 224, 0.85);
    color: rgba(255, 255, 255, 0.95);
    border: none;
    padding: 10px 20px;
    border-radius: 20px 0 0 20px;
    cursor: pointer;
    font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
    font-size: 14px;
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 9999;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
    line-height: 1.4;
    box-shadow: 0 2px 8px rgba(71, 120, 224, 0.2);
    min-width: 80px;
  `;

  // 添加内部元素的样式
  const style = document.createElement("style");
  style.textContent = `
    .copy-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      user-select: none;
    }
    .main-text {
      font-size: 14px;
      transition: min-width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      width: 100%;
    }
    .shortcut {
      font-size: 10px;
      opacity: 0.8;
      margin-top: 2px;
    }
    .copy-button {
      transform-origin: right center;
    }
    .copy-button:hover {
      min-width: 140px;
      padding-right: 25px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .copy-button:active {
      transform: translateY(-50%) scale(0.98);
    }
  `;
  document.head.appendChild(style);

  let isAnimating = false;
  let currentAnimation = null; // 用于存储当前动画的定时器
  const fullText = "一图流令牌";
  const typingSpeed = 50; // 打字速度(ms)

  /**
   * 打字动画
   * @param {HTMLElement} element - 要打字的元素
   * @param {string} text - 要打字的文本
   * @param {number} currentIndex - 当前索引
   * @returns {void}
   */
  function typeText(element, text, currentIndex = 0) {
    if (currentAnimation) {
      clearTimeout(currentAnimation);
    }

    if (currentIndex <= text.length) {
      element.textContent = "复制" + text.slice(0, currentIndex);
      currentAnimation = setTimeout(() => {
        typeText(element, text, currentIndex + 1);
      }, typingSpeed);
    } else {
      isAnimating = false;
      currentAnimation = null;
    }
  }

  /**
   * 删除文本
   * @param {HTMLElement} element - 要删除文本的元素
   * @param {string} text - 要删除的文本
   * @param {number} currentIndex - 当前索引
   * @returns {void}
   */
  function deleteText(element, text, currentIndex = text.length) {
    if (currentAnimation) {
      clearTimeout(currentAnimation);
    }

    if (currentIndex >= 0) {
      element.textContent = "复制" + text.slice(0, currentIndex);
      currentAnimation = setTimeout(() => {
        deleteText(element, text, currentIndex - 1);
      }, typingSpeed);
    } else {
      isAnimating = false;
      currentAnimation = null;
    }
  }

  // 添加悬停效果
  button.addEventListener("mouseenter", () => {
    if (currentAnimation) {
      clearTimeout(currentAnimation);
    }
    isAnimating = true;
    button.style.backgroundColor = "rgba(86, 146, 255, 0.95)";
    typeText(button.querySelector(".main-text"), fullText);
  });

  button.addEventListener("mouseleave", () => {
    if (currentAnimation) {
      clearTimeout(currentAnimation);
    }
    isAnimating = true;
    button.style.backgroundColor = "rgba(71, 120, 224, 0.85)";
    deleteText(button.querySelector(".main-text"), fullText);
  });

  // 添加点击事件
  button.addEventListener("click", debouncedCopyToken);

  return button;
}

/**
 * 复制令牌
 * @returns {void}
 */
function copyToken() {
  try {
    const skOauthCredKey = localStorage.getItem("SK_OAUTH_CRED_KEY");
    const skTokenCacheKey = localStorage.getItem("SK_TOKEN_CACHE_KEY");

    if (!skOauthCredKey || !skTokenCacheKey) {
      const missingKeys = [];
      if (!skOauthCredKey) missingKeys.push("SK_OAUTH_CRED_KEY");
      if (!skTokenCacheKey) missingKeys.push("SK_TOKEN_CACHE_KEY");

      message.error(`缺少必要的密钥：${missingKeys.join("、")}`);
      return;
    }

    const combinedData = `${skOauthCredKey},${skTokenCacheKey}`;

    navigator.clipboard
      .writeText(combinedData)
      .then(() => message.success("令牌复制成功！"))
      .catch((err) => {
        console.error("复制失败！", err);
        message.error("复制失败！");
      });
  } catch (error) {
    console.error("操作过程出现错误！", error);
    message.error("操作过程出现错误！");
  }
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} - 防抖后的函数
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

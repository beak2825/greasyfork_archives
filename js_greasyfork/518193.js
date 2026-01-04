// ==UserScript==
// @name B站"稍后再看"重定向 / Bilibili Watch Later Redirect
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  在访问Bilibili的"稍后再看"列表播放器时重定向到常规播放页面，并允许自定义跳转延迟
// @author       Ellu
// @match        https://www.bilibili.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518193/B%E7%AB%99%22%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%22%E9%87%8D%E5%AE%9A%E5%90%91%20%20Bilibili%20Watch%20Later%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/518193/B%E7%AB%99%22%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%22%E9%87%8D%E5%AE%9A%E5%90%91%20%20Bilibili%20Watch%20Later%20Redirect.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 获取当前设置的延迟，如果没有设置则默认为1000毫秒
  let redirectDelay = GM_getValue("redirectDelay", 1000);

  function updateDelay() {
    const input = prompt(
      "请输入自定义延迟时间,可以输入小数（单位：秒）",
      (redirectDelay / 1000).toString()
    );

    if (input === null) return; // 用户取消输入
    const delay = parseFloat(input);
    if (isNaN(delay) || delay < 0) {
      showToast("无效输入", 1000);
      return;
    }
    const delayMs = Math.round(delay * 1000); // 转换为毫秒
    GM_setValue("redirectDelay", delayMs);
    redirectDelay = delayMs;
    showToast(`跳转延迟已设置为 ${delay} 秒`, 1000);
  }

  GM_registerMenuCommand(`自定义延迟`, updateDelay);

  // 全局变量，用于跟踪当前正在显示的 Toast
  let currentToast = null;
  let toastQueue = [];

  /**
   * 显示 Toast 消息
   * @param {string} message - 要显示的消息内容
   * @param {number} duration - 消失的持续时间（毫秒）
   */
  function showToast(message, duration = 3000) {
    // 如果有当前 Toast 在显示，先将新 Toast 加入队列
    if (currentToast) {
      hideToast(currentToast); // 先隐藏当前 Toast
      toastQueue.push({ message, duration });
      // 如果当前 Toast 正在淡出，则无需做额外处理
      return;
    }

    // 创建 toast 容器
    const toast = document.createElement("div");
    toast.innerText = message;

    // 设置样式
    Object.assign(toast.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      color: "#fff",
      padding: "15px 25px",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
      zIndex: "9999",
      fontSize: "16px",
      opacity: "0",
      transition: "opacity 0.15s",
      textAlign: "center",
      pointerEvents: "none", // 确保 Toast 不会拦截鼠标事件
    });

    // 添加 Keyframes 动画到文档（仅添加一次）
    if (!document.getElementById("toast-animations")) {
      const styleSheet = document.createElement("style");
      styleSheet.type = "text/css";
      styleSheet.id = "toast-animations";
      styleSheet.innerText = `
@keyframes fadein {
    from { opacity: 0; }
    to { opacity: 1; }
}
@keyframes fadeout {
    from { opacity: 1; }
    to { opacity: 0; }
}
    `;
      document.head.appendChild(styleSheet);
    }

    // 添加到 body
    document.body.appendChild(toast);

    // 设置当前 Toast
    currentToast = toast;

    // 触发淡入效果
    // 使用 requestAnimationFrame 确保样式应用后再开始动画
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
    });

    // 设置自动消失
    const hideTimeout = setTimeout(() => {
      hideToast(toast);
    }, duration);

    // 可以在需要时清除超时
    toast.hideTimeout = hideTimeout;
  }

  /**
   * 隐藏并移除 Toast
   * @param {HTMLElement} toast - 要隐藏的 Toast 元素
   */
  function hideToast(toast) {
    if (!toast) return;

    // 清除之前的隐藏超时
    clearTimeout(toast.hideTimeout);

    // 触发淡出效果
    toast.style.opacity = "0";

    // 等待淡出过渡完成后移除元素
    toast.addEventListener("transitionend", function onTransitionEnd() {
      toast.removeEventListener("transitionend", onTransitionEnd);
      if (toast.parentNode) {
        document.body.removeChild(toast);
      }
      currentToast = null;
      // 检查队列中是否有待显示的 Toast
      if (toastQueue.length > 0) {
        const nextToast = toastQueue.shift();
        showToast(nextToast.message, nextToast.duration);
      }
    });
  }

  // 如果当前URL不匹配https://www.bilibili.com/list/watchlater*，则不执行后续脚本
  if (!window.location.href.includes("/list/watchlater")) {
    return;
  }

  // 获取当前页面的URL参数
  const urlParams = new URLSearchParams(window.location.search);
  const bvid = urlParams.get("bvid");

  // 如果存在 bvid 参数，则执行重定向逻辑
  if (bvid) {
    // 定义跳转函数
    const redirect = () => {
      const newUrl = `https://www.bilibili.com/video/${bvid}`;
      window.location.replace(newUrl);
    };
    // 如果延迟为0则直接跳转
    if (redirectDelay === 0) {
      showToast("跳转中……", 1000);
      redirect();
      return;
    }
    // 显示初始的 Toast 信息
    showToast(
      `${redirectDelay / 1000} 秒后跳转到常规播放页面，按任意键或点击鼠标取消`,
      100000
    );
    // 设置一个标志来检测是否已取消
    let isCanceled = false;

    // 定义取消函数
    const cancelRedirect = () => {
      if (!isCanceled) {
        isCanceled = true;
        // 取消跳转
        clearTimeout(timer);
        // 移除事件监听器
        window.removeEventListener("keydown", keyPressHandler, true);
        window.removeEventListener("click", mouseClickHandler, true);
        // 隐藏当前 Toast
        hideToast(currentToast);
        // 显示取消的 Toast 信息
        showToast("跳转已取消", 600);
      }
    };

    // 定义按键事件处理器
    const keyPressHandler = (event) => {
      console.log("按键事件:", event);
      event.preventDefault(); // 阻止默认行为
      event.stopPropagation(); // 阻止事件传播
      cancelRedirect();
    };

    // 定义鼠标点击事件处理器
    const mouseClickHandler = (event) => {
      if (event.isTrusted) {
        console.log("鼠标点击事件:", event);
        event.preventDefault(); // 阻止默认行为
        event.stopPropagation(); // 阻止事件传播
        cancelRedirect();
      }
    };

    // 添加按键和鼠标点击事件监听器
    window.addEventListener("keydown", keyPressHandler, true);
    window.addEventListener("click", mouseClickHandler, true);

    // 设置定时器
    const timer = setTimeout(() => {
      showToast("跳转中……", 1000);
      window.removeEventListener("keydown", keyPressHandler, true);
      window.removeEventListener("click", mouseClickHandler, true);
      if (!isCanceled) {
        redirect();
      }
    }, redirectDelay);
  }
})();

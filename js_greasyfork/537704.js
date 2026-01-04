// ==UserScript==
// @name         摸鱼室终端风格-黑白版
// @namespace    http://tampermonkey.net/
// @version      1.1.7
// @description  将摸鱼室聊天界面改造成终端风格（黑白版），方便摸鱼，默认不启用终端风格，按ESC键切换
// @author       Claude
// @match        https://fish.codebug.icu/chat
// @match        https://yucoder.cn/chat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codebug.icu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537704/%E6%91%B8%E9%B1%BC%E5%AE%A4%E7%BB%88%E7%AB%AF%E9%A3%8E%E6%A0%BC-%E9%BB%91%E7%99%BD%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/537704/%E6%91%B8%E9%B1%BC%E5%AE%A4%E7%BB%88%E7%AB%AF%E9%A3%8E%E6%A0%BC-%E9%BB%91%E7%99%BD%E7%89%88.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 创建并添加终端风格的CSS，但先不应用
  const terminalCSS = `
      /* 整体背景和字体 */
      body {
        background-color: #0c0c0c !important;
        color: #d0d0d0 !important;
        font-family: 'Courier New', monospace !important;
      }
  
      /* 聊天容器样式 */
      .messageContainer___zUc1q {
        background-color: #0c0c0c !important;
        border: 1px solid #555 !important;
        border-radius: 0 !important;
        padding: 10px !important;
        max-height: 85vh !important;
      }
  
      /* 消息项样式 - 改为单行终端风格 */
      .messageItem___UXffF {
        background-color: transparent !important;
        border-bottom: 1px dashed #444 !important;
        padding: 5px 0 !important;
        margin-bottom: 5px !important;
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        flex-wrap: nowrap !important;
      }
  
      /* 隐藏头像 */
      .avatar___zrh3f {
        display: none !important;
      }
  
      /* 消息头部样式 */
      .messageHeader___ABpsT {
        display: inline-flex !important;
        align-items: center !important;
        margin-right: 5px !important;
        order: 2 !important;
        width: 150px !important; /* 固定宽度 */
        min-width: 150px !important; /* 防止缩小 */
        flex-shrink: 0 !important; /* 防止缩小 */
      }
  
      /* 用户名样式 */
      .senderName___s5UP3 {
        color: #4CAF50 !important;
        font-weight: bold !important;
        margin-right: 5px !important;
        width: 120px !important; /* 固定宽度，最多显示10个汉字 */
        min-width: 120px !important; /* 防止缩小 */
        display: inline-block !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
        flex-shrink: 0 !important; /* 防止缩小 */
      }
  
      /* 完全删除等级标签和管理员标签 */
      .levelBadge___XJap_, .adminTag___lL0Ow, .titleTagInvestor___DUbJ4 {
        display: none !important;
      }
  
      /* 隐藏等级文字 */
      .adminText___jDfqg {
        display: none !important;
      }
  
      /* 消息内容样式 - 终端风格单行显示 */
      .messageContent___BeZJv {
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        margin-left: 0 !important;
        display: inline-block !important;
        order: 3 !important;
        flex: 1 !important; /* 让消息内容占据剩余空间 */
      }
  
      .messageContent___QDsxD {
        color: #d0d0d0 !important;
        display: inline !important;
        background: transparent !important;
        padding: 0 !important;
        box-shadow: none !important;
      }
  
      /* 移除消息内容的气泡样式 */
      .chatRoom___z4hOy .messageContainer___zUc1q .messageItem___UXffF .messageContent___BeZJv {
        margin-top: 0 !important;
        background: transparent !important;
        padding: 0 !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        margin-left: 0 !important;
      }
  
      /* 时间戳样式 - 移到最前面并调整宽度 */
      .timestamp___pqcve {
        color: #777 !important;
        font-style: italic !important;
        margin-right: 0px !important;
        order: 1 !important;
        width: 60px !important;
        min-width: 60px !important; /* 防止缩小 */
        padding-left: 0px !important;
        font-size: 12px !important;
        flex-shrink: 0 !important; /* 防止缩小 */
      }
  
      /* 消息底部样式 */
      .messageFooter___eWkrw {
        display: inline-flex !important;
        align-items: center !important;
        margin-left: 0px !important;
        margin-right: 5px !important;
        order: 1 !important; /* 将整个footer移到前面 */
        padding-left: 0px !important;
        flex-shrink: 0 !important; /* 防止缩小 */
      }
  
      /* 引用按钮样式 - 默认隐藏，悬浮时显示 */
      .quoteText___reQEz {
        display: none !important;
        color: #888 !important;
        font-size: 12px !important;
        cursor: pointer !important;
        margin-left: 5px !important;
      }
      
      /* 悬浮在消息上时显示引用按钮 */
      .messageFooter___eWkrw:hover .quoteText___reQEz {
        display: inline-block !important;
      }
  
      /* 输入区域样式 */
      .inputArea___KNPKm {
        background-color: #0c0c0c !important;
        border-top: 1px solid #444 !important;
        padding: 10px !important;
      }
  
      /* 输入框样式 */
      .chatTextArea___P0JAV {
        background-color: #0c0c0c !important;
        color: #d0d0d0 !important;
        border: 1px solid #444 !important;
        border-radius: 0 !important;
      }
      
      /* 隐藏输入框的占位符文本 */
      .chatTextArea___P0JAV::placeholder {
        color: transparent !important;
      }
  
      /* 按钮样式 */
      .ant-btn {
        background-color: #0c0c0c !important;
        color: #d0d0d0 !important;
        border: 1px solid #444 !important;
        border-radius: 0 !important;
      }
  
      /* 发送按钮样式 */
      .sendButton___gOHpp {
        background-color: #0c0c0c !important;
        color: #d0d0d0 !important;
        border: 1px solid #444 !important;
      }
      
      /* 隐藏发送按钮中的所有文本 */
      .sendButton___gOHpp span {
        font-size: 0 !important;
      }
      
      /* 隐藏发送按钮中的图标 */
      .sendButton___gOHpp .ant-btn-icon {
        display: none !important;
      }
      
      /* 只在按钮上添加一个执行文本 */
      .sendButton___gOHpp::after {
        content: "执行" !important;
        font-size: 14px !important;
        color: #d0d0d0 !important;
      }
  
      /* 修改滚动条样式 */
      ::-webkit-scrollbar {
        width: 8px !important;
        background-color: #0c0c0c !important;
      }
  
      ::-webkit-scrollbar-thumb {
        background-color: #444 !important;
      }
  
      /* 添加终端前缀 - 放在时间戳后面 */
      .messageHeader___ABpsT::before {
        content: "$ " !important;
        color: #ffffff !important;
        font-weight: bold !important;
        margin-right: 5px !important;
        display: inline-block !important;
        width: 15px !important;
        text-align: center !important;
      }
  
      /* 添加终端窗口标题 */
      body::before {
        content: "Terminal - 系统监控";
        display: block;
        background-color: #222;
        color: #fff;
        padding: 5px 10px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
        border-bottom: 1px solid #444;
      }
  
      /* 添加终端命令提示符 */
      .inputRow___kMy91::before {
        content: "$ ";
        color: #ffffff;
        font-weight: bold;
        margin-right: 5px;
      }
  
      /* 隐藏在线成员列表 */
      .userList___AyZ7o {
        display: none !important;
      }
  
      /* 让聊天区域占满整个宽度 */
      .chatPanel___QEdZP {
        width: 100% !important;
        max-width: 100% !important;
      }
  
      /* 强制消息内容为单行，超出部分用省略号 */
      .messageContent___QDsxD p {
        display: inline !important;
        white-space: normal !important;
        overflow: visible !important;
        word-wrap: break-word !important;
        max-width: 100% !important;
      }
  
      /* 修复可能的布局问题 */
      .senderInfo___F2m3s {
        display: inline-flex !important;
        align-items: center !important;
      }
    `;

  // 创建样式元素但不立即添加到文档中
  const terminalStyle = document.createElement("style");
  terminalStyle.textContent = terminalCSS;

  // 保存原始页面标题
  let originalTitle = "";

  // 创建切换模式的通知元素
  const modeNotification = document.createElement("div");
  modeNotification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 8px 15px;
    border-radius: 4px;
    z-index: 9999;
    font-family: 'Segoe UI', sans-serif;
    font-size: 14px;
    transition: opacity 0.5s;
    opacity: 0;
    pointer-events: none;
  `;
  document.body.appendChild(modeNotification);

  // 显示通知函数
  function showNotification(message) {
    modeNotification.textContent = message;
    modeNotification.style.opacity = "1";
    setTimeout(() => {
      modeNotification.style.opacity = "0";
    }, 2000);
  }

  // 终端模式状态和消息缓存
  let terminalModeEnabled = false;
  let messageStates = new Map(); // 用于保存消息原始状态

  // 切换终端模式的函数
  function toggleTerminalMode() {
    terminalModeEnabled = !terminalModeEnabled;

    if (terminalModeEnabled) {
      // 启用终端模式
      document.head.appendChild(terminalStyle);
      document.title = "系统监控终端";

      // 处理所有现有消息
      applyTerminalStyleToMessages();

      // 隐藏在线成员列表
      const userList = document.querySelector(".userList___AyZ7o");
      if (userList) {
        userList.style.display = "none";
      }

      // 修改输入框占位符文本为空
      const textarea = document.querySelector(".chatTextArea___P0JAV");
      if (textarea) {
        textarea.setAttribute(
          "data-original-placeholder",
          textarea.getAttribute("placeholder") || ""
        );
        textarea.setAttribute("placeholder", "");
      }

      showNotification("已启用终端模式");
    } else {
      // 禁用终端模式
      document.head.removeChild(terminalStyle);
      document.title = originalTitle;

      // 恢复所有消息的原始样式
      restoreOriginalStyleToMessages();

      // 显示在线成员列表
      const userList = document.querySelector(".userList___AyZ7o");
      if (userList) {
        userList.style.display = "";
      }

      // 恢复输入框占位符文本
      const textarea = document.querySelector(".chatTextArea___P0JAV");
      if (textarea) {
        const originalPlaceholder = textarea.getAttribute(
          "data-original-placeholder"
        );
        if (originalPlaceholder) {
          textarea.setAttribute("placeholder", originalPlaceholder);
        }
      }

      showNotification("已恢复正常模式");
    }
  }

  // 应用终端样式到所有消息
  function applyTerminalStyleToMessages() {
    const messageContainer = document.querySelector(
      ".messageContainer___zUc1q"
    );
    if (!messageContainer) return;

    const messages = messageContainer.querySelectorAll(".messageItem___UXffF");
    messages.forEach(function (message) {
      // 保存消息的原始状态（如果尚未保存）
      if (!messageStates.has(message)) {
        const state = {
          footerPosition: null,
          levelBadgeDisplay: null,
          adminTagDisplay: null,
          contentText: null,
        };

        // 获取时间戳位置
        const footer = message.querySelector(".messageFooter___eWkrw");
        if (footer) {
          state.footerPosition = Array.from(message.children).indexOf(footer);
        }

        // 获取等级标签和管理员标签的显示状态
        const levelBadge = message.querySelector(".levelBadge___XJap_");
        if (levelBadge) {
          state.levelBadgeDisplay = window.getComputedStyle(levelBadge).display;
        }

        const adminTag = message.querySelector(".adminTag___lL0Ow");
        if (adminTag) {
          state.adminTagDisplay = window.getComputedStyle(adminTag).display;
        }

        // 获取消息内容的原始文本（包括换行）
        const contentDiv = message.querySelector(".messageContent___QDsxD p");
        if (contentDiv) {
          state.contentText = contentDiv.innerText;
        }

        messageStates.set(message, state);
      }

      // 应用终端样式
      // 将时间戳移到最前面
      const footer = message.querySelector(".messageFooter___eWkrw");
      if (footer) {
        message.insertBefore(footer, message.firstChild);

        // 隐藏引用按钮
        const quoteButton = footer.querySelector(".quoteText___reQEz");
        if (quoteButton) {
          quoteButton.style.display = "none";
        }
      }

      // 确保消息内容在一行显示
      const contentDiv = message.querySelector(".messageContent___QDsxD p");
      if (contentDiv) {
        contentDiv.innerText = contentDiv.innerText.replace(/\n/g, " ");
      }

      // 隐藏等级标签和管理员标签
      const levelBadge = message.querySelector(".levelBadge___XJap_");
      if (levelBadge) {
        levelBadge.style.display = "none";
      }

      const adminTag = message.querySelector(".adminTag___lL0Ow");
      if (adminTag) {
        adminTag.style.display = "none";
      }
    });
  }

  // 恢复消息的原始样式
  function restoreOriginalStyleToMessages() {
    const messageContainer = document.querySelector(
      ".messageContainer___zUc1q"
    );
    if (!messageContainer) return;

    const messages = messageContainer.querySelectorAll(".messageItem___UXffF");
    messages.forEach(function (message) {
      // 检查是否有保存的原始状态
      const state = messageStates.get(message);
      if (!state) return;

      // 恢复时间戳位置
      const footer = message.querySelector(".messageFooter___eWkrw");
      if (footer && state.footerPosition !== null) {
        // 如果时间戳不在原始位置，移动它
        if (footer === message.firstChild && state.footerPosition > 0) {
          const targetPosition = Math.min(
            state.footerPosition,
            message.children.length
          );
          if (targetPosition >= message.children.length) {
            message.appendChild(footer);
          } else {
            message.insertBefore(footer, message.children[targetPosition]);
          }
        }

        // 恢复引用按钮的显示状态
        const quoteButton = footer.querySelector(".quoteText___reQEz");
        if (quoteButton) {
          quoteButton.style.display = "";
        }
      }

      // 恢复消息内容的原始文本（包括换行）
      const contentDiv = message.querySelector(".messageContent___QDsxD p");
      if (contentDiv && state.contentText) {
        contentDiv.innerText = state.contentText;
      }

      // 恢复等级标签和管理员标签的显示状态
      const levelBadge = message.querySelector(".levelBadge___XJap_");
      if (levelBadge && state.levelBadgeDisplay) {
        levelBadge.style.display = state.levelBadgeDisplay;
      }

      const adminTag = message.querySelector(".adminTag___lL0Ow");
      if (adminTag && state.adminTagDisplay) {
        adminTag.style.display = state.adminTagDisplay;
      }
    });
  }

  // 添加键盘快捷键 - 按下Esc键切换终端模式
  document.addEventListener("keydown", function (e) {
    // Esc键切换终端模式
    if (e.key === "Escape") {
      toggleTerminalMode();
    }
  });

  // 页面加载完成后设置界面和DOM观察器
  window.addEventListener("load", function () {
    // 保存原始页面标题
    originalTitle = document.title;

    // 监听DOM变化，对新添加的消息应用当前样式
    const observer = new MutationObserver(function (mutations) {
      if (!terminalModeEnabled) return;

      mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(function (node) {
            if (
              node.nodeType === 1 &&
              node.classList.contains("messageItem___UXffF")
            ) {
              // 保存消息的原始状态
              if (!messageStates.has(node)) {
                const state = {
                  footerPosition: null,
                  levelBadgeDisplay: null,
                  adminTagDisplay: null,
                  contentText: null,
                };

                // 获取时间戳位置
                const footer = node.querySelector(".messageFooter___eWkrw");
                if (footer) {
                  state.footerPosition = Array.from(node.children).indexOf(
                    footer
                  );
                }

                // 获取等级标签和管理员标签的显示状态
                const levelBadge = node.querySelector(".levelBadge___XJap_");
                if (levelBadge) {
                  state.levelBadgeDisplay =
                    window.getComputedStyle(levelBadge).display;
                }

                const adminTag = node.querySelector(".adminTag___lL0Ow");
                if (adminTag) {
                  state.adminTagDisplay =
                    window.getComputedStyle(adminTag).display;
                }

                // 获取消息内容的原始文本（包括换行）
                const contentDiv = node.querySelector(
                  ".messageContent___QDsxD p"
                );
                if (contentDiv) {
                  state.contentText = contentDiv.innerText;
                }

                messageStates.set(node, state);
              }

              // 应用终端样式
              // 确保消息内容在一行显示
              const contentDiv = node.querySelector(
                ".messageContent___QDsxD p"
              );
              if (contentDiv) {
                contentDiv.innerText = contentDiv.innerText.replace(/\n/g, " ");
              }

              // 将时间戳移到最前面
              const footer = node.querySelector(".messageFooter___eWkrw");
              if (footer) {
                node.insertBefore(footer, node.firstChild);

                // 确保引用按钮可见性正确
                const quoteButton = footer.querySelector(".quoteText___reQEz");
                if (quoteButton) {
                  quoteButton.style.display = "none";
                }
              }

              // 删除等级标签和天使投资人标签
              const levelBadge = node.querySelector(".levelBadge___XJap_");
              if (levelBadge) {
                levelBadge.style.display = "none";
              }

              const adminTag = node.querySelector(".adminTag___lL0Ow");
              if (adminTag) {
                adminTag.style.display = "none";
              }
            }
          });
        }
      });
    });

    const messageContainer = document.querySelector(
      ".messageContainer___zUc1q"
    );
    if (messageContainer) {
      observer.observe(messageContainer, { childList: true });
    }
  });
})();

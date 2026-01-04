// ==UserScript==
// @name         Magnet Url
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @license      MIT
// @description  复制磁力链接
// @author       LiBoHan95
// @match        *://*/*
// @icon         https://raw.githubusercontent.com/LiBoHan95/magnet-url/master/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532064/Magnet%20Url.user.js
// @updateURL https://update.greasyfork.org/scripts/532064/Magnet%20Url.meta.js
// ==/UserScript==

"use strict";

(function () {
  "use strict";

  // Function to extract magnet links
  function extractMagnetLinks() {
    const magnetLinks = [];
    const regex = /magnet:\?xt=urn:btih:[a-fA-F0-9]{40,}/g;

    // Iterate over all text nodes in the document
    function traverse(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const matches = node.textContent.match(regex);
        if (matches) {
          matches.forEach((match) => {
            const parentElement = node.parentElement;
            magnetLinks.push({ link: match, element: parentElement });
          });
        }
      } else {
        node.childNodes.forEach((child) => traverse(child));
      }
    }

    traverse(document.body);

    return magnetLinks;
  }

  // 清理旧的复制按钮
  function cleanupOldButtons() {
    const oldButtons = document.querySelectorAll("button[data-magnet-copy]");
    oldButtons.forEach((button) => {
      button.remove();
    });
  }

  // 更新磁力链接和按钮
  function updateMagnetLinks() {
    cleanupOldButtons();
    const magnets = extractMagnetLinks();

    // 在每个元素后增加一个按钮，点击复制磁力链接
    magnets.forEach((magnet) => {
      const button = document.createElement("button");
      button.innerText = "复制";
      button.setAttribute("data-magnet-copy", "true");
      button.className = "magnet-copy-btn";

      // 阻止事件冒泡和默认行为
      button.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(magnet.link).then(() => {
          // 复制成功后的反馈
          const originalText = button.innerText;
          button.innerText = "已复制";
          button.classList.add("copied");
          setTimeout(() => {
            button.innerText = originalText;
            button.classList.remove("copied");
          }, 1000);
        });
      });

      magnet.element.style.cssText = "position: relative;";
      magnet.element.appendChild(button);
    });

    return magnets;
  }

  // 初始化样式
  const style = document.createElement("style");
  style.textContent = `
  .floating-btn {
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 999;
    
    /* 视觉设计 */
    min-width: 120px;
    padding: 12px 24px;
    border: none;
    border-radius: 30px;
    background: linear-gradient(135deg, #4a90e2, #6366f1);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
    
    /* 文字样式 */
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-weight: 600;
    letter-spacing: 0.5px;
    font-size: 14px;
    
    /* 交互效果 */
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateY(0);
    overflow: hidden;
  }

  /* 悬停状态 */
  .floating-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
    background: linear-gradient(135deg, #6366f1, #4a90e2);
  }

  /* 点击反馈 */
  .floating-btn:active {
    transform: translateY(1px);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  }

  /* 焦点状态 */
  .floating-btn:focus-visible {
    outline: 3px solid rgba(99, 102, 241, 0.4);
    outline-offset: 2px;
  }

  /* 动态效果层 */
  .hover-effect {
    position: absolute;
    background: rgba(255, 255, 255, 0.2);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    animation: ripple 0.6s ease-out;
  }

  @keyframes ripple {
    from {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    }
    to {
      transform: translate(-50%, -50%) scale(4);
      opacity: 0;
    }
  }

  /* 文字防选中 */
  .btn-text {
    position: relative;
    z-index: 1;
    user-select: none;
  }

  /* 更新次数提示 */
  .update-count {
    position: fixed;
    right: 20px;
    bottom: 80px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    z-index: 999;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .update-count:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: translateY(-2px);
  }

  .update-count:active {
    transform: translateY(1px);
  }

  /* 复制按钮样式 */
  .magnet-copy-btn {
    position: absolute;
    right: -54px;
    top: -5px;
    z-index: 999;
    padding: 4px 12px;
    border: none;
    border-radius: 15px;
    background: linear-gradient(135deg, #4a90e2, #6366f1);
    color: white;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .magnet-copy-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background: linear-gradient(135deg, #6366f1, #4a90e2);
  }

  .magnet-copy-btn:active {
    transform: translateY(1px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .magnet-copy-btn.copied {
    background: #10b981;
    animation: pulse 0.5s ease;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
  `;
  document.body.appendChild(style);

  // 创建并添加浮动按钮
  const button = document.createElement("button");
  button.className = "floating-btn";
  button.innerHTML = `
    <span class="btn-text">🔗 Copy All</span>
    <span class="hover-effect"></span>
  `;

  // 创建更新次数提示
  const updateCountElement = document.createElement("div");
  updateCountElement.className = "update-count";
  document.body.appendChild(updateCountElement);

  // 初始化磁力链接
  let magnets = updateMagnetLinks();
  let updateCount = 1;
  updateCountElement.textContent = `已更新 ${updateCount}/3 次`;

  // 设置定时器每5秒更新一次，最多更新3次
  let intervalId = setInterval(() => {
    if (updateCount < 3) {
      magnets = updateMagnetLinks();
      updateCount++;
      updateCountElement.textContent = `已更新 ${updateCount}/3 次`;
    } else {
      clearInterval(intervalId);
      updateCountElement.textContent = "点击继续更新";
    }
  }, 5000);

  // 点击更新提示继续更新
  updateCountElement.addEventListener("click", () => {
    if (updateCount >= 3) {
      updateCount = 0;
      intervalId = setInterval(() => {
        if (updateCount < 3) {
          magnets = updateMagnetLinks();
          updateCount++;
          updateCountElement.textContent = `已更新 ${updateCount}/3 次`;
        } else {
          clearInterval(intervalId);
          updateCountElement.textContent = "点击继续更新";
        }
      }, 5000);
    }
  });

  button.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const magnetLinks = magnets.map((magnet) => magnet.link);
    navigator.clipboard.writeText(magnetLinks.join("\n")).then(() => {
      const originalText = button.querySelector(".btn-text").textContent;
      button.querySelector(".btn-text").textContent = "已复制";
      setTimeout(() => {
        button.querySelector(".btn-text").textContent = originalText;
      }, 1000);
    });
  });
  document.body.appendChild(button);
})();

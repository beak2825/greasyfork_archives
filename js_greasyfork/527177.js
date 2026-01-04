// ==UserScript==
// @name         多功能滚动按钮
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  添加顶部、底部和位置记录功能的按钮
// @author       Your name
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527177/%E5%A4%9A%E5%8A%9F%E8%83%BD%E6%BB%9A%E5%8A%A8%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/527177/%E5%A4%9A%E5%8A%9F%E8%83%BD%E6%BB%9A%E5%8A%A8%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

/* MIT License

Copyright (c) 2024 Your name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function () {
  "use strict";

  // 创建按钮样式
  const style = document.createElement("style");
  style.textContent = `
            .scroll-btn {
                position: fixed;
                min-width: 40px;
                height: 40px;
                padding: 0 12px;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                border-radius: 20px;
                border: none;
                outline: none;
                cursor: pointer;
                z-index: 9999;
                transition: all 0.3s;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                box-shadow: none;
            }
            .scroll-btn:focus {
                outline: none;
            }
            .scroll-btn.compact {
                width: 40px;
                padding: 0;
            }
            .scroll-btn:hover {
                opacity: 0.8;
                transform: scale(1.1);
            }
            .scroll-to-top {
                right: 20px;
                bottom: 160px;
            }
            .scroll-to-bottom {
                right: 20px;
                bottom: 90px;
            }
            .add-position {
                right: 20px;
                bottom: 20px;
            }
            .position-button-container {
                position: fixed;
                right: 120px;
                display: flex;
                flex-direction: row-reverse;
                gap: 8px;
                z-index: 9999;
            }
            .recorded-position {
                background-color: rgba(33, 150, 243, 0.9);
                min-width: 60px;
                max-width: 120px;
                padding: 0 15px;
                text-overflow: ellipsis;
                overflow: hidden;
                direction: ltr;
            }
            .recorded-position.active {
                background-color: #4CAF50;
                color: #fff;
                transform: scale(1.1);
                box-shadow: 0 0 15px rgba(76, 175, 80, 0.7);
            }
            .position-label {
                position: fixed;
                right: 120px;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 4px 12px;
                border-radius: 4px;
                font-size: 13px;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s;
                white-space: nowrap;
                max-width: 300px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .scroll-btn.active {
                transform: scale(1.15);
                box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
            }
            .scroll-to-top.active {
                background-color: #FFC107;
                color: #000;
            }
            .scroll-to-bottom.active {
                background-color: #FF5722;
                color: #000;
            }
            .add-position:hover {
                background-color: #81C784;
            }
            .recorded-position:hover {
                background-color: #42A5F5;
            }
            .delete-position {
                min-width: 20px !important;
                width: 20px !important;
                height: 20px !important;
                padding: 0 !important;
                font-size: 14px !important;
                background-color: rgba(244, 67, 54, 0.9) !important;
                margin-right: 4px !important;
                flex-shrink: 0;
            }
            .delete-position:hover {
                background-color: rgb(244, 67, 54) !important;
            }
            .recorded-position.editing {
                background-color: #FFC107;
                color: #000;
            }
            .edit-input {
                position: absolute;
                width: 120px;
                height: 30px;
                padding: 2px 8px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 14px;
                right: 100%;
                margin-right: 8px;
                top: 50%;
                transform: translateY(-50%);
                display: none;
                z-index: 9999;
            }
            .edit-input.show {
                display: block;
            }
        `;
  document.head.appendChild(style);

  // 修改获取存储key的函数
  function getStorageKey() {
    // 获取当前网页的完整URL作为唯一标识
    const fullUrl = window.location.href;
    return `scrollPositions_${fullUrl}`;
  }

  // 修改加载保存位置的代码
  let recordedPositions = JSON.parse(localStorage.getItem(getStorageKey()) || "[]");
  let nextPositionId = 1;
  let activeButton = null;

  // 创建返回顶部按钮
  const topButton = createButton("↑", "scroll-to-top");
  // 创建返回底部按钮
  const bottomButton = createButton("↓", "scroll-to-bottom");
  // 创建添加位置按钮
  const addButton = createButton("+", "add-position");

  // 返回顶部按钮点击事件
  topButton.addEventListener("click", () => {
    smoothScrollWithHighlight(0);
  });

  // 返回底部按钮点击事件
  bottomButton.addEventListener("click", () => {
    smoothScrollWithHighlight(document.documentElement.scrollHeight);
  });

  // 添加位置按钮点击事件
  addButton.addEventListener("click", () => {
    const currentPosition = window.scrollY;
    const positionId = nextPositionId++;

    const positionData = {
      id: positionId,
      position: currentPosition,
      button: createPositionButton(positionId, currentPosition),
    };

    recordedPositions.push(positionData);
    updateButtonPositions();
    savePositions();
    showToast(`已记录位置 #${positionId}`);
  });

  // 创建基础按钮
  function createButton(text, className) {
    const button = document.createElement("button");
    button.className = `scroll-btn compact ${className}`;
    button.innerHTML = text;
    document.body.appendChild(button);
    return button;
  }

  // 修改创建位置按钮函数
  function createPositionButton(id, position) {
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "position-button-container";
    buttonContainer.style.cssText = `
          position: fixed;
          right: 120px;
          display: flex;
          flex-direction: row-reverse;
          gap: 8px;
          z-index: 9999;
        `;

    // 主按钮
    const button = document.createElement("button");
    button.className = `scroll-btn recorded-position`;
    button.innerHTML = `${id}`;
    button.title = `${id}`;

    // 删除按钮
    const deleteButton = document.createElement("button");
    deleteButton.className = "scroll-btn delete-position";
    deleteButton.innerHTML = "×";
    deleteButton.style.cssText = `
          width: 20px;
          height: 20px;
          font-size: 14px;
          background-color: rgba(244, 67, 54, 0.9);
          opacity: 0;
          transition: opacity 0.3s;
          margin-right: 4px;
        `;

    // 添加编辑输入框
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.placeholder = "输入新名称";
    editInput.value = button.innerHTML;

    // 双击编辑功能
    button.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      button.classList.add("editing");
      editInput.classList.add("show");
      editInput.focus();
      editInput.select();
    });

    // 输入框失去焦点或按回车时保存
    editInput.addEventListener("blur", finishEditing);
    editInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        finishEditing();
      } else if (e.key === "Escape") {
        editInput.value = button.innerHTML;
        finishEditing();
      }
    });

    function finishEditing() {
      const newText = editInput.value.trim();
      if (newText) {
        button.innerHTML = newText;
        button.title = newText;
        // 根据文字长度调整按钮宽度
        if (newText.length <= 2) {
          button.classList.add("compact");
        } else {
          button.classList.remove("compact");
        }
        // 保存按钮文字到本地存储
        const positionData = recordedPositions.find((p) => p.id === id);
        if (positionData) {
          positionData.text = newText;
          savePositions();
        }
      }
      button.classList.remove("editing");
      editInput.classList.remove("show");
    }

    // 修改悬停效果，只显示删除按钮
    buttonContainer.addEventListener("mouseenter", () => {
      deleteButton.style.opacity = "1";
    });

    buttonContainer.addEventListener("mouseleave", () => {
      deleteButton.style.opacity = "0";
    });

    // 点击主按钮滚动到位置
    button.addEventListener("click", () => {
      smoothScrollWithHighlight(position);
    });

    // 点击删除按钮
    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      // 删除对应的按钮和标签
      buttonContainer.remove();

      // 从数组中移除
      recordedPositions = recordedPositions.filter((p) => p.id !== id);

      // 重新计算所有按钮的位置
      updateButtonPositions();

      // 更新本地存储
      savePositions();

      // 显示删除提示
      showToast(`已删除位置 #${id}`);
    });

    // 修改按钮添加顺序
    buttonContainer.appendChild(button); // 主按钮
    buttonContainer.appendChild(deleteButton); // 删除按钮
    buttonContainer.appendChild(editInput); // 编辑输入框

    document.body.appendChild(buttonContainer);
    return buttonContainer;
  }

  // 显示提示信息
  function showToast(message) {
    const toast = document.createElement("div");
    toast.style.cssText = `
          position: fixed;
          bottom: 70px;
          right: 170px;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          z-index: 10000;
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 2000);
  }

  // 修改滚动监听器，移除按钮显示/隐藏逻辑
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    // 移除按钮显示/隐藏的控制，让按钮始终显示

    // 使用防抖处理高亮状态更新
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      updateButtonStates();
    }, 100);
  });

  // 修改按钮状态更新函数
  function updateButtonStates() {
    // 检查页面是否有滚动条
    const hasScrollbar = document.documentElement.scrollHeight > document.documentElement.clientHeight;

    // 获取所有滚动按钮
    const allScrollButtons = document.querySelectorAll(".scroll-btn, .position-button-container");

    // 如果没有滚动条，隐藏所有按钮
    allScrollButtons.forEach((btn) => {
      btn.style.display = hasScrollbar ? "flex" : "none";
    });

    // 如果没有滚动条，直接返回
    if (!hasScrollbar) {
      return;
    }

    // 移除所有按钮的高亮状态
    const allButtons = document.querySelectorAll(".scroll-btn");
    allButtons.forEach((btn) => btn.classList.remove("active"));

    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 检查是否在顶部
    if (scrollPosition <= 200) {
      topButton.classList.add("active");
      return;
    }

    // 检查是否在底部
    if (scrollPosition + windowHeight >= documentHeight - 200) {
      bottomButton.classList.add("active");
      return;
    }

    // 检查是否在记录的位置附近
    recordedPositions.forEach((data) => {
      if (data.button) {
        const mainButton = data.button.querySelector(".recorded-position");
        if (Math.abs(scrollPosition - data.position) < 200) {
          if (mainButton) {
            mainButton.classList.add("active");
          }
        }
      }
    });
  }

  // 修改滚动事件处理
  function smoothScrollWithHighlight(targetPosition) {
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  }

  // 修改更新按钮位置的函数
  function updateButtonPositions() {
    recordedPositions.forEach((data, index) => {
      if (data.button) {
        data.button.style.bottom = `${130 + index * 60}px`;
        data.button.style.right = "120px";
      }
    });
  }

  // 修改初始化函数
  function initSavedPositions() {
    if (recordedPositions.length > 0) {
      nextPositionId = Math.max(...recordedPositions.map((p) => p.id)) + 1;
      recordedPositions.forEach((data) => {
        const button = createPositionButton(data.id, data.position);
        // 恢复按钮文字
        const mainButton = button.querySelector(".recorded-position");
        if (mainButton && data.text) {
          mainButton.innerHTML = data.text;
          if (data.text.length <= 2) {
            mainButton.classList.add("compact");
          } else {
            mainButton.classList.remove("compact");
          }
        }
        data.button = button;
      });
      updateButtonPositions();
    }
  }

  // 修改保存位置到本地存储的函数
  function savePositions() {
    const positionsToSave = recordedPositions.map(({ id, position, text }) => ({
      id,
      position,
      text: text || `${id}`,
    }));
    localStorage.setItem(getStorageKey(), JSON.stringify(positionsToSave));
  }

  // 添加 resize 事件监听器来处理窗口大小改变时的情况
  window.addEventListener("resize", () => {
    updateButtonStates();
  });

  // 确保在页面加载时也进行一次检查
  document.addEventListener("DOMContentLoaded", () => {
    updateButtonStates();
  });

  // 初始化时加载保存的位置
  initSavedPositions();

  // 添加URL变化监听函数
  function handleUrlChange() {
    // 清除当前页面的所有按钮
    recordedPositions.forEach((data) => {
      if (data.button) {
        data.button.remove();
      }
    });

    // 重新加载新URL对应的按钮数据
    recordedPositions = JSON.parse(localStorage.getItem(getStorageKey()) || "[]");
    nextPositionId = 1;
    initSavedPositions();
    updateButtonStates();
  }

  // 监听URL变化
  let lastUrl = window.location.href;
  new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      handleUrlChange();
    }
  }).observe(document, { subtree: true, childList: true });

  // 处理浏览器前进后退
  window.addEventListener("popstate", handleUrlChange);
})();

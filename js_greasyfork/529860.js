// ==UserScript==
// @name         雀魂 Mortal 举报小帮手
// @name:zh-TW   雀魂 Mortal 舉報小幫手
// @name:zh-CN   雀魂 Mortal 举报小帮手
// @name:ja      雀魂 Mortal レポートアシスタント & 牌譜 URL コピー & テーブルキャプチャ
// @name:en      Mahjong Soul Mortal Report Assistant & Copy Log URL & Table Capture
// @author       Scott
// @version      0.5

// @description  自动选择 "Mortal 3.0" 并勾选 "显示 rating"，同时在牌谱 URL 输入框旁添加复制按钮，并在「关于」弹框中添加截图按钮
// @description:zh-TW   自動選擇 "Mortal 3.0" 並勾選 "顯示 rating"，同時在牌譜 URL 輸入框旁添加複製按鈕，並在「關於」彈框中添加截圖按鈕
// @description:zh-CN   自动选择 "Mortal 3.0" 并勾选 "显示 rating"，同时在牌谱 URL 输入框旁添加复制按钮，并在「关于」弹框中添加截图按钮
// @description:ja      "Mortal 3.0" を自動選択し、"表示 rating" をチェックし、牌譜 URL 入力欄にコピーボタンを追加し、「關於」彈框にスクリーンショットボタンを追加
// @description:en      Automatically select "Mortal 3.0" and check "Show rating", and add a copy button next to the log URL input field, and add a screenshot button in the "About" dialog

// @match        *://mjai.ekyu.moe/*
// @grant        none

// @license      MIT
// @namespace    https://greasyfork.org/zh-CN/users/1284613
// @downloadURL https://update.greasyfork.org/scripts/529860/%E9%9B%80%E9%AD%82%20Mortal%20%E4%B8%BE%E6%8A%A5%E5%B0%8F%E5%B8%AE%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/529860/%E9%9B%80%E9%AD%82%20Mortal%20%E4%B8%BE%E6%8A%A5%E5%B0%8F%E5%B8%AE%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ==================== 举报小帮手功能 ====================
  function selectMortalNetwork() {
    const selectElement = document.querySelector("#mortal-model-tag");
    if (selectElement) {
      selectElement.value = "3.0";
      selectElement.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  function checkShowRating() {
    const ratingCheckbox = document.querySelector('input[name="show-rating"]');
    if (ratingCheckbox && !ratingCheckbox.checked) {
      ratingCheckbox.checked = true;
      ratingCheckbox.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  function initReportHelper() {
    selectMortalNetwork();
    checkShowRating();
  }

  // ==================== 复制牌谱 URL 功能 ====================
  function addCopyButton() {
    const label = document.querySelector('label.radio');
    if (label) {
      const copyButton = document.createElement("button");
      copyButton.type = "button"; // 指定按钮类型
      copyButton.id = "copy-url-button";
      copyButton.className = "copy-button";
      copyButton.textContent = "复制 URL";
      label.appendChild(copyButton);
    }

    // 添加样式
    const style = document.createElement("style");
    style.textContent = `
      .copy-button {
        margin-left: 10px;
        padding: 5px 10px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .copy-button:hover {
        background-color: #45a049;
      }
    `;
    document.head.appendChild(style);

    // 复制功能
    const inputField = document.querySelector('input[name="log-url"]');
    const copyButton = document.getElementById("copy-url-button");

    if (inputField && copyButton) {
      // 点击按钮复制
      copyButton.addEventListener("click", (event) => {
        event.preventDefault(); // 阻止默认行为
        event.stopPropagation(); // 阻止事件冒泡

        inputField.select();
        inputField.setSelectionRange(0, 99999); // 兼容移动设备
        document.execCommand("copy");
        alert("URL 已复制到剪贴板！");
      });

      // 点击输入框自动复制
      inputField.addEventListener("click", () => {
        inputField.select();
        inputField.setSelectionRange(0, 99999); // 兼容移动设备
        document.execCommand("copy");
        alert("URL 已复制到剪贴板！");
      });
    }
  }

  // ==================== 截取表格功能 ====================
  function addScreenshotButton() {
    // 找到「如遇界面 Bug，请提交问题至 GitHub。」這一句的元素
    const bugReportText = document.querySelector('#about-body-0 li:last-child span');

    if (bugReportText) {
      console.log('找到「如遇界面 Bug，请提交问题至 GitHub。」的文字元素，準備添加按鈕...');

      // 創建截圖按鈕
      const screenshotButton = document.createElement("button");
      screenshotButton.innerText = "截取表格";
      screenshotButton.style.marginLeft = "10px";
      screenshotButton.style.padding = "5px 10px";
      screenshotButton.style.backgroundColor = "#007bff";
      screenshotButton.style.color = "#fff";
      screenshotButton.style.border = "none";
      screenshotButton.style.borderRadius = "4px";
      screenshotButton.style.cursor = "pointer";

      // 將按鈕插入到指定文字的下方
      bugReportText.parentNode.insertBefore(screenshotButton, bugReportText.nextSibling);

      // 點擊按鈕時觸發截圖功能
      screenshotButton.addEventListener("click", function () {
        console.log("截圖按鈕被點擊，開始截圖...");

        // 獲取要截圖的 tbody 元素
        const tbodyElement = document.querySelector(".about-metadata tbody");

        if (tbodyElement && tbodyElement.children.length > 0) {
          console.log("找到 tbody 元素，內容如下：", tbodyElement.innerHTML);

          // 創建一個 canvas 元素
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // 設置 canvas 大小
          const padding = 20; // 內邊距
          const cellHeight = 30; // 單元格高度
          const cellWidth = 150; // 單元格寬度
          const rows = tbodyElement.querySelectorAll("tr");
          const cols = rows[0].querySelectorAll("td").length;

          canvas.width = cols * cellWidth + padding * 2;
          canvas.height = rows.length * cellHeight + padding * 2;

          // 設置背景顏色
          ctx.fillStyle = "#ffffff"; // 白色背景
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // 設置表格樣式
          ctx.strokeStyle = "#000000"; // 黑色邊框
          ctx.lineWidth = 1;
          ctx.font = "14px Arial";
          ctx.textAlign = "center"; // 文字居中
          ctx.textBaseline = "middle"; // 文字垂直居中

          // 繪製表格內容
          let y = padding;
          rows.forEach((row) => {
            let x = padding;
            const cells = row.querySelectorAll("td");

            // 繪製單元格邊框
            ctx.strokeRect(x, y, cellWidth * cols, cellHeight);

            cells.forEach((cell) => {
              // 繪製單元格背景顏色
              ctx.fillStyle = "#f0f0f0"; // 灰色背景
              ctx.fillRect(x, y, cellWidth, cellHeight);

              // 繪製單元格文字
              ctx.fillStyle = "#000000"; // 黑色文字
              ctx.fillText(cell.innerText, x + cellWidth / 2, y + cellHeight / 2);

              x += cellWidth;
            });
            y += cellHeight;
          });

          // 將 canvas 轉換為圖片
          const image = canvas.toDataURL("image/png");

          // 創建一個鏈接元素，用於下載圖片
          const link = document.createElement("a");
          link.href = image;
          link.download = "Mortal.png"; // 設置圖片名稱
          link.click();

          console.log("圖片已生成並觸發下載。");
        } else {
          console.error("未找到指定的表格內容或內容為空！");
          alert("未找到指定的表格內容或內容為空！");
        }
      });
    } else {
      console.error("未找到「如遇界面 Bug，请提交问题至 GitHub。」的文字元素！");
    }
  }

  // ==================== 初始化 ====================
  function init() {
    initReportHelper(); // 初始化举报小帮手功能
    addCopyButton(); // 初始化复制牌谱 URL 功能

    // 監聽「關於」按鈕的點擊事件
    const aboutButton = document.querySelector("#about");
    if (aboutButton) {
      aboutButton.addEventListener("click", function () {
        // 等待彈出對話框內容加載完成
        setTimeout(() => {
          addScreenshotButton(); // 添加截圖按鈕
        }, 1000); // 延遲 1 秒以確保內容加載完成
      });
    }
  }

  // 等待 DOM 加载完成
  window.addEventListener("load", init);
})();
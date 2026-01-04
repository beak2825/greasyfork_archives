// ==UserScript==
// @name         URL参数解析器
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  解析当前URL参数并在页面上展示(无参数时不显示按钮)
// @author       YourName
// @match        *://*/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540101/URL%E5%8F%82%E6%95%B0%E8%A7%A3%E6%9E%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/540101/URL%E5%8F%82%E6%95%B0%E8%A7%A3%E6%9E%90%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 检查当前URL是否有参数
  function hasUrlParams() {
    const url = window.location.href;
    return url.includes("?") && url.split("?")[1].length > 0;
  }

  // 如果没有参数，直接退出
  if (!hasUrlParams()) return;

  // 创建UI容器
  const container = document.createElement("div");
  container.className = "url-param-analyzer";
  container.innerHTML = `
      <button class="analyzer-button" title="解析URL参数">🔍</button>
      <div class="analyzer-panel">
          <div class="panel-body">
              <div class="params-container">
                  <table class="params-table">
                      <thead>
                          <tr>
                              <th width="40%">参数名</th>
                              <th width="55%">参数值</th>
                              <th width="5%">操作</th>
                          </tr>
                      </thead>
                      <tbody id="params-list"></tbody>
                  </table>
              </div>
          </div>
      </div>
      <div class="copied-message">已复制到剪贴板！</div>
  `;

  // 简化后的CSS样式
  const style = document.createElement("style");
  style.textContent = `
      .url-param-analyzer {
          font-family: Arial, sans-serif;
      }

      .analyzer-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          background-color: #4a6cf7;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          z-index: 9999;
          border: none;
          font-size: 20px;
      }

      .analyzer-panel {
          position: fixed;
          bottom: 80px;
          right: 20px;
          width: 420px;
          max-height: 400px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          z-index: 9998;
          display: none;
          overflow: hidden;
          border: 1px solid #ddd;
      }

      .panel-body {
          padding: 15px;
          overflow-y: auto;
          max-height: 350px;
      }

      .params-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
      }

      .params-table th {
          background-color: #f1f1f1;
          text-align: left;
          padding: 8px 10px;
      }

      .params-table td {
          padding: 8px 10px;
          border-bottom: 1px solid #eee;
          word-break: break-word;
      }

      .copy-btn {
          background-color: #f1f1f1;
          border: 1px solid #ddd;
          border-radius: 3px;
          padding: 3px 6px;
          font-size: 12px;
          cursor: pointer;
      }

      .no-params {
          text-align: center;
          padding: 20px;
          color: #777;
      }

      .copied-message {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #4CAF50;
          color: white;
          padding: 8px 15px;
          border-radius: 3px;
          z-index: 10000;
          display: none;
      }
  `;

  // 将样式和容器添加到页面
  document.head.appendChild(style);
  document.body.appendChild(container);

  // 脚本功能
  const analyzerButton = container.querySelector(".analyzer-button");
  const analyzerPanel = container.querySelector(".analyzer-panel");
  const paramsListElement = container.querySelector("#params-list");
  const copiedMessage = container.querySelector(".copied-message");

  // 显示面板
  analyzerButton.addEventListener("click", function () {
    // 解析当前URL参数
    const currentUrl = decodeURI(window.location.href); // 先解码整个URL
    const urlParams = parseUrlParams(currentUrl);

    // 更新UI
    updateParamsList(urlParams);

    // 显示面板
    analyzerPanel.style.display = "block";
  });

  // 复制按钮事件
  paramsListElement.addEventListener("click", function (e) {
    if (e.target.classList.contains("copy-btn")) {
      const value = e.target.getAttribute("data-value");
      copyToClipboard(value);
      showCopiedMessage();
    }
  });

  // 解析URL参数函数
  function parseUrlParams(url) {
    const params = {};
    const parser = document.createElement("a");
    parser.href = url;
    const query = parser.search.substring(1);
    const vars = query.split("&");

    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split("=");
      if (pair.length === 2) {
        const key = decodeURIComponent(pair[0]);
        const value = decodeURIComponent(pair[1]);
        params[key] = value;
      }
    }

    return params;
  }

  // 更新参数列表
  function updateParamsList(params) {
    paramsListElement.innerHTML = "";

    if (Object.keys(params).length === 0) {
      paramsListElement.innerHTML = `
              <tr>
                  <td colspan="3" class="no-params">当前URL没有参数</td>
              </tr>
          `;
      return;
    }

    for (const [key, value] of Object.entries(params)) {
      const row = document.createElement("tr");
      row.innerHTML = `
              <td class="param-name">${key}</td>
              <td>${value}</td>
              <td><button class="copy-btn" data-value="${value}">复制</button></td>
          `;
      paramsListElement.appendChild(row);
    }
  }

  // 复制到剪贴板
  function copyToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  // 显示复制成功消息
  function showCopiedMessage() {
    copiedMessage.style.display = "block";
    setTimeout(() => {
      copiedMessage.style.display = "none";
    }, 2000);
  }

  // 点击面板外部关闭面板
  document.addEventListener("click", function (e) {
    if (
      analyzerPanel.style.display === "block" &&
      !analyzerPanel.contains(e.target) &&
      e.target !== analyzerButton
    ) {
      analyzerPanel.style.display = "none";
    }
  });
})();

// ==UserScript==
// @name         FOFA Host Auto Filter (带清理功能 + 修复弹窗)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  一键过滤 FOFA 前6页 IP，支持保存/查看/清除已过滤IP，修复弹窗问题。
// @author       ChatGPT
// @license      MIT
// @match        https://fofa.info/result*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541561/FOFA%20Host%20Auto%20Filter%20%28%E5%B8%A6%E6%B8%85%E7%90%86%E5%8A%9F%E8%83%BD%20%2B%20%E4%BF%AE%E5%A4%8D%E5%BC%B9%E7%AA%97%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541561/FOFA%20Host%20Auto%20Filter%20%28%E5%B8%A6%E6%B8%85%E7%90%86%E5%8A%9F%E8%83%BD%20%2B%20%E4%BF%AE%E5%A4%8D%E5%BC%B9%E7%AA%97%29.meta.js
// ==/UserScript==


(function () {
  'use strict';

  console.log("✅ FOFA Host Auto Filter 脚本已加载");

  // 按钮样式
  const style = document.createElement("style");
  style.innerHTML = `
    .fofa-filter-button {
      position: fixed;
      left: 10px;
      z-index: 9999;
      font-size: 18px;
      padding: 10px 16px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 2px 2px 6px rgba(0,0,0,0.2);
      user-select: none;
      transition: transform 0.2s;
      width: 140px;
      text-align: center;
    }
    .fofa-filter-button:hover {
      transform: scale(1.1);
    }
    #btn-filter {
      top: 100px;
    }
    #btn-show {
      top: 160px;
      background: #2196F3;
    }
    #btn-clear {
      top: 220px;
      background: #f44336;
    }
    /* 弹窗背景，默认隐藏 */
    #ip-list-modal-bg {
      display: none;
      position: fixed;
      top:0; left:0; right:0; bottom:0;
      background: rgba(0,0,0,0.5);
      z-index: 10000;
      justify-content: center;
      align-items: center;
    }
    /* 弹窗内容 */
    #ip-list-modal {
      background: white;
      width: 400px;
      max-height: 70vh;
      border-radius: 8px;
      padding: 12px;
      box-sizing: border-box;
      overflow-y: auto;
      white-space: pre-wrap;
      font-family: monospace;
      font-size: 14px;
      color: #333;
      position: relative;
      user-select: text;
    }
    #ip-list-modal-close {
      position: absolute;
      top: 6px;
      right: 8px;
      cursor: pointer;
      font-weight: bold;
      font-size: 18px;
      user-select: none;
      color: #888;
    }
    #ip-list-modal-close:hover {
      color: #000;
    }
  `;
  document.head.appendChild(style);

  // 添加排除IP按钮
  const btnFilter = document.createElement("button");
  btnFilter.id = "btn-filter";
  btnFilter.className = "fofa-filter-button";
  btnFilter.textContent = "🗡️ 排除前6页 IP";
  btnFilter.title = "将前6页所有 IP:端口 添加为排除条件，并保存";
  btnFilter.style.top = "100px";
  document.body.appendChild(btnFilter);

  // 添加查看已过滤IP按钮
  const btnShow = document.createElement("button");
  btnShow.id = "btn-show";
  btnShow.className = "fofa-filter-button";
  btnShow.textContent = "📋 查看已过滤 IP";
  btnShow.title = "查看已保存的过滤 IP 列表";
  btnShow.style.top = "160px";
  btnShow.style.backgroundColor = "#2196F3";
  document.body.appendChild(btnShow);

  // 添加清除已过滤IP按钮
  const btnClear = document.createElement("button");
  btnClear.id = "btn-clear";
  btnClear.className = "fofa-filter-button";
  btnClear.textContent = "🧹 清除已过滤 IP";
  btnClear.title = "清空本地保存的过滤 IP";
  btnClear.style.top = "220px";
  btnClear.style.backgroundColor = "#f44336";
  document.body.appendChild(btnClear);

  // 添加IP列表弹窗结构
  const modalBg = document.createElement("div");
  modalBg.id = "ip-list-modal-bg";
  modalBg.style.display = "none";

  const modal = document.createElement("div");
  modal.id = "ip-list-modal";

  const closeBtn = document.createElement("div");
  closeBtn.id = "ip-list-modal-close";
  closeBtn.textContent = "×";
  modal.appendChild(closeBtn);

  const modalText = document.createElement("pre");
  modalText.id = "ip-list-text";
  modal.appendChild(modalText);

  modalBg.appendChild(modal);
  document.body.appendChild(modalBg);

  // 关闭弹窗事件
  closeBtn.onclick = () => {
    modalBg.style.display = "none";
  };
  modalBg.onclick = (e) => {
    if (e.target === modalBg) modalBg.style.display = "none";
  };

  // IP:端口匹配正则
  const ipPortRegex = /^(\d{1,3}\.){3}\d{1,3}:\d+$/;

  // 读取本地存储的过滤IP列表（数组）
  function loadFilteredIPs() {
    const raw = localStorage.getItem("fofa_filtered_ips");
    if (!raw) return [];
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr;
      return [];
    } catch {
      return [];
    }
  }

  // 保存过滤IP列表
  function saveFilteredIPs(arr) {
    localStorage.setItem("fofa_filtered_ips", JSON.stringify(arr));
  }

  // base64 编解码
  function B2A(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
  }
  function A2B(str) {
    return decodeURIComponent(escape(window.atob(str)));
  }

  // 获取第 page 页的 IP 列表，返回 Promise<Set>
  function fetchIPsByPage(page) {
    return new Promise((resolve, reject) => {
      const url = new URL(location.href);
      const qbase64 = url.searchParams.get("qbase64");
      if (!qbase64) {
        reject("缺少 qbase64 参数");
        return;
      }
      // 构造对应页的URL，FOFA的页数参数是 page
      url.searchParams.set("page", page);
      // 保持查询参数qbase64不变
      url.searchParams.set("qbase64", qbase64);

      fetch(url.href, { credentials: "include" }).then(resp => resp.text()).then(html => {
        // 解析html
        const dom = new DOMParser().parseFromString(html, "text/html");
        const hostNodes = dom.querySelectorAll("a[target='_blank']");
        const ips = new Set();
        hostNodes.forEach(el => {
          const raw = el.textContent.trim();
          if (ipPortRegex.test(raw)) ips.add(raw);
        });
        resolve(ips);
      }).catch(err => reject(err));
    });
  }

  // 点击排除前6页IP按钮
  btnFilter.addEventListener("click", async () => {
    try {
      btnFilter.disabled = true;
      btnFilter.textContent = "⏳ 正在抓取前6页IP...";
      const allIPs = new Set();

      for (let i = 1; i <= 6; i++) {
        const ips = await fetchIPsByPage(i);
        ips.forEach(ip => allIPs.add(ip));
      }

      if (allIPs.size === 0) {
        alert("⚠️ 前6页没有发现符合格式的 IP:端口 ！");
        btnFilter.disabled = false;
        btnFilter.textContent = "🗡️ 排除前6页 IP";
        return;
      }

      // 读取已保存IP
      const savedIPs = new Set(loadFilteredIPs());
      allIPs.forEach(ip => savedIPs.add(ip));
      // 保存合并结果
      saveFilteredIPs(Array.from(savedIPs));

      // 构造查询条件
      const url = new URL(location.href);
      const qbase64 = url.searchParams.get("qbase64");
      let query = A2B(qbase64);
      allIPs.forEach(host => {
        query += ` && host != "${host}"`;
      });

      const newQ = B2A(query);
      url.searchParams.set("qbase64", newQ);

      // 跳转
      location.href = url.href;
    } catch (e) {
      alert("获取IP失败: " + e);
      btnFilter.disabled = false;
      btnFilter.textContent = "🗡️ 排除前6页 IP";
    }
  });

  // 点击查看已过滤IP按钮，显示可复制弹窗
  btnShow.addEventListener("click", () => {
    const ips = loadFilteredIPs();
    if (ips.length === 0) {
      alert("当前没有已保存的过滤 IP。");
      return;
    }
    modalText.textContent = ips.join("\n");
    modalBg.style.display = "flex";
  });

  // 点击清除已过滤IP按钮
  btnClear.addEventListener("click", () => {
    if (confirm("确定要清除所有已保存的过滤 IP 吗？此操作不可撤销。")) {
      localStorage.removeItem("fofa_filtered_ips");
      alert("✅ 已清空已保存的过滤 IP");
    }
  });

})();

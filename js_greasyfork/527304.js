// ==UserScript==
// @name         Google Site Filter (Overlay on Toolbar)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将站点筛选按钮以绝对定位方式放置在工具栏右侧，不影响原有页面布局
// @match        https://www.google.com/search*
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527304/Google%20Site%20Filter%20%28Overlay%20on%20Toolbar%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527304/Google%20Site%20Filter%20%28Overlay%20on%20Toolbar%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const sites = ["site1.com", "site2.com", "site3.com"];

  function addSiteFilterOverlay() {
    // 定位工具栏容器
    const toolbar = document.getElementById("hdtb");
    if (!toolbar) {
      setTimeout(addSiteFilterOverlay, 500);
      return;
    }
    // 确保工具栏容器是相对定位（绝对定位的子元素以此为参考）
    if (getComputedStyle(toolbar).position === "static") {
      toolbar.style.position = "relative";
    }

    // 创建自定义按钮，绝对定位于工具栏右侧，不占据正常文档流
    const customBtn = document.createElement("div");
    customBtn.innerText = "站点筛选 ▼";
    Object.assign(customBtn.style, {
      position: "absolute",
      right: "10px",       // 离工具栏右边10px
      top: "50%",          // 垂直居中
      transform: "translateY(-50%)",
      padding: "4px 8px",
      background: "#fff",
      border: "1px solid #ccc",
      borderRadius: "2px",
      cursor: "pointer",
      userSelect: "none",
      fontSize: "13px",
      zIndex: "1000"
    });

    // 创建下拉菜单，作为自定义按钮的子元素
    const dropdown = document.createElement("div");
    Object.assign(dropdown.style, {
      position: "absolute",
      top: "110%",       // 显示在按钮下方
      right: "0",
      background: "#fff",
      border: "1px solid #ccc",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      padding: "10px",
      zIndex: "1001",
      display: "none",
      minWidth: "150px"
    });

    // 为每个站点添加复选框
    sites.forEach(site => {
      const label = document.createElement("label");
      label.style.display = "block";
      label.style.marginBottom = "5px";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = `site:${site}`;
      checkbox.style.marginRight = "5px";
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(site));
      dropdown.appendChild(label);
    });

    // 添加“应用筛选”按钮
    const applyBtn = document.createElement("button");
    applyBtn.innerText = "应用筛选";
    Object.assign(applyBtn.style, {
      marginTop: "5px",
      padding: "5px 10px",
      background: "#4285f4",
      color: "#fff",
      border: "none",
      borderRadius: "2px",
      cursor: "pointer",
      fontSize: "13px"
    });
    applyBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const queryInput = document.querySelector('input[name="q"]');
      if (!queryInput) return;
      const query = queryInput.value;
      const selected = Array.from(dropdown.querySelectorAll("input:checked"))
        .map(c => c.value);
      if (selected.length > 0 && query) {
        const newQuery = `${query} ${selected.join(" ")}`;
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(newQuery)}`;
      }
    });
    dropdown.appendChild(applyBtn);
    dropdown.addEventListener("click", (e) => e.stopPropagation());

    // 将下拉菜单添加为自定义按钮的子元素
    customBtn.appendChild(dropdown);

    // 点击自定义按钮时切换下拉菜单显示状态
    customBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
    });
    // 点击页面其他地方关闭下拉菜单
    document.addEventListener("click", () => {
      dropdown.style.display = "none";
    });

    // 将自定义按钮追加到工具栏中（不会影响工具栏布局，因为按钮是绝对定位）
    toolbar.appendChild(customBtn);
  }

  window.addEventListener("load", addSiteFilterOverlay);
})();

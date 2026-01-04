// ==UserScript==
// @name         Easy云课堂下载助手
// @namespace    https://www.easyketang.com/
// @version      1.5
// @description  直接下载课程资源
// @author       Quarix
// @include      https://www.easyketang.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533625/Easy%E4%BA%91%E8%AF%BE%E5%A0%82%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/533625/Easy%E4%BA%91%E8%AF%BE%E5%A0%82%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const STORAGE_KEY_SHOW = "EasyKetangDLHelper_Show";
  const STORAGE_KEY_COLLAPSE = "EasyKetangDLHelper_Collapsed";

  let isShown = localStorage.getItem(STORAGE_KEY_SHOW);
  if (isShown === null) isShown = "true";
  isShown = isShown === "true";

  let isCollapsed = localStorage.getItem(STORAGE_KEY_COLLAPSE);
  if (isCollapsed === null) isCollapsed = "false";
  isCollapsed = isCollapsed === "true";

  let floatBox, header, toggleBtn, resourceList, statusText, dragInfo;

  function createUI() {
    if (floatBox) return;

    floatBox = document.createElement("div");
    Object.assign(floatBox.style, {
      position: "fixed",
      top: "10px",
      right: "10px",
      width: "350px",
      maxHeight: "500px",
      backgroundColor: "#fff",
      border: "1px solid #ccc",
      boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      zIndex: 999999,
      fontSize: "14px",
      padding: "0",
      fontFamily: "Helvetica, Arial, sans-serif",
      borderRadius: "6px",
      color: "#333",
      userSelect: "none",
      display: isShown ? "block" : "none",
      overflow: "hidden",
      boxSizing: "border-box",
    });
    document.body.appendChild(floatBox);

    header = document.createElement("div");
    Object.assign(header.style, {
      cursor: "move",
      backgroundColor: "#0084ff",
      color: "white",
      padding: "8px 12px",
      fontWeight: "600",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      userSelect: "none",
    });
    floatBox.appendChild(header);

    const title = document.createElement("span");
    title.textContent = "资源下载助手";
    header.appendChild(title);

    const controls = document.createElement("div");
    header.appendChild(controls);

    toggleBtn = document.createElement("button");
    toggleBtn.textContent = isCollapsed ? "+" : "−";
    styleControlButton(toggleBtn);
    controls.appendChild(toggleBtn);

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.title = "隐藏悬浮窗 (通过GM菜单重新打开)";
    styleControlButton(closeBtn);
    controls.appendChild(closeBtn);

    toggleBtn.onclick = () => {
      isCollapsed = !isCollapsed;
      localStorage.setItem(STORAGE_KEY_COLLAPSE, isCollapsed);
      updateCollapse();
    };

    closeBtn.onclick = () => {
      setShown(false);
    };

    resourceList = document.createElement("div");
    Object.assign(resourceList.style, {
      maxHeight: "440px",
      overflowY: "auto",
      padding: "10px 15px",
      display: isCollapsed ? "none" : "block",
      userSelect: "text",
    });
    floatBox.appendChild(resourceList);

    statusText = document.createElement("div");
    Object.assign(statusText.style, {
      fontSize: "12px",
      color: "#888",
      margin: "8px 15px 10px",
      textAlign: "center",
      display: isCollapsed ? "none" : "block",
    });
    statusText.textContent = "尚未获取到资源";
    floatBox.appendChild(statusText);

    dragInfo = { dragging: false, offsetX: 0, offsetY: 0 };
    header.addEventListener("mousedown", onDragStart);
    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragEnd);
  }

  function styleControlButton(btn) {
    Object.assign(btn.style, {
      marginLeft: "8px",
      background: "transparent",
      border: "none",
      color: "white",
      fontSize: "18px",
      lineHeight: "18px",
      cursor: "pointer",
      userSelect: "none",
      padding: "0 4px",
    });
    btn.onmouseenter = () => (btn.style.color = "#cce4ff");
    btn.onmouseleave = () => (btn.style.color = "white");
  }

  function updateCollapse() {
    if (!resourceList || !statusText || !toggleBtn) return;
    if (isCollapsed) {
      resourceList.style.display = "none";
      statusText.style.display = "none";
      toggleBtn.textContent = "+";
      floatBox.style.height = "auto";
      floatBox.style.maxHeight = "";
    } else {
      resourceList.style.display = "block";
      statusText.style.display = "block";
      toggleBtn.textContent = "−";
      floatBox.style.maxHeight = "500px";
    }
  }

  function setShown(show) {
    isShown = show;
    if (floatBox) floatBox.style.display = show ? "block" : "none";
    localStorage.setItem(STORAGE_KEY_SHOW, show ? "true" : "false");
    updateMenu();
  }

  let menuId = null;
  function updateMenu() {
    if (menuId) GM_unregisterMenuCommand(menuId);
    menuId = GM_registerMenuCommand(
      (isShown ? "隐藏" : "显示") + "资源下载窗",
      () => setShown(!isShown)
    );
  }

  updateMenu();

  function onDragStart(e) {
    dragInfo.dragging = true;
    const rect = floatBox.getBoundingClientRect();
    dragInfo.offsetX = e.clientX - rect.left;
    dragInfo.offsetY = e.clientY - rect.top;
    e.preventDefault();
  }
  function onDragMove(e) {
    if (!dragInfo.dragging) return;
    const left = e.clientX - dragInfo.offsetX;
    const top = e.clientY - dragInfo.offsetY;

    floatBox.style.left =
      Math.min(
        window.innerWidth - floatBox.offsetWidth - 10,
        Math.max(10, left)
      ) + "px";
    floatBox.style.top =
      Math.min(
        window.innerHeight - floatBox.offsetHeight - 10,
        Math.max(10, top)
      ) + "px";
    floatBox.style.right = "auto";
    e.preventDefault();
  }
  function onDragEnd(e) {
    dragInfo.dragging = false;
  }

  // 直接写content字符串为txt下载
  function downloadTextFile(text, filename) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    downloadFileWithProgress(url, filename);
    setTimeout(() => URL.revokeObjectURL(url), 15000);
  }

  async function downloadFileWithProgress(url, filename) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP错误，状态码 ${response.status}`);

      const contentLength = response.headers.get("content-length");
      const total = contentLength ? parseInt(contentLength, 10) : null;

      const reader = response.body.getReader();
      const chunks = [];
      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;
      }

      const blob = new Blob(chunks);
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename || "";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.warn("下载出错，尝试在新标签打开链接:", error);
      window.open(url, "_blank", "noopener");
    }
  }
  // 主体处理函数：task_item，过滤空content
  function handleTaskItem(taskItem) {
    createUI();

    resourceList.innerHTML = "";
    statusText.textContent = "已获取资源";

    for (const category in taskItem) {
      if (!Array.isArray(taskItem[category])) continue;
      const list = taskItem[category];

      list.forEach((section) => {
        if (!section.resource || !section.resource.length) return;

        // 过滤content为空的资源
        const filteredResources = section.resource.filter((r) => {
          if (r.content === null || r.content === undefined) return false;
          const c = String(r.content).trim();
          return c.length > 0;
        });
        if (!filteredResources.length) return;

        const sectionTitle = document.createElement("h3");
        sectionTitle.textContent = section.name || "未命名分类";
        Object.assign(sectionTitle.style, {
          margin: "15px 0 8px",
          fontWeight: "700",
          borderBottom: "1px solid #ddd",
          paddingBottom: "2px",
          fontSize: "15px",
        });
        resourceList.appendChild(sectionTitle);

        filteredResources.forEach((res) => {
          const btn = document.createElement("button");
          btn.textContent = res.filename || `资源-${res.id}`;
          Object.assign(btn.style, {
            display: "block",
            width: "100%",
            marginBottom: "8px",
            cursor: "pointer",
            padding: "8px 12px",
            backgroundColor: "#0084ff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            textAlign: "left",
            fontWeight: "500",
            userSelect: "none",
            transition: "background-color 0.2s ease",
          });

          btn.onmouseenter = () => (btn.style.backgroundColor = "#005ecb");
          btn.onmouseleave = () => (btn.style.backgroundColor = "#0084ff");

          btn.onclick = () => {
            const content = String(res.content).trim();
            if (/^https?:\/\//i.test(content)) {
              let url = String(res.content).trim();
              if (url.startsWith("http://")) {
                url = url.replace(/^http:\/\//i, "https://");
              }
              downloadFileWithProgress(url, res.filename);
            } else {
              downloadTextFile(content, (res.filename || "文件") + ".txt");
            }
          };

          resourceList.appendChild(btn);
        });
      });
    }
  }

  (function () {
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
      this._url = url + "";
      return origOpen.apply(this, arguments);
    };

    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
      this.addEventListener("load", () => {
        if (!this._url) return;
        if (
          this._url.includes(
            "https://cloud-api.easyketang.com/admin/task_item/get_nnew_list_item"
          )
        ) {
          try {
            const text = this.responseText;
            const json = JSON.parse(text);
            if (json && json.data && json.data.task_item) {
              handleTaskItem(json.data.task_item);
            }
          } catch (e) {
            console.warn("EasyKetang 下载助手 XHR 解析异常:", e);
          }
        }
      });
      return origSend.apply(this, arguments);
    };
  })();

  let lastHash = location.hash;
  window.addEventListener("hashchange", () => {
    if (location.hash !== lastHash) {
      lastHash = location.hash;
      if (resourceList) resourceList.innerHTML = "";
      if (statusText) statusText.textContent = "等待接口请求资源...";
    }
  });

  function start() {
    createUI();
    updateCollapse();
  }

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    start();
  } else {
    window.addEventListener("DOMContentLoaded", start, false);
  }
})();

// ==UserScript==
// @name         JavDB Watched Marker
// @version      1.1
// @namespace    https://gist.github.com/sqzw-x
// @description  自动标记看过的影片
// @match        https://javdb.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_addElement
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525605/JavDB%20Watched%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/525605/JavDB%20Watched%20Marker.meta.js
// ==/UserScript==

"use strict";

const get_localStorage = (key) => JSON.parse(localStorage.getItem(key));
const set_localStorage = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

const URL_SET_KEY = "javdb-watched-url-set";
const NUM_SET_KEY = "javdb-watched-num-set";

let watchedURLSet = new Set(get_localStorage(URL_SET_KEY));
let watchedNumSet = new Set(get_localStorage(NUM_SET_KEY));

// 创建隐藏的文件输入框
const fileInput = GM_addElement(document.body, "input", {
  type: "file",
  accept: ".json",
  style: "display: none",
});

fileInput.addEventListener("change", handleFileSelect);

// 注册油猴菜单
GM_registerMenuCommand("导入看过列表", () => fileInput.click());
GM_registerMenuCommand("手动添加看过", showManualInputDialog);

// 处理文件导入
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const r = JSON.parse(e.target.result);
      // r is an array of objects
      // each object has a url property and a number property
      // add each url to watchedURLSet and each num to watchedNumSet
      r.forEach((item) => {
        watchedURLSet.add(item.url);
        watchedNumSet.add(item.number);
      });
      set_localStorage(URL_SET_KEY, Array.from(watchedURLSet));
      set_localStorage(NUM_SET_KEY, Array.from(watchedNumSet));
    } catch (error) {
      console.error("解析文件失败:", error);
      alert("无法解析文件，请确保是有效的JSON格式");
    }
  };
  reader.readAsText(file);
}

// 显示手动输入对话框
function showManualInputDialog() {
  // 创建对话框容器
  const dialogContainer = document.createElement("div");
  dialogContainer.style.position = "fixed";
  dialogContainer.style.top = "0";
  dialogContainer.style.left = "0";
  dialogContainer.style.width = "100%";
  dialogContainer.style.height = "100%";
  dialogContainer.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  dialogContainer.style.display = "flex";
  dialogContainer.style.justifyContent = "center";
  dialogContainer.style.alignItems = "center";
  dialogContainer.style.zIndex = "10000";

  // 创建对话框内容
  const dialog = document.createElement("div");
  dialog.style.backgroundColor = "white";
  dialog.style.padding = "20px";
  dialog.style.borderRadius = "5px";
  dialog.style.width = "300px";
  dialog.style.maxWidth = "90%";

  dialog.innerHTML = `
    <h3 style="margin-top: 0">添加已观看视频</h3>
    <div style="margin-bottom: 10px;">
      <label for="url-input">URL或ID:</label>
      <input id="url-input" type="text" style="width: 100%; box-sizing: border-box;" placeholder="例如: abc123">
    </div>
    <div style="margin-bottom: 15px;">
      <label for="number-input">番号:</label>
      <input id="number-input" type="text" style="width: 100%; box-sizing: border-box;" placeholder="例如: ABC-123">
    </div>
    <div style="text-align: right;">
      <button id="cancel-btn" style="margin-right: 10px; padding: 5px 10px;">取消</button>
      <button id="save-btn" style="padding: 5px 10px;">保存</button>
    </div>
  `;

  dialogContainer.appendChild(dialog);
  document.body.appendChild(dialogContainer);

  // 添加事件监听
  document.getElementById("cancel-btn").addEventListener("click", () => {
    document.body.removeChild(dialogContainer);
  });

  document.getElementById("save-btn").addEventListener("click", () => {
    const urlInput = document.getElementById("url-input").value.trim();
    const numberInput = document.getElementById("number-input").value.trim();

    if (urlInput) {
      // 从URL中提取ID部分
      const urlId = urlInput.includes("/v/")
        ? urlInput.split("/v/")[1]
        : urlInput;
      watchedURLSet.add(urlId);
      set_localStorage(URL_SET_KEY, Array.from(watchedURLSet));
    }

    if (numberInput) {
      watchedNumSet.add(numberInput);
      set_localStorage(NUM_SET_KEY, Array.from(watchedNumSet));
    }

    if (urlInput || numberInput) {
      alert("已添加到观看列表");
      markWatchedVideos(); // 重新标记视频
    } else {
      alert("请至少输入一项");
      return;
    }

    document.body.removeChild(dialogContainer);
  });
}

// 标记已看过的视频
function markWatchedVideos() {
  const videos = document.querySelectorAll(".item");

  const watched = (v) => {
    const link = v.querySelector("a");
    if (link) {
      const url = link.getAttribute("href")?.replace("/v/", "");
      return url && watchedURLSet.has(url) ? "看过" : null;
    }
    const num = v.querySelector(".video-title strong").textContent;
    return num && watchedNumSet.has(num) ? "可能看过" : null;
  };

  videos.forEach((v) => {
    const t = watched(v);
    if (t) {
      const marker = document.createElement("span");
      marker.className = "review";
      marker.textContent = t;
      v.querySelector(".cover").appendChild(marker);
    }
  });
}

// 初始化
function init() {
  markWatchedVideos();
}

init();

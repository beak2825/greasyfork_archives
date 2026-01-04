// ==UserScript==
// @name         南工在线转码助手
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Display cookies, video ID, and manage transcoding queue from online.njtech.edu.cn
// @author       千纸鹤也要飞啊
// @match        *://online.njtech.edu.cn/video/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/519359/%E5%8D%97%E5%B7%A5%E5%9C%A8%E7%BA%BF%E8%BD%AC%E7%A0%81%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/519359/%E5%8D%97%E5%B7%A5%E5%9C%A8%E7%BA%BF%E8%BD%AC%E7%A0%81%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  GM_addStyle(`
        #cookie-display {
            position: fixed;
            top: 100px;
            right: 50px;
            padding: 10px;
            border: 3px solid #ccc;
            border-radius: 10px;
            background-color: var(--global-background);
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 9999;
            font-size: 12px;
            width: 200px;
            word-break: break-all;
            cursor: grab; /* 添加抓取光标 */
        }
        #cookie-display.dragging {
            cursor: grabbing; /* 添加拖动光标 */
        }
        #cookie-display-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        #cookie-display-content {
            margin-top: 5px;
            text-size:16px;
        }
        .close-button {
            cursor: pointer;
            padding: 0 5px;
        }
        .transcode-button {
            padding: 15px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 10px;
            width: 100%;
        }
        .transcode-button:hover {
            background-color: #45a049;
        }
        .button-row {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
        }
        .one-click-button {
            padding: 8px 10px;
            background-color: blue; /* 淡蓝色 */
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            width: 48%;
        }
        .one-click-button:hover {
            background-color: blue;
        }
        .danger-button {
            padding: 8px 10px;
            background-color: #FFD700; /* 黄色 */
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            width: 48%;
        }
        .danger-button:hover {
            background-color: #FFC107;
        }
    `);

  function createFloatingWindow() {
    const title = document.createElement("span");
    title.textContent = "转码助手";

    const closeButton = document.createElement("span");
    closeButton.textContent = "×";
    closeButton.className = "close-button";
    closeButton.onclick = () => (div.style.display = "none");

    const div = document.createElement("div");
    div.id = "cookie-display";

    const header = document.createElement("div");
    header.id = "cookie-display-header";

    const content = document.createElement("div");
    content.id = "cookie-display-content";

    const transcodeButton = document.createElement("button");
    transcodeButton.textContent = "转码当前视频";
    transcodeButton.className = "transcode-button";
    transcodeButton.onclick = transcodeCurrentVideo;

    const buttonRow = document.createElement("div");
    buttonRow.className = "button-row";

    const oneClickButton = document.createElement("button");
    oneClickButton.textContent = "一键入库(all)";
    oneClickButton.className = "one-click-button";
    oneClickButton.onclick = oneClickHandler;

    const dangerButton = document.createElement("button");
    dangerButton.textContent = "一键转码(all)";
    dangerButton.className = "danger-button";
    dangerButton.onclick = startTranscodingAll;

    buttonRow.appendChild(oneClickButton);
    buttonRow.appendChild(dangerButton);

    header.appendChild(title);
    header.appendChild(closeButton);
    div.appendChild(header);
    div.appendChild(content);
    div.appendChild(transcodeButton);
    div.appendChild(buttonRow);

    // 添加拖动逻辑
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.onmousedown = function (e) {
      isDragging = true;
      div.classList.add("dragging");
      offsetX = e.clientX - div.offsetLeft;
      offsetY = e.clientY - div.offsetTop;
    };

    document.onmousemove = function (e) {
      if (isDragging) {
        div.style.left = `${e.clientX - offsetX}px`;
        div.style.top = `${e.clientY - offsetY}px`;
      }
    };

    document.onmouseup = function () {
      if (isDragging) {
        isDragging = false;
        div.classList.remove("dragging");
      }
    };

    return div;
  }

  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  }

  function getVideoID() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id") || "未找到";
  }

  function updateDisplay() {
    const content = document.getElementById("cookie-display-content");
    const onlineToken = getCookie("online_token") || "未找到";
    const videoID = getVideoID();

    content.innerHTML = `
        <strong>online_token:</strong> <span id="copy-token" style="cursor: pointer; color: blue; text-decoration: underline;">点击复制</span><br>
        <strong>视频ID:</strong> <span id="copy-video-id" style="cursor: pointer; color: blue; text-decoration: underline;">点击复制</span>
    `;

    document.getElementById("copy-token").onclick = function() {
        navigator.clipboard.writeText(onlineToken).then(function() {
            alert("Token 已复制到剪切板");
        }, function(err) {
            console.error("无法复制 token: ", err);
        });
    };

    document.getElementById("copy-video-id").onclick = function() {
        navigator.clipboard.writeText(videoID).then(function() {
            alert("视频ID 已复制到剪切板");
        }, function(err) {
            console.error("无法复制视频ID: ", err);
        });
    };
  }

  async function transcodeCurrentVideo() {
    await addToTranscodeQueue();
    await showTranscodingQueue();
    await startTranscodingQueue();
  }

  async function addToTranscodeQueue() {
    const onlineToken = getCookie("online_token");
    const videoID = getVideoID();

    if (!onlineToken || videoID === "未找到") {
      alert("未找到在线令牌或视频ID，请检查！");
      return;
    }

    const url =
      "https://online.njtech.edu.cn/api/v2/automation/media_transcoder/work_queue/items";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/problem+json",
        Authorization: `Bearer ${onlineToken}`,
      },
      body: JSON.stringify({
        episodes: [],
        seasons: [],
        videos: [videoID],
      }),
    };

    try {
      const response = await fetch(url, options);
      if (response.status === 204) {
        /alert("成功添加到转码队列!");/
      } else if (response.status === 500) {
        alert("已在队列中!");
      } else {
        const errorData = await response.json();
        console.error(errorData);
        alert("添加到转码队列失败，查看控制台获取详细错误信息。");
      }
    } catch (error) {
      console.error(error);
      alert("发生错误，查看控制台获取详细错误信息。");
    }
  }

  async function showTranscodingQueue() {
    const onlineToken = getCookie("online_token");

    if (!onlineToken) {
      alert("未找到在线令牌，请检查！");
      return;
    }

    const url =
      "https://online.njtech.edu.cn/api/v2/automation/media_transcoder/work_queue";
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json, application/problem+json",
        Authorization: `Bearer ${onlineToken}`,
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      const queueItems = data.queue;
      const dialogContent = document.createElement("div");
      if (queueItems.length === 0) {
        dialogContent.innerHTML = "待转码队列: 暂无待转码项。";
      } else {
        dialogContent.innerHTML = "待转码队列：";
        queueItems.forEach((item, index) => {
          dialogContent.innerHTML += `${index + 1}. ${item}<br>`;
        });
      }

      /alert(dialogContent.innerHTML);/
    } catch (error) {
      console.error(error);
      alert("获取待转码队列失败，查看控制台获取详细错误信息。");
    }
  }

  async function startTranscodingQueue() {

    const url =
      "https://online.njtech.edu.cn/api/v2/automation/media_transcoder/transcoding";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/problem+json",
        Authorization: "Bearer ${online_token}",
      },
      body: undefined,
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
      alert("转码已开始");
    }
  }

  async function startTranscodingAll() {
    alert("开始转码所有未转码的视频，操作危险！");

    const url = 'https://online.njtech.edu.cn/api/v2/automation/media_transcoder/COMPOSCAN_TRANSCODING';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/problem+json',
        Authorization: 'Bearer ' + getCookie("online_token")
      },
      body: undefined
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function oneClickHandler() {
    alert("开始扫描所有未入库的视频，操作危险！");
    const onlineToken = getCookie("online_token");

    if (!onlineToken) {
      alert("未找到在线令牌，请检查！");
      return;
    }

    const url1 = 'https://online.njtech.edu.cn/api/v2/automation/media_scanner/work_queue/items?bucket=online-data2';
    const options1 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/problem+json',
        Authorization: `Bearer ${onlineToken}`
      },
      body: '{"queue":["media/"]}'
    };

    try {
      const response1 = await fetch(url1, options1);
      const data1 = await response1.json();
      console.log(data1);
    } catch (error) {
      console.error(error);
    }

    const url2 = 'https://online.njtech.edu.cn/api/v2/automation/media_scanner/scanning?bucket=online-data2';
    const options2 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/problem+json',
        Authorization: `Bearer ${onlineToken}`
      },
      body: undefined
    };

    try {
      const response2 = await fetch(url2, options2);
      const data2 = await response2.json();
      console.log(data2);
    } catch (error) {
      console.error(error);
    }
  }

  function init() {
    const floatingWindow = createFloatingWindow();
    document.body.appendChild(floatingWindow);
    updateDisplay();
    setInterval(updateDisplay, 5000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

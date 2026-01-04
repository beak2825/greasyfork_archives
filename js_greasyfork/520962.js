// ==UserScript==
// @name         go-bili-jimaku
// @namespace    https://github.com/nazonoa/go-bili-jimaku
// @version      1.2.0
// @description  bilibili任意视频挂载外部字幕
// @author       siianchan@foxmail.com
// @run-at       document-body
// @match        https://www.bilibili.com/video/*
// @license      GPL-3.0
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzMzOTg0ODg5OTk3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQ1NDQiIGlkPSJteF9uXzE3MzM5ODQ4ODk5OTciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik0xMDA0LjY5NjUzNiA4ODguMDQ0NDg1TDU3NC45NjUzMzQgNTAuNDQzNTU4YTkyLjgwODE1MSA5Mi44MDgxNTEgMCAwIDAtMTY2LjY3MTY1NCAzLjEwODMzNkwxNy4zMzU2NjIgODkxLjE1MjgyMmE5Mi44MDgxNTEgOTIuODA4MTUxIDAgMSAwIDE2OC4xODg5OTMgNzguNTAzOTFsMzEwLjgzMzY0OS02NjUuODYxNjU0TDcwMy45MjQ0NyA3MDguNDIzODg1SDUyNC42NDI2OTJhOTIuODA4MTUxIDkyLjgwODE1MSAwIDAgMCAwIDE4NS42MTYzMDFoMjI2LjExMzA2NWE5Mi4zNjYyMDcgOTIuMzY2MjA3IDAgMCAwIDQzLjAzMDU3My0xMC41NjI0NTFsNDUuODE0ODE3IDg5LjMwMjA2NWE5Mi44MDgxNTEgOTIuODA4MTUxIDAgMSAwIDE2NS4xNTQzMTUtODQuNzM1MzE1eiIgZmlsbD0iI2ZiNzI5OSIgcC1pZD0iNDU0NSI+PC9wYXRoPjwvc3ZnPg==
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @note         24-12-25 1.2.0 优化字幕加载逻辑,字幕移动到视频下方,进入视频后自动暂停视频
// @note         24-12-16 1.1.0 新增字幕轴整体延时调整功能
// @note         24-12-12 1.0.0 初版发布
// @downloadURL https://update.greasyfork.org/scripts/520962/go-bili-jimaku.user.js
// @updateURL https://update.greasyfork.org/scripts/520962/go-bili-jimaku.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.log("加载脚本--go-bilibili-jimaku--");
  const language = navigator.language;
  const jimakuId = getJimakuId();
  const host = "https://vsub.cn/jimaku-api";
  let jimakuSize = GM_getValue("jimaku-size") || "18";
  let jimakuDelay = "0";
  let jimakuData = {};
  let lastIndex = -1;
  let lastTime = 0;
  let count = 0;
  let playerVideo;
  let jimaku;
  let jimakuWrap;
  let newTitleTrans;
  let buttonGroup;
  let switchInput;
  let css = `
    #trans-title {
      color: #95a5a6;
      font-weight: bold;
      font-size: 1.2rem;
    }
    #jimaku {
      padding: 2px 4px;
      border-radius: 2px;
      font-size: 18px;
      line-height: 1.6;
      font-weight: bold;
      color: white;
      border-radius: 5px;
      background-color: rgba(0, 0, 0, 0.5);
    }
    #jimaku:empty {
      visibility: hidden;
    }
    #jimaku-wrap {
      width: 80%;
      bottom: 20px;
      position: absolute;
      text-align: center;
      z-index: 100;
      left: 50%;
      transform: translateX(-50%);
    }
    #jimaku-button-group {
      margin: 10px;
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: start;
    }
    .jimaku-button {
      padding: 5px;
      background-color: #00a1d6;
      border: none;
      border-radius: 5px;
      text-align: center;
      color: white;
      width: 50px;
      margin-right: 5px;
      font-size: 12px;
      cursor: pointer;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s;
    }
    .jimaku-button[data-state="ON"] {
      background-color: #4caf50;
    }
    .jimaku-button[data-state="OFF"] {
      background-color: #f44336;
    }
    .jimaku-button:hover {
      scale: 1.02;
    }
  `;
  GM_addStyle(css);
  function ajaxGet(url, onSuccess, onError) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          onSuccess(xhr.responseText);
        } else {
          onError(xhr.status, xhr.statusText);
        }
      }
    };
    xhr.send();
  }
  function getJimakuId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("jimakuId");
  }
  function getBvid() {
    const match = window.location.href.match(/\/video\/(BV\w+)\//);
    return match ? match[1] : "";
  }
  function findSubtitleIndex(currentTime) {
    let left = 0;
    let right = jimakuData.detail.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const item = jimakuData.detail[mid];
      if (currentTime >= item.s && currentTime <= item.e) {
        return mid;
      } else if (currentTime < item.s) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    return -1;
  }

  function loadJimakuData() {
    let bvid = getBvid();
    return new Promise((resolve, reject) => {
      ajaxGet(
        host +
          "/getJimaku?bvid=" +
          bvid +
          "&lan=" +
          language +
          "&jimakuId=" +
          jimakuId,
        (ret) => {
          resolve("ok");
          const obj = JSON.parse(ret);
          if (obj.code == 200) {
            jimakuData = obj.data;
          }
        },
        (err) => {
          reject("err");
          console.log(err);
        }
      );
    });
  }

  loadJimakuData().then(() => {
    const loadJimakuInterval = setInterval(() => {
      playerVideo = document.querySelector(".bpx-player-video-wrap video");
      if (playerVideo) {
        loadJimaku();
        setSrcObserve();
        clearInterval(loadJimakuInterval);
      }
    }, 50);
    const switchInputInterval = setInterval(() => {
      if (!switchInput) {
        switchInput = document.querySelectorAll("input.bui-switch-input")[2];
      }
      if (++count > 20 || !jimakuData?.id) {
        clearInterval(switchInputInterval);
        return;
      }
      if (switchInput && !switchInput.checked) {
        clearInterval(switchInputInterval);
        return;
      }
      if (playerVideo && !playerVideo.paused) {
        playerVideo.pause();
        clearInterval(switchInputInterval);
      }
    }, 100);
    const searchFormInterval = setInterval(() => {
      const searchform = document.querySelector("#nav-searchform");
      if (searchform) {
        loadTitleAndButton();
        clearInterval(searchFormInterval);
      }
    }, 500);
  });

  function loadJimaku() {
    if (jimakuWrap || !jimakuData.detail?.length) {
      return;
    }
    setJimaku();
    setObserve();
    setJimakuEvent();
  }

  function setJimaku() {
    jimaku = document.createElement("span");
    jimakuWrap = document.createElement("div");
    jimaku.id = "jimaku";
    jimaku.style.fontSize = jimakuSize + "px";
    jimakuWrap.id = "jimaku-wrap";
    jimakuWrap.appendChild(jimaku);
    playerVideo.insertAdjacentElement("afterend", jimakuWrap);
  }

  function setSrcObserve() {
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.attributeName == "src") {
          const src = playerVideo.getAttribute("src");
          if (src != null && src.length > 0) {
            loadJimakuData().then(() => {
              loadJimaku();
              loadTitleAndButton();
            });
          }
        }
      });
    });
    observer.observe(playerVideo, {
      attributes: true,
      attributeFilter: ["src"],
    });
  }
  function setObserve() {
    const playerContainer = document.querySelector(".bpx-player-container");
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.attributeName == "data-screen") {
          const screen = playerContainer.getAttribute("data-screen");
          if (screen == "full") {
            jimaku.style.fontSize = jimakuSize * 1.8 + "px";
          } else if (screen == "normal") {
            jimaku.style.fontSize = jimakuSize + "px";
          } else {
          }
        } else if (mutation.attributeName == "data-ctrl-hidden") {
          const hidden = playerContainer.getAttribute("data-ctrl-hidden");
          const screen = playerContainer.getAttribute("data-screen");
          if (hidden == "true") {
            jimakuWrap.style.bottom = "18px";
          } else {
            jimakuWrap.style.bottom = screen == "normal" ? "78px" : "95px";
          }
        }
      });
    });
    observer.observe(playerContainer, {
      attributes: true,
      attributeFilter: ["data-screen", "data-ctrl-hidden"],
    });
  }

  function setJimakuEvent() {
    playerVideo.addEventListener("timeupdate", () => {
      const currentTime = playerVideo.currentTime - parseFloat(jimakuDelay);
      const timeJumpThreshold = 1.0;
      if (Math.abs(currentTime - lastTime) > timeJumpThreshold) {
        lastIndex = -1;
      }
      if (lastIndex !== -1) {
        const lastItem = jimakuData.detail[lastIndex];
        if (currentTime >= lastItem.s && currentTime <= lastItem.e) {
          lastTime = currentTime;
          return;
        }
      }
      const index = findSubtitleIndex(currentTime);
      if (index !== -1) {
        lastIndex = index;
        const item = jimakuData.detail[index];
        jimaku.textContent = item.t;
      } else {
        lastIndex = -1;
        jimaku.textContent = "";
      }
      lastTime = currentTime;
    });
  }

  function loadTitleAndButton() {
    setTransTitle();
    setButton();
  }
  function setTransTitle() {
    if (!jimakuData?.title) {
      newTitleTrans && (newTitleTrans.textContent = "");
      return;
    }
    if (!newTitleTrans) {
      newTitleTrans = document.createElement("div");
    }
    const playerWrap = document.querySelector("#playerWrap");
    newTitleTrans.textContent =
      jimakuData.title + " 【@" + (jimakuData.author || "匿名") + "】";
    newTitleTrans.style.padding = "10px";
    newTitleTrans.id = "trans-title";
    playerWrap.insertAdjacentElement("afterend", newTitleTrans);
  }

  function setButton() {
    if (!jimakuData?.id || buttonGroup) {
      return;
    }
    const addElement =
      document.querySelector("#trans-title") ||
      document.querySelector("#playerWrap");
    buttonGroup = document.createElement("div");
    buttonGroup.id = "jimaku-button-group";

    const turn = document.createElement("button");
    turn.setAttribute("data-state", "ON");
    turn.textContent = turn.getAttribute("data-state");
    turn.className = "jimaku-button";
    turn.id = "jimaku-button-switch";
    turn.addEventListener("click", () => {
      if (turn.getAttribute("data-state") == "ON") {
        turn.setAttribute("data-state", "OFF");
      } else {
        turn.setAttribute("data-state", "ON");
      }
      turn.textContent = turn.getAttribute("data-state");
      if (jimakuWrap.style.display == "none") {
        jimakuWrap.style.display = "block";
      } else {
        jimakuWrap.style.display = "none";
      }
    });

    const jimakuSizeShow = document.createElement("span");
    jimakuSizeShow.textContent = jimakuSize + "px";
    const fontSizeRange = document.createElement("input");
    fontSizeRange.type = "range";
    fontSizeRange.min = "12";
    fontSizeRange.max = "30";
    fontSizeRange.value = jimakuSize;
    fontSizeRange.addEventListener("input", () => {
      const fontSize = fontSizeRange.value + "px";
      jimakuSizeShow.textContent = fontSize;
      jimaku.style.fontSize = fontSize;
      GM_setValue("jimaku-size", fontSizeRange.value);
    });

    const delayTimeShow = document.createElement("span");
    delayTimeShow.textContent = jimakuDelay + "s";
    const delayTimeRange = document.createElement("input");
    delayTimeRange.type = "range";
    delayTimeRange.min = "-3";
    delayTimeRange.step = "0.2";
    delayTimeRange.style.marginLeft = "20px";
    delayTimeRange.max = "3";
    delayTimeRange.value = jimakuDelay;
    delayTimeRange.addEventListener("input", () => {
      const delayTimeRangeValue = delayTimeRange.value;
      delayTimeShow.textContent = delayTimeRangeValue + "s";
    });

    buttonGroup.appendChild(turn);
    buttonGroup.appendChild(fontSizeRange);
    buttonGroup.appendChild(jimakuSizeShow);
    buttonGroup.appendChild(delayTimeRange);
    buttonGroup.appendChild(delayTimeShow);
    addElement.insertAdjacentElement("afterend", buttonGroup);
  }
})();

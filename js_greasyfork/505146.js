// ==UserScript==
// @name         Jdb
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  Jdb script
// @author       Current__
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.12.4/dist/sweetalert2.all.min.js
// @match        https://javdb.com/*
// @license      AGPL-3.0-or-later
// @run-at       document-endl
// @resource customCSS https://cdn.jsdelivr.net/npm/sweetalert2@11.12.4/dist/sweetalert2.min.css
// @require      https://cdn.jsdelivr.net/npm/artplayer@5.2.5/dist/artplayer.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/505146/Jdb.user.js
// @updateURL https://update.greasyfork.org/scripts/505146/Jdb.meta.js
// ==/UserScript==
const videoInfoMap = new Map();

class VideoInfo {
  constructor(percentDone, pickCode, status) {
    this.percentDone = percentDone;
    this.pickCode = pickCode;
    this.status = status;
  }
}

(function () {
  "use strict";
  const PLAYABLE_STATUS = 2;
  const DOWNLOADING_STATUS = 1;
  const API_BASE_URL = "https://263279.xyz:8443";
  const magnetList = [];
  let videoId;
  function initialize() {
    const magnetsContent = document.getElementById("magnets-content");
    if (!magnetsContent) return;

    Array.prototype.forEach.call(magnetsContent.children, function (element) {
      const magnetLink =
        element.children[0].children[0].href.match(/magnet:\?xt[^&]+/);
      if (magnetLink) magnetList.push(magnetLink[0]);
    });

    videoId = document
      .querySelector(".title.is-4 > *")
      .innerHTML.replace(" ", "");
    fetchVideoInfo(magnetList).then((data) => {
      populateVideoInfoMap(data);
      updateMagnetLinks(magnetsContent);
    });
  }

  function fetchVideoInfo(magnetList) {
    return fetch(`${API_BASE_URL}/jdb/videoInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoId,
        magnetList,
      }),
    })
      .then((response) => response.json())
      .then(({ data }) => data);
  }

  function populateVideoInfoMap(data) {
    if (Array.isArray(data)) {
      data.forEach((element) => {
        videoInfoMap.set(
          element.magnet,
          new VideoInfo(element.percentDone, element.pickCode, element.status)
        );
      });
    }
  }

  function updateMagnetLinks(magnetsContent) {
    Array.from(magnetsContent.children).forEach((child) => {
      const linkElement = child.firstElementChild.firstElementChild;
      const magnetLink = linkElement.href;
      const match = magnetLink.match(/magnet:\?xt[^&]+/);
      updateExistingMagnetLink(
        linkElement,
        videoInfoMap.get(match[0]),
        match[0]
      );
    });
  }

  function updateExistingMagnetLink(linkElement, videoInfo, magnetLink) {
    const statusText = linkElement.firstElementChild;

    if (videoInfo.status === PLAYABLE_STATUS) {
      linkElement.href = "javascript:void(0)";
      linkElement.onclick = () => playVideo(magnetLink);
      statusText.innerHTML = "[已缓存] " + statusText.innerHTML;
    } else if (videoInfo.status === DOWNLOADING_STATUS) {
      linkElement.href = "javascript:void(0)";
      statusText.innerHTML =
        `[${videoInfo.percentDone}%] ` + statusText.innerHTML;
    } else {
      linkElement.href = "javascript:void(0)";
      linkElement.onclick = () => addNewVideo(magnetLink);
      statusText.innerHTML = "[离线下载] " + statusText.innerHTML;
    }
  }

  function playVideo(magnetLink) {
    if (document.querySelector("#artplayer-overlay")) return;

    // 外层遮罩（点击关闭）
    const overlay = document.createElement("div");
    overlay.id = "artplayer-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0,0,0,0.6)";
    overlay.style.zIndex = "10000";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";

    // modal 容器（阻止点击关闭）
    const modal = document.createElement("div");
    modal.id = "artplayer-modal";
    modal.style.width = "800px";
    modal.style.height = "450px";
    modal.style.background = "#000";
    modal.style.borderRadius = "10px";
    modal.style.overflow = "hidden";
    modal.style.boxShadow = "0 4px 20px rgba(0,0,0,0.5)";

    // 播放器容器
    const playerDiv = document.createElement("div");
    playerDiv.style.width = "100%";
    playerDiv.style.height = "100%";
    modal.appendChild(playerDiv);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // 点击 overlay 空白处关闭
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });
    fetch(`${API_BASE_URL}/115Cloud/getFileUrl`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        magnetLink,
      }),
    })
      .then((response) => response.json())
      .then(({ data }) => {
        // 初始化播放器
        new Artplayer({
          container: playerDiv,
          url: data,
          autoplay: true,
          theme: "#23ade5",
          setting: true,
          fullscreen: true,
          hotkey: true,
          playbackRate: true,
          customType: {},
          // 初始化完成时
          moreVideoAttr: {
            crossorigin: "anonymous",
          },
          // 插件或钩子
          custom: function (art) {
            let isPressed = false;

            function startSpeed() {
              if (!isPressed) {
                isPressed = true;
                art.playbackRate = 2.0; // 长按加速到 2 倍
              }
            }

            function stopSpeed() {
              if (isPressed) {
                isPressed = false;
                art.playbackRate = 1.0; // 松开恢复正常速度
              }
            }

            // PC 鼠标长按
            art.template.$video.addEventListener("mousedown", startSpeed);
            window.addEventListener("mouseup", stopSpeed);

            // 移动端触摸长按
            art.template.$video.addEventListener("touchstart", startSpeed);
            window.addEventListener("touchend", stopSpeed);
          },
        });
      });
  }

  function addNewVideo(magnetLink) {
    fetch(`${API_BASE_URL}/jdb/addVideo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoId,
        magnet: magnetLink,
      }),
    })
      .then((response) => response.json())
      .then(({ code, message }) => {
        Swal.fire({
          title: code === 0 ? "添加成功" : message,
          icon: code === 0 ? "success" : "error",
          timer: 5000, // 设置倒计时为5000毫秒（5秒）
          timerProgressBar: true, // 显示倒计时进度条
        }).then(() => {
          if (code === 0) location.reload();
          if (code === 911)
            location.href = `${API_BASE_URL}/115Cloud/getCaptchaHtml`;
        });
      });
  }

  initialize();
})();

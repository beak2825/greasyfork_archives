// ==UserScript==
// @name         一键解析
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  一键解析视频地址并自动播放,支持多接口切换
// @author       Ethan
// @license      MIT
// @match        *://*.youku.com/*
// @match        *://*.iqiyi.com/*
// @match        *://*.le.com/*
// @match        *://*.v.qq.com/*
// @match        *://*.mgtv.com/*
// @match        *://*.bilibili.com/*
// @match        https://jx.xmflv.com/*
// @match        https://www.yemu.xyz/*
// @match        https://jx.mmkv.cn/*
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/501649/%E4%B8%80%E9%94%AE%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/501649/%E4%B8%80%E9%94%AE%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const parseInterfaces = [
    { name: "接口1xm", url: "https://jx.xmflv.com/?url=" },
    { name: "接口2yemu", url: "https://www.yemu.xyz/v/d.php?url=" },
    { name: "接口3mm", url: "https://jx.mmkv.cn/tv.php?url=" },
  ];

  let currentInterfaceIndex = GM_getValue("currentInterfaceIndex", 0);

  function addParseButton() {
    GM_addStyle(`
      #parseButton, #switchButton {
              position: fixed;
              z-index: 9999;
              color: white;
              border: 2px solid #3498db;
              border-radius: 25px;
              cursor: pointer;
              background-color: rgba(52, 152, 219, 0.2);
              transition: all 0.3s ease;
          }
          #parseButton {
              top: 10px;
              right: 10px;
              padding: 12px 24px;
              font-size: 16px;
          }
          #switchButton {
              top: 60px;
              right: 10px;
              padding: 8px 16px;
              font-size: 14px;
              text-align: center;
              line-height: 1.2;
          }
          #switchButton span {
              display: block;
          }
          #parseButton:hover, #switchButton:hover {
              background-color: rgba(52, 152, 219, 0.4);
              transform: translateY(-2px);
          }
      `);

    const parseButton = document.createElement("button");
    parseButton.id = "parseButton";
    parseButton.textContent = "一键解析";
    document.body.appendChild(parseButton);

    const switchButton = document.createElement("button");
    switchButton.id = "switchButton";
    switchButton.innerHTML = `切换接口<br><span>(${parseInterfaces[currentInterfaceIndex].name})</span>`;
    document.body.appendChild(switchButton);

    parseButton.addEventListener("click", function () {
      const currentUrl = window.location.href;
      const parseUrl =
        parseInterfaces[currentInterfaceIndex].url +
        encodeURIComponent(currentUrl);
      GM_openInTab(parseUrl, { active: true, insert: true, setParent: true });
    });

    switchButton.addEventListener("click", function () {
      currentInterfaceIndex =
        (currentInterfaceIndex + 1) % parseInterfaces.length;
      GM_setValue("currentInterfaceIndex", currentInterfaceIndex);
      switchButton.innerHTML = `切换接口<br><span>(${parseInterfaces[currentInterfaceIndex].name})</span>`;
    });
  }

  function handleParsePage() {
    let attempts = 0;
    const maxAttempts = 10;

    function attemptPlay() {
      attempts++;
      console.log(`尝试播放，第 ${attempts} 次`);

      const playButtons = document.querySelectorAll(
        "button, .button, .play-button, .xgplayer-play"
      );
      playButtons.forEach((button, index) => {
        if (button.offsetParent !== null) {
          button.click();
          console.log(`点击了第 ${index + 1} 个可能的播放按钮`);
        }
      });

      const isPlaying = Array.from(document.querySelectorAll("video")).some(
        (video) => !video.paused
      );
      if (isPlaying) {
        console.log("视频已开始播放，停止尝试");
        return;
      }

      if (attempts < maxAttempts) {
        setTimeout(attemptPlay, 1000);
      } else {
        console.log("达到最大尝试次数，停止尝试");
      }
    }

    window.addEventListener("load", function () {
      console.log("页面加载完成，2秒后开始尝试播放");
      setTimeout(attemptPlay, 2000);
    });
  }

  if (
    window.location.href.startsWith("https://jx.xmflv.com/") ||
    window.location.href.startsWith("https://jx.mmkv.cn/") ||
    window.location.href.startsWith("https://www.yemu.xyz/")
  ) {
    handleParsePage();
  } else {
    addParseButton();
  }
})();

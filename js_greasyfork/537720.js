// ==UserScript==
// @name         B站/Youtube 倍速快捷键（Z/X/C）+ 宽屏提示（中下方居中）
// @version      1.1
// @description  分段倍速调节，提示显示在播放器底部中间，支持B站宽屏切换，YouTube字幕键屏蔽等功能。
// @author       重音（support by GPT）
// @match        https://www.bilibili.com/*
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL
// @namespace https://greasyfork.org/users/1476609
// @downloadURL https://update.greasyfork.org/scripts/537720/B%E7%AB%99Youtube%20%E5%80%8D%E9%80%9F%E5%BF%AB%E6%8D%B7%E9%94%AE%EF%BC%88ZXC%EF%BC%89%2B%20%E5%AE%BD%E5%B1%8F%E6%8F%90%E7%A4%BA%EF%BC%88%E4%B8%AD%E4%B8%8B%E6%96%B9%E5%B1%85%E4%B8%AD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/537720/B%E7%AB%99Youtube%20%E5%80%8D%E9%80%9F%E5%BF%AB%E6%8D%B7%E9%94%AE%EF%BC%88ZXC%EF%BC%89%2B%20%E5%AE%BD%E5%B1%8F%E6%8F%90%E7%A4%BA%EF%BC%88%E4%B8%AD%E4%B8%8B%E6%96%B9%E5%B1%85%E4%B8%AD%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let isActive = 1;
  let video = null;
  let currentRate = GM_getValue("a", 10);
  let lastRate = GM_getValue("b", 10);

  function updateVideoElement() {
    video = document.querySelector("video") || document.querySelector("bwp-video");
  }

  function setupFocusHandlers() {
    const inputs = [
      document.querySelector(".reply-box-textarea"),
      document.querySelector(".bpx-player-dm-input"),
      document.querySelector(".nav-search-input")
    ];
    inputs.forEach(input => {
      if (input) {
        input.addEventListener("focus", () => isActive = 0);
        input.addEventListener("blur", () => isActive = 1);
      }
    });
  }

  window.addEventListener("load", () => {
    updateVideoElement();
    setupFocusHandlers();
  });

  new MutationObserver(() => {
    updateVideoElement();
    setupFocusHandlers();
  }).observe(document.body, { childList: true, subtree: true });

  setInterval(() => {
    if (video) {
      video.playbackRate = currentRate / 10;
    }
  }, 600);

  // ✅ 创建气泡提示容器（底部中间靠上）
  const tip = document.createElement("div");
  tip.style.cssText = `
    position: absolute;
    left: 50%;
    bottom: 45px;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.75);
    color: #fff;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 99999;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  `;

  function attachTipToPlayer() {
    const player = document.querySelector(".bpx-player-container") || document.querySelector(".html5-video-player") || document.querySelector("video")?.parentElement;
    if (player && player.appendChild && !tip.parentElement) {
      if (getComputedStyle(player).position === "static") {
        player.style.position = "relative";
      }
      player.appendChild(tip);
    }
  }
  attachTipToPlayer();
  setInterval(attachTipToPlayer, 1000);

  let tipTimer = null;
  function showTip(text) {
    tip.textContent = text;
    tip.style.opacity = "1";
    clearTimeout(tipTimer);
    tipTimer = setTimeout(() => {
      tip.style.opacity = "0";
    }, 1200);
  }

  function getStep(rate10) {
    const real = rate10 / 10;
    if (real < 2) return 2;
    if (real < 4) return 5;
    return 10;
  }

  document.addEventListener("keydown", function (e) {
    if (!isActive) return;
    const key = e.code;
    const isBili = location.hostname.includes("bilibili.com");
    const isYouTube = location.hostname.includes("youtube.com");

    // 屏蔽 YouTube 原生 C 字幕快捷键
    if (isYouTube && key === "KeyC") {
      e.stopImmediatePropagation();
      e.preventDefault();
    }

    if (!video) return;

    currentRate = Math.round(10 * video.playbackRate);
    const step = getStep(currentRate);
    let changed = false;

    if (key === "KeyX") {
      e.preventDefault();
      currentRate -= step;
      changed = true;
    } else if (key === "KeyC") {
      e.preventDefault();
      currentRate += step;
      changed = true;
    } else if (key === "KeyZ") {
      e.preventDefault();
      currentRate = video.playbackRate === 1.0 ? lastRate : 10;
      changed = true;
    } else if (key === "KeyT") {
      if (isBili) {
        e.preventDefault(); // 仅 B 站拦截
        const wideBtn = document.querySelector(".bpx-player-ctrl-wide");
        if (wideBtn) {
          wideBtn.click();
        }
      }
    }

    currentRate = Math.max(2, Math.min(currentRate, 80));

    if (changed) {
      GM_setValue("a", currentRate);
      if (key !== "KeyZ") {
        lastRate = currentRate;
        GM_setValue("b", lastRate);
      }
      video.playbackRate = currentRate / 10;
      showTip(`播放速度：${(currentRate / 10).toFixed(1)}x`);
    }
  }, true);

  setInterval(() => {
    const rateDisplay = document.querySelector(".bpx-player-ctrl-playbackrate-result");
    if (rateDisplay) {
      const val = parseFloat(rateDisplay.textContent.replace("x", ""));
      if (!isNaN(val)) {
        currentRate = Math.round(val * 10);
        GM_setValue("a", currentRate);
      }
    }
  }, 2000);
})();

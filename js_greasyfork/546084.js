// ==UserScript==
// @name        facebook.com 停用重播 解除靜音 可點擊進度條 按 H 顯示/隱藏面板
// @namespace   fb Scripts
// @match       *://www.facebook.com/*
// @grant       none
// @icon        https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @version     1.1
// @author      huang-wei-lun
// @license     MIT
// @description 停用重播 解除靜音 可點擊進度條 按 H 顯示/隱藏面板
// @downloadURL https://update.greasyfork.org/scripts/546084/facebookcom%20%E5%81%9C%E7%94%A8%E9%87%8D%E6%92%AD%20%E8%A7%A3%E9%99%A4%E9%9D%9C%E9%9F%B3%20%E5%8F%AF%E9%BB%9E%E6%93%8A%E9%80%B2%E5%BA%A6%E6%A2%9D%20%E6%8C%89%20H%20%E9%A1%AF%E7%A4%BA%E9%9A%B1%E8%97%8F%E9%9D%A2%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/546084/facebookcom%20%E5%81%9C%E7%94%A8%E9%87%8D%E6%92%AD%20%E8%A7%A3%E9%99%A4%E9%9D%9C%E9%9F%B3%20%E5%8F%AF%E9%BB%9E%E6%93%8A%E9%80%B2%E5%BA%A6%E6%A2%9D%20%E6%8C%89%20H%20%E9%A1%AF%E7%A4%BA%E9%9A%B1%E8%97%8F%E9%9D%A2%E6%9D%BF.meta.js
// ==/UserScript==
(function () {
  // 狀態
  let disableLoop = JSON.parse(localStorage.getItem("fb_disableLoop") || "true");
  let unmuteVideo = JSON.parse(localStorage.getItem("fb_unmuteVideo") || "true");
  let clickableBar = JSON.parse(localStorage.getItem("fb_clickableBar") || "true");

  // 建立控制面板
  const panel = document.createElement("div");
  Object.assign(panel.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 999999,
    background: "rgba(32,32,32,0.92)",
    color: "#e4e4e4",
    padding: "10px",
    borderRadius: "10px",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    fontSize: "14px",
    border: "1px solid #3c3c3c",
    boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
    transition: "opacity .25s"
  });
  panel.innerHTML = `
    <label style="display:block;margin-bottom:6px;">
      <input type="checkbox" id="fb_disableLoop"> 停用重播
    </label>
    <label style="display:block;margin-bottom:6px;">
      <input type="checkbox" id="fb_unmuteVideo"> 解除靜音
    </label>
    <label style="display:block;margin-bottom:6px;">
      <input type="checkbox" id="fb_clickableBar"> 可點擊進度條
    </label>
    <hr style="border:0;border-top:1px solid #3c3c3c;margin:8px 0;">
    <small style="color:#a8a8a8;">按 H 顯示/隱藏面板</small>
  `;
  document.body.appendChild(panel);

  panel.querySelector("#fb_disableLoop").checked = disableLoop;
  panel.querySelector("#fb_unmuteVideo").checked = unmuteVideo;
  panel.querySelector("#fb_clickableBar").checked = clickableBar;

  panel.querySelector("#fb_disableLoop").addEventListener("change", (e) => {
    disableLoop = e.target.checked;
    localStorage.setItem("fb_disableLoop", JSON.stringify(disableLoop));
    applyToAllVideos();
  });
  panel.querySelector("#fb_unmuteVideo").addEventListener("change", (e) => {
    unmuteVideo = e.target.checked;
    localStorage.setItem("fb_unmuteVideo", JSON.stringify(unmuteVideo));
    applyToAllVideos();
  });
  panel.querySelector("#fb_clickableBar").addEventListener("change", (e) => {
    clickableBar = e.target.checked;
    localStorage.setItem("fb_clickableBar", JSON.stringify(clickableBar));
    applyToAllVideos();
  });

  // 面板快捷鍵
  let visible = true;
  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "h") {
      visible = !visible;
      panel.style.opacity = visible ? "1" : "0";
      panel.style.pointerEvents = visible ? "auto" : "none";
    }
  });

  // 進度條樣式（覆蓋在影片上）
  function ensureClickableBar(video) {
    if (!clickableBar || video.__fbHasBar) return;
    const container = video.parentElement;
    if (!container) return;

    const bar = document.createElement("div");
    Object.assign(bar.style, {
      position: "absolute",
      left: "0",
      right: "0",
      bottom: "6px",
      height: "6px",
      background: "rgba(255,255,255,0.28)",
      cursor: "pointer",
      zIndex: 99998,
      borderRadius: "999px",
      overflow: "hidden",
      backdropFilter: "blur(1px)"
    });

    const prog = document.createElement("div");
    Object.assign(prog.style, {
      height: "100%",
      width: "0%",
      background: "rgba(255,255,255,0.9)"
    });
    bar.appendChild(prog);

    // 點擊跳轉
    bar.addEventListener("click", (e) => {
      const rect = bar.getBoundingClientRect();
      const percent = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      if (isFinite(video.duration) && video.duration > 0) {
        video.currentTime = video.duration * percent;
      }
    });

    // 跟隨時間更新
    const onTime = () => {
      if (!isFinite(video.duration) || video.duration <= 0) return;
      const p = (video.currentTime / video.duration) * 100;
      prog.style.width = p + "%";
    };
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("progress", onTime);
    video.addEventListener("loadedmetadata", onTime);
    onTime();

    // 確保父容器能定位
    const prevPos = container.style.position;
    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }
    container.appendChild(bar);

    // 標記並保存清理器
    video.__fbHasBar = true;
    video.__fbBar = bar;
    video.__fbBarCleanup = () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("progress", onTime);
      video.removeEventListener("loadedmetadata", onTime);
      if (bar.isConnected) bar.remove();
      if (prevPos) container.style.position = prevPos;
      video.__fbHasBar = false;
      video.__fbBar = null;
      video.__fbBarCleanup = null;
    };
  }

  function removeClickableBar(video) {
    if (video.__fbBarCleanup) video.__fbBarCleanup();
  }

  // 對單一 video 套用規則
  function applyRules(video) {
    try {
      if (disableLoop) video.loop = false;
      if (unmuteVideo) {
        video.muted = false;
        video.defaultMuted = false;
        // 強化一次，避免 FB 程式碼又設回去
        video.volume = 1.0;
        // 嘗試開啟音軌（有些瀏覽器需互動才允許播放聲音）
        const resume = () => {
          video.muted = false;
          video.defaultMuted = false;
          video.volume = 1.0;
        };
        video.addEventListener("play", resume, { once: true });
      }
      if (clickableBar) {
        ensureClickableBar(video);
      } else {
        removeClickableBar(video);
      }
    } catch (_) {}
  }

  // 初次套用
  function applyToAllVideos() {
    document.querySelectorAll("video").forEach((v) => applyRules(v));
  }
  applyToAllVideos();

  // 監聽動態載入（Facebook 是 SPA）
  const obs = new MutationObserver((muts) => {
    for (const mut of muts) {
      mut.addedNodes.forEach((node) => {
        if (node instanceof HTMLVideoElement) {
          applyRules(node);
        } else if (node.querySelectorAll) {
          node.querySelectorAll("video").forEach((v) => applyRules(v));
        }
      });
      // 若節點被移除，清理進度條
      mut.removedNodes.forEach((node) => {
        if (node instanceof HTMLVideoElement) {
          removeClickableBar(node);
        } else if (node.querySelectorAll) {
          node.querySelectorAll("video").forEach(removeClickableBar);
        }
      });
    }
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });

  // 小提示：滾動時有新影片載入也會自動套用
  console.log("[FB Video Helper] 已啟用：停用重播 =", disableLoop, "解除靜音 =", unmuteVideo, "可點擊進度條 =", clickableBar);
})();
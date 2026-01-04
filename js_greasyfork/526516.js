// ==UserScript==
// @name         YouTube Arrow Buttons
// @namespace    http://tampermonkey.net/
// @version      0.25(強制ミニプレーヤーバグはずっとある/どうにもならないからこのまま使用)
// @description  ipad,iphone補助用 YouTubeに 0 / 再生・停止 / 10秒戻る / 10秒進む のボタンを右下サイドバー式で表示
// @author       kmikrt
// @license      MIT
// @match        *://*.youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/526516/YouTube%20Arrow%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/526516/YouTube%20Arrow%20Buttons.meta.js
// ==/UserScript==

(function() {
  "use strict";

  if (window.top !== window.self) return;

  function simulateKeyEvent(keyCode) {
    const eDown = new KeyboardEvent("keydown", { keyCode, bubbles: true });
    const eUp   = new KeyboardEvent("keyup",   { keyCode, bubbles: true });
    document.dispatchEvent(eDown);
    document.dispatchEvent(eUp);
  }

  let sidebar = null;
  let hitbox  = null;
  let expanded = true;
  let arrowEl, titleEl;

  let lastPath = location.href;

  function shouldShow() {
    const path = location.pathname;
    if (path === "/") return false;
    if (path === "/results") return false;
    return true;
  }

  function removeSidebar() {
    if (sidebar) sidebar.remove();
    if (hitbox) hitbox.remove();
    sidebar = null;
    hitbox  = null;
  }

  // auto-speed 関連
  let autoTimers = [];
  let userChangedSpeed = false;
  let pendingAutoRate = null;

  function cancelAutoSpeed() {
    autoTimers.forEach(id => clearTimeout(id));
    autoTimers = [];
    pendingAutoRate = null;
  }

  function setPlaybackRate(rate) {
    const v = document.querySelector("video");
    if (v) {
      try { v.playbackRate = rate; } catch (e) {}
    }
  }

  function scheduleAutoSpeed() {
    cancelAutoSpeed();
    userChangedSpeed = false;

    const stored = localStorage.getItem("ytArrowLastSpeed");
    if (!stored) return;
    const rate = parseFloat(stored);
    if (!rate || isNaN(rate)) return;

    pendingAutoRate = rate;
    const delays = [500, 1000, 3000, 5000];
    delays.forEach((d) => {
      const id = setTimeout(() => {
        if (userChangedSpeed) {
          cancelAutoSpeed();
          return;
        }
        setPlaybackRate(rate);
      }, d);
      autoTimers.push(id);
    });
  }

  function createSidebar() {
    if (sidebar) return;

    hitbox = document.createElement("div");
    hitbox.id = "yt-arrow-hitbox";
    Object.assign(hitbox.style, {
      position: "fixed",
      bottom: "20px",
      right: "10px",
      padding: "20px",
      zIndex: 99998,
      background: "rgba(0,0,0,0)",
      touchAction: "none",
      userSelect: "none",
      WebkitUserSelect: "none"
    });

    hitbox.addEventListener("touchstart", e => e.preventDefault(), { passive: false });
    hitbox.addEventListener("touchmove",  e => e.preventDefault(), { passive: false });
    document.body.appendChild(hitbox);

    sidebar = document.createElement("div");
    sidebar.id = "yt-arrow-sidebar";

    Object.assign(sidebar.style, {
      position: "fixed",
      bottom: "30px",
      right: "20px",
      width: "150px",
      zIndex: 99999,
      background: "rgba(255,255,255,0.95)",
      border: "1px solid rgba(0,0,0,0.15)",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      padding: "10px",
      fontSize: "14px",
      fontFamily: "sans-serif",
      color: "#000",
      backdropFilter: "blur(4px)",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      cursor: "grab",
      userSelect: "none",
      WebkitUserSelect: "none"
    });

    const saved = localStorage.getItem("ytArrowSidebarPos");
    if (saved) {
      try {
        const pos = JSON.parse(saved);
        sidebar.style.left = pos.left + "px";
        sidebar.style.top  = pos.top + "px";
        sidebar.style.right = "";
        sidebar.style.bottom = "";

        hitbox.style.left = (pos.left - 20) + "px";
        hitbox.style.top  = (pos.top - 20) + "px";
        hitbox.style.right = "";
        hitbox.style.bottom = "";
      } catch (e) {}
    }

    const titleWrap = document.createElement("div");
    Object.assign(titleWrap.style, {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      fontWeight: "600",
      userSelect: "none",
      WebkitUserSelect: "none",
      marginBottom: "5px"
    });

    titleEl = document.createElement("span");
    titleEl.textContent = "再生操作";

    arrowEl = document.createElement("span");
    arrowEl.textContent = expanded ? "▲" : "▼";

    titleWrap.appendChild(titleEl);
    titleWrap.appendChild(arrowEl);
    sidebar.appendChild(titleWrap);

    const btnBox = document.createElement("div");
    btnBox.id = "yt-arrow-button-box";

    Object.assign(btnBox.style, {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      userSelect: "none",
      WebkitUserSelect: "none"
    });

    addButton(btnBox, "0（最初へ）", () => simulateKeyEvent(48));
    addButton(btnBox, "▶ / II", () => simulateKeyEvent(32));
    addButton(btnBox, "← 10秒戻る", () => simulateKeyEvent(74));
    addButton(btnBox, "→ 10秒進む", () => simulateKeyEvent(76));

    const speedRow = document.createElement("div");
    Object.assign(speedRow.style, {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      gap: "4px",
      userSelect: "none",
      WebkitUserSelect: "none",
      marginTop: "5px"
    });

    function addSpeedButton(label, rate) {
      const btn = document.createElement("button");
      btn.textContent = label;

      Object.assign(btn.style, {
        flex: "1",
        padding: "6px 4px",
        fontSize: "12px",
        borderRadius: "6px",
        cursor: "pointer",
        border: "1px solid #bbb",
        background: "#e8e8e8",
        userSelect: "none",
        WebkitUserSelect: "none"
      });

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const v = document.querySelector("video");
        if (v) v.playbackRate = rate;
        try { localStorage.setItem("ytArrowLastSpeed", rate.toString()); } catch (err) {}
        userChangedSpeed = true;
        cancelAutoSpeed();
      });

      speedRow.appendChild(btn);
    }

    addSpeedButton("1.00x", 1.0);
    addSpeedButton("1.75x", 1.75);
    addSpeedButton("2.00x", 2.0);

    btnBox.appendChild(speedRow);
    sidebar.appendChild(btnBox);

    sidebar.addEventListener("click", (e) => {
      if (e.target.tagName.toLowerCase() === "button") return;
      toggleSidebar(btnBox);
    });

    enableDrag(sidebar, hitbox);
    document.body.appendChild(sidebar);
  }

  function addButton(parent, label, handler) {
    const btn = document.createElement("button");
    btn.textContent = label;

    Object.assign(btn.style, {
      width: "100%",
      padding: "6px",
      fontSize: "13px",
      borderRadius: "6px",
      cursor: "pointer",
      border: "1px solid #bbb",
      background: "#f0f0f0",
      userSelect: "none",
      WebkitUserSelect: "none"
    });

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      handler();
    });

    parent.appendChild(btn);
  }

  function toggleSidebar(btnBox) {
    expanded = !expanded;
    arrowEl.textContent = expanded ? "▲" : "▼";

    if (expanded) {
      btnBox.style.display = "flex";
      sidebar.style.height = "";
      sidebar.style.padding = "10px";
      snapIntoView(sidebar, hitbox);
    } else {
      btnBox.style.display = "none";
      sidebar.style.height = "32px";
      sidebar.style.padding = "6px 10px";
    }
  }

  function snapIntoView(elm, hit) {
    const rect = elm.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = rect.left;
    let top  = rect.top;

    if (rect.right > vw) left = vw - rect.width - 10;
    if (rect.bottom > vh) top = vh - rect.height - 10;
    if (rect.left < 0) left = 10;
    if (rect.top < 0) top = 10;

    elm.style.left = left + "px";
    elm.style.top  = top  + "px";
    elm.style.right = "";
    elm.style.bottom = "";

    hit.style.left = (left - 20) + "px";
    hit.style.top  = (top  - 20) + "px";
    hit.style.right = "";
    hit.style.bottom = "";
  }

  function enableDrag(elm, hit) {
    let isDown = false, offsetX = 0, offsetY = 0;

    elm.addEventListener("touchstart", start, { passive: false });
    elm.addEventListener("mousedown", start);

    function start(e) {
      if (e.target.tagName.toLowerCase() === "button") return;

      isDown = true;
      elm.style.cursor = "grabbing";

      const rect = elm.getBoundingClientRect();
      const ev = e.touches ? e.touches[0] : e;

      offsetX = ev.clientX - rect.left;
      offsetY = ev.clientY - rect.top;

      document.addEventListener("touchmove", move, { passive: false });
      document.addEventListener("mousemove", move);
      document.addEventListener("touchend", end);
      document.addEventListener("mouseup", end);
    }

    function move(e) {
      if (!isDown) return;
      e.preventDefault();

      const ev = e.touches ? e.touches[0] : e;

      let left = ev.clientX - offsetX;
      let top  = ev.clientY - offsetY;

      const w = elm.offsetWidth;
      const h = elm.offsetHeight;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      left = Math.max(0, Math.min(vw - w, left));
      top  = Math.max(0, Math.min(vh - h, top));

      elm.style.left = left + "px";
      elm.style.top  = top  + "px";

      hit.style.left = (left - 20) + "px";
      hit.style.top  = (top  - 20) + "px";
    }

    function end() {
      if (!isDown) return;
      isDown = false;
      elm.style.cursor = "grab";

      snapIntoView(elm, hit);
      savePos();

      document.removeEventListener("touchmove", move);
      document.removeEventListener("mousemove", move);
      document.removeEventListener("touchend", end);
      document.removeEventListener("mouseup", end);
    }

    function savePos() {
      const rect = elm.getBoundingClientRect();
      localStorage.setItem("ytArrowSidebarPos",
        JSON.stringify({ left: rect.left, top: rect.top })
      );
    }
  }

  function update() {
    if (location.href !== lastPath) {
      lastPath = location.href;
 
      if (!sidebar) {
        createSidebar();
      }
 
      if (shouldShow()) {
        scheduleAutoSpeed();
      } else {
        cancelAutoSpeed();
      }
    }
  }

  const observer = new MutationObserver(update);
  observer.observe(document.body, { childList: true, subtree: true });

  setInterval(update, 1000);
  setTimeout(update, 800);

  createSidebar();
  if (shouldShow()) scheduleAutoSpeed();

  // ****************************************************************
  // ★★ ミニプレーヤー用：video.src の変化を検知して倍速自動適用 ★★
  // ****************************************************************

  let lastVideoSrc = "";
  let watchedVideos = new WeakSet();
  let videoObserver = null;

  // --- 修正：ミニプレーヤーが存在するときのみ動作 ---
  function miniPlayerExists() {
    return document.querySelector("ytd-miniplayer") !== null;
  }

  function onVideoChanged(v) {
    try {
      // ミニプレーヤーが存在しなければ絶対に何もしない
      if (!miniPlayerExists()) return;

      const src = v.currentSrc || v.src || "";
      if (!src) return;
      if (src === lastVideoSrc) return;
      lastVideoSrc = src;

      if (shouldShow()) scheduleAutoSpeed();
    } catch (e) {}
  }

  function attachListenersToVideo(v) {
    if (!v || watchedVideos.has(v)) return;
    watchedVideos.add(v);

    const handler = () => onVideoChanged(v);

    v.addEventListener("loadeddata", handler);
    v.addEventListener("loadedmetadata", handler);
    v.addEventListener("play", handler);

    const attrObs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === "src") {
          handler();
        }
      }
    });
    attrObs.observe(v, { attributes: true });

    setTimeout(handler, 500);
    setTimeout(handler, 1500);
  }

  function scanAndAttachVideos() {
    const videos = document.querySelectorAll("video");
    if (!videos) return;
    videos.forEach(v => attachListenersToVideo(v));
  }

  scanAndAttachVideos();

  if (!videoObserver) {
    videoObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList") {
          m.addedNodes.forEach(node => {
            if (node && node.nodeType === 1) {
              if (node.tagName && node.tagName.toLowerCase() === "video") {
                attachListenersToVideo(node);
              } else {
                const vids = node.querySelectorAll && node.querySelectorAll("video");
                if (vids && vids.length) vids.forEach(v => attachListenersToVideo(v));
              }
            }
          });
        }
      }
    });
    videoObserver.observe(document.body, { childList: true, subtree: true });
  }

})();
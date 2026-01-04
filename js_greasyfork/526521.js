// ==UserScript==
// @name         Twitch Arrow Buttons
// @namespace    http://tampermonkey.net/
// @version      0.5(新方式)
// @description  Twitchに10秒スキップ矢印ボタンを追加。
// @author       kmikrt
// @license      MIT
// @match        *://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526521/Twitch%20Arrow%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/526521/Twitch%20Arrow%20Buttons.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function simulateKeyEvent(keyCode) {
    let eDown = new Event("keydown");
    eDown.keyCode = keyCode;
    document.dispatchEvent(eDown);

    let eUp = new Event("keyup");
    eUp.keyCode = keyCode;
    document.dispatchEvent(eUp);
  }

  /* ▼▼▼ ミュート切替 ▼▼▼ */
  function toggleMute() {
    const v = document.querySelector("video");
    if (v) v.muted = !v.muted;
  }
  /* ▲▲▲ ミュート機能 ▲▲▲ */

  let sidebar = null;
  let hitbox = null;
  let expanded = true;
  let arrowEl, titleEl;
  let lastPath = location.pathname;

  function shouldShow() {
    const url = location.href;
    return (
      url.includes("/videos") ||
      url.includes("/video") ||
      url.includes("/clip")
    );
  }

  function removeSidebar() {
    if (sidebar) sidebar.remove();
    if (hitbox) hitbox.remove();
    sidebar = null;
    hitbox = null;
  }

  function createSidebar() {
    if (sidebar || !shouldShow()) return;

    hitbox = document.createElement("div");
    Object.assign(hitbox.style, {
      position: "fixed",
      bottom: "20px",
      right: "10px",
      padding: "20px",
      zIndex: 99998,
      background: "rgba(0,0,0,0)",
      touchAction: "none",
      userSelect: "none"
    });

    hitbox.addEventListener("touchstart", e => e.preventDefault(), { passive: false });
    hitbox.addEventListener("touchmove", e => e.preventDefault(), { passive: false });

    document.body.appendChild(hitbox);

    sidebar = document.createElement("div");
    Object.assign(sidebar.style, {
      position: "fixed",
      bottom: "30px",
      right: "20px",
      width: "180px",
      zIndex: 99999,
      background: "rgba(255,255,255,0.95)",
      border: "1px solid rgba(0,0,0,0.15)",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      padding: "10px",
      fontSize: "14px",
      fontFamily: "sans-serif",
      color: "#000",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      cursor: "grab",
      userSelect: "none",
      alignItems: "center"
    });

    const saved = localStorage.getItem("twitchArrowSidebarPos");
    if (saved) {
      const pos = JSON.parse(saved);
      sidebar.style.left = pos.left + "px";
      sidebar.style.top = pos.top + "px";
      sidebar.style.right = "";
      sidebar.style.bottom = "";

      hitbox.style.left = pos.left - 20 + "px";
      hitbox.style.top = pos.top - 20 + "px";
      hitbox.style.right = "";
      hitbox.style.bottom = "";
    }

    const titleWrap = document.createElement("div");
    Object.assign(titleWrap.style, {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      fontWeight: "600",
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
    Object.assign(btnBox.style, {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      width: "100%",
      userSelect: "none"
    });

    addButton(btnBox, "ミュート切替", () => toggleMute());
    addButton(btnBox, "▶ / II", () => simulateKeyEvent(75)); // K
    addButton(btnBox, "← 10秒戻る", () => simulateKeyEvent(74)); // J
    addButton(btnBox, "→ 10秒進む", () => simulateKeyEvent(76)); // L

    const speedRow = document.createElement("div");
    Object.assign(speedRow.style, {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      gap: "4px",
      marginTop: "5px",
      width: "100%"
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
        textAlign: "center"
      });

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const v = document.querySelector("video");
        if (v) v.playbackRate = rate;
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
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center"
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
    let top = rect.top;

    if (rect.right > vw) left = vw - rect.width - 10;
    if (rect.bottom > vh) top = vh - rect.height - 10;
    if (rect.left < 0) left = 10;
    if (rect.top < 0) top = 10;

    elm.style.left = left + "px";
    elm.style.top = top + "px";
    elm.style.right = "";
    elm.style.bottom = "";

    hit.style.left = left - 20 + "px";
    hit.style.top = top - 20 + "px";
    hit.style.right = "";
    hit.style.bottom = "";
  }

  function enableDrag(elm, hit) {
    let isDown = false;
    let offsetX = 0, offsetY = 0;

    elm.addEventListener("mousedown", start);
    elm.addEventListener("touchstart", start, { passive: false });

    function start(e) {
      if (e.target.tagName.toLowerCase() === "button") return;

      isDown = true;
      elm.style.cursor = "grabbing";

      const rect = elm.getBoundingClientRect();
      const ev = e.touches ? e.touches[0] : e;

      offsetX = ev.clientX - rect.left;
      offsetY = ev.clientY - rect.top;

      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", end);
      document.addEventListener("touchmove", move, { passive: false });
      document.addEventListener("touchend", end);
    }

    function move(e) {
      if (!isDown) return;
      e.preventDefault();

      const ev = e.touches ? e.touches[0] : e;
      let left = ev.clientX - offsetX;
      let top = ev.clientY - offsetY;

      const w = elm.offsetWidth;
      const h = elm.offsetHeight;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      left = Math.max(0, Math.min(vw - w, left));
      top = Math.max(0, Math.min(vh - h, top));

      elm.style.left = left + "px";
      elm.style.top = top + "px";

      hit.style.left = left - 20 + "px";
      hit.style.top = top - 20 + "px";
    }

    function end() {
      if (!isDown) return;
      isDown = false;
      elm.style.cursor = "grab";

      snapIntoView(elm, hit);

      const rect = elm.getBoundingClientRect();
      localStorage.setItem("twitchArrowSidebarPos",
        JSON.stringify({ left: rect.left, top: rect.top })
      );

      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", end);
      document.removeEventListener("touchmove", move);
      document.removeEventListener("touchend", end);
    }
  }

  function update() {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;

      if (shouldShow()) createSidebar();
      else removeSidebar();
    }
  }

  const observer = new MutationObserver(update);
  observer.observe(document.body, { childList: true, subtree: true });

  setInterval(update, 800);
  setTimeout(update, 600);

  if (shouldShow()) createSidebar();
})();

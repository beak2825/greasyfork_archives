// ==UserScript==
// @name        💗 [Pixiv+] Like Manager++ (Interactive Inspector + Draggable)
// @name:en     💗 [Pixiv+] Like Manager++ (Interactive Inspector + Draggable)
// @name:ja     💗 [Pixiv+] いいね管理マネージャー++（インタラクティブ検査＆ドラッグ対応）
// @name:zh-CN  💗 [Pixiv+] 点赞管理器++（可交互选择器 + 可拖动窗口）
// @name:ko     💗 [Pixiv+] 좋아요 매니저++ (인터랙티브 검사기 + 드래그 지원)
// @name:vi     💗 [Pixiv+] Trình quản lý Like++ (Có Inspect & Kéo thả)
// @description        Enhanced Pixiv like/unlike manager with draggable popup, smart inspector, SVG-safe selector builder, and auto validation.
// @description:en     Enhanced Pixiv like/unlike manager with draggable popup, smart inspector, SVG-safe selector builder, and auto validation.
// @description:ja     ドラッグ可能なポップアップ、スマートインスペクター、SVG対応セレクター構築、自動検証機能を備えたPixiv用いいねマネージャー。
// @description:zh-CN  可拖动弹窗、智能检测器、SVG安全选择器构建器和自动验证功能的Pixiv点赞管理器。
// @description:ko     드래그 가능한 팝업, 스마트 인스펙터, SVG 안전 선택기 빌더, 자동 검증 기능이 포함된 Pixiv 좋아요 관리자.
// @description:vi     Trình quản lý like/unlike Pixiv với popup kéo thả, chế độ chọn thông minh, và kiểm tra selector tự động.
// @namespace   https://pixiv.net/
// @version     2.9.5
// @author      Oppai1442
// @license     MIT
// @icon        https://s.pximg.net/www/js/build/89b113d671067311.svg
// @match       https://www.pixiv.net/*
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/510450/%F0%9F%92%97%20%5BPixiv%2B%5D%20Like%20Manager%2B%2B%20%28Interactive%20Inspector%20%2B%20Draggable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/510450/%F0%9F%92%97%20%5BPixiv%2B%5D%20Like%20Manager%2B%2B%20%28Interactive%20Inspector%20%2B%20Draggable%29.meta.js
// ==/UserScript==


(function () {
  "use strict";
  const LS_SELECTOR_KEY = "__pixiv_like_selector__";
  const LS_POS = "__pixiv_popup_pos__";
  const savedSelector = localStorage.getItem(LS_SELECTOR_KEY);
  const savedPos = JSON.parse(localStorage.getItem(LS_POS) || "{}");
  const log = (...a) => console.log("[Pixiv+]", ...a);

  // ====== Popup chính ======
  const popup = document.createElement("div");
  Object.assign(popup.style, {
    position: "fixed",
    top: savedPos.top || "100px",
    left: savedPos.left || "20px",
    background: "rgba(30,30,30,0.95)",
    border: "1px solid #555",
    borderRadius: "6px",
    padding: "10px",
    zIndex: "99999",
    color: "#fff",
    fontFamily: "sans-serif",
    textAlign: "center",
    width: "220px",
    cursor: "move",
    userSelect: "none",
  });
  popup.innerHTML = `
    <b>Pixiv Like Manager+</b><br>
    <button id="likeAll" style="margin:6px;width:90%;background:#28a745;color:#fff;border:none;padding:6px;border-radius:5px;cursor:pointer;">❤️ Like all</button><br>
    <button id="unlikeAll" style="margin:6px;width:90%;background:#dc3545;color:#fff;border:none;padding:6px;border-radius:5px;cursor:pointer;">💔 Unlike all</button><br>
    <button id="inspect" style="margin:6px;width:90%;background:#007bff;color:#fff;border:none;padding:6px;border-radius:5px;cursor:pointer;">🧭 Inspect ❤️</button><br>
    <button id="reset" style="margin:6px;width:90%;background:#666;color:#fff;border:none;padding:6px;border-radius:5px;cursor:pointer;">♻ Reset</button>
    <div id="msg" style="margin-top:8px;font-size:12px;color:#0f0;word-break:break-all;">⏳ Checking selector...</div>
  `;
  document.body.appendChild(popup);
  const msg = popup.querySelector("#msg");

  function updateMsg() {
    const sel = localStorage.getItem(LS_SELECTOR_KEY);
    if (!sel) {
      msg.innerHTML = "⚠ No selector saved";
      return;
    }
    const found = document.querySelector(sel);
    if (found)
      msg.innerHTML = "✅ Selector valid and ready.";
    else
      msg.innerHTML = "⚠ Saved selector not found, please re-inspect.";
  }

  // đợi Pixiv render xong rồi mới check
  setTimeout(updateMsg, 3000);

  // ====== Drag ======
  let dragging = false;
  let shiftX, shiftY;
  popup.addEventListener("mousedown", (e) => {
    if (e.target.tagName === "BUTTON") return; // tránh drag khi ấn nút
    dragging = true;
    shiftX = e.clientX - popup.offsetLeft;
    shiftY = e.clientY - popup.offsetTop;
    popup.style.opacity = "0.8";
  });
  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    popup.style.left = e.clientX - shiftX + "px";
    popup.style.top = e.clientY - shiftY + "px";
  });
  document.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;
    popup.style.opacity = "1";
    localStorage.setItem(LS_POS, JSON.stringify({
      top: popup.style.top,
      left: popup.style.left,
    }));
  });

  // ====== Highlight / Inspect (phần còn lại giữ nguyên) ======
  const highlight = document.createElement("div");
  Object.assign(highlight.style, {
    position: "absolute",
    border: "2px solid yellow",
    pointerEvents: "none",
    zIndex: "99998",
  });
  document.body.appendChild(highlight);

  let inspectMode = false;
  popup.querySelector("#inspect").onclick = () => {
    inspectMode = true;
    msg.innerHTML = "🟡 Click target ❤️ button...";
    document.body.style.cursor = "crosshair";
  };

  document.addEventListener("mouseover", (e) => {
    if (!inspectMode) return;
    const el = e.target;
    const r = el.getBoundingClientRect();
    Object.assign(highlight.style, {
      top: r.top + window.scrollY + "px",
      left: r.left + window.scrollX + "px",
      width: r.width + "px",
      height: r.height + "px",
      display: "block",
    });
  });

  document.addEventListener("pointerdown", (e) => {
    if (!inspectMode) return;
    e.preventDefault();
    e.stopPropagation();
    inspectMode = false;
    highlight.style.display = "none";
    document.body.style.cursor = "";
    const target = e.target;
    const path = getDomPath(target);
    log("Clicked element path:", path);
    setTimeout(() => showLevelSelector(target), 100);
  }, true);

  function getDomPath(el) {
    const parts = [];
    while (el && el.nodeType === 1 && el !== document.body) {
      let selector = el.nodeName.toLowerCase();
      if (el.id) selector += "#" + el.id;
      else if (el.classList && el.classList.length)
        selector += "." + Array.from(el.classList).slice(0, 2).join(".");
      parts.unshift(selector);
      el = el.parentElement;
    }
    return parts.join(" > ");
  }

  function showLevelSelector(startEl) {
    if (!startEl) return log("❌ No startEl found");
    const levels = [];
    let el = startEl;
    for (let i = 0; i < 8 && el; i++) {
      levels.push(el);
      el = el.parentElement;
    }
    const child = document.createElement("div");
    Object.assign(child.style, {
      position: "fixed",
      top: "340px",
      left: "20px",
      background: "rgba(20,20,20,0.95)",
      border: "1px solid #555",
      borderRadius: "5px",
      padding: "8px",
      color: "#fff",
      fontSize: "12px",
      width: "240px",
      zIndex: "100000",
    });
    child.innerHTML = `<b>Choose target level</b><br>`;
    levels.forEach((node, i) => {
      const cname = (typeof node.className === "string" ? node.className : node.className?.baseVal || "");
      const btn = document.createElement("div");
      btn.textContent = `[${i}] ${node.tagName.toLowerCase()}${cname ? "." + cname.replace(/\s+/g, ".") : ""}`;
      Object.assign(btn.style, {
        padding: "4px",
        margin: "2px 0",
        background: "#222",
        borderRadius: "3px",
        cursor: "pointer",
      });
      btn.onmouseover = () => (node.style.outline = "2px solid yellow");
      btn.onmouseout = () => (node.style.outline = "");
      btn.onclick = () => {
        levels.forEach((n) => (n.style.outline = ""));
        node.style.outline = "2px solid lime";
        const sel = getDomPath(node);
        localStorage.setItem(LS_SELECTOR_KEY, sel);
        msg.innerHTML = `✅ Selector saved:<br>${sel}`;
        child.remove();
        log("Saved selector:", sel);
      };
      child.appendChild(btn);
    });
    document.body.appendChild(child);
  }

  popup.querySelector("#reset").onclick = () => {
    localStorage.removeItem(LS_SELECTOR_KEY);
    msg.innerHTML = "⚠ Selector reset";
  };

  function runAction(mode) {
    const sel = localStorage.getItem(LS_SELECTOR_KEY);
    if (!sel) return (msg.innerHTML = "⚠ No selector saved.");
    const buttons = document.querySelectorAll(sel);
    if (!buttons.length) return (msg.innerHTML = "⚠ No elements matched.");
    let count = 0;
    buttons.forEach((btn, i) => {
      const svg = btn.querySelector("svg[class*='sc-976c77a4-1']");
      if (!svg) return;
      const liked = svg.classList.contains("bVNeCg");
      if ((mode === "like" && !liked) || (mode === "unlike" && liked)) {
        setTimeout(() => {
          btn.click();
          count++;
          msg.innerHTML = `${mode === "like" ? "❤️ Liked" : "💔 Unliked"} ${count}/${buttons.length}`;
          log(`${mode === "like" ? "❤️ Liked" : "💔 Unliked"} (${count}/${buttons.length})`);
        }, 120 * i);
      }
    });
  }

  popup.querySelector("#likeAll").onclick = () => runAction("like");
  popup.querySelector("#unlikeAll").onclick = () => runAction("unlike");

  GM_registerMenuCommand("🧪 Test Selector", () => {
    const sel = localStorage.getItem(LS_SELECTOR_KEY);
    if (!sel) return alert("No selector saved.");
    const nodes = document.querySelectorAll(sel);
    alert(`Found ${nodes.length} elements for:\n${sel}`);
  });
})();

// ==UserScript==
// @name        Coomer Card Resize + Labels
// @namespace   Violentmonkey Scripts
// @match       https://coomer.st/*
// @version     1.6
// @author      Nimby345
// @description Resize card list, add margin, overlays for video/text-only posts, and hide text-only toggle
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/528152/Coomer%20Card%20Resize%20%2B%20Labels.user.js
// @updateURL https://update.greasyfork.org/scripts/528152/Coomer%20Card%20Resize%20%2B%20Labels.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ---------- Settings ----------
  const defaultColumns = 5; // initial cards per row
  const cardGapEm = 0.25;   // gap between cards
  let hideEmptyPosts = false;

  // Regex to match allowed URLs (creator pages + /posts)
  const urlPattern =
    /^https:\/\/coomer\.st\/(?:fansly|onlyfans)\/user\/[^/?#]+(?:\?o=\d+)?$|^https:\/\/coomer\.st\/posts(?:[/?#].*)?$/;

  // ---------- Styling ----------
  function injectStyles() {
    if (document.getElementById("ccr-styles")) return;

    const css = `
      .ccr-controls {
        position: fixed;
        z-index: 99999;
        right: 14px;
        bottom: 14px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        background: rgba(20,20,20,.9);
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 12px;
        padding: 10px 12px;
        backdrop-filter: blur(6px);
        font: 13px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        color: #eee;
      }
      .ccr-controls input[type="range"]{ width: 140px; }
      .ccr-controls label { display:flex; align-items:center; gap:6px; cursor:pointer; user-select:none; }
      .ccr-chip { padding: 2px 6px; border-radius: 999px; background: rgba(255,255,255,.15); font-weight: 600; min-width: 2ch; text-align:center; }

      .ccr-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 3px 6px;
        border-radius: 6px;
        background: #000; /* fully opaque */
        color: #fff;
        font-size: 12px;
        font-weight: 600;
        pointer-events: none;
      }
      .ccr-badge-video { background: rgba(25, 118, 210, .8); }
      .ccr-badge-text  { background: rgba(158, 158, 158, .85); }
    `;
    const style = document.createElement("style");
    style.id = "ccr-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ---------- Controls ----------
  function buildControls() {
    if (document.getElementById("ccr-controls")) return;

    const controls = document.createElement("div");
    controls.id = "ccr-controls";
    controls.className = "ccr-controls";

    controls.innerHTML = `
      <div style="display:flex;align-items:center;gap:6px;">
        <span>Columns</span>
        <input id="ccr-col-slider" type="range" min="2" max="8" step="1" value="${defaultColumns}">
        <span class="ccr-chip" id="ccr-col-readout">${defaultColumns}</span>
      </div>
      <label title="Hide posts that contain no images or videos">
        <input id="ccr-hide-textonly" type="checkbox">
        Hide text-only posts
      </label>
    `;

    document.body.appendChild(controls);

    const slider = controls.querySelector("#ccr-col-slider");
    const readout = controls.querySelector("#ccr-col-readout");
    const toggle = controls.querySelector("#ccr-hide-textonly");

    slider.addEventListener("input", () => {
      const n = parseInt(slider.value, 10);
      readout.textContent = String(n);
      setColumns(n);
    });

    toggle.addEventListener("change", () => {
      hideEmptyPosts = toggle.checked;
      labelAndFilterPosts();
    });
  }

  function setColumns(n) {
    const list = document.querySelector(".card-list__items");
    if (!list) return;

    const listWidth = list.clientWidth || list.getBoundingClientRect().width || 1200;
    const px = Math.max(160, Math.floor(listWidth / n));
    list.style.setProperty("--card-size", px + "px", "important");
    list.style.gap = cardGapEm + "em";
  }

  // ---------- Overlay + Filtering ----------
  function labelAndFilterPosts() {
    const cards = document.querySelectorAll(".card-list__items > *");
    cards.forEach((card) => {
      if (card.dataset.ccrLabeled) return;
      card.dataset.ccrLabeled = "true";

      const hasVideo = !!card.querySelector("video");
      const hasImage = !!card.querySelector("img");

      let labelText = "";
      let kind = "";
      if (hasVideo) {
        labelText = "Post Contains Video";
        kind = "video";
      } else if (!hasImage) {
        labelText = "Text Only Post";
        kind = "text";
      }

      if (labelText) {
        const label = document.createElement("div");
        label.textContent = labelText;
        label.className = "ccr-overlay " + (kind === "video" ? "ccr-badge-video" : "ccr-badge-text");
        card.style.position = "relative";
        card.appendChild(label);
      }

      // mark text-only posts
      if (!hasVideo && !hasImage) {
        card.classList.add("ccr-text-only");
      }
    });

    // Apply toggle
    document.querySelectorAll(".card-list__items > *.ccr-text-only").forEach((c) => {
      c.style.display = hideEmptyPosts ? "none" : "";
    });
  }

  // ---------- Mutation observer ----------
  let observer;
  function observeChanges() {
    if (observer) observer.disconnect();
    observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList" && m.addedNodes.length) {
          setColumns(getCurrentColumns());
          labelAndFilterPosts();
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function getCurrentColumns() {
    const el = document.getElementById("ccr-col-slider");
    return el ? parseInt(el.value, 10) : defaultColumns;
  }

  // ---------- Init ----------
  function shouldRun() {
    return urlPattern.test(location.href);
  }

  function init() {
    if (!shouldRun()) return;
    injectStyles();
    buildControls();
    setColumns(getCurrentColumns());
    labelAndFilterPosts();
    observeChanges();
  }

  window.addEventListener("popstate", init);
  window.addEventListener("load", () => {
    init();
    setInterval(() => {
      if (!shouldRun()) return;
      setColumns(getCurrentColumns());
      labelAndFilterPosts();
    }, 1000);
  });
})();
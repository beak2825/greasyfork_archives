// ==UserScript==
// @name         One-Click Image Downloader
// @namespace    Tunc
// @version      1.0.0
// @description  Add a small badge to download images; also a floating button to download the largest image on the page.
// @author       Me
// @license      MIT
// @match        *://*/*
// @exclude      *://greasyfork.org/*
// @grant        GM_download
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/545856/One-Click%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/545856/One-Click%20Image%20Downloader.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const MIN_W = 200;            // minimum width for images to consider
  const MIN_H = 200;            // minimum height for images to consider
  const BADGE_TEXT = "↓";
  const BADGE_CLASS = "ocid-badge";
  const PANEL_CLASS = "ocid-panel";

  // --- Styles ---
  const css = `
    .${BADGE_CLASS}{
      position:absolute;
      top:6px; right:6px;
      font: 600 12px/1 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      padding:6px 8px; border-radius:10px;
      background: rgba(0,0,0,.75); color:#fff;
      cursor:pointer; z-index: 2147483647;
      user-select:none; text-decoration:none;
      box-shadow: 0 2px 6px rgba(0,0,0,.25);
    }
    .${BADGE_CLASS}:hover{ background: rgba(0,0,0,.9) }

    .${PANEL_CLASS}{
      position: fixed; inset: auto 16px 16px auto;
      display:flex; gap:8px; align-items:center;
      background: rgba(0,0,0,.7); color:#fff;
      border-radius: 12px; padding:10px 12px;
      z-index: 2147483647; backdrop-filter: blur(4px);
      font: 600 13px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    }
    .${PANEL_CLASS} button{
      border:0; border-radius:10px; padding:8px 10px; cursor:pointer;
      background: #fff; color:#111; font-weight:700;
    }
    .ocid-relative{ position: relative !important; }
  `;
  if (typeof GM_addStyle === "function") GM_addStyle(css);
  else {
    const s = document.createElement("style");
    s.textContent = css;
    document.documentElement.appendChild(s);
  }

  // --- Helpers ---
  const toFilename = (url, fallbackBase = "image") => {
    try {
      const u = new URL(url, location.href);
      const base = u.pathname.split("/").pop() || fallbackBase;
      const clean = base.split("?")[0].split("#")[0];
      // Ensure an extension exists
      const hasExt = /\.[a-z0-9]{2,5}$/i.test(clean);
      return hasExt ? clean : `${clean || fallbackBase}.jpg`;
    } catch {
      return `${fallbackBase}.jpg`;
    }
  };

  const canGMDownload = typeof GM_download === "function";

  const download = (url, name) => {
    if (canGMDownload) {
      try {
        GM_download({ url, name, saveAs: true });
        return;
      } catch (e) {
        // fall through to a-tag
      }
    }
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const getImgSrc = (img) => {
    // Prefer currentSrc (resolves srcset); fall back to src; consider common lazy attributes
    return img.currentSrc || img.src || img.getAttribute("data-src") || img.getAttribute("data-lazy-src");
  };

  const qualifies = (img) => {
    // Use rendered size when possible
    const w = Math.max(img.naturalWidth || 0, img.clientWidth || 0);
    const h = Math.max(img.naturalHeight || 0, img.clientHeight || 0);
    return w >= MIN_W && h >= MIN_H;
  };

  const ensureRelative = (el) => {
    // So the badge can be absolutely positioned inside the image box
    const s = getComputedStyle(el);
    if (!["relative", "absolute", "fixed"].includes(s.position)) {
      el.classList.add("ocid-relative");
    }
  };

  // --- Badge injection on images ---
  const addBadge = (img) => {
    if (!qualifies(img) || img.dataset.ocidBadged) return;
    const src = getImgSrc(img);
    if (!src) return;

    const wrapTarget = img.parentElement || img;
    ensureRelative(wrapTarget);

    const badge = document.createElement("div");
    badge.textContent = BADGE_TEXT;
    badge.className = BADGE_CLASS;
    badge.title = "Download image";
    badge.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const url = getImgSrc(img);
      if (!url) return;
      const name = toFilename(url, "image");
      download(url, name);
    });

    // Keep badge within the same stacking context as the image
    wrapTarget.appendChild(badge);
    img.dataset.ocidBadged = "1";
  };

  const scan = () => {
    const imgs = Array.from(document.images || []);
    imgs.forEach(addBadge);
  };

  // --- Floating panel (download the largest image) ---
  const createPanel = () => {
    if (document.querySelector(`.${PANEL_CLASS}`)) return;
    const panel = document.createElement("div");
    panel.className = PANEL_CLASS;

    const btnLargest = document.createElement("button");
    btnLargest.textContent = "Download largest image";
    btnLargest.title = "Find the biggest visible image and download it";

    btnLargest.addEventListener("click", () => {
      const imgs = Array.from(document.images || []).filter(qualifies);
      if (!imgs.length) {
        alert("No large images found on this page.");
        return;
      }
      // Score by area; prefer natural over client to get original size when possible
      const best = imgs.reduce((a, b) => {
        const area = (x) =>
          Math.max(x.naturalWidth || 0, x.clientWidth || 0) *
          Math.max(x.naturalHeight || 0, x.clientHeight || 0);
        return area(b) > area(a) ? b : a;
      }, imgs[0]);

      const url = getImgSrc(best);
      if (!url) {
        alert("Couldn't resolve image URL.");
        return;
      }
      const name = toFilename(url, "largest");
      download(url, name);
    });

    panel.appendChild(btnLargest);
    document.documentElement.appendChild(panel);
  };

  // Initial run and observers
  const onReady = () => {
    createPanel();
    scan();

    // Watch for dynamically loaded images (SPA, infinite scroll)
    const obs = new MutationObserver(() => scan());
    obs.observe(document.documentElement, { childList: true, subtree: true });

    // Re-scan when images load to get proper dimensions
    window.addEventListener("load", scan, { once: true });
    document.addEventListener("load", (e) => {
      const t = e.target;
      if (t && t.tagName === "IMG") addBadge(t);
    }, true);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }
})();
// ==UserScript==
// @name         Easy Image Downloader (hover button)
// @namespace    https://greasyfork.org/en/users/your-name
// @version      1.0.0
// @description  Adds a small download button on images; click to save the original image (uses GM_download when available).
// @author       you
// @license      MIT
// @match        *://*/*
// @exclude      *://greasyfork.org/*
// @run-at       document-idle
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/547385/Easy%20Image%20Downloader%20%28hover%20button%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547385/Easy%20Image%20Downloader%20%28hover%20button%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ========== Config ==========
  const MIN_W = 120;                 // only show button on images >= MIN_W x MIN_H
  const MIN_H = 120;
  const BUTTON_TEXT = "↓";
  const BUTTON_CLASS = "eid-btn";
  const BUTTON_STYLES = `
    .${BUTTON_CLASS} {
      position: absolute;
      right: 6px;
      bottom: 6px;
      z-index: 2147483647;
      padding: 4px 8px;
      font: 600 12px/1 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      background: rgba(0,0,0,.75);
      color: #fff;
      border: 0;
      border-radius: 6px;
      cursor: pointer;
      opacity: 0;
      transition: opacity .15s ease-in-out, transform .15s ease-in-out;
      transform: translateY(2px);
      user-select: none;
    }
    .eid-wrap:hover .${BUTTON_CLASS} { opacity: 1; transform: translateY(0); }
  `;

  // Inject CSS
  const style = document.createElement("style");
  style.textContent = BUTTON_STYLES;
  document.documentElement.appendChild(style);

  // Observe images added later
  const observer = new MutationObserver(() => decorateAll());
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Initial pass
  decorateAll();

  function decorateAll() {
    const imgs = document.querySelectorAll("img:not([data-eid])");
    for (const img of imgs) {
      // Skip tiny/hidden images
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      if (w < MIN_W || h < MIN_H) {
        img.setAttribute("data-eid", "skip");
        continue;
      }

      // Wrap the image in a relatively positioned container (non-destructive)
      const wrap = document.createElement("span");
      wrap.className = "eid-wrap";
      wrap.style.position = "relative";
      wrap.style.display = "inline-block";

      // Some sites have display:block on images; preserve layout width/height
      wrap.style.width = img.width ? img.width + "px" : "";
      wrap.style.height = img.height ? img.height + "px" : "";

      // Insert wrapper and move the image inside
      img.parentNode && img.parentNode.insertBefore(wrap, img);
      wrap.appendChild(img);

      // Create button
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = BUTTON_CLASS;
      btn.textContent = BUTTON_TEXT;
      btn.title = "Download image";
      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const url = resolveImageURL(img);
        const filename = suggestFilename(img, url);
        downloadImage(url, filename);
      });

      wrap.appendChild(btn);
      img.setAttribute("data-eid", "done");
    }
  }

  // Try to get the highest quality URL if the site uses srcset
  function resolveImageURL(img) {
    // Prefer currentSrc when available (handles srcset)
    if (img.currentSrc) return img.currentSrc;
    return img.src || "";
  }

  function suggestFilename(img, url) {
    try {
      const u = new URL(url, location.href);
      const pathName = u.pathname.split("/").pop() || "image";
      const clean = decodeURIComponent(pathName).split("?")[0].split("#")[0];
      const base = clean || (img.alt ? sluggify(img.alt) : "image");
      const ext = guessExtFromURL(url) || "jpg";
      return ensureExt(base, ext);
    } catch {
      const base = (img.alt ? sluggify(img.alt) : "image");
      return ensureExt(base, "jpg");
    }
  }

  function sluggify(s) {
    return s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || "image";
  }

  function guessExtFromURL(url) {
    const m = url.toLowerCase().match(/\.(png|jpe?g|webp|gif|bmp|svg|avif)(?:$|\?|\#)/);
    return m ? m[1].replace("jpeg", "jpg") : null;
  }

  function ensureExt(name, ext) {
    if (!name.toLowerCase().endsWith(`.${ext}`)) return `${name}.${ext}`;
    return name;
  }

  async function downloadImage(url, filename) {
    // Prefer GM_download when available (cross-origin friendly)
    if (typeof GM_download === "function") {
      try {
        GM_download({
          url,
          name: filename,
          headers: { Referer: location.href }, // helps on some hosts
          onerror: () => fallbackDownload(url, filename),
        });
        return;
      } catch {
        // fall through
      }
    }
    // Fallback
    fallbackDownload(url, filename);
  }

  async function fallbackDownload(url, filename) {
    try {
      // If same-origin or CORS allowed
      const res = await fetch(url, { credentials: "omit" });
      const blob = await res.blob();
      const a = document.createElement("a");
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
        a.remove();
      }, 1000);
    } catch (e) {
      // Last resort: open in a new tab (user can save manually)
      window.open(url, "_blank", "noopener,noreferrer");
      console.warn("[Easy Image Downloader] Fallback open:", e);
    }
  }
})();
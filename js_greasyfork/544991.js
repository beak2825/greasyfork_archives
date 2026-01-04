// ==UserScript==
// @name         ChatGPT Persistent Background (Always On)
// @namespace    eli.keep.bg
// @version      2.0.0
// @description  Keep the nice blur background across SPA navigation & new chats by injecting a persistent, Shadow-DOM isolated layer
// @author       eli
// @license      MIT
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @run-at       document-start
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544991/ChatGPT%20Persistent%20Background%20%28Always%20On%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544991/ChatGPT%20Persistent%20Background%20%28Always%20On%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  if (window.__eliPersistentBg) return; // singleton
  window.__eliPersistentBg = true;

  const ID = "eli-persistent-bg";
  const FALLBACK_SRCSET =
    "https://persistent.oaistatic.com/burrito-nux/640.webp 640w, https://persistent.oaistatic.com/burrito-nux/1280.webp 1280w, https://persistent.oaistatic.com/burrito-nux/1920.webp 1920w";
  const FALLBACK_IMG = "https://persistent.oaistatic.com/burrito-nux/1920.webp";

  let root, imgEl, sourceEl;
  let hooked = false;

  // Minimal debounce to survive DOM churn without thrashing
  const debounce = (fn, ms = 100) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  };

  function ensureLayer() {
    if (document.getElementById(ID)) return;

    const host = document.createElement("div");
    host.id = ID;
    Object.assign(host.style, {
      position: "fixed",
      inset: "0",
      zIndex: "0",
      pointerEvents: "none",
      contain: "strict",
    });
    document.documentElement.appendChild(host);

    // Shadow DOM to avoid site CSS conflicts
    const shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host, .wrap { position: fixed; inset: 0; }
        picture, img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
        img.blur { transform: scale(1.02); filter: blur(20px); opacity: .5; }
        .grad { position:absolute; inset:0; pointer-events:none;
          background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, var(--eli-bg-end, #000) 100%);
          mix-blend-mode: normal;
        }
        @media (prefers-color-scheme: light) {.grad{ --eli-bg-end: #fff; }}
        @media (prefers-color-scheme: dark)  {.grad{ --eli-bg-end: #000; }}
      </style>
      <div class="wrap" part="wrap" aria-hidden="true">
        <picture>
          <source type="image/webp" id="eli-bg-srcset">
          <img id="eli-bg-img" class="blur" alt="">
        </picture>
        <div class="grad"></div>
      </div>
    `;

    root = host;
    imgEl = shadow.getElementById("eli-bg-img");
    sourceEl = shadow.getElementById("eli-bg-srcset");

    // Keep the app transparent so our layer shows
    const css = document.createElement("style");
    css.textContent = `
      html, body { background: transparent !important; }
    `;
    document.documentElement.appendChild(css);
  }

  function pickAppBackgroundPicture() {
    // Try common patterns first, then a broader heuristic
    const candidates = [
      // Known nux background
      ...document.querySelectorAll('picture img[src*="burrito-nux"]'),
      ...document.querySelectorAll('picture source[srcset*="burrito-nux"]'),
      // Any oaistatic hero-ish picture
      ...document.querySelectorAll('picture img[src*="oaistatic.com"]'),
      ...document.querySelectorAll('picture source[srcset*="oaistatic.com"]'),
    ];
    const pic = candidates.find(Boolean)?.closest("picture");
    return pic || null;
  }

  function syncFromApp() {
    ensureLayer();

    const appPic = pickAppBackgroundPicture();
    if (appPic) {
      const appImg = appPic.querySelector("img");
      const appSrc = appPic.querySelector('source[type="image/webp"]');

      if (appImg?.src) imgEl.src = appImg.src;
      if (appImg?.getAttribute("srcset")) imgEl.setAttribute("srcset", appImg.getAttribute("srcset"));

      if (appSrc?.getAttribute("srcset")) {
        sourceEl.setAttribute("srcset", appSrc.getAttribute("srcset"));
      } else {
        sourceEl.removeAttribute("srcset");
      }

      imgEl.setAttribute("sizes", "100vw");
      return;
    }

    // Fallback
    sourceEl.setAttribute("srcset", FALLBACK_SRCSET);
    imgEl.src = FALLBACK_IMG;
    imgEl.setAttribute("srcset", FALLBACK_SRCSET);
    imgEl.setAttribute("sizes", "100vw");
  }

  const safeSync = debounce(() => {
    try { syncFromApp(); } catch (e) { /* silent */ }
  }, 120);

  function hookNavOnce() {
    if (hooked) return;
    hooked = true;

    const wrap = (obj, key) => {
      const orig = obj[key];
      if (!orig || orig.__eliWrapped) return;
      const fn = function () {
        const r = orig.apply(this, arguments);
        queueMicrotask(safeSync);
        return r;
      };
      fn.__eliWrapped = true;
      try { obj[key] = fn; } catch {}
    };

    wrap(history, "pushState");
    wrap(history, "replaceState");

    window.addEventListener("popstate", safeSync, true);
    window.addEventListener("load", safeSync, true);
    document.addEventListener("visibilitychange", safeSync, true);

    // Lean observer + debounced handler (no attribute spam watching)
    new MutationObserver(() => safeSync()).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    // Resize can swap backgrounds on some layouts
    window.addEventListener("resize", safeSync, { passive: true });
  }

  // Boot
  ensureLayer();
  hookNavOnce();
  syncFromApp();
  setTimeout(syncFromApp, 250);
})();

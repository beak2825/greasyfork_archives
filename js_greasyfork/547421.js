// ==UserScript==
// @name         Force Mobile View (iOS Safari, XS Max hard mode)
// @description  Spoof mobile signals, enforce viewport, fix media queries, optional m. redirects
// @namespace https://greasyfork.org/users/1508709
// @version      1.0.0
// @author       https://github.com/sitien173
// @match        *://*/*
// @inject-into  page
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/547421/Force%20Mobile%20View%20%28iOS%20Safari%2C%20XS%20Max%20hard%20mode%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547421/Force%20Mobile%20View%20%28iOS%20Safari%2C%20XS%20Max%20hard%20mode%29.meta.js
// ==/UserScript==
/* eslint-disable */
/* global GM_getValue, GM_setValue */

(function () {
  // ---- Config (tweak if you want) -----------------------------------------
  const MOBILE_UA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
  // iPhone XS Max CSS metrics (portrait): 414x896, DPR=3
  const CSS_WIDTH = 414;
  const CSS_HEIGHT = 896;
  const DPR = 3;

  const VIEWPORT_CONTENT =
    "width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1";

  const MOBILE_REDIRECTS = [
    { from: /^www\.youtube\.com$/i, to: "m.youtube.com" },
    { from: /^twitter\.com$/i, to: "mobile.twitter.com" },
    { from: /^www\.facebook\.com$/i, to: "m.facebook.com" },
    { from: /^en\.wikipedia\.org$/i, to: "m.wikipedia.org" },
    { from: /^www\.reddit\.com$/i, to: "m.reddit.com" },
  ];

  const host = location.hostname;
  const perSiteKey = (k) => `forceMobile:${host}:${k}`;
  const isRedirectEnabled = () => GM_getValue(perSiteKey("redirectEnabled"), true);
  const setRedirectEnabled = (v) => GM_setValue(perSiteKey("redirectEnabled"), !!v);

  if (typeof GM_registerMenuCommand === "function") {
    GM_registerMenuCommand(
      `[${isRedirectEnabled() ? "✓" : " "}] Mobile redirect on this site`,
      () => {
        setRedirectEnabled(!isRedirectEnabled());
        location.reload();
      }
    );
  }

  // ---- 0) Optional: auto-redirect common desktop → mobile hosts -----------
  (function maybeRedirect() {
    if (!isRedirectEnabled()) return;
    const rule = MOBILE_REDIRECTS.find((r) => r.from.test(host));
    if (rule && host.toLowerCase() !== rule.to.toLowerCase()) {
      const url = new URL(location.href);
      url.host = rule.to;
      location.replace(url.toString());
    }
  })();

  // ---- Helper to (attempt to) redefine read-only props where possible -----
  function defineRW(obj, prop, getter) {
    try {
      const d = Object.getOwnPropertyDescriptor(obj, prop);
      if (!d || d.configurable) {
        Object.defineProperty(obj, prop, { get: getter, configurable: true });
      }
    } catch (_) { /* ignore */ }
  }

  // ---- 1) Spoof mobile signals that many SPAs inspect ---------------------
  try {
    defineRW(Navigator.prototype, "userAgent", () => MOBILE_UA);
    defineRW(Navigator.prototype, "appVersion", () => MOBILE_UA);
    defineRW(Navigator.prototype, "platform", () => "iPhone");
    defineRW(Navigator.prototype, "vendor", () => "Apple Computer, Inc.");
    defineRW(Navigator.prototype, "maxTouchPoints", () => 5);

    // userAgentData (if present)
    if ("userAgentData" in Navigator.prototype) {
      defineRW(Navigator.prototype, "userAgentData", () => ({
        mobile: true,
        platform: "iOS",
        brands: [{ brand: "Safari", version: "17" }],
        toString() { return "[object NavigatorUAData]"; }
      }));
    }

    // Screen metrics & DPR
    defineRW(Screen.prototype, "width", () => CSS_WIDTH);
    defineRW(Screen.prototype, "height", () => CSS_HEIGHT);
    defineRW(window, "devicePixelRatio", () => DPR);

    // Legacy signals some libs still check
    try { Object.defineProperty(window, "orientation", { value: 0, configurable: true }); } catch (_) {}
    try { window.chrome ??= { runtime: {} }; } catch (_) {}
  } catch (_) { /* ignore */ }

  // ---- 2) Make CSS media queries think we're on touch / non-hover ---------
  try {
    const origMM = window.matchMedia.bind(window);
    window.matchMedia = function (q) {
      const query = String(q).trim().toLowerCase();
      // Force common mobile signals
      if (/\(hover:\s*none\)/.test(query) || /\(any-hover:\s*none\)/.test(query)) {
        return Object.assign(origMM(q), { matches: true });
      }
      if (/\(hover:\s*hover\)/.test(query) || /\(any-hover:\s*hover\)/.test(query)) {
        return Object.assign(origMM(q), { matches: false });
      }
      if (/\(pointer:\s*coarse\)/.test(query) || /\(any-pointer:\s*coarse\)/.test(query)) {
        return Object.assign(origMM(q), { matches: true });
      }
      if (/\(pointer:\s*fine\)/.test(query) || /\(any-pointer:\s*fine\)/.test(query)) {
        return Object.assign(origMM(q), { matches: false });
      }
      return origMM(q);
    };
  } catch (_) { /* ignore */ }

  // ---- 3) Aggressively enforce a mobile viewport --------------------------
  function setViewportMeta(node) {
    if (!node) return;
    node.setAttribute("name", "viewport");
    node.setAttribute("content", VIEWPORT_CONTENT);
  }

  function ensureViewport() {
    let vp = document.querySelector('meta[name="viewport"]');
    if (!vp) {
      vp = document.createElement("meta");
      setViewportMeta(vp);
      (document.head || document.documentElement).prepend(vp);
    } else {
      setViewportMeta(vp);
    }
  }

  // run ASAP…
  ensureViewport();

  // …and keep it enforced even if the site changes it later
  const headObs = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === "childList") {
        m.addedNodes.forEach((n) => {
          if (n.nodeType === 1 && n.matches?.('meta[name="viewport"]')) setViewportMeta(n);
        });
      }
      if (m.type === "attributes" && m.target?.matches?.('meta[name="viewport"]')) {
        setViewportMeta(m.target);
      }
    }
  });

  const startObs = () => {
    const head = document.head || document.documentElement;
    headObs.observe(head, { childList: true, subtree: true, attributes: true, attributeFilter: ["content", "name"] });
  };

  if (document.readyState === "loading") {
    startObs();
    document.addEventListener("DOMContentLoaded", ensureViewport, { once: true });
  } else {
    startObs();
    ensureViewport();
  }

  // ---- 4) Safety net: CSS to prevent desktop widths from leaking in -------
  const style = document.createElement("style");
  style.textContent = `
    html, body { max-width: 100vw !important; overflow-x: hidden !important; }
    /* Prevent frameworks from locking viewport to 980px etc. */
    body { width: auto !important; }
  `;
  (document.head || document.documentElement).appendChild(style);
})();

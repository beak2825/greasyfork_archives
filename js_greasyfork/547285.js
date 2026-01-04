// ==UserScript==
// @name        YouTube No-Shorts
// @name:zh-CN  YouTube 油管去除短视频
// @name:zh-TW  YouTube 油管去除短视频
// @namespace    http://tampermonkey.net/
// @version     2.5
// @description Hide all Shorts/Short Videos on desktop and mobile YouTube, older browsers are not supported. Added toggle function.
// @description:zh-CN 隐藏桌面版和手机版YouTube上的所有 Shorts/短视频，不支持旧浏览器。添加了开关功能。
// @description:zh-TW 隱藏桌面版和手機版YouTube上的所有 Shorts/短視頻，不支持舊瀏覽器。添加了開關功能。
// @author             dogchild
// @match       https://www.youtube.com/*
// @match       https://m.youtube.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/547285/YouTube%20%E6%B2%B9%E7%AE%A1%E5%8E%BB%E9%99%A4%E7%9F%AD%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/547285/YouTube%20%E6%B2%B9%E7%AE%A1%E5%8E%BB%E9%99%A4%E7%9F%AD%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /* -------------------- Config / constants -------------------- */

  const VERSION = "2.5-mobile-support";

  // style element ids
  const CSS_HOME_ID = "__anti_shorts_css_home_v2_4";
  const CSS_SEARCH_ID = "__anti_shorts_css_search_v2_4";

  // CSS used (only injected on supported browsers)
  const CSS_SHORTS = `
    /* 桌面版选择器 */
    ytd-rich-grid-media:has(a[href*="/shorts/"]),
    ytd-video-renderer:has(a[href*="/shorts/"]),
    ytd-grid-video-renderer:has(a[href*="/shorts/"]),
    ytd-rich-item-renderer:has(a[href*="/shorts/"]),
    ytd-compact-video-renderer:has(a[href*="/shorts/"]),
    ytd-playlist-video-renderer:has(a[href*="/shorts/"]),
    ytd-rich-grid-row:has(a[href*="/shorts/"]),

    /* new style grid shelf that contains shorts */
    grid-shelf-view-model:has(ytm-shorts-lockup-view-model),
    grid-shelf-view-model:has(ytm-shorts-lockup-view-model-v2),

    /* older reels / shelves fallback */
    ytd-reel-shelf-renderer,
    ytd-rich-shelf-renderer[is-shorts],
    ytd-shelf-renderer,

    /* 手机版YouTube选择器 */
    ytm-rich-item-renderer:has(a[href*="/shorts/"]),
    ytm-compact-video-renderer:has(a[href*="/shorts/"]),
    ytm-video-renderer:has(a[href*="/shorts/"]),
    ytm-shorts-lockup-view-model,
    ytm-shorts-lockup-view-model-v2,
    ytm-reel-shelf-renderer,
    ytm-shelf-renderer:has([href*="/shorts/"]),
    ytm-rich-shelf-renderer:has([href*="/shorts/"]) {
      display: none !important;
    }
  `;

  // debug flag (can be turned off to avoid console spam)
  const DEBUG = false;
  const dbg = (...args) => { if (DEBUG) console.debug("[Anti-Shorts " + VERSION + "]", ...args); };

  /* -------------------- Feature detection (cached) -------------------- */

  const HAS_SUPPORT = (function detectHas() {
    try {
      return CSS && typeof CSS.supports === "function" && CSS.supports("selector(:has(*))");
    } catch (e) {
      return false;
    }
  })();

  if (!HAS_SUPPORT) {
    console.warn("[Anti-Shorts] CSS :has() not supported — script requires modern browser. (v" + VERSION + ")");
    // still register menu so user can change settings (though no effect)
  }

  /* -------------------- i18n labels (cached) -------------------- */

  const IS_ZH = (navigator.language || "").toLowerCase().startsWith("zh");
  const LABEL = {
    home_on: IS_ZH ? "主页：隐藏 Shorts（已启用）" : "Home: Hide Shorts (ON)",
    home_off: IS_ZH ? "主页：隐藏 Shorts（已禁用）" : "Home: Hide Shorts (OFF)",
    search_on: IS_ZH ? "搜索页：隐藏 Shorts（已启用）" : "Search: Hide Shorts (ON)",
    search_off: IS_ZH ? "搜索页：隐藏 Shorts（已禁用）" : "Search: Hide Shorts (OFF)",
    status: IS_ZH ? "状态: 主页 {H} / 搜索页 {S}" : "Status: Home {H} / Search {S}",
    warn_no_has: IS_ZH ? "[Anti-Shorts] 当前浏览器不支持 CSS :has()，脚本需要现代浏览器。" : "[Anti-Shorts] Browser does not support CSS :has(); script requires modern browser."
  };

  /* -------------------- persistent storage (GM) -------------------- */

  const KEY_HOME = "anti_shorts_home_enabled";
  const KEY_SEARCH = "anti_shorts_search_enabled";

  // read initial (GM_getValue is sync in Tampermonkey/VM)
  let homeEnabled = typeof GM_getValue === "function" ? GM_getValue(KEY_HOME, true) : true;
  let searchEnabled = typeof GM_getValue === "function" ? GM_getValue(KEY_SEARCH, true) : true;

  /* -------------------- page-type detection -------------------- */

  // return one of "home", "search", "settings"
  function computePageType() {
    const p = (location.pathname || "").toLowerCase();
    const q = (location.search || "").toLowerCase();

    // search page heuristics
    if (p.startsWith("/results") || q.includes("search_query=")) return "search";

    // settings/management pages heuristics
    if (p.startsWith("/settings") || p.startsWith("/account") || p.startsWith("/channel_switcher") ||
        p.includes("/preferences") || p.includes("/privacy") || p.includes("/notifications")) {
      return "settings";
    }

    // everything else is considered home (per your requirement)
    return "home";
  }

  let lastPageType = null; // cache last page type to avoid redundant DOM ops

  /* -------------------- style injection helpers -------------------- */

  function injectCssIfAbsent(id, cssText) {
    if (!HAS_SUPPORT) return false;
    if (document.getElementById(id)) return false;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = cssText;
    document.documentElement.appendChild(s);
    dbg("Injected CSS:", id);
    return true;
  }

  function removeCssIfPresent(id) {
    const el = document.getElementById(id);
    if (!el) return false;
    el.remove();
    dbg("Removed CSS:", id);
    return true;
  }

  /* -------------------- efficient update logic -------------------- */

  // Only change DOM when pageType OR flags change.
  // lastApplied records the last combination for short-circuiting.
  let lastApplied = { pageType: null, homeEnabled: null, searchEnabled: null };

  function updateInjectionForRouteImmediate() {
    if (!HAS_SUPPORT) {
      console.warn(LABEL.warn_no_has);
      return;
    }

    const pageType = computePageType();

    // if nothing changed, do nothing
    if (lastApplied.pageType === pageType &&
        lastApplied.homeEnabled === homeEnabled &&
        lastApplied.searchEnabled === searchEnabled) {
      dbg("No change in pageType/flags, skip style ops.");
      lastPageType = pageType;
      return;
    }

    dbg("Applying styles for pageType:", pageType, "homeEnabled:", homeEnabled, "searchEnabled:", searchEnabled);

    // Home logic: apply CSS_HOME_ID only when pageType is "home" and homeEnabled true
    if (pageType === "home" && homeEnabled) {
      injectCssIfAbsent(CSS_HOME_ID, CSS_SHORTS);
    } else {
      removeCssIfPresent(CSS_HOME_ID);
    }

    // Search logic: apply CSS_SEARCH_ID only when pageType is "search" and searchEnabled true
    if (pageType === "search" && searchEnabled) {
      injectCssIfAbsent(CSS_SEARCH_ID, CSS_SHORTS);
    } else {
      removeCssIfPresent(CSS_SEARCH_ID);
    }

    lastApplied.pageType = pageType;
    lastApplied.homeEnabled = homeEnabled;
    lastApplied.searchEnabled = searchEnabled;
    lastPageType = pageType;
  }

  // Called on locationchange events; we delay a tiny amount to allow SPA to settle.
  let pendingRouteTimer = null;
  function scheduleMaybeUpdateRoute(delay = 50) {
    // if same page type already scheduled, keep only one timer
    if (pendingRouteTimer !== null) {
      // keep earliest scheduled; do nothing (we won't stack timers)
      return;
    }
    pendingRouteTimer = setTimeout(() => {
      pendingRouteTimer = null;
      updateInjectionForRouteImmediate();
    }, delay);
  }

  /* -------------------- menu registration (only when needed) -------------------- */

  let menuIds = { home: null, search: null, status: null };
  function safeUnregister(id) {
    try {
      if (typeof GM_unregisterMenuCommand === "function" && id) {
        GM_unregisterMenuCommand(id);
      }
    } catch (e) {
      // ignore - not supported or already removed
    }
  }

  function registerMenu() {
    // Unregister previous (if any)
    safeUnregister(menuIds.home);
    safeUnregister(menuIds.search);
    safeUnregister(menuIds.status);

    const homeLabel = homeEnabled ? LABEL.home_on : LABEL.home_off;
    const searchLabel = searchEnabled ? LABEL.search_on : LABEL.search_off;

    try {
      menuIds.home = (typeof GM_registerMenuCommand === "function")
        ? GM_registerMenuCommand(homeLabel, () => {
            homeEnabled = !homeEnabled;
            try { GM_setValue(KEY_HOME, homeEnabled); } catch (e) {}
            // re-register to update label
            registerMenu();
            // apply changes immediately
            updateInjectionForRouteImmediate();
          })
        : null;

      menuIds.search = (typeof GM_registerMenuCommand === "function")
        ? GM_registerMenuCommand(searchLabel, () => {
            searchEnabled = !searchEnabled;
            try { GM_setValue(KEY_SEARCH, searchEnabled); } catch (e) {}
            registerMenu();
            updateInjectionForRouteImmediate();
          })
        : null;

      const statusText = LABEL.status.replace("{H}", homeEnabled ? (IS_ZH ? "开" : "ON") : (IS_ZH ? "关" : "OFF"))
                                    .replace("{S}", searchEnabled ? (IS_ZH ? "开" : "ON") : (IS_ZH ? "关" : "OFF"));

      menuIds.status = (typeof GM_registerMenuCommand === "function")
        ? GM_registerMenuCommand(statusText, () => { alert(statusText); })
        : null;
    } catch (e) {
      // swallow to avoid breaking page
      dbg("registerMenu error:", e);
    }
  }

  /* -------------------- SPA location hooking (idempotent) -------------------- */

  let locationHooked = false;

  function hookLocationChangeOnce(handler) {
    if (locationHooked) return;
    locationHooked = true;

    // Wrap pushState/replaceState idempotently: avoid double-wrapping
    const wrapOnce = (obj, fnName) => {
      const orig = obj[fnName];
      if (orig.__anti_shorts_wrapped) return;
      const wrapped = function () {
        const res = orig.apply(this, arguments);
        try { window.dispatchEvent(new Event("locationchange")); } catch (e) {}
        return res;
      };
      wrapped.__anti_shorts_wrapped = true;
      obj[fnName] = wrapped;
    };

    wrapOnce(history, "pushState");
    wrapOnce(history, "replaceState");

    window.addEventListener("popstate", () => window.dispatchEvent(new Event("locationchange")));
    // YouTube-specific navigation finish event
    window.addEventListener("yt-navigate-finish", () => window.dispatchEvent(new Event("locationchange")));
    // main handler
    window.addEventListener("locationchange", handler);
  }

  /* -------------------- init -------------------- */

  function init() {
    dbg("init start, HAS_SUPPORT=", HAS_SUPPORT);

    // register menu (even if HAS not supported, menu lets user control prefs)
    registerMenu();

    if (!HAS_SUPPORT) {
      console.warn(LABEL.warn_no_has);
      return;
    }

    // initial apply (no delay)
    updateInjectionForRouteImmediate();

    // hook SPA route changes and schedule re-evaluate (short delay)
    hookLocationChangeOnce(() => scheduleMaybeUpdateRoute(50));

    dbg("init done");
  }

  // run init safely
  try {
    init();
  } catch (e) {
    // Never throw errors to host page
    console.error("[Anti-Shorts] init error:", e);
  }

  /* -------------------- public debug helpers (optional) -------------------- */
  // window.__antiShorts = { updateInjectionForRouteImmediate, scheduleMaybeUpdateRoute, registerMenu };
})();

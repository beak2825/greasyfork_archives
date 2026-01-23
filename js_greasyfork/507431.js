// ==UserScript==
// @name         Story Downloader - Facebook and Instagram
// @namespace    https://github.com/oscar370
// @version      2.1.0
// @description  Download stories (videos and images) from Facebook and Instagram.
// @author       oscar370
// @match        *.facebook.com/*
// @match        *.instagram.com/*
// @grant        none
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/507431/Story%20Downloader%20-%20Facebook%20and%20Instagram.user.js
// @updateURL https://update.greasyfork.org/scripts/507431/Story%20Downloader%20-%20Facebook%20and%20Instagram.meta.js
// ==/UserScript==
"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };

  // src/constants.ts
  var MAX_ATTEMPTS = 10;
  var SELECTORS = {
    facebook: {
      topBar: "div.xtotuo0",
      userName: "span.xuxw1ft.xlyipyv"
    },
    instagram: {
      topBar: "div.x1xmf6yo",
      userName: ".x1i10hfl"
    }
  };

  // src/utils.ts
  function $(selector, scope = document) {
    return scope.querySelector(selector);
  }
  function $$(selector, scope = document) {
    return [...scope.querySelectorAll(selector)];
  }
  function create(tag, attrs = {}) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      el[k] = v;
    });
    return el;
  }
  function remove(el) {
    el.remove();
  }
  function append(p, c) {
    p.append(c);
  }
  function css(el, styles) {
    Object.assign(el.style, styles);
  }
  function on(el, ev, fn, opts) {
    el.addEventListener(ev, fn, opts);
  }
  function html(el, value) {
    if (value === void 0) return el.innerHTML;
    el.innerHTML = value;
  }
  function text(el, value) {
    if (value === void 0) return el.textContent;
    el.textContent = value;
  }

  // src/helpers.ts
  var isDev = false;
  function log(...args) {
    if (isDev) console.log("[StoryDownloader]", ...args);
  }
  function isMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobileUA = /android|iphone|kindle|ipad|playbook|silk/i.test(
      userAgent
    );
    return isMobileUA;
  }
  function isFacebookPage() {
    return /(facebook)/.test(window.location.href);
  }
  function getPlatformConfig() {
    const platform = isFacebookPage() ? "facebook" : "instagram";
    return SELECTORS[platform];
  }
  function getFbMobileProfileNodes() {
    const nameSpans = $$(
      "div[data-mcomponent='ServerTextArea']  span"
    );
    const nameSpan = nameSpans.find(
      (el) => el.offsetHeight > 0 && el.closest("[role='button']")
    );
    if (!nameSpan) return null;
    return { nameSpan };
  }

  // src/store.ts
  var state = {
    mediaUrl: null,
    detectedVideo: null,
    observerTimeout: null,
    lastUrl: "",
    isPolling: false
  };
  function getState() {
    return __spreadValues({}, state);
  }
  function setState(partial) {
    const newState = __spreadValues(__spreadValues({}, getState()), partial);
    state = newState;
  }

  // src/downloader.ts
  async function detectMedia() {
    const video = findVideo();
    const image = findImage();
    if (video) {
      setState({ mediaUrl: video, detectedVideo: true });
    } else if (image) {
      setState({ mediaUrl: image.src, detectedVideo: false });
    }
    log("Media URL detected:", getState().mediaUrl);
  }
  function findVideo() {
    const videos = $$("video").filter(
      (v) => v.offsetHeight > 0
    );
    for (const video of videos) {
      const url = searchVideoSource(video);
      if (url) {
        return url;
      }
    }
    return null;
  }
  function searchVideoSource(video) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
    if (!video.currentSrc.startsWith("blob")) {
      return video.currentSrc;
    }
    const reactFiberKey = Object.keys(video).find(
      (key) => key.startsWith("__reactFiber")
    );
    if (!reactFiberKey) return null;
    const reactKey = reactFiberKey.replace("__reactFiber", "");
    const parent = (_c = (_b = (_a = video.parentElement) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.parentElement) == null ? void 0 : _c.parentElement;
    const reactProps = parent == null ? void 0 : parent[`__reactProps${reactKey}`];
    const implementations = (_m = (_h = (_g = (_f = (_e = (_d = reactProps == null ? void 0 : reactProps.children) == null ? void 0 : _d[0]) == null ? void 0 : _e.props) == null ? void 0 : _f.children) == null ? void 0 : _g.props) == null ? void 0 : _h.implementations) != null ? _m : (_l = (_k = (_j = (_i = reactProps == null ? void 0 : reactProps.children) == null ? void 0 : _i.props) == null ? void 0 : _j.children) == null ? void 0 : _k.props) == null ? void 0 : _l.implementations;
    if (implementations) {
      for (const index of [1, 0, 2]) {
        const source = (_n = implementations[index]) == null ? void 0 : _n.data;
        const url = (source == null ? void 0 : source.hdSrc) || (source == null ? void 0 : source.sdSrc) || (source == null ? void 0 : source.hd_src) || (source == null ? void 0 : source.sd_src);
        if (url) return url;
      }
    }
    const videoData = (_s = (_r = (_q = (_p = (_o = video[reactFiberKey]) == null ? void 0 : _o.return) == null ? void 0 : _p.stateNode) == null ? void 0 : _q.props) == null ? void 0 : _r.videoData) == null ? void 0 : _s.$1;
    return (videoData == null ? void 0 : videoData.hd_src) || (videoData == null ? void 0 : videoData.sd_src) || null;
  }
  function findImage() {
    const images = $$("img").filter(
      (img) => img.offsetHeight > 0 && img.src.includes("cdn")
    );
    return images.find((img) => img.height > 400) || null;
  }
  function generateFileName() {
    var _a;
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const config = getPlatformConfig();
    const isFb = isFacebookPage();
    const detectedVideo = getState().detectedVideo;
    let userName = "unknown";
    const user = $$(config.userName).find((e) => {
      if (!(e instanceof HTMLElement)) return false;
      if (isFb && !isMobile()) {
        return e.offsetWidth > 0;
      }
      return e.offsetHeight > 0 && e.offsetHeight < 35;
    });
    if (user) {
      log(`Element with the username:`);
      log(user);
      if (isFb) {
        userName = text(user) || userName;
      } else {
        userName = user.pathname.replace(/\//g, "") || userName;
      }
    } else if (isMobile()) {
      if (isFb) {
        const nameSpan = (_a = getFbMobileProfileNodes()) == null ? void 0 : _a.nameSpan;
        log(`Element with the username:`);
        log(nameSpan);
        if (nameSpan) {
          userName = nameSpan.textContent;
        }
      }
    }
    const extension = detectedVideo ? "mp4" : "jpg";
    return `${userName}-${timestamp}.${extension}`;
  }
  async function downloadMedia(url, filename) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = create("a", {
        href: URL.createObjectURL(blob),
        download: filename
      });
      append(document.body, link);
      link.click();
      remove(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download error:", error);
    }
  }

  // src/dom.ts
  var DOWNLOAD_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
  class="bi bi-file-arrow-down-fill" viewBox="0 0 16 16">
  <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2
    M8 5a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 
    .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 
    .708-.708L7.5 9.293V5.5A.5.5 0 0 1 8 5"/>
</svg>
`;
  var BUTTON_STYLES = {
    position: "relative",
    border: "none",
    background: "transparent",
    color: "white",
    cursor: "pointer",
    zIndex: "9999"
  };
  var CONTAINER_MOBILE_STYLES = {
    position: "absolute",
    bottom: "70px",
    right: "20px"
  };
  function createButtonWithPolling() {
    const isPolling = getState().isPolling;
    if (isPolling) return;
    setState({ isPolling: true });
    let attempts = 0;
    const poll = () => {
      const existingBtn = $("#downloadBtn");
      if (existingBtn) {
        setState({ isPolling: false });
        return;
      }
      const createdBtn = createButton();
      if (createdBtn || attempts >= MAX_ATTEMPTS) {
        setState({ isPolling: false });
        return;
      }
      attempts++;
      setTimeout(poll, 500);
    };
    poll();
  }
  function createButton() {
    if (isFacebookPage() && isMobile()) {
      const container = create("div");
      css(container, CONTAINER_MOBILE_STYLES);
      const btn2 = create("button", { id: "downloadBtn" });
      html(btn2, DOWNLOAD_ICON);
      css(btn2, BUTTON_STYLES);
      on(btn2, "click", () => handleDownload());
      append(container, btn2);
      append(document.body, container);
      return btn2;
    }
    const config = getPlatformConfig();
    const topBars = $$(config.topBar);
    const topBar = topBars.find(
      (bar) => bar instanceof HTMLElement && bar.offsetHeight > 0
    );
    if (!topBar) {
      log("No suitable top bar found");
      return null;
    }
    const btn = create("button", { id: "downloadBtn" });
    html(btn, DOWNLOAD_ICON);
    css(btn, BUTTON_STYLES);
    on(btn, "click", () => handleDownload());
    append(topBar, btn);
    log("Download button added", btn);
    return btn;
  }
  async function handleDownload() {
    try {
      await detectMedia();
      const mediaUrl = getState().mediaUrl;
      if (!mediaUrl) throw new Error("No multimedia content was found");
      const filename = generateFileName();
      await downloadMedia(mediaUrl, filename);
    } catch (error) {
      log("Download failed:", error);
    }
  }

  // src/main.ts
  log("Initializing observer...");
  setupMutationObserver();
  function setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      const hasRelevantChanges = mutations.some(
        (m) => m.addedNodes.length > 0 || m.removedNodes.length > 0
      );
      if (!hasRelevantChanges) return;
      const observerTimeout = getState().observerTimeout;
      if (observerTimeout) clearTimeout(observerTimeout);
      const timeout = setTimeout(() => {
        checkPageStructure();
      }, 300);
      setState({ observerTimeout: timeout });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  function checkPageStructure() {
    const lastUrl = getState().lastUrl;
    const currentUrl = window.location.href;
    const isStoryPage = /(\/stories\/)/.test(currentUrl);
    const btn = $("#downloadBtn");
    if (!isStoryPage) {
      if (btn) remove(btn);
      return;
    }
    if (currentUrl !== lastUrl || !btn) {
      setState({ lastUrl: currentUrl });
      createButtonWithPolling();
    }
  }
})();

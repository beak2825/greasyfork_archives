// ==UserScript==
// @name         Youtube Page Enhancer
// @namespace    vite-plugin-monkey
// @version      1.0
// @author       Jack
// @description  添加隐藏/显示"已看视频和MIX视频"的切换按钮；在历史记录页面不隐藏视频；净化左侧导航栏；搜索结果去重；部分链接在新窗口打开；隐藏视频结束后的推荐内容；隐藏部分弹窗；隐藏带货橱窗；在搜索结果页隐藏"People also search for"的ytd-horizontal-card-list-renderer
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/538307/Youtube%20Page%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/538307/Youtube%20Page%20Enhancer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const videoSelectors = "ytd-video-renderer,ytd-compact-video-renderer,ytd-rich-item-renderer,ytd-grid-video-renderer,ytd-reel-item-renderer";
  const endscreenSelector = "div.html5-endscreen.ytp-player-content.videowall-endscreen.ytp-show-tiles";
  const popupSelector = "div.ab4yt-popup";
  const channelRendererSelector = "ytd-channel-renderer";
  const BUTTON_SELECTOR = 'ytd-masthead button.yt-spec-button-shape-next[aria-label="Create"]';
  const ENHANCER_BLOCK_FLAG = "data-yt-enhancer-block";
  const guideTitlesToRemove = /* @__PURE__ */ new Set([
    "Shorts",
    "Your videos",
    "Your clips",
    "Music",
    "Movies & TV",
    "Live",
    "Gaming",
    "News",
    "Sports",
    "Courses",
    "Report history",
    "Help",
    "Send feedback",
    "Movies",
    "Podcasts",
    "Watch later",
    "Liked videos",
    "Subscriptions",
    "Learning"
  ]);
  const createKeywords = /* @__PURE__ */ new Set(["create", "创建", "créer", "erstellen"]);
  function injectCSS() {
    const style = document.createElement("style");
    style.textContent = `
        ${endscreenSelector},${popupSelector},${channelRendererSelector},[${ENHANCER_BLOCK_FLAG}="true"] {
            display: none !important;
        }
        ytd-horizontal-card-list-renderer:has(yt-formatted-string:where(:text("People also search for"))) {
            display: none !important;
        }
        ytd-rich-item-renderer:has(a.yt-lockup-view-model-wiz__content-image[href*="/playlist?list=WL"]) {
            display: none !important;
        }
        ytd-rich-item-renderer:has(a.yt-lockup-view-model-wiz__content-image[href*="/playlist?list=LL"]) {
            display: none !important;
        }
        ytd-masthead button.yt-spec-button-shape-next[aria-label="Create"] {
            display: none !important;
        }
        body.hide-mix:not(.history-page) ytd-rich-item-renderer:has(.badge-shape-wiz__text:where(:text("Mix"))),
        body.hide-mix:not(.history-page) ytd-rich-item-renderer:has(a.yt-lockup-view-model-wiz__content-image[href*="start_radio=1"]),
        body.hide-mix:not(.history-page) yt-lockup-view-model:has(.badge-shape-wiz__text:where(:text("Mix"))),
        body.hide-mix:not(.history-page) yt-lockup-view-model:has(a.yt-lockup-view-model-wiz__content-image[href*="start_radio=1"]) {
            display: none !important;
        }
        ytd-video-renderer.dedupe-hidden {
            display: none !important;
        }
        YTD-TRI-STATE-BUTTON-VIEW-MODEL.translate-button.style-scope.ytd-comment-view-model {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
    function updateHideMixClass() {
      const isHidden = localStorage.getItem("hideWatchedState") === "true";
      const isHistoryPage = location.pathname === "/feed/history";
      document.body.classList.toggle("hide-mix", isHidden);
      document.body.classList.toggle("history-page", isHistoryPage);
    }
    updateHideMixClass();
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      originalSetItem.call(localStorage, key, value);
      if (key === "hideWatchedState") updateHideMixClass();
    };
  }
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  function parseViewCount(viewText) {
    if (!viewText) return 0;
    const cleanedText = viewText.toLowerCase().replace("views", "").trim();
    if (cleanedText === "no") return 0;
    const match = cleanedText.match(/^([\d.]+)([km]?)$/i);
    if (!match) return 0;
    const number = parseFloat(match[1]);
    return match[2] === "k" ? number * 1e3 : match[2] === "m" ? number * 1e6 : number;
  }
  const seenVideoIds = /* @__PURE__ */ new Set();
  let pendingProcess = false;
  let isScrollTriggered = false;
  function isMixContent(video) {
    return !!video.querySelector('.badge-shape-wiz__text:where(:text("Mix")),a.yt-lockup-view-model-wiz__content-image[href*="start_radio=1"]');
  }
  function processVideoNode(video) {
    const isHistoryPage = location.pathname === "/feed/history";
    const isHiddenGlobally = localStorage.getItem("hideWatchedState") === "true";
    const isHiddenByBlacklist = video.hasAttribute("data-yt-block") && video.getAttribute("data-yt-block") === "true";
    let shouldBeHiddenByOurConditions = false;
    if (isHiddenGlobally && !isHistoryPage) {
      const progress = video.querySelector("ytd-thumbnail-overlay-resume-playback-renderer #progress,#progress");
      if (progress instanceof HTMLElement && progress.style.width && progress.style.width !== "0%") {
        shouldBeHiddenByOurConditions = true;
      } else if (isMixContent(video)) {
        shouldBeHiddenByOurConditions = true;
      } else {
        const viewElement = video.querySelector("ytd-video-meta-block #metadata-line .inline-metadata-item");
        if (viewElement) {
          const viewCount = parseViewCount(viewElement.textContent);
          if (viewCount < 2e3) {
            shouldBeHiddenByOurConditions = true;
          }
        }
      }
    }
    if (shouldBeHiddenByOurConditions) {
      video.style.display = "none";
      video.setAttribute(ENHANCER_BLOCK_FLAG, "true");
    } else {
      if (!isHiddenByBlacklist) {
        video.style.display = "";
      }
      video.removeAttribute(ENHANCER_BLOCK_FLAG);
      video.classList.remove("dedupe-hidden");
    }
  }
  function processSearchDedupe(videos, isFromScroll) {
    if (!isFromScroll || !location.pathname.startsWith("/results")) return;
    videos.forEach((video) => {
      var _a;
      if (video.hasAttribute("data-dedupe-checked")) return;
      const a = video.querySelector('ytd-thumbnail a#thumbnail,a[href*="/watch?v="],a[href*="/shorts/"],a[href]');
      if (!a) return;
      try {
        const url = new URL(a.href, window.location.origin);
        let videoId = url.searchParams.get("v") || (url.pathname.includes("/shorts/") ? (_a = url.pathname.split("/shorts/")[1]) == null ? void 0 : _a.split("/")[0] : null);
        if (videoId) {
          if (seenVideoIds.has(videoId)) {
            video.style.display = "none";
            video.classList.add("dedupe-hidden");
          } else {
            seenVideoIds.add(videoId);
          }
          video.setAttribute("data-dedupe-checked", "true");
        }
      } catch (e) {
      }
    });
  }
  function scheduleProcessDOM(immediate = false) {
    if (pendingProcess && !immediate) return;
    pendingProcess = true;
    const delay = immediate ? 0 : 1e3;
    setTimeout(() => {
      try {
        const videoElements = Array.from(document.querySelectorAll(videoSelectors)).filter((node) => node.matches(videoSelectors));
        videoElements.forEach(processVideoNode);
        if (location.pathname.startsWith("/results")) {
          processSearchDedupe(videoElements, isScrollTriggered);
        }
      } finally {
        pendingProcess = false;
      }
    }, delay);
  }
  function setScrollTriggered(value) {
    isScrollTriggered = value;
  }
  let replacedButton = null;
  function replaceCreateButton() {
    const createButtons = document.querySelectorAll(BUTTON_SELECTOR);
    createButtons.forEach((createButton) => {
      var _a, _b, _c, _d, _e;
      if (((_a = createButton.textContent) == null ? void 0 : _a.includes("隐藏")) || ((_b = createButton.textContent) == null ? void 0 : _b.includes("显示"))) {
        replacedButton = createButton;
        return;
      }
      const textContent = ((_c = createButton.textContent) == null ? void 0 : _c.toLowerCase()) || "";
      const ariaLabel = ((_d = createButton.getAttribute("aria-label")) == null ? void 0 : _d.toLowerCase()) || "";
      if (!createKeywords.has(textContent) && !createKeywords.has(ariaLabel)) return;
      const newButton = document.createElement("button");
      const isHidden = localStorage.getItem("hideWatchedState") === "true";
      newButton.textContent = isHidden ? "显示" : "隐藏";
      Object.assign(newButton.style, {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Roboto,Arial,sans-serif",
        fontSize: "14px",
        fontWeight: "500",
        lineHeight: "36px",
        height: "36px",
        padding: "0 16px",
        borderRadius: "18px",
        color: "rgb(15, 15, 15)",
        background: "rgba(0, 0, 0, 0.05)",
        borderWidth: "3px",
        borderStyle: "solid",
        borderColor: isHidden ? "transparent" : "rgb(255, 0, 0)",
        cursor: "pointer",
        whiteSpace: "nowrap",
        textTransform: "none",
        boxSizing: "border-box",
        marginRight: "8px"
      });
      newButton.addEventListener("click", () => {
        const newHidden = localStorage.getItem("hideWatchedState") !== "true";
        localStorage.setItem("hideWatchedState", newHidden.toString());
        newButton.textContent = newHidden ? "显示" : "隐藏";
        newButton.style.borderColor = newHidden ? "transparent" : "rgb(255, 0, 0)";
        scheduleProcessDOM();
      });
      (_e = createButton.parentNode) == null ? void 0 : _e.replaceChild(newButton, createButton);
      createButton.dataset.replaced = "true";
      replacedButton = newButton;
    });
  }
  function cleanYouTubeUI() {
    document.querySelectorAll("ytd-merch-shelf-renderer").forEach((el) => el.remove());
    document.querySelectorAll("ytd-guide-entry-renderer").forEach((entry) => {
      var _a, _b;
      const titleText = (_b = (_a = entry.querySelector("yt-formatted-string")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
      if (titleText && guideTitlesToRemove.has(titleText) && titleText !== "Trending") {
        entry.remove();
      }
    });
    document.querySelectorAll("ytd-guide-section-renderer").forEach((section) => {
      var _a, _b;
      const titleText = (_b = (_a = section.querySelector("h3 yt-formatted-string")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
      if (titleText === "普通" || titleText === "More from YouTube") section.remove();
    });
    document.querySelectorAll("#footer").forEach((footer) => {
      if (footer.closest("ytd-guide-renderer")) footer.remove();
    });
    if (location.pathname === "/feed/playlists") {
      document.querySelectorAll("ytd-rich-item-renderer").forEach((item) => {
        if (item.querySelector('a.yt-lockup-view-model-wiz__content-image[href*="/playlist?list=WL"]')) {
          item.style.display = "none";
        }
        if (item.querySelector('a.yt-lockup-view-model-wiz__content-image[href*="/playlist?list=LL"]')) {
          item.style.display = "none";
        }
      });
    }
  }
  function getReplacedButton() {
    return replacedButton;
  }
  function isUserProfileLink(path) {
    return /^\/@[^\/]+\/?$/.test(path) || /^\/channel\/[^\/]+\/?$/.test(path);
  }
  function isVideoLink(url) {
    const urlObj = new URL(url, location.origin);
    return (url.includes("/watch?v=") || url.includes("/shorts/")) && !urlObj.searchParams.has("t") && !urlObj.searchParams.has("index");
  }
  function shouldRedirect(path) {
    return (/^\/@[^\/]+\/?($|\?)/.test(path) || /^\/channel\/[^\/]+\/?($|\?)/.test(path)) && !/\/(videos|playlists|community|featured|about|streams)/.test(path);
  }
  function redirectToVideos() {
    const path = location.pathname;
    if (!shouldRedirect(path)) return;
    const observer = new MutationObserver(() => {
      var _a, _b;
      const videoTabs = document.querySelectorAll("yt-tab-shape > div.yt-tab-shape-wiz__tab");
      for (const tab of videoTabs) {
        const text = (_a = tab.textContent) == null ? void 0 : _a.trim();
        if (text === "Videos" || text === "视频") {
          (_b = tab.closest("yt-tab-shape")) == null ? void 0 : _b.click();
          observer.disconnect();
          break;
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  function setupNewWindowLinks() {
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (target.closest("#custom-block-menu")) return;
      const anchor = target.closest("a");
      if (!anchor || !anchor.href) return;
      const href = anchor.href;
      if (isUserProfileLink(new URL(href, location.origin).pathname) || isVideoLink(href)) {
        e.preventDefault();
        e.stopPropagation();
        const linkUrl = new URL(href);
        if (isUserProfileLink(linkUrl.pathname) && !/\/(videos|playlists|community|featured|about|streams)/.test(linkUrl.pathname)) {
          linkUrl.pathname += "/videos";
        }
        window.open(linkUrl.toString(), "_blank");
      }
    }, true);
  }
  function setupEventListeners() {
    const debouncedUpdate = debounce(() => {
      cleanYouTubeUI();
      scheduleProcessDOM();
    }, 200);
    const debouncedHideWatchLater = debounce(() => {
      if (location.pathname === "/feed/playlists") cleanYouTubeUI();
    }, 500);
    const observer = new MutationObserver((mutations) => {
      var _a;
      const nodesToProcess = /* @__PURE__ */ new Set();
      let createButtonFound = false;
      for (const mut of mutations) {
        if (!mut.addedNodes.length) continue;
        for (const node of mut.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.matches('ytd-masthead button.yt-spec-button-shape-next[aria-label="Create"]') || node.querySelector('ytd-masthead button.yt-spec-button-shape-next[aria-label="Create"]')) {
            createButtonFound = true;
          }
          if (node.matches(videoSelectors) || node.querySelector(videoSelectors)) {
            nodesToProcess.add(node);
            node.querySelectorAll(videoSelectors).forEach((n) => nodesToProcess.add(n));
          }
        }
      }
      if (createButtonFound && (!getReplacedButton() || !((_a = getReplacedButton()) == null ? void 0 : _a.isConnected))) {
        replaceCreateButton();
      }
      if (nodesToProcess.size) {
        scheduleProcessDOM();
      }
      debouncedUpdate();
      debouncedHideWatchLater();
    });
    window.addEventListener("load", () => {
    });
    window.addEventListener("yt-navigate-finish", () => {
      seenVideoIds.clear();
      setTimeout(() => {
        replaceCreateButton();
        redirectToVideos();
        scheduleProcessDOM();
        debouncedHideWatchLater();
        const isHidden = localStorage.getItem("hideWatchedState") === "true";
        const isHistoryPage = location.pathname === "/feed/history";
        document.body.classList.toggle("hide-mix", isHidden);
        document.body.classList.toggle("history-page", isHistoryPage);
      }, 100);
    });
    let isScrolling;
    window.addEventListener("scroll", () => {
      clearTimeout(isScrolling);
      isScrolling = setTimeout(() => {
        setScrollTriggered(true);
        scheduleProcessDOM();
        setScrollTriggered(false);
      }, 500);
    });
    const originalPushState = history.pushState;
    history.pushState = function(state, title, url) {
      originalPushState.apply(history, [state, title, url]);
      seenVideoIds.clear();
      setTimeout(() => {
        replaceCreateButton();
        redirectToVideos();
        scheduleProcessDOM();
        debouncedHideWatchLater();
        const isHidden = localStorage.getItem("hideWatchedState") === "true";
        const isHistoryPage = location.pathname === "/feed/history";
        document.body.classList.toggle("hide-mix", isHidden);
        document.body.classList.toggle("history-page", isHistoryPage);
      }, 100);
    };
    window.addEventListener("unload", () => observer.disconnect());
    observer.observe(document.body, { childList: true, subtree: true });
  }
  function initialize() {
    injectCSS();
    replaceCreateButton();
    cleanYouTubeUI();
    redirectToVideos();
    scheduleProcessDOM();
    setupNewWindowLinks();
    setupEventListeners();
  }
  if (document.readyState === "complete" || document.readyState === "interactive") {
    initialize();
  } else {
    document.addEventListener("DOMContentLoaded", initialize);
  }

})();
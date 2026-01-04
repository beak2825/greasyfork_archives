// ==UserScript==
// @name         YouTube Creator Blacklist
// @namespace    vite-plugin-monkey
// @version      1.2
// @author       Jack
// @description  Block some YouTube creators
// @match        https://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/538285/YouTube%20Creator%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/538285/YouTube%20Creator%20Blacklist.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
  const videoSelectors = "ytd-video-renderer,ytd-compact-video-renderer,ytd-rich-item-renderer,ytd-grid-video-renderer,ytd-reel-item-renderer";
  const BLOCK_FLAG = "data-yt-block";
  const usernameCache = /* @__PURE__ */ new WeakMap();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  function getUsernameTextFromRenderer(renderer) {
    var _a;
    if (usernameCache.has(renderer)) return usernameCache.get(renderer);
    const selectors = [
      "ytd-channel-name a.yt-simple-endpoint yt-formatted-string",
      "#channel-name yt-formatted-string",
      'ytd-channel-name a[href*="@"],ytd-channel-name a[href*="/channel/"]'
    ];
    for (const selector of selectors) {
      const element = renderer.querySelector(selector);
      if (!element) continue;
      const textContent = (_a = element.textContent) == null ? void 0 : _a.trim();
      if (textContent) {
        const username = textContent.replace(/^@/, "");
        usernameCache.set(renderer, username);
        return username;
      }
      const href = element.getAttribute("href") || "";
      const atMatch = href.match(/@([^/?]+)/);
      const channelMatch = href.match(/\/channel\/([^/?]+)/);
      const extractedUsername = ((atMatch == null ? void 0 : atMatch[1]) || (channelMatch == null ? void 0 : channelMatch[1])) ?? null;
      if (extractedUsername) {
        usernameCache.set(renderer, extractedUsername);
        return extractedUsername;
      }
    }
    usernameCache.set(renderer, null);
    return null;
  }
  async function shouldHideVideo(video) {
    const blockedCreators = (await _GM_getValue("blockedCreators", []) || []).map((user) => user.trim().replace(/^@/, "").toLowerCase());
    const username = getUsernameTextFromRenderer(video);
    return username !== null && blockedCreators.includes(username.toLowerCase());
  }
  async function processVideoNode(video) {
    if (video.hasAttribute(BLOCK_FLAG) && video.getAttribute(BLOCK_FLAG) === "true") {
      video.style.display = "none";
      return;
    }
    if (await shouldHideVideo(video)) {
      video.style.display = "none";
      video.setAttribute(BLOCK_FLAG, "true");
      return;
    }
    video.style.display = "";
  }
  let pendingProcess = false;
  async function scheduleProcessDOM(nodes, immediate = false) {
    if (pendingProcess && !immediate) return;
    pendingProcess = true;
    const delay = immediate ? 0 : 1e3;
    setTimeout(async () => {
      try {
        let videosToProcess;
        if (nodes) {
          videosToProcess = Array.from(nodes).filter((node) => node.matches(videoSelectors));
        } else {
          videosToProcess = Array.from(document.querySelectorAll(videoSelectors)).filter((node) => node.matches(videoSelectors));
        }
        for (const video of videosToProcess) {
          if (video instanceof HTMLElement) {
            await processVideoNode(video);
          }
        }
      } finally {
        pendingProcess = false;
      }
    }, delay);
  }
  function setupEventListeners() {
    const debouncedUpdate = debounce(() => {
      scheduleProcessDOM();
    }, 200);
    const observer = new MutationObserver((mutations) => {
      const nodesToAdd = /* @__PURE__ */ new Set();
      for (const mut of mutations) {
        if (!mut.addedNodes.length) continue;
        for (const node of Array.from(mut.addedNodes)) {
          if (node.nodeType !== 1) continue;
          const elementNode = node;
          if (elementNode.matches(videoSelectors) || elementNode.querySelector(videoSelectors)) {
            nodesToAdd.add(elementNode);
            elementNode.querySelectorAll(videoSelectors).forEach((n) => nodesToAdd.add(n));
          }
        }
      }
      if (nodesToAdd.size && !window.pendingProcess) {
        scheduleProcessDOM(Array.from(nodesToAdd), true);
      }
      debouncedUpdate();
    });
    window.addEventListener("load", () => {
      scheduleProcessDOM(void 0, true);
    });
    window.addEventListener("yt-navigate-finish", () => {
      setTimeout(() => {
        scheduleProcessDOM();
      }, 100);
    });
    let isScrolling;
    window.addEventListener("scroll", () => {
      clearTimeout(isScrolling);
      isScrolling = setTimeout(() => {
        scheduleProcessDOM();
      }, 500);
    });
    const originalPushState = history.pushState;
    history.pushState = function(state, title, url) {
      originalPushState.apply(history, [state, title, url]);
      setTimeout(() => {
        scheduleProcessDOM();
      }, 100);
    };
    window.addEventListener("unload", () => observer.disconnect());
    observer.observe(document.body, { childList: true, subtree: true });
  }
  function setupContextMenu() {
    document.addEventListener("contextmenu", async (e) => {
      var _a;
      e.preventDefault();
      const oldMenu = document.getElementById("youtube-creator-blacklist-menu");
      if (oldMenu) {
        oldMenu.remove();
      }
      const menu = document.createElement("div");
      Object.assign(menu.style, {
        position: "fixed",
        background: "#fff",
        border: "1px solid #ccc",
        padding: "5px",
        boxShadow: "2px 2px 5px rgba(0,0,0,.2)",
        zIndex: "10000",
        borderRadius: "3px",
        fontSize: "14px",
        color: "black"
      });
      menu.id = "youtube-creator-blacklist-menu";
      menu.onmouseover = () => menu.style.background = "pink";
      menu.onmouseout = () => menu.style.background = "#fff";
      const videoTarget = (_a = e.target) == null ? void 0 : _a.closest(videoSelectors);
      if (videoTarget) {
        const usernameText = getUsernameTextFromRenderer(videoTarget);
        if (usernameText) {
          const blockedCreators = await _GM_getValue("blockedCreators", []);
          const isBlocked = blockedCreators.includes(usernameText);
          const blockButton = document.createElement("div");
          blockButton.textContent = isBlocked ? "取消屏蔽该作者" : "屏蔽该作者";
          blockButton.style.cssText = "padding: 5px; cursor: pointer;";
          blockButton.addEventListener("click", async () => {
            let updatedBlockedCreators = await _GM_getValue("blockedCreators", []);
            if (isBlocked) {
              updatedBlockedCreators = updatedBlockedCreators.filter((user) => user !== usernameText);
            } else {
              updatedBlockedCreators.unshift(usernameText);
            }
            await _GM_setValue("blockedCreators", updatedBlockedCreators);
            scheduleProcessDOM(Array.from(document.querySelectorAll(videoSelectors)), true);
            menu.remove();
          });
          menu.appendChild(blockButton);
        }
      }
      if (menu.children.length > 0) {
        document.body.appendChild(menu);
        menu.style.left = `${e.clientX}px`;
        menu.style.top = `${e.clientY}px`;
        document.addEventListener("click", (event) => {
          if (!menu.contains(event.target)) {
            menu.remove();
          }
        }, { once: true });
      }
    }, true);
  }
  function initialize() {
    setupEventListeners();
    setupContextMenu();
  }
  window.addEventListener("load", initialize);

})();
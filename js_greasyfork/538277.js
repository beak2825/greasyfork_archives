// ==UserScript==
// @name         YouTube Commenter Blacklist
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       Jack
// @description  Hide comments from specific users
// @match        https://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/538277/YouTube%20Commenter%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/538277/YouTube%20Commenter%20Blacklist.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const COMMENT_SELECTORS = "ytd-comment-thread-renderer,ytd-comment-view-model";
  const BLOCK_FLAG = "data-yt-block";
  const STORAGE_KEY = "blockedCommenter";
  const USERNAME_SELECTORS = "#author-text,h3 span.style-scope.ytd-comment-view-model";
  const MENU_ID = "custom-block-menu";
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const usernameCache = /* @__PURE__ */ new WeakMap();
  function getUsernameTextFromCommentElement$1(element) {
    if (usernameCache.has(element)) {
      return usernameCache.get(element) || null;
    }
    const usernameElement = element.querySelector(USERNAME_SELECTORS);
    if (!(usernameElement == null ? void 0 : usernameElement.textContent)) {
      return null;
    }
    const username = usernameElement.textContent.trim().replace(/^@/, "").replace(/\n/g, "");
    usernameCache.set(element, username);
    return username;
  }
  function shouldHideComment$1(comment) {
    const blockedCommenters = _GM_getValue(STORAGE_KEY, []).map((user) => user.trim().replace(/^@/, "").toLowerCase());
    const username = getUsernameTextFromCommentElement$1(comment);
    return Boolean(username && blockedCommenters.includes(username.toLowerCase()));
  }
  function processCommentNode$1(comment) {
    if (comment.hasAttribute(BLOCK_FLAG)) {
      return;
    }
    if (shouldHideComment$1(comment)) {
      comment.setAttribute("style", "display: none");
      comment.setAttribute(BLOCK_FLAG, "true");
    }
  }
  function scheduleProcessDOM(nodes = document.querySelectorAll(COMMENT_SELECTORS)) {
    const comments = Array.from(nodes).filter((node) => node.matches(COMMENT_SELECTORS));
    comments.forEach(processCommentNode$1);
  }
  function addToBlacklist(username) {
    const blockedCommenters = _GM_getValue(STORAGE_KEY, []);
    if (!blockedCommenters.includes(username)) {
      blockedCommenters.unshift(username);
      _GM_setValue(STORAGE_KEY, blockedCommenters);
    }
  }
  function createMenu(x, y) {
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
      left: `${x}px`,
      top: `${y}px`
    });
    menu.id = MENU_ID;
    menu.onmouseover = () => menu.style.background = "pink";
    menu.onmouseout = () => menu.style.background = "#fff";
    return menu;
  }
  function createBlockButton(username, commentElement) {
    const button = document.createElement("div");
    button.textContent = `屏蔽 ${username}`;
    button.style.cssText = "padding: 5px; cursor: pointer;";
    button.addEventListener("click", () => {
      addToBlacklist(username);
      processCommentNode$1(commentElement);
      scheduleProcessDOM(document.querySelectorAll(COMMENT_SELECTORS));
      const menu = document.getElementById(MENU_ID);
      if (menu) menu.remove();
    });
    return button;
  }
  function initializeContextMenu() {
    document.addEventListener("contextmenu", (e) => {
      const oldMenu = document.getElementById(MENU_ID);
      if (oldMenu) oldMenu.remove();
      const commentTarget = e.target.closest(COMMENT_SELECTORS);
      if (!commentTarget) return;
      const usernameText = getUsernameTextFromCommentElement$1(commentTarget);
      if (!usernameText) return;
      const menu = createMenu(e.clientX, e.clientY);
      menu.appendChild(createBlockButton(usernameText, commentTarget));
      document.body.appendChild(menu);
      e.preventDefault();
      document.addEventListener("click", (event) => {
        if (!menu.contains(event.target)) {
          menu.remove();
        }
      }, { once: true });
      const scrollHandler = () => {
        menu.remove();
        window.removeEventListener("scroll", scrollHandler);
      };
      window.addEventListener("scroll", scrollHandler);
    });
  }
  function getUsernameTextFromCommentElement(element) {
    var _a;
    const usernameElement = element.querySelector("#author-text,h3 span.style-scope.ytd-comment-view-model");
    return ((_a = usernameElement == null ? void 0 : usernameElement.textContent) == null ? void 0 : _a.trim().replace(/^@/, "").replace(/\n/g, "")) || null;
  }
  function shouldHideComment(comment) {
    const blockedCommenters = _GM_getValue("blockedCommenter", []).map(
      (user) => user.trim().replace(/^@/, "").toLowerCase()
    );
    const username = getUsernameTextFromCommentElement(comment);
    return Boolean(username && blockedCommenters.includes(username.toLowerCase()));
  }
  function processCommentNode(comment) {
    if (comment.hasAttribute(BLOCK_FLAG)) return;
    if (shouldHideComment(comment)) {
      comment.setAttribute("style", "display: none");
      comment.setAttribute(BLOCK_FLAG, "true");
    }
  }
  document.addEventListener("contextmenu", (e) => {
    const oldMenu = document.getElementById("custom-block-menu");
    if (oldMenu) oldMenu.remove();
    const menu = document.createElement("div");
    Object.assign(menu.style, {
      position: "fixed",
      background: "#fff",
      border: "1px solid #ccc",
      padding: "5px",
      boxShadow: "2px 2px 5px rgba(0,0,0,.2)",
      zIndex: "10000",
      borderRadius: "3px",
      fontSize: "14px"
    });
    menu.id = "custom-block-menu";
    menu.onmouseover = () => menu.style.background = "pink";
    menu.onmouseout = () => menu.style.background = "#fff";
    const commentTarget = e.target.closest(COMMENT_SELECTORS);
    if (commentTarget) {
      const usernameText = getUsernameTextFromCommentElement(commentTarget);
      if (usernameText) {
        const blockCommentButton = document.createElement("div");
        blockCommentButton.textContent = "屏蔽该用户评论";
        blockCommentButton.style.cssText = "padding: 5px; cursor: pointer;";
        blockCommentButton.addEventListener("click", () => {
          console.log("Block comment button clicked!");
          console.log("Username text:", usernameText);
          const blockedCommenters = _GM_getValue("blockedCommenter", []);
          console.log("Blocked commenters (before):", blockedCommenters);
          if (!blockedCommenters.includes(usernameText)) {
            blockedCommenters.unshift(usernameText);
            console.log("Blocked commenters (after adding):", blockedCommenters);
            _GM_setValue("blockedCommenter", blockedCommenters);
            console.log("GM_setValue called.");
            processCommentNode(commentTarget);
            console.log("processCommentNode called.");
            scheduleProcessDOM(document.querySelectorAll(COMMENT_SELECTORS));
            console.log("scheduleProcessDOM called.");
          }
          menu.remove();
        });
        menu.appendChild(blockCommentButton);
      }
    }
    if (menu.children.length > 0) {
      e.preventDefault();
      document.body.appendChild(menu);
      menu.style.left = `${e.clientX}px`;
      menu.style.top = `${e.clientY}px`;
      document.addEventListener("click", (event) => {
        if (!menu.contains(event.target)) {
          menu.remove();
        }
      }, { once: true });
    }
  });
  function initialize() {
    initializeContextMenu();
    scheduleProcessDOM();
  }
  const observer = new MutationObserver((mutations) => {
    const nodesToProcess = /* @__PURE__ */ new Set();
    for (const mut of mutations) {
      if (!mut.addedNodes.length) continue;
      for (const node of mut.addedNodes) {
        if (node.nodeType !== 1) continue;
        const element = node;
        if (element.matches(COMMENT_SELECTORS) || element.querySelector(COMMENT_SELECTORS)) {
          nodesToProcess.add(element);
          element.querySelectorAll(COMMENT_SELECTORS).forEach((n) => nodesToProcess.add(n));
        }
      }
    }
    if (nodesToProcess.size) {
      scheduleProcessDOM(nodesToProcess);
    }
  });
  window.addEventListener("load", initialize);
  window.addEventListener("yt-navigate-finish", () => {
    scheduleProcessDOM();
  });
  const originalPushState = history.pushState;
  history.pushState = function(state, title, url) {
    originalPushState.apply(history, [state, title, url]);
    scheduleProcessDOM();
  };
  window.addEventListener("unload", () => observer.disconnect());
  observer.observe(document.body, { childList: true, subtree: true });

})();
// ==UserScript==
// @name         Visual Username Hider Roblox
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides your username in browser
// @author       Xavior S
// @license MIT
// @match        https://www.roblox.com/*
// @match        https://*.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547664/Visual%20Username%20Hider%20Roblox.user.js
// @updateURL https://update.greasyfork.org/scripts/547664/Visual%20Username%20Hider%20Roblox.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- CONFIGURE THESE ---
  const newName = "";             // <-- If you change it roblox will crash
  let originalName = "";     // Do NOT change this or it will break
  // -----------------------
console.log('|RVUC Working 1.0|');

  const selectors = [
    '.text-overflow.age-bracket-label-username.font-caption-header',
    '.font-header-2.dynamic-ellipsis-item',
    '.MuiTypography-root.profile-header-username',
    '.MuiTypography-root.web-blox-css-tss-1sr4lqx-Typography-h1-Typography-root'
  ];

  function replaceUsernameInText(text) {
    if (text && text.includes(originalName)) {
      return text.split(originalName).join(newName);
    }
    return text;
  }

  function replaceUsernameInElement(el) {
    if (!el) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    const toChange = [];
    while (walker.nextNode()) {
      const txt = walker.currentNode;
      if (txt.nodeValue && txt.nodeValue.includes(originalName)) {
        toChange.push(txt);
      }
    }
    toChange.forEach(txt => {
      txt.nodeValue = replaceUsernameInText(txt.nodeValue);
    });
  }

  function changeUsernames() {
    if (!originalName) return;


    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => replaceUsernameInElement(el));
    });


    if (document.title && document.title.includes(originalName)) {
      document.title = replaceUsernameInText(document.title);
    }
  }

  function autoDetectOriginal() {
    if (originalName && originalName.length) return;
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.textContent && el.textContent.trim().length) {
        originalName = el.textContent.trim();
        return;
      }
    }
    if (document.title && document.title.trim().length) {
      originalName = document.title.trim();
    }
  }

  autoDetectOriginal();
  changeUsernames();

  let timer = null;
  const observer = new MutationObserver(() => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      autoDetectOriginal();
      changeUsernames();
    }, 50);
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
})();

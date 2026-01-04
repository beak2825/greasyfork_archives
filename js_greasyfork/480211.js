// ==UserScript==
// @name Twitter t.co to Direct Link Converter
// @name:zh-CN 推特 t.co 转直接链接
// @namespace http://tampermonkey.net/
// @version 1.6.0
// @description Automatically converts Twitter's indirect t.co links into direct, original URLs for a more transparent and streamlined browsing experience.
// @description:zh-CN 把推特的 t.co 中转跳转链接改为直接跳转
// @author CLDXiang
// @website https://github.com/CLDXiang/tampermonkey
// @license MIT
// @match *://*twitter.com/*
// @match *://*x.com/*
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/480211/Twitter%20tco%20to%20Direct%20Link%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/480211/Twitter%20tco%20to%20Direct%20Link%20Converter.meta.js
// ==/UserScript==

"use strict";
(() => {
  // src/twitter-link-converter/main.mts
  function modifyLink(link) {
    if (link.href.includes("t.co")) {
      let urlText = link.innerText;
      if (urlText.endsWith("\u2026"))
        urlText = urlText.slice(0, -1);
      if (urlText.startsWith("http"))
        link.href = urlText;
      else if (!urlText.startsWith("/"))
        link.href = `https://${urlText}`;
    }
  }
  function observeDOM() {
    try {
      new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node instanceof HTMLElement) {
                if (node instanceof HTMLAnchorElement)
                  modifyLink(node);
                else
                  node.querySelectorAll("a").forEach(modifyLink);
              }
            });
          }
        }
      }).observe(document.body, { childList: true, subtree: true });
    } catch (e) {
      console.log(e);
    }
  }
  document.querySelectorAll("a").forEach(modifyLink);
  observeDOM();
})();

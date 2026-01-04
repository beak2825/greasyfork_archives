// ==UserScript==
// @name               Weiblock
// @name:zh-CN         Weiblock
// @namespace          http://tampermonkey.net/
// @version            0.4
// @description        Block the annoying things on Weibo.
// @description:zh-CN  去除微博上烦人的东西。
// @author             lujjjh
// @include            https://weibo.com/*
// @include            https://*.weibo.com/*
// @grant              none
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/431611/Weiblock.user.js
// @updateURL https://update.greasyfork.org/scripts/431611/Weiblock.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const observer = new MutationObserver((mutations) => {
    for (let { type, addedNodes } of mutations) {
      if (type !== "childList") continue;
      for (let node of addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (node.parentNode) node = node.parentNode;
        // Uncheck the autoplay switch.
        node
          .querySelectorAll(".VideoList_switch_1-TPG .woo-switch-checked")
          .forEach((node) => node.click());
        // Show the comments by default.
        node
          .querySelectorAll(".Index_tabitem_17MDI:first-child > div")
          .forEach((node) => node.click());
        // Remove the annoying audio and popup when a video is finished.
        node
          .querySelectorAll(".AfterPatch_bg_34rqc")
          .forEach((node) => node.remove());
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();

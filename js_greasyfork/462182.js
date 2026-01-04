// ==UserScript==
// @name         屏蔽高德地图强制登录弹窗
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  屏蔽高德地图的登录弹窗
// @author       砍柴少侠
// @match        *://*.amap.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amap.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462182/%E5%B1%8F%E8%94%BD%E9%AB%98%E5%BE%B7%E5%9C%B0%E5%9B%BE%E5%BC%BA%E5%88%B6%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/462182/%E5%B1%8F%E8%94%BD%E9%AB%98%E5%BE%B7%E5%9C%B0%E5%9B%BE%E5%BC%BA%E5%88%B6%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==
(function () {
  const observer = new MutationObserver(function (mutations) {
    const mask = document.querySelector(".baxia-dialog.auto");
    const mask2 = document.querySelector(".sufei-dialog");

    mask?.remove();
    mask2?.remove();
  });

  observer.observe(document.body, { childList: true });

  // Your code here...
})();

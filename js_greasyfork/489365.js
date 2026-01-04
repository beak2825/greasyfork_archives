// ==UserScript==
// @name         B站中键修复
// @namespace    https://github.com/Zhuxb-Clouds/TamperScript
// @version      0.0.4
// @description  通过更改a标签的href属性，使得中键点击可以在新标签页打开视频。
// @author       Zhuxb
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489365/B%E7%AB%99%E4%B8%AD%E9%94%AE%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/489365/B%E7%AB%99%E4%B8%AD%E9%94%AE%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const targetMap = {
    "jump-link search-word": (item) => {
      return item.getAttribute("data-url");
    },
    "jump-link user": (item) => {
      return "https://space.bilibili.com/" + item.getAttribute("data-user-id");
    },
    "jump-link video": (item) => {
      return item.getAttribute("data-url");
    },
    "header-entry-avatar": (item) => {
      // 删除所有的参数
      const url = new URL(item.href);
      return url.origin + url.pathname;
    },
    "up-avatar": (item) => {
      // 删除所有的参数
      const url = new URL(item.href);
      return url.origin + url.pathname;
    },
  };
  setInterval(function () {
    Object.keys(targetMap).forEach((key) => {
      var elements = document.getElementsByClassName(key);
      if (elements.length === 0) return;
      elements = Array.from(elements);
      elements.forEach((item) => {
        if (item.href) return;
        item.href = targetMap[key](item);
        item.target = "_blank";
      });
    });
  }, 5000);
})();

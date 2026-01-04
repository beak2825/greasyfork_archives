// ==UserScript==
// @name:zh-CN   Bilibili 重置视频列表高度
// @name         Bilibili reset video content list height
// @namespace    https://xinlu.ink/
// @version      1.0.0
// @description:zh-CN  重置 Bilibili 视频列表高度
// @description  Reset Bilibili video content list height
// @match        https://www.bilibili.com/*
// @author       Nicholas Hsiang
// @icon         https://xinlu.ink/favicon.ico
// @license MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/447977/Bilibili%20reset%20video%20content%20list%20height.user.js
// @updateURL https://update.greasyfork.org/scripts/447977/Bilibili%20reset%20video%20content%20list%20height.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let loaded = false;
  let el = [];

  function listener() {
    if (el.length === 0) return;

    let height = 0;

    el.forEach((item) => {
      const top = item.getBoundingClientRect().top;
      const scrollTop = document.documentElement.scrollTop;
      height = top + scrollTop + 100;
      console.log('height: %o', height);
      item.style.height = `auto`;
      item.style.maxHeight = `calc(100vh - ${height}px)`;
    });
    // prettier-ignore
    const style = `.cur-list, .video-sections-content-list { height: auto !important; max-height: calc(100vh - ${height}px) }`;
    GM_addStyle(style);
  }

  const timer = setInterval(() => {
    el = [...document.querySelectorAll('.cur-list, .video-sections-content-list')];
    if (el.length > 0) {
      loaded = true;
    }

    if (loaded) {
      listener();
      clearInterval(timer);
    }
  }, 1000);

  // Your code here...
})();

// ==UserScript==
// @name         获取哔哩哔哩高清图片
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Ctrl+右键图片在新标签页打开高清图片，如果未指向图片则尝试打开本页的高清封面。
// @author       Mouse0w0
// @license      MIT
// @match        *://*.bilibili.com/*
// @match        *://*.biligame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/465197/%E8%8E%B7%E5%8F%96%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%AB%98%E6%B8%85%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/465197/%E8%8E%B7%E5%8F%96%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%AB%98%E6%B8%85%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
  'use strict';

  document.addEventListener('mousedown', function(e) {
    // Ctrl+右键在新标签页打开高清图片
    if (!(e.ctrlKey && e.button === 2)) return;

    let target = e.target;
    // 支持ShadowRoot
    while (target.shadowRoot) {
      let newTarget = target.shadowRoot.elementFromPoint(e.clientX, e.clientY)
      if (newTarget === target) {
        break
      }
      target = newTarget
    }

    // 从IMG标签中获取图片
    if (target.tagName === 'IMG') {
      openImage(target.src);
      return;
    }

    // 从背景图片中获取图片
    let bgimg = target.style.backgroundImage;
    if (bgimg) {
      openImage(bgimg.slice(5, -2));
      return;
    }

    // 从消息遮罩中获取图片
    // 1.获取指向的链接
    let a = target;
    while (a !== null && a.tagName !== 'A') {
      a = a.parentNode;
    }
    // 2.获取链接的图片
    if (a != null) {
      let img = a.querySelector('img');
      if (img !== null) {
        openImage(img.src);
        return;
      }
    }

    // 如果获取不到指向的图片，尝试获取本页面的封面
    // 从Meta信息中获取封面
    let metaimg;
    metaimg = document.querySelector('meta[itemprop="image"]');
    if (metaimg !== null) {
      openImage(metaimg.content);
      return;
    }
    metaimg = document.querySelector('meta[property="og:image"]');
    if (metaimg !== null) {
      openImage(metaimg.content);
      return;
    }

    // 获取直播间封面
    if (typeof __NEPTUNE_IS_MY_WAIFU__ !== 'undefined') {
      openImage(__NEPTUNE_IS_MY_WAIFU__.roomInfoRes.data.room_info.cover);
      return;
    }
  });

  function openImage(url) {
    url = substringBefore(url, '@');
    GM_openInTab(url, true);
  }

  function substringBefore(str, before) {
    let idx = str.indexOf(before);
    return idx != -1 ? str.slice(0, idx) : str;
  }
})();
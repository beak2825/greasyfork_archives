// ==UserScript==
// @name         度盘爆炸自动刷新
// @namespace    moe.jixun
// @version      1.0
// @description  度盘爆炸的时候自动刷新其页面。
// @author       Jixun
// @include      https://pan.baidu.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/373525/%E5%BA%A6%E7%9B%98%E7%88%86%E7%82%B8%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/373525/%E5%BA%A6%E7%9B%98%E7%88%86%E7%82%B8%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

addEventListener('DOMContentLoaded', () => {
  const msg = document.querySelector('.msg');
  if (msg && msg.textContent.trim().includes('百度网盘正在升级中')) {
    location.reload();
  }
});
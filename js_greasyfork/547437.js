// ==UserScript==
// @name         SJTU去水印
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  去水印
// @match        https://feedback.sjtu.edu.cn/**
// @match        https://my.sjtu.edu.cn/ai/ui/chat/**
// @match        https://mobile.weixiao.ct-study.com.cn/**
// @match        https://wj.sjtu.edu.cn/**
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547437/SJTU%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/547437/SJTU%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const style = document.createElement('style');
  style.innerHTML = `
  div[style*="data:image/png"] {
    transform: scale(0) !important;
    pointer-events: none !important;
  }`;
  document.head.appendChild(style);
})();

// ==UserScript==
// @name         1稿定设计去水印
// @namespace    https://github.com/maqi1520
// @version      0.82
// @description  1稿定设计去水印插件
// @author       liangchaofei
// @match        https://*.gaoding.com/design*
// @match        https://*.gaoding.com/design/video?id=*
// @match        https://*.gaoding.com/odyssey/design*
// @match        https://*.gaoding.com/editor/design*
// @match        https://g.h5gd.com/p/*
// @icon         https://www.gaoding.com/favicon.ico
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480021/1%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/480021/1%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
GM_addStyle(`.editor-watermark{position:static!important;z-index:-999!important} .editor-background,.editor-element{z-index:10}  .player .watermark{opacity:0} .remove-watermark-tip,.editor-remove-watermark,.remove-watermark{display:none!important}`);
const button = document.createElement("button");
button.innerText = "去水印";
button.className = "editor-right-actions__button gda-btn gda-btn-secondary";
button.onclick = () => {
  document.querySelector("div.remove-watermark").style.display = "none";
  document.querySelectorAll(".editor-watermark").forEach((item) => {
    item.style.zIndex = -999;
  });
};
 
setTimeout(() => {
  document
    .querySelector(".editor-right-actions")
    .insertBefore(
      button,
      document.querySelector(".editor-right-actions__button")
    );
}, 3000);
 
 
})();
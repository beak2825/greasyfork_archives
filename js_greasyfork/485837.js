// ==UserScript==
// @name         阿里巴巴1688拦截弹窗
// @namespace    http://dol.noads.biz/
// @version      0.2
// @description  移动端拦截阿里巴巴1688网页弹窗
// @author       Dolphin
// @run-at       document-idle
// @match        https://*.1688.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485837/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B41688%E6%8B%A6%E6%88%AA%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/485837/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B41688%E6%8B%A6%E6%88%AA%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.getElementsByClassName("main")[0].style.display = "none";
  if (location.pathname.startsWith("/offer/")) document.querySelector("div:first-of-type").style.display="none";
})();
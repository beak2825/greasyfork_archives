// ==UserScript==
// @name         过滤iviewui的广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       shenchao
// @match        https://www.iviewui.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382015/%E8%BF%87%E6%BB%A4iviewui%E7%9A%84%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/382015/%E8%BF%87%E6%BB%A4iviewui%E7%9A%84%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
  'use strict';
  window.history.pushState = function () {
    setTimeout(function () {
      var child = document.querySelector('body > div:nth-child(1) > div:nth-child(1) > div.wrapper > div.wrapper-container > div.wrapper-container-tip-out');
      child.style.display = 'none'
    }, 10)
  }
  setTimeout(function () {
    var child = document.querySelector('body > div:nth-child(1) > div:nth-child(1) > div.wrapper > div.wrapper-container > div.wrapper-container-tip-out');
    child.style.display = 'none'
  },100)
})();
// ==UserScript==
// @name         link cleaner: Bilibili v2
// @description  移除Bilibili影片網址的追蹤碼
// @author       KamiyaMinoru
// @match        https://www.bilibili.com/*
// @run-at       document-start
// @license      MIT
// @version 0.0.1.20230327074020
// @namespace https://greasyfork.org/users/1044461
// @downloadURL https://update.greasyfork.org/scripts/462110/link%20cleaner%3A%20Bilibili%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/462110/link%20cleaner%3A%20Bilibili%20v2.meta.js
// ==/UserScript==

(function() {
  var cU = window.location.href;
  var videoId = cU.match(/\/video\/[^/]+/)[0];
  cU = videoId + '?vd_source=0';
  window.history.replaceState({}, '', cU);
})();

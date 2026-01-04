// ==UserScript==
// @name         link cleaner: Bilibili v1
// @description  移除Bilibili影片網址的追蹤碼
// @author       KamiyaMinoru
// @match        https://www.bilibili.com/*
// @run-at       document-start
// @license      MIT
// @version 0.0.1.20230319050603
// @namespace https://greasyfork.org/users/1044461
// @downloadURL https://update.greasyfork.org/scripts/462109/link%20cleaner%3A%20Bilibili%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/462109/link%20cleaner%3A%20Bilibili%20v1.meta.js
// ==/UserScript==

(function() {

var cU = window.location.href;
var re = /(https:\/\/www\.bilibili\.com\/video\/[^\/]+)\/.*/i;
var match = cU.match(re);
if (match !== null) {
  var nU = match[1];
  var newUrl = nU + '/?vd_source=0';
  window.history.replaceState({}, '', newUrl);
}

})();
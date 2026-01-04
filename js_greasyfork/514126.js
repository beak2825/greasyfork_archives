// ==UserScript==
// @name         谷歌 cn 重定向
// @version      0.0.1
// @description  自动从 google.cn 跳转到 google.com
// @match        *://*.google.cn/*
// @run-at       document-start
// @noframes
// @namespace https://greasyfork.org/users/1386584
// @downloadURL https://update.greasyfork.org/scripts/514126/%E8%B0%B7%E6%AD%8C%20cn%20%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/514126/%E8%B0%B7%E6%AD%8C%20cn%20%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const url = new URL(location);
  url.hostname = 'www.google.com';
  location.replace(url);
})();
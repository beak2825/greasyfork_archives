// ==UserScript==
// @name         Bilibili 主站重定向
// @namespace    https://www.imbytecat.com/
// @version      1.2.3
// @description  将形如「/s/video/*」的链接重定向至「/video/*」
// @author       imbytecat
// @match        *://*.bilibili.com/s/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448356/Bilibili%20%E4%B8%BB%E7%AB%99%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/448356/Bilibili%20%E4%B8%BB%E7%AB%99%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(() => {
  const re = /^(http|https):\/\/(www.)?bilibili.com\/s\/video\/.+/;
  const url = new URL(location.href);
  if (re.test(url.href)) {
    window.stop();
    url.pathname = url.pathname.replace(/\/s/, "");
    location.replace(url);
  }
})();

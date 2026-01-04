// ==UserScript==
// @name         移除网址中的锚点
// @version      0.0.2
// @description  Remove hash from URL, such as Douban group.
// @description:zh-cn  移除网址中的锚点，例如豆瓣小组。
// @author       binsee
// @namespace    https://github.com/binsee/tampermonkey-scripts
// @supportURL   https://github.com/binsee/tampermonkey-scripts/issues
// @license      GPL
// @noframes
// @match        *://www.douban.com/group/topic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437102/%E7%A7%BB%E9%99%A4%E7%BD%91%E5%9D%80%E4%B8%AD%E7%9A%84%E9%94%9A%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/437102/%E7%A7%BB%E9%99%A4%E7%BD%91%E5%9D%80%E4%B8%AD%E7%9A%84%E9%94%9A%E7%82%B9.meta.js
// ==/UserScript==

(function () {
  'use strict';
  setTimeout(function () {
    if (window.history.replaceState) {
      window.history.replaceState(null, null, '#');
    } else {
      window.location.replace('#');
    }
  }, 500);
})();
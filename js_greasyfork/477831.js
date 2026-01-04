// ==UserScript==
// @name         豆瓣预告片优化
// @namespace    https://github.com/cloudylong/
// @version      1.0
// @description  优化豆瓣预告片的浏览体验
// @author       Walter
// @match        https://movie.douban.com/trailer/*
// @icon         https://img3.doubanio.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477831/%E8%B1%86%E7%93%A3%E9%A2%84%E5%91%8A%E7%89%87%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/477831/%E8%B1%86%E7%93%A3%E9%A2%84%E5%91%8A%E7%89%87%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 0.0（静音）~ 1.0（最大音量）
  document.querySelector("video").volume = 0.3;
})();

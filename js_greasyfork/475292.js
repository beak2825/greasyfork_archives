// ==UserScript==
// @name         BiliBili No Watermark
// @version      1.0
// @description  Video Tool
// @author       normankr07
// @homepageURL  https://github.com/KNN-07
// @match        https://www.bilibili.tv/*
// @namespace https://greasyfork.org/users/1172980
// @downloadURL https://update.greasyfork.org/scripts/475292/BiliBili%20No%20Watermark.user.js
// @updateURL https://update.greasyfork.org/scripts/475292/BiliBili%20No%20Watermark.meta.js
// ==/UserScript==

(function () {
  function Add_Style(css) {
    const style = document.getElementById("usercssStyle") || (function () {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.id = "usercssStyle";
      document.head.appendChild(style);
      return style;
    })();
    const sheet = style.sheet;
    sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
  }
  Add_Style(`
        .ip-watermark, .video-watermark {
            display: none !important;
        }
    `);
})();
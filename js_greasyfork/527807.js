// ==UserScript==
// @name         ITLaoQi Course Page Cleaner
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  清理IT老齐课程页面的冗余内容
// @author       Tandy
// @match      https://www.itlaoqi.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527807/ITLaoQi%20Course%20Page%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/527807/ITLaoQi%20Course%20Page%20Cleaner.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    .el-header {
      display: none !important;
    }
    .el-main {
      margin-top: 0 !important;
      padding-top: 0 !important;
    }
    #video-box {
      margin-top: 10px !important;
    }
  `;
  document.head.appendChild(style);
})();
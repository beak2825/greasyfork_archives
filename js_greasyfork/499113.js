// ==UserScript==
// @name         有道翻译页面简化
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  简化有道翻译网页页面，删除不需要的东西，只保留最重要的功能区域
// @author       quackxl
// @match        *://fanyi.youdao.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499113/%E6%9C%89%E9%81%93%E7%BF%BB%E8%AF%91%E9%A1%B5%E9%9D%A2%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/499113/%E6%9C%89%E9%81%93%E7%BF%BB%E8%AF%91%E9%A1%B5%E9%9D%A2%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  _GM_addStyle(`
    .top-banner-wrap,
    .action-item,
    .action-line,
    .tab-item,
    .sidebar-container,
    .document-upload-entrance-container,
    .dict-website-footer {
      display: none !important;
    }
    .open-login-page {
      display: block !important;
    }
  `);
})();
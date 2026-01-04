// ==UserScript==
// @name         es6.ruanyifeng
// @namespace    ziggy chen
// @license MIT
// @version      1.2
// @description  es6 文档 script
// @author       Ziggy chen
// @match        *://es6.ruanyifeng.com/*
// @icon         https://es6.ruanyifeng.com/favicon.ico
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/452601/es6ruanyifeng.user.js
// @updateURL https://update.greasyfork.org/scripts/452601/es6ruanyifeng.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // content 高度  800
  GM_addStyle(
    "@media (min-width: 40rem) { #content { width: 800px !important; }}"
  );
  GM_addStyle(
    "#back_to_top { right: 25px!important;margin-left: 0 !important;}"
  );
  GM_addStyle("#edit { right: 25px!important;margin-left: 0 !important;}");
  GM_addStyle("#theme { right: 25px!important;margin-left: 0 !important;}");
})();

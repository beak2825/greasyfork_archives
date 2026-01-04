// ==UserScript==
// @name         Douban login nomore!
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Avoid Douban login popup
// @include      https://www.douban.com/
// @match        https://www.douban.com/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/40238/Douban%20login%20nomore%21.user.js
// @updateURL https://update.greasyfork.org/scripts/40238/Douban%20login%20nomore%21.meta.js
// ==/UserScript==

(function () {
  'use strict';
  Douban.init_show_login = () => {
    if ($.overlay) $.overlay.close();
  };
})();
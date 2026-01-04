// ==UserScript==
// @name         Bilibili - 防止在首页下拉刷新时被要求登录
// @namespace    https://bilibili.com/
// @version      0.1
// @description  防止在首页下拉刷新时被要求登录
// @license      GPL-3.0
// @author       DD1969
// @match        https://www.bilibili.com/
// @icon         https://www.bilibili.com/favicon.ico
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/487594/Bilibili%20-%20%E9%98%B2%E6%AD%A2%E5%9C%A8%E9%A6%96%E9%A1%B5%E4%B8%8B%E6%8B%89%E5%88%B7%E6%96%B0%E6%97%B6%E8%A2%AB%E8%A6%81%E6%B1%82%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/487594/Bilibili%20-%20%E9%98%B2%E6%AD%A2%E5%9C%A8%E9%A6%96%E9%A1%B5%E4%B8%8B%E6%8B%89%E5%88%B7%E6%96%B0%E6%97%B6%E8%A2%AB%E8%A6%81%E6%B1%82%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  // no need to continue this script if user has logged in
  if (document.cookie.includes('DedeUserID')) return;

  // remove 'buvid3' from cookie everytime when trying to fetch recommand video data
  const originFetch = unsafeWindow.fetch;
  unsafeWindow.fetch = function () {
    if (typeof arguments[0] === 'string' && arguments[0].includes('top/feed/rcmd')) {
      document.cookie = `buvid3=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.bilibili.com;path=/`;
    }
    return originFetch.apply(this, arguments);
  }

})();
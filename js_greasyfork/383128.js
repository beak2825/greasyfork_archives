// ==UserScript==
// @name         反阮一峰博客的广告屏蔽器检测
// @namespace    tokumeiaka
// @version      0.1
// @description  覆盖 getComputedStyle 来防止脚本检测出广告被屏蔽
// @author       tokumeiaka
// @run-at       document-start
// @match        *://www.ruanyifeng.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383128/%E5%8F%8D%E9%98%AE%E4%B8%80%E5%B3%B0%E5%8D%9A%E5%AE%A2%E7%9A%84%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E5%99%A8%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/383128/%E5%8F%8D%E9%98%AE%E4%B8%80%E5%B3%B0%E5%8D%9A%E5%AE%A2%E7%9A%84%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E5%99%A8%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let origFunc = window.getComputedStyle

  window.getComputedStyle = function (x) {
    let res = {}
    Object.assign(res, origFunc(x));

    if (res.display === "none") {
      res.display = "block"
    }

    return res
  }
})();
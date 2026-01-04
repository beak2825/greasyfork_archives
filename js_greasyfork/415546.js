// ==UserScript==
// @name        （已失效）天翼云盘免登录下载
// @description 无需登录下载天翼云盘分享链接
// @namespace   https://greasyfork.org/users/197529
// @version     0.0.1
// @author      kkocdko
// @license     Unlicense
// @match       *://cloud.189.cn/*
// @downloadURL https://update.greasyfork.org/scripts/415546/%EF%BC%88%E5%B7%B2%E5%A4%B1%E6%95%88%EF%BC%89%E5%A4%A9%E7%BF%BC%E4%BA%91%E7%9B%98%E5%85%8D%E7%99%BB%E5%BD%95%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/415546/%EF%BC%88%E5%B7%B2%E5%A4%B1%E6%95%88%EF%BC%89%E5%A4%A9%E7%BF%BC%E4%BA%91%E7%9B%98%E5%85%8D%E7%99%BB%E5%BD%95%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
"use strict";

const timer = setInterval(() => {
  try {
    Object.defineProperty(
      (this.unsafeWindow || window).application.headerView,
      "isLogin",
      { get: () => true }
    );
    clearInterval(timer);
  } catch (_) {}
}, 500);

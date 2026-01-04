// ==UserScript==
// @name         自动打开钉钉文档
// @description  自动打开 zyb钉钉文档
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       Assan
// @match        *://etable.zuoyebang.cc/ding-auth/*
// @match        *://applink.dingtalk.com/page/link?url=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zuoyebang.cc
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544275/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E9%92%89%E9%92%89%E6%96%87%E6%A1%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/544275/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E9%92%89%E9%92%89%E6%96%87%E6%A1%A3.meta.js
// ==/UserScript==

(function () {
  'use strict';

  window.addEventListener('load', onWaitLoaded, false);
  window.addEventListener('hashchange', onWaitLoaded, false);
  function onWaitLoaded() {
    setTimeout(() => {
      const btn = document.querySelector(
        '.page-content .pc-style-content .line .van-button__content',
      );
      btn && btn.click();
    }, 100);

    // 关闭窗口
    setTimeout(() => {
      window.close();
    }, 1000);
  }
})();
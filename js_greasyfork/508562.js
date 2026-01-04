// ==UserScript==
// @name         自动刷新页面
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  每隔一段时间自动刷新页面，可自定义刷新间隔时间(ms)，适合挂机、PT 等需要保持心跳的网页
// @author       ginga
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508562/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/508562/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let time;

  config(loop);

  // 配置
  function config(callback) {
    if (!sessionStorage.oixmRefreshTime) {
      time = parseInt(prompt("请设置要自动刷新的间隔时间（ms）：", 1000));
      if (isNaN(time)) return;
      sessionStorage.oixmRefreshTime = time;
    } else {
      time = parseInt(sessionStorage.oixmRefreshTime);
    }
    callback();
  }

  // 循环时间
  function loop() {
    setTimeout(location.reload, time);
  }
})();

// ==UserScript==
// @name         自动安装插件2
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在 greasyfork 自动安装插件
// @author       AbsMatt
// @match        https://greasyfork.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493837/%E8%87%AA%E5%8A%A8%E5%AE%89%E8%A3%85%E6%8F%92%E4%BB%B62.user.js
// @updateURL https://update.greasyfork.org/scripts/493837/%E8%87%AA%E5%8A%A8%E5%AE%89%E8%A3%85%E6%8F%92%E4%BB%B62.meta.js
// ==/UserScript==
function syncSleep(time) {
    const start = new Date().getTime();
    while (new Date().getTime() - start < time) {}
  }
  (function() {
      'use strict';
      syncSleep(1000);
      document.querySelector("#install-area > a.install-link").click();
      window.close();
  })();
// ==UserScript==
// @name         hack csdn more btn
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  令人讨厌的CSDN查看更多按钮，破解，自动点击。2023年01月09日
// @author       Whidy
// @match        https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457883/hack%20csdn%20more%20btn.user.js
// @updateURL https://update.greasyfork.org/scripts/457883/hack%20csdn%20more%20btn.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const intervalDelay = 100; // ms
  const btnClassName = ".hide-preCode-bt"; // 可能未来会发生变化，不定期调整！
  let maxTimeout = 3000; // ms
  let duration = 0;
  let timer = setInterval(() => {
    duration += intervalDelay;
    let fuckTheBtn = document.querySelectorAll(btnClassName);
    if (fuckTheBtn.length) {
      fuckTheBtn.forEach((el) => {
        el.click();
      });
      clearInterval(timer);
    }
    if (duration > maxTimeout) {
      // 超时强制清除计时器
      clearInterval(timer);
    }
  }, intervalDelay);
})();

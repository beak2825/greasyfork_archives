// ==UserScript==
// @name         Bilibili 倍速播放
// @namespace    https://github.com/cloudylong/
// @version      1.0
// @description  增加B站的倍速播放选项
// @author       Walter
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477832/Bilibili%20%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/477832/Bilibili%20%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 监听倍速列表的生成
  const intervalID = setInterval(() => {
    // 查找2倍速选项
    const rate_2 = document.querySelector(
      "li.bpx-player-ctrl-playbackrate-menu-item"
    );
    if (rate_2) {
      // 移除定时器
      clearInterval(intervalID);

      // 动态生成3倍速选项
      const rate_3 = rate_2.cloneNode(false);
      rate_3.setAttribute("data-value", "3");
      rate_3.innerText = "3.0x";
      rate_2.parentElement.insertBefore(rate_3, rate_2);
    }
  }, 200);
})();

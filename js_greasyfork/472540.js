// ==UserScript==
// @name         GlaDOS自动签到脚本 - GlaDOS Auto Check-in
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  GlaDOS签到自动化脚本 - GlaDOS Auto Check-in
// @author       溪枫
// @match        https://glados.one/console/checkin
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      GPL-3.0 License
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/472540/GlaDOS%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E8%84%9A%E6%9C%AC%20-%20GlaDOS%20Auto%20Check-in.user.js
// @updateURL https://update.greasyfork.org/scripts/472540/GlaDOS%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E8%84%9A%E6%9C%AC%20-%20GlaDOS%20Auto%20Check-in.meta.js
// ==/UserScript==

function formattedDateStringOfToday() {
  let today = new Date();
  return today.toISOString().split("T")[0];
}

(function () {
  "use strict";

  // Your code here...
  let todayStr = formattedDateStringOfToday();
  let cachedDate = GM_getValue("lastCheckinDate");
  if (cachedDate === todayStr) {
    console.dir("今天已签到");
    return;
  }

  // 签到页
  let maxRetryTimes = 60;
  let retryTimes = 0;
  let retryInterval = setInterval(() => {
    retryTimes += 1;
    const checkinButton = document.querySelector(".ui.green.huge.button") || document.querySelector(".ui.positive.button");
    if (checkinButton != null) {
      checkinButton.click();
      console.dir("已点击签到");
      clearInterval(retryInterval);
      GM_setValue("lastCheckinDate", todayStr);
    } else if (retryTimes >= maxRetryTimes) {
      clearInterval(retryInterval);
      console.dir("重试次数太多，已放弃签到");
    }
  }, 1500);
})();

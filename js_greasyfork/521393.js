// ==UserScript==
// @name         统计B站合集总时长
// @namespace    http://tampermonkey.net/
// @version      2024-12-13
// @description  统计B站合集总时长,l啦啦啦
// @author       happyfe呀
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @require     https://code.jquery.com/jquery-3.7.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521393/%E7%BB%9F%E8%AE%A1B%E7%AB%99%E5%90%88%E9%9B%86%E6%80%BB%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/521393/%E7%BB%9F%E8%AE%A1B%E7%AB%99%E5%90%88%E9%9B%86%E6%80%BB%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==

(function () {
  "use strict";
  function timeStringToSeconds(timeString) {
    const parts = timeString.split(":").map(Number);
    if (parts.length === 3) {
      // 格式为 HH:MM:SS
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      // 格式为 MM:SS
      return parts[0] * 60 + parts[1];
    } else {
      throw new Error("Invalid time format");
    }
  }

  function secondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  var totalSeconds = 0;
  setTimeout(() => {
    $(".stat-item.duration").each(function () {
      var duration = $(this).text().trim();
      // console.log(duration);
      totalSeconds += timeStringToSeconds(duration);
      console.log(secondsToTime(totalSeconds));
      
    });

    $(".video-pod__header").append(
        `<span style="color:red;font-size:20px;">合集时长:${secondsToTime(
          totalSeconds
        )}</span>`
      );
  }, 2000);
})();
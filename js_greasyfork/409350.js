// ==UserScript==
// @name         油管自动单曲循环
// @namespace    http://tampermonkey.net/
// @version      0.131
// @description  油管自动单曲循环，用来听歌挺爽的
// @author       You
// @match        https://www.youtube.com/*
// @match        http://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409350/%E6%B2%B9%E7%AE%A1%E8%87%AA%E5%8A%A8%E5%8D%95%E6%9B%B2%E5%BE%AA%E7%8E%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/409350/%E6%B2%B9%E7%AE%A1%E8%87%AA%E5%8A%A8%E5%8D%95%E6%9B%B2%E5%BE%AA%E7%8E%AF.meta.js
// ==/UserScript==


// 
(function () {
  "use strict";

  const timer = setInterval(function () {
    const button = document.getElementsByClassName(
      "ytp-play-button ytp-button ytp-play-button-playlist"
    )[0];
    var date = new Date();
    let cutime = date.getHours() + "-" + date.getMinutes();

    if (button) {
      if (button.getAttribute("title") === "重放") {
        button.click();
      }
      console.log("find the button");
      console.log("video is playing");
    } else {
      console.log(cutime + "不存在");
    }
  }, 1000);
})();

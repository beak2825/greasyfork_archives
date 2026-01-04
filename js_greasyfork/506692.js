// ==UserScript==
// @name         网大 无限多开
// @namespace    http://tampermonkey.net/
// @version      2024-09-03
// @description  sssssdddd
// @author       You
// @license      MIT
// @match        https://wangda.chinamobile.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506692/%E7%BD%91%E5%A4%A7%20%E6%97%A0%E9%99%90%E5%A4%9A%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/506692/%E7%BD%91%E5%A4%A7%20%E6%97%A0%E9%99%90%E5%A4%9A%E5%BC%80.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 防止暂停
  setInterval(function () {
    if ($(".vjs-play-control").length != 1) {
      return;
    }
    if ($(".vjs-play-control")[0].innerText == "播放") {
      $(".vjs-play-control").click();
    }
  }, 5000);

  // 屏蔽多开限制
  const originalOpen = loadjs.d;
  loadjs.d = function (...args) {
    const djs = args[0];
    if (djs != "./app/study/course/detail/player-helper") {
      return originalOpen.apply(this, args);
    }
    const fun = args[1];

    // hook fun
    try {
      args[1] = function (...args) {
        const result = fun.apply(this, args);
        console.log(args[1].exports.WS);
        args[1].exports.WS.multipleClientStudy = function () {};
        args[1].exports.WS.closeConnect = function () {};
        args[1].exports.WS.otherClientStudy = function () {};
        return result;
      };
    } catch (e) {}
    return originalOpen.apply(this, args);
  };
})();

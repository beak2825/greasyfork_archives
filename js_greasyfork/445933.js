// ==UserScript==
// @name        [嗨皮漫畫]快速前往下一話
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  按下N鍵 直接前往下一話，不用滾到最底下
// @author       dpes8693
// @match        https://m.happymh.com/reads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=phpied.com
// @grant        none
// @noframes
// @supportURL  https://home.gamer.com.tw/profile/index.php?owner=dpes5407
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445933/%5B%E5%97%A8%E7%9A%AE%E6%BC%AB%E7%95%AB%5D%E5%BF%AB%E9%80%9F%E5%89%8D%E5%BE%80%E4%B8%8B%E4%B8%80%E8%A9%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/445933/%5B%E5%97%A8%E7%9A%AE%E6%BC%AB%E7%95%AB%5D%E5%BF%AB%E9%80%9F%E5%89%8D%E5%BE%80%E4%B8%8B%E4%B8%80%E8%A9%B1.meta.js
// ==/UserScript==

(function () {
  "use strict";
  document.onkeydown = function (e) {
    var elm = document.querySelector(".jss69");
    if (!elm) {
      return;
    } else {
      var link = elm.children[0].href;
    }
    var keyNum = window.event ? e.keyCode : e.which;
    if (keyNum == 78) {
      if (link) {
        window.location.href = link;
      } else {
        alert("條件不符合!");
      }
    }
  };
})();
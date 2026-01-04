// ==UserScript==
// @name         培训宝挂机工具
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  fuck the z*soft of fking pxb
// @author       RaYa
// @match        https://m.taoke.com//front_new/pxb/webapp/html/student/student.html*
// @grant        none
// @license MIT
// 用于反抗培训宝的挂机检测，方便多开视频进行后台挂机
// ==UserScript==
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/435734/%E5%9F%B9%E8%AE%AD%E5%AE%9D%E6%8C%82%E6%9C%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/435734/%E5%9F%B9%E8%AE%AD%E5%AE%9D%E6%8C%82%E6%9C%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function() {
"use strict";

setInterval(function () {
  document.getElementsByClassName("mint-msgbox-confirm")[0].click();
}, 5000);
setInterval(function () {
  var t = this;
  if (null != t.player) t.player.show(), t.player.play(), t.isPlay = !0;else {
    var e = document.querySelector("#videoplayer video,#videoplayer audio");
    e && e.play();
  }
}, 100);


})();
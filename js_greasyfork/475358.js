// ==UserScript==
// @name         自动登录笔趣阁
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动登录我的笔趣阁
// @author       You
// @match        https://www.biquge.co/
// @license      GPL License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475358/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E7%AC%94%E8%B6%A3%E9%98%81.user.js
// @updateURL https://update.greasyfork.org/scripts/475358/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E7%AC%94%E8%B6%A3%E9%98%81.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var user = "maxiaofei";
  var pwd = "fei19981115";

  if (!document.querySelector("#username")) {
    //没有找到表示登录了,不再执行后续代码
    return;
  }
  //未登录,执行登录代码

  document.querySelector("#username").value = user;
  document.querySelector("#password").value = pwd;
  document.querySelector(".frii input").click();
})();

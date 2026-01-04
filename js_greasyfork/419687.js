// ==UserScript==
// @name         小编你🐎呢？
// @namespace    http://moe.jimmy0w0.me/others/org/xiaobianSTFU/
// @version      0.1
// @description  闭嘴啊臭傻逼
// @author       国际压制小编联合组织
// @match        http*://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419687/%E5%B0%8F%E7%BC%96%E4%BD%A0%F0%9F%90%8E%E5%91%A2%EF%BC%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/419687/%E5%B0%8F%E7%BC%96%E4%BD%A0%F0%9F%90%8E%E5%91%A2%EF%BC%9F.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...

  const occurrenceTimes =
    document.documentElement.outerText.split("小编").length - 1;

  if (occurrenceTimes >= 3) {
    if (
      confirm(
        "我们检测到该文章内小编一词出现了三次或者超过三次，疑似垃圾文章，建议关闭"
      )
    ) {
      window.location.href =
        "https://api.jikipedia.com/upload/2cbe24b76fcbc7d860a21a77fe5e5c5b_scaled.jpg";
    }
  }
})();

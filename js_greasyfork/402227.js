// ==UserScript==
// @name         知乎免除登录
// @namespace    https://www.zhihu.com/
// @version      0.2
// @description  关闭登录提示
// @author       lin xin
// @match        *://*.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402227/%E7%9F%A5%E4%B9%8E%E5%85%8D%E9%99%A4%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/402227/%E7%9F%A5%E4%B9%8E%E5%85%8D%E9%99%A4%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

  (function () {
    document
      .querySelector("body")
      .addEventListener("DOMNodeInserted", function (e) {
        var obj = document.getElementsByClassName("Button Modal-closeButton Button--plain")[0];
        if (typeof obj != "undefined") {
          obj.click();
        }
      });
  })();
// ==UserScript==
// @tampermonkey-safari-promotion-code-request
// @name         Vim for 微信读书
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  按j可以向后翻页，按L键向前翻页
// @author       Kodakolor
// @match        https://weread.qq.com/*
// @icon         https://rescdn.qqmail.com/node/wr/wrpage/style/images/independent/favicon/favicon_16h.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518218/Vim%20for%20%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/518218/Vim%20for%20%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6.meta.js
// ==/UserScript==

(function () {
  "use strict";
  window.addEventListener("keypress", (e) => {
    switch (e.code) {
      case "KeyL":
        document
          .querySelector("button.renderTarget_pager_button_right")
          .click();
        break;
      case "KeyJ":
        document
          .querySelector("button.renderTarget_pager_button")
          .click();
        break;
      default:
    }
  });
  const style = document.createElement("style");
  style.innerText = ".reader_pdf_tool { display: none !important }";
  document.body.appendChild(style);
})();

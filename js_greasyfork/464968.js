// ==UserScript==
// @name         微信读书翻书快捷键
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  针对微信读书的pdf文件，按enter可以向后翻页，按enter旁边的"键可以向前翻页
// @author       You
// @match        https://weread.qq.com/*
// @icon         https://rescdn.qqmail.com/node/wr/wrpage/style/images/independent/favicon/favicon_16h.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464968/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BF%BB%E4%B9%A6%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/464968/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BF%BB%E4%B9%A6%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

// api           https://www.tampermonkey.net/documentation.php

(function () {
  "use strict";
  window.addEventListener("keypress", (e) => {
    switch (e.code) {
      case "Enter":
        document
          .querySelector(".reader_pdf_tool_content_navigator_forward")
          .click();
        break;
      case "Quote":
        document
          .querySelector(".reader_pdf_tool_content_navigator_back")
          .click();
        break;
      default:
    }
  });
  const style = document.createElement("style");
  style.innerText = ".reader_pdf_tool { display: none !important }";
  document.body.appendChild(style);
})();

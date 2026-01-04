// ==UserScript==
// @name         CSDN代码框直接复制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  CSDN代码框直接复制,不需要登录
// @author       pp
// @match        https://*.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469824/CSDN%E4%BB%A3%E7%A0%81%E6%A1%86%E7%9B%B4%E6%8E%A5%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/469824/CSDN%E4%BB%A3%E7%A0%81%E6%A1%86%E7%9B%B4%E6%8E%A5%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  document.querySelectorAll('div[data-title="登录后复制"]').forEach((el) => {
    el.style.display = "block";
    el.dataset.title = "直接复制";
    el.onclick = (e) => {
      e.stopPropagation();
      const $$target = e.target;
      const code = $$target.parentElement;
      console.log(code.innerText);
      GM_setClipboard(code.innerText, "text");
    };
  });
})();

// ==UserScript==
// @name         屏蔽123
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  屏蔽1234
// @author       砍11
// @match        *://*.amap.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amap.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467974/%E5%B1%8F%E8%94%BD123.user.js
// @updateURL https://update.greasyfork.org/scripts/467974/%E5%B1%8F%E8%94%BD123.meta.js
// ==/UserScript==
(function () {
  const observer = new MutationObserver(function (mutations) {
    const mask = document.querySelector(".baxia-dialog.auto");
    const mask2 = document.querySelector(".sufei-dialog");
 
    mask?.remove();
    mask2?.remove();
  });
 
  observer.observe(document.body, { childList: true });
 
  // Your code here...
})();
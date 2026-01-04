// ==UserScript==
// @name         Douban Stop Verification Page Redirect
// @namespace    https://github.com/fixicelo/userscripts
// @version      1.0.0
// @description  This script prevents redirection to the verification page on Douban. | 防止豆瓣跳转到手机号码验证页。 | 防止豆瓣跳轉到手機號碼驗證頁。
// @author       fixicelo
// @match        *://*.douban.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542167/Douban%20Stop%20Verification%20Page%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/542167/Douban%20Stop%20Verification%20Page%20Redirect.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Override `window._USER_ABNORMAL`
  Object.defineProperty(window, "_USER_ABNORMAL", {
    value: null,
  });

  // Block the script that triggers abnormal account verification
  const BLOCKED_SCRIPT = "abnormal_account.js";

  const observer = new MutationObserver((mutations) => {
    for (const { addedNodes } of mutations) {
      for (const node of addedNodes) {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.tagName === "SCRIPT" &&
          node.src.includes(BLOCKED_SCRIPT)
        ) {
          console.debug("Bypassed script:", node.src);
          node.remove();
          observer.disconnect();
          return;
        }
      };
    };
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();

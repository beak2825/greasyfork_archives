// ==UserScript==
// @name         知乎免登录
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  重定向知乎登录页面到发现页面
// @author       wj
// @run-at       document-idle
// @match        https://*.zhihu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495491/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/495491/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
//
(function () {
  "use strict";

  // 功能一：重定向知乎登录页面到发现页面
  // 检查当前URL是否包含特定的字符串
  if (window.location.href.indexOf("https://www.zhihu.com/signin?") !== -1) {
    // 如果URL匹配，跳转到指定页面
    window.location.href = "https://www.zhihu.com/explore";
  }

  const regex = /^https?:\/\/.*\.zhihu\.com\/.*$/;
  const url = window.location.href;
  if (regex.test(url)) {
    // 功能二：移除知乎登录页面的登录框

    function checkAndTriggerTilde() {
      let modalDiv = document.querySelector(
        "div.Modal.Modal--default.signFlowModal"
      );

      if (modalDiv) {
        console.log("用户未登录，移除登录框");
        let modalButton = document.querySelector(
          "button.Button.Modal-closeButton"
        );
        modalButton.click();
      }
    }

    document.addEventListener("DOMContentLoaded", function () {
      checkAndTriggerTilde();
    });

    let observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        checkAndTriggerTilde();
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
})();

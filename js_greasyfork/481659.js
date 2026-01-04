// ==UserScript==
// @name         快手自动评论
// @namespace   Violentmonkey Scripts
// @match       *://www.kuaishou.com/*
// @version     1.0.2
// @license MIT
// @grant       GM_info
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @grant       GM_openInTab
// @grant       unsafeWindow
// @run-at      document-body
// @author      zhizhu

// @description 抖音控制
// @downloadURL https://update.greasyfork.org/scripts/481659/%E5%BF%AB%E6%89%8B%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/481659/%E5%BF%AB%E6%89%8B%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

// eslint-disable-next-line no-undef

(function () {
  "use strict";

  function stopAction() {
    clearInterval(interval);
    interval = null;
  }
  GM_registerMenuCommand("停止", stopAction);

  let interval = null;
  setTimeout(() => {
    document.querySelector(".sidebar-item.comment-btn").click();

    interval = setInterval(() => {
      if (
        Number(
          document.querySelector(".item-text.comment-num").innerText
        ) < 200
      ){
        document.querySelector(".pl-textarea.textarea").value = "46464";
        document
          .querySelector(".pl-textarea.textarea")
          .dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 }));
        setTimeout(() => {
          document.querySelector(".submit-button.valid").click();
  
          setTimeout(() => {
            document.querySelector(".switch-btn.down").click();
          }, 2000);
        }, 1000);
      }else{
        setTimeout(() => {
          document.querySelector(".switch-btn.down").click();
        }, 2000);
      }
      
    }, 4300);
  }, 6000);

  // Your code here...
})();

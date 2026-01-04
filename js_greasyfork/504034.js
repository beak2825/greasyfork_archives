// ==UserScript==
// @name         yc-抖音PC端自动打开评论区
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  抖音PC端识别跳转代码
// @author       wcbblll
// @match        https://www.douyin.com/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504034/yc-%E6%8A%96%E9%9F%B3PC%E7%AB%AF%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E8%AF%84%E8%AE%BA%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/504034/yc-%E6%8A%96%E9%9F%B3PC%E7%AB%AF%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E8%AF%84%E8%AE%BA%E5%8C%BA.meta.js
// ==/UserScript==
(function () {
  "use strict";
  // 自动打开评论区
  function autoOpenComment() {
    const commentBody = document.querySelector(`#relatedVideoCard`);
    if (commentBody) return
    function triggerKeyboardEvent(eventType, eventData) {
      const event = new KeyboardEvent(eventType, eventData);
      document.dispatchEvent(event);
    }
    triggerKeyboardEvent("keydown", { keyCode: 88, key: "x", code: "KeyX" });
  }



  function loopFunc(fn) {
    function callback(mutationsList, observer) {
      if (lastExecutionTime + delay < Date.now()) {
        fn(mutationsList, observer)
        lastExecutionTime = Date.now();
      }
    }

    let observer = new MutationObserver(callback);

    let delay = 500; // 间隔时间，单位毫秒
    let lastExecutionTime = 0;

    observer.observe(document.body, { childList: true, attributes: true, subtree: true });
  }


  loopFunc(() => {
    autoOpenComment()
  })
})();

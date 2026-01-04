// ==UserScript==
// @name         关闭知乎和csdn的弹窗
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  关闭知乎和csdn每次进入都会弹窗登录的弹窗
// @author       zsj
// @match        *://www.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/*
// @match        *://blog.csdn.net/*
// @homepageURL  https://github.com/zsjun/ygreaseMonkey.git
// @icon         https://www.google.com/s2/favicons?domain=zhihu.com
// @supportURL   https://github.com/zsjun/ygreaseMonkey/issues
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435378/%E5%85%B3%E9%97%AD%E7%9F%A5%E4%B9%8E%E5%92%8Ccsdn%E7%9A%84%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/435378/%E5%85%B3%E9%97%AD%E7%9F%A5%E4%B9%8E%E5%92%8Ccsdn%E7%9A%84%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==
(function () {
  let zhihuFlag = false;
  let csdnFlag = false;

  const removeLoginModal = (mutationsList) => {
    for (const mutation of mutationsList) {
      for (const target of mutation.addedNodes) {
        if (target.nodeType !== 1) return;
        const zhihuButton =
          target && target.querySelector(".Modal-closeButton");
        const csdnButtonParent =
          target && target.querySelector(".passport-login-box");
        let csdnButton;

        if (csdnButtonParent) {
          csdnButton = csdnButtonParent.querySelector("span");
        }

        if (zhihuButton && !zhihuFlag) {
          zhihuFlag = true;
          zhihuButton.click();
        }

        if (csdnButton && !csdnFlag) {
          csdnFlag = true;
          csdnButton.click();
        }
      }
    }
  };

  const observer = new MutationObserver(removeLoginModal);
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
})();

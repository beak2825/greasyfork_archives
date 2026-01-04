// ==UserScript==
// @name               知乎 - 隱藏登入橫幅
// @name:zh-CN         知乎 - 隐藏登入横幅
// @namespace          https://github.com/jlhg/userscript
// @license            MIT
// @version            0.1.2
// @description        隱藏知乎網站惱人的登入橫幅
// @description:zh-CN  隐藏知乎网站恼人的登入横幅
// @author             jlhg
// @homepage           https://github.com/jlhg/userscript
// @supportURL         https://github.com/jlhg/userscript/issues
// @match              https://www.zhihu.com/*
// @match              https://zhuanlan.zhihu.com/*
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/480761/%E7%9F%A5%E4%B9%8E%20-%20%E9%9A%B1%E8%97%8F%E7%99%BB%E5%85%A5%E6%A9%AB%E5%B9%85.user.js
// @updateURL https://update.greasyfork.org/scripts/480761/%E7%9F%A5%E4%B9%8E%20-%20%E9%9A%B1%E8%97%8F%E7%99%BB%E5%85%A5%E6%A9%AB%E5%B9%85.meta.js
// ==/UserScript==

(function() {
  'use strict'

  function waitElement(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(mutations => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }

  waitElement('.Modal-closeButton').then((el) => { el.click(); });
  waitElement('.css-nk32ej').then((el) => {
    el.remove();

    waitElement('.css-nk32ej').then((el) => {
      el.remove();
    });
  });
})();

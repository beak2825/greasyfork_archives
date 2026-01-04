// ==UserScript==
// @name         Steam-自動展開支持語言
// @namespace    https://github.com/jlhg/userscript
// @license      MIT
// @version      0.1.0
// @description  自動展開 Steam 遊戲頁面右下方的「查看全部 x 種支援的語言」
// @author       jlhg
// @homepage     https://github.com/jlhg/userscript
// @supportURL   https://github.com/jlhg/userscript/issues
// @match        https://store.steampowered.com/app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479708/Steam-%E8%87%AA%E5%8B%95%E5%B1%95%E9%96%8B%E6%94%AF%E6%8C%81%E8%AA%9E%E8%A8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/479708/Steam-%E8%87%AA%E5%8B%95%E5%B1%95%E9%96%8B%E6%94%AF%E6%8C%81%E8%AA%9E%E8%A8%80.meta.js
// ==/UserScript==

(function() {
  'use strict';

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

  waitElement('.all_languages').then((el) => { el.click(); });
})();

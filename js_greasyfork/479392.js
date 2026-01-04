// ==UserScript==
// @name               Reddit - Hide Login Banner
// @name:zh-TW         Reddit - 隱藏登入橫幅
// @namespace          https://github.com/jlhg/userscript
// @license            MIT
// @version            0.1.1
// @description        Hide Reddit website's annoying login banner
// @description:zh-TW  隱藏 Reddit 網站惱人的登入橫幅
// @author             jlhg
// @homepage           https://github.com/jlhg/userscript
// @supportURL         https://github.com/jlhg/userscript/issues
// @match              https://www.reddit.com/*
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/479392/Reddit%20-%20Hide%20Login%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/479392/Reddit%20-%20Hide%20Login%20Banner.meta.js
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

  waitElement('#credential_picker_container')
    .then((el) => { el.remove(); });
})();

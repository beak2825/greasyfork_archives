// ==UserScript==
// @name         yande keybord turn pages  键盘翻页  ページをめくる
// @namespace    https://yande.re/*
// @version      0.1
// @description  yande keybord turn pages  键盘翻页  ページをめくる beta
// @author       clear
// @match        https://yande.re/*
// @grant        GM_log
// @grant        GM_addStyle
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/450191/yande%20keybord%20turn%20pages%20%20%E9%94%AE%E7%9B%98%E7%BF%BB%E9%A1%B5%20%20%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E3%82%81%E3%81%8F%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/450191/yande%20keybord%20turn%20pages%20%20%E9%94%AE%E7%9B%98%E7%BF%BB%E9%A1%B5%20%20%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E3%82%81%E3%81%8F%E3%82%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let href = window.location.href;
  let uArray = href.split('/');
  let pageId = parseInt(uArray[uArray.length - 1]);

  window.addEventListener('keyup', function (e) {
    if (e.keyCode == 37) {
      window.location.href = pageId - 1;
    } else if (e.keyCode == 39) {
      window.location.href = pageId + 1;
    }
  });
})();

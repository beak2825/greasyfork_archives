// ==UserScript==
// @name         移除希悦问卷弹窗
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove Chalk pop-ups
// @author       You
// @match        https://chalk-c3.seiue.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=seiue.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457201/%E7%A7%BB%E9%99%A4%E5%B8%8C%E6%82%A6%E9%97%AE%E5%8D%B7%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/457201/%E7%A7%BB%E9%99%A4%E5%B8%8C%E6%82%A6%E9%97%AE%E5%8D%B7%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
  'use strict';
  setTimeout(function() {
    var popup = document.querySelector('.ant-modal-root');
    if (popup) {
      popup.parentNode.removeChild(popup);
    }
  }, 4000);
})();
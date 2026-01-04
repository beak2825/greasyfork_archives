// ==UserScript==
// @name         去掉PageNote右侧的高亮列表悬浮框
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove PageNote elements
// @author       Alex
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @license      Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/488060/%E5%8E%BB%E6%8E%89PageNote%E5%8F%B3%E4%BE%A7%E7%9A%84%E9%AB%98%E4%BA%AE%E5%88%97%E8%A1%A8%E6%82%AC%E6%B5%AE%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/488060/%E5%8E%BB%E6%8E%89PageNote%E5%8F%B3%E4%BE%A7%E7%9A%84%E9%AB%98%E4%BA%AE%E5%88%97%E8%A1%A8%E6%82%AC%E6%B5%AE%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removePageNote() {
      let pageNote = document.querySelector('pagenote-aside');
      if(pageNote) {
        pageNote.remove();
      }
    }

    new MutationObserver(removePageNote).observe(document, {
      childList: true,
      subtree: true
    });

    removePageNote();

})();
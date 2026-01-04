// ==UserScript==
// @namespace         whatever

// @name              解除网页复制文本的限制
// @name:en           Remove web copy text limits
// @name:zh           网页复制限制解除

// @description       可以解除禁止复制限制。
// @description:en    Remove web copy text limits in web pages.

// @author            yurentle
// @version           0.3
// @license           LGPLv3

// @match             *://*/*
// @grant             none
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/503622/%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E6%96%87%E6%9C%AC%E7%9A%84%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/503622/%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E6%96%87%E6%9C%AC%E7%9A%84%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
(function() {
  'use strict';
  // 网页加载完成的时候再执行
  window.onload = function() {
    console.log('window.onload');

    setTimeout(() => {
      const list = document.querySelectorAll("*");

      list.forEach(element => {
        element.setAttribute('style', 'user-select: text !important');
      });
    }, 3000);
  };
})();
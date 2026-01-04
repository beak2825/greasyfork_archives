// ==UserScript==
// @name:en      Set Netflix caption selectable easy to quickly translate word for Mac
// @name         Netflix，方便Mac电脑快速选中翻译单词
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description:en  Set Netflix caption selectable, make it easy to quickly select and translate word in the caption for Mac
// @description  Netflix，方便Mac电脑快速选中翻译单词（Mac触控板手势重按或三指轻点）
// @author       jaywang
// @match        https://www.netflix.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436347/Netflix%EF%BC%8C%E6%96%B9%E4%BE%BFMac%E7%94%B5%E8%84%91%E5%BF%AB%E9%80%9F%E9%80%89%E4%B8%AD%E7%BF%BB%E8%AF%91%E5%8D%95%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/436347/Netflix%EF%BC%8C%E6%96%B9%E4%BE%BFMac%E7%94%B5%E8%84%91%E5%BF%AB%E9%80%9F%E9%80%89%E4%B8%AD%E7%BF%BB%E8%AF%91%E5%8D%95%E8%AF%8D.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...

  const mutationDiv = document.body;
  const observer = new MutationObserver(callback);
  observer.observe(mutationDiv, {
      childList: true, // 观察直接子节点
      subtree: true, // 及其更低的后代节点
      attributes: true,
      characterData: true
  });
  /** DOM变动的回调函数 */
  function callback (mutationRecord) {
      const mask = document.querySelector('.ltr-1420x7p');
      const subtitle = document.querySelector('.player-timedtext');
      if (mask) {
          mask.style.pointerEvents = 'none';
          // 顶部的按钮是可以选的
          const topBtns = mask.querySelectorAll('.medium.ltr-1dcjcj4');
          topBtns.forEach((el) => {
            el.style.pointerEvents = 'auto';
          })
      }
      if (subtitle) {
          subtitle.style.userSelect = 'text';
          subtitle.style.WebkitUserSelect = 'text';
      }
  }
})();
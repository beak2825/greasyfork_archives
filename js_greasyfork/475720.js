// ==UserScript==
// @name          随缘居屏蔽词插件
// @version       0.1
// @description   A script that improves your mtslash user experience by filtering certain words.
// @match         http*://mtslash.me/*
// @author        yelllowgomi
// @license       MIT
// @grant         none
// @namespace https://greasyfork.org/users/1176793
// @downloadURL https://update.greasyfork.org/scripts/475720/%E9%9A%8F%E7%BC%98%E5%B1%85%E5%B1%8F%E8%94%BD%E8%AF%8D%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/475720/%E9%9A%8F%E7%BC%98%E5%B1%85%E5%B1%8F%E8%94%BD%E8%AF%8D%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 把屏蔽词加入下面的 list 中，注意要使用英文标点符号
  // 比如：['underage','双性']
  let blockWordsArray = [''];

  let elementsArray = Array.from(document.getElementsByTagName('tbody'));
  elementsArray = elementsArray.filter(el => el.id && el.id.startsWith('normalthread_'));

  for (let el of elementsArray) {
    let elementText = el.textContent.toLowerCase();
    for (let word of blockWordsArray) {
      if (elementText.includes(word.toLowerCase())) {
        let targetEl = el.querySelector('.s.xst');
          targetEl.textContent = `已屏蔽一条包含"${word}"的内容`;
          targetEl.style = "color:gray";
        console.log(`已屏蔽一条包含"${word}"的内容`)
        break;
      }
    }
  }
})();

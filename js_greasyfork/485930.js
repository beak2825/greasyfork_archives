// ==UserScript==
// @name         知乎过滤盐选广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  过滤知乎首页盐选广告
// @author       azuremistake
// @match        https://www.zhihu.com/
// @icon         https://www.google.com/s2/favicons?domain=zhihu.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485930/%E7%9F%A5%E4%B9%8E%E8%BF%87%E6%BB%A4%E7%9B%90%E9%80%89%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/485930/%E7%9F%A5%E4%B9%8E%E8%BF%87%E6%BB%A4%E7%9B%90%E9%80%89%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function filter() {
    let cards = document.querySelectorAll('div.Card.TopstoryItem.TopstoryItem-isRecommend');

    cards.forEach((card) => {
      let text = card.innerText;
      if (text.includes('本回答节选自盐选专栏') ||
          text.includes('本内容版权为知乎及版权方所有')) {
        card.style.display = 'none';
      }
    });
  }

  filter();

  let observer = new MutationObserver(filter);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();
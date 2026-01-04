// ==UserScript==
// @name           Hide political trends on Twitter
// @name:ja        Twitter_政治トレンドの表示を消す
// @namespace      http://tampermonkey.net/
// @version        0.41
// @description    Hides political content on Twitter's trending page.
// @description:ja トレンドページの政治関連の表示を非表示にします。
// @author         kmikrt
// @license        MIT
// @match          *://twitter.com/*
// @match          *://mobile.twitter.com/*
// @match          *://x.com/*
// @match          *://mobile.x.com/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/526523/Hide%20political%20trends%20on%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/526523/Hide%20political%20trends%20on%20Twitter.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const keywords = [
    '政治', '政権', '民主', '自民', '衆議', '参議',
    '総選挙', '税', '岸田', '票率', '竹島', '独島'
  ];

  const removePoliticalTrends = () => {
    const elements = document.querySelectorAll('[data-testid="cellInnerDiv"]');
    elements.forEach(el => {
      const spans = el.querySelectorAll('span.css-1jxf684, span.css-1qaijid');
      for (const span of spans) {
        const text = span.textContent.toLowerCase();
        if (keywords.some(k => text.includes(k))) {
          const trend = el.querySelector('[data-testid="trend"]');
          if (trend?.parentNode) {
            trend.parentNode.removeChild(trend);
          }
          break;
        }
      }
    });
  };

  // 初回実行
  removePoliticalTrends();

  // 動的更新への対応
  new MutationObserver(removePoliticalTrends).observe(document.body, {
    childList: true,
    subtree: true
  });
})();
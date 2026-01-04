// ==UserScript==
// @name         inoreader摘录新闻
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  用于inoreader摘录新闻
// @author       You
// @match        https://www.inoreader.com/all_articles
// @icon         https://www.google.com/s2/favicons?sz=64&domain=inoreader.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540742/inoreader%E6%91%98%E5%BD%95%E6%96%B0%E9%97%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/540742/inoreader%E6%91%98%E5%BD%95%E6%96%B0%E9%97%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractNews() {
    const articles = document.querySelectorAll('.article_tile');
    const results = [];

    articles.forEach(article => {
      // 过滤隐藏的卡片（display: none）
      if (getComputedStyle(article).display === 'none') {
        return;
      }

      const titleElem = article.querySelector('.article_tile_title a.article_title_link');
      const title = titleElem ? titleElem.innerText.trim() : '';

      const summaryElem = article.querySelector('.article_tile_content');
      const summary = summaryElem ? summaryElem.innerText.trim() : '';

      if (title) {
        results.push(`[${title}]${summary}`);
      }
    });

    const output = results.join('\n');
    console.log(output);
    return output;
  }
  window.extractNews = extractNews;
  console.log("摘录新闻方法：extractNews()");
})();
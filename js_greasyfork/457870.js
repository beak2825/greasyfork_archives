// ==UserScript==
// @name           yahoo news filter
// @description    yahooニュースで任意の記事を非表示にする
// @grant          none
// @match          https://www.yahoo.co.jp
// @match          https://news.yahoo.co.jp/*
// @match          https://article.yahoo.co.jp/*
// @version        1.2
// @run-at         document-start
// @namespace https://greasyfork.org/users/3989
// @downloadURL https://update.greasyfork.org/scripts/457870/yahoo%20news%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/457870/yahoo%20news%20filter.meta.js
// ==/UserScript==

/********************  SETTING **************************/

  const case_insensitive = true;
  const match_fullwidth = true;
  const filterWords = [];

/********************************************************/

'use strict';

(function() {

  const mod = case_insensitive? 'i': null;
  const p = (() => {const a = filterWords.filter(s => String(s).trim());return a.length !== 0? new RegExp(a.join('|'), mod): null})();

  function convertHalfSize(str) {
    return match_fullwidth? str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 65248)): str;
  }

  function removeArticle(d) {
    const tabTopics = (d.id || '').includes('tabpanelTopics');
    const a = d.querySelectorAll('#qurireco article, section li, section > ul > div, #newsFeed li');
    if (!p || !a.length === 0) return;
    for (const title of a) {
      if (tabTopics) title.style.display = 'block';
      if (p.test(convertHalfSize(title.textContent))) title.style.display = 'none';
    }
  }

  function observer() {
    const b = document.querySelectorAll('#Topics, #Stream, #yjnMain, #yjnSub, .mainColumn, .subColumn');
    if (b.length === 0) return;

    const mo = new MutationObserver(m => {
      for (const i of m) {
        removeArticle(i.target);
      }
    });
    for (const i of b) {
      mo.observe(i, {childList: true, subtree: true, attributeFilter: ['id']});
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    removeArticle(document);
    observer();
  });
})();
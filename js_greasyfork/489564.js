// ==UserScript==
// @name         Hatena bookmark compatibility for InoReader
// @namespace    https://htsign.hateblo.jp
// @version      0.4.0
// @description  add Hatebu images for InoReader
// @author       htsign
// @match        https://www.inoreader.com/*
// @match        https://jp.inoreader.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489564/Hatena%20bookmark%20compatibility%20for%20InoReader.user.js
// @updateURL https://update.greasyfork.org/scripts/489564/Hatena%20bookmark%20compatibility%20for%20InoReader.meta.js
// ==/UserScript==

(() => {
  'use strict';
  const CLASS = 'article-hatebu-count';
  const ORIGIN = 'https://b.hatena.ne.jp';

  const style = document.createElement('style');
  document.head.append(style);
  style.sheet.insertRule(`
    .${CLASS} {
      display: block;
      float: left;
      padding: 2px 4px;
    }
  `);

  const range = document.createRange();
  range.selectNode(document.documentElement);

  const createHatebuImage = href => range.createContextualFragment(`
    <a class="${CLASS}" href="${ORIGIN}/entry/${href}" target="_blank" rel="noopener">
      <img src="${ORIGIN}/entry/image/${href}">
    </a>
  `);

  const root = document.getElementById('reader_pane');

  const mo = new MutationObserver(records => {
    for (const node of records.flatMap(record => [...record.addedNodes])) {
      if (node instanceof HTMLDivElement && node.dataset.type === 'article') {
        const { href } = node.querySelector('.article_title_wrapper > a');
        node.querySelector('.arrow_div').prepend(createHatebuImage(href));
      }
      if (node instanceof HTMLElement && node.id === 'search_content') {
        // hook adding nodes for search result
        const waitResultObserver = new MutationObserver(records => {
          for (const node of records.flatMap(record => [...record.addedNodes])) {
            if (node instanceof HTMLElement && node.id === 'reader_pane_articles_search_result') {
              mo.observe(node, { childList: true });
              waitResultObserver.disconnect();

              break;
            }
          }
        });

        waitResultObserver.observe(node, { childList: true });
      }
    }
  });
  mo.observe(root, { childList: true });

  root.addEventListener('mouseup', ({ target }) => {
    if (target instanceof Element && target.closest('.article_header_text')) {
      const article = target.closest('[data-type="article"]');
      setTimeout(() => {
        const { href } = article.querySelector('.article_title_link');
        const subTitle = article.querySelector('.article_sub_title');
        subTitle.insertBefore(createHatebuImage(href), subTitle.querySelector('.clearfix'));
      });
    }
  }, true);
})();

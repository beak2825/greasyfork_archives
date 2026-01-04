// ==UserScript==
// @name         arXiv ar5iv Link
// @namespace    https://github.com/sparanoid/userscript
// @supportURL   https://github.com/sparanoid/userscript/issues
// @version      0.1.0
// @description  Add ar5iv link to arXiv page
// @author       Sparanoid
// @license      AGPL
// @compatible   chrome 80 or later
// @compatible   edge 80 or later
// @compatible   firefox 74 or later
// @compatible   safari 13.1 or later
// @match        https://arxiv.org/*
// @icon         https://external-content.duckduckgo.com/ip3/arxiv.org.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440406/arXiv%20ar5iv%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/440406/arXiv%20ar5iv%20Link.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const arxivUrl = document.querySelector('meta[property="og:url"]')?.getAttribute('content');
  const list = document.querySelector('#abs-outer > .extra-services > .full-text > ul');
  const li = document.createElement('li');
  const link = document.createElement('a');

  if (arxivUrl) {
    const ar5ivLink = arxivUrl.replace('arxiv', 'ar5iv');
    link.setAttribute('href', ar5ivLink);
    link.textContent = 'View in ar5iv';

    li.appendChild(link);
    list.appendChild(li);
  }
})();

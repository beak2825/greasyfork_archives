// ==UserScript==
// @name         arxiv-extensions
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  HTML version of arxiv & AI chat for arxiv
// @author       barret.china@gmail.com
// @match        https://arxiv.org/abs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arxiv.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481023/arxiv-extensions.user.js
// @updateURL https://update.greasyfork.org/scripts/481023/arxiv-extensions.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const createLink = function(name, url) {
    const link = document.createElement('a');
    link.style.cssText = `display: inline-block; border-left: 2px solid #fff; padding-left: 10px; margin-left: 10px;`;
    link.target = '_blank';
    link.href = url;
    link.textContent = name;
    return link;
  };

  const href = window.location.href;
  const htmlVersionEntry = createLink('HTML(ar5iv)', href.replace('arxiv.org', 'ar5iv.org'));
  const htmlVersionFromVanity = createLink('HTML(vanity)', href.replace('arxiv.org', 'www.arxiv-vanity.com').replace('/pdf/', '/papers/').replace('.pdf', '/'));
  const aiChatEntry = createLink('AI Chat', href.replace('arxiv.org', 'arxiw.org'));

  const target = document.querySelector('.header-breadcrumbs');
  target.appendChild(htmlVersionEntry);
  target.appendChild(htmlVersionFromVanity);
  target.appendChild(aiChatEntry);
})();
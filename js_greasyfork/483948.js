// ==UserScript==
// @name         arxiv-html
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  HTML version of arxiv & AI chat for arxiv
// @author       @amormaid
// @match        https://arxiv.org/abs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arxiv.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483948/arxiv-html.user.js
// @updateURL https://update.greasyfork.org/scripts/483948/arxiv-html.meta.js
// ==/UserScript==
 
// inspired by barret.china@gmail.com
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
  const htmlVersionArxivLink = (document.getElementById('latexml-download-link') || {href: ''}).href
  const htmlVersionArxiv = createLink('Html-Arxiv', htmlVersionArxivLink);
  const htmlVersionEntry = createLink('HTML(ar5iv)', href.replace('arxiv.org', 'ar5iv.org'));
  // const htmlVersionFromVanity = createLink('HTML(vanity)', href.replace('arxiv.org', 'www.arxiv-vanity.com').replace('/pdf/', '/papers/').replace('.pdf', '/'));
  const aiChatEntry = createLink('AI Chat', href.replace('arxiv.org', 'arxiw.org'));
 
  const target = document.querySelector('.header-breadcrumbs');
 
  htmlVersionArxivLink && target.appendChild(htmlVersionArxiv);
  // target.appendChild(htmlVersionFromVanity);
  target.appendChild(htmlVersionEntry);
  target.appendChild(aiChatEntry);
})();
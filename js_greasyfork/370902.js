// ==UserScript==
// @name         Niconico AutoPagerize
// @namespace    https://foooomio.net/
// @description  ニコニコ動画のユーザーページにAutoPager機能を追加する
// @version      0.7
// @author       foooomio
// @license      MIT License
// @match        https://www.nicovideo.jp/my*
// @match        https://www.nicovideo.jp/user/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370902/Niconico%20AutoPagerize.user.js
// @updateURL https://update.greasyfork.org/scripts/370902/Niconico%20AutoPagerize.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const $ = document.querySelector.bind(document);

  if (!$('.UserPage-main')) return;

  const autopager = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      entry.target.click();
    }
  });

  new MutationObserver(() => {
    const target = $('.Timeline-more, .ShowMoreList-more');
    if (target) {
      autopager.disconnect();
      autopager.observe(target);
    }
  }).observe($('.UserPage-main'), { childList: true, subtree: true });
})();
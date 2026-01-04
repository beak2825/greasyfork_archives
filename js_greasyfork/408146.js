// ==UserScript==
// @name        YouTube Absolute DateTime
// @namespace   https://i544c.github.com/
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.0.1
// @author      i544c
// @description Reveal when broadcast started
// @description:ja その配信がいつ始まったのかを明らかにする
// @downloadURL https://update.greasyfork.org/scripts/408146/YouTube%20Absolute%20DateTime.user.js
// @updateURL https://update.greasyfork.org/scripts/408146/YouTube%20Absolute%20DateTime.meta.js
// ==/UserScript==

(() => {
  'use strict';
  
  const _debug = (...msg) => {
    console.log('[wdbs] ', ...msg);
  };
  
  const queryString = 'span[itemtype="http://schema.org/BroadcastEvent"] meta[itemprop="startDate"]';
  
  const main = async () => {
    _debug('start');
    // ページ内遷移した際にヘッダーが変わらないため、自身のページをfetchする
    const res = await fetch(window.location, { cache: 'no-cache' });
    const rawBody = await res.text();
    const domparser = new DOMParser();
    const body = domparser.parseFromString(rawBody, 'text/html');
    const startDateText = body.querySelector(queryString)?.getAttribute('content');
    if (!startDateText) return;
    
    const startDate = new Date(startDateText);
    _debug(startDate);
    document.querySelector('#info-text #date *:not(#dot)').innerText = startDate.toLocaleString();
  };
  
  document.addEventListener('yt-navigate-finish', main);
})();
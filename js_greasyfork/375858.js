// ==UserScript==
// @name         Bilibili AutoWide
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Bilibili Player Auto WideScreen!
// @author       cuzfinal
// @include     *://www.bilibili.com/video/*
// @include     *://www.bilibili.com/bangumi/*
// @include     *://www.bilibili.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/375858/Bilibili%20AutoWide.user.js
// @updateURL https://update.greasyfork.org/scripts/375858/Bilibili%20AutoWide.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Your code here...
  const $ = selector => document.querySelector(selector)
  

  const playerNode = $('#bilibili-player')
  if (playerNode) {
    let mo
    mo = new MutationObserver((mutationList, observer) => {
      for(const mutation of mutationList) {
        if (mutation.target.classList?.contains?.('bpx-player-control-bottom-right')) {
          if ($('.bpx-player-ctrl-wide')) {
            setTimeout(() => {
              $('.bpx-player-ctrl-wide').click()
            }, 0);
            mo.disconnect()
          }
        }
      }
    })
    mo.observe($('#bilibili-player'), {
      childList: true,
      subtree: true,
    })
  }
  
  const adblockCss = `
    .adblock-tips { display: none!important; }
  `
  GM_addStyle(adblockCss)
})();

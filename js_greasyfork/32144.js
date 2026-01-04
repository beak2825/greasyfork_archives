// ==UserScript==
// @name         知乎广告移除
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       wangb
// @match        *://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32144/%E7%9F%A5%E4%B9%8E%E5%B9%BF%E5%91%8A%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/32144/%E7%9F%A5%E4%B9%8E%E5%B9%BF%E5%91%8A%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeAllAd () {
      document.querySelectorAll('.AdblockBanner').forEach(function (ad) {ad.style.display = 'none';});
      var itemList = document.querySelectorAll('.Card.TopstoryItem');
      itemList.forEach(function (item) {
        if (item.querySelectorAll('.TopstoryItem-advertButton').length) {
          item.style.display = 'none';
        }
      });
    }

    var ob = new MutationObserver(removeAllAd);
    ob.observe(document.querySelector('.TopstoryMain > div'), {childList: true});

    removeAllAd();
})();
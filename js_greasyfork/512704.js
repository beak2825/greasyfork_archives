// ==UserScript==
// @name        jsoncn去广告
// @namespace   Violentmonkey Scripts
// @match       https://www.json.cn/*
// @grant       none
// @license     MIT
// @version     1.0.0
// @author      ss548
// @description 2024/10/11 13:56:20
// @downloadURL https://update.greasyfork.org/scripts/512704/jsoncn%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/512704/jsoncn%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function() {
  'use strict';

  function removeAds() {
    const adEls = document.getElementsByClassName('show-hide-adv');
    const googleAds = document.getElementsByTagName('ins')[3];

    for(const el of adEls) {
        el.style.cssText = 'display:none !important;height:0 !important;';
    }
    googleAds.style.cssText = 'display:none !important;height:0 !important;';
  }


  window.onload = removeAds
})();
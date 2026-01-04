// ==UserScript==
// @name        my-adblock
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     1.0
// @author      -
// @description 2024/9/17 17:58:26
// @include      *://*javbus*.com/*
// @include      *://*misskon.com/*
// @include      *://*bestgirlsexy.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513273/my-adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/513273/my-adblock.meta.js
// ==/UserScript==
(function() {
  'use strict';
  // javbus
  blockByClass(['ad-box','bcpics'])
  blockByClass(['e3lan'])
  // bestgirlsexy
  deleteByClass(['skip-link'])




  function blockByClass(cs) {
    for(const c of cs) {
      const ads = document.getElementsByClassName(c)
      for(const ad of ads) {
        ad.style.display = 'none';
      }
    }
  }

  function deleteByClass(cs) {
    for(const c of cs) {
      const ads = document.getElementsByClassName(c)
      for(const ad of ads) {
        ad.remove();
      }
    }
  }

})();
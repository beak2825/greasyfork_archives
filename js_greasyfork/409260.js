
// ==UserScript==
// @name         toiyeubitcoin hide sidebar ads
// @namespace    https://greasyfork.org/users/177222
// @version      0.0.1
// @description  Hide left sidebar banner
// @author       TheKop
// @include	     http://toiyeubitcoin.com/*
// @include	     https://toiyeubitcoin.com/*
// @downloadURL https://update.greasyfork.org/scripts/409260/toiyeubitcoin%20hide%20sidebar%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/409260/toiyeubitcoin%20hide%20sidebar%20ads.meta.js
// ==/UserScript==


function hideSibarAds() {
  var adDiv = document.getElementsByClassName('toiye-left-bar-1 toiye-sticky');
  for(var i = 0; i < adDiv.length; i++){
    adDiv[i].style.visibility = 'hidden';
  }
}

(function() {
  'use strict';
  hideSibarAds();
})();

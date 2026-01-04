// ==UserScript==
// @name GeeksForGeels Remove Login Modal & Header Ads
// @namespace GeeksForGeels
// @match https://www.geeksforgeeks.org/*
// @grant none
// @description GeeksForGeels: Remove Login Modal & Header Ads
// @version 0.0.1.20211019094003
// @downloadURL https://update.greasyfork.org/scripts/434068/GeeksForGeels%20Remove%20Login%20Modal%20%20Header%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/434068/GeeksForGeels%20Remove%20Login%20Modal%20%20Header%20Ads.meta.js
// ==/UserScript==



var style = "<style>.login-modal-div, .spinner-loading-overlay{display: none !important; position: absolute; top: 10000%; left: 1000000%; z-index: -99999;}</style>";
$("head").append(style);
$("body").append(style);


jQuery(document).ready(function(){
  for(var t = 0; t < 100*100; t ++){
    setTimeout(function(){
      _bsa = {};
      smartLogin = function(){};
      window.onscroll = null;
    }, t * 10);
  }
});
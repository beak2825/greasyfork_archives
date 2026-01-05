// ==UserScript==
// @name        YouTube Remove List from Watch URLs
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @description Remove list parameter from watch links on pages under www.youtube.com/user/.
// @version     0.1
// @copyright   Copyright 2014 Jefferson Scher
// @license     BSD 3-clause
// @include     http*://www.youtube.com/user/*
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/4346/YouTube%20Remove%20List%20from%20Watch%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/4346/YouTube%20Remove%20List%20from%20Watch%20URLs.meta.js
// ==/UserScript==

function cleanseURLs(el){
  var dirty, i, u;
  dirty = el.querySelectorAll("a[href*='/watch?v='][href*='&list=']");
  for (i=0; i<dirty.length; i++){
    u = dirty[i].href;
    dirty[i].href = u.substr(0, u.indexOf("&list="));
  }
}

// run initial cleanse
cleanseURLs(document.body);

// set up mutation observer to detect added videos
var YRLWU_MutOb = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
if (YRLWU_MutOb){
  var YRLWU_chgMon = new YRLWU_MutOb(function(mutationSet){
    mutationSet.forEach(function(mutation){
      for (var i=0; i<mutation.addedNodes.length; i++){
        if (mutation.addedNodes[i].nodeType == 1){
          cleanseURLs(mutation.addedNodes[i]);
        }
      }
    });
  });
  // attach chgMon to document.body
  var opts = {childList: true, subtree: true};
  YRLWU_chgMon.observe(document.body, opts);
}

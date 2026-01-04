// ==UserScript==
// @name        SwissCows Un-target Web Result Links to Open in Same Tab
// @namespace   JeffersonScher
// @description Strip target="_blank" from results links (2020-07-23)
// @author      Jefferson "jscher2000" Scher
// @copyright   Copyright 2020 Jefferson Scher
// @license     BSD 3-clause
// @include     https://swisscows.com/*
// @version     0.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/407640/SwissCows%20Un-target%20Web%20Result%20Links%20to%20Open%20in%20Same%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/407640/SwissCows%20Un-target%20Web%20Result%20Links%20to%20Open%20in%20Same%20Tab.meta.js
// ==/UserScript==

// Check element for targeted links (and remove target attribute)
function SCUtWRL_checkNode(el){
  var tgts = el.querySelectorAll('.web-results a[target="_blank"]');
  if (tgts.length > 0){
    for (var i=0; i<tgts.length; i++) tgts[i].removeAttribute("target");
  }
}
// Add MutationObserver to catch additions
var SCUtWRL_chgMon = new window.MutationObserver(function(mutationSet){
  mutationSet.forEach(function(mutation){
    for (var i=0; i<mutation.addedNodes.length; i++){
      if (mutation.addedNodes[i].nodeType == 1){
        SCUtWRL_checkNode(mutation.addedNodes[i]);
      }
    }
  });
});
// attach chgMon to document.body
var opts = {childList: true, subtree: true};
SCUtWRL_chgMon.observe(document.body, opts);
// Check initial results
SCUtWRL_checkNode(document.body);

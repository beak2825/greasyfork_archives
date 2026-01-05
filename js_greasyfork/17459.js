// ==UserScript==
// @name        Google Images Un-target to Open in Same Tab
// @namespace   JeffersonScher
// @description Strip target="_blank" from links so View image and View page replace the results (2016-06-09)
// @author      Jefferson "jscher2000" Scher
// @copyright   Copyright 2016 Jefferson Scher
// @license     BSD 3-clause
// @include     https://www.google.*/search*tbm=isch*
// @include     https://www.google.*/imgres?imgurl=*
// @version     0.6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17459/Google%20Images%20Un-target%20to%20Open%20in%20Same%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/17459/Google%20Images%20Un-target%20to%20Open%20in%20Same%20Tab.meta.js
// ==/UserScript==

// Add MutationObserver to catch additions
var GIUtOST_MutOb = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
if (GIUtOST_MutOb){
  var GIUtOST_chgMon = new GIUtOST_MutOb(function(mutationSet){
    mutationSet.forEach(function(mutation){
      for (var i=0; i<mutation.addedNodes.length; i++){
        if (mutation.addedNodes[i].nodeType == 1){
          GIUtOST_checkNode(mutation.addedNodes[i]);
        }
      }
    });
  });
  // attach chgMon to document.body
  var opts = {childList: true, subtree: true};
  GIUtOST_chgMon.observe(document.body, opts);
}
var tgts = document.querySelectorAll('.irc_c a[target="_blank"]');
if (tgts.length > 0) GIUtOST_untarget(tgts);

// Check added element for visit page/image links
function GIUtOST_checkNode(el){
  var tgts = el.querySelectorAll('.irc_c a[target="_blank"]');
  if (tgts.length > 0) GIUtOST_untarget(tgts);
}
// Un-target
function GIUtOST_untarget(nlist){
  for (var i=0; i<nlist.length; i++) nlist[i].removeAttribute("target");
}
// ==UserScript==
// @name        Set HTML5 video volume
// @description Script to set the volume of <video> elements to 50%.
// @namespace   JeffersonScher
// @author      Jefferson "jscher2000" Scher
// @copyright   Copyright 2015 Jefferson Scher
// @license     BSD
// @include     *
// @version     0.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10197/Set%20HTML5%20video%20volume.user.js
// @updateURL https://update.greasyfork.org/scripts/10197/Set%20HTML5%20video%20volume.meta.js
// ==/UserScript==

var setvol_volumepct = 0.5; // Set volume to 50%

// == == == Detect added nodes / attach MutationObserver == == ==
if (document.body){
  // Check existing videos
  setvol_checkNode(document.body);
  // Watch for changes that could be new videos
  var setvol_MutOb = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
  if (setvol_MutOb){
    var setvol_chgMon = new setvol_MutOb(function(mutationSet){
      mutationSet.forEach(function(mutation){
        for (var setvol_node_count=0; setvol_node_count<mutation.addedNodes.length; setvol_node_count++){
          if (mutation.addedNodes[setvol_node_count].nodeType == 1){
            setvol_checkNode(mutation.addedNodes[setvol_node_count]);
          }
        }
      });
    });
    // attach setvol_chgMon to document.body
    var setvol_opts = {childList: true, subtree: true};
    setvol_chgMon.observe(document.body, setvol_opts);
  }
}

function setvol_checkNode(el){
  if (el.nodeName == "video") var vids = [el];
  else var vids = el.querySelectorAll('video');
  if (vids.length > 0){
    for (var j=0; j<vids.length; j++){
      vids[j].volume = setvol_volumepct;
    }
  }
}

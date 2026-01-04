// ==UserScript==
// @name        Set HTML5 media player volume
// @description Script to set the volume of <video> and <audio> elements to reduced value (defaults to 50%), with a menu item to change for the current page.
// @namespace   JeffersonScher
// @author      Jefferson "jscher2000" Scher
// @copyright   Copyright 2017 Jefferson Scher
// @license     BSD-3-clause
// @include     *
// @version     0.6
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/36270/Set%20HTML5%20media%20player%20volume.user.js
// @updateURL https://update.greasyfork.org/scripts/36270/Set%20HTML5%20media%20player%20volume.meta.js
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
  if (el.nodeName == "video" || el.nodeName == "audio") var vids = [el];
  else var vids = el.querySelectorAll('video, audio');
  if (vids.length > 0){
    for (var j=0; j<vids.length; j++){
      vids[j].volume = setvol_volumepct;
    }
  }
}

// This is not compatible with Greasemonkey 4, but should work in Tampermonkey and Violentmonkey
function chgVol(e){
  var newvol = prompt('Enter value between 0.0 and 1.0 for 0% to 100%', setvol_volumepct);
  if (!isNaN(parseFloat(newvol))){
    var newnum = parseFloat(newvol);
    if (newnum < 0) newnum = 0;
    if (newnum > 1) newnum = 1;
    setvol_volumepct = newnum;
    setvol_checkNode(document.body);
  }
}
GM_registerMenuCommand('Change volume for this page', chgVol);

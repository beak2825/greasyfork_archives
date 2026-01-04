// ==UserScript==
// @name        Follow/Mutual Activity Gradient
// @description Replaces tumblr's new activity box labels with background gradients.
// @version     1.0
// @author      dzamie
// @include     https://www.tumblr.com/*
// @namespace   https://github.com/dzamie
// @license     GNU AGPL v3.0
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/466389/FollowMutual%20Activity%20Gradient.user.js
// @updateURL https://update.greasyfork.org/scripts/466389/FollowMutual%20Activity%20Gradient.meta.js
// ==/UserScript==


onlyMutuals = true;
hideLabels = true;
// default 1 sec load. increase if it takes a long time to load the activity box
delayms = 1000;

// dark mode
follcolor = "(26,74,35,1)";
mutucolor = "(59,50,98,1)";

// light mode
// follcolor = "(217,248,225,1)";
// mutucolor = "(235,231,255,1)";

const follstyle = `background-image: linear-gradient(to right, rgba(255,0,0,0), rgba${follcolor});`;
const mutustyle = `background-image: linear-gradient(to right, rgba(0,0,0,0), rgba${mutucolor});`;


// activate only when the activity box opens (or closes, but whatever)
const targetNode = document.getElementsByClassName("KTRcB")[6].children[0];
const config = { attributes: false, childList: true, subtree: false};

const callback = (mutationList, observer) => {
  
  setTimeout(function() {
    acts = document.getElementsByClassName("TZgeO");
    for(var i = 0; i < acts.length; i ++) {
      // marked following
      if(acts[i].getElementsByClassName("f4Y1Y").length > 0 && (! onlyMutuals)) {
        acts[i].children[0].style = follstyle;
      }
      // marked mutuals
      if(acts[i].getElementsByClassName("ZbEyz").length > 0) {
        acts[i].children[0].style = mutustyle;
      }
      // marked either
      if(acts[i].getElementsByClassName("AIdpH").length > 0 && hideLabels) {
        acts[i].getElementsByClassName("AIdpH")[0].style = "visibility: hidden";
      }
    }
  }, delayms);
};

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
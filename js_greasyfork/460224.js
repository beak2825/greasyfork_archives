// ==UserScript==
// @name          Acellus AutoSpeed
// @namespace     http://acellus.com/
// @include       *://*.acellus.com/*
// @grant         none
// @description An auto video speed for Acellus.
// @version 1.1.0
// @downloadURL https://update.greasyfork.org/scripts/460224/Acellus%20AutoSpeed.user.js
// @updateURL https://update.greasyfork.org/scripts/460224/Acellus%20AutoSpeed.meta.js
// ==/UserScript==
// Custom function to wait until the page is fully loaded before executing code to avoid acellus detecting this.
function waitForPageLoad(callback) {
  if (document.readyState === 'complete') {
    callback();
  } else {
    window.addEventListener('load', callback);
  }
}


waitForPageLoad(function() {
  var vids = document.getElementsByTagName("video");
 for (var i = 0; i < vids.length; i++) {
     vids[i].playbackRate = 1.5;
 }
});
// ==UserScript==
// @name        Fake HEVC support for Plex
// @author      lsl330
// @namespace   plex-hevc
// @version     1.0
// @copyright   lsl330
// @license     BSD-3-Clause
// @description Pretend to have HEVC codec.
// @include     /^https?://.*:32400/web.*
// @include     http://*:32400/web/index.html*
// @include     https://*:32400/web/index.html*
// @include     https://app.plex.tv/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/439243/Fake%20HEVC%20support%20for%20Plex.user.js
// @updateURL https://update.greasyfork.org/scripts/439243/Fake%20HEVC%20support%20for%20Plex.meta.js
// ==/UserScript==

var mse = window.MediaSource;

if (mse){
  // Set up replacement for MediaSource type support function
  var nativeITS = mse.isTypeSupported.bind(mse);
  mse.isTypeSupported = ourITS(nativeITS);
}

// Here's the replacement
function ourITS(fallback){
  // type is a string (hopefully!) sent by the page
  return function (type) {
    if (type === undefined) return '';
    //console.log('testing for: '+ type);

    // support HEVC
    if (type.toLowerCase().indexOf('hev1') > -1 ||
        type.toLowerCase().indexOf('hvc1') > -1 ||
        type.toLowerCase().indexOf('hvt1') > -1) return true;

    // Let Firefox handle everything else
    return fallback(type);
  };
}
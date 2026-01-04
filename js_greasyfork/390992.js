// ==UserScript==
// @name        Hide HDR support from YouTube
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @version     0.1
// @copyright   Copyright 2019 Jefferson Scher
// @license     BSD-3-Clause
// @description Hide HDR support for Firefox 69. v0.1 2019-10-10
// @match       https://www.youtube.com/*
// @match       https://www.youtube-nocookie.com/*
// @match       https://www.youtu.be/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/390992/Hide%20HDR%20support%20from%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/390992/Hide%20HDR%20support%20from%20YouTube.meta.js
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

    // Don't support HDR (current as of 10/10/2019)
    if (type.toLowerCase().indexOf('eotf=bt709') > -1 ||
        type.toLowerCase().indexOf('eotf=catavision') > -1) return '';

    // Uncomment to block all VP9 (if performance is bad)
    //if (type.toLowerCase().indexOf('vp9') > -1) return '';

    // Let Firefox handle everything else
    return fallback(type);
  };
}
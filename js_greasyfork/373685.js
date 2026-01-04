// ==UserScript==
// @name        Hide VP9 support from YouTube
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @version     0.2
// @copyright   Copyright 2019 Jefferson Scher
// @license     BSD-3-Clause
// @description Hide VP9 support for Firefox. v0.2 2019-12-20
// @match       https://www.youtube.com/*
// @match       https://www.youtube-nocookie.com/*
// @match       https://www.youtu.be/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/373685/Hide%20VP9%20support%20from%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/373685/Hide%20VP9%20support%20from%20YouTube.meta.js
// ==/UserScript==

// Modified from https://github.com/erkserkserks/h264ify/tree/master/src/inject as of 2018-05-16 (MIT license)

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
    // We only reject VP9
    if (type.toLowerCase().indexOf('vp9') > -1) return '';
    if (type.toLowerCase().indexOf('vp09') > -1) return ''; // Added 12/20/2019
    // Let Firefox handle everything else
    return fallback(type);
  };
}
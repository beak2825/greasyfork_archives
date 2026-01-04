// ==UserScript==
// @name        Fake HEVC support for Bilibili HDR Video
// @author      Jefferson "jscher2000" Scher, Ziyuan Guo
// @namespace   bilibili-hdr
// @version     0.1
// @copyright   Copyright 2019 Jefferson Scher, Copyright 2021 Ziyuan Guo
// @license     BSD-3-Clause
// @description Pretend to have HEVC codec.
// @match       https://www.bilibili.com/video/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/432799/Fake%20HEVC%20support%20for%20Bilibili%20HDR%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/432799/Fake%20HEVC%20support%20for%20Bilibili%20HDR%20Video.meta.js
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

// ==UserScript==
// @name         youtube ad remover
// @namespace    https://www.youtube.com/
// @version      0.1
// @author       Nan Li
// @description  hide over-the-video ads, auto click the 'skip ad' button, auto fast forward the ad video to the end
// @match        https://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408056/youtube%20ad%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/408056/youtube%20ad%20remover.meta.js
// ==/UserScript==

var style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode('.ytp-ad-image-overlay, .ytp-ad-overlay-slot {display: none;}'));
document.head.appendChild(style);

setInterval(() => {
  var skipBtn = document.querySelector('button.ytp-ad-skip-button');
  if (skipBtn) skipBtn.click();
  var ad = document.querySelector('.ytp-ad-player-overlay');
  if (ad) {
    var video = document.querySelector('video');
    if (video) video.currentTime = video.duration;
  }
}, 100);
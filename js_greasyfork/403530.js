// ==UserScript==
// @name         youtube ad
// @version      0.1
// @description  none
// @match        https://www.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/564131
// @downloadURL https://update.greasyfork.org/scripts/403530/youtube%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/403530/youtube%20ad.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.head.innerHTML += '<style>.branding-img {display: none !important;}.ytp-ad-overlay-slot {display: none !important;}</style>';
  var v;
  var i = setInterval(f, 100);
  function f() {
    v = document.querySelector('.video-stream');
    if (v) {
      clearInterval(i);
      v.addEventListener('playing', function () {
        if (document.querySelector('.ytp-ad-skip-button')) {
          console.log('skip');
          document.querySelector('.ytp-ad-skip-button').click();
        } else if (document.querySelector('.ytp-ad-preview-slot')) {
          console.log('end');
          v.currentTime = v.duration;
        }
      });
    }
  }
})();
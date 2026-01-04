// ==UserScript==
// @name         PugLife
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Replace all images on fetlife with pug images
// @author       reneklacan
// @match        http://tampermonkey.net/index.php?version=4.3.6&ext=dhdg&updated=true
// @grant        none
// @run-at document-start
// @include     https://fetlife.com/*
// @include     https://*.fetlife.com/*
// @downloadURL https://update.greasyfork.org/scripts/31338/PugLife.user.js
// @updateURL https://update.greasyfork.org/scripts/31338/PugLife.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var imgLink = "https://vetstreet.brightspotcdn.com/dims4/default/10dae76/2147483647/thumbnail/645x380/quality/90/?url=https%3A%2F%2Fvetstreet-brightspot.s3.amazonaws.com%2F3a%2F54%2F5ae8bfcc41b381c27a792e0dd891%2FAP-KWDHXS-645sm8113.jpg";
  setInterval(function() {
    document
    .querySelectorAll('img')
    .forEach(function(img) {
      if (img.src != imgLink) {
        img.src = imgLink;
      }
    });
  }, 200);
})();

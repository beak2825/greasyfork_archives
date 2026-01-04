// ==UserScript==
// @name         InkBunny fix Broken Thumbnails
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       Fuim
// @icon         https://www.google.com/s2/favicons?domain=inkbunny.net
// @description  Fixes broken thumbnails on InkBunny by replacing the image source with a corrected URL if the image fails to load.
// @match        https://inkbunny.net/*
// @run-at       document-end
// @license      GNU GPLv2
// @downloadURL https://update.greasyfork.org/scripts/470941/InkBunny%20fix%20Broken%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/470941/InkBunny%20fix%20Broken%20Thumbnails.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function fixBrokenThumbnails() {
    // Get all the image elements on the page
    var images = document.getElementsByTagName('img');
    // Loop through each image
    for (var i = 0; i < images.length; i++) {
      var img = images[i];
      if (img.src.includes('/preview/') && img.naturalWidth === 0) {
        img.onerror = function() {
          this.onerror = null;
          this.src = this.src.replace(".jpg", ".png");
          
        };
        // Create a new image element with the corrected URL
        img.src = img.src.replace("/preview/","/screen/");
      }
      if (img.src.includes('/thumbnails/medium/')  && img.naturalWidth === 0) {
        img.onerror = function() {
          this.onerror = null;
          this.src = this.src.replace(".jpg", ".png");
        };
        // Create a new image element with the corrected URL
        img.src = img.src.replace("br.ib.metapix.net", "br2.ib.metapix.net").replace("/thumbnails/medium/", "/files/screen/").replace("_noncustom", "")
      }
      if (img.src.includes('/usericons/small/')  && img.naturalWidth === 0) {
        img.onerror = function() {
          this.onerror = null;
          this.src = this.src.replace(".jpg", ".png");
        };
        // Create a new image element with the corrected URL
        img.src = img.src.replace("usericons/small", "usericons/large")
      }
    }
  }

  // Wait for the page and images to fully load
  window.addEventListener('load', function() {
    fixBrokenThumbnails();
  });
})();
// https://inkbunny.net/images80/elephant/logo/bunny.png
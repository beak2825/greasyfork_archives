// ==UserScript==
// @name         Link Images on Playstore
// @namespace    https://github.com/AbdurazaaqMohammed/userscripts
// @version      1.0.1
// @description  Open full page link of image when clicked on Google Play app pages
// @author       Abdurazaaq Mohammed
// @match        *://play.google.com/store/apps/*
// @grant        none
// @license      The Unlicense
// @homepage     https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL   https://github.com/AbdurazaaqMohammed/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/490031/Link%20Images%20on%20Playstore.user.js
// @updateURL https://update.greasyfork.org/scripts/490031/Link%20Images%20on%20Playstore.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const images = document.getElementsByTagName('img');

  for (var i = 0; i < images.length; i++) {
      images[i].addEventListener('click', function(e) {
          window.open(this.src.split('=')[0] + "=w2560-h1440-rw");
      });
  }
})();

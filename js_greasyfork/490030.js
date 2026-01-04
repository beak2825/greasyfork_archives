// ==UserScript==
// @name         Open F-Droid Images in New Tab
// @namespace    https://github.com/AbdurazaaqMohammed/userscripts
// @author       Abdurazaaq Mohammed
// @version      1.0
// @description  Open F-Droid images in a new tab when clicked
// @match        https://f-droid.org/*/packages/*
// @run-at       document-start
// @grant        none
// @license      The Unlicense
// @homepage     https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL   https://github.com/AbdurazaaqMohammed/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/490030/Open%20F-Droid%20Images%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/490030/Open%20F-Droid%20Images%20in%20New%20Tab.meta.js
// ==/UserScript==

(function() {
  'use strict';
    const images = document.querySelectorAll('.js_slide.screenshot');

    for (let i = 0; i < images.length; i++) {
      images[i].addEventListener('click', function(e) {
        e.preventDefault();
        window.open(this.querySelector('img').src, '_blank');
      });
    }
})();

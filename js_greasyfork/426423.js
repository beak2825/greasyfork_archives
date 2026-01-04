// ==UserScript==
// @name         Magic Actions Fix
// @version      1.0.0.0
// @description  A temporary fix for the Magic Buttons panel.
// @author       Magic Actions for YouTube™ https://www.mycinema.pro/
// @namespace    https://www.mycinema.pro/
// @homepage     https://www.mycinema.pro/
// @supportURL   https://www.mycinema.pro/support.html
// @include      https://www.youtube.com/watch?*
// @run-at       document-start
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426423/Magic%20Actions%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/426423/Magic%20Actions%20Fix.meta.js
// ==/UserScript==

(function() {
  'use strict';
  window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      var b=document.querySelector('#watch7-content span'),
      a=document.querySelector('ytd-video-primary-info-renderer'),
      c=a&&a.firstElementChild;b&&a&&c&&a.insertBefore(b,c);
    }, 1000);
  }, !!1);
})();
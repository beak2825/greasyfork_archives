// ==UserScript==
// @name         scrollToTop
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  scroll to top 
// @author
// @match        https://*/*
// @match        http://*/*

// @downloadURL https://update.greasyfork.org/scripts/425032/scrollToTop.user.js
// @updateURL https://update.greasyfork.org/scripts/425032/scrollToTop.meta.js
// ==/UserScript==

;(function () {
  'use strict';
   function createScript () {
    var scrollUpTop = document.createElement('div');
    scrollUpTop.id = 'wokooApp-MoveSearch-67961';
    document.body.appendChild(scrollUpTop);
    var verdor = document.createElement('script');
    verdor.src = 'http://localhost:8999/vendor.bundle.js';
    document.body.appendChild(verdor);
    var script = document.createElement('script');
    script.src = 'http://localhost:8999/main.bundle.js';
    document.body.appendChild(script);
  }
    createScript ();
})();
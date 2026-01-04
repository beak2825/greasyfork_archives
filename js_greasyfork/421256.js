// ==UserScript==
// @name         Fake Google Analytics Object
// @version      0.2
// @namespace    fake-ga-object
// @description  Replaces window.ga object with empty proxy. Prevent some website refusing to work due to missing Google Analytics
// @author       k3abird
// @include      *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/421256/Fake%20Google%20Analytics%20Object.user.js
// @updateURL https://update.greasyfork.org/scripts/421256/Fake%20Google%20Analytics%20Object.meta.js
// ==/UserScript==

(function() {
    'use strict';

  window.ga = new Proxy({}, {
    get(target, name) {
      return function(){};
    }
  })
})();
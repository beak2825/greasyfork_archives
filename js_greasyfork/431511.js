// ==UserScript==
// @name         Get Script
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Getting scripts in an easier way.
// @author       cc
// @include      *
// @downloadURL https://update.greasyfork.org/scripts/431511/Get%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/431511/Get%20Script.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var initialized = false;
  function initSecurity() {
    let meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Security-Policy');
    meta.setAttribute('content', 'upgrade-insecure-requests');
    document.head.appendChild(meta);
    initialized = true;
  }
  function getScript(url, callback) {
    if (url.startsWith('http:') && !initialized) {
      initSecurity();
    }
    let script = document.createElement('script');
    script.src = url;
    script.async='async';
    script.type='text/javascript';
    document.body.appendChild(script);
    if (typeof callback == 'function') {
      script.onload = callback;
    }
  }
  window.getScript = getScript;
})();
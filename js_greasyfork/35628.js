// ==UserScript==
// @description:en Script to disable popup opening on eurostreaming
// @name        VCrypt
// @namespace   vcrypt
// @include     http://*vcrypt.net/*
// @version     1
// @grant       none
// @run-at      document-start
// @description Script to disable popup opening on eurostreaming
// @downloadURL https://update.greasyfork.org/scripts/35628/VCrypt.user.js
// @updateURL https://update.greasyfork.org/scripts/35628/VCrypt.meta.js
// ==/UserScript==
(function(window) {
  var oldOpen = window.open;
  window.open = function() {
    console.log('Custom open');
    console.log(arguments);
    window.location = arguments[0];
    return null;
    // return oldOpen.apply(this, arguments);
  }
})(window);
// ==UserScript==
// @description:en Script to disable popup opening on eurostreaming
// @name        Eurostreaming
// @namespace   eurostreaming
// @include     https://*eurostreaming.*/*
// @version     2.1
// @grant       none
// @run-at      document-idle
// @description Script to disable popup opening on eurostreaming
// @downloadURL https://update.greasyfork.org/scripts/35435/Eurostreaming.user.js
// @updateURL https://update.greasyfork.org/scripts/35435/Eurostreaming.meta.js
// ==/UserScript==
(function(window) {
  console.log('Disabling click events on body...');
  jQuery('body').off('click');
  console.log('Click events on body disabled');
})(window);
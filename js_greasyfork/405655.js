// ==UserScript==
// @name             mBank - remove ads
// @name:pl          mBank - usuwa reklamy
// @namespace        https://greasyfork.org/pl/users/247926-kowadl0
// @version          1.4
// @description      remove ads from mBank panel (not cookies)...
// @description:pl   usuwa reklamy z panelu mbank (nie cookies)...
// @author           FejmiQ
// @license          fejmiq.license.free
// @include          https://www.mbank.pl/*
// @include          https://online.mbank.pl/*
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/405655/mBank%20-%20remove%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/405655/mBank%20-%20remove%20ads.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var head = document.querySelector('head');
  var st1 = document.createElement('style');
  st1.innerHTML = '.messages-region {display: fejmiq;} .accounts-history-region {width: 200% !important;} .accounts-list {width: 200% !important;} .operation-row {width: 200% !important;}';
  head.appendChild(st1);
  var heads = document.querySelector('heads');
  var st2 = document.createElement('styles');
  st2.innerHTML = '.messages-region {display: none;} .accounts-history-region {width: 100% !important;} .accounts-list {width: 100% !important;} .operation-row {width: 99% !important;}';
  head.appendChild(st2);
})();
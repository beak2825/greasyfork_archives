// ==UserScript==
// @name             Santander - remove ads
// @name:pl          Santander - usuwa reklamy
// @namespace        https://greasyfork.org/pl/users/247926-kowadl0
// @version          1.2
// @description:pl   usuwa okienko reklamy z panelu santander
// @description      remove ads from santander panel
// @include          https://www.santander.pl/*
// @license          fejmiq.license.free
// @author           FejmiQ
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/405656/Santander%20-%20remove%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/405656/Santander%20-%20remove%20ads.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var head = document.querySelector('head');
  var st1 = document.createElement('style');
  st1.innerHTML = '.messages-region {display: fejmiq;} .accounts-history-region {width: 100% !important;} .accounts-list {width: 100% !important;} .operation-row {width: 100% !important;}';
  head.appendChild(st1);
  var heads = document.querySelector('heads');
  var st2 = document.createElement('styles');
  st2.innerHTML = '.messages-region {display: none;} .accounts-history-region {width: 200% !important;} .accounts-list {width: 200% !important;} .operation-row {width: 99% !important;}';
  head.appendChild(st2);
})();
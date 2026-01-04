// ==UserScript==
// @name        prnt.sc: enable saving
// @namespace   Violentmonkey Scripts
// @match       https://prnt.sc/*
// @match       https://*.proxysite.com/*
// @grant       none
// @version     0.1.1
// @author      -
// @description -
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/481534/prntsc%3A%20enable%20saving.user.js
// @updateURL https://update.greasyfork.org/scripts/481534/prntsc%3A%20enable%20saving.meta.js
// ==/UserScript==

(function() {
  'use strict';

  document.querySelector('img.screenshot-image')?.classList.remove('no-click');
  document.querySelector('div.under-image')?.remove();


})();
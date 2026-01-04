// ==UserScript==
// @name        UnBlur
// @namespace   pwa
// @license     MIT
// @match       https://*.posten.no/*
// @icon https://posten.no/favicon.ico
// @grant       none
// @version     1.0
// @author      pwa
// @description 6/14/2023, 4:57:30 PM
// @downloadURL https://update.greasyfork.org/scripts/468656/UnBlur.user.js
// @updateURL https://update.greasyfork.org/scripts/468656/UnBlur.meta.js
// ==/UserScript==


window.addEventListener('load', function() {
  let nag = document.getElementById('"hw-block--mb-medium-2"');
  nag.setAttribute('hidden', true);
});
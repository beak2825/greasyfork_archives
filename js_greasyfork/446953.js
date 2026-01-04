// ==UserScript==
// @name     Google Search Results Loader/AutoClicker 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       You
// @include       *google.*
// @description  It automatically clicks on a button
// @grant    GM_addStyle
// @run-at  document-start
// @downloadURL https://update.greasyfork.org/scripts/446953/Google%20Search%20Results%20LoaderAutoClicker.user.js
// @updateURL https://update.greasyfork.org/scripts/446953/Google%20Search%20Results%20LoaderAutoClicker.meta.js
// ==/UserScript==

window.onscroll = function(ev) {
  if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
   document.querySelectorAll('.mye4qd, .YstHxe, .r0zKGf').forEach(function(el) { el.click();});
  }};
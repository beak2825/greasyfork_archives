// ==UserScript==
// @name     Mangaplus Key Shortcut Fix
// @description Mangaplus only allowed up and down arrows, this re-enables things like reloading that it was blocking.
// @version  2
// @grant    unsafeWindow
// @include  http://mangaplus.shueisha.co.jp/*
// @include  https://mangaplus.shueisha.co.jp/*
// @run-at	 document-start
// @namespace https://greasyfork.org/users/692676
// @downloadURL https://update.greasyfork.org/scripts/412521/Mangaplus%20Key%20Shortcut%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/412521/Mangaplus%20Key%20Shortcut%20Fix.meta.js
// ==/UserScript==

window.addEventListener('keydown', function (event) {
  switch (event.key) {
    case 'ArrowDown':
      break;
    case 'ArrowTop':
      break;
    default:
      event.stopPropagation();    
  }
}, true);

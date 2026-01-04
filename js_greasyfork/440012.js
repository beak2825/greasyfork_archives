// ==UserScript==
// @name     Fix blurry Google Docs
// @description Fix blurry Google Docs rendering on Firefox when privacy.resistFingerprinting is turned on.
// @version  1
// @include	 *://docs.google.com/*
// @grant    none
// @run-at   document-start
// @license  WTFPL
// @namespace https://greasyfork.org/users/6660
// @downloadURL https://update.greasyfork.org/scripts/440012/Fix%20blurry%20Google%20Docs.user.js
// @updateURL https://update.greasyfork.org/scripts/440012/Fix%20blurry%20Google%20Docs.meta.js
// ==/UserScript==

if (!window.location.search.includes("mode=html")) {
  if (window.location.search.startsWith('?')) {
    window.location.search += '&mode=html'
  } else {
    window.location.search += '?mode=html'
  }
}

